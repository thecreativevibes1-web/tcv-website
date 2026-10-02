create table if not exists public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  submission_key text not null unique,
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  company text check (company is null or char_length(trim(company)) <= 160),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$'),
  what_building text not null check (char_length(trim(what_building)) between 10 and 4000),
  project_type text not null,
  budget_range text not null,
  timeline text not null,
  goals text not null check (char_length(trim(goals)) between 10 and 4000),
  additional_details text check (additional_details is null or char_length(trim(additional_details)) <= 8000),
  source text not null default 'website_project_brief',
  qualification_score numeric(5,2) not null default 0,
  qualification_band text not null default 'medium',
  recommended_offer text,
  lead_status text not null default 'new',
  pipeline_stage text not null default 'brief_received',
  notification_status text not null default 'pending',
  notification_sent_at timestamptz,
  lead_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  constraint project_briefs_project_type_check check (project_type in ('Website / App','AI System','Software / SaaS','Brand / Experience','Growth / Revenue System','Not sure yet')),
  constraint project_briefs_budget_range_check check (budget_range in ('Under ₹50k','₹50k – ₹1L','₹1L – ₹3L','₹3L – ₹10L','₹10L+','Not sure yet')),
  constraint project_briefs_timeline_check check (timeline in ('ASAP','2–4 weeks','1–2 months','2–3 months','3+ months','Flexible'))
);

create index if not exists project_briefs_created_at_idx on public.project_briefs (created_at desc);
create index if not exists project_briefs_pipeline_stage_idx on public.project_briefs (pipeline_stage);
create index if not exists project_briefs_qualification_band_idx on public.project_briefs (qualification_band);

alter table public.project_briefs enable row level security;

revoke select, update, delete on table public.project_briefs from anon, authenticated;
grant insert on table public.project_briefs to anon, authenticated;
grant select, insert, update, delete on table public.project_briefs to service_role;

drop policy if exists "public can submit project briefs" on public.project_briefs;
create policy "public can submit project briefs"
on public.project_briefs for insert to anon, authenticated
with check (
  source = 'website_project_brief'
  and lead_status = 'new'
  and pipeline_stage = 'brief_received'
  and notification_status = 'pending'
);

create schema if not exists private;

create or replace function private.sync_project_brief_to_lead()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_workspace_id uuid;
  v_lead_id uuid;
  v_stage text;
  v_temperature text;
begin
  select id into v_workspace_id from public.workspaces order by created_at asc limit 1;
  if v_workspace_id is null then return new; end if;

  v_stage := case
    when new.qualification_band = 'high' then 'Qualified'
    when new.qualification_band = 'medium' then 'Lead'
    else 'Nurture'
  end;

  v_temperature := case
    when new.qualification_band = 'high' then 'hot'
    when new.qualification_band = 'medium' then 'warm'
    else 'cold'
  end;

  insert into public.leads (
    workspace_id, company_name, contact_name, email, source, industry,
    fit_score, pain_score, intent_score, opportunity_score, temperature,
    status, stage, recommended_offer, intelligence, tags
  ) values (
    v_workspace_id,
    coalesce(nullif(trim(new.company), ''), new.name),
    new.name,
    lower(trim(new.email)),
    'new_creation_hubs_website',
    new.project_type,
    round(new.qualification_score * 0.25, 2),
    round(new.qualification_score * 0.25, 2),
    round(new.qualification_score * 0.30, 2),
    round(new.qualification_score, 2),
    v_temperature,
    'new',
    v_stage,
    new.recommended_offer,
    jsonb_build_object(
      'project_brief_id', new.id,
      'what_building', new.what_building,
      'goals', new.goals,
      'budget_range', new.budget_range,
      'timeline', new.timeline,
      'additional_details', coalesce(new.additional_details, ''),
      'qualification_band', new.qualification_band
    ),
    jsonb_build_array('website-intake','project-brief',lower(replace(new.project_type, ' ', '-')))
  )
  returning id into v_lead_id;

  update public.project_briefs
  set lead_id = v_lead_id, lead_status = 'new', pipeline_stage = 'lead_created'
  where id = new.id;

  return new;
end;
$$;

revoke all on function private.sync_project_brief_to_lead() from public, anon, authenticated;

drop trigger if exists trg_sync_project_brief_to_lead on public.project_briefs;
create trigger trg_sync_project_brief_to_lead
after insert on public.project_briefs
for each row execute function private.sync_project_brief_to_lead();

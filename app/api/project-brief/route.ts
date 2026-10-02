'use server'
import { NextRequest,NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PROJECT_TYPES=['Website / App','AI System','Software / SaaS','Brand / Experience','Growth / Revenue System','Not sure yet']
const BUDGETS=['Under ₹50k','₹50k – ₹1L','₹1L – ₹3L','₹3L – ₹10L','₹10L+','Not sure yet']
const TIMELINES=['ASAP','2–4 weeks','1–2 months','2–3 months','3+ months','Flexible']

function clean(value:unknown,max:number){return typeof value==='string'?value.trim().slice(0,max):''}
function emailOk(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]||char))}
function scoreBrief(input:{company:string;what_building:string;project_type:string;budget_range:string;timeline:string;goals:string;additional_details:string;email:string}){
  let score=0
  score+=input.company?5:0
  score+=PROJECT_TYPES.includes(input.project_type)?10:5
  score+=input.what_building.length>=120?15:10
  score+=input.goals.length>=120?15:10
  score+=input.additional_details.length>=80?5:0
  score+=input.email?5:0
  score+=({['Under ₹50k']:8,['₹50k – ₹1L']:15,['₹1L – ₹3L']:22,['₹3L – ₹10L']:30,['₹10L+']:38,['Not sure yet']:14} as Record<string,number>)[input.budget_range]||0
  score+=({ASAP:15,['2–4 weeks']:13,['1–2 months']:11,['2–3 months']:9,['3+ months']:6,Flexible:7} as Record<string,number>)[input.timeline]||0
  const band=score>=72?'high':score>=52?'medium':'low'
  return {score:Math.min(100,score),band}
}

function serverClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY
  const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if(!url||(!serviceKey&&!publicKey))throw new Error('Supabase is not configured')
  return {client:createClient(url,serviceKey||publicKey!),privileged:Boolean(serviceKey)}
}

async function sendNotification(brief:{reference:string;name:string;company:string;email:string;what_building:string;project_type:string;budget_range:string;timeline:string;goals:string;additional_details:string;score:number;band:string}){
  const apiKey=process.env.RESEND_API_KEY
  const from=process.env.RESEND_FROM_EMAIL
  const to=process.env.PROJECT_BRIEF_NOTIFICATION_EMAIL
  if(!apiKey||!from||!to)return false
  const subject='New NCH Project Brief — '+brief.reference+' — '+brief.project_type
  const html='<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>New Creation Hubs — Project Brief</h2><p><strong>Reference:</strong> '+escapeHtml(brief.reference)+'</p><p><strong>Qualification:</strong> '+brief.band.toUpperCase()+' / '+brief.score+'</p><hr/><p><strong>Name:</strong> '+escapeHtml(brief.name)+'</p><p><strong>Company:</strong> '+escapeHtml(brief.company||'Not specified')+'</p><p><strong>Email:</strong> '+escapeHtml(brief.email)+'</p><p><strong>Project:</strong> '+escapeHtml(brief.project_type)+'</p><p><strong>Budget:</strong> '+escapeHtml(brief.budget_range)+'</p><p><strong>Timeline:</strong> '+escapeHtml(brief.timeline)+'</p><h3>What they are building</h3><p>'+escapeHtml(brief.what_building)+'</p><h3>Goals</h3><p>'+escapeHtml(brief.goals)+'</p><h3>Additional details</h3><p>'+escapeHtml(brief.additional_details||'None')+'</p></div>'
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject,html,reply_to:brief.email})})
  return response.ok
}

export async function POST(request:NextRequest){
  const origin=request.headers.get('origin')
  const requestOrigin=new URL(request.url).origin
  const configuredOrigin=process.env.NEXT_PUBLIC_SITE_URL?new URL(process.env.NEXT_PUBLIC_SITE_URL).origin:requestOrigin
  if(origin&&origin!==requestOrigin&&origin!==configuredOrigin)return NextResponse.json({error:'Request origin rejected.'},{status:403})

  try{
    const body=await request.json()
    if(clean(body.website,120))return NextResponse.json({ok:true,reference:'NCH-BRIEF'})
    const input={
      name:clean(body.name,120),
      company:clean(body.company,160),
      email:clean(body.email,180).toLowerCase(),
      what_building:clean(body.what_building,4000),
      project_type:clean(body.project_type,80),
      budget_range:clean(body.budget_range,80),
      timeline:clean(body.timeline,80),
      goals:clean(body.goals,4000),
      additional_details:clean(body.additional_details,8000)
    }
    if(input.name.length<2||!emailOk(input.email)||input.what_building.length<10||input.goals.length<10)return NextResponse.json({error:'Please complete the required project details.'},{status:400})
    if(!PROJECT_TYPES.includes(input.project_type)||!BUDGETS.includes(input.budget_range)||!TIMELINES.includes(input.timeline))return NextResponse.json({error:'One of the selected project parameters is invalid.'},{status:400})

    const qualification=scoreBrief(input)
    const submissionKey='nch_'+crypto.randomUUID()
    const {client,privileged}=serverClient()
    const {error}=await client.from('project_briefs').insert([{...input,submission_key:submissionKey,qualification_score:qualification.score,qualification_band:qualification.band,recommended_offer:input.project_type,lead_status:'new',pipeline_stage:'brief_received',notification_status:'pending',metadata:{page:'new-creation-hubs',user_agent:request.headers.get('user-agent')||''}}])
    if(error)throw error

    const reference='NCH-'+submissionKey.slice(-8).toUpperCase()
    let notificationSent=false
    try{notificationSent=await sendNotification({...input,reference,score:qualification.score,band:qualification.band})}catch(notificationError){console.error('[ProjectBrief] Notification error',notificationError)}
    if(notificationSent&&privileged){
      await client.from('project_briefs').update({notification_status:'sent',notification_sent_at:new Date().toISOString()}).eq('submission_key',submissionKey)
    }
    return NextResponse.json({ok:true,reference,qualification:qualification.band,notificationQueued:Boolean(process.env.RESEND_API_KEY&&process.env.PROJECT_BRIEF_NOTIFICATION_EMAIL),notificationSent},{status:201})
  }catch(error){
    console.error('[ProjectBrief] Submission failed',error)
    return NextResponse.json({error:'We could not route the brief right now. Please try again.'},{status:500})
  }
}

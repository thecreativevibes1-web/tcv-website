'use client'
import { AnimatePresence,motion } from 'framer-motion'
import { ArrowLeft,ArrowRight,Check,Loader2,Mail,Send,ShieldCheck } from 'lucide-react'
import { FormEvent,useMemo,useState } from 'react'

type FormState={
  name:string
  company:string
  email:string
  what_building:string
  project_type:string
  budget_range:string
  timeline:string
  goals:string
  additional_details:string
  website:string
}

const initialForm:FormState={name:'',company:'',email:'',what_building:'',project_type:'',budget_range:'',timeline:'',goals:'',additional_details:'',website:''}

const steps:Array<{id:string;label:string;fields:(keyof FormState)[]}>= [
  {id:'about',label:'ABOUT YOU',fields:['name','company','email']},
  {id:'idea',label:'THE IDEA',fields:['what_building','goals']},
  {id:'build',label:'WHAT NEEDS TO BE BUILT',fields:['project_type']},
  {id:'parameters',label:'PROJECT PARAMETERS',fields:['budget_range','timeline']},
  {id:'start',label:'START CREATION',fields:[]}
]

const optionSets={
  project_type:['Website / App','AI System','Software / SaaS','Brand / Experience','Growth / Revenue System','Not sure yet'],
  budget_range:['Under ₹50k','₹50k – ₹1L','₹1L – ₹3L','₹3L – ₹10L','₹10L+','Not sure yet'],
  timeline:['ASAP','2–4 weeks','1–2 months','2–3 months','3+ months','Flexible']
}

function FieldLabel({number,title,copy}:{number:string;title:string;copy?:string}){return <div className="brief-field-head"><span>{number}</span><div><b>{title}</b>{copy&&<small>{copy}</small>}</div></div>}

export function ProjectBriefEngine(){
  const [step,setStep]=useState(0)
  const [form,setForm]=useState<FormState>(initialForm)
  const [submitting,setSubmitting]=useState(false)
  const [submitted,setSubmitted]=useState(false)
  const [reference,setReference]=useState('')
  const [error,setError]=useState('')
  const [touched,setTouched]=useState<Record<string,boolean>>({})
  const update=(key:keyof FormState,value:string)=>setForm(current=>({...current,[key]:value}))
  const mark=(key:keyof FormState)=>setTouched(current=>({...current,[key]:true}))
  const stepValid=useMemo(()=>steps[step].fields.every(field=>form[field].trim().length>0),[step,form])
  const emailValid=/^[^s@]+@[^s@]+.[^s@]+$/.test(form.email.trim())
  const canAdvance=step===0?stepValid&&emailValid:stepValid
  const progress=((step+1)/steps.length)*100

  const submit=async(e:FormEvent)=>{
    e.preventDefault()
    if(step<steps.length-1){
      if(canAdvance)setStep(current=>current+1)
      else steps[step].fields.forEach(field=>mark(field))
      return
    }
    if(submitting||submitted)return
    setSubmitting(true);setError('')
    try{
      const response=await fetch('/api/project-brief',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const data=await response.json().catch(()=>({}))
      if(!response.ok)throw new Error(data?.error||'We could not receive the brief. Please try again.')
      setReference(data.reference||'NCH-BRIEF')
      setSubmitted(true)
    }catch(err){setError(err instanceof Error?err.message:'Something went wrong. Please try again.')}
    finally{setSubmitting(false)}
  }

  return <section id="contact" data-motion-section data-motion-id="contact" className="brief-stage" aria-labelledby="brief-title">
    <div className="shell brief-shell">
      <div className="brief-top">
        <div><p className="eyebrow">11 / CONVERSION / PROJECT BRIEF ENGINE</p><h2 id="brief-title">START<br/><span>CREATION.</span></h2></div>
        <div className="brief-intro-copy"><span>ONE BRIEF. ONE CLEARER START.</span><p>Tell us what you are building. We qualify the opportunity, route it into the right offer and create a structured lead for the next conversation.</p></div>
      </div>

      <div className="brief-progress" aria-label="Project brief progress">
        <div className="brief-progress-line"><i style={{width:progress+'%'}}/></div>
        <div className="brief-step-map">{steps.map((item,index)=><button key={item.id} type="button" onClick={()=>index<=step&&setStep(index)} className={index===step?'active':''} aria-current={index===step?'step':undefined}><span>0{index+1}</span>{item.label}</button>)}</div>
      </div>

      {submitted?<motion.div className="brief-success" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}>
        <div className="brief-success-mark"><Check size={28}/></div>
        <p className="eyebrow">CREATION BRIEF RECEIVED</p>
        <h3>WE HAVE THE SIGNAL.</h3>
        <p>Your brief has been captured and routed into the project intake pipeline.</p>
        <div className="brief-success-meta"><span>REFERENCE <b>{reference}</b></span><span>STATUS <b>LEAD CREATED</b></span><span>ROUTE <b>{form.project_type||'DISCOVERY'}</b></span></div>
        <button className="brief-secondary" type="button" onClick={()=>{setSubmitted(false);setForm(initialForm);setStep(0);setTouched({})}}>START ANOTHER BRIEF <ArrowRight size={14}/></button>
      </motion.div>:<form className="brief-form" onSubmit={submit} noValidate>
        <AnimatePresence mode="wait">
          {step===0&&<motion.div key="about" className="brief-panel" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}>
            <FieldLabel number="01 / ABOUT YOU" title="WHO ARE WE BUILDING WITH?" copy="Give us the person and business context."/>
            <div className="brief-grid-two">
              <label className={touched.name&&!form.name?'invalid':''}><span>NAME *</span><input value={form.name} onChange={e=>update('name',e.target.value)} onBlur={()=>mark('name')} placeholder="Your name" autoFocus/></label>
              <label><span>COMPANY</span><input value={form.company} onChange={e=>update('company',e.target.value)} placeholder="Company / brand"/></label>
            </div>
            <label className={touched.email&&(!form.email||!emailValid)?'invalid':''}><span>EMAIL *</span><div className="brief-input-icon"><Mail size={16}/><input type="email" value={form.email} onChange={e=>update('email',e.target.value)} onBlur={()=>mark('email')} placeholder="you@company.com"/></div></label>
          </motion.div>}

          {step===1&&<motion.div key="idea" className="brief-panel" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}>
            <FieldLabel number="02 / THE IDEA" title="WHAT ARE YOU BUILDING?" copy="We care about the ambition before the deliverables."/>
            <label className={touched.what_building&&!form.what_building?'invalid':''}><span>WHAT ARE YOU BUILDING? *</span><textarea value={form.what_building} onChange={e=>update('what_building',e.target.value)} onBlur={()=>mark('what_building')} placeholder="What exists today, what needs to change, and why now?"/></label>
            <label className={touched.goals&&!form.goals?'invalid':''}><span>GOALS *</span><textarea value={form.goals} onChange={e=>update('goals',e.target.value)} onBlur={()=>mark('goals')} placeholder="What would a successful outcome look like?"/></label>
          </motion.div>}

          {step===2&&<motion.div key="build" className="brief-panel" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}>
            <FieldLabel number="03 / WHAT NEEDS TO BE BUILT" title="CHOOSE THE CREATION LAYER." copy="Pick the closest route. We can refine the scope together."/>
            <div className="brief-choice-grid">{optionSets.project_type.map(option=><button type="button" key={option} className={form.project_type===option?'selected':''} onClick={()=>update('project_type',option)}><span>{String(optionSets.project_type.indexOf(option)+1).padStart(2,'0')}</span><b>{option}</b><ArrowRight size={15}/></button>)}</div>
          </motion.div>}

          {step===3&&<motion.div key="parameters" className="brief-panel" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}>
            <FieldLabel number="04 / PROJECT PARAMETERS" title="GIVE THE PROJECT A FRAME." copy="Budget and timing help us route the brief to the right path."/>
            <div className="brief-select-block"><span>BUDGET RANGE *</span><div className="brief-choice-grid compact">{optionSets.budget_range.map(option=><button type="button" key={option} className={form.budget_range===option?'selected':''} onClick={()=>update('budget_range',option)}><b>{option}</b><Check size={14}/></button>)}</div></div>
            <div className="brief-select-block"><span>TIMELINE *</span><div className="brief-choice-grid compact">{optionSets.timeline.map(option=><button type="button" key={option} className={form.timeline===option?'selected':''} onClick={()=>update('timeline',option)}><b>{option}</b><Check size={14}/></button>)}</div></div>
            <label><span>ADDITIONAL DETAILS</span><textarea value={form.additional_details} onChange={e=>update('additional_details',e.target.value)} placeholder="Links, constraints, references, existing stack, stakeholders…"/></label>
          </motion.div>}

          {step===4&&<motion.div key="start" className="brief-panel brief-review" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}>
            <FieldLabel number="05 / START CREATION" title="READY TO SEND THE SIGNAL?" copy="We will qualify the brief, create the lead and route it into the project pipeline."/>
            <div className="brief-review-grid">
              <div><span>CONTACT</span><b>{form.name}</b><small>{form.company||'Independent / not specified'} · {form.email}</small></div>
              <div><span>BUILD</span><b>{form.project_type}</b><small>{form.what_building}</small></div>
              <div><span>PARAMETERS</span><b>{form.budget_range} · {form.timeline}</b><small>{form.goals}</small></div>
              <div><span>DETAILS</span><p>{form.additional_details||'No additional details supplied.'}</p></div>
            </div>
            <input className="brief-honeypot" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>update('website',e.target.value)} aria-hidden="true"/>
            <div className="brief-consent"><ShieldCheck size={15}/><span>Your details are used to assess the project and manage the resulting business inquiry. We do not display this information publicly.</span></div>
          </motion.div>}
        </AnimatePresence>

        <div className="brief-actions">
          <button type="button" className="brief-secondary" onClick={()=>setStep(current=>Math.max(0,current-1))} disabled={step===0||submitting}><ArrowLeft size={15}/> BACK</button>
          {step<steps.length-1?<button type="submit" className="brief-primary" disabled={!canAdvance}>CONTINUE <ArrowRight size={15}/></button>:<button type="submit" className="brief-primary" disabled={submitting}>{submitting?<><Loader2 size={15} className="spin"/> ROUTING BRIEF…</>:<>START CREATION <Send size={15}/></>}</button>}
        </div>
        {error&&<p className="brief-error" role="alert">{error}</p>}
      </form>}

      {!submitted&&<div className="brief-footer"><span>NEW CREATION HUBS / INTAKE SYSTEM</span><span>{String(step+1).padStart(2,'0')} / 05</span></div>}
    </div>
  </section>
}
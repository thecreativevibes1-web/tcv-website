'use client'
import { AnimatePresence,motion } from 'framer-motion'
import { ArrowUpRight,Check,MoveRight } from 'lucide-react'
import { useEffect,useMemo,useRef,type CSSProperties } from 'react'
import { MagneticButton } from '@/components/experience/ExperienceMotion'

export type OfferService = {
  number:string; slug:string; title:string; strap:string; description:string
  what:string[]; who:string[]; deliverables:string[]; process:string[]; cta:string
}

const OFFER_SERVICES:OfferService[]=[
 {number:'01',slug:'web',title:'WEB / APP',strap:'BUILD THE DIGITAL LAYER OF YOUR BUSINESS.',description:'Premium digital products engineered around the way customers actually move through your business.',what:['Premium business websites','High-conversion landing pages','Web applications','Dashboards & portals','Digital platforms','Interactive / 3D experiences'],who:['Founders launching','Businesses upgrading','Startups building','Product teams scaling'],deliverables:['Information architecture','UX / UI system','Frontend engineering','Backend & API integration','Authentication & analytics','QA, deployment & optimization'],process:['DISCOVER','DESIGN','BUILD','TEST','LAUNCH','OPTIMIZE'],cta:'BUILD MY DIGITAL PRODUCT'},
 {number:'02',slug:'ai',title:'AI / INTELLIGENCE',strap:'TURN AI INTO AN OPERATING LAYER.',description:'Practical AI systems that automate work, connect knowledge and accelerate decisions.',what:['AI agents','AI automation','Internal copilots','RAG systems','AI workflows','Research & support agents'],who:['Teams automating operations','Businesses with knowledge silos','Products adding intelligence','Founders building proprietary AI'],deliverables:['AI architecture','Agent workflows','LLM integration','RAG / knowledge layer','Tool calling & APIs','Guardrails, monitoring & approval'],process:['MAP','ARCHITECT','CONNECT','AUTOMATE','TEST','DEPLOY'],cta:'BUILD AN AI SYSTEM'},
 {number:'03',slug:'software',title:'SOFTWARE / SAAS',strap:'BUILD SOFTWARE THAT BECOMES INFRASTRUCTURE.',description:'From focused MVPs to scalable SaaS platforms, we engineer the product foundation behind real businesses.',what:['MVP development','SaaS platforms','Business software','Internal operating systems','Multi-tenant products','API-driven infrastructure'],who:['Founders validating','Startups building SaaS','Businesses replacing manual work','Teams creating proprietary tools'],deliverables:['Product architecture','Database design','Auth & permissions','Backend / APIs','Admin & billing systems','Analytics & deployment'],process:['IDEA','ARCHITECTURE','MVP','VALIDATION','SCALE'],cta:'BUILD MY SOFTWARE'},
 {number:'04',slug:'brand',title:'BRAND / EXPERIENCE',strap:'MAKE THE BUSINESS RECOGNIZABLE BEFORE IT IS EXPLAINED.',description:'Identity and digital experience systems that give brands a distinct visual language across every touchpoint.',what:['Brand identity','Visual systems','Art direction','UI & design systems','Motion language','Digital brand experiences'],who:['New companies','Rebrands','Technology startups','Product companies','Founders building premium brands'],deliverables:['Brand strategy','Visual identity','Typography & color','Art direction','UI system & tokens','Motion, templates & guidelines'],process:['DISCOVER','DEFINE','CREATE','SYSTEMIZE','DEPLOY'],cta:'BUILD MY BRAND'},
 {number:'05',slug:'growth',title:'GROWTH / REVENUE SYSTEMS',strap:'TURN ATTENTION INTO A REPEATABLE GROWTH ENGINE.',description:'Acquisition, content, lead generation, automation and conversion connected around measurable business activity.',what:['Marketing systems','Lead generation','Content engines','CRM workflows','Outreach systems','Revenue operations'],who:['Businesses needing pipeline','Teams improving sales workflows','Founders building acquisition','Companies automating follow-up'],deliverables:['Growth strategy & ICP','Lead systems','CRM / outreach workflows','Content infrastructure','Automation & lead scoring','Conversion tracking & reporting'],process:['RESEARCH','POSITION','ATTRACT','CAPTURE','CONVERT','OPTIMIZE'],cta:'BUILD MY GROWTH SYSTEM'}
]

function ServiceVisual({service}:{service:OfferService}){
  return <div className={`offer-visual offer-visual--${service.slug}`}>
    <div className="offer-visual__grid"/>
    <div className="offer-visual__scan"/>
    <div className="offer-visual__meta"><span>OFFER ENGINE</span><b>{service.number} / 05</b></div>
    <div className="offer-visual__core">
      {service.slug==='web'&&<div className="visual-browser"><div className="visual-browser__bar"><i/><i/><i/></div><div className="visual-browser__body"><span/><b/><em/><div><i/><i/><i/></div></div></div>}
      {service.slug==='ai'&&<div className="visual-network"><i/><i/><i/><i/><i/><b>AI</b></div>}
      {service.slug==='software'&&<div className="visual-modules">{['AUTH','API','DATA','BILLING','CORE','ADMIN'].map((x,i)=><span key={x} style={{'--i':i} as CSSProperties}>{x}<small>0{i+1}</small></span>)}</div>}
      {service.slug==='brand'&&<div className="visual-brand"><span>NCH</span><b>IDENTITY</b><em>FORM / STORY / MOTION</em><i/></div>}
      {service.slug==='growth'&&<div className="visual-growth"><span/><span/><span/><span/><span/><b>GROW</b><i/></div>}
    </div>
    <div className="offer-visual__footer"><span>WHAT → WHO → BUILD → OUTCOME</span><MoveRight size={15}/></div>
  </div>
}

export function ServicesOfferEngine({activeService,onServiceChange,go}:{activeService:number;onServiceChange:(index:number)=>void;go:(id:string)=>void}){
  const rootRef=useRef<HTMLElement>(null)
  const safeIndex=Math.min(Math.max(activeService,0),OFFER_SERVICES.length-1)
  const active=OFFER_SERVICES[safeIndex]
  const cards=useMemo(()=>OFFER_SERVICES.map((item,index)=>({item,index})),[])
  useEffect(()=>{const root=rootRef.current;if(!root)return;const nodes=Array.from(root.querySelectorAll<HTMLElement>('[data-service-card]'));const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const index=Number((visible.target as HTMLElement).dataset.serviceIndex||0);onServiceChange(index)},{rootMargin:'-30% 0px -50% 0px',threshold:[0,.2,.5,.8,1]});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[onServiceChange])
  return <section ref={rootRef} id="services" data-motion-section data-motion-id="services" className="offer-engine">
    <div className="shell offer-engine__shell">
      <header className="offer-engine__intro">
        <div><p className="eyebrow">05 / SERVICES / OFFER ENGINE</p><h2>WHAT CAN WE<br/><span>BUILD FOR YOU?</span></h2></div>
        <p>Five disciplines. One integrated studio.<br/>Concrete offers for the next system your business needs.</p>
      </header>
      <div className="offer-engine__body">
        <div className="offer-engine__sticky">
          <div className="offer-engine__sticky-top"><span>ACTIVE OFFER</span><b>{active.number} / 05</b></div>
          <AnimatePresence mode="wait">
            <motion.div key={active.slug} className="offer-engine__active" initial={{opacity:0,y:24,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-18,filter:'blur(8px)'}} transition={{duration:.45,ease:[.16,1,.3,1]}}>
              <ServiceVisual service={active}/>
              <div className="offer-engine__active-copy"><p>{active.strap}</p><h3>{active.title}</h3><span>{active.description}</span></div>
            </motion.div>
          </AnimatePresence>
          <div className="offer-engine__progress"><i style={{transform:`scaleX(${(safeIndex+1)/OFFER_SERVICES.length})`}}/><span>01—05 / CONTINUOUS SYSTEM</span></div>
        </div>
        <div className="offer-engine__rail">
          {cards.map(({item,index})=><article key={item.slug} data-service-card data-service-index={index} className={`offer-card ${safeIndex===index?'is-active':''}`}>
            <button className="offer-card__trigger" onMouseEnter={()=>onServiceChange(index)} onFocus={()=>onServiceChange(index)} onClick={()=>onServiceChange(index)} aria-expanded={safeIndex===index}>
              <span className="offer-card__number">{item.number}</span><div><b>{item.title}</b><em>{item.strap}</em></div><ArrowUpRight className="offer-card__arrow" size={18}/>
            </button>
            <AnimatePresence initial={false}>
              {safeIndex===index&&<motion.div className="offer-card__details" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.38,ease:[.16,1,.3,1]}}>
                <div className="offer-detail offer-detail--what"><span>WHAT</span><div>{item.what.map(x=><b key={x}>{x}</b>)}</div></div>
                <div className="offer-detail"><span>WHO</span><div>{item.who.map(x=><b key={x}>{x}</b>)}</div></div>
                <div className="offer-detail"><span>DELIVERABLES</span><div>{item.deliverables.map(x=><b key={x}><Check size={12}/>{x}</b>)}</div></div>
                <div className="offer-detail offer-detail--process"><span>PROCESS</span><div>{item.process.map((x,i)=><b key={x}><small>0{i+1}</small>{x}</b>)}</div></div>
                <div className="offer-card__cta"><span>READY WHEN THE SCOPE IS CLEAR.</span><MagneticButton className="is-quiet" onClick={()=>go('contact')}>{item.cta} <ArrowUpRight size={14}/></MagneticButton></div>
              </motion.div>}
            </AnimatePresence>
          </article>)}
        </div>
      </div>
      <div className="offer-engine__final"><div><span>THE NEXT SYSTEM</span><h3>STARTS HERE.</h3><p>Tell us what you are trying to build, improve or automate. We turn the ambition into a clear execution path.</p></div><div className="offer-engine__final-actions"><MagneticButton onClick={()=>go('contact')}>START A PROJECT <ArrowUpRight size={15}/></MagneticButton><button onClick={()=>go('work')}>VIEW OUR WORK <ArrowUpRight size={14}/></button></div></div>
    </div>
  </section>
}
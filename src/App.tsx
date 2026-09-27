import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, FileSignature, Plus, Users, Wallet, X, AlertTriangle, Menu, MoreHorizontal } from 'lucide-react';

type Slot = { id:string; label:string; start:string; end:string; };
type PacteStatus = 'A CONFIRMER'|'PROPOSÉ'|'VALIDÉ'|'SIGNÉ'|'MODIFIÉ'|'ANNULÉ';
type Pacte = {
  id:string; couple:string; vendor:string; service:string; date:string; status:PacteStatus;
  slots:Slot[]; amount:number; deposit:number; note?:string; history:string[];
};
type Wedding = { name:string; date:string; place:string; events:{id:string;time:string;title:string;type?:string}[]; pactes:Pacte[]; vendors:string[]; };

const seed:Wedding = {
  name:'Claire & Thomas', date:'18 juillet 2027', place:'Domaine des Roses',
  events:[
    {id:'e1',time:'10:00',title:'Préparatifs',type:'moment'},
    {id:'e2',time:'12:00',title:'Cérémonie',type:'moment'},
    {id:'e3',time:'13:30',title:'Cocktail',type:'moment'},
    {id:'e4',time:'19:30',title:'Dîner',type:'moment'},
    {id:'e5',time:'22:30',title:'Soirée',type:'moment'},
  ],
  vendors:['Traiteur','Photographe','DJ','Saxophone'],
  pactes:[
    {id:'p1',couple:'Claire & Thomas',vendor:'Matt Mez Sax',service:'Cocktail + soirée',date:'18 juillet 2027',status:'SIGNÉ',
      slots:[{id:'s1',label:'Cocktail',start:'14:00',end:'16:00'},{id:'s2',label:'Soirée',start:'22:00',end:'00:00'}],
      amount:950,deposit:300,history:['Pacte proposé','Accord validé par les deux parties','Signé le 18/09/2026']},
    {id:'p2',couple:'Claire & Thomas',vendor:'Traiteur Maison Lenoir',service:'Cocktail & dîner',date:'18 juillet 2027',status:'VALIDÉ',
      slots:[{id:'s3',label:'Cocktail',start:'13:30',end:'15:30'},{id:'s4',label:'Dîner',start:'19:30',end:'22:00'}],
      amount:6800,deposit:2000,history:['Pacte proposé','Accord validé par les deux parties']},
    {id:'p3',couple:'Claire & Thomas',vendor:'Studio Lumière',service:'Photo',date:'18 juillet 2027',status:'A CONFIRMER',
      slots:[{id:'s5',label:'Journée',start:'13:30',end:'18:00'}],amount:1200,deposit:400,history:['Pacte déclaré']},
    {id:'p4',couple:'Claire & Thomas',vendor:'DJ Nova',service:'Soirée',date:'18 juillet 2027',status:'SIGNÉ',
      slots:[{id:'s6',label:'Soirée',start:'22:30',end:'02:00'}],amount:1400,deposit:500,history:['Pacte proposé','Signé']},
  ]
};

function load(){ try { const x=localStorage.getItem('pacte-wedding-v2'); return x?JSON.parse(x):seed; } catch { return seed; } }
function eur(n:number){ return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n); }

function App(){
  const [wedding,setWedding]=useState<Wedding>(load);
  useEffect(()=>localStorage.setItem('pacte-wedding-v2',JSON.stringify(wedding)),[wedding]);
  const updatePacte=(id:string,patch:Partial<Pacte>)=>setWedding(w=>({...w,pactes:w.pactes.map(p=>p.id===id?{...p,...patch}:p)}));
  return <BrowserRouter><Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/mariage" element={<Shell wedding={wedding}><WeddingPage wedding={wedding}/></Shell>}/>
    <Route path="/pacte/:id" element={<Shell wedding={wedding}><PactePage wedding={wedding} updatePacte={updatePacte}/></Shell>}/>
    <Route path="/prestataire" element={<Shell wedding={wedding}><VendorPage wedding={wedding}/></Shell>}/>
    <Route path="/prestataire/offres" element={<Shell wedding={wedding}><OffersPage/></Shell>}/>
    <Route path="/invitation/:id" element={<Invitation wedding={wedding} updatePacte={updatePacte}/>} />
    <Route path="*" element={<Shell wedding={wedding}><WeddingPage wedding={wedding}/></Shell>}/>
  </Routes></BrowserRouter>;
}

function Shell({children,wedding}:{children:React.ReactNode;wedding:Wedding}){
 return <div className="min-h-screen bg-[#f7f7f5] text-[#101010]">
   <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f7f7f5]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-5 md:px-8">
      <Link to="/mariage" className="text-lg font-black tracking-[-.04em]">PACTE</Link>
      <span className="hidden h-5 w-px bg-black/10 md:block"/>
      <Link to="/mariage" className="hidden text-sm font-medium text-black/60 md:block">{wedding.name}</Link>
      <nav className="ml-auto flex items-center gap-1">
        <Link className="nav-link active" to="/mariage">Timeline</Link>
        <Link className="nav-link" to="/prestataire">Prestataire</Link>
        <button className="icon-btn"><MoreHorizontal size={18}/></button>
      </nav>
    </div>
   </header>
   <main>{children}</main>
 </div>
}

function Landing(){
 return <div className="min-h-screen bg-[#101010] text-white">
   <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 md:px-10">
    <header className="flex h-20 items-center"><div className="text-xl font-black tracking-[-.04em]">PACTE</div><span className="ml-auto text-sm text-white/45">CONTRATS × MARIAGES</span></header>
    <section className="flex flex-1 flex-col justify-center pb-24 pt-12 md:max-w-4xl">
      <p className="eyebrow text-[#ff2b8a]">Un accord. Une Timeline. Une seule vérité.</p>
      <h1 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.055em] md:text-8xl">Vous vous êtes mis d’accord.<br/><span className="text-white/45">Faites-le simplement.</span></h1>
      <p className="mt-8 max-w-xl text-lg leading-7 text-white/55">PACTE relie les mariés et les prestataires. Quand un accord est validé et signé, il devient automatiquement une partie de la Timeline du mariage.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link to="/mariage" className="cta-white">Je prépare mon mariage <ArrowRight size={17}/></Link>
        <Link to="/prestataire" className="cta-dark">Je suis prestataire <ArrowRight size={17}/></Link>
      </div>
      <div className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] p-5 md:p-7">
        <div className="mb-5 flex items-center justify-between"><span className="text-sm text-white/50">18 JUILLET 2027</span><span className="status-dot"><Check size={12}/> 4 PACTES</span></div>
        <div className="landing-line"><b>13:30</b><span>Cocktail</span><i>Traiteur · Photo · Saxophone</i></div>
        <div className="landing-line"><b>19:30</b><span>Dîner</span><i>Traiteur</i></div>
        <div className="landing-line"><b>22:30</b><span>Soirée</span><i>DJ · Saxophone</i></div>
      </div>
    </section>
   </div>
 </div>
}

function WeddingPage({wedding}:{wedding:Wedding}){
 const [newEvent,setNewEvent]=useState(false);
 const [time,setTime]=useState('16:30'); const [title,setTitle]=useState('');
 const pactesByEvent=(time:string)=>wedding.pactes.flatMap(p=>p.slots.filter(s=>s.start===time).map(s=>({p,s})));
 const add=()=>{if(!title.trim())return; wedding.events.push({id:crypto.randomUUID(),time,title}); setTitle('');setNewEvent(false);};
 return <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8">
  <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
   <div><p className="eyebrow">MON MARIAGE</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.045em] md:text-6xl">{wedding.name}</h1><p className="mt-2 text-black/45">{wedding.date} · {wedding.place}</p></div>
   <button className="button-dark" onClick={()=>setNewEvent(true)}><Plus size={16}/> Ajouter un moment</button>
  </div>
  <section className="mt-12">
   <div className="mb-4 flex items-center justify-between"><h2 className="section-title">TIMELINE</h2><span className="text-xs text-black/35">Le jour J</span></div>
   <div className="timeline">
    {wedding.events.map(e=><div key={e.id} className="timeline-row">
      <div className="time">{e.time}</div><div className="timeline-node"/><div className="flex-1 pb-7">
       <div className="text-xl font-medium tracking-[-.025em]">{e.title}</div>
       <div className="mt-3 space-y-2">{pactesByEvent(e.time).map(({p,s})=><Link key={s.id} to={'/pacte/'+p.id} className="service-row">
         <span>{p.vendor}</span><span>{p.service}</span><span className="ml-auto status">{p.status}</span><ChevronRight size={15}/>
       </Link>)}</div>
      </div>
    </div>)}
   </div>
  </section>
  <section className="mt-8 grid gap-3 md:grid-cols-3">
   <Mini label="PACTES" value={String(wedding.pactes.length)} detail="prestations liées"/>
   <Mini label="VALIDÉS" value={String(wedding.pactes.filter(p=>p.status==='VALIDÉ'||p.status==='SIGNÉ'||p.status==='MODIFIÉ').length)} detail="accords confirmés"/>
   <Mini label="À FAIRE" value={String(wedding.pactes.filter(p=>p.status==='A CONFIRMER'||p.status==='PROPOSÉ').length)} detail="en attente"/>
  </section>
  {newEvent&&<Modal title="Ajouter un moment" close={()=>setNewEvent(false)}>
   <label className="field">Heure<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label>
   <label className="field">Nom<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex. Photos de groupe"/></label>
   <button className="button-dark w-full" onClick={add}>Ajouter à la Timeline</button>
  </Modal>}
 </div>
}

function Mini({label,value,detail}:{label:string;value:string;detail:string}){return <div className="minimal-stat"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>}

function PactePage({wedding,updatePacte}:{wedding:Wedding;updatePacte:(id:string,p:Partial<Pacte>)=>void}){
 const {id}=useParams(); const p=wedding.pactes.find(x=>x.id===id); const [change,setChange]=useState(false);
 if(!p)return <div className="mx-auto max-w-3xl px-5 py-20">PACTE introuvable.</div>;
 const proposeChange=()=>{updatePacte(p.id,{status:'PROPOSÉ',history:[...p.history,'Modification proposée par Claire & Thomas']});setChange(false);};
 return <div className="mx-auto max-w-4xl px-5 pb-24 pt-8 md:px-8">
   <Link to="/mariage" className="back"><ArrowLeft size={16}/> Timeline</Link>
   <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
    <div><p className="eyebrow">PACTE</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.045em]">{p.couple} × {p.vendor}</h1><p className="mt-2 text-black/45">{p.service} · {p.date}</p></div>
    <Status status={p.status}/>
   </div>
   <div className="mt-10 grid gap-10 md:grid-cols-[1fr_280px]">
    <div>
      <div className="pacte-block">
       <div className="pacte-head"><span>PRESTATION</span><span>{p.service}</span></div>
       {p.slots.map(s=><div className="slot" key={s.id}><div><b>{s.start}–{s.end}</b><span>{s.label}</span></div><Clock3 size={18}/></div>)}
      </div>
      <div className="mt-3 pacte-block">
       <div className="pacte-head"><span>FINANCES</span><span>{eur(p.amount)}</span></div>
       <div className="finance-line"><span>Total</span><b>{eur(p.amount)}</b></div>
       <div className="finance-line"><span>Acompte</span><b>{eur(p.deposit)}</b></div>
       <div className="finance-line"><span>Solde</span><b>{eur(p.amount-p.deposit)}</b></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
       <button className="button-outline" onClick={()=>setChange(true)}>Modifier</button>
       <button className="button-outline">Demander un report</button>
       <button className="button-outline danger">Demander une annulation</button>
      </div>
    </div>
    <aside>
      <div className="side-title">HISTORIQUE</div>
      <div className="history">{p.history.map((h,i)=><div key={i}><span className="history-dot"/><p>{h}</p></div>)}</div>
      <p className="mt-8 text-xs leading-5 text-black/35">PACTE structure les informations déclarées par les parties, recueille leurs validations et conserve l’historique. Ce n’est pas un conseil juridique.</p>
    </aside>
   </div>
   {change&&<Modal title="Proposer une modification" close={()=>setChange(false)}>
     <div className="rounded-2xl bg-black/[.04] p-4 text-sm"><b>14:00–16:00</b><span className="mx-2 text-black/25">→</span><b>15:00–17:00</b><p className="mt-1 text-black/45">L’ancien horaire reste la référence jusqu’à l’accord de l’autre partie.</p></div>
     <button className="button-dark w-full" onClick={proposeChange}>Proposer la modification</button>
   </Modal>}
 </div>
}

function Status({status}:{status:PacteStatus}){return <span className={'status-pill '+status.toLowerCase().replaceAll(' ','-')}><span/> {status}</span>}

function VendorPage({wedding}:{wedding:Wedding}){
 const [day,setDay]=useState(wedding.pactes.filter(p=>p.vendor.includes('Matt')));
 const conflicts=day.flatMap(p=>p.slots.map(s=>({...s,p}))).filter((x,i,a)=>a.some((y,j)=>j!==i && x.s.start<y.end && y.s.start<x.s.end));
 return <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8">
  <div className="flex items-end justify-between"><div><p className="eyebrow">PRESTATAIRE</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.045em]">Ma journée</h1><p className="mt-2 text-black/45">Matt Mez Sax · 18 juillet 2027</p></div><Link to="/prestataire/offres" className="button-dark"><Plus size={16}/> Mes offres</Link></div>
  <div className="mt-10 vendor-day">
   {day.map(p=>p.slots.map(s=><Link to={'/pacte/'+p.id} key={s.id} className="vendor-slot"><span className="vendor-time">{s.start}</span><div><b>{p.couple}</b><p>{p.service} · {s.label}</p></div><Status status={p.status}/></Link>))}
   <div className="vendor-free"><span>16:00</span><b>LIBRE</b></div>
  </div>
  {conflicts.length>0&&<div className="mt-4 conflict"><AlertTriangle size={17}/><div><b>CONFLIT D’HORAIRE</b><p>Deux prestations se chevauchent. PACTE ne valide pas silencieusement un conflit.</p></div></div>}
 </div>
}

function OffersPage(){
 const offers=[['COCKTAIL','14:00–16:00',600],['COCKTAIL + SOIRÉE','14:00–16:00 + 22:00–00:00',950],['JOURNÉE','13:30–00:30',1500]];
 return <div className="mx-auto max-w-4xl px-5 pb-24 pt-10 md:px-8"><Link to="/prestataire" className="back"><ArrowLeft size={16}/> Ma journée</Link><div className="mt-10"><p className="eyebrow">MES OFFRES</p><h1 className="mt-2 text-5xl font-semibold tracking-[-.05em]">Choisissez. Proposez. Signez.</h1></div><div className="mt-10 space-y-2">{offers.map(([name,slot,price])=><div className="offer" key={name}><div><b>{name}</b><span>{slot}</span></div><strong>{eur(price as number)}</strong><button className="button-small">UTILISER <ArrowRight size={14}/></button></div>)}</div></div>
}

function Invitation({wedding,updatePacte}:{wedding:Wedding;updatePacte:(id:string,p:Partial<Pacte>)=>void}){
 const {id}=useParams(); const p=wedding.pactes.find(x=>x.id===id); if(!p)return <div>Introuvable</div>;
 return <div className="min-h-screen bg-[#101010] px-5 py-10 text-white"><div className="mx-auto max-w-xl">
  <div className="text-xl font-black">PACTE</div><div className="mt-16"><p className="eyebrow text-[#ff2b8a]">UNE PROPOSITION</p><h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">{p.couple}</h1><p className="mt-3 text-white/50">vous propose une prestation avec {p.vendor}.</p></div>
  <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.05] p-6"><p className="text-sm text-white/45">{p.service}</p>{p.slots.map(s=><div className="mt-5 flex justify-between border-b border-white/10 pb-4" key={s.id}><b>{s.start}–{s.end}</b><span className="text-white/50">{s.label}</span></div>)}<div className="mt-6 flex justify-between"><span>Total</span><b>{eur(p.amount)}</b></div></div>
  <div className="mt-6 grid gap-2"><button className="cta-white w-full" onClick={()=>updatePacte(p.id,{status:'SIGNÉ',history:[...p.history,'Accepté et signé depuis le lien partagé']})}><Check size={17}/> Accepter & signer</button><button className="cta-dark w-full">Proposer une modification</button><button className="text-sm text-white/40 py-3">Refuser</button></div>
 </div></div>
}

function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5 backdrop-blur-sm" onMouseDown={close}><div className="w-full max-w-md rounded-3xl bg-[#f7f7f5] p-6 shadow-2xl" onMouseDown={e=>e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2><button onClick={close} className="icon-btn"><X size={17}/></button></div><div className="mt-6 space-y-4">{children}</div></div></div>}

export default App;

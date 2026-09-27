import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Heart, Briefcase, Play, Zap, PenLine, RotateCcw } from 'lucide-react';
import { usePacte } from '../lib/store';
import { capaciteContinuite } from '../lib/data';
import { Card, Eyebrow, Gauge } from '../components/ui';

const ETAPES = [
  { t: 'Le réveil', d: 'Léa & Maxime importent leurs devis. PACTE génère 10 obligations actives, 6 échéances financières, 4 preuves scellées. Le PDF dort ; le PACTE vit.', cta: 'Voir le mariage vivant', to: '/contrat/pacte-mariage-lea-maxime' },
  { t: 'La prévision', d: 'PACTE Forecast calcule la Capacité de Continuité : exécution, finances, preuves, calendrier. Verdict : « tient, mais 3 risques exigent vigilance ».<br/>Puis le cas pro : Nova × Helios, facture impayée + API bloquante.', cta: 'Voir le cas professionnel', to: '/contrat/pacte-pro-nova-saas' },
  { t: 'Le choc', d: '« QUE SE PASSE-T-IL SI le traiteur annule à J-45 ? » — la capacité chute de 22 points, surcoût 3 800 €, plan B proposé. Essayez le simulateur vous-même.', cta: 'Simuler un scénario', to: '/contrat/pacte-mariage-lea-maxime' },
  { t: 'La continuité', d: 'Un clic sur ACTIVER UNE CONTINUITÉ : traiteur de secours, avenant, journal horodaté. Le contrat ne meurt pas — il mute.', cta: 'Activer une continuité', to: '/contrat/pacte-mariage-lea-maxime' },
  { t: 'La preuve & la signature', d: 'Chaque action produit une preuve hashée. Chaque partie signe (parcours eIDAS-ready). Chaque paiement fait bouger la jauge.', cta: 'Parcours signature', to: '/contrat/pacte-mariage-lea-maxime/signer' },
  { t: 'La clôture', d: 'Jour J passé, soldes réglés, preuves vérifiées : PACTE clôt proprement et archive. Un contrat qui a vécu jusqu’au bout.', cta: 'Recommencer / créer le vôtre', to: '/creer' },
];

export default function Demo() {
  const { contrats, resetDemo } = usePacte();
  const [etape, setEtape] = useState(0);
  const mariage = contrats.find(c => c.id === 'pacte-mariage-lea-maxime');
  const cap = mariage ? capaciteContinuite(mariage) : null;
  const e = ETAPES[etape];
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Démonstration guidée · 6 minutes</Eyebrow>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">Et si le traiteur <em>annulait à J-45 ?</em></h1>
      <p className="text-[#5b5344] mt-2 max-w-2xl">Scénarios pré-chargés : mariage Léa & Maxime + prestation Nova × Helios. Suivez le parcours, cliquez, simulez, activez.</p>

      <div className="flex items-center gap-1.5 mt-6 overflow-x-auto custom-scroll">
        {ETAPES.map((s, i) => (
          <button key={i} onClick={() => setEtape(i)} className={`whitespace-nowrap text-[12px] font-bold px-4 py-2.5 rounded-full border transition ${etape === i ? 'bg-[#16130E] text-white border-[#16130E]' : etape < i ? 'bg-[#DDE8DF] border-[#3E5C4B]/30 text-[#3E5C4B]' : 'bg-white border-[#E2D7BF] text-[#8b8171]'}`}>
            {etape > i ? '✓ ' : ''}{i + 1} · {s.t}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-4 mt-6">
        <Card className="p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#EFE7D8]"><div className="h-full bg-[#B4552D] transition-all duration-500" style={{ width: `${((etape + 1) / ETAPES.length) * 100}%` }} /></div>
          <AnimatePresence mode="wait">
            <motion.div key={etape} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
              <div className="font-mono text-[12px] text-[#A8873D] font-bold">ÉTAPE {etape + 1} / {ETAPES.length}</div>
              <div className="font-serif text-3xl md:text-4xl font-bold mt-2">{e.t}</div>
              <p className="text-[16px] text-[#5b5344] mt-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: e.d }} />
              <div className="flex flex-wrap gap-3 mt-7">
                <Link to={e.to} className="inline-flex items-center gap-2 bg-[#16130E] text-white font-bold px-6 py-3.5 rounded-full hover:bg-[#B4552D] transition text-sm">{e.cta} <ArrowRight size={16} /></Link>
                {etape < ETAPES.length - 1
                  ? <button onClick={() => setEtape(etape + 1)} className="inline-flex items-center gap-2 border border-[#16130E]/25 font-bold px-6 py-3.5 rounded-full hover:border-[#16130E] text-sm">Étape suivante</button>
                  : <button onClick={() => { resetDemo(); setEtape(0); }} className="inline-flex items-center gap-2 border border-[#16130E]/25 font-bold px-6 py-3.5 rounded-full text-sm"><RotateCcw size={15} /> Réinitialiser la démo</button>}
              </div>
              {etape > 0 && <button onClick={() => setEtape(etape - 1)} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#8b8171]"><ArrowLeft size={14} /> Retour</button>}
            </motion.div>
          </AnimatePresence>
        </Card>
        <div className="space-y-4">
          <Card className="p-6 text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8873D] flex items-center justify-center gap-1.5"><Heart size={12} /> En direct — mariage</div>
            {cap && mariage && (<><div className="mt-2"><Gauge score={cap.score} couleur={cap.couleur} size={130} /></div><div className="font-bold text-[14px]" style={{ color: cap.couleur }}>{cap.label}</div><div className="text-[12px] text-[#8b8171] mt-1">{mariage.obligations.filter(o => ['accomplie', 'verifiee'].includes(o.statut)).length}/{mariage.obligations.length} obligations · {mariage.version}</div></>)}
            <Link to="/contrat/pacte-mariage-lea-maxime" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B4552D]">Ouvrir <ArrowRight size={13} /></Link>
          </Card>
          <Card className="p-5 bg-[#16130E] !border-[#16130E] text-[#F7F3EC] text-[13px] space-y-2.5">
            <div className="font-serif font-bold text-[15px] flex items-center gap-2"><Sparkles size={15} className="text-[#E7D5A8]" /> Raccourcis démo</div>
            {[
              { icon: <Heart size={13} />, t: 'Mariage spectaculaire', to: '/contrat/pacte-mariage-lea-maxime' },
              { icon: <Briefcase size={13} />, t: 'Cas professionnel', to: '/contrat/pacte-pro-nova-saas' },
              { icon: <Play size={13} />, t: 'Simuler « traiteur J-45 »', to: '/contrat/pacte-mariage-lea-maxime' },
              { icon: <Zap size={13} />, t: 'Activer une continuité', to: '/contrat/pacte-mariage-lea-maxime' },
              { icon: <PenLine size={13} />, t: 'Signer (Studio Lumière attend)', to: '/contrat/pacte-mariage-lea-maxime/signer' },
            ].map((r, i) => <Link key={i} to={r.to} className="flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2.5 hover:bg-white/20 transition">{r.icon} {r.t}</Link>)}
            <div className="flex items-center gap-1.5 text-[11px] text-[#8b8171] pt-1"><CheckCircle2 size={12} className="text-emerald-400" /> Vos clics modifient vraiment les jauges — réinitialisable.</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

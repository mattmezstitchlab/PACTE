import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileUp, Sparkles, Eye, Heart, Briefcase, ShieldCheck, Bell, LineChart, Play, CheckCircle2, ScrollText, PenLine, Radar, Zap, Archive } from 'lucide-react';
import { usePacte } from '../lib/store';
import { UNIVERS_LIST, capaciteContinuite, fmtEUR } from '../lib/data';
import { Card, Eyebrow, Gauge, Pipeline, StatutContratBadge } from '../components/ui';

const ICONS: Record<string, React.ReactNode> = {};

export default function Home() {
  const { contrats } = usePacte();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Eyebrow>Infrastructure universelle de contrats vivants</Eyebrow>
              <h1 className="font-serif text-[42px] md:text-[64px] leading-[1.02] font-medium mt-4 tracking-tight">
                Vos contrats ne devraient pas <em className="text-[#B4552D]">dormir</em> dans un PDF.
              </h1>
              <p className="text-[17px] text-[#5b5344] mt-5 leading-relaxed max-w-xl">
                PACTE transforme vos contrats en engagements vivants, visibles et suivis dans le temps.
                Obligations actives, échéances, preuves, capacité de continuité, scénarios « que se passe-t-il si… ? » — du mariage au contrat-cadre.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link to="/creer" className="inline-flex items-center gap-2 bg-[#16130E] text-[#F7F3EC] font-semibold px-6 py-3.5 rounded-full hover:bg-[#B4552D] transition text-[15px]">Créer un PACTE <ArrowRight size={17} /></Link>
                <Link to="/creer?mode=import" className="inline-flex items-center gap-2 bg-white border border-[#16130E]/20 font-semibold px-6 py-3.5 rounded-full hover:border-[#16130E] transition text-[15px]"><FileUp size={17} /> Importer un contrat</Link>
                <Link to="/demo" className="inline-flex items-center gap-2 bg-[#3E5C4B] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#2c4a3a] transition text-[15px]"><Eye size={17} /> Explorer une démonstration</Link>
              </div>
              <div className="mt-8"><Pipeline active={8} /></div>
            </motion.div>
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl">
              {[{ n: `${contrats.length}`, l: 'pactes actifs (démo)' }, { n: `${contrats.reduce((s, c) => s + c.obligations.length, 0)}`, l: 'obligations suivies' }, { n: fmtEUR(contrats.reduce((s, c) => s + c.montantTotal, 0)), l: 'montants sous surveillance' }].map((s, i) => (
                <Card key={i} className="p-4 text-center"><div className="font-serif text-2xl font-bold">{s.n}</div><div className="text-[11px] text-[#8b8171] uppercase tracking-wider font-semibold mt-1">{s.l}</div></Card>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="relative">
            <div className="rounded-[28px] overflow-hidden border border-[#E2D7BF] shadow-2xl">
              <img src="/images/pacte-hero.png" alt="Contrat vivant PACTE" className="w-full h-[420px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 md:-left-8 flex gap-3">
              <Card className="p-4 flex items-center gap-3 shadow-xl">
                <Gauge score={capaciteContinuite(contrats[0]).score} couleur={capaciteContinuite(contrats[0]).couleur} size={86} />
                <div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8873D]">Capacité de continuité</div><div className="font-serif font-bold text-[15px]">{capaciteContinuite(contrats[0]).label}</div><div className="text-[12px] text-[#8b8171]">Mariage Léa & Maxime · temps réel</div></div>
              </Card>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-[#16130E]/90 backdrop-blur text-[#E7D5A8] font-mono text-[11px] px-3 py-2 rounded-full flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 live-dot" /> CONTRAT VIVANT · v4.2</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
        <Eyebrow>Le cœur PACTE</Eyebrow>
        <h2 className="font-serif text-3xl md:text-[42px] font-medium mt-2">Un contrat signé devient un <em>organisme vivant</em>.</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: <ScrollText size={20} />, t: '1 · Créer → Signer', d: 'Importez un PDF/DOCX, partez d’un modèle d’univers ou rédigez librement. PACTE extrait parties, objet, montants, échéances et génère la fiche vivante.' },
            { icon: <Radar size={20} />, t: '2 · Surveiller → Prévoir', d: 'Chaque obligation devient un objet actif. PACTE Forecast calcule la Capacité de Continuité (/100) et projette la trajectoire d’exécution.' },
            { icon: <Zap size={20} />, t: '3 · Simuler → Agir → Clôturer', d: '« Que se passe-t-il si… ? » simule le choc, « Activer une continuité » déploie le plan B. Preuves horodatées, soldes, clôture propre.' },
          ].map((c, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition"><div className="w-10 h-10 rounded-full bg-[#16130E] text-[#E7D5A8] flex items-center justify-center">{c.icon}</div><div className="font-serif text-xl font-bold mt-4">{c.t}</div><p className="text-sm text-[#5b5344] mt-2 leading-relaxed">{c.d}</p></Card>
          ))}
        </div>
      </section>

      {/* CONTRATS VIVANTS APERCU */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
        <div className="flex items-end justify-between">
          <div><Eyebrow>En ce moment sur PACTE</Eyebrow><h2 className="font-serif text-3xl font-medium mt-1">Deux pactes battent déjà.</h2></div>
          <Link to="/contrats" className="text-sm font-bold underline underline-offset-4">Tous les pactes</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {contrats.map(c => {
            const cap = capaciteContinuite(c);
            return (
              <Link key={c.id} to={`/contrat/${c.id}`}>
                <Card className="p-6 hover:shadow-xl hover:-translate-y-0.5 transition group">
                  <div className="flex items-center justify-between"><StatutContratBadge statut={c.statut} /><span className="font-mono text-[11px] text-[#8b8171]">{c.version} · {c.univers}</span></div>
                  <div className="font-serif text-2xl font-bold mt-3 group-hover:text-[#B4552D] transition">{c.titre}</div>
                  <p className="text-sm text-[#5b5344] mt-1 line-clamp-2">{c.objet}</p>
                  <div className="flex items-center gap-5 mt-5">
                    <Gauge score={cap.score} couleur={cap.couleur} size={96} />
                    <div className="flex-1 grid grid-cols-2 gap-2 text-center">
                      {[{ n: fmtEUR(c.montantTotal), l: 'montant' }, { n: `${c.obligations.length}`, l: 'obligations' }, { n: `${c.parties.length}`, l: 'parties' }, { n: `${c.documents.length}`, l: 'preuves' }].map((s, j) => (
                        <div key={j} className="bg-[#F7F3EC] rounded-xl py-2 border border-[#EFE7D8]"><div className="font-bold text-[14px]">{s.n}</div><div className="text-[10px] uppercase tracking-wider text-[#8b8171] font-semibold">{s.l}</div></div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B4552D]">Ouvrir le contrat vivant <ArrowRight size={15} /></div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* UNIVERS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
        <Eyebrow>11 univers · 1 architecture</Eyebrow>
        <h2 className="font-serif text-3xl font-medium mt-1">Le mariage est la vitrine. Tout contrat y tient.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {UNIVERS_LIST.slice(0, 8).map(u => (
            <Link key={u.id} to={`/univers?u=${u.id}`}><Card className="p-4 hover:shadow-lg transition h-full"><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-serif font-bold" style={{ background: u.color }}>{u.label[0]}</div><div className="font-bold text-[14px] mt-2">{u.label}</div><div className="text-[12px] text-[#8b8171] line-clamp-2">{u.desc}</div></Card></Link>
          ))}
        </div>
        <Link to="/univers" className="inline-flex mt-4 items-center gap-2 text-sm font-bold underline underline-offset-4">Voir les 11 univers <ArrowRight size={14} /></Link>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14 grid md:grid-cols-4 gap-4">
        {[
          { icon: <LineChart size={18} />, t: 'PACTE Forecast', d: 'Moteur de prévision : capacité actuelle d’aller au terme, risques chiffrés, trajectoire 6 mois.' },
          { icon: <Play size={18} />, t: 'Simuler un scénario', d: '« Que se passe-t-il si… ? » : choc, chute de score, surcoût, plan B immédiat.' },
          { icon: <ShieldCheck size={18} />, t: 'Preuves horodatées', d: 'Chaque action produit document, message, confirmation — hashée et rattachée à l’obligation.' },
          { icon: <Bell size={18} />, t: 'Alertes vivantes', d: 'Échéances, retards, signatures manquantes, reconductions : notifiées, snoozées, résolues.' },
        ].map((f, i) => (
          <Card key={i} className="p-5 bg-[#16130E] !border-[#16130E] text-[#F7F3EC]"><div className="w-9 h-9 rounded-full seal-ring flex items-center justify-center text-[#16130E]">{f.icon}</div><div className="font-serif text-lg font-bold mt-3">{f.t}</div><p className="text-[13px] text-[#B9AE97] mt-1 leading-relaxed">{f.d}</p></Card>
        ))}
      </section>

      {/* DEMO CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
        <div className="rounded-[28px] overflow-hidden bg-[#16130E] text-[#F7F3EC] grid md:grid-cols-2 relative grain">
          <div className="p-8 md:p-12">
            <Eyebrow>Parcours guidé · 6 minutes</Eyebrow>
            <h2 className="font-serif text-3xl md:text-4xl font-medium mt-3">Et si le traiteur annulait à J-45 ?</h2>
            <p className="text-[#B9AE97] mt-3 leading-relaxed">Vivez la démo spectaculaire : mariage Léa & Maxime, choc prestataire, chute de la Capacité de Continuité, simulation, continuité activée, preuves et clôture.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/demo" className="inline-flex items-center gap-2 bg-[#E7D5A8] text-[#16130E] font-bold px-6 py-3 rounded-full hover:bg-white transition"><Sparkles size={16} /> Lancer la démo finale</Link>
              <Link to="/contrat/pacte-mariage-lea-maxime" className="inline-flex items-center gap-2 border border-white/25 font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition"><Heart size={16} /> Voir le mariage</Link>
              <Link to="/contrat/pacte-pro-nova-saas" className="inline-flex items-center gap-2 border border-white/25 font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition"><Briefcase size={16} /> Cas professionnel</Link>
            </div>
            <div className="flex items-center gap-4 mt-6 text-[12px] text-[#8b8171] font-mono">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Sans compte</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Données locales</span>
              <span className="flex items-center gap-1.5"><PenLine size={13} className="text-emerald-400" /> Signature eIDAS-ready</span>
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <img src="/images/mariage-demo.png" alt="Mariage démonstration" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16130E] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* IA RULES TEASER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
        <Card className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#3E5C4B] text-white flex items-center justify-center shrink-0"><ShieldCheck size={22} /></div>
          <div className="flex-1">
            <div className="font-serif text-xl font-bold">Une IA qui assiste. Jamais qui engage.</div>
            <p className="text-sm text-[#5b5344] mt-1">PACTE spécifie strictement ce que l’IA peut faire (résumer, détecter, proposer) et ne peut pas faire (signer, modifier seule, promettre juridiquement). <Link to="/regles-ia" className="font-bold underline underline-offset-2">Lire les règles IA</Link> · <Link to="/espaces" className="font-bold underline underline-offset-2">Voir les espaces</Link></p>
          </div>
          <Link to="/creer" className="inline-flex items-center gap-2 bg-[#16130E] text-white text-sm font-bold px-5 py-3 rounded-full shrink-0">Créer <Archive size={15} /></Link>
        </Card>
      </section>
    </div>
  );
}

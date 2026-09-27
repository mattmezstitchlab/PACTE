import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Users, FileText, Bell, Wallet, ShieldCheck, PenLine, Play, Zap, Plus, CheckCircle2, AlertTriangle, Clock, Upload, X, Archive, Flag } from 'lucide-react';
import { usePacte, uid } from '../lib/store';
import { capaciteContinuite, forecastFor, scenariosFor, fmtEUR, fmtDate, STATUT_OBLIGATION_LABEL, type StatutObligation } from '../lib/data';
import { Card, Eyebrow, Gauge, Bar, StatutContratBadge, StatutObligationBadge, SeveriteBadge, Pipeline } from '../components/ui';

const TABS = [
  { id: 'apercu', label: "Vue d'ensemble", icon: <FileText size={15} /> },
  { id: 'obligations', label: 'Obligations', icon: <CheckCircle2 size={15} /> },
  { id: 'prevision', label: 'Forecast · Scénarios', icon: <Play size={15} /> },
  { id: 'finances', label: 'Finances', icon: <Wallet size={15} /> },
  { id: 'preuves', label: 'Documents & preuves', icon: <ShieldCheck size={15} /> },
  { id: 'journal', label: 'Journal', icon: <Clock size={15} /> },
];

const NEXT_STATUTS: StatutObligation[] = ['a_venir', 'en_cours', 'due', 'retard', 'accomplie', 'verifiee', 'rompue', 'compensee'];

export default function ContratDetail() {
  const { id } = useParams();
  const { contrats, alertes, setObligationStatut, addPreuve, addPaiement, setPaiementStatut, addDocument, addEvenement, addContinuite, activerContinuite, setContratStatut } = usePacte();
  const c = contrats.find(x => x.id === id);
  const [tab, setTab] = useState('apercu');
  const [scenarioSel, setScenarioSel] = useState<string | null>(null);
  const [showContinuite, setShowContinuite] = useState(false);
  const [contTitre, setContTitre] = useState(''); const [contDesc, setContDesc] = useState(''); const [contCout, setContCout] = useState(1500);
  const [preuveNom, setPreuveNom] = useState(''); const [preuveObl, setPreuveObl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const cap = useMemo(() => c ? capaciteContinuite(c) : null, [c]);
  const forecast = useMemo(() => c ? forecastFor(c) : null, [c]);
  const scenarios = useMemo(() => c ? scenariosFor(c.univers) : [], [c]);
  const alertesContrat = alertes.filter(a => a.contratId === id && a.statut === 'active');
  const prochaine = useMemo(() => {
    if (!c) return null;
    const rest = c.obligations.filter(o => !['accomplie', 'verifiee', 'compensee'].includes(o.statut)).sort((a, b) => a.echeance.localeCompare(b.echeance));
    return rest[0] ?? null;
  }, [c]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  if (!c || !cap || !forecast) return <div className="max-w-4xl mx-auto px-4 py-20 text-center">Pacte introuvable. <Link to="/contrats" className="underline font-bold">Retour au registre</Link></div>;

  const paye = c.paiements.filter(p => p.statut === 'paye').reduce((s, p) => s + p.montant, 0);
  const scen = scenarios.find(s => s.id === scenarioSel);
  const scoreSimule = scen ? Math.max(3, cap.score + scen.delta) : cap.score;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <Link to="/contrats" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#8b8171] hover:text-[#16130E]"><ArrowLeft size={14} /> Registre des pactes</Link>

      {/* FICHE CONTRAT VIVANT */}
      <div className="mt-3 rounded-[24px] bg-[#16130E] text-[#F7F3EC] p-6 md:p-9 relative overflow-hidden grain">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #A8873D, transparent)' }} />
        <div className="flex flex-wrap items-center gap-2 relative">
          <StatutContratBadge statut={c.statut} />
          <span className="font-mono text-[11px] text-[#B9AE97] border border-white/15 rounded-full px-3 py-1">{c.univers} · {c.version} · signé le {fmtDate(c.dateSignature)}</span>
          <span className="font-mono text-[11px] text-emerald-300 border border-emerald-300/30 rounded-full px-3 py-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" /> CONTRAT VIVANT</span>
          <div className="ml-auto flex gap-2">
            <Link to={`/contrat/${c.id}/signer`} className="inline-flex items-center gap-1.5 bg-[#E7D5A8] text-[#16130E] text-[13px] font-bold px-4 py-2 rounded-full hover:bg-white"><PenLine size={14} /> Signature</Link>
            {c.statut !== 'cloture' ? (
              <button onClick={() => { setContratStatut(c.id, 'cloture'); addEvenement(c.id, { id: uid('ev'), contratId: c.id, date: '2026-09-27', heure: '18:00', titre: 'Clôture du PACTE — solde et archivage', type: 'autre' }); flash('PACTE clôturé — archive horodatée générée.'); }} className="inline-flex items-center gap-1.5 border border-white/25 text-[13px] font-bold px-4 py-2 rounded-full hover:bg-white/10"><Archive size={14} /> Clôturer</button>
            ) : (
              <button onClick={() => setContratStatut(c.id, 'actif')} className="inline-flex items-center gap-1.5 border border-white/25 text-[13px] font-bold px-4 py-2 rounded-full hover:bg-white/10">Rouvrir</button>
            )}
          </div>
        </div>
        <h1 className="font-serif text-3xl md:text-[44px] font-medium leading-tight mt-4 relative">{c.titre}</h1>
        <p className="text-[#B9AE97] mt-2 max-w-3xl leading-relaxed relative">{c.objet}</p>
        <div className="text-[13px] text-[#B9AE97] mt-1 relative">{c.description} {c.lieu && `· ${c.lieu}`}</div>
        <div className="relative"><Pipeline active={c.statut === 'cloture' ? 8 : c.statut === 'signature' ? 3 : 5} /></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 relative">
          {[
            { l: 'Montant', v: fmtEUR(c.montantTotal) },
            { l: 'Prochaine échéance', v: prochaine ? `${fmtDate(prochaine.echeance)} — ${prochaine.titre.slice(0, 28)}…` : 'Aucune — tout est accompli' },
            { l: "Nombre d'obligations", v: `${c.obligations.length} · ${c.obligations.filter(o => ['accomplie', 'verifiee'].includes(o.statut)).length} accomplies` },
            { l: "Nombre d'alertes", v: `${alertesContrat.length} active${alertesContrat.length > 1 ? 's' : ''}` },
          ].map((f, i) => (
            <div key={i} className="bg-white/[0.07] border border-white/10 rounded-2xl p-4"><div className="text-[10px] uppercase tracking-[0.2em] text-[#A8873D] font-bold">{f.l}</div><div className="font-serif font-bold text-[16px] mt-1 leading-snug">{f.v}</div></div>
          ))}
        </div>
        {/* Parties */}
        <div className="mt-5 relative">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#A8873D] font-bold flex items-center gap-1.5"><Users size={12} /> Parties ({c.parties.filter(p => p.signe).length}/{c.parties.length} signatures)</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {c.parties.map(p => (
              <div key={p.id} className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border ${p.signe ? 'bg-white/[0.07] border-white/15' : 'bg-[#8F1D1D]/25 border-[#B4552D]/50'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ background: p.couleur }}>{p.nom[0]}</div>
                <div className="leading-tight"><div className="text-[13px] font-bold">{p.nom}</div><div className="text-[11px] text-[#B9AE97]">{p.role}{p.signe && p.dateSignature ? ` · signé le ${fmtDate(p.dateSignature)}` : ' · en attente de signature'}</div></div>
                {p.signe ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Clock size={15} className="text-[#E7D5A8]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 mt-5 overflow-x-auto custom-scroll sticky top-[64px] z-30 bg-[#F7F3EC]/95 backdrop-blur py-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 whitespace-nowrap text-[13px] font-bold px-4 py-2.5 rounded-full border transition ${tab === t.id ? 'bg-[#16130E] text-white border-[#16130E]' : 'bg-white border-[#E2D7BF] text-[#5b5344]'}`}>
            {t.icon} {t.label}
            {t.id === 'obligations' && <span className="ml-1 text-[10px] bg-[#F7F3EC] text-[#16130E] rounded-full px-1.5 py-0.5">{c.obligations.length}</span>}
          </button>
        ))}
      </div>

      {tab === 'apercu' && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-4 mt-4">
          <Card className="p-6 text-center h-fit">
            <Eyebrow>Capacité de continuité</Eyebrow>
            <div className="mt-3"><Gauge score={cap.score} couleur={cap.couleur} size={170} /></div>
            <div className="font-serif text-xl font-bold mt-2" style={{ color: cap.couleur }}>{cap.label}</div>
            <p className="text-[13px] text-[#5b5344] mt-2 leading-relaxed">Capacité actuelle du contrat à aller jusqu'à son exécution complète, recalculée à chaque action.</p>
            <div className="mt-4 space-y-3 text-left">
              {cap.facteurs.map((f, i) => (
                <div key={i}><div className="flex justify-between text-[12px] font-bold"><span>{f.nom}</span><span className="font-mono">{f.valeur} · {f.poids}</span></div><div className="mt-1"><Bar valeur={f.valeur} couleur={cap.couleur} /></div><div className="text-[11px] text-[#8b8171] mt-0.5">{f.detail}</div></div>
              ))}
            </div>
            <button onClick={() => setTab('prevision')} className="mt-5 w-full bg-[#16130E] text-white font-bold text-sm py-3 rounded-full hover:bg-[#B4552D] transition">Ouvrir PACTE Forecast</button>
          </Card>
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between"><div className="font-serif text-xl font-bold">Prochaines échéances</div><button onClick={() => setTab('obligations')} className="text-[13px] font-bold underline underline-offset-4">Tout voir</button></div>
              <div className="mt-3 space-y-2">
                {c.obligations.filter(o => !['accomplie', 'verifiee', 'compensee'].includes(o.statut)).sort((a, b) => a.echeance.localeCompare(b.echeance)).slice(0, 4).map(o => (
                  <div key={o.id} className="flex items-center gap-3 bg-[#F7F3EC] border border-[#EFE7D8] rounded-xl px-4 py-3">
                    <Calendar size={16} className="text-[#A8873D] shrink-0" />
                    <div className="flex-1 min-w-0"><div className="font-bold text-[14px] truncate">{o.titre}</div><div className="text-[12px] text-[#8b8171]">{fmtDate(o.echeance)} · {o.responsable}</div></div>
                    <StatutObligationBadge statut={o.statut} />
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 bg-[#8F1D1D] !border-[#8F1D1D] text-white">
                <div className="flex items-center gap-2 font-bold text-[14px]"><Bell size={16} /> Alertes actives ({alertesContrat.length})</div>
                <div className="mt-2 space-y-1.5 text-[13px]">
                  {alertesContrat.slice(0, 3).map(a => <div key={a.id} className="bg-white/10 rounded-lg px-3 py-2">· {a.titre}</div>)}
                  {alertesContrat.length === 0 && <div className="text-white/70">Aucune alerte — surveillance active.</div>}
                </div>
                <Link to="/alertes" className="inline-block mt-3 text-[13px] font-bold underline underline-offset-4">Gérer les alertes</Link>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-2 font-bold text-[14px]"><Wallet size={16} /> Finances — {fmtEUR(paye)} réglés</div>
                <div className="mt-2"><Bar valeur={c.montantTotal ? Math.round(paye / c.montantTotal * 100) : 100} couleur="#3E5C4B" /></div>
                <div className="text-[12px] text-[#8b8171] mt-1">sur {fmtEUR(c.montantTotal)} · {c.paiements.filter(p => p.statut === 'retard').length} paiement(s) en retard</div>
                <button onClick={() => setTab('finances')} className="mt-3 text-[13px] font-bold underline underline-offset-4">Suivre paiements & remboursements</button>
              </Card>
            </div>
            {/* CTA centraux */}
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => setTab('prevision')} className="rounded-2xl bg-[#16130E] text-white p-6 text-left hover:bg-[#B4552D] transition group">
                <Play size={22} className="text-[#E7D5A8]" /><div className="font-serif text-[22px] font-bold mt-2">SIMULER UN SCÉNARIO</div><div className="text-[13px] text-white/70">« Que se passe-t-il si… ? » — choc, chute de score, plan B.</div>
              </button>
              <button onClick={() => setShowContinuite(true)} className="rounded-2xl bg-[#3E5C4B] text-white p-6 text-left hover:bg-[#2c4a3a] transition">
                <Zap size={22} className="text-[#E7D5A8]" /><div className="font-serif text-[22px] font-bold mt-2">ACTIVER UNE CONTINUITÉ</div><div className="text-[13px] text-white/70">Déployer un plan B : avenant, substitution, échéancier.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'obligations' && (
        <div className="mt-4 space-y-3">
          <Card className="p-5 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="font-bold">Légende des états :</span>
            {NEXT_STATUTS.map(s => <StatutObligationBadge key={s} statut={s} />)}
          </Card>
          {c.obligations.map((o, idx) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
              <Card className={`p-5 ${o.statut === 'retard' || o.statut === 'rompue' ? 'border-l-4 !border-l-[#8F1D1D]' : o.jalon ? 'border-l-4 !border-l-[#A8873D]' : ''}`}>
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-[17px]">{o.titre}</span>
                      {o.jalon && <span className="text-[10px] font-bold uppercase tracking-wider bg-[#16130E] text-[#E7D5A8] px-2 py-0.5 rounded-full flex items-center gap-1"><Flag size={10} /> Jalon</span>}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${o.criticite === 'critique' ? 'bg-[#8F1D1D] text-white' : o.criticite === 'haute' ? 'bg-[#F3D9CF] text-[#8F1D1D]' : 'bg-[#EFE7D8] text-[#6b6250]'}`}>Criticité {o.criticite}</span>
                    </div>
                    <p className="text-[13px] text-[#5b5344] mt-1">{o.detail}</p>
                    <div className="text-[12px] text-[#8b8171] mt-1.5">Responsable : <strong className="text-[#16130E]">{o.responsable}</strong> · Échéance : <strong className="text-[#16130E]">{fmtDate(o.echeance)}</strong>{o.montant ? ` · ${fmtEUR(o.montant)}` : ''}</div>
                    {o.preuves.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{o.preuves.map((p, i) => <span key={i} className="text-[11px] bg-[#DDE8DF] text-[#2c4a3a] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={11} /> {p}</span>)}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatutObligationBadge statut={o.statut} />
                    <select value={o.statut} onChange={e => { setObligationStatut(c.id, o.id, e.target.value as StatutObligation); flash(`Obligation « ${o.titre} » → ${STATUT_OBLIGATION_LABEL[e.target.value as StatutObligation]} · version incrémentée`); }} className="text-[12px] font-bold bg-[#F7F3EC] border border-[#E2D7BF] rounded-full px-3 py-1.5 outline-none cursor-pointer">
                      {NEXT_STATUTS.map(s => <option key={s} value={s}>{STATUT_OBLIGATION_LABEL[s]}</option>)}
                    </select>
                    <button onClick={() => setPreuveObl(preuveObl === o.id ? null : o.id)} className="text-[12px] font-bold text-[#3E5C4B] flex items-center gap-1 hover:underline"><Upload size={12} /> Joindre une preuve</button>
                  </div>
                </div>
                {preuveObl === o.id && (
                  <div className="mt-3 flex gap-2">
                    <input value={preuveNom} onChange={e => setPreuveNom(e.target.value)} placeholder="Nom du document — ex : PV de recette signé.pdf" className="flex-1 bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3E5C4B]" />
                    <button onClick={() => { if (!preuveNom.trim()) return; addPreuve(c.id, o.id, preuveNom.trim()); addEvenement(c.id, { id: uid('ev'), contratId: c.id, date: '2026-09-27', heure: '12:00', titre: `Preuve ajoutée : ${preuveNom.trim()}`, type: 'preuve' }); setPreuveNom(''); setPreuveObl(null); flash('Preuve horodatée et rattachée à l’obligation.'); }} className="bg-[#3E5C4B] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl">Horodater</button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'prevision' && (
        <div className="mt-4 grid lg:grid-cols-[1fr_380px] gap-4">
          <div className="space-y-4">
            <Card className="p-6">
              <Eyebrow>PACTE Forecast — moteur de prévision</Eyebrow>
              <div className="font-serif text-2xl font-bold mt-1">Le contrat peut-il aller à son terme ?</div>
              <div className="flex items-center gap-5 mt-4">
                <Gauge score={cap.score} couleur={cap.couleur} size={130} />
                <div className="flex-1">
                  <div className="text-[15px] leading-relaxed bg-[#F7F3EC] border border-[#EFE7D8] rounded-xl p-4 italic font-serif">« {forecast.verdict} »</div>
                  <div className="mt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8b8171]">Trajectoire projetée (6 mois)</div>
                    <div className="flex items-end gap-1.5 h-[90px] mt-2">
                      {forecast.trajectoire.map((t, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-t-lg transition-all" style={{ height: `${t.valeur}%`, minHeight: 8, background: t.valeur >= 70 ? '#3E5C4B' : t.valeur >= 50 ? '#A8873D' : '#8F1D1D', opacity: 0.35 + (i === 0 ? 0.65 : i * 0.08) }} title={`${t.mois} : ${t.valeur}`} />
                          <span className="font-mono text-[9px] text-[#8b8171]">{t.mois}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {forecast.risques.map((r, i) => (
                  <div key={i} className="border border-[#EFE7D8] rounded-xl p-4 bg-[#F7F3EC]/60">
                    <div className="flex items-center gap-2 flex-wrap"><SeveriteBadge s={r.niveau === 'critique' ? 'critique' : r.niveau === 'haut' ? 'attention' : 'info'} /><span className="font-bold text-[14px]">{r.titre}</span><span className="ml-auto font-mono text-[12px] text-[#8F1D1D] font-bold">prob. {r.proba} %</span></div>
                    <div className="text-[13px] text-[#5b5344] mt-1">Impact : {r.impact}</div>
                    <div className="text-[13px] mt-1 flex items-start gap-1.5"><Zap size={13} className="text-[#A8873D] mt-0.5 shrink-0" /><span><strong>Action PACTE :</strong> {r.action}</span></div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 border-2 !border-[#16130E]">
              <div className="flex items-center gap-2"><Play size={18} /><div className="font-serif text-xl font-bold">« QUE SE PASSE-T-IL SI… ? » — simulateur central</div></div>
              <p className="text-[13px] text-[#5b5344] mt-1">Sélectionnez un choc : PACTE projette la chute de Capacité de Continuité, le surcoût et le plan B.</p>
              <div className="grid md:grid-cols-2 gap-2 mt-4">
                {scenarios.map(s => (
                  <button key={s.id} onClick={() => setScenarioSel(scenarioSel === s.id ? null : s.id)} className={`text-left p-4 rounded-xl border transition ${scenarioSel === s.id ? 'bg-[#16130E] text-white border-[#16130E]' : 'bg-[#F7F3EC] border-[#E2D7BF] hover:border-[#16130E]'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{s.categorie}</div>
                    <div className="font-bold text-[14px] mt-0.5">{s.nom}</div>
                    <div className={`text-[12px] mt-1 ${scenarioSel === s.id ? 'text-white/70' : 'text-[#8b8171]'}`}>{s.description}</div>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {scen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4 rounded-2xl bg-[#8F1D1D] text-white p-5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="font-mono text-sm">Capacité : <strong>{cap.score}</strong> → <strong className="text-2xl">{scoreSimule}</strong> <span className="bg-white/20 rounded-full px-2 py-0.5">({scen.delta} pts)</span></div>
                        <div className="ml-auto text-sm">Surcoût estimé : <strong>{fmtEUR(scen.cout)}</strong> · Délai : <strong>+{scen.delaiJours} j</strong></div>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${scoreSimule}%` }} /></div>
                      <div className="mt-3 bg-white/10 rounded-xl p-3.5 text-[13px]"><strong>Plan B PACTE :</strong> {scen.planB}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => { activerContinuite(c.id, { id: uid('cont'), contratId: c.id, titre: `Plan B — ${scen.nom}`, description: scen.planB, statut: 'proposee', cout: scen.cout, delai: `+${scen.delaiJours} j`, effet: Math.abs(scen.delta) }); setScenarioSel(null); flash('Continuité activée — plan B déployé, journal mis à jour.'); }} className="bg-white text-[#8F1D1D] font-bold text-[13px] px-5 py-2.5 rounded-full hover:bg-[#F7F3EC]">ACTIVER CETTE CONTINUITÉ</button>
                        <button onClick={() => setScenarioSel(null)} className="border border-white/30 text-[13px] font-bold px-5 py-2.5 rounded-full">Fermer</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-6 bg-[#3E5C4B] !border-[#3E5C4B] text-white h-fit">
              <div className="font-serif text-xl font-bold flex items-center gap-2"><Zap size={18} /> Continuités</div>
              <p className="text-[13px] text-white/70 mt-1">Plans B qui maintiennent le contrat en vie malgré le choc.</p>
              <div className="mt-3 space-y-2">
                {c.continuites.map(ct => (
                  <div key={ct.id} className="bg-white/10 rounded-xl p-3.5">
                    <div className="flex items-center gap-2"><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ct.statut === 'active' ? 'bg-emerald-300 text-[#16130E]' : 'bg-white/20'}`}>{ct.statut === 'active' ? 'Active' : ct.statut}</span><span className="font-bold text-[13px]">{ct.titre}</span></div>
                    <div className="text-[12px] text-white/75 mt-1">{ct.description}</div>
                    <div className="text-[11px] font-mono mt-1.5 text-emerald-200">+{ct.effet} pts capacité · {fmtEUR(ct.cout)} · {ct.delai}</div>
                  </div>
                ))}
                {c.continuites.length === 0 && <div className="text-white/60 text-[13px]">Aucune continuité pour l'instant.</div>}
              </div>
              <button onClick={() => setShowContinuite(true)} className="mt-4 w-full bg-white text-[#3E5C4B] font-bold text-sm py-3 rounded-full hover:bg-[#F7F3EC]">+ ACTIVER UNE CONTINUITÉ</button>
            </Card>
            <Card className="p-6">
              <div className="font-serif text-lg font-bold">Règles IA sur ce contrat</div>
              <p className="text-[13px] text-[#5b5344] mt-1">L'IA a détecté les risques ci-dessus. Elle <strong>propose</strong>, vous <strong>décidez</strong> : elle ne signe, ne modifie ni n'engage jamais seule.</p>
              <Link to="/regles-ia" className="text-[13px] font-bold underline underline-offset-4">Voir les règles IA</Link>
            </Card>
          </div>
        </div>
      )}

      {tab === 'finances' && (
        <div className="mt-4 grid lg:grid-cols-[1fr_340px] gap-4">
          <Card className="p-6">
            <div className="font-serif text-xl font-bold">Paiements & remboursements</div>
            <div className="mt-4 space-y-2">
              {c.paiements.map(p => (
                <div key={p.id} className="flex items-center gap-3 border border-[#EFE7D8] rounded-xl px-4 py-3 bg-[#F7F3EC]/60 flex-wrap">
                  <div className="flex-1 min-w-[180px]"><div className="font-bold text-[14px]">{p.libelle}</div><div className="text-[12px] text-[#8b8171]">{fmtDate(p.date)} · {p.type}</div></div>
                  <div className="font-serif font-bold text-[17px]">{fmtEUR(p.montant)}</div>
                  <select value={p.statut} onChange={e => { setPaiementStatut(c.id, p.id, e.target.value as typeof p.statut); flash(`Paiement « ${p.libelle} » → ${e.target.value}`); }} className={`text-[12px] font-bold rounded-full px-3 py-1.5 outline-none cursor-pointer ${p.statut === 'paye' ? 'bg-[#DDE8DF] text-[#3E5C4B]' : p.statut === 'retard' ? 'bg-[#8F1D1D] text-white' : p.statut === 'rembourse' ? 'bg-[#E4E9F2] text-[#1D3A5F]' : 'bg-[#F5E8C8] text-[#8A6D2E]'}`}>
                    <option value="paye">Payé</option><option value="attente">En attente</option><option value="retard">En retard</option><option value="rembourse">Remboursé</option>
                  </select>
                </div>
              ))}
            </div>
            <AddPaiement contratId={c.id} onAdd={(lib, mont, date) => { addPaiement(c.id, { id: uid('pay'), libelle: lib, montant: mont, date, statut: 'attente', type: 'autre' }); flash('Échéance financière ajoutée au contrat vivant.'); }} />
          </Card>
          <Card className="p-6 h-fit">
            <div className="font-serif text-lg font-bold">Synthèse</div>
            <div className="mt-3"><Bar valeur={c.montantTotal ? Math.round(paye / c.montantTotal * 100) : 100} couleur="#3E5C4B" /></div>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span className="text-[#8b8171]">Réglé</span><strong className="text-[#3E5C4B]">{fmtEUR(paye)}</strong></div>
              <div className="flex justify-between"><span className="text-[#8b8171]">En attente</span><strong>{fmtEUR(c.paiements.filter(p => p.statut === 'attente').reduce((s, p) => s + p.montant, 0))}</strong></div>
              <div className="flex justify-between"><span className="text-[#8b8171]">En retard</span><strong className="text-[#8F1D1D]">{fmtEUR(c.paiements.filter(p => p.statut === 'retard').reduce((s, p) => s + p.montant, 0))}</strong></div>
              <div className="flex justify-between border-t border-[#EFE7D8] pt-1.5"><span className="text-[#8b8171]">Total contrat</span><strong className="font-serif text-[16px]">{fmtEUR(c.montantTotal)}</strong></div>
            </div>
            <p className="text-[12px] text-[#8b8171] mt-3">Chaque retard alimente la Capacité de Continuité et déclenche une alerte.</p>
          </Card>
        </div>
      )}

      {tab === 'preuves' && (
        <div className="mt-4 grid lg:grid-cols-[1fr_340px] gap-4">
          <Card className="p-6">
            <div className="font-serif text-xl font-bold">Documents & preuves ({c.documents.length})</div>
            <p className="text-[13px] text-[#5b5344]">Chaque action produit : document, message, confirmation — horodatés (hash) et rattachés à une obligation.</p>
            <div className="mt-4 space-y-2">
              {c.documents.map(d => (
                <div key={d.id} className="flex items-center gap-3 border border-[#EFE7D8] rounded-xl px-4 py-3 flex-wrap">
                  <div className="w-9 h-9 rounded-xl bg-[#16130E] text-[#E7D5A8] flex items-center justify-center shrink-0"><FileText size={16} /></div>
                  <div className="flex-1 min-w-[180px]"><div className="font-bold text-[14px]">{d.nom}</div><div className="text-[11px] font-mono text-[#8b8171]">{d.type} · {fmtDate(d.date)} · {d.taille} · {d.hash}</div></div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${d.statut === 'valide' ? 'bg-[#DDE8DF] text-[#3E5C4B]' : d.statut === 'attente' ? 'bg-[#F5E8C8] text-[#8A6D2E]' : 'bg-[#F3D9CF] text-[#8F1D1D]'}`}>{d.statut}</span>
                </div>
              ))}
            </div>
            <AddDocument contratId={c.id} onAdd={(nom, type) => { addDocument(c.id, { id: uid('doc'), contratId: c.id, nom, type, date: '2026-09-27', taille: '0,8 Mo', hash: 'sha256:' + Math.random().toString(16).slice(2, 6) + '…pacte', statut: 'valide' }); flash('Document horodaté et scellé au contrat.'); }} />
          </Card>
          <Card className="p-6 h-fit bg-[#16130E] !border-[#16130E] text-[#F7F3EC]">
            <div className="font-serif text-lg font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-[#E7D5A8]" /> Valeur probante</div>
            <ul className="text-[13px] text-[#B9AE97] mt-2 space-y-1.5">
              <li>· Horodatage + hash à chaque dépôt</li>
              <li>· Rattachement à l'obligation source</li>
              <li>· Version du contrat incrémentée</li>
              <li>· Journal infalsifiable exportable</li>
            </ul>
            <Link to={`/contrat/${c.id}/signer`} className="mt-4 inline-flex items-center gap-2 bg-[#E7D5A8] text-[#16130E] text-[13px] font-bold px-4 py-2.5 rounded-full"><PenLine size={14} /> Parcours signature</Link>
          </Card>
        </div>
      )}

      {tab === 'journal' && (
        <Card className="p-6 mt-4">
          <div className="font-serif text-xl font-bold">Journal du contrat vivant</div>
          <div className="mt-4 relative pl-6 border-l-2 border-[#E2D7BF] space-y-4">
            {[...c.evenements].sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure)).map(e => (
              <div key={e.id} className="relative">
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#A8873D] border-[3px] border-[#F7F3EC]" />
                <div className="font-bold text-[14px]">{e.titre}</div>
                <div className="text-[12px] text-[#8b8171] font-mono">{fmtDate(e.date)} · {e.heure} · {e.type}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL CONTINUITÉ */}
      <AnimatePresence>
        {showContinuite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowContinuite(false)}>
            <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }} onClick={e => e.stopPropagation()} className="bg-[#F7F3EC] rounded-3xl p-7 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between"><div className="font-serif text-2xl font-bold flex items-center gap-2"><Zap size={20} className="text-[#3E5C4B]" /> Activer une continuité</div><button onClick={() => setShowContinuite(false)}><X size={18} /></button></div>
              <p className="text-[13px] text-[#5b5344] mt-1">Un plan B qui maintient le contrat en vie : avenant, substitution, échéancier, repli.</p>
              <label className="block mt-4 text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Titre</label>
              <input value={contTitre} onChange={e => setContTitre(e.target.value)} placeholder="Ex : Traiteur de secours + avenant" className="mt-1 w-full bg-white border border-[#E2D7BF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3E5C4B]" />
              <label className="block mt-3 text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Description du plan B</label>
              <textarea value={contDesc} onChange={e => setContDesc(e.target.value)} rows={3} placeholder="Prestataire de substitution, nouvelles modalités, garanties…" className="mt-1 w-full bg-white border border-[#E2D7BF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3E5C4B]" />
              <div className="mt-3"><label className="text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Coût estimé : {fmtEUR(contCout)}</label>
                <input type="range" min={0} max={15000} step={100} value={contCout} onChange={e => setContCout(+e.target.value)} className="w-full accent-[#3E5C4B]" /></div>
              <button onClick={() => { if (!contTitre.trim()) return; activerContinuite(c.id, { id: uid('cont'), contratId: c.id, titre: contTitre.trim(), description: contDesc.trim() || 'Plan B activé depuis le contrat vivant.', statut: 'proposee', cout: contCout, delai: 'Immédiat', effet: 8 }); setShowContinuite(false); setContTitre(''); setContDesc(''); flash('Continuité activée — capacité recalculée.'); }} className="mt-5 w-full bg-[#3E5C4B] text-white font-bold py-3.5 rounded-full hover:bg-[#2c4a3a] text-sm">ACTIVER CETTE CONTINUITÉ</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-[#16130E] text-[#F7F3EC] text-[13px] font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 max-w-[90vw]"><CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> {toast}</motion.div>}
      </AnimatePresence>

      {/* Bandeau alertes */}
      {alertesContrat.length > 0 && (
        <Card className="mt-4 p-5 flex flex-wrap items-center gap-3 bg-[#FFF7F0]">
          <AlertTriangle size={18} className="text-[#8F1D1D]" />
          <div className="text-[13px] flex-1 min-w-[200px]"><strong>{alertesContrat.length} alerte(s) active(s)</strong> — {alertesContrat[0].titre}. <Link to="/alertes" className="font-bold underline">Traiter</Link></div>
          <button onClick={() => setTab('prevision')} className="bg-[#8F1D1D] text-white text-[13px] font-bold px-4 py-2 rounded-full">Simuler un scénario</button>
        </Card>
      )}
    </div>
  );
}

function AddPaiement({ onAdd }: { contratId: string; onAdd: (lib: string, mont: number, date: string) => void }) {
  const [lib, setLib] = useState(''); const [mont, setMont] = useState(1000); const [date, setDate] = useState('2026-10-15');
  return (
    <div className="mt-4 bg-white border border-[#E2D7BF] rounded-xl p-4">
      <div className="text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Ajouter une échéance / un remboursement</div>
      <div className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-2 mt-2">
        <input value={lib} onChange={e => setLib(e.target.value)} placeholder="Libellé — ex : Remboursement acompte" className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none" />
        <input type="number" value={mont} onChange={e => setMont(+e.target.value)} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none" />
        <button onClick={() => { if (!lib.trim()) return; onAdd(lib.trim(), mont, date); setLib(''); }} className="bg-[#16130E] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1"><Plus size={14} /> Ajouter</button>
      </div>
    </div>
  );
}

function AddDocument({ onAdd }: { contratId: string; onAdd: (nom: string, type: string) => void }) {
  const [nom, setNom] = useState(''); const [type, setType] = useState('Preuve');
  return (
    <div className="mt-4 bg-white border border-[#E2D7BF] rounded-xl p-4">
      <div className="text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Déposer un document (horodaté)</div>
      <div className="grid md:grid-cols-[2fr_1fr_auto] gap-2 mt-2">
        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom du fichier — ex : Avenant n°1 signé.pdf" className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none" />
        <select value={type} onChange={e => setType(e.target.value)} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm">
          {['Preuve', 'Contrat', 'Avenant', 'Facture', 'Reçu', 'PV', 'Message', 'Confirmation', 'Photo'].map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={() => { if (!nom.trim()) return; onAdd(nom.trim(), type); setNom(''); }} className="bg-[#16130E] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1"><Upload size={14} /> Sceller</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PenLine, CheckCircle2, Send, ShieldCheck, Building2, MousePointerClick } from 'lucide-react';
import { usePacte } from '../lib/store';
import { fmtDate } from '../lib/data';
import { Card, Eyebrow } from '../components/ui';

export default function Signature() {
  const { id } = useParams();
  const { contrats, signerPartie, addEvenement, setContratStatut } = usePacte();
  const c = contrats.find(x => x.id === id);
  const [prestataire, setPrestataire] = useState('DocuSign');
  const [trace, setTrace] = useState<string[]>(c ? [`Lien de signature envoyé aux ${c.parties.length} parties`, 'Document scellé — hash enregistré'] : []);
  const [done, setDone] = useState(false);
  if (!c) return <div className="max-w-3xl mx-auto px-4 py-20 text-center">Pacte introuvable.</div>;
  const rest = c.parties.filter(p => !p.signe);

  function signer(pid: string, nom: string) {
    signerPartie(c!.id, pid);
    setTrace(t => [`${nom} a signé (OTP + horodatage eIDAS) — 27 sept. 2026`, ...t]);
    const remaining = rest.length - 1;
    if (remaining === 0) {
      setContratStatut(c!.id, 'actif');
      addEvenement(c!.id, { id: 'ev-sig-' + Date.now(), contratId: c!.id, date: '2026-09-27', heure: '12:00', titre: `Toutes les signatures collectées via ${prestataire} — PACTE actif`, type: 'signature' });
      setDone(true);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <Link to={`/contrat/${c.id}`} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#8b8171]"><ArrowLeft size={14} /> Retour au contrat vivant</Link>
      <Eyebrow>Signature électronique — prête à connecter</Eyebrow>
      <h1 className="font-serif text-4xl font-medium mt-2">Signer « {c.titre} »</h1>
      <p className="text-[#5b5344] mt-2 text-[15px]">Interface prête à brancher sur un prestataire eIDAS (DocuSign, Yousign, Adobe Sign). En démo, la signature est simulée localement et horodatée.</p>

      <div className="grid md:grid-cols-[1fr_360px] gap-4 mt-6">
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="font-serif text-xl font-bold">Ordre de signature</div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[#8b8171] font-semibold">Prestataire :</span>
              <div className="flex gap-1.5">{['DocuSign', 'Yousign', 'Adobe Sign'].map(p => (
                <button key={p} onClick={() => setPrestataire(p)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold border ${prestataire === p ? 'bg-[#16130E] text-white border-[#16130E]' : 'bg-white border-[#E2D7BF]'}`}>{p}</button>
              ))}</div>
            </div>
          </div>
          <div className="mt-3 bg-[#16130E] text-[#E7D5A8] font-mono text-[12px] rounded-xl px-4 py-3 flex items-center gap-2"><Building2 size={14} /> Endpoint : POST /api/signature/{prestataire.toLowerCase().replace(' ', '')}/enveloppes — statut : <span className="text-emerald-400 font-bold">PRÊT À CONNECTER</span></div>
          <div className="mt-4">
            <div className="h-2.5 rounded-full bg-[#EFE7D8] overflow-hidden"><div className="h-full bg-[#3E5C4B] rounded-full transition-all duration-500" style={{ width: `${c.progressSignature}%` }} /></div>
            <div className="text-[12px] font-bold mt-1 text-[#3E5C4B]">{c.progressSignature} % — {c.parties.filter(p => p.signe).length}/{c.parties.length} signatures</div>
          </div>
          <div className="mt-4 space-y-2.5">
            {c.parties.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={`flex items-center gap-3 border rounded-2xl p-4 ${p.signe ? 'bg-[#DDE8DF]/60 border-[#3E5C4B]/30' : 'bg-white border-[#E2D7BF]'}`}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{ background: p.couleur }}>{p.nom[0]}</div>
                <div className="flex-1"><div className="font-bold text-[15px]">{p.nom}</div><div className="text-[12px] text-[#8b8171]">{p.role} · {p.email}{p.signe && p.dateSignature ? ` · signé le ${fmtDate(p.dateSignature)}` : ''}</div></div>
                {p.signe ? <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#3E5C4B]"><CheckCircle2 size={16} /> Signé</span>
                  : <button onClick={() => signer(p.id, p.nom)} className="inline-flex items-center gap-1.5 bg-[#16130E] text-white text-[13px] font-bold px-4 py-2.5 rounded-full hover:bg-[#B4552D]"><PenLine size={14} /> Signer (démo)</button>}
              </motion.div>
            ))}
          </div>
          {done && <div className="mt-4 bg-[#3E5C4B] text-white rounded-2xl p-4 font-bold text-sm flex items-center gap-2"><CheckCircle2 size={17} /> Toutes les parties ont signé — le PACTE est ACTIF. <Link to={`/contrat/${c.id}`} className="underline ml-auto">Ouvrir le contrat vivant</Link></div>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setTrace(t => [`Relance envoyée aux ${rest.length} signataire(s) en attente (${prestataire})`, ...t])} className="inline-flex items-center gap-1.5 border border-[#E2D7BF] bg-white text-[13px] font-bold px-4 py-2.5 rounded-full"><Send size={14} /> Relancer les retardataires</button>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#8b8171]"><MousePointerClick size={13} /> OTP SMS + pièce d'identité + piste d'audit eIDAS</span>
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="font-serif text-lg font-bold">Document à signer</div>
            <div className="mt-3 bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl p-4 font-serif text-[14px] leading-relaxed">
              <div className="text-center font-bold tracking-[0.2em] text-[12px]">PACTE · {c.version}</div>
              <div className="text-center font-bold text-[16px] mt-1">{c.titre}</div>
              <p className="mt-3 text-[13px] font-sans">{c.objet}</p>
              <div className="mt-3 text-[12px] font-sans text-[#5b5344]">Montant : <strong>{c.montantTotal.toLocaleString('fr-FR')} €</strong> · Échéance : <strong>{fmtDate(c.dateFin)}</strong> · Obligations : <strong>{c.obligations.length}</strong></div>
              <div className="mt-4 flex justify-between items-end">
                {c.parties.slice(0, 3).map(p => (
                  <div key={p.id} className="text-center"><div className={`font-serif italic text-[15px] ${p.signe ? 'text-[#3E5C4B]' : 'text-[#B9AE97]'}`}>{p.signe ? p.nom : '………………'}</div><div className="border-t border-[#16130E]/30 mt-1 pt-1 text-[10px] font-sans text-[#8b8171]">{p.nom}</div></div>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="font-serif text-lg font-bold flex items-center gap-2"><ShieldCheck size={17} /> Piste d'audit</div>
            <div className="mt-2 space-y-1.5 text-[12px] font-mono text-[#5b5344]">{trace.map((t, i) => <div key={i} className="bg-[#F7F3EC] rounded-lg px-3 py-2">· {t}</div>)}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

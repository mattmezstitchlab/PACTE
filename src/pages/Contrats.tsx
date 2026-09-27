import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { usePacte } from '../lib/store';
import { UNIVERS_LIST, capaciteContinuite, fmtEUR, fmtDate } from '../lib/data';
import { Card, Eyebrow, Gauge, StatutContratBadge } from '../components/ui';

export default function Contrats() {
  const { contrats } = usePacte();
  const [q, setQ] = useState(''); const [univ, setUniv] = useState('TOUS');
  const list = contrats.filter(c => (univ === 'TOUS' || c.univers === univ) && (c.titre + c.objet).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Registre des pactes</Eyebrow>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">Tous vos contrats, <em>vivants.</em></h1>
        <Link to="/creer" className="bg-[#16130E] text-white text-sm font-bold px-5 py-3 rounded-full">+ Nouveau PACTE</Link>
      </div>
      <div className="flex flex-wrap gap-2 mt-6 items-center">
        <div className="flex items-center gap-2 bg-white border border-[#E2D7BF] rounded-full px-4 py-2.5 flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="text-[#8b8171]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un pacte, une partie…" className="bg-transparent outline-none text-sm w-full" />
        </div>
        {['TOUS', ...UNIVERS_LIST.map(u => u.id)].map(u => (
          <button key={u} onClick={() => setUniv(u)} className={`text-[12px] font-bold px-3 py-2 rounded-full border ${univ === u ? 'bg-[#16130E] text-white border-[#16130E]' : 'bg-white border-[#E2D7BF] text-[#5b5344]'}`}>{u === 'TOUS' ? 'Tous' : UNIVERS_LIST.find(x => x.id === u)?.label}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {list.map(c => {
          const cap = capaciteContinuite(c);
          const alertes = c.obligations.filter(o => o.statut === 'retard' || o.statut === 'rompue').length;
          return (
            <Link key={c.id} to={`/contrat/${c.id}`}><Card className="p-6 hover:shadow-xl transition group h-full">
              <div className="flex items-center justify-between"><StatutContratBadge statut={c.statut} /><span className="font-mono text-[11px] text-[#8b8171]">{c.version}</span></div>
              <div className="font-serif text-[22px] font-bold mt-2 group-hover:text-[#B4552D] transition leading-tight">{c.titre}</div>
              <div className="text-[12px] text-[#8b8171] mt-1">Signé le {fmtDate(c.dateSignature)} · Échéance {fmtDate(c.dateFin)} · {c.parties.filter(p => p.signe).length}/{c.parties.length} signatures</div>
              <div className="flex items-center gap-4 mt-4">
                <Gauge score={cap.score} couleur={cap.couleur} size={88} />
                <div className="flex-1">
                  <div className="text-[13px] font-bold" style={{ color: cap.couleur }}>{cap.label}</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                    <div className="bg-[#F7F3EC] rounded-lg py-1.5 border border-[#EFE7D8]"><div className="font-bold text-[13px]">{fmtEUR(c.montantTotal)}</div><div className="text-[9px] uppercase tracking-wider text-[#8b8171] font-bold">Montant</div></div>
                    <div className="bg-[#F7F3EC] rounded-lg py-1.5 border border-[#EFE7D8]"><div className="font-bold text-[13px]">{c.obligations.length}</div><div className="text-[9px] uppercase tracking-wider text-[#8b8171] font-bold">Obligations</div></div>
                    <div className={`rounded-lg py-1.5 border ${alertes ? 'bg-[#F3D9CF] border-[#B4552D]/30' : 'bg-[#F7F3EC] border-[#EFE7D8]'}`}><div className="font-bold text-[13px]">{alertes}</div><div className="text-[9px] uppercase tracking-wider font-bold" style={{ color: alertes ? '#8F1D1D' : '#8b8171' }}>Alertes</div></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B4552D]">Ouvrir <ArrowRight size={14} /></div>
            </Card></Link>
          );
        })}
      </div>
      {list.length === 0 && <Card className="p-10 text-center mt-6 text-[#8b8171]">Aucun pacte ne correspond. <Link to="/creer" className="font-bold underline">Créez-en un</Link>.</Card>}
    </div>
  );
}

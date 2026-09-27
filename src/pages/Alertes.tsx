import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellOff, CheckCircle2, Clock } from 'lucide-react';
import { usePacte } from '../lib/store';
import { fmtDate } from '../lib/data';
import { Card, Eyebrow, SeveriteBadge } from '../components/ui';

export default function Alertes() {
  const { alertes, contrats, setAlerteStatut } = usePacte();
  const [filtre, setFiltre] = useState<'active' | 'snooze' | 'resolue' | 'toutes'>('active');
  const list = alertes.filter(a => filtre === 'toutes' || a.statut === filtre);
  const nomContrat = (id: string) => contrats.find(c => c.id === id)?.titre ?? id;
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Centre d'alertes</Eyebrow>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">Rien ne dort. <em>Tout prévient.</em></h1>
      <p className="text-[#5b5344] mt-2">Échéances, retards, signatures manquantes, reconductions, dépendances. Chaque alerte se traite, se reporte ou se résout — et nourrit le Forecast.</p>
      <div className="flex gap-2 mt-6">
        {(['active', 'snooze', 'resolue', 'toutes'] as const).map(f => (
          <button key={f} onClick={() => setFiltre(f)} className={`text-[13px] font-bold px-4 py-2 rounded-full border ${filtre === f ? 'bg-[#16130E] text-white border-[#16130E]' : 'bg-white border-[#E2D7BF]'}`}>
            {f === 'active' ? `Actives (${alertes.filter(a => a.statut === 'active').length})` : f === 'snooze' ? 'Reportées' : f === 'resolue' ? 'Résolues' : 'Toutes'}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.map(a => (
          <Card key={a.id} className={`p-5 ${a.severite === 'critique' && a.statut === 'active' ? 'border-l-4 !border-l-[#8F1D1D]' : ''}`}>
            <div className="flex items-start gap-3 flex-wrap">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${a.severite === 'critique' ? 'bg-[#8F1D1D] text-white' : a.severite === 'attention' ? 'bg-[#F5E8C8] text-[#8A6D2E]' : 'bg-[#E4E9F2] text-[#1D3A5F]'}`}><Bell size={17} /></div>
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 flex-wrap"><SeveriteBadge s={a.severite} /><span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8171]">{a.type} · échéance {fmtDate(a.echeance)}</span></div>
                <div className="font-bold text-[16px] mt-1">{a.titre}</div>
                <p className="text-[13px] text-[#5b5344] mt-0.5">{a.message}</p>
                <Link to={`/contrat/${a.contratId}`} className="text-[12px] font-bold text-[#B4552D] hover:underline">→ {nomContrat(a.contratId)}</Link>
              </div>
              <div className="flex gap-1.5">
                {a.statut === 'active' && (<>
                  <button onClick={() => setAlerteStatut(a.id, 'snooze')} title="Reporter 7 jours" className="p-2.5 rounded-full bg-[#F5E8C8] text-[#8A6D2E] hover:opacity-80"><Clock size={15} /></button>
                  <button onClick={() => setAlerteStatut(a.id, 'resolue')} title="Marquer résolue" className="p-2.5 rounded-full bg-[#DDE8DF] text-[#3E5C4B] hover:opacity-80"><CheckCircle2 size={15} /></button>
                </>)}
                {a.statut !== 'active' && <button onClick={() => setAlerteStatut(a.id, 'active')} title="Réactiver" className="p-2.5 rounded-full bg-[#EFE7D8] text-[#6b6250]"><BellOff size={15} /></button>}
              </div>
            </div>
          </Card>
        ))}
        {list.length === 0 && <Card className="p-10 text-center text-[#8b8171]">Aucune alerte dans cet état. Le calme avant… la vigilance.</Card>}
      </div>
      <Card className="p-6 mt-6 bg-[#16130E] !border-[#16130E] text-[#F7F3EC]">
        <div className="font-serif text-lg font-bold">Règles de notification (personnalisables par contrat)</div>
        <div className="grid md:grid-cols-3 gap-2 mt-3 text-[13px]">
          {['J-30 / J-7 / J-1 avant chaque échéance', 'Retard de paiement dès J+1, pénalités dès J+3', 'Signature manquante relancée à J-14 / J-7 / J-1', 'Reconduction tacite alertée 60 j avant préavis', 'Dépendance bloquante = alerte critique immédiate', 'Clôture : rappel solde + archivage à J-7'].map((r, i) => <div key={i} className="bg-white/10 rounded-xl px-3.5 py-2.5">· {r}</div>)}
        </div>
      </Card>
    </div>
  );
}

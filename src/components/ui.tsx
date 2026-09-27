import React from 'react';
import type { Severite, StatutContrat, StatutObligation } from '../lib/data';
import { STATUT_CONTRAT_LABEL, STATUT_OBLIGATION_LABEL } from '../lib/data';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white/85 backdrop-blur rounded-2xl border border-[#E2D7BF] shadow-[0_2px_20px_rgba(22,19,14,0.06)] ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#A8873D]">{children}</div>;
}

export function StatutContratBadge({ statut }: { statut: StatutContrat }) {
  const map: Record<StatutContrat, string> = {
    brouillon: 'bg-[#EFE7D8] text-[#6b6250]', negociation: 'bg-[#E4E9F2] text-[#1D3A5F]',
    signature: 'bg-[#F0E4CD] text-[#8A6D2E]', actif: 'bg-[#DDE8DF] text-[#3E5C4B]',
    vigilance: 'bg-[#F5E8C8] text-[#8A6D2E]', risque: 'bg-[#F3D9CF] text-[#B4552D]',
    suspendu: 'bg-[#E5E0D5] text-[#5b5344]', cloture: 'bg-[#16130E] text-[#E7D5A8]', archive: 'bg-[#E5E0D5] text-[#8b8171]',
  };
  return <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[statut]}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{STATUT_CONTRAT_LABEL[statut]}</span>;
}

export function StatutObligationBadge({ statut }: { statut: StatutObligation }) {
  const map: Record<StatutObligation, string> = {
    a_venir: 'bg-[#EFE7D8] text-[#6b6250]', en_cours: 'bg-[#DDE8DF] text-[#3E5C4B]',
    due: 'bg-[#F5E8C8] text-[#8A6D2E]', retard: 'bg-[#F3D9CF] text-[#8F1D1D]',
    accomplie: 'bg-[#DDE8DF] text-[#2c4a3a]', verifiee: 'bg-[#3E5C4B] text-white',
    rompue: 'bg-[#8F1D1D] text-white', compensee: 'bg-[#E4E9F2] text-[#1D3A5F]',
  };
  return <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${map[statut]}`}>{STATUT_OBLIGATION_LABEL[statut]}</span>;
}

export function SeveriteBadge({ s }: { s: Severite }) {
  const map = { info: 'bg-[#E4E9F2] text-[#1D3A5F]', attention: 'bg-[#F5E8C8] text-[#8A6D2E]', critique: 'bg-[#8F1D1D] text-white' };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${map[s]}`}>{s === 'info' ? 'Info' : s === 'attention' ? 'Attention' : 'Critique'}</span>;
}

export function Gauge({ score, couleur, size = 150 }: { score: number; couleur: string; size?: number }) {
  const r = 58; const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#EFE7D8" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={couleur} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i / 20) * 2 * Math.PI;
          return <circle key={i} cx={70 + Math.cos(a) * 74} cy={70 + Math.sin(a) * 74} r="1.2" fill={i / 20 * 100 <= score ? couleur : '#D8CCB4'} opacity={0.5} />;
        })}
      </svg>
      <div className="absolute text-center">
        <div className="font-serif font-bold leading-none" style={{ fontSize: size * 0.26, color: couleur }}>{score}</div>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b8171]">/ 100</div>
      </div>
    </div>
  );
}

export function Bar({ valeur, couleur }: { valeur: number; couleur: string }) {
  return (
    <div className="h-2 rounded-full bg-[#EFE7D8] overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${valeur}%`, background: couleur }} />
    </div>
  );
}

export const PIPELINE = ['CRÉER', 'ANALYSER', 'NÉGOCIER', 'SIGNER', 'EXÉCUTER', 'SURVEILLER', 'PRÉVOIR', 'AGIR', 'CLÔTURER'];

export function Pipeline({ active = -1 }: { active?: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto custom-scroll py-1">
      {PIPELINE.map((p, i) => (
        <React.Fragment key={p}>
          <div className={`whitespace-nowrap font-mono text-[10px] font-medium px-2.5 py-1.5 rounded-full border ${i <= active ? 'bg-[#16130E] text-[#E7D5A8] border-[#16130E]' : 'bg-white/70 text-[#6b6250] border-[#E2D7BF]'}`}>{i + 1} · {p}</div>
          {i < PIPELINE.length - 1 && <div className={`w-3 h-px shrink-0 ${i < active ? 'bg-[#A8873D]' : 'bg-[#D8CCB4]'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

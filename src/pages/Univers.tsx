import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { UNIVERS_LIST, type Univers } from '../lib/data';
import { usePacte } from '../lib/store';
import { Card, Eyebrow } from '../components/ui';

export default function Univers() {
  const [params] = useSearchParams();
  const { universActif, setUnivers } = usePacte();
  const initial = (params.get('u') as Univers) || universActif;
  const [sel, setSel] = useState<Univers>(initial);
  const u = useMemo(() => UNIVERS_LIST.find(x => x.id === sel)!, [sel]);
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Sélecteur d'univers</Eyebrow>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">Un socle unique. <em>Onze terrains de jeu.</em></h1>
      <p className="text-[#5b5344] mt-3 max-w-2xl">Même moteur (obligations, forecast, scénarios, preuves), modèles et obligations pré-câblées par univers. Choisissez un univers : la création s'y adapte.</p>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {UNIVERS_LIST.map(x => (
            <button key={x.id} onClick={() => { setSel(x.id); setUnivers(x.id); }}
              className={`text-left p-4 rounded-2xl border transition ${sel === x.id ? 'bg-[#16130E] text-[#F7F3EC] border-[#16130E] shadow-xl' : 'bg-white/80 border-[#E2D7BF] hover:shadow-md'}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif font-bold" style={{ background: x.color }}>{x.label[0]}</div>
              <div className="font-bold text-[15px] mt-2 flex items-center gap-1.5">{x.label} {sel === x.id && <CheckCircle2 size={15} className="text-emerald-400" />}</div>
              <div className={`text-[12px] mt-1 leading-snug ${sel === x.id ? 'text-[#B9AE97]' : 'text-[#8b8171]'}`}>{x.desc}</div>
            </button>
          ))}
        </div>
        <div className="lg:sticky lg:top-24 h-fit">
          <Card className="p-6 bg-[#16130E] !border-[#16130E] text-[#F7F3EC]">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E7D5A8]">Univers sélectionné</div>
            <div className="font-serif text-3xl font-bold mt-2">{u.label}</div>
            <p className="text-sm text-[#B9AE97] mt-2 leading-relaxed">{u.desc}</p>
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#8b8171]">Modèles inclus</div>
              <div className="flex flex-wrap gap-2 mt-2">{u.exemples.map(e => <span key={e} className="text-[12px] bg-white/10 px-3 py-1.5 rounded-full">{e}</span>)}</div>
            </div>
            <div className="mt-4 text-[13px] text-[#B9AE97] leading-relaxed">
              Obligations types, seuils d'alerte et scénarios « que se passe-t-il si… ? » pré-configurés pour <strong className="text-white">{u.label}</strong>.
            </div>
            <Link to={`/creer?univers=${u.id}`} className="mt-5 inline-flex items-center gap-2 bg-[#E7D5A8] text-[#16130E] font-bold px-5 py-3 rounded-full hover:bg-white transition text-sm">Créer un pacte {u.label.toLowerCase()} <ArrowRight size={15} /></Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

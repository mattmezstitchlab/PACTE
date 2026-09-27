import { Link } from 'react-router-dom';
import { ShieldCheck, XCircle, Eye, Lock, Scale, ArrowRight } from 'lucide-react';
import { Card, Eyebrow } from '../components/ui';

const PEUT = [
  'Résumer un contrat en langage clair et lister ses engagements',
  'Détecter échéances, montants, clauses pénales et dépendances',
  'Calculer la Capacité de Continuité et projeter la trajectoire',
  'Proposer des scénarios « que se passe-t-il si… ? » chiffrés',
  'Rédiger des projets d’avenants, relances et mises en demeure (à valider)',
  'Suggérer des continuités (plans B) adaptées à l’univers',
  'Rappeler les règles d’alerte et préparer les COPIL / points',
];
const NE_PEUT_PAS = [
  'Signer, accepter ou engager juridiquement qui que ce soit',
  'Modifier seule une obligation, un montant ou une échéance',
  'Promettre une issue juridique ou un gain (« vous gagnerez »)',
  'Supprimer ou altérer une preuve horodatée',
  'Contacter seule un cocontractant au nom d’une partie',
  'Se substituer à un avocat, notaire ou expert-comptable',
  'Clôturer un contrat sans validation humaine explicite',
];

export default function ReglesIA() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Gouvernance</Eyebrow>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">L'IA assiste. <em>Elle n'engage jamais.</em></h1>
      <p className="text-[#5b5344] mt-3 max-w-2xl">PACTE spécifie strictement le périmètre de l'IA. Toute proposition IA est tracée, versionnée et réversible. Toute action engageante exige un humain identifié.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Card className="p-6 border-t-4 !border-t-[#3E5C4B]">
          <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#3E5C4B]"><ShieldCheck size={20} /> Ce que l'IA PEUT faire</div>
          <ul className="mt-4 space-y-2.5">{PEUT.map((p, i) => <li key={i} className="flex items-start gap-2 text-[14px]"><Eye size={15} className="text-[#3E5C4B] mt-0.5 shrink-0" /> {p}</li>)}</ul>
        </Card>
        <Card className="p-6 border-t-4 !border-t-[#8F1D1D]">
          <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#8F1D1D]"><XCircle size={20} /> Ce que l'IA NE PEUT PAS faire</div>
          <ul className="mt-4 space-y-2.5">{NE_PEUT_PAS.map((p, i) => <li key={i} className="flex items-start gap-2 text-[14px]"><Lock size={15} className="text-[#8F1D1D] mt-0.5 shrink-0" /> {p}</li>)}</ul>
        </Card>
      </div>
      <Card className="p-6 mt-4">
        <div className="flex items-center gap-2 font-serif text-lg font-bold"><Scale size={18} /> Principes opposables</div>
        <div className="grid md:grid-cols-3 gap-2 mt-3 text-[13px]">
          {[['Human-in-the-loop', 'Aucune mutation du contrat vivant sans clic humain tracé.'], ['Traçabilité totale', 'Suggestion IA = entrée de journal horodatée, auteur « PACTE IA ».'], ['Droit au désaccord', 'Refuser une suggestion IA ne pénalise jamais le score.']].map(([t, d], i) => (
            <div key={i} className="bg-[#F7F3EC] border border-[#EFE7D8] rounded-xl p-4"><div className="font-bold">{t}</div><div className="text-[#5b5344] mt-1">{d}</div></div>
          ))}
        </div>
        <Link to="/demo" className="mt-4 inline-flex items-center gap-2 bg-[#16130E] text-white text-sm font-bold px-5 py-3 rounded-full">Voir l'IA en action dans la démo <ArrowRight size={15} /></Link>
      </Card>
    </div>
  );
}

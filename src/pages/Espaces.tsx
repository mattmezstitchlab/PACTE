import { Link } from 'react-router-dom';
import { Users, Eye, PenLine, Bell, Crown, ArrowRight } from 'lucide-react';
import { Card, Eyebrow } from '../components/ui';

const ESPACES = [
  { icon: <Crown size={20} />, nom: 'Espace Organisateur', qui: 'Couple, dirigeant, donneur d’ordre', droits: ['Créer / importer / modifier', 'Signer et inviter à signer', 'Activer continuités, clôturer'], couleur: '#B4552D' },
  { icon: <PenLine size={20} />, nom: 'Espace Cocontractant', qui: 'Prestataire, client, bailleur, artiste…', droits: ['Voir ses obligations', 'Déposer preuves, justifier retards', 'Signer, proposer avenants'], couleur: '#3E5C4B' },
  { icon: <Eye size={20} />, nom: 'Espace Invité / Témoin', qui: 'Témoins, famille, observateurs', droits: ['Lecture seule du tableau de bord', 'Notifications jour J', 'Aucune modification'], couleur: '#A8873D' },
  { icon: <Bell size={20} />, nom: 'Espace Superviseur', qui: 'Wedding planner, DAF, juriste, admin', droits: ['Tous les pactes, alertes globales', 'Valider preuves, exporter journal', 'Paramétrer seuils et règles IA'], couleur: '#1D3A5F' },
];

const ETATS_CONTRAT = ['brouillon', 'négociation', 'signature', 'actif', 'vigilance', 'risque', 'suspendu', 'clôturé', 'archivé'];
const ETATS_OBL = ['à venir', 'en cours', 'due', 'en retard', 'accomplie', 'vérifiée', 'rompue', 'compensée'];

export default function Espaces() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Espaces & modèle de données</Eyebrow>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">Chacun voit <em>ce qu'il doit voir.</em></h1>
      <p className="text-[#5b5344] mt-2 max-w-2xl">Quatre espaces, des permissions strictes, et un modèle de données relationnel : Contrats → Parties → Obligations → Paiements → Preuves → Alertes → Scénarios → Continuités → Journal.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {ESPACES.map((e, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: e.couleur }}>{e.icon}</div><div><div className="font-serif text-xl font-bold">{e.nom}</div><div className="text-[12px] text-[#8b8171]">{e.qui}</div></div></div>
            <ul className="mt-3 space-y-1.5 text-[14px]">{e.droits.map((d, j) => <li key={j} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: e.couleur }} /> {d}</li>)}</ul>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card className="p-6">
          <div className="font-serif text-lg font-bold">États d'un contrat</div>
          <div className="flex flex-wrap gap-1.5 mt-3">{ETATS_CONTRAT.map(s => <span key={s} className="text-[12px] font-bold bg-[#16130E] text-[#E7D5A8] px-3 py-1.5 rounded-full">{s}</span>)}</div>
          <div className="font-serif text-lg font-bold mt-5">États d'une obligation</div>
          <div className="flex flex-wrap gap-1.5 mt-3">{ETATS_OBL.map(s => <span key={s} className="text-[12px] font-bold bg-[#EFE7D8] text-[#5b5344] px-3 py-1.5 rounded-full">{s}</span>)}</div>
        </Card>
        <Card className="p-6 bg-[#16130E] !border-[#16130E] text-[#F7F3EC]">
          <div className="font-serif text-lg font-bold flex items-center gap-2"><Users size={18} className="text-[#E7D5A8]" /> Relations entre entités</div>
          <div className="font-mono text-[12px] mt-3 leading-loose text-[#D8CCB4]">
            CONTRAT 1──n PARTIES (signent)<br />CONTRAT 1──n OBLIGATIONS (jalons, criticité)<br />OBLIGATION 1──n PREUVES (hash, horodatage)<br />CONTRAT 1──n PAIEMENTS (acompte→solde)<br />CONTRAT 1──n ALERTES (severité, snooze)<br />CONTRAT 1──n SCÉNARIOS → CONTINUITÉS<br />TOUT 1──n JOURNAL (piste d'audit)
          </div>
          <Link to="/contrats" className="mt-4 inline-flex items-center gap-2 bg-[#E7D5A8] text-[#16130E] text-sm font-bold px-5 py-2.5 rounded-full">Explorer les pactes <ArrowRight size={15} /></Link>
        </Card>
      </div>
    </div>
  );
}

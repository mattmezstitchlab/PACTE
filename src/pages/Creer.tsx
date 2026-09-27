import { useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileUp, Sparkles, PenLine, Layers, CheckCircle2, Plus, Trash2, ArrowRight, FileText } from 'lucide-react';
import { UNIVERS_LIST, type Univers } from '../lib/data';
import { todayPlus, uid, usePacte } from '../lib/store';
import type { Contrat, Obligation, Partie } from '../lib/data';
import { Card, Eyebrow } from '../components/ui';

const MODELES: Record<string, { titre: string; objet: string; obligations: { titre: string; detail: string; responsable: string; criticite: Obligation['criticite']; montant?: number; delai: number }[] }> = {
  MARIAGE: { titre: 'Mariage — [Noms] — [Lieu]', objet: 'Organisation complète du mariage : lieu, traiteur, photo, musique, fleurs et coordination.', obligations: [
    { titre: 'Réserver le lieu + acompte 30 %', detail: 'Contrat de mise à disposition, repli intempéries.', responsable: 'Couple', criticite: 'critique', montant: 5000, delai: 30 },
    { titre: 'Signer le traiteur', detail: 'Menu, nombre de couverts, service.', responsable: 'Traiteur', criticite: 'critique', montant: 15000, delai: 60 },
    { titre: 'Réserver photo / vidéo', detail: 'Présence jour J + livraison galerie.', responsable: 'Couple', criticite: 'haute', montant: 3500, delai: 75 },
    { titre: 'Envoyer les faire-part', detail: 'RSVP, allergies, plan de table.', responsable: 'Couple', criticite: 'moyenne', delai: 150 },
  ]},
  PROFESSIONNEL: { titre: 'Prestation — [Prestataire] × [Client]', objet: 'Mission en lots : cadrage, réalisation, recette, garantie.', obligations: [
    { titre: 'Cadrage & devis signé', detail: 'Périmètre, planning, prix.', responsable: 'Prestataire', criticite: 'critique', montant: 10000, delai: 14 },
    { titre: 'Acompte 30 % à la signature', detail: 'Facture à 30 jours.', responsable: 'Client', criticite: 'haute', montant: 9000, delai: 21 },
    { titre: 'Livraison lot 1 + PV de recette', detail: 'Critères d’acceptation écrits.', responsable: 'Prestataire', criticite: 'critique', delai: 60 },
    { titre: 'Solde à la mise en production', detail: 'Garantie 90 jours.', responsable: 'Client', criticite: 'haute', montant: 11000, delai: 120 },
  ]},
  FREELANCE: { titre: 'Mission freelance — [Nom] × [Client]', objet: 'Mission jalonnée avec acomptes et cession de droits.', obligations: [
    { titre: 'Devis signé + acompte 40 %', detail: 'Périmètre et livrables.', responsable: 'Client', criticite: 'critique', montant: 4000, delai: 7 },
    { titre: 'Livraison V1', detail: 'Allers-retours inclus (2).', responsable: 'Freelance', criticite: 'haute', delai: 30 },
    { titre: 'Cession de droits + solde', detail: 'Paiement contre cession.', responsable: 'Client', criticite: 'haute', montant: 6000, delai: 45 },
  ]},
  IMMOBILIER: { titre: 'Achat immobilier — [Bien]', objet: 'Compromis, financement, actes, remise des clés.', obligations: [
    { titre: 'Compromis + séquestre 5 %', detail: 'Conditions suspensives.', responsable: 'Acquéreur', criticite: 'critique', montant: 15000, delai: 14 },
    { titre: 'Obtention du financement', detail: 'Offre de prêt, assurance.', responsable: 'Acquéreur', criticite: 'critique', delai: 60 },
    { titre: 'Acte authentique + remise des clés', detail: 'Notaire, état des lieux.', responsable: 'Notaire', criticite: 'critique', montant: 280000, delai: 120 },
  ]},
};

export default function Creer() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { addContrat, universActif } = usePacte();
  const [mode, setMode] = useState<'import' | 'modele' | 'libre'>(params.get('mode') === 'import' ? 'import' : 'modele');
  const [univers, setUnivers] = useState<Univers>((params.get('univers') as Univers) || universActif || 'MARIAGE');
  const [titre, setTitre] = useState(''); const [objet, setObjet] = useState('');
  const [montant, setMontant] = useState(20000); const [dateFin, setDateFin] = useState('2027-06-12');
  const [parties, setParties] = useState<Partie[]>([
    { id: uid('pt'), nom: '', role: 'Partie A', email: '', signe: false, couleur: '#B4552D' },
    { id: uid('pt'), nom: '', role: 'Partie B', email: '', signe: false, couleur: '#3E5C4B' },
  ]);
  const [obls, setObls] = useState<{ titre: string; responsable: string; echeance: string; criticite: Obligation['criticite'] }[]>([{ titre: '', responsable: '', echeance: todayPlus(30), criticite: 'haute' }]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyse, setAnalyse] = useState<string[] | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const modele = useMemo(() => MODELES[univers] ?? MODELES.PROFESSIONNEL, [univers]);

  function appliquerModele() {
    setTitre(modele.titre); setObjet(modele.objet);
    setObls(modele.obligations.map(o => ({ titre: o.titre, responsable: o.responsable, echeance: todayPlus(o.delai), criticite: o.criticite })));
    setMontant(modele.obligations.reduce((s, o) => s + (o.montant ?? 0), 0) || 20000);
  }

  function simulerAnalyseImport() {
    if (!fileName) return;
    setAnalysing(true);
    setTimeout(() => {
      setAnalysing(false);
      setTitre(fileName.replace(/\.(pdf|docx?)$/i, '').replace(/[-_]/g, ' '));
      setObjet('Contrat importé : parties, objet, montant et échéances détectés automatiquement. Vérifiez puis activez.');
      setObls([
        { titre: 'Obligation principale détectée (article 2)', responsable: parties[0]?.nom || 'Partie A', echeance: todayPlus(30), criticite: 'critique' },
        { titre: 'Paiement — acompte 30 %', responsable: parties[1]?.nom || 'Partie B', echeance: todayPlus(21), criticite: 'haute' },
        { titre: 'Échéance de renouvellement / fin', responsable: parties[0]?.nom || 'Partie A', echeance: dateFin, criticite: 'moyenne' },
      ]);
      setAnalyse(['2 parties identifiées', '1 montant détecté : échéancier proposé', '3 obligations extraites (articles 2, 5, 9)', '1 clause pénale repérée → alerte suggérée', 'Signature : 0/2 — parcours signature prêt']);
    }, 1400);
  }

  function creer() {
    const id = uid('pacte');
    const c: Contrat = {
      id, titre: titre || `Nouveau PACTE — ${univers.toLowerCase()}`, univers,
      objet: objet || 'Objet à préciser — le contrat reste vivant et versionné.',
      statut: 'signature', version: 'v1.0', montantTotal: montant,
      dateSignature: '2026-09-27', dateDebut: '2026-09-27', dateFin,
      description: `Créé le 27 sept. 2026 · ${parties.length} parties · ${obls.length} obligations`,
      createdAt: '2026-09-27', progressSignature: 0,
      parties: parties.map((p, i) => ({ ...p, nom: p.nom || `Partie ${String.fromCharCode(65 + i)}` })),
      obligations: obls.filter(o => o.titre).map((o, i) => ({ id: uid('ob'), titre: o.titre, detail: 'Créée à la main — détaillez, assignez, jalonnez.', responsable: o.responsable || 'À assigner', echeance: o.echeance, statut: 'a_venir', criticite: o.criticite, preuves: [], jalon: i === 0 })),
      paiements: [{ id: uid('pay'), libelle: 'Acompte initial (30 % estimé)', montant: Math.round(montant * 0.3), date: todayPlus(14), statut: 'attente', type: 'acompte' }],
      documents: fileName ? [{ id: uid('doc'), contratId: id, nom: fileName, type: 'Source', date: '2026-09-27', taille: '1,2 Mo', hash: 'sha256:pacte…' + id.slice(-4), statut: 'valide' }] : [],
      evenements: [{ id: uid('ev'), contratId: id, date: '2026-09-27', heure: '09:00', titre: 'PACTE créé — parcours signature ouvert', type: 'signature' }],
      continuites: [],
    };
    addContrat(c);
    nav(`/contrat/${id}/signer`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <Eyebrow>Création · Import</Eyebrow>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-2">Donnez vie à un contrat.</h1>
      <p className="text-[#5b5344] mt-2">Importez un PDF/DOCX, partez d’un modèle d’univers, ou créez librement. PACTE génère la fiche vivante.</p>

      <div className="grid grid-cols-3 gap-2 mt-6">
        {[{ id: 'import', t: 'Importer PDF / DOCX', i: <FileUp size={17} /> }, { id: 'modele', t: 'Depuis un modèle', i: <Layers size={17} /> }, { id: 'libre', t: 'Contrat libre', i: <PenLine size={17} /> }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id as typeof mode)} className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border transition ${mode === m.id ? 'bg-[#16130E] text-[#F7F3EC] border-[#16130E]' : 'bg-white/80 border-[#E2D7BF] hover:shadow'}`}>{m.i} {m.t}</button>
        ))}
      </div>

      {mode === 'import' && (
        <Card className="p-6 md:p-8 mt-4">
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-[#A8873D]/60 rounded-2xl bg-[#F7F3EC] p-10 text-center cursor-pointer hover:bg-[#EFE7D8] transition">
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setAnalyse(null); } }} />
            <FileText size={36} className="mx-auto text-[#A8873D]" />
            <div className="font-serif text-xl font-bold mt-3">{fileName ? fileName : 'Déposez votre PDF / DOCX ici'}</div>
            <div className="text-sm text-[#8b8171] mt-1">Analyse locale simulée : extraction parties · objet · montants · échéances · clauses</div>
          </div>
          {fileName && !analyse && (
            <button onClick={simulerAnalyseImport} disabled={analysing} className="mt-4 inline-flex items-center gap-2 bg-[#16130E] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60">
              <Sparkles size={16} /> {analysing ? 'Analyse en cours — extraction des engagements…' : 'Analyser et générer le contrat vivant'}
            </button>
          )}
          {analyse && (
            <div className="mt-4 bg-[#DDE8DF] border border-[#3E5C4B]/30 rounded-2xl p-5">
              <div className="font-bold text-[#3E5C4B] flex items-center gap-2"><CheckCircle2 size={17} /> Analyse terminée — vérifiez avant d'activer</div>
              <ul className="mt-2 text-sm text-[#2c4a3a] space-y-1">{analyse.map((a, i) => <li key={i}>· {a}</li>)}</ul>
            </div>
          )}
        </Card>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-4 mt-4">
        <Card className="p-6 md:p-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8873D]">Univers</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {UNIVERS_LIST.map(u => <button key={u.id} onClick={() => setUnivers(u.id)} className={`text-[12px] font-bold px-3 py-1.5 rounded-full border transition ${univers === u.id ? 'bg-[#16130E] text-white border-[#16130E]' : 'bg-white border-[#E2D7BF] text-[#5b5344]'}`}>{u.label}</button>)}
          </div>
          {(mode === 'modele') && (
            <button onClick={appliquerModele} className="mt-4 text-sm font-bold text-[#3E5C4B] underline underline-offset-4">Appliquer le modèle « {UNIVERS_LIST.find(u => u.id === univers)?.label} » : {modele.titre}</button>
          )}
          <label className="block mt-5 text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Titre du PACTE</label>
          <input value={titre} onChange={e => setTitre(e.target.value)} placeholder={modele.titre} className="mt-1.5 w-full bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#A8873D]" />
          <label className="block mt-4 text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Objet</label>
          <textarea value={objet} onChange={e => setObjet(e.target.value)} placeholder={modele.objet} rows={3} className="mt-1.5 w-full bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#A8873D]" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div><label className="text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Montant total (€)</label>
              <input type="number" value={montant} onChange={e => setMontant(+e.target.value)} className="mt-1.5 w-full bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-4 py-3 outline-none focus:border-[#A8873D]" /></div>
            <div><label className="text-[12px] font-bold uppercase tracking-wider text-[#6b6250]">Échéance finale</label>
              <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} className="mt-1.5 w-full bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-4 py-3 outline-none focus:border-[#A8873D]" /></div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="font-serif text-lg font-bold">Parties ({parties.length})</div>
            <button onClick={() => setParties([...parties, { id: uid('pt'), nom: '', role: `Partie ${String.fromCharCode(65 + parties.length)}`, email: '', signe: false, couleur: '#1D3A5F' }])} className="text-[13px] font-bold flex items-center gap-1 text-[#3E5C4B]"><Plus size={14} /> Ajouter</button>
          </div>
          {parties.map((p, i) => (
            <div key={p.id} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-2 mt-2">
              <input value={p.nom} onChange={e => setParties(parties.map(x => x.id === p.id ? { ...x, nom: e.target.value } : x))} placeholder={`Nom partie ${i + 1}`} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#A8873D]" />
              <input value={p.role} onChange={e => setParties(parties.map(x => x.id === p.id ? { ...x, role: e.target.value } : x))} placeholder="Rôle" className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#A8873D]" />
              <input value={p.email} onChange={e => setParties(parties.map(x => x.id === p.id ? { ...x, email: e.target.value } : x))} placeholder="email" className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#A8873D]" />
              <button onClick={() => setParties(parties.filter(x => x.id !== p.id))} className="p-2 text-[#B4552D]"><Trash2 size={16} /></button>
            </div>
          ))}
          <div className="mt-6 flex items-center justify-between">
            <div className="font-serif text-lg font-bold">Obligations ({obls.length})</div>
            <button onClick={() => setObls([...obls, { titre: '', responsable: '', echeance: todayPlus(30), criticite: 'moyenne' }])} className="text-[13px] font-bold flex items-center gap-1 text-[#3E5C4B]"><Plus size={14} /> Ajouter</button>
          </div>
          {obls.map((o, i) => (
            <div key={i} className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 mt-2">
              <input value={o.titre} onChange={e => setObls(obls.map((x, j) => j === i ? { ...x, titre: e.target.value } : x))} placeholder={`Obligation ${i + 1} — ex : verser l'acompte`} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#A8873D]" />
              <input value={o.responsable} onChange={e => setObls(obls.map((x, j) => j === i ? { ...x, responsable: e.target.value } : x))} placeholder="Responsable" className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#A8873D]" />
              <input type="date" value={o.echeance} onChange={e => setObls(obls.map((x, j) => j === i ? { ...x, echeance: e.target.value } : x))} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm outline-none" />
              <select value={o.criticite} onChange={e => setObls(obls.map((x, j) => j === i ? { ...x, criticite: e.target.value as Obligation['criticite'] } : x))} className="bg-[#F7F3EC] border border-[#E2D7BF] rounded-xl px-3 py-2.5 text-sm">
                <option value="basse">Basse</option><option value="moyenne">Moyenne</option><option value="haute">Haute</option><option value="critique">Critique</option>
              </select>
              <button onClick={() => setObls(obls.filter((_, j) => j !== i))} className="p-2 text-[#B4552D]"><Trash2 size={16} /></button>
            </div>
          ))}
        </Card>
        <div className="h-fit lg:sticky lg:top-24">
          <Card className="p-6">
            <div className="font-serif text-xl font-bold">Récapitulatif vivant</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8b8171]">Univers</span><strong>{UNIVERS_LIST.find(u => u.id === univers)?.label}</strong></div>
              <div className="flex justify-between"><span className="text-[#8b8171]">Parties</span><strong>{parties.length}</strong></div>
              <div className="flex justify-between"><span className="text-[#8b8171]">Obligations</span><strong>{obls.filter(o => o.titre).length || '—'}</strong></div>
              <div className="flex justify-between"><span className="text-[#8b8171]">Montant</span><strong>{montant.toLocaleString('fr-FR')} €</strong></div>
              {fileName && <div className="flex justify-between"><span className="text-[#8b8171]">Source</span><strong className="truncate max-w-[150px]">{fileName}</strong></div>}
            </div>
            <button onClick={creer} className="mt-5 w-full inline-flex justify-center items-center gap-2 bg-[#16130E] text-white font-bold px-5 py-3.5 rounded-full hover:bg-[#B4552D] transition text-sm">Activer le contrat vivant <ArrowRight size={16} /></button>
            <p className="text-[12px] text-[#8b8171] mt-3 leading-relaxed">Le PACTE naît en « signature » (v1.0). Chaque signature, preuve et paiement le fait muter — version incrémentée, piste d'audit conservée.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

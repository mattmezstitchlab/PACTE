import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Alerte, Continuite, Contrat, DocPreuve, Evenement, Obligation, Paiement, StatutContrat, StatutObligation, Univers } from './data';

function uid(p: string) { return p + '-' + Math.random().toString(36).slice(2, 8); }
function todayPlus(days: number) { const d = new Date('2026-09-27'); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }

function seedMariage(): Contrat {
  return {
    id: 'pacte-mariage-lea-maxime', titre: 'Mariage Léa & Maxime — Château de Chantilly', univers: 'MARIAGE',
    objet: 'Organisation complète du mariage : lieu, traiteur, photo, musique, fleurs, robe et coordination du jour J.',
    statut: 'actif', version: 'v4.2', montantTotal: 42500, dateSignature: '2026-04-18', dateDebut: '2026-04-18', dateFin: '2027-06-12', lieu: 'Château de Chantilly, Oise',
    description: '180 invités · Cérémonie extérieure + repli orangerie · Dîner assis · Soirée dansante',
    createdAt: '2026-04-18', progressSignature: 100,
    parties: [
      { id: 'p1', nom: 'Léa Moreau', role: 'Future mariée · Co-organisatrice', email: 'lea.moreau@mail.fr', signe: true, dateSignature: '2026-04-18', couleur: '#B4552D' },
      { id: 'p2', nom: 'Maxime Aubert', role: 'Futur marié · Co-organisateur', email: 'maxime.aubert@mail.fr', signe: true, dateSignature: '2026-04-18', couleur: '#3E5C4B' },
      { id: 'p3', nom: 'Château de Chantilly', role: 'Lieu · Mise à disposition', email: 'events@chantilly.fr', signe: true, dateSignature: '2026-04-19', couleur: '#A8873D' },
      { id: 'p4', nom: 'Maison Traiteur Lenoir', role: 'Traiteur · 180 couverts', email: 'contact@lenoir-traiteur.fr', signe: true, dateSignature: '2026-04-20', couleur: '#1D3A5F' },
      { id: 'p5', nom: 'Studio Lumière', role: 'Prestataire image', email: 'bonjour@studiolumiere.fr', signe: false, couleur: '#6D4AA0' },
    ],
    obligations: [
      { id: 'o1', titre: 'Verser l’acompte lieu (30 %)', detail: 'Acompte château pour bloquer la date du 12 juin 2027.', responsable: 'Léa & Maxime', echeance: '2026-05-15', statut: 'verifiee', criticite: 'critique', montant: 5400, preuves: ['Reçu acompte château.pdf', 'Virement confirmé'], jalon: true },
      { id: 'o2', titre: 'Signer le contrat traiteur', detail: 'Menu dégustation validé, 180 couverts, service à l’assiette.', responsable: 'Maison Traiteur Lenoir', echeance: '2026-06-02', statut: 'verifiee', criticite: 'critique', montant: 16800, preuves: ['Contrat traiteur signé.pdf'], jalon: true },
      { id: 'o3', titre: 'Dégustation traiteur', detail: 'Dégustation couple + 4 proches, choix menu définitif.', responsable: 'Léa & Maxime', echeance: '2026-09-10', statut: 'accomplie', criticite: 'haute', preuves: ['Fiche dégustation.pdf', 'Photos plats'] },
      { id: 'o4', titre: 'Acompte photographe (40 %)', detail: 'Studio Lumière — photo + film, 12 h de présence.', responsable: 'Léa & Maxime', echeance: '2026-10-05', statut: 'en_cours', criticite: 'haute', montant: 1400, preuves: [] },
      { id: 'o5', titre: 'Choisir et commander les alliances', detail: 'Joaillier + gravures, délai 8 semaines.', responsable: 'Léa & Maxime', echeance: '2026-11-20', statut: 'en_cours', criticite: 'moyenne', montant: 1800, preuves: [] },
      { id: 'o6', titre: 'Envoyer les faire-part', detail: '180 invitations, RSVP avant le 1er avril 2027.', responsable: 'Léa & Maxime', echeance: '2027-01-15', statut: 'a_venir', criticite: 'moyenne', preuves: [] },
      { id: 'o7', titre: 'Solde traiteur (60 %)', detail: 'Solde 10 jours avant le jour J, ajusté au nombre final.', responsable: 'Léa & Maxime', echeance: '2027-06-02', statut: 'a_venir', criticite: 'critique', montant: 10080, preuves: [], jalon: true },
      { id: 'o8', titre: 'Livraison fleurs & arche', detail: 'Fleuriste Atelier Flora — arche, centres de table, bouquet.', responsable: 'Atelier Flora', echeance: '2026-08-30', statut: 'retard', criticite: 'haute', montant: 2600, preuves: [] },
      { id: 'o9', titre: 'Répétition cérémonie laïque', detail: 'Officiante + témoins, déroulé 45 min.', responsable: 'Officiante C. Roche', echeance: '2027-06-11', statut: 'a_venir', criticite: 'moyenne', preuves: [] },
      { id: 'o10', titre: 'Playlists & sono DJ', detail: 'Contrat DJ Nova, sonorisation extérieure + soirée.', responsable: 'DJ Nova', echeance: '2027-05-20', statut: 'due', criticite: 'haute', montant: 1900, preuves: ['Contrat DJ signé.pdf'] },
    ],
    paiements: [
      { id: 'pay1', libelle: 'Acompte château (30 %)', montant: 5400, date: '2026-05-12', statut: 'paye', type: 'acompte' },
      { id: 'pay2', libelle: 'Acompte traiteur (25 %)', montant: 4200, date: '2026-06-01', statut: 'paye', type: 'acompte' },
      { id: 'pay3', libelle: 'Dégustation + options déco', montant: 890, date: '2026-09-12', statut: 'paye', type: 'autre' },
      { id: 'pay4', libelle: 'Acompte photographe (40 %)', montant: 1400, date: '2026-10-05', statut: 'attente', type: 'acompte' },
      { id: 'pay5', libelle: 'Fleuriste — acompte', montant: 900, date: '2026-08-15', statut: 'retard', type: 'acompte' },
      { id: 'pay6', libelle: 'Solde traiteur (estimé)', montant: 10080, date: '2027-06-02', statut: 'attente', type: 'solde' },
    ],
    documents: [
      { id: 'd1', contratId: 'pacte-mariage-lea-maxime', nom: 'Contrat lieu — Château signé.pdf', type: 'Contrat', date: '2026-04-19', taille: '2,4 Mo', hash: 'sha256:9f2c…a41b', statut: 'valide' },
      { id: 'd2', contratId: 'pacte-mariage-lea-maxime', nom: 'Contrat traiteur v4.2.pdf', type: 'Contrat', date: '2026-06-02', taille: '1,8 Mo', hash: 'sha256:77be…09cc', statut: 'valide' },
      { id: 'd3', contratId: 'pacte-mariage-lea-maxime', nom: 'Reçu acompte château.pdf', type: 'Reçu', date: '2026-05-12', taille: '0,3 Mo', hash: 'sha256:1ad0…f772', statut: 'valide' },
      { id: 'd4', contratId: 'pacte-mariage-lea-maxime', nom: 'Devis Studio Lumière.pdf', type: 'Devis', date: '2026-09-20', taille: '0,9 Mo', hash: 'sha256:44aa…c201', statut: 'attente' },
    ],
    evenements: [
      { id: 'e1', contratId: 'pacte-mariage-lea-maxime', date: '2026-04-18', heure: '10:00', titre: 'Signature du PACTE (Léa & Maxime)', type: 'signature' },
      { id: 'e2', contratId: 'pacte-mariage-lea-maxime', date: '2026-09-10', heure: '19:00', titre: 'Dégustation traiteur validée', type: 'reunion' },
      { id: 'e3', contratId: 'pacte-mariage-lea-maxime', date: '2027-06-12', heure: '15:00', titre: 'Jour J — Cérémonie 16 h', type: 'livraison' },
    ],
    continuites: [
      { id: 'c1', contratId: 'pacte-mariage-lea-maxime', titre: 'Option repli orangerie (pluie)', description: 'Le château bloque l’orangerie jusqu’à J-7 sans surcoût si barnum insuffisant.', statut: 'active', cout: 0, delai: 'J-7', effet: 12 },
    ],
  };
}

function seedPro(): Contrat {
  return {
    id: 'pacte-pro-nova-saas', titre: 'Prestation SaaS — Nova Studio × Helios Énergie', univers: 'PROFESSIONNEL',
    objet: 'Refonte du portail client Helios (3 lots) : cadrage, développement, recette, mise en production et garantie 3 mois.',
    statut: 'vigilance', version: 'v2.0', montantTotal: 68000, dateSignature: '2026-06-30', dateDebut: '2026-07-07', dateFin: '2027-01-29', lieu: 'Remote + Paris 11e',
    description: '3 lots · TJM 720 € · Pénalités 0,5 %/jour plafonnées 10 % · Garantie 90 jours',
    createdAt: '2026-06-30', progressSignature: 100,
    parties: [
      { id: 'q1', nom: 'Nova Studio', role: 'Prestataire · Product & dev', email: 'contrats@novastudio.fr', signe: true, dateSignature: '2026-06-30', couleur: '#3E5C4B' },
      { id: 'q2', nom: 'Helios Énergie', role: 'Client · MOA', email: 'achats@helios-energie.fr', signe: true, dateSignature: '2026-07-01', couleur: '#1D3A5F' },
    ],
    obligations: [
      { id: 'p-o1', titre: 'Lot 1 — Cadrage & maquettes', detail: 'Ateliers, parcours, maquettes Figma validées.', responsable: 'Nova Studio', echeance: '2026-08-08', statut: 'verifiee', criticite: 'haute', montant: 14000, preuves: ['PV recette lot 1.pdf'], jalon: true },
      { id: 'p-o2', titre: 'Lot 2 — Développement portail', detail: 'Front + API facturation, tests, staging.', responsable: 'Nova Studio', echeance: '2026-11-06', statut: 'en_cours', criticite: 'critique', montant: 32000, preuves: ['Sprint 6 — démo'], jalon: true },
      { id: 'p-o3', titre: 'Fournir accès API facturation', detail: 'Dépendance client : sandbox + docs API.', responsable: 'Helios Énergie', echeance: '2026-09-15', statut: 'retard', criticite: 'critique', preuves: [] },
      { id: 'p-o4', titre: 'Recette & mise en production', detail: 'Recette 15 jours, bascule, hypercare.', responsable: 'Nova Studio', echeance: '2027-01-15', statut: 'a_venir', criticite: 'critique', montant: 22000, preuves: [], jalon: true },
      { id: 'p-o5', titre: 'Facture lot 1 (30 %)', detail: 'Facture à 30 jours, pénalités 3× taux légal.', responsable: 'Helios Énergie', echeance: '2026-09-10', statut: 'retard', criticite: 'haute', montant: 14000, preuves: ['Facture F-2026-114.pdf'] },
      { id: 'p-o6', titre: 'Comité de pilotage mensuel', detail: 'COPIL chaque premier mardi, CR sous 48 h.', responsable: 'Nova Studio', echeance: '2026-10-07', statut: 'due', criticite: 'moyenne', preuves: [] },
    ],
    paiements: [
      { id: 'pp1', libelle: 'Acompte 20 % à la signature', montant: 13600, date: '2026-07-15', statut: 'paye', type: 'acompte' },
      { id: 'pp2', libelle: 'Lot 1 — 30 % à recette', montant: 20400, date: '2026-09-10', statut: 'retard', type: 'autre' },
      { id: 'pp3', libelle: 'Lot 2 — 30 % à mi-parcours', montant: 20400, date: '2026-11-20', statut: 'attente', type: 'autre' },
      { id: 'pp4', libelle: 'Solde 20 % à la mise en prod', montant: 13600, date: '2027-01-29', statut: 'attente', type: 'solde' },
    ],
    documents: [
      { id: 'pd1', contratId: 'pacte-pro-nova-saas', nom: 'Contrat de prestation v2.0 signé.pdf', type: 'Contrat', date: '2026-07-01', taille: '3,1 Mo', hash: 'sha256:b81c…77e0', statut: 'valide' },
      { id: 'pd2', contratId: 'pacte-pro-nova-saas', nom: 'PV recette lot 1.pdf', type: 'PV', date: '2026-08-20', taille: '0,6 Mo', hash: 'sha256:02fd…9a55', statut: 'valide' },
      { id: 'pd3', contratId: 'pacte-pro-nova-saas', nom: 'Facture F-2026-114.pdf', type: 'Facture', date: '2026-08-25', taille: '0,2 Mo', hash: 'sha256:9c10…3bd4', statut: 'attente' },
    ],
    evenements: [
      { id: 'pe1', contratId: 'pacte-pro-nova-saas', date: '2026-07-07', heure: '09:30', titre: 'Kick-off & accès outillages', type: 'reunion' },
      { id: 'pe2', contratId: 'pacte-pro-nova-saas', date: '2026-10-07', heure: '14:00', titre: 'COPIL n°4 — arbitrage API', type: 'reunion' },
    ],
    continuites: [],
  };
}

function seedAlertes(): Alerte[] {
  return [
    { id: 'a1', contratId: 'pacte-mariage-lea-maxime', titre: 'Acompte fleuriste en retard', message: '900 € attendus depuis le 15 août. Atelier Flora menace de libérer le créneau.', severite: 'critique', echeance: todayPlus(3), statut: 'active', type: 'Paiement' },
    { id: 'a2', contratId: 'pacte-mariage-lea-maxime', titre: 'Signature Studio Lumière manquante', message: 'Le photographe n’a pas encore signé. Sans signature, pas de second shooter garanti.', severite: 'attention', echeance: todayPlus(8), statut: 'active', type: 'Signature' },
    { id: 'a3', contratId: 'pacte-mariage-lea-maxime', titre: 'Acompte photographe — J-8', message: '1 400 € à régler avant le 5 octobre pour bloquer la date.', severite: 'attention', echeance: todayPlus(8), statut: 'active', type: 'Échéance' },
    { id: 'a4', contratId: 'pacte-pro-nova-saas', titre: 'Facture lot 1 impayée (+17 j)', message: '20 400 € en retard. Pénalités contractuelles applicables dès demain.', severite: 'critique', echeance: todayPlus(1), statut: 'active', type: 'Paiement' },
    { id: 'a5', contratId: 'pacte-pro-nova-saas', titre: 'API facturation non livrée', message: 'Blocage du lot 2. 3 semaines de glissement prévisible.', severite: 'critique', echeance: todayPlus(5), statut: 'active', type: 'Dépendance' },
    { id: 'a6', contratId: 'pacte-pro-nova-saas', titre: 'COPIL mensuel à préparer', message: 'Ordre du jour et arbitrage scope à envoyer avant le 7 octobre.', severite: 'info', echeance: todayPlus(10), statut: 'active', type: 'Échéance' },
  ];
}

interface Store {
  contrats: Contrat[];
  alertes: Alerte[];
  universActif: Univers;
  setUnivers: (u: Univers) => void;
  addContrat: (c: Contrat) => void;
  updateContrat: (id: string, patch: Partial<Contrat>) => void;
  setObligationStatut: (contratId: string, oblId: string, statut: StatutObligation) => void;
  addPreuve: (contratId: string, oblId: string, nom: string) => void;
  addPaiement: (contratId: string, p: Paiement) => void;
  setPaiementStatut: (contratId: string, payId: string, statut: Paiement['statut']) => void;
  addDocument: (contratId: string, d: DocPreuve) => void;
  addEvenement: (contratId: string, e: Evenement) => void;
  addContinuite: (contratId: string, c: Continuite) => void;
  activerContinuite: (contratId: string, c: Continuite) => void;
  setAlerteStatut: (id: string, statut: Alerte['statut']) => void;
  signerPartie: (contratId: string, partieId: string) => void;
  setContratStatut: (id: string, statut: StatutContrat) => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);
const LS_KEY = 'pacte-v1';

function load(): { contrats: Contrat[]; alertes: Alerte[] } | null {
  try { const raw = localStorage.getItem(LS_KEY); if (!raw) return null; return JSON.parse(raw); } catch { return null; }
}

export function PacteProvider({ children }: { children: React.ReactNode }) {
  const [contrats, setContrats] = useState<Contrat[]>(() => load()?.contrats ?? [seedMariage(), seedPro()]);
  const [alertes, setAlertes] = useState<Alerte[]>(() => load()?.alertes ?? seedAlertes());
  const [universActif, setUnivers] = useState<Univers>('MARIAGE');
  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify({ contrats, alertes })); } catch {} }, [contrats, alertes]);
  const api = useMemo<Store>(() => ({
    contrats, alertes, universActif, setUnivers,
    addContrat: (c) => setContrats(s => [c, ...s]),
    updateContrat: (id, patch) => setContrats(s => s.map(c => c.id === id ? { ...c, ...patch } : c)),
    setObligationStatut: (cid, oid, statut) => setContrats(s => s.map(c => c.id === cid ? { ...c, obligations: c.obligations.map(o => o.id === oid ? { ...o, statut } : o), version: bump(c.version) } : c)),
    addPreuve: (cid, oid, nom) => setContrats(s => s.map(c => c.id === cid ? { ...c, obligations: c.obligations.map(o => o.id === oid ? { ...o, preuves: [...o.preuves, nom] } : o), documents: [...c.documents, { id: uid('doc'), contratId: cid, nom, type: 'Preuve', date: '2026-09-27', taille: '0,4 Mo', hash: 'sha256:' + Math.random().toString(16).slice(2, 6) + '…pacte', statut: 'valide', obligationId: oid }], version: bump(c.version) } : c)),
    addPaiement: (cid, p) => setContrats(s => s.map(c => c.id === cid ? { ...c, paiements: [...c.paiements, p] } : c)),
    setPaiementStatut: (cid, pid, statut) => setContrats(s => s.map(c => c.id === cid ? { ...c, paiements: c.paiements.map(p => p.id === pid ? { ...p, statut } : p) } : c)),
    addDocument: (cid, d) => setContrats(s => s.map(c => c.id === cid ? { ...c, documents: [...c.documents, d] } : c)),
    addEvenement: (cid, e) => setContrats(s => s.map(c => c.id === cid ? { ...c, evenements: [...c.evenements, e] } : c)),
    addContinuite: (cid, cc) => setContrats(s => s.map(c => c.id === cid ? { ...c, continuites: [...c.continuites, cc] } : c)),
    activerContinuite: (cid, cc) => {
      setContrats(s => s.map(c => c.id === cid ? { ...c, continuites: [...c.continuites, { ...cc, statut: 'active' }], evenements: [...c.evenements, { id: uid('ev'), contratId: cid, date: '2026-09-27', heure: '09:00', titre: `Continuité activée : ${cc.titre}`, type: 'autre' }] } : c));
    },
    setAlerteStatut: (id, statut) => setAlertes(a => a.map(x => x.id === id ? { ...x, statut } : x)),
    signerPartie: (cid, pid) => setContrats(s => s.map(c => {
      if (c.id !== cid) return c;
      const parties = c.parties.map(p => p.id === pid ? { ...p, signe: true, dateSignature: '2026-09-27' } : p);
      const all = parties.every(p => p.signe);
      return { ...c, parties, progressSignature: Math.round(parties.filter(p => p.signe).length / parties.length * 100), statut: all ? 'actif' : c.statut };
    })),
    setContratStatut: (id, statut) => setContrats(s => s.map(c => c.id === id ? { ...c, statut } : c)),
    resetDemo: () => { setContrats([seedMariage(), seedPro()]); setAlertes(seedAlertes()); },
  }), [contrats, alertes, universActif]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export function usePacte() { const v = useContext(Ctx); if (!v) throw new Error('PacteProvider manquant'); return v; }
function bump(v: string) { const m = v.match(/v(\d+)\.(\d+)/); if (!m) return v; return `v${m[1]}.${parseInt(m[2]) + 1}`; }
export { uid, todayPlus };

export type Univers = 'MARIAGE' | 'PROFESSIONNEL' | 'ENTREPRISE' | 'IMMOBILIER' | 'FREELANCE' | 'FOURNISSEUR' | 'ABONNEMENT' | 'ARTISTE' | 'LOCATION' | 'PARTENARIAT' | 'UNIVERSEL';

export type StatutContrat = 'brouillon' | 'negociation' | 'signature' | 'actif' | 'vigilance' | 'risque' | 'suspendu' | 'cloture' | 'archive';
export type StatutObligation = 'a_venir' | 'en_cours' | 'due' | 'retard' | 'accomplie' | 'verifiee' | 'rompue' | 'compensee';
export type Severite = 'info' | 'attention' | 'critique';

export interface Partie { id: string; nom: string; role: string; email: string; signe: boolean; dateSignature?: string; couleur: string; }
export interface Obligation {
  id: string; titre: string; detail: string; responsable: string;
  echeance: string; statut: StatutObligation; criticite: 'basse' | 'moyenne' | 'haute' | 'critique';
  montant?: number; preuves: string[]; jalon?: boolean;
}
export interface Paiement { id: string; libelle: string; montant: number; date: string; statut: 'paye' | 'attente' | 'retard' | 'rembourse'; type: 'acompte' | 'solde' | 'mensualite' | 'remboursement' | 'penalite' | 'autre'; }
export interface Alerte { id: string; contratId: string; titre: string; message: string; severite: Severite; echeance: string; statut: 'active' | 'snooze' | 'resolue'; type: string; }
export interface DocPreuve { id: string; contratId: string; nom: string; type: string; date: string; taille: string; hash: string; statut: 'valide' | 'attente' | 'rejete'; obligationId?: string; }
export interface Evenement { id: string; contratId: string; date: string; heure: string; titre: string; type: 'paiement' | 'signature' | 'livraison' | 'reunion' | 'alerte' | 'preuve' | 'autre'; }
export interface ScenarioDef { id: string; nom: string; description: string; delta: number; cout: number; delaiJours: number; categorie: string; planB: string; }
export interface Continuite { id: string; contratId: string; titre: string; description: string; statut: 'proposee' | 'active' | 'terminee'; cout: number; delai: string; effet: number; }
export interface Contrat {
  id: string; titre: string; univers: Univers; objet: string; statut: StatutContrat;
  version: string; montantTotal: number; dateSignature: string; dateDebut: string; dateFin: string;
  lieu?: string; description: string; parties: Partie[]; obligations: Obligation[];
  paiements: Paiement[]; documents: DocPreuve[]; evenements: Evenement[]; continuites: Continuite[];
  createdAt: string; progressSignature: number;
}

export const UNIVERS_LIST: { id: Univers; label: string; desc: string; color: string; exemples: string[] }[] = [
  { id: 'MARIAGE', label: 'Mariage', desc: 'Lieu, traiteur, photo, musique, robe — tout le jour J sous surveillance.', color: '#B4552D', exemples: ['Contrat de salle', 'Traiteur', 'Photographe'] },
  { id: 'PROFESSIONNEL', label: 'Professionnel', desc: 'Prestations, missions, SLA et livrables suivis au jour près.', color: '#3E5C4B', exemples: ['Prestation SaaS', 'Mission conseil', 'Maintenance'] },
  { id: 'ENTREPRISE', label: 'Entreprise', desc: 'Contrats-cadres, accords inter-sociétés, gouvernance.', color: '#1D3A5F', exemples: ['Contrat-cadre', 'NDA + prestation', 'Joint-venture'] },
  { id: 'IMMOBILIER', label: 'Immobilier', desc: 'Compromis, VEFA, travaux, remises de clés jalonnées.', color: '#7A5C3E', exemples: ['Compromis', 'VEFA', 'Contrat travaux'] },
  { id: 'FREELANCE', label: 'Freelance', desc: 'Devis signés, acomptes, jalons et droits de propriété.', color: '#6D4AA0', exemples: ['Mission design', 'Dev applicatif', 'Rédaction'] },
  { id: 'FOURNISSEUR', label: 'Fournisseur', desc: 'Commandes, délais, pénalités et qualité de livraison.', color: '#8A6D2E', exemples: ['Fourniture', 'Distribution', 'Sous-traitance'] },
  { id: 'ABONNEMENT', label: 'Abonnement', desc: 'Reconductions, préavis, résiliations — fini les oublis.', color: '#2F7D6D', exemples: ['SaaS annuel', 'Salle de sport', 'Énergie'] },
  { id: 'ARTISTE', label: 'Artiste', desc: 'Cachets, cessions de droits, riders et dates de représentation.', color: '#A03A5B', exemples: ['Cession droits', 'Concert', 'Résidence'] },
  { id: 'LOCATION', label: 'Location', desc: 'Baux, dépôts, états des lieux, loyers et charges.', color: '#4A6FA5', exemples: ['Bail habitation', 'Bail commercial', 'Location saisonnière'] },
  { id: 'PARTENARIAT', label: 'Partenariat', desc: 'Apports, partage de revenus, clauses de sortie.', color: '#B4552D', exemples: ['Co-édition', 'Sponsoring', 'Distribution'] },
  { id: 'UNIVERSEL', label: 'Universel', desc: 'Tout autre engagement : prêt entre proches, promesse, accord formalisé.', color: '#16130E', exemples: ['Prêt', 'Promesse', 'Accord libre'] },
];

export const STATUT_CONTRAT_LABEL: Record<StatutContrat, string> = {
  brouillon: 'Brouillon', negociation: 'En négociation', signature: 'En signature', actif: 'Actif', vigilance: 'En vigilance', risque: 'En risque', suspendu: 'Suspendu', cloture: 'Clôturé', archive: 'Archivé',
};
export const STATUT_OBLIGATION_LABEL: Record<StatutObligation, string> = {
  a_venir: 'À venir', en_cours: 'En cours', due: 'Due', retard: 'En retard', accomplie: 'Accomplie', verifiee: 'Vérifiée', rompue: 'Rompue', compensee: 'Compensée',
};

export function capaciteContinuite(c: Contrat): { score: number; label: string; couleur: string; facteurs: { nom: string; valeur: number; poids: string; detail: string }[] } {
  const total = c.obligations.length || 1;
  const ok = c.obligations.filter(o => o.statut === 'accomplie' || o.statut === 'verifiee').length;
  const retard = c.obligations.filter(o => o.statut === 'retard' || o.statut === 'rompue').length;
  const encours = c.obligations.filter(o => o.statut === 'en_cours' || o.statut === 'due').length;
  const tauxExec = ok / total;
  const tauxRetard = retard / total;
  const paye = c.paiements.filter(p => p.statut === 'paye').reduce((s, p) => s + p.montant, 0);
  const tauxFin = c.montantTotal ? Math.min(1, paye / c.montantTotal) : 1;
  const retardsPaye = c.paiements.filter(p => p.statut === 'retard').length;
  const docsValides = c.documents.filter(d => d.statut === 'valide').length;
  const tauxPreuve = c.obligations.length ? Math.min(1, docsValides / Math.max(1, ok)) : 1;
  const signees = c.parties.filter(p => p.signe).length / Math.max(1, c.parties.length);
  const joursRestants = (new Date(c.dateFin).getTime() - new Date('2026-09-27').getTime()) / 86400000;
  const pressionTemps = joursRestants < 0 ? 0.3 : joursRestants < 30 ? 0.6 : joursRestants < 120 ? 0.8 : 1;
  const sExec = Math.round((tauxExec * 0.72 + (encours / total) * 0.28) * 100 - tauxRetard * 38);
  const sFin = Math.round(tauxFin * 82 + (retardsPaye === 0 ? 18 : -retardsPaye * 12));
  const sPreuve = Math.round((tauxPreuve * 60 + signees * 40));
  const sTemps = Math.round(pressionTemps * 100 - tauxRetard * 15);
  const score = Math.max(3, Math.min(98, Math.round(sExec * 0.38 + sFin * 0.27 + sPreuve * 0.15 + sTemps * 0.20)));
  const label = score >= 80 ? 'Continuité solide' : score >= 60 ? 'Sous surveillance' : score >= 40 ? 'Fragile — agir' : 'Critique — continuité menacée';
  const couleur = score >= 80 ? '#3E5C4B' : score >= 60 ? '#A8873D' : score >= 40 ? '#B4552D' : '#8F1D1D';
  return {
    score, label, couleur,
    facteurs: [
      { nom: 'Exécution des obligations', valeur: Math.max(0, Math.min(100, sExec)), poids: '38 %', detail: `${ok}/${total} accomplies · ${retard} en retard · ${encours} en cours` },
      { nom: 'Santé financière', valeur: Math.max(0, Math.min(100, sFin)), poids: '27 %', detail: `${paye.toLocaleString('fr-FR')} € réglés sur ${c.montantTotal.toLocaleString('fr-FR')} €` },
      { nom: 'Preuves & signatures', valeur: Math.max(0, Math.min(100, sPreuve)), poids: '15 %', detail: `${docsValides} preuves valides · ${c.parties.filter(p=>p.signe).length}/${c.parties.length} signatures` },
      { nom: 'Pression calendaire', valeur: Math.max(0, Math.min(100, sTemps)), poids: '20 %', detail: joursRestants < 0 ? 'Échéance dépassée' : `J-${Math.round(joursRestants)} avant ${c.dateFin}` },
    ],
  };
}

export function forecastFor(c: Contrat) {
  const { score } = capaciteContinuite(c);
  const retards = c.obligations.filter(o => o.statut === 'retard' || o.statut === 'rompue');
  const critiques = c.obligations.filter(o => (o.criticite === 'critique' || o.criticite === 'haute') && !['accomplie','verifiee'].includes(o.statut));
  const risques = [
    ...retards.slice(0, 3).map(o => ({ titre: `Retard : ${o.titre}`, niveau: 'haut' as const, proba: 78, impact: o.criticite === 'critique' ? 'Blocage du jalon' : 'Glissement calendaire', action: `Activer une continuité sur « ${o.titre} » ou renégocier l'échéance du ${o.echeance}.` })),
    ...critiques.slice(0, 3).map(o => ({ titre: `Point critique : ${o.titre}`, niveau: (o.criticite === 'critique' ? 'critique' : 'moyen') as 'critique'|'moyen', proba: o.criticite === 'critique' ? 64 : 42, impact: `Responsable : ${o.responsable}`, action: `Sécuriser une preuve et un plan B avant le ${o.echeance}.` })),
  ];
  if (risques.length === 0) risques.push({ titre: 'Trajectoire nominale', niveau: 'moyen' as const, proba: 18, impact: 'Aucun blocage détecté', action: 'Maintenir le rythme de preuves et la surveillance des échéances.' });
  const trajectoire = [0, 1, 2, 3, 4, 5].map(i => {
    const drift = Math.sin(i * 1.2) * 4 - i * (score > 70 ? -1.2 : 2.1);
    return { mois: `M+${i}`, valeur: Math.max(5, Math.min(98, Math.round(score + drift))) };
  });
  const verdict = score >= 80 ? `Le contrat « ${c.titre} » peut aller à son terme en l'état. Maintenez le rythme des preuves.` : score >= 60 ? `Le contrat « ${c.titre} » tient, mais ${risques.length} risque(s) exigent une vigilance active d'ici 30 jours.` : `Sans action, la probabilité d'exécution complète de « ${c.titre} » chute sous 50 %. Activez au moins une continuité.`;
  return { score, risques, trajectoire, verdict };
}

export const SCENARIOS_PAR_UNIVERS: Record<string, ScenarioDef[]> = {
  MARIAGE: [
    { id: 's-retard-traiteur', nom: 'Le traiteur annule à J-45', description: 'Dépôt perdu, 180 invités, menu à reconstruire.', delta: -22, cout: 3800, delaiJours: 21, categorie: 'Prestataire', planB: 'Traiteur de secours (liste PACTE) + avenant acompte protégé + dégustation express.' },
    { id: 's-pluie', nom: 'Pluie le jour J (cérémonie extérieure)', description: 'Cérémonie prévue en plein air au château.', delta: -12, cout: 1900, delaiJours: 2, categorie: 'Météo', planB: 'Barnum + repli orangerie optionné, avenant lieu couvert.' },
    { id: 's-budget', nom: 'Budget dépassé de 15 %', description: 'Options déco + heures sup DJ non prévues.', delta: -9, cout: 6300, delaiJours: 0, categorie: 'Finances', planB: 'Réarbitrage : gel des options non critiques + échéancier en 3 fois.' },
    { id: 's-photographe', nom: 'Photographe malade le jour J', description: 'Aucune image = préjudice irréversible.', delta: -18, cout: 1200, delaiJours: 7, categorie: 'Prestataire', planB: 'Binôme second shooter contractuel + clause de remplacement 72 h.' },
  ],
  PROFESSIONNEL: [
    { id: 's-impaye', nom: 'Le client paie à 60 jours au lieu de 30', description: 'Trésorerie mise en tension.', delta: -16, cout: 4500, delaiJours: 30, categorie: 'Finances', planB: 'Pénalités contractuelles + suspension palier 3.' },
    { id: 's-scope', nom: 'Périmètre étendu sans avenant (+30 %)', description: 'Fonctionnalités demandées en cours de mission.', delta: -14, cout: 6800, delaiJours: 18, categorie: 'Périmètre', planB: 'Gel du scope + avenant n°2 + priorisation MoSCoW.' },
    { id: 's-retard-liv', nom: 'Livraison du lot 2 retardée de 3 semaines', description: 'Dépendance côté client (API non prête).', delta: -19, cout: 2200, delaiJours: 21, categorie: 'Calendrier', planB: 'Lot intermédiaire + pénalité symétrique.' },
  ],
  DEFAULT: [
    { id: 's-defaut-1', nom: 'Défaillance d’une partie clé', description: 'Un cocontractant n’exécute plus son obligation principale.', delta: -20, cout: 3000, delaiJours: 30, categorie: 'Exécution', planB: 'Mise en demeure + substitution + clause pénale.' },
    { id: 's-defaut-2', nom: 'Hausse des coûts de 15 %', description: 'Matières, main-d’œuvre ou options non prévues.', delta: -10, cout: 2500, delaiJours: 0, categorie: 'Finances', planB: 'Réarbitrage + échéancier + avenant prix.' },
    { id: 's-defaut-3', nom: 'Retard calendaire de 30 jours', description: 'Glissement de l’échéance principale.', delta: -13, cout: 1500, delaiJours: 30, categorie: 'Calendrier', planB: 'Replanification jalonnée + point hebdo.' },
  ],
};

export function scenariosFor(univers: Univers): ScenarioDef[] {
  return SCENARIOS_PAR_UNIVERS[univers] ?? SCENARIOS_PAR_UNIVERS.DEFAULT;
}

export function fmtEUR(n: number) { return n.toLocaleString('fr-FR') + ' €'; }
export function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return iso; }
}

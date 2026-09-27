import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, FileSignature, LayoutDashboard, PlusCircle, Sparkles, Globe, ShieldCheck, Users, RotateCcw } from 'lucide-react';
import { usePacte } from '../lib/store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { alertes, contrats, resetDemo } = usePacte();
  const actives = alertes.filter(a => a.statut === 'active');
  const critiques = actives.filter(a => a.severite === 'critique').length;
  const loc = useLocation();
  const nav = useNavigate();
  const link = (to: string, label: string, icon: React.ReactNode) => (
    <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-medium transition ${isActive ? 'bg-[#16130E] text-[#F7F3EC]' : 'text-[#5b5344] hover:bg-[#EFE7D8] hover:text-[#16130E]'}`}>
      {icon}<span className="hidden lg:inline">{label}</span>
    </NavLink>
  );
  return (
    <div className="min-h-screen paper-texture">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F3EC]/90 border-b border-[#E2D7BF]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[64px] flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 mr-2">
            <div className="w-9 h-9 rounded-full seal-ring flex items-center justify-center shadow-md relative">
              <div className="w-7 h-7 rounded-full bg-[#16130E] flex items-center justify-center">
                <span className="font-serif text-[#E7D5A8] text-lg leading-none font-semibold">P</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#3E5C4B] border-2 border-[#F7F3EC] live-dot" />
            </div>
            <div className="leading-none">
              <div className="font-serif font-700 font-bold tracking-[0.18em] text-[17px]">PACTE</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#A8873D] font-semibold">Contrats vivants</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 ml-2 overflow-x-auto custom-scroll">
            {link('/', 'Accueil', <LayoutDashboard size={15} />)}
            {link('/univers', 'Univers', <Globe size={15} />)}
            {link('/contrats', 'Pactes', <FileSignature size={15} />)}
            {link('/creer', 'Créer', <PlusCircle size={15} />)}
            {link('/alertes', 'Alertes', <Bell size={15} />)}
            {link('/espaces', 'Espaces', <Users size={15} />)}
            {link('/regles-ia', 'Règles IA', <ShieldCheck size={15} />)}
            {link('/demo', 'Démo', <Sparkles size={15} />)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => { resetDemo(); nav('/contrats'); }} title="Réinitialiser la démo" className="p-2 rounded-full hover:bg-[#EFE7D8] text-[#5b5344]"><RotateCcw size={16} /></button>
            <Link to="/alertes" className="relative p-2 rounded-full hover:bg-[#EFE7D8]">
              <Bell size={18} />
              {actives.length > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8F1D1D] text-white text-[10px] font-bold flex items-center justify-center">{actives.length}</span>}
            </Link>
            <Link to="/creer" className="hidden sm:inline-flex items-center gap-2 bg-[#16130E] text-[#F7F3EC] text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#2A251C] transition">
              <PlusCircle size={15} /> Créer un PACTE
            </Link>
          </div>
        </div>
        {loc.pathname.startsWith('/contrat/') === false && critiques > 0 && loc.pathname !== '/alertes' && (
          <div className="bg-[#8F1D1D] text-[#F7F3EC] text-[12px]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white live-dot" />
              <span><strong>{critiques} alerte{critiques > 1 ? 's' : ''} critique{critiques > 1 ? 's' : ''}</strong> sur {contrats.length} pactes — <Link to="/alertes" className="underline underline-offset-2 font-semibold">voir et agir</Link></span>
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t border-[#E2D7BF] bg-[#16130E] text-[#EFE7D8]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-serif text-2xl font-bold tracking-[0.14em]">PACTE</div>
            <p className="text-sm text-[#B9AE97] mt-2 leading-relaxed">Vos contrats ne devraient pas dormir dans un PDF. Infrastructure universelle de contrats vivants.</p>
            <p className="font-mono text-[11px] text-[#A8873D] mt-4">CRÉER → ANALYSER → NÉGOCIER → SIGNER → EXÉCUTER → SURVEILLER → PRÉVOIR → AGIR → CLÔTURER</p>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#A8873D] font-bold mb-3">Produit</div>
            <div className="flex flex-col gap-2 text-sm text-[#D8CCB4]">
              <Link to="/univers" className="hover:text-white">11 univers</Link>
              <Link to="/contrats" className="hover:text-white">Contrats vivants</Link>
              <Link to="/alertes" className="hover:text-white">Alertes & échéances</Link>
              <Link to="/demo" className="hover:text-white">Démonstration guidée</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#A8873D] font-bold mb-3">Confiance</div>
            <div className="flex flex-col gap-2 text-sm text-[#D8CCB4]">
              <Link to="/regles-ia" className="hover:text-white">Règles IA — ce qu'elle peut / ne peut pas</Link>
              <Link to="/espaces" className="hover:text-white">Espaces & permissions</Link>
              <Link to="/creer" className="hover:text-white">Preuves horodatées (hash)</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#A8873D] font-bold mb-3">Démo pré-chargée</div>
            <p className="text-sm text-[#D8CCB4]">Mariage Léa & Maxime · Prestation Nova × Helios. Données réinitialisables à tout moment.</p>
            <Link to="/demo" className="inline-flex mt-3 items-center gap-2 bg-[#E7D5A8] text-[#16130E] text-[13px] font-bold px-4 py-2 rounded-full hover:bg-white transition">Lancer le parcours <Sparkles size={14} /></Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-[11px] text-[#8b8171] font-mono">PACTE © 2026 — Prototype fonctionnel · Signature prête à connecter (eIDAS) · Aucune donnée ne quitte ce navigateur</div>
      </footer>
    </div>
  );
}

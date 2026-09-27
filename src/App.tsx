import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PacteProvider } from './lib/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Univers from './pages/Univers';
import Creer from './pages/Creer';
import Contrats from './pages/Contrats';
import ContratDetail from './pages/ContratDetail';
import Signature from './pages/Signature';
import Alertes from './pages/Alertes';
import Espaces from './pages/Espaces';
import ReglesIA from './pages/ReglesIA';
import Demo from './pages/Demo';

export default function App() {
  return (
    <PacteProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/univers" element={<Univers />} />
            <Route path="/creer" element={<Creer />} />
            <Route path="/contrats" element={<Contrats />} />
            <Route path="/contrat/:id" element={<ContratDetail />} />
            <Route path="/contrat/:id/signer" element={<Signature />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/espaces" element={<Espaces />} />
            <Route path="/regles-ia" element={<ReglesIA />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PacteProvider>
  );
}

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Inicio from './pages/Inicio';
import Roteiros from './pages/Roteiros';
import ChatIA from './pages/ChatIA';

// A biblioteca de QR é pesada; só é descarregada quando o visitante abre a caça ao tesouro.
const CacaTesouro = lazy(() => import('./pages/CacaTesouro'));

export default function App() {
  return (
    <div className="app">
      <header className="cabecalho">
        <div>
          <h1>MNSR</h1>
          <p>Soares dos Reis</p>
        </div>
      </header>
      <Suspense fallback={<main><p className="suave">A carregar…</p></main>}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/roteiros" element={<Roteiros />} />
          <Route path="/tesouro" element={<CacaTesouro />} />
          <Route path="/chat" element={<ChatIA />} />
        </Routes>
      </Suspense>
      <NavBar />
    </div>
  );
}

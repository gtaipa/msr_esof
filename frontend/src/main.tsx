import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { OBRAS } from './data/acervo';
import { TesouroProvider } from './services/TesouroContext';
import { criarServicoTesouroProvisorio } from './services/tesouroProvisorio';
import './styles.css';

// Trocar pela implementação do Zé quando estiver pronta.
const servicoTesouro = criarServicoTesouroProvisorio(new Set(OBRAS.map((o) => o.id)));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TesouroProvider servico={servicoTesouro}>
        <App />
      </TesouroProvider>
    </BrowserRouter>
  </StrictMode>,
);

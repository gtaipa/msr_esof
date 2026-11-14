import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TesouroProvider } from './services/TesouroContext';
import { criarServicoTesouroApiPadrao } from './services/tesouroApi';
import './styles.css';

// Trocar pela implementação do Zé quando estiver pronta.
const servicoTesouro = criarServicoTesouroApiPadrao();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TesouroProvider servico={servicoTesouro}>
        <App />
      </TesouroProvider>
    </BrowserRouter>
  </StrictMode>,
);

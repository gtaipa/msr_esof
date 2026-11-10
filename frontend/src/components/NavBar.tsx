import { NavLink } from 'react-router-dom';

// Ícones SVG simples, em vez de uma biblioteca externa por CDN (que não funciona offline).
const icones = {
  inicio: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  roteiros: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  tesouro: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2',
  chat: 'M4 5h16v11H8l-4 4z',
};

const itens = [
  { para: '/', nome: 'Início', icone: icones.inicio },
  { para: '/roteiros', nome: 'Roteiros', icone: icones.roteiros },
  { para: '/tesouro', nome: 'Tesouro', icone: icones.tesouro },
  { para: '/chat', nome: 'Chat IA', icone: icones.chat },
];

export default function NavBar() {
  return (
    <nav className="navegacao" aria-label="Navegação principal">
      <ul>
        {itens.map((item) => (
          <li key={item.para}>
            <NavLink to={item.para} end={item.para === '/'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d={item.icone} />
              </svg>
              {item.nome}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

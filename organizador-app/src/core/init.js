import { DB } from './store.js';
import { updateMonthLabel } from './utils.js';
import { renderDashboard } from '../features/dashboard/dashboard.js';

export function initApp() {
  const cfg = DB.config || {};

  // Restaura nome na sidebar
  const nome = (cfg.nome || '').trim();
  document.getElementById('userName').textContent = nome || 'Usuário';

  // Restaura avatar inferior (iniciais do usuário) — logo superior NUNCA muda
  document.getElementById('avatarEl').textContent = cfg.iniciais || 'OA';

  // Restaura cor de destaque
  if (cfg.accent) {
    document.documentElement.style.setProperty('--green', cfg.accent);
  }

  // Inicializa navegação e dashboard
  updateMonthLabel();
  renderDashboard();
}

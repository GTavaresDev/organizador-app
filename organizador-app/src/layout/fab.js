import { openAddModal } from '../shared/modal/modal.js';

export function mountFab() {
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.title = 'Novo Lançamento';
  fab.textContent = '+';
  fab.addEventListener('click', () => openAddModal());
  document.body.appendChild(fab);
}

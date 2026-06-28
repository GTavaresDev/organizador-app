import { changeMonth } from '../core/navigation.js';
import { openAddModal } from '../shared/modal/modal.js';

import topbarHtml from './topbar.html?raw';

export function mountTopbar(container) {
  container.insertAdjacentHTML('beforeend', topbarHtml);

  document.querySelector('.menu-tog')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.querySelectorAll('.mnav-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => changeMonth(i === 0 ? -1 : 1));
  });

  document.getElementById('btn-add-lancamento')?.addEventListener('click', () => openAddModal());
}

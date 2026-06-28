import { nav } from '../core/navigation.js';

import sidebarHtml from './sidebar.html?raw';

export function mountSidebar(container) {
  container.insertAdjacentHTML('beforeend', sidebarHtml);

  const sidebar = document.getElementById('sidebar');
  sidebar.addEventListener('click', (e) => {
    const item = e.target.closest('[data-page]');
    if (!item) return;
    const configNav = document.querySelector('.nav-item[data-page="config"]');
    if (item.classList.contains('user-row')) {
      nav('config', configNav);
      return;
    }
    if (item.classList.contains('nav-item')) {
      nav(item.dataset.page, item);
    }
  });
}

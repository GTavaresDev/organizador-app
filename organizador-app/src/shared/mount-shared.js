import { closeOverlay } from '../shared/modal/modal.js';

import modalHtml from '../shared/modal/modal.html?raw';
import toastHtml from '../shared/toast.html?raw';

export function mountShared() {
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.insertAdjacentHTML('beforeend', toastHtml);

  document.getElementById('overlay')?.addEventListener('click', closeOverlay);
  document.querySelector('.close-btn')?.addEventListener('click', () => closeOverlay());
}

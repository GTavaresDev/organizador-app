import { PAGE_TITLES } from './constants.js';
import { state } from './state.js';
import { monthLabel, updateMonthLabel } from './utils.js';
import { renderPage, renderAll } from './render-registry.js';

export { renderPage, renderAll };

export function nav(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
  document.getElementById('pageTitle').textContent = PAGE_TITLES[id] || id;
  document.getElementById('sidebar').classList.remove('open');
  state.curPage = id;
  const mn = document.getElementById('monthNav');
  mn.style.display = (id === 'config' || id === 'simulacao') ? 'none' : 'flex';
  renderPage(id);
}

export function changeMonth(dir) {
  state.curMonth += dir;
  if (state.curMonth > 11) { state.curMonth = 0; state.curYear++; }
  if (state.curMonth < 0) { state.curMonth = 11; state.curYear--; }
  updateMonthLabel();
  renderAll();
}

export function getNavItemByPage(page) {
  return document.querySelector(`.nav-item[data-page="${page}"]`);
}

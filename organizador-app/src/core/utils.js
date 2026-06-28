import { DB } from './store.js';
import { MONTHS } from './constants.js';
import { state } from './state.js';

export function fmt(v) {
  const s = DB.config.moeda || 'R$';
  return s + ' ' + Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtShort(v) {
  return (DB.config.moeda || 'R$') + ' ' + (Math.abs(v) >= 1000
    ? (Math.abs(v) / 1000).toFixed(1) + 'k'
    : Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 0 }));
}

export function uid() {
  return Date.now() + Math.random().toString(36).slice(2);
}

export function mkey(m, y) {
  return y + '-' + String(m + 1).padStart(2, '0');
}

export function mkey2(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return mkey(d.getMonth(), d.getFullYear());
}

export function itemInMonth(item, m, y) {
  if (!item.data) return false;
  return mkey2(item.data) === mkey(m, y);
}

export function monthLabel() {
  return MONTHS[state.curMonth] + ' ' + state.curYear;
}

export function updateMonthLabel() {
  document.getElementById('mnav-label').textContent = monthLabel();
}

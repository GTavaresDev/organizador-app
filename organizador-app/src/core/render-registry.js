import { state } from './state.js';

const RENDERERS = {};

export function registerRenderer(id, fn) {
  RENDERERS[id] = fn;
}

export function renderPage(id) {
  RENDERERS[id]?.();
}

export function renderAll() {
  renderPage(state.curPage);
}

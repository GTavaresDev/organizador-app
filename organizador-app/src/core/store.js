import { CONFIG_DEFAULTS } from './constants.js';

export function defData() {
  return {
    receitas: [],
    gastos: [],
    investimentos: [],
    metas: [],
    cartoes: [],
    assinaturas: [],
    config: {
      nome: 'OrganizaApp+',
      iniciais: 'OA+',
      moeda: 'R$',
      orcamento: 5000,
      metaEco: 20,
      accent: '#00e5a0',
    },
  };
}

export function gerarIniciais(nome) {
  if (!nome) return '??';
  const partes = nome.trim().split(' ');
  const iniciais = partes.length > 1
    ? partes[0][0] + partes[partes.length - 1][0]
    : partes[0][0];
  return iniciais.toUpperCase();
}

export function save() {
  try {
    localStorage.setItem('organizaapp_db', JSON.stringify(DB));
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

export function load() {
  try {
    const raw = localStorage.getItem('organizaapp_db');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    parsed.config = Object.assign({}, CONFIG_DEFAULTS, parsed.config || {});
    return parsed;
  } catch (e) {
    console.error('Erro ao carregar:', e);
    return null;
  }
}

export let DB = load() || defData();

export function setDB(data) {
  DB = data;
}

import './styles/index.css';

import { registerRenderer } from './core/render-registry.js';
import { registerGlobals } from './core/globals.js';
import { initApp } from './core/init.js';
import { mountSidebar } from './layout/sidebar.js';
import { mountTopbar } from './layout/topbar.js';
import { mountFab } from './layout/fab.js';
import { mountShared } from './shared/mount-shared.js';

import { renderDashboard } from './features/dashboard/dashboard.js';
import { renderReceitas } from './features/receitas/receitas.js';
import { renderGastos } from './features/gastos/gastos.js';
import { renderInvestimentos } from './features/investimentos/investimentos.js';
import { renderMetas } from './features/metas/metas.js';
import { renderCartoes } from './features/cartoes/cartoes.js';
import { renderAssinaturas } from './features/assinaturas/assinaturas.js';
import { renderAnual } from './features/anual/anual.js';
import { calcSim } from './features/simulacao/simulacao.js';
import { renderConfig } from './features/config/config.js';

import dashboardHtml from './features/dashboard/dashboard.html?raw';
import receitasHtml from './features/receitas/receitas.html?raw';
import gastosHtml from './features/gastos/gastos.html?raw';
import investimentosHtml from './features/investimentos/investimentos.html?raw';
import metasHtml from './features/metas/metas.html?raw';
import cartoesHtml from './features/cartoes/cartoes.html?raw';
import assinaturasHtml from './features/assinaturas/assinaturas.html?raw';
import anualHtml from './features/anual/anual.html?raw';
import simulacaoHtml from './features/simulacao/simulacao.html?raw';
import configHtml from './features/config/config.html?raw';

function mountFeatures(content) {
  const pages = [
    dashboardHtml, receitasHtml, gastosHtml, investimentosHtml,
    metasHtml, cartoesHtml, assinaturasHtml, anualHtml,
    simulacaoHtml, configHtml,
  ];
  pages.forEach(html => content.insertAdjacentHTML('beforeend', html));
}

function registerRenderers() {
  registerRenderer('dashboard', renderDashboard);
  registerRenderer('receitas', renderReceitas);
  registerRenderer('gastos', renderGastos);
  registerRenderer('investimentos', renderInvestimentos);
  registerRenderer('metas', renderMetas);
  registerRenderer('cartoes', renderCartoes);
  registerRenderer('assinaturas', renderAssinaturas);
  registerRenderer('anual', renderAnual);
  registerRenderer('simulacao', calcSim);
  registerRenderer('config', renderConfig);
}

function bootstrap() {
  const app = document.getElementById('app');

  mountSidebar(app);

  const main = document.createElement('div');
  main.className = 'main';
  main.innerHTML = '<div class="content"></div>';
  app.appendChild(main);

  mountTopbar(main);

  const content = main.querySelector('.content');
  mountFeatures(content);

  mountFab();
  mountShared();
  registerGlobals();
  registerRenderers();
  initApp();
}

bootstrap();

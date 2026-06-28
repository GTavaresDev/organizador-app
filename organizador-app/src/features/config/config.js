import { DB, save, defData, setDB, gerarIniciais } from '../../core/store.js';
import { CONFIG_DEFAULTS } from '../../core/constants.js';
import { toast } from '../../shared/toast.js';
import { renderAll, renderPage } from '../../core/render-registry.js';
import { state } from '../../core/state.js';

export function renderConfig() {
  const cfg = DB.config || {};

  document.getElementById('cfg-nome').value      = cfg.nome      || '';
  document.getElementById('cfg-moeda').value     = cfg.moeda     || 'R$';
  document.getElementById('cfg-orcamento').value = cfg.orcamento || 5000;
  document.getElementById('cfg-meta-eco').value  = cfg.metaEco   || 20;

  // Campo de iniciais: mostra as iniciais salvas (automáticas ou manuais)
  const cfgInic = document.getElementById('cfg-iniciais');
  cfgInic.value       = cfg.iniciais || '';
  cfgInic.placeholder = 'ex: JS';

  // Marca a cor ativa
  const accent = cfg.accent || '#00e5a0';
  document.querySelectorAll('#color-opts div').forEach(d => {
    d.style.border = (d.style.background.replace(/\s/g,'') === accent.replace(/\s/g,''))
      ? '2px solid #fff'
      : '2px solid transparent';
  });
}

export function applyConfig() {
  const nome    = document.getElementById('cfg-nome').value;
  const moeda   = document.getElementById('cfg-moeda').value;
  const orc     = Number(document.getElementById('cfg-orcamento').value || 0);
  const metaEco = Number(document.getElementById('cfg-meta-eco').value || 0);

  // Iniciais do avatar: usa campo manual se preenchido, senão gera do nome
  const manualIniciais = (document.getElementById('cfg-iniciais').value || '').trim().toUpperCase();
  const iniciais = nome.trim()
    ? (manualIniciais || gerarIniciais(nome.trim()))
    : 'OA';

  // Persiste no DB
  DB.config.nome      = nome;
  DB.config.iniciais  = iniciais;
  DB.config.moeda     = moeda;
  DB.config.orcamento = orc;
  DB.config.metaEco   = metaEco;

  // Atualiza SOMENTE o avatar inferior e o nome — logo superior nunca muda
  document.getElementById('avatarEl').textContent = iniciais;
  document.getElementById('userName').textContent = nome.trim() || 'Usuário';

  save();
}

export function validarNomeAoSair() {
  const input = document.getElementById('cfg-nome');
  if (!input.value.trim()) {
    DB.config.nome     = '';
    DB.config.iniciais = 'OA';
    document.getElementById('avatarEl').textContent = 'OA';
    document.getElementById('userName').textContent = 'Usuário';
    const cfgInic = document.getElementById('cfg-iniciais');
    if (cfgInic) { cfgInic.value = ''; cfgInic.placeholder = 'ex: JS'; }
    save();
  }
}

export function setAccent(color,el){
  DB.config.accent=color;
  document.querySelectorAll('#color-opts div').forEach(d=>d.style.border='2px solid transparent');
  el.style.border='2px solid #fff';
  document.documentElement.style.setProperty('--green',color);
  save();toast('Cor atualizada!');
}

export function exportData(){
  const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='finflow-backup.json';a.click();toast('Backup exportado!');
}

export function importData(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const parsed = JSON.parse(ev.target.result);
      // Migração segura dos dados importados
      const defaults = {nome:'OrganizaApp+', iniciais:'OA', moeda:'R$', orcamento:5000, metaEco:20, accent:'#00e5a0'};
      parsed.config = Object.assign({}, defaults, parsed.config || {});
      setDB(parsed);
      save();
      // Restaura a UI com os dados importados
      const cfg = DB.config;
      document.getElementById('avatarEl').textContent = cfg.iniciais || 'OA';
      document.getElementById('userName').textContent = (cfg.nome || '').trim() || 'Usuário';
      if (cfg.accent) document.documentElement.style.setProperty('--green', cfg.accent);
      renderAll();
      renderConfig();
      toast('Dados importados com sucesso!');
    } catch(err) {
      toast('Erro ao importar: arquivo inválido', 'var(--red)');
    }
  };
  r.readAsText(f);
}

export function clearAllData() {
  if (!confirm('Apagar TODOS os dados permanentemente? Esta ação não pode ser desfeita.')) return;
  setDB(defData());
  save();
  // Restaura UI para o estado inicial
  document.getElementById('avatarEl').textContent = 'OA';
  document.getElementById('userName').textContent = 'Usuário';
  document.documentElement.style.setProperty('--green', '#00e5a0');
  renderAll();
  renderConfig();
  toast('Todos os dados apagados', 'var(--red)');
}


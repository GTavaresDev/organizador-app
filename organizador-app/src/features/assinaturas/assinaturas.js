import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderAssinaturas(){
  const items=DB.assinaturas;
  const ativas=items.filter(a=>a.status==='Ativa');
  const mes=ativas.reduce((a,s)=>a+s.valor,0);
  const ano=mes*12;
  document.getElementById('a-mes').textContent=fmt(mes);
  document.getElementById('a-ano').textContent=fmt(ano);
  document.getElementById('a-ativas').textContent=ativas.length;
  document.getElementById('a-pausadas').textContent=items.filter(a=>a.status==='Pausada').length;

  const box=document.getElementById('tbl-assinaturas');
  if(items.length===0){box.innerHTML='<div class="empty"><div class="empty-ico">🔄</div><div class="empty-txt">Nenhuma assinatura cadastrada</div></div>';return;}
  box.innerHTML=`<table class="tbl"><thead><tr><th>Serviço</th><th>Categoria</th><th>Valor/Mês</th><th>Dia Vcto</th><th>Anual</th><th>Status</th><th></th></tr></thead><tbody>${items.map(a=>`<tr><td>${a.nome}</td><td>${a.categoria}</td><td class="tr fw7">${fmt(a.valor)}</td><td>${a.diaVcto||'–'}</td><td class="ta">${fmt(a.valor*12)}</td><td><span class="status ${a.status==='Ativa'?'s-paid':'s-pend'}">${a.status}</span></td><td><div class="tbl-actions"><button class="act-btn act-edit" onclick="editItem('assinatura','${a.id}')">✎</button><button class="act-btn act-del" onclick="delItem('assinatura','${a.id}')">✕</button></div></td></tr>`).join('')}</tbody></table>`;
}

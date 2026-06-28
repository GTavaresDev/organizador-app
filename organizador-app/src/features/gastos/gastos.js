import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderGastos(){
  const items=DB.gastos.filter(g=>itemInMonth(g,state.curMonth,state.curYear));
  const pago=items.filter(g=>g.status==='Pago').reduce((a,g)=>a+g.valor,0);
  const pend=items.filter(g=>g.status==='Pendente').reduce((a,g)=>a+g.valor,0);
  const maxG=items.length?Math.max(...items.map(g=>g.valor)):0;
  document.getElementById('g-pago').textContent=fmt(pago);
  document.getElementById('g-pend').textContent=fmt(pend);
  document.getElementById('g-max').textContent=fmt(maxG);
  document.getElementById('g-count').textContent=items.length;

  const box=document.getElementById('tbl-gastos');
  if(items.length===0){box.innerHTML='<div class="empty"><div class="empty-ico">📉</div><div class="empty-txt">Nenhum gasto em '+monthLabel()+'</div></div>';}
  else box.innerHTML=`<table class="tbl"><thead><tr><th>Nome</th><th>Categoria</th><th>Valor</th><th>Data</th><th>Vencimento</th><th>Prioridade</th><th>Status</th><th></th></tr></thead><tbody>${items.map(g=>`<tr><td>${g.nome}</td><td>${g.categoria}</td><td class="tr fw7">${fmt(g.valor)}</td><td>${g.data||'–'}</td><td>${g.vencimento||'–'}</td><td><span class="pill ${g.prioridade==='Alta'?'pill-r':g.prioridade==='Média'?'pill-a':'pill-g'}">${g.prioridade}</span></td><td><span class="status ${g.status==='Pago'?'s-paid':'s-pend'}">${g.status}</span></td><td><div class="tbl-actions"><button class="act-btn act-edit" onclick="editItem('gasto','${g.id}')">✎</button><button class="act-btn act-del" onclick="delItem('gasto','${g.id}')">✕</button></div></td></tr>`).join('')}</tbody></table>`;

  const catMap={};items.forEach(g=>{catMap[g.categoria]=(catMap[g.categoria]||0)+g.valor;});
  const cl=Object.keys(catMap);const cv=cl.map(k=>catMap[k]);
  mkChart('cGasBars',{type:'bar',data:{labels:cl,datasets:[{data:cv,backgroundColor:cl.map((_,i)=>`rgba(255,77,109,${0.9-i*0.08})`),borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});

  const prioBox=document.getElementById('g-prio-bars');
  const alta=items.filter(g=>g.prioridade==='Alta').reduce((a,g)=>a+g.valor,0);
  const media=items.filter(g=>g.prioridade==='Média').reduce((a,g)=>a+g.valor,0);
  const baixa=items.filter(g=>g.prioridade==='Baixa').reduce((a,g)=>a+g.valor,0);
  const tot=alta+media+baixa||1;
  prioBox.innerHTML=[['🔴 Alta',alta,'var(--red)'],['🟡 Média',media,'var(--amber)'],['🟢 Baixa',baixa,'var(--green)']].map(([l,v,c])=>`<div style="margin-bottom:12px"><div class="flex ic ib mb8"><span class="fs13">${l}</span><span class="fw7" style="color:${c}">${fmt(v)}</span></div><div class="prog-bar"><div class="prog-fill" style="width:${(v/tot*100).toFixed(1)}%;background:${c}"></div></div></div>`).join('');
}

import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderCartoes(){
  const items=DB.cartoes;
  const grid=document.getElementById('grid-cartoes');
  const gradients=['linear-gradient(135deg,#1a1d2e,#252840)','linear-gradient(135deg,#1a2030,#25304a)','linear-gradient(135deg,#1a2820,#203a2a)'];
  if(items.length===0){grid.innerHTML='<div class="card" style="grid-column:1/-1"><div class="empty"><div class="empty-ico">💳</div><div class="empty-txt">Nenhum cartão cadastrado</div></div></div>';}
  else grid.innerHTML=items.map((c,i)=>{
    const pct=c.limiteTotal>0?(c.limiteUsado/c.limiteTotal*100):0;
    const color=pct>80?'var(--red)':pct>50?'var(--amber)':'var(--green)';
    const risco=pct>80?'🔴 Risco Alto':pct>50?'🟡 Risco Médio':'🟢 Risco Baixo';
    return`<div class="cc" style="background:${gradients[i%gradients.length]};border:1px solid var(--border2)"><div><div class="cc-bank">${c.banco}</div><div class="cc-name">${c.nome}</div></div><div><div class="cc-num">•••• •••• •••• ${c.ultimos4||'0000'}</div><div class="cc-meta"><span>Vence ${c.vencimento}</span><span>Fecha ${c.fechamento}</span><span>${c.bandeira||'Visa'}</span></div><div style="margin-top:10px"><div class="flex ic ib mb8" style="font-size:11px;color:var(--muted)"><span>${fmt(c.limiteUsado)} / ${fmt(c.limiteTotal)}</span><span style="color:${color};font-weight:700">${pct.toFixed(0)}% usado</span></div><div class="prog-bar"><div class="prog-fill" style="width:${Math.min(100,pct)}%;background:${color}"></div></div></div><div style="margin-top:10px;display:flex;gap:6px;align-items:center"><span class="pill pill-${pct>80?'r':pct>50?'a':'g'}">${risco}</span><button class="act-btn act-edit" style="margin-left:auto" onclick="editItem('cartao','${c.id}')">✎</button><button class="act-btn act-del" onclick="delItem('cartao','${c.id}')">✕</button></div></div></div>`;
  }).join('');

  // chart + table
  if(items.length>0){
    mkChart('cCartoes',{type:'bar',data:{labels:items.map(c=>c.nome),datasets:[{label:'Usado',data:items.map(c=>c.limiteUsado),backgroundColor:'rgba(255,77,109,0.7)',borderRadius:5,borderSkipped:false},{label:'Disponível',data:items.map(c=>c.limiteTotal-c.limiteUsado),backgroundColor:'rgba(255,255,255,0.06)',borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,grid:{color:'rgba(255,255,255,0.04)'}}}}});
    const fat=document.getElementById('tbl-faturas');
    fat.innerHTML=`<table class="tbl"><thead><tr><th>Cartão</th><th>Fatura</th><th>Status</th></tr></thead><tbody>${items.map(c=>`<tr><td>${c.nome}</td><td class="tr fw7">${fmt(c.limiteUsado)}</td><td><span class="status ${c.statusFatura==='Fechada'?'s-paid':'s-pend'}">${c.statusFatura||'Aberta'}</span></td></tr>`).join('')}</tbody></table><div class="divider"></div><div class="flex ic ib fs13 fw6"><span>Total faturas</span><span class="tr">${fmt(items.reduce((a,c)=>a+c.limiteUsado,0))}</span></div>`;
  }else{document.getElementById('tbl-faturas').innerHTML='<div class="empty"><div class="empty-txt">Sem cartões</div></div>';}
}

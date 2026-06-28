import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderMetas(){
  const items=DB.metas;
  const aporte=items.reduce((a,m)=>a+m.aporteMes,0);
  const acum=items.reduce((a,m)=>a+m.acumulado,0);
  const prog=items.filter(m=>m.acumulado<m.valorTotal).length;
  document.getElementById('m-total').textContent=items.length;
  document.getElementById('m-prog').textContent=prog;
  document.getElementById('m-aporte').textContent=fmt(aporte);
  document.getElementById('m-acum').textContent=fmt(acum);

  const grid=document.getElementById('grid-metas');
  if(items.length===0){grid.innerHTML='<div class="card" style="grid-column:1/-1"><div class="empty"><div class="empty-ico">🎯</div><div class="empty-txt">Nenhuma meta cadastrada</div></div></div>';return;}
  const pColors=['#a07dff','#4d8aff','#00e5a0','#ffb84c','#00cfe8','#ff4d6d'];
  grid.innerHTML=items.map((m,idx)=>{
    const pct=m.valorTotal>0?(m.acumulado/m.valorTotal*100):0;
    const mesesRest=m.aporteMes>0?Math.ceil((m.valorTotal-m.acumulado)/m.aporteMes):0;
    const c=pColors[idx%pColors.length];
    const status=pct>=100?'✅ Concluída':pct>=75?'🔵 Quase lá!':pct>=50?'🟣 Em progresso':'🟡 Iniciada';
    return`<div class="goal-card"><div class="flex ic ib mb8"><span class="goal-emoji">${m.emoji||'🎯'}</span><span class="pill pill-${m.prioridade==='Alta'?'r':m.prioridade==='Média'?'a':'g'}">${m.prioridade}</span></div><div class="goal-name">${m.nome}</div><div class="goal-sub">${m.categoria}</div><div class="goal-pct" style="color:${c}">${pct.toFixed(0)}%</div><div class="prog-bar"><div class="prog-fill" style="width:${Math.min(100,pct)}%;background:${c}"></div></div><div class="goal-foot"><span>${fmt(m.acumulado)} / ${fmt(m.valorTotal)}</span><span class="ta">${mesesRest>0?mesesRest+' meses':status}</span></div><div style="display:flex;gap:6px;margin-top:10px"><button class="act-btn act-edit" style="flex:1;width:auto;padding:4px 10px;font-size:12px" onclick="editItem('meta','${m.id}')">✎ Editar</button><button class="act-btn act-del" style="flex:1;width:auto;padding:4px 10px;font-size:12px" onclick="delItem('meta','${m.id}')">✕</button></div></div>`;
  }).join('');
}

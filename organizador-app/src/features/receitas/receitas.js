import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderReceitas(){
  const items=DB.receitas.filter(r=>itemInMonth(r,state.curMonth,state.curYear));
  const recebido=items.filter(r=>r.status==='Recebido').reduce((a,r)=>a+r.valor,0);
  const pend=items.filter(r=>r.status==='Pendente').reduce((a,r)=>a+r.valor,0);
  const total=items.reduce((a,r)=>a+r.valor,0);
  document.getElementById('r-rec').textContent=fmt(recebido);
  document.getElementById('r-pend').textContent=fmt(pend);
  document.getElementById('r-total').textContent=fmt(total);
  document.getElementById('r-count').textContent=items.length;

  // table
  const box=document.getElementById('tbl-receitas');
  if(items.length===0){box.innerHTML='<div class="empty"><div class="empty-ico">📈</div><div class="empty-txt">Nenhuma receita em '+monthLabel()+'</div></div>';return;}
  box.innerHTML=`<table class="tbl"><thead><tr><th>Nome</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Data</th><th>Status</th><th></th></tr></thead><tbody>${items.map(r=>`<tr><td>${r.nome}</td><td>${r.categoria}</td><td>${r.tipo}</td><td class="tg fw7">${fmt(r.valor)}</td><td>${r.data||'–'}</td><td><span class="status ${r.status==='Recebido'?'s-paid':'s-pend'}">${r.status}</span></td><td><div class="tbl-actions"><button class="act-btn act-edit" onclick="editItem('receita','${r.id}')">✎</button><button class="act-btn act-del" onclick="delItem('receita','${r.id}')">✕</button></div></td></tr>`).join('')}</tbody></table>`;

  // charts
  const last6=[];for(let i=5;i>=0;i--){let m=state.curMonth-i,y=state.curYear;while(m<0){m+=12;y--;}last6.push({m,y,label:MONTHS[m].slice(0,3)});}
  mkChart('cRecLine',{type:'line',data:{labels:last6.map(x=>x.label),datasets:[{label:'Receitas',data:last6.map(({m,y})=>DB.receitas.filter(r=>itemInMonth(r,m,y)&&r.status==='Recebido').reduce((a,r)=>a+r.valor,0)),borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.07)',tension:0.4,fill:true,pointBackgroundColor:'#00e5a0',pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});
  const catMap={};items.forEach(r=>{catMap[r.categoria]=(catMap[r.categoria]||0)+r.valor;});
  const cl=Object.keys(catMap);
  mkChart('cRecCat',{type:'bar',data:{labels:cl,datasets:[{data:cl.map(k=>catMap[k]),backgroundColor:'rgba(0,229,160,0.75)',borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.04)'}},y:{grid:{display:false}}}}});
}

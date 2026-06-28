import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderInvestimentos(){
  const items=DB.investimentos;
  const total=items.reduce((a,i)=>a+i.valor,0);
  const reserva=items.filter(i=>i.tipo==='Reserva de Emergência').reduce((a,i)=>a+i.valor,0);
  const rend=items.reduce((a,i)=>a+i.valor*(i.rentabilidade||0)/100/12,0);
  document.getElementById('i-total').textContent=fmt(total);
  document.getElementById('i-res').textContent=fmt(reserva);
  document.getElementById('i-rend').textContent=fmt(rend)+'/mês';
  document.getElementById('i-count').textContent=items.length;

  const listBox=document.getElementById('list-inv');
  if(items.length===0){listBox.innerHTML='<div class="empty"><div class="empty-ico">💼</div><div class="empty-txt">Nenhum ativo cadastrado</div></div>';}
  else listBox.innerHTML=items.map(i=>`<div class="inv-item"><div class="inv-dot" style="background:var(--purple-bg)">💰</div><div class="inv-info"><div class="inv-name">${i.nome}</div><div class="inv-type">${i.tipo||'–'} • ${i.corretora||'–'} • ${i.rentabilidade||0}% a.a.</div></div><div class="inv-right"><div class="inv-val tp">${fmt(i.valor)}</div><div class="inv-ret tg">+${fmt(i.valor*(i.rentabilidade||0)/100/12)}/mês</div></div><div class="tbl-actions" style="opacity:1;margin-left:8px"><button class="act-btn act-edit" onclick="editItem('investimento','${i.id}')">✎</button><button class="act-btn act-del" onclick="delItem('investimento','${i.id}')">✕</button></div></div>`).join('');

  const last6=[];for(let i=5;i>=0;i--){let m=state.curMonth-i,y=state.curYear;while(m<0){m+=12;y--;}last6.push({label:MONTHS[m].slice(0,3)});}
  let cum=total*0.6;const patData=last6.map((_,i)=>{cum+=total*0.08;return Math.round(cum);});
  mkChart('cPatrimonio',{type:'line',data:{labels:last6.map(x=>x.label),datasets:[{label:'Patrimônio',data:patData,borderColor:'#a07dff',backgroundColor:'rgba(160,125,255,0.07)',tension:0.4,fill:true,pointBackgroundColor:'#a07dff',pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});

  const typeMap={};items.forEach(i=>{typeMap[i.tipo]=(typeMap[i.tipo]||0)+i.valor;});
  const tl=Object.keys(typeMap);
  mkChart('cCarteira',{type:'doughnut',data:{labels:tl,datasets:[{data:tl.map(k=>typeMap[k]),backgroundColor:CAT_COLORS.slice(0,tl.length),borderWidth:0,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{display:false}}}});
}

import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function renderDashboard(){
  const gastosMes=DB.gastos.filter(g=>itemInMonth(g,state.curMonth,state.curYear));
  const recMes=DB.receitas.filter(r=>itemInMonth(r,state.curMonth,state.curYear));
  const totalRec=recMes.filter(r=>r.status==='Recebido').reduce((a,r)=>a+r.valor,0);
  const totalGasto=gastosMes.filter(g=>g.status==='Pago').reduce((a,g)=>a+g.valor,0);
  const totalInv=DB.investimentos.reduce((a,i)=>a+i.valor,0);
  const reserva=DB.investimentos.filter(i=>i.tipo==='Reserva de Emergência').reduce((a,i)=>a+i.valor,0);
  const saldo=totalRec-totalGasto;
  const pctEco=totalRec>0?((saldo/totalRec)*100):0;
  const pendentes=gastosMes.filter(g=>g.status==='Pendente').length;

  // prev month
  let pm=state.curMonth-1,py=state.curYear;if(pm<0){pm=11;py--;}
  const prevRec=DB.receitas.filter(r=>itemInMonth(r,pm,py)&&r.status==='Recebido').reduce((a,r)=>a+r.valor,0);
  const prevGasto=DB.gastos.filter(g=>itemInMonth(g,pm,py)&&g.status==='Pago').reduce((a,g)=>a+g.valor,0);
  const prevSaldo=prevRec-prevGasto;

  document.getElementById('d-saldo').textContent=fmt(saldo);
  const saldoPct=prevSaldo!==0?Math.round((saldo-prevSaldo)/Math.abs(prevSaldo)*100):0;
  document.getElementById('d-saldo-pct').textContent=(saldoPct>=0?'▲':'▼')+Math.abs(saldoPct)+'%';
  document.getElementById('d-saldo-pct').className='pill '+(saldo>=0?'pill-g':'pill-r');

  document.getElementById('d-rec').textContent=fmt(totalRec);
  const recPct=prevRec!==0?Math.round((totalRec-prevRec)/prevRec*100):0;
  document.getElementById('d-rec-pct').textContent=(recPct>=0?'▲':'▼')+Math.abs(recPct)+'%';

  document.getElementById('d-desp').textContent=fmt(totalGasto);
  const despPct=prevGasto!==0?Math.round((totalGasto-prevGasto)/prevGasto*100):0;
  document.getElementById('d-desp-pct').textContent=(despPct<=0?'▼':'▲')+Math.abs(despPct)+'%';
  document.getElementById('d-desp-pct').className='pill '+(despPct<=0?'pill-g':'pill-r');

  document.getElementById('d-inv').textContent=fmt(totalInv);
  document.getElementById('d-eco').textContent=fmt(saldo);
  document.getElementById('d-eco-pct').textContent=pctEco.toFixed(1)+'%';
  document.getElementById('d-eco-pill').textContent=pctEco.toFixed(1)+'% economia';
  document.getElementById('d-res').textContent=fmt(reserva);
  const mesesRes=totalGasto>0?(reserva/totalGasto).toFixed(1):0;
  document.getElementById('d-res-sub').textContent=mesesRes+' meses cobertos';
  document.getElementById('d-pend').textContent=pendentes;

  // badge pendentes nav
  const badgeEl=document.getElementById('badge-gastos');
  if(pendentes>0){badgeEl.textContent=pendentes;badgeEl.style.display='inline';}
  else badgeEl.style.display='none';

  // saúde
  const score=pctEco>=30?5:pctEco>=20?4:pctEco>=10?3:pctEco>=0?2:1;
  const labels=['Crítica','Fraca','Regular','Boa','Ótima'];
  const saudeColors=['var(--red)','var(--red)','var(--amber)','var(--green)','var(--green)'];
  document.getElementById('d-saude').textContent=labels[score-1];
  document.getElementById('d-saude').style.color=saudeColors[score-1];
  const hdots=document.getElementById('d-hdots');
  hdots.innerHTML='';
  for(let i=0;i<5;i++){const d=document.createElement('div');d.className='hdot';d.style.background=i<score?saudeColors[score-1]:'var(--bg5)';hdots.appendChild(d);}

  // orçamento
  const orc=DB.config.orcamento||5000;
  const dispOrc=Math.max(0,orc-totalGasto);
  const pctOrc=orc>0?(totalGasto/orc)*100:0;
  document.getElementById('d-orc-total').textContent=fmt(orc);
  document.getElementById('d-orc-gasto').textContent=fmt(totalGasto);
  document.getElementById('d-orc-disp').textContent=fmt(dispOrc);
  const bar=document.getElementById('d-orc-bar');
  bar.style.width=Math.min(100,pctOrc)+'%';
  bar.style.background=pctOrc<70?'var(--green)':pctOrc<90?'var(--amber)':'var(--red)';
  const dot=document.getElementById('d-orc-dot'),msg=document.getElementById('d-orc-msg');
  if(pctOrc<70){dot.style.background='var(--green)';msg.style.color='var(--green)';msg.textContent='Seguro – Dentro do orçamento';}
  else if(pctOrc<90){dot.style.background='var(--amber)';msg.style.color='var(--amber)';msg.textContent='Atenção – Próximo do limite';}
  else{dot.style.background='var(--red)';msg.style.color='var(--red)';msg.textContent='Alerta – Orçamento excedido!';}

  // alertas
  const alertas=[];
  gastosMes.filter(g=>g.status==='Pendente').slice(0,3).forEach(g=>alertas.push({t:'w',m:'Pendente: '+g.nome+' – '+fmt(g.valor)}));
  if(pctOrc>=90)alertas.push({t:'d',m:'Orçamento quase esgotado! '+fmt(dispOrc)+' restante'});
  const metaEco=DB.config.metaEco||20;
  if(totalRec>0&&pctEco<metaEco&&totalRec>0)alertas.push({t:'w',m:'Economia ('+pctEco.toFixed(1)+'%) abaixo da meta ('+metaEco+'%)'});
  DB.metas.forEach(m=>{const pct=m.valorTotal>0?m.acumulado/m.valorTotal*100:0;if(pct>=75&&pct<100)alertas.push({t:'s',m:'Meta "'+m.nome+'" está em '+pct.toFixed(0)+'%! Quase lá!'});});
  const alertBox=document.getElementById('d-alertas');
  if(alertas.length===0){alertBox.innerHTML='<div class="empty"><div class="empty-ico">✅</div><div class="empty-txt">Nenhum alerta!</div></div>';}
  else{alertBox.innerHTML=alertas.map(a=>`<div class="alert alert-${a.t}">${a.m}</div>`).join('');}

  // ranking
  const sorted=[...gastosMes].sort((a,b)=>b.valor-a.valor).slice(0,5);
  const rankBox=document.getElementById('d-rank');
  if(sorted.length===0)rankBox.innerHTML='<div class="empty"><div class="empty-ico">📊</div><div class="empty-txt">Sem gastos este mês</div></div>';
  else rankBox.innerHTML=sorted.map((g,i)=>`<div class="rank-item"><span class="rank-n">${i+1}</span><div class="rank-info"><div class="rank-name">${g.nome}</div><div class="rank-cat">${g.categoria}</div></div><span class="rank-val">${fmt(g.valor)}</span></div>`).join('');

  // distribuição bars
  const barsBox=document.getElementById('d-bars');
  const totalG=gastosMes.reduce((a,g)=>a+g.valor,0)||1;
  const barsData=[{l:'Gastos',v:totalGasto,c:'var(--red)',t:totalRec||1},{l:'Economia',v:Math.max(0,saldo),c:'var(--green)',t:totalRec||1},{l:'Investido',v:totalInv,c:'var(--purple)',t:totalRec||1}];
  barsBox.innerHTML=barsData.map(b=>{const p=Math.min(100,(b.v/b.t*100)).toFixed(1);return`<div style="margin-bottom:12px"><div class="flex ic ib" style="margin-bottom:5px"><span class="fs12">${b.l}</span><span class="fs12 fw6" style="color:${b.c}">${p}%</span></div><div class="prog-bar"><div class="prog-fill" style="width:${p}%;background:${b.c}"></div></div></div>`;}).join('');

  // charts
  const last6=[];for(let i=5;i>=0;i--){let m=state.curMonth-i,y=state.curYear;while(m<0){m+=12;y--;}last6.push({m,y,label:MONTHS[m].slice(0,3)});}
  const recData=last6.map(({m,y})=>DB.receitas.filter(r=>itemInMonth(r,m,y)&&r.status==='Recebido').reduce((a,r)=>a+r.valor,0));
  const gData=last6.map(({m,y})=>DB.gastos.filter(g=>itemInMonth(g,m,y)&&g.status==='Pago').reduce((a,g)=>a+g.valor,0));
  mkChart('cRecDesp',{type:'bar',data:{labels:last6.map(x=>x.label),datasets:[{label:'Receitas',data:recData,backgroundColor:'rgba(77,138,255,0.7)',borderRadius:5,borderSkipped:false},{label:'Despesas',data:gData,backgroundColor:'rgba(255,77,109,0.7)',borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});

  // pizza
  const catMap={};gastosMes.forEach(g=>{catMap[g.categoria]=(catMap[g.categoria]||0)+g.valor;});
  const catLabels=Object.keys(catMap);const catVals=catLabels.map(k=>catMap[k]);
  mkChart('cPizza',{type:'doughnut',data:{labels:catLabels,datasets:[{data:catVals,backgroundColor:CAT_COLORS.slice(0,catLabels.length),borderWidth:0,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{display:false}}}});
}

import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';
import { nowDate } from '../../core/state.js';

export function renderAnual(){
  document.getElementById('an-year').textContent=state.curYear;
  const months=MONTHS.map((_,i)=>{
    const rec=DB.receitas.filter(r=>itemInMonth(r,i,state.curYear)&&r.status==='Recebido').reduce((a,r)=>a+r.valor,0);
    const gasto=DB.gastos.filter(g=>itemInMonth(g,i,state.curYear)&&g.status==='Pago').reduce((a,g)=>a+g.valor,0);
    const inv=DB.investimentos.reduce((_,__)=>0,0);// Global investimentos
    return{label:MONTHS[i].slice(0,3),rec,gasto,inv:0,saldo:rec-gasto,eco:rec>0?((rec-gasto)/rec*100):0};
  });
  const totalRec=months.reduce((a,m)=>a+m.rec,0);
  const totalGasto=months.reduce((a,m)=>a+m.gasto,0);
  const totalInv=DB.investimentos.reduce((a,i)=>a+i.valor,0);
  document.getElementById('an-rec').textContent=fmt(totalRec);
  document.getElementById('an-gasto').textContent=fmt(totalGasto);
  document.getElementById('an-inv').textContent=fmt(totalInv);
  document.getElementById('an-eco').textContent=fmt(totalRec-totalGasto);

  mkChart('cAnual',{type:'line',data:{labels:months.map(m=>m.label),datasets:[{label:'Receitas',data:months.map(m=>m.rec),borderColor:'#4d8aff',backgroundColor:'rgba(77,138,255,0.06)',tension:0.4,fill:true,pointBackgroundColor:'#4d8aff',pointRadius:3},{label:'Despesas',data:months.map(m=>m.gasto),borderColor:'#ff4d6d',backgroundColor:'rgba(255,77,109,0.06)',tension:0.4,fill:true,pointBackgroundColor:'#ff4d6d',pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(255,255,255,0.04)'}}}}});

  const tbody=document.getElementById('tbl-anual');
  tbody.innerHTML=months.map((m,i)=>i>state.curMonth&&state.curYear===nowDate.getFullYear()?`<tr><td>${MONTHS[i]}</td><td colspan="5" class="tm" style="font-style:italic">Mês futuro</td></tr>`:`<tr><td>${MONTHS[i]}</td><td class="tg fw6">${m.rec?fmt(m.rec):'–'}</td><td class="tr fw6">${m.gasto?fmt(m.gasto):'–'}</td><td class="tp">–</td><td class="${m.saldo>=0?'tg':'tr'} fw7">${m.rec||m.gasto?fmt(m.saldo):'–'}</td><td class="${m.eco>=20?'tg':m.eco>0?'ta':'tm'}">${m.rec?m.eco.toFixed(1)+'%':'–'}</td></tr>`).join('');
}

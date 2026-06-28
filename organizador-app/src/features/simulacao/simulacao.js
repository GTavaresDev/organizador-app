import { DB } from '../../core/store.js';
import { state } from '../../core/state.js';
import { MONTHS, CAT_COLORS } from '../../core/constants.js';
import { fmt, fmtShort, uid, itemInMonth, monthLabel } from '../../core/utils.js';
import { mkChart } from '../../core/charts.js';

export function calcSim(){
  const cap=parseFloat(document.getElementById('simCap').value)||0;
  const ap=parseFloat(document.getElementById('simAp').value)||0;
  const taxa=parseFloat(document.getElementById('simTaxa').value)||0;
  const m=Math.min(600,parseInt(document.getElementById('simMeses').value)||1);
  const t=taxa/100;
  const labels=[],datAp=[],datPat=[];
  let pat=cap,totAp=cap;
  for(let i=1;i<=m;i++){pat=pat*(1+t)+ap;totAp=cap+(ap*i);labels.push(i%Math.ceil(m/8)===0||i===1||i===m?'M'+i:'');datAp.push(Math.round(totAp));datPat.push(Math.round(pat));}
  const f=v=>fmt(Math.round(v));
  document.getElementById('sAp').textContent=f(totAp);
  document.getElementById('sPat').textContent=f(pat);
  document.getElementById('sRend').textContent=f(pat-totAp);
  const sc=(r)=>{let p=cap;for(let i=0;i<24;i++)p=p*(1+r/100)+ap;return f(p);};
  document.getElementById('sCons').textContent=sc(0.6);
  document.getElementById('sMod').textContent=sc(0.9);
  document.getElementById('sAgr').textContent=sc(1.5);
  mkChart('cSim',{type:'line',data:{labels,datasets:[{label:'Patrimônio',data:datPat,borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.07)',tension:0.4,fill:true,pointRadius:0},{label:'Aportado',data:datAp,borderColor:'#4d8aff',borderDash:[4,4],tension:0.4,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{maxTicksLimit:8}},y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{callback:v=>{const m=DB.config.moeda||'R$';return m+' '+(v>=1000?(v/1000).toFixed(0)+'k':v);}}}}}});
}

import { DB, save } from '../../core/store.js';
import { state } from '../../core/state.js';
import { uid, itemInMonth } from '../../core/utils.js';
import { toast } from '../../shared/toast.js';
import { renderPage } from '../../core/render-registry.js';
import { renderDashboard } from '../../features/dashboard/dashboard.js';
import { FORMS } from './forms.js';
export function buildModal(type,data){
  const def=FORMS[type];
  if(!def)return;
  document.getElementById('modal-title').textContent=state.editId?(data.nome||'Editar'):def.title;
  let html='<div class="tabs">';
  Object.keys(FORMS).forEach(k=>{html+=`<div class="tab${k===type?' active':''}" onclick="switchModalType('${k}','${state.editId||''}')">${FORMS[k].title.replace('Novo ','').replace('Nova ','')}</div>`;});
  html+='</div><div class="form-grid">';
  def.fields.forEach(f=>{
    const v=data[f.id]!==undefined?data[f.id]:'';
    const cls=`fg${f.full?' full':''}`;
    if(f.type==='select'){
      html+=`<div class="${cls}"><label class="flabel">${f.label}</label><select class="finput" id="f-${f.id}">`;
      f.opts.forEach(o=>html+=`<option${v===o?' selected':''}>${o}</option>`);
      html+='</select></div>';
    }else{
      html+=`<div class="${cls}"><label class="flabel">${f.label}${f.req?'<span style="color:var(--red)">*</span>':''}</label><input class="finput" type="${f.type}" id="f-${f.id}" value="${v}" placeholder="${f.placeholder||''}"${f.maxlength?' maxlength="'+f.maxlength+'"':''}${f.type==='date'&&!v?' value="'+(new Date().toISOString().split('T')[0])+'"':''}></div>`;
    }
  });
  html+='</div><button class="topbar-btn btn-primary" style="width:100%;padding:12px;font-size:14px;margin-top:4px" onclick="saveItem()">✓ '+(state.editId?'Salvar Alterações':'Adicionar')+'</button>';
  document.getElementById('modal-body').innerHTML=html;
  document.getElementById('overlay').classList.add('open');
}

export function switchModalType(type,id){
  if(id){state.editId=id;state.editType=type;const map={receita:'receitas',gasto:'gastos',investimento:'investimentos',meta:'metas',cartao:'cartoes',assinatura:'assinaturas'};const item=DB[map[type]]?.find(x=>x.id===id)||{};buildModal(type,item);}
  else{state.editId=null;state.editType=type;buildModal(type,{});}
}

export function getField(id){const el=document.getElementById('f-'+id);return el?el.value:'';}

export function getNum(id){return parseFloat(getField(id))||0;}

export function saveItem(){
  const def=FORMS[state.editType];
  const req=def.fields.filter(f=>f.req);
  for(const f of req){if(!getField(f.id).trim()){toast('Preencha: '+f.label,'var(--red)');return;}}

  const map={receita:'receitas',gasto:'gastos',investimento:'investimentos',meta:'metas',cartao:'cartoes',assinatura:'assinaturas'};
  const arr=DB[map[state.editType]];

  const obj={};
  def.fields.forEach(f=>{
    if(['valor','valorTotal','acumulado','aporteMes','aporteMes','rentabilidade','parcelas','totalParcelas','limiteTotal','limiteUsado'].includes(f.id))obj[f.id]=getNum(f.id);
    else obj[f.id]=getField(f.id);
  });

  if(state.editId){
    const idx=arr.findIndex(x=>x.id===state.editId);
    if(idx>=0){arr[idx]={...arr[idx],...obj};}
    toast('Atualizado com sucesso!');
  }else{
    obj.id=uid();
    arr.push(obj);
    toast('Adicionado com sucesso!');
  }
  save();
  closeOverlay();
  renderPage(state.curPage);
  renderDashboard();
  // update badge
  const pend=DB.gastos.filter(g=>itemInMonth(g,state.curMonth,state.curYear)&&g.status==='Pendente').length;
  const b=document.getElementById('badge-gastos');
  if(pend>0){b.textContent=pend;b.style.display='inline';}else b.style.display='none';
}

export function delItem(type,id){
  if(!confirm('Remover este item?'))return;
  const map={receita:'receitas',gasto:'gastos',investimento:'investimentos',meta:'metas',cartao:'cartoes',assinatura:'assinaturas'};
  const arr=DB[map[type]];
  const idx=arr.findIndex(x=>x.id===id);
  if(idx>=0)arr.splice(idx,1);
  save();renderPage(state.curPage);toast('Removido','var(--amber)');
}

export function closeOverlay(e){
  if(!e||e.target===document.getElementById('overlay')){document.getElementById('overlay').classList.remove('open');}
}

export function openAddModal(type='receita'){state.editId=null;state.editType=type;buildModal(type,{});}

export function editItem(type,id){
  const map={receita:'receitas',gasto:'gastos',investimento:'investimentos',meta:'metas',cartao:'cartoes',assinatura:'assinaturas'};
  const item=DB[map[type]]?.find(x=>x.id===id);
  if(!item)return;
  state.editId=id;state.editType=type;buildModal(type,item);
}


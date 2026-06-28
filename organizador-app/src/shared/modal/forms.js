export const FORMS = {
  receita:{
    title:'Nova Receita',
    fields:[
      {id:'nome',label:'Nome da Receita',type:'text',placeholder:'ex: Salário Maio',req:true},
      {id:'categoria',label:'Categoria',type:'select',opts:['Salário','Freelance','Comissão','Investimentos','Vendas','Presentes','Outros']},
      {id:'valor',label:'Valor (R$)',type:'number',placeholder:'0,00',req:true},
      {id:'data',label:'Data',type:'date',req:true},
      {id:'tipo',label:'Tipo',type:'select',opts:['Fixa','Variável']},
      {id:'frequencia',label:'Frequência',type:'select',opts:['Mensal','Semanal','Quinzenal','Bimestral','Anual','Esporádico']},
      {id:'status',label:'Status',type:'select',opts:['Recebido','Pendente']},
      {id:'formaPgto',label:'Forma de Recebimento',type:'select',opts:['PIX','Transferência','Depósito','Crédito Conta','Dinheiro']},
      {id:'obs',label:'Observações',type:'text',placeholder:'Opcional...',full:true},
    ]
  },
  gasto:{
    title:'Novo Gasto',
    fields:[
      {id:'nome',label:'Nome do Gasto',type:'text',placeholder:'ex: Aluguel',req:true},
      {id:'categoria',label:'Categoria',type:'select',opts:['Moradia','Alimentação','Transporte','Internet','Streaming','Saúde','Lazer','Estudos','Impostos','Assinaturas','Compras','Emergências','Outros']},
      {id:'valor',label:'Valor (R$)',type:'number',placeholder:'0,00',req:true},
      {id:'data',label:'Data',type:'date',req:true},
      {id:'vencimento',label:'Vencimento',type:'date'},
      {id:'tipo',label:'Tipo',type:'select',opts:['Fixo','Variável']},
      {id:'prioridade',label:'Prioridade',type:'select',opts:['Alta','Média','Baixa']},
      {id:'status',label:'Status',type:'select',opts:['Pago','Pendente']},
      {id:'formaPgto',label:'Forma de Pagamento',type:'select',opts:['PIX','Débito','Crédito','Transferência','Débito Auto','Dinheiro','Boleto']},
      {id:'cartao',label:'Cartão Utilizado',type:'text',placeholder:'ex: Nubank'},
      {id:'parcelas',label:'Parcela Atual',type:'number',placeholder:'1'},
      {id:'totalParcelas',label:'Total Parcelas',type:'number',placeholder:'1'},
      {id:'obs',label:'Observações',type:'text',placeholder:'Opcional...',full:true},
    ]
  },
  investimento:{
    title:'Novo Investimento',
    fields:[
      {id:'nome',label:'Nome do Ativo',type:'text',placeholder:'ex: Tesouro Selic',req:true},
      {id:'tipo',label:'Tipo',type:'select',opts:['Poupança','Tesouro Direto','CDB','LCI/LCA','Ações','Fundos Imobiliários','ETF','Criptomoedas','Reserva de Emergência','Outros']},
      {id:'valor',label:'Valor Investido (R$)',type:'number',placeholder:'0,00',req:true},
      {id:'data',label:'Data',type:'date'},
      {id:'rentabilidade',label:'Rentabilidade % a.a.',type:'number',placeholder:'10.5'},
      {id:'corretora',label:'Corretora/Banco',type:'text',placeholder:'ex: Nubank'},
      {id:'prazo',label:'Prazo',type:'text',placeholder:'ex: 2027 ou Indefinido'},
      {id:'obs',label:'Observações',type:'text',placeholder:'Opcional...',full:true},
    ]
  },
  meta:{
    title:'Nova Meta',
    fields:[
      {id:'emoji',label:'Emoji',type:'text',placeholder:'🎯'},
      {id:'nome',label:'Nome da Meta',type:'text',placeholder:'ex: Notebook Novo',req:true},
      {id:'categoria',label:'Categoria',type:'select',opts:['Tecnologia','Lazer','Viagem','Segurança','Patrimônio','Educação','Saúde','Veículo','Eventos','Outros']},
      {id:'valorTotal',label:'Valor Total (R$)',type:'number',placeholder:'0,00',req:true},
      {id:'acumulado',label:'Já Acumulado (R$)',type:'number',placeholder:'0,00'},
      {id:'aporteMes',label:'Aporte Mensal (R$)',type:'number',placeholder:'0,00'},
      {id:'prazo',label:'Prazo (ex: Dez/2026)',type:'text',placeholder:'Dez/2026'},
      {id:'prioridade',label:'Prioridade',type:'select',opts:['Alta','Média','Baixa']},
    ]
  },
  cartao:{
    title:'Novo Cartão',
    fields:[
      {id:'nome',label:'Nome do Cartão',type:'text',placeholder:'ex: Nubank',req:true},
      {id:'banco',label:'Banco',type:'text',placeholder:'ex: Nubank'},
      {id:'limiteTotal',label:'Limite Total (R$)',type:'number',placeholder:'0,00',req:true},
      {id:'limiteUsado',label:'Limite Utilizado (R$)',type:'number',placeholder:'0,00'},
      {id:'ultimos4',label:'Últimos 4 dígitos',type:'text',placeholder:'0000',maxlength:4},
      {id:'vencimento',label:'Vencimento',type:'text',placeholder:'ex: Dia 10'},
      {id:'fechamento',label:'Fechamento',type:'text',placeholder:'ex: Dia 1'},
      {id:'bandeira',label:'Bandeira',type:'select',opts:['Visa','Mastercard','Elo','American Express','Outros']},
      {id:'statusFatura',label:'Status Fatura',type:'select',opts:['Aberta','Fechada','Paga']},
    ]
  },
  assinatura:{
    title:'Nova Assinatura',
    fields:[
      {id:'nome',label:'Serviço',type:'text',placeholder:'ex: Netflix',req:true},
      {id:'categoria',label:'Categoria',type:'select',opts:['Streaming','Cloud','Internet','Saúde','Software','IA','Educação','Outros']},
      {id:'valor',label:'Valor Mensal (R$)',type:'number',placeholder:'0,00',req:true},
      {id:'diaVcto',label:'Dia de Vencimento',type:'text',placeholder:'ex: Dia 10'},
      {id:'status',label:'Status',type:'select',opts:['Ativa','Pausada','Cancelada']},
      {id:'obs',label:'Observações',type:'text',placeholder:'Opcional...',full:true},
    ]
  }
}
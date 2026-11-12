/* ===== Matriz de priorização da carteira · motor da régua das nove etapas (versão final, 4.0) =====
   Fonte: fluxo das nove etapas da matriz de priorização (quadro de trabalho no Miro) e planilha
   "Matriz de Priorização ABDI 2027", versão 0.7, de 11/11/2026 (aba Cálculo), que é a referência das regras.
   Funções puras: não leem a tela nem o banco. Entram os fatos de cada projeto; sai a recomendação.
   As regras ficam em REGUA3, como dado (o nome vem da versão 3.0 e foi mantido para não mudar os dados gravados).
   Testado em testes/v30-motor.js e, contra os resultados da planilha, em testes/v40-avaliacao.js.

   Fatos de um projeto (objeto p):
     code       código do Canvas
     novos      recurso novo pedido, em reais (0 = sem pedido novo)
     novo       true se o projeto é novo; false se está em execução
     completa   false se o Canvas voltou para completar (etapa 3)
     mandato    false se está fora do papel legal da Agência (etapa 3)
     repete     true se repete a entrega de outro projeto (etapa 3); pela regra de 11/11/2026, gera alerta e não tira o projeto
     medicao    false se não há indicador nem plano de medição (etapa 3)
     arvore     saída da árvore da missão: "pri", "ade", "par", "nad", "des", "red" (etapa 4)
     notas      {A, R, E, I}, de 1 a 5; A vem da árvore (etapas 4 e 5)
     dano       true se há dano a emprego ou ambiente (etapa 5)
     exq        quatro itens do farol, cada um 0, 1, 3 ou 5 (etapa 6)
     etiqueta   true se a Diretoria Executiva concedeu a etiqueta de relevância política
   Opcionais, só para dizer o que falta a quem ainda está no caminho (sem eles, nada muda):
     enviado    false se o Canvas ainda não foi enviado (etapa 2)
     devolvido  true se a elegibilidade devolveu o Canvas para completar
     fechada    false se a elegibilidade ainda não foi registrada; true se já foi
*/
const REGUA3={
  versao:"4.0",
  notas:[
    {k:"A",n:"Aderência à missão",origem:"arvore",d:"Vem da árvore da missão: aderente prioritário 5, aderente 3, parcial 1. Ninguém atribui essa nota."},
    {k:"R",n:"Resultados medidos",origem:"leitura",d:"Indicadores de benefício do programa e do Contrato de Gestão, com evidência ou plano de medição."},
    {k:"E",n:"Escala e articulação",origem:"leitura",d:"Alcance do projeto e articulação com a rede e com outros órgãos."},
    {k:"I",n:"Indústria 5.0",origem:"leitura",d:"Efeito sobre o trabalhador e sobre o meio ambiente."}],
  arvore:{pri:5,ade:3,par:1},          /* nota de aderência por saída da árvore */
  aderenciaMin:3,                      /* abaixo disso, a saída é reformular */
  divergencia:2,                       /* diferença entre leitores que pede conversa e registro */
  fator:1,                             /* valor = média das quatro notas vezes este fator (1 mantém a escala de 1 a 5) */
  farol:{itens:["Instrumento","Execução histórica","Dependências","Prazo"],
         vermelhoAte:0,                /* algum item até esta nota: a pendência trava o projeto */
         amareloAte:3},                /* algum item até esta nota: há pendência, o projeto segue com condição */
  andando:{item:1,min:3},              /* "está andando": execução histórica com nota a partir de 3 */
  etiqueta:{venceMandato:false},       /* ponto em aberto: a etiqueta vence o limite legal do papel da Agência? */
  repeticaoTira:false,                 /* regra de 11/11/2026: repetir a entrega de outro projeto gera alerta e não tira o projeto.
                                          Com true, volta a regra da versão 3.0: saída incorporar. */
  amostra:{parte:0.2,minimo:3,semente:2027},   /* amostra da Unidade de Auditoria: parte dos decididos, mínimo e número do sorteio */
  saidas:{orgao:"Outro órgão",incorporar:"Incorporar",reformular:"Reformular",priorizar:"Priorizar",manter:"Manter, sem recurso novo",concluir:"Concluir sem nova fase"}
};

/* ---------- do percurso gravado aos fatos ----------
   est é o percurso gravado de um projeto: {ficha, porta, arvore, leituras, conciliacao, farol, decisao, ...}.
   c é o que vem do Canvas: {code, novos}. As telas e os testes usam as mesmas funções. */
const simNao3=v=>v==="sim"?true:v==="não"?false:undefined;
const etiquetado3=est=>(((est||{}).ficha)||{}).etiqueta==="concedida";
const novo3=(c,est)=>{ const f=((est||{}).ficha)||{}; return f.novo!=null?!!f.novo:/^N/i.test(c.code); };
/* etapa 5: junta as duas leituras. Diferença a partir de R.divergencia pede a nota conciliada. */
function notas3(est,R=REGUA3){
  const e=est||{}, L=e.leituras||{}, l1=L.L1, l2=L.L2, con=e.conciliacao||{};
  const o={A:aderencia3((e.arvore||{}).saida,R),n:(l1?1:0)+(l2?1:0),diverge:[],danoDiverge:false,dano:false,completo:false};
  if(l1&&l2){
    for(const k of ["R","E","I"]){ if(Math.abs(l1[k]-l2[k])>=R.divergencia){ o.diverge.push(k); o[k]=con[k]!=null?+con[k]:null; } else o[k]=(l1[k]+l2[k])/2; }
    if(!!l1.dano!==!!l2.dano){ o.danoDiverge=true; o.dano=con.dano!=null?!!con.dano:null; } else o.dano=!!l1.dano;
    o.completo=["R","E","I"].every(k=>o[k]!=null)&&o.dano!==null; }
  return o; }
/* os fatos que o motor recebe */
function fatos3(c,est,R=REGUA3){
  const e=est||{}, p=e.porta||{}, n=notas3(e,R);
  return {code:c.code,novos:+c.novos||0,novo:novo3(c,e),completa:simNao3(p.completa),mandato:simNao3(p.mandato),repete:simNao3(p.repete),medicao:simNao3(p.medicao),
    arvore:(e.arvore||{}).saida,notas:n.completo?{A:n.A,R:n.R,E:n.E,I:n.I}:{A:n.A},dano:n.completo&&n.dano===true,exq:(e.farol||{}).exq,etiqueta:etiquetado3(e),
    enviado:!!(e.ficha||{}).enviada,devolvido:!!(p.devolvidaEm&&!(e.ficha||{}).enviada),fechada:!!p.fechada}; }
/* em que etapa o projeto está agora */
function estacao3(c,est,R=REGUA3){
  const e=est||{};
  if(e.decisao) return 9;
  if(!(e.ficha||{}).enviada) return 2;
  if(!(e.porta||{}).fechada) return 3;
  const pr=porta3(fatos3(c,e,R),R); if(pr&&pr.saida) return 8;
  const a=e.arvore||{}; if(!a.saida||a.saida==="red") return 4;
  if(!notas3(e,R).completo) return 5;
  if(!farol3((e.farol||{}).exq,R)) return 6;
  return 8; }

/* Etapa 5: valor = média das quatro notas. Devolve null enquanto faltar nota. */
function valor3(notas,R=REGUA3){
  const v=R.notas.map(n=>+((notas||{})[n.k]));
  return v.some(x=>!(x>=1&&x<=5))?null:v.reduce((a,x)=>a+x,0)/v.length*R.fator; }

/* Etapa 4: nota de aderência a partir da saída da árvore. */
function aderencia3(saida,R=REGUA3){ return R.arvore[saida]!=null?R.arvore[saida]:null; }

/* Etapa 6: farol de execução e custo. Não entra no valor. Devolve null enquanto faltar item. */
function farol3(exq,R=REGUA3){
  const v=(exq||[]).map(Number);
  if(v.length<R.farol.itens.length||v.some(x=>isNaN(x))) return null;
  const mn=Math.min(...v);
  return mn<=R.farol.vermelhoAte?"vermelho":mn<=R.farol.amareloAte?"amarelo":"verde"; }

/* Etapa 7: o projeto em execução está andando? Devolve null enquanto o farol não foi preenchido. */
function andando3(exq,R=REGUA3){
  const x=+((exq||[])[R.andando.item]); return isNaN(x)?null:x>=R.andando.min; }

/* Etapas 3, 4 e 5: o que tira o projeto do caminho antes da recomendação.
   Devolve {saida, motivo}, {estado} quando falta algo, ou null quando o projeto segue.
   Com etiqueta, só o limite legal barra (e a repetição, quando a régua manda tirar); o resto vira pendência anotada. */
function pendencias3(p,R=REGUA3){
  const L=[];
  if(p.medicao===false) L.push("Sem indicador nem plano de medição.");
  if(p.arvore==="nad"||p.arvore==="des") L.push("Não se insere na missão.");
  else if(p.notas&&p.notas.A!=null&&+p.notas.A<R.aderenciaMin) L.push("Aderência à missão abaixo de "+R.aderenciaMin+".");
  if(p.dano) L.push("Dano a emprego ou ambiente.");
  return L; }
const FALTA3={volta:"Volta à etapa 2 para completar o Canvas.",e2:"Ainda no caminho. Está na etapa 2: Canvas ainda não enviado.",e3:"Ainda no caminho. Está na etapa 3: elegibilidade.",
  red:"Refaz a etapa 4 na missão indicada pela árvore.",e4:"Ainda no caminho. Está na etapa 4: vínculo à Nova Indústria Brasil.",e5:"Aguarda as notas.",e6:"Aguarda o farol."};
function porta3(p,R=REGUA3){
  if(p.devolvido===true||p.completa===false) return {estado:FALTA3.volta};
  if(p.enviado===false) return {estado:FALTA3.e2};
  if(p.fechada===false) return {estado:FALTA3.e3};
  if(p.mandato===false&&!(p.etiqueta&&R.etiqueta.venceMandato)) return {saida:"orgao",motivo:"Fora do papel legal da Agência."};
  if(p.repete===true&&R.repeticaoTira) return {saida:"incorporar",motivo:"Repete a entrega de outro projeto."};
  if(p.arvore==="red") return {estado:FALTA3.red};
  if(p.etiqueta) return null;
  const L=pendencias3(p,R);
  return L.length?{saida:"reformular",motivo:L.join(" ")}:null; }

/* Etapa 3: alerta de repetição de entrega. O projeto repete a entrega de outro, foi aceito no resto da
   elegibilidade (ou saiu só por falta de medição) e a régua não manda a repetição tirar o projeto. */
const ALERTA_REPETE="Alerta: repete a entrega de outro projeto.";
function alerta3(p,R=REGUA3){
  if(p.repete!==true||R.repeticaoTira) return false;
  if(p.completa===false||p.completa===undefined) return false;
  if(p.mandato===undefined||(p.mandato===false&&!(p.etiqueta&&R.etiqueta.venceMandato))) return false;
  return p.medicao!==undefined; }

/* Etapa 7: a linha. Os etiquetados entram primeiro; os demais, por valor, até o teto.
   O último que cabe marca a linha; depois dele ninguém entra, mesmo que coubesse.
   lista: [{code, valor, novos, etiqueta}] só com quem disputa recurso novo. */
function linha3(lista,teto){
  const ped=x=>+x.novos||0, ord=(a,b)=>b.valor-a.valor||ped(a)-ped(b)||String(a.code).localeCompare(String(b.code));
  const tags=lista.filter(x=>x.etiqueta).sort(ord), resto=lista.filter(x=>!x.etiqueta).sort(ord);
  const dentro=new Set(); let usado=0;
  tags.forEach(x=>{ usado+=ped(x); dentro.add(x.code); });
  const reserva=usado; let corte=null, parou=false;
  for(const x of resto){ if(!parou&&usado+ped(x)<=teto+1e-6){ usado+=ped(x); dentro.add(x.code); corte=x.valor; } else parou=true; }
  return {dentro,usado,reserva,corte,estouro:reserva>teto+1e-6,ordem:[...tags,...resto].map(x=>x.code)}; }

/* Etapa 7: caso de fronteira. Um ponto a mais ou a menos em uma nota faria o projeto cruzar a linha? */
function fronteira3(lista,teto,R=REGUA3){
  const passo=R.fator/R.notas.length, L0=linha3(lista,teto), fr=new Set();
  for(const x of lista){ if(x.etiqueta) continue;
    const dentro=L0.dentro.has(x.code), v=x.valor+(dentro?-passo:passo);
    if(linha3(lista.map(y=>y.code===x.code?{...y,valor:v}:y),teto).dentro.has(x.code)!==dentro) fr.add(x.code); }
  return fr; }

/* Etapa 7: a recomendação. Uma linha por projeto, com a saída sugerida e o motivo.
   Para quem tem etiqueta, mostra também a saída que teria sem ela. */
function recomendar3(projetos,teto,R=REGUA3,semContrafactual){
  const base=projetos.map(p=>({p,porta:porta3(p,R),valor:valor3(p.notas,R),farol:farol3(p.exq,R)}));
  const disputa=b=>!b.porta&&(+b.p.novos>0)&&b.valor!=null&&b.farol!=null;   /* só entra na lista quem já tem notas e farol */
  const fila=base.filter(disputa).map(b=>({code:b.p.code,valor:b.valor,novos:b.p.novos,etiqueta:!!b.p.etiqueta}));
  const L=linha3(fila,teto), fr=fronteira3(fila,teto,R);
  const linhas=base.map(b=>{ const p=b.p, tag=!!p.etiqueta;
    const o={code:p.code,valor:b.valor,farol:b.farol,etiqueta:tag,dentro:L.dentro.has(p.code),fronteira:fr.has(p.code),saida:null,rotulo:null,motivo:"",condicao:"",estado:"",alerta:alerta3(p,R)?ALERTA_REPETE:"",pendencias:tag?pendencias3(p,R):[]};
    const sai=(s,m,c)=>{ o.saida=s; o.rotulo=R.saidas[s]; o.motivo=m; o.condicao=c||""; return o; };
    if(b.porta){ if(b.porta.estado){ o.estado=b.porta.estado; return o; } return sai(b.porta.saida,b.porta.motivo); }
    if(!p.arvore&&p.fechada===true){ o.estado=FALTA3.e4; return o; }
    if(b.valor==null){ o.estado=FALTA3.e5; return o; }
    if(b.farol==null){ o.estado=FALTA3.e6; return o; }
    if(o.dentro){
      if(tag) return sai("priorizar","Etiqueta de relevância política: entra primeiro no teto.",b.farol==="verde"?"":"Farol "+b.farol+".");
      if(b.farol==="vermelho") return sai("reformular","Acima da linha, mas travado: reformular para destravar.");
      return sai("priorizar","Acima da linha.",b.farol==="amarelo"?"Com condição: farol amarelo.":""); }
    const porque=+p.novos>0?"Abaixo da linha.":"Sem pedido de recurso novo.";
    if(p.novo) return sai("reformular","Projeto novo. "+porque);
    return andando3(p.exq,R)?sai("manter","Em execução e andando. "+porque):sai("concluir","Em execução e parado. "+porque); });
  if(!semContrafactual) linhas.forEach(o=>{ if(!o.etiqueta) return;
    const alt=recomendar3(projetos.map(q=>q.code===o.code?{...q,etiqueta:false}:q),teto,R,true).linhas.find(x=>x.code===o.code);
    o.semEtiqueta={saida:alt.saida,rotulo:alt.rotulo,motivo:alt.motivo,estado:alt.estado}; });
  /* retido: recurso de quem está acima da linha mas travado (farol vermelho). A linha conta com ele;
     a tela mostra o valor para a Diretoria Executiva decidir se libera para o próximo da fila. */
  const retido=linhas.filter(o=>o.dentro&&o.saida==="reformular").reduce((a,o)=>a+(+projetos.find(q=>q.code===o.code).novos||0),0);
  return {linhas,teto,usado:L.usado,reserva:L.reserva,retido,corte:L.corte,estouro:L.estouro,ordem:L.ordem}; }

/* Etapa 9: amostra da Unidade de Auditoria, com número de sorteio. Com o mesmo número, qualquer pessoa refaz o mesmo sorteio.
   decididos: [{code, linha}], em que linha é a posição fixa do projeto na carteira (a linha dele na planilha).
   Conta igual à da planilha: tamanho = mínimo entre os decididos e o maior entre o mínimo e a parte arredondada para cima;
   cada projeto recebe um número a partir do número do sorteio e da linha; entram os de menor número. */
function amostraTamanho3(n,R=REGUA3){ const a=R.amostra; return Math.min(n,Math.max(a.minimo,Math.ceil(Math.round(a.parte*n*1e6)/1e6))); }
function amostraNumero3(linha,R=REGUA3){ return (((R.amostra.semente+linha)*1103515245+12345)%2147483648)*48271%2147483647; }
function amostra3(decididos,R=REGUA3){
  const L=decididos.map(d=>({code:d.code,num:amostraNumero3(d.linha,R)})), n=amostraTamanho3(L.length,R);
  return L.filter(x=>L.filter(y=>y.num<x.num).length+1<=n).map(x=>x.code).sort(); }

if(typeof module!=="undefined"&&module.exports) module.exports={REGUA3,ALERTA_REPETE,FALTA3,simNao3,etiquetado3,novo3,notas3,fatos3,estacao3,valor3,aderencia3,farol3,andando3,pendencias3,porta3,alerta3,linha3,fronteira3,recomendar3,amostraTamanho3,amostraNumero3,amostra3};

/* ===== Esteira v3.0 · motor da régua do fluxo completo (nove etapas) =====
   Fonte: quadro "Fluxo completo da matriz de priorização" (Miro), com as edições de 10/11/2026.
   Funções puras: não leem a tela nem o banco. Entram os fatos de cada projeto; sai a recomendação.
   As regras ficam em REGUA3, como dado, para o módulo Parâmetros publicar por ciclo.
   Usado pela esteira v3.0 (pasta esteira3) e testado em testes/v30-motor.js.

   Fatos de um projeto (objeto p):
     code       código do Canvas
     novos      recurso novo pedido, em reais (0 = sem pedido novo)
     novo       true se o projeto é novo; false se está em execução
     completa   false se o Canvas voltou para completar (etapa 3)
     mandato    false se está fora do papel legal da Agência (etapa 3)
     repete     true se repete a entrega de outro projeto (etapa 3)
     medicao    false se não há indicador nem plano de medição (etapa 3)
     arvore     saída da árvore da missão: "pri", "ade", "par", "nad", "des", "red" (etapa 4)
     notas      {A, R, E, I}, de 1 a 5; A vem da árvore (etapas 4 e 5)
     dano       true se há dano a emprego ou ambiente (etapa 5)
     exq        quatro itens do farol, cada um 0, 1, 3 ou 5 (etapa 6)
     etiqueta   true se a Diretoria Executiva concedeu a etiqueta de relevância política
*/
const REGUA3={
  versao:"3.0-alfa",
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
  saidas:{orgao:"Outro órgão",incorporar:"Incorporar",reformular:"Reformular",priorizar:"Priorizar",manter:"Manter, sem recurso novo",concluir:"Concluir sem nova fase"}
};

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
   Com etiqueta, só o limite legal e a repetição valem; o resto vira pendência anotada. */
function pendencias3(p,R=REGUA3){
  const L=[];
  if(p.medicao===false) L.push("Sem indicador nem plano de medição.");
  if(p.arvore==="nad"||p.arvore==="des") L.push("Não se insere na missão.");
  else if(p.notas&&p.notas.A!=null&&+p.notas.A<R.aderenciaMin) L.push("Aderência à missão abaixo de "+R.aderenciaMin+".");
  if(p.dano) L.push("Dano a emprego ou ambiente.");
  return L; }
function porta3(p,R=REGUA3){
  if(p.completa===false) return {estado:"Volta à etapa 2 para completar o Canvas."};
  if(p.mandato===false&&!(p.etiqueta&&R.etiqueta.venceMandato)) return {saida:"orgao",motivo:"Fora do papel legal da Agência."};
  if(p.repete===true) return {saida:"incorporar",motivo:"Repete a entrega de outro projeto."};
  if(p.arvore==="red") return {estado:"Refaz a etapa 4 na missão indicada pela árvore."};
  if(p.etiqueta) return null;
  const L=pendencias3(p,R);
  return L.length?{saida:"reformular",motivo:L.join(" ")}:null; }

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
    const o={code:p.code,valor:b.valor,farol:b.farol,etiqueta:tag,dentro:L.dentro.has(p.code),fronteira:fr.has(p.code),saida:null,rotulo:null,motivo:"",condicao:"",estado:"",pendencias:tag?pendencias3(p,R):[]};
    const sai=(s,m,c)=>{ o.saida=s; o.rotulo=R.saidas[s]; o.motivo=m; o.condicao=c||""; return o; };
    if(b.porta){ if(b.porta.estado){ o.estado=b.porta.estado; return o; } return sai(b.porta.saida,b.porta.motivo); }
    if(b.valor==null){ o.estado="Aguarda as notas."; return o; }
    if(b.farol==null){ o.estado="Aguarda o farol."; return o; }
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

if(typeof module!=="undefined"&&module.exports) module.exports={REGUA3,valor3,aderencia3,farol3,andando3,pendencias3,porta3,linha3,fronteira3,recomendar3};

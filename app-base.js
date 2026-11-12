/* ===== Matriz de priorização da carteira · estado, cálculo e moldura ===== */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(+v||0);
const nf=(v,d=2)=>v==null||isNaN(v)?"—":new Intl.NumberFormat("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
const dataBR=iso=>iso?new Date(iso.length===10?iso+"T12:00:00":iso).toLocaleDateString("pt-BR"):"—";
const dataHora=iso=>iso?new Date(iso).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"—";
const num=v=>{ const s=String(v==null?"":v).trim(); if(!s) return null; const n=+s.replace(/[^\d,.-]/g,"").replace(/\./g,"").replace(",","."); return isNaN(n)?null:n; };
/* máscara de valores em reais: "R$ 24.000.000" (até 2 casas decimais, vírgula) */
function moedaMascara(s){ s=String(s==null?"":s); const i=s.indexOf(","), ip=(i<0?s:s.slice(0,i)).replace(/\D/g,"").replace(/^0+(?=\d)/,""), dp=i<0?"":s.slice(i+1).replace(/\D/g,"").slice(0,2);
  if(!ip&&i<0) return ""; return "R$ "+(ip||"0").replace(/\B(?=(\d{3})+(?!\d))/g,".")+(i<0?"":","+dp); }
/* valor guardado (número, "24000000" ou já com máscara) a mostrar no campo */
function moedaValor(v){ if(typeof v==="number") return isNaN(v)?"":moedaMascara(String(v).replace(".",",")); v=String(v==null?"":v); return moedaMascara(/^\d+(\.\d+)?$/.test(v)?v.replace(".",","):v); }
const clone=o=>JSON.parse(JSON.stringify(o||{}));
const minus=t=>t.charAt(0).toLowerCase()+t.slice(1);

const S={modo:null,usuario:{nome:"Visitante",papel:UGE},base:{},est:{},canvas:{},ciclo:{},cenario:1,sens:{},erro:"",carregando:false,
  vista:{grupo:"missao",busca:"",aba1:"ciclo",aba7:"lista",abaS:"resumo",dobras:{}}};   /* vista: como a pessoa escolheu ver (agrupamento do quadro, busca, aba, dobras abertas); vale até sair */   /* canvas: os Canvas como estão guardados, com os rascunhos */
let R={}, ROTA=[], ROTA_ANT=null, _rec=null;
const TELAS={}, ACOES={};
const rget=(k,d)=>{ const v=k.split(".").reduce((o,p)=>o==null?o:o[p],R); return v==null?d:v; };
const rset=(k,v)=>{ const ps=k.split("."); let o=R; ps.slice(0,-1).forEach(p=>{ o=o[p]=(o[p]&&typeof o[p]==="object")?o[p]:{}; }); o[ps[ps.length-1]]=v; };
const quem=()=>S.usuario.nome+" ("+S.usuario.papel+")";
const projetos=()=>Object.values(S.base).sort((a,b)=>String(a.code).localeCompare(String(b.code),"pt-BR",{numeric:true}));
const rotSaida=s=>(SAIDAS.find(x=>x[0]===s)||[,"—"])[1];
/* cores de resultado, as mesmas da planilha: árvore (pri, ade, par, nad, des, red) e saída */
const clsArv=s=>s?"res-"+s:"";
const clsSaida=s=>({priorizar:"res-pri",manter:"res-ade",reformular:"res-par",concluir:"res-lar",orgao:"res-nad",incorporar:"res-red"})[s]||"";

/* ---------- o que se sabe de cada projeto ----------
   As contas ficam em motor.js (notas3, fatos3, estacao3), para a tela e os testes usarem as mesmas funções. */
const E=code=>S.est[code]||(S.est[code]={ficha:{},log:[]});
const etiquetado=code=>etiquetado3(E(code));
const ehNovo=c=>novo3(c,E(c.code));
/* missão indicada no Canvas (a avaliação pode ter conferido a missão principal no documento da Agência) e missão em que o projeto foi avaliado */
const missaoCanvas=c=>{ const m=(E(c.code).ficha||{}).missao; return MISSOES[m]?m:c.missao; };
const missaoDe=c=>(E(c.code).arvore||{}).missao||missaoCanvas(c);
const notasDe=c=>notas3(E(c.code));
const valorDe=c=>{ const n=notasDe(c); return n.completo?valor3({A:n.A,R:n.R,E:n.E,I:n.I}):null; };
const fatos=c=>fatos3(c,E(c.code));
const estacao=c=>estacao3(c,E(c.code));
function contagem(){ const o={}; projetos().forEach(c=>{ const n=estacao(c); o[n]=(o[n]||0)+1; }); return o; }
/* vínculo com a ABDI 5.0: pelo elo da árvore ou, sem elo, pela leitura direta do Canvas */
const abdiDe=c=>abdiDoProjeto(E(c.code).arvore,E(c.code).abdi);
/* alerta de repetição de entrega (etapa 3): o projeto segue, e o alerta o acompanha */
const alertaDe=c=>alerta3(fatos(c));
const tagAlerta=c=>alertaDe(c)?` <span class="tag res-par" title="${esc(ALERTA_REPETE)}">Alerta de repetição</span>`:"";
/* posição fixa do projeto na carteira, usada no sorteio da amostra: a linha da planilha, quando veio dela; senão, a ordem dos códigos */
const linhaFixa=c=>{ const l=+(E(c.code).ficha||{}).linha; return l>0?l:projetos().findIndex(x=>x.code===c.code)+4; };

/* etapa 7: teto e recomendação */
function tetoAtual(){
  const t=+S.ciclo.teto; if(t>0) return {valor:t,origem:"Teto de referência publicado nas regras do ciclo",publicado:true};
  const tot=projetos().reduce((a,c)=>a+(+c.novos||0),0);
  return {valor:tot*S.cenario,origem:"Cenário: "+Math.round(S.cenario*100)+"% dos pedidos. Não há teto publicado.",parte:S.cenario}; }
const somaPedidos=()=>projetos().reduce((a,c)=>a+(+c.novos||0),0);
const rec=()=>_rec||(_rec=recomendar3(projetos().map(fatos),tetoAtual().valor));
const linhaDe=code=>rec().linhas.find(x=>x.code===code)||{};
function saidaDe(c){ const d=E(c.code).decisao, l=linhaDe(c.code); if(d) return {saida:d.saida||l.saida,decidida:true,linha:l}; return {saida:l.saida,decidida:false,linha:l}; }

/* ---------- peças de tela ---------- */
function aviso(msg){ const a=$("#aviso"); a.textContent=msg; a.classList.add("on"); clearTimeout(aviso.t); aviso.t=setTimeout(()=>a.classList.remove("on"),2600); }
function ops(k,lista,atual){ return `<div class="opcoes" role="group">${lista.map(([v,t,cls])=>`<button type="button" class="op ${cls||""}" data-acao="set" data-k="${k}" data-v="${esc(v)}" data-fid="${k}:${esc(v)}" aria-pressed="${String(atual)===String(v)}">${esc(t)}</button>`).join("")}</div>`; }
const SIMNAO=[["sim","Sim","sim"],["não","Não","nao"]];
function area(k,rot,dica,linhas){ return `<div class="cmp"><label for="i_${k}">${esc(rot)}</label><textarea id="i_${k}" data-rasc="${k}" rows="${linhas||3}">${esc(rget(k,""))}</textarea>${dica?`<span class="dica">${esc(dica)}</span>`:""}</div>`; }
function texto(k,rot,dica,tipo){ const m=tipo==="reais"; return `<div class="cmp"><label for="i_${k}">${esc(rot)}</label><input id="i_${k}" type="${m?"text":tipo||"text"}"${m?` inputmode="decimal" autocomplete="off" placeholder="R$ 0" data-moeda="1"`:""} data-rasc="${k}" value="${esc(m?moedaValor(rget(k,"")):rget(k,""))}">${dica?`<span class="dica">${esc(dica)}</span>`:""}</div>`; }
const sinal=(f,g)=>f?`<span class="sinal ${f}${g?" g":""}" role="img" aria-label="${esc(FAROL_TXT[f])}"><i></i><i></i><i></i></span>`:"";
/* ---------- módulos comuns: os mesmos da entrada aos painéis ---------- */
const rsMi=v=>"R$ "+nf((+v||0)/1e6,1)+" mi";
const semAcento=t=>String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
/* a cor acompanha a missão em que o projeto foi avaliado */
const mDe=c=>{ const m=missaoDe(c); return MISSOES[m]?m:"T"; };
const clsM=c=>"m-"+mDe(c);
const mk=c=>"mk "+clsM(c);   /* marca de missão na primeira célula de uma linha de tabela */
const tagMissao=c=>`<span class="tag m ${clsM(c)}" title="${esc(MISSOES[mDe(c)])}">${esc(MISSAO_TIT[mDe(c)])}</span>`;
const SAIDA_CURTA={manter:"Manter",concluir:"Concluir"};   /* nome curto da saída, só no cartão do quadro; o nome inteiro fica na legenda e na dica */
/* cartão de projeto. o.missao: mostra a etiqueta da missão; o.sit: "tudo" (saída ou, sem saída, a etapa), "saida" ou "etapa" */
function cartao(c,o){
  o=o||{}; const l=linhaDe(c.code), s=saidaDe(c), n=estacao(c);
  const tSaida=s.saida&&(o.sit==="tudo"||o.sit==="saida")?`<span class="tag ${clsSaida(s.saida)}" title="${esc(rotSaida(s.saida))}: ${s.decidida?"decisão da Diretoria Executiva":"sugestão da matriz"}">${esc(SAIDA_CURTA[s.saida]||rotSaida(s.saida))}</span>`:"";
  const tEtapa=!s.saida&&(o.sit==="tudo"||o.sit==="etapa")?`<span class="tag" title="${esc(ETAPAS[n-1].t)}">Etapa ${n}</span>`:"";
  return `<a class="pc ${clsM(c)}" href="#/projeto/${encodeURIComponent(c.code)}" data-busca="${esc(semAcento(c.code+" "+c.nome))}"><span class="pc-n"><b>${esc(c.code)}</b>${esc(c.nome)}</span>
    <span class="pc-d"><span>${+c.novos>0?rsMi(c.novos):"Sem pedido novo"}</span>${l.valor!=null?`<span>valor <b>${nf(l.valor)}</b></span>`:""}</span>
    <span class="pc-t">${o.missao?tagMissao(c):""}${tSaida}${tEtapa}${etiquetado(c.code)?`<span class="tag etq">Etiqueta</span>`:""}${l.fronteira?`<span class="tag at" title="Um ponto em uma nota mudaria o lado da linha">Fronteira</span>`:""}${alertaDe(c)?`<span class="tag res-par" title="${esc(ALERTA_REPETE)}">Alerta</span>`:""}</span></a>`; }
/* cartão pequeno: só código e nome, para faixas e listas de apoio */
const chip=c=>`<a class="pc mini ${clsM(c)}${etiquetado(c.code)?" etq":""}" href="#/projeto/${encodeURIComponent(c.code)}"${etiquetado(c.code)?` title="Com etiqueta de relevância política"`:""}><span class="pc-n"><b>${esc(c.code)}</b>${esc(c.nome)}</span></a>`;
/* faixa: um recorte da carteira em linha (rótulo à esquerda, cartões pequenos à direita) */
const faixa=(cls,tit,sub,L,link)=>L.length?`<section class="faixa ${cls||""}"><div class="faixa-rot"><b>${esc(tit)} <span class="tag">${L.length}</span></b>${sub?`<span>${esc(sub)}</span>`:""}${link?`<a href="${link[0]}">${esc(link[1])}</a>`:""}</div><div class="faixa-itens">${L.map(chip).join("")}</div></section>`:"";
/* cabeçalho de página: onde estou, título, uma frase e, à direita, a caixa de fatos. "onde", "extra" e o valor de cada fato chegam prontos (HTML) */
function pgCab(o){
  const fatos=(o.fatos||[]).filter(Boolean);
  return `<header class="pg${fatos.length?"":" so"}"><div class="pg-t">${o.onde?`<p class="pg-onde">${o.onde}</p>`:""}
    <div class="pg-tit${o.cls?" "+o.cls:""}">${o.num?`<span class="n-etapa" aria-hidden="true">${o.num}</span>`:""}<h1>${esc(o.titulo)}</h1></div>
    ${o.frase?`<p class="frase">${esc(o.frase)}</p>`:""}${o.extra||""}</div>
    ${fatos.length?`<dl class="pg-fatos${o.numeros?" num":""}">${fatos.map(([t,v])=>`<div><dt>${esc(t)}</dt><dd>${v}</dd></div>`).join("")}</dl>`:""}</header>`; }
/* abas: escolha de vista na mesma página (botões; a escolha fica em S.vista) ou de página irmã (links) */
const abas=(k,itens,rot)=>`<div class="abas" role="group" aria-label="${esc(rot)}">${itens.map(([v,t,q])=>`<button type="button" class="aba" data-acao="vista" data-k="${k}" data-v="${esc(v)}" data-fid="vista:${k}:${esc(v)}" aria-pressed="${S.vista[k]===v}">${esc(t)}${q!=null?`<span class="q">${q}</span>`:""}</button>`).join("")}</div>`;
const abasLinks=(itens,rot)=>`<nav class="abas" aria-label="${esc(rot)}">${itens.map(([h,t])=>`<a class="aba" href="${h}"${"#/"+(ROTA[0]||"")===h?` aria-current="page"`:""}>${esc(t)}</a>`).join("")}</nav>`;
const PAINEIS=[["#/painel","Carteira em gráficos"],["#/sensibilidade","Análise de sensibilidade"],["#/etiqueta","Etiqueta de relevância política"],["#/metodo","Método da avaliação"]];
const abasPaineis=()=>abasLinks(PAINEIS,"Painéis");
const abaPainel=(k,v,h)=>`<div class="aba-painel pilha" data-aba="${v}"${S.vista[k]===v?"":" hidden"}>${h}</div>`;
const dobra=(k,resumo,corpo,cls)=>`<details class="${cls||""}" data-dobra="${k}"${S.vista.dobras[k]?" open":""}><summary>${esc(resumo)}</summary>${corpo}</details>`;
/* no exemplo fictício, cada projeto diz que caso ele mostra */
const licaoDe=c=>S.modo==="demo"&&c&&c.licao?c.licao:"";
function linhaFila(c,n,rot){ return `<li class="${clsM(c)}"><span class="cod">${esc(c.code)}</span><span class="nm">${esc(c.nome)}${etiquetado(c.code)?` <span class="tag etq">Etiqueta</span>`:""}${tagAlerta(c)}<small>${esc([MISSOES[mDe(c)],c.unidade,DIRETORIAS[c.dir]||c.dir].filter(Boolean).join(", "))}</small>${licaoDe(c)?`<small class="licao">${esc(licaoDe(c))}</small>`:""}</span><span class="vl">${+c.novos>0?brl(c.novos):"Sem pedido novo"}</span><span class="ac"><a class="bt sec peq" href="#/etapa/${n}/${encodeURIComponent(c.code)}">${rot||"Abrir"}</a></span></li>`; }
function fila(n,titulo,vazio){ const L=projetos().filter(c=>estacao(c)===n);
  return `<section class="bloco"><h2>${esc(titulo)} <span class="tag${L.length?" etq":""}">${L.length}</span></h2>${L.length?`<ol class="fila">${L.map(c=>linhaFila(c,n)).join("")}</ol>`:`<p class="meta">${esc(vazio)}</p>`}</section>`; }
function cabProjeto(c,n){ return `<p class="meta"><a href="#/etapa/${n}">Voltar à fila da etapa ${n}</a></p><div class="cab-proj espaco-p ${clsM(c)}"><h2><b>${esc(c.code)}</b>${esc(c.nome)}</h2>${tagMissao(c)}${etiquetado(c.code)?`<span class="tag etq">Etiqueta de relevância política</span>`:""}${tagAlerta(c)}</div>
  <p class="fatos"><span><b>Unidade</b> ${esc(c.unidade||"—")}</span><span><b>Diretoria</b> ${esc(DIRETORIAS[c.dir]||c.dir||"—")}</span><span><b>Missão</b> ${esc(MISSOES[missaoDe(c)]||"—")}</span><span><b>Pedido novo</b> ${+c.novos>0?brl(c.novos):"não há"}</span><span><a href="#/projeto/${encodeURIComponent(c.code)}">Ver o percurso completo</a></span></p>${licaoDe(c)?`<p class="nota licao espaco-p"><b>O que este exemplo mostra.</b> ${esc(licaoDe(c))}</p>`:""}`; }
async function salvar(code,etapa,oque,msg){
  const e=E(code); (e.log=e.log||[]).push({em:new Date().toISOString(),por:quem(),etapa,oque});
  try{ await Dados.gravarProjeto(code,e); aviso(msg||oque); return true; }
  catch(err){ console.error(err); aviso("Não foi gravado. Tente de novo."); return false; } }

/* ---------- moldura: topo, trilho, rota ---------- */
function topo(){
  const t=$("#topo-dir"), m=$("#menu"), rp=$("#rodape-extra"); if(!S.modo){ t.innerHTML=""; m.innerHTML=""; rp.innerHTML=""; return; }
  const a=ROTA[0]||"", sec=a===""||a==="projeto"?"carteira":["painel","sensibilidade","etiqueta","metodo"].includes(a)?"paineis":a==="como"?"glossario":"";
  m.innerHTML=[["#/","Carteira","carteira"],["#/painel","Painéis","paineis"],["#/como","Glossário","glossario"]].map(([h,x,k])=>`<a href="${h}"${sec===k?` aria-current="page"`:""}>${x}</a>`).join("");
  t.innerHTML=`${S.modo==="demo"?`<span class="tag etq">Exemplo fictício</span>`:""}
   <label><span class="rot">Estou como</span> <select data-muda="papel" aria-label="Estou como">${PAPEIS.map(p=>`<option${p===S.usuario.papel?" selected":""}>${esc(p)}</option>`).join("")}</select></label>
   ${S.modo==="demo"?`<button class="bt discreto peq" data-acao="fechar">Sair do exemplo</button>`:`<button class="bt discreto peq" data-acao="sair" title="${esc(S.usuario.nome)}">Sair</button>`}`;
  rp.innerHTML=S.modo==="demo"?`<button type="button" class="lk" data-acao="reiniciar">Recomeçar o exemplo</button>`:`<span>Conectado como ${esc(S.usuario.nome)}.</span><button type="button" class="lk" data-acao="demo">Ver o exemplo fictício</button>`; }
/* o trilho das nove etapas, em três trechos; o número amarelo diz quantos projetos aguardam na etapa */
function trilho(){
  const el=$("#trilho"); if(!S.modo){ el.innerHTML=""; return; }
  const cont=contagem(), at=ROTA[0]==="etapa"?+ROTA[1]:0;
  const li=e=>{ const n=cont[e.n]||0, pend=[2,3,4,5,6,8].includes(e.n)&&n>0;
    return `<li class="${at===e.n?"atual":""}"><a href="#/etapa/${e.n}" title="Etapa ${e.n}: ${esc(e.t)}${pend?". "+n+(n===1?" projeto aguarda":" projetos aguardam")+" aqui.":""}"${at===e.n?` aria-current="step"`:""}><span class="num">${e.n}</span><span class="nome">${esc(e.curto)}</span>${pend?`<span class="cont">${n}</span>`:""}</a></li>`; };
  el.innerHTML=`<nav class="trilho" aria-label="As nove etapas"><div class="cx trilho-in">${TRECHOS.map(t=>`<div class="tr-grupo"><span class="tr-rot">${esc(t.t)}</span><ol>${ETAPAS.filter(e=>e.n>=t.de&&e.n<=t.ate).map(li).join("")}</ol></div>`).join("")}</div></nav>`; }
function render(){
  _rec=null; const M=$("#main"), ae=document.activeElement, fid=ae&&ae.dataset?ae.dataset.fid:null;
  topo(); trilho();
  if(S.carregando){ M.innerHTML=`<p class="meta">Carregando os projetos.</p>`; return; }
  if(!S.modo){ vEntrada(M); return; }
  const [a,b,c]=ROTA;
  if(a==="etapa"&&ETAPAS[+b-1]) vEtapa(M,+b,c&&S.base[c]?S.base[c]:null);
  else if(a==="projeto"&&S.base[b]) vProjeto(M,S.base[b]);
  else if(a==="etiqueta") vEtiqueta(M);
  else if(a==="painel") vPainel(M);
  else if(a==="sensibilidade") vSensibilidade(M);
  else if(a==="metodo") vMetodo(M);
  else if(a==="como") vComo(M);
  else vInicio(M);
  if(typeof leitorMontar==="function") leitorMontar();
  if(fid){ const el=document.querySelector(`[data-fid="${CSS.escape(fid)}"]`); if(el) el.focus({preventScroll:true}); } }
function rota(){
  /* aceita "#/etapa/3/F15" e também "#etapa-3-F15" (forma simples, usada onde o endereço só admite letras, números e hífen) */
  const nova=location.hash.replace(/^#\/?/,"").split(/[\/-]/).filter(Boolean).map(decodeURIComponent), chave=nova.join("/");
  const mudou=chave!==ROTA_ANT; if(mudou){ R={}; ROTA_ANT=chave; } ROTA=nova; render();
  if(mudou){ window.scrollTo(0,0); $("#main").focus({preventScroll:true}); } }
const hx=h=>window.ROTA_SIMPLES?"#"+h.replace(/^#\/?/,"").replace(/\//g,"-"):h;
const ir=h=>{ h=hx(h); if(location.hash===h||(h==="#"&&!location.hash)) rota(); else location.hash=h; };

/* ---------- entrada: exemplo fictício ou login ---------- */
const soLogado=()=>!!window.SO_LOGADO&&Dados.temNuvem();   /* no site público, nada aparece sem login, nem o exemplo */
function vEntrada(M){
  const login=Dados.temNuvem()?`<p>Para a equipe do projeto. Use o mesmo e-mail e a mesma senha de sempre.${soLogado()?" Depois de entrar, dá para abrir também um exemplo fictício.":""}</p>
     <form id="f-login" novalidate><div class="cmp"><label for="lg-e">E-mail</label><input id="lg-e" type="email" autocomplete="username" required></div><div class="cmp"><label for="lg-s">Senha</label><input id="lg-s" type="password" autocomplete="current-password" required></div>
     ${S.erro?`<p class="nota er espaco-p" role="alert">${esc(S.erro)}</p>`:""}<div class="acoes"><button class="bt${soLogado()?"":" sec"}" type="submit">Entrar</button></div></form>`:`<p>O acesso com login não está disponível nesta cópia da página.</p>`;
  M.innerHTML=`<div class="entrada"><div><h1>Matriz de priorização da carteira</h1>
    <p class="frase">Cada projeto percorre o mesmo caminho, do Canvas à decisão, em nove etapas. A matriz ordena a carteira, mostra até onde o dinheiro alcança e sugere uma saída para cada projeto.</p>
    <ol class="etapas-lista" aria-label="As nove etapas">${ETAPAS.map(e=>`<li><span class="num">${e.n}</span>${esc(e.t)}</li>`).join("")}</ol>
</div>
   <div class="entrada-lado">
    <section class="bloco"><h2>${soLogado()?"Entrar":"Entrar com os projetos reais"}</h2>${login}</section>
    ${soLogado()?"":`<section class="bloco"><h2>Ver com um exemplo fictício</h2><p>Trinta e três projetos inventados, espalhados pelas nove etapas. Cada um mostra um caso: o que devolve um Canvas, o que a árvore responde, quando as leituras divergem, as três cores do farol. Nada é enviado: tudo fica neste navegador.</p><div class="acoes"><button class="bt" data-acao="demo">Abrir o exemplo fictício</button></div></section>`}
   </div>
   <div class="entrada-missoes"><ul class="missoes" aria-label="As seis missões e os projetos transversais">${Object.keys(MISSOES).map(k=>`<li class="m-${k}"><b>${esc(MISSAO_TIT[k])}</b><span>${esc(MISSAO_SUB[k])}</span></li>`).join("")}</ul>
    <p class="meta entrada-nota">Os projetos são organizados pelas seis missões da Nova Indústria Brasil, mais os transversais. A cor da missão acompanha o projeto em todas as telas: no quadro da carteira, nas filas das etapas e nos painéis.</p></div></div>`; }
async function abrirNuvem(sess){
  S.carregando=true; S.erro=""; S.usuario.nome=(sess.user&&sess.user.email)||"Equipe"; render();
  try{ const d=await Dados.abrirNuvem(); S.base=d.base; S.est=d.est; S.canvas=d.canvas||{}; S.ciclo=d.ciclo||{}; S.modo="nuvem"; }
  catch(err){ console.error(err); S.modo=null; S.erro="Não foi possível ler os projetos. Verifique a conexão e tente de novo."; }
  S.carregando=false; rota(); }
ACOES.demo=()=>{ const d=Dados.abrirDemo(); S.base=d.base; S.est=d.est; S.canvas=d.canvas; S.ciclo=d.ciclo; S.modo="demo"; S.usuario.nome="Visitante"; try{ sessionStorage.setItem("matriz.modo","demo"); }catch(e){} rota(); };
ACOES.reiniciar=()=>{ const d=Dados.reiniciarDemo(); S.base=d.base; S.est=d.est; S.canvas=d.canvas; S.ciclo=d.ciclo; R={}; aviso("Exemplo recomeçado"); rota(); };
ACOES.fechar=async()=>{ try{ sessionStorage.removeItem("matriz.modo"); }catch(e){}
  if(Dados.sb){ const {data}=await Dados.sb.auth.getSession(); if(data&&data.session){ ir("#/"); return abrirNuvem(data.session); } }
  S.modo=null; ir("#/"); render(); };
ACOES.sair=async()=>{ await Dados.sair(); S.modo=null; S.base={}; S.est={}; S.canvas={}; ir("#/"); render(); };
ACOES.entrar=async()=>{ const erro=await Dados.entrar($("#lg-e").value.trim().toLowerCase(),$("#lg-s").value); if(erro){ S.erro=erro; render(); } };
ACOES.papel=(d,el)=>{ S.usuario.papel=el.value; };
ACOES.set=d=>{ rset(d.k,d.num?+d.v:d.v); render(); };

/* ---------- carteira: o quadro dos projetos, por missão, por etapa ou por saída ---------- */
ACOES.vista=d=>{ S.vista[d.k]=d.v; render(); };
function quadro(g){
  const P=projetos(), rs=L=>L.reduce((a,c)=>a+(+c.novos||0),0), ordS=Object.fromEntries(SAIDAS.map((x,i)=>[x[0],i]));
  /* dentro da coluna: primeiro quem tem saída (na ordem das saídas, do maior valor para o menor); depois, quem está mais adiante no caminho */
  const chave=c=>{ const s=saidaDe(c).saida; return s?ordS[s]:50-estacao(c); };
  const ord=L=>L.slice().sort((a,b)=>chave(a)-chave(b)||(valorDe(b)||0)-(valorDe(a)||0)||String(a.code).localeCompare(String(b.code),"pt-BR",{numeric:true}));
  let grupos, op;
  if(g==="etapa"){ op={missao:true,sit:"saida"};
    grupos=[2,3,4,5,6,8,9].map(n=>({cls:"g-etapa",tit:"Etapa "+n,sub:ETAPAS[n-1].t,href:"#/etapa/"+n,L:P.filter(c=>estacao(c)===n)})); }
  else if(g==="saida"){ op={missao:true,sit:"etapa"};
    grupos=[...SAIDAS.map(([k,t])=>({cls:"g-saida "+clsSaida(k),tit:t,sub:"",L:ord(P.filter(c=>saidaDe(c).saida===k))})),{cls:"g-saida res-nada",tit:"Ainda no caminho",sub:"Falta alguma etapa",L:ord(P.filter(c=>!saidaDe(c).saida))}]; }
  else { op={sit:"tudo"};
    grupos=Object.keys(MISSOES).map(m=>({cls:"m-"+m,tit:MISSAO_TIT[m],sub:MISSAO_SUB[m],L:ord(P.filter(c=>mDe(c)===m))})); }
  /* por missão, as sete colunas aparecem sempre: coluna vazia também informa. Nas outras vistas, as vazias viram uma linha de texto */
  const vazios=g==="missao"?[]:grupos.filter(x=>!x.L.length); if(g!=="missao") grupos=grupos.filter(x=>x.L.length);
  /* largura das colunas: todas começam com uma; enquanto couber (até oito no total), a coluna mais alta ganha mais uma, até nenhuma passar de sete cartões de altura */
  const ks=grupos.map(()=>1), alt=i=>Math.ceil(grupos[i].L.length/ks[i]);
  for(;;){ if(ks.reduce((a,b)=>a+b,0)>=8||!grupos.length) break; let j=0; for(let i=1;i<ks.length;i++) if(alt(i)>alt(j)) j=i; if(alt(j)<=7) break; ks[j]++; }
  const cols=ks.reduce((a,b)=>a+b,0)||1;
  return `<div class="quadro" style="--cols:${cols}">${grupos.map((x,i)=>{ const k=ks[i], v=rs(x.L);
      return `<section class="grupo k${Math.min(k,3)} ${x.cls}" style="--k:${k}" aria-label="${esc(x.tit+(x.sub?": "+x.sub:""))}"><header class="grupo-cab"><h2>${x.href?`<a href="${x.href}">${esc(x.tit)}</a>`:esc(x.tit)}</h2>${x.sub?`<p>${esc(x.sub)}</p>`:""}<p class="q">${x.L.length} ${x.L.length===1?"projeto":"projetos"}${v>0?", "+rsMi(v):""}</p></header>
        <div class="grupo-corpo">${x.L.length?x.L.map(c=>cartao(c,op)).join(""):`<p class="grupo-vazio">Nenhum projeto.</p>`}</div></section>`; }).join("")}</div>
    ${vazios.length?`<p class="meta espaco-p">Sem projetos: ${esc(vazios.map(x=>x.tit+(g==="etapa"?" ("+minus(x.sub)+")":"")).join("; "))}.</p>`:""}`; }
function filtraQuadro(){
  const q=semAcento((S.vista.busca||"").trim()); let n=0;
  document.querySelectorAll(".quadro .pc").forEach(el=>{ const fora=!!q&&!el.dataset.busca.includes(q); el.hidden=fora; if(!fora) n++; });
  document.querySelectorAll(".quadro .grupo").forEach(el=>el.classList.toggle("sem",!!q&&!!el.querySelector(".pc")&&!el.querySelector(".pc:not([hidden])")));
  const st=$("#busca-n"); if(st) st.textContent=q?(n===1?"1 projeto encontrado.":n+" projetos encontrados."):""; }
function vInicio(M){
  const P=projetos(), r=rec(), t=tetoAtual(), soma=somaPedidos(), g=["missao","etapa","saida"].includes(S.vista.grupo)?S.vista.grupo:(S.vista.grupo="missao");
  const cs={}; P.forEach(c=>{ const s=saidaDe(c).saida; if(s) cs[s]=(cs[s]||0)+1; });
  const av=S.ciclo.avaliacao, nDentro=r.linhas.filter(l=>l.dentro).length;
  const etq=P.filter(c=>etiquetado(c.code)), ale=P.filter(alertaDe);
  /* quem pede julgamento adicional vem da análise de sensibilidade, com os parâmetros em uso */
  let julg=[]; if(r.ordem.length){ const A=sensibilidade3(P.map(c=>sensEntrada3(c,E(c.code))),{valor:t.valor,publicado:!!t.publicado,parte:t.parte||1},soma,REGUA3,sensParam()); julg=A.projetos.filter(o=>o.julg==="Sim").map(o=>S.base[o.code]).filter(Boolean); }
  const porM=Object.keys(MISSOES).map(m=>{ const L=P.filter(c=>mDe(c)===m); return {m,n:L.length,rs:L.reduce((a,c)=>a+(+c.novos||0),0)}; }).filter(o=>o.n&&o.m!=="T").sort((a,b)=>b.n-a.n||b.rs-a.rs), top=porM.slice(0,2);
  const frase={missao:"Cada projeto está na coluna da missão em que foi avaliado. O cartão mostra o pedido de recurso novo, o valor e a saída sugerida; sem saída, mostra a etapa em que o projeto está.",
    etapa:"Cada projeto está na coluna da etapa em que se encontra agora. O título da coluna abre a fila de trabalho da etapa.",
    saida:"Cada projeto está na coluna da saída sugerida pela matriz ou já decidida pela Diretoria Executiva."}[g];
  M.innerHTML=pgCab({titulo:"Carteira"+(S.ciclo.ciclo?" "+S.ciclo.ciclo:""),frase,numeros:true,fatos:[
      ["projetos na carteira",P.length],["pedidos de recurso novo",esc(rsMi(soma))],
      [t.publicado?"teto de referência publicado":"teto no cenário de "+Math.round((t.parte||1)*100)+"% dos pedidos",esc(rsMi(t.valor))],
      ["acima da linha do teto",r.ordem.length?nDentro+" de "+r.ordem.length:"—"]]})
   +`${av?`<p class="nota at faixa-aval"><b>${esc(av.titulo||"Avaliação da carteira")}.</b> ${esc(av.faixa||"")} <a href="#/metodo">Como a avaliação foi feita</a></p>`:""}
   <div class="ferramentas${av?" espaco-p":""}">${abas("grupo",[["missao","Por missão"],["etapa","Por etapa"],["saida","Por saída"]],"Agrupar os projetos")}
     <label class="busca">Buscar projeto <input type="search" id="busca" placeholder="Nome ou código" value="${esc(S.vista.busca||"")}" autocomplete="off"></label></div>
   <ul class="legenda" aria-label="Saídas até agora"><li class="rot">Saídas até agora</li>${SAIDAS.map(([k,x])=>`<li><span class="tag ${clsSaida(k)}">${esc(x)}</span><b>${cs[k]||0}</b></li>`).join("")}</ul>
   <ul class="legenda l2" aria-label="Etiquetas nos cartões"><li class="rot">Nos cartões</li><li><span class="tag etq">Etiqueta</span>relevância política</li><li><span class="tag at">Fronteira</span>um ponto em uma nota muda o lado da linha</li><li><span class="tag res-par">Alerta</span>repete a entrega de outro projeto</li><li><span class="tag">Etapa</span>ainda sem saída: onde o projeto está</li></ul>
   <p class="meta" id="busca-n" role="status"></p>
   ${quadro(g)}
   ${faixa("am","Com etiqueta de relevância política","Entram primeiro no teto e não são barrados.",etq,["#/etiqueta","A etiqueta, do início ao fim"])}
   ${faixa("az","Pedem julgamento adicional","Mudam de lado da linha ou de posição quando mudam os pesos, quem lê ou o teto.",julg,["#/sensibilidade","Análise de sensibilidade"])}
   ${faixa("","Com alerta de repetição de entrega","Seguem no caminho; o alerta acompanha a sugestão e a decisão.",ale)}
   ${top.length===2?`<p class="nota fecho espaco-p"><b>Missões com mais projetos: ${esc(MISSOES[top[0].m])} (${top[0].n}) e ${esc(MISSOES[top[1].m])} (${top[1].n}). Juntas, têm ${top[0].n+top[1].n} dos ${P.length} projetos e ${esc(rsMi(top[0].rs+top[1].rs))} dos ${esc(rsMi(soma))} pedidos.</b>${r.ordem.length?` Com sugestão de priorizar: ${cs.priorizar||0} ${cs.priorizar===1?"projeto":"projetos"}, que usam ${esc(rsMi(r.usado))} do teto.`:""}</p>`:""}
   <div class="acoes"><a class="bt" href="#/etapa/7">Ver a lista e a linha do teto</a><a class="bt sec" href="#/painel">Ver a carteira em gráficos</a></div>`;
  filtraQuadro(); }

/* ---------- página de etapa: cabeçalho com quem faz, o que entra e o que sai; abaixo, o trabalho ---------- */
function vEtapa(M,n,c){
  const e=ETAPAS[n-1], tr=TRECHOS.find(t=>n>=t.de&&n<=t.ate)||{t:""};
  const ativ=e.ativ.map(a=>Array.isArray(a)?`<li><span><b>${esc(a[0])}</b> ${esc(minus(a[1]))}.</span></li>`
    :a.p?`<li><span class="perg">${esc(a.p)}${a.sim?`<small>Se sim: ${esc(minus(a.sim))}</small>`:""}${a.nao?`<small>Se não: ${esc(minus(a.nao))}</small>`:""}</span></li>`
    :`<li><span class="passa">${esc(a.s)}.</span></li>`).join("");
  /* nas etapas 3, 4 e 5, com um projeto aberto, o Canvas fica ao lado do trabalho */
  const comLeitor=[3,4,5].includes(n)&&!!c&&typeof leitorCanvas==="function";
  const estreito=(!!c&&!comLeitor)||(n===2&&!!ROTA[2]);   /* formulário de um projeto só: coluna de leitura confortável */
  const fatos=[["Quem faz",e.faz],["Entra",e.entra],["Sai",e.sai],e.etiqueta?["Com etiqueta",e.etiqueta]:null].filter(Boolean), aberto=!!c||(n===2&&!!ROTA[2]);
  M.innerHTML=(aberto
     ?pgCab({num:n,onde:`Etapa ${n} de 9, ${esc(minus(tr.t))}`,titulo:e.t})+dobra("como","Como funciona esta etapa",`<p class="frase">${esc(e.frase)}</p><dl class="gloss curto espaco-p">${fatos.map(([t,v])=>`<dt>${esc(t)}</dt><dd>${esc(v)}</dd>`).join("")}</dl><ol class="ativ">${ativ}</ol>`,"como-dobra")
     :pgCab({num:n,onde:`Etapa ${n} de 9, ${esc(minus(tr.t))}`,titulo:e.t,frase:e.frase,fatos:fatos.map(([t,v])=>[t,esc(v)])})+dobra("ativ","Atividades desta etapa, na ordem",`<ol class="ativ">${ativ}</ol>`,"como-dobra"))
   +(comLeitor?`<div class="duas com-leitor"><div class="trabalho">${TELAS[n](c)}</div>${leitorCanvas(c)}</div>`
    :`<div class="trabalho${estreito?" estreito":""}">${TELAS[n](c)}</div>`); }

/* ---------- percurso de um projeto pelas nove etapas ---------- */
function resumoEtapa(c,n){
  const e=E(c.code), f=e.ficha||{}, p=e.porta||{}, a=e.arvore||{}, nt=notasDe(c), fr=farol3((e.farol||{}).exq), l=linhaDe(c.code), d=e.decisao;
  switch(n){
    case 1: return S.ciclo.publicadoEm?"Regras publicadas em "+dataBR(S.ciclo.publicadoEm)+".":"Regras ainda não publicadas.";
    case 2: return (f.enviada?"Canvas enviado"+(f.enviadaEm?" em "+dataBR(f.enviadaEm):"")+".":"Canvas ainda não enviado.")+(f.etiqueta==="concedida"?" Etiqueta de relevância política concedida.":f.etiqueta==="negada"?" Pedido de etiqueta negado.":f.pedidoPolitico?" Pedido de etiqueta aguarda a Diretoria Executiva.":"");
    case 3: return !p.fechada?(p.devolvidaEm?"Canvas devolvido para completar"+(p.nota?": "+p.nota:"."):""):p.mandato==="não"?"Fora do papel legal da Agência.":p.repete==="sim"&&REGUA3.repeticaoTira?"Repete a entrega de outro projeto.":(p.medicao==="não"?"Sem indicador nem plano de medição.":"Canvas aceito.")+(p.repete==="sim"?" "+ALERTA_REPETE:"");
    case 4: return a.saida?ARV_TXT[a.saida]+(aderencia3(a.saida)?": nota de aderência "+aderencia3(a.saida):"")+"."+(a.oe?" Vínculo: objetivo "+a.oe+".":"")+(a.elo?" Elo: "+a.elo+(a.estrela?" ★":"")+".":"")+(abdiDe(c).eixos?" ABDI 5.0: "+abdiDe(c).texto+".":""):"";
    case 5: return nt.n?nt.n+" de 2 leituras."+(nt.completo?" Valor "+nf(valorDe(c))+".":nt.n===2?" Falta conciliar.":""):"";
    case 6: return fr?FAROL_TXT[fr]+".":"";
    case 7: return l.saida?"Sugestão: "+l.rotulo.toLowerCase()+". "+l.motivo+(l.condicao?" "+l.condicao:"")+(l.alerta?" "+l.alerta:""):(l.estado||"");
    case 8: return d?(d.tipo==="seguir"?"Sugestão confirmada.":"Decisão diferente da sugestão: "+rotSaida(d.saida).toLowerCase()+". Motivo: "+d.motivo):"";
    case 9: return d?(e.log||[]).length+" registros guardados junto ao Canvas.":""; } }
function vProjeto(M,c){
  const at=estacao(c), s=saidaDe(c), l=linhaDe(c.code);
  const li=ETAPAS.map(e=>{ const r=resumoEtapa(c,e.n), agora=e.n===at, feito=!agora&&!!r&&(e.n<at||e.n===1||e.n===7), pulo=!r&&e.n<at;
    return `<li class="${agora?"agora":feito?"feito":""}"><span class="num">${e.n}</span><div><h3>${esc(e.t)}</h3><p>${esc(r||(pulo?"O projeto não passou por esta etapa: saiu antes.":agora?"O projeto está aqui.":"Ainda não chegou."))}</p></div>
      <div>${agora&&e.n<=6?`<a class="bt peq" href="#/etapa/${e.n}/${encodeURIComponent(c.code)}">Trabalhar nesta etapa</a>`:agora?`<a class="bt peq" href="#/etapa/${e.n}">Abrir a etapa</a>`:feito&&e.n>=2&&e.n<=6?`<a class="bt discreto peq" href="#/etapa/${e.n}/${encodeURIComponent(c.code)}">Rever</a>`:""}</div></li>`; }).join("");
  M.innerHTML=pgCab({onde:`<a href="#/">Carteira</a>`,cls:"proj "+clsM(c),titulo:c.code+": "+c.nome,
      extra:`<p class="pg-sit">${s.saida?`<span class="tag ${clsSaida(s.saida)}">${s.decidida?"Decidido":"Sugestão"}: ${esc(rotSaida(s.saida))}</span>`:`<span class="tag res-nada">Sem saída ainda</span>`}<span class="tag">Etapa ${at}: ${esc(ETAPAS[at-1].curto)}</span>${etiquetado(c.code)?`<span class="tag etq">Etiqueta de relevância política</span>`:""}${l.fronteira?`<span class="tag at">Caso de fronteira</span>`:""}${tagAlerta(c)}</p>${licaoDe(c)?`
       <p class="nota licao espaco-p"><b>O que este exemplo mostra.</b> ${esc(licaoDe(c))}</p>`:""}`,
      fatos:[["Missão",`${tagMissao(c)} ${esc(MISSOES[mDe(c)])}${missaoDe(c)!==missaoCanvas(c)?` <span class="meta">(o Canvas indicava ${esc(MISSOES[missaoCanvas(c)]||"—")})</span>`:""}`],
        ["Unidade",esc(c.unidade||"—")],["Diretoria",esc(DIRETORIAS[c.dir]||c.dir||"—")],["Pedido novo",+c.novos>0?brl(c.novos):"não há"],["Projeto",ehNovo(c)?"novo":"em execução"],l.valor!=null?["Valor",nf(l.valor)+(l.farol?" "+sinal(l.farol):"")]:null]})
   +`<div class="pilha"><div class="duas-p"><section class="bloco"><h2>Percurso pelas nove etapas</h2><ol class="percurso">${li}</ol></section>
     <div class="pilha"><section class="bloco"><h2>O que o Canvas diz</h2><dl class="gloss curto"><dt>Problema</dt><dd>${esc(c.problema||"—")}</dd><dt>Meta</dt><dd>${esc(c.meta||"—")}</dd><dt>Evidência</dt><dd>${esc(c.evidencia||"—")}</dd></dl></section>${blocoAbdi(c)}</div></div>
    ${blocoEvidencias(c)}
    <section class="bloco"><h2>Registro</h2>${(E(c.code).log||[]).length?`<ol class="diario">${E(c.code).log.slice().reverse().map(g=>`<li><time>${esc(dataHora(g.em))}</time><span>Etapa ${g.etapa}: ${esc(g.oque)} <span class="meta">${esc(g.por)}</span></span></li>`).join("")}</ol>`:`<p class="meta">Nada registrado ainda.</p>`}</section></div>`; }

/* ---------- eventos e partida ---------- */
document.addEventListener("click",ev=>{ const lk=window.ROTA_SIMPLES&&ev.target.closest('a[href^="#/"]'); if(lk){ ev.preventDefault(); ir(lk.getAttribute("href")); return; }
  const b=ev.target.closest("[data-acao]"); if(!b) return; const f=ACOES[b.dataset.acao]; if(f){ ev.preventDefault(); f(b.dataset,b); } });
document.addEventListener("input",ev=>{ const t=ev.target;
  if(t.dataset&&t.dataset.moeda){ const dig=t.value.slice(0,t.selectionStart==null?t.value.length:t.selectionStart).replace(/[^\d,]/g,"").length, f=moedaMascara(t.value); if(f!==t.value){ t.value=f; let n=0,pos=f.length; if(!dig) pos=Math.min(f.length,f.indexOf("R$ ")===0?3:0); else for(let i=3;i<f.length;i++){ if(/[\d,]/.test(f[i])&&++n===dig){ pos=i+1; break; } } try{ t.setSelectionRange(pos,pos); }catch(e){} } }
  if(t.id==="busca"){ S.vista.busca=t.value; filtraQuadro(); }
  if(t.dataset&&t.dataset.rasc) rset(t.dataset.rasc,t.type==="checkbox"?t.checked:t.value); });
/* dobras (atividades da etapa etc.): a página se redesenha a cada resposta, então a dobra aberta fica guardada */
document.addEventListener("toggle",ev=>{ const d=ev.target; if(d&&d.dataset&&d.dataset.dobra) S.vista.dobras[d.dataset.dobra]=d.open; },true);
document.addEventListener("change",ev=>{ const t=ev.target; if(t.dataset&&t.dataset.muda){ const f=ACOES[t.dataset.muda]; if(f) f(t.dataset,t); } });
document.addEventListener("submit",ev=>{ if(ev.target.id==="f-login"){ ev.preventDefault(); ACOES.entrar(); } });
window.addEventListener("hashchange",rota);
async function partida(){
  let demo=false; try{ demo=sessionStorage.getItem("matriz.modo")==="demo"; }catch(e){}
  if(Dados.temNuvem()){
    try{ const sess=await Dados.iniciarNuvem(s=>{ if(s&&!S.modo&&!S.carregando) abrirNuvem(s); else if(!s&&S.modo==="nuvem"){ S.modo=null; S.base={}; S.est={}; S.canvas={}; render(); } });
      if(sess){ if(demo) ACOES.demo(); else await abrirNuvem(sess); return; } }catch(e){ console.error(e); } }
  if((demo||window.ABRE_EXEMPLO)&&!soLogado()){ ACOES.demo(); return; }   /* ABRE_EXEMPLO: cópia que só tem o exemplo já abre nele */
  rota(); }
/* só parte depois que todos os arquivos da página carregaram */
document.addEventListener("DOMContentLoaded",partida);

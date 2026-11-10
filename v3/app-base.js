/* ===== Esteira v3.0 · estado, cálculo e moldura ===== */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(+v||0);
const nf=(v,d=2)=>v==null||isNaN(v)?"—":new Intl.NumberFormat("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
const dataBR=iso=>iso?new Date(iso.length===10?iso+"T12:00:00":iso).toLocaleDateString("pt-BR"):"—";
const dataHora=iso=>iso?new Date(iso).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"—";
const num=v=>{ const s=String(v==null?"":v).trim(); if(!s) return null; const n=+s.replace(/[^\d,.-]/g,"").replace(/\./g,"").replace(",","."); return isNaN(n)?null:n; };
const clone=o=>JSON.parse(JSON.stringify(o||{}));
const minus=t=>t.charAt(0).toLowerCase()+t.slice(1);

const S={modo:null,usuario:{nome:"Visitante",papel:UGE},base:{},est:{},canvas:{},ciclo:{},cenario:1,erro:"",carregando:false};   /* canvas: os Canvas como estão guardados, com os rascunhos */
let R={}, ROTA=[], ROTA_ANT=null, _rec=null;
const TELAS={}, ACOES={};
const rget=(k,d)=>{ const v=k.split(".").reduce((o,p)=>o==null?o:o[p],R); return v==null?d:v; };
const rset=(k,v)=>{ const ps=k.split("."); let o=R; ps.slice(0,-1).forEach(p=>{ o=o[p]=(o[p]&&typeof o[p]==="object")?o[p]:{}; }); o[ps[ps.length-1]]=v; };
const quem=()=>S.usuario.nome+" ("+S.usuario.papel+")";
const projetos=()=>Object.values(S.base).sort((a,b)=>String(a.code).localeCompare(String(b.code),"pt-BR",{numeric:true}));
const rotSaida=s=>(SAIDAS.find(x=>x[0]===s)||[,"—"])[1];

/* ---------- o que se sabe de cada projeto ---------- */
const E=code=>S.est[code]||(S.est[code]={ficha:{},log:[]});
const etiquetado=code=>(E(code).ficha||{}).etiqueta==="concedida";
const ehNovo=c=>{ const f=E(c.code).ficha||{}; return f.novo!=null?!!f.novo:/^N/i.test(c.code); };
const missaoDe=c=>(E(c.code).arvore||{}).missao||c.missao;

/* etapa 5: junta as duas leituras. Diferença de 2 pontos ou mais pede a nota conciliada. */
function notasDe(c){
  const e=E(c.code), L=e.leituras||{}, l1=L.L1, l2=L.L2, con=e.conciliacao||{};
  const o={A:aderencia3((e.arvore||{}).saida),n:(l1?1:0)+(l2?1:0),diverge:[],danoDiverge:false,dano:false,completo:false};
  if(l1&&l2){
    for(const k of ["R","E","I"]){ if(Math.abs(l1[k]-l2[k])>=REGUA3.divergencia){ o.diverge.push(k); o[k]=con[k]!=null?+con[k]:null; } else o[k]=(l1[k]+l2[k])/2; }
    if(!!l1.dano!==!!l2.dano){ o.danoDiverge=true; o.dano=con.dano!=null?!!con.dano:null; } else o.dano=!!l1.dano;
    o.completo=["R","E","I"].every(k=>o[k]!=null)&&o.dano!==null; }
  return o; }
const valorDe=c=>{ const n=notasDe(c); return n.completo?valor3({A:n.A,R:n.R,E:n.E,I:n.I}):null; };

/* os fatos que o motor recebe */
function fatos(c){
  const e=E(c.code), p=e.porta||{}, n=notasDe(c), sn=v=>v==="sim"?true:v==="não"?false:undefined;
  return {code:c.code,novos:+c.novos||0,novo:ehNovo(c),completa:sn(p.completa),mandato:sn(p.mandato),repete:sn(p.repete),medicao:sn(p.medicao),
    arvore:(e.arvore||{}).saida,notas:n.completo?{A:n.A,R:n.R,E:n.E,I:n.I}:{A:n.A},dano:n.completo&&n.dano===true,exq:(e.farol||{}).exq,etiqueta:etiquetado(c.code)}; }

/* em que etapa o projeto está agora */
function estacao(c){
  const e=E(c.code);
  if(e.decisao) return 9;
  if(!(e.ficha||{}).enviada) return 2;
  if(!(e.porta||{}).fechada) return 3;
  const pr=porta3(fatos(c)); if(pr&&pr.saida) return 8;
  const a=e.arvore||{}; if(!a.saida||a.saida==="red") return 4;
  if(!notasDe(c).completo) return 5;
  if(!farol3((e.farol||{}).exq)) return 6;
  return 8; }
function contagem(){ const o={}; projetos().forEach(c=>{ const n=estacao(c); o[n]=(o[n]||0)+1; }); return o; }

/* etapa 7: teto e recomendação */
function tetoAtual(){
  const t=+S.ciclo.teto; if(t>0) return {valor:t,origem:"Teto de referência publicado nas regras do ciclo"};
  const tot=projetos().reduce((a,c)=>a+(+c.novos||0),0);
  return {valor:tot*S.cenario,origem:"Cenário: "+Math.round(S.cenario*100)+"% dos pedidos. Não há teto publicado."}; }
const rec=()=>_rec||(_rec=recomendar3(projetos().map(fatos),tetoAtual().valor));
const linhaDe=code=>rec().linhas.find(x=>x.code===code)||{};
function saidaDe(c){ const d=E(c.code).decisao, l=linhaDe(c.code); if(d) return {saida:d.saida||l.saida,decidida:true,linha:l}; return {saida:l.saida,decidida:false,linha:l}; }

/* ---------- peças de tela ---------- */
function aviso(msg){ const a=$("#aviso"); a.textContent=msg; a.classList.add("on"); clearTimeout(aviso.t); aviso.t=setTimeout(()=>a.classList.remove("on"),2600); }
function ops(k,lista,atual){ return `<div class="opcoes" role="group">${lista.map(([v,t,cls])=>`<button type="button" class="op ${cls||""}" data-acao="set" data-k="${k}" data-v="${esc(v)}" data-fid="${k}:${esc(v)}" aria-pressed="${String(atual)===String(v)}">${esc(t)}</button>`).join("")}</div>`; }
const SIMNAO=[["sim","Sim","sim"],["não","Não","nao"]];
function area(k,rot,dica,linhas){ return `<div class="cmp"><label for="i_${k}">${esc(rot)}</label><textarea id="i_${k}" data-rasc="${k}" rows="${linhas||3}">${esc(rget(k,""))}</textarea>${dica?`<span class="dica">${esc(dica)}</span>`:""}</div>`; }
function texto(k,rot,dica,tipo){ return `<div class="cmp"><label for="i_${k}">${esc(rot)}</label><input id="i_${k}" type="${tipo||"text"}" data-rasc="${k}" value="${esc(rget(k,""))}">${dica?`<span class="dica">${esc(dica)}</span>`:""}</div>`; }
const sinal=(f,g)=>f?`<span class="sinal ${f}${g?" g":""}" role="img" aria-label="${esc(FAROL_TXT[f])}"><i></i><i></i><i></i></span>`:"";
const chip=c=>`<a class="chip${etiquetado(c.code)?" etq":""}" href="#/projeto/${encodeURIComponent(c.code)}"><b>${esc(c.code)}</b>${esc(c.nome)}</a>`;
function linhaFila(c,n,rot){ return `<li><span class="cod">${esc(c.code)}</span><span class="nm">${esc(c.nome)}${etiquetado(c.code)?` <span class="tag etq">Etiqueta</span>`:""}<small>${esc([c.unidade,DIRETORIAS[c.dir]||c.dir].filter(Boolean).join(", "))}</small></span><span class="vl">${+c.novos>0?brl(c.novos):"Sem pedido novo"}</span><span class="ac"><a class="bt sec peq" href="#/etapa/${n}/${encodeURIComponent(c.code)}">${rot||"Abrir"}</a></span></li>`; }
function fila(n,titulo,vazio){ const L=projetos().filter(c=>estacao(c)===n);
  return `<section class="bloco"><h2>${esc(titulo)} <span class="tag${L.length?" etq":""}">${L.length}</span></h2>${L.length?`<ol class="fila">${L.map(c=>linhaFila(c,n)).join("")}</ol>`:`<p class="meta">${esc(vazio)}</p>`}</section>`; }
function cabProjeto(c,n){ return `<p class="meta"><a href="#/etapa/${n}">Voltar à fila da etapa ${n}</a></p><div class="cab-proj espaco-p"><h2><b>${esc(c.code)}</b>${esc(c.nome)}</h2>${etiquetado(c.code)?`<span class="tag etq">Etiqueta de relevância política</span>`:""}</div>
  <p class="fatos"><span><b>Unidade</b> ${esc(c.unidade||"—")}</span><span><b>Diretoria</b> ${esc(DIRETORIAS[c.dir]||c.dir||"—")}</span><span><b>Missão</b> ${esc(MISSOES[missaoDe(c)]||"—")}</span><span><b>Pedido novo</b> ${+c.novos>0?brl(c.novos):"não há"}</span><span><a href="#/projeto/${encodeURIComponent(c.code)}">Ver o percurso completo</a></span></p>`; }
async function salvar(code,etapa,oque,msg){
  const e=E(code); (e.log=e.log||[]).push({em:new Date().toISOString(),por:quem(),etapa,oque});
  try{ await Dados.gravarProjeto(code,e); aviso(msg||oque); return true; }
  catch(err){ console.error(err); aviso("Não foi gravado. Tente de novo."); return false; } }

/* ---------- moldura: topo, trilho, rota ---------- */
function topo(){
  const t=$("#topo-dir"); if(!S.modo){ t.innerHTML=""; return; }
  t.innerHTML=`${S.modo==="demo"?`<span class="tag etq">Exemplo fictício</span>`:`<span>${esc(S.usuario.nome)}</span>`}
   <label>Estou como <select data-muda="papel">${PAPEIS.map(p=>`<option${p===S.usuario.papel?" selected":""}>${esc(p)}</option>`).join("")}</select></label>
   ${S.modo==="demo"?`<button class="bt discreto peq" data-acao="reiniciar">Recomeçar o exemplo</button><button class="bt discreto peq" data-acao="fechar">Sair do exemplo</button>`:`<button class="bt discreto peq" data-acao="demo">Ver o exemplo fictício</button><button class="bt discreto peq" data-acao="sair">Sair</button>`}`; }
function trilho(){
  const el=$("#trilho"); if(!S.modo){ el.innerHTML=""; return; }
  const cont=contagem(), at=ROTA[0]==="etapa"?+ROTA[1]:0;
  el.innerHTML=`<nav class="trilho" aria-label="As nove etapas"><div class="cx"><ol>${ETAPAS.map(e=>{ const n=cont[e.n]||0, pend=[2,3,4,5,6,8].includes(e.n)&&n>0;
     return `<li class="${at===e.n?"atual":""}"><a href="#/etapa/${e.n}"${at===e.n?` aria-current="step"`:""}><span class="num">${e.n}</span><span class="nome">${esc(e.curto)}</span>${pend?`<span class="cont" title="Projetos que aguardam nesta etapa">${n}</span>`:""}</a></li>`; }).join("")}</ol>
   <div class="trechos" aria-hidden="true">${TRECHOS.map(t=>`<span style="grid-column:${t.de}/${t.ate+1}">${esc(t.t)}</span>`).join("")}</div></div></nav>`; }
function render(){
  _rec=null; const M=$("#main"), ae=document.activeElement, fid=ae&&ae.dataset?ae.dataset.fid:null;
  topo(); trilho();
  if(S.carregando){ M.innerHTML=`<p class="meta">Carregando os projetos.</p>`; return; }
  if(!S.modo){ vEntrada(M); return; }
  const [a,b,c]=ROTA;
  if(a==="etapa"&&ETAPAS[+b-1]) vEtapa(M,+b,c&&S.base[c]?S.base[c]:null);
  else if(a==="projeto"&&S.base[b]) vProjeto(M,S.base[b]);
  else if(a==="etiqueta") vEtiqueta(M);
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
  M.innerHTML=`<div class="abertura"><h1><span class="leve">Do Canvas à decisão,</span><span class="forte">em nove etapas.</span></h1>
   <p class="sub">Esta página mostra o caminho que cada projeto percorre até virar prioridade da carteira: regras do ciclo, Canvas, elegibilidade, árvore da missão, notas, farol, recomendação, decisão e registro.</p></div>
  <div class="entrada">
   ${soLogado()?"":`<section class="bloco"><h2>Ver com um exemplo fictício</h2><p>Dezesseis projetos inventados, já espalhados pelas nove etapas. Nada é enviado: tudo fica neste navegador.</p><div class="acoes"><button class="bt" data-acao="demo">Abrir o exemplo fictício</button></div></section>`}
   <section class="bloco"><h2>${soLogado()?"Entrar":"Entrar com os projetos reais"}</h2>${Dados.temNuvem()?`<p>Para a equipe do projeto. Use o mesmo e-mail e a mesma senha do site atual.${soLogado()?" Depois de entrar, dá para abrir também um exemplo fictício.":""}</p>
     <form id="f-login" novalidate><div class="cmp"><label for="lg-e">E-mail</label><input id="lg-e" type="email" autocomplete="username" required></div><div class="cmp"><label for="lg-s">Senha</label><input id="lg-s" type="password" autocomplete="current-password" required></div>
     ${S.erro?`<p class="nota er espaco-p" role="alert">${esc(S.erro)}</p>`:""}<div class="acoes"><button class="bt sec" type="submit">Entrar</button></div></form>`:`<p>O acesso com login não está disponível nesta cópia da página.</p>`}</section>
  </div>`; }
async function abrirNuvem(sess){
  S.carregando=true; S.erro=""; S.usuario.nome=(sess.user&&sess.user.email)||"Equipe"; render();
  try{ const d=await Dados.abrirNuvem(); S.base=d.base; S.est=d.est; S.canvas=d.canvas||{}; S.ciclo=d.ciclo||{}; S.modo="nuvem"; }
  catch(err){ console.error(err); S.modo=null; S.erro="Não foi possível ler os projetos. Verifique a conexão e tente de novo."; }
  S.carregando=false; rota(); }
ACOES.demo=()=>{ const d=Dados.abrirDemo(); S.base=d.base; S.est=d.est; S.canvas=d.canvas; S.ciclo=d.ciclo; S.modo="demo"; S.usuario.nome="Visitante"; try{ sessionStorage.setItem("esteira3.modo","demo"); }catch(e){} rota(); };
ACOES.reiniciar=()=>{ const d=Dados.reiniciarDemo(); S.base=d.base; S.est=d.est; S.canvas=d.canvas; S.ciclo=d.ciclo; R={}; aviso("Exemplo recomeçado"); rota(); };
ACOES.fechar=async()=>{ try{ sessionStorage.removeItem("esteira3.modo"); }catch(e){}
  if(Dados.sb){ const {data}=await Dados.sb.auth.getSession(); if(data&&data.session){ ir("#/"); return abrirNuvem(data.session); } }
  S.modo=null; ir("#/"); render(); };
ACOES.sair=async()=>{ await Dados.sair(); S.modo=null; S.base={}; S.est={}; S.canvas={}; ir("#/"); render(); };
ACOES.entrar=async()=>{ const erro=await Dados.entrar($("#lg-e").value.trim().toLowerCase(),$("#lg-s").value); if(erro){ S.erro=erro; render(); } };
ACOES.papel=(d,el)=>{ S.usuario.papel=el.value; };
ACOES.set=d=>{ rset(d.k,d.num?+d.v:d.v); render(); };

/* ---------- início: a esteira com os projetos em cada etapa ---------- */
function vInicio(M){
  const por={}; projetos().forEach(c=>{ const n=estacao(c); (por[n]=por[n]||[]).push(c); });
  const nLista=rec().linhas.filter(l=>l.saida).length, cs={}; projetos().forEach(c=>{ const s=saidaDe(c).saida; if(s) cs[s]=(cs[s]||0)+1; });
  const col=e=>{ let corpo;
    if(e.n===1) corpo=`<p class="vazio">${S.ciclo.publicadoEm?"Regras publicadas em "+dataBR(S.ciclo.publicadoEm)+".":"Regras ainda não publicadas."}</p>`;
    else if(e.n===7) corpo=`<p class="vazio">${nLista} com sugestão de saída.</p>`;
    else { const L=por[e.n]||[]; corpo=L.length?`<div class="chips">${L.map(chip).join("")}</div>`:`<p class="vazio">${e.n===9?"Nenhuma decisão registrada.":"Ninguém aguarda aqui."}</p>`; }
    return `<section class="col" aria-label="Etapa ${e.n}: ${esc(e.t)}"><h3><b>${e.n}</b> ${esc(e.curto)}</h3>${corpo}</section>`; };
  M.innerHTML=`<div class="abertura"><h1><span class="leve">Do Canvas à decisão,</span><span class="forte">em nove etapas.</span></h1>
    <p class="sub">Cada projeto percorre o mesmo caminho. Abaixo, onde cada um está agora. Abra uma etapa no trilho para ver quem faz, o que entra, o que sai e a fila de trabalho.</p></div>
   <div class="esteira" aria-label="Projetos em cada etapa">${ETAPAS.map(col).join("")}</div>
   <h2 class="espaco">Saídas até agora</h2><p class="meta">Sugeridas pela esteira ou já decididas pela Diretoria Executiva.</p>
   <div class="saidas">${SAIDAS.map(([k,t])=>`<div><b>${cs[k]||0}</b><span>${esc(t)}</span></div>`).join("")}</div>
   <div class="acoes"><a class="bt" href="#/etapa/7">Ver a lista e a linha do teto</a><a class="bt sec" href="#/como">Glossário e pontos em aberto</a></div>`; }

/* ---------- página de etapa: como funciona, à esquerda; trabalho, à direita ---------- */
function vEtapa(M,n,c){
  const e=ETAPAS[n-1];
  const ativ=e.ativ.map(a=>Array.isArray(a)?`<li><span><b>${esc(a[0])}</b> ${esc(minus(a[1]))}.</span></li>`
    :a.p?`<li><span class="perg">${esc(a.p)}${a.sim?`<small>Se sim: ${esc(minus(a.sim))}</small>`:""}${a.nao?`<small>Se não: ${esc(minus(a.nao))}</small>`:""}</span></li>`
    :`<li><span class="passa">${esc(a.s)}.</span></li>`).join("");
  /* na etapa 3, com um projeto aberto, o Canvas fica ao lado das perguntas e o "como funciona" recolhe */
  const comLeitor=n===3&&!!c&&typeof leitorCanvas==="function";
  const como=`<aside class="como" aria-label="Como funciona esta etapa">
     <dl><div><dt>Quem faz</dt><dd>${esc(e.faz)}</dd></div><div><dt>Entra</dt><dd>${esc(e.entra)}</dd></div><div><dt>Sai</dt><dd>${esc(e.sai)}</dd></div>${e.etiqueta?`<div><dt>Com etiqueta</dt><dd>${esc(e.etiqueta)}</dd></div>`:""}</dl>
     <h2>Atividades, na ordem</h2><ol class="ativ">${ativ}</ol></aside>`;
  M.innerHTML=`<header><p class="passo">Etapa ${n} de 9</p><h1>${esc(e.t)}</h1><p class="frase">${esc(e.frase)}</p></header>
   ${comLeitor?`<details class="como-dobra"><summary>Como funciona esta etapa</summary>${como}</details>
    <div class="duas com-leitor"><div class="trabalho">${TELAS[n](c)}</div>${leitorCanvas(c)}</div>`
    :`<div class="duas">${como}<div class="trabalho">${TELAS[n](c)}</div></div>`}`; }

/* ---------- percurso de um projeto pelas nove etapas ---------- */
function resumoEtapa(c,n){
  const e=E(c.code), f=e.ficha||{}, p=e.porta||{}, a=e.arvore||{}, nt=notasDe(c), fr=farol3((e.farol||{}).exq), l=linhaDe(c.code), d=e.decisao;
  switch(n){
    case 1: return S.ciclo.publicadoEm?"Regras publicadas em "+dataBR(S.ciclo.publicadoEm)+".":"Regras ainda não publicadas.";
    case 2: return (f.enviada?"Canvas enviado"+(f.enviadaEm?" em "+dataBR(f.enviadaEm):"")+".":"Canvas ainda não enviado.")+(f.etiqueta==="concedida"?" Etiqueta de relevância política concedida.":f.etiqueta==="negada"?" Pedido de etiqueta negado.":f.pedidoPolitico?" Pedido de etiqueta aguarda a Diretoria Executiva.":"");
    case 3: return !p.fechada?"":p.mandato==="não"?"Fora do papel legal da Agência.":p.repete==="sim"?"Repete a entrega de outro projeto.":p.medicao==="não"?"Sem indicador nem plano de medição.":"Canvas aceito.";
    case 4: return a.saida?ARV_TXT[a.saida]+(aderencia3(a.saida)?": nota de aderência "+aderencia3(a.saida):"")+"."+(a.oe?" Vínculo: objetivo "+a.oe+".":"")+(a.estrela?" Elo com estrela.":""):"";
    case 5: return nt.n?nt.n+" de 2 leituras."+(nt.completo?" Valor "+nf(valorDe(c))+".":nt.n===2?" Falta conciliar.":""):"";
    case 6: return fr?FAROL_TXT[fr]+".":"";
    case 7: return l.saida?"Sugestão: "+l.rotulo.toLowerCase()+". "+l.motivo:(l.estado||"");
    case 8: return d?(d.tipo==="seguir"?"Sugestão confirmada.":"Decisão diferente da sugestão: "+rotSaida(d.saida).toLowerCase()+". Motivo: "+d.motivo):"";
    case 9: return d?(e.log||[]).length+" registros guardados junto ao Canvas.":""; } }
function vProjeto(M,c){
  const at=estacao(c), s=saidaDe(c);
  const li=ETAPAS.map(e=>{ const r=resumoEtapa(c,e.n), agora=e.n===at, feito=!agora&&!!r&&(e.n<at||e.n===1||e.n===7), pulo=!r&&e.n<at;
    return `<li class="${agora?"agora":feito?"feito":""}"><span class="num">${e.n}</span><div><h3>${esc(e.t)}</h3><p>${esc(r||(pulo?"O projeto não passou por esta etapa: saiu antes.":agora?"O projeto está aqui.":"Ainda não chegou."))}</p></div>
      <div>${agora&&e.n<=6?`<a class="bt peq" href="#/etapa/${e.n}/${encodeURIComponent(c.code)}">Trabalhar nesta etapa</a>`:agora?`<a class="bt peq" href="#/etapa/${e.n}">Abrir a etapa</a>`:feito&&e.n>=2&&e.n<=6?`<a class="bt discreto peq" href="#/etapa/${e.n}/${encodeURIComponent(c.code)}">Rever</a>`:""}</div></li>`; }).join("");
  M.innerHTML=`<header><p class="passo"><a href="#/">Início</a></p><div class="cab-proj"><h1>${esc(c.code)}: ${esc(c.nome)}</h1></div>
    <p class="fatos"><span><b>Unidade</b> ${esc(c.unidade||"—")}</span><span><b>Diretoria</b> ${esc(DIRETORIAS[c.dir]||c.dir||"—")}</span><span><b>Missão</b> ${esc(MISSOES[missaoDe(c)]||"—")}</span><span><b>Pedido novo</b> ${+c.novos>0?brl(c.novos):"não há"}</span><span><b>Projeto</b> ${ehNovo(c)?"novo":"em execução"}</span></p>
    <p class="espaco-p">${etiquetado(c.code)?`<span class="tag etq">Etiqueta de relevância política</span> `:""}${s.saida?`<span class="tag ${s.decidida?"ok":"az"}">${s.decidida?"Decidido":"Sugestão"}: ${esc(rotSaida(s.saida))}</span>`:`<span class="tag">Sem saída ainda</span>`}</p></header>
   <div class="duas"><aside class="como"><dl><div><dt>Problema</dt><dd>${esc(c.problema||"—")}</dd></div><div><dt>Meta</dt><dd>${esc(c.meta||"—")}</dd></div><div><dt>Evidência</dt><dd>${esc(c.evidencia||"—")}</dd></div></dl></aside>
    <div class="trabalho"><section class="bloco"><h2>Percurso pelas nove etapas</h2><ol class="percurso">${li}</ol></section>
     <section class="bloco"><h2>Registro</h2>${(E(c.code).log||[]).length?`<ol class="diario">${E(c.code).log.slice().reverse().map(g=>`<li><time>${esc(dataHora(g.em))}</time><span>Etapa ${g.etapa}: ${esc(g.oque)} <span class="meta">${esc(g.por)}</span></span></li>`).join("")}</ol>`:`<p class="meta">Nada registrado ainda.</p>`}</section></div></div>`; }

/* ---------- eventos e partida ---------- */
document.addEventListener("click",ev=>{ const lk=window.ROTA_SIMPLES&&ev.target.closest('a[href^="#/"]'); if(lk){ ev.preventDefault(); ir(lk.getAttribute("href")); return; }
  const b=ev.target.closest("[data-acao]"); if(!b) return; const f=ACOES[b.dataset.acao]; if(f){ ev.preventDefault(); f(b.dataset,b); } });
document.addEventListener("input",ev=>{ const t=ev.target; if(t.dataset&&t.dataset.rasc) rset(t.dataset.rasc,t.type==="checkbox"?t.checked:t.value); });
document.addEventListener("change",ev=>{ const t=ev.target; if(t.dataset&&t.dataset.muda){ const f=ACOES[t.dataset.muda]; if(f) f(t.dataset,t); } });
document.addEventListener("submit",ev=>{ if(ev.target.id==="f-login"){ ev.preventDefault(); ACOES.entrar(); } });
window.addEventListener("hashchange",rota);
async function partida(){
  let demo=false; try{ demo=sessionStorage.getItem("esteira3.modo")==="demo"; }catch(e){}
  if(Dados.temNuvem()){
    try{ const sess=await Dados.iniciarNuvem(s=>{ if(s&&!S.modo&&!S.carregando) abrirNuvem(s); else if(!s&&S.modo==="nuvem"){ S.modo=null; S.base={}; S.est={}; S.canvas={}; render(); } });
      if(sess){ if(demo) ACOES.demo(); else await abrirNuvem(sess); return; } }catch(e){ console.error(e); } }
  if((demo||window.ABRE_EXEMPLO)&&!soLogado()){ ACOES.demo(); return; }   /* ABRE_EXEMPLO: cópia que só tem o exemplo já abre nele */
  rota(); }
/* só parte depois que todos os arquivos da página carregaram */
document.addEventListener("DOMContentLoaded",partida);

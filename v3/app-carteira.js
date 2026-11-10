/* ===== Esteira v3.0 · etapas 7 a 9, etiqueta e glossário ===== */
const tagsProj=(c,l)=>`${etiquetado(c.code)?` <span class="tag etq">Etiqueta</span>`:""}${l&&l.fronteira?` <span class="tag at">Caso de fronteira</span>`:""}`;
const clsSaida=s=>s==="priorizar"?"ok":s==="reformular"?"at":s==="orgao"||s==="incorporar"?"er":"";

/* ---------- etapa 7: recomendação, com a linha do teto ---------- */
TELAS[7]=()=>{
  const r=rec(), t=tetoAtual(), porCod=Object.fromEntries(r.linhas.map(l=>[l.code,l]));
  let acc=0, pos=0, linhaPosta=false; const corpo=[];
  const marca=()=>{ linhaPosta=true; corpo.push(`<tr class="linha"><td colspan="7"><div class="linha-teto"><span>Linha do teto: ${brl(t.valor)}</span></div></td></tr>`); };
  for(const code of r.ordem){ const l=porCod[code], c=S.base[code]; if(!l.dentro&&!linhaPosta) marca();
    if(l.dentro) acc+=+c.novos||0; pos++;
    corpo.push(`<tr class="${l.dentro?"":"fora"}"><td class="n">${pos}</td><td class="pj"><a href="#/projeto/${encodeURIComponent(code)}"><b>${esc(code)}</b></a>${esc(c.nome)}${tagsProj(c,l)}</td><td class="n">${nf(l.valor)}</td><td>${sinal(l.farol)}</td><td class="n">${brl(c.novos)}</td>
      <td class="n">${l.dentro?`${brl(acc)}<span class="acum" aria-hidden="true"><i style="width:${Math.min(100,acc/t.valor*100).toFixed(1)}%"></i></span>`:"—"}</td>
      <td><span class="tag ${clsSaida(l.saida)}">${esc(l.rotulo||"—")}</span><small>${esc(l.motivo)}${l.condicao?" "+esc(l.condicao):""}</small>${l.semEtiqueta?`<small>Sem a etiqueta, teria: ${esc((l.semEtiqueta.rotulo||l.semEtiqueta.estado||"—").toLowerCase())}.</small>`:""}</td></tr>`); }
  if(!linhaPosta&&r.ordem.length) marca();
  const fora=r.linhas.filter(l=>l.saida&&!r.ordem.includes(l.code)), espera=r.linhas.filter(l=>!l.saida);
  const mapa={}; projetos().forEach(c=>{ const l=porCod[c.code], m=missaoDe(c), o=mapa[m]=mapa[m]||{n:0,pri:0,rs:0}; if(l.saida) o.n++; if(l.saida==="priorizar"){ o.pri++; o.rs+=+c.novos||0; } });
  return `<section class="bloco"><h2>A conta do teto</h2><p class="meta">${esc(t.origem)}</p>
    ${+S.ciclo.teto>0?"":`<div class="opcoes espaco-p" role="group" aria-label="Cenário de teto">${[[1,"100% dos pedidos"],[.85,"85% dos pedidos"],[.7,"70% dos pedidos"]].map(([v,x])=>`<button type="button" class="op" data-acao="cenario" data-v="${v}" data-fid="cen:${v}" aria-pressed="${S.cenario===v}">${x}</button>`).join("")}</div>`}
    <div class="conta espaco-p"><div><b>${brl(t.valor)}</b><span>Teto</span></div><div><b>${brl(r.reserva)}</b><span>Reservado para projetos com etiqueta</span></div><div><b>${brl(r.usado)}</b><span>Usado até a linha</span></div><div><b>${brl(r.retido)}</b><span>Retido por projeto travado acima da linha</span></div><div><b>${r.corte==null?"—":nf(r.corte)}</b><span>Valor do último projeto que cabe</span></div></div>
    ${r.estouro?`<p class="nota er espaco-p">Os projetos com etiqueta, sozinhos, passam do teto. Ninguém mais entra.</p>`:""}</section>
   <section class="bloco"><h2>A lista, uma linha por projeto</h2><p class="meta">Primeiro os projetos com etiqueta; depois, por valor, do maior para o menor. Depois do primeiro que não cabe, ninguém entra, mesmo que coubesse.</p>
    ${r.ordem.length?`<div class="rolavel"><table class="lista"><thead><tr><th class="n">Ordem</th><th>Projeto</th><th class="n">Valor</th><th>Farol</th><th class="n">Pedido</th><th class="n">Acumulado</th><th>Sugestão</th></tr></thead><tbody>${corpo.join("")}</tbody></table></div>`:`<p class="nota at espaco-p">Nenhum projeto disputa recurso novo ainda. A lista aparece quando houver projeto com notas e farol.</p>`}</section>
   ${fora.length?`<section class="bloco"><h2>Fora da disputa pelo recurso novo <span class="tag">${fora.length}</span></h2><p class="meta">Sem pedido novo, ou com saída definida antes da lista.</p><div class="rolavel"><table class="lista"><thead><tr><th>Projeto</th><th class="n">Valor</th><th>Farol</th><th>Sugestão</th></tr></thead><tbody>${fora.map(l=>{ const c=S.base[l.code]; return `<tr><td class="pj"><a href="#/projeto/${encodeURIComponent(l.code)}"><b>${esc(l.code)}</b></a>${esc(c.nome)}${tagsProj(c,l)}</td><td class="n">${nf(l.valor)}</td><td>${sinal(l.farol)}</td><td><span class="tag ${clsSaida(l.saida)}">${esc(l.rotulo)}</span><small>${esc(l.motivo)}</small></td></tr>`; }).join("")}</tbody></table></div></section>`:""}
   ${espera.length?`<section class="bloco"><h2>Ainda no caminho <span class="tag">${espera.length}</span></h2><p class="meta">Sem sugestão, porque falta alguma etapa.</p><ol class="fila">${espera.map(l=>{ const c=S.base[l.code], n=estacao(c); return `<li><span class="cod">${esc(c.code)}</span><span class="nm">${esc(c.nome)}<small>Está na etapa ${n}: ${esc(ETAPAS[n-1].t.toLowerCase())}.</small></span><span></span><span class="ac"><a class="bt sec peq" href="#/etapa/${n}/${encodeURIComponent(c.code)}">Abrir</a></span></li>`; }).join("")}</ol></section>`:""}
   <section class="bloco"><h2>Mapa do conjunto, por missão</h2><div class="rolavel"><table class="lista"><thead><tr><th>Missão</th><th class="n">Com sugestão</th><th class="n">Priorizados</th><th class="n">Recurso novo priorizado</th></tr></thead><tbody>${Object.keys(MISSOES).filter(m=>mapa[m]).map(m=>`<tr><td class="pj"><b>${esc(MISSOES[m])}</b></td><td class="n">${mapa[m].n}</td><td class="n">${mapa[m].pri}</td><td class="n">${brl(mapa[m].rs)}</td></tr>`).join("")}</tbody></table></div>
    <div class="acoes"><a class="bt" href="#/etapa/8">Levar a lista à Diretoria Executiva</a></div></section>`; };
ACOES.cenario=d=>{ S.cenario=+d.v; render(); };

/* ---------- etapa 8: decisão da Diretoria Executiva ---------- */
TELAS[8]=()=>{
  const r=rec(), comSug=r.linhas.filter(l=>l.saida), pend=comSug.filter(l=>!E(l.code).decisao), feitas=projetos().filter(c=>E(c.code).decisao);
  const dx=R.dx||{};
  const item=l=>{ const c=S.base[l.code], aberto=dx.code===l.code;
    return `<li style="grid-template-columns:64px minmax(0,1fr) auto"><span class="cod">${esc(c.code)}</span><span class="nm">${esc(c.nome)}${tagsProj(c,l)}<small>Sugestão: ${esc(l.rotulo.toLowerCase())}. ${esc(l.motivo)}${l.condicao?" "+esc(l.condicao):""}${l.fronteira?" Um ponto em uma nota mudaria o lado da linha: a decisão é da Diretoria Executiva.":""}</small>
      ${aberto?`<div class="cmp"><span class="rot">Decisão diferente</span>${ops("dx.saida",SAIDAS.filter(s=>s[0]!==l.saida).map(s=>[s[0],s[1]]),dx.saida)}</div>${area("dx.motivo","Motivo","Obrigatório. Vai para o registro e para a lista do Conselho Deliberativo.")}
        <div class="acoes"><button class="bt" data-acao="decidir" data-code="${esc(c.code)}" data-tipo="diferente">Registrar a decisão diferente</button><button class="bt discreto" data-acao="dxFechar">Cancelar</button></div>`:""}</span>
      <span class="ac">${aberto?"":`<button class="bt peq" data-acao="decidir" data-code="${esc(c.code)}" data-tipo="seguir">Seguir a sugestão</button> <button class="bt sec peq" data-acao="dxAbrir" data-code="${esc(c.code)}">Decidir diferente</button>`}</span></li>`; };
  const etq=projetos().filter(c=>etiquetado(c.code)), alt=feitas.filter(c=>E(c.code).decisao.tipo==="diferente");
  return `<section class="bloco"><h2>A decidir <span class="tag${pend.length?" etq":""}">${pend.length}</span></h2><p class="meta">${feitas.length} de ${feitas.length+pend.length} projetos com sugestão já foram decididos.</p>
    ${pend.length?`<ol class="fila espaco-p">${pend.map(item).join("")}</ol>`:`<p class="nota ok espaco-p">Nenhuma sugestão aguarda decisão.</p>`}</section>
   ${feitas.length?`<section class="bloco"><h2>Decididos <span class="tag">${feitas.length}</span></h2><ol class="fila">${feitas.map(c=>{ const d=E(c.code).decisao, s=saidaDe(c).saida; return `<li style="grid-template-columns:64px minmax(0,1fr) auto"><span class="cod">${esc(c.code)}</span><span class="nm">${esc(c.nome)}${tagsProj(c)}<small>${d.tipo==="seguir"?"Sugestão confirmada":"Decisão diferente da sugestão"}: ${esc(rotSaida(s).toLowerCase())}.${d.motivo?" Motivo: "+esc(d.motivo):""} ${esc(d.por||"")}</small></span><span class="ac"><button class="bt discreto peq" data-acao="reabrir" data-code="${esc(c.code)}">Rever a decisão</button></span></li>`; }).join("")}</ol></section>`:""}
   <section class="bloco"><h2>Lista para o Conselho Deliberativo</h2><p class="meta">O Conselho recebe os projetos com etiqueta, com notas e valores, e as sugestões que a Diretoria Executiva alterou.</p>
    <h3 class="espaco-p">Projetos com etiqueta de relevância política</h3>${etq.length?`<div class="rolavel"><table class="lista"><thead><tr><th>Projeto</th><th class="n">Valor</th><th>Farol</th><th class="n">Pedido</th><th>Saída</th><th>Sem a etiqueta, teria</th></tr></thead><tbody>${etq.map(c=>{ const l=linhaDe(c.code), s=saidaDe(c).saida; return `<tr><td class="pj"><b>${esc(c.code)}</b>${esc(c.nome)}</td><td class="n">${nf(l.valor)}</td><td>${sinal(l.farol)}</td><td class="n">${brl(c.novos)}</td><td>${esc(s?rotSaida(s):"Ainda no caminho")}</td><td>${esc(l.semEtiqueta?(l.semEtiqueta.rotulo||l.semEtiqueta.estado||"—"):"—")}</td></tr>`; }).join("")}</tbody></table></div>`:`<p class="meta">Nenhum projeto com etiqueta.</p>`}
    <h3 class="espaco">Sugestões alteradas pela Diretoria Executiva</h3>${alt.length?`<div class="rolavel"><table class="lista"><thead><tr><th>Projeto</th><th>Sugestão</th><th>Decisão</th><th>Motivo</th></tr></thead><tbody>${alt.map(c=>{ const d=E(c.code).decisao, l=linhaDe(c.code); return `<tr><td class="pj"><b>${esc(c.code)}</b>${esc(c.nome)}</td><td>${esc(rotSaida(d.sugestao||l.saida))}</td><td>${esc(rotSaida(d.saida))}</td><td>${esc(d.motivo||"")}</td></tr>`; }).join("")}</tbody></table></div>`:`<p class="meta">Nenhuma sugestão foi alterada.</p>`}
    ${window.SEM_ARQUIVOS?"":`<div class="acoes"><button class="bt sec" data-acao="imprimir">Imprimir a lista</button><button class="bt sec" data-acao="planilha">Baixar a carteira em planilha</button></div>`}</section>`; };
ACOES.dxAbrir=d=>{ R.dx={code:d.code,saida:"",motivo:""}; render(); };
ACOES.dxFechar=()=>{ R.dx={}; render(); };
ACOES.decidir=async d=>{ const c=S.base[d.code], l=linhaDe(c.code), dx=R.dx||{};
  if(d.tipo==="diferente"){ if(!dx.saida) return aviso("Escolha a decisão."); if(!(dx.motivo||"").trim()) return aviso("Escreva o motivo."); }
  E(c.code).decisao={tipo:d.tipo,saida:d.tipo==="seguir"?l.saida:dx.saida,sugestao:l.saida,motivo:d.tipo==="seguir"?"":dx.motivo.trim(),fronteira:!!l.fronteira,por:quem(),em:agora()};
  await salvar(c.code,8,d.tipo==="seguir"?"Decisão: sugestão confirmada ("+rotSaida(l.saida).toLowerCase()+").":"Decisão diferente da sugestão: "+rotSaida(dx.saida).toLowerCase()+". Motivo: "+dx.motivo.trim(),"Decisão registrada"); R.dx={}; render(); };
ACOES.reabrir=async d=>{ delete E(d.code).decisao; await salvar(d.code,8,"Decisão reaberta para revisão.","Decisão reaberta"); render(); };
ACOES.imprimir=()=>window.print();
ACOES.planilha=()=>{ const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const L=[["Código","Projeto","Diretoria","Missão","Pedido novo","Valor","Farol","Etiqueta","Sugestão","Decisão","Motivo","Caso de fronteira"]];
  projetos().forEach(c=>{ const l=linhaDe(c.code), d=E(c.code).decisao; L.push([c.code,c.nome,DIRETORIAS[c.dir]||c.dir,MISSOES[missaoDe(c)],+c.novos||0,l.valor==null?"":nf(l.valor),l.farol||"",etiquetado(c.code)?"sim":"não",l.saida?rotSaida(l.saida):(l.estado||""),d?rotSaida(d.saida||l.saida):"",d?d.motivo||"":"",l.fronteira?"sim":"não"]); });
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob(["﻿"+L.map(x=>x.map(q).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"})); a.download="carteira-"+(S.ciclo.ciclo||"ciclo")+".csv"; document.body.appendChild(a); a.click(); a.remove(); aviso("Planilha baixada"); };

/* ---------- etapa 9: registro e revisão ---------- */
TELAS[9]=()=>{
  const feitas=projetos().filter(c=>E(c.code).decisao), rv=R.rv||(R.rv={code:"",R:"",E:"",I:"",travou:"não",obs:"",fim:""});
  const c=rv.code&&S.base[rv.code], am=S.ciclo.amostra;
  let form="";
  if(c){ const n0=notasDe(c), v0=valorDe(c), nova=[rv.R,rv.E,rv.I].every(v=>+v>=1)?valor3({A:n0.A,R:+rv.R,E:+rv.E,I:+rv.I}):null, caiu=nova!=null&&v0!=null&&nova<v0, alerta=caiu||rv.travou==="sim", sv=E(c.code).revisao||{};
    form=`<h3 class="espaco">${esc(c.code)}: ${esc(c.nome)}</h3><p class="meta">Valor de entrada: ${nf(v0)}. ${sv.meio?"Revisão do meio do ano registrada em "+dataBR(sv.meio.em)+".":"Sem revisão registrada."}</p>
     ${NOTAS3.map(n=>`<div class="cmp"><span class="rot">${esc(n.n)}, com o que o projeto entregou</span>${ops("rv."+n.k,[1,2,3,4,5].map(v=>[v,String(v)]),rv[n.k]).replace(/data-acao="set"/g,'data-acao="set" data-num="1"')}</div>`).join("")}
     <div class="cmp"><span class="rot">O projeto travou?</span>${ops("rv.travou",SIMNAO,rv.travou)}</div>${area("rv.obs","O que o projeto entregou até aqui")}
     ${nova!=null?`<p class="nota ${alerta?"at":"ok"} espaco-p" role="status">Valor refeito: <b>${nf(nova)}</b>. ${alerta?"A nota caiu ou o projeto travou: a Diretoria Executiva revê o projeto na revisão do plano, até 31 de agosto.":"A nota se manteve e o projeto anda: segue como está."}</p>`:""}
     <div class="acoes"><button class="bt" data-acao="revisar" data-code="${esc(c.code)}">Registrar a revisão do meio do ano</button></div>
     ${area("rv.fim","No encerramento: resultado comparado com a nota de entrada","Preencha só quando o projeto terminar.")}<div class="acoes"><button class="bt sec" data-acao="encerrar" data-code="${esc(c.code)}">Registrar o encerramento</button></div>`; }
  return `<section class="bloco"><h2>Guardado junto ao Canvas <span class="tag">${feitas.length}</span></h2><p class="meta">Caminho na árvore, notas, farol, sugestão e decisão de cada projeto decidido.</p>
    ${feitas.length?`<div class="rolavel"><table class="lista"><thead><tr><th>Projeto</th><th>Decisão</th><th class="n">Valor de entrada</th><th>Farol</th><th class="n">Registros</th><th>Revisão</th></tr></thead><tbody>${feitas.map(x=>{ const l=linhaDe(x.code), rvx=E(x.code).revisao||{}; return `<tr><td class="pj"><a href="#/projeto/${encodeURIComponent(x.code)}"><b>${esc(x.code)}</b></a>${esc(x.nome)}${tagsProj(x)}</td><td>${esc(rotSaida(saidaDe(x).saida))}</td><td class="n">${nf(l.valor)}</td><td>${sinal(l.farol)}</td><td class="n">${(E(x.code).log||[]).length}</td><td>${rvx.fim?`<span class="tag ok">Encerrado</span>`:rvx.meio?`<span class="tag ${rvx.meio.alerta?"at":"ok"}">${rvx.meio.alerta?"Rever até 31 de agosto":"Revisto"}</span>`:`<span class="meta">A fazer</span>`}</td></tr>`; }).join("")}</tbody></table></div>`:`<p class="nota at espaco-p">Nenhum projeto decidido ainda. O registro começa quando a Diretoria Executiva decide.</p>`}</section>
   <section class="bloco"><h2>Revisão do meio do ano e encerramento</h2><p class="meta">A nota é refeita com o que o projeto de fato entregou. A aderência não muda: vem da árvore.</p>
    ${feitas.length?`<div class="cmp"><label for="rv-p">Projeto</label><select id="rv-p" data-muda="rvProjeto"><option value="">Escolha um projeto decidido</option>${feitas.map(x=>`<option value="${esc(x.code)}"${rv.code===x.code?" selected":""}>${esc(x.code)}: ${esc(x.nome)}</option>`).join("")}</select></div>${form}`:`<p class="meta espaco-p">Disponível depois da primeira decisão.</p>`}</section>
   <section class="bloco"><h2>Amostra da Unidade de Auditoria</h2><p class="meta">A auditoria confere, por amostra, se a régua foi aplicada como publicada.</p>
    ${am&&am.codes&&am.codes.length?`<p class="espaco-p">Amostra sorteada em ${dataBR(am.em)} por ${esc(am.por||"—")}:</p><div class="chips espaco-p" style="display:flex;flex-wrap:wrap;gap:6px">${am.codes.filter(k=>S.base[k]).map(k=>chip(S.base[k])).join("")}</div>`:`<p class="meta espaco-p">Nenhuma amostra sorteada.</p>`}
    <div class="acoes"><button class="bt sec" data-acao="amostra"${feitas.length?"":" disabled"}>Sortear a amostra</button></div></section>
   <section class="bloco"><h2>O que volta para o ciclo seguinte</h2><p>As lições do registro e da revisão voltam para a etapa 1: a régua, as árvores e o teto do próximo ciclo.</p><div class="acoes"><a class="bt sec" href="#/etapa/1">Abrir as regras do ciclo</a></div></section>`; };
ACOES.rvProjeto=(d,el)=>{ const code=el.value, sv=code?(E(code).revisao||{}):{}, m=sv.meio||{}; R.rv={code,R:m.R||"",E:m.E||"",I:m.I||"",travou:m.travou?"sim":"não",obs:m.obs||"",fim:(sv.fim||{}).resultado||""}; render(); };
ACOES.revisar=async d=>{ const c=S.base[d.code], rv=R.rv, n0=notasDe(c), v0=valorDe(c);
  if(![rv.R,rv.E,rv.I].every(v=>+v>=1&&+v<=5)) return aviso("Dê as três notas da revisão.");
  const valor=valor3({A:n0.A,R:+rv.R,E:+rv.E,I:+rv.I}), alerta=(v0!=null&&valor<v0)||rv.travou==="sim", e=E(c.code);
  e.revisao={...(e.revisao||{}),meio:{R:+rv.R,E:+rv.E,I:+rv.I,travou:rv.travou==="sim",valor,entrada:v0,alerta,obs:(rv.obs||"").trim(),por:quem(),em:agora()}};
  await salvar(c.code,9,"Revisão do meio do ano: valor "+nf(valor)+" (entrada "+nf(v0)+")."+(alerta?" A Diretoria Executiva revê até 31 de agosto.":""),"Revisão registrada"); render(); };
ACOES.encerrar=async d=>{ const c=S.base[d.code], t=((R.rv||{}).fim||"").trim(); if(!t) return aviso("Descreva o resultado do projeto."); const e=E(c.code);
  e.revisao={...(e.revisao||{}),fim:{resultado:t,por:quem(),em:agora()}}; await salvar(c.code,9,"Encerramento: "+t,"Encerramento registrado"); render(); };
ACOES.amostra=async()=>{ const feitas=projetos().filter(c=>E(c.code).decisao).map(c=>c.code), n=Math.min(feitas.length,Math.max(3,Math.ceil(feitas.length*.2)));
  for(let i=feitas.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [feitas[i],feitas[j]]=[feitas[j],feitas[i]]; }
  S.ciclo={...S.ciclo,amostra:{codes:feitas.slice(0,n).sort(),em:agora(),por:quem()}}; try{ await Dados.gravarCiclo(S.ciclo); aviso("Amostra sorteada"); }catch(e){ aviso("Não foi gravado. Tente de novo."); } render(); };

/* ---------- a etiqueta, do início ao fim ---------- */
function vEtiqueta(M){
  const etq=projetos().filter(c=>etiquetado(c.code)), pedem=projetos().filter(c=>{ const f=E(c.code).ficha||{}; return f.pedidoPolitico&&!f.etiqueta; });
  M.innerHTML=`<header><p class="passo"><a href="#/">Início</a></p><h1>A etiqueta de relevância política</h1><p class="frase">${esc(ETIQUETA.frase)} ${esc(ETIQUETA.porque)}</p></header>
   <section class="bloco espaco"><div class="pares">${ETIQUETA.blocos.map(b=>`<div><h3>${esc(b[0])}</h3><p>${esc(b[1])}</p></div>`).join("")}</div></section>
   <section class="bloco"><h2>Projetos com etiqueta <span class="tag${etq.length?" etq":""}">${etq.length}</span></h2>${etq.length?`<div class="rolavel"><table class="lista"><thead><tr><th>Projeto</th><th>Etapa</th><th class="n">Valor</th><th>Farol</th><th class="n">Pedido</th><th>Saída</th><th>Sem a etiqueta, teria</th></tr></thead><tbody>${etq.map(c=>{ const l=linhaDe(c.code), s=saidaDe(c), n=estacao(c); return `<tr><td class="pj"><a href="#/projeto/${encodeURIComponent(c.code)}"><b>${esc(c.code)}</b></a>${esc(c.nome)}</td><td>${n}: ${esc(ETAPAS[n-1].curto)}</td><td class="n">${nf(l.valor)}</td><td>${sinal(l.farol)}</td><td class="n">${brl(c.novos)}</td><td>${esc(s.saida?rotSaida(s.saida):"Ainda no caminho")}</td><td>${esc(l.semEtiqueta?(l.semEtiqueta.rotulo||l.semEtiqueta.estado||"—"):"—")}</td></tr>`; }).join("")}</tbody></table></div>`:`<p class="meta">Nenhum projeto recebeu a etiqueta.</p>`}
    ${pedem.length?`<h3 class="espaco">Pedidos que aguardam a Diretoria Executiva</h3><ol class="fila">${pedem.map(c=>linhaFila(c,2,"Decidir")).join("")}</ol>`:""}</section>`; }

/* ---------- glossário e pontos em aberto ---------- */
function vComo(M){
  M.innerHTML=`<header><p class="passo"><a href="#/">Início</a></p><h1>Glossário e pontos em aberto</h1><p class="frase">Para quem não conhece a Agência: o significado de cada termo e o que ainda não está decidido.</p></header>
   <section class="bloco espaco"><h2>Como ler a esteira</h2><p>O trilho no alto mostra as nove etapas, na ordem. A primeira abre o ciclo. Da segunda à sexta, cada projeto anda sozinho. Da sétima à nona, a decisão é sobre a carteira inteira. O número amarelo diz quantos projetos aguardam em cada etapa.</p></section>
   <section class="bloco"><h2>Glossário</h2><dl class="gloss">${GLOSSARIO.map(g=>`<dt>${esc(g[0])}</dt><dd>${esc(g[1])}</dd>`).join("")}</dl></section>
   <section class="bloco"><h2>Pontos em aberto</h2><p class="meta">Estão na página como valores de partida. Mudam quando a equipe e a Agência decidirem.</p><ol class="ativ espaco-p">${ABERTOS.map(a=>`<li><span>${esc(a)}</span></li>`).join("")}</ol></section>`; }

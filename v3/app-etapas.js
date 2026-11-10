/* ===== Esteira v3.0 · etapas 1 a 6: regras, Canvas, elegibilidade, árvore, notas e farol ===== */
const agora=()=>new Date().toISOString();
const outros=(n,titulo)=>{ const L=projetos().filter(c=>estacao(c)>n); return L.length?`<section class="bloco"><h2>${esc(titulo)} <span class="tag">${L.length}</span></h2><div class="chips" style="display:flex;flex-wrap:wrap;gap:6px">${L.map(chip).join("")}</div></section>`:""; };

/* ---------- etapa 1: regras do ciclo ---------- */
TELAS[1]=()=>{
  if(!R.ini){ R={ini:1,ciclo:{...clone(S.ciclo),teto:S.ciclo.teto?String(S.ciclo.teto):""}}; }
  const pub=S.ciclo.publicadoEm, h=(S.ciclo.historico||[]).slice().reverse();
  return `<section class="bloco"><h2>Definidos a cada ciclo</h2>
    ${pub?`<p class="nota ok">Regras publicadas em ${dataBR(pub)} por ${esc(S.ciclo.publicadoPor||"—")}. Mudanças depois disso ficam no histórico.</p>`:`<p class="nota at">Regras ainda não publicadas. As áreas só preenchem o Canvas depois da publicação.</p>`}
    <div class="grade2">${texto("ciclo.ciclo","Ciclo","Ano da carteira a que as regras se referem.")}${texto("ciclo.teto","Teto de referência, em reais","Dinheiro novo disponível no ano. Quem fixa é a Diretoria Executiva.")}
     ${texto("ciclo.tetoFonte","De onde vem o teto","Documento ou decisão que fixou o valor.")}${texto("ciclo.dataFichas","Data limite para enviar os Canvas","","date")}
     ${texto("ciclo.dataDecisao","Data da decisão da Diretoria Executiva","","date")}</div>
    ${area("ciclo.obs","O que mudou em relação ao ciclo anterior","Entra no histórico junto com a publicação.")}
    <div class="acoes"><button class="bt" data-acao="publicar">${pub?"Publicar de novo":"Publicar regras"}</button><button class="bt sec" data-acao="guardarCiclo">Guardar sem publicar</button></div></section>
   <section class="bloco"><h2>A régua deste ciclo</h2><p class="nota at">Valores de partida, para discussão. A régua ainda não foi combinada com a Agência.</p>
    <h3 class="espaco-p">Elegibilidade: quatro perguntas, nesta ordem</h3><ol class="ativ espaco-p">${PORTA.map(p=>`<li><span class="perg">${esc(p.q)}<small>Se ${p.para}: ${esc(minus(p.efeito))}</small></span></li>`).join("")}</ol>
    <h3 class="espaco">Quatro notas, com o mesmo peso</h3><p class="meta">O valor do projeto é a média das quatro.</p>
    <div class="rolavel"><table class="lista"><thead><tr><th>Nota</th><th>Vale 1</th><th>Vale 3</th><th>Vale 5</th></tr></thead><tbody>
     <tr><td class="pj"><b>Aderência à missão</b><small>Vem da árvore. Ninguém atribui.</small></td><td>Parcial: não atua em elo da cadeia</td><td>Aderente: atua em elo da cadeia</td><td>Aderente prioritário: atende à regra de prioridade da missão</td></tr>
     ${NOTAS3.map(n=>`<tr><td class="pj"><b>${esc(n.n)}</b><small>${esc(n.q)}</small></td><td>${esc(n.a[1])}</td><td>${esc(n.a[3])}</td><td>${esc(n.a[5])}</td></tr>`).join("")}</tbody></table></div>
    <h3 class="espaco">Farol: quatro itens, fora da nota</h3><p class="meta">Vermelho quando algum item é impedimento. Amarelo quando algum item tem pendência. Verde quando não há pendência.</p>
    <div class="rolavel"><table class="lista"><thead><tr><th>Item</th><th>Impedimento</th><th>Pendência séria</th><th>Pendência administrável</th><th>Sem pendência</th></tr></thead><tbody>
     ${FAROL.map(f=>`<tr><td class="pj"><b>${esc(f.t)}</b></td><td>${esc(f.a[0])}</td><td>${esc(f.a[1])}</td><td>${esc(f.a[3])}</td><td>${esc(f.a[5])}</td></tr>`).join("")}</tbody></table></div>
    <h3 class="espaco">A linha e as seis saídas</h3><p>Os projetos com etiqueta entram primeiro no teto. Os demais entram por valor, do maior para o menor, até o dinheiro acabar: o último que cabe marca a linha. Cada projeto recebe uma de seis saídas: ${SAIDAS.map(s=>s[1].toLowerCase()).join("; ")}.</p></section>
   <section class="bloco"><h2>Histórico</h2>${h.length?`<ol class="diario">${h.map(g=>`<li><time>${esc(dataHora(g.em))}</time><span>${esc(g.oque)} <span class="meta">${esc(g.por||"")}</span></span></li>`).join("")}</ol>`:`<p class="meta">Nenhuma publicação registrada.</p>`}</section>`; };
function lerCiclo(){ const c=R.ciclo||{}, t=num(c.teto); return {...S.ciclo,ciclo:(c.ciclo||"").trim(),teto:t&&t>0?t:null,tetoFonte:c.tetoFonte||"",dataFichas:c.dataFichas||"",dataDecisao:c.dataDecisao||"",obs:c.obs||""}; }
ACOES.guardarCiclo=async()=>{ S.ciclo=lerCiclo(); try{ await Dados.gravarCiclo(S.ciclo); aviso("Regras guardadas"); }catch(e){ aviso("Não foi gravado. Tente de novo."); } R={}; render(); };
ACOES.publicar=async()=>{ const c=lerCiclo(); if(!c.ciclo) return aviso("Informe o ciclo.");
  c.publicadoEm=agora(); c.publicadoPor=quem(); c.historico=[...(S.ciclo.historico||[]),{em:c.publicadoEm,por:quem(),oque:"Regras publicadas."+(c.obs?" "+c.obs:"")}]; S.ciclo=c;
  try{ await Dados.gravarCiclo(S.ciclo); aviso("Regras publicadas"); }catch(e){ aviso("Não foi gravado. Tente de novo."); } R={}; render(); };

/* ---------- etapa 2: Canvas do projeto ---------- */
TELAS[2]=c=>{
  if(!c){
    if(ROTA[2]==="novo") return cvTela(null);            /* cadastro de novo Canvas */
    if(ROTA[2]==="canvas") return cvTela(ROTA[3]);       /* retomar um rascunho ou rever um Canvas cadastrado */
    const todos=projetos().filter(x=>estacao(x)>2);
    return cvBlocoCadastro()
     +fila(2,"Canvas a enviar","Todos os Canvas foram enviados.")
     +(todos.length?`<section class="bloco"><h2>Canvas já enviados <span class="tag">${todos.length}</span></h2><ol class="fila">${todos.map(x=>linhaFila(x,2,"Rever")).join("")}</ol></section>`:"")
     +(S.modo==="demo"?novoFicticio():""); }
  const e=E(c.code), f=e.ficha||{};
  if(!R.ini){ R={ini:1,f:{novo:ehNovo(c)?"sim":"não",pedido:f.pedidoPolitico?"sim":"não",documento:f.documento||""}}; }
  const pede=rget("f.pedido","não")==="sim";
  return `<section class="bloco">${cabProjeto(c,2)}
    ${cvTemFormulario(c.code)?`<p class="espaco-p"><a class="bt discreto peq" href="#/etapa/2/canvas/${encodeURIComponent(c.code)}">Rever o Canvas cadastrado</a></p>`:""}
    ${f.enviada?`<p class="nota ok espaco-p">Canvas enviado${f.enviadaEm?" em "+dataBR(f.enviadaEm):""}.</p>`:(e.porta&&e.porta.devolvidaEm?`<p class="nota at espaco-p">O Canvas voltou da etapa de elegibilidade para completar: ${esc(e.porta.nota||"")}</p>`:"")}
    <div class="pergunta espaco-p"><h3>É projeto novo ou continuação?</h3><p class="meta">Muda a saída quando o projeto fica abaixo da linha.</p>${ops("f.novo",[["sim","Projeto novo"],["não","Continuação de projeto em execução"]],rget("f.novo"))}</div>
    <div class="pergunta"><h3>Há pedido formal político para este projeto?</h3><p class="meta">Com pedido, a Diretoria Executiva decide se concede a etiqueta de relevância política.</p>${ops("f.pedido",SIMNAO,rget("f.pedido"))}
     ${pede?area("f.documento","Qual documento comprova o pedido?","Pedido formal, instrumento assinado ou política vigente.")+`
      <div class="cmp"><span class="rot">Decisão da Diretoria Executiva sobre a etiqueta</span>
       ${f.etiqueta?`<p><span class="tag ${f.etiqueta==="concedida"?"etq":"er"}">Etiqueta ${f.etiqueta}</span> <span class="meta">${esc(f.etiquetaPor||"")}</span></p>`:`<p class="meta">Ainda não decidida.</p>`}
       <div class="opcoes"><button class="bt sec peq" data-acao="etiqueta" data-code="${esc(c.code)}" data-v="concedida">Conceder a etiqueta</button><button class="bt discreto peq" data-acao="etiqueta" data-code="${esc(c.code)}" data-v="negada">Negar a etiqueta</button></div></div>`:""}</div>
    <div class="acoes"><button class="bt" data-acao="enviarFicha" data-code="${esc(c.code)}">${f.enviada?"Guardar o Canvas":"Enviar o Canvas"}</button></div></section>`; };
function novoFicticio(){
  if(!R.ini){ R={ini:1,nv:{nome:"",unidade:"",dir:"DISTT",missao:"M4",novos:"",novo:"sim"}}; }
  return `<section class="bloco"><h2>Acrescentar um projeto fictício</h2><p class="meta">Só no exemplo. Atalho para acompanhar um projeto do começo ao fim sem preencher o Canvas inteiro.</p>
    <div class="grade2">${texto("nv.nome","Nome do projeto")}${texto("nv.unidade","Unidade que propõe")}${texto("nv.novos","Recurso novo pedido, em reais","Deixe em branco se não há pedido novo.")}
    <div class="cmp"><label for="nv-m">Missão principal</label><select id="nv-m" data-rasc="nv.missao">${Object.entries(MISSOES).map(([k,t])=>`<option value="${k}"${rget("nv.missao")===k?" selected":""}>${esc(t)}</option>`).join("")}</select></div></div>
    <div class="cmp"><span class="rot">Diretoria</span>${ops("nv.dir",Object.entries(DIRETORIAS).map(([k,t])=>[k,t]),rget("nv.dir"))}</div>
    <div class="acoes"><button class="bt sec" data-acao="novoFicticio">Acrescentar projeto</button></div></section>`; }
ACOES.novoFicticio=async()=>{ const v=R.nv||{}; if(!(v.nome||"").trim()) return aviso("Dê um nome ao projeto.");
  let i=1; while(S.base["F"+String(i).padStart(2,"0")]) i++; const code="F"+String(i).padStart(2,"0");
  S.base[code]={code,nome:v.nome.trim(),dir:v.dir,unidade:(v.unidade||"").trim()||"Unidade fictícia",missao:v.missao,novos:num(v.novos)||0,problema:"Texto fictício.",meta:"Texto fictício.",evidencia:"Texto fictício."};
  await Dados.gravarBase(code,S.base[code]); E(code); await salvar(code,2,"Projeto fictício acrescentado.","Projeto acrescentado"); ir("#/etapa/2/"+code); };
function fichaDoRascunho(c){ const f=E(c.code).ficha=E(c.code).ficha||{}, r=R.f||{}; f.novo=r.novo==="sim"; f.pedidoPolitico=r.pedido==="sim"; f.documento=f.pedidoPolitico?(r.documento||"").trim():""; if(!f.pedidoPolitico){ delete f.etiqueta; delete f.etiquetaPor; } return f; }
ACOES.etiqueta=async d=>{ const c=S.base[d.code], f=fichaDoRascunho(c); if(!f.documento) return aviso("Informe o documento que comprova o pedido.");
  f.etiqueta=d.v; f.etiquetaPor=quem(); await salvar(c.code,2,"Etiqueta de relevância política "+d.v+". Documento: "+f.documento,"Etiqueta "+d.v); render(); };
ACOES.enviarFicha=async d=>{ const c=S.base[d.code], f=fichaDoRascunho(c);
  if(f.pedidoPolitico&&!f.etiqueta) return aviso("A Diretoria Executiva ainda não decidiu a etiqueta.");
  const ja=f.enviada; f.enviada=true; f.enviadaEm=f.enviadaEm||agora(); await salvar(c.code,2,ja?"Canvas atualizado.":"Canvas enviado à Unidade de Gestão Estratégica.",ja?"Canvas guardado":"Canvas enviado"); ir("#/etapa/2"); };

/* ---------- etapa 3: elegibilidade (os nomes internos continuam "porta", para não mudar os dados gravados) ---------- */
function resultadoPorta(p,tag){
  if(!p.completa) return {tipo:"falta",em:0};
  if(p.completa==="não") return {tipo:"volta",ate:0,txt:"Volta à etapa 2 para completar o Canvas."};
  if(!p.mandato) return {tipo:"falta",em:1};
  if(p.mandato==="não"&&!(tag&&REGUA3.etiqueta.venceMandato)) return {tipo:"saida",ate:1,txt:"Saída: outro órgão."};
  if(!p.repete) return {tipo:"falta",em:2};
  if(p.repete==="sim") return {tipo:"saida",ate:2,txt:"Saída: incorporar ao projeto parecido."};
  if(!p.medicao) return {tipo:"falta",em:3};
  if(p.medicao==="não"&&!tag) return {tipo:"saida",ate:3,txt:"Saída: reformular, com a lista do que falta."};
  return {tipo:"aceita",ate:3,txt:p.medicao==="não"?"Canvas aceito, com pendência anotada: falta indicador ou plano de medição. A etiqueta impede que isso barre o projeto.":"Canvas aceito. Segue para a árvore da missão."}; }
TELAS[3]=c=>{
  if(!c) return fila(3,"Canvas que aguardam a verificação de elegibilidade","Nenhum Canvas aguarda a verificação de elegibilidade.")+outros(3,"Já passaram pela elegibilidade");
  const e=E(c.code), sv=e.porta||{}, tag=etiquetado(c.code);
  if(!R.ini){ R={ini:1,p:{completa:sv.completa||"",mandato:sv.mandato||"",repete:sv.repete||"",medicao:sv.medicao||"",nota:sv.nota||""}}; }
  const p=R.p, r=resultadoPorta(p,tag), ate=r.tipo==="falta"?r.em:r.ate;
  const irmaos=projetos().filter(x=>x.code!==c.code&&missaoDe(x)===missaoDe(c)).map(x=>x.code+" "+x.nome);
  return `<section class="bloco">${cabProjeto(c,3)}
    ${sv.fechada?`<p class="nota ok espaco-p">Elegibilidade já registrada. Registrar de novo substitui a resposta anterior.</p>`:""}
    ${tag?`<p class="nota at espaco-p">Projeto com etiqueta: só o limite legal e a repetição barram. O resto vira pendência anotada.</p>`:""}
    <div class="espaco-p">${PORTA.map((q,i)=>`<div class="pergunta${i>ate?" travada":""}"><h3>${i+1}. ${esc(q.q)}</h3><p class="meta">${esc(q.d)} Se ${q.para}: ${esc(minus(q.efeito))}</p>
      ${q.k==="repete"&&irmaos.length?`<p class="meta">Outros projetos da mesma missão: ${esc(irmaos.slice(0,6).join("; "))}${irmaos.length>6?"; e mais "+(irmaos.length-6):""}.</p>`:""}
      ${i>ate?"":ops("p."+q.k,SIMNAO,p[q.k])}</div>`).join("")}</div>
    ${r.tipo==="falta"?"":`<p class="nota ${r.tipo==="aceita"?"ok":"at"}" role="status">${esc(r.txt)}</p>`}
    ${area("p.nota",r.tipo==="aceita"?"Pendências anotadas":"Justificativa",r.tipo==="aceita"?"O que a área precisa resolver, sem impedir o projeto de seguir.":"Obrigatória quando o Canvas volta ou sai.")}
    <div class="acoes"><button class="bt" data-acao="porta" data-code="${esc(c.code)}"${r.tipo==="falta"?" disabled":""}>${r.tipo==="volta"?"Devolver para completar":r.tipo==="saida"?"Registrar a saída":"Aceitar o Canvas"}</button></div></section>`; };
ACOES.porta=async d=>{ const c=S.base[d.code], e=E(c.code), p=R.p, r=resultadoPorta(p,etiquetado(c.code));
  if(r.tipo==="falta") return aviso("Responda às perguntas na ordem.");
  if(r.tipo!=="aceita"&&!(p.nota||"").trim()) return aviso("Escreva a justificativa.");
  if(r.tipo==="volta"){ e.ficha.enviada=false; e.porta={devolvidaEm:agora(),nota:p.nota.trim()}; await salvar(c.code,3,"Canvas devolvido para completar. "+p.nota.trim(),"Canvas devolvido"); }
  else { e.porta={completa:p.completa,mandato:p.mandato,repete:p.repete,medicao:p.medicao,nota:(p.nota||"").trim(),fechada:true,por:quem(),em:agora()};
    await salvar(c.code,3,r.txt+(p.nota?" "+p.nota.trim():""),r.tipo==="aceita"?"Canvas aceito":"Saída registrada"); }
  ir("#/etapa/3"); };

/* ---------- etapa 4: árvore da missão ---------- */
TELAS[4]=c=>{
  if(!c) return fila(4,"Projetos que aguardam a árvore da missão","Nenhum projeto aguarda a árvore.")+outros(4,"Já passaram pela árvore");
  const e=E(c.code), sv=e.arvore;
  if(!R.ini){ const m=missaoDe(c); R={ini:1,a:{m,st:arvTem(m)?arvNovo(m):null,pilha:[],saida:"",just:""}}; }
  const a=R.a, tem=arvTem(a.m), st=a.st, comArvore=Object.keys(MISSOES).filter(arvTem);
  let corpo="";
  if(tem&&st&&st.atual){ const n=ARVD[a.m].nos[st.atual];
    corpo=`<div class="pergunta"><p class="meta">Pergunta ${esc(n.k||"")}${n.reg?" · registro de vínculo: a resposta não muda o resultado da árvore":""}</p><h3>${esc(n.t)}</h3>${
      n.lista?`<details class="espaco-p" open><summary class="meta"><b>${esc(n.lista.t)}</b></summary>${n.lista.grupos.map(g=>`<p class="meta"><b>${esc(g[0])}:</b> ${esc(g[1].join("; "))}.</p>`).join("")}${n.lista.nota?`<p class="meta">${esc(n.lista.nota)}</p>`:""}</details>`:""}<div class="opcoes" style="flex-direction:column;align-items:stretch">${
      n.tipo==="q"?n.opts.map((o,i)=>`<button type="button" class="op" data-acao="arvPasso" data-i="${i}" data-fid="arv:${i}">${esc(o.t)}</button>`).join("")
      :n.elos.map((x,i)=>`<button type="button" class="op" data-acao="arvPasso" data-elo="${i}" data-fid="arv:e${i}">Elo ${i+1}: ${esc(x.t)}${x.pr?` <span class="tag etq">★ cadeia prioritária</span>`:""}</button>`).join("")
       +(n.alts||[]).map((x,i)=>`<button type="button" class="op" data-acao="arvPasso" data-alt="${i}" data-fid="arv:a${i}">${esc(x.t)}</button>`).join("")
       +(n.none?`<button type="button" class="op" data-acao="arvPasso" data-none="1" data-fid="arv:n">Nenhum dos elos listados</button>`:"")}</div></div>`; }
  else if(tem&&st&&st.out){ const o=st.out, nota=aderencia3(o.c);
    corpo=`<p class="nota ${o.c==="pri"||o.c==="ade"?"ok":"at"}" role="status"><b>${esc(ARV_TXT[o.c]||o.c)}</b>${nota?`: nota de aderência ${nota}`:""}.${o.t&&o.t!==ARV_TXT[o.c]?" "+esc(o.t)+".":""}${o.d?" "+esc(o.d):""}${o.oe?" Vínculo registrado: objetivo "+esc(o.oe)+".":""}</p>
     ${o.c==="red"?`<p class="espaco-p">A árvore indica outra missão. Refaça a etapa 4 nela.</p><div class="acoes"><button class="bt" data-acao="arvMissao" data-m="${esc(o.red)}">Refazer na missão ${esc(MISSOES[o.red]||o.red)}</button></div>`
      :`<div class="acoes"><button class="bt" data-acao="arvRegistrar" data-code="${esc(c.code)}">Registrar o resultado da árvore</button></div>`}`; }
  else corpo=`<p class="nota at">A missão ${esc(MISSOES[a.m]||a.m)} ainda não tem árvore carregada. Registre o resultado à mão, com justificativa, ou percorra a árvore de outra missão.</p>
     <div class="pergunta espaco-p"><h3>Resultado, sem árvore</h3>${ops("a.saida",[["pri","Aderente prioritário: atende à regra de prioridade da missão"],["ade","Aderente: atua em elo da cadeia"],["par","Parcial: não atua em elo"],["nad","Não se insere na missão"]],a.saida)}
     ${area("a.just","Justificativa","Obrigatória: diga em que cadeia e em que elo o projeto atua.")}</div>
     <div class="acoes"><button class="bt" data-acao="arvManual" data-code="${esc(c.code)}">Registrar o resultado, sem árvore</button></div>`;
  const trilha=st&&st.trilha.length?`<h3 class="espaco">Caminho percorrido</h3><ol class="ativ espaco-p">${st.trilha.map(t=>`<li><span class="perg">${esc(t.t)}<small>${esc(t.r)}</small></span></li>`).join("")}</ol>
     <div class="acoes"><button class="bt discreto peq" data-acao="arvVoltar">Voltar uma pergunta</button><button class="bt discreto peq" data-acao="arvMissao" data-m="${esc(a.m)}">Recomeçar a árvore</button></div>`:"";
  return `<section class="bloco">${cabProjeto(c,4)}
    ${sv&&sv.saida?`<p class="nota ok espaco-p">Resultado já registrado: ${esc(ARV_TXT[sv.saida]||sv.saida)}${sv.manual?", sem árvore":""}. Registrar de novo substitui o anterior.</p>`:""}
    <p class="espaco-p"><b>Árvore da missão:</b> ${esc(MISSOES[a.m]||a.m)}${a.m!==c.missao?` <span class="meta">(o Canvas indicava ${esc(MISSOES[c.missao]||c.missao)})</span>`:""}</p>
    ${tem&&ARVD[a.m].validar?`<p class="nota at espaco-p"><b>Árvore em validação.</b> ${esc(ARVD[a.m].validar)}</p>`:""}
    ${tem&&ARVD[a.m].regra?`<p class="meta espaco-p"><b>Regra de prioridade desta missão.</b> ${esc(ARVD[a.m].regra)}</p>`:""}
    <div class="espaco-p">${corpo}</div>${trilha}
    ${comArvore.length?`<h3 class="espaco">Percorrer a árvore de outra missão</h3><p class="meta">Para projeto transversal ou quando a missão do Canvas não tem árvore.</p><div class="opcoes espaco-p">${comArvore.map(m=>`<button type="button" class="op" data-acao="arvMissao" data-m="${m}" aria-pressed="${a.m===m}">${esc(MISSOES[m])}</button>`).join("")}</div>`:""}</section>`; };
ACOES.arvPasso=d=>{ const a=R.a, esc_=d.i!=null?{i:+d.i}:d.elo!=null?{elo:+d.elo}:d.alt!=null?{alt:+d.alt}:{none:1}; a.pilha.push(a.st); a.st=arvPasso(a.st,esc_); render(); };
ACOES.arvVoltar=()=>{ const a=R.a; if(a.pilha.length) a.st=a.pilha.pop(); render(); };
ACOES.arvMissao=d=>{ R.a={m:d.m,st:arvTem(d.m)?arvNovo(d.m):null,pilha:[],saida:"",just:""}; render(); };
ACOES.arvRegistrar=async d=>{ const c=S.base[d.code], a=R.a, o=a.st.out;
  E(c.code).arvore={missao:a.m,saida:o.c,titulo:o.t||ARV_TXT[o.c],trilha:a.st.trilha,elo:a.st.elo,estrela:!!a.st.eloPr,oe:o.oe||"",manual:false,por:quem(),em:agora()};
  await salvar(c.code,4,"Árvore da missão "+(MISSOES[a.m]||a.m)+": "+(ARV_TXT[o.c]||o.c).toLowerCase()+".","Resultado da árvore registrado"); ir("#/etapa/4"); };
ACOES.arvManual=async d=>{ const c=S.base[d.code], a=R.a; if(!a.saida) return aviso("Escolha o resultado."); if(!(a.just||"").trim()) return aviso("Escreva a justificativa.");
  E(c.code).arvore={missao:a.m,saida:a.saida,titulo:ARV_TXT[a.saida],trilha:[{k:"Sem árvore",t:"Resultado registrado à mão",r:a.just.trim()}],manual:true,por:quem(),em:agora()};
  await salvar(c.code,4,"Resultado sem árvore: "+ARV_TXT[a.saida].toLowerCase()+". "+a.just.trim(),"Resultado registrado"); ir("#/etapa/4"); };

/* ---------- etapa 5: três notas com régua ---------- */
function regua(k,item,atual){ return `<div class="pergunta"><h3>${esc(item.n)}</h3><p class="meta">${esc(item.q)}</p><div class="regua" role="group" aria-label="${esc(item.n)}">${[1,2,3,4,5].map(v=>`<button type="button" class="op" data-acao="set" data-num="1" data-k="${k}" data-v="${v}" data-fid="${k}:${v}" aria-pressed="${+atual===v}"><b>${v}</b><span>${esc(item.a[v]||(v===2?"Entre o nível 1 e o 3":"Entre o nível 3 e o 5"))}</span></button>`).join("")}</div></div>`; }
TELAS[5]=c=>{
  if(!c) return fila(5,"Projetos que aguardam leitura","Nenhum projeto aguarda leitura.")+outros(5,"Já têm as quatro notas");
  const e=E(c.code), L=e.leituras||{}, nt=notasDe(c), fora=c.dir==="PRES";
  if(!R.ini){ R={ini:1,leitor:!L.L1?"L1":!L.L2?"L2":"",l:{R:"",E:"",I:"",dano:"não",danoJust:"",just:""},con:{...clone(e.conciliacao)},ct:{texto:(e.contestacao||{}).texto||""}}; if(R.con.dano!=null) R.con.danoR=R.con.dano?"sim":"não"; }
  const rot=k=>k==="L2"&&fora?"Leitura 2, de leitor de fora da Presidência":"Leitura "+k.slice(1);
  const estado=k=>L[k]?`<span class="tag ok">Registrada</span> <span class="meta">${esc(L[k].por||"")}, ${esc(dataHora(L[k].em))}</span> <button class="bt discreto peq" data-acao="refazerLeitura" data-k="${k}">Refazer</button>`:`<span class="tag at">A fazer</span>`;
  const form=R.leitor?`<section class="bloco"><h2>${esc(rot(R.leitor))}</h2><p class="meta">As leituras são feitas em separado: as notas do outro leitor só aparecem quando as duas estiverem registradas.</p>
     <div class="espaco-p">${NOTAS3.map(n=>regua("l."+n.k,n,rget("l."+n.k))).join("")}
      <div class="pergunta"><h3>O projeto causa dano a emprego ou ambiente?</h3><p class="meta">Elimina postos sem requalificação, ou aumenta emissões sem compensação. Se sim, a saída é reformular.</p>${ops("l.dano",SIMNAO,rget("l.dano"))}${rget("l.dano")==="sim"?area("l.danoJust","Qual é o dano?"):""}</div></div>
     ${area("l.just","Justificativa das notas","Onde, no Canvas, está a evidência de cada nota.")}
     <div class="acoes"><button class="bt" data-acao="leitura" data-code="${esc(c.code)}">Registrar ${esc(rot(R.leitor).toLowerCase())}</button></div></section>`:"";
  let comp="";
  if(L.L1&&L.L2){
    comp=`<section class="bloco"><h2>As duas leituras</h2><div class="rolavel"><table class="lista"><thead><tr><th>Nota</th><th class="n">Leitura 1</th><th class="n">Leitura 2</th><th class="n">Diferença</th><th class="n">Nota final</th></tr></thead><tbody>
      <tr><td class="pj"><b>Aderência à missão</b><small>Da árvore</small></td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">${nt.A??"—"}</td></tr>
      ${NOTAS3.map(n=>{ const d=Math.abs(L.L1[n.k]-L.L2[n.k]); return `<tr><td class="pj"><b>${esc(n.n)}</b></td><td class="n">${L.L1[n.k]}</td><td class="n">${L.L2[n.k]}</td><td class="n">${d}${d>=REGUA3.divergencia?` <span class="tag at">Conciliar</span>`:""}</td><td class="n">${nt[n.k]!=null?nf(nt[n.k],1):"—"}</td></tr>`; }).join("")}</tbody></table></div>
      ${nt.diverge.length||nt.danoDiverge?`<h3 class="espaco">Conciliação</h3><p class="meta">Os dois leitores conversam e registram. Se a diferença persistir, decide a gerência da Unidade de Gestão Estratégica.</p>
        ${nt.diverge.map(k=>{ const n=NOTAS3.find(x=>x.k===k); return `<div class="cmp"><span class="rot">${esc(n.n)}: nota conciliada</span>${ops("con."+k,[1,2,3,4,5].map(v=>[v,String(v)]),rget("con."+k)).replace(/data-acao="set"/g,'data-acao="set" data-num="1"')}</div>`; }).join("")}
        ${nt.danoDiverge?`<div class="cmp"><span class="rot">Há dano a emprego ou ambiente?</span>${ops("con.danoR",SIMNAO,rget("con.danoR"))}</div>`:""}
        ${area("con.registro","Registro da conversa","O que cada leitor viu e por que chegaram a esta nota.")}
        <div class="acoes"><button class="bt" data-acao="conciliar" data-code="${esc(c.code)}">Registrar a conciliação</button></div>`:""}
      ${nt.completo?`<p class="nota ${nt.dano?"er":"ok"} espaco" role="status">${nt.dano?"Dano a emprego ou ambiente confirmado. Saída: reformular.":`Valor do projeto: <b>${nf(valorDe(c))}</b>, média de aderência ${nt.A??"—"}, resultados medidos ${nf(nt.R,1)}, escala e articulação ${nf(nt.E,1)} e Indústria 5.0 ${nf(nt.I,1)}.`}</p>`:""}</section>
     <section class="bloco"><h2>Contestação da área</h2><p class="meta">A área que propõe vê as notas e pode apontar erro de fato, com documento. Não é pedido de nota maior.</p>
      ${area("ct.texto","Erro de fato apontado","Qual fato está errado e qual documento mostra o correto.")}<div class="acoes"><button class="bt sec" data-acao="contestar" data-code="${esc(c.code)}">Registrar a contestação</button></div></section>`; }
  return `<section class="bloco">${cabProjeto(c,5)}
    ${fora?`<p class="nota at espaco-p">Canvas de unidade ligada à Presidência: a segunda leitura é de um leitor de fora da linha da Presidência.</p>`:""}
    <p class="espaco-p"><b>Aderência à missão:</b> ${nt.A??"—"} <span class="meta">(da árvore: ${esc(ARV_TXT[(e.arvore||{}).saida]||"ainda não percorrida")})</span></p>
    <ol class="fila espaco-p"><li style="grid-template-columns:1fr auto"><span class="nm">${esc(rot("L1"))}</span><span>${estado("L1")}</span></li><li style="grid-template-columns:1fr auto"><span class="nm">${esc(rot("L2"))}</span><span>${estado("L2")}</span></li></ol></section>${form}${comp}`; };
ACOES.refazerLeitura=d=>{ const L=(E(ROTA[2]).leituras||{})[d.k]||{}; R.leitor=d.k; R.l={R:L.R||"",E:L.E||"",I:L.I||"",dano:L.dano?"sim":"não",danoJust:L.danoJust||"",just:L.just||""}; render(); };
ACOES.leitura=async d=>{ const c=S.base[d.code], e=E(c.code), l=R.l, k=R.leitor; if(!k) return;
  if(![l.R,l.E,l.I].every(v=>+v>=1&&+v<=5)) return aviso("Dê as três notas.");
  if(l.dano==="sim"&&!(l.danoJust||"").trim()) return aviso("Descreva o dano a emprego ou ambiente.");
  e.leituras=e.leituras||{}; e.leituras[k]={por:quem(),R:+l.R,E:+l.E,I:+l.I,dano:l.dano==="sim",danoJust:(l.danoJust||"").trim(),just:(l.just||"").trim(),em:agora()}; delete e.conciliacao;
  await salvar(c.code,5,"Leitura "+k.slice(1)+" registrada.","Leitura registrada"); R={}; render(); };
ACOES.conciliar=async d=>{ const c=S.base[d.code], e=E(c.code), nt=notasDe(c), con=R.con||{}, o={};
  for(const k of nt.diverge){ if(!(+con[k]>=1&&+con[k]<=5)) return aviso("Escolha a nota conciliada de cada critério em divergência."); o[k]=+con[k]; }
  if(nt.danoDiverge){ if(!con.danoR) return aviso("Digam se há dano a emprego ou ambiente."); o.dano=con.danoR==="sim"; }
  if(!(con.registro||"").trim()) return aviso("Registre o que os leitores conversaram.");
  e.conciliacao={...o,registro:con.registro.trim(),por:quem(),em:agora()}; await salvar(c.code,5,"Notas conciliadas. "+con.registro.trim(),"Conciliação registrada"); R={}; render(); };
ACOES.contestar=async d=>{ const c=S.base[d.code], t=((R.ct||{}).texto||"").trim(); if(!t) return aviso("Descreva o erro de fato.");
  E(c.code).contestacao={texto:t,por:quem(),em:agora()}; await salvar(c.code,5,"Contestação da área: "+t,"Contestação registrada"); render(); };

/* ---------- etapa 6: farol de execução e custo ---------- */
TELAS[6]=c=>{
  if(!c) return fila(6,"Projetos que aguardam o farol","Nenhum projeto aguarda o farol.")+outros(6,"Já têm farol");
  const e=E(c.code), sv=e.farol||{};
  if(!R.ini){ const x=sv.exq||[]; R={ini:1,f:{i0:x[0]??"",i1:x[1]??"",i2:x[2]??"",i3:x[3]??"",comprometido:sv.comprometido!=null?String(sv.comprometido):"",novo:String(sv.novo??c.novos??""),obs:sv.obs||""}}; }
  const f=R.f, exq=[f.i0,f.i1,f.i2,f.i3], cor=exq.every(v=>v!=="")?farol3(exq):null;
  return `<section class="bloco">${cabProjeto(c,6)}
    ${sv.exq?`<p class="nota ok espaco-p">Farol já registrado. Registrar de novo substitui o anterior.</p>`:""}
    <div class="espaco-p">${FAROL.map((it,i)=>`<div class="pergunta"><h3>${esc(it.t)}</h3><p class="meta">${esc(it.q)}</p>${ops("f.i"+i,[5,3,1,0].map(v=>[v,it.a[v]]),f["i"+i]).replace(/data-acao="set"/g,'data-acao="set" data-num="1"')}</div>`).join("")}</div>
    <h3 class="espaco">Custo confirmado</h3><div class="grade2">${texto("f.comprometido","Dinheiro já comprometido, em reais","Contratos e convênios em vigor.")}${texto("f.novo","Dinheiro novo pedido, em reais","Confira com o valor do Canvas.")}</div>
    ${area("f.obs","Observações","Qual é a pendência e o que a resolve.")}
    <p class="espaco" role="status">${cor?`${sinal(cor,true)} <b>${esc(FAROL_TXT[cor])}</b>`:`${`<span class="sinal g" aria-hidden="true"><i></i><i></i><i></i></span>`} <span class="meta">Responda aos quatro itens para o farol acender.</span>`}</p>
    <div class="acoes"><button class="bt" data-acao="farol" data-code="${esc(c.code)}"${cor?"":" disabled"}>Registrar o farol</button></div></section>`; };
ACOES.farol=async d=>{ const c=S.base[d.code], f=R.f, exq=[f.i0,f.i1,f.i2,f.i3]; if(exq.some(v=>v==="")) return aviso("Responda aos quatro itens.");
  E(c.code).farol={exq:exq.map(Number),comprometido:num(f.comprometido)||0,novo:num(f.novo),obs:(f.obs||"").trim(),por:quem(),em:agora()};
  await salvar(c.code,6,FAROL_TXT[farol3(exq.map(Number))]+"."+(f.obs?" "+f.obs.trim():""),"Farol registrado"); ir("#/etapa/6"); };

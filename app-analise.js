/* ===== Matriz de priorização da carteira · vínculo com a ABDI 5.0, evidências, método, análise de sensibilidade e arquivo da avaliação =====
   Telas acrescentadas na versão final, a partir da planilha "Matriz de Priorização ABDI 2027", versão 0.7:
   - vínculo de cada projeto com os quatro eixos da ABDI 5.0 (aba 4d) e leitura direta do Canvas;
   - evidências de cada resposta da avaliação (aba Evidências) e método (aba Método);
   - análise de sensibilidade da lista (aba 7c);
   - importar e baixar a avaliação da carteira em arquivo. */

/* ---------- vínculo com a ABDI 5.0, na página do projeto ---------- */
function abdiConferencia(v,pilares){
  if(!v.eixos||!Array.isArray(pilares)) return [];
  const par=[[0,0],[2,1],[3,2]], L=[];   /* eixo → pilar do Canvas de 2027 */
  for(const [e,p] of par){ const pl=pilares[p];
    if(v.eixos[e]&&(pl==="Não"||pl==="Em branco")) L.push(ABDI_EIXOS[e]+" sem pilar declarado no Canvas.");
    if(!v.eixos[e]&&pl==="Sim") L.push("O Canvas declara "+ABDI_PILARES[p]+", sem vínculo aqui."); }
  return L; }
function blocoAbdi(c){
  const e=E(c.code), a=e.arvore||{}, v=abdiDe(c), g=e.abdi||{}, semElo=v.origem!=="elo";
  if(!R.abIni){ R.abIni=1; const x=Array.isArray(g.eixos)?g.eixos:[]; R.ab={e0:x.length?(x[0]?"sim":"não"):"",e1:x.length?(x[1]?"sim":"não"):"",e2:x.length?(x[2]?"sim":"não"):"",e3:x.length?(x[3]?"sim":"não"):"",base:g.base||"",logica:g.logica||"",trecho:g.trecho||"",aberto:false}; }
  const conf=abdiConferencia(v,g.pilares), pil=Array.isArray(g.pilares)&&g.pilares.some(Boolean);
  const eixos=v.eixos?`<ul class="eixos">${ABDI_EIXOS.map((t,i)=>`<li class="${v.eixos[i]?"sim":"nao"}"><b>${v.eixos[i]?"Sim":"Não"}</b>${esc(t)}</li>`).join("")}</ul>`:`<p class="nota at">Vínculo a definir. ${a.elo?"O elo deste projeto não está na tabela de vínculos.":"O projeto não tem elo de árvore: o vínculo vem da leitura direta do Canvas."}</p>`;
  const form=`<div class="espaco-p">${ABDI_EIXOS.map((t,i)=>`<div class="cmp"><span class="rot">${esc(t)}</span>${ops("ab.e"+i,SIMNAO,R.ab["e"+i])}</div>`).join("")}
     <div class="cmp"><span class="rot">Base da leitura</span>${ops("ab.base",BASES.map(b=>[b,b]),R.ab.base)}</div>
     ${area("ab.logica","Lógica da leitura","Por que o projeto contribui, ou não, por cada eixo.")}${area("ab.trecho","Trecho do Canvas","O que o Canvas diz: quadro de pilares, objetivo ou entregas.",2)}
     <div class="acoes"><button class="bt sec" data-acao="abdiSalvar" data-code="${esc(c.code)}">Registrar a leitura direta</button><button class="bt discreto" data-acao="abdiFechar">Cancelar</button></div></div>`;
  return `<section class="bloco" id="abdi"><h2>Vínculo com a ABDI 5.0</h2><p class="meta">Por quais eixos o projeto contribui. É classificação: não entra na nota e não muda a saída sugerida.</p>
    <div class="espaco-p">${eixos}</div>
    ${v.eixos?`<p class="meta espaco-p"><b>Base do vínculo.</b> ${esc(v.base)}.${v.origem==="elo"?" Elo: "+esc(a.cat||"")+" · "+esc(a.elo||"")+(a.estrela?" ★":"")+".":""}${v.criterio?" Critério usado ao completar: "+esc(v.criterio):""}</p>`:""}
    ${v.origem==="leitura"&&(v.logica||v.trecho)?`<details class="espaco-p"><summary class="meta"><b>Lógica e trecho da leitura direta</b></summary>${v.logica?`<p class="espaco-p">${esc(v.logica)}</p>`:""}${v.trecho?`<blockquote class="trecho">${esc(v.trecho)}</blockquote>`:""}</details>`:""}
    ${pil?`<p class="meta espaco-p"><b>Pilares declarados no Canvas.</b> ${ABDI_PILARES.map((t,i)=>esc(t)+": "+esc(String(g.pilares[i]||"em branco").toLowerCase())).join("; ")}.</p>`:""}
    ${conf.length?`<p class="nota at espaco-p"><b>A conferir.</b> ${esc(conf.join(" "))}</p>`:""}
    ${semElo?(R.ab.aberto?form:`<div class="acoes"><button class="bt discreto peq" data-acao="abdiAbrir">${v.eixos?"Rever a leitura direta do Canvas":"Fazer a leitura direta do Canvas"}</button></div>`):""}</section>`; }
ACOES.abdiAbrir=()=>{ R.ab.aberto=true; render(); };
ACOES.abdiFechar=()=>{ R.ab.aberto=false; render(); };
ACOES.abdiSalvar=async d=>{ const c=S.base[d.code], r=R.ab, x=[r.e0,r.e1,r.e2,r.e3];
  if(x.some(v=>v!=="sim"&&v!=="não")) return aviso("Responda aos quatro eixos.");
  if(!r.base) return aviso("Escolha a base da leitura.");
  if(!(r.logica||"").trim()) return aviso("Escreva a lógica da leitura.");
  const e=E(c.code); e.abdi={...(e.abdi||{}),eixos:x.map(v=>v==="sim"),base:r.base,logica:r.logica.trim(),trecho:(r.trecho||"").trim(),por:quem(),em:new Date().toISOString()};
  await salvar(c.code,4,"Vínculo com a ABDI 5.0 por leitura direta do Canvas: "+abdiTexto(e.abdi.eixos)+". Base: "+r.base.toLowerCase()+".","Vínculo registrado"); R.abIni=0; render(); };

/* ---------- evidências da avaliação, na página do projeto ---------- */
function blocoEvidencias(c){
  const ev=E(c.code).evid; if(!Array.isArray(ev)||!ev.length) return "";
  const grupos=[]; ev.forEach(x=>{ let g=grupos.find(y=>y.t===x.etapa); if(!g) grupos.push(g={t:x.etapa,l:[]}); g.l.push(x); });
  const cont={}; ev.forEach(x=>{ cont[x.base]=(cont[x.base]||0)+1; });
  return `<section class="bloco" id="evidencias"><h2>Evidências da avaliação <span class="tag">${ev.length}</span></h2>
    <p class="meta">Uma linha por resposta, com a base, a lógica e o trecho do documento da Agência. ${BASES.filter(b=>cont[b]).map(b=>cont[b]+" por "+b.toLowerCase()).join("; ")}. <a href="#/metodo">Como a avaliação foi feita</a></p>
    ${grupos.map(g=>`<details class="evid"><summary><b>${esc(g.t)}</b> <span class="meta">${g.l.length} ${g.l.length===1?"resposta":"respostas"}${g.l[0].quem?" · "+esc(g.l[0].quem):""}</span></summary>
      <div class="rolavel"><table class="lista evid-tab"><thead><tr><th>Pergunta ou item</th><th>Resposta</th><th>Base</th><th>Lógica da resposta</th><th>Trecho citado</th></tr></thead><tbody>${g.l.map(x=>`<tr><td class="pj">${esc(x.item)}</td><td><b>${esc(x.resp)}</b></td><td><span class="tag base-${esc(String(x.base||"").slice(0,3).toLowerCase())}">${esc(x.base||"—")}</span></td><td>${esc(x.logica)}</td>
        <td>${x.trecho?`“${esc(x.trecho)}”`:"—"}${x.onde?`<small>${esc(x.onde)}</small>`:""}${x.outros?`<details><summary class="meta">Outros trechos</summary><small class="pre">${esc(x.outros)}</small></details>`:""}</td></tr>`).join("")}</tbody></table></div></details>`).join("")}</section>`; }

/* ---------- método da avaliação ---------- */
function vMetodo(M){
  const av=S.ciclo.avaliacao;
  if(!av){ M.innerHTML=`<header><p class="passo"><a href="#/">Início</a></p><h1>Método da avaliação</h1><p class="frase">Nenhuma avaliação da carteira foi importada neste ciclo.</p></header>`; return; }
  const b=av.bases;
  M.innerHTML=`<header><p class="passo"><a href="#/">Início</a></p><h1>${esc(av.titulo||"Avaliação da carteira")}: o método</h1><p class="frase">${esc(av.faixa||"")}</p></header>
   <section class="bloco espaco"><h2>Como a avaliação foi feita</h2><dl class="gloss">${(av.metodo||[]).map(l=>`<dt>${esc(l[0])}</dt><dd>${esc(l[1])}</dd>`).join("")}</dl></section>
   ${b?`<section class="bloco"><h2>${esc(b.titulo)}</h2><div class="rolavel"><table class="lista"><thead><tr>${b.cab.map((t,i)=>`<th${i>0&&i<5?' class="n"':""}>${esc(t)}</th>`).join("")}</tr></thead><tbody>${b.linhas.map(l=>`<tr>${l.map((x,i)=>i===0?`<td class="pj"><b>${esc(x)}</b></td>`:`<td${i<5?' class="n"':""}>${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`:""}
   <section class="bloco"><h2>De onde veio</h2><p>${esc(av.origem||"")}${av.em?". Avaliação de "+dataBR(av.em)+".":""}${av.importadoEm?" Importada em "+dataHora(av.importadoEm)+" por "+esc(av.importadoPor||"—")+".":""}</p>
    <div class="acoes"><a class="bt" href="#/etapa/7">Ver a lista e a linha do teto</a><a class="bt sec" href="#/sensibilidade">Análise de sensibilidade</a></div></section>`; }

/* ---------- análise de sensibilidade (etapa 7) ---------- */
function sensParam(){ const s=S.sens||{}, P={...SENS3,livre:{...SENS3.livre}}, i=(v,d,mn,mx)=>{ const x=num(v); return x!=null&&x>=mn&&x<=mx?x:d; };
  P.peq=i(s.peq,SENS3.peq,1,24); P.maior=i(s.maior,SENS3.maior,1,24); P.relevante=i(s.relevante,SENS3.relevante,1,80);
  P.partes=[SENS3.partes[0],SENS3.partes[1],i(s.tetoLivre,SENS3.partes[2]*100,1,300)/100];
  P.livre={pesos:[0,1,2,3].map(k=>i(s["w"+k],25,0,1000)),notas:SENS_NOTAS[s.notas]?s.notas:"finais",aderMin:s.aderMin===""||s.aderMin==null?null:i(s.aderMin,null,1,5)};
  return P; }
function vSensibilidade(M){
  if(!R.sIni){ R.sIni=1; const s=S.sens||{}; R.s={peq:s.peq??"5",maior:s.maior??"10",relevante:s.relevante??"3",tetoLivre:s.tetoLivre??"50",w0:s.w0??"25",w1:s.w1??"25",w2:s.w2??"25",w3:s.w3??"25",notas:s.notas||"finais",aderMin:s.aderMin??"",cen:s.cen||"1",teto:s.teto||"1"}; }
  S.sens={...R.s}; const P=sensParam(), t=tetoAtual(), r=rec(), porCod=Object.fromEntries(r.linhas.map(l=>[l.code,l]));
  const A=sensibilidade3(projetos().map(c=>sensEntrada3(c,E(c.code))),{valor:t.valor,publicado:!!t.publicado,parte:t.parte||1},somaPedidos(),REGUA3,P);
  const pct=v=>v==null?"—":nf(v,2), mi=v=>"R$ "+sensDec(v/1e6,1)+" milhões", cls=l=>l==="Muda de lado"?"res-par":l==="Acima em todos"?"res-pri":l==="Abaixo em todos"?"res-lar":"res-nada";
  const d=A.detalhe(R.s.cen,R.s.teto), campo=(k,rot,dica)=>`<div class="cmp"><label for="s_${k}">${esc(rot)}</label><input id="s_${k}" type="text" inputmode="decimal" data-rasc="s.${k}" value="${esc(R.s[k])}">${dica?`<span class="dica">${esc(dica)}</span>`:""}</div>`;
  if(!A.nBase){ M.innerHTML=`<header><p class="passo"><a href="#/etapa/7">Etapa 7: portfólio</a></p><h1>Análise de sensibilidade</h1><p class="frase">O que muda na ordem da lista e na linha do teto quando mudam os pesos, o leitor, a régua e o teto.</p></header>
     <p class="nota at espaco">Nenhum projeto disputa recurso novo ainda. A análise aparece quando houver projeto com notas e farol.</p>`; return; }
  M.innerHTML=`<header><p class="passo"><a href="#/etapa/7">Etapa 7: portfólio</a></p><h1>Análise de sensibilidade</h1>
    <p class="frase">O que muda na ordem da lista e na linha do teto quando mudam os pesos, o leitor, a régua e o teto.</p></header>
   <section class="bloco espaco"><h2>O que a análise mostra</h2><dl class="gloss">${A.frases.map(f=>`<dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd>`).join("")}</dl>
    <details class="espaco-p"><summary class="meta"><b>O que o contrato pede e como ler</b></summary>
     <p class="espaco-p">O Plano de Trabalho, no bloco da matriz de priorização, diz que a análise de sensibilidade serve para verificar se pequenas alterações de peso produzem mudanças relevantes na ordenação, sinalizando decisões que exigem julgamento adicional. O Termo de Referência pede uma matriz com critérios objetivos, submetida à decisão do Conselho Deliberativo: a matriz subsidia a decisão, não a toma.</p>
     <p class="espaco-p">Cada cenário muda uma coisa de cada vez em relação à régua em vigor: o peso de uma nota, as notas usadas (quem lê) ou a aderência mínima. A tabela de cenários mostra o efeito sobre a lista; a tabela de projetos mostra quem é estável e quem pede julgamento adicional; o cenário em detalhe mostra a lista inteira de um cenário, em um teto.${S.ciclo.avaliacao?" As notas são as da avaliação preliminar da equipe: enquanto elas não forem validadas, a leitura vale como teste do instrumento.":""}</p></details></section>
   <section class="bloco"><h2>Parâmetros da análise</h2><p class="meta">Valores de partida da equipe, a combinar com a Agência. Mudar aqui não altera nenhuma avaliação nem a lista da etapa 7.</p>
    <div class="grade4">${campo("peq","Variação pequena do peso (pontos percentuais)","Cenários 2 a 9. Na régua, cada nota pesa 25.")}${campo("maior","Variação maior do peso (pontos percentuais)","Cenários 10 a 17.")}${campo("relevante","Mudança de posição que conta como relevante","Com pequenas alterações de peso.")}${campo("tetoLivre","Teto livre (% da soma dos pedidos)","Quarto teto simulado.")}</div>
    <div class="acoes"><button class="bt sec" data-acao="sensAplicar">Refazer a análise</button><button class="bt discreto" data-acao="sensPadrao">Voltar aos valores de partida</button></div></section>
   <section class="bloco"><h2>Tetos simulados: a linha do teto na base</h2><div class="rolavel"><table class="lista"><thead><tr><th>Teto</th><th class="n">Valor</th><th class="n">Acima da linha</th><th class="n">Usado até a linha</th><th class="n">Saldo</th><th class="n">Valor do último que cabe</th><th class="n">Mudam de lado em algum dos ${A.nCont} cenários</th><th>Primeiro projeto abaixo da linha</th></tr></thead>
     <tbody>${A.tetos.map(x=>`<tr><td class="pj"><b>${esc(x.nome)}</b><small>${esc(x.press)}</small></td><td class="n">${brl(x.valor)}</td><td class="n">${x.acima}</td><td class="n">${brl(x.usado)}</td><td class="n">${brl(x.saldo)}</td><td class="n">${x.corte==null?"—":nf(x.corte)}</td><td class="n">${x.mudam}</td><td>${x.primeiro?`<b>${esc(x.primeiro.code)}</b> ${esc(x.primeiro.nome)}`:"Nenhum: todos os projetos na disputa cabem."}</td></tr>`).join("")}</tbody></table></div></section>
   <section class="bloco"><h2>Consistência entre os dois leitores</h2><p class="meta">Quanto mais notas iguais, menos a posição do projeto depende de quem leu. Diferença de ${REGUA3.divergencia} pontos ou mais pede conciliação.</p>
    <div class="rolavel"><table class="lista"><thead><tr><th>Nota</th><th class="n">Projetos com as duas leituras</th><th class="n">Notas iguais</th><th class="n">Diferença de 1 ponto</th><th class="n">Diferença de ${REGUA3.divergencia} pontos ou mais</th><th class="n">Diferença média</th></tr></thead>
     <tbody>${A.leitores.map(l=>`<tr><td class="pj"><b>${esc(l.nota)}</b></td><td class="n">${l.n}</td><td class="n">${l.iguais}</td><td class="n">${l.d1}</td><td class="n">${l.d2}</td><td class="n">${pct(l.media)}</td></tr>`).join("")}</tbody></table></div>
    <p class="espaco-p">Correlação entre a ordem feita só com as notas do leitor 1 e a feita só com as do leitor 2: <b>${pct(A.corrLeitores)}</b>.</p></section>
   <section class="bloco"><h2>Cenários: o que muda na lista em relação à base</h2><p class="meta">Os cenários 1 a ${A.nCont} entram na contagem: neles, os mesmos projetos disputam o recurso novo. Os cenários 26 e 27 mudam quem disputa, e o 28 é livre.</p>
    <div class="rolavel"><table class="lista sens"><thead><tr><th class="n">Nº</th><th>Cenário</th><th>Notas usadas</th><th class="n">Pesos: aderência, resultados, escala, Indústria 5.0</th><th class="n">Aderência mínima</th><th class="n">Na disputa</th><th class="n">Mudam de posição</th><th class="n">Maior deslocamento</th><th class="n">Correlação com a base</th>${A.tetos.map(x=>`<th class="n">Acima da linha · ${esc(x.nome)}</th>`).join("")}</tr></thead>
     <tbody>${A.cenarios.map(x=>`<tr class="${x.n>A.nCont?"fora":""}"><td class="n">${x.n}</td><td class="pj"><b>${esc(x.nome)}</b><small>${esc(x.grupo)}. ${esc(x.testa)}</small></td><td>${esc(SENS_NOTAS[x.notas])}</td><td class="n">${x.pesos.map(w=>nf(w,Number.isInteger(w)?0:1)).join(" · ")}</td><td class="n">${x.aderMin}</td><td class="n">${x.disputa}</td><td class="n">${x.mudam}</td><td class="n">${x.desloc}</td><td class="n">${pct(x.corr)}</td>${x.acima.map((v,k)=>`<td class="n">${v}${x.lado[k]?`<small>${x.lado[k]} ${x.lado[k]===1?"muda":"mudam"} de lado</small>`:""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <h3 class="espaco">Cenário livre (28)</h3><p class="meta">Qualquer número a partir de zero nos pesos: a conta divide pela soma.</p>
    <div class="grade4">${campo("w0","Peso: aderência")}${campo("w1","Peso: resultados medidos")}${campo("w2","Peso: escala e articulação")}${campo("w3","Peso: Indústria 5.0")}</div>
    <div class="grade2"><div class="cmp"><span class="rot">Notas usadas</span>${ops("s.notas",Object.entries(SENS_NOTAS),R.s.notas)}</div>${campo("aderMin","Aderência mínima (1 a 5)","Em branco, vale a da régua: "+REGUA3.aderenciaMin+".")}</div>
    <div class="acoes"><button class="bt sec" data-acao="sensAplicar">Refazer com o cenário livre</button></div></section>
   <section class="bloco"><h2>Projetos: quem é estável e quem pede julgamento adicional</h2><p class="meta">Pede julgamento adicional o projeto que muda de lado da linha em algum dos quatro tetos, ou que se desloca ${P.relevante} posições ou mais com pequenas alterações de peso.</p>
    <div class="rolavel"><table class="lista sens"><thead><tr><th>Projeto</th><th>Julgamento adicional?</th><th class="n">Pedido</th><th class="n">Valor</th><th class="n">Posição na base</th><th class="n">Melhor e pior posição, cenários 2 a 17</th><th class="n">Melhor e pior, cenários 2 a ${A.nCont}</th>${A.tetos.map(x=>`<th>${esc(x.nome)}</th>`).join("")}</tr></thead>
     <tbody>${A.projetos.map(o=>{ const c=S.base[o.code], l=porCod[o.code]||{}; return `<tr class="${o.naDisputa?"":"fora"}"><td class="pj"><a href="#/projeto/${encodeURIComponent(o.code)}"><b>${esc(o.code)}</b></a>${esc(o.nome)}<small>${esc(l.rotulo||l.estado||"")}. ${esc(o.porque)}</small></td>
       <td>${o.julg==="Sim"?`<span class="tag res-par">Sim</span>`:o.julg==="Não"?`<span class="tag res-ade">Não</span>`:"—"}</td><td class="n">${+c.novos>0?brl(c.novos):"—"}</td><td class="n">${nf(o.valor)}</td><td class="n">${o.pos||"—"}</td>
       <td class="n">${o.naDisputa?o.melhor17+" e "+o.pior17:"—"}</td><td class="n">${o.naDisputa?o.melhor25+" e "+o.pior25:"—"}</td>${o.leitura.map((x,k)=>`<td><span class="tag ${cls(x)}">${esc(x)}</span>${o.naDisputa?`<small>acima em ${o.acima[k]} de ${A.nCont}</small>`:""}</td>`).join("")}</tr>`; }).join("")}</tbody></table></div></section>
   <section class="bloco"><h2>Cenário em detalhe: a lista inteira de um cenário, em um teto</h2>
    <div class="grade2"><div class="cmp"><label for="s-cen">Cenário mostrado</label><select id="s-cen" data-muda="sensEscolha" data-k="cen">${A.cenarios.map(x=>`<option value="${x.n}"${+R.s.cen===x.n?" selected":""}>${x.n}. ${esc(x.nome)}</option>`).join("")}</select></div>
     <div class="cmp"><label for="s-teto">Teto</label><select id="s-teto" data-muda="sensEscolha" data-k="teto">${A.tetos.map(x=>`<option value="${x.n}"${+R.s.teto===x.n?" selected":""}>${x.n}. ${esc(x.nome)} · ${esc(mi(x.valor))}</option>`).join("")}</select></div></div>
    <p class="espaco-p"><b>${d.acima} ${d.acima===1?"projeto":"projetos"} acima da linha</b> e ${d.abaixo} abaixo. Usado até a linha: ${esc(mi(d.usado))}; saldo do teto: ${esc(mi(d.saldo))}. Se a fila pulasse o projeto que não cabe, em vez de parar nele, entrariam ${d.pulando} projetos.${d.cenario.n>=26&&d.cenario.n<=27?" Atenção: nos cenários 26 e 27 muda quem disputa.":""}</p>
    <div class="rolavel"><table class="lista sens"><thead><tr><th class="n">Ordem no cenário</th><th>Projeto</th><th>Posição em relação à linha</th><th>Saída sugerida no cenário</th><th class="n">Pedido</th><th class="n">Acumulado</th><th class="n">Valor no cenário</th><th class="n">Valor na base</th><th class="n">Posição na base</th><th class="n">Posições ganhas (+) ou perdidas (−)</th><th>Farol</th><th>Entraria se a fila pulasse quem não cabe?</th></tr></thead>
     <tbody>${d.linhas.map(x=>{ const base=(porCod[x.code]||{}).saida, mudou=base&&base!==x.saida; return `<tr class="${x.acima?"":"fora"}"><td class="n">${x.ordem}</td><td class="pj"><a href="#/projeto/${encodeURIComponent(x.code)}"><b>${esc(x.code)}</b></a>${esc(x.nome)}</td><td>${x.acima?"Acima da linha":"Abaixo da linha"}</td>
       <td><span class="tag ${clsSaida(x.saida)}">${esc(rotSaida(x.saida))}</span>${mudou?`<small>Na lista da etapa 7: ${esc(rotSaida(base).toLowerCase())}.</small>`:""}</td><td class="n">${brl(x.novos)}</td><td class="n">${brl(x.acum)}</td><td class="n">${nf(x.valor)}</td><td class="n">${nf(x.valorBase)}</td><td class="n">${x.posBase||"—"}</td><td class="n">${x.ganho==null?"—":x.ganho>0?"+"+x.ganho:x.ganho<0?"−"+Math.abs(x.ganho):"0"}</td><td>${sinal(x.farol)}</td><td>${x.pula?"Sim":"Não"}</td></tr>`; }).join("")}</tbody></table></div>
    <div class="acoes"><a class="bt" href="#/etapa/7">Voltar à lista da etapa 7</a>${window.SEM_ARQUIVOS?"":`<button class="bt sec" data-acao="sensPlanilha">Baixar a análise em planilha</button>`}</div></section>`; }
ACOES.sensAplicar=()=>{ S.sens={...R.s}; render(); aviso("Análise refeita"); };
ACOES.sensPadrao=()=>{ S.sens={}; R.sIni=0; render(); aviso("Valores de partida"); };
ACOES.sensEscolha=(d,el)=>{ R.s[d.k]=el.value; S.sens={...R.s}; render(); };
ACOES.sensPlanilha=()=>{ const P=sensParam(), t=tetoAtual(), q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"', n=v=>v==null?"":String(v).replace(".",",");
  const A=sensibilidade3(projetos().map(c=>sensEntrada3(c,E(c.code))),{valor:t.valor,publicado:!!t.publicado,parte:t.parte||1},somaPedidos(),REGUA3,P);
  const L=[["Cenários"],["Nº","Cenário","Grupo","Notas usadas","Peso: aderência","Peso: resultados medidos","Peso: escala e articulação","Peso: Indústria 5.0","Aderência mínima","Projetos na disputa","Mudam de posição","Maior deslocamento","Correlação com a ordem da base",...A.tetos.map(x=>"Acima da linha · "+x.nome),...A.tetos.map(x=>"Mudam de lado · "+x.nome)],
    ...A.cenarios.map(x=>[x.n,x.nome,x.grupo,SENS_NOTAS[x.notas],...x.pesos.map(n),x.aderMin,x.disputa,x.mudam,x.desloc,n(x.corr),...x.acima,...x.lado]),[],["Projetos"],
    ["Código","Projeto","Pede julgamento adicional?","Por quê","Pedido de recurso novo","Valor na base","Posição na base","Melhor posição, cenários 2 a 17","Pior posição, cenários 2 a 17","Maior deslocamento, cenários 2 a 17","Melhor posição, cenários 2 a 25","Pior posição, cenários 2 a 25",...A.tetos.map(x=>"Leitura · "+x.nome)],
    ...A.projetos.map(o=>[o.code,o.nome,o.julg,o.porque,o.novos,n(o.valor),o.pos||"",o.melhor17??"",o.pior17??"",o.desl17??"",o.melhor25??"",o.pior25??"",...o.leitura])];
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob(["﻿"+L.map(x=>x.map(q).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"})); a.download="sensibilidade-"+(S.ciclo.ciclo||"ciclo")+".csv"; document.body.appendChild(a); a.click(); a.remove(); aviso("Planilha baixada"); };

/* ---------- arquivo da avaliação: importar e baixar (etapa 1) ----------
   O arquivo traz as regras do ciclo e o percurso de cada projeto (etapas 2 a 6, com as evidências). É gerado da planilha da matriz
   por ferramentas/planilha, no repositório do projeto, ou baixado daqui mesmo, como cópia de segurança. Conteúdo confidencial: fica só no banco, com login. */
const FORMATO_AVAL="matriz-priorizacao/avaliacao/1";
function blocoAvaliacao(){
  if(window.SEM_ARQUIVOS) return "";
  const a=R.aval, av=S.ciclo.avaliacao;
  let previa="";
  if(a&&a.erro) previa=`<p class="nota er espaco-p" role="alert">${esc(a.erro)}</p>`;
  else if(a&&a.arq){ const cods=Object.keys(a.arq.projetos||{}), tem=cods.filter(k=>S.base[k]), sem=cods.filter(k=>!S.base[k]), ja=tem.filter(k=>Object.keys(S.est[k]||{}).some(x=>["porta","arvore","leituras","farol","decisao"].includes(x)));
    previa=`<div class="nota at espaco-p"><p><b>Arquivo lido.</b> ${esc(a.arq.origem||"Origem não informada")}${a.arq.geradoEm?", gerado em "+dataBR(a.arq.geradoEm):""}.</p>
      <p>${tem.length} ${tem.length===1?"projeto será gravado":"projetos serão gravados"}, com o percurso das etapas 2 a 6${a.arq.ciclo?", e as regras do ciclo "+esc(a.arq.ciclo.ciclo||""):""}.${sem.length?" Ficam de fora "+sem.length+", que não têm Canvas cadastrado: "+esc(sem.join(", "))+".":""}${ja.length?" Atenção: "+ja.length+" já "+(ja.length===1?"tem":"têm")+" percurso registrado, que será substituído (decisão e revisão são mantidas): "+esc(ja.join(", "))+".":""}</p>
      ${a.andando?`<p role="status">Gravando: ${a.andando}.</p>`:`<div class="acoes"><button class="bt" data-acao="avalGravar"${tem.length?"":" disabled"}>Gravar a avaliação de ${tem.length} ${tem.length===1?"projeto":"projetos"}</button><button class="bt discreto" data-acao="avalCancelar">Cancelar</button></div>`}</div>`; }
  return `<section class="bloco" id="avaliacao"><h2>Avaliação da carteira em arquivo</h2>
    <p class="meta">Traz para cá, de uma vez, a avaliação feita na planilha da matriz: respostas da elegibilidade, caminho na árvore, notas dos dois leitores, farol, vínculo com a ABDI 5.0 e evidências. As etapas 7 a 9 passam a mostrar o que a matriz calcula com essas respostas.</p>
    ${av?`<p class="nota ok espaco-p">Avaliação em uso: ${esc(av.titulo||"")}. ${esc(av.origem||"")}${av.importadoEm?". Importada em "+dataHora(av.importadoEm)+" por "+esc(av.importadoPor||"—"):""}. <a href="#/metodo">Ver o método</a></p>`:""}
    <div class="cmp espaco-p"><label for="aval-arq">Arquivo da avaliação (.json)</label><input id="aval-arq" type="file" accept=".json,application/json" data-muda="avalArquivo"></div>${previa}
    <div class="acoes"><button class="bt sec" data-acao="avalBaixar">Baixar a avaliação como está agora</button></div></section>`; }
ACOES.avalArquivo=async(d,el)=>{ const f=el.files&&el.files[0]; if(!f) return;
  try{ const arq=JSON.parse(await f.text());
    if(arq.formato!==FORMATO_AVAL||!arq.projetos||typeof arq.projetos!=="object") R.aval={erro:"O arquivo não é uma avaliação da matriz de priorização (formato não reconhecido)."};
    else R.aval={arq,nome:f.name}; }
  catch(e){ R.aval={erro:"Não foi possível ler o arquivo: ele precisa ser o .json da avaliação."}; }
  render(); };
ACOES.avalCancelar=()=>{ delete R.aval; render(); };
ACOES.avalGravar=async()=>{ const a=R.aval; if(!a||!a.arq) return; const em=new Date().toISOString(), arq=a.arq, origem=arq.origem||a.nome||"arquivo";
  const proj={}; for(const [code,novo] of Object.entries(arq.projetos)){ if(!S.base[code]) continue; const velho=S.est[code]||{}, e={...novo};
    if(velho.decisao) e.decisao=velho.decisao; if(velho.revisao) e.revisao=velho.revisao;
    e.log=[...(velho.log||[]),...(novo.log||[]),{em,por:quem(),etapa:1,oque:"Avaliação importada de arquivo. "+origem+"."}]; proj[code]=e; }
  const c=arq.ciclo||{}, ciclo={...S.ciclo,...(c.ciclo?{ciclo:c.ciclo}:{}),...(c.teto>0?{teto:c.teto,tetoFonte:c.tetoFonte||""}:{}),...(c.obs?{obs:c.obs}:{}),...(c.avaliacao?{avaliacao:{...c.avaliacao,importadoEm:em,importadoPor:quem()}}:{}),
    historico:[...(S.ciclo.historico||[]),{em,por:quem(),oque:"Avaliação importada de arquivo: "+Object.keys(proj).length+" projetos. "+origem+"."}]};
  a.andando="0 de "+Object.keys(proj).length; render();
  try{ await Dados.gravarAvaliacao(ciclo,proj,(k,n)=>{ a.andando=k+" de "+n; const s=document.querySelector("#avaliacao [role=status]"); if(s) s.textContent="Gravando: "+a.andando+"."; });
    S.ciclo=ciclo; Object.assign(S.est,proj); delete R.aval; R={}; aviso("Avaliação gravada: "+Object.keys(proj).length+" projetos"); ir("#/"); }
  catch(e){ console.error(e); a.andando=""; a.erro="A gravação parou no meio. Verifique a conexão e importe o arquivo de novo: gravar duas vezes não duplica nada."; delete a.arq; render(); } };
ACOES.avalBaixar=()=>{ const proj={}; projetos().forEach(c=>{ if(S.est[c.code]) proj[c.code]=S.est[c.code]; });
  const arq={formato:FORMATO_AVAL,origem:"Aplicação web da matriz de priorização, ciclo "+(S.ciclo.ciclo||"")+" ("+(S.modo==="demo"?"exemplo fictício":"banco com login")+")",geradoEm:new Date().toISOString().slice(0,10),ciclo:S.ciclo,projetos:proj};
  const el=document.createElement("a"); el.href=URL.createObjectURL(new Blob([JSON.stringify(arq,null,1)],{type:"application/json"})); el.download="avaliacao-"+(S.ciclo.ciclo||"ciclo")+"-"+arq.geradoEm+".json"; document.body.appendChild(el); el.click(); el.remove(); aviso("Arquivo baixado"); };

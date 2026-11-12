/* ===== Matriz de priorização da carteira · painel: a carteira em gráficos =====
   Leitura visual do que as etapas 3 a 7 produzem: funil das etapas, saídas sugeridas, linha do teto, valor e pedido,
   composição por missão e por eixo da ABDI 5.0, perfil das notas e análise de sensibilidade.
   Retoma, na versão final, o painel da Diretoria Executiva das versões 1 e 2 (curva do teto, valor e custo, composição, robustez).
   Nada aqui calcula regra: os números vêm de rec() (motor.js) e de sensibilidade3() (sensibilidade.js).
   Regras de desenho: uma cor por papel; a cor acompanha a entidade (a saída), nunca a posição; rótulo direto só onde cabe;
   toda marca tem dica ao passar o cursor e todo gráfico tem a tabela dos mesmos dados. Paleta conferida para daltonismo
   em pares vizinhos; onde a diferença é pequena, o rótulo e a legenda carregam a identidade. Fundo sempre branco. */
const COR_SAIDA={priorizar:"#008300",reformular:"#eda100",incorporar:"#2a78d6",orgao:"#e87ba4",manter:"#1baf7a",concluir:"#eb6834",caminho:"#9aa3b5"};
const TINTA_SAIDA={reformular:"#1D2433",orgao:"#1D2433",manter:"#1D2433",caminho:"#1D2433"};   /* texto dentro da faixa: escuro nas cores claras, branco nas demais */
const pMi=v=>"R$ "+sensDec((+v||0)/1e6,1)+" mi";
const pTip=t=>` data-tip="${esc(t)}" tabindex="0"`;
const pTabela=(cab,linhas,num)=>`<details class="p-dados"><summary>Ver os dados em tabela</summary><div class="rolavel"><table class="lista"><thead><tr>${cab.map((c,i)=>`<th${(num||[]).includes(i)?' class="n"':""}>${esc(c)}</th>`).join("")}</tr></thead><tbody>${linhas.map(l=>`<tr>${l.map((x,i)=>`<td${(num||[]).includes(i)?' class="n"':i===0?' class="pj"':""}>${i===0?`<b>${esc(x)}</b>`:esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`;
const pLegenda=itens=>`<ul class="p-leg">${itens.map(([cor,t,forma])=>`<li><i class="${forma||"q"}" style="--c:${cor}"></i>${esc(t)}</li>`).join("")}</ul>`;
/* barras horizontais de uma série só: [rótulo, valor, texto na ponta, dica] */
const pBarras=(L,cor)=>{ const mx=Math.max(1,...L.map(l=>l[1])); return `<div class="p-barras">${L.map(l=>`<div class="p-b"${pTip(l[3]||l[0]+": "+l[2])}><span class="r">${esc(l[0])}</span><span class="t"><i style="width:${(l[1]/mx*100).toFixed(2)}%;background:${cor}"></i><b>${esc(l[2])}</b></span></div>`).join("")}</div>`; };
/* faixa segmentada: [chave, rótulo, valor, texto]; o rótulo entra na faixa só quando cabe */
const pFaixa=(S_,fmt)=>{ const tot=S_.reduce((a,s)=>a+s[2],0)||1; return `<div class="p-faixa" role="img" aria-label="${esc(S_.filter(s=>s[2]>0).map(s=>s[1]+": "+fmt(s[2])).join("; "))}">${S_.filter(s=>s[2]>0).map(s=>{ const pc=s[2]/tot*100;
  return `<span style="flex:${s[2]} 1 0;background:${COR_SAIDA[s[0]]};color:${TINTA_SAIDA[s[0]]||"#fff"}"${pTip(s[1]+": "+fmt(s[2])+" ("+sensDec(pc,1)+"%)")}>${pc>=9?`<b>${esc(fmt(s[2]))}</b>`:""}</span>`; }).join("")}</div>`; };

function painelDados(){
  const P=projetos(), r=rec(), t=tetoAtual(), L=Object.fromEntries(r.linhas.map(l=>[l.code,l])), soma=somaPedidos();
  const A=sensibilidade3(P.map(c=>sensEntrada3(c,E(c.code))),{valor:t.valor,publicado:!!t.publicado,parte:t.parte||1},soma,REGUA3,sensParam());
  const f=P.map(c=>({c,e:E(c.code),f:fatos(c),l:L[c.code]||{}}));
  const aceito=x=>{ const p=x.e.porta||{}; return !!p.fechada&&p.mandato!=="não"&&!(p.repete==="sim"&&REGUA3.repeticaoTira)&&!(p.medicao==="não"&&!x.f.etiqueta); };
  const funil=[["Canvas cadastrados",f.length],["Canvas enviados",f.filter(x=>x.f.enviado).length],["Aceitos na elegibilidade",f.filter(aceito).length],
    ["Com resultado da árvore",f.filter(x=>aceito(x)&&x.f.arvore&&x.f.arvore!=="red").length],["Com as quatro notas e o farol",f.filter(x=>aceito(x)&&x.l.valor!=null&&x.l.farol).length],
    ["Sem pendência que tire do caminho",f.filter(x=>x.l.valor!=null&&x.l.farol&&!porta3(x.f)).length],["Disputam recurso novo",r.ordem.length],["Acima da linha do teto",r.linhas.filter(l=>l.dentro).length]];
  const saidas=[...SAIDAS.map(([k,n])=>[k,n,f.filter(x=>x.l.saida===k).length,f.filter(x=>x.l.saida===k).reduce((a,x)=>a+x.f.novos,0)]),["caminho","Ainda no caminho",f.filter(x=>!x.l.saida).length,f.filter(x=>!x.l.saida).reduce((a,x)=>a+x.f.novos,0)]];
  let ac=0; const fila=r.ordem.map((code,i)=>{ const x=f.find(y=>y.c.code===code); ac+=x.f.novos; return {code,nome:x.c.nome,novos:x.f.novos,acum:ac,valor:x.l.valor,dentro:!!x.l.dentro,pos:i+1,fronteira:!!x.l.fronteira,farol:x.l.farol}; });
  const pontos=f.filter(x=>x.l.valor!=null).map(x=>({code:x.c.code,nome:x.c.nome,novos:x.f.novos,valor:x.l.valor,dentro:!!x.l.dentro,saida:x.l.saida,farol:x.l.farol}));
  const mis=Object.keys(MISSOES).map(m=>{ const xs=f.filter(x=>missaoDe(x.c)===m); return {m,nome:MISSOES[m],n:xs.length,pri:xs.filter(x=>x.l.saida==="priorizar").length,rsPri:xs.filter(x=>x.l.saida==="priorizar").reduce((a,x)=>a+x.f.novos,0),rs:xs.reduce((a,x)=>a+x.f.novos,0)}; }).filter(o=>o.n);
  const eixos=ABDI_EIXOS.map((n,i)=>{ const xs=f.filter(x=>{ const v=abdiDe(x.c); return v.eixos&&v.eixos[i]; }); return {nome:n,n:xs.length,pri:xs.filter(x=>x.l.saida==="priorizar").length}; });
  const comNotas=f.map(x=>notasDe(x.c)).filter(n=>n.completo&&n.A!=null), casas=[1,1.5,2,2.5,3,3.5,4,4.5,5];
  const notas=[["A","Aderência à missão"],["R","Resultados medidos"],["E","Escala e articulação"],["I","Indústria 5.0"]].map(([k,n])=>({k,nome:n,media:comNotas.length?comNotas.reduce((a,x)=>a+x[k],0)/comNotas.length:null,casas:casas.map(v=>[v,comNotas.filter(x=>Math.abs(x[k]-v)<0.01).length])}));
  return {P,r,t,soma,A,funil,saidas,fila,pontos,mis,eixos,notas,nNotas:comNotas.length,semAbdi:f.filter(x=>!abdiDe(x.c).eixos).length,alertas:r.linhas.filter(l=>l.alerta).length}; }

/* linha do teto: os pedidos em fila, na ordem do valor, contra os quatro tetos */
function pTrilha(D){
  const mx=Math.max(D.fila.length?D.fila[D.fila.length-1].acum:0,...D.A.tetos.map(x=>x.valor))||1, pc=v=>(v/mx*100).toFixed(3);
  return `<div class="p-trilha"><div class="p-tetos">${D.A.tetos.map((x,i)=>`<span class="p-teto${x.valor/mx>0.86?" esq":""}" style="left:${pc(x.valor)}%"${pTip(x.nome+": "+brl(x.valor)+". Acima da linha: "+x.acima+" de "+D.A.nBase+".")}><em>${esc(x.nome.replace("Teto da régua: ","").replace("Teto livre: ","").replace(" dos pedidos",""))}</em></span>`).join("")}</div>
    <div class="p-fila">${D.fila.map(x=>`<span class="${x.dentro?"dentro":"fora"}" style="width:${pc(x.novos)}%"${pTip(x.pos+"º · "+x.code+" "+x.nome+"\nValor "+nf(x.valor)+" · pedido "+brl(x.novos)+"\nAcumulado "+brl(x.acum)+(x.dentro?" · acima da linha":" · abaixo da linha")+(x.fronteira?" · caso de fronteira":""))}>${x.novos/mx>0.045?`<b>${esc(x.code)}</b>`:""}</span>`).join("")}</div>
    <div class="p-eixo"><span>R$ 0</span><span>${esc(pMi(mx))}</span></div></div>`; }

/* valor e pedido: um ponto por projeto com valor calculado */
function pDispersao(D){
  const W=720,H=336,ml=44,mr=16,mt=30,mb=40, mx=Math.max(1e6,...D.pontos.map(p=>p.novos))*1.06, X=v=>ml+v/mx*(W-ml-mr), Y=v=>mt+(5-v)/4*(H-mt-mb);
  const passo=mx>12e6?5e6:mx>5e6?2e6:1e6, tx=[]; for(let v=0;v<=mx;v+=passo) tx.push(v);
  const rot=new Set(); const add=p=>p&&rot.add(p.code); const ord=[...D.pontos];
  add(ord.sort((a,b)=>b.novos-a.novos)[0]); add(ord.sort((a,b)=>b.valor-a.valor)[0]); add(ord.sort((a,b)=>a.valor-b.valor)[0]);
  const corte=D.r.corte;
  return `<div class="rolavel"><svg class="p-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Valor e pedido de recurso novo de cada projeto">
    ${[1,2,3,4,5].map(v=>`<line x1="${ml}" x2="${W-mr}" y1="${Y(v)}" y2="${Y(v)}" class="g"/><text x="${ml-8}" y="${Y(v)+4}" text-anchor="end" class="e">${v}</text>`).join("")}
    ${tx.map(v=>`<text x="${X(v)}" y="${H-mb+18}" text-anchor="middle" class="e">${v/1e6}</text>`).join("")}
    <text x="${(ml+W-mr)/2}" y="${H-6}" text-anchor="middle" class="e">Pedido de recurso novo, em milhões de reais</text><text x="8" y="12" class="e">Valor do projeto, de 1 a 5</text>
    ${corte!=null?`<line x1="${ml}" x2="${W-mr}" y1="${Y(corte)}" y2="${Y(corte)}" class="ref"/><text x="${W-mr}" y="${Y(corte)-6}" text-anchor="end" class="e">Valor do último projeto que cabe: ${nf(corte)}</text>`:""}
    ${D.pontos.map(p=>`<circle cx="${X(p.novos).toFixed(1)}" cy="${Y(p.valor).toFixed(1)}" r="6" fill="${p.dentro?COR_SAIDA.priorizar:COR_SAIDA.caminho}" class="pt"${pTip(p.code+" "+p.nome+"\nValor "+nf(p.valor)+" · pedido "+(p.novos>0?brl(p.novos):"não há")+"\n"+(p.saida?"Sugestão: "+rotSaida(p.saida).toLowerCase():"Ainda no caminho"))}/>`).join("")}
    ${D.pontos.filter(p=>rot.has(p.code)).map(p=>`<text x="${X(p.novos)+(X(p.novos)>W-120?-10:10)}" y="${Y(p.valor)+4}" text-anchor="${X(p.novos)>W-120?"end":"start"}" class="d">${esc(p.code)}</text>`).join("")}</svg></div>`; }

/* correlação da ordem de cada cenário com a ordem da base */
function pCorrelacao(D){
  const C=D.A.cenarios.slice(1,27).filter(c=>c.corr!=null), W=720,H=220,ml=44,mr=16,mt=14,mb=46; if(!C.length) return "";
  const mn=Math.min(0.8,Math.floor(Math.min(...C.map(c=>c.corr))*20)/20), X=i=>ml+(i+0.5)/C.length*(W-ml-mr), Y=v=>mt+(1-v)/(1-mn)*(H-mt-mb), ticks=[]; for(let v=1;v>=mn-1e-9;v-=0.05) ticks.push(Math.round(v*100)/100);
  const grupos=[]; C.forEach((c,i)=>{ const g=grupos[grupos.length-1]; if(g&&g.t===c.grupo) g.ate=i; else grupos.push({t:c.grupo,de:i,ate:i}); });
  const menor=C.reduce((a,c)=>c.corr<a.corr?c:a,C[0]);
  return `<div class="rolavel"><svg class="p-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Correlação entre a ordem de cada cenário e a ordem da base">
    ${ticks.map(v=>`<line x1="${ml}" x2="${W-mr}" y1="${Y(v)}" y2="${Y(v)}" class="g"/><text x="${ml-8}" y="${Y(v)+4}" text-anchor="end" class="e">${nf(v,2)}</text>`).join("")}
    ${grupos.map(g=>`<line x1="${X(g.de)-10}" x2="${X(g.ate)+10}" y1="${H-mb+10}" y2="${H-mb+10}" class="ch"/><text x="${(X(g.de)+X(g.ate))/2}" y="${H-mb+26}" text-anchor="middle" class="e">${esc(g.t.replace("Um peso por vez, variação pequena","Um peso por vez, ±"+D.A.param.peq).replace("Um peso por vez, variação maior","Um peso por vez, ±"+D.A.param.maior).replace("Pesos: outros arranjos","Outros pesos"))}</text>`).join("")}
    ${C.map((c,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(c.corr).toFixed(1)}" r="5" fill="#183EFF" class="pt"${pTip("Cenário "+c.n+": "+c.nome+"\nCorrelação com a ordem da base: "+nf(c.corr,2)+"\nMudam de posição: "+c.mudam+" de "+c.disputa+" · maior deslocamento: "+c.desloc)}/>`).join("")}
    <text x="${X(C.indexOf(menor))+9}" y="${Y(menor.corr)+4}" class="d">${esc(menor.nome)}: ${nf(menor.corr,2)}</text></svg></div>`; }

/* faixa de posições de um projeto nos cenários: linha fina (2 a 25), barra (2 a 17) e ponto (base) */
function pFaixaPos(o,n){ const W=220,H=22,X=p=>8+(p-1)/Math.max(1,n-1)*(W-16);
  return `<svg class="p-pos" viewBox="0 0 ${W} ${H}" role="img" aria-label="Posição ${o.pos} na base; de ${o.melhor25} a ${o.pior25} nos cenários"><line x1="8" x2="${W-8}" y1="11" y2="11" class="g"/>
    <line x1="${X(o.melhor25)}" x2="${X(o.pior25)}" y1="11" y2="11" class="larga"/><line x1="${X(o.melhor17)}" x2="${X(o.pior17)}" y1="11" y2="11" class="estreita"/><circle cx="${X(o.pos)}" cy="11" r="5" class="base"/></svg>`; }

function vPainel(M){
  const D=painelDados(), A=D.A, n=D.P.length, av=S.ciclo.avaliacao, julg=A.projetos.filter(o=>o.julg==="Sim").length, usado=D.r.usado;
  const cls=l=>l==="Muda de lado"?"res-par":l==="Acima em todos"?"res-pri":l==="Abaixo em todos"?"res-lar":"res-nada";
  const bloco=(id,tit,sub,corpo)=>`<section class="bloco p-bloco" id="p-${id}"><h2>${esc(tit)}</h2><p class="meta">${sub}</p>${corpo}</section>`;
  M.innerHTML=`<header><p class="passo"><a href="#/">Início</a></p><h1>Painel da carteira</h1>
    <p class="frase">A carteira em gráficos: onde os projetos estão, o que a matriz sugere, até onde o dinheiro alcança e quanto a lista depende dos pesos, de quem lê e do teto.</p></header>
   ${av?`<p class="nota at faixa-aval"><b>${esc(av.titulo||"Avaliação da carteira")}.</b> As notas são da leitura preliminar da equipe: enquanto não forem validadas, os gráficos valem como teste do instrumento. <a href="#/metodo">Como a avaliação foi feita</a></p>`:""}
   <div class="p-cartoes espaco">
     <div><b>${n}</b><span>projetos na carteira</span></div><div><b>${esc(pMi(D.soma))}</b><span>pedidos de recurso novo</span></div>
     <div><b>${A.nBase}</b><span>disputam recurso novo: ${esc(pMi(A.pedidos))}</span></div><div><b>${esc(pMi(D.t.valor-usado))}</b><span>saldo do teto (${esc(D.t.publicado?"teto publicado":Math.round((D.t.parte||1)*100)+"% dos pedidos")})</span></div>
     <div><b>${julg} de ${A.nBase}</b><span>pedem julgamento adicional</span></div></div>
   <div class="p-grade">
   ${bloco("funil","Do Canvas à linha do teto","Quantos projetos chegam a cada ponto do caminho.",pBarras(D.funil.map(([t,v])=>[t,v,String(v),t+": "+v+" de "+n+" projetos"]),"#183EFF")+pTabela(["Ponto do caminho","Projetos"],D.funil.map(([t,v])=>[t,v]),[1]))}
   ${bloco("saidas","Saídas sugeridas","Cada projeto recebe uma saída. Em cima, por número de projetos; embaixo, por recurso novo pedido."+(D.alertas?` ${D.alertas} ${D.alertas===1?"segue":"seguem"} com alerta de repetição de entrega.`:""),
     `<p class="p-rot">Projetos</p>${pFaixa(D.saidas.map(s=>[s[0],s[1],s[2]]),v=>String(v))}<p class="p-rot">Recurso novo pedido</p>${pFaixa(D.saidas.map(s=>[s[0],s[1],s[3]]),pMi)}${pLegenda(D.saidas.filter(s=>s[2]>0).map(s=>[COR_SAIDA[s[0]],s[1]+" ("+s[2]+")"]))}`
     +pTabela(["Saída","Projetos","Recurso novo pedido"],D.saidas.map(s=>[s[1],s[2],brl(s[3])]),[1,2]))}
   </div>
   ${bloco("teto","A linha do teto","Os projetos que disputam recurso novo, em fila, do maior valor para o menor. A largura de cada um é o pedido. As marcas mostram onde cada teto corta a fila: depois do primeiro que não cabe, ninguém entra.",
     D.fila.length?pTrilha(D)+pLegenda([[COR_SAIDA.priorizar,"Acima da linha, no teto em vigor"],[COR_SAIDA.caminho,"Abaixo da linha"],["#1D2433","Teto simulado","marca"]])
      +pTabela(["Ordem","Projeto","Valor","Pedido","Acumulado","Posição em relação à linha"],D.fila.map(x=>[x.pos+"º",x.code+" "+x.nome,nf(x.valor),brl(x.novos),brl(x.acum),x.dentro?"Acima da linha":"Abaixo da linha"]),[2,3,4])
      :`<p class="nota at espaco-p">Nenhum projeto disputa recurso novo ainda.</p>`)}
   <div class="p-grade">
   ${bloco("valor","Valor e pedido","Cada ponto é um projeto com as quatro notas. Para cima, mais valor; para a direita, pedido maior.",
     D.pontos.length?pDispersao(D)+pLegenda([[COR_SAIDA.priorizar,"Acima da linha do teto","ponto"],[COR_SAIDA.caminho,"Demais projetos com valor","ponto"]])
      +pTabela(["Projeto","Valor","Pedido","Sugestão"],[...D.pontos].sort((a,b)=>b.valor-a.valor).map(p=>[p.code+" "+p.nome,nf(p.valor),brl(p.novos),p.saida?rotSaida(p.saida):"Ainda no caminho"]),[1,2]):`<p class="nota at espaco-p">Nenhum projeto com valor calculado ainda.</p>`)}
   ${bloco("notas","Perfil das notas",`Quantos projetos têm cada nota final, entre os ${D.nNotas} com as quatro notas. A aderência vem da árvore: só vale 1, 3 ou 5.`,
     `<div class="p-multi">${D.notas.map(o=>{ const mx=Math.max(1,...D.notas.flatMap(x=>x.casas.map(c=>c[1]))); return `<div><h3>${esc(o.nome)}</h3><p class="meta">Média ${nf(o.media,2)}</p><div class="p-col">${o.casas.map(([v,q])=>`<span${pTip(o.nome+", nota "+nf(v,1)+": "+q+(q===1?" projeto":" projetos"))}><b>${q||""}</b><i style="height:${(q/mx*100).toFixed(1)}%"></i><em>${Number.isInteger(v)?v:""}</em></span>`).join("")}</div></div>`; }).join("")}</div>`
     +pTabela(["Nota",...D.notas[0].casas.map(c=>nf(c[0],1)),"Média"],D.notas.map(o=>[o.nome,...o.casas.map(c=>c[1]),nf(o.media,2)]),[1,2,3,4,5,6,7,8,9,10]))}
   </div>
   <div class="p-grade">
   ${bloco("missao","Recurso novo por missão avaliada","Pedidos de cada missão: a parte com sugestão de priorizar e o restante.",
     (()=>{ const mx=Math.max(1,...D.mis.map(o=>o.rs)); return `<div class="p-barras longo">${D.mis.map(o=>`<div class="p-b"><span class="r">${esc(o.nome)}</span><span class="t"><i style="width:${(o.rsPri/mx*100).toFixed(2)}%;background:${COR_SAIDA.priorizar}"${pTip(o.nome+": "+brl(o.rsPri)+" com sugestão de priorizar ("+o.pri+" de "+o.n+" projetos)")}></i><i class="resto" style="width:${((o.rs-o.rsPri)/mx*100).toFixed(2)}%;background:${COR_SAIDA.caminho}"${pTip(o.nome+": "+brl(o.rs-o.rsPri)+" em pedidos sem sugestão de priorizar")}></i><b>${o.pri} de ${o.n} · ${esc(pMi(o.rsPri))}</b></span></div>`).join("")}</div>`; })()
     +pLegenda([[COR_SAIDA.priorizar,"Com sugestão de priorizar"],[COR_SAIDA.caminho,"Demais pedidos"]])+pTabela(["Missão avaliada","Projetos","Com sugestão de priorizar","Recurso com sugestão de priorizar","Recurso pedido"],D.mis.map(o=>[o.nome,o.n,o.pri,brl(o.rsPri),brl(o.rs)]),[1,2,3,4]))}
   ${bloco("abdi","Vínculo com a ABDI 5.0","Projetos que contribuem por cada eixo. Um projeto pode contribuir por mais de um."+(D.semAbdi?` ${D.semAbdi} ainda sem vínculo definido.`:""),
     pBarras(D.eixos.map(o=>[o.nome,o.n,o.n+" de "+n,o.nome+": "+o.n+" de "+n+" projetos; "+o.pri+" com sugestão de priorizar"]),"#183EFF")+pTabela(["Eixo","Projetos com vínculo","Com sugestão de priorizar"],D.eixos.map(o=>[o.nome,o.n,o.pri]),[1,2]))}
   </div>
   ${A.nBase?bloco("sens","Análise de sensibilidade: quem é estável e quem pede julgamento adicional",`Posição de cada projeto na fila quando mudam os pesos e quem lê, e de que lado da linha ele fica em quatro tetos, nos ${A.nCont} cenários. <a href="#/sensibilidade">Abrir a análise completa</a>`,
     `<div class="rolavel"><table class="lista p-sens"><thead><tr><th>Projeto</th><th>Posição na fila: 1ª à esquerda, ${A.nBase}ª à direita</th>${A.tetos.map(x=>`<th>${esc(x.nome)}</th>`).join("")}<th>Julgamento adicional?</th></tr></thead>
       <tbody>${A.projetos.filter(o=>o.naDisputa).map(o=>`<tr><td class="pj"><a href="#/projeto/${encodeURIComponent(o.code)}"><b>${esc(o.code)}</b></a>${esc(o.nome)}</td>
         <td${pTip(o.code+": "+o.pos+"ª na base\nCom pequenas alterações de peso: da "+o.melhor17+"ª à "+o.pior17+"ª\nEm todos os cenários de pesos e de leitores: da "+o.melhor25+"ª à "+o.pior25+"ª")}>${pFaixaPos(o,A.nBase)}</td>
         ${o.leitura.map((x,k)=>`<td><span class="tag ${cls(x)}"${pTip(o.code+", "+A.tetos[k].nome+": acima da linha em "+o.acima[k]+" de "+A.nCont+" cenários")}>${o.acima[k]} de ${A.nCont}</span></td>`).join("")}
         <td>${o.julg==="Sim"?`<span class="tag res-par">Sim</span>`:`<span class="tag res-ade">Não</span>`}</td></tr>`).join("")}</tbody></table></div>
      ${pLegenda([["#183EFF","Posição na base","ponto"],["#B8C6FF","Faixa com pequenas alterações de peso (cenários 2 a 17)","barra"],["#9aa3b5","Faixa em todos os cenários de pesos e de leitores (2 a "+A.nCont+")","linha"]])}
      ${pLegenda([["var(--res-pri)","Acima da linha em todos os cenários"],["var(--res-par)","Muda de lado conforme o cenário"],["var(--res-lar)","Abaixo da linha em todos"]])}
      <h3 class="espaco">A ordem resiste à mudança de pesos e de leitor?</h3><p class="meta">Correlação entre a ordem de cada cenário e a ordem da base. Quanto mais perto de 1, menos a lista muda.</p>${pCorrelacao(D)}
      ${pTabela(["Cenário","Grupo","Mudam de posição","Maior deslocamento","Correlação com a base"],A.cenarios.slice(1,27).map(c=>[c.n+". "+c.nome,c.grupo,c.mudam,c.desloc,c.corr==null?"—":nf(c.corr,2)]),[2,3,4])}
      <dl class="gloss espaco">${A.frases.map(f=>`<dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd>`).join("")}</dl>`):""}
   <div class="acoes"><a class="bt" href="#/etapa/7">Ver a lista da etapa 7</a><a class="bt sec" href="#/sensibilidade">Análise de sensibilidade completa</a><a class="bt sec" href="#/etapa/8">Decisão da Diretoria Executiva</a></div>`; }

/* dica ao passar o cursor ou focar uma marca */
(function(){ let el=null; const some=()=>{ if(el) el.hidden=true; };
  const mostra=(alvo,x,y)=>{ if(!el){ el=document.createElement("div"); el.className="p-dica"; el.setAttribute("role","tooltip"); document.body.appendChild(el); }
    el.textContent=alvo.dataset.tip; el.hidden=false; const w=el.offsetWidth, h=el.offsetHeight; el.style.left=Math.max(8,Math.min(window.innerWidth-w-8,x+14))+"px"; el.style.top=(y+18+h>window.innerHeight?y-h-12:y+18)+"px"; };
  document.addEventListener("mousemove",ev=>{ const a=ev.target.closest&&ev.target.closest("[data-tip]"); if(a) mostra(a,ev.clientX,ev.clientY); else some(); });
  document.addEventListener("focusin",ev=>{ const a=ev.target.closest&&ev.target.closest("[data-tip]"); if(a){ const r=a.getBoundingClientRect(); mostra(a,r.left+r.width/2,r.bottom-10); } });
  document.addEventListener("focusout",some); window.addEventListener("scroll",some,{passive:true}); window.addEventListener("hashchange",some); })();

/* ===== Matriz de priorização da carteira · análise de sensibilidade da lista (etapa 7) =====
   Reproduz a aba "7c Sensibilidade" da planilha "Matriz de Priorização ABDI 2027", versão 0.7.
   Pergunta que responde (Plano de Trabalho, Bloco 3): pequenas alterações de peso produzem mudanças
   relevantes na ordenação? Cada cenário muda uma coisa de cada vez em relação à régua em vigor:
   o peso de uma nota, as notas usadas (quem lê) ou a aderência mínima. Para cada cenário, a lista é
   refeita e comparada com a base, em quatro tetos.
   Funções puras: não leem a tela nem o banco. Testado contra os números da planilha em testes/v40-avaliacao.js
   e, na tela, em testes/v40-tela.js. Depende de motor.js (REGUA3 e funções do percurso). */

if(typeof module!=="undefined"&&module.exports&&typeof REGUA3==="undefined") Object.assign(globalThis,require("./motor.js"));   /* fora do navegador (testes) */

/* parâmetros de partida (valores da equipe, a combinar com a Agência) */
const SENS3={
  peq:5,            /* variação pequena do peso, em pontos percentuais (cenários 2 a 9) */
  maior:10,         /* variação maior do peso (cenários 10 a 17) */
  relevante:3,      /* mudança de posição que conta como relevante, com pequenas alterações de peso */
  contam:25,        /* cenários 1 a 25 entram na contagem: neles, os mesmos projetos disputam o recurso novo */
  partes:[0.85,0.7,0.5],   /* tetos simulados 2, 3 e 4, como parte da soma dos pedidos; o quarto é o teto livre */
  livre:{pesos:[25,25,25,25],notas:"finais",aderMin:null}   /* cenário 28: livre */
};
const SENS_NOTAS={finais:"Finais",L1:"Leitor 1",L2:"Leitor 2",min:"Menor dos dois",max:"Maior dos dois"};
const SENS_NOMES=["aderência","resultados medidos","escala e articulação","Indústria 5.0"];
const SENS_ART=["O peso da aderência","O peso dos resultados medidos","O peso de escala e articulação","O peso de Indústria 5.0"];
const SENS_ROT=["Aderência","Resultados medidos","Escala e articulação","Indústria 5.0"];
const sensDec=(v,casas)=>{ const m=Math.pow(10,casas), x=Math.round(Math.abs(v)*m); return (v<0?"-":"")+Math.floor(x/m)+","+String(x%m).padStart(casas,"0"); };   /* 0,95 · 60,9 */
const sensPct=v=>String(Math.round(v*100));

/* os 28 cenários, na ordem da planilha */
function sensCenarios3(R=REGUA3,P=SENS3){
  const C=[], um=(i,d)=>{ const w=[0,0,0,0].map((_,k)=>k===i?25+d:(75-d)/3); return w; };
  C.push({nome:"Base: pesos iguais",grupo:"Base",notas:"finais",pesos:[25,25,25,25],aderMin:R.aderenciaMin,
    testa:"A régua em vigor: quatro notas com o mesmo peso, notas finais dos dois leitores e aderência mínima das regras do ciclo. É a ordem da lista da etapa 7."});
  for(const [d,grupo] of [[P.peq,"Um peso por vez, variação pequena"],[P.maior,"Um peso por vez, variação maior"]])
    for(let i=0;i<4;i++) for(const sg of [1,-1])
      C.push({nome:SENS_ROT[i]+(sg>0?" +":" −")+d,grupo,notas:"finais",pesos:um(i,sg*d),aderMin:R.aderenciaMin,
        testa:SENS_ART[i]+" passa de 25 para "+(25+sg*d)+"; as outras três notas dividem o resto por igual."});
  const t3=100/3;
  C.push({nome:"Sem a nota Indústria 5.0",grupo:"Pesos: outros arranjos",notas:"finais",pesos:[t3,t3,t3,0],aderMin:R.aderenciaMin,testa:"A nota Indústria 5.0 sai do valor; as outras três pesam o mesmo. Mostra quanto a ordem depende dessa nota."});
  C.push({nome:"Sem a nota de aderência",grupo:"Pesos: outros arranjos",notas:"finais",pesos:[0,t3,t3,t3],aderMin:R.aderenciaMin,testa:"A nota de aderência sai do valor; ficam as três notas dos leitores. A aderência mínima continua valendo como condição de entrada."});
  C.push({nome:"Aderência com peso em dobro",grupo:"Pesos: outros arranjos",notas:"finais",pesos:[40,20,20,20],aderMin:R.aderenciaMin,testa:"A aderência pesa 40, o dobro de cada uma das outras três notas."});
  C.push({nome:"Resultados medidos com peso em dobro",grupo:"Pesos: outros arranjos",notas:"finais",pesos:[20,40,20,20],aderMin:R.aderenciaMin,testa:"Os resultados medidos pesam 40, o dobro de cada uma das outras três notas."});
  C.push({nome:"Só o leitor 1",grupo:"Quem lê",notas:"L1",pesos:[25,25,25,25],aderMin:R.aderenciaMin,testa:"Usa só as notas do leitor 1, sem média e sem conciliação. Pesos da régua."});
  C.push({nome:"Só o leitor 2",grupo:"Quem lê",notas:"L2",pesos:[25,25,25,25],aderMin:R.aderenciaMin,testa:"Usa só as notas do leitor 2, sem média e sem conciliação. Pesos da régua."});
  C.push({nome:"Menor nota dos dois leitores",grupo:"Quem lê",notas:"min",pesos:[25,25,25,25],aderMin:R.aderenciaMin,testa:"Em cada nota, vale a menor das duas leituras: a leitura mais exigente."});
  C.push({nome:"Maior nota dos dois leitores",grupo:"Quem lê",notas:"max",pesos:[25,25,25,25],aderMin:R.aderenciaMin,testa:"Em cada nota, vale a maior das duas leituras: a leitura mais favorável."});
  C.push({nome:"Aderência mínima "+R.arvore.par,grupo:"Régua",notas:"finais",pesos:[25,25,25,25],aderMin:R.arvore.par,testa:"A aderência mínima cai para a nota do projeto parcial: ele deixa de sair como reformular e entra na disputa. Muda quem disputa, e por isso fica fora da contagem."});
  C.push({nome:"Aderência mínima "+R.arvore.pri,grupo:"Régua",notas:"finais",pesos:[25,25,25,25],aderMin:R.arvore.pri,testa:"A aderência mínima sobe para a nota do aderente prioritário: só ele disputa o recurso novo. Muda quem disputa, e por isso fica fora da contagem."});
  const L=P.livre||{};
  C.push({nome:"Cenário livre",grupo:"Livre",notas:SENS_NOTAS[L.notas]?L.notas:"finais",pesos:(L.pesos||[25,25,25,25]).map(x=>Math.max(0,+x||0)),aderMin:L.aderMin==null||L.aderMin===""?R.aderenciaMin:+L.aderMin,livre:true,
    testa:"Digite os pesos (qualquer número a partir de zero: a conta divide pela soma), escolha as notas usadas e a aderência mínima."});
  return C.map((c,i)=>({n:i+1,...c,soma:c.pesos.reduce((a,x)=>a+x,0)})); }

/* o que a análise usa de cada projeto. c: {code, nome, novos}; est: percurso gravado. */
function sensEntrada3(c,est,R=REGUA3){
  const e=est||{}, f=fatos3(c,e,R), n=notas3(e,R), L=e.leituras||{}, pr=porta3(f,R), v=valor3(f.notas,R), fr=farol3(f.exq,R);
  const pronto=!pr&&v!=null&&fr!=null;
  /* também é candidato quem só saiu como reformular por aderência abaixo da mínima: entra na disputa se a régua mudar */
  const soAderencia=!!pr&&pr.saida==="reformular"&&f.medicao!==false&&n.A!=null&&f.dano!==true&&v!=null&&fr!=null&&!(pr.motivo||"").includes("Não se insere");
  const lei=l=>l&&[l.R,l.E,l.I].every(x=>+x>=1&&+x<=5)?{R:+l.R,E:+l.E,I:+l.I}:null;
  const fin={R:n.R!=null?n.R:0,E:n.E!=null?n.E:0,I:n.I!=null?n.I:0}, l1=lei(L.L1), l2=lei(L.L2);
  const par=(a,b,fn)=>({R:fn(a.R,b.R),E:fn(a.E,b.E),I:fn(a.I,b.I)});
  return {code:c.code,nome:c.nome||c.code,novos:+c.novos||0,etiqueta:f.etiqueta,novo:f.novo,A:n.A,farol:fr,andando:andando3(f.exq,R),
    candidato:(+c.novos||0)>0&&(pronto||soAderencia),naBase:(+c.novos||0)>0&&pronto,
    notas:{finais:fin,L1:l1||fin,L2:l2||fin,min:l1&&l2?par(l1,l2,Math.min):fin,max:l1&&l2?par(l1,l2,Math.max):fin},duas:!!(l1&&l2),l1,l2}; }

/* correlação entre duas listas de posições (só entre quem está nas duas) */
function sensCorr3(a,b){
  const P=a.map((x,i)=>[x,b[i]]).filter(([x,y])=>x>0&&y>0), n=P.length; if(n<3) return null;
  const sx=P.reduce((s,p)=>s+p[0],0), sy=P.reduce((s,p)=>s+p[1],0), sxx=P.reduce((s,p)=>s+p[0]*p[0],0), syy=P.reduce((s,p)=>s+p[1]*p[1],0), sxy=P.reduce((s,p)=>s+p[0]*p[1],0);
  const vx=n*sxx-sx*sx, vy=n*syy-sy*sy; return vx===0||vy===0?null:(n*sxy-sx*sy)/Math.sqrt(vx*vy); }

/* A análise inteira.
   entradas: lista de sensEntrada3; teto: {valor, publicado, parte} da régua em vigor (etapa 7); somaPedidos: soma de todos os pedidos da carteira. */
function sensibilidade3(entradas,teto,somaPedidos,R=REGUA3,P=SENS3){
  const E=entradas, C=sensCenarios3(R,P), N=E.length, eps=1e-6;
  const antes=(a,b,va,vb)=>va>vb||(va===vb&&(a.novos<b.novos||(a.novos===b.novos&&String(a.code).localeCompare(String(b.code))<0)));   /* a vem antes de b na fila */
  /* por cenário: valor de cada projeto (-1 = fora da disputa), posição (0 = fora) e acumulado até ele */
  const val=[], pos=[], acum=[];
  for(const c of C){
    const v=E.map(x=>{ if(!x.candidato||!(c.soma>0)) return -1; if(!(x.etiqueta||(x.A!=null&&x.A>=c.aderMin))) return -1;
      const nt=x.notas[c.notas]; return Math.round((c.pesos[0]*(x.A||0)+c.pesos[1]*nt.R+c.pesos[2]*nt.E+c.pesos[3]*nt.I)/c.soma*R.fator*1e6)/1e6; });
    const nTag=E.filter((x,i)=>v[i]>=0&&x.etiqueta).length, reserva=E.reduce((s,x,i)=>s+(v[i]>=0&&x.etiqueta?x.novos:0),0);
    const p=E.map((x,i)=>v[i]<0?0:(x.etiqueta?0:nTag)+E.filter((y,j)=>v[j]>=0&&!!y.etiqueta===!!x.etiqueta&&antes(y,x,v[j],v[i])).length+1);
    const a=E.map((x,i)=>v[i]<0?1e15:x.etiqueta?0:reserva+E.reduce((s,y,j)=>s+(v[j]>=0&&!y.etiqueta&&antes(y,x,v[j],v[i])?y.novos:0),0)+x.novos);
    val.push(v); pos.push(p); acum.push(a); }
  /* os quatro tetos */
  const T=[{nome:teto.publicado?"Teto publicado nas regras do ciclo":"Teto da régua: "+sensPct(teto.parte)+"% dos pedidos",parte:teto.publicado?(somaPedidos>0?teto.valor/somaPedidos:0):teto.parte,valor:teto.valor,
            press:"É o teto em vigor nas regras do ciclo. Sem teto publicado, vale a parte dos pedidos definida lá."},
    ...P.partes.map((pt,k)=>({nome:(k===2?"Teto livre: ":"")+sensPct(pt)+"% dos pedidos",parte:pt,valor:pt*somaPedidos,livre:k===2,
            press:k===2?"Hipótese livre: troque a porcentagem para testar outro teto.":"Hipótese: o recurso novo cobre "+sensPct(pt)+"% da soma dos pedidos."}))];
  const dentro=(ci,ti,i)=>acum[ci][i]<=T[ti].valor+eps;
  const nCont=Math.min(P.contam,C.length);
  /* tabela de cenários */
  const cen=C.map((c,ci)=>{ const emAmbos=E.map((_,i)=>pos[0][i]>0&&pos[ci][i]>0);
    return {...c,disputa:val[ci].filter(x=>x>=0).length,
      mudam:E.filter((_,i)=>emAmbos[i]&&pos[0][i]!==pos[ci][i]).length,
      desloc:E.reduce((m,_,i)=>emAmbos[i]?Math.max(m,Math.abs(pos[0][i]-pos[ci][i])):m,0),
      corr:sensCorr3(pos[0],pos[ci]),
      acima:T.map((_,ti)=>E.filter((_,i)=>dentro(ci,ti,i)).length),
      lado:T.map((_,ti)=>E.filter((_,i)=>dentro(ci,ti,i)!==dentro(0,ti,i)).length)}; });
  /* tabela de projetos, na ordem da lista da base */
  const proj=E.map((x,i)=>{ const p0=pos[0][i], naDisputa=p0>0, faixa=(de,ate)=>pos.slice(de-1,ate).map(p=>p[i]);
    const f17=faixa(2,17), f25=faixa(2,25), o={code:x.code,nome:x.nome,novos:x.novos,valor:val[0][i]>=0?val[0][i]:null,pos:p0,naDisputa,posCen:pos.map(p=>p[i]),entra26:pos[25]?pos[25][i]>0:false,fica27:pos[26]?pos[26][i]>0:false};
    if(!naDisputa){ o.julg="—"; o.leitura=T.map(()=>"Fora da disputa");
      o.porque=o.entra26?"Fora da disputa na régua em vigor: só entra se a aderência mínima cair (cenário 26).":"Fora da disputa pelo recurso novo: os cenários 1 a 27 não mudam a situação do projeto."; return o; }
    o.melhor17=Math.min(...f17); o.pior17=Math.max(...f17); o.desl17=Math.max(o.pior17-p0,p0-o.melhor17);
    o.melhor25=Math.min(...f25); o.pior25=Math.max(...f25); o.desl25=Math.max(o.pior25-p0,p0-o.melhor25);
    o.mudaEm=f25.filter(p=>p!==p0).length;
    o.acima=T.map((_,ti)=>{ let k=0; for(let ci=0;ci<nCont;ci++) if(dentro(ci,ti,i)) k++; return k; });
    o.leitura=o.acima.map(k=>k===nCont?"Acima em todos":k===0?"Abaixo em todos":"Muda de lado");
    const muda=o.leitura.map((l,ti)=>l==="Muda de lado"?T[ti].nome:null).filter(Boolean);
    o.julg=muda.length||o.desl17>=P.relevante?"Sim":"Não";
    o.porque=(muda.length?"Muda de lado da linha conforme o cenário em: "+muda.join("; ")+". ":"Lado da linha igual nos "+nCont+" cenários, em cada um dos quatro tetos. ")
      +(o.desl17===0?"Não muda de posição com pequenas alterações de peso.":"Com pequenas alterações de peso, desloca até "+o.desl17+(o.desl17===1?" posição":" posições")+(o.desl17>=P.relevante?" (relevante).":"."))
      +(o.fica27?"":" Sai da disputa se a aderência mínima subir (cenário 27).");
    return o; }).sort((a,b)=>(a.pos||1e9)-(b.pos||1e9)||String(a.code).localeCompare(String(b.code)));
  /* tetos simulados: a linha na base */
  const nBase=cen[0].disputa, porPos=k=>E.findIndex((_,i)=>pos[0][i]===k);
  const tetos=T.map((t,ti)=>{ const acima=cen[0].acima[ti], usado=E.reduce((s,x,i)=>s+(dentro(0,ti,i)?x.novos:0),0), ult=porPos(acima), prox=porPos(acima+1);
    return {...t,n:ti+1,acima,usado,saldo:t.valor-usado,corte:acima>0&&ult>=0?val[0][ult]:null,mudam:proj.filter(o=>o.naDisputa&&o.leitura[ti]==="Muda de lado").length,
      primeiro:acima>=nBase||prox<0?null:{code:E[prox].code,nome:E[prox].nome}}; });
  /* consistência entre os dois leitores */
  const duas=E.filter(x=>x.duas), leitores=["R","E","I"].map((k,q)=>{ const d=duas.map(x=>Math.abs(x.l1[k]-x.l2[k]));
    return {k,nota:SENS_ROT[q+1],n:duas.length,iguais:d.filter(x=>x===0).length,d1:d.filter(x=>x===1).length,d2:d.filter(x=>x>=R.divergencia).length,media:duas.length?d.reduce((a,x)=>a+x,0)/duas.length:null}; });
  const corrLeitores=sensCorr3(pos[21],pos[22]);
  /* o que a análise mostra, em frases */
  const peq=cen.slice(1,17), mn=Math.min(...peq.map(c=>c.mudam)), mx=Math.max(...peq.map(c=>c.mudam)), dmx=Math.max(...peq.map(c=>c.desloc)), cs=peq.map(c=>c.corr).filter(x=>x!=null);
  const pedidos=E.reduce((s,x,i)=>s+(val[0][i]>=0?x.novos:0),0), julg=proj.filter(o=>o.julg==="Sim").length;
  const frases=[
    ["Ordem da lista","Com pequenas alterações de peso (cenários 2 a 17: um peso por vez, "+P.peq+" e "+P.maior+" pontos percentuais para mais e para menos), mudam de posição de "+mn+" a "+mx+" dos "+nBase+" projetos na disputa, e nenhum se desloca mais de "+dmx+" posições."+(cs.length?" A correlação com a ordem da base fica entre "+sensDec(Math.min(...cs),2)+" e "+sensDec(Math.max(...cs),2)+".":"")],
    ["Linha do teto","Projetos que mudam de lado da linha em algum dos "+nCont+" cenários de pesos e de leitores: "+tetos[0].mudam+" com o teto em vigor ("+sensPct(tetos[0].parte)+"% da soma dos pedidos); "+tetos[1].mudam+" com "+sensPct(tetos[1].parte)+"%; "+tetos[2].mudam+" com "+sensPct(tetos[2].parte)+"%; "+tetos[3].mudam+" com o teto livre ("+sensPct(tetos[3].parte)+"%)."],
    ["Orçamento","Os "+nBase+" projetos na disputa pedem R$ "+sensDec(pedidos/1e6,1)+" milhões de recurso novo, "+sensDec(somaPedidos>0?100*pedidos/somaPedidos:0,1)+"% da soma de todos os pedidos (R$ "+sensDec(somaPedidos/1e6,1)+" milhões). Com teto igual ou maior que esse valor, a linha não corta nenhum projeto, e os pesos só mudam a ordem."],
    ["Quem lê","Com as notas de um leitor só, mudam de posição "+cen[21].mudam+" projetos (leitor 1) e "+cen[22].mudam+" (leitor 2)."+(corrLeitores!=null?" A ordem feita com as notas de um e a feita com as do outro têm correlação de "+sensDec(corrLeitores,2)+".":"")],
    ["Julgamento adicional","Pedem julgamento adicional "+julg+" dos "+nBase+" projetos na disputa: mudam de lado da linha em algum dos quatro tetos, ou se deslocam "+P.relevante+" posições ou mais com pequenas alterações de peso. A lista está na tabela de projetos."]];
  /* cenário em detalhe: a lista inteira de um cenário, em um teto */
  const detalhe=(nCen,nTeto)=>{ const ci=Math.min(Math.max(1,+nCen||1),C.length)-1, ti=Math.min(Math.max(1,+nTeto||1),T.length)-1;
    const ordem=E.map((x,i)=>({x,i})).filter(o=>pos[ci][o.i]>0).sort((a,b)=>pos[ci][a.i]-pos[ci][b.i]); let soma=0, livre=T[ti].valor, pulando=0;
    const linhas=ordem.map(({x,i},k)=>{ soma+=x.novos; const acima=dentro(ci,ti,i);
      const pula=x.etiqueta||x.novos<=livre+eps; if(pula){ livre-=x.novos; pulando++; }   /* entraria se a fila pulasse quem não cabe, em vez de parar nele */
      const saida=acima?(x.etiqueta?"priorizar":x.farol==="vermelho"?"reformular":"priorizar"):(x.novo?"reformular":x.andando?"manter":"concluir");
      return {ordem:k+1,code:x.code,nome:x.nome,acima,saida,novos:x.novos,acum:soma,valor:val[ci][i],valorBase:val[0][i]>=0?val[0][i]:null,posBase:pos[0][i],ganho:pos[0][i]?pos[0][i]-(k+1):null,farol:x.farol,pula}; });
    const nAcima=linhas.filter(l=>l.acima).length, usado=linhas.reduce((s,l)=>s+(l.acima?l.novos:0),0);
    return {cenario:cen[ci],teto:tetos[ti],linhas,acima:nAcima,abaixo:linhas.length-nAcima,usado,saldo:T[ti].valor-usado,pulando}; };
  return {param:P,tetos,leitores,corrLeitores,cenarios:cen,projetos:proj,frases,detalhe,nBase,nCont,pedidos,somaPedidos}; }

if(typeof module!=="undefined"&&module.exports) module.exports={SENS3,SENS_NOTAS,sensCenarios3,sensEntrada3,sensCorr3,sensibilidade3,sensDec};

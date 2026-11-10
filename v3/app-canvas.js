/* ===== Esteira v3.0 · cadastro do Canvas, na etapa 2 =====
   Formulário em passos, com as mesmas seções e chaves do cadastro da primeira versão da esteira (CV_PASSOS, em conteudo.js).
   Guarda rascunho a cada passo; o rascunho só entra no percurso das nove etapas depois de cadastrado.
   O rascunho de trabalho fica em R.cv: {code, passo, d}. Os campos gravam em R pelo atributo data-rasc ("cv.d.<chave>"). */
const cvVazio=v=>v==null||String(v).trim()==="";
const cvLinhas=a=>(a||[]).filter(r=>r&&Object.values(r).some(v=>!cvVazio(v)));
const cvRascunhos=()=>Object.values(S.canvas||{}).filter(d=>d&&d.status==="rascunho").sort((a,b)=>String(a.code).localeCompare(String(b.code),"pt-BR",{numeric:true}));
const cvTemFormulario=code=>!!(S.canvas[code]&&(S.canvas[code].cv||S.canvas[code].status==="rascunho"));

/* dados do formulário: em branco, ou a partir de um Canvas guardado */
function cvDados(code){
  const c=code&&S.canvas[code]; let D;
  if(!c) D={dir:"DISTT",missao:"",eixo:"",novos:"",semelhantes:[],grades:[0,0,0,0,0,0],temas:[]};
  else { D=clone(c.cv||{}); CV_BASE.forEach(k=>{ D[k]=c[k]; }); D.novos=c.novos==null?"":String(c.novos); }
  CV_TABELAS.forEach(k=>{ if(!Array.isArray(D[k])||!D[k].length) D[k]=[{}]; });
  D.temas=D.temas||[]; D.semelhantes=D.semelhantes||[]; D.grades=Array.isArray(D.grades)?D.grades:[0,0,0,0,0,0];
  return D; }

/* quanto de um passo está preenchido, de 0 a 1 */
function cvPreenchido(D,p){ const f=p.f||[]; if(!f.length) return 1;
  const ok=f.filter(x=>{ const v=D[x.k]; if(x.type==="table") return cvLinhas(v).length>0; if(x.type==="grades") return (v||[]).some(n=>+n>0); if(x.type==="temas"||x.type==="projetos") return (v||[]).length>0; return !cvVazio(v); }).length;
  return ok/f.length; }
function cvTotais(D){ let a=0,t=0; (D.orc||[]).forEach(r=>{ a+=num(r.abdi)||0; t+=num(r.terc)||0; }); return {abdi:a,terc:t}; }

/* conferência antes de cadastrar: os mesmos itens do cadastro da primeira versão. lvl "req" impede o cadastro; "at" é recomendação. */
function cvVerificar(D){ const L=[], ck=(ok,t,lvl,passo)=>L.push({ok:!!ok,t,lvl,passo});
  ck(!cvVazio(D.nome)&&!cvVazio(D.unidade)&&!cvVazio(D.dir),"Nome do projeto, diretoria e unidade preenchidos","req",0);
  ck(!cvVazio(D.resp)&&!/^(equipe|time)\b/i.test(String(D.resp).trim()),"Responsável nomeado (não “equipe” ou “time”)","req",0);
  ck(!cvVazio(D.situ),"Situação do projeto informada","req",0);
  ck(!cvVazio(D.problema)&&!cvVazio(D.numeros)&&!cvVazio(D.razoes),"Problema, evidências e razões para atuar preenchidos","req",1);
  ck(!cvVazio(D.adicional),"Evidência de adicionalidade preenchida","req",1);
  ck(String(D.problema||"").length<=300,"Problema em até duas linhas","at",1);
  ck(!cvVazio(D.objetivo)&&!cvVazio(D.descricao),"Objetivo e descrição preenchidos","req",2);
  ck(!/^\s*(promover|contribuir|apoiar)/i.test(D.objetivo||""),"Objetivo sem verbos genéricos (promover, contribuir, apoiar)","at",2);
  ck(cvLinhas(D.beneficios).length>0&&cvLinhas(D.beneficios).every(r=>!cvVazio(r.b)&&!cvVazio(r.asg)&&!cvVazio(r.ods)),"Benefícios com as três colunas preenchidas","at",3);
  ck(cvLinhas(D.produtos).length>0,"Ao menos um serviço ou produto","req",4);
  ck(!cvVazio(D.escala),"Estratégia de escalabilidade descrita","at",4);
  ck(cvLinhas(D.entregas).some(r=>!cvVazio(r.nome)&&r.ini&&r.fim),"Ao menos uma entrega relevante com datas","req",5);
  ck(cvLinhas(D.entregas).every(r=>!cvVazio(r.ativ)),"Toda entrega tem atividades associadas","at",5);
  ck(!cvVazio(D.novos)&&num(D.novos)!=null,"Recursos novos para o ano informados (pode ser zero)","req",6);
  ck(cvLinhas(D.orc).length>0,"Despesas listadas no orçamento","at",6);
  ck(!cvVazio(D.objEst)&&cvLinhas(D.indicadores).some(r=>!cvVazio(r.cg)&&!cvVazio(r.meta)&&!cvVazio(r.calc)),"Indicador ligado ao Contrato de Gestão, com meta e forma de cálculo","req",7);
  ck(cvLinhas(D.indicadores).every(r=>!cvVazio(r.per)),"Periodicidade informada em todos os indicadores","at",7);
  ck(cvLinhas(D.indicadores).length<=2,"No máximo dois indicadores (um principal e um secundário)","at",7);
  ck(!cvVazio(D.missao)&&!cvVazio(D.eixo),"Missão principal e eixo escolhidos","req",8);
  ck((D.grades||[]).filter(x=>+x>=2).length<=2,"Vínculo forte (grau 2 ou 3) com no máximo duas missões","at",8);
  return L; }

/* ---------- campos ---------- */
function cvSel(k,rot,opts,v,lab,dica){ return `<div class="cmp"><label for="i_${k}">${esc(rot)}</label><select id="i_${k}" data-rasc="${k}"><option value="">Escolha</option>${opts.map(o=>`<option value="${esc(o)}"${String(v==null?"":v)===String(o)?" selected":""}>${esc(lab?lab(o):o)}</option>`).join("")}</select>${dica?`<span class="dica">${esc(dica)}</span>`:""}</div>`; }
function cvCampo(D,f){
  const k="cv.d."+f.k, rot=f.l+(f.req?" *":""), v=D[f.k], dica=f.h?`<span class="dica">${esc(f.h)}</span>`:"", os=typeof f.opts==="function"?f.opts():f.opts;
  if(f.type==="area") return area(k,rot,[f.h,f.max?"Até "+f.max+" caracteres.":""].filter(Boolean).join(" "),f.rows);
  if(f.type==="sel") return cvSel(k,rot,os,v,f.lab,f.h);
  if(f.type==="radio") return `<div class="cmp"><span class="rot">${esc(rot)}</span>${dica}${ops(k,os.map(o=>[o,o]),v)}</div>`;
  if(f.type==="grades") return `<div class="cmp"><span class="rot">${esc(rot)}</span><span class="dica">0 sem relação, 1 indireta, 2 parcial, 3 direta. A nota de aderência não sai daqui: vem da árvore da missão, na etapa 4.</span>
    <div class="cv-grade">${CV_MISSOES.slice(0,6).map((m,i)=>cvSel(k+"."+i,cvMissao(m),[0,1,2,3],(v||[])[i]||0)).join("")}</div></div>`;
  if(f.type==="temas") return `<div class="cmp"><span class="rot">${esc(rot)}</span><span class="dica">Escolha os que se aplicam.</span><div class="opcoes" role="group">${CV_TEMAS.map((t,i)=>`<button type="button" class="op" data-acao="cvMarca" data-k="temas" data-v="${esc(t)}" data-fid="cv:tema:${i}" aria-pressed="${(v||[]).includes(t)}">${esc(t)}</button>`).join("")}</div></div>`;
  if(f.type==="projetos"){ const L=projetos().filter(x=>x.code!==(R.cv||{}).code);
    return `<div class="cmp"><span class="rot">${esc(rot)}</span>${dica}${L.length?`<div class="opcoes" role="group" style="flex-direction:column;align-items:stretch">${L.map(x=>`<button type="button" class="op" data-acao="cvMarca" data-k="semelhantes" data-v="${esc(x.code)}" data-fid="cv:proj:${esc(x.code)}" aria-pressed="${(v||[]).includes(x.code)}"><b>${esc(x.code)}</b> ${esc(x.nome)}</button>`).join("")}</div>`:`<span class="dica">Ainda não há outros projetos cadastrados.</span>`}</div>`; }
  if(f.type==="table"){ const rows=Array.isArray(v)&&v.length?v:(D[f.k]=[{}]);
    const cel=(r,i,c)=>{ const kk=k+"."+i+"."+c.k; return c.type==="area"?area(kk,c.l,"",c.rows||2):c.type==="sel"?cvSel(kk,c.l,c.opts,r[c.k]):texto(kk,c.l,"",c.type==="date"?"date":undefined); };
    return `<div class="cmp"><span class="rot">${esc(rot)}</span>${dica}
      ${rows.map((r,i)=>`<div class="cv-linha"><div class="cv-grade">${f.cols.map(c=>cel(r||{},i,c)).join("")}</div>${rows.length>1?`<button type="button" class="bt discreto peq" data-acao="cvRemove" data-t="${f.k}" data-i="${i}" data-fid="cv:rm:${f.k}:${i}">Remover</button>`:""}</div>`).join("")}
      <div class="acoes" style="margin-top:12px"><button type="button" class="bt sec peq" data-acao="cvAcrescenta" data-t="${f.k}" data-fid="cv:add:${f.k}">${esc(f.add)}</button></div></div>`; }
  return texto(k,rot,f.h);   /* texto e valores em reais: o número é convertido ao guardar */
}

/* ---------- telas ---------- */
/* no alto da etapa 2: o botão de cadastro e os rascunhos a retomar */
function cvBlocoCadastro(){
  const rs=cvRascunhos(), ex=R.cvExc;
  return `<section class="bloco"><h2>Cadastrar novo Canvas</h2><p>Propostas novas e projetos em andamento entram por aqui. O formulário segue as seções do guia de preenchimento do Canvas e pode ser guardado e retomado.</p>
    <div class="acoes"><a class="bt" href="#/etapa/2/novo">Cadastrar novo Canvas</a></div>
    ${rs.length?`<h3 class="espaco">Rascunhos <span class="tag at">${rs.length}</span></h3><p class="meta">O rascunho só entra no percurso das nove etapas depois de cadastrado.</p>
     <ol class="fila espaco-p">${rs.map(d=>`<li><span class="cod">${esc(d.code)}</span><span class="nm">${esc(d.nome||"Projeto sem nome")}<small>${esc([d.unidade,DIRETORIAS[d.dir]||d.dir].filter(Boolean).join(", "))}</small></span><span class="vl">${d.atualizadoEm?"Guardado em "+esc(dataBR(d.atualizadoEm)):""}</span>
       <span class="ac">${ex===d.code?`<span class="meta">Excluir de vez?</span> <button class="bt peq" data-acao="cvExcluirSim" data-code="${esc(d.code)}">Excluir</button> <button class="bt discreto peq" data-acao="cvExcluirNao">Cancelar</button>`
        :`<a class="bt sec peq" href="#/etapa/2/canvas/${encodeURIComponent(d.code)}">Continuar</a> <button class="bt discreto peq" data-acao="cvExcluir" data-code="${esc(d.code)}">Excluir</button>`}</span></li>`).join("")}</ol>`:""}</section>`; }

/* o formulário, novo (code vazio) ou de um Canvas guardado */
function cvTela(code){
  if(code&&!cvTemFormulario(code)) return `<section class="bloco"><p class="nota at">${S.canvas[code]?"Este Canvas veio da importação e não tem o formulário preenchido. Para revê-lo, use o cadastro da versão anterior da esteira.":"Canvas não encontrado."}</p><div class="acoes"><a class="bt sec" href="#/etapa/2">Voltar aos Canvas</a></div></section>`;
  if(!R.ini) R={ini:1,cv:{code:code||null,passo:0,d:cvDados(code)}};
  const W=R.cv, D=W.d, ult=CV_PASSOS.length-1, st=Math.min(Math.max(+W.passo||0,0),ult), P=CV_PASSOS[st], chk=cvVerificar(D), g=W.code&&S.canvas[W.code], cadastrado=!!(g&&g.status!=="rascunho");
  const passos=`<ol class="cv-passos" aria-label="Seções do Canvas">${CV_PASSOS.map((p,i)=>{ const pc=i<ult?cvPreenchido(D,p):null;
    return `<li><button type="button" class="${i===st?"atual":""}${pc===1?" ok":""}" data-acao="cvPasso" data-i="${i}" data-fid="cv:passo:${i}"${i===st?` aria-current="step"`:""}><span class="n">${pc===1?"✓":i+1}</span>${esc(p.t)}</button></li>`; }).join("")}</ol>`;
  let corpo;
  if(P.f) corpo=P.f.map(f=>cvCampo(D,f)).join("")+(P.f.some(f=>f.req)?`<p class="meta espaco-p">* Obrigatório para cadastrar o Canvas. O rascunho pode ser guardado só com o nome do projeto.</p>`:"");
  else { const falta=chk.filter(x=>!x.ok&&x.lvl==="req").length, t=cvTotais(D);
    corpo=`<ol class="cv-lista espaco-p">${chk.map(x=>`<li class="${x.ok?"ok":x.lvl==="req"?"no":"at"}"><span class="ic" aria-hidden="true">${x.ok?"✓":x.lvl==="req"?"✕":"!"}</span><span>${esc(x.t)}${!x.ok&&x.lvl!=="req"?` <span class="meta">(recomendado)</span>`:""}</span>${x.ok?"<span></span>":`<button type="button" class="bt discreto peq" data-acao="cvPasso" data-i="${x.passo}">Corrigir</button>`}</li>`).join("")}</ol>
     <p class="meta espaco-p">Orçamento informado: Agência ${esc(brl(t.abdi))}; terceiros ${esc(brl(t.terc))}; recurso novo pedido ${esc(brl(num(D.novos)||0))}.</p>
     <p class="nota ${falta?"at":"ok"} espaco-p" role="status">${falta?`Faltam ${falta} ${falta===1?"item obrigatório":"itens obrigatórios"}. Os recomendados não impedem o cadastro, mas pesam na análise.`:(cadastrado?"Tudo pronto. As alterações valem para as etapas seguintes.":"Tudo pronto. Depois de cadastrado, o Canvas entra na fila da etapa 2: falta responder se há pedido formal político e enviar à Unidade de Gestão Estratégica.")}</p>`; }
  return `<section class="bloco"><p class="meta"><a href="#/etapa/2">Voltar aos Canvas</a></p>
    <div class="cab-proj espaco-p"><h2>${W.code?`<b>${esc(W.code)}</b>`:""}${esc(cvVazio(D.nome)?"Novo Canvas":D.nome)}</h2>${g?`<span class="tag ${cadastrado?"ok":"at"}">${cadastrado?"Cadastrado":"Rascunho"}</span>`:""}</div>
    <p class="meta">${W.code?"":"O código é criado quando o Canvas for guardado pela primeira vez. "}Ciclo ${esc(S.ciclo.ciclo||"2027")}.</p>
    ${passos}
    <div class="pergunta espaco-p"><p class="meta">Passo ${st+1} de ${CV_PASSOS.length}</p><h3>${esc(P.t)}</h3><p>${esc(P.d)}</p>
     ${P.g?`<details class="espaco-p"><summary class="meta"><b>Como preencher, segundo o guia do Canvas</b></summary><ul class="cv-guia">${P.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`:""}
     ${corpo}</div>
    <div class="acoes">${st>0?`<button type="button" class="bt discreto" data-acao="cvPasso" data-i="${st-1}">Voltar</button>`:""}
     ${P.f?`<button type="button" class="bt" data-acao="cvGuardar" data-seguir="1">Guardar e continuar</button>`:`<button type="button" class="bt" data-acao="cvCadastrar">${cadastrado?"Guardar as alterações":"Cadastrar o Canvas"}</button>`}
     ${P.f&&st<ult?`<button type="button" class="bt sec" data-acao="cvGuardar">${cadastrado?"Guardar":"Guardar rascunho"}</button>`:""}</div></section>`; }

/* ---------- gravação ---------- */
async function cvProxCodigo(){
  const usados=new Set([...(await Dados.codigosCanvas()),...Object.keys(S.canvas),...Object.keys(S.base)]), fmt=(p,n)=>p+String(n).padStart(2,"0");
  if(S.modo==="demo"){ let i=1; while(usados.has(fmt("F",i))) i++; return fmt("F",i); }   /* no exemplo, os códigos são fictícios */
  let n=11; while(usados.has(fmt("N",n))) n++; return fmt("N",n); }                     /* projeto novo: N11 em diante, como na versão anterior */
/* documento do Canvas, no formato da versão 2.0: campos de base na raiz, o restante do formulário em "cv" */
function cvDoc(D,code,status){
  const prev=S.canvas[code]||{}, d=clone(D), cv={}, n=v=>{ const x=num(v); return x==null?"":x; };
  d.novos=num(D.novos)||0; d.grades=[0,1,2,3,4,5].map(i=>+(D.grades||[])[i]||0);
  (d.orc||[]).forEach(r=>{ if(r&&!cvVazio(r.abdi)) r.abdi=n(r.abdi); if(r&&!cvVazio(r.terc)) r.terc=n(r.terc); }); (d.benef||[]).forEach(r=>{ if(r&&!cvVazio(r.qtd)) r.qtd=n(r.qtd); });
  for(const k in d) if(!CV_BASE.includes(k)) cv[k]=d[k];
  const I=cvLinhas(d.indicadores)[0]||{}, em=new Date().toISOString();
  return {...prev,code,nome:String(d.nome||"").trim(),dir:d.dir||"",unidade:String(d.unidade||"").trim(),missao:d.missao||"",eixo:d.eixo||"",novos:d.novos,grades:d.grades,
    problema:d.problema||"",evidencia:d.numeros||"",meta:[I.nome,I.meta&&("meta "+I.meta),I.calc&&("cálculo: "+I.calc)].filter(Boolean).join("; "),
    cv,eleg:prev.eleg||["","","","","",""],elegJust:prev.elegJust||["","","","","",""],origem:prev.origem||"Cadastrado na esteira das nove etapas",
    ordem:prev.ordem||900+Object.keys(S.canvas).length,ts:em,atualizadoPor:S.usuario.nome,atualizadoEm:em,status:status||prev.status||"rascunho"}; }
async function cvGravar(status,msg){
  const W=R.cv, D=W.d; if(cvVazio(D.nome)){ W.passo=0; render(); aviso("Informe o nome do projeto para guardar."); return null; }
  try{ if(!W.code) W.code=await cvProxCodigo();
    const doc=cvDoc(D,W.code,status); await Dados.gravarCanvas(W.code,doc); S.canvas[W.code]=doc;
    if(doc.status!=="rascunho") S.base[W.code]=baseDoCanvas(W.code,doc);
    aviso(msg||(doc.status==="rascunho"?"Rascunho guardado":"Canvas guardado")); return W.code; }
  catch(err){ console.error(err); aviso("Não foi gravado. Tente de novo."); return null; } }

/* ---------- ações ---------- */
ACOES.cvPasso=d=>{ R.cv.passo=+d.i; render(); window.scrollTo(0,0); };
ACOES.cvMarca=d=>{ const D=R.cv.d, L=D[d.k]=D[d.k]||[], i=L.indexOf(d.v); if(i>=0) L.splice(i,1); else L.push(d.v); render(); };
ACOES.cvAcrescenta=d=>{ const D=R.cv.d; (D[d.t]=D[d.t]||[]).push({}); render(); };
ACOES.cvRemove=d=>{ const D=R.cv.d; (D[d.t]||[]).splice(+d.i,1); if(!(D[d.t]||[]).length) D[d.t]=[{}]; render(); };
ACOES.cvGuardar=async d=>{ const cd=await cvGravar(); if(!cd) return; if(d.seguir) R.cv.passo=Math.min((+R.cv.passo||0)+1,CV_PASSOS.length-1); render(); if(d.seguir) window.scrollTo(0,0); };
ACOES.cvCadastrar=async()=>{ const D=R.cv.d, falta=cvVerificar(D).filter(x=>!x.ok&&x.lvl==="req").length;
  if(falta) return aviso("Faltam "+falta+(falta===1?" item obrigatório.":" itens obrigatórios."));
  const ja=!!(R.cv.code&&S.canvas[R.cv.code]&&S.canvas[R.cv.code].status!=="rascunho"), cd=await cvGravar("enviado",ja?"Alterações guardadas":"Canvas cadastrado"); if(!cd) return;
  const f=E(cd).ficha=E(cd).ficha||{}; f.novo=D.situ==="Projeto novo";   /* a situação do projeto, informada no Canvas, alimenta a pergunta da etapa 2 */
  await salvar(cd,2,ja?"Canvas revisto.":"Canvas cadastrado.",ja?"Alterações guardadas":"Canvas cadastrado"); ir("#/etapa/2/"+cd); };
ACOES.cvExcluir=d=>{ R.cvExc=d.code; render(); };
ACOES.cvExcluirNao=()=>{ delete R.cvExc; render(); };
ACOES.cvExcluirSim=async d=>{ const c=S.canvas[d.code]; delete R.cvExc; if(!c||c.status!=="rascunho"){ render(); return aviso("Só rascunhos podem ser excluídos."); }
  try{ await Dados.excluirCanvas(d.code); delete S.canvas[d.code]; aviso("Rascunho excluído"); }catch(err){ console.error(err); aviso("Não foi excluído. Tente de novo."); } render(); };

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
ACOES.cvGuardar=async d=>{ const cd=await cvGravar(); if(!cd) return; if(d.seguir) R.cv.passo=Math.min((+R.cv.passo||0)+1,CV_PASSOS.length-1); render(); if(d.seguir) window.scrollTo(0,0);
  /* Canvas já cadastrado: o arquivo PDF guardado acompanha cada alteração, para o leitor das etapas 3 a 5 não mostrar uma versão antiga */
  if(S.canvas[cd]&&S.canvas[cd].status!=="rascunho") cvArquivarDepois(cd); };
/* refaz o arquivo PDF pouco depois da última gravação (uma vez só, mesmo com várias gravações seguidas); só no banco */
function cvArquivarDepois(code){ if(S.modo!=="nuvem"||window.SEM_ARQUIVOS) return; const T=cvArquivarDepois.t=cvArquivarDepois.t||{}; clearTimeout(T[code]);
  T[code]=setTimeout(()=>{ delete T[code]; cvArquivar(code).then(ok=>{ if(!ok) aviso("O arquivo PDF do Canvas não foi atualizado agora. Ele pode ser baixado na etapa 3."); }); },1200); }
ACOES.cvCadastrar=async()=>{ const D=R.cv.d, falta=cvVerificar(D).filter(x=>!x.ok&&x.lvl==="req").length;
  if(falta) return aviso("Faltam "+falta+(falta===1?" item obrigatório.":" itens obrigatórios."));
  const ja=!!(R.cv.code&&S.canvas[R.cv.code]&&S.canvas[R.cv.code].status!=="rascunho"), cd=await cvGravar("enviado",ja?"Alterações guardadas":"Canvas cadastrado"); if(!cd) return;
  const f=E(cd).ficha=E(cd).ficha||{}; f.novo=D.situ==="Projeto novo";   /* a situação do projeto, informada no Canvas, alimenta a pergunta da etapa 2 */
  await salvar(cd,2,ja?"Canvas revisto.":"Canvas cadastrado.",ja?"Alterações guardadas":"Canvas cadastrado"); ir("#/etapa/2/"+cd);
  /* o arquivo PDF é gerado e guardado depois, sem segurar o cadastro: se a biblioteca ou o banco falharem, o Canvas já está cadastrado */
  if(S.modo==="nuvem"&&!window.SEM_ARQUIVOS){ clearTimeout((cvArquivarDepois.t||{})[cd]); cvArquivar(cd).then(ok=>{ aviso(ok?"Arquivo PDF do Canvas guardado":"O arquivo PDF não foi guardado agora. Ele pode ser baixado na etapa 3."); if(ok) render(); }); } };
ACOES.cvExcluir=d=>{ R.cvExc=d.code; render(); };
ACOES.cvExcluirNao=()=>{ delete R.cvExc; render(); };
ACOES.cvExcluirSim=async d=>{ const c=S.canvas[d.code]; delete R.cvExc; if(!c||c.status!=="rascunho"){ render(); return aviso("Só rascunhos podem ser excluídos."); }
  try{ await Dados.excluirCanvas(d.code); delete S.canvas[d.code]; aviso("Rascunho excluído"); }catch(err){ console.error(err); aviso("Não foi excluído. Tente de novo."); } render(); };

/* ===== leitor do Canvas, ao lado do trabalho nas etapas 3, 4 e 5 (elegibilidade, vínculo e pontuação) =====
   Mostra os documentos do Canvas guardados no banco (o PDF original e o PDF gerado no cadastro) e o Canvas cadastrado
   pelo formulário em folhas, no formato de página, para ler, baixar em PDF ou imprimir.
   O corpo do leitor é reaproveitado de uma resposta para a outra: a leitura não volta ao começo a cada clique. */
const LEITOR={rota:null,chave:null,node:null,rolagem:0,pdfs:{},carga:null};
const PDFJS_BASE="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
const PDFLIB_URL="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
const LV_NADA="Não preenchido", LV_VAZIO=`<span class="vazio">${LV_NADA}</span>`;
const lvData=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v))?dataBR(String(v)):String(v);

/* valor de um campo do formulário, só para leitura: texto, tabela ({cols,linhas}) ou null quando está vazio */
function lvValor(D,f){
  const v=D[f.k];
  if(f.type==="table"){ const L=cvLinhas(v); if(!L.length) return null;
    return {cols:f.cols.map(c=>({l:c.l,num:c.type==="num"})),linhas:L.map(r=>f.cols.map(c=>{ const x=r[c.k]; return cvVazio(x)?"":c.type==="date"?lvData(x):c.type==="num"&&/reais/.test(c.l)?brl(num(x)||0):String(x); }))}; }
  if(f.type==="grades"){ const g=(v||[]).map((n,i)=>+n>0?cvMissao(CV_MISSOES[i])+": grau "+(+n):"").filter(Boolean); return g.length?g.join("; ")+".":null; }
  if(f.type==="temas") return (v||[]).length?v.join("; ")+".":null;
  if(f.type==="projetos") return (v||[]).length?v.map(k=>k+(S.base[k]?" "+S.base[k].nome:"")).join("; ")+".":"Nenhum marcado";
  if(cvVazio(v)) return null;
  if(f.type==="sel") return String(f.lab?f.lab(v):v);
  if(f.type==="num") return brl(num(v)||0);
  return String(v).trim(); }

/* o Canvas como lista de folhas: capa e uma folha por seção do formulário; sem formulário, o resumo do que há guardado.
   A mesma lista alimenta as folhas da tela (cvFolhas) e o arquivo PDF (cvPDF). */
function cvModelo(c){
  const d=S.canvas[c.code], P=[], ciclo=S.ciclo&&S.ciclo.ciclo?" · ciclo "+S.ciclo.ciclo:"", tx=v=>cvVazio(v)?null:String(v).trim();
  const capa=(D,pares,obj,nota)=>({capa:1,rot:"Canvas do projeto"+ciclo,nome:D.nome||c.nome,sub:[DIRETORIAS[D.dir]||D.dir,D.unidade].filter(Boolean).join(" · "),pares,obj,nota});
  const pares=L=>L.filter(x=>x[2]||!cvVazio(x[1])).map(x=>({l:x[0],v:tx(x[1]),larga:1}));
  const resumo=o=>({t:"Problema, meta e evidência",blocos:pares([["Problema",o.problema,1],["Meta",o.meta,1],["Evidência",o.evidencia,1]])});
  if(d&&d.cv){ const D=cvDados(c.code), tot=cvTotais(D);
    P.push(capa(D,[["Responsável",tx(D.resp)],["Situação",tx(D.situ)],["Missão principal",D.missao?cvMissao(D.missao):null],["Recursos novos pedidos",brl(num(D.novos)||0)]],{l:"Objetivo do projeto",v:tx(D.objetivo)},cvVazio(D.versao)?"":"Versão: "+D.versao));
    CV_PASSOS.slice(1,9).forEach(p=>P.push({t:p.t,blocos:p.f.map(f=>{ const v=lvValor(D,f); return v&&v.cols?{l:f.l,tab:v,larga:1}:{l:f.l,v,larga:f.type==="area"||f.type==="table"}; }),
      nota:p.t==="Orçamento"?`Total das despesas: ${brl(tot.abdi)} da Agência e ${brl(tot.terc)} de terceiros.`:""})); }
  else if(d){ const X=d.pdfx||{};   /* Canvas importado do documento original: só os trechos extraídos */
    P.push(capa(d,[],{l:"Objetivo do projeto",v:tx(X.objetivo)},"Texto extraído do documento original. Confira no PDF quando houver dúvida."));
    P.push(resumo(d));
    if(X.ent26||X.ent27||X.orc27) P.push({t:"Entregas e orçamento",blocos:pares([["Entregas do ciclo anterior",X.ent26],["Entregas previstas",X.ent27],["Orçamento previsto",X.orc27]])});
    if(X.ind||X.pil) P.push({t:"Indicadores e alinhamento",blocos:pares([["Indicadores",X.ind],["Contribuição para os pilares da Agência",X.pil]])}); }
  else { P.push(capa(c,[["Missão principal",MISSOES[c.missao]||"Transversal"],["Recursos novos pedidos",brl(+c.novos||0)]],null,
      S.modo==="demo"?"Projeto do exemplo fictício: só o resumo. O Canvas completo aparece aqui para os projetos cadastrados pelo formulário da etapa 2.":"Este projeto não tem o Canvas guardado."));
    P.push(resumo(c)); }
  return P; }

/* as folhas na tela */
function cvFolhas(c){
  const P=cvModelo(c), val=v=>v==null?LV_VAZIO:esc(v);
  const tab=t=>`<table><thead><tr>${t.cols.map(x=>`<th scope="col">${esc(x.l)}</th>`).join("")}</tr></thead><tbody>${t.linhas.map(r=>`<tr>${r.map((x,i)=>`<td${t.cols[i].num?' class="n"':""}>${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  const dl=(B,cls)=>`<dl${cls?` class="${cls}"`:""}>${B.map(b=>`<div${b.larga?' class="larga"':""}><dt>${esc(b.l)}</dt><dd>${b.tab?tab(b.tab):val(b.v)}</dd></div>`).join("")}</dl>`;
  return P.map((p,i)=>`<article class="folha${p.capa?" capa":""}" aria-label="Folha ${i+1} de ${P.length}"><header><span>${esc(c.nome)}</span><span>${esc(c.code)}</span></header>${
    p.capa?`<p class="rot">${esc(p.rot)}</p><h2>${esc(p.nome)}</h2><p class="sub">${esc(p.sub)}</p>${p.pares.length?dl(p.pares.map(x=>({l:x[0],v:x[1]})),"capa"):""}${p.obj?`<h4>${esc(p.obj.l)}</h4><p class="obj">${val(p.obj.v)}</p>`:""}`
     :`<h3>${esc(p.t)}</h3>${dl(p.blocos)}`}${p.nota?`<p class="meta">${esc(p.nota)}</p>`:""}<footer>Folha ${i+1} de ${P.length}</footer></article>`).join(""); }

/* as mesmas folhas em arquivo PDF, em páginas de proporção 16 por 9; devolve os bytes do arquivo */
async function cvPDF(c){
  const {PDFDocument,StandardFonts,rgb}=await leitorPdfLib(), P=cvModelo(c), doc=await PDFDocument.create();
  const F=await doc.embedFont(StandardFonts.Helvetica), FB=await doc.embedFont(StandardFonts.HelveticaBold), sabe=new Set(F.getCharacterSet());
  const W=960,H=540,MX=48,BASE=44,LARG=W-2*MX, tinta=rgb(.11,.14,.2), cinza=rgb(.35,.38,.45), risco=rgb(.86,.89,.93), azul=rgb(.09,.24,1), fundo=rgb(.955,.965,.98);
  /* as fontes padrão do PDF só conhecem o alfabeto latino: o que não existe nelas vira um sinal simples */
  const limpa=s=>String(s==null?"":s).replace(/\r/g,"").replace(/\t/g," ").replace(/[   ]/g," ").replace(/→/g,"->").replace(/★/g,"*").replace(/≥/g,">=").replace(/≤/g,"<=").replace(/[^\n]/gu,ch=>sabe.has(ch.codePointAt(0))?ch:"?");
  const quebra=(txt,f,tam,larg)=>{ const out=[];
    for(const par of limpa(txt).split("\n")){ let l="";
      for(let w of par.split(" ")){
        while(f.widthOfTextAtSize(w,tam)>larg&&w.length>1){ let i=w.length; while(i>1&&f.widthOfTextAtSize(w.slice(0,i),tam)>larg) i--; if(l){ out.push(l); l=""; } out.push(w.slice(0,i)); w=w.slice(i); }
        const t=l?l+" "+w:w; if(l&&f.widthOfTextAtSize(t,tam)>larg){ out.push(l); l=w; } else l=t; }
      out.push(l); }
    return out; };
  let pg=null, y=0, titulo="";
  function nova(t,cont){ pg=doc.addPage([W,H]); const nm=limpa(c.nome).toUpperCase().slice(0,110), cd=limpa(c.code);
    pg.drawText(nm,{x:MX,y:H-34,size:8,font:FB,color:cinza}); pg.drawText(cd,{x:W-MX-FB.widthOfTextAtSize(cd,8),y:H-34,size:8,font:FB,color:cinza});
    pg.drawLine({start:{x:MX,y:H-42},end:{x:W-MX,y:H-42},thickness:.75,color:risco}); y=H-62;
    if(t){ texto(t+(cont?" (continuação)":""),FB,15,tinta,LARG,MX,20); y-=6; } }
  function cabe(alt){ if(y-alt<BASE) nova(titulo,1); }
  function texto(s,f,tam,cor,larg,x,alt){ for(const l of quebra(s,f,tam,larg)){ cabe(alt); pg.drawText(l,{x,y:y-tam,size:tam,font:f,color:cor}); y-=alt; } }
  function tabela(t){ const peso=t.cols.map((cl,i)=>Math.max(8,Math.min(42,Math.max(cl.l.length,...t.linhas.map(r=>String(r[i]).length))))), soma=peso.reduce((a,b)=>a+b,0), larg=peso.map(v=>LARG*v/soma);
    const fila=(cel,f,cor)=>{ const Ls=cel.map((x,i)=>quebra(x,f,9,larg[i]-10)), alt=Math.max(...Ls.map(l=>l.length))*12+8; cabe(alt); let x=MX;
      Ls.forEach((ls,i)=>{ pg.drawRectangle({x,y:y-alt,width:larg[i],height:alt,borderColor:risco,borderWidth:.75,color:cor});
        ls.forEach((l,k)=>pg.drawText(l,{x:t.cols[i].num&&f===F?x+larg[i]-5-f.widthOfTextAtSize(l,9):x+5,y:y-12-k*12,size:9,font:f,color:tinta})); x+=larg[i]; }); y-=alt; };
    fila(t.cols.map(cl=>cl.l),FB,fundo); t.linhas.forEach(r=>fila(r,F,undefined)); }
  for(const p of P){ titulo=p.capa?"":p.t;
    if(p.capa){ nova(""); y-=36; texto(p.rot,FB,10,azul,LARG,MX,16); y-=6; texto(p.nome,FB,26,tinta,LARG,MX,32); y-=4; if(p.sub) texto(p.sub,F,11,cinza,LARG,MX,16); y-=16;
      if(p.pares.length){ const lw=LARG/p.pares.length, y0=y; let fim=y;
        p.pares.forEach((x,i)=>{ y=y0; texto(x[0],FB,9,tinta,lw-14,MX+i*lw,13); texto(x[1]==null?LV_NADA:x[1],F,10.5,x[1]==null?cinza:tinta,lw-14,MX+i*lw,15); fim=Math.min(fim,y); }); y=fim-16; }
      if(p.obj){ texto(p.obj.l,FB,10,tinta,LARG,MX,15); y-=2; texto(p.obj.v==null?LV_NADA:p.obj.v,F,13,p.obj.v==null?cinza:tinta,LARG,MX,19); y-=8; } }
    else { nova(p.t); p.blocos.forEach(b=>{ cabe(34); texto(b.l,FB,9,tinta,LARG,MX,13); if(b.tab) tabela(b.tab); else texto(b.v==null?LV_NADA:b.v,F,10.5,b.v==null?cinza:tinta,LARG,MX,15); y-=8; }); }
    if(p.nota){ y-=2; texto(p.nota,F,9.5,cinza,LARG,MX,14); } }
  const pgs=doc.getPages(); pgs.forEach((q,i)=>{ const s="Folha "+(i+1)+" de "+pgs.length; q.drawText(s,{x:W-MX-F.widthOfTextAtSize(s,8),y:24,size:8,font:F,color:cinza}); });
  doc.setTitle(limpa("Canvas "+c.code+" - "+c.nome)); doc.setCreator("Esteira de seleção");
  return doc.save(); }

/* gera o arquivo PDF do Canvas cadastrado e o guarda no banco, como documento do Canvas. Se falhar, o cadastro continua valendo. */
async function cvArquivar(code){
  if(S.modo!=="nuvem"||window.SEM_ARQUIVOS) return false;
  try{ const bytes=await cvPDF(S.base[code]), id="esteira3-"+code, doc=S.canvas[code], hoje=new Date().toISOString();
    await Dados.guardarArquivo(id,bytes);
    doc.anexos=[{id,url:"/_blob/"+id,ciclo:String((S.ciclo&&S.ciclo.ciclo)||""),nome:"Canvas cadastrado na esteira em "+dataBR(hoje),arquivo:"Canvas_"+code+".pdf",gerado:hoje},...(doc.anexos||[]).filter(a=>a.id!==id)];
    await Dados.gravarCanvas(code,doc); delete LEITOR.pdfs["/_blob/"+id]; delete Dados._urls[id]; return true; }
  catch(err){ console.warn("Arquivo PDF do Canvas não guardado:",err&&err.message||err); return false; } }

/* documentos que o leitor oferece: os PDF originais (só no banco, com arquivos) e o Canvas em folhas */
function leitorAbas(c){
  const d=S.canvas[c.code]||null, ax=d&&!window.SEM_ARQUIVOS&&S.modo==="nuvem"&&Array.isArray(d.anexos)?d.anexos:[];
  return [...ax.map((x,i)=>({k:"p"+i,t:x.gerado?"PDF do cadastro":"PDF "+(x.ciclo||i+1),pdf:x})),{k:"c",t:d&&d.cv?"Canvas cadastrado":"Resumo"}]; }
function leitorCanvas(c){
  const abas=leitorAbas(c), at=abas.find(a=>a.k===R.doc)||abas[0], chave=c.code+":"+at.k;
  return `<aside class="leitor" aria-label="Canvas do projeto">
    <div class="leitor-topo"><div class="opcoes" role="group" aria-label="Documento mostrado">${abas.map(a=>`<button type="button" class="op" data-acao="leitorAba" data-k="${a.k}" data-fid="leitor:${a.k}" aria-pressed="${a.k===at.k}">${esc(a.t)}</button>`).join("")}</div>
      ${at.pdf?`<button type="button" class="bt sec peq" data-acao="leitorBaixar" data-code="${esc(c.code)}" data-i="${at.k.slice(1)}" data-fid="leitor:baixar">Baixar o PDF</button>`
        :window.SEM_ARQUIVOS?"":`<span class="leitor-botoes"><button type="button" class="bt sec peq" data-acao="leitorGerar" data-code="${esc(c.code)}" data-fid="leitor:gerar">Baixar em PDF</button><button type="button" class="bt discreto peq" data-acao="leitorImprimir" data-fid="leitor:imprimir">Imprimir</button></span>`}</div>
    ${at.pdf?`<div class="leitor-corpo" id="leitor" tabindex="0" aria-label="Páginas do documento original do Canvas" data-chave="${esc(chave)}" data-url="${esc(at.pdf.url)}"><p class="meta">Abrindo ${esc(at.pdf.nome||"o documento")}.</p></div>`
      :`<div class="leitor-corpo" id="leitor" tabindex="0" aria-label="Canvas em formato de página" data-chave="${esc(chave)}">${cvFolhas(c)}</div>`}</aside>`; }

/* depois de cada desenho da tela: reaproveita o corpo já aberto ou abre o documento */
function leitorMontar(){
  const host=document.getElementById("leitor");
  if(!host){ LEITOR.node=null; LEITOR.chave=null; return; }
  if(LEITOR.node&&LEITOR.node!==host&&LEITOR.chave===host.dataset.chave&&LEITOR.rota===ROTA_ANT){ host.replaceWith(LEITOR.node); LEITOR.node.scrollTop=LEITOR.rolagem; return; }
  LEITOR.rota=ROTA_ANT; LEITOR.chave=host.dataset.chave; LEITOR.node=host; LEITOR.rolagem=0;
  host.addEventListener("scroll",()=>{ if(LEITOR.node===host) LEITOR.rolagem=host.scrollTop; },{passive:true});
  if(host.dataset.url) leitorPDF(host,host.dataset.url); }
function leitorPdfLib(){
  if(window.PDFLib) return Promise.resolve(window.PDFLib);
  if(!LEITOR.cargaLib) LEITOR.cargaLib=leitorScript(PDFLIB_URL).then(()=>window.PDFLib).catch(e=>{ LEITOR.cargaLib=null; throw e; });
  return LEITOR.cargaLib; }
const leitorScript=src=>new Promise((ok,erro)=>{ const s=document.createElement("script"), t=setTimeout(()=>{ s.remove(); erro(new Error("Demorou demais: "+src)); },20000);
  s.src=src; s.onload=()=>{ clearTimeout(t); ok(); }; s.onerror=()=>{ clearTimeout(t); erro(new Error("Não carregou: "+src)); }; document.head.appendChild(s); });
function leitorPdfjs(){
  if(window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if(!LEITOR.carga) LEITOR.carga=leitorScript(PDFJS_BASE+"pdf.min.js").then(()=>leitorScript(PDFJS_BASE+"pdf.worker.min.js")).then(()=>window.pdfjsLib).catch(e=>{ LEITOR.carga=null; throw e; });
  return LEITOR.carga; }
async function leitorPDF(host,url){
  try{ const lib=await leitorPdfjs(); let doc=LEITOR.pdfs[url];
    if(!doc){ doc=await lib.getDocument({url:await Dados.urlArquivo(url)}).promise; LEITOR.pdfs[url]=doc; }
    if(LEITOR.node!==host) return;   /* trocou de documento enquanto este abria */
    host.innerHTML=""; const larg=Math.min(host.clientWidth-32,1100)||600, dpr=Math.min(2,window.devicePixelRatio||1);
    for(let i=1;i<=doc.numPages;i++){ const pg=await doc.getPage(i), v0=pg.getViewport({scale:1}), vp=pg.getViewport({scale:larg/v0.width*dpr});
      const cv=document.createElement("canvas"); cv.width=vp.width; cv.height=vp.height; cv.setAttribute("role","img"); cv.setAttribute("aria-label","Página "+i+" de "+doc.numPages); host.appendChild(cv);
      await pg.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise; if(LEITOR.node!==host) return; }
  }catch(e){ if(LEITOR.node===host) host.innerHTML=`<p class="nota at">Não foi possível abrir o PDF aqui. Use o botão Baixar o PDF ou a aba ao lado.</p>`; } }

ACOES.leitorAba=d=>{ R.doc=d.k; render(); };
const leitorEntrega=(blob,nome)=>{ const el=document.createElement("a"), u=URL.createObjectURL(blob); el.href=u; el.download=nome; document.body.appendChild(el); el.click(); el.remove(); setTimeout(()=>URL.revokeObjectURL(u),4000); aviso("PDF baixado"); };
ACOES.leitorBaixar=async d=>{ const c=S.canvas[d.code], a=c&&(c.anexos||[])[+d.i]; if(!a) return;
  try{ const r=await fetch(await Dados.urlArquivo(a.url)); if(!r.ok) throw new Error(String(r.status)); leitorEntrega(await r.blob(),a.arquivo||("Canvas_"+d.code+".pdf")); }
  catch(e){ aviso("Não foi possível baixar agora."); } };
/* gera na hora o arquivo PDF das folhas e o entrega; não grava nada */
ACOES.leitorGerar=async d=>{ const c=S.base[d.code]; if(!c) return;
  try{ leitorEntrega(new Blob([await cvPDF(c)],{type:"application/pdf"}),"Canvas_"+d.code+".pdf"); }
  catch(e){ console.error(e); aviso("Não foi possível gerar o PDF agora. Use Imprimir."); } };
/* imprime só as folhas do Canvas; na janela de impressão, a pessoa escolhe a impressora ou "salvar em PDF" */
ACOES.leitorImprimir=()=>{ const fim=()=>{ document.body.classList.remove("imprime-canvas"); window.removeEventListener("afterprint",fim); };
  document.body.classList.add("imprime-canvas"); window.addEventListener("afterprint",fim); window.print(); };

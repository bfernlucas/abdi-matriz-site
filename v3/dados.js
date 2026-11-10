/* ===== Esteira v3.0 · guarda dos dados =====
   Dois modos, com a mesma interface:
   - exemplo fictício: tudo fica no navegador de quem abre; nenhum dado real;
   - banco com login: lê as fichas da coleção "canvas" e grava o percurso da v3.0 em coleções
     próprias ("v3proj" e "v3cfg"). Não toca em nada que a versão 2.0 gravou. */
const CHAVE_DEMO="esteira3.exemplo.v1";

function semearDemo(){
  const agora=new Date().toISOString(), por="Exemplo fictício", base={}, est={};
  for(const p of DEMO.projetos){
    base[p.code]={code:p.code,nome:p.nome,dir:p.dir,unidade:p.unidade,missao:p.missao,novos:p.novos,
      problema:"Texto fictício: o problema que o projeto quer resolver.",meta:"Texto fictício: a meta, com indicador e prazo.",evidencia:"Texto fictício: o que já foi medido."};
    const e={ficha:{novo:!!p.novo},log:[]}, log=(etapa,oque)=>e.log.push({em:agora,por,etapa,oque}); est[p.code]=e;
    if(p.tag){ Object.assign(e.ficha,{pedidoPolitico:true,documento:"Ofício fictício com o pedido formal.",etiqueta:"concedida",etiquetaPor:por}); log(2,"Etiqueta de relevância política concedida."); }
    if(p.ate<3) continue;
    e.ficha.enviada=true; e.ficha.enviadaEm=agora; log(2,"Ficha enviada.");
    if(p.porta||p.ate>3){ e.porta={completa:"sim",mandato:"sim",repete:"não",medicao:"sim",...(p.porta||{}),just:{},fechada:true,por,em:agora}; log(3,p.porta?"Porta de entrada: saída registrada.":"Ficha aceita na porta de entrada."); }
    if(p.porta||p.ate<5) continue;
    e.arvore={missao:p.missao,saida:p.arv,titulo:ARV_TXT[p.arv],trilha:[{k:"Exemplo",t:"Percurso fictício da árvore",r:ARV_TXT[p.arv]}],manual:false,por,em:agora}; log(4,"Árvore da missão: "+ARV_TXT[p.arv].toLowerCase()+".");
    if(p.n){ e.leituras={}; p.n.forEach((v,i)=>{ e.leituras["L"+(i+1)]={por:"Leitor "+(i+1)+" (exemplo)",R:v[0],E:v[1],I:v[2],dano:false,just:{},em:agora}; log(5,"Leitura "+(i+1)+" registrada."); }); }
    if(p.exq){ e.farol={exq:p.exq,comprometido:p.novo?0:Math.round(p.novos*0.4)||1200000,obs:"",por,em:agora}; log(6,"Farol registrado."); }
    if(p.dec){ e.decisao={...p.dec,por:"Diretoria Executiva (exemplo)",em:agora}; log(8,p.dec.tipo==="seguir"?"Decisão: sugestão confirmada.":"Decisão diferente da sugestão, com motivo."); }
  }
  return {base,est,ciclo:{...DEMO.ciclo,obs:"",publicadoEm:agora,publicadoPor:por,historico:[{em:agora,por,oque:"Regras do exemplo publicadas."}]}};
}

const Dados={
  sb:null, modo:null, _demo:null,
  temNuvem(){ return !!(window.NUVEM&&window.supabase&&window.supabase.createClient); },

  /* exemplo fictício */
  abrirDemo(){ this.modo="demo"; let d=null; try{ d=JSON.parse(localStorage.getItem(CHAVE_DEMO)||"null"); }catch(e){}
    if(!d||!d.base){ d=semearDemo(); } this._demo=d; this._gravaDemo(); return d; },
  _gravaDemo(){ try{ localStorage.setItem(CHAVE_DEMO,JSON.stringify(this._demo)); }catch(e){} },
  reiniciarDemo(){ try{ localStorage.removeItem(CHAVE_DEMO); }catch(e){} return this.abrirDemo(); },

  /* banco com login */
  async iniciarNuvem(aoMudar){
    this.sb=window.supabase.createClient(window.NUVEM.url,window.NUVEM.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    this.sb.auth.onAuthStateChange((ev,sess)=>setTimeout(()=>aoMudar(sess),0));
    const {data}=await this.sb.auth.getSession(); return data&&data.session; },
  async entrar(email,senha){ const {error}=await this.sb.auth.signInWithPassword({email,password:senha}); return error?(/invalid/i.test(error.message)?"E-mail ou senha não conferem.":error.message):null; },
  async sair(){ if(this.sb) await this.sb.auth.signOut(); },
  async _ler(c){ let rows=[],de=0; for(;;){ const {data,error}=await this.sb.from("docs").select("id,dados").eq("colecao",c).order("id").range(de,de+999); if(error) throw error; rows=rows.concat(data); if(data.length<1000) break; de+=1000; } return rows; },
  async abrirNuvem(){
    this.modo="nuvem"; const [cv,pj,cf]=await Promise.all([this._ler("canvas"),this._ler("v3proj"),this._ler("v3cfg")]);
    const base={}, est={};
    cv.forEach(r=>{ const d=r.dados||{}; if(d.status==="rascunho") return; const code=d.code||r.id;
      base[code]={code,nome:d.nome||code,dir:d.dir||"",unidade:d.unidade||"",missao:MISSOES[d.missao]?d.missao:"T",novos:+d.novos||0,problema:d.problema||"",meta:d.meta||"",evidencia:d.evidencia||""}; });
    pj.forEach(r=>{ est[r.id]=r.dados||{}; });
    return {base,est,ciclo:(cf.find(r=>r.id==="ciclo")||{}).dados||{}}; },
  async _por(c,id,dados){ const {error}=await this.sb.from("docs").upsert({colecao:c,id,dados,atualizado_em:new Date().toISOString()}); if(error) throw error; },

  /* gravação, nos dois modos */
  async gravarProjeto(code,est){ if(this.modo==="demo"){ this._demo.est[code]=est; this._gravaDemo(); return; } await this._por("v3proj",code,est); },
  async gravarCiclo(ciclo){ if(this.modo==="demo"){ this._demo.ciclo=ciclo; this._gravaDemo(); return; } await this._por("v3cfg","ciclo",ciclo); },
  async gravarBase(code,base){ if(this.modo!=="demo") throw new Error("No banco, as fichas vêm do cadastro do Canvas."); this._demo.base[code]=base; this._gravaDemo(); }
};

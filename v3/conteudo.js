/* ===== Esteira v3.0 · conteúdo: as nove etapas, a régua e o exemplo fictício =====
   Textos transcritos do quadro "Fluxo completo da matriz de priorização" (Miro), com as edições de 10/11/2026.
   Em cada etapa, "ativ" lista as atividades na ordem do quadro:
     [quem, o que faz]                         atividade
     {p, sim, nao}                              pergunta de sim ou não e o que acontece em cada resposta
     {s}                                        saída ou passagem para outra etapa */
const UGE="Unidade de Gestão Estratégica", DIRX="Diretoria Executiva", AREA="Área que propõe", SUPX="Superintendência Executiva", AUD="Unidade de Auditoria";
const PAPEIS=[AREA,UGE,"Leitor de fora da Presidência",SUPX,DIRX,AUD];

const ETAPAS=[
 {n:1,t:"Regras do ciclo",curto:"Regras",quem:UGE,
  frase:"Antes de qualquer projeto chegar, a Agência publica como os projetos serão avaliados no ano.",
  faz:"A Unidade de Gestão Estratégica prepara; a Diretoria Executiva fixa o teto.",entra:"Lições do ciclo anterior.",sai:"Regras publicadas.",
  ativ:[[UGE,"Revê a régua com as lições do ciclo anterior"],[UGE,"Atualiza as árvores das seis missões e as cadeias com estrela"],[UGE,"Escreve a régua: perguntas de entrada, quatro notas com exemplos e itens do farol"],[DIRX,"Fixa o teto de referência (dinheiro novo do ano) e as datas"],[UGE,"Publica as regras e orienta as áreas"],{s:"Segue para a etapa 2"}]},
 {n:2,t:"Ficha do projeto",curto:"Ficha",quem:AREA,
  frase:"A área que quer executar um projeto descreve o que pretende fazer e junta as provas.",
  faz:"A área que propõe.",entra:"Regras publicadas.",sai:"Ficha entregue.",etiqueta:"A área pede a etiqueta à Diretoria Executiva, com documento.",
  ativ:[[AREA,"Tem um projeto novo ou quer continuar um projeto"],[AREA,"Preenche o Canvas: objetivo, entregas, orçamento e indicadores"],[AREA,"Preenche a ficha de uma página: missão, medição, parceiros, emprego e ambiente, execução e custo"],[AREA,"Anexa documentos: contrato, convênio, relatório de resultado"],{p:"Há pedido formal político para este projeto?",sim:"A Diretoria Executiva confere o documento e decide se concede a etiqueta de relevância política.",nao:"Segue sem etiqueta."},[AREA,"Envia a ficha à Unidade de Gestão Estratégica até a data"],{s:"Segue para a etapa 3"}]},
 {n:3,t:"Porta de entrada",curto:"Porta",quem:UGE,
  frase:"Perguntas de sim ou não, sem nota, decidem se a ficha segue adiante.",
  faz:"A Unidade de Gestão Estratégica; a Unidade Jurídica dá parecer quando há dúvida legal.",entra:"Ficha entregue.",sai:"Ficha aceita ou uma saída.",etiqueta:"Só o limite legal barra (ponto em aberto); o resto vira pendência anotada.",
  ativ:[[UGE,"Recebe a ficha e faz quatro perguntas, nesta ordem"],{p:"A ficha está completa?",nao:"Volta à etapa 2 para completar."},{p:"Está dentro do papel legal da Agência?",nao:"Saída: outro órgão."},{p:"Repete a entrega de outro projeto?",sim:"Saída: incorporar ao projeto parecido."},{p:"Há indicador ou plano de medição?",nao:"Saída: reformular, com a lista do que falta."},[UGE,"Anota pendências e aceita a ficha"],{s:"Segue para a etapa 4"}]},
 {n:4,t:"Árvore da missão",curto:"Árvore",quem:UGE,
  frase:"Uma sequência de perguntas mostra se o projeto pertence à missão e a uma cadeia prioritária.",
  faz:"A Unidade de Gestão Estratégica, com as respostas da ficha.",entra:"Ficha aceita.",sai:"Nota de aderência 1, 3 ou 5. Ninguém atribui essa nota: ela decorre das respostas.",etiqueta:"O resultado é anotado, mas não barra.",
  ativ:[[UGE,"Abre a árvore da missão principal indicada na ficha"],{p:"O projeto pertence a esta missão?",nao:"Se a árvore indica outra missão, refaz a etapa 4 nela. Se não indica, saída: reformular."},{p:"Passa no filtro comum da missão?",nao:"Saída: reformular."},{p:"Atua em algum elo da cadeia?",nao:"Resultado parcial, nota de aderência 1. Saída: reformular."},{p:"O elo tem estrela (cadeia prioritária)?",sim:"Aderente prioritário, nota de aderência 5.",nao:"Aderente, nota de aderência 3."},[UGE,"Registra na ficha o caminho percorrido"],{s:"Segue para a etapa 5"}]},
 {n:5,t:"Três notas com régua",curto:"Notas",quem:UGE,
  frase:"Dois leitores dão notas de 1 a 5 em três critérios, cada um com exemplos escritos do que vale 1, 3 e 5.",
  faz:"Dois analistas da Unidade de Gestão Estratégica; para fichas da Presidência, um leitor de fora.",entra:"Ficha com a nota de aderência.",sai:"Quatro notas e o valor, que é a média delas.",etiqueta:"Recebe nota como os outros; nenhuma nota barra.",
  ativ:[{p:"A ficha é de unidade ligada à Presidência?",sim:"A Unidade de Gestão Estratégica chama um leitor de fora da linha da Presidência."},["Dois leitores, em separado","Dão três notas de 1 a 5: resultados medidos, escala e articulação, Indústria 5.0"],{p:"As notas diferem em 2 pontos ou mais?",sim:"Os dois leitores conversam e registram; se persistir, decide a gerência da Unidade."},{p:"O projeto causa dano a emprego ou ambiente?",sim:"Saída: reformular."},[UGE,"Calcula o valor: média das quatro notas"],[AREA,"Vê as notas e pode apontar erro de fato, com documento"],{s:"Segue para a etapa 6"}]},
 {n:6,t:"Farol de execução e custo",curto:"Farol",quem:SUPX,
  frase:"Um sinal verde, amarelo ou vermelho diz se o projeto consegue andar e quanto custa. Não entra na nota.",
  faz:"A Superintendência Executiva, com fatos de orçamento e contratos.",entra:"Ficha pontuada.",sai:"Farol e custo confirmados.",
  ativ:[[SUPX,"Confere os fatos: contrato ou convênio assinado, histórico de execução, dependência de terceiros"],[SUPX,"Confirma o custo: dinheiro já comprometido e dinheiro novo pedido"],{p:"Há pendência de execução?",nao:"Farol verde."},{p:"A pendência trava o projeto?",nao:"Farol amarelo: segue com condição.",sim:"Farol vermelho: projeto travado."},{s:"Segue para a etapa 7"}]},
 {n:7,t:"Recomendação",curto:"Recomendação",quem:UGE,
  frase:"A esteira ordena os projetos, vê até onde o dinheiro alcança e sugere uma saída para cada um.",
  faz:"A Unidade de Gestão Estratégica.",entra:"Notas, valor, farol e custo.",sai:"Lista com uma linha por projeto e mapa do conjunto.",etiqueta:"Entra primeiro no teto; a lista mostra quanto consome e se o projeto passaria sem a etiqueta.",
  ativ:[[UGE,"Reserva primeiro o dinheiro dos projetos com etiqueta"],[UGE,"Ordena os demais por valor e soma os pedidos até o teto: o último que cabe marca a linha"],{p:"O projeto está acima da linha?",sim:"Com farol verde ou amarelo, sugestão: priorizar (amarelo, com condição). Com farol vermelho, sugestão: reformular, para destravar.",nao:"Projeto novo, sugestão: reformular. Em execução e andando, sugestão: manter, sem recurso novo. Em execução e parado, sugestão: concluir sem nova fase."},{p:"Um ponto em uma nota faria cruzar a linha?",sim:"A Unidade de Gestão Estratégica marca como caso de fronteira."},[UGE,"Monta a lista, uma linha por projeto, e o mapa do conjunto por missão"],{s:"Segue para a etapa 8"}]},
 {n:8,t:"Decisão",curto:"Decisão",quem:DIRX,
  frase:"A Diretoria Executiva decide com a lista na mão. Pode discordar da sugestão, mas escreve o motivo.",
  faz:"A Diretoria Executiva; depois, o Conselho Deliberativo aprova o plano.",entra:"Lista e mapa do conjunto.",sai:"Carteira aprovada e Plano de Ação.",etiqueta:"O Conselho recebe a lista dos etiquetados, com notas e valores.",
  ativ:[[DIRX,"Recebe a lista e o mapa do conjunto"],{p:"Segue a sugestão da lista?",sim:"Confirma a sugestão.",nao:"Decide diferente e registra o motivo."},[DIRX,"Decide os casos de fronteira e aprova a carteira do ano"],["Conselho Deliberativo","Aprova o Plano de Ação; recebe a lista de etiquetados e as sugestões alteradas"],["Ministério supervisor","Recebe o plano aprovado"],{s:"Segue para a etapa 9"}]},
 {n:9,t:"Registro e revisão",curto:"Registro",quem:UGE,
  frase:"Tudo fica guardado junto à ficha, e a nota é refeita com o que o projeto de fato entregou.",
  faz:"A Unidade de Gestão Estratégica; a Unidade de Auditoria confere por amostra.",entra:"Decisão da Diretoria Executiva.",sai:"Lições para o ciclo seguinte.",etiqueta:"A etiqueta vale por um ciclo e segue o projeto na execução.",
  ativ:[[UGE,"Guarda junto à ficha: caminho na árvore, notas, farol, sugestão e decisão"],[UGE,"No meio do ano, refaz a nota com o que o projeto entregou"],{p:"A nota caiu ou o projeto travou?",sim:"A Diretoria Executiva revê o projeto na revisão do plano, até 31 de agosto."},[UGE,"No encerramento, compara a nota de entrada com o resultado"],[AUD,"Confere, por amostra, se a régua foi aplicada como publicada"],{s:"As lições voltam para a etapa 1 do ciclo seguinte"}]}];

/* grupos do trilho: de que tamanho é a decisão em cada trecho */
const TRECHOS=[{de:1,ate:1,t:"Abertura do ciclo"},{de:2,ate:6,t:"Projeto a projeto"},{de:7,ate:9,t:"A carteira inteira"}];

/* etapa 3: as quatro perguntas, na ordem */
const PORTA=[
 {k:"completa",q:"A ficha está completa?",para:"não",efeito:"Volta à etapa 2 para completar.",d:"Todos os campos preenchidos e os documentos anexados."},
 {k:"mandato",q:"Está dentro do papel legal da Agência?",para:"não",efeito:"Saída: outro órgão.",d:"A Agência executa e articula. Não financia, não regula e não forma em escala."},
 {k:"repete",q:"Repete a entrega de outro projeto?",para:"sim",efeito:"Saída: incorporar ao projeto parecido.",d:"Mesma entrega para o mesmo público. Ponto em discussão: sobreposição pode ser positiva quando o público ou o território é outro."},
 {k:"medicao",q:"Há indicador ou plano de medição?",para:"não",efeito:"Saída: reformular, com a lista do que falta.",d:"Indicador com meta, ou um plano que diga como o resultado será medido."}];

/* etapa 5: as três notas dadas pelos leitores. A quarta, aderência, vem da árvore. */
const NOTAS3=[
 {k:"R",n:"Resultados medidos",q:"O projeto mede resultado em indicador do programa ou do Contrato de Gestão?",
  a:{1:"Sem indicador, ou meta sem método de medição",3:"Meta em indicador de benefício, com evidência registrada ou plano de medição",5:"Tudo do nível 3 e ainda resultado medido antes e depois, ou acima da meta"}},
 {k:"E",n:"Escala e articulação",q:"O projeto alcança escala e articula a rede e outros órgãos?",
  a:{1:"Ação isolada, num só lugar, ou repete outro órgão",3:"Papel da Agência definido, parceiros identificados, replicável com adaptação",5:"Tudo do nível 3 e ainda instrumento assinado ou recurso de terceiros, em mais de um lugar"}},
 {k:"I",n:"Indústria 5.0",q:"Qual o efeito do projeto sobre o trabalhador e sobre o meio ambiente?",
  a:{1:"Sem relação com trabalho ou ambiente, ou sem métrica",3:"Métrica de emprego, qualificação, emissões ou circularidade, com linha de base",5:"Tudo do nível 3 e ainda meta medida de emprego de qualidade ou de redução de impacto"}}];
const ARV_TXT={pri:"Aderente prioritário",ade:"Aderente",par:"Parcial",nad:"Não se insere na missão",des:"Descartado: não incentiva a indústria",red:"Outra missão"};

/* etapa 6: os quatro itens do farol */
const FAROL=[
 {t:"Instrumento",q:"O instrumento jurídico (convênio, contrato, acordo) existe?",a:{0:"Impedimento: sem base legal ou parceiro desistiu",1:"Sem instrumento",3:"Em licitação ou contratação",5:"Instrumento assinado"}},
 {t:"Execução histórica",q:"Quanto do orçamento previsto foi executado nos últimos anos?",a:{0:"Impedimento",1:"Abaixo de 30%, ou projeto novo sem equipe",3:"Entre 30% e 70%",5:"Acima de 70%"}},
 {t:"Dependências",q:"O projeto depende de algo fora do controle da Agência?",a:{0:"Impedimento",1:"Dependência crítica não resolvida",3:"Dependência administrável",5:"Sem dependência crítica"}},
 {t:"Prazo",q:"O cronograma cabe no ano?",a:{0:"Impedimento",1:"Prazo inviável",3:"Prazo justo",5:"Prazo folgado"}}];
const FAROL_TXT={verde:"Farol verde",amarelo:"Farol amarelo: segue com condição",vermelho:"Farol vermelho: projeto travado"};

/* as seis saídas, na ordem em que aparecem */
const SAIDAS=[["priorizar","Priorizar"],["reformular","Reformular"],["incorporar","Incorporar"],["orgao","Outro órgão"],["manter","Manter, sem recurso novo"],["concluir","Concluir sem nova fase"]];

/* a etiqueta, do início ao fim */
const ETIQUETA={frase:"Projeto com pedido formal político passa por todas as etapas, com a nota à vista, e não é barrado.",porque:"Dá um canal declarado a decisões que hoje já acontecem.",
 blocos:[["Quem pede","A área que propõe, com documento: pedido formal político, instrumento assinado ou política vigente."],["Quem concede","Só a Diretoria Executiva."],["O que muda","O projeto percorre todas as etapas e recebe nota como os outros; nenhum resultado o barra."],["O que não muda","Fora do papel legal a etiqueta não vale (ponto em aberto); projeto repetido é incorporado."],["Custo à mostra","Entra primeiro no teto; a lista mostra quanto consome e quem foi deslocado."],["Depois","Vale por um ciclo; o Conselho Deliberativo recebe a lista com notas e valores."]]};

const GLOSSARIO=[
 ["Agência","Agência Brasileira de Desenvolvimento Industrial. Executa projetos de política industrial com recursos de um contrato com o governo federal."],
 ["Projeto e ficha (Canvas)","Cada projeto é descrito em uma ficha padronizada, chamada Canvas."],
 ["Área que propõe","A unidade da Agência que quer executar o projeto."],
 ["Unidade de Gestão Estratégica","O escritório de projetos da Agência. Organiza o ciclo e dá as notas."],
 ["Superintendência Executiva","Cuida de orçamento, contratos e convênios."],
 ["Diretoria Executiva","Presidente e dois diretores. Só ela autoriza projetos."],
 ["Conselho Deliberativo","Aprova o plano anual da Agência."],
 ["Nova Indústria Brasil e missões","Política industrial do governo federal, organizada em seis missões, que são grandes temas."],
 ["Árvore da missão","Sequência de perguntas que mostra se o projeto pertence a uma missão e a uma cadeia prioritária, marcada com estrela."],
 ["Contrato de Gestão","Acordo da Agência com o ministério supervisor, com indicadores e metas anuais."],
 ["Teto de referência e linha","O teto é o dinheiro novo disponível no ano. A linha é o ponto da lista ordenada em que esse dinheiro acaba."],
 ["Farol","Sinal verde, amarelo ou vermelho sobre execução e custo."],
 ["Caso de fronteira","Projeto que cruzaria a linha com um ponto a mais ou a menos em uma nota."],
 ["Etiqueta de relevância política","Marca dada pela Diretoria Executiva a projeto com pedido formal político."]];
const ABERTOS=["Quem dá as notas e quantos leitores.","Se a etiqueta vence também o limite legal do papel da Agência.","Qual é o teto de referência.","O reagrupamento dos critérios em quatro notas, ainda não combinado com a Agência.","Se sobreposição entre projetos é positiva ou negativa.","O limiar do farol e o critério de \"está andando\"."];

const MISSOES={M1:"Agroindústria",M2:"Saúde",M3:"Infraestrutura e cidades",M4:"Transformação digital",M5:"Bioeconomia e energia",M6:"Soberania e defesa",T:"Transversal"};
const DIRETORIAS={DISTT:"Industrialização Sustentável e Transformação Tecnológica",DIEI:"Inteligência e Economia da Indústria",PRES:"Presidência"};

/* exemplo fictício: nenhum projeto real. "ate" é a etapa até onde o exemplo já vem preenchido. */
const DEMO={ciclo:{ciclo:"2027",teto:24000000,tetoFonte:"Valor inventado para o exemplo",dataFichas:"2026-10-30",dataDecisao:"2026-11-25"},
 projetos:[
 {code:"F01",nome:"Rede de laboratórios abertos de manufatura",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M4",novos:6200000,ate:9,arv:"pri",n:[[5,4,4],[4,4,4]],exq:[5,5,5,5],dec:{tipo:"seguir"}},
 {code:"F02",nome:"Painel de inteligência de cadeias produtivas",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M4",novos:5000000,ate:8,arv:"ade",n:[[5,4,4],[4,4,4]],exq:[5,3,5,5]},
 {code:"F03",nome:"Selo de eficiência para pequenas indústrias",dir:"DISTT",unidade:"Tecnologias Sustentáveis",missao:"M5",novos:4800000,ate:8,arv:"pri",n:[[4,3,5],[4,4,5]],exq:[0,5,3,5]},
 {code:"F04",nome:"Corredor logístico de ônibus elétricos",dir:"DISTT",unidade:"Indústria Verde",missao:"M3",novos:9500000,novo:true,ate:8,arv:"pri",n:[[3,3,3],[2,3,3]],exq:[1,1,3,5]},
 {code:"F05",nome:"Observatório de insumos para a saúde",dir:"DIEI",unidade:"Monitoramento e Avaliação",missao:"M2",novos:2600000,ate:9,arv:"ade",n:[[3,3,3],[3,3,2]],exq:[5,5,5,5],dec:{tipo:"diferente",saida:"priorizar",motivo:"Compromisso assumido em acordo de cooperação vigente."}},
 {code:"F06",nome:"Plataforma de compras de defesa",dir:"PRES",unidade:"Presidência",missao:"M6",novos:7000000,novo:true,ate:8,arv:"par",n:[[2,3,2],[2,2,2]],exq:[1,1,3,3],tag:true},
 {code:"F07",nome:"Capacitação digital de trabalhadores",dir:"DISTT",unidade:"Transformação Digital",missao:"M4",novos:5500000,novo:true,ate:8,arv:"ade",n:[[4,4,4],[4,4,4]],exq:[5,5,5,5]},
 {code:"F08",nome:"Bioinsumos para a agricultura familiar",dir:"DISTT",unidade:"Novos Negócios",missao:"M1",novos:3900000,ate:6,arv:"ade",n:[[4,3,4],[4,3,4]]},
 {code:"F09",nome:"Diagnóstico de maturidade industrial",dir:"DIEI",unidade:"Ambiente de Negócios",missao:"M4",novos:0,ate:8,arv:"ade",n:[[3,3,3],[3,3,3]],exq:[5,3,5,5]},
 {code:"F10",nome:"Portal de dados abertos da indústria",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M4",novos:0,ate:8,arv:"ade",n:[[3,2,3],[3,2,3]],exq:[5,1,3,5]},
 {code:"F11",nome:"Rede de polos de inovação regional",dir:"PRES",unidade:"Polos de tecnologia",missao:"M4",novos:4100000,ate:5,arv:"pri",n:[[4,5,3]]},
 {code:"F12",nome:"Fundo de crédito para máquinas",dir:"DISTT",unidade:"Novos Negócios",missao:"M1",novos:8000000,novo:true,ate:3,porta:{mandato:"não"}},
 {code:"F13",nome:"Segundo painel de cadeias produtivas",dir:"DIEI",unidade:"Monitoramento e Avaliação",missao:"M4",novos:1800000,novo:true,ate:3,porta:{repete:"sim"}},
 {code:"F14",nome:"Biorrefinaria piloto",dir:"DISTT",unidade:"Indústria Verde",missao:"M5",novos:5600000,novo:true,ate:4},
 {code:"F15",nome:"Feira de fornecedores de saneamento",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M3",novos:1500000,novo:true,ate:2},
 {code:"F16",nome:"Estudo de cadeias sem medição",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M5",novos:2200000,novo:true,ate:3,porta:{medicao:"não"}}]};
if(typeof module!=="undefined"&&module.exports) module.exports={ETAPAS,PORTA,NOTAS3,FAROL,SAIDAS,DEMO};

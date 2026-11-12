/* ===== Matriz de priorização da carteira · conteúdo: as nove etapas, a régua e o exemplo fictício =====
   Textos do fluxo das nove etapas (quadro de trabalho no Miro), alinhados à planilha "Matriz de Priorização ABDI 2027", versão 0.7 (11/11/2026).
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
  ativ:[[UGE,"Revê a régua com as lições do ciclo anterior"],[UGE,"Atualiza as árvores das seis missões e as cadeias com estrela"],[UGE,"Escreve a régua: perguntas de elegibilidade, quatro notas com exemplos e itens do farol"],[DIRX,"Fixa o teto de referência (dinheiro novo do ano) e as datas"],[UGE,"Publica as regras e orienta as áreas"],{s:"Segue para a etapa 2"}]},
 {n:2,t:"Canvas",curto:"Canvas",quem:AREA,
  frase:"A área que quer executar um projeto descreve o que pretende fazer e junta as provas.",
  faz:"A área que propõe.",entra:"Regras publicadas.",sai:"Canvas entregue.",etiqueta:"A área pede a etiqueta à Diretoria Executiva, com documento.",
  ativ:[[AREA,"Tem um projeto novo ou quer continuar um projeto"],[AREA,"Preenche o Canvas: objetivo, entregas, orçamento e indicadores"],[AREA,"Completa o Canvas com a página de missão, medição, parceiros, emprego e ambiente, execução e custo"],[AREA,"Anexa documentos: contrato, convênio, relatório de resultado"],{p:"Há pedido formal político para este projeto?",sim:"A Diretoria Executiva confere o documento e decide se concede a etiqueta de relevância política.",nao:"Segue sem etiqueta."},[AREA,"Envia o Canvas à Unidade de Gestão Estratégica até a data"],{s:"Segue para a etapa 3"}]},
 {n:3,t:"Elegibilidade",curto:"Elegibilidade",quem:UGE,
  frase:"Perguntas de sim ou não, sem nota, decidem se o Canvas segue adiante.",
  faz:"A Unidade de Gestão Estratégica; a Unidade Jurídica dá parecer quando há dúvida legal.",entra:"Canvas entregue.",sai:"Canvas aceito, devolvido ou uma saída, e o alerta de repetição de entrega.",etiqueta:"Só o limite legal barra (ponto em aberto); o resto vira pendência anotada.",
  ativ:[[UGE,"Recebe o Canvas e faz quatro perguntas, nesta ordem"],{p:"O Canvas está completo?",nao:"Volta à etapa 2 para completar."},{p:"Está dentro do papel legal da Agência?",nao:"Saída: outro órgão."},{p:"Repete a entrega de outro projeto?",sim:"Alerta de repetição: o projeto segue, e o alerta acompanha a sugestão e a decisão."},{p:"Há indicador ou plano de medição?",nao:"Saída: reformular, com a lista do que falta."},[UGE,"Anota pendências e aceita o Canvas"],{s:"Segue para a etapa 4"}]},
 {n:4,t:"Vínculo à Nova Indústria Brasil",curto:"Vínculo",quem:UGE,
  frase:"Uma sequência de perguntas mostra se o projeto pertence à missão e a uma cadeia prioritária.",
  faz:"A Unidade de Gestão Estratégica, com as respostas do Canvas.",entra:"Canvas aceito.",sai:"Nota de aderência 1, 3 ou 5, vínculo com a missão e com a ABDI 5.0. Ninguém atribui essa nota: ela decorre das respostas.",etiqueta:"O resultado é anotado, mas não barra.",
  ativ:[[UGE,"Abre a árvore da missão principal indicada no Canvas"],{p:"O projeto pertence a esta missão?",nao:"Se a árvore indica outra missão, refaz a etapa 4 nela. Se não indica, saída: reformular."},{p:"Passa no filtro comum da missão?",nao:"Saída: reformular."},{p:"Atua em algum elo da cadeia?",nao:"Resultado parcial, nota de aderência 1. Saída: reformular."},{p:"O projeto atende à regra de prioridade da missão?",sim:"Aderente prioritário, nota de aderência 5.",nao:"Aderente, nota de aderência 3."},[UGE,"Registra no Canvas o caminho percorrido"],[UGE,"Liga o projeto aos quatro eixos da ABDI 5.0, pelo elo da árvore ou por leitura direta do Canvas: é classificação, não muda a nota"],{s:"Segue para a etapa 5"}]},
 {n:5,t:"Pontuação",curto:"Pontuação",quem:UGE,
  frase:"Dois leitores dão notas de 1 a 5 em três critérios, cada um com exemplos escritos do que vale 1, 3 e 5.",
  faz:"Dois analistas da Unidade de Gestão Estratégica; para Canvas da Presidência, um leitor de fora.",entra:"Canvas com a nota de aderência.",sai:"Quatro notas e o valor, que é a média delas.",etiqueta:"Recebe nota como os outros; nenhuma nota barra.",
  ativ:[{p:"O Canvas é de unidade ligada à Presidência?",sim:"A Unidade de Gestão Estratégica chama um leitor de fora da linha da Presidência."},["Dois leitores, em separado","Dão três notas de 1 a 5: resultados medidos, escala e articulação, Indústria 5.0"],{p:"As notas diferem em 2 pontos ou mais?",sim:"Os dois leitores conversam e registram; se persistir, decide a gerência da Unidade."},{p:"O projeto causa dano a emprego ou ambiente?",sim:"Saída: reformular."},[UGE,"Calcula o valor: média das quatro notas"],[AREA,"Vê as notas e pode apontar erro de fato, com documento"],{s:"Segue para a etapa 6"}]},
 {n:6,t:"Farol",curto:"Farol",quem:SUPX,
  frase:"Um sinal verde, amarelo ou vermelho diz se o projeto consegue andar e quanto custa. Não entra na nota.",
  faz:"A Superintendência Executiva, com fatos de orçamento e contratos.",entra:"Canvas pontuado.",sai:"Farol e custo confirmados.",
  ativ:[[SUPX,"Confere os fatos: contrato ou convênio assinado, histórico de execução, dependência de terceiros"],[SUPX,"Confirma o custo: dinheiro já comprometido e dinheiro novo pedido"],{p:"Há pendência de execução?",nao:"Farol verde."},{p:"A pendência trava o projeto?",nao:"Farol amarelo: segue com condição.",sim:"Farol vermelho: projeto travado."},{s:"Segue para a etapa 7"}]},
 {n:7,t:"Portfólio",curto:"Portfólio",quem:UGE,
  frase:"A matriz ordena os projetos, vê até onde o dinheiro alcança e sugere uma saída para cada um.",
  faz:"A Unidade de Gestão Estratégica.",entra:"Notas, valor, farol e custo.",sai:"Lista com uma linha por projeto, mapa do conjunto e análise de sensibilidade.",etiqueta:"Entra primeiro no teto; a lista mostra quanto consome e se o projeto passaria sem a etiqueta.",
  ativ:[[UGE,"Reserva primeiro o dinheiro dos projetos com etiqueta"],[UGE,"Ordena os demais por valor e soma os pedidos até o teto: o último que cabe marca a linha"],{p:"O projeto está acima da linha?",sim:"Com farol verde ou amarelo, sugestão: priorizar (amarelo, com condição). Com farol vermelho, sugestão: reformular, para destravar.",nao:"Projeto novo, sugestão: reformular. Em execução e andando, sugestão: manter, sem recurso novo. Em execução e parado, sugestão: concluir sem nova fase."},{p:"Um ponto em uma nota faria cruzar a linha?",sim:"A Unidade de Gestão Estratégica marca como caso de fronteira."},[UGE,"Monta a lista, uma linha por projeto, e o mapa do conjunto por missão"],[UGE,"Testa a lista na análise de sensibilidade: outros pesos, as notas de um leitor só, outra aderência mínima e outros tetos"],{p:"O projeto muda de lado da linha ou de posição conforme o cenário?",sim:"Pede julgamento adicional da Diretoria Executiva."},{s:"Segue para a etapa 8"}]},
 {n:8,t:"Decisão",curto:"Decisão",quem:DIRX,
  frase:"A Diretoria Executiva decide com a lista na mão. Pode discordar da sugestão, mas escreve o motivo.",
  faz:"A Diretoria Executiva; depois, o Conselho Deliberativo aprova o plano.",entra:"Lista e mapa do conjunto.",sai:"Carteira aprovada e Plano de Ação.",etiqueta:"O Conselho recebe a lista dos etiquetados, com notas e valores.",
  ativ:[[DIRX,"Recebe a lista e o mapa do conjunto"],{p:"Segue a sugestão da lista?",sim:"Confirma a sugestão.",nao:"Decide diferente e registra o motivo."},[DIRX,"Decide os casos de fronteira e aprova a carteira do ano"],["Conselho Deliberativo","Aprova o Plano de Ação; recebe a lista de etiquetados e as sugestões alteradas"],["Ministério supervisor","Recebe o plano aprovado"],{s:"Segue para a etapa 9"}]},
 {n:9,t:"Registro e revisão",curto:"Registro",quem:UGE,
  frase:"Tudo fica guardado junto ao Canvas, e a nota é refeita com o que o projeto de fato entregou.",
  faz:"A Unidade de Gestão Estratégica; a Unidade de Auditoria confere por amostra.",entra:"Decisão da Diretoria Executiva.",sai:"Lições para o ciclo seguinte.",etiqueta:"A etiqueta vale por um ciclo e segue o projeto na execução.",
  ativ:[[UGE,"Guarda junto ao Canvas: caminho na árvore, notas, farol, sugestão e decisão"],[UGE,"No meio do ano, refaz a nota com o que o projeto entregou"],{p:"A nota caiu ou o projeto travou?",sim:"A Diretoria Executiva revê o projeto na revisão do plano, até 31 de agosto."},[UGE,"No encerramento, compara a nota de entrada com o resultado"],[AUD,"Confere, por amostra, se a régua foi aplicada como publicada"],{s:"As lições voltam para a etapa 1 do ciclo seguinte"}]}];

/* grupos do trilho: de que tamanho é a decisão em cada trecho */
const TRECHOS=[{de:1,ate:1,t:"Abertura do ciclo"},{de:2,ate:6,t:"Projeto a projeto"},{de:7,ate:9,t:"A carteira inteira"}];

/* etapa 3: as quatro perguntas, na ordem */
const PORTA=[
 {k:"completa",q:"O Canvas está completo?",para:"não",efeito:"Volta à etapa 2 para completar.",d:"Todos os campos preenchidos e os documentos anexados."},
 {k:"mandato",q:"Está dentro do papel legal da Agência?",para:"não",efeito:"Saída: outro órgão.",d:"A Agência executa e articula. Não financia, não regula e não forma em escala."},
 {k:"repete",q:"Repete a entrega de outro projeto?",para:"sim",efeito:"Alerta de repetição: o projeto segue, e o alerta acompanha a sugestão e a decisão. Só tira o projeto (saída: incorporar) se a régua mandar.",d:"Mesma entrega para o mesmo público. Público ou território diferente não é repetição."},
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

/* quando a matriz sugere cada saída (etapa 7) */
const SAIDAS_QUANDO={priorizar:"Acima da linha do teto com farol verde ou amarelo (amarelo: com condição), ou projeto com etiqueta, que entra primeiro no teto.",
 reformular:"Sem indicador nem plano de medição; não se insere na missão; aderência abaixo da mínima; dano a emprego ou ambiente; acima da linha mas travado (farol vermelho); ou projeto novo abaixo da linha.",
 incorporar:"Repete a entrega de outro projeto, só quando a régua manda a repetição tirar o projeto. Pela regra de 11/11/2026, a repetição gera alerta, e esta saída fica como opção da Diretoria Executiva na decisão.",
 orgao:"Fora do papel legal da Agência (pergunta 2 da elegibilidade).",
 manter:"Projeto em execução, abaixo da linha ou sem pedido de recurso novo, e andando.",
 concluir:"Projeto em execução, abaixo da linha ou sem pedido de recurso novo, e parado."};
/* bases de uma resposta dada sem que o Canvas diga tudo: documento, triangulação ou suposição */
const BASES=["Documento","Triangulação","Suposição"];

/* a etiqueta, do início ao fim */
const ETIQUETA={frase:"Projeto com pedido formal político passa por todas as etapas, com a nota à vista, e não é barrado.",porque:"Dá um canal declarado a decisões que hoje já acontecem.",
 blocos:[["Quem pede","A área que propõe, com documento: pedido formal político, instrumento assinado ou política vigente."],["Quem concede","Só a Diretoria Executiva."],["O que muda","O projeto percorre todas as etapas e recebe nota como os outros; nenhum resultado o barra."],["O que não muda","Fora do papel legal a etiqueta não vale (ponto em aberto). Repetir a entrega de outro projeto gera alerta, com ou sem etiqueta."],["Custo à mostra","Entra primeiro no teto; a lista mostra quanto consome e quem foi deslocado."],["Depois","Vale por um ciclo; o Conselho Deliberativo recebe a lista com notas e valores."]]};

const GLOSSARIO=[
 ["Agência","Agência Brasileira de Desenvolvimento Industrial. Executa projetos de política industrial com recursos de um contrato com o governo federal."],
 ["Projeto e Canvas","Cada projeto é descrito em um formulário padronizado, chamado Canvas."],
 ["Área que propõe","A unidade da Agência que quer executar o projeto."],
 ["Unidade de Gestão Estratégica","O escritório de projetos da Agência. Organiza o ciclo e dá as notas."],
 ["Superintendência Executiva","Cuida de orçamento, contratos e convênios."],
 ["Diretoria Executiva","Presidente e dois diretores. Só ela autoriza projetos."],
 ["Conselho Deliberativo","Aprova o plano anual da Agência."],
 ["Nova Indústria Brasil e missões","Política industrial do governo federal, organizada em seis missões, que são grandes temas."],
 ["Árvore da missão","Sequência de perguntas que mostra se o projeto pertence a uma missão e se atende à regra de prioridade dela. A estrela marca o elo de cadeia prioritária: define a prioridade nas Missões 3 a 6 e só registra o vínculo nas Missões 1 e 2."],
 ["Contrato de Gestão","Acordo da Agência com o ministério supervisor, com indicadores e metas anuais."],
 ["Teto de referência e linha","O teto é o dinheiro novo disponível no ano. A linha é o ponto da lista ordenada em que esse dinheiro acaba."],
 ["Farol","Sinal verde, amarelo ou vermelho sobre execução e custo."],
 ["Caso de fronteira","Projeto que cruzaria a linha com um ponto a mais ou a menos em uma nota."],
 ["Etiqueta de relevância política","Marca dada pela Diretoria Executiva a projeto com pedido formal político."],
 ["Alerta de repetição de entrega","Aviso de que o projeto repete a entrega de outro, para o mesmo público. O projeto segue no fluxo; o alerta acompanha a sugestão e a decisão."],
 ["Vínculo com a ABDI 5.0","Classificação do projeto nos quatro eixos da ABDI 5.0 (Inteligência e conhecimento; Trabalhador do Futuro; Governança e Articulação; Difusão e Tecnologia), pelo elo da árvore ou por leitura direta do Canvas. Não entra na nota nem muda a saída sugerida."],
 ["Análise de sensibilidade","Teste da lista da etapa 7: refaz a ordem e a linha do teto com outros pesos, com as notas de um leitor só, com outra aderência mínima e com outros tetos."],
 ["Julgamento adicional","Pedido feito à Diretoria Executiva quando o projeto muda de lado da linha do teto conforme o cenário, ou se desloca três posições ou mais com pequenas alterações de peso."],
 ["Base da resposta","De onde vem cada resposta da avaliação: documento da Agência, triangulação entre documentos ou suposição declarada, sempre com a lógica escrita."]];
const ABERTOS=["Quem dá as notas e quantos leitores.","Se a etiqueta vence também o limite legal do papel da Agência.","Qual é o teto de referência.","O reagrupamento dos critérios em quatro notas, ainda não combinado com a Agência.",
 "Se sobreposição entre projetos é positiva ou negativa. Regra provisória de 11/11/2026: a repetição de entrega não tira o projeto; gera alerta.","O limiar do farol e o critério de \"está andando\".",
 "Os vínculos com a ABDI 5.0 completados pela equipe na tabela de elos e as leituras diretas do Canvas: a validar com quem pontuou a matriz de critérios e com a Unidade de Gestão Estratégica.",
 "Os parâmetros da análise de sensibilidade (5 e 10 pontos de peso, 3 posições, teto livre de 50% dos pedidos): valores de partida da equipe."];

const MISSOES={M1:"Agroindústria",M2:"Saúde",M3:"Infraestrutura e cidades",M4:"Transformação digital",M5:"Bioeconomia e energia",M6:"Soberania e defesa",T:"Transversal"};
/* como a missão aparece no quadro da carteira e nas etiquetas: título da coluna e linha de apoio (as cores ficam em estilo.css, classes m-M1 a m-T) */
const MISSAO_TIT={M1:"Missão 1",M2:"Missão 2",M3:"Missão 3",M4:"Missão 4",M5:"Missão 5",M6:"Missão 6",T:"Transversal"};
const MISSAO_SUB={...MISSOES,T:"Serve a mais de uma missão"};
const DIRETORIAS={DISTT:"Industrialização Sustentável e Transformação Tecnológica",DIEI:"Inteligência e Economia da Indústria",PRES:"Presidência"};

/* exemplo fictício: nenhum projeto real. "ate" é a etapa até onde o exemplo já vem preenchido.
   Cada projeto foi escolhido para mostrar um caso: "l" diz o que o caso mostra; "pb", "mt" e "ev" são o problema, a meta e a evidência
   que aparecem no resumo do Canvas (sem eles, entra um texto genérico). "volta": Canvas devolvido pela elegibilidade, com a nota do que falta.
   Nas leituras ("n"), o quarto número marca que o leitor viu dano a emprego ou ambiente.
   "ab": vínculo fictício com os quatro eixos da ABDI 5.0, na ordem dos eixos (1 = há vínculo), para os projetos que já passaram pela árvore. */
const DEMO={ciclo:{ciclo:"2027",teto:24000000,tetoFonte:"Valor inventado para o exemplo",dataFichas:"2026-10-30",dataDecisao:"2026-11-25"},
 projetos:[
 /* etapas 7 a 9: a carteira já montada, com as seis saídas */
 {code:"F01",nome:"Rede de laboratórios abertos de manufatura",ab:"1011",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M4",novos:6200000,ate:9,arv:"pri",n:[[5,4,4],[4,4,4]],exq:[5,5,5,5],dec:{tipo:"seguir"},
  l:"Percurso completo: aderente prioritário, farol verde, acima da linha, e a Diretoria Executiva seguiu a sugestão de priorizar."},
 {code:"F02",nome:"Painel de inteligência de cadeias produtivas",ab:"1010",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M4",novos:5000000,ate:8,arv:"ade",n:[[5,4,4],[4,4,4]],exq:[5,3,5,5],
  l:"Último projeto que cabe no teto: é ele que marca a linha. Caso de fronteira, com farol amarelo: prioriza com condição."},
 {code:"F03",nome:"Selo de eficiência para pequenas indústrias",ab:"0011",dir:"DISTT",unidade:"Tecnologias Sustentáveis",missao:"M5",novos:4800000,ate:8,arv:"pri",n:[[4,3,5],[4,4,5]],exq:[0,5,3,5],
  l:"Nota alta com farol vermelho: fica acima da linha, mas travado. O dinheiro dele fica retido e a sugestão é reformular, para destravar."},
 {code:"F04",nome:"Corredor logístico de ônibus elétricos",ab:"0011",dir:"DISTT",unidade:"Indústria Verde",missao:"M3",novos:9500000,novo:true,ate:8,arv:"pri",n:[[3,3,3],[2,3,3]],exq:[1,1,3,5],
  l:"Projeto novo que ficou abaixo da linha: a sugestão é reformular."},
 {code:"F05",nome:"Observatório de insumos para a saúde",ab:"1010",dir:"DIEI",unidade:"Monitoramento e Avaliação",missao:"M2",novos:2600000,ate:9,arv:"ade",n:[[3,3,3],[3,3,2]],exq:[5,5,5,5],dec:{tipo:"diferente",saida:"priorizar",motivo:"Compromisso assumido em acordo de cooperação vigente."},
  l:"A Diretoria Executiva decidiu diferente da sugestão, com motivo escrito. O caso vai para a lista do Conselho Deliberativo."},
 {code:"F06",nome:"Plataforma de compras de defesa",ab:"0010",dir:"PRES",unidade:"Presidência",missao:"M6",novos:7000000,novo:true,ate:8,arv:"par",n:[[2,3,2],[2,2,2]],exq:[1,1,3,3],tag:true,
  l:"Etiqueta de relevância política: entra primeiro no teto, mesmo com valor baixo. A lista mostra o que o projeto teria sem a etiqueta."},
 {code:"F07",nome:"Capacitação digital de trabalhadores",ab:"0101",dir:"DISTT",unidade:"Transformação Digital",missao:"M4",novos:5500000,novo:true,ate:8,arv:"ade",n:[[4,4,4],[4,4,4]],exq:[5,5,5,5],
  l:"Primeiro projeto que não cabe no teto. Caso de fronteira, do lado de fora: um ponto em uma nota mudaria o lado da linha."},
 {code:"F09",nome:"Diagnóstico de maturidade industrial",ab:"1010",dir:"DIEI",unidade:"Ambiente de Negócios",missao:"M4",novos:0,ate:8,arv:"ade",n:[[3,3,3],[3,3,3]],exq:[5,3,5,5],
  l:"Projeto em execução, sem pedido novo e andando: a sugestão é manter, sem recurso novo."},
 {code:"F10",nome:"Portal de dados abertos da indústria",ab:"1000",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M4",novos:0,ate:8,arv:"ade",n:[[3,2,3],[3,2,3]],exq:[5,1,3,5],
  l:"Projeto em execução, sem pedido novo e parado: a sugestão é concluir sem nova fase."},
 {code:"F12",nome:"Fundo de crédito para máquinas",dir:"DISTT",unidade:"Novos Negócios",missao:"M1",novos:8000000,novo:true,ate:3,porta:{mandato:"não"},
  l:"Saiu na elegibilidade, pela pergunta 2: conceder crédito está fora do papel legal da Agência. Saída: outro órgão."},
 {code:"F13",nome:"Segundo painel de cadeias produtivas",dir:"DIEI",unidade:"Monitoramento e Avaliação",missao:"M4",novos:1800000,novo:true,ate:3,porta:{repete:"sim",nota:"Repete a entrega do F02, Painel de inteligência de cadeias produtivas."},
  l:"Repete a entrega do F02. Pela regra de 11/11/2026, a repetição não tira o projeto: ele segue para a árvore com alerta, e o alerta acompanha a sugestão e a decisão."},
 {code:"F16",nome:"Estudo de cadeias sem medição",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M5",novos:2200000,novo:true,ate:3,porta:{medicao:"não"},
  l:"Saiu na elegibilidade, pela pergunta 4: não tem indicador nem plano de medição. Saída: reformular, com a lista do que falta."},
 /* etapa 2: Canvas */
 {code:"F15",nome:"Feira de fornecedores de saneamento",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M3",novos:1500000,novo:true,ate:2,
  pb:"Empresas de saneamento não conhecem os fabricantes nacionais de tubos, bombas e hidrômetros.",mt:"Reunir 80 fabricantes e 30 compradores em uma feira até setembro de 2027. Indicador: contratos fechados em seis meses.",ev:"Edição fictícia anterior: 12 contratos fechados.",
  l:"Canvas ainda não enviado. A área diz se o projeto é novo e se há pedido formal político, e envia."},
 {code:"F17",nome:"Qualificação de fornecedores de ônibus elétricos",dir:"DISTT",unidade:"Indústria Verde",missao:"M3",novos:3200000,novo:true,ate:2,volta:"Faltam as datas das entregas e o orçamento separado por fonte.",
  pb:"Fabricantes de ônibus elétricos compram no exterior peças que pequenas indústrias brasileiras poderiam fornecer.",mt:"Qualificar 40 fornecedores até dezembro de 2027. Indicador: fornecedores homologados por montadora.",ev:"Levantamento fictício: 6 de cada 10 peças do trem de força são importadas.",
  l:"Canvas devolvido pela elegibilidade para completar. Não é reprovação: a área completa o que falta e envia de novo."},
 /* etapa 3: elegibilidade. Um caso para cada pergunta, um que passa e um com etiqueta */
 {code:"F18",nome:"Mapa de fornecedores de equipamentos médicos",dir:"DIEI",unidade:"Inteligência Competitiva",missao:"M2",novos:1900000,novo:true,ate:3,
  pb:"Hospitais públicos não sabem quais fabricantes nacionais produzem os equipamentos que hoje importam.",mt:"Não informada. O Canvas não traz meta, indicador nem as datas das entregas.",ev:"Não informada.",
  l:"Pergunta 1: o Canvas está sem meta e sem datas. Responder \"não\" devolve o Canvas à etapa 2 para completar."},
 {code:"F19",nome:"Fiscalização de conteúdo local em obras de saneamento",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M3",novos:4400000,novo:true,ate:3,
  pb:"Obras de saneamento pagas com recurso público compram tubos e bombas importados, apesar da exigência de conteúdo local.",mt:"Fiscalizar 120 contratos por ano e aplicar sanção a quem descumprir. Indicador: contratos fiscalizados.",ev:"Auditoria fictícia: 3 de cada 10 contratos descumprem a exigência.",
  l:"Pergunta 2: fiscalizar e aplicar sanção é competência de outro órgão. A saída é \"outro órgão\", mesmo com tema prioritário."},
 {code:"F20",nome:"Diagnóstico digital de pequenas indústrias",dir:"DIEI",unidade:"Ambiente de Negócios",missao:"M4",novos:2300000,novo:true,ate:3,
  pb:"Pequenas indústrias não sabem em que estágio de digitalização estão.",mt:"Aplicar o diagnóstico em 500 empresas até novembro de 2027. Indicador: empresas com diagnóstico concluído.",ev:"Pesquisa fictícia: 7 de cada 10 pequenas indústrias nunca mediram a própria maturidade digital.",
  l:"Pergunta 3: a entrega é a mesma do F09, Diagnóstico de maturidade industrial. Responder \"sim\" não tira o projeto: gera o alerta de repetição, que o acompanha até a decisão."},
 {code:"F21",nome:"Certificação de fornecedores de aerogeradores",dir:"DISTT",unidade:"Tecnologias Sustentáveis",missao:"M5",novos:3600000,novo:true,ate:3,
  pb:"Fabricantes de aerogeradores importam componentes porque os fornecedores nacionais não têm certificação aceita pelas montadoras.",mt:"Certificar 25 fornecedores até dezembro de 2027. Indicador: fornecedores certificados. Linha de base: 4. Fonte: registro das montadoras. Medição semestral.",ev:"Estudo fictício: a certificação reduz em 30% o prazo de homologação.",
  l:"Passa nas quatro perguntas: Canvas completo, dentro do papel da Agência, entrega própria e indicador com linha de base e fonte."},
 {code:"F22",nome:"Semicondutores para sistemas de defesa",dir:"PRES",unidade:"Presidência",missao:"M6",novos:6000000,novo:true,ate:3,tag:true,
  pb:"Sistemas de defesa dependem de semicondutores importados, sujeitos a restrição de exportação.",mt:"Apoiar o desenho de três chips nacionais. O Canvas não traz indicador nem plano de medição.",ev:"Não há medição anterior.",
  l:"Projeto com etiqueta e sem indicador: a falta de medição vira pendência anotada e o Canvas é aceito. Sem a etiqueta, a saída seria reformular."},
 /* etapa 4: vínculo à Nova Indústria Brasil. Os desfechos da árvore */
 {code:"F14",nome:"Biorrefinaria piloto",dir:"DISTT",unidade:"Indústria Verde",missao:"M5",novos:5600000,novo:true,ate:4,
  pb:"Resíduos da cana e da soja são queimados ou exportados sem transformação.",mt:"Operar uma biorrefinaria piloto até 2028. Indicador: toneladas de biomassa transformadas por ano.",ev:"Ensaio fictício de bancada: rendimento de 62%.",
  l:"Aceito na elegibilidade, aguarda a árvore da Missão 5. O elo de biorrefinarias está na frente de novas fontes de energia e combustíveis."},
 {code:"F23",nome:"Planta piloto de fertilizantes nitrogenados",dir:"DISTT",unidade:"Novos Negócios",missao:"M1",novos:7200000,novo:true,ate:4,
  pb:"O país importa a maior parte do fertilizante nitrogenado que consome.",mt:"Colocar em operação uma planta piloto de ureia até 2028. Indicador: toneladas produzidas por ano.",ev:"Dado fictício: 9 de cada 10 toneladas consumidas vêm de fora.",
  l:"Elo com estrela, de cadeia prioritária, e elo frágil da Missão 1. Percorra a árvore: o resultado esperado é aderente prioritário, nota 5."},
 {code:"F24",nome:"Fábrica de rastreadores e inversores solares",dir:"DISTT",unidade:"Indústria Verde",missao:"M3",novos:5200000,novo:true,ate:4,
  pb:"Usinas solares instalam rastreadores e inversores importados.",mt:"Apoiar duas fábricas nacionais até 2028. Indicador: participação nacional nos equipamentos instalados.",ev:"Dado fictício: 8 de cada 10 inversores instalados são importados.",
  l:"O Canvas indica a Missão 3, mas o projeto não se aplica a moradias: a árvore manda refazer a etapa na Missão 5."},
 {code:"F25",nome:"Doação de tratores a cooperativas",dir:"DISTT",unidade:"Novos Negócios",missao:"M1",novos:4000000,novo:true,ate:4,
  pb:"Cooperativas de pequenos produtores não têm máquinas para o plantio.",mt:"Comprar e entregar 80 tratores até outubro de 2027. Indicador: tratores entregues.",ev:"Cadastro fictício: 200 cooperativas sem trator próprio.",
  l:"Só compra e distribui máquinas, sem desenvolver fornecedor nem tecnologia nacional: a árvore termina em \"descartado\"."},
 {code:"F26",nome:"Gestão digital para agroindústrias",dir:"DISTT",unidade:"Transformação Digital",missao:"M1",novos:2800000,novo:true,ate:4,
  pb:"Agroindústrias de pequeno porte controlam a produção em papel e perdem matéria-prima.",mt:"Implantar sensores e sistema de gestão em 60 agroindústrias até 2027. Indicador: empresas com o sistema em uso.",ev:"Piloto fictício: a perda de matéria-prima caiu 12% em dez empresas.",
  l:"Leva tecnologia digital a indústrias da cadeia, sem desenvolvê-la: a árvore da Missão 1 manda avaliar na Missão 4, na adoção digital."},
 {code:"F27",nome:"Escritório de projetos da carteira",dir:"PRES",unidade:"Gestão Estratégica",missao:"T",novos:0,ate:4,
  pb:"Os projetos da carteira são acompanhados em planilhas separadas, sem padrão.",mt:"Acompanhar todos os projetos em um só sistema até junho de 2027. Indicador: projetos com relatório mensal.",ev:"Levantamento fictício: 4 de cada 10 projetos não têm relatório mensal.",
  l:"Projeto transversal: não há árvore própria. O resultado é registrado à mão, com justificativa, ou pela árvore de outra missão."},
 /* etapa 5: pontuação. As situações das duas leituras */
 {code:"F28",nome:"Rastreabilidade do algodão brasileiro",ab:"1011",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M1",novos:3100000,novo:true,ate:5,arv:"pri",n:[],
  pb:"Compradores externos pedem prova de origem do algodão, e os produtores não têm como dar.",mt:"Rastrear 30% da safra até 2028. Indicador: fardos com origem certificada. Linha de base: 5%.",ev:"Piloto fictício em duas cooperativas: prêmio de 4% no preço.",
  l:"Nenhuma leitura feita. Cada leitor dá as três notas em separado, com o Canvas ao lado. A aderência já veio da árvore."},
 {code:"F11",nome:"Rede de polos de inovação regional",ab:"1011",dir:"PRES",unidade:"Polos de tecnologia",missao:"M4",novos:4100000,ate:5,arv:"pri",n:[[4,5,3]],
  pb:"Indústrias fora das capitais não têm onde testar tecnologia nova.",mt:"Manter 12 polos em operação. Indicador: empresas atendidas por polo.",ev:"Relatório fictício: 340 empresas atendidas no ciclo anterior.",
  l:"Unidade ligada à Presidência: a segunda leitura, que falta, é de um leitor de fora da linha da Presidência."},
 {code:"F29",nome:"Laboratório de ensaios de hidrogênio",ab:"1011",dir:"DISTT",unidade:"Tecnologias Sustentáveis",missao:"M5",novos:4700000,novo:true,ate:5,arv:"ade",n:[[4,4,3],[2,4,3]],
  pb:"Fabricantes de eletrolisadores mandam os equipamentos ao exterior para ensaio e certificação.",mt:"Abrir um laboratório até 2028. Indicador: ensaios realizados por ano.",ev:"O Canvas cita um estudo de demanda, sem medição própria de resultado.",
  l:"As duas leituras diferem em 2 pontos em resultados medidos. Os leitores conciliam e registram a conversa antes de o valor sair."},
 {code:"F30",nome:"Automação de linhas de montagem",ab:"0101",dir:"DISTT",unidade:"Transformação Digital",missao:"M4",novos:5300000,ate:5,arv:"pri",n:[[4,4,2,1],[4,4,3]],
  pb:"Montadoras de pequeno porte têm baixa produtividade nas linhas manuais.",mt:"Automatizar 30 linhas até 2027. Indicador: produtividade por trabalhador. O Canvas prevê eliminar 400 postos, sem plano de requalificação.",ev:"Piloto fictício: produtividade 25% maior em três linhas.",
  l:"Um leitor apontou dano a emprego e o outro não. A conciliação decide. Com dano confirmado, a saída é reformular."},
 /* etapa 6: farol. As três cores */
 {code:"F08",nome:"Bioinsumos para a agricultura familiar",ab:"0011",dir:"DISTT",unidade:"Novos Negócios",missao:"M1",novos:3900000,ate:6,arv:"ade",n:[[4,3,4],[4,3,4]],
  pb:"Agricultores familiares compram insumos químicos caros por falta de oferta local de bioinsumos.",mt:"Apoiar 15 biofábricas comunitárias. Indicador: hectares tratados com bioinsumo.",ev:"Convênio em vigor. No ciclo anterior o projeto executou 80% do previsto e depende de registro de produto ainda em análise.",
  l:"Tem as quatro notas e aguarda o farol: quatro itens de execução e custo, que ficam fora da nota."},
 {code:"F31",nome:"Centro de usinagem compartilhada",ab:"0101",dir:"DISTT",unidade:"Difusão de Tecnologias",missao:"M4",novos:2700000,ate:6,arv:"ade",n:[[4,4,3],[4,3,3]],
  pb:"Pequenas metalúrgicas não têm escala para comprar máquinas de usinagem de precisão.",mt:"Atender 150 empresas por ano. Indicador: horas de máquina usadas.",ev:"Convênio assinado. No ciclo anterior o projeto executou 92% do previsto, não depende de terceiros e as entregas cabem no ano.",
  l:"Instrumento assinado, boa execução, sem dependência e prazo viável: os quatro itens sem pendência dão farol verde."},
 {code:"F32",nome:"Parque tecnológico em área a desapropriar",ab:"1010",dir:"PRES",unidade:"Polos de tecnologia",missao:"M4",novos:8800000,novo:true,ate:6,arv:"pri",n:[[5,4,4],[5,4,4]],
  pb:"A região não tem espaço físico para reunir empresas de base tecnológica.",mt:"Instalar 20 empresas até 2028. Indicador: empresas instaladas.",ev:"O terreno ainda precisa ser desapropriado pelo município, e o processo não começou. Não há instrumento definido.",
  l:"Nota alta, mas depende de desapropriação que não começou: é impedimento. O farol vermelho trava o projeto mesmo acima da linha."},
 {code:"F33",nome:"Núcleos de economia circular",ab:"0011",dir:"DISTT",unidade:"Tecnologias Sustentáveis",missao:"M5",novos:3400000,ate:6,arv:"ade",n:[[3,4,4],[3,4,4]],
  pb:"Indústrias pequenas pagam para descartar resíduos que outras empresas comprariam.",mt:"Manter 8 núcleos regionais. Indicador: toneladas de resíduo reaproveitadas.",ev:"No ciclo anterior o projeto executou 55% do previsto e depende de convênio estadual em negociação.",
  l:"Execução parcial e convênio em negociação são pendências administráveis: farol amarelo, segue com condição."}]};
if(typeof module!=="undefined"&&module.exports) module.exports={ETAPAS,PORTA,NOTAS3,FAROL,SAIDAS,SAIDAS_QUANDO,DEMO};

/* ---------- cadastro do Canvas (etapa 2) ----------
   Mesmas seções, campos e chaves do formulário de cadastro das versões anteriores da página (seções do guia de preenchimento do Canvas),
   para que os Canvas já gravados no banco continuem abrindo. Tipos de campo: texto (padrão), area, sel, num, radio,
   table (linhas com colunas), grades (grau de aderência por missão), temas e projetos (escolha múltipla). req:1 = obrigatório para cadastrar. */
const CV_EIXOS=["Difusão de Tecnologias","Inteligência e Conhecimento","Governança e Articulação","Trabalhador do Futuro"];
const CV_TEMAS=["Adoção e difusão tecnológica","Agro 4.0","Ampliação do acesso à saúde","ASG","Avaliação de impacto de novas tecnologias","Competências e habilidades digitais","Compras públicas","Conectividade 5G","Construções inteligentes","Espaços de dados","Disseminação de conhecimento","Economia circular","Educação","Encomendas tecnológicas","Hub de inovação","Indústria 4.0","Inovação","Jornadas de capacitação","Maturidade digital","Mobilidade","Novas tecnologias","Privacidade e segurança da informação","Qualificação profissional","Saúde","Segurança cibernética","Soluções digitais","Soluções de internet das coisas","Sustentabilidade","Transformação digital"];
const CV_MISSOES=["M1","M2","M3","M4","M5","M6","T"];
const cvMissao=m=>m==="T"?"Transversal (duas ou mais missões)":"Missão "+m.slice(1)+" · "+MISSOES[m];
const CV_BASE=["nome","dir","unidade","missao","eixo","novos","grades"];   /* campos que ficam na raiz do documento; os demais vão em "cv" */
const CV_TABELAS=["beneficios","produtos","benef","entregas","orc","indicadores"];
const CV_PASSOS=[
 {t:"Identificação",d:"Quem propõe e em que situação está o projeto.",g:["O responsável deve ser uma pessoa nomeada. Não vale escrever “equipe” ou “time”.","Na descrição da versão, diga o que mudou de forma verificável em relação à versão anterior."],
  f:[{k:"nome",l:"Nome do projeto",req:1},{k:"resp",l:"Responsável",req:1},{k:"dir",l:"Diretoria proponente",type:"sel",opts:()=>Object.keys(DIRETORIAS),lab:k=>DIRETORIAS[k],req:1},{k:"unidade",l:"Gerência ou unidade",req:1},
     {k:"situ",l:"Situação do projeto",type:"radio",opts:["Projeto novo","Projeto em andamento"],req:1},{k:"versao",l:"Descrição desta versão",type:"area",h:"Na primeira versão, escreva “Versão inicial”.",rows:2}]},
 {t:"Problema",d:"Que problema o projeto resolve e por que a Agência deve agir.",g:["Descreva o problema em até duas linhas. Se o projeto pertence a um programa, o problema é uma vertente do problema do programa.","Conecte o problema ao Planejamento Estratégico, aos indicadores e ao objetivo do projeto.","Traga números: quantas empresas, cidadãos ou governos são afetados, qual o prejuízo, e de que fonte vem a evidência (pesquisa, relatório, entrevista, comparação internacional).","Nas razões para atuar, mostre tendências locais e globais que justificam a Agência, e não outro órgão.","Adicionalidade sem evidência não conta: diga o que deixaria de acontecer sem a Agência e de onde vem essa informação."],
  f:[{k:"problema",l:"Problema em até duas linhas",type:"area",max:300,rows:2,req:1},{k:"contexto",l:"Contexto do problema",type:"area",h:"Até 30 linhas. Como ele se conecta aos desafios do Contrato de Gestão deste ano?",rows:6},{k:"numeros",l:"Tamanho do problema e evidências",type:"area",h:"Números, fontes e causas do problema.",rows:5,req:1},{k:"razoes",l:"Razões para a Agência atuar (por quê?)",type:"area",rows:4,req:1},{k:"adicional",l:"Evidência de adicionalidade",type:"area",rows:3,req:1,h:"O que deixaria de acontecer, ou aconteceria pior, sem a Agência? Traga a evidência, não só a afirmação."}]},
 {t:"Objetivo e descrição",d:"O que o projeto entrega e como.",g:["O objetivo deve ser específico, mensurável, alcançável, relevante e com prazo. Verbos como “promover”, “contribuir” e “apoiar” não são recomendados.","Exemplo de objetivo claro: “Implantar plataforma de gestão que aumente a eficiência operacional em 20% até 31 de dezembro de 2027”.","Na descrição, detalhe as etapas com quantitativos, sem repetir os objetivos e sem misturar com impactos ou produtos."],
  f:[{k:"objetivo",l:"Objetivo do projeto (o quê?)",type:"area",max:300,rows:2,req:1},{k:"descricao",l:"Descrição do projeto (como?)",type:"area",h:"Até 30 linhas, destacando a contribuição do projeto no ano do ciclo.",rows:8,req:1}]},
 {t:"Impactos",d:"Benefícios esperados e relação com sustentabilidade.",g:["Os benefícios derivam do objetivo e da descrição; seja específico (por exemplo, “redução de 15% no tempo de manejo”), não abstrato.","As três colunas são obrigatórias. Se o projeto não tiver relação com sustentabilidade, escreva “não se aplica”."],
  f:[{k:"beneficios",l:"Benefícios esperados",type:"table",add:"Adicionar benefício",cols:[{k:"b",l:"Benefício",type:"area",rows:2},{k:"asg",l:"Dimensão ambiental, social ou de governança",type:"sel",opts:["Ambiental","Social","Governança"]},{k:"ods",l:"Objetivo de Desenvolvimento Sustentável ou política relacionada"}]},{k:"indices",l:"Índices internacionais afetados pelo problema",type:"area",rows:2}]},
 {t:"Produtos e beneficiários",d:"A vitrine do projeto e quem recebe.",g:["Imagine o projeto como uma vitrine: o que estaria na prateleira para o beneficiário, que até pagaria por isso?","Cada produto precisa aparecer na descrição do projeto.","O alcance deve ser quantitativo: número de beneficiários, municípios ou outro indicativo.","Na escalabilidade, diga a abordagem, as etapas, a magnitude e por quais meios (programa, edital, comissão)."],
  f:[{k:"produtos",l:"Serviços e produtos",type:"table",add:"Adicionar produto",req:1,cols:[{k:"p",l:"Serviço ou produto"},{k:"inst",l:"Instrumento",type:"sel",opts:["Acordo de cooperação técnica","Contrato","Convênio","Memorando de entendimento","Edital","Patrocínio","Outro"]},{k:"alc",l:"Alcance previsto"}]},
     {k:"benef",l:"Beneficiários",type:"table",add:"Adicionar beneficiário",cols:[{k:"tipo",l:"Tipo",type:"sel",opts:["Pessoa jurídica","Pessoa física","Governo","Outros"]},{k:"interv",l:"Intervenção entregue"},{k:"captura",l:"Captura dos dados"},{k:"qtd",l:"Quantidade",type:"num"}]},
     {k:"semelhantes",l:"Projetos da Agência com entregas semelhantes",type:"projetos",h:"Marque os projetos que entregam algo parecido. A etapa de elegibilidade usa esta informação para decidir se o projeto deve ser incorporado a outro."},{k:"diferenca",l:"O que este projeto entrega de diferente",type:"area",rows:2},
     {k:"escala",l:"Estratégia de escalabilidade",type:"area",rows:4}]},
 {t:"Cronograma",d:"Entregas relevantes do ano e as atividades de cada uma.",g:["Toda atividade se liga a uma entrega relevante, e o cronograma deriva da descrição do projeto.","Dê mais tempo às atividades mais complexas. O ritmo de execução é avaliado pela quantidade e complexidade das atividades.","Indique riscos de forma específica: que etapa ou atividade cada risco pode afetar."],
  f:[{k:"entregas",l:"Entregas relevantes",type:"table",add:"Adicionar entrega",req:1,cols:[{k:"nome",l:"Entrega relevante"},{k:"ativ",l:"Atividades (uma por linha)",type:"area",rows:3},{k:"ini",l:"Início",type:"date"},{k:"fim",l:"Fim",type:"date"}]},
     {k:"riscos",l:"Riscos e dependências",type:"area",rows:3}]},
 {t:"Orçamento",d:"Estimativa macro de custos para o ano do ciclo.",g:["Cada despesa corresponde a atividades e entregas previstas. Se não houver despesa, explique por quê.","O detalhamento mês a mês fica na planilha da Unidade Financeira."],
  f:[{k:"orc",l:"Despesas",type:"table",add:"Adicionar despesa",cols:[{k:"d",l:"Descrição da despesa"},{k:"abdi",l:"Fonte da Agência, em reais",type:"num"},{k:"terc",l:"Fonte de terceiros, em reais",type:"num"}]},
     {k:"novos",l:"Recursos novos pedidos para o ano, em reais",type:"num",req:1,h:"Parte do orçamento da Agência que ainda não está comprometida. Escreva 0 se não há pedido novo: sem pedido novo, o projeto não disputa recurso."}]},
 {t:"Indicadores",d:"Conexão com o Planejamento Estratégico e o Contrato de Gestão.",g:["Ao menos um indicador precisa ser aderente a um dos indicadores estratégicos do Contrato de Gestão 2024-2029.","Associe apenas um objetivo estratégico a cada indicador.","A descrição fala do que o indicador mede, não do projeto.","Periodicidade em formato padrão: mensal, semestral, anual. A base de referência explica de onde veio a meta."],
  f:[{k:"objEst",l:"Objetivo estratégico associado (Planejamento Estratégico 2024-2029)",req:1},
     {k:"indicadores",l:"Indicadores do projeto",type:"table",add:"Adicionar indicador",req:1,cols:[{k:"nome",l:"Nome do indicador"},{k:"cg",l:"Indicador estratégico do Contrato de Gestão associado"},{k:"contrib",l:"Contribuição para o indicador estratégico",type:"area",rows:2},{k:"desc",l:"Descrição: o que é medido",type:"area",rows:2},{k:"unid",l:"Unidade"},{k:"base",l:"Base de referência da meta"},{k:"meta",l:"Meta do ano"},{k:"calc",l:"Forma de cálculo",type:"area",rows:2},{k:"fonte",l:"Fonte do dado"},{k:"coleta",l:"Forma de coleta"},{k:"per",l:"Periodicidade",type:"sel",opts:["Mensal","Trimestral","Semestral","Anual"]},{k:"prem",l:"Premissas",type:"area",rows:2},{k:"h24",l:"Resultado 2024"},{k:"h25",l:"Resultado 2025"},{k:"h26",l:"Resultado 2026"}]}]},
 {t:"Missão e alinhamento",d:"Critérios objetivos de apoio à decisão da Diretoria Executiva.",g:["A missão principal define a árvore que o projeto percorre na etapa 4.","O vínculo vale para uma missão principal e, no máximo, uma secundária. Vínculo com muitas prioridades deixa de selecionar projetos.","Grau de aderência declarado: 0 sem relação, 1 indireta, 2 parcial (cadeia ou instrumento da missão), 3 direta (meta da missão). É só a declaração da área: a nota de aderência vem da árvore da missão."],
  f:[{k:"missao",l:"Missão principal da Nova Indústria Brasil",type:"sel",opts:()=>CV_MISSOES,lab:cvMissao,req:1},{k:"missao2",l:"Missão secundária (opcional, no máximo uma)",type:"sel",opts:()=>CV_MISSOES.slice(0,6),lab:cvMissao},{k:"eixo",l:"Eixo da ABDI 5.0",type:"sel",opts:()=>CV_EIXOS,req:1},{k:"grades",l:"Grau de aderência declarado a cada missão",type:"grades"},
     {k:"nib",l:"Instrumento da Nova Indústria Brasil a que o projeto contribui",h:"Programa ou projeto de governo, marco regulatório etc. Escreva “não se aplica” se for o caso."},{k:"politica",l:"Outra política pública de desenvolvimento industrial relacionada"},{k:"temas",l:"Temas relacionados",type:"temas"}]},
 {t:"Revisar e cadastrar",d:"Confira o que falta antes de cadastrar o Canvas."}];

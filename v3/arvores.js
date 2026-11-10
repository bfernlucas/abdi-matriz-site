/* ================= v2.0 · árvores de decisão por missão, em formato percorrível ================= */
/* Cada missão é um grafo de nós. Tipos de nó:
   - q: pergunta com opções; cada opção leva a outro nó ("to"), à categoria escolhida ("@cat"), à regra de cadeia prioritária ("@star") ou a uma saída ("out").
   - elo: lista de elos da cadeia da categoria; o elo escolhido pode ter pr:1 (cadeia prioritária ★). "none" é a saída para quem não atua em nenhum elo;
     "alts" são respostas alternativas (quase sempre redirecionamentos); "to" é o próximo nó, ou "star" decide pelo ★ do elo.
   Saídas (out): c = pri (aderente prioritário), ade (aderente), par (parcial), des (descartado), nad (não aderente), red (redirecionar para outra missão);
   oe = objetivo específico vinculado ("@cat" usa o mapa catOE da missão); red = missão de destino; prop = 1 marca saída proposta pela equipe onde o quadro do Miro não tinha destino.
   Fonte: árvores desenhadas pela equipe no quadro de trabalho (Miro), a partir do Plano de Ação 2024–2026 da Nova Indústria Brasil, edição atualizada (Brasil, 2025), e das fontes setoriais indicadas. Transcrição em 8 de novembro de 2026. */
const PCOM="O projeto desenvolve, produz ou fortalece fornecedores, tecnologia ou conteúdo nacional em algum elo da cadeia?";
const NAO_IND="Descartado: não incentiva a indústria";
const SAI_PROP="Saída proposta pela equipe (seção 4.3.8 do Produto 3): setor correto, fora dos elos mapeados.";
const ARVD={
 M1:{nome:"Cadeias agroindustriais sustentáveis e digitais para a segurança alimentar, nutricional e energética",estado:"ausente",
  meta:"70% da agricultura familiar mecanizada, com máquinas nacionais.",
  pend:["Árvore ainda não desenhada. Três árvores já redirecionam projetos para esta missão: adoção digital pela agroindústria (Missão 4), drones e máquinas agrícolas (Missões 4 e 6) e bioinsumos agrícolas e alimentos (Missão 5).",
   "Enquanto não há árvore, o filtro 2 é respondido manualmente e a aderência usa o grau declarado no Canvas, com a marca de provisório.",
   "A pontuação usa descrições provisórias para a missão: máquinas agrícolas e agricultura de precisão, fertilizantes e bioinsumos, têxtil."]},
 M2:{nome:"Complexo econômico-industrial da saúde resiliente para reduzir as vulnerabilidades do Sistema Único de Saúde e ampliar o acesso à saúde",estado:"completa",
  fonte:"Gadelha et al. (2025) para os elos; objetivos II e IV da missão para a pesquisa e desenvolvimento; Portaria GM/MS nº 2.261/2023 para a prioridade.",
  catOE:{A:"2.1 a 2.3",B:"2.3",C:"2.4",D:"2.4",E:"2.4"},
  oes:[["2.1","Medicamentos e princípios ativos biológicos: produzir no país 50% das necessidades em 2026 e 70% em 2033 (linha de base 42%)."],["2.2","Vacinas, hemoderivados e terapias avançadas: 50% em 2026 e 70% em 2033."],["2.3","Dispositivos médicos: 50% em 2026 e 70% em 2033."],["2.4","Capacidades transversais (pesquisa e desenvolvimento, serviços, informação e conectividade), sem meta quantitativa."]],
  regra:"O ★ só registra o vínculo com a meta de 50% e 70%; a prioridade depende de o projeto responder a um desafio da Matriz de Desafios Produtivos e Tecnológicos em Saúde. Os programas do complexo (parcerias para o desenvolvimento produtivo e assemelhados) não entram na árvore: são avaliados na pontuação, como articulação institucional com o Ministério da Saúde.",
  pend:["As categorias C e D não têm saída para \"nenhum elo\" no quadro; aqui usam a saída proposta \"parcial\".","O objetivo 2.4 não tem vínculo registrado em nenhuma saída do quadro; aqui as categorias C, D e E vinculam-se a ele."],
  nos:{
   p0:{tipo:"q",k:"P0",t:"O projeto atua no complexo econômico-industrial da saúde? Em qual subsistema?",opts:[
    {t:"Base química e biotecnológica",cat:"A",to:"pc"},{t:"Mecânica, eletrônica e materiais",cat:"B",to:"pc"},{t:"Serviços de saúde",cat:"C",to:"pc"},{t:"Informação e conectividade",cat:"D",to:"pc"},{t:"Pesquisa e desenvolvimento em saúde",cat:"E",to:"pc"},
    {t:"Nenhum desses",out:{c:"nad",t:"Não se insere na Missão 2"}}]},
   pc:{tipo:"q",k:"P-comum",el:1,t:"O projeto desenvolve, produz ou fortalece fornecedores, tecnologia ou conteúdo nacional em algum elo do complexo econômico-industrial da saúde?",opts:[{t:"Sim",to:"@cat"},{t:"Não: apenas aquisição, implantação ou consumo",out:{c:"des",t:NAO_IND}}]},
   eA:{tipo:"elo",k:"A1",t:"Em qual elo o projeto atua?",src:"Gadelha et al., 2025",elos:[
    {t:"Química fina: síntese de insumos farmacêuticos ativos e medicamentos",pr:1},{t:"Insumos naturais e biodiversidade (extratos, plantas medicinais, fitoterápicos)"},{t:"Biotecnologia: insumos farmacêuticos biológicos e biossimilares",pr:1},{t:"Vacinas, soros e hemoderivados",pr:1},{t:"Terapias avançadas",pr:1},{t:"Reagentes para diagnóstico in vitro",pr:1}],
    alts:[{t:"Biodiversidade sem aplicação em saúde",out:{c:"red",red:"M5",t:"Avaliar na Missão 5"}}],none:{out:{c:"nad",t:"Não aderente"}},to:"q1"},
   eB:{tipo:"elo",k:"B1",t:"Em qual elo o projeto atua?",src:"Gadelha et al., 2025",elos:[
    {t:"Equipamentos mecânicos",pr:1},{t:"Equipamentos eletroeletrônicos, inclusive diagnóstico por imagem",pr:1},{t:"Próteses, órteses e implantes",pr:1},{t:"Consumíveis e materiais de uso médico",pr:1},{t:"Dispositivos de diagnóstico",pr:1}],
    none:{out:{c:"nad",t:"Não aderente"}},to:"q1"},
   eC:{tipo:"elo",k:"C1",t:"Em qual elo o projeto atua?",src:"Gadelha et al., 2025",elos:[
    {t:"Atenção primária"},{t:"Hospitais: geração e validação de inovações clínicas, de processos e organizacionais"},{t:"Ambulatórios"},{t:"Serviços de diagnóstico: inteligência artificial para apoio à decisão e laudos"},{t:"Logística, varejo e distribuição"}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"c2"},
   c2:{tipo:"q",k:"C2",el:1,t:"O serviço é espaço de desenvolvimento, validação ou incorporação de tecnologia nacional?",opts:[{t:"Sim",to:"q1"},{t:"Não",out:{c:"des",t:"Descartado: apenas amplia ou mantém a oferta assistencial"}}]},
   eD:{tipo:"elo",k:"D1",t:"Em qual elo o projeto atua?",src:"Gadelha et al., 2025",elos:[
    {t:"Plataformas e infraestrutura de dados"},{t:"Prontuário e registros de saúde"},{t:"Telessaúde e monitoramento remoto"},{t:"Inteligência para gestão (projeção da demanda de medicamentos)"},{t:"Inteligência artificial aplicada à pesquisa e desenvolvimento (se o resultado for molécula ou candidato, classificar na categoria E)"}],
    alts:[{t:"Tecnologia da informação sem aplicação específica em saúde",out:{c:"red",red:"M4",t:"Avaliar na Missão 4"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"d2"},
   d2:{tipo:"q",k:"D2",t:"Os dados e a tecnologia permanecem sob domínio nacional?",opts:[{t:"Sim",to:"q1"},{t:"Não",out:{c:"par",t:"Parcial: solução digital sem domínio nacional dos dados"}}]},
   eE:{tipo:"elo",k:"E1",t:"Em qual elo o projeto atua?",src:"objetivos II e IV da missão",elos:[
    {t:"Descoberta de novas moléculas e alvos terapêuticos"},{t:"Triagem in silico (previsão de eficácia e efeitos adversos)"},{t:"Pesquisa pré-clínica"},{t:"Pesquisa clínica"}],
    none:{out:{c:"nad",t:"Não aderente"}},to:"q1"},
   q1:{tipo:"q",k:"Q1",t:"O projeto oferece solução para um desafio da Matriz de Desafios Produtivos e Tecnológicos em Saúde (Portaria GM/MS nº 2.261/2023)?",
    lista:{t:"Quadro auxiliar: Matriz de Desafios Produtivos e Tecnológicos em Saúde",grupos:[["Bloco I: preparação do sistema de saúde para emergências sanitárias",["Emergências e doenças imunopreveníveis","Soros imunoprotetores","Hemoderivados, bioprodutos e hemoterapia","Vulnerabilidade tecnológica e econômica para acesso","Desenvolvimento sustentável e química verde","Tecnologias para sistemas de saúde"]],["Bloco II: doenças e agravos críticos para o Sistema Único de Saúde",["Doenças e populações negligenciadas","Cânceres de maior incidência e pediátricos","Doenças cardiovasculares","Diabetes","Doenças associadas ao envelhecimento","Doenças raras","Outras doenças crônicas não transmissíveis"]]]},
    opts:[{t:"Sim",out:{c:"pri",oe:"@cat"}},{t:"Não",out:{c:"ade",oe:"@cat"}}]}}},
 M3:{nome:"Infraestrutura, saneamento, moradia e mobilidade sustentáveis para a integração produtiva e o bem-estar nas cidades",estado:"completa",
  fonte:"Barassa (2024, Comissão Econômica para a América Latina e o Caribe) para os ônibus elétricos; Instituto de Economia da Universidade Estadual de Campinas (2026) para a ferrovia; quadros de água e saneamento e de energia solar fotovoltaica sem fonte indicada.",
  catOE:{A:"3.3",B:"3.2",C:"3.3"},
  oes:[["3.1","Moradia sustentável: 2,0 milhões de moradias do Programa Minha Casa, Minha Vida em 2026 (500 mil com energia fotovoltaica) e 6,9 milhões em 2033 (1,4 milhão com fotovoltaica)."],["3.2","Mobilidade eletrificada com conteúdo nacional: 3% das vendas com baterias nacionais em 2026 e 33% em 2033."],["3.3","Adensamento das cadeias de infraestrutura, sem meta quantitativa."]],
  regra:"Basta atuar em elo de cadeia prioritária ★ (baterias, conjunto de propulsão, ferrovia) para ser aderente prioritário, porque a meta da missão cobre uma parte estreita dela. Nas demais categorias, a prioridade vem de qualificadores: digitalização, sistema construtivo inteligente, material sustentável, drenagem ou otimização hídrica, e aplicação no Programa Minha Casa, Minha Vida.",
  pend:["As categorias B e C não têm saída para \"nenhum elo\" no quadro; aqui usam a saída proposta \"parcial\".","A árvore aceita toda a cadeia fotovoltaica, enquanto a Nova Indústria Brasil lista equipamentos de energia verde como cadeia prioritária da Missão 5; a regra adotada na Missão 5 (aplicação habitacional aqui, o resto lá) exige ajuste simétrico nesta árvore.","A moradia dá nome à missão, mas não tem categoria própria."],
  nos:{
   p0:{tipo:"q",k:"P0",t:"Em qual setor o projeto atua?",opts:[
    {t:"Água e saneamento",cat:"A",to:"pc"},{t:"Mobilidade e logística",cat:"B",to:"pc"},{t:"Energia",cat:"C",to:"pc"},
    {t:"Telecomunicações e dados",out:{c:"red",red:"M4",t:"Avaliar na Missão 4"}},{t:"Nenhum desses",out:{c:"nad",t:"Não se insere na Missão 3"}}]},
   pc:{tipo:"q",k:"P-comum",el:1,t:PCOM,opts:[{t:"Sim",to:"@cat"},{t:"Não: apenas implantação, aquisição ou consumo",out:{c:"des",t:NAO_IND}}]},
   eA:{tipo:"elo",k:"A1",t:"Em qual elo da cadeia de água e saneamento o projeto atua?",src:"Ermakoff et al., 2022",elos:[
    {t:"Matérias-primas e insumos básicos"},{t:"Insumos intermediários (cloro-soda, dicloroetano, policloreto de vinila, polietileno de alta densidade)"},{t:"Tubulações e conexões"},{t:"Equipamentos e bens de capital (hidrômetros, bombas, estações de tratamento, automação)"},{t:"Produtos químicos para tratamento"}],
    none:{out:{c:"nad",t:"Não aderente"}},to:"a2"},
   a2:{tipo:"q",k:"A2",t:"O projeto incorpora digitalização, sistema construtivo inteligente, material sustentável, drenagem pluvial ou otimização de recursos hídricos?",opts:[{t:"Sim",to:"a3"},{t:"Não",out:{c:"ade",oe:"3.3"}}]},
   a3:{tipo:"q",k:"A3",t:"Tem aplicação no Programa Minha Casa, Minha Vida ou em outro programa de investimento?",opts:[{t:"Sim",out:{c:"pri",oe:"3.1 e 3.3"}},{t:"Não",out:{c:"pri",oe:"3.3"}}]},
   eB:{tipo:"q",k:"B1",t:"Qual subcadeia de mobilidade e logística?",opts:[{t:"Ônibus elétricos",to:"eBON"},{t:"Ferrovia",to:"eBFE"},{t:"Outros modais: caminhões, automóveis, hidrovia",out:{c:"par",t:"Parcial: fora das subcadeias mapeadas"}}]},
   eBON:{tipo:"elo",k:"B-ON",t:"Em qual elo da cadeia dos ônibus elétricos o projeto atua?",src:"Barassa, Comissão Econômica para a América Latina e o Caribe, 2024",elos:[
    {t:"Minerais críticos e metais de base"},{t:"Insumos intermediários (cátodo, ânodo, eletrólito, separadores, semicondutores de potência)"},{t:"Baterias: células, módulos, gerenciamento e gestão térmica",pr:1},{t:"Conjunto de propulsão: motores de tração, eletrônica de potência, chicotes de alta tensão",pr:1},{t:"Componentes complementares"},{t:"Integração do veículo"},{t:"Infraestrutura de recarga"},{t:"Tecnologia, normas e competências"},{t:"Economia circular das baterias"}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"3.2"}},npr:"b2"}},
   eBFE:{tipo:"elo",k:"B-FE",t:"Em qual elo da cadeia ferroviária o projeto atua?",src:"Instituto de Economia da Universidade Estadual de Campinas, 2026",elos:[
    {t:"Material rodante",pr:1},{t:"Infraestrutura ferroviária",pr:1},{t:"Sistemas de controle",pr:1},{t:"Serviços de suporte",pr:1}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"3.2"}},npr:"b2"}},
   b2:{tipo:"q",k:"B2",t:"O projeto foca em economia circular, eficiência energética ou digitalização?",opts:[{t:"Sim",out:{c:"pri",oe:"3.2"}},{t:"Não",out:{c:"ade",oe:"3.2 ou 3.3"}}]},
   eC:{tipo:"elo",k:"C1",t:"Em qual elo da cadeia solar fotovoltaica o projeto atua?",src:"Duarte e Araújo, Banco Nacional de Desenvolvimento Econômico e Social, 2025",elos:[
    {t:"Extração e purificação do silício"},{t:"Lingotes e lâminas"},{t:"Células fotovoltaicas"},{t:"Módulos fotovoltaicos"},{t:"Equipamentos do sistema: rastreadores e inversores"}],
    alts:[{t:"Outra fonte de energia: eólica, hidrogênio, baterias estacionárias, transmissão",out:{c:"red",red:"M5",t:"Avaliar na Missão 5"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"c2"},
   c2:{tipo:"q",k:"C2",t:"O projeto tem aplicação em moradias do Programa Minha Casa, Minha Vida?",opts:[{t:"Sim",out:{c:"pri",oe:"3.1"}},{t:"Não",out:{c:"ade",oe:"3.3"}}]}}},
 M4:{nome:"Transformação digital da indústria para ampliar a produtividade",estado:"completa",
  fonte:"Plano de Ação 2024–2026 da Nova Indústria Brasil, edição atualizada, seção 3.4; cadeias prioritárias (p. 8 e 69) e prioridades de financiamento à inovação da missão (p. 71). Os elos das categorias A, C e E são decomposição própria da equipe.",
  catOE:{A:"4.1",B:"4.2",C:"4.2",D:"4.2",E:"4.3"},
  oes:[["4.1","Indústria digitalizada: 25% das empresas industriais em 2026 e 50% em 2033 (linha de base 23,5%)."],["4.2","Produção nacional nos segmentos de novas tecnologias, sem meta."],["4.3","Conectividade para a indústria."],["4.4","Atualização tecnológica das regiões industriais maduras (registrar na pontuação, não na árvore)."]],
  regra:"Nas categorias de oferta (B, C e D), o elo ★ de cadeia prioritária dá prioridade direta; o elo sem ★ passa pela pergunta sobre as prioridades de financiamento da missão. Nas categorias de demanda (A e E), a prioridade vem do conteúdo nacional da solução. A pergunta comum admite projetos de adoção, porque a meta da missão é de adoção.",
  pend:["Conferir com a Agência os nomes dos elos de A, C e E (decomposição própria).","Decidir se a cadeia do audiovisual permanece.","Fronteira com a Missão 5 na eficiência energética com ferramentas digitais: regra sugerida, finalidade digital aqui, finalidade energética lá.","O quadro não define saída para \"nenhum elo\"; aqui usa-se a saída proposta \"parcial\"."],
  nos:{
   p0:{tipo:"q",k:"P0",t:"O projeto atua na transformação digital da indústria? Em qual frente?",opts:[
    {t:"Adoção digital pela indústria",cat:"A",to:"pc"},{t:"Semicondutores e microeletrônica",cat:"B",to:"pc"},{t:"Robótica e automação industrial",cat:"C",to:"pc"},{t:"Produtos e serviços digitais avançados",cat:"D",to:"pc"},{t:"Conectividade e infraestrutura digital",cat:"E",to:"pc"},
    {t:"Nenhuma dessas",out:{c:"nad",t:"Não se insere na Missão 4"}}]},
   pc:{tipo:"q",k:"P-comum",el:1,t:"O projeto desenvolve, produz ou fortalece tecnologia, fornecedores ou conteúdo nacional, ou leva tecnologia digital a empresas industriais?",opts:[{t:"Sim",to:"@cat"},{t:"Não: uso interno, serviço ao cidadão ou consumo final",out:{c:"des",t:NAO_IND}}]},
   eA:{tipo:"elo",k:"A1",t:"Em qual elo da adoção digital o projeto atua?",src:"Brasil Mais Produtivo e prioridades de financiamento da missão",elos:[
    {t:"Diagnóstico e gestão digital"},{t:"Otimização de processos e eficiência energética"},{t:"Tecnologias 4.0"},{t:"Fábrica inteligente"},{t:"Formação de mão de obra"}],
    alts:[{t:"Adoção digital pela agroindústria",out:{c:"red",red:"M1",t:"Avaliar na Missão 1"}},{t:"Adoção digital pela saúde",out:{c:"red",red:"M2",t:"Avaliar na Missão 2"}},{t:"Adoção digital pela construção e infraestrutura",out:{c:"red",red:"M3",t:"Avaliar na Missão 3"}}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"a2"},
   a2:{tipo:"q",k:"A2",t:"A solução é desenvolvida ou produzida no Brasil, ou gera demanda para fornecedores nacionais?",opts:[{t:"Sim",out:{c:"pri",oe:"4.1 e 4.2"}},{t:"Não",out:{c:"ade",oe:"4.1"}}]},
   eB:{tipo:"elo",k:"B1",t:"Em qual elo da cadeia de semicondutores o projeto atua?",src:"prioridades de financiamento e programa de apoio aos semicondutores",elos:[
    {t:"Projeto de circuitos (design)",pr:1},{t:"Fabricação (front-end)",pr:1},{t:"Encapsulamento e teste (back-end)",pr:1},{t:"Minerais estratégicos e materiais avançados"},{t:"Ferramentas de projeto, insumos e bens de capital"},{t:"Módulos, optoeletrônicos e etiquetas de radiofrequência"}],
    alts:[{t:"Minerais sem aplicação em semicondutores",out:{c:"red",red:"M5",t:"Avaliar na Missão 5"}},{t:"Demanda exclusiva de defesa",out:{c:"red",red:"M6",t:"Avaliar na Missão 6"}}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"4.2"}},npr:"q"}},
   eC:{tipo:"elo",k:"C1",t:"Em qual elo da cadeia de robótica e automação o projeto atua?",src:"cadeia prioritária de robôs industriais; decomposição própria",elos:[
    {t:"Componentes e subsistemas"},{t:"Robôs industriais e colaborativos",pr:1},{t:"Robôs móveis autônomos",pr:1},{t:"Software de controle, visão computacional e inteligência artificial embarcada"},{t:"Integração de sistemas"},{t:"Engenharia, manutenção e formação"}],
    alts:[{t:"Drones e máquinas agrícolas",out:{c:"red",red:"M1",t:"Avaliar na Missão 1"}},{t:"Sistemas autônomos para defesa",out:{c:"red",red:"M6",t:"Avaliar na Missão 6"}}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"4.2"}},npr:"q"}},
   eD:{tipo:"elo",k:"D1",t:"Em qual elo dos produtos e serviços digitais avançados o projeto atua?",src:"cadeias prioritárias (p. 8 e 69) e prioridades de financiamento (p. 71)",elos:[
    {t:"Plataformas digitais e nuvem",pr:1},{t:"Audiovisual",pr:1},{t:"Inteligência artificial generativa e software industrial"},{t:"Segurança cibernética"},{t:"Comunicações avançadas (sexta geração, redes abertas)"},{t:"Tecnologias quânticas, realidade virtual e aumentada, cadeias de blocos"}],
    alts:[{t:"Saúde digital",out:{c:"red",red:"M2",t:"Avaliar na Missão 2"}},{t:"Defesa cibernética, satélites e radares",out:{c:"red",red:"M6",t:"Avaliar na Missão 6"}}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"d2"},
   d2:{tipo:"q",k:"D2",t:"Os dados e a tecnologia permanecem sob domínio nacional?",opts:[{t:"Sim",to:"@star"},{t:"Não",out:{c:"par",t:"Parcial: solução sem domínio nacional dos dados e da tecnologia"}}],star:{pr:{out:{c:"pri",oe:"4.2"}},npr:"q"}},
   eE:{tipo:"elo",k:"E1",t:"Em qual elo da conectividade e infraestrutura digital o projeto atua?",src:"ações de conectividade da missão; decomposição própria",elos:[
    {t:"Redes privativas e industriais"},{t:"Cobertura de quarta e quinta geração em áreas produtivas"},{t:"Infovias"},{t:"Compartilhamento de infraestrutura"},{t:"Infraestrutura de dados e computação de borda"}],
    none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"e2"},
   e2:{tipo:"q",k:"E2",t:"A conectividade atende plantas, parques ou cadeias produtivas?",opts:[{t:"Sim",to:"e3"},{t:"Não",out:{c:"par",t:"Parcial: conectividade sem destinação produtiva"}}]},
   e3:{tipo:"q",k:"E3",t:"Os equipamentos ou soluções são nacionais?",opts:[{t:"Sim",out:{c:"pri",oe:"4.3"}},{t:"Não",out:{c:"ade",oe:"4.3"}}]},
   q:{tipo:"q",k:"Q",t:"O elo consta das prioridades de financiamento à inovação da Nova Indústria Brasil para a Missão 4?",
    lista:{t:"Quadro auxiliar: prioridades de financiamento à inovação da Missão 4",grupos:[["Linhas não reembolsáveis (Mais Inovação Brasil, R$ 440 milhões, 2024 a 2026)",["Semicondutores: projeto, fabricação, encapsulamento e teste","Minerais estratégicos e materiais avançados para semicondutores","Inteligência artificial generativa","Robótica avançada para a indústria","Tecnologias quânticas","Segurança cibernética","Realidade virtual e aumentada","Comunicações avançadas (sexta geração e redes abertas) e cadeias de blocos","Etapa de fábrica inteligente do Brasil Mais Produtivo"]],["Crédito à inovação e ações específicas para semicondutores",["Cadeias de semicondutores (projeto, fabricação, encapsulamento e teste)","Inteligência artificial generativa e robótica avançada aplicada à indústria","Programa de apoio aos semicondutores: chips, ferramentas de projeto, matéria-prima, insumos e bens de capital para semicondutores e optoeletrônicos","Retomada do centro nacional de circuitos integrados: circuitos integrados, módulos e etiquetas de radiofrequência","Fundo para o desenvolvimento tecnológico das telecomunicações: pesquisa e desenvolvimento em telecomunicações"]]]},
    opts:[{t:"Sim",out:{c:"pri",oe:"@cat"}},{t:"Não",out:{c:"ade",oe:"@cat"}}]}}},
 M5:{nome:"Bioeconomia, descarbonização e transição e segurança energéticas para garantir os recursos para as futuras gerações",estado:"completa",
  fonte:"Plano de Ação 2024–2026 da Nova Indústria Brasil, edição atualizada, seção 3.5; cadeias prioritárias (p. 8 e 81) e prioridades de financiamento (p. 83). Árvore conferida contra o documento em 6 de novembro de 2026.",
  catOE:{A:"5.1",B:"5.1",C:"5.3",D:"5.2",E:"5.4"},
  oes:[["5.1","Indústria verde: reduzir a intensidade de emissões e ampliar a participação de biocombustíveis e elétricos na matriz de transportes (27% em 2026 e 50% em 2033; base 21,4%)."],["5.2","Uso tecnológico e sustentável da biodiversidade: +10% em 2026 e +30% em 2033."],["5.3","Cadeias industriais da transição energética, sem meta."],["5.4","Economia circular e segurança energética, sem meta."]],
  regra:"Nas categorias A, B e C, o elo ★ dá prioridade direta; os elos sem ★ e toda a categoria D passam pela pergunta sobre as prioridades de financiamento. Na categoria E, sem cadeia prioritária nem prioridade de financiamento na Nova Indústria Brasil, a prioridade vem do conteúdo tecnológico nacional. A pergunta comum admite projetos que reduzem emissões, energia ou resíduos de empresas industriais.",
  pend:["Fronteira com a Missão 3 no fotovoltaico: aplicação habitacional lá, o resto aqui; exige ajuste simétrico na árvore da Missão 3.","Meta 1 ambígua: \"ampliar em 27%\" pode ser acréscimo relativo ou patamar.","Categoria E ancorada por analogia ao objetivo II, não por lista da Nova Indústria Brasil.","Floresta em pé e fitocosméticos saem \"aderente\" pela pergunta de financiamento, embora a missão dedique um instrumento à floresta em pé.","O elo de petróleo e gás fica sempre \"aderente\"; decidir se permanece.","O quadro não define saída para \"nenhum elo\"; aqui usa-se a saída proposta \"parcial\"."],
  nos:{
   p0:{tipo:"q",k:"P0",t:"O projeto atua na bioeconomia, na descarbonização ou na transição energética? Em qual frente?",opts:[
    {t:"Descarbonização da indústria de base e eficiência energética",cat:"A",to:"pc"},{t:"Novas fontes de energia e combustíveis sustentáveis",cat:"B",to:"pc"},{t:"Equipamentos e cadeias da transição energética",cat:"C",to:"pc"},{t:"Bioeconomia e sociobiodiversidade",cat:"D",to:"pc"},{t:"Economia circular e resíduos",cat:"E",to:"pc"},
    {t:"Nenhuma dessas",out:{c:"nad",t:"Não se insere na Missão 5"}}]},
   pc:{tipo:"q",k:"P-comum",el:1,t:"O projeto desenvolve, produz ou fortalece tecnologia, fornecedores ou conteúdo nacional, ou reduz emissões, consumo de energia ou resíduos de empresas industriais?",opts:[{t:"Sim",to:"@cat"},{t:"Não: compra de equipamento, compensação de carbono ou consumo final",out:{c:"des",t:NAO_IND}}]},
   eA:{tipo:"elo",k:"A1",t:"Em qual elo da descarbonização da indústria de base o projeto atua?",src:"Plano de Ação da Nova Indústria Brasil, p. 81 a 94",elos:[
    {t:"Cimento de baixo carbono",pr:1},{t:"Aço verde (redução direta, hidrogênio, sucata, biorredutores)",pr:1},{t:"Química sustentável",pr:1},{t:"Eficiência energética industrial"},{t:"Eletrificação e substituição de fósseis"},{t:"Captura, uso e armazenamento de carbono"}],
    alts:[{t:"Edificações, transporte e mobilidade",out:{c:"red",red:"M3",t:"Avaliar na Missão 3"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"5.1"}},npr:"q"}},
   eB:{tipo:"elo",k:"B1",t:"Em qual elo das novas fontes de energia e combustíveis sustentáveis o projeto atua?",src:"Plano de Ação da Nova Indústria Brasil, p. 81 a 94",elos:[
    {t:"Diesel verde e combustíveis sintéticos",pr:1},{t:"Combustível sustentável de aviação",pr:1},{t:"Hidrogênio de baixo carbono",pr:1},{t:"Biocombustíveis atuais e Combustível do Futuro"},{t:"Biorrefinarias e biotecnologia de biomassa"},{t:"Petróleo e gás de baixo custo e baixa pegada"}],
    alts:[{t:"Motores e veículos a biocombustível",out:{c:"red",red:"M3",t:"Avaliar na Missão 3"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"5.1"}},npr:"q"}},
   eC:{tipo:"elo",k:"C1",t:"Em qual elo dos equipamentos e cadeias da transição energética o projeto atua?",src:"Plano de Ação da Nova Indústria Brasil, p. 81 a 94",elos:[
    {t:"Células e módulos fotovoltaicos",pr:1},{t:"Aerogeradores e componentes",pr:1},{t:"Eletrolisadores e células a combustível"},{t:"Armazenamento: baterias estacionárias, hidrogênio subterrâneo"},{t:"Transmissão em ultra alta tensão"},{t:"Minerais estratégicos e refino de materiais"}],
    alts:[{t:"Fotovoltaico para o Programa Minha Casa, Minha Vida; baterias para veículos",out:{c:"red",red:"M3",t:"Avaliar na Missão 3"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},star:{pr:{out:{c:"pri",oe:"5.3"}},npr:"q"}},
   eD:{tipo:"elo",k:"D1",t:"Em qual elo da bioeconomia e sociobiodiversidade o projeto atua?",src:"Plano de Ação da Nova Indústria Brasil, p. 81 a 94",elos:[
    {t:"Bioinsumos e bioprodutos da sociobioeconomia"},{t:"Fitocosméticos, ingredientes naturais, nutracêuticos"},{t:"Químicos e biopolímeros de base renovável"},{t:"Cadeias da floresta em pé"},{t:"Estruturação de bionegócios e polos de bioeconomia"}],
    alts:[{t:"Medicamentos e fitoterápicos",out:{c:"red",red:"M2",t:"Avaliar na Missão 2"}},{t:"Bioinsumos agrícolas e alimentos",out:{c:"red",red:"M1",t:"Avaliar na Missão 1"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"d2"},
   d2:{tipo:"q",k:"D2",t:"O projeto agrega valor industrial no país à biodiversidade?",opts:[{t:"Sim",to:"q"},{t:"Não",out:{c:"par",t:"Parcial: biodiversidade sem agregação de valor industrial no país"}}]},
   eE:{tipo:"elo",k:"E1",t:"Em qual elo da economia circular o projeto atua?",src:"objetivo II da missão, por analogia",elos:[
    {t:"Logística reversa e reciclagem"},{t:"Reaproveitamento de resíduos industriais e simbiose industrial"},{t:"Ecodesign e remanufatura"},{t:"Reciclagem de equipamentos de energia"},{t:"Rastreabilidade e certificação"}],
    alts:[{t:"Veículos e baterias de tração",out:{c:"red",red:"M3",t:"Avaliar na Missão 3"}}],none:{out:{c:"par",t:"Parcial",d:SAI_PROP,prop:1}},to:"e2"},
   e2:{tipo:"q",k:"E2",t:"O projeto desenvolve tecnologia ou processo nacional de reciclagem ou reaproveitamento?",opts:[{t:"Sim",out:{c:"pri",oe:"5.4"}},{t:"Não",out:{c:"ade",oe:"5.4"}}]},
   q:{tipo:"q",k:"Q",t:"O elo consta das prioridades de financiamento à inovação da Nova Indústria Brasil para a Missão 5?",
    lista:{t:"Quadro auxiliar: prioridades de financiamento à inovação da Missão 5",grupos:[["Linhas não reembolsáveis (Mais Inovação Brasil, bioeconomia e transição energética, R$ 700 milhões, 2024 a 2026)",["Redução da pegada de carbono (captura e armazenamento), substituição de fósseis por renováveis e biocombustíveis do futuro","Componentes e equipamentos para renováveis: células fotovoltaicas, aerogeradores, eletrolisadores e células a combustível","Minerais estratégicos; armazenamento de energia (baterias, hidrogênio subterrâneo) e estocagem de carbono","Transmissão em ultra alta tensão e resiliência do sistema interligado","Químicos, bioprodutos e bioinsumos de fontes renováveis; biorrefinarias integradas"]],["Crédito à inovação",["Bioprodutos e bioinsumos da sociobioeconomia florestal","Biotecnologia para geração e processamento de biomassa","Captura de carbono","Diesel verde, combustíveis sintéticos e combustível sustentável de aviação","Hidrogênio de baixo carbono (equipamentos, produção, armazenamento, transporte e uso)","Armazenamento de energia, aerogeradores, células fotovoltaicas e refino de materiais"]]]},
    opts:[{t:"Sim",out:{c:"pri",oe:"@cat"}},{t:"Não",out:{c:"ade",oe:"@cat"}}]}}},
 M6:{nome:"Tecnologias de interesse para a soberania e a defesa nacionais",estado:"rascunho",
  fonte:"Cadeias de veículos lançadores e satélites a partir de Matos (2016) e Instituto de Economia da Universidade Estadual de Campinas (2026); radares a partir de Vianello (2016) e da mesma fonte.",
  catOE:{A:"6.1 ou 6.2",B:"6.1 ou 6.2",C:"6.1 ou 6.2"},
  oes:[["6.1","Domínio de tecnologias críticas (materiais, propulsão, controle e comunicações): 55% em 2026 e 75% em 2033; ponto de partida 42,7%."],["6.2","Adensamento das cadeias de defesa e aeroespacial (micro e nanoeletrônica, sensoriamento remoto, áreas cibernética, nuclear e espacial), sem meta."],["6.3","Tecnologias duais e exportação, sem meta."]],
  regra:"Atuar em elo ★, ou em área citada nos objetivos oficiais (materiais, propulsão, controle, comunicações, micro e nanoeletrônica, sensoriamento remoto), torna o projeto aderente prioritário; uso dual ou potencial de exportação acrescenta o vínculo com o objetivo 6.3.",
  pend:["Árvore em rascunho avançado no quadro.","\"Outra tecnologia de defesa\" não tem destino no quadro; aqui usa-se a saída proposta \"parcial\".","Não há pergunta de financiamento nem painel de fontes, ao contrário das Missões 4 e 5.","A legenda do quadro diz que a prioridade vem das perguntas 2 ou 3; no fluxo, só a pergunta 2 qualifica."],
  nos:{
   p0:{tipo:"q",k:"P0",t:"Em qual setor o projeto atua?",opts:[
    {t:"Veículos lançadores",cat:"A",to:"pc"},{t:"Satélites",cat:"B",to:"pc"},{t:"Radares",cat:"C",to:"pc"},
    {t:"Drones",out:{c:"red",red:"M1",t:"Avaliar na Missão 1"}},{t:"Propulsão para mobilidade",out:{c:"red",red:"M3",t:"Avaliar na Missão 3"}},{t:"Semicondutores de uso geral",out:{c:"red",red:"M4",t:"Avaliar na Missão 4"}},
    {t:"Outra tecnologia de defesa",out:{c:"par",t:"Parcial",d:"Saída proposta pela equipe: o quadro não define destino para outras tecnologias de defesa.",prop:1}},
    {t:"Nenhum desses",out:{c:"nad",t:"Não se insere na Missão 6"}}]},
   pc:{tipo:"q",k:"P-comum",el:1,t:"O projeto gera domínio tecnológico nacional (pesquisa e desenvolvimento, produção, integração ou fornecedor nacional) em algum elo da cadeia?",opts:[{t:"Sim",to:"@cat"},{t:"Não: apenas implantação, aquisição ou consumo",out:{c:"des",t:NAO_IND}}]},
   eA:{tipo:"elo",k:"A1",t:"Em qual elo da cadeia de veículos lançadores o projeto atua?",src:"Matos, 2016; Instituto de Economia da Universidade Estadual de Campinas, 2026",elos:[
    {t:"Pesquisa, desenvolvimento e engenharia de projeto"},{t:"Insumos, químicos e materiais avançados (propelentes, materiais resistentes e estruturas)",pr:1},{t:"Manufatura de subsistemas e componentes críticos (sistemas de propulsão, estruturas mecânicas e coifas)",pr:1},{t:"Softwares embarcados, aviônica e guiamento",pr:1},{t:"Montagem, integração e testes"},{t:"Infraestrutura de solo"}],
    none:{out:{c:"nad",t:"Não aderente"}},to:"g2"},
   eB:{tipo:"elo",k:"B1",t:"Em qual elo da cadeia de satélites o projeto atua?",src:"Matos, 2016; Instituto de Economia da Universidade Estadual de Campinas, 2026",elos:[
    {t:"Pesquisa e desenvolvimento e arquitetura de missão espacial"},{t:"Fabricação da plataforma",pr:1},{t:"Fabricação da carga útil (sensoriamento remoto, transponders, antenas direcionáveis, coletores ambientais)",pr:1},{t:"Processadores embarcados e eletrônica de bordo",pr:1},{t:"Montagem, integração e testes"},{t:"Segmento de solo"}],
    none:{out:{c:"nad",t:"Não aderente"}},to:"g2"},
   eC:{tipo:"elo",k:"C1",t:"Em qual elo da cadeia de radares o projeto atua?",src:"Vianello, 2016; Instituto de Economia da Universidade Estadual de Campinas, 2026",elos:[
    {t:"Pesquisa, engenharia e projeto de radiofrequência"},{t:"Insumos, componentes microeletrônicos e eletrônica de potência",pr:1},{t:"Manufatura eletrônica e fabricação de conjuntos radáricos"},{t:"Software de processamento de sinais e comando e controle",pr:1},{t:"Integração de sistemas"},{t:"Suporte logístico, manutenção e modernização"}],
    none:{out:{c:"nad",t:"Não aderente"}},to:"g2"},
   g2:{tipo:"q",k:"2",t:"O projeto atua em um elo ★, ou envolve materiais, propulsão, controle, comunicações, micro e nanoeletrônica ou sensoriamento remoto?",opts:[{t:"Sim",to:"g3"},{t:"Não",out:{c:"ade",oe:"@cat"}}]},
   g3:{tipo:"q",k:"3",t:"O projeto tem uso dual (civil e militar) ou potencial de exportação?",opts:[{t:"Sim",out:{c:"pri",oe:"6.1 ou 6.2, e 6.3"}},{t:"Não",out:{c:"pri",oe:"6.1 ou 6.2"}}]}}}};

/* ===== percurso da árvore (esteira v3.0): mesma lógica da v2.0, sem depender da tela ===== */
const arvTem=m=>!!(ARVD[m]&&ARVD[m].nos);
const arvNovo=m=>({m,atual:"p0",cat:null,catNome:null,elo:null,eloK:null,eloPr:false,trilha:[],out:null});
function arvDestino(A,st,d){
  if(d==null) return null;
  if(typeof d==="string"){
    if(d==="@cat") return {no:"e"+st.cat};
    if(d==="@star"){ const n=A.nos[st.atual]||{}, s=n.star||(A.nos["e"+st.cat]||{}).star||{}; return arvDestino(A,st,st.eloPr?s.pr:s.npr); }
    return {no:d}; }
  if(d.out) return {out:{...d.out,oe:d.out.oe==="@cat"?(A.catOE||{})[st.cat]:d.out.oe}};
  if(d.to) return arvDestino(A,st,d.to);
  return null; }
/* escolha: {i} opção de pergunta; {elo} elo da cadeia; {alt} resposta alternativa; {none:1} nenhum dos elos */
function arvPasso(st,esc_){
  const A=ARVD[st.m], n=A.nos[st.atual], s={...st,trilha:[...st.trilha]}; let dest=null, resp="";
  if(n.tipo==="q"){ const o=n.opts[esc_.i]; resp=o.t; if(o.cat){ s.cat=o.cat; s.catNome=o.t; } dest=arvDestino(A,s,o.to!=null?o.to:{out:o.out}); }
  else if(esc_.elo!=null){ const e=n.elos[esc_.elo]; resp="Elo "+(esc_.elo+1)+": "+e.t+(e.pr?" ★":""); s.elo=e.t; s.eloK=n.k; s.eloPr=!!e.pr; dest=n.star?arvDestino(A,s,s.eloPr?n.star.pr:n.star.npr):arvDestino(A,s,n.to); }
  else if(esc_.alt!=null){ const a=n.alts[esc_.alt]; resp=a.t; dest=arvDestino(A,s,a.to!=null?a.to:{out:a.out}); }
  else { resp="Nenhum dos elos listados"; dest=arvDestino(A,s,n.none.to!=null?n.none.to:{out:n.none.out}); }
  s.trilha.push({k:n.k,t:n.t,r:resp});
  if(!dest){ s.out={c:"par",t:"Sem destino definido na árvore"}; s.atual=null; }
  else if(dest.out){ s.out=dest.out; s.atual=null; } else s.atual=dest.no;
  return s; }
if(typeof module!=="undefined"&&module.exports) module.exports={ARVD,arvTem,arvNovo,arvPasso};

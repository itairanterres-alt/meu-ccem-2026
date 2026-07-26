// Dado de teste do passo 2 — as 40 questões reais da amostra UC1/fase4
// (docs/anexos/UC1_fase4_canonico.json), formato canônico. Usado pelo
// demoClient para rodar o fluxo de ponta a ponta sem Supabase ao vivo.
// `_proveniencia` é só para debug/demo — não existe no schema real.
import type { Alternativa } from './types'

export interface QuestaoSeed {
  enunciado: string
  texto_base: string | null
  fase_alvo: number
  uc_slug: string
  sp_referencia: string | null
  tema: string | null
  dificuldade_editorial: 'facil' | 'medio' | 'dificil' | null
  alternativas: Alternativa[]
  _proveniencia: string
}

export const QUESTOES_SEED: QuestaoSeed[] = [
  {
    "enunciado": "Durante discussão sobre a fisiopatologia das neoplasias, um estudante questiona em qual fase do ciclo celular ocorre a duplicação completa do material genético, etapa indispensável antes de a célula avançar para a mitose. Essa fase, situada entre as fases G1 e G2 da intérfase, é denominada",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "fase G1, período de intensa síntese proteica sem replicação do DNA.",
        "correta": false,
        "justificativa": "Incorreta. Em G1 ocorre crescimento celular e síntese de proteínas e organelas, mas o DNA ainda não foi replicado."
      },
      {
        "letra": "B",
        "texto": "fase S, na qual ocorre a síntese (duplicação) do DNA.",
        "correta": true,
        "justificativa": "A fase S (síntese) da intérfase é o período em que ocorre a replicação completa do DNA, condição necessária para que a célula, após passar por G2, entre em mitose com material genético duplicado. Correta. A fase S é exatamente o período de duplicação do DNA, situando-se entre G1 e G2 na intérfase."
      },
      {
        "letra": "C",
        "texto": "fase G2, período de preparação final para a divisão celular.",
        "correta": false,
        "justificativa": "Incorreta. G2 é a fase de preparação final (síntese de proteínas necessárias à mitose e verificação de erros), após a replicação do DNA já ter ocorrido em S."
      },
      {
        "letra": "D",
        "texto": "metáfase, fase de alinhamento dos cromossomos na placa equatorial.",
        "correta": false,
        "justificativa": "Incorreta. A metáfase é uma fase da mitose propriamente dita, não da intérfase, e ocorre após a duplicação do DNA já ter sido concluída."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q1"
  },
  {
    "enunciado": "Em aula sobre genes envolvidos na carcinogênese, o professor destaca que um determinado gene supressor tumoral atua como \"guardião do genoma\", interrompendo o ciclo celular no ponto de checagem G1/S diante de dano ao DNA e induzindo apoptose quando o reparo não é possível, sendo o gene mais frequentemente encontrado mutado em neoplasias humanas. Esse gene é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "RAS, proto-oncogene ativado por mutações de ganho de função.",
        "correta": false,
        "justificativa": "Incorreta. RAS é um proto-oncogene (não supressor tumoral); quando mutado, tem ganho de função e estimula a proliferação celular, não atuando como \"guardião do genoma\"."
      },
      {
        "letra": "B",
        "texto": "MYC, fator de transcrição que estimula proliferação celular.",
        "correta": false,
        "justificativa": "Incorreta. MYC é um fator de transcrição que, quando desregulado, estimula proliferação celular; não é um gene supressor tumoral e não tem a função descrita."
      },
      {
        "letra": "C",
        "texto": "p53 (TP53), gene supressor tumoral guardião do genoma.",
        "correta": true,
        "justificativa": "O TP53 (p53) é chamado de \"guardião do genoma\" por deter o ciclo celular em G1/S diante de dano ao DNA e induzir apoptose quando o reparo é inviável, sendo o gene supressor tumoral mais comumente alterado nos cânceres humanos. Correta. O p53 é o clássico \"guardião do genoma\", controlando o ponto de checagem G1/S e induzindo apoptose diante de dano irreparável ao DNA."
      },
      {
        "letra": "D",
        "texto": "BCL-2, gene relacionado à inibição da apoptose.",
        "correta": false,
        "justificativa": "Incorreta. BCL-2 é uma proteína antiapoptótica, cuja superexpressão inibe a apoptose e favorece a sobrevivência de células neoplásicas, função oposta à descrita no enunciado."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q2"
  },
  {
    "enunciado": "O papilomavírus humano (HPV) oncogênico é reconhecido como agente etiológico central do câncer do colo do útero. Duas proteínas virais atuam diretamente sobre reguladores do ciclo celular do hospedeiro: uma promove a degradação de p53 e outra inativa a proteína do retinoblastoma (pRb), retirando pontos de checagem essenciais e favorecendo a proliferação descontrolada. Essas duas oncoproteínas virais são, respectivamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "L1 e L2, proteínas estruturais do capsídeo viral.",
        "correta": false,
        "justificativa": "Incorreta. L1 e L2 são proteínas estruturais do capsídeo viral, envolvidas na montagem do vírion e usadas como alvo antigênico nas vacinas, sem ação direta sobre p53/pRb."
      },
      {
        "letra": "B",
        "texto": "E6 e E7, oncoproteínas virais precoces.",
        "correta": true,
        "justificativa": "As oncoproteínas E6 (que promove a degradação de p53) e E7 (que inativa pRb) dos HPVs de alto risco oncogênico (como os tipos 16 e 18) desregulam pontos de checagem essenciais do ciclo celular, favorecendo o acúmulo de mutações e a progressão neoplásica. Correta. E6 degrada p53 e E7 inativa pRb, sendo essas as oncoproteínas centrais na carcinogênese associada ao HPV de alto risco."
      },
      {
        "letra": "C",
        "texto": "E1 e E2, proteínas reguladoras da replicação do genoma viral.",
        "correta": false,
        "justificativa": "Incorreta. E1 e E2 participam da replicação e regulação transcricional do genoma viral, mas não são as principais responsáveis pela inativação de p53/pRb."
      },
      {
        "letra": "D",
        "texto": "E4 e E5, proteínas acessórias sem relação com o ciclo celular do hospedeiro.",
        "correta": false,
        "justificativa": "Incorreta. E4 e E5 têm papéis acessórios no ciclo viral (maturação e modulação de sinalização celular), mas não são as oncoproteínas classicamente associadas à degradação de p53 e pRb."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q3"
  },
  {
    "enunciado": "Uma equipe de saúde da família está organizando uma campanha de rastreamento do câncer do colo do útero em sua área de abrangência. Segundo as diretrizes vigentes do Ministério da Saúde, a citologia oncótica (Papanicolau) deve ser oferecida a mulheres com vida sexual ativa a partir de qual idade, repetindo-se anualmente até dois exames normais consecutivos?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "18 anos.",
        "correta": false,
        "justificativa": "Incorreta. Rastrear a partir dos 18 anos geraria sobrediagnóstico de alterações transitórias comuns em mulheres jovens, sem benefício comprovado, motivo pelo qual essa idade não é recomendada."
      },
      {
        "letra": "B",
        "texto": "21 anos.",
        "correta": false,
        "justificativa": "Incorreta. A idade de 21 anos é adotada por outras diretrizes internacionais, mas não corresponde à recomendação vigente do Ministério da Saúde brasileiro."
      },
      {
        "letra": "C",
        "texto": "25 anos.",
        "correta": true,
        "justificativa": "O Ministério da Saúde recomenda início do rastreamento citológico aos 25 anos em mulheres com vida sexual ativa, com periodicidade anual inicial e, após dois exames normais consecutivos, trienal. Correta. A diretriz brasileira estabelece 25 anos como idade de início do rastreamento em mulheres com vida sexual ativa."
      },
      {
        "letra": "D",
        "texto": "30 anos, apenas.",
        "correta": false,
        "justificativa": "Incorreta. Iniciar apenas aos 30 anos postergaria demasiadamente a detecção de lesões precursoras que podem se desenvolver antes dessa idade."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q4"
  },
  {
    "enunciado": "Uma mulher realiza citologia oncótica de rotina na UBS e o laudo citopatológico, segundo a nomenclatura de Bethesda, descreve o achado como \"ASC-US\". Ao explicar o resultado à paciente, o médico da unidade deve esclarecer que essa sigla corresponde a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "carcinoma epidermoide invasor, já com invasão estromal confirmada.",
        "correta": false,
        "justificativa": "Incorreta. Carcinoma invasor é achado citológico de gravidade muito maior, com células claramente malignas, distinto do significado indeterminado do ASC-US."
      },
      {
        "letra": "B",
        "texto": "células escamosas atípicas de significado indeterminado.",
        "correta": true,
        "justificativa": "ASC-US (Atypical Squamous Cells of Undetermined Significance) designa alterações citológicas em células escamosas cuja natureza não pode ser definida com certeza como reativa ou neoplásica, exigindo investigação complementar conforme idade e histórico da paciente. Correta. ASC-US representa alteração celular escamosa de significado indeterminado, sem definição imediata entre processo reativo/inflamatório e lesão intraepitelial."
      },
      {
        "letra": "C",
        "texto": "lesão intraepitelial escamosa de alto grau (HSIL).",
        "correta": false,
        "justificativa": "Incorreta. HSIL representa lesão intraepitelial de alto grau, com alterações citológicas mais definidas e maior risco de doença invasiva, diferente da incerteza descrita no ASC-US."
      },
      {
        "letra": "D",
        "texto": "adenocarcinoma in situ do colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. Adenocarcinoma in situ refere-se a alterações do epitélio glandular endocervical, categoria citológica distinta e mais grave que o ASC-US."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q5"
  },
  {
    "enunciado": "Durante a discussão do caso de Maria Aparecida, os estudantes revisam os conceitos fundamentais de oncologia. Um deles pergunta qual é a principal característica biológica que diferencia uma neoplasia maligna de uma neoplasia benigna, do ponto de vista histopatológico e clínico. A resposta mais adequada é a capacidade da neoplasia maligna de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "crescer lentamente e permanecer encapsulada, sem invadir estruturas vizinhas.",
        "correta": false,
        "justificativa": "Incorreta. Esse comportamento (crescimento lento, encapsulado, sem invasão) é típico de neoplasias benignas, e não malignas."
      },
      {
        "letra": "B",
        "texto": "invadir tecidos adjacentes localmente e originar metástases à distância.",
        "correta": true,
        "justificativa": "A capacidade de invasão local de tecidos adjacentes e de originar metástases (implantes tumorais à distância) é a característica biológica fundamental que distingue neoplasias malignas das benignas, estas geralmente encapsuladas e de crescimento expansivo local. Correta. Invasão tecidual local e metástase à distância são marcas biológicas que definem a malignidade de uma neoplasia."
      },
      {
        "letra": "C",
        "texto": "apresentar sempre células bem diferenciadas, semelhantes ao tecido de origem.",
        "correta": false,
        "justificativa": "Incorreta. Neoplasias malignas frequentemente apresentam graus variáveis de diferenciação, podendo ser pouco diferenciadas (anaplásicas); diferenciação boa e uniforme é mais típica de tumores benignos."
      },
      {
        "letra": "D",
        "texto": "permanecer assintomática durante toda a vida do paciente.",
        "correta": false,
        "justificativa": "Incorreta. Embora algumas neoplasias malignas possam ser assintomáticas por período variável, isso não é regra nem característica definidora de malignidade."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q6"
  },
  {
    "enunciado": "Mulher de 41 anos, auxiliar de limpeza, sem uso regular de preservativos e sem histórico de vacinação contra HPV na adolescência, realiza citologia oncótica atrasada há cinco anos em ação da UBS. O resultado mostra ASC-US. Considerando que a paciente tem mais de 30 anos, qual conduta é preconizada pelas diretrizes brasileiras de rastreamento diante desse achado citológico?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Repetir a citologia em 6 meses, independentemente da idade da paciente.",
        "correta": false,
        "justificativa": "Incorreta. A repetição em 6 meses é conduta preconizada para mulheres mais jovens (abaixo de 30 anos) com ASC-US, e não para essa faixa etária, na qual o risco de lesão de alto grau é maior."
      },
      {
        "letra": "B",
        "texto": "Encaminhar diretamente para colposcopia, dado o maior risco de lesão de alto grau nessa faixa etária.",
        "correta": true,
        "justificativa": "Em mulheres com 30 anos ou mais e resultado de ASC-US, a diretriz brasileira recomenda encaminhamento direto para colposcopia, pelo maior risco de lesão intraepitelial de alto grau associado à idade mais avançada, diferentemente da conduta adotada em mulheres mais jovens (repetição citológica). Correta. Em mulheres com 30 anos ou mais, o ASC-US deve motivar encaminhamento direto para colposcopia, pelo maior risco de doença significativa nessa faixa etária."
      },
      {
        "letra": "C",
        "texto": "Solicitar apenas sorologia para HIV e hepatites, sem outra conduta específica sobre o colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. Embora a triagem para IST possa ser pertinente em determinados contextos, ela não substitui a investigação colposcópica específica indicada pelo achado citológico."
      },
      {
        "letra": "D",
        "texto": "Tranquilizar a paciente e repetir a citologia apenas em 3 anos, como se o exame fosse normal.",
        "correta": false,
        "justificativa": "Incorreta. Considerar o resultado como normal e postergar por 3 anos ignoraria uma alteração citológica que já indica necessidade de investigação, aumentando o risco de diagnóstico tardio."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q7"
  },
  {
    "enunciado": "Em aula sobre biologia molecular do câncer cervical, o professor detalha o mecanismo pelo qual a oncoproteína E6 do HPV de alto risco compromete a função de p53, favorecendo a sobrevivência de células com dano genômico que, em condições normais, seriam eliminadas por apoptose. Esse mecanismo molecular específico envolve",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ativação direta da via mitocondrial de apoptose por E6, aumentando a morte celular programada.",
        "correta": false,
        "justificativa": "Incorreta. E6 tem efeito oposto: reduz a apoptose ao degradar p53, não a estimula por via mitocondrial."
      },
      {
        "letra": "B",
        "texto": "ligação de E6 a uma ubiquitina-ligase (E6-AP), promovendo ubiquitinação e degradação proteassomal de p53.",
        "correta": true,
        "justificativa": "A oncoproteína E6 recruta a ubiquitina-ligase celular E6-AP, formando um complexo que ubiquitina p53 e a direciona para degradação pelo proteassoma, eliminando funcionalmente o principal ponto de controle do ciclo celular em resposta a dano no DNA. Correta. Esse é exatamente o mecanismo molecular descrito na literatura: E6 associa-se à E6-AP, promovendo ubiquitinação e degradação de p53 pelo proteassoma."
      },
      {
        "letra": "C",
        "texto": "metilação do promotor do gene TP53, silenciando sua transcrição de forma epigenética.",
        "correta": false,
        "justificativa": "Incorreta. A inativação de p53 pelo HPV ocorre por degradação proteica pós-traducional mediada por E6, e não por silenciamento epigenético do gene."
      },
      {
        "letra": "D",
        "texto": "inibição direta da enzima telomerase, encurtando os telômeros e induzindo senescência celular.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo de E6 não envolve a telomerase; na verdade, outra proteína viral (E6, em outro contexto) pode ativar a telomerase em algumas células, mas esse não é o mecanismo relacionado à inativação de p53 descrito no enunciado."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q8"
  },
  {
    "enunciado": "Durante discussão epidemiológica sobre câncer do colo do útero, os estudantes analisam dados que apontam a infecção persistente por determinados subtipos virais como condição necessária, embora não suficiente, para o desenvolvimento da neoplasia cervical. Entre os fatores discutidos (multiparidade, tabagismo, uso de contraceptivos hormonais, imunossupressão), qual é considerado o principal fator de risco, sem o qual a doença praticamente não se desenvolve?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Multiparidade isolada, independentemente de outros fatores.",
        "correta": false,
        "justificativa": "Incorreta. A multiparidade é reconhecida como cofator que aumenta o risco na presença de infecção por HPV, mas isoladamente não causa a neoplasia cervical."
      },
      {
        "letra": "B",
        "texto": "Infecção persistente por HPV oncogênico, especialmente os tipos 16 e 18.",
        "correta": true,
        "justificativa": "A infecção persistente por tipos oncogênicos de HPV, principalmente 16 e 18, é considerada condição necessária para o desenvolvimento do câncer cervical; os demais fatores (multiparidade, tabagismo, uso de contraceptivos) atuam como cofatores que aumentam o risco na presença da infecção viral persistente, mas não são causas isoladas suficientes. Correta. A persistência da infecção por HPV oncogênico é considerada condição necessária (embora não suficiente isoladamente) para a carcinogênese cervical."
      },
      {
        "letra": "C",
        "texto": "Uso isolado de contraceptivos hormonais combinados, sem outros fatores associados.",
        "correta": false,
        "justificativa": "Incorreta. O uso de contraceptivos hormonais combinados é cofator discutido na literatura, mas não é o principal fator de risco nem causa a doença na ausência de infecção por HPV."
      },
      {
        "letra": "D",
        "texto": "Tabagismo isolado, na ausência de infecção viral.",
        "correta": false,
        "justificativa": "Incorreta. O tabagismo é cofator que aumenta o risco em mulheres já infectadas pelo HPV, mas isoladamente, sem a infecção viral, não é a principal causa da neoplasia cervical."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q9"
  },
  {
    "enunciado": "Mulher de 35 anos procura a UBS relatando sangramento pós-coital recorrente nos últimos dois meses. Ao exame especular, observa-se lesão exofítica, friável, com sangramento ao toque, localizada no colo uterino. A citologia ainda não foi realizada nesta consulta. Diante desse achado ao exame especular, qual é a conduta prioritária?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Repetir apenas a citologia oncótica em 12 meses, como rotina de rastreamento.",
        "correta": false,
        "justificativa": "Incorreta. Postergar a investigação para rastreamento de rotina desconsidera a gravidade do achado macroscópico já suspeito, retardando um diagnóstico potencialmente urgente."
      },
      {
        "letra": "B",
        "texto": "Realizar biópsia dirigida da lesão visível, independentemente do resultado citológico.",
        "correta": true,
        "justificativa": "Diante de lesão macroscopicamente suspeita (exofítica, friável, sangrante) ao exame especular, a biópsia dirigida deve ser realizada prontamente, independentemente do resultado da citologia, pela alta suspeita clínica de neoplasia invasora, que exige confirmação histopatológica sem demora. Correta. Lesão suspeita visível ao exame especular exige biópsia dirigida imediata, não devendo a conduta depender do resultado citológico, que pode inclusive ser normal em algumas neoplasias invasoras."
      },
      {
        "letra": "C",
        "texto": "Iniciar tratamento empírico com antifúngico vaginal e reavaliar em 30 dias.",
        "correta": false,
        "justificativa": "Incorreta. Não há dados clínicos (corrimento, prurido, aspecto compatível) que sustentem hipótese de infecção fúngica como causa do sangramento e da lesão descrita; tratar empiricamente atrasaria o diagnóstico correto."
      },
      {
        "letra": "D",
        "texto": "Solicitar apenas ultrassonografia transvaginal antes de qualquer outra conduta.",
        "correta": false,
        "justificativa": "Incorreta. A ultrassonografia transvaginal não substitui a biópsia para confirmação histopatológica de lesão cervical suspeita visível ao exame especular."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q10"
  },
  {
    "enunciado": "Uma equipe de saúde da família planeja ações de imunização em parceria com escolas do território, com foco na prevenção primária do câncer do colo do útero. Segundo o Programa Nacional de Imunizações, a vacinação contra HPV é indicada, prioritariamente, para meninas e meninos em qual faixa etária, justificando-se essa escolha pelo momento anterior ao início da vida sexual?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "0 a 2 anos, em dose única, junto ao calendário básico da primeira infância.",
        "correta": false,
        "justificativa": "Incorreta. A vacina contra HPV não está indicada para lactentes; a resposta imunológica e a lógica de prevenção antes da exposição sexual justificam a faixa etária mais próxima da puberdade."
      },
      {
        "letra": "B",
        "texto": "9 a 14 anos.",
        "correta": true,
        "justificativa": "O PNI prioriza a vacinação contra HPV para meninas e meninos de 9 a 14 anos, faixa etária de maior benefício imunológico e epidemiológico, por anteceder, na maioria dos casos, o início da vida sexual e a exposição ao vírus. Correta. A faixa de 9 a 14 anos é a prioritária no PNI, por anteceder, na maior parte dos casos, o início da vida sexual."
      },
      {
        "letra": "C",
        "texto": "18 a 26 anos, de forma obrigatória para toda a população.",
        "correta": false,
        "justificativa": "Incorreta. Embora a vacinação possa ser considerada em grupos específicos até faixas etárias mais avançadas, ela não é obrigatória de forma universal nessa faixa e não é a prioridade do programa."
      },
      {
        "letra": "D",
        "texto": "Apenas mulheres acima de 30 anos, como estratégia de rastreamento substitutivo.",
        "correta": false,
        "justificativa": "Incorreta. A vacina é medida de prevenção primária (antes da exposição ao vírus) e não substitui o rastreamento citológico, tampouco é indicada exclusivamente após os 30 anos."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q11"
  },
  {
    "enunciado": "Paciente com diagnóstico confirmado de carcinoma epidermoide de colo uterino é submetida a exames de estadiamento. O laudo descreve invasão tumoral que se estende ao paramétrio, sem atingir a parede pélvica e sem hidronefrose associada. Segundo o sistema de estadiamento FIGO, esse achado corresponde ao estágio",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "IA, tumor microscópico restrito ao colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. O estágio IA descreve doença microinvasiva, identificada apenas microscopicamente, incompatível com invasão parametrial macroscópica descrita no caso."
      },
      {
        "letra": "B",
        "texto": "IB, tumor clinicamente visível, restrito ao colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. O estágio IB descreve tumor clinicamente visível, mas ainda restrito ao colo uterino, sem extensão parametrial, o que não corresponde ao achado descrito."
      },
      {
        "letra": "C",
        "texto": "IIB, com invasão parametrial, sem atingir a parede pélvica.",
        "correta": true,
        "justificativa": "O estágio IIB caracteriza-se pela invasão parametrial sem atingir a parede pélvica; a extensão até a parede pélvica e/ou a presença de hidronefrose/rim não funcionante caracterizaria estágio IIIB, mais avançado. Correta. A invasão parametrial sem atingir a parede pélvica caracteriza exatamente o estágio IIB do sistema FIGO."
      },
      {
        "letra": "D",
        "texto": "IIIB, com extensão até a parede pélvica e/ou hidronefrose.",
        "correta": false,
        "justificativa": "Incorreta. O estágio IIIB exige extensão até a parede pélvica e/ou hidronefrose/exclusão renal, achados ausentes no caso descrito, que menciona apenas invasão parametrial sem esses critérios."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q12"
  },
  {
    "enunciado": "Durante revisão sobre vias de sinalização envolvidas na proliferação celular, os estudantes discutem o proto-oncogene RAS, frequentemente mutado em diversas neoplasias humanas. Em condições fisiológicas, RAS atua como uma proteína transdutora de sinal que se ativa transitoriamente após estímulo de fatores de crescimento. Quando mutado de forma oncogênica, RAS contribui para a carcinogênese porque",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "perde completamente sua função enzimática, tornando-se inerte.",
        "correta": false,
        "justificativa": "Incorreta. A mutação oncogênica de RAS não causa perda de função; ao contrário, resulta em ganho de função com ativação constitutiva."
      },
      {
        "letra": "B",
        "texto": "passa a ser constitutivamente ativo, estimulando proliferação celular independentemente de sinal externo.",
        "correta": true,
        "justificativa": "Mutações oncogênicas em RAS resultam em ganho de função, mantendo a proteína no estado ativado (ligada a GTP) de forma constitutiva, o que perpetua sinais mitogênicos via cascata de MAP-quinases mesmo sem estímulo de fatores de crescimento externos. Correta. A mutação mantém RAS permanentemente ativado, perpetuando sinais proliferativos independentemente de estímulo externo, mecanismo clássico de ganho de função oncogênica."
      },
      {
        "letra": "C",
        "texto": "passa a atuar como gene supressor tumoral, inibindo a proliferação celular.",
        "correta": false,
        "justificativa": "Incorreta. RAS é um proto-oncogene, não um gene supressor tumoral; sua mutação favorece, e não inibe, a proliferação celular."
      },
      {
        "letra": "D",
        "texto": "inibe permanentemente a via de MAP-quinases, bloqueando a transdução de sinal.",
        "correta": false,
        "justificativa": "Incorreta. RAS ativado estimula, e não inibe, a via de MAP-quinases, sendo esse justamente o mecanismo de propagação do sinal proliferativo."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q13"
  },
  {
    "enunciado": "Mulher de 38 anos, assintomática, é submetida à colposcopia após citologia mostrando HSIL. A biópsia dirigida confirma neoplasia intraepitelial cervical grau 3 (NIC III), com alterações comprometendo toda a espessura do epitélio, mas sem romper a membrana basal. A paciente questiona por que essa lesão, mesmo restrita ao epitélio, é tratada como condição de alto risco que exige intervenção. A explicação fisiopatológica mais adequada para essa conduta é que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a NIC III já rompeu a membrana basal, configurando, na realidade, carcinoma invasor microscópico.",
        "correta": false,
        "justificativa": "Incorreta. Por definição, a NIC III é uma lesão intraepitelial — a membrana basal permanece íntegra; caso houvesse ruptura, o diagnóstico já seria de carcinoma invasor, e não de NIC III."
      },
      {
        "letra": "B",
        "texto": "a NIC III representa acúmulo progressivo de alterações do ciclo celular por perda funcional de p53 e pRb (mediada por E6/E7), comprometendo toda a espessura do epitélio e precedendo diretamente a invasão estromal.",
        "correta": true,
        "justificativa": "A NIC III reflete o acúmulo progressivo de alterações do ciclo celular decorrentes da ação persistente de E6/E7 sobre p53 e pRb, comprometendo toda a espessura do epitélio (por definição, sem romper a membrana basal), mas representando lesão precursora de alto risco, com potencial significativo de progressão para carcinoma invasor se não tratada. Correta. Essa é a explicação fisiopatológica correta: o comprometimento progressivo do ciclo celular por E6/E7 leva a alterações que ocupam toda a espessura epitelial, configurando lesão de alto risco para invasão."
      },
      {
        "letra": "C",
        "texto": "a NIC III é sempre reversível espontaneamente em poucas semanas, sem necessidade real de seguimento ou tratamento.",
        "correta": false,
        "justificativa": "Incorreta. A NIC III tem taxa de regressão espontânea muito menor que lesões de baixo grau, sendo considerada lesão de alto risco que exige tratamento (excisional, geralmente), e não apenas observação."
      },
      {
        "letra": "D",
        "texto": "a NIC III ocorre exclusivamente em mulheres HPV-negativas, sendo o vírus irrelevante nesse estágio da doença.",
        "correta": false,
        "justificativa": "Incorreta. A NIC III está fortemente associada à infecção persistente por HPV oncogênico; afirmar que o vírus é irrelevante contraria a fisiopatologia estabelecida da doença."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q14"
  },
  {
    "enunciado": "Mulher de 45 anos, tabagista, com citologia mostrando lesão intraepitelial escamosa de alto grau (HSIL), é submetida à colposcopia, que evidencia epitélio acetobranco denso, mosaico grosseiro e pontilhado grosseiro na zona de transformação, totalmente visível, sem lesão aparente no canal endocervical. Diante desse quadro colposcópico, antes de qualquer decisão terapêutica definitiva, a conduta mais adequada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "realizar conização a frio imediatamente, sem biópsia prévia, por já haver citologia e colposcopia sugestivas.",
        "correta": false,
        "justificativa": "Incorreta. Ainda que citologia e colposcopia sejam sugestivas, a confirmação histopatológica por biópsia dirigida é etapa obrigatória antes de procedimento excisional como a conização."
      },
      {
        "letra": "B",
        "texto": "realizar biópsia dirigida das áreas de maior anormalidade colposcópica, para confirmação histopatológica antes de definir o tratamento excisional.",
        "correta": true,
        "justificativa": "Diante de achados colposcópicos anormais compatíveis com lesão de alto grau, a biópsia dirigida das áreas de maior anormalidade é etapa necessária antes de qualquer conduta excisional (como exérese da zona de transformação ou conização), confirmando o grau histológico da lesão e orientando o tratamento definitivo. Correta. A biópsia dirigida das áreas colposcopicamente mais alteradas confirma o diagnóstico histológico e orienta corretamente a conduta terapêutica subsequente."
      },
      {
        "letra": "C",
        "texto": "indicar histerectomia total imediata, independentemente de confirmação histológica prévia.",
        "correta": false,
        "justificativa": "Incorreta. Histerectomia é conduta desproporcional e não é indicada como primeira abordagem para NIC, mesmo de alto grau, sendo reservada a situações específicas após tratamento conservador adequado ou outras indicações ginecológicas."
      },
      {
        "letra": "D",
        "texto": "repetir apenas a citologia em 6 meses, postergando a colposcopia já realizada.",
        "correta": false,
        "justificativa": "Incorreta. Postergar a investigação diante de citologia e colposcopia já alteradas retarda desnecessariamente o diagnóstico definitivo e o tratamento oportuno."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q15"
  },
  {
    "enunciado": "Em discussão sobre novas terapias-alvo em oncologia, os estudantes analisam o mecanismo de ação dos inibidores de CDK4/6, utilizados em alguns tumores hormônio-sensíveis (como certos subtipos de câncer de mama), estabelecendo paralelo com os mecanismos de controle do ciclo celular estudados nesta situação-problema. Esses fármacos atuam, mecanisticamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "impedindo a fosforilação de pRb, mantendo-a ligada a E2F e bloqueando a transição de G1 para S.",
        "correta": true,
        "justificativa": "Os inibidores de CDK4/6 impedem a fosforilação de pRb pelos complexos ciclina D-CDK4/6; a pRb hipofosforilada permanece ligada ao fator de transcrição E2F, bloqueando a transcrição de genes necessários à transição G1/S e interrompendo a progressão do ciclo celular. Correta. Esse é exatamente o mecanismo de ação: bloqueio da fosforilação de pRb, mantendo-a ligada a E2F e impedindo a progressão do ciclo celular para a fase S."
      },
      {
        "letra": "B",
        "texto": "ativando diretamente formas mutadas de p53 para restaurar sua função supressora tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Não há restauração direta de p53 mutado por essa classe de fármacos; o alvo terapêutico é a via ciclina D-CDK4/6-pRb, não p53."
      },
      {
        "letra": "C",
        "texto": "inibindo a enzima topoisomerase II, impedindo o desenovelamento do DNA durante a replicação.",
        "correta": false,
        "justificativa": "Incorreta. A inibição da topoisomerase II é mecanismo de ação de outra classe de quimioterápicos (como antraciclinas e epipodofilotoxinas), não dos inibidores de CDK4/6."
      },
      {
        "letra": "D",
        "texto": "estabilizando os microtúbulos do fuso mitótico, impedindo a progressão da metáfase.",
        "correta": false,
        "justificativa": "Incorreta. A estabilização de microtúbulos é mecanismo de ação de taxanos, atuando na mitose propriamente dita, e não na transição G1/S regulada por pRb/CDK4-6."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q16"
  },
  {
    "enunciado": "Mulher de 41 anos recebe diagnóstico histopatológico confirmado de carcinoma epidermoide de colo uterino, estadiamento FIGO IIB (invasão parametrial sem atingir a parede pélvica). Durante consulta com a equipe de oncologia, questiona sobre as opções terapêuticas disponíveis para esse estágio da doença. A conduta terapêutica padrão, considerando as diretrizes atuais para esse estadiamento, é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "cirurgia radical (histerectomia radical com linfadenectomia) isolada, em todos os casos desse estágio.",
        "correta": false,
        "justificativa": "Incorreta. A partir do estágio IIB, a invasão parametrial geralmente contraindica a cirurgia radical isolada como tratamento primário, sendo preferida a quimiorradioterapia."
      },
      {
        "letra": "B",
        "texto": "quimiorradioterapia concomitante, com cisplatina semanal como radiossensibilizante, associada à braquiterapia complementar.",
        "correta": true,
        "justificativa": "A partir do estágio IIB (invasão parametrial), o tratamento padrão do carcinoma de colo uterino é a quimiorradioterapia concomitante — radioterapia externa associada à braquiterapia, com cisplatina semanal como radiossensibilizante — reservando-se a cirurgia radical isolada para estágios mais iniciais (geralmente até IB2/IIA, conforme protocolos institucionais). Correta. Esse é o tratamento padrão reconhecido para doença localmente avançada (a partir de IIB): quimiorradioterapia concomitante com cisplatina, associada à braquiterapia."
      },
      {
        "letra": "C",
        "texto": "apenas acompanhamento clínico expectante, sem intervenção ativa nesse estágio.",
        "correta": false,
        "justificativa": "Incorreta. O acompanhamento expectante sem tratamento ativo não é conduta aceitável diante de neoplasia maligna confirmada em estágio localmente avançado, com potencial curativo se tratada adequadamente."
      },
      {
        "letra": "D",
        "texto": "quimioterapia neoadjuvante isolada, sem qualquer associação com radioterapia.",
        "correta": false,
        "justificativa": "Incorreta. A quimioterapia isolada, sem radioterapia associada, não é o tratamento padrão para esse estágio; o racional terapêutico envolve o efeito radiossensibilizante da quimioterapia combinada à radioterapia."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q17"
  },
  {
    "enunciado": "Em relação aos mecanismos de escape da apoptose em células cronicamente infectadas por HPV oncogênico, contribuindo para o acúmulo progressivo de mutações e a evolução para neoplasia invasora, o principal mecanismo molecular envolvido é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aumento da expressão de caspases efetoras, acelerando a via apoptótica.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo de escape à apoptose envolve redução, e não aumento, da atividade pró-apoptótica mediada por p53; aumento de caspases favoreceria mais apoptose, não menos."
      },
      {
        "letra": "B",
        "texto": "degradação de p53 mediada por E6, reduzindo a transcrição de genes pró-apoptóticos como BAX.",
        "correta": true,
        "justificativa": "Ao degradar p53 via complexo com E6-AP, a proteína E6 reduz a transcrição de genes pró-apoptóticos (como BAX), permitindo que células com dano genômico acumulado escapem da apoptose e sobrevivam, favorecendo o acúmulo progressivo de mutações adicionais que impulsionam a carcinogênese. Correta. A degradação de p53 por E6 reduz a expressão de genes pró-apoptóticos como BAX, permitindo sobrevivência de células geneticamente instáveis."
      },
      {
        "letra": "C",
        "texto": "hiperexpressão de p21 funcional, bloqueando complexos ciclina-CDK de forma sustentada.",
        "correta": false,
        "justificativa": "Incorreta. p21 é efetor de p53 que inibe complexos ciclina-CDK; como E6 degrada p53, a expressão funcional de p21 tende a estar reduzida, e não hiperexpressa, nesse contexto."
      },
      {
        "letra": "D",
        "texto": "manutenção de pRb hipofosforilada e ativamente ligada a E2F, impedindo a progressão do ciclo celular.",
        "correta": false,
        "justificativa": "Incorreta. A ação de E7 sobre pRb é justamente inativá-la (hiperfosforilação funcional/degradação), liberando E2F e promovendo progressão do ciclo celular, e não mantendo pRb ativa ligada a E2F."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q18"
  },
  {
    "enunciado": "Mulher de 41 anos, recém-diagnosticada com carcinoma invasor de colo uterino, é acompanhada pela equipe de saúde da família enquanto aguarda encaminhamento à oncologia. Durante uma visita domiciliar, demonstra grande ansiedade, medo da morte e desinformação sobre a doença, tendo buscado informações contraditórias na internet. Considerando os princípios da comunicação de más notícias em saúde, a conduta mais adequada da equipe é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "evitar o assunto até que o oncologista assuma integralmente o caso, para não se comprometer com informações que não domina.",
        "correta": false,
        "justificativa": "Incorreta. Evitar o assunto deixa a paciente vulnerável à desinformação (como já demonstrado pela busca em fontes não confiáveis) e rompe o vínculo de cuidado que a equipe de saúde da família deve manter."
      },
      {
        "letra": "B",
        "texto": "fornecer informações claras e adequadas ao nível de compreensão da paciente, verificar seu entendimento, acolher suas dúvidas e emoções, e oferecer suporte contínuo, sem prometer resultados que não podem ser garantidos.",
        "correta": true,
        "justificativa": "A comunicação de más notícias deve seguir princípios como os do protocolo SPIKES: linguagem clara e acessível, verificação da compreensão da paciente, acolhimento ativo das emoções e dúvidas, e manutenção de vínculo de cuidado contínuo, sem prometer certezas sobre desfechos que a equipe não pode garantir. Correta. Esses são os princípios centrais da comunicação de más notícias: clareza, verificação de entendimento, acolhimento emocional e honestidade sem falsas garantias."
      },
      {
        "letra": "C",
        "texto": "informar apenas os familiares da paciente, evitando o contato direto sobre o diagnóstico e prognóstico com a própria paciente.",
        "correta": false,
        "justificativa": "Incorreta. Omitir informações da própria paciente fere sua autonomia e o direito à informação sobre sua própria condição de saúde, sendo eticamente inadequado, salvo situações excepcionais específicas."
      },
      {
        "letra": "D",
        "texto": "restringir-se a repassar o resultado do exame de forma objetiva, sem abrir espaço para perguntas ou expressão de sentimentos.",
        "correta": false,
        "justificativa": "Incorreta. Comunicação puramente objetiva, sem espaço para dúvidas e expressão emocional, não acolhe as necessidades psicossociais da paciente diante do impacto de um diagnóstico oncológico."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q19"
  },
  {
    "enunciado": "Gestores municipais de saúde avaliam estratégias para reduzir a incidência e a mortalidade por câncer do colo do útero em médio e longo prazo, considerando restrições orçamentárias e a necessidade de priorizar ações com melhor relação custo-efetividade. Entre as estratégias possíveis, qual é reconhecida como a mais custo-efetiva para essa finalidade, integrando prevenção primária e secundária?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Tratamento quimioterápico precoce e universal de todas as mulheres HPV-positivas, independentemente de achados citológicos.",
        "correta": false,
        "justificativa": "Incorreta. Não existe indicação de quimioterapia para mulheres apenas HPV-positivas sem lesão neoplásica estabelecida; essa conduta não tem respaldo científico nem é custo-efetiva."
      },
      {
        "letra": "B",
        "texto": "Combinação de vacinação contra HPV na pré-adolescência com rastreamento citológico organizado da população-alvo.",
        "correta": true,
        "justificativa": "A combinação de vacinação contra HPV (prevenção primária, reduzindo a incidência de infecção pelos tipos oncogênicos mais prevalentes) com rastreamento citológico organizado (prevenção secundária, detectando precocemente lesões precursoras) é reconhecida internacionalmente como a estratégia mais custo-efetiva para reduzir incidência e mortalidade por câncer de colo do útero. Correta. Essa é a estratégia com melhor relação custo-efetividade reconhecida, integrando prevenção primária (vacina) e secundária (rastreamento organizado)."
      },
      {
        "letra": "C",
        "texto": "Rastreamento por ressonância magnética pélvica anual em toda a população feminina adulta.",
        "correta": false,
        "justificativa": "Incorreta. Ressonância magnética pélvica anual universal tem custo elevadíssimo e não é o método de rastreamento populacional recomendado para câncer de colo do útero, que se baseia na citologia (e testes de HPV, quando disponíveis)."
      },
      {
        "letra": "D",
        "texto": "Uso rotineiro de antibioticoterapia profilática em mulheres sexualmente ativas.",
        "correta": false,
        "justificativa": "Incorreta. Antibioticoterapia não tem papel na prevenção do câncer do colo do útero, cuja etiologia central é viral (HPV), e não bacteriana."
      }
    ],
    "_proveniencia": "SP 1 — O que eu fiz de errado? — Q20"
  },
  {
    "enunciado": "Homem de 61 anos, porteiro noturno, procura a UBS por sintomas urinários. O médico da unidade explica que, além do toque retal, será solicitado um exame laboratorial amplamente utilizado no rastreamento e seguimento do câncer de próstata, cujo valor pode se elevar tanto em neoplasias quanto em condições benignas como hiperplasia prostática e prostatites. Esse marcador é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "CA 19-9, marcador tumoral utilizado principalmente em neoplasias pancreáticas.",
        "correta": false,
        "justificativa": "Incorreta. CA 19-9 é utilizado principalmente no acompanhamento de neoplasias pancreáticas e biliares, sem relação direta com a avaliação prostática."
      },
      {
        "letra": "B",
        "texto": "antígeno prostático específico (PSA).",
        "correta": true,
        "justificativa": "O PSA (antígeno prostático específico) é o marcador sérico utilizado, em conjunto com o toque retal, na investigação inicial e no seguimento de doenças prostáticas, incluindo o câncer de próstata, embora não seja exclusivo de neoplasia (pode se elevar também em HPB e prostatites). Correta. O PSA é o marcador utilizado especificamente na avaliação e seguimento da próstata, elevando-se tanto em processos benignos quanto malignos."
      },
      {
        "letra": "C",
        "texto": "alfa-fetoproteína, marcador utilizado em hepatocarcinoma e tumores germinativos.",
        "correta": false,
        "justificativa": "Incorreta. A alfa-fetoproteína é utilizada no rastreamento e seguimento de hepatocarcinoma e de tumores germinativos, sem relação com a próstata."
      },
      {
        "letra": "D",
        "texto": "antígeno carcinoembrionário (CEA), utilizado principalmente no seguimento de câncer colorretal.",
        "correta": false,
        "justificativa": "Incorreta. O CEA é utilizado principalmente no seguimento do câncer colorretal e de outros tumores gastrointestinais, não sendo o marcador de escolha para avaliação prostática."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q1"
  },
  {
    "enunciado": "Após biópsia prostática de paciente com suspeita de neoplasia, o laudo histopatológico descreve o grau de diferenciação tumoral por meio da soma dos dois padrões arquiteturais glandulares mais representativos da amostra (o predominante e o segundo mais frequente), fornecendo informação prognóstica relevante. Esse sistema de graduação histológica é conhecido como escala de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Bishop, utilizada para avaliação do colo uterino no trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O índice de Bishop avalia as condições cervicais para indução do trabalho de parto, sem qualquer relação com graduação tumoral prostática."
      },
      {
        "letra": "B",
        "texto": "Gleason.",
        "correta": true,
        "justificativa": "O escore de Gleason soma os dois padrões histológicos mais representativos do adenocarcinoma prostático (o predominante e o segundo mais comum na amostra), refletindo o grau de diferenciação tumoral e correlacionando-se diretamente com o prognóstico da doença. Correta. A escala de Gleason é especificamente utilizada para graduação histológica do adenocarcinoma de próstata, somando os dois padrões glandulares mais representativos."
      },
      {
        "letra": "C",
        "texto": "Child-Pugh, utilizada para avaliação de gravidade de hepatopatia crônica.",
        "correta": false,
        "justificativa": "Incorreta. Child-Pugh avalia a gravidade da disfunção hepática em cirrose, sem relação com neoplasia prostática."
      },
      {
        "letra": "D",
        "texto": "Glasgow, utilizada para avaliação do nível de consciência.",
        "correta": false,
        "justificativa": "Incorreta. A Escala de Coma de Glasgow avalia nível de consciência em pacientes neurológicos ou traumatizados, sem qualquer relação com graduação histológica de tumores."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q2"
  },
  {
    "enunciado": "Em aula sobre disseminação neoplásica, discute-se que o câncer de próstata avançado apresenta padrão característico de disseminação à distância, explicado, entre outros fatores, pela drenagem venosa pélvica através do plexo venoso vertebral. Os principais sítios de metástase à distância do câncer de próstata avançado são",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ossos e linfonodos.",
        "correta": true,
        "justificativa": "O câncer de próstata dissemina-se preferencialmente por via linfática para linfonodos pélvicos e por via hematogênica para ossos, especialmente do esqueleto axial (coluna, pelve), explicando o padrão clássico de metástases dessa neoplasia. Correta. Ossos (especialmente esqueleto axial) e linfonodos regionais são os sítios metastáticos mais característicos e clinicamente relevantes do câncer de próstata avançado."
      },
      {
        "letra": "B",
        "texto": "pele e músculo esquelético.",
        "correta": false,
        "justificativa": "Incorreta. Metástases cutâneas e musculares são raras no câncer de próstata, não representando os sítios característicos dessa neoplasia."
      },
      {
        "letra": "C",
        "texto": "tireoide e glândula suprarrenal.",
        "correta": false,
        "justificativa": "Incorreta. Tireoide e suprarrenal não são sítios metastáticos característicos do câncer de próstata, ainda que metástases atípicas possam ocorrer excepcionalmente."
      },
      {
        "letra": "D",
        "texto": "baço e pâncreas.",
        "correta": false,
        "justificativa": "Incorreta. Baço e pâncreas não são sítios preferenciais de disseminação do câncer de próstata."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q3"
  },
  {
    "enunciado": "Durante discussão sobre diagnóstico diferencial de doenças prostáticas, o professor destaca que a hiperplasia prostática benigna (HPB) e o adenocarcinoma de próstata, apesar de acometerem o mesmo órgão, originam-se preferencialmente em regiões anatômicas distintas da glândula. Essa diferença topográfica é descrita como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "HPB originando-se predominantemente na zona transicional, enquanto o câncer acomete mais a zona periférica.",
        "correta": true,
        "justificativa": "A HPB origina-se predominantemente na zona transicional da próstata (região periuretral), enquanto o adenocarcinoma prostático acomete mais frequentemente a zona periférica da glândula, achado relevante para o exame de toque retal (que avalia principalmente a zona periférica) e para a interpretação de biópsias dirigidas. Correta. Essa é a distribuição topográfica clássica: HPB na zona transicional e adenocarcinoma predominantemente na zona periférica."
      },
      {
        "letra": "B",
        "texto": "HPB originando-se predominantemente na zona periférica, enquanto o câncer acomete a zona transicional.",
        "correta": false,
        "justificativa": "Incorreta. A distribuição está invertida em relação ao que classicamente se descreve na literatura urológica."
      },
      {
        "letra": "C",
        "texto": "ambas as condições acometendo exclusivamente a zona central da próstata, sem diferença topográfica.",
        "correta": false,
        "justificativa": "Incorreta. Embora a zona central também possa ser acometida ocasionalmente, não é o padrão predominante nem para HPB nem para o câncer de próstata."
      },
      {
        "letra": "D",
        "texto": "ambas as condições acometendo exclusivamente a zona transicional, de forma indistinguível.",
        "correta": false,
        "justificativa": "Incorreta. HPB e câncer de próstata têm, de fato, distribuição topográfica preferencial distinta, o que é clinicamente relevante e não indistinguível."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q4"
  },
  {
    "enunciado": "Em revisão de conceitos fundamentais de oncologia, os estudantes discutem o processo pelo qual células neoplásicas se disseminam de seu sítio de origem, implantam-se e proliferam em um órgão distante, formando um novo foco tumoral. Esse processo é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "invasão local, processo restrito ao tecido de origem do tumor.",
        "correta": false,
        "justificativa": "Incorreta. Invasão local descreve a infiltração de tecidos adjacentes ao tumor primário, processo distinto (embora relacionado) da disseminação a distância que caracteriza a metástase."
      },
      {
        "letra": "B",
        "texto": "metástase.",
        "correta": true,
        "justificativa": "Metástase é o processo de disseminação de células tumorais a partir do sítio primário, com implantação e crescimento de um novo foco neoplásico em órgão ou tecido distante, sendo característica definidora de malignidade. Correta. Metástase é exatamente o processo de disseminação, implantação e crescimento de células tumorais em sítio distante do tumor primário."
      },
      {
        "letra": "C",
        "texto": "displasia, alteração da maturação celular sem formação de novo foco tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Displasia refere-se a alterações da maturação e organização celular, frequentemente pré-neoplásicas, sem implicar formação de novo foco tumoral a distância."
      },
      {
        "letra": "D",
        "texto": "metaplasia, substituição de um tipo celular diferenciado por outro, sem implantação à distância.",
        "correta": false,
        "justificativa": "Incorreta. Metaplasia é a substituição reversível de um tipo celular diferenciado por outro, em resposta a estímulo, sem qualquer relação com implantação tumoral a distância."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q5"
  },
  {
    "enunciado": "Homem de 61 anos procura a UBS pela primeira vez em anos, relatando aumento da frequência urinária noturna, jato urinário enfraquecido e sensação de esvaziamento incompleto da bexiga, sintomas que ele atribuía ao envelhecimento. Nunca realizou exames preventivos e desconhece o significado do PSA, demonstrando resistência ao toque retal. Diante desse quadro, qual é a conduta inicial mais adequada na Atenção Primária?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Solicitar apenas ultrassonografia abdominal total, sem exame físico direcionado.",
        "correta": false,
        "justificativa": "Incorreta. A ultrassonografia abdominal isolada não substitui a avaliação clínica direcionada (toque retal) nem a dosagem de PSA na investigação inicial de sintomas prostáticos."
      },
      {
        "letra": "B",
        "texto": "Realizar toque retal e solicitar PSA sérico, além de acolher as preocupações do paciente sobre o exame físico.",
        "correta": true,
        "justificativa": "A avaliação inicial de paciente com sintomas urinários sugestivos de doença prostática deve incluir toque retal e dosagem de PSA na atenção primária, etapas que orientam a necessidade de investigação complementar e o encaminhamento especializado, sendo importante também o acolhimento das preocupações do paciente para viabilizar o exame físico. Correta. Toque retal e PSA são exames de primeira linha na investigação de sintomas urinários sugestivos de doença prostática, devendo ser acompanhados de acolhimento das preocupações do paciente."
      },
      {
        "letra": "C",
        "texto": "Encaminhar diretamente para biópsia prostática, sem qualquer avaliação clínica ou laboratorial prévia.",
        "correta": false,
        "justificativa": "Incorreta. Biópsia prostática não é conduta de primeira linha sem avaliação clínica e laboratorial prévia que justifique essa investigação invasiva."
      },
      {
        "letra": "D",
        "texto": "Iniciar antibioticoterapia empírica antes de qualquer investigação diagnóstica.",
        "correta": false,
        "justificativa": "Incorreta. Não há indicação de antibioticoterapia empírica sem quadro clínico sugestivo de infecção e sem qualquer investigação diagnóstica prévia."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q6"
  },
  {
    "enunciado": "Durante anamnese detalhada, um paciente com suspeita de câncer de próstata relata que seu pai foi tratado da mesma doença ainda jovem. O médico explica que esse dado é clinicamente relevante para a estratificação de risco do paciente. Em relação ao componente hereditário do câncer de próstata, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não há nenhuma associação genética ou familiar conhecida para essa neoplasia.",
        "correta": false,
        "justificativa": "Incorreta. Há associação genética e familiar bem estabelecida para o câncer de próstata, sendo a história familiar um dos principais fatores de risco não modificáveis reconhecidos."
      },
      {
        "letra": "B",
        "texto": "história familiar em parentes de primeiro grau (como pai ou irmão) aumenta o risco relativo de desenvolvimento da doença, havendo inclusive associação com mutações em genes como BRCA2.",
        "correta": true,
        "justificativa": "Homens com parentes de primeiro grau (pai, irmão) com câncer de próstata apresentam risco relativo aumentado da doença, refletindo componente hereditário reconhecido, com associação inclusive a mutações germinativas em genes como BRCA2, relevantes tanto para câncer de próstata quanto de mama/ovário na família. Correta. A história familiar em parentes de primeiro grau aumenta o risco, com associação documentada a mutações em genes como BRCA2, relevante para estratificação de risco e decisões sobre rastreamento."
      },
      {
        "letra": "C",
        "texto": "apenas mutações em BRCA2 protegem contra o desenvolvimento de câncer de próstata.",
        "correta": false,
        "justificativa": "Incorreta. Mutações em BRCA2 aumentam, e não protegem, o risco de câncer de próstata (além do risco de câncer de mama e ovário em familiares)."
      },
      {
        "letra": "D",
        "texto": "a herança genética relacionada ao câncer de próstata só é clinicamente relevante em mulheres da família.",
        "correta": false,
        "justificativa": "Incorreta. A herança genética relacionada ao câncer de próstata é relevante para os homens da família (parentes de primeiro grau), sendo esse justamente o dado utilizado na estratificação de risco."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q7"
  },
  {
    "enunciado": "O laudo de biópsia prostática de um paciente descreve escore de Gleason 8 (5+3). Ao explicar o resultado à família, o urologista destaca que a notação entre parênteses (5+3) tem significado prognóstico específico, distinto de uma soma equivalente obtida de outra forma (como 3+5). Sobre esse laudo, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o resultado indica tumor bem diferenciado, de baixo risco, sem necessidade de tratamento imediato.",
        "correta": false,
        "justificativa": "Incorreta. Um escore de Gleason 8 indica tumor pouco diferenciado e de alto risco, e não tumor bem diferenciado de baixo risco."
      },
      {
        "letra": "B",
        "texto": "o resultado indica tumor pouco diferenciado, de alto risco, sendo o padrão mais indiferenciado (5) o predominante na amostra, o que confere pior prognóstico do que se o padrão predominante fosse o 3.",
        "correta": true,
        "justificativa": "No escore de Gleason, o primeiro número indica o padrão histológico predominante e o segundo o segundo mais frequente; Gleason 8 (5+3) indica tumor pouco diferenciado e de alto risco, com o padrão mais indiferenciado (grau 5) sendo o predominante, conferindo pior prognóstico do que a mesma soma obtida como 3+5 (padrão predominante menos agressivo). Correta. A notação (5+3) indica que o padrão predominante é o mais indiferenciado (grau 5), conferindo prognóstico pior do que se a soma fosse obtida com o padrão 3 como predominante (3+5), mesmo com soma total idêntica."
      },
      {
        "letra": "C",
        "texto": "o resultado indica ausência de neoplasia, compatível apenas com hiperplasia benigna.",
        "correta": false,
        "justificativa": "Incorreta. Um escore de Gleason é atribuído a tecido neoplásico (adenocarcinoma), não sendo compatível com ausência de neoplasia."
      },
      {
        "letra": "D",
        "texto": "a ordem dos números na notação (5+3) não tem qualquer significado prognóstico adicional além da soma total.",
        "correta": false,
        "justificativa": "Incorreta. A ordem dos números tem significado prognóstico relevante: o primeiro número (padrão predominante) influencia o prognóstico mais do que a soma isolada sugere."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q8"
  },
  {
    "enunciado": "Em uma reunião de equipe sobre políticas de rastreamento oncológico, discute-se que a dosagem populacional rotineira do PSA em homens assintomáticos é tema controverso na literatura médica, apesar de sua ampla utilização clínica. Um dos principais dilemas éticos e de saúde pública relacionados a essa prática é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a ausência total de qualquer benefício comprovado do exame em qualquer contexto clínico.",
        "correta": false,
        "justificativa": "Incorreta. O PSA tem benefício documentado em determinados contextos (detecção precoce em grupos de risco), não sendo correto afirmar ausência total de benefício; o dilema é sobre o balanço risco-benefício populacional, e não sobre ausência completa de utilidade."
      },
      {
        "letra": "B",
        "texto": "o risco de sobrediagnóstico e sobretratamento de tumores indolentes, que poderiam não impactar a sobrevida do paciente, gerando efeitos adversos desnecessários do tratamento.",
        "correta": true,
        "justificativa": "O rastreamento por PSA pode identificar tumores de crescimento lento (indolentes) que não trariam impacto clínico relevante ao longo da vida do paciente, gerando sobrediagnóstico e submetendo pacientes a tratamentos (cirurgia, radioterapia) com efeitos adversos significativos (incontinência, disfunção erétil) sem benefício proporcional — por isso a decisão de rastrear deve ser compartilhada entre médico e paciente. Correta. Esse é o principal dilema ético/epidemiológico: sobrediagnóstico e sobretratamento de tumores que não ameaçariam a vida do paciente, com exposição desnecessária a efeitos adversos do tratamento."
      },
      {
        "letra": "C",
        "texto": "o fato de o exame ser extremamente caro e inacessível para a rede pública de saúde.",
        "correta": false,
        "justificativa": "Incorreta. O PSA é exame relativamente barato e amplamente disponível na rede pública; o dilema não está centrado em custo ou acesso, mas no balanço risco-benefício do rastreamento."
      },
      {
        "letra": "D",
        "texto": "a impossibilidade técnica de realizar o exame em qualquer faixa etária da população masculina.",
        "correta": false,
        "justificativa": "Incorreta. O exame pode ser realizado em qualquer faixa etária adulta; a controvérsia está relacionada à indicação populacional em massa, e não à viabilidade técnica do exame."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q9"
  },
  {
    "enunciado": "Em aula de patologia sobre invasão tumoral, discute-se o processo pelo qual células neoplásicas degradam a membrana basal e componentes da matriz extracelular, etapa fundamental para invasão de tecidos vizinhos e posterior disseminação metastática. Esse processo depende, entre outros fatores, da ação de enzimas denominadas",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "metaloproteinases de matriz.",
        "correta": true,
        "justificativa": "As metaloproteinases de matriz (MMPs) são enzimas proteolíticas que degradam componentes da matriz extracelular e da membrana basal, facilitando a invasão local das células tumorais e etapas subsequentes da cascata metastática, como a intravasão vascular. Correta. As metaloproteinases de matriz são as enzimas classicamente associadas à degradação da matriz extracelular e membrana basal no processo de invasão tumoral."
      },
      {
        "letra": "B",
        "texto": "hemoglobina glicada, marcador de controle glicêmico.",
        "correta": false,
        "justificativa": "Incorreta. Hemoglobina glicada é marcador de controle glicêmico em diabetes, sem qualquer relação com degradação de matriz extracelular."
      },
      {
        "letra": "C",
        "texto": "fator intrínseco gástrico, envolvido na absorção de vitamina B12.",
        "correta": false,
        "justificativa": "Incorreta. O fator intrínseco gástrico participa da absorção intestinal de vitamina B12, sem relação com invasão tumoral."
      },
      {
        "letra": "D",
        "texto": "lipase pancreática, envolvida na digestão de lipídeos.",
        "correta": false,
        "justificativa": "Incorreta. A lipase pancreática participa da digestão de lipídeos no trato gastrointestinal, sem qualquer papel na degradação da matriz extracelular tumoral."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q10"
  },
  {
    "enunciado": "Paciente de 78 anos, com diagnóstico de câncer de próstata localizado de baixo risco (Gleason 6, PSA baixo, estágio clínico inicial), apresenta múltiplas comorbidades e expectativa de vida limitada, estimada em poucos anos. Considerando as possibilidades terapêuticas disponíveis para esse cenário clínico específico, uma conduta aceita e frequentemente recomendada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "vigilância ativa, com monitorização periódica de PSA, toque retal e reavaliação clínica, evitando tratamento definitivo imediato.",
        "correta": true,
        "justificativa": "Em tumores de próstata de baixo risco e pacientes com expectativa de vida limitada por idade avançada e comorbidades, a vigilância ativa é conduta aceita e frequentemente preferida, evitando os efeitos adversos de tratamentos definitivos (cirurgia, radioterapia) sem benefício proporcional de sobrevida nesse contexto específico. Correta. A vigilância ativa é abordagem reconhecida para tumores de baixo risco em pacientes com expectativa de vida limitada, equilibrando segurança oncológica com qualidade de vida."
      },
      {
        "letra": "B",
        "texto": "quimioterapia sistêmica citotóxica imediata, independentemente do baixo risco tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Quimioterapia citotóxica não é indicada para doença localizada de baixo risco; é reservada a estágios avançados/metastáticos, geralmente após falha de outras terapias."
      },
      {
        "letra": "C",
        "texto": "orquiectomia bilateral em todos os casos, independentemente do risco tumoral ou da expectativa de vida.",
        "correta": false,
        "justificativa": "Incorreta. Orquiectomia bilateral (castração cirúrgica) é reservada a contextos de doença avançada hormônio-sensível, não sendo indicada rotineiramente em tumores localizados de baixo risco."
      },
      {
        "letra": "D",
        "texto": "radioterapia de corpo inteiro, técnica não indicada para tratamento localizado de próstata.",
        "correta": false,
        "justificativa": "Incorreta. Radioterapia de corpo inteiro não é técnica utilizada no tratamento do câncer de próstata localizado; a radioterapia empregada é dirigida à próstata (radioterapia externa conformacional ou braquiterapia)."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q11"
  },
  {
    "enunciado": "Homem de 61 anos, biópsia prostática com Gleason 8 (5+3), PSA de 42 ng/mL. A cintilografia óssea de corpo inteiro evidencia múltiplas lesões hipercaptantes em corpos vertebrais e ossos da bacia, compatíveis com metástases ósseas. Considerando a fisiopatologia da disseminação do câncer de próstata, a explicação mais adequada para esse padrão específico de acometimento ósseo (predomínio no esqueleto axial) é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "disseminação exclusivamente por contiguidade direta da próstata para os ossos pélvicos adjacentes, sem qualquer componente vascular.",
        "correta": false,
        "justificativa": "Incorreta. Embora a contiguidade possa ocorrer localmente em estágios avançados, o padrão de metástases ósseas a distância (coluna, bacia) descrito no caso é explicado pela disseminação vascular, e não apenas por contiguidade direta."
      },
      {
        "letra": "B",
        "texto": "disseminação hematogênica preferencial para o esqueleto axial, favorecida pela drenagem venosa prostática através do plexo venoso vertebral (plexo de Batson), que se comunica com a circulação vertebral sem passar obrigatoriamente pela circulação pulmonar.",
        "correta": true,
        "justificativa": "O câncer de próstata dissemina-se preferencialmente para o esqueleto axial (coluna, pelve) por via hematogênica através do plexo venoso vertebral (Batson), uma rede venosa avalvular que permite que células tumorais alcancem diretamente os corpos vertebrais e a pelve óssea, sem necessariamente passar pela circulação pulmonar primeiro, explicando o padrão de metástases ósseas observado. Correta. O plexo venoso de Batson é o mecanismo fisiopatológico clássico que explica a disseminação hematogênica preferencial do câncer de próstata para o esqueleto axial."
      },
      {
        "letra": "C",
        "texto": "disseminação linfática exclusiva para linfonodos cervicais, sem qualquer envolvimento ósseo direto.",
        "correta": false,
        "justificativa": "Incorreta. O padrão de disseminação descrito no caso é ósseo (coluna e bacia), não correspondendo a disseminação linfática cervical isolada."
      },
      {
        "letra": "D",
        "texto": "disseminação por via aérea, através de aspiração de células tumorais circulantes.",
        "correta": false,
        "justificativa": "Incorreta. Não existe mecanismo de disseminação metastática por via aérea/aspiração de células tumorais; essa opção não corresponde a nenhum mecanismo fisiopatológico reconhecido de metástase."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q12"
  },
  {
    "enunciado": "Paciente com câncer de próstata metastático, ainda sem tratamento hormonal prévio (hormônio-sensível), é encaminhado para terapia de privação androgênica como parte do tratamento sistêmico. Ao explicar o racional terapêutico dessa conduta, o oncologista destaca que a maioria dos adenocarcinomas prostáticos depende da sinalização androgênica para proliferação e sobrevivência celular. Com base nesse racional fisiopatológico, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "as células tumorais prostáticas dependem, em grande parte, da sinalização pela via do receptor androgênico para proliferação e sobrevivência, justificando o benefício da privação androgênica em reduzir a atividade tumoral.",
        "correta": true,
        "justificativa": "A maioria dos adenocarcinomas de próstata é hormônio-sensível, dependendo da sinalização pelo receptor androgênico para crescimento e sobrevivência celular; por isso, a privação androgênica (cirúrgica ou farmacológica) reduz a proliferação tumoral e controla temporariamente a doença metastática, embora não seja curativa a longo prazo, já que a maioria dos tumores eventualmente desenvolve resistência (progressão para doença resistente à castração). Correta. Esse é o racional fisiopatológico correto: a dependência androgênica da maioria dos tumores prostáticos justifica o benefício terapêutico da privação hormonal."
      },
      {
        "letra": "B",
        "texto": "os androgênios inibem diretamente a proliferação das células tumorais prostáticas, o que tornaria contraditória a privação androgênica.",
        "correta": false,
        "justificativa": "Incorreta. Os androgênios estimulam, e não inibem, a proliferação da maioria das células do adenocarcinoma prostático — por isso a privação androgênica reduz, e não aumenta, a atividade tumoral."
      },
      {
        "letra": "C",
        "texto": "a testosterona não tem qualquer papel relevante na biologia do adenocarcinoma de próstata.",
        "correta": false,
        "justificativa": "Incorreta. A testosterona tem papel central na biologia da maioria dos adenocarcinomas prostáticos, sendo o principal alvo terapêutico da privação androgênica."
      },
      {
        "letra": "D",
        "texto": "o bloqueio androgênico cura definitivamente a doença metastática em praticamente todos os casos, eliminando a necessidade de qualquer seguimento posterior.",
        "correta": false,
        "justificativa": "Incorreta. A privação androgênica controla a doença por período variável, mas a maioria dos tumores eventualmente progride para a forma resistente à castração, não sendo, portanto, tratamento curativo definitivo na doença metastática."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q13"
  },
  {
    "enunciado": "Em discussão sobre biologia tumoral, o professor apresenta o conceito de expansão clonal, explicando que um tumor não é uma população celular homogênea, mas sim um conjunto dinâmico de subpopulações que evoluem ao longo do tempo, inclusive sob pressão seletiva do tratamento. Em relação a esse conceito, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "todas as células de um tumor mantêm exatamente o mesmo genótipo da célula de origem, sem qualquer variação ao longo da progressão tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Tumores são geneticamente heterogêneos e evoluem clonalmente ao longo do tempo, acumulando novas mutações; não mantêm genótipo idêntico ao longo de toda a progressão."
      },
      {
        "letra": "B",
        "texto": "subpopulações celulares acumulam mutações adicionais ao longo do tempo, originando subclones com maior capacidade proliferativa, invasiva ou de resistência a tratamentos, processo relevante inclusive para explicar recidivas após terapia inicialmente eficaz.",
        "correta": true,
        "justificativa": "A expansão clonal descreve a seleção progressiva de subclones tumorais com vantagens proliferativas, invasivas ou de resistência terapêutica, decorrentes do acúmulo de mutações adicionais ao longo da evolução do tumor — processo central para explicar tanto a progressão da doença quanto o desenvolvimento de resistência a tratamentos inicialmente eficazes, como na progressão do câncer de próstata para a forma resistente à castração. Correta. A expansão clonal explica exatamente esse fenômeno de seleção de subclones com vantagens adaptativas, incluindo resistência a tratamentos."
      },
      {
        "letra": "C",
        "texto": "a expansão clonal ocorre exclusivamente em tumores benignos, sem qualquer relevância para neoplasias malignas.",
        "correta": false,
        "justificativa": "Incorreta. A expansão clonal é conceito central na biologia de neoplasias malignas, sendo, inclusive, um dos principais mecanismos de progressão e resistência terapêutica nesse contexto."
      },
      {
        "letra": "D",
        "texto": "não há qualquer relação entre expansão clonal e o desenvolvimento de resistência a terapias hormonais ou quimioterápicas.",
        "correta": false,
        "justificativa": "Incorreta. A expansão clonal está diretamente relacionada ao desenvolvimento de resistência terapêutica, como na seleção de subclones resistentes à privação androgênica no câncer de próstata avançado."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q14"
  },
  {
    "enunciado": "Em revisão sobre a cascata metastática, os estudantes descrevem as etapas necessárias para que uma célula tumoral circulante origine um novo foco de crescimento em órgão distante, após ter alcançado a corrente sanguínea (intravasão). A sequência correta dos eventos subsequentes até a colonização do novo tecido é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "adesão da célula tumoral circulante ao endotélio do órgão-alvo, seguida de diapedese através da parede vascular (extravasamento) e, por fim, colonização e crescimento no novo microambiente tecidual.",
        "correta": true,
        "justificativa": "Após a intravasão, as células tumorais circulantes que sobrevivem ao estresse hemodinâmico e imunológico da corrente sanguínea aderem ao endotélio do órgão-alvo, atravessam a parede vascular por diapedese (extravasamento) e colonizam o novo microambiente tecidual, onde podem proliferar e formar um foco metastático estabelecido. Correta. Essa é a sequência correta da cascata metastática após a intravasão: adesão endotelial, extravasamento por diapedese e colonização tecidual."
      },
      {
        "letra": "B",
        "texto": "apoptose imediata e obrigatória de toda célula tumoral ao entrar na corrente sanguínea, impedindo qualquer possibilidade de metástase.",
        "correta": false,
        "justificativa": "Incorreta. Embora a maioria das células tumorais circulantes efetivamente sofra apoptose (anoikis) ou seja eliminada pelo sistema imune, isso não é obrigatório para todas elas — algumas sobrevivem e originam metástases, o que contraria a afirmação de eliminação total e obrigatória."
      },
      {
        "letra": "C",
        "texto": "fusão espontânea da célula tumoral com hemácias circulantes, mecanismo necessário para sua sobrevivência vascular.",
        "correta": false,
        "justificativa": "Incorreta. Não há mecanismo fisiológico reconhecido de fusão entre células tumorais e hemácias como etapa necessária da cascata metastática."
      },
      {
        "letra": "D",
        "texto": "eliminação renal direta da célula tumoral circulante, sem qualquer interação com o endotélio vascular.",
        "correta": false,
        "justificativa": "Incorreta. Não existe mecanismo de eliminação renal direta de células tumorais circulantes como via de \"depuração\" fisiológica relevante nesse processo."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q15"
  },
  {
    "enunciado": "Comparando diretrizes de diferentes entidades sobre o rastreamento populacional do câncer de próstata por PSA em homens assintomáticos de risco médio, discute-se que há certa divergência de ênfase entre órgãos governamentais de saúde pública e sociedades de especialidade médica. Considerando as evidências atuais, a recomendação mais adequada para essa população é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "rastreamento obrigatório em massa a partir dos 40 anos, sem qualquer discussão individualizada sobre riscos e benefícios.",
        "correta": false,
        "justificativa": "Incorreta. Rastreamento obrigatório em massa, sem discussão individualizada, não é a recomendação atual baseada em evidências, dado o risco de sobrediagnóstico já discutido."
      },
      {
        "letra": "B",
        "texto": "tomada de decisão compartilhada entre médico e paciente, geralmente a partir dos 50 anos (ou mais precocemente em grupos de maior risco), ponderando riscos (sobrediagnóstico, biópsias desnecessárias) e benefícios (detecção precoce) do PSA.",
        "correta": true,
        "justificativa": "As diretrizes atuais recomendam decisão compartilhada entre médico e paciente, informando riscos (sobrediagnóstico, biópsias desnecessárias, efeitos adversos do tratamento) e benefícios (detecção precoce de tumores clinicamente relevantes) do rastreamento por PSA, geralmente a partir dos 50 anos em homens de risco médio, ou mais cedo (45 anos) em grupos de maior risco (história familiar, ascendência afrodescendente). Correta. A decisão compartilhada, com discussão individualizada de riscos e benefícios a partir dos 50 anos (ou antes, em grupos de risco), é a recomendação atual baseada em evidências."
      },
      {
        "letra": "C",
        "texto": "proibição total da realização do exame de PSA em qualquer idade ou contexto clínico.",
        "correta": false,
        "justificativa": "Incorreta. Não há recomendação de proibição total do exame; a controvérsia está relacionada à indicação populacional em massa, não à disponibilidade do exame para decisão individualizada."
      },
      {
        "letra": "D",
        "texto": "rastreamento indicado apenas em mulheres com história familiar de câncer de próstata, sem qualquer recomendação para homens.",
        "correta": false,
        "justificativa": "Incorreta. A frase contém erro conceitual grave: câncer de próstata acomete homens (a próstata é órgão exclusivamente masculino), não sendo aplicável a mulheres."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q16"
  },
  {
    "enunciado": "Durante consulta, um paciente demonstra forte resistência ao exame de toque retal, relatando vergonha e comentários jocosos de colegas de trabalho sobre o procedimento, o que o levou a adiar a investigação diagnóstica por meses. Do ponto de vista da atuação médica centrada na pessoa, a conduta mais adequada da equipe de saúde diante dessa resistência é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ignorar a resistência do paciente e proceder ao exame sem qualquer esclarecimento adicional ou construção de vínculo.",
        "correta": false,
        "justificativa": "Incorreta. Ignorar a resistência do paciente e proceder sem qualquer diálogo pode comprometer a confiança na relação médico-paciente e gerar trauma ou nova recusa a exames futuros."
      },
      {
        "letra": "B",
        "texto": "acolher a preocupação do paciente, explicar tecnicamente a importância e a técnica do exame de forma clara e respeitosa, e construir vínculo de confiança antes de proceder, sem julgamento moral sobre seus receios.",
        "correta": true,
        "justificativa": "O cuidado centrado na pessoa exige acolhimento das preocupações do paciente, esclarecimento técnico claro e respeitoso sobre a importância e a técnica do exame, e construção de vínculo de confiança antes de proceder, reduzindo barreiras culturais e emocionais que podem atrasar o diagnóstico precoce de doenças graves. Correta. O acolhimento respeitoso, associado a esclarecimento técnico adequado, é a conduta que melhor concilia a necessidade clínica do exame com o cuidado centrado na pessoa."
      },
      {
        "letra": "C",
        "texto": "substituir definitivamente o exame físico por exames de imagem, sem qualquer justificativa técnica para essa substituição.",
        "correta": false,
        "justificativa": "Incorreta. Substituir o exame físico por exames de imagem sem justificativa técnica clara não é conduta baseada em evidências e pode gerar custos e atrasos desnecessários."
      },
      {
        "letra": "D",
        "texto": "encaminhar o paciente para outro serviço de saúde, sem qualquer orientação ou tentativa de acolhimento na própria consulta.",
        "correta": false,
        "justificativa": "Incorreta. Encaminhar sem qualquer tentativa de acolhimento transfere o problema sem resolver a barreira de comunicação, além de poder gerar sensação de abandono no paciente."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q17"
  },
  {
    "enunciado": "Em um município de médio porte, o fluxo de regulação do SUS para investigação de suspeita de câncer de próstata na atenção primária é discutido em uma reunião de gestão. O objetivo é conciliar diagnóstico precoce e uso racional dos recursos especializados disponíveis, evitando tanto encaminhamentos desnecessários quanto atrasos graves no diagnóstico. A conduta que melhor atende a esse objetivo é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "encaminhar todo paciente com qualquer valor de PSA, mesmo discretamente alterado, diretamente para cirurgia oncológica, sem avaliação urológica prévia.",
        "correta": false,
        "justificativa": "Incorreta. Encaminhar diretamente para cirurgia oncológica sem avaliação urológica e confirmação diagnóstica prévia (biópsia) é conduta inadequada e não segue o fluxo racional de investigação."
      },
      {
        "letra": "B",
        "texto": "realizar avaliação clínica inicial completa (toque retal, PSA, sintomas urinários) na UBS, encaminhando ao urologista os casos com critérios de suspeita definidos em protocolo de regulação, conforme fluxo pactuado na rede.",
        "correta": true,
        "justificativa": "O fluxo adequado de regulação do SUS prevê avaliação clínica inicial completa na atenção primária (toque retal, PSA, avaliação de sintomas), com encaminhamento regulado ao urologista dos casos que atendem a critérios de suspeita definidos em protocolo, otimizando o uso dos recursos especializados e reduzindo tanto encaminhamentos desnecessários quanto demora indevida nos casos que realmente necessitam de avaliação especializada. Correta. Essa é a conduta que concilia diagnóstico precoce e uso racional de recursos, seguindo fluxo de regulação com critérios definidos de encaminhamento."
      },
      {
        "letra": "C",
        "texto": "não encaminhar nenhum paciente à atenção especializada, mantendo toda a investigação exclusivamente na atenção primária, independentemente dos achados.",
        "correta": false,
        "justificativa": "Incorreta. Não encaminhar nenhum paciente à atenção especializada, independentemente dos achados, pode atrasar o diagnóstico de casos que realmente necessitam de avaliação urológica e biópsia."
      },
      {
        "letra": "D",
        "texto": "solicitar diretamente biópsia prostática na própria UBS, sem qualquer avaliação especializada prévia.",
        "correta": false,
        "justificativa": "Incorreta. Biópsia prostática é procedimento especializado que exige avaliação urológica prévia, não sendo indicado solicitá-la diretamente na atenção primária sem critérios clínicos e laboratoriais que a justifiquem."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q18"
  },
  {
    "enunciado": "Paciente com câncer de próstata localmente avançado (sem metástases à distância confirmadas, mas com invasão local significativa) é discutido em reunião multidisciplinar de oncologia para definição do plano terapêutico. Considerando as possibilidades terapêuticas atuais reconhecidas para esse estágio da doença, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a radioterapia associada à terapia de privação androgênica é uma opção terapêutica reconhecida e com benefício de sobrevida demonstrado nesse cenário.",
        "correta": true,
        "justificativa": "No câncer de próstata localmente avançado, a radioterapia combinada à terapia de privação androgênica é estratégia terapêutica reconhecida, com benefício de sobrevida demonstrado em ensaios clínicos, sendo uma das principais opções de tratamento com intenção curativa nesse cenário, ao lado da cirurgia radical em casos selecionados. Correta. A combinação de radioterapia com privação androgênica é opção terapêutica reconhecida e validada por evidência científica para esse estágio da doença."
      },
      {
        "letra": "B",
        "texto": "a única opção terapêutica válida para doença localmente avançada é a prostatectomia radical isolada, sem qualquer terapia associada.",
        "correta": false,
        "justificativa": "Incorreta. A prostatectomia radical isolada nem sempre é suficiente ou indicada em doença localmente avançada; frequentemente há necessidade de terapia adjuvante/combinada, e a radioterapia associada à hormonioterapia é alternativa validada."
      },
      {
        "letra": "C",
        "texto": "a quimioterapia citotóxica sistêmica é sempre a primeira linha de tratamento para doença localmente avançada, independentemente do estágio.",
        "correta": false,
        "justificativa": "Incorreta. A quimioterapia citotóxica sistêmica não é a primeira linha para doença localmente avançada (não metastática); é reservada principalmente para estágios metastáticos, especialmente resistentes à castração."
      },
      {
        "letra": "D",
        "texto": "não existe qualquer tratamento eficaz disponível para câncer de próstata localmente avançado, sendo indicados apenas cuidados paliativos exclusivos.",
        "correta": false,
        "justificativa": "Incorreta. Existem tratamentos com intenção curativa reconhecidos para doença localmente avançada (radioterapia + hormonioterapia, cirurgia em casos selecionados), não sendo correto afirmar ausência de tratamento eficaz."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q19"
  },
  {
    "enunciado": "Comparando as políticas de rastreamento do câncer de próstata preconizadas pelo Ministério da Saúde brasileiro e por sociedades de especialidade, como a Sociedade Brasileira de Urologia, discute-se em uma aula de saúde coletiva as diferenças de ênfase entre essas recomendações. É correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "as duas entidades têm posicionamento idêntico e não há qualquer controvérsia sobre o tema no cenário brasileiro.",
        "correta": false,
        "justificativa": "Incorreta. Há divergência de ênfase real e documentada entre essas entidades quanto à recomendação de rastreamento populacional por PSA."
      },
      {
        "letra": "B",
        "texto": "o Ministério da Saúde não recomenda rastreamento populacional rotineiro por PSA, priorizando decisão individualizada frente às incertezas de benefício líquido, enquanto sociedades de especialidade tendem a valorizar mais ativamente a discussão do rastreamento a partir dos 50 anos (ou antes, em grupos de risco).",
        "correta": true,
        "justificativa": "Há divergência de ênfase entre o Ministério da Saúde, que não recomenda rastreamento populacional rotineiro por PSA devido às incertezas sobre o benefício líquido em nível populacional, e sociedades de especialidade (como a SBU), que tendem a recomendar de forma mais ativa a discussão do rastreamento a partir dos 50 anos (ou antes, em grupos de risco), evidenciando a necessidade de decisão compartilhada baseada em evidências e adaptada ao contexto individual do paciente. Correta. Essa descrição reflete corretamente a divergência de posicionamento entre as diretrizes do Ministério da Saúde e das sociedades de especialidade sobre o tema."
      },
      {
        "letra": "C",
        "texto": "nenhuma das duas entidades reconhece o PSA como exame clinicamente válido para qualquer finalidade.",
        "correta": false,
        "justificativa": "Incorreta. Ambas as entidades reconhecem a validade clínica do PSA como ferramenta diagnóstica e de seguimento; a controvérsia está relacionada à indicação de rastreamento populacional em massa, não à validade do exame em si."
      },
      {
        "letra": "D",
        "texto": "o rastreamento por toque retal foi formalmente abolido por ambas as entidades, sendo considerado obsoleto.",
        "correta": false,
        "justificativa": "Incorreta. O toque retal continua sendo parte da avaliação clínica recomendada na investigação de doenças prostáticas, não tendo sido abolido por nenhuma das entidades."
      }
    ],
    "_proveniencia": "SP 2 — Quando o tempo é decisivo... — Q20"
  },
  {
    "enunciado": "Durante discussão sobre a fisiopatologia das neoplasias, um estudante questiona em qual fase do ciclo celular ocorre a duplicação completa do material genético, etapa indispensável antes de a célula avançar para a mitose. Essa fase, situada entre as fases G1 e G2 da intérfase, é denominada",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "fase G1, período de intensa síntese proteica sem replicação do DNA.",
        "correta": false,
        "justificativa": "Incorreta. Em G1 ocorre crescimento celular e síntese de proteínas e organelas, mas o DNA ainda não foi replicado."
      },
      {
        "letra": "B",
        "texto": "fase S, na qual ocorre a síntese (duplicação) do DNA.",
        "correta": true,
        "justificativa": "A fase S (síntese) da intérfase é o período em que ocorre a replicação completa do DNA, condição necessária para que a célula, após passar por G2, entre em mitose com material genético duplicado. Correta. A fase S é exatamente o período de duplicação do DNA, situando-se entre G1 e G2 na intérfase."
      },
      {
        "letra": "C",
        "texto": "fase G2, período de preparação final para a divisão celular.",
        "correta": false,
        "justificativa": "Incorreta. G2 é a fase de preparação final (síntese de proteínas necessárias à mitose e verificação de erros), após a replicação do DNA já ter ocorrido em S."
      },
      {
        "letra": "D",
        "texto": "metáfase, fase de alinhamento dos cromossomos na placa equatorial.",
        "correta": false,
        "justificativa": "Incorreta. A metáfase é uma fase da mitose propriamente dita, não da intérfase, e ocorre após a duplicação do DNA já ter sido concluída."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q1"
  },
  {
    "enunciado": "Em aula sobre genes envolvidos na carcinogênese, o professor destaca que um determinado gene supressor tumoral atua como \"guardião do genoma\", interrompendo o ciclo celular no ponto de checagem G1/S diante de dano ao DNA e induzindo apoptose quando o reparo não é possível, sendo o gene mais frequentemente encontrado mutado em neoplasias humanas. Esse gene é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "RAS, proto-oncogene ativado por mutações de ganho de função.",
        "correta": false,
        "justificativa": "Incorreta. RAS é um proto-oncogene (não supressor tumoral); quando mutado, tem ganho de função e estimula a proliferação celular, não atuando como \"guardião do genoma\"."
      },
      {
        "letra": "B",
        "texto": "MYC, fator de transcrição que estimula proliferação celular.",
        "correta": false,
        "justificativa": "Incorreta. MYC é um fator de transcrição que, quando desregulado, estimula proliferação celular; não é um gene supressor tumoral e não tem a função descrita."
      },
      {
        "letra": "C",
        "texto": "p53 (TP53), gene supressor tumoral guardião do genoma.",
        "correta": true,
        "justificativa": "O TP53 (p53) é chamado de \"guardião do genoma\" por deter o ciclo celular em G1/S diante de dano ao DNA e induzir apoptose quando o reparo é inviável, sendo o gene supressor tumoral mais comumente alterado nos cânceres humanos. Correta. O p53 é o clássico \"guardião do genoma\", controlando o ponto de checagem G1/S e induzindo apoptose diante de dano irreparável ao DNA."
      },
      {
        "letra": "D",
        "texto": "BCL-2, gene relacionado à inibição da apoptose.",
        "correta": false,
        "justificativa": "Incorreta. BCL-2 é uma proteína antiapoptótica, cuja superexpressão inibe a apoptose e favorece a sobrevivência de células neoplásicas, função oposta à descrita no enunciado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q2"
  },
  {
    "enunciado": "O papilomavírus humano (HPV) oncogênico é reconhecido como agente etiológico central do câncer do colo do útero. Duas proteínas virais atuam diretamente sobre reguladores do ciclo celular do hospedeiro: uma promove a degradação de p53 e outra inativa a proteína do retinoblastoma (pRb), retirando pontos de checagem essenciais e favorecendo a proliferação descontrolada. Essas duas oncoproteínas virais são, respectivamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "L1 e L2, proteínas estruturais do capsídeo viral.",
        "correta": false,
        "justificativa": "Incorreta. L1 e L2 são proteínas estruturais do capsídeo viral, envolvidas na montagem do vírion e usadas como alvo antigênico nas vacinas, sem ação direta sobre p53/pRb."
      },
      {
        "letra": "B",
        "texto": "E6 e E7, oncoproteínas virais precoces.",
        "correta": true,
        "justificativa": "As oncoproteínas E6 (que promove a degradação de p53) e E7 (que inativa pRb) dos HPVs de alto risco oncogênico (como os tipos 16 e 18) desregulam pontos de checagem essenciais do ciclo celular, favorecendo o acúmulo de mutações e a progressão neoplásica. Correta. E6 degrada p53 e E7 inativa pRb, sendo essas as oncoproteínas centrais na carcinogênese associada ao HPV de alto risco."
      },
      {
        "letra": "C",
        "texto": "E1 e E2, proteínas reguladoras da replicação do genoma viral.",
        "correta": false,
        "justificativa": "Incorreta. E1 e E2 participam da replicação e regulação transcricional do genoma viral, mas não são as principais responsáveis pela inativação de p53/pRb."
      },
      {
        "letra": "D",
        "texto": "E4 e E5, proteínas acessórias sem relação com o ciclo celular do hospedeiro.",
        "correta": false,
        "justificativa": "Incorreta. E4 e E5 têm papéis acessórios no ciclo viral (maturação e modulação de sinalização celular), mas não são as oncoproteínas classicamente associadas à degradação de p53 e pRb."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q3"
  },
  {
    "enunciado": "Uma equipe de saúde da família está organizando uma campanha de rastreamento do câncer do colo do útero em sua área de abrangência. Segundo as diretrizes vigentes do Ministério da Saúde, a citologia oncótica (Papanicolau) deve ser oferecida a mulheres com vida sexual ativa a partir de qual idade, repetindo-se anualmente até dois exames normais consecutivos?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "18 anos.",
        "correta": false,
        "justificativa": "Incorreta. Rastrear a partir dos 18 anos geraria sobrediagnóstico de alterações transitórias comuns em mulheres jovens, sem benefício comprovado, motivo pelo qual essa idade não é recomendada."
      },
      {
        "letra": "B",
        "texto": "21 anos.",
        "correta": false,
        "justificativa": "Incorreta. A idade de 21 anos é adotada por outras diretrizes internacionais, mas não corresponde à recomendação vigente do Ministério da Saúde brasileiro."
      },
      {
        "letra": "C",
        "texto": "25 anos.",
        "correta": true,
        "justificativa": "O Ministério da Saúde recomenda início do rastreamento citológico aos 25 anos em mulheres com vida sexual ativa, com periodicidade anual inicial e, após dois exames normais consecutivos, trienal. Correta. A diretriz brasileira estabelece 25 anos como idade de início do rastreamento em mulheres com vida sexual ativa."
      },
      {
        "letra": "D",
        "texto": "30 anos, apenas.",
        "correta": false,
        "justificativa": "Incorreta. Iniciar apenas aos 30 anos postergaria demasiadamente a detecção de lesões precursoras que podem se desenvolver antes dessa idade."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q4"
  },
  {
    "enunciado": "Uma mulher realiza citologia oncótica de rotina na UBS e o laudo citopatológico, segundo a nomenclatura de Bethesda, descreve o achado como \"ASC-US\". Ao explicar o resultado à paciente, o médico da unidade deve esclarecer que essa sigla corresponde a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "carcinoma epidermoide invasor, já com invasão estromal confirmada.",
        "correta": false,
        "justificativa": "Incorreta. Carcinoma invasor é achado citológico de gravidade muito maior, com células claramente malignas, distinto do significado indeterminado do ASC-US."
      },
      {
        "letra": "B",
        "texto": "células escamosas atípicas de significado indeterminado.",
        "correta": true,
        "justificativa": "ASC-US (Atypical Squamous Cells of Undetermined Significance) designa alterações citológicas em células escamosas cuja natureza não pode ser definida com certeza como reativa ou neoplásica, exigindo investigação complementar conforme idade e histórico da paciente. Correta. ASC-US representa alteração celular escamosa de significado indeterminado, sem definição imediata entre processo reativo/inflamatório e lesão intraepitelial."
      },
      {
        "letra": "C",
        "texto": "lesão intraepitelial escamosa de alto grau (HSIL).",
        "correta": false,
        "justificativa": "Incorreta. HSIL representa lesão intraepitelial de alto grau, com alterações citológicas mais definidas e maior risco de doença invasiva, diferente da incerteza descrita no ASC-US."
      },
      {
        "letra": "D",
        "texto": "adenocarcinoma in situ do colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. Adenocarcinoma in situ refere-se a alterações do epitélio glandular endocervical, categoria citológica distinta e mais grave que o ASC-US."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q5"
  },
  {
    "enunciado": "Durante a discussão do caso de Maria Aparecida, os estudantes revisam os conceitos fundamentais de oncologia. Um deles pergunta qual é a principal característica biológica que diferencia uma neoplasia maligna de uma neoplasia benigna, do ponto de vista histopatológico e clínico. A resposta mais adequada é a capacidade da neoplasia maligna de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "crescer lentamente e permanecer encapsulada, sem invadir estruturas vizinhas.",
        "correta": false,
        "justificativa": "Incorreta. Esse comportamento (crescimento lento, encapsulado, sem invasão) é típico de neoplasias benignas, e não malignas."
      },
      {
        "letra": "B",
        "texto": "invadir tecidos adjacentes localmente e originar metástases à distância.",
        "correta": true,
        "justificativa": "A capacidade de invasão local de tecidos adjacentes e de originar metástases (implantes tumorais à distância) é a característica biológica fundamental que distingue neoplasias malignas das benignas, estas geralmente encapsuladas e de crescimento expansivo local. Correta. Invasão tecidual local e metástase à distância são marcas biológicas que definem a malignidade de uma neoplasia."
      },
      {
        "letra": "C",
        "texto": "apresentar sempre células bem diferenciadas, semelhantes ao tecido de origem.",
        "correta": false,
        "justificativa": "Incorreta. Neoplasias malignas frequentemente apresentam graus variáveis de diferenciação, podendo ser pouco diferenciadas (anaplásicas); diferenciação boa e uniforme é mais típica de tumores benignos."
      },
      {
        "letra": "D",
        "texto": "permanecer assintomática durante toda a vida do paciente.",
        "correta": false,
        "justificativa": "Incorreta. Embora algumas neoplasias malignas possam ser assintomáticas por período variável, isso não é regra nem característica definidora de malignidade."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q6"
  },
  {
    "enunciado": "Mulher de 41 anos, auxiliar de limpeza, sem uso regular de preservativos e sem histórico de vacinação contra HPV na adolescência, realiza citologia oncótica atrasada há cinco anos em ação da UBS. O resultado mostra ASC-US. Considerando que a paciente tem mais de 30 anos, qual conduta é preconizada pelas diretrizes brasileiras de rastreamento diante desse achado citológico?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Repetir a citologia em 6 meses, independentemente da idade da paciente.",
        "correta": false,
        "justificativa": "Incorreta. A repetição em 6 meses é conduta preconizada para mulheres mais jovens (abaixo de 30 anos) com ASC-US, e não para essa faixa etária, na qual o risco de lesão de alto grau é maior."
      },
      {
        "letra": "B",
        "texto": "Encaminhar diretamente para colposcopia, dado o maior risco de lesão de alto grau nessa faixa etária.",
        "correta": true,
        "justificativa": "Em mulheres com 30 anos ou mais e resultado de ASC-US, a diretriz brasileira recomenda encaminhamento direto para colposcopia, pelo maior risco de lesão intraepitelial de alto grau associado à idade mais avançada, diferentemente da conduta adotada em mulheres mais jovens (repetição citológica). Correta. Em mulheres com 30 anos ou mais, o ASC-US deve motivar encaminhamento direto para colposcopia, pelo maior risco de doença significativa nessa faixa etária."
      },
      {
        "letra": "C",
        "texto": "Solicitar apenas sorologia para HIV e hepatites, sem outra conduta específica sobre o colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. Embora a triagem para IST possa ser pertinente em determinados contextos, ela não substitui a investigação colposcópica específica indicada pelo achado citológico."
      },
      {
        "letra": "D",
        "texto": "Tranquilizar a paciente e repetir a citologia apenas em 3 anos, como se o exame fosse normal.",
        "correta": false,
        "justificativa": "Incorreta. Considerar o resultado como normal e postergar por 3 anos ignoraria uma alteração citológica que já indica necessidade de investigação, aumentando o risco de diagnóstico tardio."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q7"
  },
  {
    "enunciado": "Em aula sobre biologia molecular do câncer cervical, o professor detalha o mecanismo pelo qual a oncoproteína E6 do HPV de alto risco compromete a função de p53, favorecendo a sobrevivência de células com dano genômico que, em condições normais, seriam eliminadas por apoptose. Esse mecanismo molecular específico envolve",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ativação direta da via mitocondrial de apoptose por E6, aumentando a morte celular programada.",
        "correta": false,
        "justificativa": "Incorreta. E6 tem efeito oposto: reduz a apoptose ao degradar p53, não a estimula por via mitocondrial."
      },
      {
        "letra": "B",
        "texto": "ligação de E6 a uma ubiquitina-ligase (E6-AP), promovendo ubiquitinação e degradação proteassomal de p53.",
        "correta": true,
        "justificativa": "A oncoproteína E6 recruta a ubiquitina-ligase celular E6-AP, formando um complexo que ubiquitina p53 e a direciona para degradação pelo proteassoma, eliminando funcionalmente o principal ponto de controle do ciclo celular em resposta a dano no DNA. Correta. Esse é exatamente o mecanismo molecular descrito na literatura: E6 associa-se à E6-AP, promovendo ubiquitinação e degradação de p53 pelo proteassoma."
      },
      {
        "letra": "C",
        "texto": "metilação do promotor do gene TP53, silenciando sua transcrição de forma epigenética.",
        "correta": false,
        "justificativa": "Incorreta. A inativação de p53 pelo HPV ocorre por degradação proteica pós-traducional mediada por E6, e não por silenciamento epigenético do gene."
      },
      {
        "letra": "D",
        "texto": "inibição direta da enzima telomerase, encurtando os telômeros e induzindo senescência celular.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo de E6 não envolve a telomerase; na verdade, outra proteína viral (E6, em outro contexto) pode ativar a telomerase em algumas células, mas esse não é o mecanismo relacionado à inativação de p53 descrito no enunciado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q8"
  },
  {
    "enunciado": "Durante discussão epidemiológica sobre câncer do colo do útero, os estudantes analisam dados que apontam a infecção persistente por determinados subtipos virais como condição necessária, embora não suficiente, para o desenvolvimento da neoplasia cervical. Entre os fatores discutidos (multiparidade, tabagismo, uso de contraceptivos hormonais, imunossupressão), qual é considerado o principal fator de risco, sem o qual a doença praticamente não se desenvolve?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Multiparidade isolada, independentemente de outros fatores.",
        "correta": false,
        "justificativa": "Incorreta. A multiparidade é reconhecida como cofator que aumenta o risco na presença de infecção por HPV, mas isoladamente não causa a neoplasia cervical."
      },
      {
        "letra": "B",
        "texto": "Infecção persistente por HPV oncogênico, especialmente os tipos 16 e 18.",
        "correta": true,
        "justificativa": "A infecção persistente por tipos oncogênicos de HPV, principalmente 16 e 18, é considerada condição necessária para o desenvolvimento do câncer cervical; os demais fatores (multiparidade, tabagismo, uso de contraceptivos) atuam como cofatores que aumentam o risco na presença da infecção viral persistente, mas não são causas isoladas suficientes. Correta. A persistência da infecção por HPV oncogênico é considerada condição necessária (embora não suficiente isoladamente) para a carcinogênese cervical."
      },
      {
        "letra": "C",
        "texto": "Uso isolado de contraceptivos hormonais combinados, sem outros fatores associados.",
        "correta": false,
        "justificativa": "Incorreta. O uso de contraceptivos hormonais combinados é cofator discutido na literatura, mas não é o principal fator de risco nem causa a doença na ausência de infecção por HPV."
      },
      {
        "letra": "D",
        "texto": "Tabagismo isolado, na ausência de infecção viral.",
        "correta": false,
        "justificativa": "Incorreta. O tabagismo é cofator que aumenta o risco em mulheres já infectadas pelo HPV, mas isoladamente, sem a infecção viral, não é a principal causa da neoplasia cervical."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q9"
  },
  {
    "enunciado": "Mulher de 35 anos procura a UBS relatando sangramento pós-coital recorrente nos últimos dois meses. Ao exame especular, observa-se lesão exofítica, friável, com sangramento ao toque, localizada no colo uterino. A citologia ainda não foi realizada nesta consulta. Diante desse achado ao exame especular, qual é a conduta prioritária?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Repetir apenas a citologia oncótica em 12 meses, como rotina de rastreamento.",
        "correta": false,
        "justificativa": "Incorreta. Postergar a investigação para rastreamento de rotina desconsidera a gravidade do achado macroscópico já suspeito, retardando um diagnóstico potencialmente urgente."
      },
      {
        "letra": "B",
        "texto": "Realizar biópsia dirigida da lesão visível, independentemente do resultado citológico.",
        "correta": true,
        "justificativa": "Diante de lesão macroscopicamente suspeita (exofítica, friável, sangrante) ao exame especular, a biópsia dirigida deve ser realizada prontamente, independentemente do resultado da citologia, pela alta suspeita clínica de neoplasia invasora, que exige confirmação histopatológica sem demora. Correta. Lesão suspeita visível ao exame especular exige biópsia dirigida imediata, não devendo a conduta depender do resultado citológico, que pode inclusive ser normal em algumas neoplasias invasoras."
      },
      {
        "letra": "C",
        "texto": "Iniciar tratamento empírico com antifúngico vaginal e reavaliar em 30 dias.",
        "correta": false,
        "justificativa": "Incorreta. Não há dados clínicos (corrimento, prurido, aspecto compatível) que sustentem hipótese de infecção fúngica como causa do sangramento e da lesão descrita; tratar empiricamente atrasaria o diagnóstico correto."
      },
      {
        "letra": "D",
        "texto": "Solicitar apenas ultrassonografia transvaginal antes de qualquer outra conduta.",
        "correta": false,
        "justificativa": "Incorreta. A ultrassonografia transvaginal não substitui a biópsia para confirmação histopatológica de lesão cervical suspeita visível ao exame especular."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q10"
  },
  {
    "enunciado": "Uma equipe de saúde da família planeja ações de imunização em parceria com escolas do território, com foco na prevenção primária do câncer do colo do útero. Segundo o Programa Nacional de Imunizações, a vacinação contra HPV é indicada, prioritariamente, para meninas e meninos em qual faixa etária, justificando-se essa escolha pelo momento anterior ao início da vida sexual?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "0 a 2 anos, em dose única, junto ao calendário básico da primeira infância.",
        "correta": false,
        "justificativa": "Incorreta. A vacina contra HPV não está indicada para lactentes; a resposta imunológica e a lógica de prevenção antes da exposição sexual justificam a faixa etária mais próxima da puberdade."
      },
      {
        "letra": "B",
        "texto": "9 a 14 anos.",
        "correta": true,
        "justificativa": "O PNI prioriza a vacinação contra HPV para meninas e meninos de 9 a 14 anos, faixa etária de maior benefício imunológico e epidemiológico, por anteceder, na maioria dos casos, o início da vida sexual e a exposição ao vírus. Correta. A faixa de 9 a 14 anos é a prioritária no PNI, por anteceder, na maior parte dos casos, o início da vida sexual."
      },
      {
        "letra": "C",
        "texto": "18 a 26 anos, de forma obrigatória para toda a população.",
        "correta": false,
        "justificativa": "Incorreta. Embora a vacinação possa ser considerada em grupos específicos até faixas etárias mais avançadas, ela não é obrigatória de forma universal nessa faixa e não é a prioridade do programa."
      },
      {
        "letra": "D",
        "texto": "Apenas mulheres acima de 30 anos, como estratégia de rastreamento substitutivo.",
        "correta": false,
        "justificativa": "Incorreta. A vacina é medida de prevenção primária (antes da exposição ao vírus) e não substitui o rastreamento citológico, tampouco é indicada exclusivamente após os 30 anos."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q11"
  },
  {
    "enunciado": "Paciente com diagnóstico confirmado de carcinoma epidermoide de colo uterino é submetida a exames de estadiamento. O laudo descreve invasão tumoral que se estende ao paramétrio, sem atingir a parede pélvica e sem hidronefrose associada. Segundo o sistema de estadiamento FIGO, esse achado corresponde ao estágio",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "IA, tumor microscópico restrito ao colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. O estágio IA descreve doença microinvasiva, identificada apenas microscopicamente, incompatível com invasão parametrial macroscópica descrita no caso."
      },
      {
        "letra": "B",
        "texto": "IB, tumor clinicamente visível, restrito ao colo uterino.",
        "correta": false,
        "justificativa": "Incorreta. O estágio IB descreve tumor clinicamente visível, mas ainda restrito ao colo uterino, sem extensão parametrial, o que não corresponde ao achado descrito."
      },
      {
        "letra": "C",
        "texto": "IIB, com invasão parametrial, sem atingir a parede pélvica.",
        "correta": true,
        "justificativa": "O estágio IIB caracteriza-se pela invasão parametrial sem atingir a parede pélvica; a extensão até a parede pélvica e/ou a presença de hidronefrose/rim não funcionante caracterizaria estágio IIIB, mais avançado. Correta. A invasão parametrial sem atingir a parede pélvica caracteriza exatamente o estágio IIB do sistema FIGO."
      },
      {
        "letra": "D",
        "texto": "IIIB, com extensão até a parede pélvica e/ou hidronefrose.",
        "correta": false,
        "justificativa": "Incorreta. O estágio IIIB exige extensão até a parede pélvica e/ou hidronefrose/exclusão renal, achados ausentes no caso descrito, que menciona apenas invasão parametrial sem esses critérios."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q12"
  },
  {
    "enunciado": "Durante revisão sobre vias de sinalização envolvidas na proliferação celular, os estudantes discutem o proto-oncogene RAS, frequentemente mutado em diversas neoplasias humanas. Em condições fisiológicas, RAS atua como uma proteína transdutora de sinal que se ativa transitoriamente após estímulo de fatores de crescimento. Quando mutado de forma oncogênica, RAS contribui para a carcinogênese porque",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "perde completamente sua função enzimática, tornando-se inerte.",
        "correta": false,
        "justificativa": "Incorreta. A mutação oncogênica de RAS não causa perda de função; ao contrário, resulta em ganho de função com ativação constitutiva."
      },
      {
        "letra": "B",
        "texto": "passa a ser constitutivamente ativo, estimulando proliferação celular independentemente de sinal externo.",
        "correta": true,
        "justificativa": "Mutações oncogênicas em RAS resultam em ganho de função, mantendo a proteína no estado ativado (ligada a GTP) de forma constitutiva, o que perpetua sinais mitogênicos via cascata de MAP-quinases mesmo sem estímulo de fatores de crescimento externos. Correta. A mutação mantém RAS permanentemente ativado, perpetuando sinais proliferativos independentemente de estímulo externo, mecanismo clássico de ganho de função oncogênica."
      },
      {
        "letra": "C",
        "texto": "passa a atuar como gene supressor tumoral, inibindo a proliferação celular.",
        "correta": false,
        "justificativa": "Incorreta. RAS é um proto-oncogene, não um gene supressor tumoral; sua mutação favorece, e não inibe, a proliferação celular."
      },
      {
        "letra": "D",
        "texto": "inibe permanentemente a via de MAP-quinases, bloqueando a transdução de sinal.",
        "correta": false,
        "justificativa": "Incorreta. RAS ativado estimula, e não inibe, a via de MAP-quinases, sendo esse justamente o mecanismo de propagação do sinal proliferativo."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q13"
  },
  {
    "enunciado": "Mulher de 38 anos, assintomática, é submetida à colposcopia após citologia mostrando HSIL. A biópsia dirigida confirma neoplasia intraepitelial cervical grau 3 (NIC III), com alterações comprometendo toda a espessura do epitélio, mas sem romper a membrana basal. A paciente questiona por que essa lesão, mesmo restrita ao epitélio, é tratada como condição de alto risco que exige intervenção. A explicação fisiopatológica mais adequada para essa conduta é que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a NIC III já rompeu a membrana basal, configurando, na realidade, carcinoma invasor microscópico.",
        "correta": false,
        "justificativa": "Incorreta. Por definição, a NIC III é uma lesão intraepitelial — a membrana basal permanece íntegra; caso houvesse ruptura, o diagnóstico já seria de carcinoma invasor, e não de NIC III."
      },
      {
        "letra": "B",
        "texto": "a NIC III representa acúmulo progressivo de alterações do ciclo celular por perda funcional de p53 e pRb (mediada por E6/E7), comprometendo toda a espessura do epitélio e precedendo diretamente a invasão estromal.",
        "correta": true,
        "justificativa": "A NIC III reflete o acúmulo progressivo de alterações do ciclo celular decorrentes da ação persistente de E6/E7 sobre p53 e pRb, comprometendo toda a espessura do epitélio (por definição, sem romper a membrana basal), mas representando lesão precursora de alto risco, com potencial significativo de progressão para carcinoma invasor se não tratada. Correta. Essa é a explicação fisiopatológica correta: o comprometimento progressivo do ciclo celular por E6/E7 leva a alterações que ocupam toda a espessura epitelial, configurando lesão de alto risco para invasão."
      },
      {
        "letra": "C",
        "texto": "a NIC III é sempre reversível espontaneamente em poucas semanas, sem necessidade real de seguimento ou tratamento.",
        "correta": false,
        "justificativa": "Incorreta. A NIC III tem taxa de regressão espontânea muito menor que lesões de baixo grau, sendo considerada lesão de alto risco que exige tratamento (excisional, geralmente), e não apenas observação."
      },
      {
        "letra": "D",
        "texto": "a NIC III ocorre exclusivamente em mulheres HPV-negativas, sendo o vírus irrelevante nesse estágio da doença.",
        "correta": false,
        "justificativa": "Incorreta. A NIC III está fortemente associada à infecção persistente por HPV oncogênico; afirmar que o vírus é irrelevante contraria a fisiopatologia estabelecida da doença."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q14"
  },
  {
    "enunciado": "Mulher de 45 anos, tabagista, com citologia mostrando lesão intraepitelial escamosa de alto grau (HSIL), é submetida à colposcopia, que evidencia epitélio acetobranco denso, mosaico grosseiro e pontilhado grosseiro na zona de transformação, totalmente visível, sem lesão aparente no canal endocervical. Diante desse quadro colposcópico, antes de qualquer decisão terapêutica definitiva, a conduta mais adequada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "realizar conização a frio imediatamente, sem biópsia prévia, por já haver citologia e colposcopia sugestivas.",
        "correta": false,
        "justificativa": "Incorreta. Ainda que citologia e colposcopia sejam sugestivas, a confirmação histopatológica por biópsia dirigida é etapa obrigatória antes de procedimento excisional como a conização."
      },
      {
        "letra": "B",
        "texto": "realizar biópsia dirigida das áreas de maior anormalidade colposcópica, para confirmação histopatológica antes de definir o tratamento excisional.",
        "correta": true,
        "justificativa": "Diante de achados colposcópicos anormais compatíveis com lesão de alto grau, a biópsia dirigida das áreas de maior anormalidade é etapa necessária antes de qualquer conduta excisional (como exérese da zona de transformação ou conização), confirmando o grau histológico da lesão e orientando o tratamento definitivo. Correta. A biópsia dirigida das áreas colposcopicamente mais alteradas confirma o diagnóstico histológico e orienta corretamente a conduta terapêutica subsequente."
      },
      {
        "letra": "C",
        "texto": "indicar histerectomia total imediata, independentemente de confirmação histológica prévia.",
        "correta": false,
        "justificativa": "Incorreta. Histerectomia é conduta desproporcional e não é indicada como primeira abordagem para NIC, mesmo de alto grau, sendo reservada a situações específicas após tratamento conservador adequado ou outras indicações ginecológicas."
      },
      {
        "letra": "D",
        "texto": "repetir apenas a citologia em 6 meses, postergando a colposcopia já realizada.",
        "correta": false,
        "justificativa": "Incorreta. Postergar a investigação diante de citologia e colposcopia já alteradas retarda desnecessariamente o diagnóstico definitivo e o tratamento oportuno."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q15"
  },
  {
    "enunciado": "Em discussão sobre novas terapias-alvo em oncologia, os estudantes analisam o mecanismo de ação dos inibidores de CDK4/6, utilizados em alguns tumores hormônio-sensíveis (como certos subtipos de câncer de mama), estabelecendo paralelo com os mecanismos de controle do ciclo celular estudados nesta situação-problema. Esses fármacos atuam, mecanisticamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "impedindo a fosforilação de pRb, mantendo-a ligada a E2F e bloqueando a transição de G1 para S.",
        "correta": true,
        "justificativa": "Os inibidores de CDK4/6 impedem a fosforilação de pRb pelos complexos ciclina D-CDK4/6; a pRb hipofosforilada permanece ligada ao fator de transcrição E2F, bloqueando a transcrição de genes necessários à transição G1/S e interrompendo a progressão do ciclo celular. Correta. Esse é exatamente o mecanismo de ação: bloqueio da fosforilação de pRb, mantendo-a ligada a E2F e impedindo a progressão do ciclo celular para a fase S."
      },
      {
        "letra": "B",
        "texto": "ativando diretamente formas mutadas de p53 para restaurar sua função supressora tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Não há restauração direta de p53 mutado por essa classe de fármacos; o alvo terapêutico é a via ciclina D-CDK4/6-pRb, não p53."
      },
      {
        "letra": "C",
        "texto": "inibindo a enzima topoisomerase II, impedindo o desenovelamento do DNA durante a replicação.",
        "correta": false,
        "justificativa": "Incorreta. A inibição da topoisomerase II é mecanismo de ação de outra classe de quimioterápicos (como antraciclinas e epipodofilotoxinas), não dos inibidores de CDK4/6."
      },
      {
        "letra": "D",
        "texto": "estabilizando os microtúbulos do fuso mitótico, impedindo a progressão da metáfase.",
        "correta": false,
        "justificativa": "Incorreta. A estabilização de microtúbulos é mecanismo de ação de taxanos, atuando na mitose propriamente dita, e não na transição G1/S regulada por pRb/CDK4-6."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q16"
  },
  {
    "enunciado": "Mulher de 41 anos recebe diagnóstico histopatológico confirmado de carcinoma epidermoide de colo uterino, estadiamento FIGO IIB (invasão parametrial sem atingir a parede pélvica). Durante consulta com a equipe de oncologia, questiona sobre as opções terapêuticas disponíveis para esse estágio da doença. A conduta terapêutica padrão, considerando as diretrizes atuais para esse estadiamento, é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "cirurgia radical (histerectomia radical com linfadenectomia) isolada, em todos os casos desse estágio.",
        "correta": false,
        "justificativa": "Incorreta. A partir do estágio IIB, a invasão parametrial geralmente contraindica a cirurgia radical isolada como tratamento primário, sendo preferida a quimiorradioterapia."
      },
      {
        "letra": "B",
        "texto": "quimiorradioterapia concomitante, com cisplatina semanal como radiossensibilizante, associada à braquiterapia complementar.",
        "correta": true,
        "justificativa": "A partir do estágio IIB (invasão parametrial), o tratamento padrão do carcinoma de colo uterino é a quimiorradioterapia concomitante — radioterapia externa associada à braquiterapia, com cisplatina semanal como radiossensibilizante — reservando-se a cirurgia radical isolada para estágios mais iniciais (geralmente até IB2/IIA, conforme protocolos institucionais). Correta. Esse é o tratamento padrão reconhecido para doença localmente avançada (a partir de IIB): quimiorradioterapia concomitante com cisplatina, associada à braquiterapia."
      },
      {
        "letra": "C",
        "texto": "apenas acompanhamento clínico expectante, sem intervenção ativa nesse estágio.",
        "correta": false,
        "justificativa": "Incorreta. O acompanhamento expectante sem tratamento ativo não é conduta aceitável diante de neoplasia maligna confirmada em estágio localmente avançado, com potencial curativo se tratada adequadamente."
      },
      {
        "letra": "D",
        "texto": "quimioterapia neoadjuvante isolada, sem qualquer associação com radioterapia.",
        "correta": false,
        "justificativa": "Incorreta. A quimioterapia isolada, sem radioterapia associada, não é o tratamento padrão para esse estágio; o racional terapêutico envolve o efeito radiossensibilizante da quimioterapia combinada à radioterapia."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q17"
  },
  {
    "enunciado": "Em relação aos mecanismos de escape da apoptose em células cronicamente infectadas por HPV oncogênico, contribuindo para o acúmulo progressivo de mutações e a evolução para neoplasia invasora, o principal mecanismo molecular envolvido é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aumento da expressão de caspases efetoras, acelerando a via apoptótica.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo de escape à apoptose envolve redução, e não aumento, da atividade pró-apoptótica mediada por p53; aumento de caspases favoreceria mais apoptose, não menos."
      },
      {
        "letra": "B",
        "texto": "degradação de p53 mediada por E6, reduzindo a transcrição de genes pró-apoptóticos como BAX.",
        "correta": true,
        "justificativa": "Ao degradar p53 via complexo com E6-AP, a proteína E6 reduz a transcrição de genes pró-apoptóticos (como BAX), permitindo que células com dano genômico acumulado escapem da apoptose e sobrevivam, favorecendo o acúmulo progressivo de mutações adicionais que impulsionam a carcinogênese. Correta. A degradação de p53 por E6 reduz a expressão de genes pró-apoptóticos como BAX, permitindo sobrevivência de células geneticamente instáveis."
      },
      {
        "letra": "C",
        "texto": "hiperexpressão de p21 funcional, bloqueando complexos ciclina-CDK de forma sustentada.",
        "correta": false,
        "justificativa": "Incorreta. p21 é efetor de p53 que inibe complexos ciclina-CDK; como E6 degrada p53, a expressão funcional de p21 tende a estar reduzida, e não hiperexpressa, nesse contexto."
      },
      {
        "letra": "D",
        "texto": "manutenção de pRb hipofosforilada e ativamente ligada a E2F, impedindo a progressão do ciclo celular.",
        "correta": false,
        "justificativa": "Incorreta. A ação de E7 sobre pRb é justamente inativá-la (hiperfosforilação funcional/degradação), liberando E2F e promovendo progressão do ciclo celular, e não mantendo pRb ativa ligada a E2F."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q18"
  },
  {
    "enunciado": "Mulher de 41 anos, recém-diagnosticada com carcinoma invasor de colo uterino, é acompanhada pela equipe de saúde da família enquanto aguarda encaminhamento à oncologia. Durante uma visita domiciliar, demonstra grande ansiedade, medo da morte e desinformação sobre a doença, tendo buscado informações contraditórias na internet. Considerando os princípios da comunicação de más notícias em saúde, a conduta mais adequada da equipe é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "evitar o assunto até que o oncologista assuma integralmente o caso, para não se comprometer com informações que não domina.",
        "correta": false,
        "justificativa": "Incorreta. Evitar o assunto deixa a paciente vulnerável à desinformação (como já demonstrado pela busca em fontes não confiáveis) e rompe o vínculo de cuidado que a equipe de saúde da família deve manter."
      },
      {
        "letra": "B",
        "texto": "fornecer informações claras e adequadas ao nível de compreensão da paciente, verificar seu entendimento, acolher suas dúvidas e emoções, e oferecer suporte contínuo, sem prometer resultados que não podem ser garantidos.",
        "correta": true,
        "justificativa": "A comunicação de más notícias deve seguir princípios como os do protocolo SPIKES: linguagem clara e acessível, verificação da compreensão da paciente, acolhimento ativo das emoções e dúvidas, e manutenção de vínculo de cuidado contínuo, sem prometer certezas sobre desfechos que a equipe não pode garantir. Correta. Esses são os princípios centrais da comunicação de más notícias: clareza, verificação de entendimento, acolhimento emocional e honestidade sem falsas garantias."
      },
      {
        "letra": "C",
        "texto": "informar apenas os familiares da paciente, evitando o contato direto sobre o diagnóstico e prognóstico com a própria paciente.",
        "correta": false,
        "justificativa": "Incorreta. Omitir informações da própria paciente fere sua autonomia e o direito à informação sobre sua própria condição de saúde, sendo eticamente inadequado, salvo situações excepcionais específicas."
      },
      {
        "letra": "D",
        "texto": "restringir-se a repassar o resultado do exame de forma objetiva, sem abrir espaço para perguntas ou expressão de sentimentos.",
        "correta": false,
        "justificativa": "Incorreta. Comunicação puramente objetiva, sem espaço para dúvidas e expressão emocional, não acolhe as necessidades psicossociais da paciente diante do impacto de um diagnóstico oncológico."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q19"
  },
  {
    "enunciado": "Gestores municipais de saúde avaliam estratégias para reduzir a incidência e a mortalidade por câncer do colo do útero em médio e longo prazo, considerando restrições orçamentárias e a necessidade de priorizar ações com melhor relação custo-efetividade. Entre as estratégias possíveis, qual é reconhecida como a mais custo-efetiva para essa finalidade, integrando prevenção primária e secundária?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Tratamento quimioterápico precoce e universal de todas as mulheres HPV-positivas, independentemente de achados citológicos.",
        "correta": false,
        "justificativa": "Incorreta. Não existe indicação de quimioterapia para mulheres apenas HPV-positivas sem lesão neoplásica estabelecida; essa conduta não tem respaldo científico nem é custo-efetiva."
      },
      {
        "letra": "B",
        "texto": "Combinação de vacinação contra HPV na pré-adolescência com rastreamento citológico organizado da população-alvo.",
        "correta": true,
        "justificativa": "A combinação de vacinação contra HPV (prevenção primária, reduzindo a incidência de infecção pelos tipos oncogênicos mais prevalentes) com rastreamento citológico organizado (prevenção secundária, detectando precocemente lesões precursoras) é reconhecida internacionalmente como a estratégia mais custo-efetiva para reduzir incidência e mortalidade por câncer de colo do útero. Correta. Essa é a estratégia com melhor relação custo-efetividade reconhecida, integrando prevenção primária (vacina) e secundária (rastreamento organizado)."
      },
      {
        "letra": "C",
        "texto": "Rastreamento por ressonância magnética pélvica anual em toda a população feminina adulta.",
        "correta": false,
        "justificativa": "Incorreta. Ressonância magnética pélvica anual universal tem custo elevadíssimo e não é o método de rastreamento populacional recomendado para câncer de colo do útero, que se baseia na citologia (e testes de HPV, quando disponíveis)."
      },
      {
        "letra": "D",
        "texto": "Uso rotineiro de antibioticoterapia profilática em mulheres sexualmente ativas.",
        "correta": false,
        "justificativa": "Incorreta. Antibioticoterapia não tem papel na prevenção do câncer do colo do útero, cuja etiologia central é viral (HPV), e não bacteriana."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP1_ENAMED — Q20"
  },
  {
    "enunciado": "Homem de 61 anos, porteiro noturno, procura a UBS por sintomas urinários. O médico da unidade explica que, além do toque retal, será solicitado um exame laboratorial amplamente utilizado no rastreamento e seguimento do câncer de próstata, cujo valor pode se elevar tanto em neoplasias quanto em condições benignas como hiperplasia prostática e prostatites. Esse marcador é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "CA 19-9, marcador tumoral utilizado principalmente em neoplasias pancreáticas.",
        "correta": false,
        "justificativa": "Incorreta. CA 19-9 é utilizado principalmente no acompanhamento de neoplasias pancreáticas e biliares, sem relação direta com a avaliação prostática."
      },
      {
        "letra": "B",
        "texto": "antígeno prostático específico (PSA).",
        "correta": true,
        "justificativa": "O PSA (antígeno prostático específico) é o marcador sérico utilizado, em conjunto com o toque retal, na investigação inicial e no seguimento de doenças prostáticas, incluindo o câncer de próstata, embora não seja exclusivo de neoplasia (pode se elevar também em HPB e prostatites). Correta. O PSA é o marcador utilizado especificamente na avaliação e seguimento da próstata, elevando-se tanto em processos benignos quanto malignos."
      },
      {
        "letra": "C",
        "texto": "alfa-fetoproteína, marcador utilizado em hepatocarcinoma e tumores germinativos.",
        "correta": false,
        "justificativa": "Incorreta. A alfa-fetoproteína é utilizada no rastreamento e seguimento de hepatocarcinoma e de tumores germinativos, sem relação com a próstata."
      },
      {
        "letra": "D",
        "texto": "antígeno carcinoembrionário (CEA), utilizado principalmente no seguimento de câncer colorretal.",
        "correta": false,
        "justificativa": "Incorreta. O CEA é utilizado principalmente no seguimento do câncer colorretal e de outros tumores gastrointestinais, não sendo o marcador de escolha para avaliação prostática."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q1"
  },
  {
    "enunciado": "Após biópsia prostática de paciente com suspeita de neoplasia, o laudo histopatológico descreve o grau de diferenciação tumoral por meio da soma dos dois padrões arquiteturais glandulares mais representativos da amostra (o predominante e o segundo mais frequente), fornecendo informação prognóstica relevante. Esse sistema de graduação histológica é conhecido como escala de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Bishop, utilizada para avaliação do colo uterino no trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O índice de Bishop avalia as condições cervicais para indução do trabalho de parto, sem qualquer relação com graduação tumoral prostática."
      },
      {
        "letra": "B",
        "texto": "Gleason.",
        "correta": true,
        "justificativa": "O escore de Gleason soma os dois padrões histológicos mais representativos do adenocarcinoma prostático (o predominante e o segundo mais comum na amostra), refletindo o grau de diferenciação tumoral e correlacionando-se diretamente com o prognóstico da doença. Correta. A escala de Gleason é especificamente utilizada para graduação histológica do adenocarcinoma de próstata, somando os dois padrões glandulares mais representativos."
      },
      {
        "letra": "C",
        "texto": "Child-Pugh, utilizada para avaliação de gravidade de hepatopatia crônica.",
        "correta": false,
        "justificativa": "Incorreta. Child-Pugh avalia a gravidade da disfunção hepática em cirrose, sem relação com neoplasia prostática."
      },
      {
        "letra": "D",
        "texto": "Glasgow, utilizada para avaliação do nível de consciência.",
        "correta": false,
        "justificativa": "Incorreta. A Escala de Coma de Glasgow avalia nível de consciência em pacientes neurológicos ou traumatizados, sem qualquer relação com graduação histológica de tumores."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q2"
  },
  {
    "enunciado": "Em aula sobre disseminação neoplásica, discute-se que o câncer de próstata avançado apresenta padrão característico de disseminação à distância, explicado, entre outros fatores, pela drenagem venosa pélvica através do plexo venoso vertebral. Os principais sítios de metástase à distância do câncer de próstata avançado são",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ossos e linfonodos.",
        "correta": true,
        "justificativa": "O câncer de próstata dissemina-se preferencialmente por via linfática para linfonodos pélvicos e por via hematogênica para ossos, especialmente do esqueleto axial (coluna, pelve), explicando o padrão clássico de metástases dessa neoplasia. Correta. Ossos (especialmente esqueleto axial) e linfonodos regionais são os sítios metastáticos mais característicos e clinicamente relevantes do câncer de próstata avançado."
      },
      {
        "letra": "B",
        "texto": "pele e músculo esquelético.",
        "correta": false,
        "justificativa": "Incorreta. Metástases cutâneas e musculares são raras no câncer de próstata, não representando os sítios característicos dessa neoplasia."
      },
      {
        "letra": "C",
        "texto": "tireoide e glândula suprarrenal.",
        "correta": false,
        "justificativa": "Incorreta. Tireoide e suprarrenal não são sítios metastáticos característicos do câncer de próstata, ainda que metástases atípicas possam ocorrer excepcionalmente."
      },
      {
        "letra": "D",
        "texto": "baço e pâncreas.",
        "correta": false,
        "justificativa": "Incorreta. Baço e pâncreas não são sítios preferenciais de disseminação do câncer de próstata."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q3"
  },
  {
    "enunciado": "Durante discussão sobre diagnóstico diferencial de doenças prostáticas, o professor destaca que a hiperplasia prostática benigna (HPB) e o adenocarcinoma de próstata, apesar de acometerem o mesmo órgão, originam-se preferencialmente em regiões anatômicas distintas da glândula. Essa diferença topográfica é descrita como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "HPB originando-se predominantemente na zona transicional, enquanto o câncer acomete mais a zona periférica.",
        "correta": true,
        "justificativa": "A HPB origina-se predominantemente na zona transicional da próstata (região periuretral), enquanto o adenocarcinoma prostático acomete mais frequentemente a zona periférica da glândula, achado relevante para o exame de toque retal (que avalia principalmente a zona periférica) e para a interpretação de biópsias dirigidas. Correta. Essa é a distribuição topográfica clássica: HPB na zona transicional e adenocarcinoma predominantemente na zona periférica."
      },
      {
        "letra": "B",
        "texto": "HPB originando-se predominantemente na zona periférica, enquanto o câncer acomete a zona transicional.",
        "correta": false,
        "justificativa": "Incorreta. A distribuição está invertida em relação ao que classicamente se descreve na literatura urológica."
      },
      {
        "letra": "C",
        "texto": "ambas as condições acometendo exclusivamente a zona central da próstata, sem diferença topográfica.",
        "correta": false,
        "justificativa": "Incorreta. Embora a zona central também possa ser acometida ocasionalmente, não é o padrão predominante nem para HPB nem para o câncer de próstata."
      },
      {
        "letra": "D",
        "texto": "ambas as condições acometendo exclusivamente a zona transicional, de forma indistinguível.",
        "correta": false,
        "justificativa": "Incorreta. HPB e câncer de próstata têm, de fato, distribuição topográfica preferencial distinta, o que é clinicamente relevante e não indistinguível."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q4"
  },
  {
    "enunciado": "Em revisão de conceitos fundamentais de oncologia, os estudantes discutem o processo pelo qual células neoplásicas se disseminam de seu sítio de origem, implantam-se e proliferam em um órgão distante, formando um novo foco tumoral. Esse processo é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "invasão local, processo restrito ao tecido de origem do tumor.",
        "correta": false,
        "justificativa": "Incorreta. Invasão local descreve a infiltração de tecidos adjacentes ao tumor primário, processo distinto (embora relacionado) da disseminação a distância que caracteriza a metástase."
      },
      {
        "letra": "B",
        "texto": "metástase.",
        "correta": true,
        "justificativa": "Metástase é o processo de disseminação de células tumorais a partir do sítio primário, com implantação e crescimento de um novo foco neoplásico em órgão ou tecido distante, sendo característica definidora de malignidade. Correta. Metástase é exatamente o processo de disseminação, implantação e crescimento de células tumorais em sítio distante do tumor primário."
      },
      {
        "letra": "C",
        "texto": "displasia, alteração da maturação celular sem formação de novo foco tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Displasia refere-se a alterações da maturação e organização celular, frequentemente pré-neoplásicas, sem implicar formação de novo foco tumoral a distância."
      },
      {
        "letra": "D",
        "texto": "metaplasia, substituição de um tipo celular diferenciado por outro, sem implantação à distância.",
        "correta": false,
        "justificativa": "Incorreta. Metaplasia é a substituição reversível de um tipo celular diferenciado por outro, em resposta a estímulo, sem qualquer relação com implantação tumoral a distância."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q5"
  },
  {
    "enunciado": "Homem de 61 anos procura a UBS pela primeira vez em anos, relatando aumento da frequência urinária noturna, jato urinário enfraquecido e sensação de esvaziamento incompleto da bexiga, sintomas que ele atribuía ao envelhecimento. Nunca realizou exames preventivos e desconhece o significado do PSA, demonstrando resistência ao toque retal. Diante desse quadro, qual é a conduta inicial mais adequada na Atenção Primária?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Solicitar apenas ultrassonografia abdominal total, sem exame físico direcionado.",
        "correta": false,
        "justificativa": "Incorreta. A ultrassonografia abdominal isolada não substitui a avaliação clínica direcionada (toque retal) nem a dosagem de PSA na investigação inicial de sintomas prostáticos."
      },
      {
        "letra": "B",
        "texto": "Realizar toque retal e solicitar PSA sérico, além de acolher as preocupações do paciente sobre o exame físico.",
        "correta": true,
        "justificativa": "A avaliação inicial de paciente com sintomas urinários sugestivos de doença prostática deve incluir toque retal e dosagem de PSA na atenção primária, etapas que orientam a necessidade de investigação complementar e o encaminhamento especializado, sendo importante também o acolhimento das preocupações do paciente para viabilizar o exame físico. Correta. Toque retal e PSA são exames de primeira linha na investigação de sintomas urinários sugestivos de doença prostática, devendo ser acompanhados de acolhimento das preocupações do paciente."
      },
      {
        "letra": "C",
        "texto": "Encaminhar diretamente para biópsia prostática, sem qualquer avaliação clínica ou laboratorial prévia.",
        "correta": false,
        "justificativa": "Incorreta. Biópsia prostática não é conduta de primeira linha sem avaliação clínica e laboratorial prévia que justifique essa investigação invasiva."
      },
      {
        "letra": "D",
        "texto": "Iniciar antibioticoterapia empírica antes de qualquer investigação diagnóstica.",
        "correta": false,
        "justificativa": "Incorreta. Não há indicação de antibioticoterapia empírica sem quadro clínico sugestivo de infecção e sem qualquer investigação diagnóstica prévia."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q6"
  },
  {
    "enunciado": "Durante anamnese detalhada, um paciente com suspeita de câncer de próstata relata que seu pai foi tratado da mesma doença ainda jovem. O médico explica que esse dado é clinicamente relevante para a estratificação de risco do paciente. Em relação ao componente hereditário do câncer de próstata, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não há nenhuma associação genética ou familiar conhecida para essa neoplasia.",
        "correta": false,
        "justificativa": "Incorreta. Há associação genética e familiar bem estabelecida para o câncer de próstata, sendo a história familiar um dos principais fatores de risco não modificáveis reconhecidos."
      },
      {
        "letra": "B",
        "texto": "história familiar em parentes de primeiro grau (como pai ou irmão) aumenta o risco relativo de desenvolvimento da doença, havendo inclusive associação com mutações em genes como BRCA2.",
        "correta": true,
        "justificativa": "Homens com parentes de primeiro grau (pai, irmão) com câncer de próstata apresentam risco relativo aumentado da doença, refletindo componente hereditário reconhecido, com associação inclusive a mutações germinativas em genes como BRCA2, relevantes tanto para câncer de próstata quanto de mama/ovário na família. Correta. A história familiar em parentes de primeiro grau aumenta o risco, com associação documentada a mutações em genes como BRCA2, relevante para estratificação de risco e decisões sobre rastreamento."
      },
      {
        "letra": "C",
        "texto": "apenas mutações em BRCA2 protegem contra o desenvolvimento de câncer de próstata.",
        "correta": false,
        "justificativa": "Incorreta. Mutações em BRCA2 aumentam, e não protegem, o risco de câncer de próstata (além do risco de câncer de mama e ovário em familiares)."
      },
      {
        "letra": "D",
        "texto": "a herança genética relacionada ao câncer de próstata só é clinicamente relevante em mulheres da família.",
        "correta": false,
        "justificativa": "Incorreta. A herança genética relacionada ao câncer de próstata é relevante para os homens da família (parentes de primeiro grau), sendo esse justamente o dado utilizado na estratificação de risco."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q7"
  },
  {
    "enunciado": "O laudo de biópsia prostática de um paciente descreve escore de Gleason 8 (5+3). Ao explicar o resultado à família, o urologista destaca que a notação entre parênteses (5+3) tem significado prognóstico específico, distinto de uma soma equivalente obtida de outra forma (como 3+5). Sobre esse laudo, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o resultado indica tumor bem diferenciado, de baixo risco, sem necessidade de tratamento imediato.",
        "correta": false,
        "justificativa": "Incorreta. Um escore de Gleason 8 indica tumor pouco diferenciado e de alto risco, e não tumor bem diferenciado de baixo risco."
      },
      {
        "letra": "B",
        "texto": "o resultado indica tumor pouco diferenciado, de alto risco, sendo o padrão mais indiferenciado (5) o predominante na amostra, o que confere pior prognóstico do que se o padrão predominante fosse o 3.",
        "correta": true,
        "justificativa": "No escore de Gleason, o primeiro número indica o padrão histológico predominante e o segundo o segundo mais frequente; Gleason 8 (5+3) indica tumor pouco diferenciado e de alto risco, com o padrão mais indiferenciado (grau 5) sendo o predominante, conferindo pior prognóstico do que a mesma soma obtida como 3+5 (padrão predominante menos agressivo). Correta. A notação (5+3) indica que o padrão predominante é o mais indiferenciado (grau 5), conferindo prognóstico pior do que se a soma fosse obtida com o padrão 3 como predominante (3+5), mesmo com soma total idêntica."
      },
      {
        "letra": "C",
        "texto": "o resultado indica ausência de neoplasia, compatível apenas com hiperplasia benigna.",
        "correta": false,
        "justificativa": "Incorreta. Um escore de Gleason é atribuído a tecido neoplásico (adenocarcinoma), não sendo compatível com ausência de neoplasia."
      },
      {
        "letra": "D",
        "texto": "a ordem dos números na notação (5+3) não tem qualquer significado prognóstico adicional além da soma total.",
        "correta": false,
        "justificativa": "Incorreta. A ordem dos números tem significado prognóstico relevante: o primeiro número (padrão predominante) influencia o prognóstico mais do que a soma isolada sugere."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q8"
  },
  {
    "enunciado": "Em uma reunião de equipe sobre políticas de rastreamento oncológico, discute-se que a dosagem populacional rotineira do PSA em homens assintomáticos é tema controverso na literatura médica, apesar de sua ampla utilização clínica. Um dos principais dilemas éticos e de saúde pública relacionados a essa prática é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a ausência total de qualquer benefício comprovado do exame em qualquer contexto clínico.",
        "correta": false,
        "justificativa": "Incorreta. O PSA tem benefício documentado em determinados contextos (detecção precoce em grupos de risco), não sendo correto afirmar ausência total de benefício; o dilema é sobre o balanço risco-benefício populacional, e não sobre ausência completa de utilidade."
      },
      {
        "letra": "B",
        "texto": "o risco de sobrediagnóstico e sobretratamento de tumores indolentes, que poderiam não impactar a sobrevida do paciente, gerando efeitos adversos desnecessários do tratamento.",
        "correta": true,
        "justificativa": "O rastreamento por PSA pode identificar tumores de crescimento lento (indolentes) que não trariam impacto clínico relevante ao longo da vida do paciente, gerando sobrediagnóstico e submetendo pacientes a tratamentos (cirurgia, radioterapia) com efeitos adversos significativos (incontinência, disfunção erétil) sem benefício proporcional — por isso a decisão de rastrear deve ser compartilhada entre médico e paciente. Correta. Esse é o principal dilema ético/epidemiológico: sobrediagnóstico e sobretratamento de tumores que não ameaçariam a vida do paciente, com exposição desnecessária a efeitos adversos do tratamento."
      },
      {
        "letra": "C",
        "texto": "o fato de o exame ser extremamente caro e inacessível para a rede pública de saúde.",
        "correta": false,
        "justificativa": "Incorreta. O PSA é exame relativamente barato e amplamente disponível na rede pública; o dilema não está centrado em custo ou acesso, mas no balanço risco-benefício do rastreamento."
      },
      {
        "letra": "D",
        "texto": "a impossibilidade técnica de realizar o exame em qualquer faixa etária da população masculina.",
        "correta": false,
        "justificativa": "Incorreta. O exame pode ser realizado em qualquer faixa etária adulta; a controvérsia está relacionada à indicação populacional em massa, e não à viabilidade técnica do exame."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q9"
  },
  {
    "enunciado": "Em aula de patologia sobre invasão tumoral, discute-se o processo pelo qual células neoplásicas degradam a membrana basal e componentes da matriz extracelular, etapa fundamental para invasão de tecidos vizinhos e posterior disseminação metastática. Esse processo depende, entre outros fatores, da ação de enzimas denominadas",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "metaloproteinases de matriz.",
        "correta": true,
        "justificativa": "As metaloproteinases de matriz (MMPs) são enzimas proteolíticas que degradam componentes da matriz extracelular e da membrana basal, facilitando a invasão local das células tumorais e etapas subsequentes da cascata metastática, como a intravasão vascular. Correta. As metaloproteinases de matriz são as enzimas classicamente associadas à degradação da matriz extracelular e membrana basal no processo de invasão tumoral."
      },
      {
        "letra": "B",
        "texto": "hemoglobina glicada, marcador de controle glicêmico.",
        "correta": false,
        "justificativa": "Incorreta. Hemoglobina glicada é marcador de controle glicêmico em diabetes, sem qualquer relação com degradação de matriz extracelular."
      },
      {
        "letra": "C",
        "texto": "fator intrínseco gástrico, envolvido na absorção de vitamina B12.",
        "correta": false,
        "justificativa": "Incorreta. O fator intrínseco gástrico participa da absorção intestinal de vitamina B12, sem relação com invasão tumoral."
      },
      {
        "letra": "D",
        "texto": "lipase pancreática, envolvida na digestão de lipídeos.",
        "correta": false,
        "justificativa": "Incorreta. A lipase pancreática participa da digestão de lipídeos no trato gastrointestinal, sem qualquer papel na degradação da matriz extracelular tumoral."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q10"
  },
  {
    "enunciado": "Paciente de 78 anos, com diagnóstico de câncer de próstata localizado de baixo risco (Gleason 6, PSA baixo, estágio clínico inicial), apresenta múltiplas comorbidades e expectativa de vida limitada, estimada em poucos anos. Considerando as possibilidades terapêuticas disponíveis para esse cenário clínico específico, uma conduta aceita e frequentemente recomendada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "vigilância ativa, com monitorização periódica de PSA, toque retal e reavaliação clínica, evitando tratamento definitivo imediato.",
        "correta": true,
        "justificativa": "Em tumores de próstata de baixo risco e pacientes com expectativa de vida limitada por idade avançada e comorbidades, a vigilância ativa é conduta aceita e frequentemente preferida, evitando os efeitos adversos de tratamentos definitivos (cirurgia, radioterapia) sem benefício proporcional de sobrevida nesse contexto específico. Correta. A vigilância ativa é abordagem reconhecida para tumores de baixo risco em pacientes com expectativa de vida limitada, equilibrando segurança oncológica com qualidade de vida."
      },
      {
        "letra": "B",
        "texto": "quimioterapia sistêmica citotóxica imediata, independentemente do baixo risco tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Quimioterapia citotóxica não é indicada para doença localizada de baixo risco; é reservada a estágios avançados/metastáticos, geralmente após falha de outras terapias."
      },
      {
        "letra": "C",
        "texto": "orquiectomia bilateral em todos os casos, independentemente do risco tumoral ou da expectativa de vida.",
        "correta": false,
        "justificativa": "Incorreta. Orquiectomia bilateral (castração cirúrgica) é reservada a contextos de doença avançada hormônio-sensível, não sendo indicada rotineiramente em tumores localizados de baixo risco."
      },
      {
        "letra": "D",
        "texto": "radioterapia de corpo inteiro, técnica não indicada para tratamento localizado de próstata.",
        "correta": false,
        "justificativa": "Incorreta. Radioterapia de corpo inteiro não é técnica utilizada no tratamento do câncer de próstata localizado; a radioterapia empregada é dirigida à próstata (radioterapia externa conformacional ou braquiterapia)."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q11"
  },
  {
    "enunciado": "Homem de 61 anos, biópsia prostática com Gleason 8 (5+3), PSA de 42 ng/mL. A cintilografia óssea de corpo inteiro evidencia múltiplas lesões hipercaptantes em corpos vertebrais e ossos da bacia, compatíveis com metástases ósseas. Considerando a fisiopatologia da disseminação do câncer de próstata, a explicação mais adequada para esse padrão específico de acometimento ósseo (predomínio no esqueleto axial) é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "disseminação exclusivamente por contiguidade direta da próstata para os ossos pélvicos adjacentes, sem qualquer componente vascular.",
        "correta": false,
        "justificativa": "Incorreta. Embora a contiguidade possa ocorrer localmente em estágios avançados, o padrão de metástases ósseas a distância (coluna, bacia) descrito no caso é explicado pela disseminação vascular, e não apenas por contiguidade direta."
      },
      {
        "letra": "B",
        "texto": "disseminação hematogênica preferencial para o esqueleto axial, favorecida pela drenagem venosa prostática através do plexo venoso vertebral (plexo de Batson), que se comunica com a circulação vertebral sem passar obrigatoriamente pela circulação pulmonar.",
        "correta": true,
        "justificativa": "O câncer de próstata dissemina-se preferencialmente para o esqueleto axial (coluna, pelve) por via hematogênica através do plexo venoso vertebral (Batson), uma rede venosa avalvular que permite que células tumorais alcancem diretamente os corpos vertebrais e a pelve óssea, sem necessariamente passar pela circulação pulmonar primeiro, explicando o padrão de metástases ósseas observado. Correta. O plexo venoso de Batson é o mecanismo fisiopatológico clássico que explica a disseminação hematogênica preferencial do câncer de próstata para o esqueleto axial."
      },
      {
        "letra": "C",
        "texto": "disseminação linfática exclusiva para linfonodos cervicais, sem qualquer envolvimento ósseo direto.",
        "correta": false,
        "justificativa": "Incorreta. O padrão de disseminação descrito no caso é ósseo (coluna e bacia), não correspondendo a disseminação linfática cervical isolada."
      },
      {
        "letra": "D",
        "texto": "disseminação por via aérea, através de aspiração de células tumorais circulantes.",
        "correta": false,
        "justificativa": "Incorreta. Não existe mecanismo de disseminação metastática por via aérea/aspiração de células tumorais; essa opção não corresponde a nenhum mecanismo fisiopatológico reconhecido de metástase."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q12"
  },
  {
    "enunciado": "Paciente com câncer de próstata metastático, ainda sem tratamento hormonal prévio (hormônio-sensível), é encaminhado para terapia de privação androgênica como parte do tratamento sistêmico. Ao explicar o racional terapêutico dessa conduta, o oncologista destaca que a maioria dos adenocarcinomas prostáticos depende da sinalização androgênica para proliferação e sobrevivência celular. Com base nesse racional fisiopatológico, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "as células tumorais prostáticas dependem, em grande parte, da sinalização pela via do receptor androgênico para proliferação e sobrevivência, justificando o benefício da privação androgênica em reduzir a atividade tumoral.",
        "correta": true,
        "justificativa": "A maioria dos adenocarcinomas de próstata é hormônio-sensível, dependendo da sinalização pelo receptor androgênico para crescimento e sobrevivência celular; por isso, a privação androgênica (cirúrgica ou farmacológica) reduz a proliferação tumoral e controla temporariamente a doença metastática, embora não seja curativa a longo prazo, já que a maioria dos tumores eventualmente desenvolve resistência (progressão para doença resistente à castração). Correta. Esse é o racional fisiopatológico correto: a dependência androgênica da maioria dos tumores prostáticos justifica o benefício terapêutico da privação hormonal."
      },
      {
        "letra": "B",
        "texto": "os androgênios inibem diretamente a proliferação das células tumorais prostáticas, o que tornaria contraditória a privação androgênica.",
        "correta": false,
        "justificativa": "Incorreta. Os androgênios estimulam, e não inibem, a proliferação da maioria das células do adenocarcinoma prostático — por isso a privação androgênica reduz, e não aumenta, a atividade tumoral."
      },
      {
        "letra": "C",
        "texto": "a testosterona não tem qualquer papel relevante na biologia do adenocarcinoma de próstata.",
        "correta": false,
        "justificativa": "Incorreta. A testosterona tem papel central na biologia da maioria dos adenocarcinomas prostáticos, sendo o principal alvo terapêutico da privação androgênica."
      },
      {
        "letra": "D",
        "texto": "o bloqueio androgênico cura definitivamente a doença metastática em praticamente todos os casos, eliminando a necessidade de qualquer seguimento posterior.",
        "correta": false,
        "justificativa": "Incorreta. A privação androgênica controla a doença por período variável, mas a maioria dos tumores eventualmente progride para a forma resistente à castração, não sendo, portanto, tratamento curativo definitivo na doença metastática."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q13"
  },
  {
    "enunciado": "Em discussão sobre biologia tumoral, o professor apresenta o conceito de expansão clonal, explicando que um tumor não é uma população celular homogênea, mas sim um conjunto dinâmico de subpopulações que evoluem ao longo do tempo, inclusive sob pressão seletiva do tratamento. Em relação a esse conceito, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "todas as células de um tumor mantêm exatamente o mesmo genótipo da célula de origem, sem qualquer variação ao longo da progressão tumoral.",
        "correta": false,
        "justificativa": "Incorreta. Tumores são geneticamente heterogêneos e evoluem clonalmente ao longo do tempo, acumulando novas mutações; não mantêm genótipo idêntico ao longo de toda a progressão."
      },
      {
        "letra": "B",
        "texto": "subpopulações celulares acumulam mutações adicionais ao longo do tempo, originando subclones com maior capacidade proliferativa, invasiva ou de resistência a tratamentos, processo relevante inclusive para explicar recidivas após terapia inicialmente eficaz.",
        "correta": true,
        "justificativa": "A expansão clonal descreve a seleção progressiva de subclones tumorais com vantagens proliferativas, invasivas ou de resistência terapêutica, decorrentes do acúmulo de mutações adicionais ao longo da evolução do tumor — processo central para explicar tanto a progressão da doença quanto o desenvolvimento de resistência a tratamentos inicialmente eficazes, como na progressão do câncer de próstata para a forma resistente à castração. Correta. A expansão clonal explica exatamente esse fenômeno de seleção de subclones com vantagens adaptativas, incluindo resistência a tratamentos."
      },
      {
        "letra": "C",
        "texto": "a expansão clonal ocorre exclusivamente em tumores benignos, sem qualquer relevância para neoplasias malignas.",
        "correta": false,
        "justificativa": "Incorreta. A expansão clonal é conceito central na biologia de neoplasias malignas, sendo, inclusive, um dos principais mecanismos de progressão e resistência terapêutica nesse contexto."
      },
      {
        "letra": "D",
        "texto": "não há qualquer relação entre expansão clonal e o desenvolvimento de resistência a terapias hormonais ou quimioterápicas.",
        "correta": false,
        "justificativa": "Incorreta. A expansão clonal está diretamente relacionada ao desenvolvimento de resistência terapêutica, como na seleção de subclones resistentes à privação androgênica no câncer de próstata avançado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q14"
  },
  {
    "enunciado": "Em revisão sobre a cascata metastática, os estudantes descrevem as etapas necessárias para que uma célula tumoral circulante origine um novo foco de crescimento em órgão distante, após ter alcançado a corrente sanguínea (intravasão). A sequência correta dos eventos subsequentes até a colonização do novo tecido é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "adesão da célula tumoral circulante ao endotélio do órgão-alvo, seguida de diapedese através da parede vascular (extravasamento) e, por fim, colonização e crescimento no novo microambiente tecidual.",
        "correta": true,
        "justificativa": "Após a intravasão, as células tumorais circulantes que sobrevivem ao estresse hemodinâmico e imunológico da corrente sanguínea aderem ao endotélio do órgão-alvo, atravessam a parede vascular por diapedese (extravasamento) e colonizam o novo microambiente tecidual, onde podem proliferar e formar um foco metastático estabelecido. Correta. Essa é a sequência correta da cascata metastática após a intravasão: adesão endotelial, extravasamento por diapedese e colonização tecidual."
      },
      {
        "letra": "B",
        "texto": "apoptose imediata e obrigatória de toda célula tumoral ao entrar na corrente sanguínea, impedindo qualquer possibilidade de metástase.",
        "correta": false,
        "justificativa": "Incorreta. Embora a maioria das células tumorais circulantes efetivamente sofra apoptose (anoikis) ou seja eliminada pelo sistema imune, isso não é obrigatório para todas elas — algumas sobrevivem e originam metástases, o que contraria a afirmação de eliminação total e obrigatória."
      },
      {
        "letra": "C",
        "texto": "fusão espontânea da célula tumoral com hemácias circulantes, mecanismo necessário para sua sobrevivência vascular.",
        "correta": false,
        "justificativa": "Incorreta. Não há mecanismo fisiológico reconhecido de fusão entre células tumorais e hemácias como etapa necessária da cascata metastática."
      },
      {
        "letra": "D",
        "texto": "eliminação renal direta da célula tumoral circulante, sem qualquer interação com o endotélio vascular.",
        "correta": false,
        "justificativa": "Incorreta. Não existe mecanismo de eliminação renal direta de células tumorais circulantes como via de \"depuração\" fisiológica relevante nesse processo."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q15"
  },
  {
    "enunciado": "Comparando diretrizes de diferentes entidades sobre o rastreamento populacional do câncer de próstata por PSA em homens assintomáticos de risco médio, discute-se que há certa divergência de ênfase entre órgãos governamentais de saúde pública e sociedades de especialidade médica. Considerando as evidências atuais, a recomendação mais adequada para essa população é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "rastreamento obrigatório em massa a partir dos 40 anos, sem qualquer discussão individualizada sobre riscos e benefícios.",
        "correta": false,
        "justificativa": "Incorreta. Rastreamento obrigatório em massa, sem discussão individualizada, não é a recomendação atual baseada em evidências, dado o risco de sobrediagnóstico já discutido."
      },
      {
        "letra": "B",
        "texto": "tomada de decisão compartilhada entre médico e paciente, geralmente a partir dos 50 anos (ou mais precocemente em grupos de maior risco), ponderando riscos (sobrediagnóstico, biópsias desnecessárias) e benefícios (detecção precoce) do PSA.",
        "correta": true,
        "justificativa": "As diretrizes atuais recomendam decisão compartilhada entre médico e paciente, informando riscos (sobrediagnóstico, biópsias desnecessárias, efeitos adversos do tratamento) e benefícios (detecção precoce de tumores clinicamente relevantes) do rastreamento por PSA, geralmente a partir dos 50 anos em homens de risco médio, ou mais cedo (45 anos) em grupos de maior risco (história familiar, ascendência afrodescendente). Correta. A decisão compartilhada, com discussão individualizada de riscos e benefícios a partir dos 50 anos (ou antes, em grupos de risco), é a recomendação atual baseada em evidências."
      },
      {
        "letra": "C",
        "texto": "proibição total da realização do exame de PSA em qualquer idade ou contexto clínico.",
        "correta": false,
        "justificativa": "Incorreta. Não há recomendação de proibição total do exame; a controvérsia está relacionada à indicação populacional em massa, não à disponibilidade do exame para decisão individualizada."
      },
      {
        "letra": "D",
        "texto": "rastreamento indicado apenas em mulheres com história familiar de câncer de próstata, sem qualquer recomendação para homens.",
        "correta": false,
        "justificativa": "Incorreta. A frase contém erro conceitual grave: câncer de próstata acomete homens (a próstata é órgão exclusivamente masculino), não sendo aplicável a mulheres."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q16"
  },
  {
    "enunciado": "Durante consulta, um paciente demonstra forte resistência ao exame de toque retal, relatando vergonha e comentários jocosos de colegas de trabalho sobre o procedimento, o que o levou a adiar a investigação diagnóstica por meses. Do ponto de vista da atuação médica centrada na pessoa, a conduta mais adequada da equipe de saúde diante dessa resistência é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ignorar a resistência do paciente e proceder ao exame sem qualquer esclarecimento adicional ou construção de vínculo.",
        "correta": false,
        "justificativa": "Incorreta. Ignorar a resistência do paciente e proceder sem qualquer diálogo pode comprometer a confiança na relação médico-paciente e gerar trauma ou nova recusa a exames futuros."
      },
      {
        "letra": "B",
        "texto": "acolher a preocupação do paciente, explicar tecnicamente a importância e a técnica do exame de forma clara e respeitosa, e construir vínculo de confiança antes de proceder, sem julgamento moral sobre seus receios.",
        "correta": true,
        "justificativa": "O cuidado centrado na pessoa exige acolhimento das preocupações do paciente, esclarecimento técnico claro e respeitoso sobre a importância e a técnica do exame, e construção de vínculo de confiança antes de proceder, reduzindo barreiras culturais e emocionais que podem atrasar o diagnóstico precoce de doenças graves. Correta. O acolhimento respeitoso, associado a esclarecimento técnico adequado, é a conduta que melhor concilia a necessidade clínica do exame com o cuidado centrado na pessoa."
      },
      {
        "letra": "C",
        "texto": "substituir definitivamente o exame físico por exames de imagem, sem qualquer justificativa técnica para essa substituição.",
        "correta": false,
        "justificativa": "Incorreta. Substituir o exame físico por exames de imagem sem justificativa técnica clara não é conduta baseada em evidências e pode gerar custos e atrasos desnecessários."
      },
      {
        "letra": "D",
        "texto": "encaminhar o paciente para outro serviço de saúde, sem qualquer orientação ou tentativa de acolhimento na própria consulta.",
        "correta": false,
        "justificativa": "Incorreta. Encaminhar sem qualquer tentativa de acolhimento transfere o problema sem resolver a barreira de comunicação, além de poder gerar sensação de abandono no paciente."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q17"
  },
  {
    "enunciado": "Em um município de médio porte, o fluxo de regulação do SUS para investigação de suspeita de câncer de próstata na atenção primária é discutido em uma reunião de gestão. O objetivo é conciliar diagnóstico precoce e uso racional dos recursos especializados disponíveis, evitando tanto encaminhamentos desnecessários quanto atrasos graves no diagnóstico. A conduta que melhor atende a esse objetivo é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "encaminhar todo paciente com qualquer valor de PSA, mesmo discretamente alterado, diretamente para cirurgia oncológica, sem avaliação urológica prévia.",
        "correta": false,
        "justificativa": "Incorreta. Encaminhar diretamente para cirurgia oncológica sem avaliação urológica e confirmação diagnóstica prévia (biópsia) é conduta inadequada e não segue o fluxo racional de investigação."
      },
      {
        "letra": "B",
        "texto": "realizar avaliação clínica inicial completa (toque retal, PSA, sintomas urinários) na UBS, encaminhando ao urologista os casos com critérios de suspeita definidos em protocolo de regulação, conforme fluxo pactuado na rede.",
        "correta": true,
        "justificativa": "O fluxo adequado de regulação do SUS prevê avaliação clínica inicial completa na atenção primária (toque retal, PSA, avaliação de sintomas), com encaminhamento regulado ao urologista dos casos que atendem a critérios de suspeita definidos em protocolo, otimizando o uso dos recursos especializados e reduzindo tanto encaminhamentos desnecessários quanto demora indevida nos casos que realmente necessitam de avaliação especializada. Correta. Essa é a conduta que concilia diagnóstico precoce e uso racional de recursos, seguindo fluxo de regulação com critérios definidos de encaminhamento."
      },
      {
        "letra": "C",
        "texto": "não encaminhar nenhum paciente à atenção especializada, mantendo toda a investigação exclusivamente na atenção primária, independentemente dos achados.",
        "correta": false,
        "justificativa": "Incorreta. Não encaminhar nenhum paciente à atenção especializada, independentemente dos achados, pode atrasar o diagnóstico de casos que realmente necessitam de avaliação urológica e biópsia."
      },
      {
        "letra": "D",
        "texto": "solicitar diretamente biópsia prostática na própria UBS, sem qualquer avaliação especializada prévia.",
        "correta": false,
        "justificativa": "Incorreta. Biópsia prostática é procedimento especializado que exige avaliação urológica prévia, não sendo indicado solicitá-la diretamente na atenção primária sem critérios clínicos e laboratoriais que a justifiquem."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q18"
  },
  {
    "enunciado": "Paciente com câncer de próstata localmente avançado (sem metástases à distância confirmadas, mas com invasão local significativa) é discutido em reunião multidisciplinar de oncologia para definição do plano terapêutico. Considerando as possibilidades terapêuticas atuais reconhecidas para esse estágio da doença, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a radioterapia associada à terapia de privação androgênica é uma opção terapêutica reconhecida e com benefício de sobrevida demonstrado nesse cenário.",
        "correta": true,
        "justificativa": "No câncer de próstata localmente avançado, a radioterapia combinada à terapia de privação androgênica é estratégia terapêutica reconhecida, com benefício de sobrevida demonstrado em ensaios clínicos, sendo uma das principais opções de tratamento com intenção curativa nesse cenário, ao lado da cirurgia radical em casos selecionados. Correta. A combinação de radioterapia com privação androgênica é opção terapêutica reconhecida e validada por evidência científica para esse estágio da doença."
      },
      {
        "letra": "B",
        "texto": "a única opção terapêutica válida para doença localmente avançada é a prostatectomia radical isolada, sem qualquer terapia associada.",
        "correta": false,
        "justificativa": "Incorreta. A prostatectomia radical isolada nem sempre é suficiente ou indicada em doença localmente avançada; frequentemente há necessidade de terapia adjuvante/combinada, e a radioterapia associada à hormonioterapia é alternativa validada."
      },
      {
        "letra": "C",
        "texto": "a quimioterapia citotóxica sistêmica é sempre a primeira linha de tratamento para doença localmente avançada, independentemente do estágio.",
        "correta": false,
        "justificativa": "Incorreta. A quimioterapia citotóxica sistêmica não é a primeira linha para doença localmente avançada (não metastática); é reservada principalmente para estágios metastáticos, especialmente resistentes à castração."
      },
      {
        "letra": "D",
        "texto": "não existe qualquer tratamento eficaz disponível para câncer de próstata localmente avançado, sendo indicados apenas cuidados paliativos exclusivos.",
        "correta": false,
        "justificativa": "Incorreta. Existem tratamentos com intenção curativa reconhecidos para doença localmente avançada (radioterapia + hormonioterapia, cirurgia em casos selecionados), não sendo correto afirmar ausência de tratamento eficaz."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q19"
  },
  {
    "enunciado": "Comparando as políticas de rastreamento do câncer de próstata preconizadas pelo Ministério da Saúde brasileiro e por sociedades de especialidade, como a Sociedade Brasileira de Urologia, discute-se em uma aula de saúde coletiva as diferenças de ênfase entre essas recomendações. É correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "as duas entidades têm posicionamento idêntico e não há qualquer controvérsia sobre o tema no cenário brasileiro.",
        "correta": false,
        "justificativa": "Incorreta. Há divergência de ênfase real e documentada entre essas entidades quanto à recomendação de rastreamento populacional por PSA."
      },
      {
        "letra": "B",
        "texto": "o Ministério da Saúde não recomenda rastreamento populacional rotineiro por PSA, priorizando decisão individualizada frente às incertezas de benefício líquido, enquanto sociedades de especialidade tendem a valorizar mais ativamente a discussão do rastreamento a partir dos 50 anos (ou antes, em grupos de risco).",
        "correta": true,
        "justificativa": "Há divergência de ênfase entre o Ministério da Saúde, que não recomenda rastreamento populacional rotineiro por PSA devido às incertezas sobre o benefício líquido em nível populacional, e sociedades de especialidade (como a SBU), que tendem a recomendar de forma mais ativa a discussão do rastreamento a partir dos 50 anos (ou antes, em grupos de risco), evidenciando a necessidade de decisão compartilhada baseada em evidências e adaptada ao contexto individual do paciente. Correta. Essa descrição reflete corretamente a divergência de posicionamento entre as diretrizes do Ministério da Saúde e das sociedades de especialidade sobre o tema."
      },
      {
        "letra": "C",
        "texto": "nenhuma das duas entidades reconhece o PSA como exame clinicamente válido para qualquer finalidade.",
        "correta": false,
        "justificativa": "Incorreta. Ambas as entidades reconhecem a validade clínica do PSA como ferramenta diagnóstica e de seguimento; a controvérsia está relacionada à indicação de rastreamento populacional em massa, não à validade do exame em si."
      },
      {
        "letra": "D",
        "texto": "o rastreamento por toque retal foi formalmente abolido por ambas as entidades, sendo considerado obsoleto.",
        "correta": false,
        "justificativa": "Incorreta. O toque retal continua sendo parte da avaliação clínica recomendada na investigação de doenças prostáticas, não tendo sido abolido por nenhuma das entidades."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP2_ENAMED — Q20"
  },
  {
    "enunciado": "Em aula introdutória sobre neoplasias hematológicas, o professor explica que, diferentemente dos tumores sólidos, as leucemias não formam massas tumorais localizadas, mas sim comprometem difusamente a medula óssea e o sangue periférico. Com base nessa distinção, as leucemias são classicamente definidas como neoplasias",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "sólidas de origem epitelial, semelhantes aos carcinomas.",
        "correta": false,
        "justificativa": "Incorreta. Leucemias são tumores não sólidos, de origem hematopoiética, diferentes dos carcinomas, que têm origem epitelial e formam massas tumorais localizadas."
      },
      {
        "letra": "B",
        "texto": "hematológicas, originadas na medula óssea, com proliferação clonal descontrolada de células precursoras hematopoiéticas.",
        "correta": true,
        "justificativa": "As leucemias são neoplasias hematológicas (tumores não sólidos) originadas de proliferação clonal descontrolada de células precursoras hematopoiéticas na medula óssea, comprometendo progressivamente a hematopoiese normal e circulando no sangue periférico. Correta. Essa é a definição correta: neoplasia hematológica com proliferação clonal descontrolada de células precursoras da medula óssea."
      },
      {
        "letra": "C",
        "texto": "exclusivas do tecido linfoide periférico, sem qualquer envolvimento medular.",
        "correta": false,
        "justificativa": "Incorreta. As leucemias comprometem primariamente a medula óssea, com posterior circulação de células neoplásicas no sangue periférico, e não se restringem ao tecido linfoide periférico."
      },
      {
        "letra": "D",
        "texto": "benignas por definição, sem potencial de comprometer a função medular normal.",
        "correta": false,
        "justificativa": "Incorreta. As leucemias são neoplasias malignas, com potencial de comprometer gravemente a função medular normal e serem fatais sem tratamento adequado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q1"
  },
  {
    "enunciado": "Durante discussão sobre epidemiologia das neoplasias hematológicas na infância, destaca-se que determinado subtipo de leucemia aguda apresenta pico de incidência entre 2 e 5 anos de idade, sendo a neoplasia maligna mais frequente nessa faixa etária. Esse subtipo é a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "leucemia mieloide crônica (LMC).",
        "correta": false,
        "justificativa": "Incorreta. A LMC é rara na infância, sendo predominantemente uma doença de adultos, associada ao cromossomo Filadélfia."
      },
      {
        "letra": "B",
        "texto": "leucemia linfoide crônica (LLC).",
        "correta": false,
        "justificativa": "Incorreta. A LLC praticamente não ocorre em crianças, sendo doença característica de adultos mais idosos."
      },
      {
        "letra": "C",
        "texto": "leucemia linfoblástica aguda (LLA).",
        "correta": true,
        "justificativa": "A LLA é a neoplasia maligna mais comum na infância, com pico de incidência entre 2 e 5 anos de idade, sendo também uma das neoplasias pediátricas com maior taxa de cura quando tratada adequadamente. Correta. A LLA é a leucemia mais comum na infância, com pico de incidência entre 2 e 5 anos."
      },
      {
        "letra": "D",
        "texto": "leucemia mieloide aguda (LMA), a mais comum em qualquer faixa etária pediátrica.",
        "correta": false,
        "justificativa": "Incorreta. Embora a LMA também ocorra na infância, é menos comum que a LLA nessa faixa etária, sendo a LLA a neoplasia maligna pediátrica mais frequente."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q2"
  },
  {
    "enunciado": "Ao analisar um hemograma, um residente observa aumento importante da proporção de neutrófilos imaturos (bastonetes e formas ainda mais jovens) circulantes, achado que pode ocorrer em infecções, inflamação ou neoplasias hematológicas. Esse achado laboratorial é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "desvio à esquerda.",
        "correta": true,
        "justificativa": "Desvio à esquerda descreve o aumento da proporção de formas jovens da série neutrofílica circulante (bastonetes, metamielócitos, mielócitos), podendo ocorrer em infecções bacterianas, processos inflamatórios agudos ou neoplasias hematológicas, como as leucemias. Correta. Desvio à esquerda é exatamente o termo utilizado para descrever o aumento de formas jovens de neutrófilos no sangue periférico."
      },
      {
        "letra": "B",
        "texto": "desvio à direita, caracterizado por neutrófilos hipersegmentados.",
        "correta": false,
        "justificativa": "Incorreta. Desvio à direita refere-se à presença de neutrófilos hipersegmentados, achado associado a outras condições (como anemia megaloblástica), sendo conceito oposto ao descrito."
      },
      {
        "letra": "C",
        "texto": "pancitopenia, redução de todas as três séries sanguíneas.",
        "correta": false,
        "justificativa": "Incorreta. Pancitopenia é a redução simultânea das três séries sanguíneas (eritrócitos, leucócitos e plaquetas), achado distinto do desvio à esquerda."
      },
      {
        "letra": "D",
        "texto": "reticulocitose, aumento de reticulócitos circulantes.",
        "correta": false,
        "justificativa": "Incorreta. Reticulocitose refere-se ao aumento de reticulócitos (precursores de hemácias), sem relação com o achado de neutrófilos imaturos descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q3"
  },
  {
    "enunciado": "Em revisão sobre hematopoiese, os estudantes discutem como a célula-tronco hematopoiética pluripotente da medula óssea origina todas as células do sangue, por meio de duas linhagens principais de diferenciação. Essas duas linhagens principais são",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "linhagem mieloide e linhagem linfoide.",
        "correta": true,
        "justificativa": "A célula-tronco hematopoiética pluripotente origina duas linhagens principais: a mieloide (que dá origem a eritrócitos, granulócitos, monócitos e plaquetas) e a linfoide (que origina linfócitos T, B e células NK), sendo o comprometimento dessas linhagens a base para classificar os diferentes tipos de leucemia. Correta. Mieloide e linfoide são as duas linhagens principais originadas da célula-tronco hematopoiética pluripotente."
      },
      {
        "letra": "B",
        "texto": "linhagem epitelial e linhagem mesenquimal, comuns a outros tecidos do organismo.",
        "correta": false,
        "justificativa": "Incorreta. Linhagens epitelial e mesenquimal são relevantes para outros tecidos do organismo (pele, tecido conjuntivo), sem relação direta com a hematopoiese."
      },
      {
        "letra": "C",
        "texto": "linhagem nervosa e linhagem muscular, sem relação com a hematopoiese.",
        "correta": false,
        "justificativa": "Incorreta. Linhagens nervosa e muscular não têm relação com a diferenciação hematopoiética, sendo originadas de outras camadas germinativas embrionárias."
      },
      {
        "letra": "D",
        "texto": "linhagem hepática e linhagem renal, órgãos que não participam da hematopoiese no adulto.",
        "correta": false,
        "justificativa": "Incorreta. Fígado e rim não são órgãos hematopoiéticos primários no indivíduo adulto (embora o fígado tenha papel hematopoiético fetal), não correspondendo às linhagens celulares sanguíneas descritas."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q4"
  },
  {
    "enunciado": "Um hemograma de paciente com leucemia aguda recém-diagnosticada mostra hemoglobina reduzida, plaquetas muito baixas e alteração da série branca, com presença de blastos circulantes. Esse padrão laboratorial, decorrente da substituição da medula óssea normal por células neoplásicas, é classicamente descrito como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "eritrocitose isolada, sem outras alterações hematológicas.",
        "correta": false,
        "justificativa": "Incorreta. A leucemia aguda tipicamente causa anemia (redução de hemácias/hemoglobina), e não eritrocitose (aumento de hemácias)."
      },
      {
        "letra": "B",
        "texto": "pancitopenia funcional (anemia e plaquetopenia associadas a alteração da série branca, com blastos circulantes).",
        "correta": true,
        "justificativa": "A infiltração medular por células leucêmicas compromete a hematopoiese normal, resultando tipicamente em anemia e plaquetopenia, associadas a alteração qualitativa e/ou quantitativa da série branca, com presença de blastos circulantes no sangue periférico. Correta. Esse padrão de comprometimento das três séries sanguíneas, com blastos circulantes, é característico da infiltração medular por leucemia aguda."
      },
      {
        "letra": "C",
        "texto": "trombocitose isolada, sem qualquer outra alteração de série sanguínea.",
        "correta": false,
        "justificativa": "Incorreta. Na leucemia aguda, tipicamente ocorre plaquetopenia (redução de plaquetas), e não trombocitose (aumento de plaquetas)."
      },
      {
        "letra": "D",
        "texto": "policitemia vera, doença mieloproliferativa distinta da leucemia aguda.",
        "correta": false,
        "justificativa": "Incorreta. Policitemia vera é neoplasia mieloproliferativa crônica distinta, caracterizada por aumento da massa eritrocitária, não correspondendo ao padrão descrito de pancitopenia com blastos."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q5"
  },
  {
    "enunciado": "Criança de 10 anos é levada à UBS pela mãe, que relata cansaço progressivo, dores ósseas noturnas nas pernas e braços, e episódios frequentes de infecção nos últimos meses. Ao exame, a médica encontra palidez importante, linfonodomegalia, hepatoesplenomegalia e manchas roxas (petéquias) nas pernas. O hemograma urgente mostra hemoglobina de 6,8 g/dL, leucocitose com blastos circulantes e plaquetopenia acentuada. Diante desse quadro clínico-laboratorial, a hipótese diagnóstica mais provável é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "anemia ferropriva isolada, sem qualquer outra alteração hematológica associada.",
        "correta": false,
        "justificativa": "Incorreta. Anemia ferropriva isolada não explicaria a presença de blastos circulantes, leucocitose, hepatoesplenomegalia e plaquetopenia acentuada descritas no caso."
      },
      {
        "letra": "B",
        "texto": "leucemia aguda.",
        "correta": true,
        "justificativa": "A associação de dor óssea noturna, linfonodomegalia, hepatoesplenomegalia, anemia grave, blastos circulantes e plaquetopenia acentuada é fortemente sugestiva de leucemia aguda, exigindo investigação hematológica urgente com mielograma e imunofenotipagem para confirmação diagnóstica. Correta. O conjunto de achados clínicos e laboratoriais é altamente sugestivo de leucemia aguda, exigindo investigação hematológica de urgência."
      },
      {
        "letra": "C",
        "texto": "mononucleose infecciosa não complicada, quadro autolimitado sem gravidade.",
        "correta": false,
        "justificativa": "Incorreta. Embora mononucleose possa causar linfonodomegalia e hepatoesplenomegalia, não costuma cursar com anemia grave, blastos circulantes e plaquetopenia acentuada como descrito."
      },
      {
        "letra": "D",
        "texto": "púrpura trombocitopênica idiopática isolada, sem comprometimento das demais séries sanguíneas.",
        "correta": false,
        "justificativa": "Incorreta. A púrpura trombocitopênica idiopática cursa com plaquetopenia isolada, sem anemia grave, blastos circulantes ou hepatoesplenomegalia significativa, não explicando todo o quadro apresentado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q6"
  },
  {
    "enunciado": "Diante da forte suspeita clínica e laboratorial de leucemia aguda em uma criança, a equipe da UBS discute qual exame é necessário para confirmação diagnóstica definitiva e classificação adequada da doença, permitindo definir o subtipo (mieloide ou linfoide) e orientar o protocolo terapêutico específico. Esse exame considerado padrão-ouro é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "hemograma completo isolado, sem outros exames complementares.",
        "correta": false,
        "justificativa": "Incorreta. O hemograma é exame de triagem importante, mas não é suficiente para confirmação diagnóstica definitiva nem para classificação da linhagem leucêmica."
      },
      {
        "letra": "B",
        "texto": "mielograma (aspirado de medula óssea) com imunofenotipagem.",
        "correta": true,
        "justificativa": "O mielograma (aspirado de medula óssea), complementado por imunofenotipagem e, quando disponível, estudo citogenético/molecular, é o exame padrão-ouro para confirmação diagnóstica e classificação das leucemias agudas, orientando a linhagem envolvida (mieloide ou linfoide) e o protocolo terapêutico específico. Correta. O mielograma com imunofenotipagem é o exame padrão-ouro para confirmação e classificação das leucemias agudas."
      },
      {
        "letra": "C",
        "texto": "radiografia de tórax, exame de imagem sem capacidade de confirmação hematológica.",
        "correta": false,
        "justificativa": "Incorreta. A radiografia de tórax pode identificar massa mediastinal em alguns casos (sugestiva de certos subtipos), mas não confirma nem classifica a leucemia por si só."
      },
      {
        "letra": "D",
        "texto": "velocidade de hemossedimentação (VHS), exame inespecífico de atividade inflamatória.",
        "correta": false,
        "justificativa": "Incorreta. A VHS é exame inespecífico de atividade inflamatória sistêmica, sem capacidade de confirmar diagnóstico ou classificar leucemias."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q7"
  },
  {
    "enunciado": "Em discussão sobre citogenética das leucemias, um estudante pergunta qual alteração cromossômica está classicamente associada à leucemia mieloide crônica (LMC), sendo utilizada tanto para diagnóstico quanto como alvo de terapia molecular específica. Essa alteração é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "trissomia do cromossomo 21, associada à síndrome de Down e maior risco de leucemia aguda.",
        "correta": false,
        "justificativa": "Incorreta. A trissomia do 21 está associada à síndrome de Down, condição que aumenta o risco de leucemia aguda (especialmente LLA e certos subtipos de LMA), mas não é a alteração característica da LMC."
      },
      {
        "letra": "B",
        "texto": "cromossomo Filadélfia, t(9;22), gerando o gene de fusão BCR-ABL.",
        "correta": true,
        "justificativa": "A LMC está associada, na quase totalidade dos casos, à translocação t(9;22), que origina o cromossomo Filadélfia e o gene de fusão BCR-ABL, cuja proteína resultante apresenta atividade tirosina-quinase constitutiva, sendo também alvo de terapias-alvo específicas, como os inibidores de tirosina-quinase. Correta. O cromossomo Filadélfia, resultante da t(9;22) e gerando o gene de fusão BCR-ABL, é a alteração citogenética clássica e definidora da LMC."
      },
      {
        "letra": "C",
        "texto": "deleção do cromossomo 5, associada a síndromes mielodisplásicas.",
        "correta": false,
        "justificativa": "Incorreta. A deleção do cromossomo 5 (5q-) está associada a síndromes mielodisplásicas, e não é a alteração característica da LMC."
      },
      {
        "letra": "D",
        "texto": "monossomia do cromossomo 7, associada a síndromes mielodisplásicas e leucemias secundárias.",
        "correta": false,
        "justificativa": "Incorreta. A monossomia do cromossomo 7 é associada a síndromes mielodisplásicas e leucemias secundárias, mas não é a alteração citogenética definidora da LMC."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q8"
  },
  {
    "enunciado": "Durante discussão epidemiológica sobre leucemias em diferentes faixas etárias, destaca-se que determinado subtipo é a leucemia mais comum em adultos ocidentais idosos, apresentando frequentemente curso indolente e podendo, inclusive, ser diagnosticado de forma incidental em exames de rotina, sem sintomas evidentes. Esse subtipo é a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "leucemia linfoblástica aguda, mais comum em crianças, e não em idosos.",
        "correta": false,
        "justificativa": "Incorreta. A LLA é a leucemia mais comum na infância, e não em idosos, sendo de curso agudo e sintomático, diferente do quadro indolente descrito."
      },
      {
        "letra": "B",
        "texto": "leucemia linfoide crônica (LLC).",
        "correta": true,
        "justificativa": "A LLC é a leucemia mais comum em adultos ocidentais idosos, com curso frequentemente indolente, podendo ser diagnosticada de forma incidental em hemograma de rotina, antes mesmo do aparecimento de sintomas clínicos evidentes. Correta. A LLC é a leucemia mais comum em idosos ocidentais, frequentemente de curso indolente e diagnóstico incidental."
      },
      {
        "letra": "C",
        "texto": "leucemia mieloide aguda, tipicamente de curso agudo e sintomático.",
        "correta": false,
        "justificativa": "Incorreta. A LMA, apesar de poder ocorrer em idosos, tem curso tipicamente agudo e sintomático, não correspondendo ao padrão indolente e incidental descrito."
      },
      {
        "letra": "D",
        "texto": "leucemia de células pilosas, entidade rara em comparação à descrita.",
        "correta": false,
        "justificativa": "Incorreta. A leucemia de células pilosas é entidade rara, não sendo a leucemia mais comum em idosos, ao contrário da LLC."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q9"
  },
  {
    "enunciado": "Após confirmação laboratorial de forte suspeita de leucemia aguda em uma criança atendida na Atenção Primária à Saúde, a equipe da UBS discute a conduta mais adequada considerando a gravidade e a urgência potencial do quadro. A conduta correta nesse momento é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "tratar sintomaticamente a criança na própria UBS e reavaliar em 30 dias, sem encaminhamento imediato.",
        "correta": false,
        "justificativa": "Incorreta. Tratar apenas sintomaticamente e reavaliar em 30 dias representa atraso inaceitável diante de uma condição potencialmente fatal que exige investigação e tratamento urgentes."
      },
      {
        "letra": "B",
        "texto": "encaminhar com urgência para avaliação hematológica especializada, preferencialmente em hospital com hematologia pediátrica estruturada.",
        "correta": true,
        "justificativa": "Diante de forte suspeita clínica e laboratorial de leucemia aguda em criança, o encaminhamento urgente para serviço especializado em hematologia pediátrica é essencial para confirmação diagnóstica definitiva (mielograma) e início precoce do tratamento, dado o caráter potencialmente fatal da doença sem intervenção adequada e em tempo hábil. Correta. O encaminhamento urgente para hematologia especializada é a conduta correta diante de forte suspeita de leucemia aguda."
      },
      {
        "letra": "C",
        "texto": "prescrever corticoide sistêmico empiricamente antes de qualquer encaminhamento, para reduzir sintomas enquanto se aguarda vaga especializada.",
        "correta": false,
        "justificativa": "Incorreta. O uso empírico de corticoide antes da confirmação diagnóstica e do início do protocolo terapêutico específico pode mascarar achados laboratoriais e histológicos, prejudicando o diagnóstico correto e a classificação da doença."
      },
      {
        "letra": "D",
        "texto": "solicitar apenas radiografia de ossos longos e aguardar resultado em regime ambulatorial, sem qualquer prioridade adicional.",
        "correta": false,
        "justificativa": "Incorreta. Aguardar resultado ambulatorial sem prioridade adicional não é adequado diante da gravidade e urgência potencial de uma leucemia aguda não tratada."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q10"
  },
  {
    "enunciado": "Em discussão sobre prognóstico das leucemias, o professor destaca que, apesar de compartilharem a característica comum de proliferação clonal descontrolada, diferentes tipos de leucemia apresentam evoluções clínicas muito distintas. Em relação ao prognóstico das leucemias, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "todas as leucemias têm prognóstico idêntico, independentemente do tipo, da idade do paciente ou de características biológicas do tumor.",
        "correta": false,
        "justificativa": "Incorreta. Há grande variabilidade de prognóstico entre os diferentes tipos de leucemia e conforme características individuais do paciente e do tumor, não sendo correto afirmar prognóstico idêntico para todos os casos."
      },
      {
        "letra": "B",
        "texto": "o tipo de leucemia, a faixa etária do paciente e características citogenéticas/moleculares específicas influenciam diretamente o prognóstico e a estratégia terapêutica.",
        "correta": true,
        "justificativa": "O prognóstico das leucemias varia conforme o subtipo (LLA, LMA, LLC, LMC), a idade do paciente e alterações citogenéticas/moleculares específicas identificadas na avaliação diagnóstica, fatores que orientam a estratificação de risco e a intensidade do tratamento proposto. Correta. Tipo de leucemia, idade e alterações citogenéticas/moleculares são fatores reconhecidos de estratificação prognóstica nas leucemias."
      },
      {
        "letra": "C",
        "texto": "o prognóstico das leucemias independe totalmente da resposta ao tratamento inicial (indução), sendo determinado exclusivamente no momento do diagnóstico.",
        "correta": false,
        "justificativa": "Incorreta. A resposta ao tratamento de indução é, na verdade, um dos principais fatores prognósticos avaliados durante o seguimento, influenciando diretamente decisões terapêuticas subsequentes."
      },
      {
        "letra": "D",
        "texto": "a LLA em crianças tem, em geral, prognóstico pior do que em adultos, ao contrário do observado na maioria dos estudos.",
        "correta": false,
        "justificativa": "Incorreta. Em geral, a LLA em crianças tem prognóstico melhor do que em adultos, com taxas de cura significativamente mais altas na população pediátrica."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q11"
  },
  {
    "enunciado": "Menino de 8 anos, com diagnóstico confirmado de leucemia linfoblástica aguda de linhagem B, sem alterações citogenéticas de alto risco, inicia protocolo quimioterápico de indução. A equipe médica alerta a família sobre o risco elevado de síndrome de lise tumoral nos primeiros dias de tratamento, especialmente pela alta carga tumoral inicial. A explicação fisiopatológica mais adequada para justificar esse risco é que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a quimioterapia não provoca qualquer lise celular significativa em doenças com alta carga tumoral, sendo o risco de lise tumoral irrelevante nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. Doenças com alta carga tumoral, como a LLA ao diagnóstico, apresentam risco justamente elevado de lise tumoral quando submetidas à quimioterapia citorredutora rápida."
      },
      {
        "letra": "B",
        "texto": "a rápida destruição de grande massa de células leucêmicas pela quimioterapia libera potássio, fósforo e ácido úrico intracelulares na circulação, podendo causar lesão renal aguda, arritmias cardíacas e hipocalcemia secundária à hiperfosfatemia.",
        "correta": true,
        "justificativa": "A síndrome de lise tumoral decorre da rápida destruição de grande número de células neoplásicas (alta carga tumoral, como frequentemente observado na LLA ao início do tratamento), liberando potássio, fósforo e ácido úrico intracelulares na circulação sistêmica, com risco de lesão renal aguda (pela precipitação de cristais de ácido úrico e fosfato de cálcio), arritmias cardíacas (por hipercalemia) e hipocalcemia secundária à hiperfosfatemia. Correta. Essa é a explicação fisiopatológica correta e completa do mecanismo da síndrome de lise tumoral nesse contexto clínico."
      },
      {
        "letra": "C",
        "texto": "a síndrome de lise tumoral ocorre exclusivamente em tumores sólidos, não sendo uma complicação esperada em neoplasias hematológicas como a LLA.",
        "correta": false,
        "justificativa": "Incorreta. A síndrome de lise tumoral é complicação bem reconhecida e frequente em neoplasias hematológicas de alta carga proliferativa, como leucemias agudas e linfomas de alto grau, não sendo exclusiva de tumores sólidos."
      },
      {
        "letra": "D",
        "texto": "a lise tumoral está associada exclusivamente ao uso de antibióticos profiláticos administrados durante a quimioterapia, sem relação com a destruição das células leucêmicas.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo da lise tumoral está diretamente relacionado à destruição das células neoplásicas pela quimioterapia citotóxica, e não ao uso de antibióticos profiláticos."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q12"
  },
  {
    "enunciado": "Criança em tratamento quimioterápico para leucemia aguda, no 10º dia após o último ciclo, apresenta febre de 38,5°C e contagem de neutrófilos absoluta de 300 células/mm³ no hemograma. A equipe de plantão discute a conduta imediata diante desse quadro, considerando o risco potencial de complicação grave e rapidamente progressiva nesse contexto. A conduta correta é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aguardar reavaliação ambulatorial em 24 a 48 horas, por se tratar de febre isolada sem outros sintomas evidentes.",
        "correta": false,
        "justificativa": "Incorreta. Aguardar reavaliação ambulatorial em 24-48 horas representa atraso inaceitável diante de uma emergência oncológica com risco de rápida progressão para sepse."
      },
      {
        "letra": "B",
        "texto": "considerar o quadro como neutropenia febril, uma emergência oncológica, e iniciar antibioticoterapia empírica de amplo espectro sem atraso, idealmente na primeira hora de atendimento.",
        "correta": true,
        "justificativa": "A neutropenia febril em paciente oncológico (contagem de neutrófilos \\\\< 500 células/mm³ associada a febre) representa emergência médica, pelo risco de progressão rápida para sepse grave; a antibioticoterapia empírica de amplo espectro deve ser iniciada sem atraso, idealmente dentro da primeira hora do atendimento, sem aguardar resultado de culturas. Correta. A neutropenia febril exige reconhecimento imediato como emergência e início de antibioticoterapia empírica de amplo espectro sem atraso."
      },
      {
        "letra": "C",
        "texto": "prescrever apenas antitérmico sintomático e orientar retorno se a febre persistir por mais de 5 dias.",
        "correta": false,
        "justificativa": "Incorreta. Tratamento apenas sintomático, sem antibioticoterapia, ignora o risco de infecção potencialmente grave e rapidamente progressiva associada à neutropenia profunda."
      },
      {
        "letra": "D",
        "texto": "solicitar hemocultura e aguardar resultado antes de iniciar qualquer antibioticoterapia, mesmo que isso leve alguns dias.",
        "correta": false,
        "justificativa": "Incorreta. A antibioticoterapia empírica não deve aguardar o resultado de hemoculturas, que podem demorar dias; a conduta correta é colher as culturas e iniciar o antibiótico imediatamente, sem esperar o resultado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q13"
  },
  {
    "enunciado": "Ao analisar lâminas de mielograma de dois pacientes com leucemia aguda, o hematologista observa que, em um dos casos, os blastos apresentam inclusões citoplasmáticas em bastonete, achado morfológico que auxilia na diferenciação entre os principais subtipos de leucemia aguda. Esse achado morfológico específico, quando presente, sugere fortemente o diagnóstico de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "leucemia mieloide aguda (LMA), pela presença de bastonetes (corpos) de Auer nos blastos.",
        "correta": true,
        "justificativa": "Os bastonetes (corpos) de Auer são inclusões citoplasmáticas encontradas em blastos de linhagem mieloide, achado morfológico sugestivo de LMA e ausente na LLA, sendo importante ferramenta morfológica inicial para diferenciação entre os dois principais subtipos de leucemia aguda antes mesmo da confirmação por imunofenotipagem. Correta. Os bastonetes de Auer são achado morfológico clássico e sugestivo de LMA, ausente na linhagem linfoide."
      },
      {
        "letra": "B",
        "texto": "leucemia linfoblástica aguda (LLA), subtipo no qual esse achado é típico e frequente.",
        "correta": false,
        "justificativa": "Incorreta. Os bastonetes de Auer não são característicos da LLA; sua presença sugere justamente a linhagem mieloide, e não a linfoide."
      },
      {
        "letra": "C",
        "texto": "leucemia linfoide crônica (LLC), doença de células maduras, sem relação com blastos.",
        "correta": false,
        "justificativa": "Incorreta. A LLC é doença de células linfoides maduras (e não blastos), sendo, portanto, incompatível com o achado de blastos com inclusões descrito no caso."
      },
      {
        "letra": "D",
        "texto": "leucemia mieloide crônica (LMC) em fase crônica, sem qualquer relação com blastos circulantes.",
        "correta": false,
        "justificativa": "Incorreta. A LMC em fase crônica caracteriza-se pela presença predominante de granulócitos em diferentes estágios de maturação, e não por blastos com bastonetes de Auer, achado mais associado à fase aguda (crise blástica) ou à LMA propriamente dita."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q14"
  },
  {
    "enunciado": "Durante a comunicação do diagnóstico de leucemia aguda a uma família, incluindo uma criança de 8 anos considerada apta a compreender parte da informação de acordo com sua idade, a equipe médica planeja a abordagem mais adequada para essa conversa. Os princípios que devem orientar essa comunicação incluem",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "omitir a gravidade da doença tanto da criança quanto dos pais, para evitar sofrimento imediato.",
        "correta": false,
        "justificativa": "Incorreta. Omitir a gravidade da doença compromete a confiança na relação com a família e pode dificultar a adesão ao tratamento e o planejamento adequado do cuidado."
      },
      {
        "letra": "B",
        "texto": "utilizar linguagem clara e adequada à faixa etária da criança, verificar a compreensão da família, acolher o impacto emocional do diagnóstico e explicitar, com honestidade, que existem tratamentos eficazes disponíveis, sem prometer certezas que não existem.",
        "correta": true,
        "justificativa": "A comunicação de más notícias deve ser honesta, clara e adaptada à compreensão da família e da criança (quando apropriado à idade), acolhendo o impacto emocional e destacando, quando pertinente, a existência de tratamentos eficazes disponíveis, sem prometer certezas absolutas que a equipe não pode garantir, conforme princípios de protocolos estruturados de comunicação, como o SPIKES. Correta. Esses são os princípios adequados de comunicação de más notícias: clareza, verificação de compreensão, acolhimento emocional e honestidade equilibrada."
      },
      {
        "letra": "C",
        "texto": "comunicar o diagnóstico apenas por meio de terceiros (como outros familiares), sem contato direto da equipe médica com os pais ou a criança.",
        "correta": false,
        "justificativa": "Incorreta. A comunicação direta da equipe médica com a família (e, quando apropriado, com a criança) é fundamental para construção de vínculo de confiança e para garantir compreensão adequada da situação."
      },
      {
        "letra": "D",
        "texto": "evitar qualquer menção a prognóstico ou possibilidades terapêuticas, mesmo quando a família questiona diretamente sobre isso.",
        "correta": false,
        "justificativa": "Incorreta. Evitar completamente qualquer menção a prognóstico, mesmo diante de questionamento direto da família, pode gerar mais ansiedade e desconfiança do que uma comunicação honesta e cuidadosa."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q15"
  },
  {
    "enunciado": "Durante o acompanhamento ambulatorial de uma criança em tratamento para leucemia aguda, a mãe relata exaustão física e emocional, dificuldades financeiras decorrentes do afastamento do trabalho e sensação de isolamento social. A equipe assistencial discute como estruturar o cuidado a essa família ao longo do tratamento prolongado. Em relação ao papel da equipe multiprofissional nesse contexto, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o cuidado deve ser realizado exclusivamente pelo médico assistente, sem necessidade de envolvimento de outros profissionais.",
        "correta": false,
        "justificativa": "Incorreta. O cuidado exclusivamente médico não contempla as necessidades psicossociais e financeiras evidenciadas pela família, sendo insuficiente para um cuidado verdadeiramente integral."
      },
      {
        "letra": "B",
        "texto": "psicólogos, assistentes sociais, equipe de enfermagem especializada e articulação com entidades de apoio ao paciente oncológico contribuem para o suporte integral da criança e da família ao longo de todo o tratamento.",
        "correta": true,
        "justificativa": "O cuidado à criança com leucemia e sua família demanda abordagem multiprofissional ao longo de todo o tratamento, incluindo suporte psicológico, assistência social (auxílio em questões previdenciárias, transporte, moradia durante tratamento prolongado), enfermagem especializada e articulação com entidades de apoio, reconhecendo o impacto físico, emocional, social e financeiro do adoecimento oncológico pediátrico sobre toda a família. Correta. O suporte multiprofissional, incluindo psicologia, serviço social, enfermagem especializada e entidades de apoio, é fundamental para o cuidado integral da criança e da família ao longo do tratamento."
      },
      {
        "letra": "C",
        "texto": "o apoio psicossocial à família só é necessário após o óbito do paciente, em caso de desfecho desfavorável.",
        "correta": false,
        "justificativa": "Incorreta. O apoio psicossocial deve ocorrer durante todo o processo de tratamento, e não apenas após um desfecho desfavorável, sendo essencial desde o momento do diagnóstico."
      },
      {
        "letra": "D",
        "texto": "entidades de apoio ao paciente oncológico pediátrico não têm qualquer papel relevante reconhecido no cuidado dessas famílias.",
        "correta": false,
        "justificativa": "Incorreta. Entidades de apoio ao paciente oncológico pediátrico frequentemente desempenham papel relevante, oferecendo suporte financeiro, hospedagem durante tratamento fora do domicílio, atividades recreativas e rede de apoio entre famílias em situação semelhante."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q16"
  },
  {
    "enunciado": "Paciente adulto com leucemia mieloide crônica (LMC), diagnosticada em fase crônica, é acompanhado ambulatorialmente. O hematologista explica que, diferentemente de décadas passadas, quando o transplante de medula óssea era praticamente a única opção com potencial curativo, atualmente existe tratamento oral que modificou radicalmente o prognóstico da doença na maioria dos pacientes. Sobre esse tratamento, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o transplante de medula óssea permanece sendo a única opção terapêutica disponível atualmente para a LMC, sem qualquer alternativa farmacológica eficaz.",
        "correta": false,
        "justificativa": "Incorreta. O transplante de medula óssea, embora ainda seja opção em casos selecionados (falha terapêutica, progressão), não é mais a única alternativa disponível, tendo os inibidores de tirosina-quinase se tornado o tratamento de primeira linha na maioria dos casos."
      },
      {
        "letra": "B",
        "texto": "os inibidores de tirosina-quinase (como o imatinibe), que bloqueiam especificamente a proteína de fusão BCR-ABL, revolucionaram o tratamento e o prognóstico da LMC, permitindo controle prolongado da doença com terapia oral contínua.",
        "correta": true,
        "justificativa": "Os inibidores de tirosina-quinase, como o imatinibe, bloqueiam especificamente a atividade da proteína de fusão BCR-ABL (resultante do cromossomo Filadélfia), alterando radicalmente o prognóstico da LMC, que passou a ter sobrevida prolongada e controle da doença com terapia oral contínua na maioria dos pacientes em fase crônica, reservando-se o transplante de medula óssea para casos selecionados de falha terapêutica ou progressão da doença. Correta. Os inibidores de tirosina-quinase modificaram radicalmente o prognóstico da LMC, tornando-se o tratamento padrão de primeira linha na fase crônica."
      },
      {
        "letra": "C",
        "texto": "a LMC não responde a nenhuma forma de terapia-alvo molecular, sendo tratada exclusivamente com quimioterapia citotóxica convencional.",
        "correta": false,
        "justificativa": "Incorreta. A LMC é justamente um dos exemplos mais bem-sucedidos de terapia-alvo molecular na oncologia, respondendo bem aos inibidores de tirosina-quinase."
      },
      {
        "letra": "D",
        "texto": "a quimioterapia citotóxica convencional isolada é sempre superior aos inibidores de tirosina-quinase no tratamento da LMC em fase crônica.",
        "correta": false,
        "justificativa": "Incorreta. Os inibidores de tirosina-quinase são atualmente superiores à quimioterapia citotóxica convencional isolada no tratamento da LMC em fase crônica, tanto em eficácia quanto em perfil de efeitos adversos."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q17"
  },
  {
    "enunciado": "Uma criança com quadro clínico fortemente sugestivo de leucemia aguda reside em município distante do único centro de hematologia pediátrica do estado, o que gera preocupação da equipe da UBS quanto ao tempo necessário para confirmação diagnóstica e início do tratamento. Em relação à organização da rede de atenção à saúde nesse contexto, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não existe qualquer protocolo de referência e contrarreferência estruturado no SUS para esse tipo de situação clínica.",
        "correta": false,
        "justificativa": "Incorreta. O SUS possui, ao menos formalmente, protocolos de referência e contrarreferência e mecanismos de regulação que devem ser mobilizados justamente em situações de urgência diagnóstica como essa, ainda que a efetividade prática possa variar conforme a região."
      },
      {
        "letra": "B",
        "texto": "a rede de atenção à saúde deve garantir fluxo ágil de referência para o centro especializado, considerando a urgência diagnóstica e o impacto que o atraso pode ter sobre o prognóstico da criança.",
        "correta": true,
        "justificativa": "A organização da rede de atenção à saúde deve garantir referência ágil a centros especializados em hematologia pediátrica, mesmo diante de distância geográfica, minimizando atrasos que podem comprometer significativamente o prognóstico em doenças agudas e potencialmente fatais como a leucemia, por meio de protocolos de regulação, transporte sanitário e articulação entre níveis de atenção. Correta. Garantir fluxo ágil de referência é essencial diante da urgência diagnóstica e terapêutica da leucemia aguda, minimizando o impacto do atraso sobre o prognóstico."
      },
      {
        "letra": "C",
        "texto": "é impossível qualquer atendimento especializado fora do município de origem do paciente, independentemente da gravidade do quadro clínico.",
        "correta": false,
        "justificativa": "Incorreta. O SUS prevê mecanismos de referência para atendimento especializado fora do município de origem quando necessário, especialmente em casos de urgência e ausência de recurso local disponível."
      },
      {
        "letra": "D",
        "texto": "o tratamento de leucemias agudas deve, obrigatoriamente, ser realizado exclusivamente na atenção primária, sem necessidade de referência a serviço especializado.",
        "correta": false,
        "justificativa": "Incorreta. O tratamento de leucemias agudas exige acompanhamento em serviço especializado em hematologia (frequentemente hospitalar), não sendo viável nem seguro restringi-lo exclusivamente à atenção primária."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q18"
  },
  {
    "enunciado": "Em uma discussão sobre diferenças e semelhanças entre neoplasias hematológicas, um estudante questiona por que alguns pacientes com massas ganglionares importantes recebem diagnóstico de linfoma, enquanto outros, com quadro clínico predominantemente de comprometimento medular e sanguíneo, recebem diagnóstico de leucemia, ainda que ambas as condições compartilhem origem no tecido linfo-hematopoiético. A explicação mais adequada para essa distinção clínica é que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "linfomas e leucemias são exatamente a mesma entidade patológica, sem qualquer distinção clínica relevante entre elas.",
        "correta": false,
        "justificativa": "Incorreta. Linfomas e leucemias, apesar de compartilharem origem no tecido linfo-hematopoiético, apresentam padrões clínicos e critérios diagnósticos distintos, não sendo entidades idênticas."
      },
      {
        "letra": "B",
        "texto": "os linfomas geralmente se apresentam como massas tumorais localizadas em linfonodos ou tecidos extranodais, enquanto as leucemias cursam predominantemente com infiltração primária da medula óssea e circulação de células neoplásicas no sangue periférico, havendo, contudo, superposição clínica em alguns casos.",
        "correta": true,
        "justificativa": "Embora compartilhem origem no tecido linfo-hematopoiético, linfomas tipicamente se manifestam como massas tumorais localizadas em linfonodos ou sítios extranodais, enquanto leucemias cursam com infiltração primária da medula óssea e circulação de células neoplásicas no sangue periférico — havendo, contudo, superposição clínica em alguns casos (como linfomas com infiltração medular extensa ou certas leucemias com linfonodomegalia importante, como a LLC). Correta. Essa distinção reflete corretamente o padrão predominante de apresentação de cada grupo de doenças, reconhecendo também a superposição clínica possível entre elas."
      },
      {
        "letra": "C",
        "texto": "linfomas nunca acometem a medula óssea em nenhuma fase da doença, ao contrário do que ocorre nas leucemias.",
        "correta": false,
        "justificativa": "Incorreta. Alguns linfomas podem apresentar infiltração medular significativa em determinadas fases da doença, o que contraria a afirmação de que \"nunca\" ocorre acometimento medular."
      },
      {
        "letra": "D",
        "texto": "leucemias nunca cursam com linfonodomegalia, sendo esse achado exclusivo dos linfomas.",
        "correta": false,
        "justificativa": "Incorreta. Algumas leucemias, como a LLC, frequentemente cursam com linfonodomegalia significativa, contrariando a afirmação de que esse achado seria exclusivo dos linfomas."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q19"
  },
  {
    "enunciado": "Um estudante de medicina, ao revisar hemogramas de crianças com leucemia aguda recém-diagnosticada para uma apresentação de caso clínico, busca sistematizar as alterações laboratoriais esperadas nessa condição, de forma a reconhecer rapidamente um quadro suspeito em sua futura prática clínica. Do ponto de vista didático, é esperado encontrar tipicamente, no hemograma dessas crianças,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "série vermelha, branca e plaquetária totalmente normais, sem qualquer alteração detectável.",
        "correta": false,
        "justificativa": "Incorreta. A leucemia aguda tipicamente causa alterações significativas nas três séries sanguíneas, e não hemograma normal, sendo essa a razão pela qual o hemograma é exame de triagem tão relevante na suspeita diagnóstica."
      },
      {
        "letra": "B",
        "texto": "anemia e plaquetopenia, com contagem de leucócitos variável (podendo estar aumentada, normal ou até diminuída) e presença de blastos circulantes no sangue periférico.",
        "correta": true,
        "justificativa": "Na leucemia aguda, é típica a presença de anemia e plaquetopenia por infiltração medular, com contagem leucocitária variável (podendo estar elevada, normal ou reduzida, a depender do estágio e subtipo da doença) e presença de blastos no sangue periférico, refletindo a substituição progressiva da hematopoiese normal pelo clone neoplásico. Correta. Esse é o padrão laboratorial didaticamente esperado na leucemia aguda: anemia, plaquetopenia, contagem leucocitária variável e blastos circulantes."
      },
      {
        "letra": "C",
        "texto": "policitemia isolada (aumento da série vermelha), sem qualquer outra alteração hematológica associada.",
        "correta": false,
        "justificativa": "Incorreta. A leucemia aguda tipicamente causa anemia (redução da série vermelha), e não policitemia (aumento da série vermelha)."
      },
      {
        "letra": "D",
        "texto": "eosinofilia isolada, sem qualquer comprometimento das demais séries sanguíneas.",
        "correta": false,
        "justificativa": "Incorreta. Embora eosinofilia possa ocorrer em alguns contextos hematológicos específicos, ela não é o achado laboratorial típico e isolado da leucemia aguda, que classicamente compromete as três séries sanguíneas de forma mais ampla."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP3_ENAMED — Q20"
  },
  {
    "enunciado": "Em discussão sobre o caso amplamente divulgado na mídia de uma paciente diagnosticada com adenocarcinoma na porção final do intestino grosso, os estudantes revisam a histologia mais comum das neoplasias colorretais. O tipo histológico mais frequente de câncer colorretal, correspondendo à grande maioria dos casos, é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "carcinoma de células escamosas, mais associado a tumores de canal anal.",
        "correta": false,
        "justificativa": "Incorreta. Carcinoma de células escamosas é mais característico de tumores do canal anal, e não do cólon ou reto propriamente ditos."
      },
      {
        "letra": "B",
        "texto": "adenocarcinoma.",
        "correta": true,
        "justificativa": "O adenocarcinoma, originado do epitélio glandular da mucosa colorretal, corresponde à grande maioria dos casos de câncer colorretal, sendo o tipo histológico de maior relevância epidemiológica e clínica nessa localização. Correta. O adenocarcinoma é o tipo histológico predominante e mais frequente entre as neoplasias colorretais."
      },
      {
        "letra": "C",
        "texto": "sarcoma, tumor de origem mesenquimal, raro no cólon.",
        "correta": false,
        "justificativa": "Incorreta. Sarcomas são tumores de origem mesenquimal, raros no trato gastrointestinal em comparação ao adenocarcinoma."
      },
      {
        "letra": "D",
        "texto": "linfoma primário de cólon, entidade rara em comparação ao tipo mais comum.",
        "correta": false,
        "justificativa": "Incorreta. Linfomas primários de cólon são entidades raras, representando pequena fração dos casos de neoplasia colorretal, em comparação à predominância do adenocarcinoma."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q1"
  },
  {
    "enunciado": "Durante revisão sobre a sequência de eventos que leva ao desenvolvimento do câncer colorretal esporádico, destaca-se que a maioria dos casos evolui a partir de uma lesão intestinal benigna inicial, que acumula mutações progressivas ao longo de anos até se tornar maligna. Essa lesão precursora mais reconhecida do câncer colorretal esporádico é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o pólipo adenomatoso.",
        "correta": true,
        "justificativa": "A sequência adenoma-carcinoma descreve a progressão de pólipos adenomatosos, ao longo de anos e com acúmulo progressivo de mutações genéticas, para carcinoma invasor, sendo a principal via de carcinogênese colorretal esporádica. Correta. O pólipo adenomatoso é a lesão precursora clássica e mais reconhecida do câncer colorretal esporádico, na chamada sequência adenoma-carcinoma."
      },
      {
        "letra": "B",
        "texto": "a hemorroida interna, dilatação vascular sem potencial de malignização.",
        "correta": false,
        "justificativa": "Incorreta. Hemorroidas são dilatações vasculares anais, sem relação com a via de carcinogênese colorretal descrita."
      },
      {
        "letra": "C",
        "texto": "o divertículo colônico, herniação da mucosa através da parede muscular.",
        "correta": false,
        "justificativa": "Incorreta. Divertículos colônicos são herniações da mucosa através de pontos de fraqueza da parede muscular, associados à diverticulose/diverticulite, sem relação direta com a sequência adenoma-carcinoma."
      },
      {
        "letra": "D",
        "texto": "a fissura anal, lesão traumática da mucosa anal.",
        "correta": false,
        "justificativa": "Incorreta. Fissura anal é lesão traumática da mucosa do canal anal, sem qualquer relação com a via de carcinogênese colorretal."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q2"
  },
  {
    "enunciado": "Após a divulgação de um caso de câncer colorretal em pessoa de meia-idade, uma reportagem questiona quais seriam os principais fatores de risco para essa neoplasia. Discutindo o tema em sala de aula, o professor destaca que um dos principais fatores de risco não modificáveis para o câncer colorretal é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "idade avançada.",
        "correta": true,
        "justificativa": "A idade avançada é fator de risco não modificável relevante para o câncer colorretal, com aumento expressivo da incidência a partir dos 50 anos, embora casos em adultos mais jovens venham sendo crescentemente descritos na literatura recente. Correta. A idade avançada é reconhecidamente um dos principais fatores de risco não modificáveis para câncer colorretal."
      },
      {
        "letra": "B",
        "texto": "prática regular de atividade física, fator associado à redução, e não ao aumento, do risco.",
        "correta": false,
        "justificativa": "Incorreta. A atividade física regular está associada à redução, e não ao aumento, do risco de câncer colorretal, sendo medida de prevenção primária."
      },
      {
        "letra": "C",
        "texto": "dieta rica em fibras, fator protetor, e não de risco.",
        "correta": false,
        "justificativa": "Incorreta. A dieta rica em fibras é considerada fator protetor, associado à redução do risco, e não fator de risco para a doença."
      },
      {
        "letra": "D",
        "texto": "baixo índice de massa corporal, fator não associado a aumento de risco para essa neoplasia.",
        "correta": false,
        "justificativa": "Incorreta. Baixo IMC não é fator de risco reconhecido para câncer colorretal; ao contrário, a obesidade é que se associa a maior risco dessa neoplasia."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q3"
  },
  {
    "enunciado": "Em uma família com múltiplos casos de câncer colorretal em gerações sucessivas e desenvolvimento de centenas de pólipos colônicos já na adolescência em alguns membros, investiga-se uma síndrome hereditária específica. Essa condição, caracterizada por mutação germinativa em um gene supressor tumoral, é a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "polipose adenomatosa familiar (PAF), associada a mutações no gene APC.",
        "correta": true,
        "justificativa": "A polipose adenomatosa familiar decorre de mutação germinativa no gene supressor tumoral APC, levando ao desenvolvimento de centenas a milhares de pólipos colônicos desde idade jovem e risco quase certo de câncer colorretal ao longo da vida, se o cólon não for removido profilaticamente. Correta. A PAF é a síndrome hereditária clássica associada a mutação no gene APC e desenvolvimento maciço de pólipos colônicos desde a adolescência."
      },
      {
        "letra": "B",
        "texto": "síndrome de Down, associada a alterações cromossômicas numéricas, sem relação direta com polipose colônica.",
        "correta": false,
        "justificativa": "Incorreta. A síndrome de Down é causada por trissomia do cromossomo 21, sem relação direta com a formação de polipose colônica maciça descrita."
      },
      {
        "letra": "C",
        "texto": "síndrome de Turner, associada a monossomia do cromossomo X, sem relação com polipose intestinal.",
        "correta": false,
        "justificativa": "Incorreta. A síndrome de Turner é causada por monossomia do X, condição sem relação com polipose intestinal."
      },
      {
        "letra": "D",
        "texto": "hemocromatose hereditária, doença de sobrecarga de ferro, sem relação com formação de pólipos colônicos.",
        "correta": false,
        "justificativa": "Incorreta. A hemocromatose hereditária é doença de sobrecarga de ferro, sem qualquer relação com formação de pólipos colônicos múltiplos."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q4"
  },
  {
    "enunciado": "Como parte do tratamento cirúrgico de um paciente com câncer colorretal avançado, é necessário exteriorizar uma porção do intestino grosso através da parede abdominal, permitindo a eliminação das fezes por uma via alternativa, temporária ou definitiva, conforme o caso. Esse procedimento cirúrgico é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "gastrostomia, procedimento realizado no estômago, e não no intestino grosso.",
        "correta": false,
        "justificativa": "Incorreta. Gastrostomia é procedimento realizado no estômago, geralmente para alimentação enteral, sem relação com eliminação de fezes."
      },
      {
        "letra": "B",
        "texto": "colostomia.",
        "correta": true,
        "justificativa": "A colostomia consiste na exteriorização de uma porção do cólon através da parede abdominal, criando um estoma para eliminação das fezes, podendo ser temporária (para proteção de anastomose ou em caráter de urgência) ou definitiva, conforme a extensão da ressecção e o objetivo terapêutico. Correta. Colostomia é exatamente o procedimento de exteriorização do cólon para eliminação fecal, conforme descrito no enunciado."
      },
      {
        "letra": "C",
        "texto": "traqueostomia, procedimento realizado nas vias aéreas, sem relação com o trato digestivo.",
        "correta": false,
        "justificativa": "Incorreta. Traqueostomia é procedimento das vias aéreas, sem qualquer relação com o trato digestivo ou eliminação de fezes."
      },
      {
        "letra": "D",
        "texto": "nefrostomia, procedimento realizado no sistema urinário, sem relação com o trato digestivo.",
        "correta": false,
        "justificativa": "Incorreta. Nefrostomia é procedimento do sistema urinário (drenagem renal), sem relação com o trato intestinal."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q5"
  },
  {
    "enunciado": "Homem de 68 anos procura atendimento por queixa de fadiga progressiva. Os exames laboratoriais revelam anemia ferropriva de origem não esclarecida, e o paciente relata alteração recente do hábito intestinal (alternância entre diarreia e constipação) nos últimos dois meses, sem histórico prévio de investigação digestiva. A investigação diagnóstica de primeira linha mais adequada nesse contexto é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "realizar apenas exame parasitológico de fezes, sem qualquer outra investigação complementar.",
        "correta": false,
        "justificativa": "Incorreta. O exame parasitológico de fezes não é suficiente para investigar anemia ferropriva associada a alteração do hábito intestinal em paciente idoso, quadro que exige avaliação estrutural do cólon."
      },
      {
        "letra": "B",
        "texto": "realizar colonoscopia com biópsia de eventuais lesões suspeitas.",
        "correta": true,
        "justificativa": "Em paciente idoso com anemia ferropriva inexplicada associada a mudança recente do hábito intestinal, a colonoscopia é o exame de escolha para investigação diagnóstica, permitindo visualização direta da mucosa colorretal e biópsia de lesões suspeitas, dada a relevante possibilidade de neoplasia colorretal nesse contexto clínico. Correta. A colonoscopia com biópsia é o exame de escolha diante desse quadro clínico, permitindo diagnóstico definitivo de eventual neoplasia colorretal."
      },
      {
        "letra": "C",
        "texto": "solicitar radiografia simples de abdome como exame inicial isolado.",
        "correta": false,
        "justificativa": "Incorreta. A radiografia simples de abdome tem baixa sensibilidade para identificar lesões neoplásicas da mucosa colorretal, não sendo o exame de escolha nesse contexto."
      },
      {
        "letra": "D",
        "texto": "solicitar apenas dosagem de ferritina sérica, sem qualquer exame endoscópico complementar.",
        "correta": false,
        "justificativa": "Incorreta. A dosagem de ferritina auxilia a confirmar o padrão ferropriva da anemia, mas não substitui a investigação endoscópica necessária para identificar a causa da perda sanguínea crônica."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q6"
  },
  {
    "enunciado": "Uma equipe de saúde coletiva está elaborando material educativo sobre prevenção do câncer colorretal para distribuição em unidades de saúde. Ao definir a faixa etária de início recomendada para o rastreamento populacional em indivíduos de risco médio (sem fatores de risco adicionais conhecidos), segundo diretrizes atuais, deve-se considerar o início",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aos 30 anos, para todos os indivíduos de risco médio, sem exceção.",
        "correta": false,
        "justificativa": "Incorreta. Iniciar rastreamento aos 30 anos para toda a população de risco médio geraria custo elevado e baixo rendimento diagnóstico, não sendo a recomendação vigente para esse grupo."
      },
      {
        "letra": "B",
        "texto": "aos 40 anos, independentemente de histórico familiar.",
        "correta": false,
        "justificativa": "Incorreta. Embora próxima da faixa correta, a idade de 40 anos não corresponde à recomendação atual mais aceita para indivíduos de risco médio, que situa o início um pouco mais tarde."
      },
      {
        "letra": "C",
        "texto": "entre 45 e 50 anos, podendo ser antecipado em grupos de maior risco.",
        "correta": true,
        "justificativa": "As diretrizes atuais recomendam início do rastreamento do câncer colorretal em torno dos 45-50 anos em indivíduos de risco médio (sem histórico familiar relevante ou outras condições de risco), podendo ser antecipado em grupos de maior risco, como portadores de síndromes hereditárias ou histórico familiar significativo da doença. Correta. A faixa de 45 a 50 anos é a recomendação atual para início do rastreamento em indivíduos de risco médio, podendo ser antecipada em grupos de maior risco."
      },
      {
        "letra": "D",
        "texto": "apenas aos 70 anos, por se tratar de doença exclusiva de idosos muito avançados.",
        "correta": false,
        "justificativa": "Incorreta. Postergar o início do rastreamento para os 70 anos ignoraria o aumento de incidência já relevante a partir da meia-idade, retardando diagnósticos que poderiam ser feitos em fase mais precoce e curável."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q7"
  },
  {
    "enunciado": "Durante a definição do estadiamento de um paciente com câncer colorretal recém-diagnosticado, a equipe de oncologia utiliza o sistema TNM para orientar o prognóstico e o planejamento terapêutico. Em relação a esse sistema de estadiamento, o componente que descreve especificamente o comprometimento de linfonodos regionais é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "componente T, que descreve a extensão do tumor primário na parede intestinal.",
        "correta": false,
        "justificativa": "Incorreta. O componente T descreve a extensão de invasão do tumor primário na parede do órgão, e não o comprometimento linfonodal."
      },
      {
        "letra": "B",
        "texto": "componente N.",
        "correta": true,
        "justificativa": "No sistema TNM, o componente \"N\" refere-se especificamente ao acometimento de linfonodos regionais pelo tumor, enquanto \"T\" descreve a extensão de invasão do tumor primário na parede intestinal e \"M\" indica a presença ou ausência de metástases à distância. Correta. O componente N é exatamente o que descreve o acometimento de linfonodos regionais no sistema de estadiamento TNM."
      },
      {
        "letra": "C",
        "texto": "componente M, que descreve a presença de metástases à distância.",
        "correta": false,
        "justificativa": "Incorreta. O componente M refere-se à presença de metástases à distância, e não ao comprometimento linfonodal regional."
      },
      {
        "letra": "D",
        "texto": "componente G, referente ao grau histológico de diferenciação tumoral.",
        "correta": false,
        "justificativa": "Incorreta. O grau histológico (G) é um parâmetro complementar de diferenciação tumoral, mas não é um dos três componentes centrais do sistema TNM (Tumor, Nódulo, Metástase)."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q8"
  },
  {
    "enunciado": "Paciente em tratamento quimioterápico para câncer colorretal metastático desenvolve febre de 38,7°C associada a contagem de neutrófilos muito baixa no hemograma de controle, situação que a equipe reconhece como uma complicação hematológica potencialmente grave, associada a risco aumentado de infecções sistêmicas fulminantes. Essa complicação é denominada",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "neutropenia febril.",
        "correta": true,
        "justificativa": "A neutropenia febril é complicação hematológica grave da quimioterapia citotóxica, decorrente da mielossupressão induzida pelo tratamento, associada a alto risco de infecções sistêmicas potencialmente fatais, exigindo conduta emergencial com antibioticoterapia empírica de amplo espectro sem atraso. Correta. Neutropenia febril é exatamente a complicação descrita: febre associada a contagem de neutrófilos muito baixa, com risco de infecção grave."
      },
      {
        "letra": "B",
        "texto": "policitemia, aumento da massa eritrocitária, sem relação com o quadro descrito.",
        "correta": false,
        "justificativa": "Incorreta. Policitemia é aumento da massa eritrocitária, condição não relacionada à complicação infecciosa descrita no caso."
      },
      {
        "letra": "C",
        "texto": "eritrocitose, aumento isolado de hemácias circulantes, sem relação com risco infeccioso.",
        "correta": false,
        "justificativa": "Incorreta. Eritrocitose refere-se a aumento de hemácias circulantes, sem qualquer relação com o quadro de neutropenia e risco infeccioso descrito."
      },
      {
        "letra": "D",
        "texto": "trombocitose reativa isolada, aumento de plaquetas sem relação com neutropenia.",
        "correta": false,
        "justificativa": "Incorreta. Trombocitose é aumento de plaquetas, condição distinta da neutropenia (redução de neutrófilos) associada ao risco infeccioso do caso."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q9"
  },
  {
    "enunciado": "Ao analisar fatores de risco para câncer colorretal em um paciente obeso, o médico explica que o excesso de tecido adiposo não é apenas um fator de risco estatístico, mas está relacionado a alterações metabólicas e hormonais que favorecem a proliferação celular no epitélio colônico. O mecanismo fisiopatológico mais aceito para essa associação envolve",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "redução da insulina circulante em pacientes obesos, com consequente proteção contra proliferação celular.",
        "correta": false,
        "justificativa": "Incorreta. Na obesidade, ocorre tipicamente hiperinsulinemia compensatória (e não redução da insulina circulante), associada a resistência insulínica periférica."
      },
      {
        "letra": "B",
        "texto": "estado de inflamação crônica de baixo grau e hiperinsulinemia, favorecendo proliferação celular no epitélio colônico.",
        "correta": true,
        "justificativa": "A obesidade está associada a estado inflamatório crônico de baixo grau, resistência insulínica e hiperinsulinemia compensatória, fatores que favorecem proliferação celular e carcinogênese no epitélio colorretal, por meio de vias de sinalização relacionadas ao eixo insulina/IGF-1 e mediadores inflamatórios produzidos pelo tecido adiposo. Correta. Esse é o mecanismo fisiopatológico mais aceito: inflamação crônica de baixo grau e hiperinsulinemia favorecendo proliferação celular colônica."
      },
      {
        "letra": "C",
        "texto": "aumento exclusivo da absorção intestinal de fibras alimentares em pacientes obesos.",
        "correta": false,
        "justificativa": "Incorreta. A obesidade não está associada a aumento da absorção de fibras alimentares; ao contrário, dietas obesogênicas costumam ser pobres em fibras."
      },
      {
        "letra": "D",
        "texto": "redução do índice glicêmico tecidual em pacientes obesos, protegendo contra carcinogênese.",
        "correta": false,
        "justificativa": "Incorreta. A obesidade está associada a alterações metabólicas que favorecem, e não protegem contra, a carcinogênese colorretal."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q10"
  },
  {
    "enunciado": "Paciente submetido a colostomia definitiva após cirurgia para câncer colorretal retorna à consulta de seguimento relatando dificuldade de adaptação à nova condição, com alterações significativas da autoimagem corporal e afastamento progressivo do convívio social. Diante desse relato, a equipe de saúde reconhece que as principais complicações psicológicas associadas à colostomia incluem",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ausência completa de qualquer impacto psicológico, uma vez que se trata de procedimento puramente técnico e cirúrgico.",
        "correta": false,
        "justificativa": "Incorreta. A colostomia tem impacto psicológico e social frequentemente significativo, documentado extensamente na literatura, não sendo um procedimento sem repercussões emocionais."
      },
      {
        "letra": "B",
        "texto": "alterações da autoimagem corporal, isolamento social e impacto na sexualidade, exigindo suporte psicológico especializado como parte do cuidado integral.",
        "correta": true,
        "justificativa": "A colostomia frequentemente provoca alterações significativas na autoimagem corporal, podendo gerar isolamento social, impacto negativo na sexualidade e na autoestima, exigindo suporte psicológico especializado e abordagem multiprofissional para adequada adaptação do paciente à nova condição. Correta. Esse é o padrão de impacto psicossocial reconhecido e frequentemente relatado por pacientes submetidos à colostomia, exigindo suporte especializado."
      },
      {
        "letra": "C",
        "texto": "melhora automática e imediata da autoestima em praticamente todos os pacientes submetidos ao procedimento.",
        "correta": false,
        "justificativa": "Incorreta. Não há evidência de melhora automática da autoestima após colostomia; ao contrário, o processo de adaptação costuma ser desafiador e gradual, exigindo suporte adequado."
      },
      {
        "letra": "D",
        "texto": "nenhum impacto relevante sobre a vida social ou afetiva do paciente, segundo a maioria dos estudos disponíveis.",
        "correta": false,
        "justificativa": "Incorreta. Diversos estudos documentam impacto relevante da colostomia sobre a vida social e afetiva dos pacientes, contrariando a afirmação de ausência de impacto."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q11"
  },
  {
    "enunciado": "Paciente de 50 anos, obeso, com diagnóstico de adenocarcinoma de reto localmente avançado (invasão da parede retal além da muscular própria, com linfonodos regionais comprometidos, sem metástases à distância), é encaminhado para tratamento neoadjuvante com quimiorradioterapia antes de qualquer procedimento cirúrgico. O racional fisiopatológico e oncológico dessa estratégia terapêutica, sequenciada antes da cirurgia, é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "reduzir o volume tumoral e a extensão da doença locorregional antes da cirurgia, aumentando a chance de ressecção completa (R0) e, em alguns casos, possibilitando preservação esfincteriana.",
        "correta": true,
        "justificativa": "A quimiorradioterapia neoadjuvante no câncer de reto localmente avançado visa reduzir o volume e a extensão da doença locorregional antes da cirurgia, aumentando a taxa de ressecção completa (R0), reduzindo o risco de recidiva local e, em casos selecionados, possibilitando cirurgias com preservação esfincteriana que não seriam viáveis sem o tratamento prévio. Correta. Esse é o racional oncológico correto da quimiorradioterapia neoadjuvante no câncer de reto localmente avançado."
      },
      {
        "letra": "B",
        "texto": "substituir totalmente a necessidade de tratamento cirúrgico em todos os casos de câncer de reto localmente avançado.",
        "correta": false,
        "justificativa": "Incorreta. A neoadjuvância não substitui a cirurgia na maioria dos casos; é etapa preparatória que antecede o tratamento cirúrgico definitivo."
      },
      {
        "letra": "C",
        "texto": "eliminar por completo o risco de recidiva local ou à distância, independentemente do estágio inicial da doença.",
        "correta": false,
        "justificativa": "Incorreta. Embora reduza significativamente o risco de recidiva local, a quimiorradioterapia neoadjuvante não elimina completamente o risco de recidiva, que depende de múltiplos fatores prognósticos."
      },
      {
        "letra": "D",
        "texto": "tratar exclusivamente eventuais metástases hepáticas já estabelecidas, sem qualquer efeito sobre o tumor primário retal.",
        "correta": false,
        "justificativa": "Incorreta. A quimiorradioterapia neoadjuvante atua sobre o tumor primário retal e a doença locorregional, e não especificamente sobre metástases hepáticas já estabelecidas, que exigiriam abordagem terapêutica própria."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q12"
  },
  {
    "enunciado": "Paciente com câncer colorretal metastático, submetido a esquema quimioterápico intensivo, apresenta, nas primeiras 48 horas após o início do tratamento, alterações laboratoriais compatíveis com síndrome de lise tumoral. Dentre as alterações eletrolíticas dessa síndrome, aquela que representa o maior risco imediato de morte súbita por arritmia cardíaca é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "hipocalemia leve, alteração eletrolítica de menor gravidade nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. Na síndrome de lise tumoral, ocorre tipicamente hipercalemia (e não hipocalemia), pela liberação maciça de potássio intracelular."
      },
      {
        "letra": "B",
        "texto": "hipercalemia, decorrente da liberação maciça de potássio intracelular, com risco de arritmias cardíacas graves.",
        "correta": true,
        "justificativa": "A hipercalemia decorrente da lise celular maciça (liberação de potássio intracelular na circulação) é a alteração eletrolítica mais perigosa na síndrome de lise tumoral, podendo causar arritmias cardíacas graves e morte súbita se não corrigida rapidamente, exigindo monitorização cardíaca contínua e intervenção emergencial quando presente. Correta. A hipercalemia é a alteração eletrolítica mais perigosa da síndrome de lise tumoral, com risco significativo de arritmias graves e morte súbita."
      },
      {
        "letra": "C",
        "texto": "hipernatremia isolada, alteração não característica da síndrome de lise tumoral.",
        "correta": false,
        "justificativa": "Incorreta. A síndrome de lise tumoral não é caracteristicamente associada à hipernatremia; as alterações típicas envolvem hipercalemia, hiperfosfatemia, hipocalcemia e hiperuricemia."
      },
      {
        "letra": "D",
        "texto": "hipocloremia, alteração eletrolítica sem relevância central nesse quadro.",
        "correta": false,
        "justificativa": "Incorreta. A hipocloremia não é a alteração eletrolítica central e mais perigosa dessa síndrome, sendo a hipercalemia o achado de maior relevância clínica imediata."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q13"
  },
  {
    "enunciado": "Paciente em quimioterapia para câncer colorretal desenvolve, após alguns dias do início do ciclo, dor e ulcerações na mucosa oral, dificultando a alimentação. A equipe reconhece esse quadro como mucosite induzida pela quimioterapia. Em relação à fisiopatologia dessa complicação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "decorre do efeito direto dos quimioterápicos sobre células de rápida renovação da mucosa do trato gastrointestinal (incluindo a mucosa oral), causando dano epitelial direto e resposta inflamatória local secundária.",
        "correta": true,
        "justificativa": "A mucosite decorre da toxicidade direta dos quimioterápicos sobre células epiteliais de rápida renovação (como as da mucosa oral e do restante do trato gastrointestinal), gerando dano tecidual direto seguido de resposta inflamatória local, podendo predispor secundariamente a infecções oportunistas na área lesada. Correta. Essa é a explicação fisiopatológica correta da mucosite quimioterápica: toxicidade direta sobre células de rápida renovação, com dano epitelial e inflamação secundária."
      },
      {
        "letra": "B",
        "texto": "trata-se de reação de hipersensibilidade mediada exclusivamente por anticorpos IgE, independentemente da dose do quimioterápico administrado.",
        "correta": false,
        "justificativa": "Incorreta. A mucosite não é reação de hipersensibilidade mediada por IgE; trata-se de efeito citotóxico direto do quimioterápico sobre o epitélio de rápida renovação celular."
      },
      {
        "letra": "C",
        "texto": "resulta de infecção bacteriana primária isolada, sem qualquer relação causal com o efeito citotóxico da quimioterapia.",
        "correta": false,
        "justificativa": "Incorreta. Embora infecção secundária possa complicar a mucosite já instalada, a causa primária é a toxicidade direta da quimioterapia, e não uma infecção bacteriana primária isolada."
      },
      {
        "letra": "D",
        "texto": "decorre exclusivamente de efeito mecânico traumático, sem qualquer participação da toxicidade farmacológica sistêmica do tratamento.",
        "correta": false,
        "justificativa": "Incorreta. A mucosite tem base farmacológica/toxicológica bem estabelecida (efeito citotóxico sistêmico sobre epitélio de rápida renovação), e não é decorrente de trauma mecânico isolado."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q14"
  },
  {
    "enunciado": "Paciente com câncer colorretal metastático exclusivamente para o fígado, sem outros sítios de doença identificados, é discutido em reunião de junta multidisciplinar de oncologia, incluindo cirurgião oncológico, oncologista clínico, radioterapeuta e equipe de cuidados paliativos. A importância dessa discussão multidisciplinar nesse cenário específico está relacionada, principalmente, ao fato de que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a decisão terapêutica deve ser exclusivamente cirúrgica, sem qualquer necessidade de avaliação por oncologia clínica.",
        "correta": false,
        "justificativa": "Incorreta. A decisão terapêutica no câncer colorretal com metástase hepática frequentemente depende de abordagem combinada (quimioterapia e cirurgia), não sendo exclusivamente cirúrgica nem dispensando a oncologia clínica."
      },
      {
        "letra": "B",
        "texto": "a integração entre as especialidades permite avaliar a ressecabilidade das metástases hepáticas, definir a sequência terapêutica (quimioterapia neoadjuvante, cirurgia, tratamento adjuvante) e considerar cuidados paliativos concomitantes, otimizando o prognóstico conforme as características específicas do caso.",
        "correta": true,
        "justificativa": "A discussão multidisciplinar integra diferentes especialidades para avaliar a ressecabilidade das metástases hepáticas (que pode mudar substancialmente o prognóstico, permitindo intenção curativa em casos selecionados), definir a sequência terapêutica mais adequada (incluindo quimioterapia neoadjuvante e/ou adjuvante) e considerar cuidados paliativos concomitantes para controle de sintomas, otimizando a estratégia terapêutica conforme as particularidades de cada caso. Correta. Essa é a razão central da discussão multidisciplinar nesse cenário: avaliar ressecabilidade, sequenciar tratamentos e integrar cuidados paliativos quando pertinente."
      },
      {
        "letra": "C",
        "texto": "a discussão multidisciplinar substitui completamente a necessidade de exames de estadiamento antes da definição terapêutica.",
        "correta": false,
        "justificativa": "Incorreta. A discussão multidisciplinar depende justamente de exames de estadiamento prévios (que fornecem os dados discutidos na reunião), não os substituindo."
      },
      {
        "letra": "D",
        "texto": "a abordagem multidisciplinar é dispensável sempre que a doença metastática for considerada irressecável, devendo o caso ser encaminhado exclusivamente para cuidados paliativos sem qualquer nova discussão.",
        "correta": false,
        "justificativa": "Incorreta. Mesmo diante de doença inicialmente irressecável, a reavaliação multidisciplinar periódica é importante, já que tratamentos sistêmicos podem, em alguns casos, converter doença irressecável em ressecável (\"conversão terapêutica\")."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q15"
  },
  {
    "enunciado": "Um hospital privado busca habilitação junto ao Ministério da Saúde para se tornar Centro de Assistência de Alta Complexidade em Oncologia (Cacon), estruturando sua rede assistencial conforme diretrizes nacionais específicas. Em relação à Política Nacional de Prevenção e Controle do Câncer (Portaria nº 874/2013) e aos objetivos desse tipo de habilitação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "essa política visa garantir cuidado integral, qualidade assistencial e segurança do paciente oncológico atendido na rede do SUS, estabelecendo parâmetros e requisitos técnicos para os serviços habilitados.",
        "correta": true,
        "justificativa": "A Política Nacional de Prevenção e Controle do Câncer busca organizar a rede de atenção oncológica no SUS, estabelecendo parâmetros técnicos, estruturais e assistenciais para a habilitação de Cacons e Unacons, garantindo cuidado integral, qualidade assistencial e segurança ao paciente oncológico atendido nesses serviços, independentemente de serem públicos ou privados conveniados ao SUS. Correta. Essa é a finalidade central da política: organizar a rede oncológica do SUS, garantindo qualidade e segurança assistencial nos serviços habilitados."
      },
      {
        "letra": "B",
        "texto": "a política se restringe exclusivamente ao financiamento de medicamentos importados de alto custo, sem qualquer diretriz sobre organização assistencial.",
        "correta": false,
        "justificativa": "Incorreta. A política abrange muito mais do que financiamento de medicamentos, incluindo requisitos estruturais, de recursos humanos e de processos assistenciais para habilitação dos serviços."
      },
      {
        "letra": "C",
        "texto": "a política não estabelece qualquer diretriz relacionada à qualidade assistencial dos serviços de oncologia habilitados.",
        "correta": false,
        "justificativa": "Incorreta. A política estabelece, sim, diretrizes relevantes sobre qualidade assistencial, sendo esse um de seus principais objetivos."
      },
      {
        "letra": "D",
        "texto": "a política aplica-se exclusivamente a hospitais da rede privada, sem qualquer relação com o financiamento ou a organização do SUS.",
        "correta": false,
        "justificativa": "Incorreta. A política se aplica a serviços habilitados no âmbito do SUS, podendo incluir hospitais privados conveniados/contratados, mas sempre em relação direta com o financiamento e a organização do sistema público de saúde."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q16"
  },
  {
    "enunciado": "Uma reportagem sobre o caso de uma paciente diagnosticada com câncer colorretal aos 50 anos suscitou debate sobre a relação entre essa neoplasia e a idade do paciente. Em relação a essa associação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a maioria dos casos de câncer colorretal ainda ocorre em pacientes com mais de 50 anos, mas a incidência em adultos jovens vem crescendo nas últimas décadas, o que reforça a importância de investigar sinais de alarme mesmo em pacientes mais jovens.",
        "correta": true,
        "justificativa": "Embora a maior parte dos casos de câncer colorretal ainda ocorra em pessoas com mais de 50 anos, há aumento documentado da incidência em adultos jovens nas últimas décadas, fenômeno que tem sido objeto de crescente atenção epidemiológica e que reforça a importância de investigar sinais de alarme (sangramento retal, mudança do hábito intestinal, emagrecimento não intencional, anemia inexplicada) independentemente da idade do paciente. Correta. Essa afirmação reflete corretamente o padrão epidemiológico atual: predomínio em pacientes mais velhos, mas com aumento relevante de casos em adultos jovens."
      },
      {
        "letra": "B",
        "texto": "o câncer colorretal é uma doença exclusiva de pacientes acima de 70 anos, não ocorrendo em nenhuma hipótese antes dessa idade.",
        "correta": false,
        "justificativa": "Incorreta. Embora a incidência aumente com a idade, o câncer colorretal não é exclusivo de pacientes acima de 70 anos, ocorrendo, inclusive, em adultos jovens, ainda que com menor frequência relativa."
      },
      {
        "letra": "C",
        "texto": "não há qualquer relação estatística entre idade e incidência de câncer colorretal, sendo a distribuição etária dessa neoplasia totalmente uniforme.",
        "correta": false,
        "justificativa": "Incorreta. Há relação estatística bem documentada entre idade avançada e maior incidência de câncer colorretal, não sendo a distribuição etária uniforme."
      },
      {
        "letra": "D",
        "texto": "pacientes jovens nunca devem ser investigados para câncer colorretal, independentemente dos sintomas apresentados, pela raridade absoluta da doença nessa faixa etária.",
        "correta": false,
        "justificativa": "Incorreta. Ignorar sinais de alarme em pacientes jovens, sob a justificativa de raridade da doença nessa faixa etária, pode atrasar diagnósticos importantes, especialmente considerando o aumento de incidência já documentado nesse grupo."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q17"
  },
  {
    "enunciado": "Paciente com câncer colorretal desenvolve, ao longo do seguimento oncológico, múltiplas lesões hepáticas identificadas em exame de imagem, compatíveis com metástases. Ao explicar à família por que o fígado é sítio metastático tão frequente nessa neoplasia específica, o oncologista destaca um aspecto anatômico particular da drenagem venosa do território colorretal. Esse aspecto é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a disseminação direta do tumor pela via biliar, sem qualquer participação vascular no processo.",
        "correta": false,
        "justificativa": "Incorreta. A disseminação metastática hepática do câncer colorretal ocorre predominantemente por via vascular (sistema porta), e não por disseminação direta pela via biliar."
      },
      {
        "letra": "B",
        "texto": "a drenagem venosa do território colorretal pelo sistema porta, que direciona o fluxo sanguíneo primariamente ao fígado antes de atingir a circulação sistêmica.",
        "correta": true,
        "justificativa": "A drenagem venosa do cólon e reto ocorre principalmente pelo sistema porta, que direciona o sangue venoso desse território diretamente ao fígado antes de alcançar a circulação sistêmica; esse trajeto anatômico explica por que o fígado é, de longe, o sítio metastático mais frequente do câncer colorretal, funcionando como o primeiro \"filtro\" capilar para células tumorais disseminadas por via hematogênica. Correta. A drenagem portal do território colorretal, com passagem obrigatória pelo fígado antes da circulação sistêmica, explica a alta frequência de metástases hepáticas nessa neoplasia."
      },
      {
        "letra": "C",
        "texto": "a disseminação exclusivamente linfática do tumor colorretal para o mediastino, sem qualquer relação com o fígado.",
        "correta": false,
        "justificativa": "Incorreta. Embora disseminação linfática também ocorra no câncer colorretal (para linfonodos regionais), ela não explica especificamente a alta frequência de metástases hepáticas, que está relacionada à drenagem venosa portal."
      },
      {
        "letra": "D",
        "texto": "a contiguidade anatômica direta entre o intestino grosso e o parênquima hepático em todos os pacientes, independentemente de disseminação vascular.",
        "correta": false,
        "justificativa": "Incorreta. Não há contiguidade anatômica direta entre o intestino grosso e o fígado em todos os pacientes; a disseminação para o fígado ocorre por via vascular (sistema porta), e não por contiguidade direta na maioria dos casos."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q18"
  },
  {
    "enunciado": "Paciente oncológico, após esgotamento das opções de tratamento convencional com intenção curativa, manifesta interesse em buscar terapias alternativas não comprovadas cientificamente, inclusive fora do país. Diante dessa situação, e considerando os princípios éticos da relação médico-paciente, a conduta mais adequada da equipe assistente que já acompanhava o caso é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "abandonar completamente o acompanhamento do paciente, uma vez que ele optou por buscar terapia alternativa não reconhecida cientificamente.",
        "correta": false,
        "justificativa": "Incorreta. Abandonar o acompanhamento do paciente fere princípios éticos fundamentais da relação médico-paciente e o priva de suporte assistencial essencial, mesmo diante de decisões que a equipe não recomenda."
      },
      {
        "letra": "B",
        "texto": "manter o vínculo de cuidado com o paciente, esclarecer com honestidade os riscos e as limitações científicas da terapia alternativa, respeitando sua autonomia de decisão, e oferecer suporte contínuo, incluindo cuidados paliativos quando indicado.",
        "correta": true,
        "justificativa": "Respeitar a autonomia do paciente não significa concordar acriticamente com decisões sem base científica; a equipe deve manter o vínculo assistencial, esclarecer com honestidade os riscos e as limitações da terapia alternativa buscada, e garantir acesso a suporte contínuo e cuidados paliativos quando apropriado, preservando a relação de confiança e o cuidado integral ao paciente, independentemente de sua escolha pessoal. Correta. Essa conduta concilia respeito à autonomia do paciente com responsabilidade ética de esclarecimento e manutenção do cuidado assistencial contínuo."
      },
      {
        "letra": "C",
        "texto": "buscar interromper judicialmente a decisão do paciente de procurar terapias alternativas, independentemente de sua capacidade decisória.",
        "correta": false,
        "justificativa": "Incorreta. Buscar interrupção judicial da decisão de um paciente com capacidade decisória preservada representa violação grave de sua autonomia, sendo eticamente inadequado nesse contexto."
      },
      {
        "letra": "D",
        "texto": "concordar ativamente com a eficácia da terapia alternativa perante o paciente e a família, mesmo sem qualquer evidência científica que a sustente.",
        "correta": false,
        "justificativa": "Incorreta. Concordar ativamente com uma terapia sem evidência científica, apenas para agradar o paciente, constitui falha ética de comunicação, podendo reforçar falsas expectativas prejudiciais ao próprio paciente."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q19"
  },
  {
    "enunciado": "Uma secretaria municipal de saúde planeja uma campanha de prevenção primária do câncer colorretal voltada à população adulta do município, com recursos limitados e necessidade de priorizar mensagens com maior evidência de impacto sobre a redução do risco da doença. Entre as medidas a serem priorizadas na campanha, com base em evidências científicas de redução de risco, estão",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc01_proliferacao_celular",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "incentivo ao maior consumo de carnes processadas, por seu suposto valor nutricional protetor.",
        "correta": false,
        "justificativa": "Incorreta. O consumo elevado de carnes processadas está associado a maior risco de câncer colorretal, e não a efeito protetor, conforme evidências epidemiológicas consolidadas."
      },
      {
        "letra": "B",
        "texto": "promoção de atividade física regular, dieta rica em fibras, controle do peso corporal e redução do consumo de álcool e tabaco.",
        "correta": true,
        "justificativa": "Atividade física regular, dieta rica em fibras, controle do peso corporal e redução do consumo de álcool e tabaco são medidas de prevenção primária com evidência científica consistente de redução do risco de câncer colorretal, sendo recomendações centrais em campanhas de saúde pública voltadas à prevenção dessa neoplasia. Correta. Essas são exatamente as medidas de prevenção primária com evidência científica de redução do risco de câncer colorretal, recomendadas em campanhas de saúde pública."
      },
      {
        "letra": "C",
        "texto": "uso rotineiro e indiscriminado de suplementos vitamínicos em altas doses, independentemente de indicação clínica individualizada.",
        "correta": false,
        "justificativa": "Incorreta. O uso indiscriminado de suplementos vitamínicos em altas doses, sem indicação clínica individualizada, não tem evidência robusta de benefício e pode, em alguns casos, associar-se a riscos à saúde."
      },
      {
        "letra": "D",
        "texto": "incentivo ao sedentarismo associado a dieta hipercalórica, por suposta neutralidade em relação ao risco de câncer colorretal.",
        "correta": false,
        "justificativa": "Incorreta. Sedentarismo e dieta hipercalórica são fatores associados a maior risco de câncer colorretal, e não medidas neutras ou protetoras, sendo o oposto do que deveria ser promovido em uma campanha de prevenção."
      }
    ],
    "_proveniencia": "whatsapp:UC1_SP4_ENAMED — Q20"
  },
  {
    "enunciado": "Solange, 58 anos, foi diagnosticada com câncer de mama após identificação de nódulo palpável durante exame clínico, com posterior confirmação por biópsia. O laudo histopatológico descreveu o tipo tumoral mais comumente encontrado nos diagnósticos de câncer de mama. Esse tipo histológico mais frequente é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "carcinoma lobular in situ, lesão não invasiva de menor prevalência relativa.",
        "correta": false,
        "justificativa": "Incorreta. O carcinoma lobular in situ é lesão de risco, mas de menor prevalência relativa em comparação ao carcinoma ductal invasivo, sendo também não invasivo por definição."
      },
      {
        "letra": "B",
        "texto": "carcinoma ductal invasivo.",
        "correta": true,
        "justificativa": "O carcinoma ductal invasivo é o tipo histológico mais frequente de câncer de mama, originado nos ductos mamários com capacidade de invasão do estroma adjacente, correspondendo à maioria dos diagnósticos histopatológicos dessa neoplasia. Correta. O carcinoma ductal invasivo é o tipo histológico mais comum entre os casos de câncer de mama."
      },
      {
        "letra": "C",
        "texto": "sarcoma filoide maligno, tumor raro de origem mista.",
        "correta": false,
        "justificativa": "Incorreta. Sarcoma filoide maligno é tumor raro de origem mista (epitelial e estromal), representando pequena fração dos casos de neoplasia mamária."
      },
      {
        "letra": "D",
        "texto": "linfoma primário de mama, entidade rara em comparação ao tipo mais comum.",
        "correta": false,
        "justificativa": "Incorreta. Linfoma primário de mama é entidade rara, não correspondendo ao tipo histológico mais frequente dessa neoplasia."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q1"
  },
  {
    "enunciado": "Uma equipe de saúde da família planeja ações de rastreamento mamográfico em sua área de abrangência, buscando seguir as diretrizes vigentes do Ministério da Saúde. Segundo essas diretrizes, a mamografia de rastreamento, em mulheres assintomáticas, deve ser oferecida, a cada dois anos, para a faixa etária de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "20 a 30 anos, faixa etária não recomendada para rastreamento mamográfico rotineiro.",
        "correta": false,
        "justificativa": "Incorreta. Rastrear mulheres de 20 a 30 anos geraria alta taxa de resultados falso-positivos e baixo rendimento diagnóstico, não sendo a recomendação vigente."
      },
      {
        "letra": "B",
        "texto": "35 a 40 anos, faixa etária ainda não incluída na recomendação de rastreamento populacional rotineiro.",
        "correta": false,
        "justificativa": "Incorreta. A faixa de 35 a 40 anos ainda não corresponde à recomendação de rastreamento populacional rotineiro brasileiro, que se inicia aos 50 anos."
      },
      {
        "letra": "C",
        "texto": "50 a 69 anos.",
        "correta": true,
        "justificativa": "O Ministério da Saúde recomenda mamografia de rastreamento bienal para mulheres de 50 a 69 anos, faixa etária com melhor relação custo-benefício documentada para redução de mortalidade por câncer de mama, segundo diretrizes brasileiras. Correta. A faixa etária de 50 a 69 anos, com periodicidade bienal, é a recomendação vigente do Ministério da Saúde para rastreamento mamográfico populacional."
      },
      {
        "letra": "D",
        "texto": "acima de 80 anos, exclusivamente, sem cobertura em faixas etárias anteriores.",
        "correta": false,
        "justificativa": "Incorreta. Restringir o rastreamento apenas a mulheres acima de 80 anos ignoraria a faixa etária de maior benefício documentado (50-69 anos), retardando diagnósticos possíveis em fase mais precoce."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q2"
  },
  {
    "enunciado": "Durante exame físico de uma paciente com câncer de mama localmente avançado, a médica observa alteração cutânea característica, decorrente de obstrução dos linfáticos dérmicos por células neoplásicas, conferindo à pele da mama aspecto irregular e edemaciado, popularmente descrito como semelhante à casca de uma fruta cítrica. Esse sinal clínico é conhecido como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "pele com aspecto de casca de laranja (peau d'orange).",
        "correta": true,
        "justificativa": "O aspecto de \"casca de laranja\" (peau d'orange) decorre de edema cutâneo por obstrução dos linfáticos dérmicos por células neoplásicas, sinal clínico de doença localmente avançada, frequentemente associado ao carcinoma inflamatório de mama ou a estágios mais avançados da doença. Correta. Peau d'orange é exatamente o sinal descrito, decorrente de obstrução linfática dérmica por infiltração neoplásica."
      },
      {
        "letra": "B",
        "texto": "eritema difuso associado a febre alta isolada, sem relação com obstrução linfática.",
        "correta": false,
        "justificativa": "Incorreta. Eritema difuso com febre alta sugeriria processo infeccioso agudo (como mastite), e não o mecanismo de obstrução linfática crônica descrito."
      },
      {
        "letra": "C",
        "texto": "aumento simétrico bilateral e indolor das mamas, sem relação com obstrução linfática.",
        "correta": false,
        "justificativa": "Incorreta. Aumento simétrico bilateral e indolor não é o padrão descrito, que é tipicamente unilateral e associado a alteração cutânea característica, e não apenas aumento de volume."
      },
      {
        "letra": "D",
        "texto": "secreção láctea espontânea bilateral, sem relação com o mecanismo descrito.",
        "correta": false,
        "justificativa": "Incorreta. Secreção láctea espontânea bilateral (galactorreia) tem relação com hiperprolactinemia, sem qualquer relação com o mecanismo de obstrução linfática dérmica descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q3"
  },
  {
    "enunciado": "Ao revisar fatores de risco para câncer de mama com uma paciente de 55 anos que busca orientação sobre rastreamento, a médica destaca que a própria idade da paciente já representa, isoladamente, um fator de risco relevante para essa neoplasia. Essa afirmação se sustenta porque",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a menarca tardia e a menopausa precoce são os principais determinantes do risco de câncer de mama, independentemente da idade atual da paciente.",
        "correta": false,
        "justificativa": "Incorreta. Menarca tardia e menopausa precoce estão associadas a menor exposição estrogênica ao longo da vida e, portanto, a menor risco, e não a maior risco de câncer de mama."
      },
      {
        "letra": "B",
        "texto": "a idade avançada, sobretudo após os 50 anos, é um dos fatores de risco mais importantes para câncer de mama, com a maioria dos casos ocorrendo nessa faixa etária.",
        "correta": true,
        "justificativa": "A idade é um dos fatores de risco mais importantes para câncer de mama, com cerca de 4 em cada 5 casos ocorrendo após os 50 anos, justificando as estratégias de rastreamento mamográfico concentradas nessa faixa etária. Correta. A idade avançada é fator de risco central e bem documentado para câncer de mama, com concentração expressiva de casos após os 50 anos."
      },
      {
        "letra": "C",
        "texto": "a amamentação prolongada aumenta expressivamente o risco de câncer de mama após os 50 anos.",
        "correta": false,
        "justificativa": "Incorreta. A amamentação é reconhecidamente fator protetor, associado à redução do risco de câncer de mama, e não ao aumento."
      },
      {
        "letra": "D",
        "texto": "a multiparidade precoce é o principal fator de risco isolado para câncer de mama em mulheres de meia-idade.",
        "correta": false,
        "justificativa": "Incorreta. A multiparidade precoce está associada a menor risco de câncer de mama, e não a maior risco, sendo o oposto do descrito na opção."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q4"
  },
  {
    "enunciado": "Uma paciente com nódulo mamário palpável e mamografia sugestiva de malignidade questiona se o resultado dos exames de imagem já é suficiente para confirmar o diagnóstico de câncer de mama ou se ainda será necessário algum procedimento adicional. A resposta tecnicamente correta é que a confirmação diagnóstica definitiva de câncer de mama depende, em última instância, de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exame clínico das mamas isoladamente, sem necessidade de exames complementares.",
        "correta": false,
        "justificativa": "Incorreta. O exame clínico das mamas, isoladamente, não permite diagnóstico histopatológico definitivo, sendo apenas etapa inicial da avaliação."
      },
      {
        "letra": "B",
        "texto": "mamografia isolada, considerada suficiente para diagnóstico definitivo em todos os casos.",
        "correta": false,
        "justificativa": "Incorreta. A mamografia é exame de imagem que sugere a probabilidade de malignidade (classificação BI-RADS), mas não substitui a confirmação histopatológica por biópsia."
      },
      {
        "letra": "C",
        "texto": "biópsia (core biopsy ou biópsia cirúrgica) com análise histopatológica.",
        "correta": true,
        "justificativa": "O diagnóstico definitivo de câncer de mama exige confirmação histopatológica por biópsia (core biopsy ou biópsia cirúrgica), sendo os exames de imagem (mamografia, ultrassonografia) ferramentas fundamentais de rastreamento e caracterização de lesões suspeitas, mas não substitutos da análise tecidual para confirmação diagnóstica. Correta. A biópsia com análise histopatológica é o método definitivo de confirmação diagnóstica do câncer de mama."
      },
      {
        "letra": "D",
        "texto": "apenas ultrassonografia mamária, sem necessidade de confirmação tecidual.",
        "correta": false,
        "justificativa": "Incorreta. A ultrassonografia mamária, assim como a mamografia, é ferramenta de imagem complementar, mas não substitui a biópsia para confirmação diagnóstica definitiva."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q5"
  },
  {
    "enunciado": "Mulher de 58 anos apresenta nódulo mamário identificado à palpação durante consulta de rotina. A mamografia solicitada evidencia lesão classificada como BI-RADS IVc, categoria associada a moderada a alta suspeita de malignidade. Diante desse resultado, a conduta mais adequada a ser adotada pela equipe assistencial é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "repetir a mamografia em 12 meses, por se tratar de achado de baixa suspeita.",
        "correta": false,
        "justificativa": "Incorreta. BI-RADS IV representa suspeita relevante de malignidade, não sendo apropriado apenas repetir o exame em 12 meses, o que atrasaria desnecessariamente o diagnóstico."
      },
      {
        "letra": "B",
        "texto": "encaminhar a paciente para biópsia (core biopsy) da lesão identificada.",
        "correta": true,
        "justificativa": "A classificação BI-RADS IV indica suspeita de malignidade (subdividida em IVa, IVb e IVc, com probabilidade crescente de malignidade), sendo indicada biópsia (core biopsy) para confirmação histológica da lesão antes de qualquer decisão terapêutica definitiva. Correta. A biópsia (core biopsy) é a conduta indicada diante de lesão classificada como BI-RADS IV, para confirmação histológica antes de qualquer decisão terapêutica."
      },
      {
        "letra": "C",
        "texto": "tranquilizar a paciente, informando que toda classificação BI-RADS IV corresponde necessariamente a achado benigno.",
        "correta": false,
        "justificativa": "Incorreta. BI-RADS IV representa suspeita moderada a alta de malignidade (não achado necessariamente benigno), sendo incorreta essa tranquilização sem investigação adicional."
      },
      {
        "letra": "D",
        "texto": "indicar mastectomia bilateral imediata, sem qualquer confirmação histopatológica prévia.",
        "correta": false,
        "justificativa": "Incorreta. A mastectomia sem confirmação histopatológica prévia é conduta inadequada e desproporcional, já que a lesão ainda não foi comprovadamente maligna nesse estágio da investigação."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q6"
  },
  {
    "enunciado": "Após confirmação histopatológica de carcinoma ductal invasivo, a equipe de oncologia realiza exames complementares para definir o estadiamento clínico da doença, considerando o tamanho tumoral, o acometimento linfonodal e a presença ou ausência de metástases à distância. O sistema utilizado para essa classificação é o sistema",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Bethesda, sistema utilizado para classificação citológica cervical, sem relação com estadiamento de câncer de mama.",
        "correta": false,
        "justificativa": "Incorreta. Bethesda é sistema de nomenclatura citológica utilizado para o colo do útero, sem relação com estadiamento do câncer de mama."
      },
      {
        "letra": "B",
        "texto": "TNM.",
        "correta": true,
        "justificativa": "O sistema TNM (Tumor, Nódulo linfático, Metástase) é utilizado para classificação clínica e estadiamento do câncer de mama, orientando prognóstico e definição da estratégia terapêutica mais adequada para cada estágio da doença. Correta. O sistema TNM é o utilizado para estadiamento clínico do câncer de mama, considerando tamanho tumoral, linfonodos e metástases."
      },
      {
        "letra": "C",
        "texto": "Child-Pugh, sistema utilizado para avaliação de gravidade de hepatopatia crônica.",
        "correta": false,
        "justificativa": "Incorreta. Child-Pugh avalia gravidade de disfunção hepática em cirrose, sem relação com estadiamento oncológico mamário."
      },
      {
        "letra": "D",
        "texto": "Gleason, sistema utilizado para graduação histológica do câncer de próstata.",
        "correta": false,
        "justificativa": "Incorreta. Gleason é sistema de graduação histológica específico do câncer de próstata, sem relação com o estadiamento do câncer de mama."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q7"
  },
  {
    "enunciado": "O laudo de anatomopatológico de uma paciente com câncer de mama inclui a avaliação da expressão de receptores de estrogênio e progesterona no tecido tumoral, informação que a equipe considera essencial para a definição da estratégia terapêutica adjuvante. Essa avaliação é importante porque",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não tem qualquer relação com o tratamento ou prognóstico da paciente, sendo apenas dado epidemiológico complementar.",
        "correta": false,
        "justificativa": "Incorreta. A avaliação de receptores hormonais tem impacto terapêutico direto (indicação de hormonioterapia) e prognóstico relevante, não sendo apenas dado epidemiológico."
      },
      {
        "letra": "B",
        "texto": "orienta a indicação de terapia hormonal adjuvante e está associada, quando positiva, a prognóstico geralmente mais favorável.",
        "correta": true,
        "justificativa": "A positividade de receptores hormonais (estrogênio/progesterona) orienta a indicação de terapia hormonal adjuvante (como tamoxifeno ou inibidores de aromatase), sendo geralmente associada a comportamento biológico menos agressivo e prognóstico mais favorável em comparação a tumores com receptores negativos. Correta. A positividade de receptores hormonais orienta diretamente a indicação de terapia hormonal adjuvante e está associada a prognóstico geralmente mais favorável."
      },
      {
        "letra": "C",
        "texto": "determina exclusivamente a necessidade de radioterapia, sem qualquer relação com terapia sistêmica.",
        "correta": false,
        "justificativa": "Incorreta. A avaliação de receptores hormonais está relacionada principalmente à indicação de terapia hormonal sistêmica, e não especificamente à indicação de radioterapia, que depende de outros critérios (tamanho tumoral, margens, acometimento linfonodal)."
      },
      {
        "letra": "D",
        "texto": "é utilizada apenas para fins de pesquisa epidemiológica, sem qualquer impacto na conduta terapêutica individual.",
        "correta": false,
        "justificativa": "Incorreta. A avaliação de receptores hormonais tem impacto direto e individual na conduta terapêutica de cada paciente, sendo rotineiramente utilizada na prática clínica, e não apenas em contexto de pesquisa."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q8"
  },
  {
    "enunciado": "Solange relembra, durante conversa com a amiga Fátima, que sua irmã mais nova também foi acometida por câncer de mama bilateral e invasivo, com evolução desfavorável e óbito precoce. Diante desse histórico familiar relevante, discute-se a possível associação com mutações genéticas hereditárias. Em relação aos genes BRCA1 e BRCA2, é correto afirmar que mutações nesses genes estão associadas a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "risco reduzido de câncer de mama e ovário, funcionando como fator protetor quando presentes.",
        "correta": false,
        "justificativa": "Incorreta. Mutações em BRCA1/2 aumentam, e não reduzem, o risco de câncer de mama e ovário, sendo o oposto de um fator protetor."
      },
      {
        "letra": "B",
        "texto": "risco significativamente aumentado de câncer de mama e de ovário ao longo da vida, justificando aconselhamento genético em casos de histórico familiar sugestivo.",
        "correta": true,
        "justificativa": "Mutações germinativas em BRCA1 e BRCA2 aumentam substancialmente o risco de câncer de mama e de ovário ao longo da vida, justificando estratégias de rastreamento intensificado e, em casos selecionados, aconselhamento genético e discussão sobre cirurgias profiláticas em famílias com histórico sugestivo, como o descrito no caso de Solange. Correta. Essa é a associação corretamente estabelecida na literatura: risco significativamente aumentado de câncer de mama e ovário, com implicações para aconselhamento genético familiar."
      },
      {
        "letra": "C",
        "texto": "nenhuma associação relevante com câncer de ovário, sendo o risco restrito exclusivamente à mama.",
        "correta": false,
        "justificativa": "Incorreta. Mutações em BRCA1/2 estão fortemente associadas também ao câncer de ovário, e não restritas exclusivamente à mama."
      },
      {
        "letra": "D",
        "texto": "proteção específica contra o desenvolvimento de câncer de mama triplo-negativo.",
        "correta": false,
        "justificativa": "Incorreta. Mutações em BRCA1 estão, na verdade, associadas a maior frequência de câncer de mama triplo-negativo, e não a proteção contra esse subtipo tumoral."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q9"
  },
  {
    "enunciado": "Paciente em tratamento quimioterápico e submetida a esvaziamento axilar por câncer de mama apresenta, meses após a cirurgia, dificuldade progressiva de movimentação do braço homolateral, associada a edema importante do membro. Diante desse quadro, a hipótese diagnóstica mais provável é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "trombose venosa profunda espontânea, sem qualquer relação com a cirurgia realizada.",
        "correta": false,
        "justificativa": "Incorreta. Embora TVP possa ocorrer em pacientes oncológicos, o quadro descrito (edema progressivo associado à dificuldade de movimentação após esvaziamento axilar) é mais característico de linfedema do que de trombose venosa profunda espontânea."
      },
      {
        "letra": "B",
        "texto": "linfedema secundário ao esvaziamento axilar e ao comprometimento da drenagem linfática regional.",
        "correta": true,
        "justificativa": "O linfedema de membro superior é complicação comum após esvaziamento axilar (e também após radioterapia axilar), decorrente do comprometimento da drenagem linfática regional, exigindo abordagem fisioterapêutica especializada (drenagem linfática manual, exercícios específicos, compressão) para manejo adequado. Correta. O linfedema secundário ao esvaziamento axilar é a complicação mais consistente com o quadro clínico descrito, sendo complicação bem reconhecida do tratamento cirúrgico do câncer de mama."
      },
      {
        "letra": "C",
        "texto": "fratura patológica de úmero, sem relação com o quadro de edema progressivo descrito.",
        "correta": false,
        "justificativa": "Incorreta. Não há dados no enunciado sugestivos de fratura (como dor óssea aguda ou trauma), sendo essa hipótese incompatível com o quadro de edema progressivo descrito."
      },
      {
        "letra": "D",
        "texto": "neuropatia periférica associada a diabetes preexistente, sem qualquer relação com o tratamento oncológico realizado.",
        "correta": false,
        "justificativa": "Incorreta. O quadro descrito está temporalmente relacionado ao tratamento oncológico (esvaziamento axilar), sendo mais consistente com linfedema secundário do que com neuropatia diabética preexistente."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q10"
  },
  {
    "enunciado": "Em uma campanha de prevenção primária do câncer de mama voltada à comunidade, a equipe de saúde da família busca orientar sobre hábitos de vida associados à redução do risco dessa neoplasia, com base em evidências científicas consolidadas. Entre as orientações a serem priorizadas na campanha estão",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "consumo regular de bebidas alcoólicas, apontado como medida de proteção contra câncer de mama.",
        "correta": false,
        "justificativa": "Incorreta. O consumo de álcool está associado a aumento, e não a redução, do risco de câncer de mama, sendo o oposto do que deveria ser recomendado."
      },
      {
        "letra": "B",
        "texto": "prática de atividade física regular, manutenção de peso corporal adequado e incentivo à amamentação.",
        "correta": true,
        "justificativa": "Atividade física regular, manutenção de peso corporal adequado e amamentação são fatores associados à redução do risco de câncer de mama, enquanto obesidade, sedentarismo e consumo excessivo de álcool estão associados a maior risco, sendo, portanto, orientações centrais em campanhas de prevenção primária. Correta. Essas são exatamente as medidas de prevenção primária com evidência de redução do risco de câncer de mama."
      },
      {
        "letra": "C",
        "texto": "uso prolongado e rotineiro de terapia hormonal, independentemente de indicação clínica individualizada.",
        "correta": false,
        "justificativa": "Incorreta. O uso prolongado de terapia hormonal, sem indicação clínica individualizada, está associado a aumento do risco de câncer de mama, e não à sua prevenção."
      },
      {
        "letra": "D",
        "texto": "incentivo ao sedentarismo, por suposta neutralidade em relação ao risco de câncer de mama.",
        "correta": false,
        "justificativa": "Incorreta. O sedentarismo está associado a maior risco de câncer de mama, sendo o oposto de uma medida neutra ou protetora."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q11"
  },
  {
    "enunciado": "Mulher de 58 anos, com diagnóstico de carcinoma ductal invasivo, receptores hormonais (estrogênio e progesterona) positivos e HER2 negativo, encontra-se na pós-menopausa e é considerada elegível para terapia hormonal adjuvante com inibidor de aromatase, em vez de tamoxifeno. Ao explicar o mecanismo de ação dessa classe de fármacos, o oncologista destaca que os inibidores de aromatase atuam",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "bloqueando diretamente o receptor de estrogênio na membrana da célula tumoral, de forma competitiva.",
        "correta": false,
        "justificativa": "Incorreta. O bloqueio competitivo direto do receptor de estrogênio é o mecanismo de ação do tamoxifeno (modulador seletivo do receptor de estrogênio), e não dos inibidores de aromatase."
      },
      {
        "letra": "B",
        "texto": "inibindo a enzima aromatase, reduzindo a conversão periférica de andrógenos em estrogênio, mecanismo especialmente relevante em mulheres na pós-menopausa, quando a produção ovariana de estrogênio já cessou.",
        "correta": true,
        "justificativa": "Os inibidores de aromatase bloqueiam a enzima responsável pela conversão periférica (em tecido adiposo, muscular e outros) de andrógenos em estrogênio, reduzindo os níveis circulantes do hormônio — mecanismo especialmente relevante em mulheres na pós-menopausa, quando a produção estrogênica ovariana direta já cessou e a conversão periférica passa a ser a principal fonte de estrogênio circulante. Correta. Esse é exatamente o mecanismo de ação dos inibidores de aromatase, especialmente relevante e eficaz em mulheres na pós-menopausa."
      },
      {
        "letra": "C",
        "texto": "estimulando a produção ovariana residual de estrogênio, para posterior bloqueio por outro fármaco associado.",
        "correta": false,
        "justificativa": "Incorreta. Os inibidores de aromatase reduzem, e não estimulam, a produção de estrogênio, ao bloquear a enzima responsável pela conversão periférica de andrógenos."
      },
      {
        "letra": "D",
        "texto": "inibindo exclusivamente a síntese hepática de progesterona, sem qualquer efeito sobre os níveis de estrogênio circulante.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo de ação dos inibidores de aromatase está relacionado à redução da síntese de estrogênio (e não de progesterona), por meio do bloqueio enzimático da aromatase."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q12"
  },
  {
    "enunciado": "Paciente com câncer de mama tem seu laudo imuno-histoquímico revelando superexpressão da proteína HER2, achado que direciona a discussão da equipe de oncologia tanto sobre o comportamento biológico esperado do tumor quanto sobre as opções terapêuticas específicas disponíveis para esse subtipo. Sobre o carcinoma de mama HER2-positivo, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "apresenta, em geral, comportamento biológico menos agressivo que os tumores HER2-negativos, com excelente prognóstico independentemente do tratamento.",
        "correta": false,
        "justificativa": "Incorreta. Tumores HER2-positivos são reconhecidamente mais agressivos biologicamente do que muitos tumores HER2-negativos, quando não tratados com terapia-alvo específica."
      },
      {
        "letra": "B",
        "texto": "a superexpressão da proteína HER2 está associada a maior agressividade tumoral intrínseca, mas também permite o uso de terapia-alvo específica com anticorpos monoclonais anti-HER2, que modificou favoravelmente o prognóstico desse subtipo.",
        "correta": true,
        "justificativa": "A superexpressão de HER2 está associada a tumores biologicamente mais agressivos (maior taxa de proliferação e potencial invasivo), mas também é alvo de terapias específicas (como trastuzumabe e outros anticorpos monoclonais anti-HER2), que modificaram radicalmente e favoravelmente o prognóstico desse subtipo tumoral nas últimas décadas. Correta. Essa é a caracterização correta: maior agressividade biológica intrínseca, mas com terapia-alvo específica disponível que modificou favoravelmente o prognóstico."
      },
      {
        "letra": "C",
        "texto": "não há qualquer terapia-alvo disponível atualmente para esse subtipo tumoral específico.",
        "correta": false,
        "justificativa": "Incorreta. Existem terapias-alvo específicas bem estabelecidas para tumores HER2-positivos, como o trastuzumabe, sendo um dos exemplos mais bem-sucedidos de terapia-alvo em oncologia."
      },
      {
        "letra": "D",
        "texto": "HER2 é um marcador exclusivamente prognóstico, sem qualquer implicação terapêutica na prática clínica atual.",
        "correta": false,
        "justificativa": "Incorreta. HER2 tem implicação terapêutica direta e fundamental, orientando a indicação de terapia-alvo anti-HER2, além de seu valor prognóstico."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q13"
  },
  {
    "enunciado": "Solange relata à amiga Fátima o forte impacto emocional vivido após o diagnóstico de câncer de mama: medo constante da morte, alterações significativas da autoimagem corporal decorrentes da perda de cabelo e do tratamento, e o abandono do marido durante o processo. Diante desse relato, do ponto de vista do cuidado integral em oncologia, a conduta mais adequada da equipe de saúde que acompanha Solange é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "concentrar-se exclusivamente no tratamento oncológico biológico, considerando que o suporte psicossocial não é atribuição da equipe de saúde.",
        "correta": false,
        "justificativa": "Incorreta. O suporte psicossocial é parte reconhecida e essencial do cuidado integral em oncologia, não devendo ser negligenciado em favor exclusivo do tratamento biológico."
      },
      {
        "letra": "B",
        "texto": "integrar suporte psicológico especializado, orientação social (incluindo informações sobre benefícios previdenciários) e fortalecimento da rede de apoio ao cuidado clínico oncológico, sem julgamento sobre as circunstâncias pessoais da paciente.",
        "correta": true,
        "justificativa": "O cuidado integral ao paciente oncológico exige abordagem biopsicossocial, incluindo suporte psicológico especializado, orientação social (incluindo aspectos previdenciários, já mencionados no caso de Solange, que recebe auxílio-doença) e fortalecimento da rede de apoio, reconhecendo o impacto emocional e social profundo do diagnóstico e do tratamento oncológico sobre a vida da paciente. Correta. Essa é a abordagem que reflete o cuidado integral e biopsicossocial recomendado para pacientes oncológicos em situação de vulnerabilidade emocional e social, como Solange."
      },
      {
        "letra": "C",
        "texto": "orientar a paciente a evitar contato com outras pessoas durante todo o período de tratamento, para preservar sua energia física.",
        "correta": false,
        "justificativa": "Incorreta. O isolamento social não é conduta recomendada; ao contrário, o fortalecimento da rede de apoio social (como demonstrado pela própria Fátima no caso) é fator protetor importante durante o tratamento."
      },
      {
        "letra": "D",
        "texto": "minimizar as queixas emocionais da paciente, por serem consideradas secundárias em relação ao tratamento físico da doença.",
        "correta": false,
        "justificativa": "Incorreta. Minimizar queixas emocionais contraria os princípios do cuidado centrado na pessoa e pode agravar o sofrimento psicológico da paciente durante um momento de grande vulnerabilidade."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q14"
  },
  {
    "enunciado": "Durante aula sobre estratégias de controle do câncer de mama, o professor diferencia os conceitos de prevenção primária e secundária, exemplificando com medidas concretas utilizadas na prática de saúde pública. Em relação a essa distinção conceitual, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "prevenção primária refere-se a medidas que reduzem o risco de desenvolvimento da doença (como controle de peso e atividade física), enquanto prevenção secundária refere-se à detecção precoce da doença já instalada, ainda em fase assintomática (como a mamografia de rastreamento).",
        "correta": true,
        "justificativa": "Prevenção primária busca reduzir a incidência da doença por meio do controle de fatores de risco modificáveis (hábitos de vida saudáveis, controle de peso, atividade física, redução do consumo de álcool), enquanto prevenção secundária visa à detecção precoce de doença já instalada, mas ainda assintomática, como no rastreamento mamográfico, que identifica lesões antes do surgimento de sintomas clínicos. Correta. Essa distinção conceitual está corretamente descrita, exemplificando prevenção primária (controle de fatores de risco) e secundária (detecção precoce por rastreamento)."
      },
      {
        "letra": "B",
        "texto": "não existe distinção conceitual relevante entre prevenção primária e secundária no contexto da oncologia mamária.",
        "correta": false,
        "justificativa": "Incorreta. Há distinção conceitual clara e clinicamente relevante entre prevenção primária e secundária, com implicações diferentes para as estratégias de saúde pública adotadas."
      },
      {
        "letra": "C",
        "texto": "a mamografia de rastreamento é exemplo clássico de prevenção primária, e não de prevenção secundária.",
        "correta": false,
        "justificativa": "Incorreta. A mamografia de rastreamento é exemplo clássico de prevenção secundária (detecção precoce de doença já instalada), e não de prevenção primária."
      },
      {
        "letra": "D",
        "texto": "a redução do consumo de álcool é exemplo de prevenção secundária, e não de prevenção primária.",
        "correta": false,
        "justificativa": "Incorreta. A redução do consumo de álcool é medida de prevenção primária (reduz o risco de desenvolvimento da doença), e não de prevenção secundária."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q15"
  },
  {
    "enunciado": "Uma mulher de 35 anos, com mutação confirmada em BRCA1, procura aconselhamento sobre estratégias de rastreamento e prevenção do câncer de mama, dada sua condição de alto risco genético. Considerando a classificação de risco para câncer de mama (risco pouco elevado, medianamente elevado e muito elevado), essa paciente é classificada em qual categoria, e qual conduta é preconizada?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Risco pouco elevado; seguimento idêntico ao da população geral, sem qualquer intensificação do rastreamento.",
        "correta": false,
        "justificativa": "Incorreta. Portadoras de mutação BRCA1 confirmada são classificadas em risco muito elevado, e não pouco elevado, exigindo seguimento intensificado, e não igual ao da população geral."
      },
      {
        "letra": "B",
        "texto": "Risco muito elevado; rastreamento intensificado (incluindo ressonância magnética mamária associada à mamografia) e discussão individualizada sobre estratégias redutoras de risco, incluindo cirurgia profilática em casos selecionados.",
        "correta": true,
        "justificativa": "Mulheres portadoras de mutação confirmada em BRCA1/2 são classificadas na categoria de risco muito elevado para câncer de mama, justificando rastreamento intensificado (incluindo ressonância magnética mamária anual, além de mamografia) desde idade mais precoce, e discussão individualizada sobre estratégias redutoras de risco, incluindo cirurgia profilática (mastectomia e/ou salpingo-ooforectomia) em casos selecionados, conforme desejo e perfil de risco da paciente. Correta. Essa é a classificação e conduta corretas para mulheres com mutação BRCA1/2 confirmada: risco muito elevado, com rastreamento intensificado e discussão sobre redução de risco."
      },
      {
        "letra": "C",
        "texto": "Risco medianamente elevado; dispensa completa de qualquer rastreamento adicional além do exame clínico anual.",
        "correta": false,
        "justificativa": "Incorreta. A classificação correta para mutação BRCA1 confirmada é risco muito elevado (e não medianamente elevado), exigindo rastreamento adicional além do exame clínico anual isolado."
      },
      {
        "letra": "D",
        "texto": "Risco muito elevado; contraindicação absoluta a qualquer método de rastreamento por imagem, pelo risco de radiação adicional.",
        "correta": false,
        "justificativa": "Incorreta. Não há contraindicação absoluta a métodos de rastreamento por imagem nesse contexto; ao contrário, a ressonância magnética mamária é justamente recomendada como método adicional de rastreamento intensificado nessas pacientes."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q16"
  },
  {
    "enunciado": "Paciente com carcinoma de mama metastático para ossos apresenta dor óssea intensa, sobretudo em coluna vertebral e bacia, com risco aumentado de fratura patológica identificado em exames de imagem. A equipe de oncologia discute, entre as medidas terapêuticas voltadas à saúde óssea nesse contexto específico, o uso de uma classe farmacológica que reduz a atividade osteoclástica. Essa classe farmacológica é a dos",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "bifosfonatos, que reduzem a reabsorção óssea mediada por osteoclastos e o risco de eventos esqueléticos relacionados.",
        "correta": true,
        "justificativa": "Os bifosfonatos (e outros agentes moduladores do metabolismo ósseo, como o denosumabe) reduzem a reabsorção óssea mediada por osteoclastos, diminuindo o risco de eventos esqueléticos relacionados (fraturas patológicas, compressão medular, necessidade de radioterapia óssea) em pacientes com metástases ósseas de câncer de mama. Correta. Bifosfonatos são exatamente a classe farmacológica utilizada para reduzir a reabsorção óssea osteoclástica e o risco de eventos esqueléticos em metástases ósseas."
      },
      {
        "letra": "B",
        "texto": "anticoagulantes orais diretos, com ação farmacológica específica sobre o metabolismo ósseo.",
        "correta": false,
        "justificativa": "Incorreta. Anticoagulantes orais diretos atuam na cascata de coagulação, sem qualquer ação específica reconhecida sobre o metabolismo ósseo ou reabsorção osteoclástica."
      },
      {
        "letra": "C",
        "texto": "insulina em altas doses, sem qualquer efeito reconhecido sobre a reabsorção óssea.",
        "correta": false,
        "justificativa": "Incorreta. Insulina não tem papel terapêutico reconhecido na redução da reabsorção óssea em metástases ósseas oncológicas."
      },
      {
        "letra": "D",
        "texto": "broncodilatadores inalatórios, sem qualquer relação com o metabolismo ósseo.",
        "correta": false,
        "justificativa": "Incorreta. Broncodilatadores inalatórios atuam na musculatura lisa das vias aéreas, sem qualquer relação com metabolismo ósseo ou metástases esqueléticas."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q17"
  },
  {
    "enunciado": "Diante do histórico familiar relatado por Solange (irmã com câncer de mama bilateral, invasivo, com metástases ósseas e óbito precoce em idade jovem), uma nova paciente da mesma família, ainda assintomática, procura orientação médica preocupada com seu próprio risco. A conduta mais adequada diante desse histórico familiar significativo é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "considerar aconselhamento genético e possível testagem para mutações hereditárias (como BRCA1/2), dadas as implicações relevantes tanto para essa paciente quanto para outros familiares em risco.",
        "correta": true,
        "justificativa": "Diante de histórico familiar sugestivo de síndrome hereditária de câncer de mama e ovário (câncer de mama bilateral, em idade jovem, com evolução agressiva em parente de primeiro grau), o aconselhamento genético e a testagem para mutações hereditárias são indicados, com implicações relevantes tanto para a paciente que procura orientação quanto para outros familiares que possam compartilhar a mesma predisposição genética. Correta. O histórico familiar descrito é altamente sugestivo de síndrome hereditária, justificando aconselhamento genético e testagem, com implicações para toda a família."
      },
      {
        "letra": "B",
        "texto": "descartar qualquer relevância do histórico familiar relatado, por se tratar de evento considerado raro e não hereditário na maioria dos casos.",
        "correta": false,
        "justificativa": "Incorreta. O padrão familiar descrito (câncer bilateral, idade jovem, evolução agressiva) é justamente sugestivo de componente hereditário, e não de evento considerado raro e isolado sem relevância genética."
      },
      {
        "letra": "C",
        "texto": "solicitar apenas exames de imagem mamária de rotina, sem qualquer investigação genética adicional, independentemente do padrão familiar observado.",
        "correta": false,
        "justificativa": "Incorreta. Diante de histórico familiar tão sugestivo, a investigação genética complementar é recomendada, além dos exames de imagem de rotina, para melhor estratificação de risco da paciente."
      },
      {
        "letra": "D",
        "texto": "orientar que não há necessidade de comunicar o achado genético, caso identificado, a outros familiares da paciente.",
        "correta": false,
        "justificativa": "Incorreta. A comunicação de achados genéticos relevantes a familiares em risco é discutida como parte importante do aconselhamento genético, dadas as implicações preventivas para outros membros da família."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q18"
  },
  {
    "enunciado": "Solange relata à amiga Fátima que, durante o tratamento do câncer de mama, foi abandonada pelo marido, que \"não aguentou a situação\". Diante dessa vulnerabilidade relacional evidenciada no relato, a abordagem médica mais adequada da equipe de saúde que acompanha Solange, considerando o impacto psicossocial da doença sobre as relações familiares e conjugais, é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ignorar completamente os aspectos relacionais do caso, concentrando-se exclusivamente no manejo farmacológico da doença oncológica.",
        "correta": false,
        "justificativa": "Incorreta. Ignorar os aspectos relacionais e psicossociais contraria os princípios do cuidado integral, especialmente relevantes em contextos de vulnerabilidade emocional como o descrito."
      },
      {
        "letra": "B",
        "texto": "reconhecer o impacto psicossocial da doença oncológica sobre as relações familiares e conjugais, oferecendo suporte psicológico e articulando rede de apoio social, sem qualquer julgamento sobre as escolhas ou circunstâncias pessoais da paciente ou de seu ex-companheiro.",
        "correta": true,
        "justificativa": "O cuidado centrado na pessoa reconhece o impacto psicossocial da doença oncológica sobre as relações familiares e conjugais, cabendo à equipe de saúde oferecer suporte psicológico especializado e articular rede de apoio social, sem julgamento sobre as escolhas e circunstâncias pessoais envolvidas, reconhecendo a complexidade emocional vivida tanto pela paciente quanto por seus familiares durante o processo de adoecimento. Correta. Essa conduta reflete o reconhecimento adequado do impacto psicossocial da doença, com oferta de suporte apropriado, sem julgamento das circunstâncias pessoais da paciente."
      },
      {
        "letra": "C",
        "texto": "culpabilizar explicitamente a paciente pela dissolução do relacionamento conjugal, atribuindo o desfecho a suposta fragilidade emocional dela.",
        "correta": false,
        "justificativa": "Incorreta. Culpabilizar a paciente pela dissolução do relacionamento é conduta eticamente inadequada e emocionalmente prejudicial, sem qualquer fundamento clínico."
      },
      {
        "letra": "D",
        "texto": "recomendar que a paciente evite comentar sua condição de saúde com familiares e amigos, para preservar sua privacidade durante o tratamento.",
        "correta": false,
        "justificativa": "Incorreta. Recomendar isolamento da rede de apoio social (familiares e amigos) contraria evidências de que o suporte social é fator protetor importante durante o enfrentamento da doença oncológica, como demonstrado pela própria presença de Fátima no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q19"
  },
  {
    "enunciado": "Uma paciente recém-diagnosticada com câncer de mama, atendida pelo SUS, questiona seus direitos em relação ao tempo de espera entre o diagnóstico e o início do tratamento oncológico, preocupada com possíveis atrasos no sistema público de saúde. Em relação às políticas públicas brasileiras de organização da atenção oncológica mamária, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o SUS não oferece qualquer cobertura para tratamento oncológico mamário, sendo essa cobertura restrita exclusivamente à rede privada de saúde.",
        "correta": false,
        "justificativa": "Incorreta. O SUS oferece cobertura para diagnóstico e tratamento oncológico mamário, incluindo cirurgia, quimioterapia, radioterapia e terapias-alvo disponíveis na rede pública, contrariando a afirmação de ausência de cobertura."
      },
      {
        "letra": "B",
        "texto": "o Ministério da Saúde estrutura ações de rastreamento, diagnóstico e tratamento por meio da rede de atenção oncológica (incluindo Cacons/Unacons), existindo legislação específica que estabelece prazo máximo para início do tratamento oncológico após o diagnóstico.",
        "correta": true,
        "justificativa": "O SUS estrutura a atenção oncológica por meio de unidades habilitadas (Cacons/Unacons), havendo legislação específica (conhecida como \"Lei dos 60 dias\") que estabelece prazo máximo de 60 dias para início do tratamento após o diagnóstico histopatológico de câncer, reforçando o direito da paciente ao cuidado oportuno no sistema público de saúde. Correta. Essa afirmação descreve corretamente a estruturação da rede oncológica do SUS e a existência de legislação específica sobre prazo para início do tratamento."
      },
      {
        "letra": "C",
        "texto": "o rastreamento mamográfico está disponível apenas na rede privada de saúde, sem qualquer oferta pelo sistema público.",
        "correta": false,
        "justificativa": "Incorreta. O rastreamento mamográfico é oferecido pelo SUS na rede pública de saúde, conforme diretrizes do Ministério da Saúde, não sendo restrito à rede privada."
      },
      {
        "letra": "D",
        "texto": "não existe legislação brasileira que estabeleça prazos para início de tratamento oncológico no âmbito do SUS.",
        "correta": false,
        "justificativa": "Incorreta. Existe legislação brasileira específica (Lei nº 12.732/2012, popularmente conhecida como \"Lei dos 60 dias\") que estabelece prazo máximo para início do tratamento oncológico após o diagnóstico no âmbito do SUS."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP1_ENAMED — Q20"
  },
  {
    "enunciado": "Durante consulta ginecológica de rotina, uma adolescente de 13 anos relata ter tido sua primeira menstruação há poucos meses, evento que gerou diferentes sentimentos e questionamentos sobre seu próprio corpo. O termo médico utilizado para designar essa primeira menstruação da vida é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "menacme, termo que designa todo o período reprodutivo, e não apenas o evento inicial.",
        "correta": false,
        "justificativa": "Incorreta. Menacme designa todo o período reprodutivo da mulher (da menarca à menopausa), e não especificamente o evento da primeira menstruação."
      },
      {
        "letra": "B",
        "texto": "menarca.",
        "correta": true,
        "justificativa": "Menarca é o termo utilizado especificamente para a primeira menstruação da mulher, geralmente ocorrendo entre 10 e 15 anos de idade, com média em torno dos 12 anos, marcando o início do período reprodutivo (menacme). Correta. Menarca é exatamente o termo correto para a primeira menstruação da vida da mulher."
      },
      {
        "letra": "C",
        "texto": "climatério, termo que designa a transição para o período não reprodutivo.",
        "correta": false,
        "justificativa": "Incorreta. Climatério refere-se à fase de transição do período reprodutivo para o não reprodutivo, ocorrendo décadas após a menarca, e não ao evento inicial."
      },
      {
        "letra": "D",
        "texto": "menopausa, termo que designa a última menstruação da vida.",
        "correta": false,
        "justificativa": "Incorreta. Menopausa é a última menstruação da vida, evento oposto cronologicamente à menarca, que é a primeira menstruação."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q1"
  },
  {
    "enunciado": "Ao explicar o conceito de fases da vida reprodutiva feminina a uma estudante de medicina, a professora destaca que existe um termo específico para designar todo o período compreendido entre a primeira e a última menstruação da mulher, correspondente à sua fase fértil. Esse termo é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "climatério, termo que designa especificamente a transição para a fase não reprodutiva, e não todo o período fértil.",
        "correta": false,
        "justificativa": "Incorreta. Climatério designa especificamente a fase de transição do período reprodutivo para o não reprodutivo, sendo um período mais restrito do que todo o menacme."
      },
      {
        "letra": "B",
        "texto": "menacme.",
        "correta": true,
        "justificativa": "Menacme é o termo que designa o período reprodutivo (fértil) da mulher, compreendido entre a menarca (primeira menstruação) e a menopausa (última menstruação), correspondendo à maior parte da vida adulta feminina em condições fisiológicas normais. Correta. Menacme é exatamente o termo que designa todo o período reprodutivo, da menarca à menopausa."
      },
      {
        "letra": "C",
        "texto": "puerpério, termo relacionado ao período pós-parto, sem relação com toda a vida reprodutiva.",
        "correta": false,
        "justificativa": "Incorreta. Puerpério é o período que se segue ao parto até o retorno das condições pré-gestacionais, sem relação com toda a extensão da vida reprodutiva feminina."
      },
      {
        "letra": "D",
        "texto": "perimenopausa, termo que designa apenas o período imediatamente anterior e posterior à menopausa.",
        "correta": false,
        "justificativa": "Incorreta. Perimenopausa designa um período mais restrito, próximo à transição menopausal, e não toda a extensão do menacme."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q2"
  },
  {
    "enunciado": "Uma mulher de 51 anos, sem menstruar há 13 meses, procura a UBS para esclarecer dúvidas sobre sua condição atual. Ao explicar o conceito correto, o médico deve informar que a menopausa é definida, tecnicamente, como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a fase de transição do período reprodutivo para o não reprodutivo, caracterizada por sintomas como fogachos.",
        "correta": false,
        "justificativa": "Incorreta. A descrição de \"fase de transição\" corresponde ao conceito de climatério, e não à definição pontual e específica de menopausa."
      },
      {
        "letra": "B",
        "texto": "a última menstruação da vida da mulher, confirmada retrospectivamente após 12 meses consecutivos de amenorreia.",
        "correta": true,
        "justificativa": "A menopausa corresponde à última menstruação da vida, sendo confirmada retrospectivamente após 12 meses consecutivos de amenorreia, geralmente ocorrendo em torno dos 50 anos, sendo distinta do climatério, que é a fase de transição mais ampla que engloba a menopausa. Correta. Essa é a definição técnica e correta de menopausa: evento pontual confirmado retrospectivamente após 12 meses de amenorreia."
      },
      {
        "letra": "C",
        "texto": "sinônimo exato de climatério, podendo os dois termos ser usados de forma intercambiável em qualquer contexto clínico.",
        "correta": false,
        "justificativa": "Incorreta. Menopausa e climatério não são sinônimos: menopausa é um evento pontual (última menstruação), enquanto climatério é a fase de transição mais ampla que inclui a menopausa."
      },
      {
        "letra": "D",
        "texto": "o período que compreende toda a adolescência e o início da vida reprodutiva.",
        "correta": false,
        "justificativa": "Incorreta. A menopausa ocorre ao final da vida reprodutiva (geralmente por volta dos 50 anos), e não durante a adolescência ou início da vida reprodutiva."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q3"
  },
  {
    "enunciado": "Em revisão sobre o eixo hormonal que regula o ciclo menstrual, os estudantes identificam dois hormônios secretados pela hipófise que atuam diretamente sobre os ovários, estimulando o desenvolvimento folicular e desencadeando a ovulação. Esses dois hormônios hipofisários são",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "FSH e LH.",
        "correta": true,
        "justificativa": "O hormônio folículo-estimulante (FSH) e o hormônio luteinizante (LH), ambos secretados pela hipófise anterior sob controle do GnRH hipotalâmico, regulam o desenvolvimento folicular ovariano e desencadeiam a ovulação, sendo centrais na fisiologia do ciclo menstrual. Correta. FSH e LH são os hormônios hipofisários centrais na regulação do ciclo menstrual e da ovulação."
      },
      {
        "letra": "B",
        "texto": "TSH e ACTH, hormônios hipofisários relacionados a outros eixos endócrinos.",
        "correta": false,
        "justificativa": "Incorreta. TSH regula a função tireoidiana e ACTH a função adrenal, sem relação direta com a regulação do ciclo menstrual."
      },
      {
        "letra": "C",
        "texto": "prolactina e ocitocina, hormônios relacionados principalmente à lactação e ao parto.",
        "correta": false,
        "justificativa": "Incorreta. Prolactina está relacionada à lactação e ocitocina à contração uterina no parto e à ejeção láctea, sem serem os hormônios centrais reguladores do ciclo menstrual propriamente dito."
      },
      {
        "letra": "D",
        "texto": "GH e insulina, hormônios não diretamente relacionados à regulação do ciclo menstrual.",
        "correta": false,
        "justificativa": "Incorreta. GH (hormônio do crescimento) e insulina têm outras funções metabólicas centrais, sem serem os hormônios diretamente reguladores do ciclo menstrual."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q4"
  },
  {
    "enunciado": "Um casal busca orientação sobre planejamento familiar natural, questionando em que momento do ciclo menstrual ocorre a ovulação, considerando que a mulher relata ciclos regulares de 28 dias. A orientação tecnicamente correta é que, nesses ciclos regulares, a ovulação ocorre, em média,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "no primeiro dia do ciclo, coincidindo com o início do sangramento menstrual.",
        "correta": false,
        "justificativa": "Incorreta. O primeiro dia do ciclo corresponde ao início do sangramento menstrual, período de descamação endometrial, e não ao momento da ovulação."
      },
      {
        "letra": "B",
        "texto": "aproximadamente 14 dias após o início da menstruação, podendo variar cerca de 3 dias antes ou depois desse período.",
        "correta": true,
        "justificativa": "Em ciclos regulares de 28 dias, a ovulação ocorre em média por volta do 14º dia (contando a partir do primeiro dia da menstruação), podendo variar cerca de três dias antes ou depois desse período, informação relevante tanto para orientação de planejamento familiar natural quanto para investigação de infertilidade. Correta. Essa é a orientação correta sobre o momento médio da ovulação em ciclos regulares de 28 dias."
      },
      {
        "letra": "C",
        "texto": "apenas em ciclos considerados anovulatórios, sendo esse fenômeno exceção, e não regra, em mulheres com ciclos regulares.",
        "correta": false,
        "justificativa": "Incorreta. Ciclos anovulatórios (sem ovulação) são situação distinta e não representam o padrão esperado em mulheres com ciclos menstruais regulares."
      },
      {
        "letra": "D",
        "texto": "exclusivamente em mulheres acima de 40 anos, sendo esse fenômeno ausente em mulheres jovens com ciclos regulares.",
        "correta": false,
        "justificativa": "Incorreta. A ovulação ocorre em mulheres de diferentes idades durante a menacme, não sendo fenômeno restrito a mulheres acima de 40 anos."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q5"
  },
  {
    "enunciado": "Helena, 47 anos, procura atendimento relatando irregularidade menstrual progressiva ao longo dos últimos dois anos, com ciclos que passaram a ocorrer em intervalos imprevisíveis, além de fogachos noturnos com sudorese intensa e oscilações de humor sem relação clara com o ciclo menstrual. Diante desse quadro clínico, a hipótese diagnóstica mais compatível é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "tensão pré-menstrual clássica, quadro cíclico relacionado à fase lútea do ciclo menstrual regular.",
        "correta": false,
        "justificativa": "Incorreta. A TPM é quadro cíclico, relacionado especificamente à fase lútea de ciclos ainda regulares, diferente da irregularidade menstrual progressiva e ausência de padrão cíclico descritas no caso de Helena."
      },
      {
        "letra": "B",
        "texto": "climatério/perimenopausa.",
        "correta": true,
        "justificativa": "A combinação de irregularidade menstrual progressiva, fogachos e instabilidade de humor sem padrão cíclico definido é típica da transição climatérica (perimenopausa), decorrente da queda progressiva e irregular da função ovariana nessa fase da vida. Correta. O quadro clínico descrito é típico da transição climatérica, com irregularidade menstrual progressiva, fogachos e alterações de humor sem padrão cíclico."
      },
      {
        "letra": "C",
        "texto": "gravidez em fase inicial, hipótese que explicaria a irregularidade menstrual relatada.",
        "correta": false,
        "justificativa": "Incorreta. A irregularidade menstrual associada a fogachos e sudorese noturna, na faixa etária de Helena, é mais consistente com transição climatérica do que com gravidez inicial, embora a possibilidade de gravidez deva sempre ser considerada e eventualmente descartada na anamnese."
      },
      {
        "letra": "D",
        "texto": "puerpério tardio, período posterior ao parto sem relação com o quadro descrito.",
        "correta": false,
        "justificativa": "Incorreta. Puerpério tardio ocorre após o parto, contexto não descrito no caso de Helena, sendo incompatível com a apresentação clínica relatada."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q6"
  },
  {
    "enunciado": "Uma paciente relata que, há anos, apresenta irritabilidade, sensibilidade emocional e cefaleia nos dias que antecedem a menstruação, sintomas que melhoram espontaneamente logo após o início do fluxo menstrual, seguindo padrão cíclico previsível ao longo de vários ciclos consecutivos. Esse quadro é compatível com o diagnóstico de tensão pré-menstrual (TPM), caracterizada por sintomas que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "surgem de forma completamente aleatória, sem qualquer relação temporal com o ciclo menstrual da paciente.",
        "correta": false,
        "justificativa": "Incorreta. A TPM tem, por definição, relação temporal bem estabelecida com a fase lútea do ciclo menstrual, e não surge de forma aleatória e sem qualquer padrão."
      },
      {
        "letra": "B",
        "texto": "ocorrem tipicamente nos dias que antecedem a menstruação (fase lútea) e tendem a melhorar espontaneamente com o início do fluxo menstrual.",
        "correta": true,
        "justificativa": "A TPM caracteriza-se por sintomas físicos e emocionais recorrentes que surgem na fase lútea do ciclo menstrual (dias que antecedem a menstruação), com melhora espontânea e característica após o início do fluxo menstrual, padrão que ajuda a diferenciá-la de outras condições psiquiátricas ou clínicas. Correta. Esse é o padrão clínico característico da TPM: sintomas na fase lútea, com melhora após o início do fluxo menstrual."
      },
      {
        "letra": "C",
        "texto": "persistem de forma inalterada e constante durante toda a fase folicular e lútea do ciclo menstrual.",
        "correta": false,
        "justificativa": "Incorreta. Os sintomas da TPM não são constantes durante todo o ciclo; caracterizam-se justamente pela ciclicidade, concentrando-se na fase lútea e melhorando na fase folicular/menstrual."
      },
      {
        "letra": "D",
        "texto": "ocorrem exclusivamente após a instalação da menopausa, sem qualquer relação com ciclos menstruais regulares.",
        "correta": false,
        "justificativa": "Incorreta. A TPM ocorre em mulheres com ciclos menstruais ainda presentes (geralmente regulares), sendo incompatível com a ausência completa de menstruação característica da menopausa."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q7"
  },
  {
    "enunciado": "Durante avaliação clínica padronizada de uma mulher climatérica, a equipe de saúde utiliza um instrumento validado para quantificar a intensidade de sintomas como fogachos, distúrbios do sono e alterações de humor, auxiliando na decisão terapêutica. Esse instrumento de avaliação clínica é conhecido como índice de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Apgar, instrumento utilizado para avaliação do recém-nascido logo após o parto.",
        "correta": false,
        "justificativa": "Incorreta. O índice de Apgar avalia a vitalidade do recém-nascido nos primeiros minutos de vida, sem qualquer relação com sintomas climatéricos."
      },
      {
        "letra": "B",
        "texto": "Kupperman.",
        "correta": true,
        "justificativa": "O índice de Kupperman é instrumento validado utilizado para quantificar a intensidade dos sintomas climatéricos (fogachos, distúrbios do sono, alterações de humor, entre outros), auxiliando na avaliação clínica padronizada e na decisão sobre a necessidade e o tipo de tratamento a ser instituído. Correta. O índice de Kupperman é exatamente o instrumento utilizado para quantificação padronizada dos sintomas climatéricos."
      },
      {
        "letra": "C",
        "texto": "Bishop, instrumento utilizado para avaliação das condições cervicais antes da indução do parto.",
        "correta": false,
        "justificativa": "Incorreta. O índice de Bishop avalia as condições cervicais (dilatação, apagamento, consistência, posição e altura da apresentação) para indicação de indução do parto, sem relação com sintomas climatéricos."
      },
      {
        "letra": "D",
        "texto": "Barthel, instrumento utilizado para avaliação de capacidade funcional em atividades de vida diária.",
        "correta": false,
        "justificativa": "Incorreta. O índice de Barthel avalia capacidade funcional em atividades básicas de vida diária, sendo utilizado principalmente em contextos de reabilitação e geriatria, sem relação específica com sintomas climatéricos."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q8"
  },
  {
    "enunciado": "Mulher de 52 anos, com sintomas climatéricos significativos que comprometem sua qualidade de vida, procura orientação sobre terapia de reposição hormonal (TRH). Durante a anamnese, relata ter sido tratada há 5 anos para câncer de mama com receptores hormonais positivos, atualmente em remissão. Diante desse histórico, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a osteoporose isolada, sem outras comorbidades, representa contraindicação absoluta à TRH sistêmica.",
        "correta": false,
        "justificativa": "Incorreta. A osteoporose isolada não é contraindicação à TRH; ao contrário, em alguns contextos a TRH pode até ser considerada para prevenção óssea, na ausência de outras contraindicações."
      },
      {
        "letra": "B",
        "texto": "a história pessoal de câncer de mama é contraindicação relevante à terapia de reposição hormonal sistêmica, pelo potencial estímulo hormonal a eventuais células neoplásicas residuais ou ocultas.",
        "correta": true,
        "justificativa": "A história pessoal de câncer de mama, especialmente com receptores hormonais positivos, é contraindicação relevante e amplamente reconhecida à terapia de reposição hormonal sistêmica, pelo potencial estímulo hormonal a células neoplásicas residuais ou ocultas, devendo essa paciente ser orientada sobre alternativas não hormonais para manejo dos sintomas climatéricos. Correta. A história pessoal de câncer de mama, especialmente hormônio-sensível, é contraindicação relevante e amplamente reconhecida à TRH sistêmica."
      },
      {
        "letra": "C",
        "texto": "fogachos leves e esporádicos representam contraindicação absoluta à TRH, independentemente de qualquer outro fator.",
        "correta": false,
        "justificativa": "Incorreta. Fogachos leves e esporádicos não representam contraindicação à TRH; ao contrário, sintomas climatéricos são justamente a principal indicação para considerar essa terapia, na ausência de contraindicações."
      },
      {
        "letra": "D",
        "texto": "a ausência completa de sintomas climatéricos, isoladamente, já representa contraindicação formal ao uso de TRH.",
        "correta": false,
        "justificativa": "Incorreta. A ausência de sintomas climatéricos não é, por si só, contraindicação; ela apenas reduz a indicação de tratamento, já que a TRH é indicada principalmente para controle de sintomas relevantes."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q9"
  },
  {
    "enunciado": "Durante aula sobre repercussões sistêmicas do climatério, discute-se por que mulheres nessa fase da vida apresentam risco aumentado tanto de fraturas osteoporóticas quanto de eventos cardiovasculares, em comparação ao período reprodutivo anterior. A explicação fisiopatológica central para essa associação está relacionada à",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "queda dos níveis de estrogênio no climatério, hormônio que exerce efeito protetor tanto sobre o metabolismo ósseo quanto sobre o sistema cardiovascular.",
        "correta": true,
        "justificativa": "A redução dos níveis estrogênicos no climatério associa-se a maior reabsorção óssea (contribuindo para osteoporose) e perda do efeito vascular protetor do estrogênio (que inclui efeitos favoráveis sobre o perfil lipídico e a função endotelial), aumentando o risco cardiovascular nessa fase da vida em comparação ao período reprodutivo anterior. Correta. A queda estrogênica é o mecanismo fisiopatológico central que explica o aumento do risco ósseo e cardiovascular no climatério."
      },
      {
        "letra": "B",
        "texto": "elevação persistente e isolada dos níveis de progesterona durante todo o climatério, sem qualquer alteração nos níveis de estrogênio.",
        "correta": false,
        "justificativa": "Incorreta. Não há elevação persistente isolada de progesterona como fenômeno característico do climatério; ao contrário, há queda global da produção hormonal ovariana, incluindo estrogênio e progesterona."
      },
      {
        "letra": "C",
        "texto": "hipertireoidismo fisiológico associado universalmente ao climatério, em todas as mulheres.",
        "correta": false,
        "justificativa": "Incorreta. O climatério não está associado a hipertireoidismo fisiológico; trata-se de fenômeno relacionado à função ovariana, e não tireoidiana."
      },
      {
        "letra": "D",
        "texto": "hiperprolactinemia fisiológica esperada em todas as mulheres no climatério.",
        "correta": false,
        "justificativa": "Incorreta. Não há hiperprolactinemia fisiológica universal associada ao climatério; esse não é o mecanismo relacionado ao aumento do risco ósseo e cardiovascular nessa fase."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q10"
  },
  {
    "enunciado": "Uma mulher climatérica, com sintomas leves a moderados, prefere inicialmente não utilizar terapia hormonal e pergunta sobre medidas não farmacológicas que possam auxiliar no manejo de seus sintomas. Entre as medidas com evidência de benefício recomendadas nesse contexto estão",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "sedentarismo e dieta hipercalórica, apontados erroneamente como medidas de alívio sintomático nessa fase.",
        "correta": false,
        "justificativa": "Incorreta. Sedentarismo e dieta hipercalórica não são medidas recomendadas; ao contrário, estão associados a piora de fatores de risco cardiovascular e metabólico nessa fase da vida."
      },
      {
        "letra": "B",
        "texto": "atividade física regular, alimentação equilibrada e técnicas de manejo do estresse.",
        "correta": true,
        "justificativa": "Atividade física regular, alimentação equilibrada e estratégias de manejo do estresse (como técnicas de relaxamento e terapia cognitivo-comportamental) são medidas não farmacológicas recomendadas para o manejo dos sintomas climatéricos, com impacto positivo documentado na qualidade de vida das mulheres nessa fase, especialmente naquelas que preferem evitar ou têm contraindicação à terapia hormonal. Correta. Essas são exatamente as medidas não farmacológicas recomendadas com evidência de benefício para o manejo dos sintomas climatéricos."
      },
      {
        "letra": "C",
        "texto": "restrição hídrica intensa, sem qualquer evidência de benefício sintomático reconhecida na literatura.",
        "correta": false,
        "justificativa": "Incorreta. Restrição hídrica intensa não tem evidência de benefício reconhecida para sintomas climatéricos, podendo inclusive ser prejudicial à saúde geral da paciente."
      },
      {
        "letra": "D",
        "texto": "isolamento social, como estratégia terapêutica primária para o manejo dos sintomas climatéricos.",
        "correta": false,
        "justificativa": "Incorreta. Isolamento social não é medida terapêutica recomendada; ao contrário, o suporte social e a manutenção de vínculos são fatores protetores para o bem-estar emocional nessa fase da vida."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q11"
  },
  {
    "enunciado": "Helena, 47 anos, professora, com sintomas de irregularidade menstrual, fadiga e alterações de humor há dois anos, questiona à equipe de saúde se o tratamento disponível fará com que ela \"volte a ser quem era aos vinte anos\", demonstrando expectativa pouco realista sobre os objetivos terapêuticos possíveis nessa fase da vida. A resposta mais adequada, do ponto de vista da comunicação centrada na pessoa, é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "garantir à paciente que o tratamento hormonal disponível reverterá completamente o processo natural de envelhecimento reprodutivo.",
        "correta": false,
        "justificativa": "Incorreta. Garantir reversão completa do processo de envelhecimento reprodutivo é promessa irreal e tecnicamente incorreta, que pode gerar expectativas frustradas na paciente."
      },
      {
        "letra": "B",
        "texto": "esclarecer, com empatia, que o climatério é uma transição fisiológica natural e irreversível, mas que os sintomas que comprometem a qualidade de vida atual podem ser tratados, focando no bem-estar presente da paciente, sem prometer o retorno a um estado hormonal anterior.",
        "correta": true,
        "justificativa": "É importante esclarecer, com empatia e honestidade, que o climatério representa uma transição fisiológica natural e irreversível do organismo, mas que os sintomas que impactam a qualidade de vida atual da paciente podem ser tratados de forma individualizada, respeitando expectativas realistas sobre o próprio corpo e evitando promessas de reversão do processo natural de envelhecimento reprodutivo. Correta. Essa resposta concilia honestidade técnica sobre a irreversibilidade do climatério com acolhimento empático e foco no tratamento possível dos sintomas atuais."
      },
      {
        "letra": "C",
        "texto": "afirmar que absolutamente nada pode ser feito e que a paciente deve apenas aguardar a resolução espontânea e completa de todos os sintomas, sem qualquer intervenção.",
        "correta": false,
        "justificativa": "Incorreta. Existem, de fato, intervenções eficazes (farmacológicas e não farmacológicas) para o manejo dos sintomas climatéricos, sendo incorreto afirmar que nada pode ser feito."
      },
      {
        "letra": "D",
        "texto": "minimizar a expectativa da paciente, considerando-a mero exagero relacionado à idade, sem qualquer esclarecimento técnico adicional.",
        "correta": false,
        "justificativa": "Incorreta. Minimizar a expectativa da paciente sem qualquer esclarecimento técnico adequado não contribui para o entendimento real da situação nem para o vínculo de confiança na relação médico-paciente."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q12"
  },
  {
    "enunciado": "Durante discussão fisiopatológica sobre os fogachos característicos do climatério, um estudante questiona por que pequenas variações de temperatura ambiente, antes toleradas sem qualquer sintoma, passam a desencadear episódios de calor intenso, sudorese e rubor facial nessa fase da vida. A explicação mais aceita para esse fenômeno envolve",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aumento estável e progressivo dos níveis de estrogênio circulante ao longo do climatério, responsável direto pelos fogachos.",
        "correta": false,
        "justificativa": "Incorreta. Os fogachos decorrem da queda, e não do aumento, dos níveis de estrogênio circulante durante o climatério."
      },
      {
        "letra": "B",
        "texto": "instabilidade do centro termorregulador hipotalâmico decorrente da queda estrogênica, com estreitamento da chamada zona termoneutra, tornando a mulher mais suscetível a episódios de vasodilatação cutânea abrupta mesmo com pequenas variações de temperatura.",
        "correta": true,
        "justificativa": "A queda dos níveis de estrogênio no climatério leva à disfunção do centro termorregulador hipotalâmico, estreitando a chamada zona termoneutra (faixa de temperatura corporal na qual não ocorrem respostas termorregulatórias como sudorese ou tremor), tornando a mulher mais suscetível a episódios de vasodilatação cutânea abrupta (fogachos) mesmo diante de pequenas variações de temperatura corporal ou ambiental. Correta. Essa é a explicação fisiopatológica correta e atualmente aceita para os fogachos climatéricos: disfunção termorreguladora hipotalâmica por estreitamento da zona termoneutra secundário à queda estrogênica."
      },
      {
        "letra": "C",
        "texto": "hipertireoidismo primário concomitante, presente universalmente em todas as mulheres climatéricas com fogachos.",
        "correta": false,
        "justificativa": "Incorreta. Não há hipertireoidismo primário universal associado a fogachos climatéricos; o mecanismo central está relacionado à queda estrogênica e não à disfunção tireoidiana."
      },
      {
        "letra": "D",
        "texto": "aumento isolado de progesterona circulante, sem qualquer relação com o eixo hipotálamo-hipófise-ovariano ou com o centro termorregulador.",
        "correta": false,
        "justificativa": "Incorreta. Não há aumento isolado de progesterona como mecanismo explicativo dos fogachos; a queda de estrogênio, atuando sobre o centro termorregulador hipotalâmico, é o mecanismo central reconhecido."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q13"
  },
  {
    "enunciado": "Mulher de 30 anos, em fase de menacme, procura atendimento por dismenorreia progressiva, fadiga crônica e dispareunia de profundidade, sintomas presentes há alguns anos e que vêm se agravando progressivamente. Considerando uma doença ginecológica classicamente associada a essas queixas nessa faixa etária, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a endometriose consiste na presença de tecido endometrial fora da cavidade uterina, podendo causar dor pélvica crônica, dismenorreia progressiva, dispareunia de profundidade e infertilidade.",
        "correta": true,
        "justificativa": "A endometriose caracteriza-se pela presença de tecido endometrial ectópico (fora da cavidade uterina), tipicamente causando dismenorreia progressiva, dispareunia de profundidade, dor pélvica crônica e infertilidade, sendo doença característica do período de menacme, com diagnóstico frequentemente apoiado em exames de imagem específicos (como ultrassonografia transvaginal com preparo intestinal ou ressonância magnética) e, em alguns casos, confirmação por laparoscopia. Correta. Essa é a caracterização correta da endometriose, doença relevante no período de menacme com essas manifestações clínicas clássicas."
      },
      {
        "letra": "B",
        "texto": "a endometriose é doença exclusiva de mulheres na pós-menopausa, sem qualquer relação com o período de menacme.",
        "correta": false,
        "justificativa": "Incorreta. A endometriose é doença característica do menacme (período reprodutivo), sendo dependente de estímulo estrogênico, e não uma doença exclusiva da pós-menopausa."
      },
      {
        "letra": "C",
        "texto": "a endometriose não tem qualquer relação reconhecida com dismenorreia progressiva ou infertilidade.",
        "correta": false,
        "justificativa": "Incorreta. A endometriose tem relação bem estabelecida com dismenorreia progressiva e infertilidade, sendo essas justamente algumas de suas principais manifestações clínicas."
      },
      {
        "letra": "D",
        "texto": "o diagnóstico de endometriose é feito exclusivamente por exame de sangue isolado, sem necessidade de exame de imagem ou avaliação laparoscópica em qualquer situação.",
        "correta": false,
        "justificativa": "Incorreta. O diagnóstico de endometriose não é feito por exame de sangue isolado; envolve avaliação clínica, exames de imagem específicos e, em alguns casos, confirmação histológica por laparoscopia."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q14"
  },
  {
    "enunciado": "Mulher de 51 anos, sem sangramento menstrual há 14 meses (portanto já na menopausa confirmada), procura atendimento após episódio recente de sangramento vaginal. Diante desse achado clínico específico nessa fase da vida, a conduta mais adequada da equipe de saúde é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "considerar esse sangramento como variação fisiológica normal da menopausa, dispensando qualquer investigação adicional.",
        "correta": false,
        "justificativa": "Incorreta. Sangramento pós-menopausa não é considerado variação fisiológica normal; ao contrário, é sinal de alarme que exige investigação diagnóstica ativa."
      },
      {
        "letra": "B",
        "texto": "investigar ativamente a causa do sangramento pós-menopausa, incluindo avaliação da espessura endometrial (por ultrassonografia transvaginal) e, se indicado, biópsia endometrial, pelo risco aumentado de neoplasia nessa faixa etária.",
        "correta": true,
        "justificativa": "Todo sangramento vaginal após a menopausa confirmada deve ser investigado ativamente, incluindo avaliação da espessura endometrial por ultrassonografia transvaginal e, se indicado pelos achados, biópsia endometrial, pelo risco aumentado de neoplasia endometrial (e, menos frequentemente, cervical) nessa faixa etária, não devendo ser interpretado como variação fisiológica normal. Correta. A investigação ativa da causa do sangramento, incluindo avaliação endometrial, é a conduta correta diante desse sinal de alarme na pós-menopausa."
      },
      {
        "letra": "C",
        "texto": "orientar apenas repouso domiciliar e reavaliação em um ano, sem qualquer investigação complementar no momento atual.",
        "correta": false,
        "justificativa": "Incorreta. Postergar a investigação por um ano, sem qualquer avaliação complementar, atrasaria potencialmente o diagnóstico de uma neoplasia endometrial em fase inicial, quando o tratamento tende a ser mais eficaz."
      },
      {
        "letra": "D",
        "texto": "prescrever anticoncepcional hormonal combinado imediatamente, sem qualquer investigação diagnóstica prévia do sangramento relatado.",
        "correta": false,
        "justificativa": "Incorreta. Prescrever hormônios sem investigação prévia do sangramento pode mascarar ou retardar o diagnóstico de uma causa subjacente potencialmente grave, sendo conduta inadequada nesse contexto."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q15"
  },
  {
    "enunciado": "Uma mulher no climatério relata, durante consulta, redução progressiva do desejo sexual e desconforto (dor) durante as relações sexuais, sintomas que vêm afetando sua vida conjugal e sua autoestima. Em relação à sexualidade no climatério e às possibilidades terapêuticas para esse quadro, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a queda hormonal característica do climatério não tem qualquer relação reconhecida com alterações da libido ou da lubrificação vaginal.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida entre a queda estrogênica do climatério e alterações da libido, lubrificação vaginal e função sexual, sendo condição bastante estudada na literatura ginecológica."
      },
      {
        "letra": "B",
        "texto": "a diminuição estrogênica pode causar atrofia vaginal, dispareunia e alterações da libido (síndrome geniturinária da menopausa), sendo essas queixas passíveis de abordagem terapêutica específica, incluindo estrogênio tópico vaginal em casos selecionados.",
        "correta": true,
        "justificativa": "A hipoestrogenismo do climatério pode causar a síndrome geniturinária da menopausa (atrofia vaginal, secura, dispareunia) e alterações da libido, havendo opções terapêuticas específicas disponíveis, como estrogênio tópico vaginal (com boa segurança e eficácia mesmo em algumas pacientes com contraindicação à terapia hormonal sistêmica), lubrificantes e hidratantes vaginais, entre outras abordagens. Correta. Essa é a descrição correta da síndrome geniturinária da menopausa e das opções terapêuticas disponíveis para seu manejo."
      },
      {
        "letra": "C",
        "texto": "a atividade sexual deve ser definitivamente e obrigatoriamente interrompida após a instalação da menopausa, por recomendação médica padrão.",
        "correta": false,
        "justificativa": "Incorreta. Não há recomendação médica de interrupção obrigatória da atividade sexual após a menopausa; ao contrário, o objetivo do tratamento é justamente permitir manutenção de uma vida sexual satisfatória, quando desejada pela paciente."
      },
      {
        "letra": "D",
        "texto": "não existe qualquer tratamento disponível atualmente para os sintomas urogenitais relacionados ao climatério.",
        "correta": false,
        "justificativa": "Incorreta. Existem tratamentos disponíveis e eficazes para os sintomas urogenitais do climatério, como o estrogênio tópico vaginal e outras terapias específicas."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q16"
  },
  {
    "enunciado": "Durante discussão sobre repercussões neuropsiquiátricas do climatério, uma paciente relata piora de sintomas depressivos e queixas de memória desde o início da transição menopausal, questionando se há relação entre esses sintomas e as alterações hormonais dessa fase, e se a terapia hormonal poderia ser indicada especificamente para tratá-los. Em relação a esse tema, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a queda estrogênica não tem qualquer relação reconhecida com alterações cognitivas ou de humor durante o climatério.",
        "correta": false,
        "justificativa": "Incorreta. Há relação documentada entre hipoestrogenismo climatérico e maior vulnerabilidade a sintomas depressivos e queixas cognitivas em parte das mulheres nessa fase."
      },
      {
        "letra": "B",
        "texto": "há relação documentada entre hipoestrogenismo e maior vulnerabilidade a sintomas depressivos e queixas cognitivas em algumas mulheres durante a transição climatérica, sendo esse um tema relevante na avaliação individualizada dos riscos e benefícios da terapia de reposição hormonal, embora a TRH não seja indicada isoladamente como tratamento antidepressivo padrão.",
        "correta": true,
        "justificativa": "A transição climatérica pode aumentar a vulnerabilidade a sintomas depressivos e queixas cognitivas em algumas mulheres, provavelmente relacionada a flutuações e queda hormonal, sendo tema relevante na avaliação individualizada dos riscos e benefícios da terapia de reposição hormonal; entretanto, a TRH não é indicada isoladamente como tratamento padrão para depressão, devendo essa possível comorbidade ser avaliada e tratada de forma específica, se presente, com acompanhamento especializado quando necessário. Correta. Essa afirmação reflete corretamente a relação entre climatério e sintomas neuropsiquiátricos, com a ressalva importante de que a TRH não é tratamento antidepressivo padrão isolado."
      },
      {
        "letra": "C",
        "texto": "a TRH está absolutamente contraindicada para qualquer sintoma neuropsiquiátrico do climatério, independentemente do contexto clínico individual.",
        "correta": false,
        "justificativa": "Incorreta. Não há contraindicação absoluta e universal da TRH para qualquer sintoma neuropsiquiátrico do climatério; a decisão deve ser individualizada, considerando o quadro clínico completo da paciente."
      },
      {
        "letra": "D",
        "texto": "o climatério elimina completamente qualquer risco de sintomas depressivos em todas as mulheres, por mecanismo hormonal protetor.",
        "correta": false,
        "justificativa": "Incorreta. O climatério não elimina o risco de sintomas depressivos; ao contrário, pode aumentar a vulnerabilidade a esses sintomas em algumas mulheres, conforme discutido na literatura."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q17"
  },
  {
    "enunciado": "Mulher de 47 anos com tensão pré-menstrual importante relata que os sintomas comprometem significativamente sua rotina profissional e familiar todos os meses, apesar de medidas não farmacológicas já tentadas sem sucesso satisfatório. Diante desse quadro refratário, uma opção terapêutica farmacológica reconhecida e frequentemente considerada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "antibioticoterapia profilática contínua, sem qualquer indicação reconhecida para tensão pré-menstrual.",
        "correta": false,
        "justificativa": "Incorreta. Não há qualquer indicação reconhecida de antibioticoterapia para tensão pré-menstrual, condição sem componente infeccioso."
      },
      {
        "letra": "B",
        "texto": "uso de inibidores seletivos da recaptação de serotonina (ISRS), inclusive em esquema intermitente na fase lútea, ou anticoncepcionais hormonais combinados, conforme avaliação individualizada do caso.",
        "correta": true,
        "justificativa": "O tratamento farmacológico da TPM/transtorno disfórico pré-menstrual refratário a medidas não farmacológicas pode incluir ISRS (inclusive em uso intermitente restrito à fase lútea, estratégia validada para essa condição específica) ou anticoncepcionais hormonais combinados, conforme perfil clínico e preferências da paciente, sendo opções terapêuticas reconhecidas na literatura. Correta. ISRS (inclusive em esquema intermitente) e anticoncepcionais hormonais combinados são opções farmacológicas reconhecidas para TPM refratária a medidas não farmacológicas."
      },
      {
        "letra": "C",
        "texto": "corticoterapia sistêmica contínua, sem qualquer indicação reconhecida para tensão pré-menstrual.",
        "correta": false,
        "justificativa": "Incorreta. Não há indicação reconhecida de corticoterapia sistêmica contínua para tensão pré-menstrual, condição sem base fisiopatológica que justifique esse tratamento."
      },
      {
        "letra": "D",
        "texto": "anti-histamínicos de primeira geração em altas doses, sem evidência reconhecida de benefício específico para tensão pré-menstrual.",
        "correta": false,
        "justificativa": "Incorreta. Anti-histamínicos de primeira geração em altas doses não têm evidência reconhecida de benefício específico para TPM, não sendo opção terapêutica validada para essa condição."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q18"
  },
  {
    "enunciado": "Durante consulta de uma mulher de 49 anos com sintomas climatéricos iniciais, a equipe de saúde realiza avaliação clínica ampla, para além do simples controle dos sintomas vasomotores relatados. Considerando as prioridades de avaliação nessa fase da vida, o exame físico e a anamnese devem valorizar, entre outros aspectos,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exclusivamente o peso corporal da paciente, sem necessidade de qualquer outra avaliação complementar nessa fase da vida.",
        "correta": false,
        "justificativa": "Incorreta. Embora o peso corporal seja relevante, restringir a avaliação exclusivamente a esse parâmetro ignoraria outros aspectos igualmente importantes da saúde da mulher climatérica."
      },
      {
        "letra": "B",
        "texto": "rastreamento de fatores de risco cardiovascular, avaliação do risco de osteoporose e manutenção do rastreamento oncológico apropriado à idade (mamografia, citologia cervical), dado o aumento do risco dessas condições nessa fase da vida.",
        "correta": true,
        "justificativa": "A avaliação da mulher climatérica deve ser abrangente, incluindo rastreamento de fatores de risco cardiovascular (que aumentam nessa fase pela perda do efeito protetor estrogênico), avaliação do risco de osteoporose e manutenção do rastreamento oncológico apropriado à idade (mamografia, citologia cervical), reconhecendo que o climatério é momento oportuno para uma abordagem preventiva mais ampla da saúde da mulher, e não apenas para o controle dos sintomas vasomotores. Correta. Essa é a abordagem abrangente e recomendada para a avaliação clínica da mulher climatérica, integrando prevenção cardiovascular, óssea e oncológica."
      },
      {
        "letra": "C",
        "texto": "apenas a realização de exames de imagem cerebral, independentemente da presença de sintomas neurológicos específicos.",
        "correta": false,
        "justificativa": "Incorreta. Exames de imagem cerebral não são indicados rotineiramente na avaliação do climatério, sendo reservados a situações com sintomas neurológicos específicos que os justifiquem."
      },
      {
        "letra": "D",
        "texto": "unicamente a investigação da função tireoidiana, independentemente da presença de sintomas sugestivos de disfunção tireoidiana.",
        "correta": false,
        "justificativa": "Incorreta. Embora a avaliação tireoidiana possa ser pertinente em alguns contextos (diagnóstico diferencial de sintomas climatéricos), ela não deve ser a única prioridade na avaliação clínica abrangente dessa fase da vida."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q19"
  },
  {
    "enunciado": "Mulher de 50 anos, com sintomas climatéricos significativos que comprometem sua qualidade de vida, sem contraindicações identificadas (sem história pessoal de câncer de mama, doença tromboembólica ou outras condições que contraindiquem a TRH), procura orientação sobre iniciar terapia de reposição hormonal. A abordagem mais adequada nesse momento da consulta é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "prescrever automaticamente TRH para essa e para todas as demais mulheres no climatério, independentemente de sintomas específicos ou preferências pessoais.",
        "correta": false,
        "justificativa": "Incorreta. A prescrição automática e universal, sem considerar particularidades clínicas e preferências individuais, não representa boa prática clínica na decisão sobre TRH."
      },
      {
        "letra": "B",
        "texto": "realizar tomada de decisão compartilhada, considerando a intensidade dos sintomas, o tempo desde a menopausa (janela de oportunidade terapêutica), fatores de risco individuais e as preferências da própria paciente.",
        "correta": true,
        "justificativa": "A decisão sobre iniciar TRH deve ser compartilhada e individualizada, considerando a intensidade dos sintomas climatéricos, o tempo decorrido desde a menopausa (a chamada \"janela de oportunidade\", período em que o balanço risco-benefício tende a ser mais favorável), fatores de risco individuais (cardiovascular, oncológico, tromboembólico) e as preferências da própria paciente, não devendo ser prescrição automática nem recusa automática, mas sim resultado de avaliação clínica individualizada e diálogo compartilhado. Correta. A decisão compartilhada e individualizada, considerando os múltiplos fatores mencionados, é a abordagem correta e recomendada."
      },
      {
        "letra": "C",
        "texto": "nunca prescrever TRH, independentemente do quadro clínico apresentado ou da ausência de contraindicações identificadas.",
        "correta": false,
        "justificativa": "Incorreta. Na ausência de contraindicações e diante de sintomas significativos que comprometem a qualidade de vida, a TRH pode ser considerada; recusá-la de forma automática e universal não é conduta baseada em evidências."
      },
      {
        "letra": "D",
        "texto": "prescrever TRH baseando-se exclusivamente na idade cronológica da paciente, sem qualquer outra avaliação clínica individualizada.",
        "correta": false,
        "justificativa": "Incorreta. A decisão sobre TRH não deve se basear exclusivamente na idade cronológica, mas sim em avaliação clínica individualizada que considere múltiplos fatores relevantes, como discutido na alternativa correta."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP2_ENAMED — Q20"
  },
  {
    "enunciado": "Renata, 24 anos, no segundo trimestre de gestação, questiona por que sua hemoglobina, antes normal, apresentou discreta queda nos exames de rotina, mesmo sem qualquer sintoma de sangramento ou queixa nutricional relevante. Ao explicar essa alteração fisiológica esperada da gestação, o médico esclarece que ela decorre do fato de que, durante a gravidez normal, o volume plasmático materno aumenta proporcionalmente mais que a massa eritrocitária, resultando em",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "policitemia gestacional, quadro incompatível com a queda de hemoglobina relatada.",
        "correta": false,
        "justificativa": "Incorreta. Policitemia gestacional (aumento da massa eritrocitária) é o oposto do fenômeno de hemodiluição fisiológica descrito, sendo incompatível com a queda de hemoglobina relatada por Renata."
      },
      {
        "letra": "B",
        "texto": "anemia fisiológica da gravidez (hemodiluição).",
        "correta": true,
        "justificativa": "O aumento do volume plasmático é proporcionalmente maior que o aumento da massa eritrocitária ao longo da gestação, gerando hemodiluição e queda fisiológica da hemoglobina, fenômeno conhecido como anemia fisiológica da gravidez, que deve ser diferenciado de anemias patológicas mais acentuadas. Correta. A anemia fisiológica da gravidez, por hemodiluição, é exatamente o fenômeno que explica a discreta queda de hemoglobina relatada."
      },
      {
        "letra": "C",
        "texto": "poliglobulia patológica, quadro incompatível com a queda de hemoglobina relatada.",
        "correta": false,
        "justificativa": "Incorreta. Poliglobulia patológica também representa aumento da massa eritrocitária, sendo incompatível com a queda de hemoglobina observada."
      },
      {
        "letra": "D",
        "texto": "ausência de qualquer alteração hematológica relevante durante a gestação.",
        "correta": false,
        "justificativa": "Incorreta. Há, sim, alteração hematológica fisiológica relevante na gestação (hemodiluição), sendo incorreta a afirmação de ausência de qualquer alteração."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q1"
  },
  {
    "enunciado": "Ao organizar o cronograma de acompanhamento pré-natal de Renata na UBS, a equipe de saúde da família segue as recomendações do Ministério da Saúde quanto ao número mínimo de consultas a serem realizadas ao longo de toda a gestação, para garantir acompanhamento adequado. Esse número mínimo recomendado é de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "2 consultas ao longo de toda a gestação, número insuficiente segundo as diretrizes vigentes.",
        "correta": false,
        "justificativa": "Incorreta. O número mínimo recomendado é maior do que 2 consultas, que seria insuficiente para o acompanhamento adequado preconizado pelas diretrizes vigentes."
      },
      {
        "letra": "B",
        "texto": "4 consultas ao longo de toda a gestação, número inferior ao efetivamente recomendado.",
        "correta": false,
        "justificativa": "Incorreta. O número mínimo recomendado é 6 consultas, e não 4, sendo esse último número inferior ao efetivamente preconizado."
      },
      {
        "letra": "C",
        "texto": "pelo menos 6 consultas, distribuídas ao longo dos três trimestres da gestação.",
        "correta": true,
        "justificativa": "O Ministério da Saúde recomenda no mínimo 6 consultas de pré-natal, distribuídas ao longo dos três trimestres da gestação (geralmente uma no primeiro trimestre, duas no segundo e três no terceiro), permitindo acompanhamento adequado da evolução materno-fetal e detecção precoce de intercorrências. Correta. Pelo menos 6 consultas de pré-natal, distribuídas ao longo da gestação, é a recomendação vigente do Ministério da Saúde."
      },
      {
        "letra": "D",
        "texto": "nenhuma consulta é necessária caso a gestante permaneça assintomática durante toda a gestação.",
        "correta": false,
        "justificativa": "Incorreta. O acompanhamento pré-natal é recomendado mesmo em gestantes assintomáticas, permitindo detecção precoce de intercorrências antes do surgimento de sintomas clínicos evidentes."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q2"
  },
  {
    "enunciado": "Renata questiona por que sua pressão arterial, medida na consulta atual do segundo trimestre, está discretamente mais baixa do que era antes de engravidar, mesmo sem qualquer sintoma associado. Em relação a essa alteração fisiológica esperada da gestação, é correto informar que a pressão arterial materna",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aumenta progressivamente desde o primeiro trimestre da gestação, achado incompatível com o relato de Renata.",
        "correta": false,
        "justificativa": "Incorreta. O padrão fisiológico esperado é justamente o oposto: queda da pressão arterial, especialmente no segundo trimestre, e não aumento progressivo desde o início da gestação."
      },
      {
        "letra": "B",
        "texto": "diminui durante a gestação, especialmente no segundo trimestre, retornando a níveis próximos aos pré-gravídicos ao final da gestação.",
        "correta": true,
        "justificativa": "É fisiológico que a pressão arterial diminua durante a gestação, especialmente no segundo trimestre (por vasodilatação periférica mediada por fatores como a progesterona e prostaglandinas), retornando a níveis próximos aos pré-gravídicos ao final da gestação, sendo importante diferenciar essa queda fisiológica de hipotensão sintomática que exija investigação adicional. Correta. Essa é a alteração fisiológica correta e esperada da pressão arterial ao longo da gestação normal."
      },
      {
        "letra": "C",
        "texto": "permanece absolutamente inalterada ao longo de toda a gestação, sem qualquer variação fisiológica esperada.",
        "correta": false,
        "justificativa": "Incorreta. Há variação fisiológica esperada e bem documentada da pressão arterial ao longo da gestação, não permanecendo absolutamente inalterada."
      },
      {
        "letra": "D",
        "texto": "apresenta apenas elevações abruptas e transitórias sem qualquer padrão fisiológico reconhecido durante a gestação normal.",
        "correta": false,
        "justificativa": "Incorreta. A queda pressórica do segundo trimestre segue padrão fisiológico previsível, e não elevações abruptas e transitórias sem qualquer padrão reconhecido."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q3"
  },
  {
    "enunciado": "Renata relata, durante a consulta, ter notado escurecimento progressivo da pele em região malar (bochechas) e ao redor dos olhos, sem qualquer outro sintoma associado, desde o início do segundo trimestre da gestação. Esse achado cutâneo comum na gestação, decorrente de alterações hormonais que estimulam a melanogênese, é conhecido como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "melasma gravídico (cloasma).",
        "correta": true,
        "justificativa": "O melasma (cloasma gravídico) é uma hiperpigmentação facial comum na gestação, tipicamente acometendo região malar, fronte e ao redor dos olhos, decorrente de alterações hormonais (estrogênio, progesterona e hormônio estimulante de melanócitos) que estimulam a melanogênese, sendo achado benigno e frequentemente reversível após o parto. Correta. Melasma (cloasma gravídico) é exatamente o achado descrito: hiperpigmentação facial comum na gestação."
      },
      {
        "letra": "B",
        "texto": "vitiligo gestacional, condição de despigmentação cutânea, e não de hiperpigmentação como relatado.",
        "correta": false,
        "justificativa": "Incorreta. Vitiligo é condição de despigmentação (perda de pigmento), sendo o oposto da hiperpigmentação relatada por Renata."
      },
      {
        "letra": "C",
        "texto": "eritema nodoso, lesão inflamatória subcutânea distinta do achado descrito.",
        "correta": false,
        "justificativa": "Incorreta. Eritema nodoso é lesão inflamatória subcutânea (nódulos eritematosos dolorosos, geralmente em membros inferiores), sem relação com a hiperpigmentação facial descrita."
      },
      {
        "letra": "D",
        "texto": "pênfigo gestacional, doença bolhosa autoimune distinta do achado descrito.",
        "correta": false,
        "justificativa": "Incorreta. Pênfigo gestacional é doença bolhosa autoimune rara da gestação, com lesões vesicobolhosas pruriginosas, distinta do achado de hiperpigmentação facial descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q4"
  },
  {
    "enunciado": "Renata relata náuseas matinais frequentes desde as primeiras semanas de gestação, sintoma que a preocupou inicialmente, mas que a equipe de saúde explica ser comum nesse período. Essa queixa, no início da gestação, está mais associada aos altos níveis de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "gonadotrofina coriônica humana (hCG).",
        "correta": true,
        "justificativa": "Os níveis elevados de gonadotrofina coriônica humana (hCG) no primeiro trimestre estão associados à ocorrência de náuseas e vômitos gestacionais, tipicamente mais intensos no período da manhã, sintoma comum que tende a melhorar espontaneamente ao final do primeiro trimestre na maioria das gestantes. Correta. Os níveis elevados de hCG no primeiro trimestre são classicamente associados à ocorrência de náuseas gestacionais matinais."
      },
      {
        "letra": "B",
        "texto": "hormônio antidiurético, sem relação estabelecida com náuseas gestacionais características do início da gravidez.",
        "correta": false,
        "justificativa": "Incorreta. O hormônio antidiurético não tem relação estabelecida com a fisiopatologia das náuseas gestacionais do início da gravidez."
      },
      {
        "letra": "C",
        "texto": "insulina, sem relação estabelecida com náuseas gestacionais características do início da gravidez.",
        "correta": false,
        "justificativa": "Incorreta. A insulina não tem relação direta reconhecida com as náuseas gestacionais características do primeiro trimestre."
      },
      {
        "letra": "D",
        "texto": "paratormônio, sem relação estabelecida com náuseas gestacionais características do início da gravidez.",
        "correta": false,
        "justificativa": "Incorreta. O paratormônio, relacionado ao metabolismo do cálcio, não tem relação estabelecida com as náuseas gestacionais do início da gravidez."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q5"
  },
  {
    "enunciado": "Renata, 24 anos, com 38 semanas de gestação, procura atendimento na UBS relatando perda súbita de líquido claro pela vagina há cerca de uma hora, sem dor importante associada. Diante desse relato, a hipótese diagnóstica mais provável e a conduta inicial mais adequada são, respectivamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "infecção urinária; solicitar urocultura ambulatorial, sem necessidade de encaminhamento imediato.",
        "correta": false,
        "justificativa": "Incorreta. Embora infecção urinária deva ser considerada no diagnóstico diferencial de queixas urinárias, a descrição de perda súbita de líquido claro em gestante a termo é mais sugestiva de ruptura de membranas, exigindo avaliação obstétrica imediata, e não apenas investigação urológica ambulatorial."
      },
      {
        "letra": "B",
        "texto": "ruptura prematura de membranas (amniorrexe); encaminhamento imediato para avaliação obstétrica em serviço de referência para gestação de alto risco ou maternidade.",
        "correta": true,
        "justificativa": "A perda súbita de líquido claro em gestante a termo (38 semanas) é altamente sugestiva de ruptura das membranas ovulares (amniorrexe), exigindo avaliação obstétrica imediata em serviço de referência para confirmação diagnóstica, avaliação do bem-estar fetal e definição da conduta quanto ao momento e à via de parto. Correta. Ruptura prematura de membranas é a hipótese diagnóstica mais provável, exigindo encaminhamento imediato para avaliação obstétrica especializada."
      },
      {
        "letra": "C",
        "texto": "incontinência urinária de esforço; orientação de exercícios perineais, sem necessidade de avaliação obstétrica adicional.",
        "correta": false,
        "justificativa": "Incorreta. Incontinência urinária de esforço tipicamente se manifesta em relação a esforços físicos específicos (tosse, espirro), sendo menos consistente com a descrição de perda súbita e contínua de líquido relatada por Renata."
      },
      {
        "letra": "D",
        "texto": "leucorreia fisiológica da gestação; tranquilizar a paciente e dispensá-la sem qualquer encaminhamento.",
        "correta": false,
        "justificativa": "Incorreta. Leucorreia fisiológica tem características distintas (secreção mais espessa, e não líquido claro em grande quantidade de forma súbita), sendo essa hipótese incompatível com a gravidade potencial do quadro descrito, que exige avaliação e não apenas tranquilização."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q6"
  },
  {
    "enunciado": "No hemograma de rotina do terceiro trimestre de Renata, observa-se discreto aumento da contagem de leucócitos em relação aos valores pré-gestacionais, achado que gera dúvida sobre possível processo infeccioso subjacente. Em relação às alterações hematológicas fisiológicas da gestação, é esperado aumento fisiológico de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "contagem de plaquetas, achado que tipicamente tende a discreta redução, e não aumento, ao longo da gestação normal.",
        "correta": false,
        "justificativa": "Incorreta. A contagem de plaquetas tende a discreta redução fisiológica ao longo da gestação, e não a aumento, ao contrário do afirmado."
      },
      {
        "letra": "B",
        "texto": "leucócitos (leucocitose fisiológica).",
        "correta": true,
        "justificativa": "A leucocitose é achado hematológico fisiológico da gestação, podendo, por si só, não indicar processo infeccioso quando isolada e sem outros sinais clínicos sugestivos; por outro lado, a filtração glomerular aumentada na gestação normal reduz os níveis de ureia e creatinina séricas, e a contagem de plaquetas tende a apresentar discreta redução fisiológica ao longo da gestação. Correta. A leucocitose é achado hematológico fisiológico esperado na gestação, podendo gerar dúvida diagnóstica se interpretada isoladamente sem considerar o contexto gestacional."
      },
      {
        "letra": "C",
        "texto": "níveis de creatinina sérica, que tendem a reduzir, e não aumentar, na gestação normal pelo aumento da filtração glomerular.",
        "correta": false,
        "justificativa": "Incorreta. Os níveis de creatinina tendem a reduzir, e não aumentar, na gestação normal, pelo aumento fisiológico da taxa de filtração glomerular."
      },
      {
        "letra": "D",
        "texto": "níveis de ureia sérica, que tendem a reduzir, e não aumentar, na gestação normal pelo aumento da filtração glomerular.",
        "correta": false,
        "justificativa": "Incorreta. Os níveis de ureia também tendem a reduzir, e não aumentar, na gestação normal, pelo mesmo mecanismo de aumento da filtração glomerular."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q7"
  },
  {
    "enunciado": "Renata relata piora progressiva de queixa de azia e constipação intestinal ao longo da gestação, sintomas que a incomodam bastante, embora sem sinais de alarme associados. Ao explicar a fisiopatologia dessas queixas gastrointestinais comuns na gestação, o médico destaca que o aumento da progesterona contribui para",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aumento do tônus do esfíncter esofágico inferior, o que, na verdade, preveniria a pirose, e não a explicaria como relatado por Renata.",
        "correta": false,
        "justificativa": "Incorreta. O relaxamento (e não o aumento do tônus) do esfíncter esofágico inferior é o mecanismo que favorece a pirose relatada por Renata."
      },
      {
        "letra": "B",
        "texto": "esvaziamento gástrico mais lento, redução da motilidade intestinal e relaxamento do esfíncter esofágico inferior, favorecendo pirose e constipação.",
        "correta": true,
        "justificativa": "A progesterona relaxa a musculatura lisa em diversos sistemas, incluindo o trato gastrointestinal, retardando o esvaziamento gástrico e reduzindo a motilidade intestinal, além de relaxar o esfíncter esofágico inferior, favorecendo pirose (pelo refluxo facilitado) e constipação intestinal, queixas comuns e esperadas ao longo da gestação. Correta. Esse é o mecanismo fisiopatológico correto que explica as queixas de pirose e constipação relatadas por Renata ao longo da gestação."
      },
      {
        "letra": "C",
        "texto": "aumento da motilidade intestinal, o que, na verdade, preveniria a constipação, e não a explicaria como relatado por Renata.",
        "correta": false,
        "justificativa": "Incorreta. A redução (e não o aumento) da motilidade intestinal é o mecanismo que favorece a constipação relatada por Renata."
      },
      {
        "letra": "D",
        "texto": "ausência completa de qualquer efeito sobre o trato gastrointestinal durante a gestação.",
        "correta": false,
        "justificativa": "Incorreta. Há efeito bem estabelecido da progesterona sobre a motilidade gastrointestinal na gestação, não sendo correto afirmar ausência completa de qualquer efeito."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q8"
  },
  {
    "enunciado": "No exame de rastreamento de rotina do segundo trimestre de Renata, a glicemia de jejum encontra-se discretamente elevada, próxima ao limite superior da normalidade, sem outros sintomas associados. Diante desse achado laboratorial, a conduta adequada nesse momento é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ignorar completamente o achado, considerando-o sempre variação normal e sem qualquer relevância clínica em qualquer gestante.",
        "correta": false,
        "justificativa": "Incorreta. Um achado glicêmico limítrofe não deve ser sistematicamente ignorado, dada a relevância do diagnóstico precoce de diabetes gestacional para o desfecho materno-fetal."
      },
      {
        "letra": "B",
        "texto": "orientação alimentar e seguimento mais atento, com possível confirmação diagnóstica de diabetes gestacional conforme protocolo específico (teste de tolerância à glicose).",
        "correta": true,
        "justificativa": "Diante de glicemia de jejum limítrofe, a conduta adequada inclui orientação alimentar inicial e seguimento mais próximo, com investigação complementar (teste de tolerância à glicose com 75g, conforme protocolo) para confirmar ou excluir o diagnóstico de diabetes mellitus gestacional, permitindo intervenção precoce caso o diagnóstico seja confirmado. Correta. Orientação alimentar e investigação complementar são as condutas adequadas diante de glicemia de jejum limítrofe, permitindo confirmação diagnóstica apropriada."
      },
      {
        "letra": "C",
        "texto": "iniciar insulinoterapia imediatamente, sem qualquer confirmação diagnóstica complementar prévia.",
        "correta": false,
        "justificativa": "Incorreta. Iniciar insulinoterapia sem confirmação diagnóstica prévia é conduta prematura e desproporcional diante de um achado ainda não confirmado como diabetes gestacional estabelecido."
      },
      {
        "letra": "D",
        "texto": "suspender completamente o acompanhamento de pré-natal de Renata até o momento do parto.",
        "correta": false,
        "justificativa": "Incorreta. Suspender o acompanhamento de pré-natal contraria completamente as boas práticas assistenciais, especialmente diante de achado que exige investigação e seguimento mais próximo, e não menos."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q9"
  },
  {
    "enunciado": "Renata apresenta episódios recorrentes de infecção urinária ao longo da gestação, achado que intriga a equipe de saúde, já que ela nunca havia apresentado esse problema antes de engravidar. Ao explicar essa maior predisposição gestacional, a equipe destaca que o hidroureter e a hidronefrose fisiológicos da gravidez, mais pronunciados à direita, predispõem a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "redução do risco de infecção urinária, efeito oposto ao que efetivamente ocorre na gestação.",
        "correta": false,
        "justificativa": "Incorreta. O hidroureter/hidronefrose fisiológicos aumentam, e não reduzem, o risco de infecção urinária na gestação, por favorecerem a estase urinária."
      },
      {
        "letra": "B",
        "texto": "estase urinária, com maior predisposição a infecções do trato urinário.",
        "correta": true,
        "justificativa": "O hidroureter/hidronefrose fisiológicos da gestação, decorrentes de fatores hormonais (relaxamento da musculatura lisa ureteral pela progesterona) e mecânicos (compressão pelo útero gravídico, mais acentuada à direita pela dextrorrotação uterina habitual), causam estase urinária, o que aumenta o risco de infecções do trato urinário na gestação, explicando a maior predisposição relatada por Renata. Correta. Esse é o mecanismo fisiopatológico correto que explica a maior predisposição a infecções urinárias observada na gestação."
      },
      {
        "letra": "C",
        "texto": "insuficiência renal aguda em praticamente todas as gestantes, desfecho não característico dessa alteração fisiológica.",
        "correta": false,
        "justificativa": "Incorreta. Embora o hidroureter/hidronefrose fisiológicos possam ser significativos, eles não costumam evoluir para insuficiência renal aguda na maioria das gestantes, sendo achado geralmente bem tolerado e reversível após o parto."
      },
      {
        "letra": "D",
        "texto": "ausência completa de qualquer alteração relevante do sistema urinário durante a gestação normal.",
        "correta": false,
        "justificativa": "Incorreta. Há alteração relevante e bem documentada do sistema urinário na gestação normal (hidroureter/hidronefrose fisiológicos), contrariando a afirmação de ausência completa de alteração."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q10"
  },
  {
    "enunciado": "Renata relata à equipe de saúde da família episódios frequentes de choro sem motivo aparente, irritabilidade e insegurança em relação à maternidade, sentimentos que a deixam confusa, já que ela também relata alegria com a gestação. Em relação a essas labilidades emocionais frequentemente relatadas por gestantes como Renata, é correto afirmar que decorrem, entre outros fatores, de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ausência completa de qualquer alteração hormonal relevante durante a gestação, sendo essas emoções atribuíveis exclusivamente a fatores externos.",
        "correta": false,
        "justificativa": "Incorreta. Há alteração hormonal relevante e bem documentada na gestação, que contribui, junto a fatores psicológicos, para a labilidade emocional relatada, não sendo atribuível exclusivamente a fatores externos."
      },
      {
        "letra": "B",
        "texto": "flutuações hormonais (estrogênio, progesterona) associadas às adaptações psicológicas ao novo papel materno, sendo importante o acolhimento dessas emoções pela equipe de saúde.",
        "correta": true,
        "justificativa": "As alterações hormonais da gestação (estrogênio, progesterona, entre outros), associadas às adaptações psicológicas ao processo de maternidade, contribuem para a labilidade emocional frequentemente observada em gestantes, sendo importante que a equipe de saúde acolha essas emoções durante a consulta de pré-natal, sem patologizar reações emocionais esperadas nesse contexto, mas atenta a sinais que sugiram sofrimento psíquico mais significativo. Correta. Essa é a explicação mais completa e adequada para a labilidade emocional gestacional relatada por Renata, reconhecendo tanto fatores hormonais quanto psicológicos."
      },
      {
        "letra": "C",
        "texto": "exclusivamente fatores genéticos individuais, sem qualquer relação com o processo gestacional em curso.",
        "correta": false,
        "justificativa": "Incorreta. Embora fatores individuais possam influenciar a intensidade da resposta emocional, a labilidade emocional gestacional tem relação estabelecida com o próprio processo hormonal e psicológico da gravidez, e não apenas com fatores genéticos isolados."
      },
      {
        "letra": "D",
        "texto": "efeito colateral obrigatório e universal do uso de sulfato ferroso, presente em todas as gestantes que utilizam essa suplementação.",
        "correta": false,
        "justificativa": "Incorreta. O sulfato ferroso não é reconhecido como causa de labilidade emocional gestacional; seus efeitos adversos mais comuns são gastrointestinais (constipação, náuseas), sem relação com o quadro emocional descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q11"
  },
  {
    "enunciado": "Renata, 24 anos, com gestação não planejada, iniciando curso superior recentemente, demonstra ansiedade importante durante a consulta de pré-natal, verbalizando dúvidas sobre conciliar maternidade e estudos, além de medo de decepcionar a família. Considerando a relação médico-paciente com a gestante nesse contexto de vulnerabilidade emocional específica, a abordagem mais adequada da equipe de saúde é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "focar exclusivamente nos aspectos biomédicos da consulta (exame físico, exames laboratoriais), sem qualquer espaço para acolhimento das preocupações emocionais verbalizadas por Renata.",
        "correta": false,
        "justificativa": "Incorreta. Focar exclusivamente nos aspectos biomédicos, sem qualquer espaço para acolhimento emocional, contraria os princípios do cuidado centrado na pessoa, especialmente relevante diante da vulnerabilidade emocional demonstrada por Renata."
      },
      {
        "letra": "B",
        "texto": "acolher as preocupações da paciente, validar suas emoções e fortalecer a rede de apoio (parceiro, família, equipe de saúde), sem menosprezar o impacto psicossocial da gestação não planejada sobre o momento de vida da paciente.",
        "correta": true,
        "justificativa": "A gestação, especialmente quando não planejada e associada a transições de vida importantes (como o início de curso superior, no caso de Renata), pode gerar ansiedade significativa; a equipe de saúde da família deve acolher essas emoções, validar as preocupações da paciente, fortalecer a rede de apoio disponível e integrar o cuidado emocional ao acompanhamento pré-natal biomédico, sem menosprezar o impacto psicossocial vivido pela gestante nesse momento específico de sua vida. Correta. Essa conduta reflete o cuidado integral e centrado na pessoa, acolhendo as preocupações emocionais de Renata e fortalecendo sua rede de apoio."
      },
      {
        "letra": "C",
        "texto": "orientar Renata a esconder suas dúvidas e ansiedades da equipe de saúde em consultas futuras, para não comprometer o andamento da consulta.",
        "correta": false,
        "justificativa": "Incorreta. Orientar a paciente a esconder suas dúvidas e ansiedades da equipe de saúde compromete a construção de vínculo de confiança e a identificação precoce de eventuais necessidades de suporte adicional."
      },
      {
        "letra": "D",
        "texto": "transferir imediatamente o caso para atendimento psiquiátrico especializado, sem qualquer abordagem inicial de acolhimento na própria consulta de pré-natal na atenção primária.",
        "correta": false,
        "justificativa": "Incorreta. A transferência imediata para atendimento psiquiátrico especializado, sem qualquer abordagem inicial de acolhimento na atenção primária, não é proporcional ao quadro descrito, que pode ser inicialmente acolhido pela própria equipe de saúde da família, reservando-se encaminhamento especializado para casos que efetivamente o justifiquem."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q12"
  },
  {
    "enunciado": "Durante aula sobre adaptações cardiovasculares da gestação, o professor explica que o volume sanguíneo total materno pode aumentar em até 50% ao longo da gravidez, acompanhado de aumento proporcional do débito cardíaco. Em relação à justificativa fisiológica para esse aumento expressivo, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "visa suprir o aumento da demanda metabólica materno-fetal e compensar a perda sanguínea esperada durante o parto.",
        "correta": true,
        "justificativa": "O aumento do volume sanguíneo total e do débito cardíaco ao longo da gestação visa suprir as crescentes demandas metabólicas da unidade materno-fetal (incluindo a perfusão placentária adequada) e preparar o organismo materno para a perda sanguínea esperada durante o parto (mesmo em partos vaginais sem complicações), representando adaptação fisiológica importante e não um efeito indesejável. Correta. Essa é a justificativa fisiológica correta para o aumento do volume sanguíneo e do débito cardíaco na gestação."
      },
      {
        "letra": "B",
        "texto": "decorre de resposta exclusiva a um estado de hipertireoidismo gestacional presente universalmente em todas as gestantes.",
        "correta": false,
        "justificativa": "Incorreta. Embora existam adaptações da função tireoidiana na gestação, o aumento do volume sanguíneo não decorre de hipertireoidismo gestacional universal, mecanismo incorreto para explicar essa adaptação cardiovascular."
      },
      {
        "letra": "C",
        "texto": "representa efeito colateral indesejável da gestação, sem qualquer função adaptativa reconhecida para o organismo materno.",
        "correta": false,
        "justificativa": "Incorreta. O aumento do volume sanguíneo tem função adaptativa clara e reconhecida (suprir demanda metabólica materno-fetal e compensar perda sanguínea do parto), não sendo mero efeito colateral indesejável."
      },
      {
        "letra": "D",
        "texto": "é consequência exclusiva do uso rotineiro de suplementação de ferro durante o pré-natal.",
        "correta": false,
        "justificativa": "Incorreta. O aumento do volume sanguíneo é fenômeno fisiológico próprio da gestação, independente do uso de suplementação de ferro, que trata apenas de eventual componente ferropriva associado, sem ser a causa desse aumento volêmico."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q13"
  },
  {
    "enunciado": "Ao revisar riscos gestacionais com Renata, a equipe de saúde menciona o estado de hipercoagulabilidade fisiológico da gravidez como fator relevante para orientações sobre mobilização e sinais de alerta a serem observados, especialmente próximo ao parto e no puerpério. Em relação a esse estado fisiológico de hipercoagulabilidade da gestação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "reduz o risco de doença tromboembólica ao longo da gestação e do puerpério, efeito oposto ao que efetivamente ocorre.",
        "correta": false,
        "justificativa": "Incorreta. O estado de hipercoagulabilidade gestacional aumenta, e não reduz, o risco de doença tromboembólica, sendo o oposto do afirmado."
      },
      {
        "letra": "B",
        "texto": "aumenta o risco de doença tromboembólica, especialmente associado à estase venosa de membros inferiores, sendo esse risco ainda mais relevante no puerpério.",
        "correta": true,
        "justificativa": "A gestação é estado fisiológico de hipercoagulabilidade (aumento de fatores pró-coagulantes e redução de fatores anticoagulantes naturais), associado a maior risco de tromboembolismo venoso, sendo a estase venosa (compressão de vasos pélvicos pelo útero gravídico e redução da mobilidade) fator contribuinte adicional, com risco especialmente relevante no puerpério imediato, período de maior incidência de eventos tromboembólicos relacionados à gestação. Correta. Essa é a relação correta entre hipercoagulabilidade gestacional, estase venosa e maior risco tromboembólico, especialmente relevante no puerpério."
      },
      {
        "letra": "C",
        "texto": "não tem qualquer relevância clínica reconhecida durante a gestação ou o puerpério, sendo achado apenas laboratorial sem repercussão prática.",
        "correta": false,
        "justificativa": "Incorreta. Há relevância clínica bem estabelecida desse estado de hipercoagulabilidade, com implicações práticas para orientações de mobilização e vigilância de sinais de alerta, contrariando a afirmação de ausência de relevância prática."
      },
      {
        "letra": "D",
        "texto": "ocorre exclusivamente em gestantes com diagnóstico confirmado de trombofilia hereditária, não sendo fenômeno fisiológico geral da gestação.",
        "correta": false,
        "justificativa": "Incorreta. O estado de hipercoagulabilidade é fenômeno fisiológico geral de toda gestação, e não exclusivo de gestantes com trombofilia hereditária confirmada, embora essas apresentem risco ainda maior quando associado ao estado fisiológico da gravidez."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q14"
  },
  {
    "enunciado": "Durante revisão sobre endocrinologia da gestação, os estudantes discutem como a manutenção hormonal da gravidez é assegurada ao longo de suas diferentes fases, desde a implantação até o parto, considerando as diferentes estruturas endócrinas envolvidas nesse processo. Em relação a essa produção hormonal ao longo da gestação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a fase ovariana (corpo lúteo gravídico) mantém a produção hormonal essencial da gestação inicial, até que a fase placentária assuma progressivamente essa função ao longo da gravidez.",
        "correta": true,
        "justificativa": "Inicialmente, o corpo lúteo gravídico (mantido pela ação do hCG produzido pelo trofoblasto) sustenta a produção de progesterona essencial à manutenção da gestação inicial; progressivamente, ao longo do primeiro trimestre, a placenta assume a função endócrina predominante, produzindo progesterona e outros hormônios essenciais à manutenção da gestação até o parto. Correta. Essa é a descrição correta da transição funcional entre o corpo lúteo e a placenta na produção hormonal ao longo da gestação."
      },
      {
        "letra": "B",
        "texto": "a placenta não desempenha qualquer função endócrina relevante ao longo da gestação, sendo essa função exclusivamente ovariana.",
        "correta": false,
        "justificativa": "Incorreta. A placenta tem função endócrina fundamental e bem estabelecida ao longo da gestação, produzindo diversos hormônios essenciais, não sendo correto afirmar ausência de função endócrina placentária."
      },
      {
        "letra": "C",
        "texto": "o corpo lúteo mantém, isoladamente, toda a produção hormonal necessária até o momento do parto, sem qualquer participação placentária.",
        "correta": false,
        "justificativa": "Incorreta. O corpo lúteo mantém a produção hormonal apenas na fase inicial da gestação, sendo progressivamente substituído pela função endócrina placentária, e não mantendo isoladamente toda a produção hormonal até o parto."
      },
      {
        "letra": "D",
        "texto": "não há qualquer produção hormonal ovariana relevante durante a gestação, sendo essa função exclusivamente placentária desde a implantação embrionária.",
        "correta": false,
        "justificativa": "Incorreta. Há, sim, produção hormonal ovariana relevante na fase inicial da gestação (pelo corpo lúteo gravídico), antes da assunção progressiva da função endócrina pela placenta."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q15"
  },
  {
    "enunciado": "Durante a consulta de pré-natal de Renata, a equipe realiza, além dos exames laboratoriais de rotina, medidas obstétricas seriadas, como altura uterina e ausculta dos batimentos cardíacos fetais, comparando os resultados com consultas anteriores registradas no cartão de pré-natal. A principal finalidade dessas medidas obstétricas seriadas ao longo do acompanhamento é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "avaliar exclusivamente o estado emocional da gestante, sem qualquer relação com parâmetros de saúde fetal.",
        "correta": false,
        "justificativa": "Incorreta. Essas medidas obstétricas avaliam parâmetros de saúde fetal (crescimento, vitalidade), e não o estado emocional da gestante, que deve ser avaliado por outros meios durante a consulta."
      },
      {
        "letra": "B",
        "texto": "monitorar o crescimento fetal e a vitalidade fetal ao longo da gestação, permitindo identificação precoce de desvios que possam exigir investigação adicional.",
        "correta": true,
        "justificativa": "A avaliação seriada da altura uterina e da ausculta dos batimentos cardíacos fetais ao longo das consultas de pré-natal permite o acompanhamento longitudinal do crescimento e da vitalidade fetal, possibilitando a identificação precoce de alterações (como restrição de crescimento fetal ou alteração da frequência cardíaca fetal) que exijam investigação complementar, sendo ferramenta simples, de baixo custo e amplamente aplicável na atenção primária. Correta. Essa é a finalidade central da avaliação seriada de altura uterina e ausculta de batimentos cardíacos fetais ao longo do pré-natal."
      },
      {
        "letra": "C",
        "texto": "substituir completamente a necessidade de qualquer exame de ultrassonografia obstétrica ao longo do pré-natal.",
        "correta": false,
        "justificativa": "Incorreta. Essas medidas obstétricas complementam, mas não substituem, a ultrassonografia obstétrica, que fornece informações adicionais e mais detalhadas sobre a anatomia e o crescimento fetal."
      },
      {
        "letra": "D",
        "texto": "determinar exclusivamente a data provável do parto, sem qualquer outra utilidade clínica reconhecida ao longo do acompanhamento.",
        "correta": false,
        "justificativa": "Incorreta. Embora a altura uterina possa auxiliar na estimativa da idade gestacional em alguns contextos, sua principal utilidade ao longo do pré-natal está relacionada ao monitoramento do crescimento fetal, e não exclusivamente à determinação da data provável do parto."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q16"
  },
  {
    "enunciado": "Ao final da consulta de pré-natal, a equipe orienta Renata sobre sinais de alerta que devem motivar procura imediata ao serviço de saúde, incluindo a perda de líquido vaginal. Em relação à justificativa clínica para essa orientação específica, é correto afirmar que a perda de líquido vaginal",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "pode indicar amniorrexe (ruptura das membranas ovulares), associada a risco de infecção ovular (corioamnionite) e à necessidade de avaliação do bem-estar fetal e da via de parto.",
        "correta": true,
        "justificativa": "A perda de líquido vaginal pode representar ruptura das membranas ovulares (amniorrexe), associada a risco de corioamnionite (infecção ovular) quando há demora na avaliação e conduta apropriadas, além de exigir avaliação imediata do bem-estar materno-fetal e definição da via e do momento do parto, sendo por isso incluída entre os sinais de alerta orientados rotineiramente às gestantes. Correta. Essa é a justificativa clínica correta para a orientação sobre procura imediata ao serviço de saúde diante de perda de líquido vaginal."
      },
      {
        "letra": "B",
        "texto": "é sempre um sinal totalmente benigno na gestação, sem qualquer necessidade de avaliação médica em qualquer momento gestacional.",
        "correta": false,
        "justificativa": "Incorreta. A perda de líquido vaginal não é sempre um sinal benigno; pode representar ruptura de membranas, com implicações clínicas relevantes que exigem avaliação, especialmente conforme a idade gestacional."
      },
      {
        "letra": "C",
        "texto": "indica exclusivamente incontinência urinária de esforço, sem qualquer outra implicação clínica relevante a ser considerada.",
        "correta": false,
        "justificativa": "Incorreta. Embora incontinência urinária deva ser considerada no diagnóstico diferencial, a perda de líquido vaginal tem implicações mais amplas relacionadas à possibilidade de amniorrexe, que é justamente a razão da orientação de alerta."
      },
      {
        "letra": "D",
        "texto": "não tem relação alguma com o processo de trabalho de parto ou com riscos associados à gestação.",
        "correta": false,
        "justificativa": "Incorreta. A perda de líquido vaginal (amniorrexe) tem relação direta e relevante com o processo de trabalho de parto e com riscos associados à gestação, sendo esse justamente o motivo da orientação de alerta fornecida às gestantes."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q17"
  },
  {
    "enunciado": "No acompanhamento pré-natal de Renata, a Agente Comunitária de Saúde (ACS) realiza visitas domiciliares regulares, reforçando orientações sobre sinais de alerta e a importância de comparecer às consultas agendadas. Em relação ao papel da ACS nesse contexto de acompanhamento pré-natal, é correto afirmar que ela",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não tem qualquer atribuição relacionada ao acompanhamento da saúde materna no território, sendo essa função exclusiva da equipe médica e de enfermagem.",
        "correta": false,
        "justificativa": "Incorreta. A ACS tem atribuições relevantes e bem reconhecidas relacionadas ao acompanhamento da saúde materna no território, especialmente em ações de educação em saúde e vínculo comunitário."
      },
      {
        "letra": "B",
        "texto": "contribui para a educação em saúde, identificação de sinais de alerta, articulação com a rede de referência e fortalecimento do vínculo entre a gestante e o serviço de saúde.",
        "correta": true,
        "justificativa": "A Agente Comunitária de Saúde tem papel importante na educação em saúde da população de sua área de abrangência, no reconhecimento e reforço de sinais de alerta durante a gestação, na articulação com a rede de referência e no fortalecimento do vínculo entre a gestante e a equipe de saúde da família, sendo elemento fundamental da atenção primária à saúde no acompanhamento pré-natal, sem substituir, mas complementando o trabalho médico e de enfermagem. Correta. Esse é o papel correto da ACS no acompanhamento pré-natal, complementando a atuação da equipe médica e de enfermagem."
      },
      {
        "letra": "C",
        "texto": "deve substituir integralmente as consultas médicas e de enfermagem do pré-natal, dispensando o acompanhamento por esses profissionais.",
        "correta": false,
        "justificativa": "Incorreta. A ACS não substitui as consultas médicas e de enfermagem do pré-natal, que continuam sendo necessárias para avaliação clínica, laboratorial e obstétrica específica; seu papel é complementar."
      },
      {
        "letra": "D",
        "texto": "atua exclusivamente em situações de emergência obstétrica já instaladas, sem qualquer papel na prevenção ou educação em saúde durante o pré-natal.",
        "correta": false,
        "justificativa": "Incorreta. A ACS tem papel relevante em ações preventivas e educativas ao longo de todo o acompanhamento pré-natal, e não apenas em situações de emergência obstétrica já instaladas."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q18"
  },
  {
    "enunciado": "Durante aula sobre metabolismo materno na gestação, o professor destaca que o consumo de oxigênio materno aumenta cerca de 15 a 20% ao longo da gravidez, fenômeno relevante para compreender algumas queixas respiratórias relatadas por gestantes, como discreta sensação de falta de ar aos esforços. A principal justificativa fisiológica para esse aumento do consumo de oxigênio é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "redução do metabolismo basal materno ao longo da gestação, fenômeno oposto ao efetivamente esperado.",
        "correta": false,
        "justificativa": "Incorreta. O metabolismo basal materno tende a aumentar, e não reduzir, ao longo da gestação, para suprir as maiores demandas metabólicas da unidade materno-fetal."
      },
      {
        "letra": "B",
        "texto": "aumento das necessidades metabólicas da unidade materno-fetal e do trabalho cardiorrespiratório materno necessário para supri-las.",
        "correta": true,
        "justificativa": "O aumento do consumo de oxigênio na gestação reflete as maiores necessidades metabólicas da unidade materno-fetal (crescimento fetal, placenta, tecidos maternos em adaptação), associado ao maior trabalho cardíaco e respiratório materno necessário para suprir essa demanda aumentada, explicando também, em parte, queixas comuns de discreta dispneia aos esforços relatadas por gestantes. Correta. Essa é a justificativa fisiológica correta para o aumento do consumo de oxigênio observado na gestação."
      },
      {
        "letra": "C",
        "texto": "diminuição da demanda de oxigênio pelos tecidos maternos ao longo da gestação, fenômeno oposto ao efetivamente esperado.",
        "correta": false,
        "justificativa": "Incorreta. Há aumento, e não diminuição, da demanda de oxigênio pelos tecidos maternos e fetais ao longo da gestação."
      },
      {
        "letra": "D",
        "texto": "ausência completa de qualquer alteração relevante no metabolismo materno ao longo da gestação normal.",
        "correta": false,
        "justificativa": "Incorreta. Há alteração metabólica relevante e bem documentada ao longo da gestação normal, contrariando a afirmação de ausência de qualquer alteração."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q19"
  },
  {
    "enunciado": "Diante da labilidade emocional relatada por Renata durante o acompanhamento pré-natal, a equipe de saúde da família reflete sobre a melhor forma de conduzir a comunicação nas consultas subsequentes, buscando equilibrar acolhimento emocional e avaliação clínica objetiva. Em relação a um princípio importante da comunicação em saúde nesse contexto específico, é correto afirmar que a equipe deve",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "desconsiderar completamente as queixas emocionais de Renata, por serem consideradas normais e, portanto, sem necessidade de escuta específica durante a consulta.",
        "correta": false,
        "justificativa": "Incorreta. Desconsiderar completamente as queixas emocionais, mesmo sendo esperadas, priva a paciente de acolhimento adequado e pode dificultar a identificação de eventual sofrimento psíquico mais significativo que necessite de atenção adicional."
      },
      {
        "letra": "B",
        "texto": "praticar escuta ativa, validar as emoções da gestante e adaptar a comunicação às suas necessidades específicas, sem patologizar reações emocionais esperadas para esse contexto de vida.",
        "correta": true,
        "justificativa": "A relação médico-paciente com a gestante deve valorizar a escuta ativa e o acolhimento das emoções relatadas, reconhecendo que determinada labilidade emocional é esperada nesse contexto de transformação física e psicológica da gestação, sem patologizá-la desnecessariamente, mas também sem negligenciá-la, adaptando a comunicação às necessidades individuais da paciente ao longo de todo o acompanhamento pré-natal. Correta. Essa é a abordagem de comunicação em saúde mais adequada para o contexto descrito, equilibrando escuta ativa e acolhimento emocional sem patologização desnecessária."
      },
      {
        "letra": "C",
        "texto": "impor decisões clínicas à gestante sem qualquer diálogo prévio sobre suas dúvidas, preocupações ou preferências pessoais.",
        "correta": false,
        "justificativa": "Incorreta. Impor decisões clínicas sem diálogo prévio contraria os princípios do cuidado centrado na pessoa e da tomada de decisão compartilhada, especialmente relevantes no acompanhamento de uma gestante em momento de vulnerabilidade emocional."
      },
      {
        "letra": "D",
        "texto": "restringir toda a comunicação exclusivamente a informações técnicas sobre exames laboratoriais, sem qualquer espaço para expressão emocional durante a consulta.",
        "correta": false,
        "justificativa": "Incorreta. Restringir a comunicação exclusivamente a aspectos técnicos, sem qualquer espaço para expressão emocional, não contempla as necessidades psicossociais evidenciadas por Renata ao longo do acompanhamento."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP3_ENAMED — Q20"
  },
  {
    "enunciado": "Priscila, em trabalho de parto na maternidade, tem sua evolução acompanhada pela equipe obstétrica por meio de um instrumento gráfico específico, no qual são registrados, ao longo do tempo, a dilatação cervical, a descida da apresentação fetal, as contrações uterinas e os batimentos cardíacos fetais. Esse instrumento é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "cardiotocograma isolado, exame distinto do instrumento gráfico completo utilizado para acompanhamento do trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O cardiotocograma é exame específico de monitorização da frequência cardíaca fetal e das contrações uterinas, sendo instrumento distinto (embora complementar) do partograma completo."
      },
      {
        "letra": "B",
        "texto": "partograma.",
        "correta": true,
        "justificativa": "O partograma é a representação gráfica utilizada para acompanhar a evolução do trabalho de parto, registrando dilatação cervical, altura da apresentação fetal, contrações uterinas e batimentos cardíacos fetais, permitindo identificar desvios da evolução esperada e orientar a conduta obstétrica. Correta. Partograma é exatamente o instrumento gráfico descrito, utilizado para acompanhamento da evolução do trabalho de parto."
      },
      {
        "letra": "C",
        "texto": "cartão de pré-natal, documento distinto utilizado ao longo da gestação, e não especificamente durante o trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O cartão de pré-natal é documento de acompanhamento ao longo de toda a gestação, distinto do partograma, que é específico do período de trabalho de parto."
      },
      {
        "letra": "D",
        "texto": "boletim de Apgar, instrumento utilizado para avaliação do recém-nascido logo após o nascimento, e não durante o trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O boletim de Apgar avalia a vitalidade do recém-nascido nos primeiros minutos após o nascimento, sendo instrumento distinto do partograma, utilizado durante o trabalho de parto."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q1"
  },
  {
    "enunciado": "Após o nascimento de seu bebê, Priscila é informada pela equipe de enfermagem que permanecerá em acompanhamento até o retorno completo de seu organismo às condições anteriores à gestação, processo que se estende por algumas semanas e é dividido em diferentes fases. Esse período que se estende do parto até o retorno dos órgãos genitais e do estado geral da mulher às condições pré-gestacionais é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "climatério, período relacionado à transição hormonal da meia-idade, sem relação com o período pós-parto.",
        "correta": false,
        "justificativa": "Incorreta. Climatério é fase de transição hormonal relacionada à meia-idade da mulher, sem qualquer relação com o período pós-parto descrito."
      },
      {
        "letra": "B",
        "texto": "puerpério.",
        "correta": true,
        "justificativa": "Puerpério é o período que se inicia após o parto e se estende até o retorno das condições anatômicas e funcionais maternas ao estado pré-gestacional, sendo didaticamente dividido em puerpério imediato, mediato e tardio, cada um com características e riscos específicos que exigem vigilância adequada. Correta. Puerpério é exatamente o período descrito: do parto até o retorno das condições pré-gestacionais."
      },
      {
        "letra": "C",
        "texto": "menacme, período que designa toda a vida reprodutiva da mulher, sem relação específica com o pós-parto.",
        "correta": false,
        "justificativa": "Incorreta. Menacme designa todo o período reprodutivo da mulher, da menarca à menopausa, e não especificamente o período pós-parto."
      },
      {
        "letra": "D",
        "texto": "perimenopausa, período relacionado à transição para a menopausa, sem relação com o pós-parto.",
        "correta": false,
        "justificativa": "Incorreta. Perimenopausa é período relacionado à transição para a menopausa, sem qualquer relação com o período pós-parto descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q2"
  },
  {
    "enunciado": "O parto de Priscila evoluiu por via vaginal, com progressão espontânea da dilatação cervical e da descida fetal, sem necessidade de qualquer intervenção instrumental ou cirúrgica adicional. Esse tipo de parto, com evolução espontânea e sem intercorrências que exijam intervenção, é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "parto distócico, termo que designa parto com necessidade de alguma forma de intervenção, ao contrário do descrito.",
        "correta": false,
        "justificativa": "Incorreta. Parto distócico é justamente o termo que designa parto com necessidade de intervenção, contrário à evolução espontânea descrita no caso de Priscila."
      },
      {
        "letra": "B",
        "texto": "parto eutócico.",
        "correta": true,
        "justificativa": "O parto eutócico é aquele que evolui espontaneamente por via vaginal, sem necessidade de intervenções (como fórceps, vácuo-extrator ou cesárea) para sua resolução, em oposição ao parto distócico, que exige alguma forma de intervenção devido a intercorrências durante o trabalho de parto. Correta. Parto eutócico é exatamente o termo correto para o tipo de parto descrito: evolução espontânea, sem necessidade de intervenção."
      },
      {
        "letra": "C",
        "texto": "parto cesáreo eletivo, termo que designa parto por via abdominal programada, distinto do parto vaginal descrito.",
        "correta": false,
        "justificativa": "Incorreta. Parto cesáreo eletivo é procedimento cirúrgico por via abdominal programado previamente, distinto do parto vaginal espontâneo descrito no caso."
      },
      {
        "letra": "D",
        "texto": "parto instrumental por fórceps, termo que designa parto vaginal com auxílio de instrumento específico, não utilizado no caso descrito.",
        "correta": false,
        "justificativa": "Incorreta. Parto instrumental por fórceps envolve uso de instrumento específico para auxiliar a expulsão fetal, não correspondendo à evolução espontânea descrita no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q3"
  },
  {
    "enunciado": "Priscila, com histórico de sobrepeso, realiza teste de tolerância à glicose durante o segundo trimestre da gestação, sendo diagnosticada com diabetes mellitus gestacional. Segundo o critério mais rigoroso atualmente adotado para esse diagnóstico, considera-se diabetes gestacional a partir de glicemia de jejum igual ou superior a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "70 mg/dL, valor considerado normal, e não diagnóstico de diabetes gestacional.",
        "correta": false,
        "justificativa": "Incorreta. 70 mg/dL é valor de glicemia de jejum considerado normal, e não diagnóstico de diabetes gestacional."
      },
      {
        "letra": "B",
        "texto": "92 mg/dL.",
        "correta": true,
        "justificativa": "A Organização Mundial da Saúde passou a recomendar critério mais rigoroso para diabetes gestacional, considerando diagnóstico a partir de glicemia de jejum igual ou superior a 92 mg/dL, valor que anteriormente era considerado normal pelos critérios mais antigos, refletindo maior sensibilidade diagnóstica para identificar gestantes em risco de complicações relacionadas à hiperglicemia. Correta. 92 mg/dL é o valor de glicemia de jejum correspondente ao critério mais rigoroso atualmente adotado para diagnóstico de diabetes gestacional."
      },
      {
        "letra": "C",
        "texto": "126 mg/dL, valor correspondente ao critério diagnóstico de diabetes mellitus fora da gestação, e não ao critério gestacional mais rigoroso adotado.",
        "correta": false,
        "justificativa": "Incorreta. 126 mg/dL é o critério diagnóstico de diabetes mellitus em jejum fora da gestação (critério mais antigo, menos sensível para o contexto gestacional)."
      },
      {
        "letra": "D",
        "texto": "200 mg/dL em qualquer momento do dia, valor correspondente a outro critério diagnóstico de diabetes, e não ao critério gestacional descrito.",
        "correta": false,
        "justificativa": "Incorreta. 200 mg/dL corresponde a critério diagnóstico de diabetes em glicemia casual (a qualquer momento do dia associada a sintomas), e não ao critério de jejum gestacional mais rigoroso descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q4"
  },
  {
    "enunciado": "O recém-nascido de Priscila, filho de mãe com diabetes gestacional, apresenta peso de nascimento elevado para a idade gestacional, achado que já era esperado pela equipe neonatal, que também monitoriza atentamente a glicemia do bebê nas primeiras horas de vida. Esse recém-nascido apresenta maior risco de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "macrossomia fetal e hipoglicemia neonatal.",
        "correta": true,
        "justificativa": "Filhos de mães com diabetes gestacional apresentam maior risco de macrossomia fetal (pelo hiperinsulinismo fetal compensatório à hiperglicemia materna) e de complicações metabólicas neonatais, como hipoglicemia e hipocalcemia após o nascimento, exigindo monitorização especial da glicemia neonatal nas primeiras horas de vida. Correta. Macrossomia fetal e hipoglicemia neonatal são as complicações classicamente associadas e esperadas em filhos de mães com diabetes gestacional."
      },
      {
        "letra": "B",
        "texto": "microcefalia isolada, achado não característico de filhos de mães com diabetes gestacional.",
        "correta": false,
        "justificativa": "Incorreta. Microcefalia não é achado característico associado ao diabetes gestacional materno; ao contrário, o achado esperado é a macrossomia (aumento, e não redução, do tamanho fetal)."
      },
      {
        "letra": "C",
        "texto": "ausência completa de qualquer complicação metabólica neonatal, apesar do diagnóstico materno de diabetes gestacional.",
        "correta": false,
        "justificativa": "Incorreta. Há, sim, risco relevante de complicações metabólicas neonatais em filhos de mães com diabetes gestacional, contrariando a afirmação de ausência completa de risco."
      },
      {
        "letra": "D",
        "texto": "hipertireoidismo neonatal isolado, achado não característico de filhos de mães com diabetes gestacional.",
        "correta": false,
        "justificativa": "Incorreta. Hipertireoidismo neonatal não é achado característico associado ao diabetes gestacional materno, sendo as complicações metabólicas esperadas relacionadas principalmente ao metabolismo glicêmico e do cálcio."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q5"
  },
  {
    "enunciado": "Priscila, primigesta, encontra-se em trabalho de parto ativo há várias horas. Ao revisar o partograma, a equipe observa que a curva de dilatação cervical ultrapassou a linha de alerta traçada no gráfico. Essa situação indica que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o trabalho de parto está evoluindo de forma inteiramente normal, sem qualquer necessidade de atenção especial adicional por parte da equipe.",
        "correta": false,
        "justificativa": "Incorreta. A ultrapassagem da linha de alerta indica desvio da evolução esperada, exigindo atenção especial, e não uma evolução considerada inteiramente normal e sem necessidade de vigilância adicional."
      },
      {
        "letra": "B",
        "texto": "a evolução do trabalho de parto está mais lenta que o esperado, exigindo maior vigilância clínica e reavaliação mais atenta da paciente.",
        "correta": true,
        "justificativa": "A ultrapassagem da linha de alerta no partograma sinaliza evolução mais lenta que o esperado para o trabalho de parto, devendo motivar maior vigilância clínica e reavaliação mais atenta da parturiente (avaliação de contrações, posição fetal, eventual necessidade de intervenções específicas), sem que isso implique, por si só, indicação automática de cesárea. Correta. Essa é a interpretação correta da ultrapassagem da linha de alerta no partograma: sinal de evolução mais lenta que exige maior atenção clínica."
      },
      {
        "letra": "C",
        "texto": "há indicação obrigatória e imediata de cesárea nesse momento específico, apenas pela ultrapassagem da linha de alerta.",
        "correta": false,
        "justificativa": "Incorreta. A ultrapassagem da linha de alerta, isoladamente, não indica cesárea obrigatória e imediata; a decisão depende de avaliação clínica mais ampla, incluindo eventual ultrapassagem também da linha de ação e outros parâmetros."
      },
      {
        "letra": "D",
        "texto": "a bolsa das águas deve ser rota imediatamente nesse momento, independentemente da situação clínica geral apresentada pela paciente.",
        "correta": false,
        "justificativa": "Incorreta. A rotura da bolsa das águas não é conduta automaticamente indicada apenas pela ultrapassagem da linha de alerta, devendo essa decisão ser individualizada conforme avaliação clínica completa."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q6"
  },
  {
    "enunciado": "Priscila, primigesta, com feto em apresentação cefálica, é reavaliada durante o trabalho de parto e a equipe identifica desproporção céfalo-pélvica, com o recém-nascido posteriormente confirmado com peso elevado para a idade gestacional (achado compatível com macrossomia associada ao diabetes gestacional materno). Diante dessa desproporção confirmada durante o trabalho de parto, a conduta indicada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "parto vaginal instrumentalizado com fórceps, independentemente da desproporção céfalo-pélvica confirmada.",
        "correta": false,
        "justificativa": "Incorreta. O uso de fórceps não resolve uma desproporção céfalo-pélvica mecânica confirmada, podendo, inclusive, aumentar o risco de complicações maternas e fetais nessa situação específica."
      },
      {
        "letra": "B",
        "texto": "parto cesáreo, pela impossibilidade mecânica de progressão adequada do parto por via vaginal diante dessa condição.",
        "correta": true,
        "justificativa": "A desproporção céfalo-pélvica, quando confirmada durante o trabalho de parto, constitui indicação de parto cesáreo, pela impossibilidade mecânica de progressão adequada do parto por via vaginal, sendo essa uma das principais indicações obstétricas clássicas de cesárea, especialmente relevante em casos de macrossomia fetal associada a diabetes gestacional materno, como no caso de Priscila. Correta. A cesárea é a conduta indicada diante de desproporção céfalo-pélvica confirmada, pela impossibilidade mecânica de progressão adequada do parto vaginal."
      },
      {
        "letra": "C",
        "texto": "aceleração do trabalho de parto com ocitocina em altas doses, sem qualquer outra consideração sobre a desproporção identificada.",
        "correta": false,
        "justificativa": "Incorreta. Acelerar o trabalho de parto com ocitocina não resolve uma desproporção mecânica estrutural entre a apresentação fetal e a bacia materna, podendo, inclusive, aumentar riscos como ruptura uterina sem benefício real."
      },
      {
        "letra": "D",
        "texto": "manutenção do trabalho de parto por tempo indeterminado, sem qualquer reavaliação adicional da situação clínica.",
        "correta": false,
        "justificativa": "Incorreta. Manter o trabalho de parto por tempo indeterminado, diante de desproporção confirmada, aumenta o risco de complicações maternas e fetais graves, não sendo conduta segura ou apropriada."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q7"
  },
  {
    "enunciado": "Durante o preenchimento do partograma de Priscila, a equipe utiliza símbolos gráficos padronizados para representar diferentes parâmetros da evolução do trabalho de parto. O símbolo utilizado para registrar a dilatação cervical, correlacionado à escala numérica à esquerda do gráfico, é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "círculo, símbolo utilizado para representar outro parâmetro do partograma, e não a dilatação cervical.",
        "correta": false,
        "justificativa": "Incorreta. O círculo é o símbolo utilizado para representar a altura da apresentação fetal, e não a dilatação cervical, no partograma convencional."
      },
      {
        "letra": "B",
        "texto": "triângulo.",
        "correta": true,
        "justificativa": "No partograma, o triângulo representa a dilatação cervical (correlacionada à escala numérica à esquerda do gráfico, geralmente de 0 a 10 cm), enquanto o círculo representa a altura da apresentação fetal (planos de De Lee ou Hodge), sendo essa diferenciação de símbolos importante para a interpretação correta do gráfico ao longo do acompanhamento do trabalho de parto. Correta. O triângulo é exatamente o símbolo utilizado para representar a dilatação cervical no partograma, correlacionado à escala à esquerda do gráfico."
      },
      {
        "letra": "C",
        "texto": "quadrado preenchido, símbolo não utilizado convencionalmente para representar a dilatação cervical no partograma.",
        "correta": false,
        "justificativa": "Incorreta. Quadrado preenchido não é símbolo convencional do partograma para representar dilatação cervical."
      },
      {
        "letra": "D",
        "texto": "losango, símbolo não utilizado convencionalmente para representar a dilatação cervical no partograma.",
        "correta": false,
        "justificativa": "Incorreta. Losango não é símbolo convencional do partograma para representar dilatação cervical."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q8"
  },
  {
    "enunciado": "Em uma reunião municipal de saúde, discute-se o alto índice de cesarianas observado na maternidade onde Priscila foi atendida, muito acima da média recomendada pela Organização Mundial da Saúde. Entre as estratégias preconizadas para reduzir cesarianas desnecessárias no serviço, destaca-se",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "eliminar completamente a indicação de cesárea em qualquer situação clínica, independentemente da presença de indicação médica real.",
        "correta": false,
        "justificativa": "Incorreta. Eliminar completamente a indicação de cesárea, mesmo diante de situações clínicas que efetivamente a justificam, comprometeria a segurança materno-fetal, sendo conduta inadequada e perigosa."
      },
      {
        "letra": "B",
        "texto": "adotar protocolos com diretrizes claras para indicação de cesárea, associados à promoção do parto humanizado e ao suporte contínuo à parturiente ao longo do trabalho de parto.",
        "correta": true,
        "justificativa": "A adoção de protocolos com diretrizes clínicas claras para indicação de cesárea, associada à promoção do parto humanizado (incluindo suporte contínuo à parturiente, uso racional de intervenções e respeito ao tempo fisiológico do parto), é estratégia reconhecida para reduzir cesarianas desnecessárias, sem comprometer a segurança materno-fetal nos casos em que a cesárea é, de fato, clinicamente indicada. Correta. Essa é a estratégia reconhecida e recomendada para redução de cesarianas desnecessárias, preservando a segurança nos casos com indicação clínica real."
      },
      {
        "letra": "C",
        "texto": "aumentar a indicação de cesárea eletiva sem indicação médica específica, apenas por preferência pessoal, sem qualquer discussão prévia sobre riscos e benefícios.",
        "correta": false,
        "justificativa": "Incorreta. Aumentar a indicação de cesárea eletiva sem indicação médica específica vai na direção oposta ao objetivo de reduzir cesarianas desnecessárias discutido na reunião."
      },
      {
        "letra": "D",
        "texto": "reduzir o número de consultas de pré-natal oferecidas à população, como estratégia indireta para diminuir a indicação de cesárea.",
        "correta": false,
        "justificativa": "Incorreta. Reduzir o número de consultas de pré-natal comprometeria a qualidade do acompanhamento gestacional, sem relação lógica direta com a redução de cesarianas desnecessárias, podendo, inclusive, agravar outros desfechos obstétricos."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q9"
  },
  {
    "enunciado": "Durante aula sobre mecanismo de parto, o professor descreve o primeiro tempo desse processo, no qual a apresentação fetal (cefálica, no caso descrito) penetra no estreito superior da bacia materna, antes de qualquer rotação ou progressão adicional. Esse primeiro tempo do mecanismo do parto normal é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "insinuação.",
        "correta": true,
        "justificativa": "A insinuação corresponde à passagem da apresentação fetal (no caso, cefálica) pelo estreito superior da bacia materna, sendo o primeiro tempo do mecanismo de parto, antecedendo a descida, a rotação interna, o desprendimento cefálico, a rotação externa e o desprendimento do tronco fetal. Correta. Insinuação é exatamente o primeiro tempo do mecanismo de parto descrito no enunciado."
      },
      {
        "letra": "B",
        "texto": "rotação interna, tempo posterior do mecanismo de parto, e não o primeiro tempo descrito.",
        "correta": false,
        "justificativa": "Incorreta. Rotação interna é tempo posterior do mecanismo de parto, que ocorre após a descida da apresentação fetal, e não o primeiro tempo."
      },
      {
        "letra": "C",
        "texto": "desprendimento cefálico, tempo posterior do mecanismo de parto, e não o primeiro tempo descrito.",
        "correta": false,
        "justificativa": "Incorreta. Desprendimento cefálico é tempo posterior do mecanismo de parto, que ocorre após a rotação interna, e não o primeiro tempo."
      },
      {
        "letra": "D",
        "texto": "rotação externa, tempo posterior do mecanismo de parto, e não o primeiro tempo descrito.",
        "correta": false,
        "justificativa": "Incorreta. Rotação externa é tempo posterior do mecanismo de parto, que ocorre após o desprendimento cefálico, e não o primeiro tempo."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q10"
  },
  {
    "enunciado": "Priscila retorna à UBS para consulta de puerpério 60 dias após o parto, ocasião em que é submetida a teste de tolerância à glicose de 75g, com valor de 198 mg/dL após 2 horas, seguindo protocolo de reavaliação metabólica pós-parto por seu histórico de diabetes gestacional. Esse resultado sugere",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "resultado considerado normal para o período pós-parto, sem necessidade de qualquer investigação adicional nesse momento.",
        "correta": false,
        "justificativa": "Incorreta. O valor de 198 mg/dL após 2 horas está muito acima do considerado normal, não sendo compatível com resultado normal para o período pós-parto."
      },
      {
        "letra": "B",
        "texto": "provável persistência de intolerância à glicose/diabetes mellitus, exigindo investigação e seguimento específico após o período gestacional.",
        "correta": true,
        "justificativa": "Um teste de tolerância à glicose alterado (198 mg/dL após 2 horas, valor bem acima do limite normal) no seguimento pós-parto de mulher com diabetes gestacional sugere provável persistência de intolerância à glicose ou diabetes mellitus estabelecido, sendo necessário seguimento clínico e laboratorial específico, dado o risco significativamente aumentado de diabetes tipo 2 ao longo da vida em mulheres com esse histórico. Correta. Esse resultado sugere persistência de alteração glicêmica significativa, exigindo investigação e seguimento específico após a gestação."
      },
      {
        "letra": "C",
        "texto": "hipoglicemia materna significativa, achado incompatível com o valor glicêmico relatado.",
        "correta": false,
        "justificativa": "Incorreta. O valor relatado (198 mg/dL) representa hiperglicemia, e não hipoglicemia, sendo incompatível com essa alternativa."
      },
      {
        "letra": "D",
        "texto": "resultado que exclui definitivamente qualquer alteração futura do metabolismo glicídico de Priscila.",
        "correta": false,
        "justificativa": "Incorreta. O resultado alterado sugere, ao contrário, maior probabilidade de alteração futura do metabolismo glicídico, e não exclusão definitiva dessa possibilidade."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q11"
  },
  {
    "enunciado": "O recém-nascido de Priscila, com peso de nascimento de 4200 g, apresenta, nas primeiras horas de vida, hipoglicemia e hipocalcemia, achados que motivam monitorização intensiva pela equipe neonatal. Considerando o histórico materno de diabetes gestacional, a explicação fisiopatológica mais adequada para essas complicações neonatais é que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o hiperinsulinismo fetal, desenvolvido em resposta à hiperglicemia materna crônica ao longo da gestação, provoca queda abrupta da glicemia neonatal após a interrupção do suprimento materno de glicose ao nascimento, além de predispor a hipocalcemia associada.",
        "correta": true,
        "justificativa": "A hiperglicemia materna crônica ao longo da gestação estimula hiperinsulinismo fetal compensatório; ao nascimento, com a interrupção abrupta do suprimento materno de glicose (que atravessava a placenta), o excesso de insulina fetal provoca hipoglicemia neonatal significativa, além de predispor a hipocalcemia, sendo esses os achados clássicos e esperados no recém-nascido de mãe com diabetes gestacional mal controlado, como ilustrado pelo caso de Priscila. Correta. Essa é a explicação fisiopatológica correta e completa para a hipoglicemia e hipocalcemia neonatais no contexto de diabetes gestacional materno."
      },
      {
        "letra": "B",
        "texto": "não há qualquer relação reconhecida entre o diabetes gestacional materno e as alterações metabólicas apresentadas pelo recém-nascido.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida e reconhecida entre o diabetes gestacional materno e as complicações metabólicas neonatais descritas, contrariando a afirmação de ausência de relação."
      },
      {
        "letra": "C",
        "texto": "trata-se de hipoinsulinismo fetal isolado, sem qualquer relação com a hiperglicemia materna previamente identificada durante a gestação.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo fisiopatológico envolve, na verdade, hiperinsulinismo fetal (e não hipoinsulinismo), como resposta compensatória à hiperglicemia materna crônica."
      },
      {
        "letra": "D",
        "texto": "essas alterações decorrem exclusivamente do tipo de anestesia utilizada durante o parto, sem qualquer relação com o diabetes materno.",
        "correta": false,
        "justificativa": "Incorreta. As alterações metabólicas descritas têm relação direta e bem estabelecida com o diabetes gestacional materno, e não com o tipo de anestesia utilizada durante o parto."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q12"
  },
  {
    "enunciado": "Durante revisão detalhada sobre o mecanismo do parto normal em apresentação cefálica, como o observado no parto de Priscila, os estudantes buscam memorizar a sequência correta dos principais tempos desse processo, desde a entrada da apresentação fetal na bacia materna até o desprendimento completo do concepto. Essa sequência correta é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "insinuação, descida, rotação interna, desprendimento cefálico, rotação externa e desprendimento do tronco.",
        "correta": true,
        "justificativa": "A sequência correta do mecanismo de parto em apresentação cefálica é: insinuação (entrada no estreito superior), descida (progressão pela bacia), rotação interna (ajuste rotacional da apresentação), desprendimento cefálico, rotação externa (restituição, ajuste final da cabeça em relação ao tronco) e, por fim, desprendimento do tronco fetal. Correta. Essa é a sequência correta e didaticamente estabelecida dos tempos do mecanismo de parto cefálico."
      },
      {
        "letra": "B",
        "texto": "desprendimento cefálico, insinuação, rotação externa, descida, rotação interna e desprendimento do tronco, sequência incorreta em relação à ordem real do mecanismo de parto.",
        "correta": false,
        "justificativa": "Incorreta. A ordem apresentada está invertida em relação à sequência real, iniciando incorretamente pelo desprendimento cefálico, que deveria ocorrer após vários tempos anteriores."
      },
      {
        "letra": "C",
        "texto": "rotação externa, insinuação, descida, desprendimento cefálico, rotação interna e desprendimento do tronco, sequência incorreta em relação à ordem real do mecanismo de parto.",
        "correta": false,
        "justificativa": "Incorreta. A ordem apresentada inicia incorretamente pela rotação externa, que deveria ocorrer apenas após o desprendimento cefálico, e não no início da sequência."
      },
      {
        "letra": "D",
        "texto": "descida, desprendimento do tronco, insinuação, rotação interna, rotação externa e desprendimento cefálico, sequência incorreta em relação à ordem real do mecanismo de parto.",
        "correta": false,
        "justificativa": "Incorreta. A ordem apresentada inicia com a descida antes da insinuação e coloca o desprendimento do tronco antes de diversos tempos anteriores necessários, invertendo a sequência real do mecanismo de parto."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q13"
  },
  {
    "enunciado": "Ao revisar o partograma de Priscila com os residentes, o obstetra explica o significado da linha de ação, situada à direita da linha de alerta no gráfico, e como sua ultrapassagem deve orientar a conduta da equipe assistencial durante o trabalho de parto. Em relação à linha de ação no partograma, é correto afirmar que sua ultrapassagem",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "indica necessidade obrigatória e automática de cesárea imediata, sem qualquer outra possibilidade de conduta a ser considerada pela equipe.",
        "correta": false,
        "justificativa": "Incorreta. A ultrapassagem da linha de ação não implica cesárea obrigatória e automática; a conduta deve ser individualizada conforme avaliação clínica completa da situação."
      },
      {
        "letra": "B",
        "texto": "sinaliza a necessidade de intervenção clínica, não necessariamente cirúrgica, diante de evolução insatisfatória do trabalho de parto, cabendo avaliação individualizada da situação.",
        "correta": true,
        "justificativa": "A ultrapassagem da linha de ação, situada à direita da linha de alerta no partograma, sinaliza necessidade de intervenção clínica diante da evolução insatisfatória do trabalho de parto, não implicando obrigatoriamente indicação cirúrgica automática, mas sim reavaliação criteriosa da situação clínica (contrações, posição fetal, eventual desproporção) e tomada de conduta individualizada apropriada ao caso, podendo, conforme a avaliação, resultar em intervenções variadas, incluindo, quando indicado, a cesárea. Correta. Essa é a interpretação correta da linha de ação no partograma: sinal de necessidade de intervenção clínica avaliada individualmente."
      },
      {
        "letra": "C",
        "texto": "deve ser desconsiderada pela equipe assistencial em qualquer situação clínica, sem qualquer implicação prática relevante.",
        "correta": false,
        "justificativa": "Incorreta. A linha de ação tem implicação prática relevante e reconhecida, não devendo ser desconsiderada pela equipe assistencial."
      },
      {
        "letra": "D",
        "texto": "é traçada exclusivamente após o parto já ter ocorrido, sem qualquer utilidade prática durante o próprio trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O partograma, incluindo a linha de ação, é traçado e utilizado durante o próprio trabalho de parto, com utilidade prática imediata para orientar condutas em tempo real, e não apenas após o parto já ter ocorrido."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q14"
  },
  {
    "enunciado": "Durante uma discussão sobre diretrizes de saúde materna na maternidade onde Priscila foi atendida, a equipe debate o conceito de parto humanizado e como ele se relaciona com situações em que a cesárea, como ocorreu no caso de Priscila (por desproporção céfalo-pélvica), é clinicamente indicada. Em relação a esse conceito, é correto afirmar que o parto humanizado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exclui completamente a possibilidade de cesárea ou de uso de anestesia em qualquer circunstância clínica, mesmo diante de indicação médica clara.",
        "correta": false,
        "justificativa": "Incorreta. O parto humanizado não exclui intervenções clinicamente indicadas, como cesárea ou anestesia, quando necessárias à segurança materno-fetal; ele busca evitar intervenções desnecessárias, e não recusar as necessárias."
      },
      {
        "letra": "B",
        "texto": "visa tornar o nascimento menos medicalizado e mais respeitoso aos desejos e ao tempo fisiológico da mulher e do bebê, podendo ocorrer em ambiente hospitalar, inclusive com cesariana quando clinicamente indicada, como no caso de Priscila.",
        "correta": true,
        "justificativa": "O parto humanizado busca reduzir a medicalização excessiva e o protocolo desnecessário do processo de nascimento, respeitando os desejos e o tempo fisiológico da mulher e do bebê sempre que possível, podendo ocorrer em diferentes ambientes (domiciliar ou hospitalar) e até incluir intervenções como cesariana, quando clinicamente indicada (como no caso de desproporção céfalo-pélvica de Priscila), sem imposição de procedimentos apenas por conveniência institucional, mas sem negar intervenções necessárias à segurança materno-fetal. Correta. Essa é a descrição correta do conceito de parto humanizado, compatível com intervenções clinicamente indicadas quando necessárias."
      },
      {
        "letra": "C",
        "texto": "só pode ser praticado em partos domiciliares, sendo incompatível com qualquer atendimento realizado em ambiente hospitalar.",
        "correta": false,
        "justificativa": "Incorreta. O parto humanizado pode ser praticado também em ambiente hospitalar, não sendo exclusivo de partos domiciliares."
      },
      {
        "letra": "D",
        "texto": "é sinônimo obrigatório de ausência de qualquer intervenção médica, mesmo diante de indicação clínica clara e comprovada, como a desproporção céfalo-pélvica identificada no caso de Priscila.",
        "correta": false,
        "justificativa": "Incorreta. O parto humanizado não é sinônimo de ausência absoluta de intervenção médica; ele busca equilíbrio entre respeito ao processo fisiológico e uso racional de intervenções quando clinicamente necessárias, como no caso de desproporção céfalo-pélvica de Priscila."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q15"
  },
  {
    "enunciado": "Durante o trabalho de parto de outra paciente da mesma maternidade, a equipe observa, no momento da rotura da bolsa das águas, a presença de líquido amniótico meconial (esverdeado), achado que gera atenção adicional da equipe assistencial quanto à monitorização fetal. Em relação à interpretação desse achado durante o trabalho de parto, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "deve motivar conduta expectante, sem qualquer alteração na vigilância habitual do trabalho de parto.",
        "correta": false,
        "justificativa": "Incorreta. O achado de líquido meconial deve motivar maior atenção e vigilância, e não conduta expectante sem qualquer alteração na monitorização habitual."
      },
      {
        "letra": "B",
        "texto": "deve motivar maior vigilância do bem-estar fetal, pela possível associação entre líquido meconial e sofrimento fetal.",
        "correta": true,
        "justificativa": "A presença de líquido amniótico meconial pode estar associada a sofrimento fetal (embora nem sempre indique esse quadro), devendo motivar maior vigilância do bem-estar fetal durante o restante do trabalho de parto, com decisão sobre a via e o momento do parto baseada na avaliação do quadro clínico global, e não apenas nesse achado isolado. Correta. Essa é a conduta correta diante do achado de líquido amniótico meconial durante o trabalho de parto."
      },
      {
        "letra": "C",
        "texto": "deve motivar suspensão imediata e definitiva de qualquer forma de monitorização fetal a partir desse momento.",
        "correta": false,
        "justificativa": "Incorreta. A suspensão da monitorização fetal, diante desse achado, seria contraditória, já que o objetivo correto é justamente intensificar, e não suspender, a vigilância do bem-estar fetal."
      },
      {
        "letra": "D",
        "texto": "indica automaticamente e de forma universal a necessidade de cesárea, independentemente do restante do contexto clínico apresentado.",
        "correta": false,
        "justificativa": "Incorreta. O achado de líquido meconial, isoladamente, não indica automaticamente cesárea; a decisão deve considerar o contexto clínico global, incluindo outros parâmetros de bem-estar fetal."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q16"
  },
  {
    "enunciado": "Durante aula sobre puerpério, o professor explica que esse período é didaticamente dividido em diferentes fases, cada uma com características e riscos específicos que orientam a vigilância clínica adequada. Em relação a essa divisão do puerpério, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o puerpério imediato se estende por até 6 semanas completas após o parto, correspondendo, na verdade, à definição de puerpério tardio, e não imediato.",
        "correta": false,
        "justificativa": "Incorreta. A descrição de até 6 semanas corresponde ao puerpério tardio, e não ao puerpério imediato, que compreende um intervalo muito mais restrito (2 a 4 horas)."
      },
      {
        "letra": "B",
        "texto": "o puerpério imediato compreende as primeiras 2 a 4 horas pós-parto, período de maior risco de hemorragia pós-parto, exigindo vigilância intensiva nesse intervalo.",
        "correta": true,
        "justificativa": "O puerpério imediato compreende as primeiras 2 a 4 horas após o parto, período de maior vigilância clínica pelo risco elevado de hemorragia pós-parto (principal causa de morbimortalidade materna nesse intervalo); o puerpério mediato se estende até o 2º-3º dia pós-parto, e o puerpério tardio até cerca de 6 semanas após o parto, cada fase com características e riscos específicos que orientam a assistência. Correta. Essa é a descrição correta do puerpério imediato e de sua importância clínica relacionada ao risco de hemorragia pós-parto."
      },
      {
        "letra": "C",
        "texto": "o puerpério tardio dura apenas as primeiras 24 horas após o parto, correspondendo, na verdade, à definição de puerpério imediato, e não tardio.",
        "correta": false,
        "justificativa": "Incorreta. A descrição de 24 horas corresponde mais ao final do puerpério imediato ou início do mediato, e não à definição de puerpério tardio, que se estende por semanas."
      },
      {
        "letra": "D",
        "texto": "não há qualquer subdivisão reconhecida do puerpério em diferentes fases, sendo esse período considerado uniforme do ponto de vista clínico e de risco.",
        "correta": false,
        "justificativa": "Incorreta. Há subdivisão reconhecida e clinicamente relevante do puerpério em fases (imediato, mediato e tardio), cada uma com riscos e necessidades assistenciais específicas."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q17"
  },
  {
    "enunciado": "Durante auditoria de qualidade assistencial na maternidade onde Priscila foi atendida, a equipe de gestão hospitalar avalia o preenchimento adequado dos partogramas como parte integrante do prontuário médico dos partos realizados. Em relação ao registro adequado do partograma nesse contexto, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não há necessidade de identificação (assinatura) do profissional responsável por cada avaliação registrada no partograma.",
        "correta": false,
        "justificativa": "Incorreta. A identificação do profissional responsável por cada avaliação é essencial para a rastreabilidade e o valor legal do partograma como parte do prontuário médico."
      },
      {
        "letra": "B",
        "texto": "cada coluna preenchida (correspondente a uma hora de avaliação) deve ser assinada pelo examinador responsável, garantindo a rastreabilidade do cuidado prestado ao longo do trabalho de parto.",
        "correta": true,
        "justificativa": "O partograma integra o prontuário médico do parto e deve ser preenchido em tempo real a cada avaliação realizada, com identificação (assinatura) do profissional responsável por cada registro, garantindo rastreabilidade adequada do cuidado prestado e valor legal do documento, sendo item frequentemente avaliado em processos de auditoria de qualidade assistencial hospitalar. Correta. Essa é a prática correta e recomendada de registro do partograma como parte do prontuário médico do parto."
      },
      {
        "letra": "C",
        "texto": "o partograma é considerado documento informal, sem qualquer valor legal como parte do prontuário médico do parto.",
        "correta": false,
        "justificativa": "Incorreta. O partograma tem valor legal como parte integrante do prontuário médico, não podendo ser considerado documento meramente informal sem qualquer implicação legal."
      },
      {
        "letra": "D",
        "texto": "o preenchimento do partograma pode ser realizado de forma integralmente retrospectiva, ao final de todo o trabalho de parto, sem prejuízo à qualidade e à confiabilidade do registro assistencial.",
        "correta": false,
        "justificativa": "Incorreta. O preenchimento retrospectivo, ao final de todo o trabalho de parto, compromete significativamente a confiabilidade do registro e pode prejudicar a qualidade da vigilância clínica em tempo real durante o trabalho de parto, sendo prática inadequada."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q18"
  },
  {
    "enunciado": "Considerando o caso de Priscila, cujo recém-nascido apresentou peso de 4200 g ao nascimento, associado ao histórico materno de diabetes gestacional, a equipe obstétrica reflete sobre os fatores de risco que contribuíram para a desproporção céfalo-pélvica identificada durante o trabalho de parto. Em relação a esses fatores de risco, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o peso fetal estimado adequado para a idade gestacional é fator classicamente associado a maior risco de desproporção céfalo-pélvica, ao contrário do observado no caso de Priscila.",
        "correta": false,
        "justificativa": "Incorreta. Peso fetal adequado para a idade gestacional não é fator de risco para desproporção; ao contrário, é justamente o peso fetal excessivo (macrossomia) que aumenta esse risco, como observado no caso de Priscila."
      },
      {
        "letra": "B",
        "texto": "a macrossomia fetal, frequentemente associada a diabetes gestacional materno mal controlado, aumenta o risco de desproporção entre o tamanho fetal e a bacia materna, dificultando a progressão adequada do parto vaginal.",
        "correta": true,
        "justificativa": "A macrossomia fetal (frequentemente associada a diabetes gestacional materno mal controlado, como no caso descrito de Priscila) é fator de risco relevante e bem reconhecido para desproporção céfalo-pélvica, dificultando a progressão adequada do parto por via vaginal e podendo indicar cesárea quando confirmada durante o trabalho de parto. Correta. Essa é a relação corretamente estabelecida entre macrossomia fetal (associada a diabetes gestacional) e maior risco de desproporção céfalo-pélvica."
      },
      {
        "letra": "C",
        "texto": "a apresentação pélvica isolada é o principal fator de risco para desproporção céfalo-pélvica, sem qualquer relação com o peso fetal estimado.",
        "correta": false,
        "justificativa": "Incorreta. A apresentação pélvica é fator de risco distinto, relacionado a outras dificuldades mecânicas do parto, e não especificamente à desproporção céfalo-pélvica relacionada ao tamanho fetal excessivo descrita no caso."
      },
      {
        "letra": "D",
        "texto": "não há qualquer fator de risco identificável associado a desproporção céfalo-pélvica em fetos macrossômicos, sendo essa associação considerada casual e sem relevância clínica.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida e clinicamente relevante entre macrossomia fetal e maior risco de desproporção céfalo-pélvica, contrariando a afirmação de ausência de fator de risco identificável."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q19"
  },
  {
    "enunciado": "Após identificação de teste de tolerância à glicose alterado na consulta de puerpério de Priscila (60 dias pós-parto), a equipe de saúde da família discute a conduta mais adequada para o seguimento dessa paciente ao longo dos próximos anos, considerando seu histórico de diabetes gestacional. A conduta mais adequada nesse momento é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc02_saude_mulher_sexualidade_planejamento_familiar",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "suspender definitivamente qualquer investigação metabólica futura, considerando que o diabetes gestacional é sempre condição transitória e sem qualquer repercussão após o parto.",
        "correta": false,
        "justificativa": "Incorreta. O diabetes gestacional está associado a risco aumentado de diabetes mellitus tipo 2 futuro, não sendo correto suspender definitivamente qualquer investigação metabólica após o parto."
      },
      {
        "letra": "B",
        "texto": "realizar reclassificação periódica do estado glicêmico de Priscila ao longo do tempo, pelo risco significativamente aumentado de desenvolvimento de diabetes mellitus tipo 2 ao longo da vida em mulheres com esse histórico.",
        "correta": true,
        "justificativa": "Mulheres com diabetes gestacional, como Priscila, devem ser reavaliadas periodicamente quanto ao estado glicêmico ao longo da vida (além da reavaliação já realizada no puerpério imediato), pelo risco significativamente aumentado de desenvolverem diabetes mellitus tipo 2, permitindo intervenção preventiva precoce (orientação nutricional, atividade física, tratamento farmacológico quando indicado) e reduzindo complicações associadas a essa condição crônica no longo prazo. Correta. Essa é a conduta correta de seguimento a longo prazo para mulheres com histórico de diabetes gestacional, dado o risco aumentado de diabetes tipo 2 futuro."
      },
      {
        "letra": "C",
        "texto": "iniciar insulinoterapia definitiva e vitalícia imediatamente, independentemente de reavaliações laboratoriais complementares futuras.",
        "correta": false,
        "justificativa": "Incorreta. Iniciar insulinoterapia definitiva sem reavaliações laboratoriais complementares é conduta prematura e desproporcional, especialmente diante de um único resultado alterado no puerpério, sendo necessária confirmação diagnóstica e acompanhamento adequado antes de decisões terapêuticas definitivas."
      },
      {
        "letra": "D",
        "texto": "orientar apenas dieta hipercalórica no seguimento pós-parto de Priscila, sem qualquer reavaliação glicêmica programada ao longo do tempo.",
        "correta": false,
        "justificativa": "Incorreta. Orientação alimentar isolada, sem qualquer reavaliação glicêmica programada, é insuficiente diante do risco aumentado de diabetes tipo 2 identificado nessa paciente, sendo necessário seguimento laboratorial periódico."
      }
    ],
    "_proveniencia": "whatsapp:UC2_SP4_ENAMED — Q20"
  },
  {
    "enunciado": "Durante aula introdutória de toxicologia clínica, o professor define o termo utilizado para designar qualquer substância estranha ao organismo, capaz de sofrer biotransformação e, eventualmente, causar efeitos tóxicos quando a exposição ultrapassa a capacidade de metabolização segura. Esse termo é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "antídoto, substância utilizada para neutralizar efeitos tóxicos, e não para descrever a substância tóxica em si.",
        "correta": false,
        "justificativa": "Incorreta. Antídoto é a substância utilizada para neutralizar ou reverter os efeitos de um agente tóxico, sendo conceito distinto e oposto ao de xenobiótico."
      },
      {
        "letra": "B",
        "texto": "xenobiótico.",
        "correta": true,
        "justificativa": "Xenobiótico é o termo geral para qualquer substância estranha ao organismo (incluindo fármacos, poluentes ambientais e toxinas), que pode ser metabolizada pelo organismo e, eventualmente, causar efeitos tóxicos quando a exposição ultrapassa a capacidade de biotransformação e eliminação seguras. Correta. Xenobiótico é exatamente o termo correto para qualquer substância estranha ao organismo com potencial toxicológico."
      },
      {
        "letra": "C",
        "texto": "probiótico, microrganismo vivo com benefícios à saúde, sem relação com o conceito descrito.",
        "correta": false,
        "justificativa": "Incorreta. Probiótico refere-se a microrganismos vivos com benefícios reconhecidos à saúde, sem qualquer relação com o conceito de substância tóxica estranha ao organismo."
      },
      {
        "letra": "D",
        "texto": "metabólito endógeno, substância produzida internamente pelo próprio organismo, e não estranha a ele.",
        "correta": false,
        "justificativa": "Incorreta. Metabólito endógeno é substância produzida internamente pelo próprio metabolismo do organismo, sendo o oposto do conceito de substância \"estranha\" descrito no enunciado."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q1"
  },
  {
    "enunciado": "Ao diferenciar os tipos de intoxicação exógena para os estudantes, o professor destaca que um dos tipos se caracteriza pelo surgimento rápido de sinais e sintomas após uma única exposição (ou exposição de curta duração) a determinado agente tóxico. Esse tipo de intoxicação, caracterizado por manifestações que surgem tipicamente em minutos a até 24 horas após a exposição, é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "intoxicação crônica, tipo caracterizado por exposições repetidas e prolongadas ao longo do tempo, e não pela característica descrita.",
        "correta": false,
        "justificativa": "Incorreta. A intoxicação crônica é caracterizada justamente pelo padrão oposto: exposições repetidas e prolongadas, e não pelo surgimento rápido de sintomas após exposição única descrita no enunciado."
      },
      {
        "letra": "B",
        "texto": "intoxicação aguda.",
        "correta": true,
        "justificativa": "A intoxicação aguda caracteriza-se pelo surgimento súbito de sinais e sintomas, geralmente em minutos a até 24 horas após a exposição ao agente tóxico, em contraste com a intoxicação crônica, que decorre de exposições repetidas e prolongadas ao longo do tempo, com quadro clínico frequentemente mais insidioso. Correta. Intoxicação aguda é exatamente o tipo descrito, caracterizado pelo surgimento rápido de manifestações após exposição única ou de curta duração."
      },
      {
        "letra": "C",
        "texto": "intoxicação subclínica, termo que designa exposição sem manifestação clínica evidente, e não o tipo descrito no enunciado.",
        "correta": false,
        "justificativa": "Incorreta. Intoxicação subclínica designa exposição sem manifestação clínica evidente detectável, conceito distinto do descrito no enunciado, que envolve manifestação clínica clara e rápida."
      },
      {
        "letra": "D",
        "texto": "intoxicação latente, termo que não corresponde à classificação toxicológica padrão descrita no enunciado.",
        "correta": false,
        "justificativa": "Incorreta. Intoxicação latente não é termo padrão da classificação toxicológica clássica utilizada para descrever o tipo de intoxicação caracterizado no enunciado."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q2"
  },
  {
    "enunciado": "Uma criança é levada ao pronto-socorro após ingestão acidental de produto raticida encontrado em casa, evoluindo com sialorreia intensa, miose e bradicardia. A equipe médica reconhece esse quadro como compatível com síndrome colinérgica, decorrente da inibição de uma enzima específica pelo agente tóxico envolvido. Os organofosforados e carbamatos, agentes tóxicos comuns em raticidas e inseticidas, atuam principalmente inibindo a enzima",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "colinesterase (acetilcolinesterase).",
        "correta": true,
        "justificativa": "Organofosforados e carbamatos inibem a acetilcolinesterase, enzima responsável pela degradação da acetilcolina nas sinapses colinérgicas, levando ao acúmulo desse neurotransmissor e à síndrome colinérgica clássica (sialorreia, miose, bradicardia, broncorreia, entre outros sintomas), como observado no caso descrito. Correta. A inibição da acetilcolinesterase é exatamente o mecanismo de ação central dos organofosforados e carbamatos, explicando a síndrome colinérgica descrita."
      },
      {
        "letra": "B",
        "texto": "lactato desidrogenase, enzima sem relação direta com o mecanismo de ação descrito para organofosforados/carbamatos.",
        "correta": false,
        "justificativa": "Incorreta. Lactato desidrogenase é enzima relacionada ao metabolismo celular geral, sem relação com o mecanismo de ação toxicológico descrito para organofosforados/carbamatos."
      },
      {
        "letra": "C",
        "texto": "amilase, enzima digestiva sem relação com o mecanismo de ação descrito para organofosforados/carbamatos.",
        "correta": false,
        "justificativa": "Incorreta. Amilase é enzima digestiva envolvida na quebra de carboidratos, sem relação com o mecanismo de ação descrito."
      },
      {
        "letra": "D",
        "texto": "fosfatase alcalina, enzima sem relação direta com o mecanismo de ação descrito para organofosforados/carbamatos.",
        "correta": false,
        "justificativa": "Incorreta. Fosfatase alcalina é enzima utilizada principalmente como marcador de função hepática/óssea, sem relação com o mecanismo de ação toxicológico descrito para organofosforados/carbamatos."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q3"
  },
  {
    "enunciado": "Diante de um caso de intoxicação exógena de origem incerta, a equipe médica de um pronto-socorro busca orientação especializada por telefone com um serviço de referência nacional voltado especificamente ao suporte técnico em casos de exposição a agentes tóxicos. Esse órgão de referência para orientação toxicológica é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "CIATox (Centro de Informação e Assistência Toxicológica).",
        "correta": true,
        "justificativa": "Os Centros de Informação e Assistência Toxicológica (CIATox) fornecem orientação técnica especializada, geralmente por telefone, para profissionais de saúde e para a população em geral em casos de intoxicação exógena, sendo referência nacional importante para apoio ao manejo clínico desses casos. Correta. CIATox é exatamente o serviço de referência para orientação toxicológica especializada descrito no enunciado."
      },
      {
        "letra": "B",
        "texto": "CAPS (Centro de Atenção Psicossocial), serviço voltado ao cuidado em saúde mental, sem relação direta com orientação toxicológica.",
        "correta": false,
        "justificativa": "Incorreta. CAPS é serviço voltado ao cuidado em saúde mental, sem relação com orientação toxicológica especializada."
      },
      {
        "letra": "C",
        "texto": "NASF (Núcleo Ampliado de Saúde da Família), serviço voltado ao apoio matricial em atenção primária, sem relação específica com orientação toxicológica.",
        "correta": false,
        "justificativa": "Incorreta. NASF é serviço de apoio matricial à atenção primária em diversas áreas, sem função específica de orientação toxicológica especializada por telefone."
      },
      {
        "letra": "D",
        "texto": "SAMU exclusivamente, serviço de atendimento móvel de urgência, sem função primária de orientação toxicológica especializada por telefone.",
        "correta": false,
        "justificativa": "Incorreta. O SAMU tem função primária de atendimento móvel de urgência, podendo articular-se com o CIATox, mas não sendo, em si, o órgão de referência para orientação toxicológica especializada descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q4"
  },
  {
    "enunciado": "Em estudo experimental de toxicologia, pesquisadores determinam a dose de uma substância capaz de causar a morte de metade dos animais expostos, parâmetro utilizado para comparar a toxicidade relativa entre diferentes substâncias. Essa medida, amplamente utilizada em toxicologia experimental, é denominada",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dose terapêutica, conceito relacionado à dose eficaz para tratamento clínico, e não à letalidade experimental descrita.",
        "correta": false,
        "justificativa": "Incorreta. Dose terapêutica refere-se à dose eficaz para obtenção de efeito clínico desejado no tratamento de doenças, conceito distinto da letalidade experimental descrita."
      },
      {
        "letra": "B",
        "texto": "dose letal mediana (DL50).",
        "correta": true,
        "justificativa": "A dose letal mediana (DL50) é parâmetro toxicológico experimental que representa a dose capaz de causar a morte de 50% dos indivíduos (geralmente animais) de uma população exposta ao agente tóxico, sendo utilizada para comparar a toxicidade relativa entre diferentes substâncias. Correta. DL50 é exatamente o parâmetro toxicológico descrito: dose capaz de causar morte de 50% dos indivíduos expostos."
      },
      {
        "letra": "C",
        "texto": "dose subclínica, conceito relacionado a exposição sem manifestação clínica evidente, e não à letalidade experimental descrita.",
        "correta": false,
        "justificativa": "Incorreta. Dose subclínica refere-se a exposição sem manifestação clínica evidente detectável, conceito distinto da medida de letalidade experimental descrita."
      },
      {
        "letra": "D",
        "texto": "dose de manutenção, conceito relacionado à farmacoterapia clínica contínua, e não à letalidade experimental descrita.",
        "correta": false,
        "justificativa": "Incorreta. Dose de manutenção é conceito relacionado à farmacoterapia clínica contínua, sem relação com a medida de letalidade experimental descrita no enunciado."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q5"
  },
  {
    "enunciado": "Criança de 4 anos é levada ao pronto-socorro pela mãe após ser encontrada manipulando um recipiente sem rótulo, guardado próximo a produtos de limpeza em casa. Poucos minutos depois, a criança apresenta vômitos, diarreia, sudorese intensa, hipersecreção salivar, miose e sonolência progressiva. Diante desse quadro clínico, a hipótese diagnóstica mais compatível é intoxicação por",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "paracetamol, quadro clínico incompatível com os sintomas colinérgicos descritos.",
        "correta": false,
        "justificativa": "Incorreta. A intoxicação por paracetamol tipicamente cursa com sintomas gastrointestinais iniciais menos exuberantes e evolução para hepatotoxicidade, sem o quadro colinérgico característico (miose, sialorreia intensa) descrito no caso."
      },
      {
        "letra": "B",
        "texto": "organofosforado/carbamato (síndrome colinérgica).",
        "correta": true,
        "justificativa": "O conjunto de sialorreia, sudorese intensa, miose, sintomas gastrointestinais (vômitos, diarreia) e alteração progressiva do nível de consciência é característico da síndrome colinérgica por intoxicação com organofosforados/carbamatos, frequentemente encontrados em produtos domésticos como raticidas e inseticidas sem identificação adequada, como sugerido no caso descrito. Correta. O quadro clínico descrito é típico da síndrome colinérgica por intoxicação com organofosforados/carbamatos."
      },
      {
        "letra": "C",
        "texto": "álcool etílico, quadro clínico incompatível com os sintomas colinérgicos específicos descritos, especialmente a miose acentuada.",
        "correta": false,
        "justificativa": "Incorreta. A intoxicação por álcool etílico cursaria mais tipicamente com midríase (e não miose) e outros achados neurológicos distintos do quadro colinérgico descrito."
      },
      {
        "letra": "D",
        "texto": "corticoide tópico, substância sem potencial de causar o quadro sistêmico grave descrito no caso.",
        "correta": false,
        "justificativa": "Incorreta. Corticoide tópico não tem potencial reconhecido de causar quadro sistêmico grave como o descrito no caso, especialmente em exposição aguda por manipulação."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q6"
  },
  {
    "enunciado": "Diante do caso da criança com forte suspeita de intoxicação exógena por agente ainda não identificado com certeza, a equipe do pronto-socorro discute a necessidade de notificação ao sistema de vigilância em saúde. Nesse contexto, a conduta correta da equipe de saúde inclui",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aguardar identificação laboratorial completa do agente tóxico específico antes de realizar qualquer notificação ou medida terapêutica inicial.",
        "correta": false,
        "justificativa": "Incorreta. Aguardar identificação laboratorial completa antes de qualquer notificação ou medida terapêutica representaria atraso inadequado diante de uma situação potencialmente grave e urgente."
      },
      {
        "letra": "B",
        "texto": "notificação ao sistema de vigilância em saúde e contato com centro de assistência toxicológica para orientação, independentemente da identificação laboratorial completa e definitiva do agente tóxico envolvido.",
        "correta": true,
        "justificativa": "A notificação ao sistema de vigilância epidemiológica e o contato com centro de assistência toxicológica (CIATox) devem ocorrer diante de suspeita clínica fundamentada de intoxicação exógena, mesmo sem identificação laboratorial completa do agente específico, dada a relevância epidemiológica do caso e o potencial risco à saúde da criança e, eventualmente, de outras pessoas expostas ao mesmo produto no ambiente domiciliar. Correta. A notificação e o contato com centro toxicológico especializado, mesmo sem identificação completa do agente, é a conduta correta diante de suspeita fundamentada de intoxicação."
      },
      {
        "letra": "C",
        "texto": "dispensar a criança sem qualquer registro formal do caso, considerando que não há certeza diagnóstica absoluta sobre o agente causador.",
        "correta": false,
        "justificativa": "Incorreta. Dispensar a criança sem qualquer registro formal, diante de suspeita fundamentada de intoxicação grave, contraria as boas práticas assistenciais e de vigilância em saúde."
      },
      {
        "letra": "D",
        "texto": "restringir toda a conduta apenas à orientação de observação domiciliar, sem qualquer medida terapêutica ou de notificação adicional.",
        "correta": false,
        "justificativa": "Incorreta. Restringir a conduta apenas à orientação de observação domiciliar, diante de sintomas sistêmicos relevantes já apresentados pela criança, é conduta inadequada e potencialmente perigosa."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q7"
  },
  {
    "enunciado": "Durante a avaliação inicial de diferentes casos de intoxicação exógena atendidos em um mesmo plantão, a equipe do pronto-socorro classifica cada caso conforme a intensidade das manifestações clínicas apresentadas, para orientar a intensidade da conduta terapêutica e o local mais adequado de observação (ambulatorial, enfermaria ou unidade de terapia intensiva). Em relação a essa classificação de gravidade das intoxicações agudas, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "todas as intoxicações agudas são classificadas exclusivamente como graves, independentemente do agente e da quantidade envolvida na exposição.",
        "correta": false,
        "justificativa": "Incorreta. Nem todas as intoxicações agudas são graves; há variação relevante de gravidade conforme o agente, a dose e as condições individuais do paciente, sendo essa a razão da classificação em diferentes níveis."
      },
      {
        "letra": "B",
        "texto": "podem ser classificadas em leve, moderada e grave, conforme a intensidade das manifestações clínicas apresentadas pelo paciente.",
        "correta": true,
        "justificativa": "As intoxicações agudas são classificadas em leve, moderada e grave, de acordo com a intensidade e o tipo de manifestações clínicas apresentadas pelo paciente, classificação que orienta decisões práticas sobre necessidade de internação, nível de vigilância e intensidade do suporte terapêutico a ser oferecido. Correta. Essa é a classificação correta e reconhecida das intoxicações agudas quanto à gravidade, orientando a conduta clínica apropriada."
      },
      {
        "letra": "C",
        "texto": "a gravidade de uma intoxicação aguda não tem qualquer relação reconhecida com a dose ou com o tempo de exposição ao agente tóxico envolvido.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida entre dose, tempo de exposição e gravidade da intoxicação, sendo esses fatores centrais na avaliação toxicológica clínica."
      },
      {
        "letra": "D",
        "texto": "apenas exposições ocupacionais podem ser formalmente classificadas quanto à gravidade da intoxicação apresentada pelo paciente.",
        "correta": false,
        "justificativa": "Incorreta. A classificação de gravidade se aplica a qualquer contexto de intoxicação aguda (doméstica, acidental, ocupacional ou intencional), e não exclusivamente a exposições ocupacionais."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q8"
  },
  {
    "enunciado": "Em uma aula sobre epidemiologia das intoxicações exógenas no Brasil, o professor apresenta dados sobre os agentes tóxicos mais frequentemente associados a casos graves e óbitos registrados nos sistemas de notificação nacionais. Entre os agentes tóxicos com maior morbimortalidade em intoxicações agudas no país, destacam-se",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "vitaminas hidrossolúveis em doses habituais, categoria de baixo potencial tóxico em condições normais de uso.",
        "correta": false,
        "justificativa": "Incorreta. Vitaminas hidrossolúveis em doses habituais têm baixo potencial tóxico, não correspondendo aos agentes de maior morbimortalidade discutidos na epidemiologia das intoxicações agudas."
      },
      {
        "letra": "B",
        "texto": "raticidas, agrotóxicos e psicofármacos.",
        "correta": true,
        "justificativa": "Raticidas, agrotóxicos (incluindo organofosforados e carbamatos) e psicofármacos estão entre os agentes tóxicos associados a maior morbimortalidade nos registros de intoxicação aguda no Brasil, refletindo tanto a disponibilidade desses produtos no ambiente domiciliar e agrícola quanto sua toxicidade potencialmente elevada. Correta. Raticidas, agrotóxicos e psicofármacos são exatamente os agentes tóxicos de maior relevância epidemiológica em termos de morbimortalidade por intoxicação aguda no Brasil."
      },
      {
        "letra": "C",
        "texto": "soro fisiológico e água destilada, substâncias sem potencial tóxico relevante em condições habituais de uso.",
        "correta": false,
        "justificativa": "Incorreta. Soro fisiológico e água destilada não são substâncias com potencial tóxico relevante em condições habituais de uso, não correspondendo aos agentes discutidos."
      },
      {
        "letra": "D",
        "texto": "protetor solar de uso tópico, produto de baixo potencial tóxico sistêmico em condições habituais de uso.",
        "correta": false,
        "justificativa": "Incorreta. Protetor solar de uso tópico tem baixo potencial tóxico sistêmico em condições habituais de uso, não correspondendo aos agentes de maior morbimortalidade discutidos na aula."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q9"
  },
  {
    "enunciado": "A criança atendida com sinais de síndrome colinérgica grave (sialorreia intensa, miose acentuada, bradicardia significativa) por suspeita de intoxicação por organofosforado é encaminhada para tratamento específico imediato, além das medidas gerais de suporte já iniciadas. O antídoto farmacológico de escolha utilizado nesse contexto é a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "atropina, associada eventualmente à pralidoxima conforme protocolo e gravidade do quadro.",
        "correta": true,
        "justificativa": "A atropina é o antídoto de escolha na intoxicação por organofosforados/carbamatos, antagonizando os efeitos muscarínicos da acetilcolina acumulada nas sinapses colinérgicas; a pralidoxima pode ser associada nos casos por organofosforados especificamente, reativando a acetilcolinesterase inibida, quando disponível e indicada conforme protocolo institucional. Correta. Atropina (associada eventualmente à pralidoxima) é exatamente o antídoto de escolha para intoxicação por organofosforado/carbamato descrita no caso."
      },
      {
        "letra": "B",
        "texto": "naloxona, antídoto específico para intoxicação por opioides, e não para síndrome colinérgica por organofosforados.",
        "correta": false,
        "justificativa": "Incorreta. Naloxona é antídoto específico para intoxicação por opioides, sem qualquer papel reconhecido no tratamento da síndrome colinérgica por organofosforados."
      },
      {
        "letra": "C",
        "texto": "flumazenil, antídoto específico para intoxicação por benzodiazepínicos, e não para síndrome colinérgica por organofosforados.",
        "correta": false,
        "justificativa": "Incorreta. Flumazenil é antídoto específico para intoxicação por benzodiazepínicos, sem qualquer papel reconhecido no tratamento da síndrome colinérgica por organofosforados."
      },
      {
        "letra": "D",
        "texto": "N-acetilcisteína, antídoto específico para intoxicação por paracetamol, e não para síndrome colinérgica por organofosforados.",
        "correta": false,
        "justificativa": "Incorreta. N-acetilcisteína é antídoto específico para intoxicação por paracetamol, sem qualquer papel reconhecido no tratamento da síndrome colinérgica por organofosforados."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q10"
  },
  {
    "enunciado": "Após a administração de atropina à criança com síndrome colinérgica por suspeita de intoxicação por organofosforado, a equipe médica explica aos familiares o mecanismo de ação desse antídoto, destacando que ele não reverte diretamente a inibição enzimática causada pelo agente tóxico, mas sim antagoniza os efeitos do neurotransmissor acumulado. O antídoto citado (atropina) atua, farmacologicamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "como agonista colinérgico direto, mecanismo que agravaria, e não reverteria, a síndrome colinérgica apresentada pela criança.",
        "correta": false,
        "justificativa": "Incorreta. Um agonista colinérgico direto agravaria a síndrome colinérgica já presente, sendo o oposto do mecanismo terapêutico correto da atropina nesse contexto."
      },
      {
        "letra": "B",
        "texto": "como antagonista competitivo dos receptores muscarínicos de acetilcolina.",
        "correta": true,
        "justificativa": "A atropina age como antagonista competitivo dos receptores muscarínicos de acetilcolina, revertendo os efeitos muscarínicos da síndrome colinérgica (sialorreia, miose, bradicardia, broncorreia), sem atuar diretamente sobre a enzima acetilcolinesterase inibida pelo agente tóxico, nem sobre os efeitos nicotínicos periféricos da intoxicação. Correta. Esse é exatamente o mecanismo de ação farmacológico da atropina: antagonismo competitivo dos receptores muscarínicos de acetilcolina."
      },
      {
        "letra": "C",
        "texto": "inibindo a colinesterase de forma irreversível, mecanismo que agravaria, e não reverteria, a síndrome colinérgica apresentada pela criança.",
        "correta": false,
        "justificativa": "Incorreta. A atropina não atua inibindo a colinesterase; ao contrário, é a própria enzima que já está inibida pelo agente tóxico, e a atropina age antagonizando os efeitos da acetilcolina acumulada, e não sobre a enzima em si."
      },
      {
        "letra": "D",
        "texto": "bloqueando exclusivamente receptores nicotínicos periféricos, mecanismo distinto do efeito farmacológico principal e clinicamente relevante da atropina nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. O efeito farmacológico principal e clinicamente relevante da atropina nesse contexto é sobre os receptores muscarínicos, e não sobre os receptores nicotínicos periféricos."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q11"
  },
  {
    "enunciado": "Ao investigar as condições socioambientais da família da criança intoxicada, a equipe de saúde identifica moradia precária, armazenamento inadequado de produtos tóxicos junto a alimentos e ausência de saneamento básico adequado na residência. Em relação a essas condições sociais identificadas no caso, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não têm qualquer relação reconhecida com o risco de intoxicação exógena infantil observado no caso descrito.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida entre condições sociais precárias (moradia inadequada, armazenamento incorreto de produtos tóxicos) e maior risco de intoxicação exógena infantil, contrariando a afirmação de ausência de relação."
      },
      {
        "letra": "B",
        "texto": "constituem determinantes sociais relevantes que aumentam o risco de exposição acidental a substâncias tóxicas, reforçando a necessidade de ações intersetoriais de educação em saúde, vigilância sanitária e melhoria das condições habitacionais.",
        "correta": true,
        "justificativa": "As condições de moradia precária e armazenamento inadequado de produtos tóxicos constituem determinantes sociais relevantes para o risco de intoxicação exógena, especialmente em crianças pequenas, evidenciando a necessidade de ações intersetoriais que envolvam educação em saúde, vigilância sanitária e políticas públicas de habitação e saneamento, e não apenas intervenções pontuais e individualizadas junto à família. Correta. Essa é a interpretação correta sobre os determinantes sociais identificados no caso e a necessidade de ações intersetoriais mais amplas."
      },
      {
        "letra": "C",
        "texto": "são fatores exclusivamente individuais e familiares, sem qualquer relação com políticas públicas mais amplas de habitação e saneamento.",
        "correta": false,
        "justificativa": "Incorreta. Esses fatores têm relação direta com políticas públicas mais amplas de habitação, saneamento e educação em saúde, e não apenas com a esfera individual e familiar."
      },
      {
        "letra": "D",
        "texto": "justificam a responsabilização exclusiva da família pela ocorrência do evento, sem qualquer papel reconhecido do poder público na prevenção desse tipo de situação.",
        "correta": false,
        "justificativa": "Incorreta. Responsabilizar exclusivamente a família, ignorando o papel do poder público na garantia de condições adequadas de moradia, saneamento e acesso à informação, é abordagem incompleta e inadequada do ponto de vista da saúde coletiva."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q12"
  },
  {
    "enunciado": "Diante da possibilidade de negligência no cuidado infantil observada no contexto socioambiental da criança intoxicada, a equipe de saúde discute os aspectos éticos e legais de sua atuação nesse caso específico. Em relação à conduta adequada da equipe médica diante dessa situação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o médico deve, além de tratar a criança, avaliar cuidadosamente a necessidade de notificação compulsória e articulação com a rede de proteção (como o conselho tutelar), sem prejulgar a família, mas garantindo a segurança da criança envolvida.",
        "correta": true,
        "justificativa": "Diante de suspeita de intoxicação infantil, especialmente em contexto de vulnerabilidade social, o médico deve avaliar cuidadosamente a necessidade de notificação compulsória e articulação com a rede de proteção à criança (conselho tutelar, assistência social), sem prejulgar a família ou presumir automaticamente negligência, mas buscando equilibrar o cuidado à criança com o apoio necessário ao núcleo familiar, dentro dos princípios éticos e legais que regem a proteção infantil. Correta. Essa é a conduta ética e legalmente adequada diante de suspeita de intoxicação infantil em contexto de vulnerabilidade social."
      },
      {
        "letra": "B",
        "texto": "a notificação de suspeita de intoxicação infantil em contexto de vulnerabilidade social é sempre facultativa e pode ser livremente omitida a critério exclusivo do médico assistente.",
        "correta": false,
        "justificativa": "Incorreta. A notificação de suspeita de violência ou negligência contra crianças não é meramente facultativa; há previsão legal de notificação compulsória em determinadas circunstâncias que sugerem risco à criança."
      },
      {
        "letra": "C",
        "texto": "a família deve ser automaticamente responsabilizada judicialmente pelo evento, sem qualquer avaliação prévia do contexto social e das circunstâncias específicas envolvidas.",
        "correta": false,
        "justificativa": "Incorreta. A responsabilização automática e judicial da família, sem qualquer avaliação prévia do contexto social e das circunstâncias específicas, contraria os princípios de avaliação cuidadosa e individualizada que devem orientar a atuação da equipe de saúde nesses casos."
      },
      {
        "letra": "D",
        "texto": "a comunicação com a rede de proteção à criança é dispensável sempre que o caso ocorrer em área de vulnerabilidade social já conhecida pela equipe de saúde.",
        "correta": false,
        "justificativa": "Incorreta. A comunicação com a rede de proteção à criança não é dispensável apenas pelo fato de a área já ser conhecida como vulnerável; a avaliação deve ser feita caso a caso, conforme os elementos concretos do evento específico."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q13"
  },
  {
    "enunciado": "Durante discussão sobre as vias de exposição a agentes tóxicos domiciliares, um estudante questiona por que produtos como organofosforados podem causar intoxicação mesmo sem ingestão direta, apenas pelo contato prolongado com a pele ou pela inalação em ambiente mal ventilado. Em relação à toxicocinética dos organofosforados, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "esses agentes não sofrem qualquer absorção cutânea relevante, sendo a via oral a única via de exposição clinicamente relevante para esse grupo de substâncias.",
        "correta": false,
        "justificativa": "Incorreta. Há absorção cutânea relevante reconhecida para os organofosforados, sendo essa uma das vias importantes de exposição acidental, especialmente em contextos ocupacionais e domiciliares."
      },
      {
        "letra": "B",
        "texto": "os organofosforados podem ser absorvidos por via dérmica, respiratória e oral, o que amplia significativamente as possíveis formas de exposição acidental, especialmente em ambientes domiciliares com armazenamento inadequado desses produtos.",
        "correta": true,
        "justificativa": "Os organofosforados podem ser absorvidos por múltiplas vias (dérmica, respiratória e oral), o que amplia significativamente as possibilidades de exposição acidental, inclusive em ambientes domiciliares onde esses produtos são armazenados de forma inadequada, próximos a alimentos ou ao alcance de crianças, sem necessidade de ingestão direta para que ocorra absorção sistêmica relevante e manifestações clínicas de intoxicação. Correta. Essa é a descrição correta das múltiplas vias de absorção dos organofosforados, que ampliam as possibilidades de exposição acidental."
      },
      {
        "letra": "C",
        "texto": "esses agentes são completamente inertes até o momento em que são efetivamente ingeridos por via oral, sem qualquer potencial tóxico por outras vias de exposição.",
        "correta": false,
        "justificativa": "Incorreta. Os organofosforados têm potencial tóxico por múltiplas vias de exposição, não sendo inertes até o momento da ingestão oral especificamente."
      },
      {
        "letra": "D",
        "texto": "os organofosforados não atravessam a barreira hematoencefálica em nenhuma circunstância, o que excluiria qualquer manifestação neurológica central na intoxicação por esses agentes.",
        "correta": false,
        "justificativa": "Incorreta. Os organofosforados podem atravessar a barreira hematoencefálica, causando manifestações neurológicas centrais na intoxicação, contrariando a afirmação de impossibilidade absoluta dessa passagem."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q14"
  },
  {
    "enunciado": "Diante da dúvida da equipe de saúde sobre notificar formalmente o caso da criança intoxicada, considerando que o agente causador específico ainda não havia sido identificado com absoluta certeza no momento do atendimento inicial, a equipe busca orientação sobre a conduta tecnicamente mais adequada quanto à notificação epidemiológica. Essa conduta correta é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não notificar o caso, já que a notificação epidemiológica exigiria certeza absoluta e comprovação laboratorial completa do agente tóxico específico envolvido antes de qualquer registro formal.",
        "correta": false,
        "justificativa": "Incorreta. A notificação não exige certeza absoluta e comprovação laboratorial completa prévia; a vigilância epidemiológica trabalha justamente com casos suspeitos, sendo essa exigência de certeza absoluta um obstáculo desnecessário à notificação oportuna."
      },
      {
        "letra": "B",
        "texto": "notificar o caso como suspeita de intoxicação exógena, já que a vigilância epidemiológica trabalha com casos suspeitos, permitindo posterior complementação e refinamento das informações à medida que novos dados forem disponibilizados.",
        "correta": true,
        "justificativa": "A vigilância epidemiológica de intoxicações exógenas trabalha com casos suspeitos, não sendo necessária certeza absoluta sobre o agente tóxico específico para que a notificação seja realizada; o registro inicial pode ser complementado posteriormente com dados laboratoriais ou de investigação adicional, sendo essa a conduta tecnicamente correta e recomendada pelos sistemas de vigilância em saúde. Correta. Essa é a conduta tecnicamente correta: notificar como suspeita, permitindo complementação posterior das informações."
      },
      {
        "letra": "C",
        "texto": "aguardar a alta hospitalar definitiva da criança para só então decidir formalmente sobre a necessidade e o momento adequado da notificação epidemiológica do caso.",
        "correta": false,
        "justificativa": "Incorreta. Aguardar a alta hospitalar definitiva para decidir sobre a notificação atrasaria desnecessariamente o registro epidemiológico, que deve ocorrer o mais precocemente possível diante de suspeita fundamentada."
      },
      {
        "letra": "D",
        "texto": "delegar exclusivamente à família da criança a decisão sobre notificar ou não o caso às autoridades de vigilância em saúde competentes.",
        "correta": false,
        "justificativa": "Incorreta. A decisão sobre notificação epidemiológica de agravos de notificação compulsória é responsabilidade da equipe de saúde, e não pode ser delegada exclusivamente à família do paciente."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q15"
  },
  {
    "enunciado": "Ao analisar dados do sistema nacional de informações toxicológicas apresentados em uma aula de epidemiologia, os estudantes observam que crianças menores de 5 anos representam parcela expressiva dos casos notificados de intoxicação exógena no país. Em relação a esses dados epidemiológicos de intoxicação exógena no Brasil, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "crianças menores de 5 anos representam parcela significativa dos casos notificados, frequentemente relacionados à exposição acidental em ambiente domiciliar, como ilustrado no caso discutido nesta situação-problema.",
        "correta": true,
        "justificativa": "Crianças pequenas, principalmente menores de 5 anos, representam parcela expressiva das notificações de intoxicação exógena no Brasil, frequentemente relacionadas à exposição acidental domiciliar a produtos de limpeza, medicamentos e praguicidas (como raticidas e inseticidas), padrão epidemiológico consistente com o caso clínico discutido nesta situação-problema. Correta. Essa é a caracterização epidemiológica correta da relevância das intoxicações exógenas em crianças pequenas, relacionadas principalmente à exposição acidental domiciliar."
      },
      {
        "letra": "B",
        "texto": "a maior parte das intoxicações exógenas notificadas ocorre exclusivamente em idosos institucionalizados, sem relevância epidemiológica na faixa etária pediátrica.",
        "correta": false,
        "justificativa": "Incorreta. Embora idosos também apresentem casos relevantes de intoxicação exógena, crianças pequenas representam parcela expressiva e reconhecida das notificações, não sendo correto afirmar exclusividade da faixa etária idosa."
      },
      {
        "letra": "C",
        "texto": "não há qualquer diferença relevante de distribuição por faixa etária na incidência de intoxicações exógenas notificadas no Brasil.",
        "correta": false,
        "justificativa": "Incorreta. Há diferença relevante de distribuição por faixa etária, com destaque para a vulnerabilidade de crianças pequenas à exposição acidental domiciliar, contrariando a afirmação de ausência de diferença relevante."
      },
      {
        "letra": "D",
        "texto": "as intoxicações exógenas praticamente não ocorrem em ambiente domiciliar, sendo predominantemente relacionadas a exposições ocupacionais em adultos.",
        "correta": false,
        "justificativa": "Incorreta. As intoxicações exógenas ocorrem frequentemente em ambiente domiciliar, especialmente na faixa etária pediátrica, contrariando a afirmação de predomínio exclusivo de exposições ocupacionais em adultos."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q16"
  },
  {
    "enunciado": "A criança atendida com sinais vitais instáveis por suspeita de intoxicação exógena grave é rapidamente avaliada pela equipe de emergência, que prioriza determinadas medidas mesmo antes da identificação laboratorial completa do agente tóxico específico envolvido. Em relação à abordagem terapêutica inicial nesse contexto, a conduta prioritária é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "aguardar identificação laboratorial completa do agente tóxico antes de qualquer medida de suporte clínico à criança.",
        "correta": false,
        "justificativa": "Incorreta. Aguardar identificação laboratorial completa antes de qualquer medida de suporte representaria atraso perigoso diante de instabilidade clínica já presente, contrariando os princípios de atendimento de urgência."
      },
      {
        "letra": "B",
        "texto": "garantir estabilização clínica inicial (avaliação e suporte de via aérea, respiração e circulação), medidas gerais de suporte e descontaminação quando indicada, conforme protocolo padronizado de atendimento ao paciente intoxicado, mesmo antes da identificação laboratorial completa do agente específico.",
        "correta": true,
        "justificativa": "No atendimento inicial ao paciente com suspeita de intoxicação exógena e instabilidade clínica, a prioridade é a estabilização clínica seguindo a sequência de avaliação de via aérea, respiração e circulação (ABC), seguida de medidas gerais de suporte e descontaminação (quando indicada e ainda oportuna), mesmo antes da identificação laboratorial completa do agente tóxico específico envolvido, priorizando a segurança imediata do paciente. Correta. Essa é a conduta correta e prioritária no atendimento inicial ao paciente com suspeita de intoxicação exógena e instabilidade clínica."
      },
      {
        "letra": "C",
        "texto": "administrar simultaneamente antídotos específicos para todos os possíveis agentes tóxicos suspeitos, sem qualquer avaliação clínica prévia direcionada ao quadro apresentado.",
        "correta": false,
        "justificativa": "Incorreta. Administrar múltiplos antídotos simultaneamente, sem avaliação clínica direcionada, pode ser perigoso e não é conduta recomendada; a escolha de antídotos deve ser baseada em avaliação clínica cuidadosa do quadro apresentado."
      },
      {
        "letra": "D",
        "texto": "encaminhar a criança imediatamente para alta hospitalar, independentemente da instabilidade dos sinais vitais apresentados no momento da avaliação inicial.",
        "correta": false,
        "justificativa": "Incorreta. Encaminhar para alta hospitalar diante de instabilidade clínica é conduta inadequada e potencialmente perigosa, contrariando completamente os princípios de atendimento de urgência."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q17"
  },
  {
    "enunciado": "Após o atendimento do caso da criança intoxicada, a equipe de vigilância em saúde do município utiliza os dados consolidados no sistema nacional de notificação de intoxicações exógenas para embasar ações de prevenção direcionadas à população local. Em relação à principal finalidade desses sistemas de notificação (como o Sinitox), é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "têm como objetivo principal punir exclusivamente as famílias envolvidas em casos de intoxicação infantil identificados no território.",
        "correta": false,
        "justificativa": "Incorreta. A finalidade dos sistemas de notificação não é punitiva em relação às famílias, mas sim epidemiológica, voltada ao subsídio de políticas públicas de prevenção."
      },
      {
        "letra": "B",
        "texto": "consolidam dados epidemiológicos que subsidiam políticas públicas de prevenção, fiscalização sanitária de produtos tóxicos e ações direcionadas de educação em saúde voltadas à população mais vulnerável.",
        "correta": true,
        "justificativa": "Sistemas de notificação de intoxicações exógenas (como o Sinitox) consolidam dados epidemiológicos essenciais para orientar políticas públicas de prevenção, fiscalização sanitária de produtos tóxicos e ações direcionadas de educação em saúde voltadas às populações e territórios mais vulneráveis, sendo ferramenta importante de vigilância e planejamento em saúde pública, e não instrumento de punição individual às famílias envolvidas. Correta. Essa é a finalidade correta e reconhecida dos sistemas de notificação de intoxicações exógenas, como o Sinitox."
      },
      {
        "letra": "C",
        "texto": "substituem integralmente a necessidade de atendimento clínico individual do paciente intoxicado, restringindo-se apenas ao registro estatístico do evento.",
        "correta": false,
        "justificativa": "Incorreta. Os sistemas de notificação não substituem o atendimento clínico individual do paciente, que deve ocorrer de forma independente e prioritária diante do quadro apresentado; a notificação é complementar ao cuidado clínico."
      },
      {
        "letra": "D",
        "texto": "restringem-se exclusivamente ao registro formal de óbitos relacionados à intoxicação exógena, sem qualquer outra finalidade epidemiológica ou preventiva reconhecida.",
        "correta": false,
        "justificativa": "Incorreta. Os sistemas de notificação registram não apenas óbitos, mas todos os casos suspeitos e confirmados de intoxicação exógena, com finalidade ampla de vigilância epidemiológica e subsídio a políticas de prevenção."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q18"
  },
  {
    "enunciado": "Ao discutir o ambiente psicossocial como fator determinante para a ocorrência de intoxicações exógenas, tema central desta situação-problema, a equipe de saúde reflete sobre por que famílias com acesso limitado à informação em saúde e condições precárias de moradia apresentam maior vulnerabilidade a esse tipo de evento. Em relação a essa relação entre ambiente psicossocial e risco de intoxicação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "fatores como baixa escolaridade, acesso limitado à informação em saúde e condições precárias de moradia não têm qualquer influência reconhecida sobre o risco de intoxicação acidental infantil.",
        "correta": false,
        "justificativa": "Incorreta. Há influência bem reconhecida desses fatores sociais sobre o risco de intoxicação acidental infantil, contrariando a afirmação de ausência de qualquer relação."
      },
      {
        "letra": "B",
        "texto": "o acesso limitado a serviços de educação e saúde de qualidade está associado a maior vulnerabilidade a intoxicações acidentais, reforçando a necessidade de ações educativas direcionadas às comunidades mais expostas a esse tipo de risco ambiental.",
        "correta": true,
        "justificativa": "O acesso limitado a serviços de educação e saúde de qualidade, associado a condições precárias de moradia e informação insuficiente sobre riscos domiciliares (como armazenamento inadequado de produtos tóxicos), aumenta a vulnerabilidade de famílias a intoxicações acidentais, especialmente em crianças pequenas, o que justifica e reforça a importância de ações educativas direcionadas especificamente às comunidades mais expostas a esse tipo de risco ambiental. Correta. Essa é a relação corretamente estabelecida entre determinantes sociais e maior vulnerabilidade a intoxicações acidentais."
      },
      {
        "letra": "C",
        "texto": "apenas fatores biológicos individuais da criança determinam o risco de intoxicação exógena, sem qualquer influência reconhecida de fatores sociais ou ambientais sobre esse desfecho.",
        "correta": false,
        "justificativa": "Incorreta. Fatores sociais e ambientais têm influência reconhecida e relevante sobre o risco de intoxicação exógena, não sendo esse desfecho determinado apenas por fatores biológicos individuais da criança."
      },
      {
        "letra": "D",
        "texto": "o ambiente psicossocial só é relevante para a ocorrência de intoxicações intencionais em adultos, nunca sendo fator relevante para intoxicações acidentais em crianças pequenas.",
        "correta": false,
        "justificativa": "Incorreta. O ambiente psicossocial é relevante tanto para intoxicações intencionais em adultos quanto para intoxicações acidentais em crianças pequenas, como discutido ao longo desta situação-problema."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q19"
  },
  {
    "enunciado": "Após o desfecho do caso da criança intoxicada, uma equipe de gestão municipal de saúde planeja medidas preventivas voltadas à redução de novos casos semelhantes em seu território, considerando os produtos envolvidos (raticidas e outros agrotóxicos de uso domiciliar). Entre as medidas efetivas de saúde pública reconhecidas para essa finalidade, incluem-se",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "venda livre e completamente irrestrita desses produtos, sem qualquer forma de regulação sanitária ou controle de acesso pela população.",
        "correta": false,
        "justificativa": "Incorreta. A venda completamente irrestrita, sem qualquer regulação, aumentaria, e não reduziria, o risco de intoxicações acidentais, sendo o oposto de uma medida preventiva eficaz."
      },
      {
        "letra": "B",
        "texto": "regulação sanitária da comercialização, exigência de embalagens com fechamento de segurança, rotulagem adequada com informações de risco, e ações de educação em saúde sobre armazenamento seguro em domicílios.",
        "correta": true,
        "justificativa": "A regulação sanitária da comercialização de produtos tóxicos, incluindo exigência de embalagens com fechamento de segurança, rotulagem adequada com informações claras sobre riscos, e ações educativas direcionadas sobre armazenamento seguro em domicílios, são medidas reconhecidas e eficazes de prevenção de intoxicações acidentais, especialmente relevantes em crianças pequenas, sem exigir a eliminação total desses produtos, que muitas vezes cumprem função importante de controle de pragas. Correta. Essas são exatamente as medidas de saúde pública reconhecidas e eficazes para prevenção de intoxicações acidentais por produtos tóxicos domiciliares."
      },
      {
        "letra": "C",
        "texto": "ausência completa de qualquer fiscalização sanitária sobre a comercialização de produtos tóxicos de uso domiciliar e agrícola.",
        "correta": false,
        "justificativa": "Incorreta. A ausência completa de fiscalização sanitária contraria os princípios de prevenção discutidos, sendo medida oposta ao que é recomendado pela saúde pública."
      },
      {
        "letra": "D",
        "texto": "eliminação total e imediata do uso desses produtos em toda a sociedade, sem qualquer alternativa reconhecida de controle de pragas domiciliares ou agrícolas.",
        "correta": false,
        "justificativa": "Incorreta. A eliminação total e imediata desses produtos, sem qualquer alternativa de controle de pragas, não é medida realista nem necessariamente a mais eficaz; a regulação adequada do uso e armazenamento é abordagem mais equilibrada e amplamente recomendada."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP1_ENAMED — Q20"
  },
  {
    "enunciado": "Ao diferenciar os tipos de intoxicação para os estudantes de medicina, o professor destaca que um dos tipos se caracteriza por manifestações clínicas que decorrem de exposições repetidas a um agente tóxico ao longo de meses ou anos, frequentemente com quadro clínico insidioso e de difícil reconhecimento inicial. Esse tipo de intoxicação é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "intoxicação aguda, tipo caracterizado por exposição única e manifestações de início rápido, e não pela característica descrita.",
        "correta": false,
        "justificativa": "Incorreta. A intoxicação aguda é caracterizada pelo padrão oposto: exposição única (ou de curta duração) com manifestações de início rápido, e não pela exposição repetida e prolongada descrita."
      },
      {
        "letra": "B",
        "texto": "intoxicação crônica.",
        "correta": true,
        "justificativa": "A intoxicação crônica resulta de exposições repetidas e prolongadas ao agente tóxico ao longo de meses ou anos, com quadro clínico frequentemente insidioso, confuso e, por vezes, irreversível, diferentemente da intoxicação aguda, caracterizada por exposição única e manifestações de início rápido. Correta. Intoxicação crônica é exatamente o tipo descrito no enunciado."
      },
      {
        "letra": "C",
        "texto": "intoxicação subclínica, termo distinto que designa exposição sem manifestação clínica evidente, e não o padrão descrito.",
        "correta": false,
        "justificativa": "Incorreta. Intoxicação subclínica designa exposição sem manifestação clínica evidente detectável, conceito distinto do padrão de exposição repetida e prolongada descrito."
      },
      {
        "letra": "D",
        "texto": "intoxicação latente, termo que não corresponde à classificação toxicológica padrão para o padrão descrito no enunciado.",
        "correta": false,
        "justificativa": "Incorreta. Intoxicação latente não é termo padrão da classificação toxicológica clássica para o padrão de exposição repetida e prolongada descrito no enunciado."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q1"
  },
  {
    "enunciado": "Durante exame físico de um paciente com suspeita de intoxicação crônica por metal pesado, o médico observa uma linha escurecida na margem gengival, achado clássico (embora pouco sensível) descrito na literatura para esse tipo específico de intoxicação. Esse achado clínico é conhecido como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "linha de Burton.",
        "correta": true,
        "justificativa": "A linha de Burton é achado clássico (embora pouco sensível e específico) da intoxicação crônica por chumbo, correspondendo a uma linha escura na margem gengival por depósito de sulfeto de chumbo, decorrente da ação de bactérias orais sobre o chumbo circulante nos casos de exposição crônica significativa. Correta. Linha de Burton é exatamente o achado clínico descrito, associado à intoxicação crônica por chumbo."
      },
      {
        "letra": "B",
        "texto": "sinal de Chvostek, achado relacionado à hipocalcemia, sem relação com o achado descrito.",
        "correta": false,
        "justificativa": "Incorreta. Sinal de Chvostek está relacionado à hipocalcemia (contração da musculatura facial ao percutir o nervo facial), sem relação com o achado gengival descrito no caso."
      },
      {
        "letra": "C",
        "texto": "linha de Beau, achado relacionado a alterações ungueais, sem relação com o achado gengival descrito.",
        "correta": false,
        "justificativa": "Incorreta. Linha de Beau é achado relacionado a alterações ungueais transversais, associado a estresse sistêmico agudo, sem relação com o achado gengival descrito."
      },
      {
        "letra": "D",
        "texto": "sinal de Trousseau, achado relacionado à hipocalcemia, sem relação com o achado descrito.",
        "correta": false,
        "justificativa": "Incorreta. Sinal de Trousseau está relacionado à hipocalcemia (espasmo carpal ao insuflar manguito de pressão), sem relação com o achado gengival descrito no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q2"
  },
  {
    "enunciado": "Ao investigar casos de intoxicação crônica relacionados a atividades laborais específicas, o professor destaca alguns metais e solventes classicamente associados a esse tipo de exposição ocupacional prolongada, com efeitos sistêmicos difusos sobre múltiplos órgãos. Os principais agentes tóxicos associados a intoxicações crônicas de origem ocupacional incluem",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "chumbo, mercúrio e benzeno.",
        "correta": true,
        "justificativa": "Chumbo, mercúrio e o solvente orgânico benzeno estão entre os principais agentes associados a intoxicações crônicas relacionadas a atividades ocupacionais (como reciclagem de materiais, indústria de baterias, mineração, indústria química), com efeitos difusos sobre múltiplos órgãos e sistemas, incluindo sistema nervoso, hematológico e renal, dependendo do agente específico envolvido. Correta. Chumbo, mercúrio e benzeno são exatamente os agentes classicamente associados a intoxicações crônicas de origem ocupacional descritos no enunciado."
      },
      {
        "letra": "B",
        "texto": "cálcio, potássio e sódio, eletrólitos fisiológicos essenciais ao organismo, sem relação com intoxicações ocupacionais crônicas.",
        "correta": false,
        "justificativa": "Incorreta. Cálcio, potássio e sódio são eletrólitos fisiológicos essenciais, sem relação com intoxicações ocupacionais crônicas."
      },
      {
        "letra": "C",
        "texto": "ferro e zinco em concentrações fisiológicas normais, sem relação com intoxicações ocupacionais crônicas descritas no contexto laboral.",
        "correta": false,
        "justificativa": "Incorreta. Ferro e zinco em concentrações fisiológicas normais não são agentes de intoxicação ocupacional crônica; excessos desses elementos poderiam ser tóxicos, mas não é essa a associação classicamente descrita no contexto ocupacional."
      },
      {
        "letra": "D",
        "texto": "magnésio e cloro em uso terapêutico habitual, sem relação com intoxicações ocupacionais crônicas descritas no contexto laboral.",
        "correta": false,
        "justificativa": "Incorreta. Magnésio e cloro em uso terapêutico habitual não são agentes associados a intoxicações ocupacionais crônicas descritas no contexto laboral discutido."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q3"
  },
  {
    "enunciado": "Durante discussão sobre gestão adequada de resíduos, um estudante pergunta como funciona o mecanismo que obriga determinados setores produtivos a recolher de volta certos produtos após o uso do consumidor, como pilhas, baterias e embalagens de agrotóxicos, garantindo destinação ambientalmente adequada a esses materiais. Esse mecanismo de gestão de resíduos é denominado",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "logística reversa.",
        "correta": true,
        "justificativa": "A logística reversa obrigatória refere-se aos mecanismos de retorno de determinados produtos (como pilhas, baterias e embalagens de agrotóxicos) ao setor produtivo após o uso pelo consumidor, para destinação ambientalmente adequada, sendo instrumento importante da Política Nacional de Resíduos Sólidos no Brasil. Correta. Logística reversa é exatamente o mecanismo descrito no enunciado, referente à devolução obrigatória de determinados produtos ao setor produtivo."
      },
      {
        "letra": "B",
        "texto": "coleta seletiva domiciliar comum, mecanismo distinto voltado à separação de resíduos recicláveis genéricos, e não especificamente à devolução obrigatória de produtos específicos ao setor produtivo.",
        "correta": false,
        "justificativa": "Incorreta. Coleta seletiva domiciliar comum é mecanismo mais amplo e genérico de separação de resíduos recicláveis, distinto do mecanismo específico de devolução obrigatória descrito."
      },
      {
        "letra": "C",
        "texto": "incineração hospitalar, mecanismo de tratamento térmico de resíduos de serviços de saúde, distinto do mecanismo de devolução ao setor produtivo descrito.",
        "correta": false,
        "justificativa": "Incorreta. Incineração hospitalar é mecanismo de tratamento térmico específico de resíduos de serviços de saúde, sem relação com o mecanismo de devolução ao setor produtivo descrito no enunciado."
      },
      {
        "letra": "D",
        "texto": "compostagem orgânica, mecanismo de tratamento biológico de resíduos orgânicos, sem relação com o mecanismo de devolução de produtos tóxicos descrito.",
        "correta": false,
        "justificativa": "Incorreta. Compostagem orgânica é mecanismo de tratamento biológico específico para resíduos orgânicos, sem relação com o mecanismo de devolução de produtos tóxicos descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q4"
  },
  {
    "enunciado": "Durante discussão sobre riscos ambientais associados a atividades industriais, um estudante questiona por que a contaminação do lençol freático por resíduos químicos industriais é considerada risco relevante à saúde pública, mesmo quando a indústria responsável está distante de áreas residenciais. Essa contaminação representa risco à saúde principalmente por",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não ter qualquer relação reconhecida com o consumo humano de água em contextos de abastecimento por poços ou nascentes.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida e relevante entre contaminação do lençol freático e risco ao consumo humano de água, especialmente em áreas dependentes de água subterrânea."
      },
      {
        "letra": "B",
        "texto": "poder comprometer fontes de abastecimento de água utilizadas para consumo humano, especialmente em áreas dependentes de água subterrânea.",
        "correta": true,
        "justificativa": "A contaminação do lençol freático pode comprometer fontes de água utilizadas para abastecimento e consumo humano (poços, nascentes e sistemas de captação subterrânea), representando risco relevante à saúde pública, especialmente em áreas sem cobertura adequada de saneamento e abastecimento tratado, mesmo quando a fonte poluidora está geograficamente distante das residências afetadas, devido ao fluxo subterrâneo da água. Correta. Essa é a explicação correta sobre o risco à saúde pública associado à contaminação do lençol freático."
      },
      {
        "letra": "C",
        "texto": "afetar exclusivamente a fauna aquática local, sem qualquer risco reconhecido à saúde humana da população residente na região.",
        "correta": false,
        "justificativa": "Incorreta. A contaminação do lençol freático representa risco também à saúde humana, e não apenas à fauna aquática, especialmente quando compromete fontes de abastecimento de água para consumo."
      },
      {
        "letra": "D",
        "texto": "ser fenômeno reversível espontaneamente em poucas horas, sem necessidade de qualquer monitoramento ambiental prolongado.",
        "correta": false,
        "justificativa": "Incorreta. A contaminação de aquíferos subterrâneos frequentemente persiste por longos períodos, exigindo monitoramento ambiental prolongado, e não sendo fenômeno que se resolve espontaneamente em poucas horas."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q5"
  },
  {
    "enunciado": "Dois irmãos, trabalhadores de uma empresa de reciclagem de resíduos industriais há cerca de três anos, procuram atendimento médico com queixas de fadiga progressiva, dores musculares difusas, formigamento em extremidades e, ao exame físico, uma linha escurecida na gengiva de ambos. Diante desse quadro clínico, a hipótese diagnóstica mais provável é intoxicação crônica por",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "paracetamol, hipótese incompatível com o quadro clínico crônico e o achado gengival característico descritos.",
        "correta": false,
        "justificativa": "Incorreta. O quadro clínico crônico com achado gengival característico não é compatível com intoxicação por paracetamol, que tipicamente causa hepatotoxicidade em contexto de superdosagem aguda."
      },
      {
        "letra": "B",
        "texto": "chumbo.",
        "correta": true,
        "justificativa": "A associação de fadiga progressiva, dores musculares difusas, parestesias em extremidades e linha gengival escurecida (linha de Burton), em contexto de exposição ocupacional prolongada a resíduos industriais, é fortemente sugestiva de intoxicação crônica por chumbo, agente comum em atividades de reciclagem de materiais e resíduos eletrônicos, entre outras. Correta. O quadro clínico descrito é sugestivo de intoxicação crônica por chumbo, comum em trabalhadores expostos a resíduos industriais."
      },
      {
        "letra": "C",
        "texto": "organofosforado agudo, hipótese incompatível com o padrão de exposição crônica ocupacional relatado no caso.",
        "correta": false,
        "justificativa": "Incorreta. O padrão de exposição descrito (três anos de trabalho em reciclagem) é crônico, e não agudo, sendo incompatível com organofosforado agudo, que causaria quadro de síndrome colinérgica de instalação rápida."
      },
      {
        "letra": "D",
        "texto": "vitamina D em excesso, hipótese incompatível com o quadro clínico e o achado gengival característico descritos.",
        "correta": false,
        "justificativa": "Incorreta. Excesso de vitamina D não é causa reconhecida do quadro clínico e do achado gengival característico descritos no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q6"
  },
  {
    "enunciado": "Diante da suspeita de doença relacionada ao trabalho nos dois irmãos atendidos, a médica assistente busca aprofundar a investigação sobre a atividade laboral exercida por ambos, além de considerar o afastamento temporário das atividades consideradas insalubres. Em relação à conduta correta da médica assistente diante dessa suspeita de doença ocupacional, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não deve investigar o ambiente de trabalho dos pacientes, por não ser atribuição médica avaliar condições laborais específicas.",
        "correta": false,
        "justificativa": "Incorreta. A investigação do ambiente de trabalho relatado pelo paciente é parte importante da anamnese ocupacional, sendo atribuição relevante da avaliação médica diante de suspeita de doença relacionada ao trabalho."
      },
      {
        "letra": "B",
        "texto": "deve aprofundar a investigação sobre a exposição ocupacional relatada, orientar afastamento das atividades insalubres quando clinicamente indicado, e iniciar registro adequado que subsidiará a avaliação do nexo causal entre o trabalho exercido e o adoecimento apresentado.",
        "correta": true,
        "justificativa": "Diante de suspeita de doença ocupacional, cabe à equipe de saúde investigar detalhadamente a exposição no ambiente de trabalho relatada pelos pacientes, orientar afastamento das atividades insalubres quando clinicamente indicado (com base em avaliação de risco e gravidade do quadro), e iniciar o registro adequado (incluindo documentação clínica detalhada) que subsidiará a avaliação posterior do nexo causal entre o trabalho exercido e o adoecimento apresentado pelos pacientes. Correta. Essa é a conduta correta e completa diante de suspeita de doença ocupacional identificada nos dois irmãos atendidos."
      },
      {
        "letra": "C",
        "texto": "deve encaminhar imediatamente os pacientes para demissão da empresa, sem qualquer investigação clínica ou ocupacional complementar prévia.",
        "correta": false,
        "justificativa": "Incorreta. Encaminhar para demissão não é atribuição nem conduta adequada da equipe médica; a questão trabalhista deve seguir seus próprios trâmites legais, sendo o foco médico a avaliação clínica, o afastamento quando indicado e o registro adequado do caso."
      },
      {
        "letra": "D",
        "texto": "deve tratar apenas os sintomas apresentados, sem qualquer relação com o histórico ocupacional relatado pelos pacientes durante a anamnese.",
        "correta": false,
        "justificativa": "Incorreta. Tratar apenas os sintomas, sem qualquer relação com o histórico ocupacional relatado, ignoraria informação relevante para o diagnóstico correto e para a caracterização do nexo causal com o trabalho."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q7"
  },
  {
    "enunciado": "Nos exames complementares dos dois irmãos com suspeita de intoxicação crônica ocupacional, observam-se anemia e alterações discretas de enzimas hepáticas, achados que geram discussão na equipe sobre sua interpretação clínica no contexto da exposição relatada. Esses achados laboratoriais, no contexto de exposição ocupacional crônica a resíduos industriais, sugerem",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ausência completa de qualquer toxicidade sistêmica relacionada à exposição ocupacional relatada pelos pacientes.",
        "correta": false,
        "justificativa": "Incorreta. Esses achados sugerem, ao contrário, possível toxicidade sistêmica relacionada à exposição ocupacional relatada, e não ausência completa de qualquer efeito tóxico."
      },
      {
        "letra": "B",
        "texto": "possível efeito tóxico sistêmico do agente envolvido na exposição ocupacional, exigindo investigação complementar dirigida para melhor caracterização do quadro.",
        "correta": true,
        "justificativa": "Alterações hematológicas (anemia) e hepáticas discretas, no contexto de exposição ocupacional crônica a agentes químicos (como o chumbo, suspeito no caso), sugerem possível toxicidade sistêmica relacionada à exposição relatada, justificando investigação complementar dirigida (dosagem sérica do agente suspeito, avaliação hematológica e hepática mais detalhada) para melhor caracterização do grau de comprometimento orgânico e confirmação diagnóstica. Correta. Essa é a interpretação correta desses achados laboratoriais no contexto da exposição ocupacional crônica relatada pelos pacientes."
      },
      {
        "letra": "C",
        "texto": "diagnóstico definitivo e conclusivo de hepatite viral aguda, sem necessidade de qualquer outra investigação complementar adicional.",
        "correta": false,
        "justificativa": "Incorreta. Não há elementos suficientes para diagnóstico definitivo e conclusivo de hepatite viral aguda apenas com esses achados; investigação complementar dirigida é necessária antes de qualquer conclusão diagnóstica definitiva."
      },
      {
        "letra": "D",
        "texto": "resultado laboratorial esperado e sem qualquer relevância clínica em qualquer contexto de exposição ocupacional a resíduos industriais.",
        "correta": false,
        "justificativa": "Incorreta. Esses achados têm relevância clínica significativa no contexto da exposição ocupacional relatada, não devendo ser considerados esperados e irrelevantes."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q8"
  },
  {
    "enunciado": "Durante discussão sobre medidas de recuperação ambiental em áreas contaminadas por resíduos industriais, semelhantes ao contexto de trabalho dos dois irmãos atendidos, um estudante questiona quais estratégias técnicas podem ser adotadas para reduzir os riscos de contaminação persistente em solos e corpos d'água afetados. Uma medida reconhecida para essa finalidade é a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "remediação ambiental, que pode incluir tratamento técnico do solo e da água contaminados por meio de diferentes tecnologias específicas.",
        "correta": true,
        "justificativa": "A remediação ambiental, incluindo tratamento técnico do solo e da água contaminados por meio de diferentes tecnologias (como biorremediação, tratamento químico ou físico, entre outras), é medida reconhecida para recuperação de áreas degradadas por poluição química industrial, buscando reduzir riscos à saúde humana e ao ecossistema afetado. Correta. Remediação ambiental é exatamente a medida técnica reconhecida para recuperação de áreas contaminadas por resíduos industriais."
      },
      {
        "letra": "B",
        "texto": "simples espera pela degradação natural dos contaminantes ao longo do tempo, sem qualquer intervenção técnica adicional na área afetada.",
        "correta": false,
        "justificativa": "Incorreta. A simples espera pela degradação natural, sem qualquer intervenção técnica, não é estratégia reconhecida e eficaz para a maioria dos contaminantes industriais persistentes, especialmente metais pesados."
      },
      {
        "letra": "C",
        "texto": "impossibilidade técnica total de recuperação de qualquer área ambientalmente contaminada por resíduos industriais, independentemente da tecnologia disponível.",
        "correta": false,
        "justificativa": "Incorreta. Há tecnologias disponíveis e reconhecidas de remediação ambiental, contrariando a afirmação de impossibilidade técnica total de recuperação dessas áreas."
      },
      {
        "letra": "D",
        "texto": "transferência deliberada da contaminação identificada para áreas ainda não afetadas, como estratégia reconhecida de manejo ambiental.",
        "correta": false,
        "justificativa": "Incorreta. A transferência deliberada de contaminação para outras áreas não é estratégia reconhecida de manejo ambiental; ao contrário, contraria os princípios de responsabilidade ambiental e proteção da saúde pública."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q9"
  },
  {
    "enunciado": "Diante do diagnóstico de possível doença ocupacional nos dois irmãos, a equipe de saúde orienta a busca por seus direitos trabalhistas e previdenciários relacionados ao afastamento necessário para tratamento e investigação complementar. Em relação aos aspectos legais que amparam trabalhadores nessa situação, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não existe qualquer legislação brasileira específica que reconheça doenças relacionadas ao trabalho para fins previdenciários ou trabalhistas.",
        "correta": false,
        "justificativa": "Incorreta. Há legislação brasileira específica que reconhece doenças relacionadas ao trabalho, contrariando a afirmação de ausência completa de amparo legal."
      },
      {
        "letra": "B",
        "texto": "existe legislação previdenciária e trabalhista brasileira que reconhece doenças relacionadas ao trabalho, garantindo direitos como afastamento remunerado (auxílio-doença acidentário) e estabilidade provisória em determinadas situações específicas.",
        "correta": true,
        "justificativa": "A legislação brasileira (previdenciária e trabalhista) reconhece doenças relacionadas ao trabalho, prevendo direitos como afastamento remunerado por meio do auxílio-doença acidentário e estabilidade provisória após o retorno ao trabalho em determinadas situações, quando estabelecido o nexo causal entre a atividade laboral exercida e o agravo à saúde apresentado pelo trabalhador, como pode ser o caso dos dois irmãos atendidos. Correta. Essa é a descrição correta dos direitos previdenciários e trabalhistas reconhecidos para trabalhadores com doença relacionada ao trabalho no Brasil."
      },
      {
        "letra": "C",
        "texto": "o trabalhador deve arcar integralmente com todos os custos do próprio tratamento relacionado à doença ocupacional, sem qualquer amparo legal reconhecido nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. Há amparo legal e previdenciário reconhecido para trabalhadores com doença ocupacional, não sendo correto afirmar que o trabalhador deve arcar integralmente com todos os custos sem qualquer suporte legal."
      },
      {
        "letra": "D",
        "texto": "o estabelecimento de nexo causal entre trabalho exercido e doença apresentada nunca pode ser reconhecido legalmente no Brasil, independentemente das circunstâncias específicas do caso.",
        "correta": false,
        "justificativa": "Incorreta. O nexo causal entre trabalho e doença pode, sim, ser reconhecido legalmente no Brasil, mediante avaliação técnica e pericial adequada das circunstâncias específicas de cada caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q10"
  },
  {
    "enunciado": "Ao investigar as possíveis causas ambientais relacionadas ao adoecimento dos dois irmãos, a equipe de saúde busca informações sobre os órgãos responsáveis pela fiscalização da poluição ambiental e do manejo adequado de resíduos industriais no território onde a empresa de reciclagem está instalada. Em relação a essas instituições de fiscalização no Brasil, destaca-se o papel de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "apenas hospitais privados da região, sem qualquer participação governamental reconhecida na fiscalização ambiental relacionada a resíduos industriais.",
        "correta": false,
        "justificativa": "Incorreta. Hospitais privados não têm função de fiscalização ambiental; essa é atribuição de órgãos governamentais específicos, como descrito na alternativa correta."
      },
      {
        "letra": "B",
        "texto": "órgãos ambientais estaduais e federais (como o Ibama e órgãos estaduais de meio ambiente), em conjunto com a vigilância sanitária, que atuam de forma articulada na fiscalização ambiental e na proteção da saúde pública.",
        "correta": true,
        "justificativa": "A fiscalização da poluição ambiental e do manejo adequado de resíduos industriais no Brasil envolve órgãos ambientais federais (como o Ibama) e estaduais (secretarias e órgãos estaduais de meio ambiente), além da vigilância sanitária, que atuam de forma integrada e articulada na proteção ambiental e da saúde pública, especialmente em contextos de risco ocupacional e ambiental como o descrito no caso dos dois irmãos. Correta. Essa é a descrição correta das instituições responsáveis pela fiscalização ambiental relacionada a resíduos industriais no Brasil."
      },
      {
        "letra": "C",
        "texto": "exclusivamente organizações não governamentais internacionais, sem qualquer órgão nacional brasileiro efetivamente envolvido nessa fiscalização.",
        "correta": false,
        "justificativa": "Incorreta. Há órgãos nacionais brasileiros efetivamente envolvidos nessa fiscalização, como o Ibama e órgãos estaduais de meio ambiente, contrariando a afirmação de exclusividade de organizações internacionais."
      },
      {
        "letra": "D",
        "texto": "nenhuma instituição específica, já que a fiscalização ambiental relacionada a resíduos industriais não é regulamentada formalmente no país.",
        "correta": false,
        "justificativa": "Incorreta. Há regulamentação formal e órgãos específicos responsáveis pela fiscalização ambiental relacionada a resíduos industriais no Brasil, contrariando a afirmação de ausência de regulamentação."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q11"
  },
  {
    "enunciado": "Ao explicar aos irmãos com suspeita de intoxicação crônica por chumbo o motivo do formigamento relatado nas extremidades, especialmente nas mãos, o neurologista descreve o mecanismo fisiopatológico específico pelo qual esse metal pesado compromete o sistema nervoso periférico ao longo de exposições prolongadas. Esse mecanismo envolve, mais especificamente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "desmielinização e disfunção axonal de nervos periféricos, com predileção classicamente descrita por fibras motoras, podendo causar neuropatia periférica característica em casos de intoxicação crônica mais avançada.",
        "correta": true,
        "justificativa": "A intoxicação crônica por chumbo pode causar neuropatia periférica, com desmielinização e disfunção axonal, classicamente descrita com predileção por fibras motoras (podendo causar, em casos mais avançados, a chamada \"mão caída\" por comprometimento do nervo radial), explicando sintomas como parestesias (formigamento) e fraqueza relatados por trabalhadores cronicamente expostos a esse metal pesado. Correta. Essa é a explicação fisiopatológica correta do mecanismo pelo qual o chumbo compromete o sistema nervoso periférico na intoxicação crônica."
      },
      {
        "letra": "B",
        "texto": "ausência completa de qualquer efeito neurológico reconhecido do chumbo sobre o sistema nervoso periférico ou central em qualquer grau de exposição.",
        "correta": false,
        "justificativa": "Incorreta. Há efeito neurológico bem reconhecido e documentado do chumbo sobre o sistema nervoso periférico e central em casos de exposição crônica significativa, contrariando a afirmação de ausência completa de efeito."
      },
      {
        "letra": "C",
        "texto": "efeito exclusivamente restrito ao sistema nervoso central, sem qualquer repercussão sobre nervos periféricos em casos de intoxicação crônica por chumbo.",
        "correta": false,
        "justificativa": "Incorreta. O chumbo também pode afetar o sistema nervoso periférico (neuropatia), além de possíveis efeitos centrais, não sendo seu efeito exclusivamente restrito ao sistema nervoso central."
      },
      {
        "letra": "D",
        "texto": "estímulo direto e seletivo restrito apenas a fibras sensitivas táteis específicas, sem qualquer outro efeito neurológico reconhecido na intoxicação por chumbo.",
        "correta": false,
        "justificativa": "Incorreta. O mecanismo neurotóxico do chumbo tem predileção descrita por fibras motoras (e não exclusivamente sensitivas táteis), sendo mais amplo do que o estímulo seletivo restrito descrito na alternativa."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q12"
  },
  {
    "enunciado": "Durante aula de laboratório morfofuncional integrada à discussão do caso dos dois irmãos com parestesias em membros superiores, os estudantes revisam a anatomia da inervação dessa região corporal, relacionando-a com a apresentação clínica observada na possível intoxicação por metal pesado. Em relação a essa correlação anatômica, o plexo braquial é responsável pela inervação motora e sensitiva de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exclusivamente da face e do pescoço, sem qualquer relação com a inervação do membro superior relatada no quadro clínico dos irmãos.",
        "correta": false,
        "justificativa": "Incorreta. O plexo braquial não inerva a face e o pescoço (que são inervados por outros plexos, como o cervical e nervos cranianos); sua área de inervação é o membro superior, conforme descrito na alternativa correta."
      },
      {
        "letra": "B",
        "texto": "todo o membro superior, incluindo a musculatura e a sensibilidade da mão, região frequentemente acometida por parestesias em quadros de neuropatia tóxica, como a intoxicação crônica por metais pesados.",
        "correta": true,
        "justificativa": "O plexo braquial origina os principais nervos periféricos responsáveis pela inervação motora e sensitiva de todo o membro superior, incluindo a mão, região frequentemente acometida por parestesias em neuropatias tóxicas, como a associada à intoxicação crônica por metais pesados relatada no caso dos dois irmãos. Correta. Essa é a descrição anatômica correta do território de inervação do plexo braquial, relevante para explicar as parestesias relatadas pelos irmãos."
      },
      {
        "letra": "C",
        "texto": "exclusivamente dos membros inferiores, sem qualquer relação com a apresentação clínica de parestesias em membros superiores relatada no caso.",
        "correta": false,
        "justificativa": "Incorreta. Membros inferiores são inervados pelo plexo lombossacral, e não pelo plexo braquial, que é específico do membro superior."
      },
      {
        "letra": "D",
        "texto": "apenas da musculatura respiratória, sem qualquer relação com a inervação sensitivo-motora do membro superior relatada no quadro clínico dos irmãos.",
        "correta": false,
        "justificativa": "Incorreta. A musculatura respiratória tem inervação relacionada principalmente ao nervo frênico (originado do plexo cervical), e não exclusivamente ao plexo braquial."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q13"
  },
  {
    "enunciado": "Após o diagnóstico inicial dos dois irmãos, um deles questiona à equipe de saúde se outros colegas de trabalho da mesma empresa poderiam estar acometidos por quadro semelhante, mesmo sem terem procurado atendimento médico ainda. Diante dessa possibilidade levantada, a conduta de saúde pública mais adequada é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "investigar exclusivamente os dois irmãos já atendidos, sem qualquer ação adicional voltada aos demais trabalhadores da mesma empresa.",
        "correta": false,
        "justificativa": "Incorreta. Restringir a investigação apenas aos dois irmãos já atendidos ignora o potencial impacto coletivo levantado pelo próprio paciente, sendo conduta incompleta do ponto de vista de saúde pública."
      },
      {
        "letra": "B",
        "texto": "notificar o caso como possível doença relacionada ao trabalho e articular investigação ambiental/ocupacional mais ampla, incluindo avaliação de outros trabalhadores potencialmente expostos ao mesmo risco identificado na empresa.",
        "correta": true,
        "justificativa": "Diante de suspeita de doença ocupacional com potencial impacto coletivo (como levantado pelo próprio paciente em relação a outros colegas de trabalho), a conduta de saúde pública inclui a notificação do caso e a articulação de investigação ambiental e ocupacional mais ampla, avaliando outros trabalhadores potencialmente expostos ao mesmo risco identificado na empresa, buscando identificar precocemente outros casos e prevenir agravamento coletivo do problema. Correta. Essa é a conduta correta e completa diante da possibilidade de impacto coletivo levantada no caso, envolvendo notificação e investigação ampliada."
      },
      {
        "letra": "C",
        "texto": "aguardar que os demais trabalhadores da empresa procurem espontaneamente atendimento médico por conta própria, sem qualquer notificação prévia ou ação proativa da equipe de saúde.",
        "correta": false,
        "justificativa": "Incorreta. Aguardar que os demais trabalhadores procurem espontaneamente atendimento, sem qualquer ação proativa, atrasaria desnecessariamente a identificação de outros possíveis casos e a proteção coletiva dos trabalhadores expostos."
      },
      {
        "letra": "D",
        "texto": "considerar que não há qualquer obrigação da equipe de saúde de investigar coletivamente o ambiente de trabalho da empresa envolvida no caso.",
        "correta": false,
        "justificativa": "Incorreta. Há, sim, papel relevante da equipe de saúde na articulação de investigação coletiva diante de suspeita de doença ocupacional com potencial impacto sobre outros trabalhadores da mesma empresa."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q14"
  },
  {
    "enunciado": "Ao discutir estratégias mais amplas de gestão ambiental relacionadas ao caso dos dois irmãos, trabalhadores de empresa de reciclagem de resíduos industriais, a equipe de saúde ambiental do município reflete sobre medidas que possam prevenir tanto o adoecimento de trabalhadores quanto a exaustão de recursos naturais associada ao manejo inadequado de resíduos. Uma estratégia relevante discutida nesse contexto é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "incentivo à economia circular, com reaproveitamento e reciclagem tecnicamente adequados dos resíduos industriais, reduzindo a necessidade de extração de novos recursos naturais e, ao mesmo tempo, promovendo condições seguras de trabalho.",
        "correta": true,
        "justificativa": "O incentivo à economia circular, com reaproveitamento e reciclagem tecnicamente adequados (incluindo condições seguras de trabalho para os profissionais envolvidos, o que não ocorreu adequadamente no caso dos irmãos) dos resíduos industriais, é estratégia relevante para reduzir a exaustão de recursos naturais e minimizar impactos ambientais e ocupacionais, sendo tema central da gestão de resíduos sólidos no Brasil, regulamentada pela Política Nacional de Resíduos Sólidos. Correta. Essa é a estratégia relevante e reconhecida discutida no enunciado, integrando sustentabilidade ambiental e segurança ocupacional."
      },
      {
        "letra": "B",
        "texto": "incineração de todo resíduo industrial gerado, sem qualquer controle técnico das emissões atmosféricas resultantes desse processo.",
        "correta": false,
        "justificativa": "Incorreta. Incineração sem qualquer controle de emissões geraria novos riscos ambientais e à saúde, sendo o oposto de uma estratégia adequada de gestão de resíduos."
      },
      {
        "letra": "C",
        "texto": "descarte de resíduos industriais diretamente em corpos d'água próximos, como estratégia para reduzir custos operacionais das indústrias envolvidas.",
        "correta": false,
        "justificativa": "Incorreta. Descarte irregular em corpos d'água contraria completamente os princípios de gestão ambiental adequada e a legislação vigente, sendo prática ilegal e prejudicial ao meio ambiente e à saúde pública."
      },
      {
        "letra": "D",
        "texto": "ausência completa de qualquer política pública brasileira voltada à gestão adequada de resíduos industriais.",
        "correta": false,
        "justificativa": "Incorreta. Há política pública brasileira específica voltada à gestão de resíduos sólidos (Política Nacional de Resíduos Sólidos), contrariando a afirmação de ausência completa de regulamentação nessa área."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q15"
  },
  {
    "enunciado": "Durante revisão sobre outros agentes tóxicos ocupacionais relevantes, além do chumbo suspeito no caso dos dois irmãos, o professor destaca o benzeno, solvente orgânico amplamente utilizado industrialmente, cujo órgão-alvo principal de toxicidade crônica é distinto do sistema nervoso periférico afetado pelo chumbo. Em relação à toxicidade crônica do benzeno, o principal órgão-alvo é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a medula óssea, podendo causar aplasia medular, mielodisplasia e leucemias em casos de exposição crônica significativa.",
        "correta": true,
        "justificativa": "O benzeno é reconhecidamente tóxico à medula óssea, podendo causar aplasia medular, síndromes mielodisplásicas e leucemias (especialmente a leucemia mieloide aguda) em casos de exposição ocupacional crônica significativa, sendo classificado como agente carcinogênico ocupacional relevante e amplamente estudado na medicina do trabalho. Correta. A medula óssea é exatamente o principal órgão-alvo da toxicidade crônica do benzeno, com potencial de causar aplasia medular e leucemias."
      },
      {
        "letra": "B",
        "texto": "exclusivamente a pele, sem qualquer efeito sistêmico reconhecido em casos de exposição ocupacional crônica ao benzeno.",
        "correta": false,
        "justificativa": "Incorreta. Embora o benzeno também possa ter efeitos cutâneos locais em exposições diretas, seu principal órgão-alvo de toxicidade sistêmica crônica é a medula óssea, e não exclusivamente a pele."
      },
      {
        "letra": "C",
        "texto": "o sistema urinário, sem qualquer efeito hematológico reconhecido em casos de exposição ocupacional crônica ao benzeno.",
        "correta": false,
        "justificativa": "Incorreta. O benzeno tem efeito hematológico bem reconhecido e central na sua toxicidade crônica, não sendo seu principal órgão-alvo o sistema urinário."
      },
      {
        "letra": "D",
        "texto": "exclusivamente o sistema respiratório superior, sem qualquer efeito sistêmico mais amplo reconhecido em casos de exposição ocupacional crônica ao benzeno.",
        "correta": false,
        "justificativa": "Incorreta. O sistema respiratório superior não é o principal órgão-alvo da toxicidade crônica do benzeno; seu efeito mais grave e reconhecido é sobre a medula óssea."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q16"
  },
  {
    "enunciado": "Diante da suspeita de intoxicação ocupacional crônica confirmada nos dois irmãos, a médica assistente orienta a suspensão temporária das atividades laborais mais insalubres exercidas por ambos na empresa de reciclagem. Em relação à justificativa clínica para essa conduta específica, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não há qualquer relação reconhecida entre a continuidade da exposição ocupacional e o agravamento do quadro clínico já apresentado pelos pacientes.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem reconhecida entre continuidade da exposição a agentes tóxicos e agravamento do quadro clínico, sendo esse justamente o racional da conduta de afastamento orientada pela médica assistente."
      },
      {
        "letra": "B",
        "texto": "a interrupção (ainda que temporária) da exposição ao agente tóxico suspeito é medida fundamental para impedir a progressão do dano à saúde já identificado e permite observar possível melhora clínica, contribuindo também para a caracterização do nexo causal entre o trabalho exercido e a doença.",
        "correta": true,
        "justificativa": "A interrupção (ainda que temporária) da exposição ao agente tóxico suspeito é medida fundamental para impedir a progressão do dano à saúde já identificado nos dois irmãos, além de permitir observar se há melhora clínica após o afastamento, o que contribui significativamente para a caracterização do nexo causal entre a atividade laboral exercida e o adoecimento apresentado pelos pacientes. Correta. Essa é a justificativa clínica correta e completa para a conduta de suspensão temporária das atividades laborais insalubres orientada no caso."
      },
      {
        "letra": "C",
        "texto": "o afastamento das atividades laborais insalubres não possui qualquer amparo legal reconhecido no Brasil para trabalhadores em situação semelhante à dos irmãos.",
        "correta": false,
        "justificativa": "Incorreta. Há amparo legal reconhecido no Brasil para afastamento de trabalhadores em situação de doença ocupacional, incluindo mecanismos previdenciários específicos para essa finalidade."
      },
      {
        "letra": "D",
        "texto": "a suspensão das atividades laborais deveria ser obrigatoriamente definitiva e automática desde o primeiro atendimento, sem qualquer possibilidade de reavaliação clínica posterior.",
        "correta": false,
        "justificativa": "Incorreta. A suspensão inicial pode ser temporária, com reavaliação clínica posterior conforme a evolução do quadro e a confirmação diagnóstica, não sendo necessariamente definitiva e automática desde o primeiro atendimento."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q17"
  },
  {
    "enunciado": "Ao propor medidas preventivas relacionadas ao caso dos dois irmãos, a equipe de saúde ambiental do município discute ações voltadas à redução da poluição por metais pesados associada a atividades industriais e de reciclagem semelhantes. Entre as medidas de prevenção e controle reconhecidas para essa finalidade, incluem-se",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ausência completa de qualquer regulação sobre a emissão de efluentes industriais no território municipal, sem qualquer forma de controle ambiental estabelecida.",
        "correta": false,
        "justificativa": "Incorreta. A ausência completa de regulação contraria completamente os princípios de prevenção discutidos, sendo o oposto de uma medida preventiva reconhecida."
      },
      {
        "letra": "B",
        "texto": "controle e tratamento técnico adequado de efluentes industriais antes de seu descarte final, monitoramento ambiental contínuo das áreas de risco, e fiscalização efetiva do cumprimento da legislação ambiental vigente.",
        "correta": true,
        "justificativa": "O controle e tratamento técnico adequado de efluentes industriais antes do descarte, o monitoramento ambiental contínuo das áreas de risco (incluindo empresas de reciclagem, como a envolvida no caso dos irmãos), e a fiscalização efetiva do cumprimento da legislação ambiental vigente são medidas fundamentais e reconhecidas de prevenção da poluição por metais pesados e outros agentes tóxicos industriais, associadas também à melhoria das condições ocupacionais de segurança. Correta. Essas são exatamente as medidas de prevenção e controle reconhecidas para a finalidade discutida no enunciado."
      },
      {
        "letra": "C",
        "texto": "incentivo ao descarte irregular de resíduos industriais, como estratégia para reduzir custos operacionais das empresas envolvidas na atividade de reciclagem.",
        "correta": false,
        "justificativa": "Incorreta. Incentivar descarte irregular para reduzir custos contraria completamente a legislação ambiental e os princípios de prevenção discutidos, sendo prática ilegal e prejudicial."
      },
      {
        "letra": "D",
        "texto": "eliminação total e imediata de qualquer atividade industrial e de reciclagem no território municipal, como única medida considerada eficaz para prevenção de intoxicações ocupacionais.",
        "correta": false,
        "justificativa": "Incorreta. A eliminação total das atividades industriais e de reciclagem não é a medida preventiva reconhecida; a estratégia mais adequada envolve regulação, controle técnico e melhoria das condições de segurança dessas atividades, e não sua eliminação completa."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q18"
  },
  {
    "enunciado": "Durante o acompanhamento ambulatorial dos dois irmãos após o diagnóstico de intoxicação crônica ocupacional, um deles relata também redução da libido, alterações de humor e fadiga persistente, sintomas que inicialmente ele mesmo considerava sem relação com sua condição de saúde ocupacional. Em relação a esses sintomas inespecíficos relatados, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "esses sintomas são irrelevantes clinicamente nesse contexto e não devem ser investigados ou considerados pela equipe de saúde que acompanha o caso.",
        "correta": false,
        "justificativa": "Incorreta. Esses sintomas têm relevância clínica potencial no contexto da intoxicação crônica ocupacional, não devendo ser desconsiderados pela equipe de saúde."
      },
      {
        "letra": "B",
        "texto": "esses sintomas inespecíficos podem refletir toxicidade sistêmica crônica relacionada à exposição ocupacional identificada, exigindo abordagem integral que considere aspectos físicos, psicológicos e sociais do trabalhador ao longo do acompanhamento.",
        "correta": true,
        "justificativa": "Sintomas inespecíficos como fadiga persistente, alterações de humor e redução da libido podem refletir toxicidade sistêmica crônica relacionada à exposição ocupacional identificada no caso dos irmãos, exigindo abordagem integral que considere os aspectos físicos, psicológicos e sociais do trabalhador exposto, sem menosprezar a relevância clínica desses sintomas apenas por seu caráter inicialmente inespecífico. Correta. Essa é a interpretação correta e a abordagem adequada diante desses sintomas inespecíficos relatados no contexto da intoxicação ocupacional crônica."
      },
      {
        "letra": "C",
        "texto": "esses sintomas indicam exclusivamente transtorno psiquiátrico primário, sem qualquer relação reconhecida com a exposição ocupacional relatada pelo paciente.",
        "correta": false,
        "justificativa": "Incorreta. Não há elementos suficientes para atribuir esses sintomas exclusivamente a transtorno psiquiátrico primário, ignorando a possível relação com a toxicidade sistêmica da exposição ocupacional identificada."
      },
      {
        "letra": "D",
        "texto": "apenas sintomas gastrointestinais deveriam ser considerados relevantes na avaliação clínica integral desse tipo de caso, e não os sintomas relatados pelo paciente.",
        "correta": false,
        "justificativa": "Incorreta. A avaliação clínica integral deve considerar todos os sintomas relatados pelo paciente, e não apenas sintomas gastrointestinais, para uma abordagem verdadeiramente abrangente do caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q19"
  },
  {
    "enunciado": "Após o desfecho do caso dos dois irmãos com intoxicação crônica ocupacional, a equipe de vigilância em saúde do trabalhador do município reflete sobre a importância da fiscalização contínua de órgãos ambientais e sanitários para prevenção de situações semelhantes em outras empresas do território. Em relação a essa importância, é correto concluir que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a fiscalização é dispensável quando a empresa opera há muitos anos sem notificações formais anteriores de agravos relacionados ao trabalho.",
        "correta": false,
        "justificativa": "Incorreta. A ausência de notificações formais anteriores não elimina a necessidade de fiscalização contínua, já que riscos ocupacionais podem permanecer não identificados por longos períodos até a ocorrência de casos como o dos irmãos."
      },
      {
        "letra": "B",
        "texto": "a fiscalização contínua de órgãos ambientais e sanitários é essencial para identificar precocemente riscos ocupacionais e ambientais, prevenindo o adoecimento coletivo de trabalhadores expostos a agentes tóxicos, como ilustrado pelo caso dos dois irmãos.",
        "correta": true,
        "justificativa": "A fiscalização contínua de órgãos ambientais e sanitários é essencial para identificação precoce de riscos ocupacionais e ambientais, prevenindo o adoecimento coletivo de trabalhadores expostos a agentes tóxicos, como observado no caso dos dois irmãos que atuavam na triagem e reciclagem de resíduos industriais, reforçando a importância de ações preventivas institucionais que vão além da responsabilidade individual de cada trabalhador exposto. Correta. Essa é a conclusão correta sobre a importância da fiscalização contínua, ilustrada pelo caso discutido nesta situação-problema."
      },
      {
        "letra": "C",
        "texto": "apenas o próprio trabalhador individual deve ser responsabilizado pela prevenção de sua exposição ocupacional, sem qualquer papel reconhecido da fiscalização institucional nesse processo.",
        "correta": false,
        "justificativa": "Incorreta. A fiscalização institucional tem papel fundamental e reconhecido na prevenção de riscos ocupacionais, não devendo essa responsabilidade recair exclusivamente sobre o trabalhador individual."
      },
      {
        "letra": "D",
        "texto": "a fiscalização ambiental não tem qualquer relação reconhecida com a saúde ocupacional dos trabalhadores expostos a agentes tóxicos em atividades industriais e de reciclagem.",
        "correta": false,
        "justificativa": "Incorreta. Há relação direta e bem estabelecida entre fiscalização ambiental e proteção da saúde ocupacional dos trabalhadores, como evidenciado pelo próprio caso clínico discutido nesta situação-problema."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP2_ENAMED — Q20"
  },
  {
    "enunciado": "Theo, 6 anos, recebeu diferentes apresentações comerciais de antitérmicos administradas pela mãe em dias sucessivos, sem que ela soubesse que os produtos continham o mesmo princípio ativo. Esse fenômeno, no qual a administração concomitante (ou sucessiva, sem intervalo adequado) de dois ou mais medicamentos com o mesmo princípio ativo altera o efeito terapêutico esperado ou aumenta o risco de toxicidade, é denominado, de forma mais ampla,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "biotransformação, processo metabólico distinto do fenômeno descrito no enunciado.",
        "correta": false,
        "justificativa": "Incorreta. Biotransformação é o processo metabólico de conversão de um fármaco em outros compostos pelo organismo, distinto do conceito mais amplo de interação medicamentosa descrito."
      },
      {
        "letra": "B",
        "texto": "interação medicamentosa.",
        "correta": true,
        "justificativa": "Interação medicamentosa é o termo utilizado para descrever a alteração do efeito de um fármaco decorrente do uso concomitante (ou próximo no tempo) de outro(s) medicamento(s), incluindo situações de duplicidade terapêutica não intencional (como no caso de Theo), podendo resultar em potencialização de efeitos, incluindo toxicidade. Correta. Interação medicamentosa é exatamente o termo correto para o fenômeno descrito, incluindo a duplicidade terapêutica não intencional relatada no caso de Theo."
      },
      {
        "letra": "C",
        "texto": "farmacocinética isolada, termo genérico que não descreve especificamente o fenômeno de duplicidade terapêutica relatado.",
        "correta": false,
        "justificativa": "Incorreta. Farmacocinética isolada é termo genérico relacionado ao estudo da absorção, distribuição, metabolismo e eliminação de fármacos, sem descrever especificamente o fenômeno de duplicidade relatado."
      },
      {
        "letra": "D",
        "texto": "efeito placebo, fenômeno psicológico distinto do fenômeno farmacológico descrito no enunciado.",
        "correta": false,
        "justificativa": "Incorreta. Efeito placebo é fenômeno psicológico relacionado à resposta a tratamento sem princípio ativo farmacologicamente ativo, distinto do fenômeno de interação/duplicidade medicamentosa descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q1"
  },
  {
    "enunciado": "Ao investigar a causa da elevação de enzimas hepáticas em Theo, a equipe médica considera o principal órgão responsável pela biotransformação da maioria dos fármacos administrados ao longo dos últimos dias. Esse órgão, cujo comprometimento é o foco da investigação no caso descrito, é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "rim, órgão relevante para a eliminação de diversos fármacos, mas não o principal responsável pela biotransformação farmacológica descrita no caso.",
        "correta": false,
        "justificativa": "Incorreta. O rim é importante para eliminação de fármacos e de seus metabólitos, mas não é o principal órgão de biotransformação farmacológica, papel central desempenhado pelo fígado."
      },
      {
        "letra": "B",
        "texto": "fígado.",
        "correta": true,
        "justificativa": "O fígado é o principal órgão de biotransformação de fármacos, por meio do sistema enzimático do citocromo P450, entre outras vias metabólicas, sendo também o órgão-alvo de maior interesse na investigação do caso de Theo, diante da elevação de enzimas hepáticas observada. Correta. O fígado é exatamente o órgão responsável pela biotransformação da maioria dos fármacos, sendo foco da investigação no caso de Theo."
      },
      {
        "letra": "C",
        "texto": "baço, órgão sem papel central reconhecido na biotransformação farmacológica descrita no caso.",
        "correta": false,
        "justificativa": "Incorreta. O baço não tem papel central reconhecido na biotransformação de fármacos, sendo órgão relacionado principalmente a funções hematológicas e imunológicas."
      },
      {
        "letra": "D",
        "texto": "pâncreas, órgão sem papel central reconhecido na biotransformação farmacológica descrita no caso.",
        "correta": false,
        "justificativa": "Incorreta. O pâncreas não tem papel central reconhecido na biotransformação de fármacos, sendo órgão relacionado principalmente a funções endócrinas e exócrinas digestivas."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q2"
  },
  {
    "enunciado": "A equipe médica confirma que Theo recebeu doses cumulativas de paracetamol acima do recomendado, decorrentes da administração de diferentes apresentações comerciais contendo esse mesmo princípio ativo. Considerando o órgão que a equipe já monitoriza atentamente pelo achado laboratorial identificado no caso, o paracetamol, em doses excessivas, é reconhecido por causar principalmente toxicidade em qual órgão?",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Rim, exclusivamente, sem qualquer relação com o órgão já identificado como alterado no caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. Embora o rim possa ser secundariamente afetado em intoxicações graves e prolongadas, o órgão-alvo principal e característico da toxicidade do paracetamol é o fígado."
      },
      {
        "letra": "B",
        "texto": "Fígado (hepatotoxicidade).",
        "correta": true,
        "justificativa": "A intoxicação por paracetamol é classicamente associada à hepatotoxicidade, decorrente da formação do metabólito tóxico NAPQI quando as vias normais de conjugação hepática (sulfatação e glucuronidação) são saturadas em situações de superdosagem, como no caso de Theo, que já apresentava elevação de enzimas hepáticas na investigação inicial. Correta. Hepatotoxicidade é exatamente a principal manifestação de toxicidade do paracetamol em doses excessivas, consistente com o achado laboratorial já identificado no caso de Theo."
      },
      {
        "letra": "C",
        "texto": "Coração, sem relação direta e característica com a toxicidade principal do paracetamol em superdosagem.",
        "correta": false,
        "justificativa": "Incorreta. O coração não é o órgão-alvo principal e característico da toxicidade do paracetamol em superdosagem."
      },
      {
        "letra": "D",
        "texto": "Pulmão, sem relação direta e característica com a toxicidade principal do paracetamol em superdosagem.",
        "correta": false,
        "justificativa": "Incorreta. O pulmão não é o órgão-alvo principal e característico da toxicidade do paracetamol em superdosagem."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q3"
  },
  {
    "enunciado": "Diante da confirmação de intoxicação por paracetamol em Theo, a equipe médica institui prontamente o antídoto específico reconhecido para essa condição, visando repor uma substância endógena hepática consumida no processo de destoxificação do metabólito tóxico formado. Esse antídoto específico é a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "N-acetilcisteína.",
        "correta": true,
        "justificativa": "A N-acetilcisteína repõe as reservas hepáticas de glutationa, substância consumida na neutralização do metabólito tóxico NAPQI formado na superdosagem de paracetamol, prevenindo ou reduzindo significativamente a lesão hepática quando administrada em tempo adequado, sendo o antídoto específico e reconhecido para essa intoxicação. Correta. N-acetilcisteína é exatamente o antídoto específico para intoxicação por paracetamol, atuando na reposição de glutationa hepática."
      },
      {
        "letra": "B",
        "texto": "naloxona, antídoto específico para intoxicação por opioides, sem relação com o mecanismo de toxicidade do paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. Naloxona é antídoto específico para intoxicação por opioides, sem qualquer relação com o mecanismo de toxicidade do paracetamol."
      },
      {
        "letra": "C",
        "texto": "atropina, antídoto específico para síndrome colinérgica por organofosforados/carbamatos, sem relação com o mecanismo de toxicidade do paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. Atropina é antídoto específico para síndrome colinérgica por organofosforados/carbamatos, sem qualquer relação com o mecanismo de toxicidade do paracetamol."
      },
      {
        "letra": "D",
        "texto": "flumazenil, antídoto específico para intoxicação por benzodiazepínicos, sem relação com o mecanismo de toxicidade do paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. Flumazenil é antídoto específico para intoxicação por benzodiazepínicos, sem qualquer relação com o mecanismo de toxicidade do paracetamol."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q4"
  },
  {
    "enunciado": "Após o desfecho do caso de Theo, a equipe hospitalar reflete sobre a regulação sanitária dos medicamentos disponíveis no mercado brasileiro, incluindo exigências de bula e informações sobre riscos de superdosagem em diferentes apresentações comerciais contendo o mesmo princípio ativo. O órgão responsável pelo controle e fiscalização sanitária de medicamentos no Brasil é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a ANVISA.",
        "correta": true,
        "justificativa": "A Agência Nacional de Vigilância Sanitária (ANVISA) é o órgão responsável pela regulação, controle e fiscalização sanitária de medicamentos no Brasil, incluindo exigências relacionadas à rotulagem, bulas e informações sobre riscos, relevantes para a prevenção de eventos como a duplicidade terapêutica não intencional observada no caso de Theo. Correta. ANVISA é exatamente o órgão responsável pela regulação e fiscalização sanitária de medicamentos no Brasil."
      },
      {
        "letra": "B",
        "texto": "o INSS, órgão responsável pela previdência social, sem função de controle e fiscalização sanitária de medicamentos.",
        "correta": false,
        "justificativa": "Incorreta. INSS é órgão previdenciário, sem função de controle sanitário de medicamentos."
      },
      {
        "letra": "C",
        "texto": "o IBGE, órgão responsável por estatísticas e informações demográficas, sem função de controle e fiscalização sanitária de medicamentos.",
        "correta": false,
        "justificativa": "Incorreta. IBGE é órgão de estatísticas e informações demográficas, sem função de controle sanitário de medicamentos."
      },
      {
        "letra": "D",
        "texto": "a Receita Federal, órgão responsável por questões tributárias e aduaneiras, sem função de controle e fiscalização sanitária de medicamentos.",
        "correta": false,
        "justificativa": "Incorreta. Receita Federal é órgão tributário e aduaneiro, sem função de controle sanitário de medicamentos."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q5"
  },
  {
    "enunciado": "Theo, 6 anos, é internado após dias em que a mãe, sem orientação médica, administrou diferentes apresentações comerciais de antitérmicos e analgésicos disponíveis em casa, sem perceber que continham o mesmo princípio ativo (paracetamol). Os exames de admissão revelam elevação de enzimas hepáticas, ainda sem sinais evidentes de insuficiência hepática franca. O quadro evolutivo observado é compatível com",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "intoxicação por corticoide tópico, hipótese incompatível com o histórico medicamentoso e o achado laboratorial descritos.",
        "correta": false,
        "justificativa": "Incorreta. Corticoide tópico não é a hipótese compatível com o histórico medicamentoso (uso de antitérmicos/analgésicos) e o achado laboratorial de elevação de enzimas hepáticas descritos no caso."
      },
      {
        "letra": "B",
        "texto": "intoxicação por paracetamol, decorrente de duplicidade terapêutica não intencional.",
        "correta": true,
        "justificativa": "O uso de múltiplas apresentações comerciais contendo o mesmo princípio ativo (paracetamol), sem que a família perceba a duplicidade terapêutica, pode levar à ultrapassagem cumulativa da dose segura e à hepatotoxicidade, explicando a elevação de enzimas hepáticas observada em Theo, consistente com intoxicação por paracetamol decorrente de superdosagem não intencional. Correta. Intoxicação por paracetamol, decorrente de duplicidade terapêutica não intencional, é a hipótese diagnóstica correta e mais consistente com o quadro apresentado por Theo."
      },
      {
        "letra": "C",
        "texto": "reação alérgica a lactose, hipótese incompatível com o histórico medicamentoso e o achado laboratorial descritos.",
        "correta": false,
        "justificativa": "Incorreta. Reação alérgica a lactose não é compatível com o histórico medicamentoso relatado nem com o achado de elevação de enzimas hepáticas descrito no caso."
      },
      {
        "letra": "D",
        "texto": "quadro isolado de desidratação, sem qualquer relação medicamentosa, hipótese incompatível com o histórico relatado no caso.",
        "correta": false,
        "justificativa": "Incorreta. Desidratação isolada, sem qualquer relação medicamentosa, não explicaria adequadamente o histórico de uso de múltiplas apresentações do mesmo princípio ativo nem o achado laboratorial hepático descrito."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q6"
  },
  {
    "enunciado": "Ao explicar à família de Theo o mecanismo de ação farmacológica do paracetamol como antitérmico e analgésico, a equipe médica destaca que esse fármaco atua de forma distinta dos anti-inflamatórios não esteroidais clássicos, sem efeito anti-inflamatório periférico relevante. O mecanismo de ação farmacológica do paracetamol envolve, principalmente,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "inibição da síntese de prostaglandinas, com ação predominantemente central.",
        "correta": true,
        "justificativa": "O paracetamol atua principalmente inibindo a síntese de prostaglandinas por ação predominantemente central, com efeito antipirético e analgésico, mas sem ação anti-inflamatória periférica relevante como os anti-inflamatórios não esteroidais clássicos, característica farmacológica que o distingue dessa outra classe de analgésicos/antitérmicos. Correta. Esse é exatamente o mecanismo de ação farmacológica correto do paracetamol, com ação predominantemente central sobre a síntese de prostaglandinas."
      },
      {
        "letra": "B",
        "texto": "bloqueio direto de receptores opioides periféricos, mecanismo distinto do reconhecido para o paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. Bloqueio direto de receptores opioides periféricos é mecanismo relacionado a analgésicos opioides, e não ao paracetamol."
      },
      {
        "letra": "C",
        "texto": "inibição da bomba de prótons gástrica, mecanismo relacionado a fármacos utilizados para doença ácido-péptica, e não ao paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. Inibição da bomba de prótons gástrica é mecanismo relacionado a fármacos utilizados no tratamento de doença ácido-péptica (como omeprazol), sem relação com o mecanismo de ação do paracetamol."
      },
      {
        "letra": "D",
        "texto": "bloqueio dos canais de sódio neuronais periféricos, mecanismo relacionado a anestésicos locais, e não ao paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. Bloqueio de canais de sódio neuronais periféricos é mecanismo relacionado a anestésicos locais, sem relação com o mecanismo de ação do paracetamol."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q7"
  },
  {
    "enunciado": "Ao explicar à família de Theo por que a superdosagem de paracetamol pode gerar um metabólito tóxico específico, a equipe médica menciona o sistema enzimático hepático envolvido nessa via metabólica alternativa, ativada quando as vias normais de conjugação estão saturadas. Em relação a esse sistema enzimático do citocromo P450, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não participa do metabolismo de nenhum fármaco relevante utilizado na prática clínica pediátrica.",
        "correta": false,
        "justificativa": "Incorreta. O sistema do citocromo P450 participa do metabolismo de inúmeros fármacos relevantes na prática clínica, incluindo o paracetamol, contrariando a afirmação de ausência de participação."
      },
      {
        "letra": "B",
        "texto": "é um conjunto de enzimas hepáticas responsáveis pela biotransformação de diversos fármacos e substâncias, incluindo a geração do metabólito tóxico NAPQI a partir do paracetamol em situações de superdosagem, como no caso de Theo.",
        "correta": true,
        "justificativa": "O sistema do citocromo P450 hepático (especificamente a isoforma CYP2E1, entre outras) participa da biotransformação de diversos fármacos e substâncias; no caso do paracetamol, uma pequena fração é convertida por essa via no metabólito tóxico NAPQI, que se acumula e causa hepatotoxicidade quando as vias normais de conjugação (sulfatação e glucuronidação) são saturadas em situações de superdosagem, como ocorreu no caso de Theo. Correta. Essa é a descrição correta do papel do citocromo P450 na geração do metabólito tóxico do paracetamol em situações de superdosagem."
      },
      {
        "letra": "C",
        "texto": "atua exclusivamente na síntese de hormônios tireoidianos, sem qualquer relação com o metabolismo do paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. O citocromo P450 tem papel muito mais amplo do que a síntese de hormônios tireoidianos, sendo particularmente relevante no metabolismo hepático de fármacos como o paracetamol."
      },
      {
        "letra": "D",
        "texto": "está presente exclusivamente no tecido renal, sem qualquer relação com o metabolismo hepático do paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. O citocromo P450 hepático é o sistema relevante nesse contexto, e não exclusivamente renal, sendo o fígado o principal órgão de biotransformação farmacológica discutido no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q8"
  },
  {
    "enunciado": "Durante a internação de Theo, ao ser prescrito um novo medicamento pela equipe assistente, o sistema de prescrição eletrônica hospitalar emite um alerta automático de possível duplicidade terapêutica com outro fármaco já em uso pelo paciente. Esse recurso tecnológico, mencionado no caso clínico de Theo, exemplifica",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "uma ferramenta de segurança do paciente que auxilia na prevenção de erros de medicação e intoxicações, como a que ocorreu previamente com Theo.",
        "correta": true,
        "justificativa": "Sistemas de prescrição eletrônica com alertas automáticos de interação e duplicidade terapêutica são ferramentas de segurança do paciente, contribuindo para a prevenção de erros de medicação e eventos adversos, como a intoxicação por duplicidade de princípio ativo (paracetamol) que ocorreu previamente com Theo antes da internação hospitalar. Correta. Essa é a descrição correta e adequada da funcionalidade de segurança representada pelo alerta do sistema de prescrição eletrônica no caso de Theo."
      },
      {
        "letra": "B",
        "texto": "um obstáculo desnecessário ao trabalho da equipe médica, sem qualquer benefício real reconhecido ao cuidado do paciente.",
        "correta": false,
        "justificativa": "Incorreta. Esse tipo de alerta traz benefício real e reconhecido ao cuidado do paciente, prevenindo eventos adversos evitáveis como o observado previamente no caso de Theo, e não sendo mero obstáculo desnecessário."
      },
      {
        "letra": "C",
        "texto": "uma funcionalidade sem qualquer relação estabelecida com a segurança do paciente hospitalizado.",
        "correta": false,
        "justificativa": "Incorreta. Há relação direta e relevante entre esse tipo de alerta tecnológico e a segurança do paciente hospitalizado, especialmente relevante no contexto do caso de Theo."
      },
      {
        "letra": "D",
        "texto": "uma exigência puramente administrativa e burocrática, sem qualquer relevância clínica prática reconhecida para o caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. Esse tipo de alerta tem relevância clínica prática significativa, e não apenas administrativa e burocrática, sendo especialmente relevante para prevenir a repetição do tipo de evento que ocorreu com Theo."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q9"
  },
  {
    "enunciado": "Durante a anamnese detalhada realizada com a mãe de Theo, ela relata: \"eu fui dando o que tinha em casa\", referindo-se aos diferentes medicamentos administrados ao filho nos dias anteriores à internação, sem perceber que continham o mesmo princípio ativo. Em relação ao uso de medicamentos de venda livre por familiares nesse contexto, um risco relevante evidenciado no caso é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a impossibilidade absoluta de qualquer efeito adverso relacionado ao uso de medicamentos de venda livre, independentemente da dose administrada.",
        "correta": false,
        "justificativa": "Incorreta. Há, sim, possibilidade real e documentada de efeitos adversos graves relacionados ao uso não orientado de medicamentos de venda livre, como demonstrado pelo próprio caso de Theo."
      },
      {
        "letra": "B",
        "texto": "a subestimação do risco de duplicidade terapêutica e superdosagem, especialmente em crianças, por desconhecimento do princípio ativo presente em diferentes apresentações comerciais disponíveis no domicílio.",
        "correta": true,
        "justificativa": "O uso não orientado de medicamentos de venda livre por familiares, como ilustrado pelo relato da mãe de Theo, pode levar à subestimação do risco de duplicidade terapêutica, especialmente quando diferentes apresentações comerciais contêm o mesmo princípio ativo (paracetamol, no caso), aumentando significativamente o risco de superdosagem cumulativa, sobretudo em crianças pequenas, cuja margem terapêutica é mais estreita. Correta. Essa é a interpretação correta do risco evidenciado no relato da mãe de Theo sobre o uso não orientado de medicamentos disponíveis em casa."
      },
      {
        "letra": "C",
        "texto": "a garantia absoluta de que medicamentos de venda livre nunca causam hepatotoxicidade, independentemente da dose cumulativa administrada.",
        "correta": false,
        "justificativa": "Incorreta. Medicamentos de venda livre, como o paracetamol, podem causar hepatotoxicidade significativa em doses cumulativas excessivas, como demonstrado no próprio caso de Theo."
      },
      {
        "letra": "D",
        "texto": "a ausência completa de qualquer necessidade de orientação familiar sobre uso seguro de medicamentos disponíveis em casa, mesmo em crianças pequenas.",
        "correta": false,
        "justificativa": "Incorreta. Há necessidade real e relevante de orientação familiar sobre uso seguro de medicamentos, especialmente em crianças pequenas, como evidenciado pelo desfecho do caso de Theo."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q10"
  },
  {
    "enunciado": "Ao explicar o conceito de interações medicamentosas sinérgicas à equipe de residentes durante a discussão do caso de Theo, o farmacêutico clínico destaca que esse tipo específico de interação pode contribuir para eventos como a superdosagem cumulativa observada no paciente. Em relação às interações medicamentosas classificadas como sinérgicas, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ocorrem quando dois fármacos administrados de forma conjunta produzem efeito menor do que a soma dos efeitos individuais esperados isoladamente.",
        "correta": false,
        "justificativa": "Incorreta. Efeito menor que a soma dos efeitos individuais corresponderia a antagonismo, e não a sinergismo, sendo o oposto do conceito correto descrito na alternativa."
      },
      {
        "letra": "B",
        "texto": "ocorrem quando a combinação de fármacos (incluindo apresentações distintas com o mesmo princípio ativo, como no caso de Theo) produz efeito igual ou maior que a soma dos efeitos individuais, podendo aumentar o risco de toxicidade cumulativa.",
        "correta": true,
        "justificativa": "As interações sinérgicas ocorrem quando a combinação de fármacos (incluindo, como no caso de Theo, diferentes apresentações comerciais contendo o mesmo princípio ativo) produz efeito igual ou superior à soma dos efeitos individuais esperados isoladamente, podendo, em alguns casos, aumentar significativamente o risco de toxicidade cumulativa, como ocorreu na potencialização hepatotóxica por múltiplas fontes de paracetamol administradas a Theo. Correta. Essa é a definição correta de interação sinérgica, relevante para explicar o mecanismo de superdosagem cumulativa observado no caso de Theo."
      },
      {
        "letra": "C",
        "texto": "nunca representam risco clínico relevante para o paciente, independentemente do contexto de uso concomitante dos fármacos envolvidos.",
        "correta": false,
        "justificativa": "Incorreta. Interações sinérgicas podem, sim, representar risco clínico relevante, como demonstrado pelo próprio desfecho do caso de Theo."
      },
      {
        "letra": "D",
        "texto": "ocorrem exclusivamente entre fármacos pertencentes a classes terapêuticas totalmente distintas, sem qualquer relação com duplicidade do mesmo princípio ativo.",
        "correta": false,
        "justificativa": "Incorreta. Interações sinérgicas podem ocorrer também entre diferentes apresentações do mesmo princípio ativo (como no caso de Theo), e não exclusivamente entre fármacos de classes terapêuticas totalmente distintas."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q11"
  },
  {
    "enunciado": "Theo, 6 anos, com histórico de uso de múltiplas apresentações de paracetamol nos últimos três dias, apresenta elevação de enzimas hepáticas na admissão hospitalar, ainda sem sinais clínicos de insuficiência hepática franca. A fisiopatologia mais adequada para explicar esse achado laboratorial envolve",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "efeito direto e primário do paracetamol sobre o parênquima renal, sem qualquer relação estabelecida com o comprometimento hepático observado no caso.",
        "correta": false,
        "justificativa": "Incorreta. O efeito primário e característico da intoxicação por paracetamol é hepático, e não renal, embora comprometimento renal secundário possa ocorrer em casos mais graves e prolongados."
      },
      {
        "letra": "B",
        "texto": "acúmulo do metabólito tóxico NAPQI, decorrente da saturação das vias normais de conjugação hepática (sulfatação e glucuronidação) diante da dose cumulativa excessiva administrada, levando à depleção de glutationa hepática e à consequente lesão hepatocelular direta.",
        "correta": true,
        "justificativa": "Na superdosagem cumulativa de paracetamol, como ocorreu com Theo, as vias normais de conjugação hepática (sulfatação e glucuronidação) saturam, desviando maior fração do metabolismo para a via do citocromo P450, o que gera acúmulo do metabólito tóxico NAPQI; a depleção progressiva da glutationa hepática, substância que normalmente neutraliza esse metabólito, permite que o NAPQI cause dano hepatocelular direto, explicando a elevação de transaminases observada na admissão do paciente. Correta. Essa é a explicação fisiopatológica correta e completa para o achado de elevação de enzimas hepáticas observado no caso de Theo."
      },
      {
        "letra": "C",
        "texto": "reação de hipersensibilidade mediada exclusivamente por anticorpos IgE, sem qualquer relação estabelecida com a dose cumulativa de paracetamol administrada ao longo dos dias anteriores.",
        "correta": false,
        "justificativa": "Incorreta. A hepatotoxicidade do paracetamol não é mediada por reação de hipersensibilidade IgE-dependente; trata-se de toxicidade direta relacionada à dose cumulativa administrada, como no caso de Theo."
      },
      {
        "letra": "D",
        "texto": "efeito exclusivamente hematológico do paracetamol, sem qualquer comprometimento hepático reconhecido em situações de superdosagem cumulativa como a observada no caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. O efeito característico e mais relevante da superdosagem de paracetamol é hepático, e não exclusivamente hematológico, contrariando a afirmação apresentada."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q12"
  },
  {
    "enunciado": "Diante da confirmação de intoxicação por paracetamol em Theo, a equipe médica discute o momento ideal para administração da N-acetilcisteína, considerando o tempo já decorrido desde o início da ingestão cumulativa excessiva do fármaco. Em relação à eficácia da N-acetilcisteína no tratamento dessa intoxicação, é correto afirmar que ela é maior quando administrada",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "apenas após 72 horas da exposição inicial, independentemente da gravidade do quadro clínico já instalado no momento da avaliação.",
        "correta": false,
        "justificativa": "Incorreta. A eficácia da N-acetilcisteína é maior quando administrada precocemente, e não apenas após 72 horas; ainda assim, mesmo em apresentações tardias, seu uso pode trazer benefício, não devendo ser postergado deliberadamente."
      },
      {
        "letra": "B",
        "texto": "o mais precocemente possível após a exposição, idealmente dentro das primeiras 8 a 10 horas, embora possa haver benefício mesmo em apresentações mais tardias, como pode ser o caso de Theo, diagnosticado alguns dias após o início da exposição cumulativa.",
        "correta": true,
        "justificativa": "A N-acetilcisteína é mais eficaz quando administrada precocemente (idealmente nas primeiras 8-10 horas após a exposição inicial), mas mantém benefício potencial mesmo em apresentações mais tardias, incluindo casos com hepatotoxicidade já instalada, sendo importante sua administração mesmo diante de diagnóstico tardio, como pode ocorrer em situações de duplicidade terapêutica não percebida ao longo de vários dias, como no caso de Theo. Correta. Essa é a descrição correta sobre o momento ideal e a manutenção de benefício potencial mesmo em apresentações mais tardias da N-acetilcisteína."
      },
      {
        "letra": "C",
        "texto": "exclusivamente por via intramuscular, nunca por via oral ou endovenosa, independentemente da disponibilidade e do protocolo institucional adotado.",
        "correta": false,
        "justificativa": "Incorreta. A N-acetilcisteína pode ser administrada por via oral ou endovenosa, conforme protocolo institucional e disponibilidade, não sendo restrita exclusivamente à via intramuscular."
      },
      {
        "letra": "D",
        "texto": "apenas em pacientes completamente assintomáticos, sendo formalmente contraindicada em pacientes com hepatotoxicidade já estabelecida, como possivelmente o caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. A N-acetilcisteína não é contraindicada em pacientes com hepatotoxicidade já estabelecida; ao contrário, mantém benefício potencial mesmo nesses casos, sendo importante sua administração mesmo diante de diagnóstico tardio."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q13"
  },
  {
    "enunciado": "Após o desfecho clínico favorável de Theo, a equipe hospitalar discute a necessidade de registrar o evento como suspeita de intoxicação medicamentosa e considerar notificação aos setores de vigilância em saúde competentes. Essa conduta se justifica porque",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "eventos adversos relacionados ao uso de medicamentos, mesmo quando não intencionais (como a duplicidade terapêutica observada no caso de Theo), têm relevância para a vigilância sanitária e para a prevenção de casos semelhantes na população em geral.",
        "correta": true,
        "justificativa": "Eventos adversos relacionados ao uso de medicamentos, mesmo quando não intencionais (como a duplicidade terapêutica não percebida descrita no caso de Theo), têm relevância significativa para a vigilância sanitária, subsidiando ações de prevenção e educação em saúde voltadas à população, especialmente em relação a riscos de superdosagem por desconhecimento de princípios ativos presentes em diferentes apresentações comerciais de medicamentos de venda livre. Correta. Essa é a justificativa correta para o registro e a consideração de notificação do evento relacionado ao caso de Theo."
      },
      {
        "letra": "B",
        "texto": "apenas intoxicações intencionais (como tentativas de autoextermínio) devem ser objeto de notificação às autoridades de vigilância em saúde competentes.",
        "correta": false,
        "justificativa": "Incorreta. Eventos não intencionais, como a duplicidade terapêutica observada no caso de Theo, também têm relevância para notificação à vigilância sanitária, e não apenas intoxicações intencionais."
      },
      {
        "letra": "C",
        "texto": "a notificação de eventos adversos relacionados a medicamentos não tem qualquer utilidade reconhecida em saúde pública, independentemente das circunstâncias específicas envolvidas.",
        "correta": false,
        "justificativa": "Incorreta. Há utilidade reconhecida e relevante da notificação de eventos adversos medicamentosos para a saúde pública, contrariando a afirmação de ausência de utilidade."
      },
      {
        "letra": "D",
        "texto": "o registro do evento serve exclusivamente para fins administrativos internos do hospital, sem qualquer relação estabelecida com ações de vigilância em saúde mais amplas.",
        "correta": false,
        "justificativa": "Incorreta. O registro desse tipo de evento tem relação direta com ações de vigilância em saúde mais amplas, e não se restringe apenas a finalidades administrativas internas do hospital."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q14"
  },
  {
    "enunciado": "Durante a discussão multiprofissional do caso de Theo, a farmacêutica clínica da equipe contribui identificando a duplicidade terapêutica envolvendo o paracetamol e orientando sobre a segurança do uso de medicamentos ao longo do tratamento hospitalar. Em relação ao papel da farmacêutica clínica nesse contexto multiprofissional, é correto afirmar que ela",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "tem sua atuação limitada exclusivamente à dispensação física de medicamentos, sem qualquer participação relevante na discussão clínica do caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. A atuação da farmacêutica clínica vai muito além da dispensação física de medicamentos, incluindo participação ativa na discussão clínica multiprofissional, como demonstrado no caso de Theo."
      },
      {
        "letra": "B",
        "texto": "contribui para a identificação de interações e duplicidades terapêuticas, além de orientar sobre biotransformação e segurança do uso de medicamentos, agregando conhecimento técnico relevante à discussão clínica multiprofissional do caso.",
        "correta": true,
        "justificativa": "A farmacêutica clínica tem papel relevante e reconhecido na identificação de interações e duplicidades terapêuticas (como a observada no caso de Theo), além de contribuir com conhecimento técnico especializado sobre biotransformação e segurança medicamentosa, agregando à discussão clínica multiprofissional em ambiente hospitalar, sendo profissional cada vez mais integrado a equipes assistenciais em diversos contextos, incluindo casos de intoxicação medicamentosa. Correta. Essa é a descrição correta e completa do papel da farmacêutica clínica na discussão multiprofissional do caso de Theo."
      },
      {
        "letra": "C",
        "texto": "não possui qualquer competência técnica reconhecida para discutir aspectos de hepatotoxicidade medicamentosa relacionados ao caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. A farmacêutica clínica tem competência técnica reconhecida para discutir aspectos de biotransformação e toxicidade medicamentosa, sendo profissional relevante para essa discussão específica."
      },
      {
        "letra": "D",
        "texto": "deve atuar exclusivamente em farmácias comunitárias, sem qualquer inserção reconhecida em equipes multiprofissionais hospitalares como a que acompanhou Theo.",
        "correta": false,
        "justificativa": "Incorreta. A farmacêutica clínica tem inserção reconhecida em equipes multiprofissionais hospitalares, e não atua exclusivamente em farmácias comunitárias, como demonstrado pela participação na discussão do caso de Theo."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q15"
  },
  {
    "enunciado": "Ao ser questionada sobre por que administrou diferentes medicamentos ao filho sem perceber que continham o mesmo princípio ativo, a mãe de Theo relata que considerava os produtos \"comuns\" e, por isso, não representariam risco relevante à saúde da criança. Essa percepção relatada pela mãe ilustra a importância de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "culpabilizar exclusivamente a família pelo evento ocorrido, sem qualquer reflexão adicional sobre estratégias de educação em saúde direcionadas à população.",
        "correta": false,
        "justificativa": "Incorreta. Culpabilizar exclusivamente a família, sem qualquer reflexão sobre estratégias educativas mais amplas, não contribui para a prevenção de casos semelhantes na população em geral."
      },
      {
        "letra": "B",
        "texto": "ações de educação em saúde voltadas à população sobre os riscos do uso não orientado de medicamentos, mesmo aqueles considerados de venda livre e amplamente utilizados no cotidiano familiar, como no caso de Theo.",
        "correta": true,
        "justificativa": "A percepção equivocada de que medicamentos amplamente utilizados e de venda livre são sempre seguros, independentemente da dose cumulativa, reforça a importância de ações de educação em saúde voltadas à população, orientando especificamente sobre os riscos do uso não orientado e da duplicidade terapêutica, mesmo com medicamentos considerados \"comuns\", como ilustrado pelo relato da mãe de Theo. Correta. Essa é a reflexão correta e construtiva a partir da percepção relatada pela mãe de Theo, direcionando para ações educativas em saúde mais amplas."
      },
      {
        "letra": "C",
        "texto": "proibir totalmente a venda de medicamentos sem prescrição médica no Brasil, sem qualquer outra medida complementar de educação em saúde direcionada à população.",
        "correta": false,
        "justificativa": "Incorreta. A proibição total da venda de medicamentos sem prescrição não é medida proporcional nem a única estratégia discutida; a educação em saúde é abordagem complementar importante e mais viável para essa finalidade."
      },
      {
        "letra": "D",
        "texto": "desconsiderar completamente a percepção relatada pela família, sem qualquer ação educativa direcionada a partir do caso discutido.",
        "correta": false,
        "justificativa": "Incorreta. A percepção relatada pela família deve ser considerada e utilizada como base para ações educativas direcionadas, e não simplesmente desconsiderada pela equipe de saúde."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q16"
  },
  {
    "enunciado": "Ao revisar a farmacologia básica relacionada ao caso de Theo, os estudantes discutem a cascata do ácido araquidônico e como diferentes classes de analgésicos/antitérmicos atuam sobre essa via metabólica, com efeitos distintos entre si. Em relação à atuação do paracetamol sobre essa via metabólica, é correto afirmar que ele interrompe essa cascata",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "por inibição periférica intensa da enzima ciclo-oxigenase, de forma semelhante aos anti-inflamatórios não esteroidais clássicos, com efeito anti-inflamatório periférico relevante equivalente a essa outra classe farmacológica.",
        "correta": false,
        "justificativa": "Incorreta. O paracetamol não tem efeito anti-inflamatório periférico relevante equivalente aos AINEs clássicos, sendo essa justamente uma diferença farmacológica importante entre as duas classes."
      },
      {
        "letra": "B",
        "texto": "por mecanismo predominantemente central, com efeito antipirético e analgésico relevante, mas sem efeito anti-inflamatório periférico significativo, diferenciando-se assim dos AINEs clássicos.",
        "correta": true,
        "justificativa": "Diferentemente dos anti-inflamatórios não esteroidais (AINEs) clássicos, o paracetamol tem ação predominantemente central sobre a síntese de prostaglandinas (via da cascata do ácido araquidônico), explicando seu efeito antipirético e analgésico relevante, mas sem a ação anti-inflamatória periférica significativa característica dos AINEs, diferença farmacológica importante discutida no contexto do caso de Theo. Correta. Essa é a descrição correta da atuação do paracetamol sobre a cascata do ácido araquidônico, diferenciando-o dos AINEs clássicos."
      },
      {
        "letra": "C",
        "texto": "por bloqueio completo e irreversível da enzima lipo-oxigenase em todos os tecidos do organismo, mecanismo distinto do reconhecido para o paracetamol.",
        "correta": false,
        "justificativa": "Incorreta. O paracetamol não atua predominantemente pela via da lipo-oxigenase; sua ação está relacionada à inibição da síntese de prostaglandinas por via central."
      },
      {
        "letra": "D",
        "texto": "sem qualquer relação estabelecida com a cascata do ácido araquidônico, mecanismo farmacológico completamente distinto do discutido para essa via metabólica.",
        "correta": false,
        "justificativa": "Incorreta. Há relação estabelecida entre o mecanismo de ação do paracetamol e a cascata do ácido araquidônico, ainda que com particularidades farmacológicas que o distinguem de outras classes analgésicas/antitérmicas."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q17"
  },
  {
    "enunciado": "Diante do caso de Theo, a equipe de vigilância sanitária municipal reflete sobre as atribuições relacionadas ao controle de medicamentos que poderiam contribuir para a prevenção de eventos semelhantes de duplicidade terapêutica não intencional envolvendo o mesmo princípio ativo em diferentes apresentações comerciais. Uma dessas atribuições relevantes da vigilância sanitária é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "regulamentar a fabricação, comercialização e rotulagem de medicamentos, incluindo exigências de alertas claros sobre riscos de superdosagem e duplicidade de princípio ativo entre diferentes apresentações comerciais disponíveis no mercado.",
        "correta": true,
        "justificativa": "A vigilância sanitária tem entre suas atribuições relevantes a regulamentação da fabricação, comercialização e rotulagem de medicamentos, incluindo exigências de bulas com alertas claros sobre riscos de superdosagem e duplicidade de princípio ativo entre diferentes apresentações comerciais, contribuindo para a prevenção de eventos como a intoxicação por duplicidade terapêutica observada no caso de Theo. Correta. Essa é exatamente a atribuição relevante da vigilância sanitária discutida no contexto de prevenção de casos semelhantes ao de Theo."
      },
      {
        "letra": "B",
        "texto": "restringir-se exclusivamente à fiscalização de produtos alimentícios, sem qualquer competência reconhecida sobre medicamentos comercializados no país.",
        "correta": false,
        "justificativa": "Incorreta. A vigilância sanitária tem competência ampla, que inclui tanto alimentos quanto medicamentos, não sendo restrita exclusivamente a produtos alimentícios."
      },
      {
        "letra": "C",
        "texto": "não ter qualquer competência formal reconhecida sobre medicamentos de venda livre, como os utilizados no caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. A vigilância sanitária tem, sim, competência formal reconhecida sobre medicamentos de venda livre, sendo justamente esse um dos focos relevantes de sua atuação regulatória."
      },
      {
        "letra": "D",
        "texto": "atuar exclusivamente em contextos de emergências sanitárias de grande escala, como pandemias, sem qualquer ação rotineira relacionada ao controle de medicamentos comercializados no cotidiano.",
        "correta": false,
        "justificativa": "Incorreta. A vigilância sanitária tem atuação rotineira relacionada ao controle de medicamentos comercializados no cotidiano, e não apenas em contextos de emergências sanitárias de grande escala."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q18"
  },
  {
    "enunciado": "Durante a admissão de Theo, a equipe de enfermagem relata dificuldade em obter um registro completo e preciso de todos os medicamentos administrados em casa nos dias anteriores, já que a família não conseguia se lembrar com exatidão dos nomes comerciais utilizados. Essa dificuldade relatada reforça a importância de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "desconsiderar completamente as informações fornecidas pela família durante a anamnese, mesmo que incompletas ou imprecisas.",
        "correta": false,
        "justificativa": "Incorreta. As informações fornecidas pela família, mesmo que inicialmente incompletas, são importantes e devem ser complementadas por investigação adicional (como busca de embalagens), e não simplesmente desconsideradas."
      },
      {
        "letra": "B",
        "texto": "realizar anamnese farmacológica minuciosa, questionando ativamente sobre todos os medicamentos utilizados em casa nos dias anteriores, incluindo aqueles considerados \"comuns\" ou de venda livre, e buscando, quando possível, as embalagens originais dos produtos administrados.",
        "correta": true,
        "justificativa": "A anamnese farmacológica minuciosa, questionando ativamente sobre todos os medicamentos utilizados em casa (incluindo aqueles de venda livre e considerados \"comuns\"), e buscando, quando possível, as embalagens originais dos produtos administrados, é fundamental para identificar riscos de duplicidade terapêutica e orientar adequadamente a conduta clínica, como demonstrado pela dificuldade relatada no caso de Theo. Correta. Essa é a conduta correta diante da dificuldade relatada na obtenção de informações precisas sobre os medicamentos administrados a Theo em casa."
      },
      {
        "letra": "C",
        "texto": "restringir a investigação medicamentosa apenas aos fármacos prescritos formalmente por médicos, ignorando completamente a automedicação familiar relatada no caso.",
        "correta": false,
        "justificativa": "Incorreta. A automedicação familiar, como a relatada no caso de Theo, deve ser investigada ativamente, e não ignorada, já que foi justamente essa a causa da intoxicação identificada no paciente."
      },
      {
        "letra": "D",
        "texto": "considerar que medicamentos não prescritos por médicos, como os administrados por conta própria pela família de Theo, nunca precisam ser registrados detalhadamente no prontuário hospitalar.",
        "correta": false,
        "justificativa": "Incorreta. Medicamentos não prescritos por médicos, mas administrados pela família, precisam ser registrados detalhadamente no prontuário, especialmente diante de suspeita de intoxicação medicamentosa relacionada a esse uso, como no caso de Theo."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q19"
  },
  {
    "enunciado": "Além da administração de N-acetilcisteína como antídoto específico, a equipe hospitalar institui outras medidas de suporte ao longo da internação de Theo, incluindo monitorização laboratorial seriada da função hepática. Em relação às demais formas de tratamento empregadas em casos de intoxicação medicamentosa como o de Theo, é correto afirmar que, além do antídoto específico quando disponível, medidas de suporte importantes incluem",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "monitorização clínica e laboratorial seriada (incluindo função hepática, como realizado no caso de Theo), suporte hidroeletrolítico adequado e vigilância ativa de possíveis complicações ao longo da evolução do paciente.",
        "correta": true,
        "justificativa": "O tratamento de intoxicações medicamentosas, além do antídoto específico quando disponível (como a N-acetilcisteína no caso de Theo), inclui monitorização clínica e laboratorial seriada (especialmente da função hepática, dado o mecanismo de toxicidade do paracetamol), suporte hidroeletrolítico adequado e vigilância ativa de possíveis complicações, como a evolução para insuficiência hepática, sendo essas medidas complementares essenciais para o manejo integral e seguro do paciente ao longo de toda a internação. Correta. Essas são exatamente as medidas de suporte complementares importantes no manejo do caso de Theo, além do antídoto específico já administrado."
      },
      {
        "letra": "B",
        "texto": "alta hospitalar imediata assim que administrado o antídoto específico, independentemente da gravidade e da evolução clínica e laboratorial do paciente.",
        "correta": false,
        "justificativa": "Incorreta. A alta hospitalar imediata, sem considerar a evolução clínica e laboratorial do paciente, é conduta inadequada, especialmente diante de possível hepatotoxicidade já identificada no caso de Theo."
      },
      {
        "letra": "C",
        "texto": "suspensão completa de qualquer monitorização laboratorial adicional após a primeira avaliação realizada na admissão hospitalar de Theo.",
        "correta": false,
        "justificativa": "Incorreta. A monitorização laboratorial seriada é fundamental ao longo da evolução do quadro, e não deve ser suspensa após uma única avaliação inicial na admissão."
      },
      {
        "letra": "D",
        "texto": "uso rotineiro e sistemático de antibioticoterapia de amplo espectro, independentemente da presença de sinais clínicos ou laboratoriais sugestivos de infecção associada no caso de Theo.",
        "correta": false,
        "justificativa": "Incorreta. Não há indicação de antibioticoterapia rotineira e sistemática sem sinais clínicos ou laboratoriais sugestivos de infecção associada, sendo essa conduta desnecessária e potencialmente inadequada no contexto do caso de Theo, cuja intoxicação tem etiologia medicamentosa, e não infecciosa."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP3_ENAMED — Q20"
  },
  {
    "enunciado": "Uma adolescente de 14 anos, residente em área sujeita a alagamentos frequentes e sem saneamento básico regular, apresenta tosse seca persistente e discreta dificuldade respiratória, sendo identificado ao raio-x de tórax infiltrado pulmonar transitório associado a eosinofilia no hemograma. Esse quadro, decorrente da migração de larvas de helmintos pelo parênquima pulmonar, é conhecido como",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "síndrome de Löeffler.",
        "correta": true,
        "justificativa": "A síndrome de Löeffler (pneumonia eosinofílica) decorre da passagem de larvas de helmintos (como Ascaris lumbricoides e Strongyloides stercoralis) pelo parênquima pulmonar durante seu ciclo de vida, cursando com infiltrado pulmonar transitório e eosinofilia, quadro compatível com o caso da adolescente descrita. Correta. Síndrome de Löeffler é exatamente o quadro descrito no enunciado, relacionado à migração larvária pulmonar de helmintos."
      },
      {
        "letra": "B",
        "texto": "síndrome de Guillain-Barré, quadro neurológico distinto, sem relação com o mecanismo de migração larvária descrito.",
        "correta": false,
        "justificativa": "Incorreta. Síndrome de Guillain-Barré é quadro neurológico autoimune (polineuropatia desmielinizante aguda), sem qualquer relação com o mecanismo de migração larvária pulmonar descrito."
      },
      {
        "letra": "C",
        "texto": "síndrome de Cushing, quadro endócrino distinto, sem relação com o mecanismo de migração larvária descrito.",
        "correta": false,
        "justificativa": "Incorreta. Síndrome de Cushing é quadro endócrino relacionado a excesso de cortisol, sem qualquer relação com o mecanismo de migração larvária pulmonar descrito."
      },
      {
        "letra": "D",
        "texto": "síndrome nefrótica, quadro renal distinto, sem relação com o mecanismo de migração larvária descrito.",
        "correta": false,
        "justificativa": "Incorreta. Síndrome nefrótica é quadro renal caracterizado por proteinúria maciça, sem qualquer relação com o mecanismo de migração larvária pulmonar descrito no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q1"
  },
  {
    "enunciado": "A mesma adolescente relata também lesão cutânea sinuosa e muito pruriginosa na região plantar, que foi se modificando de trajeto ao longo dos dias, achado compatível com penetração cutânea de larvas de ancilostomídeos adquiridas pelo contato direto com solo contaminado. Essa parasitose cutânea, popularmente conhecida por uma expressão que remete ao aspecto sinuoso da lesão, é denominada",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "larva migrans cutânea (bicho geográfico).",
        "correta": true,
        "justificativa": "A larva migrans cutânea, popularmente conhecida como \"bicho geográfico\", caracteriza-se por lesão cutânea sinuosa, eritematosa e muito pruriginosa, decorrente da migração de larvas de ancilostomídeos (geralmente de origem animal) sob a pele, tipicamente adquirida pelo contato direto com solo contaminado por fezes de cães ou gatos, consistente com o achado relatado pela adolescente. Correta. Larva migrans cutânea (bicho geográfico) é exatamente a parasitose descrita, com lesão cutânea sinuosa e pruriginosa característica."
      },
      {
        "letra": "B",
        "texto": "escabiose, parasitose cutânea causada por ácaro, com apresentação clínica distinta da lesão sinuosa descrita.",
        "correta": false,
        "justificativa": "Incorreta. Escabiose é causada por ácaro (Sarcoptes scabiei), com apresentação clínica de pápulas e prurido generalizado, distinta da lesão sinuosa e migratória descrita no caso."
      },
      {
        "letra": "C",
        "texto": "pediculose, parasitose causada por piolhos, sem relação com a lesão cutânea sinuosa descrita no caso.",
        "correta": false,
        "justificativa": "Incorreta. Pediculose é parasitose causada por piolhos, geralmente acometendo couro cabeludo ou outras regiões pilosas, sem relação com a lesão cutânea plantar sinuosa descrita."
      },
      {
        "letra": "D",
        "texto": "tungíase, parasitose causada por pulga específica, com apresentação clínica distinta da lesão sinuosa descrita.",
        "correta": false,
        "justificativa": "Incorreta. Tungíase é causada por pulga específica (Tunga penetrans), com apresentação de lesão nodular localizada, geralmente em pés, distinta do trajeto sinuoso migratório descrito no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q2"
  },
  {
    "enunciado": "Ao investigar o contexto de vida da adolescente, a equipe de saúde identifica que ela reside em área com contato frequente com solo potencialmente contaminado por fezes humanas, devido à ausência de saneamento básico adequado na região. Esse tipo de contato é fator de risco reconhecido para aquisição de",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "verminoses (geo-helmintíases).",
        "correta": true,
        "justificativa": "O contato com solo contaminado por fezes humanas, em áreas com saneamento básico deficiente (como a região descrita no caso da adolescente), é fator de risco reconhecido para verminoses transmitidas pelo solo (geo-helmintíases), como ascaridíase, ancilostomíase e estrongiloidíase. Correta. Verminoses (geo-helmintíases) são exatamente as condições associadas ao fator de risco descrito no enunciado."
      },
      {
        "letra": "B",
        "texto": "hipertensão arterial primária, condição sem relação estabelecida com contato com solo contaminado descrito no caso.",
        "correta": false,
        "justificativa": "Incorreta. Hipertensão arterial primária não tem relação estabelecida com contato com solo contaminado, sendo condição de etiologia multifatorial distinta."
      },
      {
        "letra": "C",
        "texto": "diabetes mellitus tipo 1, condição autoimune sem relação estabelecida com contato com solo contaminado descrito no caso.",
        "correta": false,
        "justificativa": "Incorreta. Diabetes mellitus tipo 1 é condição autoimune sem relação estabelecida com contato com solo contaminado descrito no caso."
      },
      {
        "letra": "D",
        "texto": "osteoporose, condição metabólica óssea sem relação estabelecida com contato com solo contaminado descrito no caso.",
        "correta": false,
        "justificativa": "Incorreta. Osteoporose é condição metabólica óssea sem relação estabelecida com contato com solo contaminado descrito no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q3"
  },
  {
    "enunciado": "No hemograma da adolescente do caso, além dos achados já mencionados, observa-se aumento significativo de um tipo específico de leucócito, achado laboratorial comum nas parasitoses intestinais causadas por helmintos, refletindo resposta imunológica característica a esse tipo de infecção. Esse achado laboratorial é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "eosinofilia.",
        "correta": true,
        "justificativa": "A eosinofilia é achado laboratorial comum e característico em infecções por helmintos, refletindo resposta imune do tipo Th2 (com produção de citocinas como IL-4, IL-5 e IL-13) característica desse tipo de parasitose, consistente com o quadro laboratorial apresentado pela adolescente do caso. Correta. Eosinofilia é exatamente o achado laboratorial característico e esperado nas parasitoses por helmintos descritas no caso."
      },
      {
        "letra": "B",
        "texto": "basofilia isolada, achado laboratorial menos característico e específico das parasitoses por helmintos em comparação ao descrito na alternativa correta.",
        "correta": false,
        "justificativa": "Incorreta. Basofilia isolada não é o achado laboratorial mais característico e específico das parasitoses por helmintos, sendo a eosinofilia o achado central nesse contexto."
      },
      {
        "letra": "C",
        "texto": "neutrofilia isolada, achado mais característico de infecções bacterianas, e não da resposta imune típica às parasitoses por helmintos.",
        "correta": false,
        "justificativa": "Incorreta. Neutrofilia é achado mais característico de infecções bacterianas agudas, e não da resposta imune típica associada às parasitoses por helmintos descritas no caso."
      },
      {
        "letra": "D",
        "texto": "linfopenia grave, achado não característico da resposta imune típica às parasitoses por helmintos descritas no caso.",
        "correta": false,
        "justificativa": "Incorreta. Linfopenia grave não é achado característico da resposta imune típica às parasitoses por helmintos; ao contrário, a resposta imune característica envolve ativação de linfócitos Th2 e eosinofilia, e não linfopenia."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q4"
  },
  {
    "enunciado": "Além dos achados respiratórios e cutâneos, a adolescente apresenta também anemia identificada no hemograma, achado frequentemente associado a infestações intestinais por determinados helmintos que se alimentam de sangue da mucosa intestinal do hospedeiro. A anemia mais frequentemente associada a esse tipo de infestação intestinal por ancilostomídeos é do tipo",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ferropriva, por perda sanguínea crônica intestinal.",
        "correta": true,
        "justificativa": "Os ancilostomídeos causam perda sanguínea crônica pelo trato digestivo ao se alimentarem de sangue da mucosa intestinal do hospedeiro, levando a anemia ferropriva, especialmente em infestações intensas e prolongadas, sendo esse o tipo de anemia mais frequentemente associado a essa parasitose intestinal. Correta. Anemia ferropriva é exatamente o tipo mais frequentemente associado à infestação por ancilostomídeos, decorrente da perda sanguínea crônica intestinal."
      },
      {
        "letra": "B",
        "texto": "megaloblástica, por deficiência de vitamina B12, tipo de anemia menos característico da infestação por ancilostomídeos em comparação à alternativa correta.",
        "correta": false,
        "justificativa": "Incorreta. Anemia megaloblástica por deficiência de vitamina B12 tem outras etiologias mais características, não sendo o tipo mais frequentemente associado à infestação por ancilostomídeos."
      },
      {
        "letra": "C",
        "texto": "hemolítica autoimune, tipo de anemia com mecanismo distinto do relacionado à perda sanguínea intestinal crônica por ancilostomídeos.",
        "correta": false,
        "justificativa": "Incorreta. Anemia hemolítica autoimune tem mecanismo distinto (destruição imunomediada de hemácias), não sendo o tipo característico associado à perda sanguínea intestinal por ancilostomídeos."
      },
      {
        "letra": "D",
        "texto": "aplástica, tipo de anemia com mecanismo distinto do relacionado à perda sanguínea intestinal crônica por ancilostomídeos.",
        "correta": false,
        "justificativa": "Incorreta. Anemia aplástica tem mecanismo distinto (falência medular), não sendo o tipo característico associado à perda sanguínea intestinal por ancilostomídeos descrita no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q5"
  },
  {
    "enunciado": "Adolescente de 14 anos, residente em área com saneamento precário e sujeita a alagamentos frequentes, apresenta anemia ferropriva, eosinofilia, prurido migratório em região plantar, alteração recente do hábito intestinal e infiltrado pulmonar discreto identificado ao exame de imagem. Diante desse conjunto de achados clínicos e laboratoriais, o quadro é mais compatível com",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "doença inflamatória intestinal isolada, hipótese que não explicaria adequadamente todos os achados extraintestinais descritos no caso.",
        "correta": false,
        "justificativa": "Incorreta. Doença inflamatória intestinal isolada não explicaria adequadamente a lesão cutânea migratória, o infiltrado pulmonar e a eosinofilia acentuada descritos no caso, achados mais consistentes com parasitose."
      },
      {
        "letra": "B",
        "texto": "parasitose intestinal com ciclo pulmonar (geo-helmintíase), como estrongiloidíase ou ancilostomíase.",
        "correta": true,
        "justificativa": "A combinação de lesão cutânea migratória pruriginosa (sugestiva de larva migrans), eosinofilia, anemia ferropriva, sintomas digestivos e infiltrado pulmonar discreto, em contexto epidemiológico de saneamento precário, é fortemente sugestiva de geo-helmintíase com ciclo pulmonar, como estrongiloidíase ou ancilostomíase, devendo essa hipótese orientar a investigação diagnóstica complementar. Correta. Esse conjunto de achados é fortemente sugestivo de geo-helmintíase com ciclo pulmonar, consistente com o contexto epidemiológico da adolescente."
      },
      {
        "letra": "C",
        "texto": "neoplasia hematológica isolada, hipótese menos consistente com o conjunto de achados descritos, especialmente a lesão cutânea migratória característica relatada no caso.",
        "correta": false,
        "justificativa": "Incorreta. Embora eosinofilia acentuada e persistente deva sempre considerar diagnóstico diferencial com neoplasias hematológicas, o conjunto específico de achados (lesão cutânea migratória característica, contexto epidemiológico de saneamento precário) torna a hipótese parasitária mais consistente nesse caso."
      },
      {
        "letra": "D",
        "texto": "intoxicação medicamentosa aguda, hipótese incompatível com o contexto epidemiológico e o conjunto de achados clínicos descritos no caso.",
        "correta": false,
        "justificativa": "Incorreta. Não há elementos no caso que sugiram exposição a agente tóxico medicamentoso, sendo essa hipótese incompatível com o contexto epidemiológico e o conjunto de achados descritos."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q6"
  },
  {
    "enunciado": "Diante da forte suspeita de parasitose intestinal na adolescente do caso, a equipe médica solicita o exame considerado de escolha para identificação de ovos, larvas ou cistos de parasitas no trato digestivo. Esse exame laboratorial mais utilizado para o diagnóstico das parasitoses intestinais é o",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exame parasitológico de fezes (EPF).",
        "correta": true,
        "justificativa": "O exame parasitológico de fezes é o método diagnóstico de escolha para identificação de ovos, larvas ou cistos de parasitas intestinais, orientando o diagnóstico etiológico específico e o tratamento adequado direcionado, sendo exame fundamental na investigação da suspeita levantada no caso da adolescente. Correta. Exame parasitológico de fezes é exatamente o exame de escolha para investigação diagnóstica de parasitoses intestinais."
      },
      {
        "letra": "B",
        "texto": "hemocultura, exame utilizado para identificação de agentes infecciosos na corrente sanguínea, e não especificamente para parasitoses intestinais.",
        "correta": false,
        "justificativa": "Incorreta. Hemocultura é exame direcionado à identificação de agentes infecciosos na corrente sanguínea, sem relação direta com o diagnóstico específico de parasitoses intestinais."
      },
      {
        "letra": "C",
        "texto": "urocultura, exame utilizado para identificação de infecções do trato urinário, sem relação direta com o diagnóstico de parasitoses intestinais.",
        "correta": false,
        "justificativa": "Incorreta. Urocultura é exame direcionado à identificação de infecções do trato urinário, sem relação com o diagnóstico de parasitoses intestinais descritas no caso."
      },
      {
        "letra": "D",
        "texto": "velocidade de hemossedimentação, exame inespecífico de atividade inflamatória sistêmica, sem capacidade de identificar diretamente parasitas intestinais.",
        "correta": false,
        "justificativa": "Incorreta. VHS é exame inespecífico de atividade inflamatória sistêmica, sem capacidade de identificar diretamente parasitas intestinais, ao contrário do exame parasitológico de fezes."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q7"
  },
  {
    "enunciado": "Diante da eosinofilia persistente identificada na adolescente do caso, a equipe médica reforça, durante a discussão clínica, a importância de não restringir o raciocínio diagnóstico apenas às parasitoses, considerando outras condições que também podem cursar com esse achado laboratorial. É importante que o médico considere, no diagnóstico diferencial da eosinofilia, além das parasitoses,",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "apenas causas infecciosas de origem bacteriana, sem qualquer outra categoria diagnóstica relevante a ser considerada nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. Causas bacterianas não são classicamente associadas a eosinofilia significativa; ao contrário, infecções bacterianas tendem a cursar mais com neutrofilia do que com eosinofilia."
      },
      {
        "letra": "B",
        "texto": "alergias, doenças autoimunes e, mais raramente, neoplasias hematológicas.",
        "correta": true,
        "justificativa": "Embora as parasitoses sejam causa comum e frequentemente considerada primeiramente diante de eosinofilia, o diagnóstico diferencial deve incluir também doenças alérgicas (como asma e rinite alérgica), doenças autoimunes e, em casos de eosinofilia persistente e muito acentuada, neoplasias hematológicas (como certas leucemias e síndromes hipereosinofílicas), reforçando a importância do raciocínio clínico amplo e não restrito a uma única hipótese diagnóstica. Correta. Essa é a categorização correta e ampla do diagnóstico diferencial da eosinofilia, além das parasitoses."
      },
      {
        "letra": "C",
        "texto": "exclusivamente causas cardiovasculares, sem qualquer relação estabelecida entre essas condições e o achado laboratorial de eosinofilia discutido.",
        "correta": false,
        "justificativa": "Incorreta. Causas cardiovasculares não são classicamente associadas ao achado laboratorial de eosinofilia discutido no caso."
      },
      {
        "letra": "D",
        "texto": "apenas deficiências vitamínicas isoladas, sem qualquer outra categoria diagnóstica relevante a ser considerada nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. Deficiências vitamínicas isoladas não são classicamente associadas ao achado laboratorial de eosinofilia discutido no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q8"
  },
  {
    "enunciado": "Após confirmação do diagnóstico de geo-helmintíase na adolescente do caso, a equipe de saúde da família planeja ações de prevenção voltadas à comunidade onde ela reside, buscando reduzir a incidência de novos casos semelhantes na região. Entre as medidas eficazes de prevenção de verminoses transmitidas pelo solo discutidas pela equipe, incluem-se",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "uso de calçados, saneamento básico adequado e tratamento correto de fezes e água na comunidade.",
        "correta": true,
        "justificativa": "O uso de calçados (prevenindo penetração larvária cutânea, como no caso da larva migrans), a melhoria do saneamento básico e o tratamento adequado de fezes e água são medidas eficazes e reconhecidas de prevenção das geo-helmintíases, sendo essas ações fundamentais para o planejamento de intervenções de saúde pública direcionadas à comunidade da adolescente do caso. Correta. Essas são exatamente as medidas eficazes e reconhecidas de prevenção de geo-helmintíases discutidas no enunciado."
      },
      {
        "letra": "B",
        "texto": "uso exclusivo de repelentes tópicos contra insetos, sem qualquer outra medida preventiva complementar relevante para geo-helmintíases.",
        "correta": false,
        "justificativa": "Incorreta. Repelentes tópicos contra insetos não são medida específica e eficaz de prevenção de geo-helmintíases, que se relacionam ao contato com solo contaminado, e não à picada de insetos."
      },
      {
        "letra": "C",
        "texto": "vacinação específica contra helmintos, atualmente disponível de forma rotineira no calendário do Programa Nacional de Imunizações.",
        "correta": false,
        "justificativa": "Incorreta. Não existe vacinação específica contra helmintos disponível rotineiramente no calendário do PNI; a prevenção dessas parasitoses depende de medidas de saneamento e comportamentais, e não de imunização específica."
      },
      {
        "letra": "D",
        "texto": "ausência de qualquer medida eficaz de prevenção reconhecida atualmente para geo-helmintíases, tornando essas medidas discutidas irrelevantes.",
        "correta": false,
        "justificativa": "Incorreta. Há medidas eficazes de prevenção reconhecidas para geo-helmintíases, como as descritas na alternativa correta, contrariando a afirmação de ausência de medidas eficazes."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q9"
  },
  {
    "enunciado": "Durante a investigação da adolescente com infiltrado pulmonar e eosinofilia, um médico considera prescrever corticoide para alívio sintomático da tosse seca persistente, antes mesmo da confirmação diagnóstica e do tratamento antiparasitário específico. Uma preocupação clínica relevante nesse contexto é que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o corticoide não tem qualquer efeito reconhecido sobre parasitoses, sendo seguro seu uso empírico em qualquer situação clínica de infiltrado pulmonar eosinofílico.",
        "correta": false,
        "justificativa": "Incorreta. Há relação relevante e potencialmente grave entre o uso de corticoide e o agravamento de determinadas parasitoses (como a estrongiloidíase), contrariando a afirmação de segurança irrestrita do uso empírico."
      },
      {
        "letra": "B",
        "texto": "em algumas parasitoses, como a estrongiloidíase, o uso de corticoide sem investigação e tratamento antiparasitário prévios pode favorecer hiperinfecção e disseminação grave do parasita, sendo fundamental excluir essa possibilidade antes de corticoterapia em pacientes de risco.",
        "correta": true,
        "justificativa": "Na estrongiloidíase, o uso de corticoide sem investigação e tratamento antiparasitário prévios pode favorecer a síndrome de hiperinfecção, com disseminação sistêmica grave do parasita (incluindo passagem pela barreira intestinal e disseminação para outros órgãos), sendo fundamental excluir essa parasitose antes de iniciar corticoterapia em pacientes de risco, especialmente diante de quadro pulmonar eosinofílico e contexto epidemiológico sugestivo, como no caso da adolescente. Correta. Essa é a preocupação clínica correta e relevante sobre o uso de corticoide antes da investigação e tratamento antiparasitário adequados."
      },
      {
        "letra": "C",
        "texto": "o corticoide é sempre a primeira escolha terapêutica reconhecida em qualquer quadro pulmonar eosinofílico, independentemente da causa subjacente identificada ou suspeitada.",
        "correta": false,
        "justificativa": "Incorreta. O corticoide não é a primeira escolha terapêutica em qualquer quadro pulmonar eosinofílico; a conduta deve ser direcionada pela investigação da causa subjacente, especialmente diante de suspeita de parasitose."
      },
      {
        "letra": "D",
        "texto": "não há qualquer risco reconhecido associado ao uso empírico de corticoide nesse contexto clínico específico de infiltrado pulmonar com eosinofilia.",
        "correta": false,
        "justificativa": "Incorreta. Há risco reconhecido e relevante associado ao uso empírico de corticoide nesse contexto, especialmente diante de suspeita de estrongiloidíase não excluída previamente."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q10"
  },
  {
    "enunciado": "Durante a organização do raciocínio clínico do caso da adolescente pelo método SOAP, os tutores orientam os estudantes a integrar as queixas relatadas (subjetivo) com os achados de exame físico e exames complementares (objetivo), formulando hipóteses diagnósticas coerentes. Em relação ao método SOAP mencionado, o componente \"A\" (avaliação/assessment) corresponde a",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "apenas aos dados objetivos do exame físico e dos exames complementares, sem qualquer integração com os dados subjetivos relatados pela paciente.",
        "correta": false,
        "justificativa": "Incorreta. O componente \"Avaliação\" não se restringe apenas aos dados objetivos; ele integra tanto dados subjetivos quanto objetivos para formular as hipóteses diagnósticas."
      },
      {
        "letra": "B",
        "texto": "à análise integrada dos dados subjetivos (queixas relatadas) e objetivos (exame físico e exames complementares), formulando hipóteses diagnósticas coerentes com o quadro clínico apresentado.",
        "correta": true,
        "justificativa": "No método SOAP (Subjetivo, Objetivo, Avaliação, Plano), o componente \"Avaliação\" (Assessment) corresponde à análise integrada dos dados subjetivos (queixas do paciente) e objetivos (exame físico, exames complementares), permitindo a formulação de hipóteses diagnósticas coerentes que orientarão o plano terapêutico subsequente, sendo essa a estrutura de raciocínio clínico orientada pelos tutores na discussão do caso da adolescente. Correta. Essa é a descrição correta do componente \"Avaliação\" (A) do método SOAP."
      },
      {
        "letra": "C",
        "texto": "exclusivamente ao plano terapêutico a ser instituído, sem qualquer relação com a formulação de hipóteses diagnósticas nesse componente específico do método.",
        "correta": false,
        "justificativa": "Incorreta. O plano terapêutico corresponde ao componente \"P\" (Plano) do método SOAP, e não ao componente \"A\" (Avaliação) descrito no enunciado."
      },
      {
        "letra": "D",
        "texto": "apenas à queixa principal relatada pela paciente no início da consulta, sem qualquer integração com os demais achados clínicos e laboratoriais do caso.",
        "correta": false,
        "justificativa": "Incorreta. A queixa principal relatada pela paciente corresponde ao componente \"S\" (Subjetivo) do método SOAP, e não ao componente \"A\" (Avaliação), que integra dados subjetivos e objetivos para formular hipóteses diagnósticas."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q11"
  },
  {
    "enunciado": "Adolescente de 14 anos com anemia ferropriva, eosinofilia, lesão cutânea plantar sinuosa e infiltrado pulmonar transitório é diagnosticada com geo-helmintíase. Ao explicar à família a relação entre esses achados aparentemente distintos, a médica descreve o ciclo de vida do parasita responsável pelo quadro. A explicação fisiopatológica mais completa para a associação entre esses achados é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "penetração cutânea de larvas de helmintos, seguida de migração pela circulação até os pulmões (fase pulmonar, correspondente à síndrome de Löeffler), posterior deglutição das larvas e fixação intestinal, onde os vermes adultos causam perda sanguínea crônica (anemia ferropriva) e mantêm a eosinofilia por resposta imune do tipo Th2 contínua.",
        "correta": true,
        "justificativa": "O ciclo de vida de helmintos como ancilostomídeos e Strongyloides stercoralis explica de forma unificada a associação dos achados apresentados pela adolescente: penetração cutânea larvária (explicando a lesão sinuosa plantar), migração pulmonar (explicando o infiltrado transitório e a síndrome de Löeffler), deglutição e fixação intestinal dos vermes adultos (que causam perda sanguínea crônica, explicando a anemia ferropriva) e manutenção da eosinofilia por resposta imune do tipo Th2 ao longo de todo esse ciclo. Correta. Essa é a explicação fisiopatológica correta e completa que integra todos os achados clínicos apresentados pela adolescente por meio do ciclo de vida do parasita."
      },
      {
        "letra": "B",
        "texto": "processo totalmente independente entre as manifestações cutâneas, pulmonares e intestinais apresentadas pela adolescente, sem qualquer relação fisiopatológica comum entre esses achados.",
        "correta": false,
        "justificativa": "Incorreta. Há, na verdade, relação fisiopatológica bem estabelecida entre as manifestações cutâneas, pulmonares e intestinais, explicadas de forma unificada pelo ciclo de vida do helminto envolvido."
      },
      {
        "letra": "C",
        "texto": "reação alérgica alimentar isolada, sem qualquer relação estabelecida com o mecanismo de infecção por helmintos discutido no caso.",
        "correta": false,
        "justificativa": "Incorreta. Reação alérgica alimentar isolada não explicaria adequadamente o conjunto de achados descritos, especialmente a lesão cutânea sinuosa característica e o contexto epidemiológico do caso."
      },
      {
        "letra": "D",
        "texto": "efeito colateral exclusivo de uso prévio de corticoide tópico, sem qualquer relação com o mecanismo de infecção parasitária discutido no caso da adolescente.",
        "correta": false,
        "justificativa": "Incorreta. Não há relação estabelecida entre uso prévio de corticoide tópico e o conjunto de achados descritos no caso, que são explicados pelo ciclo de vida do parasita responsável pela geo-helmintíase diagnosticada."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q12"
  },
  {
    "enunciado": "Diante da suspeita clínica de geo-helmintíase na adolescente do caso, o exame parasitológico de fezes solicitado inicialmente, em amostra única, retorna negativo, gerando dúvida sobre a real ausência de parasitose. Em relação à sensibilidade e especificidade do exame parasitológico de fezes para diagnóstico de geo-helmintíases nesse contexto, é correto afirmar que esse exame",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "é sempre 100% sensível quando realizado em amostra única, não sendo necessária qualquer repetição adicional para confirmação diagnóstica nesse contexto.",
        "correta": false,
        "justificativa": "Incorreta. O exame não é sempre 100% sensível em amostra única; há reconhecida limitação de sensibilidade nesse cenário, justificando a recomendação de coleta seriada."
      },
      {
        "letra": "B",
        "texto": "pode apresentar sensibilidade limitada quando realizado em amostra única (devido à eliminação intermitente de ovos/larvas pelo parasita), sendo recomendada a coleta seriada (múltiplas amostras, geralmente três) para aumentar a acurácia diagnóstica.",
        "correta": true,
        "justificativa": "O exame parasitológico de fezes pode apresentar sensibilidade limitada quando realizado em amostra única, devido à eliminação intermitente de ovos ou larvas pelo parasita ao longo do tempo; por isso, recomenda-se a coleta seriada (geralmente três amostras em dias diferentes) para aumentar significativamente a acurácia diagnóstica, sendo essa a conduta correta diante de resultado negativo em amostra única com forte suspeita clínica, como no caso da adolescente. Correta. Essa é a explicação correta sobre a limitação de sensibilidade do exame em amostra única e a recomendação de coleta seriada para aumentar a acurácia diagnóstica."
      },
      {
        "letra": "C",
        "texto": "não tem qualquer utilidade diagnóstica reconhecida nas parasitoses intestinais, mesmo quando realizado de forma seriada com múltiplas amostras.",
        "correta": false,
        "justificativa": "Incorreta. O exame parasitológico de fezes tem utilidade diagnóstica reconhecida e é o método de escolha para investigação de parasitoses intestinais, especialmente quando realizado de forma seriada."
      },
      {
        "letra": "D",
        "texto": "deve ser realizado exclusivamente em amostra de sangue, e não de fezes, para o diagnóstico correto de geo-helmintíases como a suspeitada no caso da adolescente.",
        "correta": false,
        "justificativa": "Incorreta. O exame parasitológico de fezes é realizado, por definição, em amostra de fezes, e não de sangue, sendo essa a via de investigação diagnóstica correta para geo-helmintíases."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q13"
  },
  {
    "enunciado": "Durante a discussão do caso da adolescente, um tutor destaca que a presença de eosinofilia, embora sugestiva, não deve ser interpretada isoladamente como confirmação diagnóstica de parasitose, devendo ser integrada a outros elementos clínicos e epidemiológicos antes de qualquer conclusão diagnóstica definitiva. Em relação a esse raciocínio clínico, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a eosinofilia sempre confirma o diagnóstico de parasitose por si só, dispensando qualquer investigação complementar adicional no caso da adolescente.",
        "correta": false,
        "justificativa": "Incorreta. A eosinofilia, isoladamente, não confirma o diagnóstico de parasitose; ela é dado sugestivo que precisa ser integrado a outros elementos clínicos e confirmado por exame específico."
      },
      {
        "letra": "B",
        "texto": "a eosinofilia deve ser utilizada como dado sugestivo, mas não confirmatório de parasitose, integrando-a ao contexto clínico e epidemiológico (residência em área endêmica com saneamento precário, sintomas associados como a lesão cutânea plantar) antes de firmar o diagnóstico definitivo, geralmente confirmado por exame específico.",
        "correta": true,
        "justificativa": "A eosinofilia é dado laboratorial sugestivo, mas não confirmatório isoladamente, de parasitose; o raciocínio clínico correto deve integrá-la ao contexto epidemiológico (residência em área endêmica, condições precárias de saneamento) e aos demais achados clínicos (como a lesão cutânea plantar sinuosa) antes de estabelecer o diagnóstico definitivo, geralmente confirmado por exame parasitológico de fezes específico, como discutido ao longo do caso da adolescente. Correta. Esse é o raciocínio clínico correto sobre a interpretação da eosinofilia no contexto da investigação diagnóstica da parasitose suspeitada."
      },
      {
        "letra": "C",
        "texto": "a eosinofilia deve ser completamente desconsiderada na investigação diagnóstica de parasitoses, mesmo diante de forte suspeita clínica e epidemiológica.",
        "correta": false,
        "justificativa": "Incorreta. A eosinofilia não deve ser completamente desconsiderada; ao contrário, é elemento relevante do raciocínio diagnóstico, ainda que não confirmatório isoladamente."
      },
      {
        "letra": "D",
        "texto": "a eosinofilia só tem valor diagnóstico reconhecido em pacientes adultos, e não em adolescentes como a paciente descrita no caso clínico.",
        "correta": false,
        "justificativa": "Incorreta. A eosinofilia tem valor diagnóstico reconhecido em pacientes de qualquer faixa etária, incluindo adolescentes, quando interpretada corretamente no contexto clínico e epidemiológico apropriado."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q14"
  },
  {
    "enunciado": "Ao investigar o contexto socioambiental da adolescente do caso (área sujeita a alagamentos, sem saneamento regular, trajeto escolar diário por locais com solo exposto e potencialmente contaminado), a equipe de saúde reflete sobre a relação entre esses fatores e o adoecimento apresentado. Em relação a esse contexto socioambiental identificado no caso, é correto afirmar que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "não há qualquer relação reconhecida entre esses fatores socioambientais e o risco de parasitoses apresentado pela adolescente.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida e reconhecida entre esses fatores socioambientais e o risco de parasitoses, contrariando a afirmação de ausência de relação."
      },
      {
        "letra": "B",
        "texto": "esses fatores socioambientais aumentam significativamente o risco de contato com solo contaminado, sendo determinantes relevantes para a ocorrência de geo-helmintíases na comunidade onde a adolescente reside.",
        "correta": true,
        "justificativa": "Áreas sujeitas a alagamentos, sem saneamento básico regular e com maior exposição ao contato com solo potencialmente contaminado (como o trajeto escolar por locais com solo exposto, descrito no caso), configuram determinantes sociais relevantes que aumentam significativamente o risco de geo-helmintíases na população residente, reforçando a relação bem estabelecida entre hospedeiro, parasita e condições ambientais na epidemiologia dessas doenças. Correta. Essa é a interpretação correta da relação entre os fatores socioambientais identificados no caso e o risco de geo-helmintíases na comunidade da adolescente."
      },
      {
        "letra": "C",
        "texto": "apenas fatores genéticos individuais explicam a ocorrência de parasitoses como a apresentada pela adolescente, independentemente das condições ambientais discutidas no caso.",
        "correta": false,
        "justificativa": "Incorreta. Fatores ambientais têm papel relevante e reconhecido na ocorrência de parasitoses, não sendo essas doenças explicadas apenas por fatores genéticos individuais, especialmente considerando o mecanismo de transmissão pelo contato com solo contaminado."
      },
      {
        "letra": "D",
        "texto": "o saneamento básico não tem qualquer relação reconhecida com a prevalência de verminoses em uma comunidade, independentemente das condições socioambientais descritas.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bem estabelecida entre saneamento básico adequado e menor prevalência de verminoses em uma comunidade, contrariando a afirmação de ausência de relação."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q15"
  },
  {
    "enunciado": "Após confirmação diagnóstica da geo-helmintíase na adolescente do caso, a equipe médica prescreve tratamento farmacológico específico direcionado ao nematódeo identificado. Em relação ao tratamento farmacológico das principais parasitoses intestinais causadas por nematódeos (como ancilostomídeos e Ascaris), a classe de fármacos mais utilizada é a dos",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "benzimidazóis (como albendazol e mebendazol).",
        "correta": true,
        "justificativa": "Os benzimidazóis (albendazol, mebendazol) são amplamente utilizados no tratamento das principais geo-helmintíases intestinais, atuando sobre o metabolismo energético do parasita (inibindo a captação de glicose, entre outros mecanismos) e promovendo sua eliminação, sendo a classe farmacológica de escolha para o tratamento do caso diagnosticado na adolescente. Correta. Benzimidazóis são exatamente a classe farmacológica de escolha para o tratamento das geo-helmintíases descritas no caso."
      },
      {
        "letra": "B",
        "texto": "macrolídeos, classe de antibióticos utilizada para infecções bacterianas, sem relação com o tratamento específico das geo-helmintíases descritas no caso.",
        "correta": false,
        "justificativa": "Incorreta. Macrolídeos são antibióticos utilizados no tratamento de infecções bacterianas, sem qualquer papel reconhecido no tratamento específico das geo-helmintíases."
      },
      {
        "letra": "C",
        "texto": "betalactâmicos, classe de antibióticos utilizada para infecções bacterianas, sem relação com o tratamento específico das geo-helmintíases descritas no caso.",
        "correta": false,
        "justificativa": "Incorreta. Betalactâmicos são antibióticos utilizados no tratamento de infecções bacterianas, sem qualquer papel reconhecido no tratamento específico das geo-helmintíases."
      },
      {
        "letra": "D",
        "texto": "aminoglicosídeos, classe de antibióticos utilizada para infecções bacterianas, sem relação com o tratamento específico das geo-helmintíases descritas no caso.",
        "correta": false,
        "justificativa": "Incorreta. Aminoglicosídeos são antibióticos utilizados no tratamento de infecções bacterianas, sem qualquer papel reconhecido no tratamento específico das geo-helmintíases descritas no caso."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q16"
  },
  {
    "enunciado": "Durante a discussão sobre diferentes helmintos que poderiam explicar o quadro da adolescente, um tutor menciona uma particularidade específica do Strongyloides stercoralis, distinta de outros nematódeos intestinais discutidos no caso, relevante especialmente para pacientes que eventualmente necessitem de imunossupressão no futuro. Essa particularidade relevante do Strongyloides stercoralis é",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a incapacidade completa de causar autoinfecção, o que eliminaria qualquer risco de hiperinfecção mesmo em pacientes futuramente imunossuprimidos.",
        "correta": false,
        "justificativa": "Incorreta. O Strongyloides stercoralis tem, na verdade, capacidade reconhecida de autoinfecção, sendo essa justamente sua particularidade mais relevante, e não sua ausência."
      },
      {
        "letra": "B",
        "texto": "a capacidade de ciclo de autoinfecção interna, permitindo persistência da infecção por muitos anos (mesmo décadas) sem necessidade de reexposição externa, e risco de hiperinfecção grave, potencialmente fatal, em pacientes que venham a ser imunossuprimidos no futuro.",
        "correta": true,
        "justificativa": "O Strongyloides stercoralis apresenta ciclo de autoinfecção interna (larvas filarioides podem penetrar diretamente a mucosa intestinal ou a pele perianal, reiniciando o ciclo sem necessidade de saída do hospedeiro), permitindo que a infecção persista por décadas mesmo sem reexposição externa, e representa risco relevante de hiperinfecção grave, potencialmente fatal, em pacientes que venham a ser imunossuprimidos (como em uso futuro de corticoide sistêmico ou outras terapias imunossupressoras), sendo essa uma particularidade clinicamente importante desse parasita específico. Correta. Essa é a particularidade correta e clinicamente relevante do Strongyloides stercoralis discutida no enunciado."
      },
      {
        "letra": "C",
        "texto": "a ausência completa de fase pulmonar em seu ciclo de vida, diferentemente do que ocorre com outros helmintos discutidos no caso, como os ancilostomídeos.",
        "correta": false,
        "justificativa": "Incorreta. O Strongyloides stercoralis também apresenta fase pulmonar em seu ciclo de vida, semelhante a outros helmintos como os ancilostomídeos, e não ausência completa dessa fase."
      },
      {
        "letra": "D",
        "texto": "a transmissão exclusivamente por via oral, sem qualquer possibilidade de penetração cutânea, ao contrário do mecanismo de infecção discutido para a lesão plantar da adolescente.",
        "correta": false,
        "justificativa": "Incorreta. O Strongyloides stercoralis pode ser transmitido por penetração cutânea (semelhante ao mecanismo discutido para a lesão plantar da adolescente), e não exclusivamente por via oral."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q17"
  },
  {
    "enunciado": "Diante da confirmação de alta prevalência de geo-helmintíases na comunidade onde reside a adolescente do caso, a equipe de saúde coletiva do território planeja ações voltadas à redução da transmissão dessas parasitoses na população local, além do tratamento individual já instituído para a paciente. Entre as medidas de saúde coletiva reconhecidas para essa finalidade, destaca-se",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "tratamento individual isolado apenas dos casos sintomáticos identificados, sem qualquer ação adicional voltada à comunidade como um todo.",
        "correta": false,
        "justificativa": "Incorreta. Restringir a ação apenas ao tratamento individual dos casos sintomáticos, sem qualquer ação comunitária adicional, é abordagem incompleta diante de contexto de alta prevalência identificado."
      },
      {
        "letra": "B",
        "texto": "desparasitação em massa periódica (quando indicada em áreas de alta prevalência, conforme diretrizes específicas), associada a melhorias estruturais de saneamento básico e ações de educação em saúde direcionadas à comunidade.",
        "correta": true,
        "justificativa": "Em áreas de alta prevalência de geo-helmintíases, como identificado na comunidade da adolescente, estratégias de saúde coletiva reconhecidas incluem a desparasitação periódica em massa (conforme diretrizes específicas de saúde pública para populações de risco), associada a melhorias estruturais de saneamento básico e ações de educação em saúde direcionadas à comunidade, para reduzir de forma mais ampla e sustentável a transmissão dessas parasitoses no território. Correta. Essa é a estratégia de saúde coletiva reconhecida e recomendada para o controle de geo-helmintíases em comunidades de alta prevalência, como a discutida no caso."
      },
      {
        "letra": "C",
        "texto": "restrição do tratamento farmacológico exclusivamente a pacientes sintomáticos já identificados, sem qualquer ação preventiva coletiva voltada à redução da transmissão na comunidade.",
        "correta": false,
        "justificativa": "Incorreta. A restrição do tratamento apenas a pacientes sintomáticos, sem ação preventiva coletiva, não é suficiente para reduzir a transmissão em comunidades de alta prevalência, sendo necessárias ações mais amplas."
      },
      {
        "letra": "D",
        "texto": "ausência completa de qualquer estratégia de saúde pública validada e reconhecida para o controle de geo-helmintíases em comunidades de alta prevalência.",
        "correta": false,
        "justificativa": "Incorreta. Há estratégias de saúde pública validadas e reconhecidas para o controle de geo-helmintíases, como as descritas na alternativa correta, contrariando a afirmação de ausência de estratégias reconhecidas."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q18"
  },
  {
    "enunciado": "Além dos sintomas respiratórios e cutâneos já discutidos, a adolescente do caso também relata dor abdominal com alternância entre episódios de diarreia e constipação nas últimas semanas. Em relação a essa apresentação clínica adicional, no contexto de parasitose intestinal já diagnosticada, essa manifestação pode ser explicada por",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "irritação e resposta inflamatória da mucosa intestinal à presença dos parasitas identificados, com consequente alteração da motilidade intestinal.",
        "correta": true,
        "justificativa": "A presença de parasitas na mucosa intestinal, como os identificados no diagnóstico da adolescente, pode gerar resposta inflamatória local e alteração da motilidade intestinal, explicando sintomas como dor abdominal e alternância entre diarreia e constipação, frequentemente relatados em parasitoses intestinais e consistentes com o quadro apresentado no caso. Correta. Essa é a explicação fisiopatológica correta para os sintomas digestivos adicionais relatados pela adolescente, no contexto da parasitose intestinal já diagnosticada."
      },
      {
        "letra": "B",
        "texto": "ausência completa de qualquer relação estabelecida entre a parasitose intestinal diagnosticada e os sintomas digestivos relatados pela adolescente.",
        "correta": false,
        "justificativa": "Incorreta. Há relação reconhecida e bem estabelecida entre parasitose intestinal e sintomas digestivos como os relatados, contrariando a afirmação de ausência completa de relação."
      },
      {
        "letra": "C",
        "texto": "efeito exclusivo de fatores psicológicos, sem qualquer participação reconhecida do parasita identificado nos sintomas digestivos relatados no caso.",
        "correta": false,
        "justificativa": "Incorreta. Embora fatores psicológicos possam eventualmente influenciar sintomas digestivos em diferentes contextos, no caso descrito há explicação fisiopatológica direta relacionada à parasitose já diagnosticada, não devendo essa ser desconsiderada."
      },
      {
        "letra": "D",
        "texto": "consequência obrigatória e exclusiva de doença inflamatória intestinal concomitante, sem qualquer relação com a parasitose já diagnosticada no caso da adolescente.",
        "correta": false,
        "justificativa": "Incorreta. Não há elementos no caso que sugiram doença inflamatória intestinal concomitante como causa obrigatória e exclusiva dos sintomas; a explicação mais direta e consistente com o quadro é a própria parasitose intestinal já diagnosticada."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q19"
  },
  {
    "enunciado": "Ao revisar o caso da adolescente durante a discussão da situação-problema, os tutores reforçam a importância de não deixar passar despercebida a lesão cutânea sinuosa na região plantar da paciente durante o exame físico inicial, achado que foi essencial para o fechamento diagnóstico correto do caso. Essa orientação ilustra o princípio de que",
    "texto_base": null,
    "fase_alvo": 4,
    "uc_slug": "med_unidavi_f04_uc03_doencas_agressao_meio_ambiente",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o exame físico minucioso e completo, incluindo áreas frequentemente negligenciadas na prática clínica (como a região plantar), é fundamental para não perder achados-chave que direcionam corretamente o raciocínio diagnóstico do caso.",
        "correta": true,
        "justificativa": "O caso reforça a importância do exame físico completo e minucioso, incluindo áreas frequentemente negligenciadas na prática clínica, como a região plantar, pois um achado aparentemente isolado (lesão cutânea sinuosa) pode ser justamente a chave para integrar todo o quadro clínico e chegar ao diagnóstico correto de geo-helmintíase, evidenciando a relevância do exame físico completo mesmo diante de queixas predominantemente respiratórias e digestivas. Correta. Esse é o princípio correto e central ilustrado pela orientação dos tutores no caso da adolescente."
      },
      {
        "letra": "B",
        "texto": "lesões cutâneas nunca têm relevância diagnóstica relevante em quadros clínicos predominantemente digestivos e respiratórios, como o discutido no caso da adolescente.",
        "correta": false,
        "justificativa": "Incorreta. Lesões cutâneas podem, sim, ter relevância diagnóstica significativa mesmo em quadros predominantemente digestivos e respiratórios, como demonstrado pelo próprio caso discutido."
      },
      {
        "letra": "C",
        "texto": "o exame físico pode ser dispensado com segurança sempre que resultados laboratoriais já estejam disponíveis para análise do caso clínico em discussão.",
        "correta": false,
        "justificativa": "Incorreta. O exame físico completo continua sendo fundamental mesmo diante de resultados laboratoriais disponíveis, complementando e contextualizando esses achados, e não podendo ser dispensado com segurança."
      },
      {
        "letra": "D",
        "texto": "apenas exames de imagem são capazes de fornecer pistas diagnósticas relevantes nesse tipo específico de caso clínico discutido nesta situação-problema.",
        "correta": false,
        "justificativa": "Incorreta. O exame físico, e não apenas exames de imagem, foi fundamental para o diagnóstico correto no caso discutido, evidenciando que múltiplas fontes de informação clínica são relevantes para o raciocínio diagnóstico."
      }
    ],
    "_proveniencia": "whatsapp:UC3_SP4_ENAMED — Q20"
  },
  {
    "enunciado": "Armando, 75 anos, duas semanas após amputação do pé esquerdo por gangrena isquêmica, relata dor lancinante, parestesias e prurido na região do pé que não existe mais, \"como se ele ainda existisse\". Esse quadro, clássico após amputações, é denominado",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dor fantasma, um exemplo de dor neuropática.",
        "correta": true,
        "justificativa": "A dor fantasma é a percepção dolorosa referida a um segmento corporal amputado, sendo o exemplo clássico de dor neuropática decorrente de reorganização e hiperexcitabilidade de vias nociceptivas centrais e periféricas após lesão nervosa. Correta. A dor fantasma é definida exatamente por essa percepção dolorosa no membro ausente, sendo um paradigma de dor neuropática."
      },
      {
        "letra": "B",
        "texto": "dor nociceptiva somática residual do coto cirúrgico.",
        "correta": false,
        "justificativa": "Incorreta. A dor nociceptiva do coto decorre de lesão tecidual local presente (cicatriz, inflamação), enquanto a dor fantasma é referida a um segmento que não existe mais, com mecanismo neuropático distinto."
      },
      {
        "letra": "C",
        "texto": "dor psicogênica, sem substrato neurofisiológico.",
        "correta": false,
        "justificativa": "Incorreta. Há substrato neurofisiológico bem estabelecido (reorganização cortical, hiperatividade de neurônios desaferentados), não se tratando de fenômeno psicogênico."
      },
      {
        "letra": "D",
        "texto": "dor referida, projetada de uma víscera abdominal.",
        "correta": false,
        "justificativa": "Incorreta. Dor referida corresponde à percepção de dor visceral em um local corporal diferente do órgão afetado, mecanismo distinto do envolvido na dor fantasma."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q1"
  },
  {
    "enunciado": "O cirurgião que atendeu Armando esclarece que a dor no membro amputado não decorre de infecção ou lesão local, tratando-se de uma \"dor complexa\", e o encaminha à equipe multiprofissional de dor. Do ponto de vista fisiopatológico, a dor neuropática, categoria à qual pertence a dor fantasma, é definida como a dor",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "causada por lesão ou disfunção do sistema nervoso somatossensorial, central ou periférico.",
        "correta": true,
        "justificativa": "A dor neuropática resulta de lesão ou disfunção do sistema somatossensorial (nervo periférico, plexo, medula ou encéfalo), diferindo mecanisticamente da dor nociceptiva, que decorre da ativação de nociceptores íntegros por estímulo nocivo real. Correta. Essa é a definição consagrada de dor neuropática: decorre de lesão ou disfunção do sistema somatossensorial, e não da ativação de nociceptores por estímulo externo."
      },
      {
        "letra": "B",
        "texto": "causada exclusivamente por estímulo mecânico ou térmico direto sobre nociceptores intactos.",
        "correta": false,
        "justificativa": "Incorreta. Essa descrição corresponde à dor nociceptiva, mecanismo distinto da dor neuropática."
      },
      {
        "letra": "C",
        "texto": "que ocorre apenas em vísceras abdominais e pélvicas, nunca em membros.",
        "correta": false,
        "justificativa": "Incorreta. A dor neuropática pode ocorrer em qualquer segmento inervado, incluindo membros, como no caso da dor fantasma de Armando."
      },
      {
        "letra": "D",
        "texto": "que responde exclusivamente a anti-inflamatórios não esteroidais, sem necessidade de outras classes medicamentosas.",
        "correta": false,
        "justificativa": "Incorreta. A dor neuropática tipicamente responde pouco a AINEs, sendo tratada preferencialmente com anticonvulsivantes e antidepressivos adjuvantes, como a gabapentina prescrita ao paciente."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q2"
  },
  {
    "enunciado": "Armando encontra-se em cuidados paliativos há 5 anos, em decorrência de câncer de próstata previamente tratado com radioterapia e prostatectomia radical. Segundo a definição da Organização Mundial da Saúde, os cuidados paliativos são direcionados a pacientes com doenças",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exclusivamente terminais, aplicando-se apenas nas últimas semanas de vida.",
        "correta": false,
        "justificativa": "Incorreta. A indicação precoce de cuidados paliativos, concomitante ao tratamento da doença de base, é hoje reconhecida como benéfica, não se restringindo às últimas semanas de vida."
      },
      {
        "letra": "B",
        "texto": "que ameaçam a continuidade da vida, com abordagem que visa qualidade de vida por meio de prevenção e alívio do sofrimento, desde o diagnóstico.",
        "correta": true,
        "justificativa": "Os cuidados paliativos, segundo a OMS, aplicam-se a pacientes com doenças que ameaçam a continuidade da vida, com abordagem ativa e integral, direcionada à prevenção e ao alívio do sofrimento físico, psicológico, social e espiritual, idealmente desde o diagnóstico, e não apenas na fase terminal. Correta. Essa é a definição atual da OMS, enfatizando abordagem precoce, integral e voltada à qualidade de vida diante de doenças ameaçadoras à continuidade da vida."
      },
      {
        "letra": "C",
        "texto": "curáveis, sendo contraindicados em condições crônicas ou oncológicas avançadas.",
        "correta": false,
        "justificativa": "Incorreta. Cuidados paliativos são indicados justamente em doenças crônicas graves e oncológicas avançadas, não sendo restritos a condições curáveis."
      },
      {
        "letra": "D",
        "texto": "psiquiátricas isoladas, sem relação com doenças orgânicas crônicas.",
        "correta": false,
        "justificativa": "Incorreta. Cuidados paliativos aplicam-se a diversas condições orgânicas crônicas graves (oncológicas, cardiológicas, neurológicas, entre outras), não sendo restritos a doenças psiquiátricas."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q3"
  },
  {
    "enunciado": "Um estudante pergunta ao tutor qual é a diferença conceitual entre analgesia e anestesia, termos frequentemente confundidos. A distinção correta entre esses dois conceitos é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "analgesia é a abolição completa de todas as sensibilidades (dolorosa, tátil e térmica), enquanto anestesia é apenas o alívio parcial da dor.",
        "correta": false,
        "justificativa": "Incorreta. A definição está invertida: é a anestesia, e não a analgesia, que pode abolir múltiplas modalidades sensoriais, e a anestesia não é definida como alívio parcial."
      },
      {
        "letra": "B",
        "texto": "analgesia é a ausência ou o alívio da percepção dolorosa, preservando outras modalidades sensoriais, enquanto anestesia é a perda de sensibilidade de forma mais ampla, podendo incluir perda de consciência.",
        "correta": true,
        "justificativa": "Analgesia é o alívio ou a ausência da percepção dolorosa, com preservação de outras modalidades sensoriais (tato, temperatura), enquanto anestesia corresponde à perda de sensibilidade de forma mais abrangente, podendo ser local, regional ou geral (com perda de consciência nesta última). Correta. Essa é a distinção correta: analgesia preserva outras sensibilidades além de aliviar a dor, enquanto anestesia envolve perda de sensibilidade mais ampla, podendo incluir perda de consciência na anestesia geral."
      },
      {
        "letra": "C",
        "texto": "os dois termos são sinônimos, sem qualquer distinção fisiológica ou clínica relevante.",
        "correta": false,
        "justificativa": "Incorreta. Os termos não são sinônimos, tendo definições e implicações clínicas distintas, inclusive quanto à extensão do bloqueio sensorial."
      },
      {
        "letra": "D",
        "texto": "analgesia refere-se exclusivamente a procedimentos cirúrgicos, enquanto anestesia se aplica apenas ao manejo da dor crônica.",
        "correta": false,
        "justificativa": "Incorreta. Ambos os termos se aplicam a diferentes contextos clínicos, incluindo dor aguda, crônica e procedimentos cirúrgicos, não sendo mutuamente exclusivos por contexto."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q4"
  },
  {
    "enunciado": "A equipe de cuidados paliativos que acompanha Armando avalia não apenas sua dor física, mas também seu sofrimento emocional relacionado ao afastamento do filho mais velho, seu medo em relação à progressão da doença e questões espirituais. Esse conjunto de sofrimentos, que extrapola a dimensão puramente física, é conceituado na literatura de cuidados paliativos como",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dor nociceptiva mista, de origem somática e visceral combinadas.",
        "correta": false,
        "justificativa": "Incorreta. Dor nociceptiva mista refere-se à combinação de mecanismos nociceptivos somáticos e viscerais, conceito estritamente físico, distinto da dimensão biopsicossocial-espiritual da dor total."
      },
      {
        "letra": "B",
        "texto": "dor total, conceito que integra dimensões física, psicológica, social e espiritual do sofrimento.",
        "correta": true,
        "justificativa": "O conceito de \"dor total\", proposto por Cicely Saunders, integra as dimensões física, psicológica, social e espiritual do sofrimento do paciente, sendo central na abordagem dos cuidados paliativos, especialmente em doença oncológica avançada. Correta. O conceito de dor total abrange justamente a integração das dimensões física, psicológica, social e espiritual, coerente com a avaliação ampla realizada pela equipe de Armando."
      },
      {
        "letra": "C",
        "texto": "dor fantasma secundária, decorrente de reorganização cortical exclusiva.",
        "correta": false,
        "justificativa": "Incorreta. A dor fantasma é fenômeno neuropático específico do membro amputado, não englobando o sofrimento psicossocial e espiritual do paciente."
      },
      {
        "letra": "D",
        "texto": "dor iatrogênica, causada por efeito adverso medicamentoso.",
        "correta": false,
        "justificativa": "Incorreta. Não há relato de efeito adverso medicamentoso como causa do sofrimento descrito; o quadro reflete sofrimento multidimensional inerente à doença avançada e ao contexto de vida do paciente."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q5"
  },
  {
    "enunciado": "Foi prescrita a Armando gabapentina 300 mg, um comprimido de 8/8 horas, para o tratamento da dor neuropática do membro fantasma. A gabapentina pertence, farmacologicamente, à classe dos",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "anti-inflamatórios não esteroidais.",
        "correta": false,
        "justificativa": "Incorreta. A gabapentina não pertence à classe dos AINEs, e seu mecanismo de ação é completamente distinto (não envolve inibição de ciclo-oxigenases)."
      },
      {
        "letra": "B",
        "texto": "anticonvulsivantes, utilizados também no tratamento da dor neuropática.",
        "correta": true,
        "justificativa": "A gabapentina é um anticonvulsivante que, por seu mecanismo de modulação de canais de cálcio voltagem-dependentes, tornou-se também um dos principais fármacos adjuvantes no tratamento da dor neuropática, incluindo a dor fantasma. Correta. A gabapentina é um anticonvulsivante, classe também amplamente utilizada como adjuvante analgésico no tratamento da dor neuropática, mecanismo distinto do uso primário anticonvulsivante."
      },
      {
        "letra": "C",
        "texto": "opioides fracos, análogos da codeína.",
        "correta": false,
        "justificativa": "Incorreta. A gabapentina não é um opioide nem possui estrutura ou mecanismo relacionados à codeína."
      },
      {
        "letra": "D",
        "texto": "corticosteroides de uso sistêmico prolongado.",
        "correta": false,
        "justificativa": "Incorreta. A gabapentina não é um corticosteroide; pertence à classe dos anticonvulsivantes (gabapentinoides)."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q6"
  },
  {
    "enunciado": "Um estudante pergunta por que a gabapentina, um anticonvulsivante, é eficaz no tratamento da dor neuropática de Armando. O mecanismo de ação farmacológico que fundamenta esse uso é a",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ligação à subunidade alfa-2-delta de canais de cálcio voltagem-dependentes, reduzindo a liberação de neurotransmissores excitatórios (como glutamato) em neurônios hiperexcitáveis.",
        "correta": true,
        "justificativa": "A gabapentina liga-se à subunidade alfa-2-delta de canais de cálcio voltagem-dependentes em terminações nervosas hiperexcitáveis, reduzindo o influxo de cálcio e, consequentemente, a liberação de neurotransmissores excitatórios (glutamato, substância P), o que atenua a hiperexcitabilidade neuronal característica da dor neuropática. Correta. Esse é o mecanismo central da ação analgésica da gabapentina na dor neuropática, reduzindo a transmissão excitatória excessiva por neurônios sensibilizados."
      },
      {
        "letra": "B",
        "texto": "inibição direta e seletiva da enzima ciclo-oxigenase 2 (COX-2) em tecidos neurais periféricos.",
        "correta": false,
        "justificativa": "Incorreta. A gabapentina não atua sobre ciclo-oxigenases; esse é o mecanismo dos AINEs, farmacologicamente distinto."
      },
      {
        "letra": "C",
        "texto": "ativação de receptores opioides mu no corno posterior da medula espinal.",
        "correta": false,
        "justificativa": "Incorreta. A gabapentina não é agonista de receptores opioides; seu mecanismo envolve canais de cálcio, não receptores opioides."
      },
      {
        "letra": "D",
        "texto": "bloqueio irreversível da recaptação de dopamina em vias mesolímbicas.",
        "correta": false,
        "justificativa": "Incorreta. A gabapentina não atua sobre a recaptação de dopamina nem sobre vias mesolímbicas; seu alvo farmacológico é a subunidade alfa-2-delta de canais de cálcio."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q7"
  },
  {
    "enunciado": "A Síndrome Dolorosa Regional Complexa (SDRC), condição relevante no diagnóstico diferencial de dores neuropáticas pós-traumáticas e pós-cirúrgicas, caracteriza-se clinicamente por",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dor desproporcional ao evento desencadeante, associada a alterações autonômicas (edema, alterações de temperatura e coloração cutânea, sudorese) e tróficas na região afetada.",
        "correta": true,
        "justificativa": "A SDRC caracteriza-se por dor desproporcional em intensidade e/ou duração ao evento causal, associada a alterações autonômicas (edema, alterações vasomotoras e sudomotoras) e tróficas (pele, unhas, pelos) na região afetada, sendo diagnóstico diferencial relevante em quadros dolorosos pós-traumáticos, incluindo pós-amputação. Correta. Essa é a descrição clássica da SDRC: dor desproporcional associada a disautonomia local e alterações tróficas."
      },
      {
        "letra": "B",
        "texto": "dor exclusivamente noturna, sem qualquer alteração autonômica ou trófica associada.",
        "correta": false,
        "justificativa": "Incorreta. A SDRC não se caracteriza por padrão exclusivamente noturno; as alterações autonômicas e tróficas são elementos centrais do diagnóstico, e sua ausência descaracterizaria o quadro."
      },
      {
        "letra": "C",
        "texto": "ausência completa de dor, com predomínio de déficit motor isolado.",
        "correta": false,
        "justificativa": "Incorreta. A SDRC caracteriza-se justamente pela presença de dor intensa e desproporcional, não por sua ausência; pode haver disfunção motora associada, mas não como achado isolado definidor."
      },
      {
        "letra": "D",
        "texto": "quadro restrito a alterações psiquiátricas, sem qualquer componente físico documentável.",
        "correta": false,
        "justificativa": "Incorreta. A SDRC possui substrato fisiopatológico documentável (disautonomia, sensibilização central e periférica, alterações tróficas objetivas), não sendo um diagnóstico psiquiátrico."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q8"
  },
  {
    "enunciado": "Considerando a dor oncológica crônica de Armando, relacionada ao câncer de próstata previamente tratado, e sua eventual necessidade de escalonamento terapêutico segundo a escada analgésica da OMS, a indicação de opioides fortes (como a morfina) nesse contexto de dor crônica oncológica está reservada a quadros de dor",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "leve, como primeira escolha, antes de qualquer analgésico não opioide.",
        "correta": false,
        "justificativa": "Incorreta. Para dor leve, a primeira escolha são analgésicos não opioides (primeiro degrau), não opioides fortes."
      },
      {
        "letra": "B",
        "texto": "moderada a intensa, refratária ou insuficientemente controlada pelos degraus anteriores da escada analgésica.",
        "correta": true,
        "justificativa": "Na escada analgésica da OMS, os opioides fortes correspondem ao terceiro degrau, indicados para dor moderada a intensa que não responde adequadamente aos analgésicos não opioides (primeiro degrau) ou opioides fracos (segundo degrau), sendo amplamente utilizados no manejo da dor oncológica crônica quando indicado. Correta. Opioides fortes são indicados para dor moderada a intensa refratária aos degraus anteriores, sendo amplamente empregados no controle da dor oncológica crônica, inclusive em cuidados paliativos."
      },
      {
        "letra": "C",
        "texto": "exclusivamente aguda pós-operatória, sendo contraindicados em dor crônica oncológica.",
        "correta": false,
        "justificativa": "Incorreta. Opioides fortes são amplamente utilizados também na dor crônica oncológica, especialmente em cuidados paliativos, não estando restritos ao contexto agudo pós-operatório."
      },
      {
        "letra": "D",
        "texto": "psicogênica, sem qualquer substrato nociceptivo ou neuropático identificável.",
        "correta": false,
        "justificativa": "Incorreta. A indicação de opioides fortes fundamenta-se na intensidade e refratariedade da dor nociceptiva/neuropática, não em dor psicogênica sem substrato identificável."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q9"
  },
  {
    "enunciado": "Um estudante questiona por que Armando, mesmo sabendo racionalmente que seu pé foi amputado, continua percebendo sensações e dor nesse segmento ausente. A explicação neurofisiológica mais adequada para a persistência da dor fantasma envolve, entre outros mecanismos,",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "reorganização do mapa somatotópico no córtex somatossensorial primário (S1), com invasão de áreas corticais correspondentes ao membro amputado por regiões corticais vizinhas.",
        "correta": true,
        "justificativa": "A dor fantasma relaciona-se, entre outros mecanismos, à reorganização (plasticidade) do mapa somatotópico cortical em S1, no qual áreas corticais adjacentes \"invadem\" o território cortical previamente correspondente ao membro amputado, além de hiperatividade de neuromas no coto e alterações na medula espinal. Correta. A reorganização cortical somatotópica, com invasão de regiões vizinhas sobre o território do membro amputado, é um dos principais mecanismos centrais propostos para a dor fantasma."
      },
      {
        "letra": "B",
        "texto": "regeneração completa e funcional do nervo periférico amputado, restabelecendo sensibilidade normal ao membro ausente.",
        "correta": false,
        "justificativa": "Incorreta. Não há regeneração funcional do membro amputado; o nervo periférico seccionado pode formar neuromas dolorosos no coto, mas não há restabelecimento de sensibilidade normal ao membro ausente."
      },
      {
        "letra": "C",
        "texto": "ausência total de atividade neuronal nas áreas corticais previamente relacionadas ao membro amputado.",
        "correta": false,
        "justificativa": "Incorreta. Ao contrário da ausência de atividade, há hiperatividade e reorganização das áreas corticais correspondentes, o que sustenta a persistência da percepção dolorosa."
      },
      {
        "letra": "D",
        "texto": "substituição definitiva da representação cortical do membro amputado por tecido cicatricial glial, sem qualquer atividade elétrica residual.",
        "correta": false,
        "justificativa": "Incorreta. Embora ocorram alterações teciduais no coto, a representação cortical não é simplesmente substituída por tecido glial inerte; há atividade neuronal reorganizada e frequentemente hiperativa."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q10"
  },
  {
    "enunciado": "A equipe multiprofissional que acompanha Armando inclui fisioterapia e psicoterapia semanais, além da farmacoterapia com gabapentina. Essa abordagem multimodal para o tratamento da dor crônica de Armando fundamenta-se no princípio de que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a dor crônica, por ter componentes biopsicossociais, responde melhor a intervenções combinadas (farmacológicas e não farmacológicas) do que à farmacoterapia isolada.",
        "correta": true,
        "justificativa": "A dor crônica, especialmente em contextos como o de Armando (neuropática, oncológica, com componente psicossocial evidente), beneficia-se de abordagem multimodal, combinando farmacoterapia, intervenções físicas (fisioterapia) e psicológicas (psicoterapia), reconhecendo a natureza biopsicossocial do fenômeno doloroso crônico. Correta. A abordagem multimodal é reconhecidamente mais eficaz no manejo da dor crônica com componentes biopsicossociais, como o quadro de Armando."
      },
      {
        "letra": "B",
        "texto": "a fisioterapia e a psicoterapia substituem completamente a necessidade de qualquer medicação analgésica em dor neuropática crônica.",
        "correta": false,
        "justificativa": "Incorreta. As intervenções não farmacológicas complementam, mas geralmente não substituem integralmente a farmacoterapia em quadros de dor neuropática moderada a intensa, sendo abordagens combinadas, não substitutivas."
      },
      {
        "letra": "C",
        "texto": "apenas a farmacoterapia é eficaz no manejo da dor neuropática, sendo as demais intervenções meramente complementares sem evidência de benefício.",
        "correta": false,
        "justificativa": "Incorreta. Há evidências de benefício de intervenções não farmacológicas (fisioterapia, terapias cognitivo-comportamentais) no manejo da dor crônica, não sendo meramente complementares sem eficácia."
      },
      {
        "letra": "D",
        "texto": "a psicoterapia está indicada exclusivamente quando há diagnóstico formal de transtorno depressivo associado.",
        "correta": false,
        "justificativa": "Incorreta. A psicoterapia em cuidados paliativos e dor crônica pode ser indicada mesmo sem diagnóstico formal de transtorno depressivo, visando ao manejo do sofrimento psicológico e existencial, como no caso de Armando em relação ao afastamento do filho."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q11"
  },
  {
    "enunciado": "Um estudante questiona a diferença fisiopatológica entre a dor neuropática de Armando (dor fantasma) e uma eventual dor nociceptiva somática associada à cicatrização do coto cirúrgico, caso houvesse infecção local. A principal diferença mecanística entre esses dois tipos de dor é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a dor nociceptiva depende da ativação de nociceptores íntegros por estímulo nocivo real, enquanto a dor neuropática decorre de lesão ou disfunção das próprias vias nervosas somatossensoriais.",
        "correta": true,
        "justificativa": "A dor nociceptiva resulta da ativação de nociceptores íntegros por um estímulo nocivo real (mecânico, térmico, químico ou inflamatório), enquanto a dor neuropática resulta de lesão ou disfunção direta das vias somatossensoriais, mesmo na ausência de estímulo nocivo periférico atual — como ocorre na dor fantasma de Armando. Correta. Essa é a distinção fisiopatológica fundamental entre os dois tipos de dor, central para compreender por que Armando sente dor mesmo sem tecido periférico correspondente."
      },
      {
        "letra": "B",
        "texto": "ambas dependem exclusivamente da ativação de nociceptores periféricos íntegros, sem qualquer participação central.",
        "correta": false,
        "justificativa": "Incorreta. A dor neuropática, por definição, não depende da ativação de nociceptores periféricos íntegros por estímulo nocivo real; decorre de disfunção das próprias vias nervosas."
      },
      {
        "letra": "C",
        "texto": "a dor neuropática é sempre de menor intensidade que a dor nociceptiva, por definição fisiopatológica.",
        "correta": false,
        "justificativa": "Incorreta. Não há regra fisiopatológica que determine menor intensidade da dor neuropática; ela pode ser tão ou mais intensa que a dor nociceptiva, como frequentemente ocorre na dor fantasma e em neuropatias dolorosas."
      },
      {
        "letra": "D",
        "texto": "apenas a dor nociceptiva pode se tornar crônica; a dor neuropática é, por definição, sempre aguda e autolimitada.",
        "correta": false,
        "justificativa": "Incorreta. Ambos os tipos de dor podem cronificar-se; a dor fantasma de Armando, inclusive, ilustra a cronicidade possível da dor neuropática."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q12"
  },
  {
    "enunciado": "Diante do quadro de Armando, com múltiplas comorbidades (doença isquêmica periférica, sequela de AVC, câncer de próstata em cuidados paliativos) e sofrimento psicossocial relacionado ao conflito familiar, a conduta da equipe de saúde mais alinhada aos princípios da atenção centrada na pessoa e dos cuidados paliativos é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "focar exclusivamente no controle farmacológico da dor neuropática, sem investigar aspectos familiares ou emocionais.",
        "correta": false,
        "justificativa": "Incorreta. O foco exclusivamente farmacológico, ignorando dimensões psicossociais, contraria os princípios da dor total e da atenção integral em cuidados paliativos."
      },
      {
        "letra": "B",
        "texto": "avaliar de forma integral as dimensões física, psicológica, social e espiritual do sofrimento de Armando, incluindo sua relação familiar, e envolver equipe multiprofissional no plano de cuidado.",
        "correta": true,
        "justificativa": "A atenção centrada na pessoa e os princípios dos cuidados paliativos preconizam avaliação e manejo integral do sofrimento, incluindo dimensões física, psicológica, social e espiritual (conceito de dor total), com atuação de equipe multiprofissional, o que é coerente com o cuidado recebido por Armando. Correta. Essa conduta integra corretamente os princípios da atenção centrada na pessoa e dos cuidados paliativos, reconhecendo e abordando todas as dimensões do sofrimento de Armando."
      },
      {
        "letra": "C",
        "texto": "transferir toda a responsabilidade do cuidado emocional exclusivamente para os familiares, sem participação da equipe de saúde.",
        "correta": false,
        "justificativa": "Incorreta. A equipe de saúde tem papel ativo no manejo do sofrimento psicossocial, não devendo transferir essa responsabilidade exclusivamente à família."
      },
      {
        "letra": "D",
        "texto": "suspender o acompanhamento em cuidados paliativos, uma vez que o paciente já recebeu tratamento oncológico definitivo (radioterapia e prostatectomia).",
        "correta": false,
        "justificativa": "Incorreta. Cuidados paliativos não se limitam ao período de tratamento oncológico ativo; são mantidos e frequentemente intensificados conforme a progressão da doença e do sofrimento associado, mesmo após tratamentos definitivos prévios."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q13"
  },
  {
    "enunciado": "Sobre os mecanismos periféricos envolvidos na gênese da dor fantasma e neuropática pós-amputação, a formação de neuromas dolorosos no coto residual relaciona-se, fisiopatologicamente, com",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "regeneração organizada e funcional dos axônios seccionados, restabelecendo conexões normais com o território amputado.",
        "correta": false,
        "justificativa": "Incorreta. Não há regeneração funcional organizada que restabeleça conexões normais com o território amputado; o brotamento é desorganizado e disfuncional, formando neuromas."
      },
      {
        "letra": "B",
        "texto": "brotamento axonal desorganizado (sprouting) das terminações nervosas seccionadas, com acúmulo ectópico de canais de sódio voltagem-dependentes e geração de atividade elétrica espontânea ectópica.",
        "correta": true,
        "justificativa": "Após a secção nervosa na amputação, ocorre brotamento axonal desorganizado (sprouting) nas terminações seccionadas, com acúmulo anômalo de canais de sódio voltagem-dependentes, gerando focos de hiperexcitabilidade e disparos ectópicos espontâneos — os neuromas —, que contribuem para a dor no coto e, por sensibilização central subsequente, para a dor fantasma. Correta. O brotamento axonal desorganizado com acúmulo de canais de sódio e geração de disparos ectópicos espontâneos é o mecanismo periférico central na formação de neuromas dolorosos."
      },
      {
        "letra": "C",
        "texto": "ausência completa de atividade elétrica nas fibras nervosas seccionadas do coto.",
        "correta": false,
        "justificativa": "Incorreta. Ao contrário da ausência de atividade, os neuromas caracterizam-se por hiperatividade e disparos ectópicos espontâneos."
      },
      {
        "letra": "D",
        "texto": "substituição total do tecido nervoso seccionado por tecido adiposo metabolicamente inerte.",
        "correta": false,
        "justificativa": "Incorreta. Não ocorre simples substituição por tecido adiposo inerte; há tecido neural reorganizado de forma disfuncional e eletricamente ativo."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q14"
  },
  {
    "enunciado": "Um estudante questiona por que, mesmo após terapia bem-sucedida com gabapentina, fisioterapia e psicoterapia, Armando ainda pode apresentar exacerbações ocasionais da dor fantasma em situações de estresse emocional intenso. A explicação fisiopatológica mais adequada para essa influência do estresse sobre a dor neuropática crônica envolve",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a completa independência entre os sistemas de resposta ao estresse (eixo hipotálamo-hipófise-adrenal, sistema simpático) e as vias de modulação da dor.",
        "correta": false,
        "justificativa": "Incorreta. Há ampla interface entre os sistemas de resposta ao estresse e as vias de modulação da dor, não independência entre eles."
      },
      {
        "letra": "B",
        "texto": "a interação entre sistemas de resposta ao estresse e vias nociceptivas moduladoras, nas quais a ativação simpática e de mediadores do estresse pode reduzir o limiar de ativação de neurônios sensibilizados e influenciar negativamente a modulação descendente da dor.",
        "correta": true,
        "justificativa": "Existe interface bem estabelecida entre sistemas de resposta ao estresse (eixo hipotálamo-hipófise-adrenal, sistema nervoso simpático) e vias nociceptivas, de modo que estados de estresse emocional intenso podem reduzir o limiar de neurônios sensibilizados e comprometer a eficácia das vias descendentes inibitórias, favorecendo exacerbações transitórias da dor crônica mesmo sob tratamento adequado. Correta. A interação entre resposta ao estresse e modulação nociceptiva, com redução do limiar de neurônios sensibilizados e comprometimento da modulação descendente, explica exacerbações da dor crônica em contextos de estresse emocional."
      },
      {
        "letra": "C",
        "texto": "a substituição completa da dor neuropática por dor puramente psicogênica durante períodos de estresse.",
        "correta": false,
        "justificativa": "Incorreta. A dor permanece fisiopatologicamente neuropática; o estresse module sua intensidade percebida, mas não a transforma em fenômeno puramente psicogênico."
      },
      {
        "letra": "D",
        "texto": "o bloqueio definitivo dos efeitos da gabapentina por qualquer nível de estresse emocional, tornando o fármaco inerte nessas situações.",
        "correta": false,
        "justificativa": "Incorreta. Não há bloqueio farmacológico completo do efeito da gabapentina pelo estresse emocional; pode haver modulação da percepção da dor sem anular o mecanismo de ação do fármaco."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q15"
  },
  {
    "enunciado": "Considerando a possível progressão da doença oncológica de Armando e a necessidade eventual de rotação de opioides no manejo da dor oncológica refratária, o principal fundamento farmacológico para a prática de rotação de opioides (troca entre diferentes opioides) é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a tolerância cruzada incompleta entre diferentes opioides, permitindo, ao trocar o fármaco, obter analgesia eficaz com menor dose equivalente e menos efeitos adversos.",
        "correta": true,
        "justificativa": "A rotação de opioides fundamenta-se na tolerância cruzada incompleta entre diferentes fármacos dessa classe: ao trocar de opioide, frequentemente é possível obter analgesia adequada com dose equianalgésica menor que a esperada, além de reduzir efeitos adversos acumulados com o uso prolongado do fármaco anterior. Correta. A tolerância cruzada incompleta é o fundamento farmacológico central da rotação de opioides, permitindo otimizar analgesia e reduzir efeitos adversos em dor oncológica refratária."
      },
      {
        "letra": "B",
        "texto": "a ausência completa de tolerância cruzada entre opioides, tornando a troca sempre ineficaz.",
        "correta": false,
        "justificativa": "Incorreta. Existe tolerância cruzada entre opioides, porém incompleta; se fosse completa ausência de tolerância cruzada, a lógica da rotação seria distinta (doses equianalgésicas plenas sem benefício adicional)."
      },
      {
        "letra": "C",
        "texto": "a necessidade de evitar totalmente o uso de opioides fortes em pacientes oncológicos, substituindo-os definitivamente por AINEs.",
        "correta": false,
        "justificativa": "Incorreta. Os opioides fortes continuam sendo pilar do tratamento da dor oncológica moderada a intensa; não há indicação de substituição definitiva por AINEs nesse contexto."
      },
      {
        "letra": "D",
        "texto": "o fato de que todos os opioides possuem exatamente o mesmo perfil de efeitos adversos, tornando a rotação irrelevante clinicamente.",
        "correta": false,
        "justificativa": "Incorreta. Diferentes opioides apresentam perfis distintos de efeitos adversos e metabolismo, o que justamente fundamenta a prática clínica de rotação para otimizar tolerabilidade."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q16"
  },
  {
    "enunciado": "Sobre a fisiopatologia da dor oncológica em pacientes como Armando, um mecanismo relevante e distinto dos observados em dor neuropática pós-amputação é a dor óssea por metástase, quando presente. Esse tipo de dor caracteriza-se, mecanisticamente, por envolver",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ativação exclusiva de fibras A-beta táteis, sem qualquer participação de nociceptores ou processo inflamatório.",
        "correta": false,
        "justificativa": "Incorreta. A dor óssea metastática envolve ativação de nociceptores e processos inflamatórios/osteoclásticos, não sendo mediada por fibras A-beta táteis isoladamente."
      },
      {
        "letra": "B",
        "texto": "combinação de mecanismos nociceptivos (por lesão tecidual e liberação de mediadores inflamatórios e fatores osteoclásticos) e neuropáticos (por compressão ou infiltração de estruturas nervosas adjacentes), configurando dor mista.",
        "correta": true,
        "justificativa": "A dor óssea metastática caracteriza-se por mecanismo misto: componente nociceptivo, por destruição óssea, ativação osteoclástica e liberação de mediadores inflamatórios sensibilizadores, associado, em muitos casos, a componente neuropático por compressão ou infiltração de estruturas nervosas adjacentes ao osso comprometido. Correta. A combinação de mecanismos nociceptivos (inflamatórios e osteoclásticos) e neuropáticos (compressivos/infiltrativos) caracteriza a dor óssea metastática como dor mista, distinta mecanisticamente da dor fantasma puramente neuropática pós-amputação."
      },
      {
        "letra": "C",
        "texto": "mecanismo idêntico ao da dor fantasma, com origem puramente central e ausência de qualquer componente periférico.",
        "correta": false,
        "justificativa": "Incorreta. A dor óssea metastática possui componente periférico evidente (lesão tecidual óssea local), diferindo do mecanismo predominantemente central e de reorganização cortical da dor fantasma."
      },
      {
        "letra": "D",
        "texto": "ausência completa de resposta a opioides, sendo tratável exclusivamente com bisfosfonatos isolados.",
        "correta": false,
        "justificativa": "Incorreta. A dor óssea metastática costuma responder, ao menos parcialmente, a opioides e outras estratégias (radioterapia, bisfosfonatos, anti-inflamatórios), não sendo tratável exclusivamente por uma única classe isolada."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q17"
  },
  {
    "enunciado": "Reconsiderando o quadro biopsicossocial de Armando, com sofrimento relacionado ao afastamento do filho mais velho, um estudante questiona como esse sofrimento relacional pode influenciar objetivamente sua percepção de dor física. A explicação neurofisiológica mais adequada para essa interação é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "sofrimento emocional e dor física compartilham, ao menos parcialmente, substratos neurais comuns (como o córtex cingulado anterior e a ínsula), de modo que o sofrimento psicossocial pode amplificar a percepção da dor física por vias de integração central compartilhadas.",
        "correta": true,
        "justificativa": "Sofrimento emocional/social e dor física compartilham, ao menos parcialmente, redes neurais comuns de processamento (córtex cingulado anterior, ínsula, entre outras estruturas do componente afetivo-motivacional da dor), o que explica por que sofrimento psicossocial significativo, como o vivido por Armando, pode amplificar a percepção subjetiva da dor física, fundamentando o conceito de dor total. Correta. O compartilhamento parcial de substratos neurais entre sofrimento emocional e dor física explica a amplificação recíproca entre essas dimensões, sustentando a abordagem integral necessária no caso de Armando."
      },
      {
        "letra": "B",
        "texto": "sofrimento emocional e dor física são processados em estruturas encefálicas completamente distintas e não comunicantes, sem qualquer interação possível.",
        "correta": false,
        "justificativa": "Incorreta. Há evidência robusta de sobreposição neural entre processamento de dor física e sofrimento emocional/social, não estruturas completamente independentes."
      },
      {
        "letra": "C",
        "texto": "o sofrimento emocional substitui integralmente a necessidade de avaliação e tratamento da dor física, tornando-a irrelevante clinicamente.",
        "correta": false,
        "justificativa": "Incorreta. A avaliação e o tratamento da dor física permanecem necessários e relevantes mesmo diante de sofrimento emocional intenso; ambos devem ser abordados de forma integrada, não substitutiva."
      },
      {
        "letra": "D",
        "texto": "apenas a dor física pode influenciar o estado emocional, sendo unidirecional e sem retroalimentação do sofrimento psicológico sobre a dor física.",
        "correta": false,
        "justificativa": "Incorreta. A relação é bidirecional: assim como a dor física pode gerar sofrimento emocional, o sofrimento psicossocial pode retroalimentar e amplificar a percepção da dor física, como discutido no conceito de dor total."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q18"
  },
  {
    "enunciado": "Um estudante questiona por que a indicação precoce de cuidados paliativos, concomitante ao tratamento oncológico ativo, é hoje recomendada, e não apenas nas fases terminais da doença, como ocorria em modelos assistenciais mais antigos. O principal fundamento para essa mudança de paradigma é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "estudos demonstram que a integração precoce de cuidados paliativos ao tratamento oncológico associa-se a melhor controle de sintomas, melhor qualidade de vida e, em alguns estudos, até maior sobrevida, além de facilitar planejamento de cuidados avançado.",
        "correta": true,
        "justificativa": "Estudos robustos (incluindo ensaios clínicos de referência em oncologia) demonstraram que a integração precoce de cuidados paliativos ao tratamento oncológico ativo associa-se a melhor controle sintomático, melhor qualidade de vida, redução de intervenções fúteis no fim da vida e, em alguns casos, até ganho de sobrevida, fundamentando a recomendação atual de indicação precoce. Correta. Essa é a evidência que sustenta a recomendação atual de integração precoce dos cuidados paliativos, concomitante ao tratamento oncológico ativo, e não restrita à fase terminal."
      },
      {
        "letra": "B",
        "texto": "cuidados paliativos precoces substituem integralmente a necessidade de tratamento oncológico específico, sendo mutuamente exclusivos.",
        "correta": false,
        "justificativa": "Incorreta. Cuidados paliativos precoces são concomitantes, e não substitutos, ao tratamento oncológico ativo (quimioterapia, radioterapia, cirurgia), quando indicado."
      },
      {
        "letra": "C",
        "texto": "a introdução precoce de cuidados paliativos está associada a piora comprovada da qualidade de vida, sendo essa mudança de paradigma controversa e sem sustentação científica.",
        "correta": false,
        "justificativa": "Incorreta. A evidência científica disponível é favorável, não contrária, à introdução precoce de cuidados paliativos, associando-a a melhores desfechos, não a piora da qualidade de vida."
      },
      {
        "letra": "D",
        "texto": "cuidados paliativos precoces aplicam-se exclusivamente a pacientes sem qualquer possibilidade de tratamento oncológico ativo concomitante.",
        "correta": false,
        "justificativa": "Incorreta. Cuidados paliativos precoces aplicam-se justamente de forma concomitante ao tratamento ativo, sendo essa simultaneidade o cerne da mudança de paradigma discutida."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q19"
  },
  {
    "enunciado": "Integrando os múltiplos aspectos do caso de Armando — dor fantasma neuropática, comorbidades vasculares e neurológicas, doença oncológica em cuidados paliativos e sofrimento psicossocial familiar —, a conduta terapêutica mais completa e alinhada à melhor prática atual para o manejo global de sua dor é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "tratamento exclusivamente farmacológico com um único fármaco analgésico, sem reavaliação periódica ou abordagem multiprofissional.",
        "correta": false,
        "justificativa": "Incorreta. A monoterapia sem reavaliação periódica e sem abordagem multiprofissional não contempla a complexidade biopsicossocial e a natureza multifatorial da dor de Armando."
      },
      {
        "letra": "B",
        "texto": "abordagem multimodal e interdisciplinar, combinando farmacoterapia adequada ao mecanismo de dor predominante (anticonvulsivante para o componente neuropático), intervenções não farmacológicas (fisioterapia, psicoterapia), avaliação e manejo das dimensões psicossociais e espirituais (dor total) e reavaliação periódica da eficácia terapêutica.",
        "correta": true,
        "justificativa": "O manejo integral da dor crônica complexa de Armando exige abordagem multimodal e interdisciplinar: farmacoterapia direcionada ao mecanismo fisiopatológico predominante (anticonvulsivante para dor neuropática, com possível necessidade futura de opioides para dor oncológica), intervenções não farmacológicas complementares, avaliação e manejo das dimensões psicossociais e espirituais do sofrimento (dor total), e reavaliação contínua — coerente com toda a discussão da situação-problema. Correta. Essa conduta integra corretamente todos os aspectos discutidos no caso — mecanismo de dor, farmacoterapia direcionada, intervenções não farmacológicas, dimensão psicossocial/espiritual e reavaliação —, refletindo a melhor prática atual em cuidados paliativos e manejo da dor crônica."
      },
      {
        "letra": "C",
        "texto": "encaminhamento exclusivo a especialista em saúde mental, sem qualquer intervenção farmacológica direcionada ao componente neuropático da dor.",
        "correta": false,
        "justificativa": "Incorreta. O encaminhamento à saúde mental é componente importante, mas não substitui a necessidade de farmacoterapia direcionada ao componente neuropático objetivamente identificado (dor fantasma)."
      },
      {
        "letra": "D",
        "texto": "suspensão de qualquer intervenção terapêutica até resolução espontânea do conflito familiar relatado.",
        "correta": false,
        "justificativa": "Incorreta. A suspensão de intervenções terapêuticas contraria os princípios de manejo ativo do sofrimento em cuidados paliativos, e o conflito familiar não tem resolução espontânea garantida nem prazo previsível que justifique postergar o cuidado."
      }
    ],
    "_proveniencia": "upload:UC1_SP2_Dor_ENAMED — Q20"
  },
  {
    "enunciado": "Renata, 39 anos, refere dor difusa, de difícil localização, presente há quatro anos, envolvendo ombros, região cervical, coluna dorsal e lombar, associada a sono não reparador e fadiga. Ao exame, identificam-se áreas de hipersensibilidade dolorosa à palpação em múltiplos pontos, sem sinais inflamatórios articulares objetivos. Esse quadro clínico é mais compatível com o diagnóstico de",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "artrite reumatoide em fase inicial, com acometimento articular predominante.",
        "correta": false,
        "justificativa": "Incorreta. A artrite reumatoide caracteriza-se por sinovite objetiva, com sinais inflamatórios articulares (edema, calor, rigidez matinal por sinovite), tipicamente com padrão simétrico em pequenas articulações, e alterações laboratoriais/de imagem, não descritas no caso."
      },
      {
        "letra": "B",
        "texto": "fibromialgia, síndrome de dor crônica difusa associada a hipersensibilidade dolorosa e distúrbios do sono.",
        "correta": true,
        "justificativa": "A fibromialgia caracteriza-se por dor musculoesquelética crônica e difusa, presente por mais de três meses, associada a hipersensibilidade dolorosa generalizada, distúrbios do sono, fadiga e ausência de sinais inflamatórios articulares objetivos aos exames — quadro compatível com o de Renata. Correta. O quadro de dor difusa crônica, hipersensibilidade dolorosa à palpação e ausência de sinais inflamatórios objetivos é característico da fibromialgia."
      },
      {
        "letra": "C",
        "texto": "osteoartrite primária generalizada, de origem degenerativa articular.",
        "correta": false,
        "justificativa": "Incorreta. A osteoartrite é doença degenerativa articular localizada, tipicamente relacionada a articulações de carga, sem o padrão de dor difusa generalizada e hipersensibilidade descrito."
      },
      {
        "letra": "D",
        "texto": "gota poliarticular, decorrente de depósito de cristais de urato.",
        "correta": false,
        "justificativa": "Incorreta. A gota caracteriza-se por crises agudas de monoartrite ou oligoartrite intensamente inflamatória, associada a hiperuricemia, quadro distinto da dor crônica difusa de Renata."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q1"
  },
  {
    "enunciado": "Um estudante pergunta qual é a principal característica que distingue a dor da fibromialgia de uma dor inflamatória articular clássica. A resposta correta é que a dor da fibromialgia é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "acompanhada de edema articular evidente, eritema e calor local, com elevação de provas inflamatórias.",
        "correta": false,
        "justificativa": "Incorreta. Essa descrição é típica de artrites inflamatórias, não da fibromialgia, que não apresenta sinais objetivos de inflamação articular."
      },
      {
        "letra": "B",
        "texto": "predominantemente muscular e de partes moles, com hipersensibilidade dolorosa difusa, sem sinais objetivos de inflamação articular ou alterações laboratoriais específicas.",
        "correta": true,
        "justificativa": "A dor da fibromialgia é predominantemente musculoesquelética e de partes moles, difusa, com hipersensibilidade dolorosa generalizada, sem sinais objetivos de inflamação articular (edema, calor, eritema) e sem alterações laboratoriais específicas, o que frequentemente gera dificuldade diagnóstica e frustração ao paciente, como relatado por Renata. Correta. A ausência de sinais inflamatórios objetivos e de alterações laboratoriais específicas, associada a dor difusa musculoesquelética, é a marca distintiva da fibromialgia frente a doenças inflamatórias articulares."
      },
      {
        "letra": "C",
        "texto": "restrita a uma única articulação, de início súbito e resolução espontânea em 24 horas.",
        "correta": false,
        "justificativa": "Incorreta. A dor da fibromialgia é caracteristicamente difusa e crônica (mais de três meses), não restrita a uma articulação nem de resolução espontânea rápida."
      },
      {
        "letra": "D",
        "texto": "sempre acompanhada de deformidade articular estrutural visível ao exame físico.",
        "correta": false,
        "justificativa": "Incorreta. A fibromialgia não causa deformidade articular estrutural; trata-se de condição sem dano articular objetivo demonstrável."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q2"
  },
  {
    "enunciado": "Renata relata frustração porque, em atendimentos anteriores, foi informada que \"não havia nada errado nos exames\", chegando a ser encaminhada ao psiquiatra sem investigação adequada de sua queixa física. Essa situação ilustra um problema comum no manejo da fibromialgia, relacionado a",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "excesso de exames complementares solicitados de forma desnecessária, com sobrediagnóstico da condição.",
        "correta": false,
        "justificativa": "Incorreta. O problema descrito não é de excesso de exames, mas de descrédito da queixa por ausência de achados objetivos nos exames já realizados."
      },
      {
        "letra": "B",
        "texto": "estigmatização e descrédito da queixa dolorosa por ausência de achados objetivos em exames de rotina, resultando frequentemente em diagnóstico tardio.",
        "correta": true,
        "justificativa": "A fibromialgia frequentemente é subdiagnosticada ou tem seu diagnóstico postergado devido à ausência de achados objetivos em exames de imagem e laboratoriais de rotina, levando a estigmatização da queixa dolorosa e, por vezes, encaminhamentos inadequados sem reconhecimento da legitimidade clínica da condição, situação vivenciada por Renata. Correta. A estigmatização e o descrédito da dor por ausência de achados objetivos, levando a diagnóstico tardio, é um problema amplamente reconhecido no manejo da fibromialgia, refletido na fala de Renata."
      },
      {
        "letra": "C",
        "texto": "tratamento excessivamente precoce e agressivo com opioides fortes, sem indicação adequada.",
        "correta": false,
        "justificativa": "Incorreta. Não há relato de tratamento precoce com opioides fortes; ao contrário, o problema foi a falta de reconhecimento diagnóstico adequado."
      },
      {
        "letra": "D",
        "texto": "hospitalização inadequada e prolongada para investigação de quadro autolimitado.",
        "correta": false,
        "justificativa": "Incorreta. Não há indicação de hospitalização para o diagnóstico de fibromialgia, que é eminentemente clínico e ambulatorial."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q3"
  },
  {
    "enunciado": "A síndrome dolorosa miofascial, diagnóstico diferencial relevante frente à fibromialgia, caracteriza-se clinicamente pela presença de",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "pontos-gatilho (trigger points) em bandas musculares tensas, que podem ocorrer em qualquer músculo e desencadear dor referida à palpação.",
        "correta": true,
        "justificativa": "A síndrome dolorosa miofascial caracteriza-se pela presença de pontos-gatilho — pequenas áreas hiperirritáveis em bandas musculares tensas — que podem ocorrer em qualquer músculo do corpo e, à palpação, desencadeiam dor local e frequentemente dor referida a distância. Correta. Os pontos-gatilho em bandas musculares tensas, capazes de ocorrer em qualquer músculo e gerar dor referida à palpação, são a característica definidora da síndrome miofascial."
      },
      {
        "letra": "B",
        "texto": "dor articular simétrica em pequenas articulações das mãos, associada a rigidez matinal prolongada.",
        "correta": false,
        "justificativa": "Incorreta. Essa descrição é típica de artrite reumatoide, não da síndrome miofascial, que é primariamente muscular, não articular."
      },
      {
        "letra": "C",
        "texto": "exclusivamente dor visceral abdominal, sem qualquer relação com musculatura esquelética.",
        "correta": false,
        "justificativa": "Incorreta. A síndrome miofascial refere-se a dor musculoesquelética, não visceral."
      },
      {
        "letra": "D",
        "texto": "ausência completa de achados à palpação muscular, com exame físico integralmente normal.",
        "correta": false,
        "justificativa": "Incorreta. Ao exame físico, há achados característicos e reprodutíveis à palpação (pontos-gatilho, bandas tensas), diferentemente do descrito na alternativa."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q4"
  },
  {
    "enunciado": "Um estudante pergunta qual é a principal diferença na distribuição dos pontos dolorosos entre a fibromialgia e a síndrome dolorosa miofascial. A resposta correta é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "na fibromialgia, os pontos dolorosos tendem a ser difusos e bilaterais/simétricos; na síndrome miofascial, os pontos-gatilho podem ocorrer em qualquer músculo, de forma mais localizada e nem sempre simétrica.",
        "correta": true,
        "justificativa": "Na fibromialgia, a dor e a hipersensibilidade tendem a ser difusas, generalizadas e frequentemente simétricas; já na síndrome miofascial, os pontos-gatilho podem surgir em qualquer músculo isolado ou em grupos musculares específicos, de forma mais localizada e não necessariamente simétrica — distinção clínica relevante destacada na intencionalidade da situação-problema. Correta. Essa é a distinção fundamental na distribuição da dor entre as duas condições: difusa e simétrica na fibromialgia; mais localizada e variável na síndrome miofascial."
      },
      {
        "letra": "B",
        "texto": "na síndrome miofascial, os pontos dolorosos são sempre simétricos e generalizados por todo o corpo, idênticos à fibromialgia.",
        "correta": false,
        "justificativa": "Incorreta. Ao contrário, a síndrome miofascial caracteriza-se justamente por não seguir necessariamente um padrão simétrico e generalizado, podendo restringir-se a músculos ou grupos musculares específicos."
      },
      {
        "letra": "C",
        "texto": "na fibromialgia, os pontos dolorosos restringem-se exclusivamente à musculatura paravertebral lombar.",
        "correta": false,
        "justificativa": "Incorreta. A fibromialgia não se restringe à musculatura lombar; sua distribuição é tipicamente generalizada, envolvendo múltiplas regiões corporais."
      },
      {
        "letra": "D",
        "texto": "não há qualquer diferença na distribuição dos pontos dolorosos entre as duas condições, sendo a distinção baseada apenas em exames de imagem.",
        "correta": false,
        "justificativa": "Incorreta. Não há exame de imagem específico que distinga as duas condições; a distinção é fundamentalmente clínica, baseada em anamnese e exame físico, incluindo o padrão de distribuição dos pontos dolorosos."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q5"
  },
  {
    "enunciado": "Diante do quadro crônico de Renata, a equipe de saúde iniciou tratamento medicamentoso associado a fisioterapia, práticas integrativas e acompanhamento psicológico em serviço multiprofissional. Essa abordagem combinada reflete o princípio de que o tratamento da fibromialgia deve ser, preferencialmente,",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "facil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "exclusivamente farmacológico, com uso isolado de anti-inflamatórios em altas doses.",
        "correta": false,
        "justificativa": "Incorreta. O tratamento exclusivamente farmacológico com AINEs em altas doses não é a abordagem recomendada, já que a fibromialgia responde de forma limitada a essa classe isoladamente, além dos riscos associados ao uso prolongado."
      },
      {
        "letra": "B",
        "texto": "multidisciplinar, combinando intervenções farmacológicas e não farmacológicas para o manejo integral da dor crônica e de seus fatores associados.",
        "correta": true,
        "justificativa": "O tratamento da fibromialgia é reconhecidamente multidisciplinar, combinando farmacoterapia direcionada (frequentemente antidepressivos e/ou anticonvulsivantes, não necessariamente AINEs isolados), exercício físico orientado, fisioterapia, práticas integrativas e suporte psicológico, dado o caráter multifatorial da condição. Correta. A abordagem multidisciplinar integrando farmacoterapia e intervenções não farmacológicas é a recomendação atual para o manejo da fibromialgia, coerente com a conduta adotada para Renata."
      },
      {
        "letra": "C",
        "texto": "restrito a repouso absoluto prolongado, evitando qualquer atividade física.",
        "correta": false,
        "justificativa": "Incorreta. O repouso absoluto prolongado é contraindicado na fibromialgia; a atividade física orientada e progressiva é, ao contrário, parte importante do tratamento."
      },
      {
        "letra": "D",
        "texto": "baseado unicamente em psicoterapia, sem qualquer intervenção física ou farmacológica.",
        "correta": false,
        "justificativa": "Incorreta. Embora a psicoterapia seja componente importante, o tratamento integral da fibromialgia combina múltiplas abordagens, não sendo baseado exclusivamente nela."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q6"
  },
  {
    "enunciado": "Um estudante questiona por que analgésicos comuns e anti-inflamatórios trouxeram apenas alívio discreto e passageiro à dor de Renata. Essa resposta terapêutica limitada aos AINEs é esperada na fibromialgia porque",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a fibromialgia caracteriza-se predominantemente por alterações no processamento central da dor (sensibilização central), e não por processo inflamatório periférico primário, alvo terapêutico dos AINEs.",
        "correta": true,
        "justificativa": "A fisiopatologia da fibromialgia envolve primariamente alterações no processamento central da dor — sensibilização central, com amplificação da transmissão nociceptiva e disfunção das vias descendentes moduladoras —, e não um processo inflamatório periférico primário, o que explica a resposta terapêutica limitada aos AINEs, cujo principal mecanismo é a inibição da síntese periférica de prostaglandinas. Correta. Como a fibromialgia não tem como mecanismo central um processo inflamatório periférico, os AINEs, que atuam predominantemente nesse nível, apresentam eficácia limitada, exigindo abordagem farmacológica direcionada a mecanismos centrais."
      },
      {
        "letra": "B",
        "texto": "os AINEs são absolutamente contraindicados em qualquer condição de dor crônica, independentemente da etiologia.",
        "correta": false,
        "justificativa": "Incorreta. Os AINEs não são absolutamente contraindicados em dor crônica; sua limitação na fibromialgia é de eficácia, relacionada ao mecanismo fisiopatológico, não uma contraindicação geral."
      },
      {
        "letra": "C",
        "texto": "a fibromialgia decorre de processo inflamatório articular grave, que exigiria doses muito mais altas de AINEs do que as habitualmente utilizadas.",
        "correta": false,
        "justificativa": "Incorreta. Não há processo inflamatório articular objetivo na fibromialgia (achado central da situação-problema); aumentar a dose de AINEs não corrigiria o mecanismo fisiopatológico predominantemente central da condição."
      },
      {
        "letra": "D",
        "texto": "os AINEs atuam exclusivamente sobre dor neuropática, mecanismo que não está envolvido na fibromialgia.",
        "correta": false,
        "justificativa": "Incorreta. Os AINEs atuam sobre mecanismos nociceptivos periféricos inflamatórios, não sobre dor neuropática; a limitação de eficácia na fibromialgia relaciona-se à ausência de processo inflamatório periférico relevante, não a um mecanismo neuropático."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q7"
  },
  {
    "enunciado": "Diante da limitada resposta aos AINEs, uma classe medicamentosa frequentemente utilizada no tratamento farmacológico da fibromialgia é a dos antidepressivos, mesmo em pacientes sem diagnóstico de depressão. A justificativa farmacológica para esse uso, no contexto da dor crônica, é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "antidepressivos tricíclicos e inibidores duais da recaptação de serotonina e noradrenalina potencializam vias descendentes inibitórias da dor, reduzindo a transmissão nociceptiva central.",
        "correta": true,
        "justificativa": "Antidepressivos tricíclicos (como amitriptilina) e duais (como duloxetina) potencializam as vias descendentes inibitórias serotoninérgicas e noradrenérgicas que modulam a transmissão nociceptiva no corno posterior da medula, sendo eficazes na dor crônica com componente de sensibilização central, como a fibromialgia, independentemente da presença de depressão associada. Correta. A potencialização das vias descendentes inibitórias da dor, por ação serotoninérgica/noradrenérgica, fundamenta o uso de antidepressivos como analgésicos adjuvantes na fibromialgia."
      },
      {
        "letra": "B",
        "texto": "todos os antidepressivos atuam exclusivamente sobre receptores opioides periféricos, sendo equivalentes farmacologicamente à morfina.",
        "correta": false,
        "justificativa": "Incorreta. Antidepressivos não atuam sobre receptores opioides; seu mecanismo analgésico envolve neurotransmissão monoaminérgica central, distinto do mecanismo dos opioides."
      },
      {
        "letra": "C",
        "texto": "os antidepressivos eliminam completamente a necessidade de qualquer abordagem não farmacológica no tratamento da fibromialgia.",
        "correta": false,
        "justificativa": "Incorreta. Os antidepressivos são um componente do tratamento multimodal, não eliminando a necessidade de intervenções não farmacológicas (exercício, fisioterapia, terapia cognitivo-comportamental), que permanecem essenciais."
      },
      {
        "letra": "D",
        "texto": "os antidepressivos atuam apenas sobre o humor, sem qualquer efeito direto sobre vias de modulação da dor.",
        "correta": false,
        "justificativa": "Incorreta. Antidepressivos tricíclicos e duais possuem efeito analgésico direto sobre vias de modulação da dor, independente e distinto de seu efeito sobre o humor, o que justifica seu uso mesmo sem diagnóstico de depressão."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q8"
  },
  {
    "enunciado": "Sobre a classificação farmacológica dos anti-inflamatórios não esteroidais (AINEs), um estudante pergunta qual é a principal diferença entre AINEs não seletivos e inibidores seletivos da COX-2 em relação ao perfil de efeitos adversos. A resposta correta é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "AINEs não seletivos inibem COX-1 e COX-2, apresentando maior risco gastrointestinal; inibidores seletivos de COX-2 reduzem o risco gastrointestinal, mas apresentam maior risco cardiovascular relativo.",
        "correta": true,
        "justificativa": "AINEs não seletivos inibem tanto COX-1 quanto COX-2, com maior risco de lesão gastrointestinal por redução da citoproteção gástrica mediada por prostaglandinas dependentes de COX-1; os inibidores seletivos de COX-2 reduzem esse risco gastrointestinal, mas têm sido associados a maior risco cardiovascular relativo, por desequilíbrio entre tromboxano e prostaciclina. Correta. Essa é a diferença clássica de perfil de risco entre as duas categorias de AINEs, relevante na escolha terapêutica individualizada."
      },
      {
        "letra": "B",
        "texto": "inibidores seletivos de COX-2 não apresentam qualquer risco cardiovascular, sendo completamente isentos de efeitos adversos.",
        "correta": false,
        "justificativa": "Incorreta. Os inibidores seletivos de COX-2 apresentam risco cardiovascular aumentado documentado, não sendo isentos de efeitos adversos."
      },
      {
        "letra": "C",
        "texto": "AINEs não seletivos não possuem qualquer risco gastrointestinal, sendo mais seguros que os inibidores seletivos de COX-2 em todos os aspectos.",
        "correta": false,
        "justificativa": "Incorreta. AINEs não seletivos apresentam risco gastrointestinal reconhecidamente maior que os inibidores seletivos de COX-2, não menor."
      },
      {
        "letra": "D",
        "texto": "não há diferença relevante de perfil de efeitos adversos entre AINEs não seletivos e inibidores seletivos de COX-2.",
        "correta": false,
        "justificativa": "Incorreta. Há diferença relevante e bem documentada de perfil de efeitos adversos entre as duas categorias, fundamentando a escolha terapêutica conforme o perfil de risco de cada paciente."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q9"
  },
  {
    "enunciado": "Nos pontos-gatilho identificados na musculatura de Renata (síndrome miofascial associada), uma opção terapêutica local frequentemente utilizada é a infiltração com anestésico local. O mecanismo de ação farmacológico dos anestésicos locais, fundamentando esse uso, é o",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "bloqueio reversível dos canais de sódio voltagem-dependentes na membrana neuronal, impedindo a geração e propagação do potencial de ação.",
        "correta": true,
        "justificativa": "Os anestésicos locais atuam bloqueando de forma reversível os canais de sódio voltagem-dependentes na membrana das fibras nervosas, impedindo a geração e a propagação do potencial de ação e, consequentemente, a condução do estímulo doloroso na região infiltrada — mecanismo utilizado na infiltração de pontos-gatilho miofasciais. Correta. O bloqueio reversível de canais de sódio voltagem-dependentes é o mecanismo central de ação dos anestésicos locais, fundamentando seu uso na infiltração de pontos-gatilho."
      },
      {
        "letra": "B",
        "texto": "agonismo em receptores opioides periféricos, promovendo analgesia sistêmica prolongada.",
        "correta": false,
        "justificativa": "Incorreta. Os anestésicos locais não atuam sobre receptores opioides; seu efeito é local, por bloqueio de canais de sódio, não sistêmico via receptores opioides."
      },
      {
        "letra": "C",
        "texto": "inibição irreversível da enzima ciclo-oxigenase, com efeito anti-inflamatório sistêmico.",
        "correta": false,
        "justificativa": "Incorreta. Anestésicos locais não inibem ciclo-oxigenases; esse é o mecanismo dos AINEs, farmacologicamente distinto."
      },
      {
        "letra": "D",
        "texto": "estímulo direto da liberação de serotonina e noradrenalina nas vias descendentes moduladoras da dor.",
        "correta": false,
        "justificativa": "Incorreta. Esse é o mecanismo dos antidepressivos tricíclicos/duais utilizados como adjuvantes analgésicos, não dos anestésicos locais."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q10"
  },
  {
    "enunciado": "Considerando os fatores de piora relatados por Renata — intensificação da dor após período de tensão emocional relacionada a dificuldades financeiras — um estudante pergunta qual é a relação fisiopatológica entre estresse psicológico crônico e exacerbação dos sintomas na fibromialgia. A explicação mais adequada é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o estresse crônico não possui qualquer influência documentada sobre a percepção dolorosa em condições de sensibilização central.",
        "correta": false,
        "justificativa": "Incorreta. Há ampla evidência de que o estresse crônico influencia negativamente a percepção dolorosa em condições de sensibilização central, como a fibromialgia."
      },
      {
        "letra": "B",
        "texto": "o estresse psicológico crônico pode agravar a disfunção do eixo hipotálamo-hipófise-adrenal e a modulação descendente da dor, contribuindo para amplificação da sensibilização central característica da fibromialgia.",
        "correta": true,
        "justificativa": "Na fibromialgia, o estresse psicológico crônico relaciona-se a disfunção do eixo hipotálamo-hipófise-adrenal e prejuízo na modulação descendente inibitória da dor, contribuindo para a amplificação da sensibilização central e, consequentemente, para a exacerbação sintomática observada em períodos de tensão emocional, como relatado por Renata. Correta. A disfunção do eixo hipotálamo-hipófise-adrenal e da modulação descendente da dor sob estresse crônico contribui para a amplificação da sensibilização central, explicando a exacerbação sintomática relatada por Renata."
      },
      {
        "letra": "C",
        "texto": "o estresse converte definitivamente a fibromialgia em uma doença exclusivamente psiquiátrica, sem qualquer componente de processamento nociceptivo.",
        "correta": false,
        "justificativa": "Incorreta. A fibromialgia não é uma condição exclusivamente psiquiátrica; envolve processamento nociceptivo central alterado, com contribuição de fatores psicossociais, mas não se reduz a eles."
      },
      {
        "letra": "D",
        "texto": "apenas fatores genéticos determinam a intensidade da dor na fibromialgia, sem qualquer influência de fatores psicossociais.",
        "correta": false,
        "justificativa": "Incorreta. A fibromialgia tem etiologia multifatorial, envolvendo predisposição genética, fatores neurobiológicos e psicossociais combinados, não sendo determinada exclusivamente por fatores genéticos."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q11"
  },
  {
    "enunciado": "Um estudante questiona por que o sono fragmentado e não reparador de Renata é considerado clinicamente relevante na fibromialgia, e não apenas uma consequência secundária da dor. A relação fisiopatológica mais adequada entre distúrbio do sono e fibromialgia é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o sono não reparador é irrelevante para a fisiopatologia da fibromialgia, sendo apenas uma queixa isolada sem relação bidirecional com a dor.",
        "correta": false,
        "justificativa": "Incorreta. Há relação bidirecional bem documentada entre distúrbio do sono e dor na fibromialgia, não sendo uma queixa isolada e irrelevante."
      },
      {
        "letra": "B",
        "texto": "a privação do sono de ondas lentas (estágio profundo, não-REM) pode reduzir a liberação de substâncias moduladoras da dor e favorecer maior sensibilização central, estabelecendo relação bidirecional entre distúrbio do sono e dor crônica.",
        "correta": true,
        "justificativa": "Estudos mostram que a privação do sono de ondas lentas (estágio 3, não-REM) associa-se a menor liberação de substâncias moduladoras da dor (como hormônio do crescimento e possivelmente componentes do sistema opioide endógeno) e a maior sensibilização central, estabelecendo relação bidirecional entre distúrbio do sono e dor crônica na fibromialgia — a dor fragmenta o sono, e o sono de má qualidade amplifica a dor. Correta. A privação de sono de ondas lentas contribui para maior sensibilização central e amplificação da dor, estabelecendo um ciclo bidirecional entre sono não reparador e dor crônica, relevante no manejo terapêutico de Renata."
      },
      {
        "letra": "C",
        "texto": "o distúrbio do sono na fibromialgia decorre exclusivamente de apneia obstrutiva do sono não diagnosticada.",
        "correta": false,
        "justificativa": "Incorreta. O caso não menciona achados sugestivos de apneia obstrutiva do sono; o distúrbio do sono na fibromialgia relaciona-se primariamente à própria fisiopatologia da sensibilização central, não exclusivamente a uma comorbidade respiratória não descrita."
      },
      {
        "letra": "D",
        "texto": "o sono não reparador cura espontaneamente a sensibilização central independentemente de qualquer intervenção terapêutica.",
        "correta": false,
        "justificativa": "Incorreta. Não há remissão espontânea da sensibilização central pelo sono não reparador; ao contrário, a privação de sono de qualidade tende a perpetuar e agravar o quadro, exigindo intervenção terapêutica direcionada."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q12"
  },
  {
    "enunciado": "Considerando a abordagem integral e multidisciplinar adotada para Renata no âmbito do SUS, envolvendo fisioterapia, práticas integrativas e complementares e acompanhamento psicológico, a justificativa para a inclusão de práticas integrativas e complementares no manejo da dor crônica multifatorial é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "medio",
    "alternativas": [
      {
        "letra": "A",
        "texto": "substituem integralmente qualquer abordagem farmacológica ou fisioterapêutica, sendo suficientes isoladamente.",
        "correta": false,
        "justificativa": "Incorreta. As práticas integrativas atuam como complemento, não substituto, das demais abordagens terapêuticas (farmacológica, fisioterapêutica, psicológica) no manejo integral da fibromialgia."
      },
      {
        "letra": "B",
        "texto": "podem contribuir como estratégias complementares no manejo integral da dor crônica, favorecendo relaxamento, controle do estresse e melhora da qualidade de vida, quando associadas às demais intervenções.",
        "correta": true,
        "justificativa": "A Política Nacional de Práticas Integrativas e Complementares (PNPIC) do SUS reconhece diversas práticas (como acupuntura, entre outras) como estratégias complementares no manejo integral de condições crônicas, incluindo a dor crônica, contribuindo para relaxamento, controle do estresse e melhora da qualidade de vida quando associadas a outras intervenções, sem substituí-las. Correta. Essa é a justificativa adequada para a inclusão de práticas integrativas como parte da abordagem multidisciplinar complementar no manejo da dor crônica de Renata."
      },
      {
        "letra": "C",
        "texto": "não possuem qualquer indicação reconhecida pela Política Nacional de Práticas Integrativas e Complementares do SUS.",
        "correta": false,
        "justificativa": "Incorreta. A PNPIC é uma política oficial do SUS, que reconhece e disponibiliza diversas práticas integrativas e complementares na rede de atenção à saúde."
      },
      {
        "letra": "D",
        "texto": "são indicadas exclusivamente para dor aguda pós-cirúrgica, sem qualquer papel em dor crônica.",
        "correta": false,
        "justificativa": "Incorreta. As práticas integrativas e complementares têm papel reconhecido também no manejo de condições crônicas, incluindo dor crônica, não sendo restritas ao contexto agudo pós-cirúrgico."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q13"
  },
  {
    "enunciado": "Sobre a fisiopatologia central da fibromialgia, estudos de neuroimagem funcional têm demonstrado alterações no processamento da dor em pacientes afetados. O principal achado fisiopatológico central característico dessa condição, relacionado à amplificação da percepção dolorosa, é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "redução isolada e completa da atividade em todas as áreas corticais de processamento sensorial, sem qualquer hiperatividade documentada.",
        "correta": false,
        "justificativa": "Incorreta. Ao contrário de redução isolada, há hiperatividade documentada em áreas específicas de processamento da dor frente a estímulos habitualmente não dolorosos."
      },
      {
        "letra": "B",
        "texto": "amplificação do processamento nociceptivo central, com hiperatividade em áreas de processamento da dor (como ínsula e córtex cingulado anterior) frente a estímulos de intensidade normalmente não dolorosa ou levemente dolorosa, além de disfunção das vias descendentes inibitórias.",
        "correta": true,
        "justificativa": "Estudos de neuroimagem funcional em pacientes com fibromialgia demonstram amplificação do processamento nociceptivo central, com hiperatividade em áreas como ínsula e córtex cingulado anterior frente a estímulos de intensidade normalmente não dolorosa, associada a disfunção das vias descendentes inibitórias da dor — substrato fisiopatológico da sensibilização central característica da condição. Correta. A amplificação central do processamento nociceptivo, com hiperatividade em áreas como ínsula e cíngulo anterior e disfunção das vias descendentes inibitórias, é o principal substrato fisiopatológico demonstrado por estudos de neuroimagem funcional na fibromialgia."
      },
      {
        "letra": "C",
        "texto": "presença constante de lesão estrutural demonstrável por ressonância magnética convencional em todos os pacientes com fibromialgia.",
        "correta": false,
        "justificativa": "Incorreta. A fibromialgia não apresenta lesão estrutural demonstrável por ressonância magnética convencional; as alterações identificadas são predominantemente funcionais, exigindo técnicas de neuroimagem funcional específicas."
      },
      {
        "letra": "D",
        "texto": "ausência completa de qualquer alteração neurofisiológica documentável, sendo a fibromialgia uma condição puramente funcional sem substrato biológico.",
        "correta": false,
        "justificativa": "Incorreta. Há substrato neurofisiológico documentado por estudos de neuroimagem funcional e outras técnicas, refutando a ideia de ausência completa de base biológica."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q14"
  },
  {
    "enunciado": "Um estudante questiona por que antidepressivos tricíclicos, como a amitriptilina, são frequentemente prescritos em baixas doses (muito inferiores às doses antidepressivas) no tratamento da fibromialgia e de outras condições de dor crônica. A explicação farmacológica mais adequada para essa prática é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "em doses baixas, a amitriptilina exerce efeito analgésico predominante por modulação das vias descendentes da dor, com menor incidência dos efeitos adversos anticolinérgicos e sedativos observados em doses antidepressivas plenas.",
        "correta": true,
        "justificativa": "Em doses baixas, a amitriptilina exerce efeito analgésico relevante por meio da modulação das vias descendentes serotoninérgicas e noradrenérgicas da dor, com perfil de efeitos adversos (anticolinérgicos, sedativos) mais favorável do que em doses antidepressivas plenas, o que fundamenta seu uso frequente como adjuvante analgésico em dor crônica, incluindo fibromialgia. Correta. O efeito analgésico em baixas doses, com menor incidência de efeitos adversos anticolinérgicos e sedativos, fundamenta a prática de prescrever amitriptilina em doses inferiores às antidepressivas no manejo da dor crônica."
      },
      {
        "letra": "B",
        "texto": "doses baixas de amitriptilina não exercem qualquer efeito farmacológico mensurável, sendo prescritas apenas como efeito placebo.",
        "correta": false,
        "justificativa": "Incorreta. Há efeito farmacológico mensurável e bem documentado da amitriptilina em baixas doses sobre a modulação da dor, não se tratando de efeito placebo."
      },
      {
        "letra": "C",
        "texto": "doses baixas de amitriptilina atuam exclusivamente sobre receptores opioides, com potência equivalente à morfina em baixas concentrações.",
        "correta": false,
        "justificativa": "Incorreta. A amitriptilina não atua sobre receptores opioides; seu mecanismo analgésico envolve neurotransmissão monoaminérgica central (serotonina e noradrenalina), distinto do mecanismo opioide."
      },
      {
        "letra": "D",
        "texto": "a amitriptilina em baixas doses cura definitivamente a sensibilização central, eliminando a necessidade de manutenção terapêutica.",
        "correta": false,
        "justificativa": "Incorreta. Não há cura definitiva da sensibilização central com o uso de amitriptilina; trata-se de manejo sintomático contínuo, frequentemente necessitando manutenção terapêutica prolongada associada a outras intervenções."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q15"
  },
  {
    "enunciado": "Sobre os critérios diagnósticos atuais da fibromialgia, propostos pelo American College of Rheumatology, um estudante pergunta se a contagem clássica de 18 pontos dolorosos (tender points) ainda é considerada obrigatória para o diagnóstico. A resposta correta, refletindo a evolução dos critérios diagnósticos, é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a contagem de 18 tender points permanece como único critério diagnóstico válido, sendo obrigatória em toda avaliação, sem qualquer alternativa reconhecida.",
        "correta": false,
        "justificativa": "Incorreta. Os critérios diagnósticos evoluíram, incorporando outros parâmetros além da contagem isolada de tender points, que não é mais considerada obrigatória e exclusiva nos critérios mais recentes."
      },
      {
        "letra": "B",
        "texto": "critérios mais atuais incorporam índices de dor generalizada e escalas de gravidade de sintomas associados (fadiga, sono não reparador, sintomas cognitivos), reduzindo a dependência exclusiva da contagem de tender points.",
        "correta": true,
        "justificativa": "Os critérios diagnósticos mais atuais para fibromialgia incorporam o índice de dor generalizada (Widespread Pain Index) e uma escala de gravidade de sintomas associados (fadiga, sono não reparador, sintomas cognitivos), reduzindo a dependência exclusiva da contagem clássica dos 18 tender points utilizada em critérios mais antigos, embora o exame físico continue relevante na avaliação clínica. Correta. A incorporação de índices de dor generalizada e escalas de gravidade de sintomas associados reflete a evolução dos critérios diagnósticos atuais para fibromialgia."
      },
      {
        "letra": "C",
        "texto": "o diagnóstico de fibromialgia atualmente depende exclusivamente de exames de neuroimagem funcional, sem qualquer critério clínico.",
        "correta": false,
        "justificativa": "Incorreta. O diagnóstico de fibromialgia permanece eminentemente clínico, baseado em anamnese e critérios validados; exames de neuroimagem funcional são utilizados em pesquisa, não como critério diagnóstico de rotina."
      },
      {
        "letra": "D",
        "texto": "não existe, atualmente, nenhum critério diagnóstico reconhecido para fibromialgia, sendo diagnóstico de exclusão absoluta sem parâmetros definidos.",
        "correta": false,
        "justificativa": "Incorreta. Existem critérios diagnósticos clínicos reconhecidos e validados (como os do American College of Rheumatology), não sendo a fibromialgia um diagnóstico sem parâmetros definidos."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q16"
  },
  {
    "enunciado": "Um estudante questiona a relação entre síndrome miofascial não tratada adequadamente e o desenvolvimento subsequente de quadros de sensibilização central mais amplos, como a fibromialgia. A hipótese fisiopatológica que relaciona esses dois quadros é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a persistência de input nociceptivo periférico proveniente de pontos-gatilho miofasciais não tratados pode contribuir, ao longo do tempo, para sensibilização central progressiva, potencialmente favorecendo a evolução para quadros de dor crônica generalizada.",
        "correta": true,
        "justificativa": "A persistência de estímulos nociceptivos periféricos originados em pontos-gatilho miofasciais não adequadamente tratados pode, em teoria e em parte da literatura, contribuir para sensibilização central progressiva ao longo do tempo, sendo uma hipótese fisiopatológica discutida na relação entre dor miofascial persistente e quadros de dor crônica generalizada como a fibromialgia, embora não constitua evolução obrigatória ou universal. Correta. A hipótese de que a persistência de input nociceptivo periférico dos pontos-gatilho pode contribuir para sensibilização central progressiva é discutida na literatura como possível fator de risco para cronificação e generalização da dor."
      },
      {
        "letra": "B",
        "texto": "a síndrome miofascial e a fibromialgia são exatamente a mesma condição, apenas com nomenclaturas diferentes, sem qualquer distinção fisiopatológica.",
        "correta": false,
        "justificativa": "Incorreta. Síndrome miofascial e fibromialgia são condições distintas, com fisiopatologia, distribuição e abordagem terapêutica diferentes, ainda que possam coexistir ou se relacionar."
      },
      {
        "letra": "C",
        "texto": "não existe qualquer relação fisiopatológica plausível entre input nociceptivo periférico persistente e sensibilização central.",
        "correta": false,
        "justificativa": "Incorreta. Existe plausibilidade fisiopatológica bem descrita entre persistência de input nociceptivo periférico e sensibilização central, mecanismo inclusive discutido para outras condições de dor crônica."
      },
      {
        "letra": "D",
        "texto": "a síndrome miofascial sempre evolui obrigatoriamente para fibromialgia em todos os pacientes não tratados adequadamente.",
        "correta": false,
        "justificativa": "Incorreta. Não há evolução obrigatória e universal da síndrome miofascial para fibromialgia; trata-se de uma possível contribuição em subgrupo de pacientes, não uma regra aplicável a todos os casos não tratados."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q17"
  },
  {
    "enunciado": "Reconsiderando a rigidez matinal prolongada relatada por Renata, um estudante questiona como diferenciar, do ponto de vista fisiopatológico, a rigidez matinal da fibromialgia daquela observada em doenças inflamatórias articulares, como a artrite reumatoide. A distinção mais adequada é que",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "na fibromialgia, a rigidez matinal relaciona-se predominantemente a alterações do sono e sensibilização central, sem sinovite subjacente; na artrite reumatoide, decorre de processo inflamatório sinovial ativo, tipicamente associado a edema articular objetivo.",
        "correta": true,
        "justificativa": "Na fibromialgia, a rigidez matinal relaciona-se a sono não reparador e sensibilização central, sem sinovite subjacente e sem edema articular objetivo; na artrite reumatoide, a rigidez matinal prolongada (frequentemente superior a 30-60 minutos) decorre de processo inflamatório sinovial ativo, com edema articular e outros sinais inflamatórios objetivos associados — distinção clínica relevante no diagnóstico diferencial do caso de Renata. Correta. Essa distinção fisiopatológica — sensibilização central sem sinovite na fibromialgia versus inflamação sinovial ativa na artrite reumatoide — é central para o diagnóstico diferencial da rigidez matinal entre as duas condições."
      },
      {
        "letra": "B",
        "texto": "a rigidez matinal tem exatamente a mesma fisiopatologia em ambas as condições, sem qualquer distinção relevante.",
        "correta": false,
        "justificativa": "Incorreta. As fisiopatologias são distintas: uma envolve processamento central da dor sem inflamação articular; a outra, processo inflamatório sinovial objetivo."
      },
      {
        "letra": "C",
        "texto": "na artrite reumatoide, a rigidez matinal nunca dura mais que cinco minutos, ao contrário da fibromialgia.",
        "correta": false,
        "justificativa": "Incorreta. Na artrite reumatoide, a rigidez matinal é tipicamente prolongada (frequentemente superior a 30 minutos), e não breve; rigidez de curta duração é mais sugestiva de processos degenerativos, não inflamatórios."
      },
      {
        "letra": "D",
        "texto": "a rigidez matinal na fibromialgia decorre exclusivamente de contratura muscular fixa e irreversível.",
        "correta": false,
        "justificativa": "Incorreta. Não há contratura muscular fixa e irreversível na fibromialgia; a rigidez é funcional, relacionada a sensibilização central e distúrbio do sono, sem alteração estrutural permanente."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q18"
  },
  {
    "enunciado": "Do ponto de vista da saúde coletiva e da organização do cuidado no SUS, o caso de Renata ilustra desafios comuns no manejo de condições crônicas de dor difusa na atenção primária. Um dos principais desafios sistêmicos discutidos na literatura, refletido na trajetória diagnóstica de Renata, é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o excesso de recursos diagnósticos disponíveis na atenção primária, levando a diagnóstico precoce e eficiente em praticamente todos os casos de dor crônica difusa.",
        "correta": false,
        "justificativa": "Incorreta. Ao contrário de excesso de recursos e diagnóstico precoce, o caso ilustra justamente a dificuldade e o atraso diagnóstico enfrentados por Renata."
      },
      {
        "letra": "B",
        "texto": "a dificuldade de reconhecimento e legitimação clínica de condições sem achados objetivos em exames de rotina, associada a fragmentação do cuidado entre diferentes especialidades sem abordagem integrada.",
        "correta": true,
        "justificativa": "Um desafio sistêmico relevante no manejo de condições como a fibromialgia na atenção primária é a dificuldade de reconhecimento clínico de quadros sem achados objetivos, associada à fragmentação do cuidado entre diferentes especialidades sem integração adequada, o que pode postergar o diagnóstico e prolongar o sofrimento do paciente, como evidenciado na trajetória de Renata antes do manejo multidisciplinar adequado. Correta. A dificuldade de legitimação clínica de condições sem achados objetivos, associada à fragmentação do cuidado, é um desafio sistêmico relevante refletido na trajetória de Renata antes de alcançar manejo multidisciplinar adequado."
      },
      {
        "letra": "C",
        "texto": "a ausência completa de qualquer diretriz clínica nacional para o manejo de dor crônica no âmbito do SUS.",
        "correta": false,
        "justificativa": "Incorreta. Existem diretrizes e protocolos clínicos voltados ao manejo da dor crônica no contexto do SUS e da atenção primária, ainda que sua implementação e o acesso variem conforme a região e o serviço."
      },
      {
        "letra": "D",
        "texto": "a impossibilidade estrutural de oferecer qualquer abordagem multiprofissional para dor crônica na rede pública de saúde.",
        "correta": false,
        "justificativa": "Incorreta. Embora existam desafios de acesso, a rede pública de saúde pode e deve oferecer abordagem multiprofissional para dor crônica, como demonstrado pelo próprio desfecho do caso de Renata, encaminhada a fisioterapia, práticas integrativas e acompanhamento psicológico."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q19"
  },
  {
    "enunciado": "Integrando os conceitos discutidos na situação-problema de Renata — dor musculoesquelética crônica difusa, sensibilização central, distúrbio do sono, fatores psicossociais associados e resposta limitada a analgésicos convencionais —, a conduta terapêutica mais completa e alinhada à melhor evidência atual para o manejo da fibromialgia é",
    "texto_base": null,
    "fase_alvo": 5,
    "uc_slug": "med_unidavi_f05_uc01_dor",
    "sp_referencia": null,
    "tema": null,
    "dificuldade_editorial": "dificil",
    "alternativas": [
      {
        "letra": "A",
        "texto": "monoterapia isolada com AINE em dose máxima, sem qualquer reavaliação da resposta terapêutica ao longo do tempo.",
        "correta": false,
        "justificativa": "Incorreta. A monoterapia isolada com AINE, sem reavaliação, não é eficaz nem alinhada à fisiopatologia predominantemente central da fibromialgia, sendo insuficiente como conduta isolada."
      },
      {
        "letra": "B",
        "texto": "abordagem multimodal combinando educação sobre a natureza da condição, farmacoterapia direcionada a mecanismos centrais (como antidepressivos duais ou tricíclicos em baixas doses), exercício físico orientado e progressivo, intervenções psicológicas (como terapia cognitivo-comportamental) e, quando disponíveis, práticas integrativas complementares.",
        "correta": true,
        "justificativa": "A melhor evidência atual para o manejo da fibromialgia recomenda abordagem multimodal: educação do paciente sobre a natureza da condição (validando a legitimidade da dor, como necessário no caso de Renata), farmacoterapia direcionada a mecanismos centrais de sensibilização (antidepressivos duais/tricíclicos, eventualmente outros adjuvantes), exercício físico orientado e progressivo, intervenções psicológicas como terapia cognitivo-comportamental, e práticas integrativas complementares quando disponíveis — coerente com a conduta adotada para Renata e com toda a discussão da situação-problema. Correta. Essa conduta integra corretamente todos os pilares terapêuticos recomendados atualmente para a fibromialgia, refletindo a abordagem multidisciplinar que trouxe melhora progressiva a Renata."
      },
      {
        "letra": "C",
        "texto": "encaminhamento exclusivo a reumatologista para tratamento imunobiológico, sem qualquer intervenção na atenção primária.",
        "correta": false,
        "justificativa": "Incorreta. A fibromialgia não é tratada com imunobiológicos (indicados em doenças inflamatórias articulares autoimunes, não na fibromialgia), e a atenção primária tem papel central no manejo e acompanhamento longitudinal dessa condição."
      },
      {
        "letra": "D",
        "texto": "orientação de repouso absoluto e afastamento total de qualquer atividade física ou laboral por tempo indeterminado.",
        "correta": false,
        "justificativa": "Incorreta. O repouso absoluto e o afastamento total de atividade física são contraindicados na fibromialgia; o exercício físico orientado e progressivo é, ao contrário, pilar terapêutico reconhecido."
      }
    ],
    "_proveniencia": "upload:UC1_SP3_Dor_ENAMED — Q20"
  }
]

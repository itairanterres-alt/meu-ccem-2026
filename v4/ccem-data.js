/* ============================================================
   Meu CCEM 2026 — DADOS
   Programa oficial do 12º Congresso Catarinense de
   Endocrinologia e Metabologia · 23–24 out 2026 · Joinville/SC
   ============================================================ */

const C = {
  azul:     '#1d3e8a',
  azulEsc:  '#0a1232',
  azulSoft: '#2d54c0',
  azulBg:   '#dde8f8',
  ouro:     '#c18c3e',
  ouroBg:   '#f4e4bd',
  ouroTxt:  '#7d5714',   // dourado para texto e ícones: contraste ≥ 4,5:1 sobre ouroBg e branco
  ouroClaro:'#f5c842',   // dourado para texto sobre o azul (contraste 6,3:1)
  tinta:    '#1a2438',
  cinza:    '#5b6577',
  cinzaClr: '#e7eef9',
  papel:    '#f3f6fc',
  linha:    '#d5dff0',
  linhaSoft:'#e2eaf8',
  verde:    '#2d6457',
  verdeBg:  '#dce6e2',
};

const TEMAS_COR = {
  'DM2':        '#1d6fa8',
  'DM1':        '#1d8ba8',
  'Tireoide':   '#6d28d9',
  'Hipófise':   '#0e7490',
  'Adrenal':    '#b45309',
  'Gônadas':    '#be185d',
  'Ósseo':      '#64748b',
  'Pediatria':  '#0284c7',
  'Obesidade':  '#c2410c',
  'IA':         '#7c3aed',
  'Ética':      '#334155',
  'Suplementos':'#92400e',
  'Glicemia':   '#15803d',
  'Tecnologia': '#6d28d9',
};

const DIAS = ['sex · 23/10', 'sab · 24/10'];

/* ============================================================
   FUSO DO CONGRESSO
   ------------------------------------------------------------
   Tudo que depende de hora é ancorado em America/Sao_Paulo, não
   no fuso do aparelho. Quem abrir o app com o celular em outro
   fuso continua vendo a sessão certa como "agora".

   O Brasil aboliu o horário de verão em 2019, então Joinville
   fica em UTC−3 o ano todo. Em outubro de 2026 o deslocamento é
   fixo, e o -03:00 explícito dá instantes exatos sem depender de
   base de fusos do navegador.
   ============================================================ */
// Última conferência da grade com o site oficial (www.ccem2026.com.br).
// Atualizar a cada nova conferência: o app mostra esta data no Programa.
const CCEM_PROGRAMA_CONFERIDO = '21/10/2026';

const CCEM_UTC_OFFSET = '-03:00';

/* Instante absoluto de um horário do programa. */
function ccemInstante(diaRotulo, hhmm) {
  const dia = diaRotulo === DIAS[1] ? '24' : '23';
  return new Date(`2026-10-${dia}T${hhmm}:00${CCEM_UTC_OFFSET}`);
}

const CCEM_INICIO = ccemInstante(DIAS[0], '08:00');
const CCEM_FIM    = ccemInstante(DIAS[1], '17:35');

/* Em qual dia do congresso cai este instante, ou null fora deles. */
function ccemDiaDoEvento(agora) {
  agora = agora || ccemAgora();
  for (const rot of DIAS) {
    if (agora >= ccemInstante(rot, '00:00') && agora < ccemInstante(rot, '23:59')) return rot;
  }
  return null;
}

/* Mantido pelo nome antigo: usado pela tela do Programa. */
function ccemDiaDeHoje() { return ccemDiaDoEvento(); }

/* Relógio do app. Tudo que depende de hora passa por aqui.
   Em teste, aceita ?agora=2026-10-23T16:20 na URL para simular o
   congresso em curso. Sem fuso explícito, o valor é lido como hora
   de Joinville — é o que quem testa espera ao escrever isso. */
function ccemAgora() {
  try {
    const p = new URLSearchParams(window.location.search).get('agora');
    if (p) {
      const comFuso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(p) ? p : p + CCEM_UTC_OFFSET;
      const d = new Date(comFuso);
      if (!isNaN(d.getTime())) return d;
    }
  } catch (e) {}
  return new Date();
}

/* A sessão está acontecendo neste instante?
   Falso em qualquer data que não seja 23 ou 24/10/2026. */
function ccemSessaoNoAr(s, agora) {
  if (!s || !s.inicio || !s.fim || !s.dia) return false;
  agora = agora || ccemAgora();
  return agora >= ccemInstante(s.dia, s.inicio) && agora < ccemInstante(s.dia, s.fim);
}

const go = h => { window.location.hash = h; };

/* IDs navegáveis — ordem canônica para prev/next */
/* SESSOES_NAV é derivado de PROGRAMA, logo abaixo — ordem cronológica,
   sem lista manual que precise ser mantida em paralelo. */

const SESSOES = {
  'abertura-sex': {
    id:'abertura-sex', dia:DIAS[0], inicio:'08:00', fim:'08:15', dur:'15 min',
    tipo:'cerimonia', badge:'Cerimônia', titulo:'Cerimônia de Abertura',
    temas:[], navegavel:false,
  },
  'mini-glicemia': {
    id:'mini-glicemia', dia:DIAS[0], inicio:'08:15', fim:'08:45', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência',
    titulo:'Novas tecnologias de monitorização glicêmica: semelhantes ou diferentes na prática?',
    moderador:'Dr. Fulvio Clemo Santos Tomaselli',
    temas:['DM2','Glicemia','Tecnologia'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Talita Letícia Trevisan' }],
  },
  'simp1-dm2': {
    id:'simp1-dm2', dia:DIAS[0], inicio:'08:45', fim:'10:00', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 1',
    titulo:'Tratamento do diabetes tipo 2 em 3 atos: clássicos, contemporâneos e promessas',
    moderador:'Dr. Paulo de Tarso Freitas',
    temas:['DM2'], navegavel:true,
    falas:[
      { n:1, titulo:'Clássicos', palestrante:'Dr. Luíz Antônio de Araújo' },
      { n:2, titulo:'Contemporâneos', palestrante:'Dra. Adriana Striebel' },
      { n:3, titulo:'Promessas', palestrante:'Dra. Luciana Muniz Pechmann' },
    ],
  },
  'sat-sex-1': {
    id:'sat-sex-1', dia:DIAS[0], inicio:'10:20', fim:'10:50', dur:'30 min',
    tipo:'satelite', badge:'Satélite · AstraZeneca', titulo:'Diagnóstico e Manejo da Hipofosfatasia',
    temas:['Ósseo'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dr. Mario Sérgio Zen' }],
  },
  'sat-sex-2': {
    id:'sat-sex-2', dia:DIAS[0], inicio:'10:50', fim:'11:20', dur:'30 min',
    tipo:'satelite', badge:'Satélite · AstraZeneca',
    titulo:'Tratamento otimizado da DRC e manejo da Hiperpotassemia',
    temas:[], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Viviane Calice' }],
  },
  'simp2-dm1': {
    id:'simp2-dm1', dia:DIAS[0], inicio:'11:20', fim:'12:30', dur:'1h 10',
    tipo:'simposio', badge:'Simpósio 2', titulo:'Diabetes Mellitus tipo 1',
    moderador:'Dra. Eliza Mayumi Matsuo Sugawara',
    temas:['DM1'], navegavel:true,
    falas:[
      { n:1, titulo:'Prevenção e cura do DM1 — Já é uma realidade?', palestrante:'Dr. Mauro Scharf Pinto' },
      { n:2, titulo:'Colônia de férias: experiência em SC', palestrante:'Dra. Julia Carpanezzi La Pastina' },
      { n:3, titulo:'Incretinas no DM1', palestrante:'Dr. Mauro Scharf Pinto' },
    ],
  },
  'sat-sex-3': {
    id:'sat-sex-3', dia:DIAS[0], inicio:'12:30', fim:'13:10', dur:'40 min',
    tipo:'satelite', badge:'Satélite · Marjan Farma', titulo:'Neuropatias Periféricas',
    temas:['DM2'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Adriana Striebel' }],
  },
  'simp3-cdt': {
    id:'simp3-cdt', dia:DIAS[0], inicio:'13:20', fim:'14:35', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 3',
    titulo:'Tireoide — Carcinoma Diferenciado de Tireoide (CDT) — Guideline ATA 2025',
    moderador:'Dra. Maria Heloísa Busi da Silva Canalli',
    temas:['Tireoide'], navegavel:true,
    falas:[
      { n:1, titulo:'Estratificação de risco de recorrência: o que mudou?', palestrante:'Dra. Marta Amaro da Silveira Duval' },
      { n:2, titulo:'Quais os novos parâmetros da tireoglobulina no seguimento?', palestrante:'Dra. Lireda Meneses Silva' },
      { n:3, titulo:'Metástase linfonodal no seguimento: como abordar?', palestrante:'Dr. Cleo Otaviano Mesa Júnior' },
    ],
  },
  'sat-sex-4': {
    id:'sat-sex-4', dia:DIAS[0], inicio:'14:35', fim:'15:20', dur:'45 min',
    tipo:'satelite', badge:'Satélite · EMS', titulo:'A Harmonia das Combinações no tratamento da obesidade ao diabetes',
    temas:['Obesidade','DM2'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Cristina da Silva Schreiber de Oliveira' }],
  },
  'mini-cdt-resposta': {
    id:'mini-cdt-resposta', dia:DIAS[0], inicio:'15:20', fim:'15:50', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência',
    titulo:'Como manejar os pacientes que não apresentam uma resposta excelente ao tratamento do Carcinoma Diferenciado de Tireoide',
    moderador:'Dra. Goretti Silveira Rodrigues',
    temas:['Tireoide'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dr. Cleo Otaviano Mesa Júnior' }],
  },
  'simp4-adrenal': {
    id:'simp4-adrenal', dia:DIAS[0], inicio:'16:10', fim:'17:00', dur:'50 min',
    tipo:'simposio', badge:'Simpósio 4', titulo:'Adrenal — casos clínicos',
    moderador:'Dra. Ana Cristina Tavares Probst',
    temas:['Adrenal'], navegavel:true,
    falas:[
      { n:1, titulo:'Caso clínico de Cushing subclínico', palestrante:'Dra. Amanda Meneses Ferreira Lacombe' },
      { n:2, titulo:'Caso clínico de hiperaldosteronismo', palestrante:'Dr. Guilherme Asmar Alencar' },
    ],
  },
  'simp5-modismos': {
    id:'simp5-modismos', dia:DIAS[0], inicio:'17:00', fim:'18:10', dur:'1h 10',
    tipo:'simposio', badge:'Simpósio 5', titulo:'Entre evidências e modismos',
    moderador:'Dr. Frederico Guimarães Marchisotti',
    temas:['Suplementos','Ética'], navegavel:true,
    falas:[
      { n:1, titulo:'Suplementos para aumento de performance: mitos e verdades', palestrante:'Dr. Fulvio Clemo Santos Tomaselli' },
      { n:2, titulo:'Emagrecer a qualquer custo: o debate ético dos manipulados', palestrante:'Dr. Neuton Dornelas Gomes' },
      { n:3, titulo:'Centenas de exames e zero hipótese', palestrante:'Dr. Itairan da Silva Terres' },
    ],
  },

  /* ── Sábado 24/10 ── */
  'simp6-gonadas': {
    id:'simp6-gonadas', dia:DIAS[1], inicio:'08:00', fim:'09:15', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 6', titulo:'Gônadas',
    moderador:'Dra. Demelise Demczuk',
    temas:['Gônadas'], navegavel:true,
    falas:[
      { n:1, titulo:'Nova diretriz de hipogonadismo', palestrante:'Dra. Ruth Clapauch' },
      { n:2, titulo:'Abordagem da perimenopausa', palestrante:'Dra. Ruth Clapauch' },
      { n:3, titulo:'UpDate Síndrome Ovariana Metabólica Poliendócrina (SOMP)', palestrante:'Dra. Carina Gabriela Corrêa Morellato' },
    ],
  },
  'mini-transgenero': {
    id:'mini-transgenero', dia:DIAS[1], inicio:'09:15', fim:'09:45', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência', titulo:'Terapia hormonal na transição de gênero',
    moderador:'Dra. Tanise Balvedi Damas',
    temas:['Gônadas'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Elaine Maria Frade Costa' }],
  },
  'sat-sab-1': {
    id:'sat-sab-1', dia:DIAS[1], inicio:'10:05', fim:'10:50', dur:'45 min',
    tipo:'satelite', badge:'Satélite · Lilly',
    titulo:'GIP + GLP-1: Existe benefício no uso como primeira linha de tratamento?',
    temas:['DM2','Obesidade'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Luciana Muniz Pechmann' }],
  },
  'simp7-osseo': {
    id:'simp7-osseo', dia:DIAS[1], inicio:'10:50', fim:'11:40', dur:'50 min',
    tipo:'simposio', badge:'Simpósio 7', titulo:'Metabolismo Ósseo',
    moderador:'Dra. Sheila Montano Vega',
    temas:['Ósseo'], navegavel:true,
    falas:[
      { n:1, titulo:'Abordagem da hipocalcemia de difícil manejo', palestrante:'Dr. Dalisbor Marcelo Weber Silva' },
      { n:2, titulo:'Caso clínico de osteoporose', palestrante:'Dra. Fatima Sandmann Afonso' },
    ],
  },
  'simp8-hipofise': {
    id:'simp8-hipofise', dia:DIAS[1], inicio:'11:40', fim:'12:30', dur:'50 min',
    tipo:'simposio', badge:'Simpósio 8', titulo:'Hipófise',
    moderador:'Dra. Julia Goulart Appel',
    temas:['Hipófise'], navegavel:true,
    falas:[
      { n:1, titulo:'Desafios na hiperprolactinemia', palestrante:'Dra. Amely Pereira Silva Balthazar' },
      { n:2, titulo:'Caso clínico de Cushing', palestrante:'Dr. Tobias Skrebsky de Almeida' },
    ],
  },
  'simp9-pediatrica': {
    id:'simp9-pediatrica', dia:DIAS[1], inicio:'13:30', fim:'14:45', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 9', titulo:'Endocrinologia Pediátrica',
    moderador:'Dra. Zuleica Isabel Zarabia',
    temas:['Pediatria','Obesidade'], navegavel:true,
    falas:[
      { n:1, titulo:'O papel do inibidor da aromatase na baixa estatura', palestrante:'Dra. Marilza Leal Nascimento' },
      { n:2, titulo:'Obesidade na infância e adolescência: manejo terapêutico', palestrante:'Dra. Rose Marie Mueller Linhares' },
      { n:3, titulo:'Quando o normal vira doença?', palestrante:'Dra. Suely Keiko Kohara' },
    ],
  },
  'sat-sab-2': {
    id:'sat-sab-2', dia:DIAS[1], inicio:'14:45', fim:'15:30', dur:'45 min',
    tipo:'satelite', badge:'Satélite · Recordati Rare Diseases',
    titulo:'Atualizações no consenso de tratamento da Acromegalia e o papel da pasireotida',
    temas:['Hipófise'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dr. Tobias Skrebsky de Almeida' }],
  },
  'simp10-obesidade': {
    id:'simp10-obesidade', dia:DIAS[1], inicio:'15:50', fim:'17:05', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 10', titulo:'Obesidade',
    moderador:'Dr. Fabio Herget Pitanga',
    temas:['Obesidade'], navegavel:true,
    falas:[
      { n:1, titulo:'Menos gordura e menos músculo: abordagem', palestrante:'Dra. Fatima Sandmann Afonso' },
      { n:2, titulo:'Emagreceu: estratégias farmacológicas de manutenção de peso perdido', palestrante:'Dra. Cristina da Silva Schreiber de Oliveira' },
      { n:3, titulo:'Risco cardiovascular na obesidade: evidência baseada na nova diretriz brasileira', palestrante:'Dra. Luciana Muniz Pechmann' },
    ],
  },
  'mini-ia': {
    id:'mini-ia', dia:DIAS[1], inicio:'17:05', fim:'17:35', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência', titulo:'IA no consultório do endocrinologista',
    moderador:'Dr. Itairan da Silva Terres',
    temas:['IA','Tecnologia'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Milena Gurgel Teles Bezerra' }],
  },
};

const PROGRAMA = {
  [DIAS[0]]: [
    { tipo:'sessao', id:'abertura-sex' },
    { tipo:'sessao', id:'mini-glicemia' },
    { tipo:'sessao', id:'simp1-dm2' },
    { tipo:'intervalo', label:'intervalo', dur:'10:00 → 10:20 · 20 min' },
    { tipo:'sessao', id:'sat-sex-1' },
    { tipo:'sessao', id:'sat-sex-2' },
    { tipo:'sessao', id:'simp2-dm1' },
    { tipo:'sessao', id:'sat-sex-3' },
    { tipo:'intervalo', label:'intervalo', dur:'13:10 → 13:20 · 10 min' },
    { tipo:'sessao', id:'simp3-cdt' },
    { tipo:'sessao', id:'sat-sex-4' },
    { tipo:'sessao', id:'mini-cdt-resposta' },
    { tipo:'intervalo', label:'intervalo', dur:'15:50 → 16:10 · 20 min' },
    { tipo:'sessao', id:'simp4-adrenal' },
    { tipo:'sessao', id:'simp5-modismos' },
    { tipo:'intervalo', label:'encerramento dia 1', dur:'18:10' },
  ],
  [DIAS[1]]: [
    { tipo:'sessao', id:'simp6-gonadas' },
    { tipo:'sessao', id:'mini-transgenero' },
    { tipo:'intervalo', label:'intervalo', dur:'09:45 → 10:05 · 20 min' },
    { tipo:'sessao', id:'sat-sab-1' },
    { tipo:'sessao', id:'simp7-osseo' },
    { tipo:'sessao', id:'simp8-hipofise' },
    { tipo:'intervalo', label:'almoço · Restaurante Combray (térreo)', dur:'12:30 → 13:30 · 1h' },
    { tipo:'sessao', id:'simp9-pediatrica' },
    { tipo:'sessao', id:'sat-sab-2' },
    { tipo:'intervalo', label:'intervalo', dur:'15:30 → 15:50 · 20 min' },
    { tipo:'sessao', id:'simp10-obesidade' },
    { tipo:'sessao', id:'mini-ia' },
    { tipo:'intervalo', label:'entrega de prêmios e encerramento', dur:'17:35' },
  ],
};

/* Ordem de navegação entre sessões (setas da tela da sessão): todas as que
   abrem tela própria, na ordem do programa. */
const SESSOES_NAV = DIAS.flatMap(d => (PROGRAMA[d]||[]))
  .filter(it => it.tipo === 'sessao' && SESSOES[it.id] && SESSOES[it.id].navegavel)
  .map(it => it.id);

/* ============================================================
   SPEAKER BIOS — só a origem de cada palestrante (UF/cidade,
   como no site oficial). Sem minicurrículo: decisão da comissão.
   ============================================================ */
const SPEAKER_BIOS = {
  'Dr. Cleo Otaviano Mesa Júnior':{role:'Endocrinologista · Curitiba (PR)'},
  'Dr. Fulvio Clemo Santos Tomaselli':{role:'Presidente do CCEM 2026 · SBEM-SC'},
  'Dr. Frederico Guimarães Marchisotti':{role:'Presidente-Eleito SBEM-SC'},
  'Dr. Neuton Dornelas Gomes':{role:'Endocrinologista'},
  'Dr. Itairan da Silva Terres':{role:'Comissão Científica · Endocrinologista e bioeticista'},
  'Dra. Goretti Silveira Rodrigues':{role:'Endocrinologista'},
  'Dra. Julia Goulart Appel':{role:'Endocrinologista'},
  'Dra. Amely Pereira Silva Balthazar':{role:'Endocrinologista'},
  'Dra. Demelise Demczuk':{role:'Endocrinologista'},
  'Dra. Carina Gabriela Corrêa Morellato':{role:'Secretária Executiva SBEM-SC · Comissão Organizadora'},
  'Dra. Amanda Meneses Ferreira Lacombe':{role:'Endocrinologista'},
  'Dr. Guilherme Asmar Alencar':{role:'Endocrinologista'},
  'Dra. Suely Keiko Kohara':{role:'Comissão Científica · Endocrinologista pediátrica'},
  'Dr. Fabio Herget Pitanga':{role:'Tesoureiro SBEM-SC · Comissão Organizadora'},
  'Dra. Fatima Sandmann Afonso':{role:'Endocrinologista'},
  'Dra. Cristina da Silva Schreiber de Oliveira':{role:'Endocrinologista'},
  // Curadoria conferida no Currículo Lattes (ID 5342142388498500, atualizado
  // em 01/06/2026). O registro anterior dizia São Paulo: vínculo com o Fleury,
  // encerrado em abril de 2022. Os vínculos atuais são em Fortaleza.
  'Dra. Milena Gurgel Teles Bezerra':{role:'Endocrinologista · Fortaleza (CE)'},
  'Dra. Talita Letícia Trevisan':{role:'Endocrinologista · Itajaí'},
  'Dra. Lireda Meneses Silva':{role:'Endocrinologista'},
  'Dra. Marta Amaro da Silveira Duval':{role:'Endocrinologista'},
  'Dra. Marilza Leal Nascimento':{role:'Endocrinologista pediátrica'},
  'Dr. Dalisbor Marcelo Weber Silva':{role:'Santa Catarina (SC)'},
  'Dr. Luíz Antônio de Araújo':{role:'Santa Catarina (SC)'},
  'Dr. Mauro Scharf Pinto':{role:'Paraná (PR)'},
  'Dr. Paulo de Tarso Freitas':{role:'Endocrinologista · Florianópolis (SC)'},
  'Dra. Adriana Striebel':{role:'Santa Catarina (SC)'},
  'Dra. Eliza Mayumi Matsuo Sugawara':{role:'Santa Catarina (SC)'},
  'Dra. Julia Carpanezzi La Pastina':{role:'Santa Catarina (SC)'},
  'Dra. Sheila Montano Vega':{role:'Santa Catarina (SC)'},
  'Dra. Luciana Muniz Pechmann':{role:'Santa Catarina (SC)'},
  'Dra. Maria Heloísa Busi da Silva Canalli':{role:'Santa Catarina (SC)'},
  'Dra. Tanise Balvedi Damas':{role:'Santa Catarina (SC)'},
  'Dra. Zuleica Isabel Zarabia':{role:'Santa Catarina (SC)'},
  'Dra. Ruth Clapauch':{role:'Rio de Janeiro (RJ)'},
  'Dra. Elaine Maria Frade Costa':{role:'São Paulo (SP)'},
  'Dr. Tobias Skrebsky de Almeida':{role:'Rio Grande do Sul (RS)'},
  'Dr. Mario Sérgio Zen':{role:'Espírito Santo (ES)'},
  'Dra. Viviane Calice':{role:'Santa Catarina (SC)'},
  'Dra. Ana Cristina Tavares Probst':{role:'Santa Catarina (SC)'},
  'Dra. Rose Marie Mueller Linhares':{role:'Endocrinologista pediátrica'},
};

/* ============================================================
   ESTADO DO CONGRESSO NESTE INSTANTE
   ------------------------------------------------------------
   Fonte única para "Agora", "A seguir", contagem regressiva e a
   faixa ao vivo. Deriva tudo de SESSOES e PROGRAMA — não há cópia
   da grade em outro lugar.
   ============================================================ */
function ccemSessoesEmOrdem() {
  return DIAS.flatMap(d => (PROGRAMA[d]||[]))
    .filter(it => it.tipo === 'sessao' && SESSOES[it.id])
    .map(it => SESSOES[it.id]);
}

/* "Simpósio 4 · Adrenal" — rótulo curto para cards e faixa. */
function ccemTituloCurto(s) { return (s.titulo||'').split(/ — |: /)[0]; }
function ccemRotulo(s) {
  if (!s) return '';
  if (s.tipo === 'cerimonia') return s.titulo;
  if (s.aDefinir) return s.badge;
  return s.badge + ' · ' + ccemTituloCurto(s);
}

function ccemEstado(agora) {
  agora = agora || ccemAgora();
  if (agora >= CCEM_FIM) return { fase:'depois', agora:null, aSeguir:null, restanteMin:null };
  const lista = ccemSessoesEmOrdem();
  const ini = s => ccemInstante(s.dia, s.inicio);
  const fim = s => ccemInstante(s.dia, s.fim);
  const emCurso = lista.find(s => agora >= ini(s) && agora < fim(s)) || null;
  // A cerimônia de abertura não conta como "primeira sessão".
  const proxima = lista.find(s => ini(s) > agora && s.tipo !== 'cerimonia') || null;
  const restanteMin = emCurso ? Math.max(1, Math.ceil((fim(emCurso) - agora) / 60000)) : null;
  return { fase: agora < CCEM_INICIO ? 'antes' : 'durante', agora: emCurso, aSeguir: proxima, restanteMin };
}

/* Faixa ao vivo da casca do app. */
function ccemLiveStatus() {
  const agora = ccemAgora();
  const e = ccemEstado(agora);
  if (e.fase === 'depois') return { kind:'past', tag:'Encerrado', text:'12º CCEM · 23–24 out 2026', time:'' };
  if (e.agora) return { kind:'live', tag:'Agora', text:ccemRotulo(e.agora), time:'até ' + e.agora.fim };
  if (e.aSeguir) return {
    kind: e.fase === 'antes' ? 'upcoming' : 'soon',
    tag:  e.fase === 'antes' ? 'Próximo evento' : 'A seguir',
    text: ccemRotulo(e.aSeguir),
    time: (e.fase === 'antes' ? '23 out · ' : e.aSeguir.dia !== ccemDiaDoEvento(agora) ? 'amanhã · ' : '') + e.aSeguir.inicio,
  };
  return { kind:'past', tag:'Encerrado', text:'12º CCEM · 23–24 out 2026', time:'' };
}

/* ============================================================
   CALENDÁRIO (.ics)
   ------------------------------------------------------------
   RFC 5545. Horários com TZID=America/Sao_Paulo e o VTIMEZONE
   correspondente — sem ele, Outlook antigo ignora o fuso. Como o
   Brasil não tem mais horário de verão, o bloco tem um único
   período fixo em -03:00.
   ============================================================ */
const CCEM_LOCAL_ICS = 'Expoville · Rua XV de Novembro, 4315 · Joinville/SC';

function ccemIcsEscape(t) {
  return String(t).replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
}

/* Dobra linhas em 75 octetos (UTF-8), como exige a RFC. */
function ccemIcsDobra(linha) {
  const enc = new TextEncoder();
  if (enc.encode(linha).length <= 75) return linha;
  const partes = []; let atual = '';
  for (const ch of linha) {
    const limite = partes.length === 0 ? 75 : 74;   // continuação começa com espaço
    if (enc.encode(atual + ch).length > limite) { partes.push(atual); atual = ch; }
    else atual += ch;
  }
  partes.push(atual);
  return partes.map((p,i) => i === 0 ? p : ' ' + p).join('\r\n');
}

function ccemIcsDataLocal(diaRotulo, hhmm) {
  const dia = diaRotulo === DIAS[1] ? '24' : '23';
  return `202610${dia}T${hhmm.replace(':','')}00`;
}

function ccemIcsEvento(s, baseUrl) {
  const pessoas = [];
  if (s.moderador) pessoas.push((s.tipo === 'mini' ? 'Apresentação: ' : 'Moderação: ') + s.moderador);
  for (const f of (s.falas||[]))
    pessoas.push(f.titulo ? `${f.titulo} — ${f.palestrante}` : f.palestrante);
  const link = baseUrl + '#/sessao/' + s.id;
  const descricao = [ccemRotulo(s), ...pessoas, '', 'No app: ' + link].join('\n');
  const stamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  return [
    'BEGIN:VEVENT',
    `UID:${s.id}@ccem2026`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Sao_Paulo:${ccemIcsDataLocal(s.dia, s.inicio)}`,
    `DTEND;TZID=America/Sao_Paulo:${ccemIcsDataLocal(s.dia, s.fim)}`,
    `SUMMARY:${ccemIcsEscape('CCEM 2026 · ' + (s.aDefinir ? s.badge : s.badge + ' — ' + s.titulo))}`,
    `LOCATION:${ccemIcsEscape(CCEM_LOCAL_ICS)}`,
    `DESCRIPTION:${ccemIcsEscape(descricao)}`,
    `URL:${link}`,
    'END:VEVENT',
  ];
}

/* Gera o texto do .ics para uma ou várias sessões. */
function ccemIcs(sessoes, baseUrl) {
  const linhas = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SBEM-SC//Meu CCEM 2026//PT', 'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH', 'X-WR-CALNAME:CCEM 2026', 'X-WR-TIMEZONE:America/Sao_Paulo',
    'BEGIN:VTIMEZONE', 'TZID:America/Sao_Paulo',
    'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0300', 'TZOFFSETTO:-0300', 'TZNAME:-03', 'END:STANDARD',
    'END:VTIMEZONE',
    ...sessoes.flatMap(s => ccemIcsEvento(s, baseUrl)),
    'END:VCALENDAR',
  ];
  return linhas.map(ccemIcsDobra).join('\r\n') + '\r\n';
}

/* ── Trabalhos científicos (e-pôster) ────────────────────────
   Os trabalhos não vivem no app: o item em Info abre a página
   externa. Se o e-pôster não acontecer, LINK_EPOSTER = null e o
   item some sozinho. */
// Página oficial dos trabalhos aprovados (Promotes), confirmada em 05/10/2026.
const LINK_EPOSTER = 'https://www.ccem2026.com.br/submissao-trabalhos/aprovados.php';
const PDF_EPOSTER  = 'https://www.ccem2026.com.br/submissao-trabalhos/trabalhos/';

/* Aba Trabalhos: o que está publicado na página oficial (conferido em
   05/10/2026) e a publicação nos anais. Quando a Promotes divulgar o
   cronograma das apresentações, preencher CCEM_TRABALHOS.cronograma. */
const CCEM_TRABALHOS = {
  conferido: '22/10/2026',
  exibicao: 'Os e-pôsteres ficam em exibição em local exclusivo durante todo o evento.',
  apresentacao: 'Cada trabalho é apresentado em até 5 minutos por um autor inscrito no congresso, nos intervalos dos dias 23 e 24/10, em um dos 2 pontos de e-pôster, para um avaliador da Comissão.',
  // Cronograma das apresentações: cada trabalho tem um intervalo (dia + hora
  // de início do intervalo no Programa), o horário exato (5 min no máximo),
  // o ponto de e-pôster (1 ou 2) e o avaliador da Comissão. Fontes: página de
  // aprovados (22/10/2026) e escala de avaliação oral da Comissão.
  // O PDF de cada e-pôster fica no site oficial: PDF_EPOSTER + cod + '.pdf'.
  cronograma: [
    { cod:10, dia:DIAS[0], hora:'10:00', horario:'10:00', ponto:1, avaliador:'Dr. Dalisbor Marcelo Weber Silva', titulo:'ACONDROPLASIA: RELATO DE DOIS PACIENTES EM TRATAMENTO COM VOSORITIDA', autores:'ANA CAROLINA NUNES BUENO, WILLIAN EDUARDO DE SOUZA, LUÍSA AÍDA DIAS, MARIA EDUARDA STOFELLA' },
    { cod:8, dia:DIAS[0], hora:'10:00', horario:'10:00', ponto:2, avaliador:'Dr. Fabio Herget Pitanga', titulo:'TENDÊNCIA TEMPORAL DA OBESIDADE ENTRE ADULTOS ACOMPANHADOS PELO SISTEMA DE VIGILÂNCIA ALIMENTAR E NUTRICIONAL (SISVAN) NA REGIÃO SUL DO BRASIL, ENTRE 2015 E 2025', autores:'PAULA MULLER GOTTARDI, CAMYLLE HAWERROTH HENRIQUE' },
    { cod:52, dia:DIAS[0], hora:'10:00', horario:'10:05', ponto:1, avaliador:'Dr. Dalisbor Marcelo Weber Silva', titulo:'PERFIL CLÍNICO E CIRÚRGICO DE PACIENTES SUBMETIDOS À PARATIREOIDECTOMIA EM JOINVILLE: ESTUDO RETROSPECTIVO', autores:'LUCAS ZANINI BATISTA, CARLOS MIGUEL RUDOLPHO, ANDRÉ BOLIVAR SÃO CLEMENTE, VITOR MATHEU MOLON' },
    { cod:14, dia:DIAS[0], hora:'10:00', horario:'10:05', ponto:2, avaliador:'Dr. Fabio Herget Pitanga', titulo:'PERFIL CLÍNICO-METABÓLICO, HÁBITOS DE VIDA E AUTOEFICÁCIA EM INDIVÍDUOS COM OBESIDADE NA ATENÇÃO PRIMÁRIA À SAÚDE', autores:'RONALDO FERREIRA BEGA, KAYLA ILANA DE OLIVEIRA, GIZELI DA SILVA ROSA, BRUNO COLUSSI' },
    { cod:45, dia:DIAS[0], hora:'10:00', horario:'10:10', ponto:1, avaliador:'Dr. Dalisbor Marcelo Weber Silva', titulo:'CISTO DA BOLSA DE RATHKE ASSOCIADO A ABSCESSO HIPOFISÁRIO: RELATO DE CASO', autores:'RURIK CIUPKA, GABRIELA BAGGENSTOSS STRADIOTTO, LUIZA MALINOSKI ABDOM, REJANE BAGGENSTOSS' },
    { cod:24, dia:DIAS[0], hora:'10:00', horario:'10:10', ponto:2, avaliador:'Dr. Fabio Herget Pitanga', titulo:'ACOMPANHAMENTO PROSPECTIVO DE INTERVENÇÕES EDUCATIVAS E COMPORTAMENTAIS NO MANEJO DA OBESIDADE DA ATENÇÃO PRIMÁRIA À SAÚDE', autores:'KAYLA ILANA DE OLIVEIRA, RONALDO FERREIRA BEGA, ROSANE PAULA NIEROTKA, TANIA APARECIDA DE ARAUJO' },
    { cod:56, dia:DIAS[0], hora:'10:00', horario:'10:15', ponto:1, avaliador:'Dr. Dalisbor Marcelo Weber Silva', titulo:'SÍNDROME DE LI-FRAUMENI ASSOCIADA A CARCINOMA ADRENOCORTICAL BILATERAL METACRÔNICO: RELATO DE CASO', autores:'GABRIELA BAGGENSTOSS STRADIOTTO, RURIK CIUPKA, LEONARDO HENRIQUE VICENTE, REJANE BAGGENSTOSS' },
    { cod:26, dia:DIAS[0], hora:'10:00', horario:'10:15', ponto:2, avaliador:'Dr. Fabio Herget Pitanga', titulo:'USO DE ANTIOBESOGÊNICOS E AUTOMEDICAÇÃO NA ATENÇÃO PRIMÁRIA E SUA ASSOCIAÇÃO COM RISCO ANTROPOMÉTRICO E PERCEPÇÃO DE SAÚDE', autores:'RONALDO FERREIRA BEGA, BRUNO COLUSSI, KAYLA ILANA DE OLIVEIRA, TANIA APARECIDA DE ARAUJO' },
    { cod:5, dia:DIAS[0], hora:'13:10', horario:'13:10', ponto:1, avaliador:'Dr. Frederico Guimarães Marchisotti', titulo:'DIABETES INSIPIDUS COMO MANIFESTAÇÃO INICIAL DE PROVÁVEL HIPOFISITE LINFOCÍTICA: RELATO DE CASO', autores:'LUIZ FELIPE ZEQUINÃO, PEDRO LENZI DOS SANTOS, FERNANDA CRISTINA MIRANDA DE OLIVEIRA' },
    { cod:7, dia:DIAS[0], hora:'13:10', horario:'13:10', ponto:2, avaliador:'Dr. Paulo de Tarso Freitas', titulo:'ENTRE A PREVENÇÃO E A HOSPITALIZAÇÃO: UMA DÉCADA DE TENDÊNCIAS DA HEMOGLOBINA GLICADA E DO DIABETES MELLITUS EM SANTA CATARINA', autores:'GIOVANA AKEMI KIWARA, ANNA MICAELA KOROLOVA LOTO, SARAH KUCHINSKI, PEDRO HENRIQUE BORGES SCHMITT' },
    { cod:38, dia:DIAS[0], hora:'13:10', horario:'13:15', ponto:1, avaliador:'Dr. Frederico Guimarães Marchisotti', titulo:'ESTUDO DE VIDA REAL – NA PRÁTICA CLÍNICA A SEMAGLUTIDA ORAL É TÃO EFICAZ QUANTO A VERSÃO INJETÁVEL?', autores:'EDER RODRIGUES PEREIRA, SABRINA MORAES ROHREGGER, GIOVANNA BORTOLINI, DR DALISBOR MARCELO WEBER SILVA' },
    { cod:21, dia:DIAS[0], hora:'13:10', horario:'13:15', ponto:2, avaliador:'Dr. Paulo de Tarso Freitas', titulo:'DM1 AUTOIMUNE DE INÍCIO TARDIO INICIALMENTE CLASSIFICADO COMO DM2: RELATO DE CASO', autores:'GUSTAVO TADASHI FUJII, KAUAN NICARO FORNARI, YAGO SATO VICENTE, JULIA CARPANEZZI LA PASTINA' },
    { cod:44, dia:DIAS[0], hora:'13:10', horario:'13:20', ponto:1, avaliador:'Dr. Frederico Guimarães Marchisotti', titulo:'HIPOFISITE COM ESPESSAMENTO DA HASTE HIPOFISÁRIA E DIABETES INSIPIDUS CENTRAL: DISSOCIAÇÃO ENTRE RESOLUÇÃO RADIOLÓGICA E RECUPERAÇÃO FUNCIONAL', autores:'LETÍCIA CAMILE LOHN, EDUARDA MARIA MARTINS, ANA JULIA SOBERANSKI GORSKI, REJANE BAGGENSTOSS' },
    { cod:34, dia:DIAS[0], hora:'13:10', horario:'13:20', ponto:2, avaliador:'Dr. Paulo de Tarso Freitas', titulo:'PERFIL EPIDEMIOLÓGICO DAS DESCOMPENSAÇÕES AGUDAS DO DIABETES MELLITUS EM PACIENTES INTERNADOS EM UM HOSPITAL TERCIÁRIO EM JOINVILLE-SC.', autores:'IASMIM E SILVA LUIZ, MATHEUS SCHICK, MANUELA KLEIN, FERNANDO MERLOS' },
    { cod:35, dia:DIAS[0], hora:'13:10', horario:'13:25', ponto:1, avaliador:'Dr. Frederico Guimarães Marchisotti', titulo:'TENDÊNCIAS NACIONAIS NAS VENDAS DE ESTEROIDES ANABÓLICO-ANDROGÊNICOS NO BRASIL (2014-2021)', autores:'LUCAS BOELL DUARTE, ALEXANDRE HOHL, MARCELO FERNANDO RONSONI, SIMONE VAN DE SANDE-LEE' },
    { cod:62, dia:DIAS[0], hora:'13:10', horario:'13:25', ponto:2, avaliador:'Dr. Paulo de Tarso Freitas', titulo:'BIOPROSPECÇÃO E POTENCIAL HIPOGLICEMIANTE E ANTIOXIDANTE DE MYRCIA PUBIPETALA NA DIABETES TIPO II', autores:'IASMIM E SILVA LUIZ, GABRIELA BORGMANN PEDROSO, KATHERINE PLAUTZ, DANIELA DELWING-DE LIMA' },
    { cod:6, dia:DIAS[0], hora:'15:50', horario:'15:50', ponto:1, avaliador:'Dra. Maria Heloísa Busi da Silva Canalli', titulo:'TEMPESTADE OCULTA: EPIDEMIOLOGIA DA MORTALIDADE POR TIREOTOXICOSE NO BRASIL ENTRE 2019 E 2026', autores:'JULIA CRISTINA VIEIRA DA SILVA, KAMILLY HELENA SOARES, TABATA TALITA HOFFMANN' },
    { cod:18, dia:DIAS[0], hora:'15:50', horario:'15:50', ponto:2, avaliador:'Dra. Carina Gabriela Corrêa Morellato', titulo:'ATRASO DE CRESCIMENTO E PUBERDADE SECUNDÁRIO A CONTROLE GLICÊMICO INADEQUADO EM PACIENTE COM DIABETES MELLITUS TIPO 1: RELATO DE CASO', autores:'KAUAN NICARO FORNARI, YAGO SATO VICENTE , GUSTAVO TADASHI FUJII, JULIA CARPANEZZI LA PASTINA' },
    { cod:12, dia:DIAS[0], hora:'15:50', horario:'15:55', ponto:1, avaliador:'Dra. Maria Heloísa Busi da Silva Canalli', titulo:'DO PADRÃO DESTRUTIVO AO ESTIMULANTE: CONVERSÃO DE TIREOIDITE DE HASHIMOTO PARA ATIVIDADE DE TRAB POSITIVO — SÉRIE DE DOIS CASOS', autores:'KAUÊ SANTIAGO MILITÃO, MARIA EDUARDA DA ROCHA PEREIRA , JULIA VIEIRA OBERGER MARQUES' },
    { cod:20, dia:DIAS[0], hora:'15:50', horario:'15:55', ponto:2, avaliador:'Dra. Carina Gabriela Corrêa Morellato', titulo:'PUBERDADE PRECOCE EM PACIENTE COM MÚLTIPLAS DOENÇAS AUTOIMUNES - RELATO DE CASO', autores:'YAGO SATO VICENTE, ARTUR ROPELATTO MACHADO, KAUAN NICARO FORNARI, JULIA CARPANEZZI LA PASTINA' },
    { cod:25, dia:DIAS[0], hora:'15:50', horario:'16:00', ponto:1, avaliador:'Dra. Maria Heloísa Busi da Silva Canalli', titulo:'LESÃO HEPÁTICA PROGRESSIVA ASSOCIADA À TIREOTOXICOSE NA DOENÇA DE GRAVES EM PACIENTE PEDIÁTRICA: UM RELATO DE CASO', autores:'MARIA LAURA SANTIN KLEIN, CAMILLE MANFRINI POSSAMAI, CLÉO OTAVIANO MESA JÚNIOR, CLAUDIA ALEXANDRA PONTES IVANTES' },
    { cod:37, dia:DIAS[0], hora:'15:50', horario:'16:00', ponto:2, avaliador:'Dra. Carina Gabriela Corrêa Morellato', titulo:'ESTATURA FINAL E PUBERDADE ESPONTÂNEA EM PACIENTE COM SÍNDROME DE TURNER 45,X/47,XXX: RELATO DE CASO', autores:'ARTUR ROPELATTO MACHADO, GUSTAVO TADASHI FUJII, YAGO SATO VICENTE, JULIA CARPANEZZI LA PASTINA' },
    { cod:41, dia:DIAS[0], hora:'15:50', horario:'16:05', ponto:1, avaliador:'Dra. Maria Heloísa Busi da Silva Canalli', titulo:'TENDÊNCIAS NO TRATAMENTO CIRÚRGICO DAS AFECÇÕES TIREOIDIANAS NA REGIÃO SUL DO BRASIL: ENTRE A TIREOIDECTOMIA CONSERVADORA E A CIRURGIA ONCOLÓGICA, 2020–2025', autores:'EDOARDA CAROLINA BERTHOLDI, HÁVILLA MÍSIA BARBOSA DA COSTA, ANNA MICAELA KOROLOVA LOTO, JÚLIA BARBIERI ORTIZ, MARIA EDUARDA DE SOUZA' },
    { cod:27, dia:DIAS[0], hora:'15:50', horario:'16:05', ponto:2, avaliador:'Dra. Carina Gabriela Corrêa Morellato', titulo:'EVOLUÇÃO TEMPORAL DO EXCESSO DE PESO EM ADOLESCENTES DE SANTA CATARINA: ESTABILIDADE DO SOBREPESO E AVANÇO DA OBESIDADE GRAVE', autores:'MARIA LAURA SANTIN KLEIN, MARIA EDUARDA HAMMERSCHMIDT INÁCIO, CAMILLE MANFRINI POSSAMAI, ANNA MEI RAMOS ARIMA' },
    { cod:43, dia:DIAS[1], hora:'09:45', horario:'09:45', ponto:1, avaliador:'Dra. Suely Keiko Kohara', titulo:'EVOLUÇÃO DAS TIREOIDECTOMIAS EM SANTA CATARINA ENTRE 2010 E 2025: TENDÊNCIAS TEMPORAIS E DISTRIBUIÇÃO TERRITORIAL', autores:'HELOÍSA NAEMI ROCESSKI, JÚLIA LUZA BORGES, LARISSA THIEME BAGGENSTOSS, PEDRO HENRIQUE BORGES SCHMITT' },
    { cod:57, dia:DIAS[1], hora:'09:45', horario:'09:45', ponto:2, avaliador:'Dr. Itairan da Silva Terres', titulo:'TENDÊNCIA TEMPORAL DAS CIRURGIAS BARIÁTRICAS REALIZADAS PELO SUS EM SANTA CATARINA NA ERA DOS AGONISTAS DO RECEPTOR DE GLP-1 NOS ANOS DE 2014-2025.', autores:'MARIA EDUARDA DE SOUZA , LARISSA TRINDADE MAGNAGO, YASMIN FERNANDA FRARE VARTHA, REBECA SOARES ALMEIDA, EDOARDA CAROLINA BERTHOLDI' },
    { cod:46, dia:DIAS[1], hora:'09:45', horario:'09:50', ponto:1, avaliador:'Dra. Suely Keiko Kohara', titulo:'QUANDO O DIAGNÓSTICO AVANÇA, O CUIDADO ACOMPANHA? HIPERPLASIA ADRENAL CONGÊNITA NO SUS DA REGIÃO SUL, 2020–2025', autores:'EDOARDA CAROLINA BERTHOLDI, CLARISSA REGINA SCHMITZ, LEONARDO GARBIN RANGEL DE CASTILHOS, MARIA EDUARDA DE SOUZA' },
    { cod:55, dia:DIAS[1], hora:'09:45', horario:'09:50', ponto:2, avaliador:'Dr. Itairan da Silva Terres', titulo:'MUDANÇAS NO PERFIL EPIDEMIOLÓGICO DO DIABETES MELLITUS EM SANTA CATARINA: TENDÊNCIAS DAS INTERNAÇÕES E DA MORTALIDADE (2015–2025)', autores:'JÚLIA LUZA BORGES, HELOISA NAEMI ROCESSKI, VINÍCIUS MACHADO DE FREITAS , SUELY KEIKO KOHARA' },
    { cod:39, dia:DIAS[1], hora:'09:45', horario:'09:55', ponto:1, avaliador:'Dra. Suely Keiko Kohara', titulo:'O PESO DA COMPLICAÇÃO: IMPACTO HOSPITALAR E ECONÔMICO DO PÉ DIABÉTICO NO BRASIL, ESTUDO RETROSPECTIVO OBSERVACIONAL DE 2015 A 2025.', autores:'MARIA EDUARDA DE SOUZA , EDOARDA CAROLINA BERTHOLDI, CLARISSA REGINA SCHMITZ, LEONARDO GARBIN RANGEL DE CASTILHOS' },
    { cod:59, dia:DIAS[1], hora:'09:45', horario:'09:55', ponto:2, avaliador:'Dr. Itairan da Silva Terres', titulo:'PERFIL DAS INTERNAÇÕES HOSPITALARES POR DIABETES MELLITUS EM CRIANÇAS E ADOLESCENTES NA REGIÃO SUL DO BRASIL E EM SANTA CATARINA, ENTRE 2015 E 2024', autores:'LUIZA MALINOSKI ABDOM, EDUARDA MARIA MARTINS, LETÍCIA CAMILE LOHN, SUELY KEIKO KOHARA' },
    { cod:31, dia:DIAS[1], hora:'09:45', horario:'10:00', ponto:1, avaliador:'Dra. Suely Keiko Kohara', titulo:'ALEITAMENTO MATERNO EXCLUSIVO E EXCESSO DE PESO NA PRIMEIRA INFÂNCIA: ANÁLISE DO ENANI-2019', autores:'KAROLINE VOLKMANN, ENZO MASSIMO GENAR FELICIANO, CAMILA BONATTI DA PINHO' },
    { cod:60, dia:DIAS[1], hora:'09:45', horario:'10:00', ponto:2, avaliador:'Dr. Itairan da Silva Terres', titulo:'HOSPITALIZAÇÕES POR TIREOTOXICOSE NO BRASIL: PERFIL EPIDEMIOLÓGICO, TENDÊNCIAS TEMPORAIS E DESFECHOS HOSPITALARES ENTRE 2015 E 2025', autores:'GUSTAVO DE SOUZA ZEFERINO, SAMANTHA ELLENN ROCHA, GIOVANA SERRATO SANTOS, RODRIGO KERBER' },
    { cod:32, dia:DIAS[1], hora:'09:45', horario:'10:05', ponto:1, avaliador:'Dra. Sheila Montano Vega', titulo:'OBESIDADE MATERNA PRÉ-GESTACIONAL E DESFECHOS PERINATAIS NO BRASIL: ANÁLISE DO ENANI-2019', autores:'KAROLINE VOLKMANN, CAMILA BONATTI DA PINHO, ENZO MASSIMO GENAR FELICIANO' },
    { cod:33, dia:DIAS[1], hora:'09:45', horario:'10:10', ponto:1, avaliador:'Dra. Sheila Montano Vega', titulo:'OBESIDADE INFANTIL EM SANTA CATARINA, 2015–2025: TENDÊNCIAS ANTES, DURANTE E NO PERÍODO POSTERIOR À PANDEMIA DE COVID-19', autores:'KAROLINE VOLKMANN, ENZO MASSIMO GENAR FELICINO' },
    { cod:58, dia:DIAS[1], hora:'09:45', horario:'10:15', ponto:1, avaliador:'Dra. Sheila Montano Vega', titulo:'DESIGUALDADES NA MORTALIDADE POR DIABETES MELLITUS SEGUNDO RAÇA/COR E FAIXA ETÁRIA NO BRASIL E EM SANTA CATARINA EM 2022: UM ESTUDO ECOLÓGICO', autores:'LUIZA MALINOSKI ABDOM, ANA JULIA SOBERANSKI GORSKI, GABRIELA BAGGENSTOSS STRADIOTTO, REJANE BAGGENSTOSS' },
  ],
  premiacao: 'A premiação dos trabalhos ocorre na cerimônia de encerramento, no sábado.',
  certificado: 'Recebem certificado apenas os trabalhos com ao menos um autor presente no congresso, devidamente exibidos e apresentados.',
  // Publicação nos anais: oculta até confirmação da Comissão. Texto pronto para ativar:
  // 'Os trabalhos serão publicados nos anais do congresso, na revista Arquivos Catarinenses
  //  de Medicina, da Associação Catarinense de Medicina (ACM).'
  publicacao: null,
  revista: 'https://revista.acm.org.br/arquivos/pt_BR',
  envio: { prazo: '16/10/2026 (sexta-feira)', email: 'contato@ccem2026.com.br' },
};

Object.assign(window, { C, TEMAS_COR, DIAS, ccemAgora, ccemInstante, ccemSessaoNoAr, ccemDiaDoEvento, CCEM_INICIO, CCEM_FIM, SESSOES, SESSOES_NAV, PROGRAMA, go, ccemDiaDeHoje, SPEAKER_BIOS, ccemSessoesEmOrdem, ccemRotulo, ccemEstado, ccemLiveStatus, ccemIcs, CCEM_LOCAL_ICS, LINK_EPOSTER, PDF_EPOSTER, CCEM_TRABALHOS, CCEM_PROGRAMA_CONFERIDO });

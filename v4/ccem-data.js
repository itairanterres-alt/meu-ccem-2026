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
const CCEM_PROGRAMA_CONFERIDO = '01/10/2026';

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
    moderador:'Dra. Flaviana Aparecida Dalla Vechia',
    temas:['DM1'], navegavel:true,
    falas:[
      { n:1, titulo:'Prevenção e cura do DM1 — Já é uma realidade?', palestrante:'Dr. Mauro Scharf Pinto' },
      { n:2, titulo:'Colônia de férias: experiência em SC', palestrante:'Dra. Julia Carpanezzi La Pastina' },
      { n:3, titulo:'Incretinas no DM1', palestrante:'Dr. Mauro Scharf Pinto' },
    ],
  },
  'sat-sex-3': {
    id:'sat-sex-3', dia:DIAS[0], inicio:'12:30', fim:'13:10', dur:'40 min',
    tipo:'satelite', badge:'Satélite · Marjan Farma', titulo:'Sessão patrocinada',
    temas:[], navegavel:true, aDefinir:true,
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
    tipo:'satelite', badge:'Satélite · EMS', titulo:'Sessão patrocinada',
    temas:[], navegavel:true, aDefinir:true,
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
      { n:3, titulo:'UpDate síndrome dos ovários policísticos', palestrante:'Dra. Carina Gabriela Corrêa Morellato' },
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
    moderador:'Dra. Júlia Vieira Oberger Marques',
    temas:['Ósseo'], navegavel:true,
    falas:[
      { n:1, titulo:'Abordagem da hipocalcemia de difícil manejo', palestrante:'Dr. Dalisbor Marcelo Weber Silva' },
      { n:2, titulo:'Caso clínico de osteoporose', palestrante:'Dra. Fátima Sandmann Afonso' },
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
      { n:1, titulo:'Menos gordura e menos músculo: abordagem', palestrante:'Dra. Fátima Sandmann Afonso' },
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
    { tipo:'intervalo', label:'almoço', dur:'12:30 → 13:30 · 1h' },
    { tipo:'sessao', id:'simp9-pediatrica' },
    { tipo:'sessao', id:'sat-sab-2' },
    { tipo:'intervalo', label:'intervalo', dur:'15:30 → 15:50 · 20 min' },
    { tipo:'sessao', id:'simp10-obesidade' },
    { tipo:'sessao', id:'mini-ia' },
    { tipo:'intervalo', label:'encerramento', dur:'17:35' },
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
  'Dra. Fátima Sandmann Afonso':{role:'Endocrinologista'},
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
  'Dra. Flaviana Aparecida Dalla Vechia':{role:'Santa Catarina (SC)'},
  'Dra. Julia Carpanezzi La Pastina':{role:'Santa Catarina (SC)'},
  'Dra. Júlia Vieira Oberger Marques':{role:'Santa Catarina (SC)'},
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
// TODO: confirmar URL dos e-pôsteres com a Promotes
const LINK_EPOSTER = null;   // oculto até a Promotes confirmar o endereço (ou retirar de vez)

Object.assign(window, { C, TEMAS_COR, DIAS, ccemAgora, ccemInstante, ccemSessaoNoAr, ccemDiaDoEvento, CCEM_INICIO, CCEM_FIM, SESSOES, SESSOES_NAV, PROGRAMA, go, ccemDiaDeHoje, SPEAKER_BIOS, ccemSessoesEmOrdem, ccemRotulo, ccemEstado, ccemLiveStatus, ccemIcs, CCEM_LOCAL_ICS, LINK_EPOSTER, CCEM_PROGRAMA_CONFERIDO });

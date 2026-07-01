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

function ccemDiaDeHoje() {
  const d = new Date();
  if (d.getFullYear()===2026 && d.getMonth()===9 && d.getDate()===23) return DIAS[0];
  if (d.getFullYear()===2026 && d.getMonth()===9 && d.getDate()===24) return DIAS[1];
  return null;
}

const go = h => { window.location.hash = h; };

/* IDs navegáveis — ordem canônica para prev/next */
const SESSOES_NAV = [
  'mini-glicemia','simp1-dm2','simp2-dm1',
  'simp3-cdt','mini-cdt-resposta','simp4-hipofise','simp5-modismos',
  'simp6-gonadas','mini-transgenero','simp7-osseo','simp8-adrenal',
  'simp9-pediatrica','simp10-obesidade','mini-ia',
];

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
    moderador:'Dr. Fulvio Thomazelli',
    temas:['DM2','Glicemia','Tecnologia'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Talita Letícia Trevisan' }],
  },
  'simp1-dm2': {
    id:'simp1-dm2', dia:DIAS[0], inicio:'08:45', fim:'10:00', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 1',
    titulo:'Tratamento do diabetes tipo 2 em 3 atos: clássicos, contemporâneos e promessas',
    moderador:'Dr. Paulo de Tarso Freitas',
    temas:['DM2'], navegavel:true, isNow:true,
    falas:[
      { n:1, titulo:'Clássicos', palestrante:'Dr. Luiz Antonio de Araújo' },
      { n:2, titulo:'Contemporâneos', palestrante:'Dra. Adriana Striebel' },
      { n:3, titulo:'Promessas', palestrante:'Dra. Luciana Muniz Pechmann' },
    ],
  },
  'sat-sex-1': {
    id:'sat-sex-1', dia:DIAS[0], inicio:'10:20', fim:'11:05', dur:'45 min',
    tipo:'satelite', badge:'Simpósio Satélite', titulo:'Sessão patrocinada',
    temas:[], navegavel:false, aDefinir:true,
  },
  'simp2-dm1': {
    id:'simp2-dm1', dia:DIAS[0], inicio:'11:05', fim:'12:20', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 2', titulo:'Diabetes Mellitus tipo 1',
    moderador:'Dra. Flaviana Dalla Vechia',
    temas:['DM1'], navegavel:true,
    falas:[
      { n:1, titulo:'Prevenção e cura do DM1 — Já é uma realidade?', palestrante:'Dr. Mauro Scharf Pinto' },
      { n:2, titulo:'Colônia de férias: experiência em SC', palestrante:'Dra. Julia Carpanezzi La Pastina' },
      { n:3, titulo:'Incretinas no DM1', palestrante:'Dr. Mauro Scharf Pinto' },
    ],
  },
  'simp3-cdt': {
    id:'simp3-cdt', dia:DIAS[0], inicio:'13:20', fim:'14:35', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 3',
    titulo:'Tireoide — Carcinoma Diferenciado de Tireoide (CDT) — Guideline ATA 2025',
    moderador:'Dra. Maria Heloísa da Silva Canalli',
    temas:['Tireoide'], navegavel:true,
    falas:[
      { n:1, titulo:'Estratificação de risco de recorrência: o que mudou?', palestrante:'Dra. Marta Amaro Duval' },
      { n:2, titulo:'Quais os novos parâmetros da tireoglobulina no seguimento?', palestrante:'Dra. Lireda Meneses Silva' },
      { n:3, titulo:'Metástase linfonodal no seguimento: como abordar?', palestrante:'Dr. Cleo Otaviano Mesa Jr.' },
    ],
  },
  'sat-sex-2': {
    id:'sat-sex-2', dia:DIAS[0], inicio:'14:35', fim:'15:20', dur:'45 min',
    tipo:'satelite', badge:'Simpósio Satélite', titulo:'Sessão patrocinada',
    temas:[], navegavel:false, aDefinir:true,
  },
  'mini-cdt-resposta': {
    id:'mini-cdt-resposta', dia:DIAS[0], inicio:'15:20', fim:'15:50', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência',
    titulo:'Como manejar os pacientes que não apresentam uma resposta excelente ao tratamento do Carcinoma Diferenciado de Tireoide',
    moderador:'Dra. Goretti Silveira Rodrigues',
    temas:['Tireoide'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dr. Cleo Otaviano Mesa Jr.' }],
  },
  'simp4-hipofise': {
    id:'simp4-hipofise', dia:DIAS[0], inicio:'16:10', fim:'17:00', dur:'50 min',
    tipo:'simposio', badge:'Simpósio 4', titulo:'Hipófise',
    moderador:'Dra. Julia Appel',
    temas:['Hipófise'], navegavel:true,
    falas:[
      { n:1, titulo:'Desafios na hiperprolactinemia', palestrante:'Dra. Amely Pereira Silva Balthazar' },
      { n:2, titulo:'Caso clínico Cushing', palestrante:'Dr. Fúlvio Thomaselli + Dra. Sheila Montano Vega' },
    ],
  },
  'simp5-modismos': {
    id:'simp5-modismos', dia:DIAS[0], inicio:'17:00', fim:'18:10', dur:'1h 10',
    tipo:'simposio', badge:'Simpósio 5', titulo:'Entre evidências e modismos',
    moderador:'Dr. Frederico Marchisotti',
    temas:['Suplementos','Ética'], navegavel:true, starred:true,
    falas:[
      { n:1, titulo:'Suplementos para performance: mitos e verdades', palestrante:'Dr. Fúlvio Tomaselli' },
      { n:2, titulo:'Emagrecer a qualquer custo: o debate ético dos manipulados', palestrante:'Dr. Neuton Dornelas Gomes' },
      { n:3, titulo:'Centenas de exames e zero hipótese', palestrante:'Dr. Itairan da Silva Terres', isMe:true },
    ],
  },

  /* ── Sábado 24/10 ── */
  'simp6-gonadas': {
    id:'simp6-gonadas', dia:DIAS[1], inicio:'08:00', fim:'09:15', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 6', titulo:'Gônadas',
    moderador:'Dra. Demelise Demczuk',
    temas:['Gônadas'], navegavel:true,
    falas:[
      { n:1, titulo:'Nova diretriz de hipogonadismo', palestrante:'Dr. Alexandre Hohl' },
      { n:2, titulo:'Abordagem da perimenopausa', palestrante:'Dr. Marcelo F. Ronsoni' },
      { n:3, titulo:'UpDate síndrome dos ovários policísticos', palestrante:'Dra. Carina Morellato' },
    ],
  },
  'mini-transgenero': {
    id:'mini-transgenero', dia:DIAS[1], inicio:'09:15', fim:'09:45', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência', titulo:'Terapia hormonal na transição de gênero',
    moderador:'Dra. Tanise Balvedi Damas',
    temas:['Gônadas'], navegavel:true,
    falas:[{ n:'·', palestrante:'Dra. Karen Faggioni de Marca Seidel' }],
  },
  'sat-sab-1': {
    id:'sat-sab-1', dia:DIAS[1], inicio:'10:05', fim:'10:50', dur:'45 min',
    tipo:'satelite', badge:'Simpósio Satélite', titulo:'Sessão patrocinada',
    temas:[], navegavel:false, aDefinir:true,
  },
  'simp7-osseo': {
    id:'simp7-osseo', dia:DIAS[1], inicio:'10:50', fim:'11:40', dur:'50 min',
    tipo:'simposio', badge:'Simpósio 7', titulo:'Metabolismo Ósseo',
    moderador:'Dra. Júlia Vieira Oberger Marques',
    temas:['Ósseo'], navegavel:true,
    falas:[
      { n:1, titulo:'Abordagem da hipocalcemia de difícil manejo', palestrante:'Dr. Dalisbor Marcelo Weber Silva' },
      { n:2, titulo:'Caso clínico de osteoporose', palestrante:'a confirmar', aConfirmar:true },
    ],
  },
  'simp8-adrenal': {
    id:'simp8-adrenal', dia:DIAS[1], inicio:'11:40', fim:'12:30', dur:'50 min',
    tipo:'simposio', badge:'Simpósio 8', titulo:'Adrenal — casos clínicos',
    temas:['Adrenal'], navegavel:true,
    falas:[
      { n:1, titulo:'Cushing subclínico', palestrante:'Dra. Amanda Meneses Ferreira Lacombe' },
      { n:2, titulo:'Hiperaldosteronismo', palestrante:'Dr. Guilherme Asmar Alencar' },
    ],
  },
  'simp9-pediatrica': {
    id:'simp9-pediatrica', dia:DIAS[1], inicio:'13:30', fim:'14:45', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 9', titulo:'Endocrinologia Pediátrica',
    moderador:'Dra. Zuleica Isabel Zarabia Morales',
    temas:['Pediatria','Obesidade'], navegavel:true,
    falas:[
      { n:1, titulo:'O papel do inibidor da aromatase na baixa estatura', palestrante:'Dra. Marilza Leal Nascimento' },
      { n:2, titulo:'Obesidade na infância e adolescência: manejo terapêutico', palestrante:'Dra. Rose Marie Mueller Linhares' },
      { n:3, titulo:'Quando o normal vira doença?', palestrante:'Dra. Suely Keiko Kohara' },
    ],
  },
  'sat-sab-2': {
    id:'sat-sab-2', dia:DIAS[1], inicio:'14:45', fim:'15:30', dur:'45 min',
    tipo:'satelite', badge:'Simpósio Satélite', titulo:'Sessão patrocinada',
    temas:[], navegavel:false, aDefinir:true,
  },
  'simp10-obesidade': {
    id:'simp10-obesidade', dia:DIAS[1], inicio:'15:50', fim:'17:05', dur:'1h 15',
    tipo:'simposio', badge:'Simpósio 10', titulo:'Obesidade',
    moderador:'Dr. Fabio Herget Pitanga',
    temas:['Obesidade'], navegavel:true,
    falas:[
      { n:1, titulo:'Menos gordura e menos músculo: abordagem', palestrante:'Dra. Fátima Sandmann Afonso' },
      { n:2, titulo:'Emagreceu: estratégias farmacológicas de manutenção de peso perdido', palestrante:'Dra. Cristina Schreiber de Oliveira' },
      { n:3, titulo:'Risco cardiovascular na obesidade: evidência baseada na nova diretriz brasileira', palestrante:'Dra. Simone van de Sande Lee' },
    ],
  },
  'mini-ia': {
    id:'mini-ia', dia:DIAS[1], inicio:'17:05', fim:'17:35', dur:'30 min',
    tipo:'mini', badge:'Mini-Conferência', titulo:'IA no consultório do endocrinologista',
    temas:['IA','Tecnologia'], navegavel:true, starred:true,
    falas:[{ n:'·', palestrante:'Dra. Milena Gurgel Teles Bezerra', label:'tema-chave' }],
  },
};

const PROGRAMA = {
  [DIAS[0]]: [
    { tipo:'sessao', id:'abertura-sex' },
    { tipo:'sessao', id:'mini-glicemia' },
    { tipo:'sessao', id:'simp1-dm2' },
    { tipo:'intervalo', label:'intervalo', dur:'10:00 → 10:20 · 20 min' },
    { tipo:'sessao', id:'sat-sex-1' },
    { tipo:'sessao', id:'simp2-dm1' },
    { tipo:'intervalo', label:'almoço', dur:'12:20 → 13:20 · 1h' },
    { tipo:'sessao', id:'simp3-cdt' },
    { tipo:'sessao', id:'sat-sex-2' },
    { tipo:'sessao', id:'mini-cdt-resposta' },
    { tipo:'intervalo', label:'intervalo', dur:'15:50 → 16:10 · 20 min' },
    { tipo:'sessao', id:'simp4-hipofise' },
    { tipo:'sessao', id:'simp5-modismos' },
    { tipo:'intervalo', label:'encerramento dia 1', dur:'18:10' },
  ],
  [DIAS[1]]: [
    { tipo:'sessao', id:'simp6-gonadas' },
    { tipo:'sessao', id:'mini-transgenero' },
    { tipo:'intervalo', label:'intervalo', dur:'09:45 → 10:05 · 20 min' },
    { tipo:'sessao', id:'sat-sab-1' },
    { tipo:'sessao', id:'simp7-osseo' },
    { tipo:'sessao', id:'simp8-adrenal' },
    { tipo:'intervalo', label:'almoço', dur:'12:30 → 13:30 · 1h' },
    { tipo:'sessao', id:'simp9-pediatrica' },
    { tipo:'sessao', id:'sat-sab-2' },
    { tipo:'intervalo', label:'intervalo', dur:'15:30 → 15:50 · 20 min' },
    { tipo:'sessao', id:'simp10-obesidade' },
    { tipo:'sessao', id:'mini-ia' },
    { tipo:'intervalo', label:'encerramento', dur:'17:35' },
  ],
};

/* ============================================================
   PALESTRANTES — estrutura pronta para quando a SBEM fornecer
   os dados. Preencher foto (URL) e disclosure por palestrante.
   Usado em SessaoDetail para exibir foto real e conflito de int.
   ============================================================ */
const PALESTRANTES = {
  'Talita Letícia Trevisan':          { foto: null, cidade: 'Itajaí · SC', disclosure: null },
  'Luiz Antonio de Araújo':           { foto: null, cidade: null,           disclosure: null },
  'Adriana Striebel':                 { foto: null, cidade: null,           disclosure: null },
  'Luciana Muniz Pechmann':           { foto: null, cidade: 'Curitiba · PR',disclosure: null },
  'Mauro Scharf Pinto':               { foto: null, cidade: null,           disclosure: null },
  'Julia Carpanezzi La Pastina':      { foto: null, cidade: null,           disclosure: null },
  'Marta Amaro Duval':                { foto: null, cidade: null,           disclosure: null },
  'Lireda Meneses Silva':             { foto: null, cidade: null,           disclosure: null },
  'Cleo Otaviano Mesa Jr.':           { foto: null, cidade: null,           disclosure: null },
  'Goretti Silveira Rodrigues':       { foto: null, cidade: 'Joinville · SC',disclosure: null },
  'Amely Pereira Silva Balthazar':    { foto: null, cidade: 'Florianópolis · SC', disclosure: null },
  'Fulvio Clemo Santos Tomaselli':    { foto: null, cidade: 'Blumenau · SC', disclosure: null },
  'Sheila Montano Vega':              { foto: null, cidade: 'Florianópolis · SC', disclosure: null },
  'Frederico Marchisotti':            { foto: null, cidade: null,           disclosure: null },
  'Neuton Dornelas Gomes':            { foto: null, cidade: null,           disclosure: null },
  'Itairan da Silva Terres':          { foto: null, cidade: null,           disclosure: null },
  'Alexandre Hohl':                   { foto: null, cidade: null,           disclosure: null },
  'Marcelo F. Ronsoni':               { foto: null, cidade: null,           disclosure: null },
  'Carina Morellato':                 { foto: null, cidade: null,           disclosure: null },
  'Karen Faggioni de Marca Seidel':   { foto: null, cidade: null,           disclosure: null },
  'Dalisbor Marcelo Weber Silva':     { foto: null, cidade: null,           disclosure: null },
  'Amanda Meneses Ferreira Lacombe':  { foto: null, cidade: 'Itajaí · SC',  disclosure: null },
  'Guilherme Asmar Alencar':          { foto: null, cidade: null,           disclosure: null },
  'Zuleica Isabel Zarabia Morales':   { foto: null, cidade: null,           disclosure: null },
  'Marilza Leal Nascimento':          { foto: null, cidade: null,           disclosure: null },
  'Rose Marie Mueller Linhares':      { foto: null, cidade: null,           disclosure: null },
  'Suely Keiko Kohara':               { foto: null, cidade: 'Joinville · SC',disclosure: null },
  'Fátima Sandmann Afonso':           { foto: null, cidade: null,           disclosure: null },
  'Cristina Schreiber de Oliveira':   { foto: null, cidade: null,           disclosure: null },
  'Simone van de Sande Lee':          { foto: null, cidade: null,           disclosure: null },
  'Milena Gurgel Teles Bezerra':      { foto: null, cidade: 'São Paulo · SP',disclosure: null },
  'Julia Goulart Appel':              { foto: null, cidade: 'Joinville · SC',disclosure: null },
  'Júlia Vieira Oberger Marques':     { foto: null, cidade: 'Itajaí · SC',  disclosure: null },
  'Flaviana Dalla Vechia':            { foto: null, cidade: null,           disclosure: null },
  'Maria Heloísa da Silva Canalli':   { foto: null, cidade: null,           disclosure: null },
  'Fabio Herget Pitanga':             { foto: null, cidade: null,           disclosure: null },
  'Tanise Balvedi Damas':             { foto: null, cidade: null,           disclosure: null },
};

/* ============================================================
   SPEAKER BIOS
   ============================================================ */
const SPEAKER_BIOS = {
  'Dr. Cleo Otaviano Mesa Jr.':{role:'Endocrinologista · Curitiba (PR)',bio:'Especialista em tireoide com atuação em centros de referência do Sul. Membro ativo da SBEM em CDT e seguimento de longo prazo.'},
  'Dr. Fúlvio Tomaselli':{role:'Presidente do CCEM 2026 · SBEM-SC',bio:'Endocrinologista, CRM/SC 7031. Presidente da SBEM-SC na gestão 2025/2026. Responsável técnico médico pelo congresso.'},
  'Fulvio Clemo Santos Tomaselli':{role:'Presidente do CCEM 2026 · SBEM-SC',bio:'Endocrinologista, CRM/SC 7031. Presidente da SBEM-SC na gestão 2025/2026.'},
  'Dra. Sheila Montano Vega':{role:'Diretora de Comunicação SBEM-SC · Comissão Organizadora',bio:'Endocrinologista. Comunicação institucional e organização do CCEM 2026.'},
  'Dr. Frederico Marchisotti':{role:'Presidente-Eleito SBEM-SC',bio:'Endocrinologista. Atua em obesidade, metabolismo e medicina baseada em evidências.'},
  'Dr. Neuton Dornelas Gomes':{role:'Endocrinologista',bio:'Atuação em bioética aplicada à prescrição de fórmulas manipuladas e estratégias de emagrecimento.'},
  'Dr. Itairan da Silva Terres':{role:'Comissão Científica · Endocrinologista e bioeticista',bio:'Professor de medicina na UNIDAVI. Membro da Comissão Científica do CCEM 2026. Sua fala discute o problema do excesso de exames sem hipótese clínica.',isMe:true},
  'Dra. Goretti Silveira Rodrigues':{role:'Endocrinologista',bio:'Atuação em tireoide e seguimento de pacientes com carcinoma diferenciado.'},
  'Dra. Julia Goulart Appel':{role:'Endocrinologista',bio:'Atuação em hipófise, hiperprolactinemia e síndrome de Cushing.'},
  'Dra. Amely Pereira Silva Balthazar':{role:'Endocrinologista',bio:'Atuação em hipófise e desafios diagnósticos da hiperprolactinemia.'},
  'Dra. Demelise Demczuk':{role:'Endocrinologista',bio:'Atuação em endocrinologia feminina, perimenopausa e SOP.'},
  'Dr. Alexandre Hohl':{role:'Endocrinologista · referência nacional',bio:'Autor de diretrizes da SBEM. Atuação em endocrinologia masculina e hipogonadismo.'},
  'Dr. Marcelo F. Ronsoni':{role:'Endocrinologista',bio:'Atuação em endocrinologia feminina e medicina baseada em evidências.'},
  'Dra. Carina Morellato':{role:'Secretária Executiva SBEM-SC · Comissão Organizadora',bio:'Endocrinologista. Atuação em SOP e endocrinologia ginecológica.'},
  'Dra. Karen Faggioni de Marca Seidel':{role:'Endocrinologista',bio:'Atuação em terapia hormonal e transição de gênero.'},
  'Dra. Amanda Meneses Ferreira Lacombe':{role:'Endocrinologista',bio:'Atuação em adrenal, com foco em Cushing subclínico e incidentaloma.'},
  'Dr. Guilherme Asmar Alencar':{role:'Endocrinologista',bio:'Atuação em adrenal e hiperaldosteronismo.'},
  'Dra. Suely Keiko Kohara':{role:'Comissão Científica · Endocrinologista pediátrica',bio:'Membro da Comissão Científica do CCEM 2026. Atuação em endocrinologia pediátrica.'},
  'Dr. Fabio Herget Pitanga':{role:'Tesoureiro SBEM-SC · Comissão Organizadora',bio:'Endocrinologista. Atuação em obesidade e síndrome metabólica.'},
  'Dra. Fátima Sandmann Afonso':{role:'Endocrinologista',bio:'Atuação em obesidade, sarcopenia e composição corporal.'},
  'Dra. Cristina Schreiber de Oliveira':{role:'Endocrinologista',bio:'Atuação em obesidade e manutenção do peso perdido.'},
  'Dra. Simone van de Sande Lee':{role:'Endocrinologista',bio:'Atuação em obesidade e risco cardiovascular.'},
  'Dra. Milena Gurgel Teles Bezerra':{role:'Convidada nacional · São Paulo',bio:'Referência em aplicação de inteligência artificial à prática endocrinológica. Tema-chave do encerramento do CCEM 2026.',isKey:true},
  'Dra. Talita Letícia Trevisan':{role:'Endocrinologista · Itajaí',bio:'Atuação em diabetes e tecnologias de monitorização glicêmica.'},
  'Dra. Lireda Meneses Silva':{role:'Endocrinologista',bio:'Atuação em tireoide e seguimento do CDT.'},
  'Dra. Marta Amaro Duval':{role:'Endocrinologista',bio:'Atuação em tireoide e carcinoma diferenciado.'},
  'Dra. Marilza Leal Nascimento':{role:'Endocrinologista pediátrica',bio:'Referência regional em baixa estatura e desenvolvimento puberal.'},
  'Dra. Rose Marie Mueller Linhares':{role:'Endocrinologista pediátrica',bio:'Atuação em obesidade infantil e doenças metabólicas pediátricas.'},
};

/* ============================================================
   SESSION META — briefings + quizzes por sessão
   ============================================================ */
const SESSION_META = {
  'mini-glicemia':{ briefing:['CGM em alça aberta vs sensores integrados a bomba: diferenças na prática.','Acurácia comparativa (MARD) e implicação na decisão clínica.','Para quem priorizar cada tecnologia: DM1, DM2 em insulina, gestacional.'] },
  'simp1-dm2':{ briefing:['Metformina e sulfonilureia: papel clássico ainda válido?','Inovações: iSGLT2, GLP-1 e duplos agonistas no centro do tratamento.','Promessas: triagonistas (retatrutida) e o que vem chegando.'],
    quiz:[{q:'Em DM2 + DCV estabelecida, qual classe tem maior evidência de redução de desfecho CV?',opts:['Sulfonilureia','iSGLT2 ou GLP-1RA','Insulina basal','Metformina isolada'],correct:1,why:'iSGLT2 e GLP-1RA têm ensaios com redução de MACE em DM2+DCV. Recomendados nas diretrizes SBD/ADA independente do A1c.'}] },
  'simp2-dm1':{ briefing:['Imunomodulação no DM1 recém-diagnosticado: teplizumab e janela terapêutica.','Colônia de férias do DM1 em SC: aprendizados práticos.','Incretinas no DM1: uso off-label, evidências e cautelas.'] },
  'simp3-cdt':{ briefing:['ATA 2025: nova estratificação de risco de recorrência do CDT.','Tireoglobulina no seguimento: novos pontos de corte.','Metástase linfonodal: vigilância ativa vs reabordagem cirúrgica.'] },
  'mini-cdt-resposta':{ briefing:['Resposta excelente, indeterminada, bioquímica incompleta e estrutural incompleta — definições atualizadas.','O paciente que "não responde excelentemente": estratégias de seguimento.','Quando reintervir, quando observar.'] },
  'simp4-hipofise':{ briefing:['Hiperprolactinemia: medicamentosa vs adenoma — quando investigar com RM.','Cushing: desafios diagnósticos atuais — caso clínico.','Cirurgia transesfenoidal e seguimento bioquímico.'] },
  'simp5-modismos':{ briefing:['Suplementos de performance: o que tem evidência, o que é marketing.','Manipulados para emagrecimento: limites éticos da prescrição.','Centenas de exames sem hipótese clínica — o problema dos pacientes "da bateria".'],
    quiz:[{q:'Qual afirmação sobre o uso de suplementos para performance em não-atletas é CORRETA?',opts:['Creatina tem evidência robusta em força e hipertrofia','Whey protein isolado superior a proteína convencional','BCAA previne perda muscular no envelhecimento','Vitamina D melhora performance em todos os casos'],correct:0,why:'Creatina monoidratada tem a evidência mais robusta para ganho de força e massa magra. Os outros têm evidência limitada ou conflitante em populações gerais.'}] },
  'simp6-gonadas':{ briefing:['Nova diretriz brasileira de hipogonadismo masculino: critérios atualizados.','Perimenopausa: terapia hormonal entre 45 e 55 anos.','SOP: atualização das diretrizes internacionais e fenótipos.'] },
  'mini-transgenero':{ briefing:['Cuidado integral na transição de gênero.','Hormônios cruzados: doses, monitoramento, efeitos adversos.','Aspectos éticos e legais no Brasil.'] },
  'simp7-osseo':{ briefing:['Hipocalcemia refratária: investigação além do hipoparatireoidismo.','Osteoporose grave — abordagem multidisciplinar e novos antirreabsortivos.'] },
  'simp8-adrenal':{ briefing:['Cushing subclínico: quando rastrear, quando operar.','Hiperaldosteronismo primário: diagnóstico bioquímico e cateterismo de adrenal.'] },
  'simp9-pediatrica':{ briefing:['Inibidor de aromatase em baixa estatura: para quem ainda faz sentido.','Obesidade infantil: manejo farmacológico e cirúrgico em adolescentes.','Quando uma variação fisiológica vira condição clínica?'] },
  'simp10-obesidade':{ briefing:['Perda de massa magra durante uso de GLP-1: como mitigar.','Manutenção pós-emagrecimento: papel da farmacoterapia continuada.','Diretriz brasileira de risco CV na obesidade — o que mudou.'] },
  'mini-ia':{ briefing:['IA generativa na consulta: usos práticos hoje (relatórios, anotações, comunicação).','Riscos: alucinação clínica, vieses, LGPD e privacidade.','Como integrar IA ao fluxo sem perder autonomia clínica.'],
    quiz:[{q:'Qual aplicação de IA generativa tem MAIOR evidência de utilidade clínica real hoje?',opts:['Diagnóstico por imagem supervisionado','Geração de resumos de prontuário','Triagem de risco cirúrgico','Prescrição automatizada'],correct:1,why:'Sumarização de texto clínico (notas, prontuários, relatórios) é onde LLMs mostram utilidade mais consistente e menos risco de erro crítico.'}],
    isKey:true },
};

/* ============================================================
   PROGRAM DAYS — para live strip
   ============================================================ */
const PROGRAM_DAYS_LS = [
  { date: new Date(2026,9,23), sessions:[
    {start:'08:00',end:'08:15',title:'Cerimônia de Abertura'},
    {start:'08:15',end:'08:45',title:'Mini · Monitorização glicêmica'},
    {start:'08:45',end:'10:00',title:'Simpósio 1 — DM2 em 3 atos'},
    {start:'10:20',end:'11:05',title:'Simpósio Satélite'},
    {start:'11:05',end:'12:20',title:'Simpósio 2 — DM1'},
    {start:'13:20',end:'14:35',title:'Simpósio 3 — CDT · ATA 2025'},
    {start:'14:35',end:'15:20',title:'Simpósio Satélite'},
    {start:'15:20',end:'15:50',title:'Mini · CDT sem resposta excelente'},
    {start:'16:10',end:'17:00',title:'Simpósio 4 — Hipófise'},
    {start:'17:00',end:'18:10',title:'Simpósio 5 — Entre evidências e modismos'},
  ]},
  { date: new Date(2026,9,24), sessions:[
    {start:'08:00',end:'09:15',title:'Simpósio 6 — Gônadas'},
    {start:'09:15',end:'09:45',title:'Mini · Terapia hormonal trans'},
    {start:'10:05',end:'10:50',title:'Simpósio Satélite'},
    {start:'10:50',end:'11:40',title:'Simpósio 7 — Metabolismo Ósseo'},
    {start:'11:40',end:'12:30',title:'Simpósio 8 — Adrenal'},
    {start:'13:30',end:'14:45',title:'Simpósio 9 — End. Pediátrica'},
    {start:'14:45',end:'15:30',title:'Simpósio Satélite'},
    {start:'15:50',end:'17:05',title:'Simpósio 10 — Obesidade'},
    {start:'17:05',end:'17:35',title:'Mini · IA no consultório ★'},
  ]},
];

function ccemLiveStatus() {
  const now = new Date();
  function parseHM(d,hm){const[h,m]=hm.split(':').map(Number);const o=new Date(d);o.setHours(h,m,0,0);return o;}
  function fmtHM(d){return d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');}
  for(const day of PROGRAM_DAYS_LS){
    if(day.date.toDateString()!==now.toDateString()) continue;
    for(const s of day.sessions){
      const st=parseHM(day.date,s.start),en=parseHM(day.date,s.end);
      if(now>=st&&now<en) return{kind:'live',tag:'Agora',text:s.title,time:fmtHM(now)};
      if(now<st) return{kind:'soon',tag:'Em breve',text:s.title,time:s.start};
    }
  }
  const first=PROGRAM_DAYS_LS[0];
  if(now<new Date(2026,9,23,8,0,0)){
    const next=PROGRAM_DAYS_LS[0].sessions[1];
    return{kind:'upcoming',tag:'Próximo evento',text:next.title,time:'23 out · '+next.start};
  }
  return{kind:'past',tag:'Encerrado',text:'12º CCEM · 23–24 out 2026',time:''};
}

/* helper: resolve dados do palestrante pelo nome exato ou aproximado */
function ccemPalestrante(nome) {
  if (!nome) return null;
  if (PALESTRANTES[nome]) return PALESTRANTES[nome];
  const nomeLower = nome.toLowerCase();
  const key = Object.keys(PALESTRANTES).find(k => nomeLower.includes(k.toLowerCase().split(' ')[1]||''));
  return key ? PALESTRANTES[key] : null;
}

Object.assign(window, { C, TEMAS_COR, DIAS, SESSOES, SESSOES_NAV, PROGRAMA, PALESTRANTES, ccemPalestrante, go, ccemDiaDeHoje, SESSION_META, SPEAKER_BIOS, PROGRAM_DAYS_LS, ccemLiveStatus });

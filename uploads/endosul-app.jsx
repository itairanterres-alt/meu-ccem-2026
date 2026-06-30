import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, Star, ChevronDown, ChevronUp, AlertTriangle, X, Calendar, BarChart3, Coffee, FileDown, MapPin, Clock, Bookmark, BookOpen, Scale, Sparkles, Check, Circle, CircleDashed, Eye, EyeOff } from 'lucide-react';

// ─── DATA ───────────────────────────────────────────────────────────────
// Day codes: 1=Qui 07/05, 2=Sex 08/05, 3=Sáb 09/05
// Rooms: P=Plenária Luiz Alberto, B=Balduíno Tschiede, X=Sala Xirú, C=Convivência

const S = (id, day, t1, t2, room, title, type, sp, mod, group, sponsor, tags) =>
  ({ id, day, t1, t2, room, title, type, sp, mod, group, sponsor, tags });

const SESSIONS = [
  // ── QUI 07/05 — PLENÁRIA (manhã) ─────────────────────────────────────
  S(1, 1, '08:30', '08:45', 'P', 'Anamnese na disfunção sexual masculina', 'mesa', ['Alexandre Hohl (SC)'], ['Lucas Bandeira Marchesan (RS)'], 'Vida sexual do homem', null, ['endo-masc']),
  S(2, 1, '08:45', '09:00', 'P', 'O papel do clomifeno no hipogonadismo masculino', 'mesa', ['Marcelo Ronsoni (SC)'], ['Lucas Bandeira Marchesan (RS)'], 'Vida sexual do homem', null, ['endo-masc']),
  S(3, 1, '09:00', '09:15', 'P', 'Cirurgia metabólica e bariátrica', 'mesa', ['André Vicente Bigolin (RS)'], ['Jacqueline Rizzolli (RS)'], 'Manejo da obesidade grave', null, ['obesidade']),
  S(4, 1, '09:15', '09:30', 'P', 'Tratamento clínico intensivo', 'mesa', ['Simone Van Der Sande Lee (SC)'], ['Jacqueline Rizzolli (RS)'], 'Manejo da obesidade grave', null, ['obesidade']),
  S(5, 1, '09:30', '09:45', 'P', 'Terapia combinada/sequencial', 'mesa', ['Milene Moehlecke (RS)'], ['Jacqueline Rizzolli (RS)'], 'Manejo da obesidade grave', null, ['obesidade']),
  S(6, 1, '09:45', '10:00', 'P', 'Discussão', 'mesa', [], ['Jacqueline Rizzolli (RS)'], 'Manejo da obesidade grave', null, ['obesidade']),
  S(7, 1, '10:00', '10:30', 'P', 'Bases biológicas da identidade de gênero', 'mini', ['Rafael Loch Batista (SP)'], ['Carolina Leães Rech (RS)'], null, null, ['bioetica', 'transgenero']),
  S(8, 1, '10:50', '11:05', 'P', 'No DM2', 'mesa', ['Cristiane Bauermann Leitão (RS)'], ['Maristela Beck (RS)', 'Iuri Martin Goemann (RS)'], 'Incretinomiméticos e iSGLT2', null, ['diabetes']),
  S(9, 1, '11:05', '11:20', 'P', 'No DM1', 'mesa', ['Ticiana da Costa Rodrigues'], ['Maristela Beck (RS)', 'Iuri Martin Goemann (RS)'], 'Incretinomiméticos e iSGLT2', null, ['diabetes']),
  S(10, 1, '11:20', '11:35', 'P', 'Acessibilidade aos medicamentos', 'mesa', ['Rafael Picon (RS)'], ['Maristela Beck (RS)', 'Iuri Martin Goemann (RS)'], 'Incretinomiméticos e iSGLT2', null, ['diabetes', 'gestao', 'bioetica']),
  S(11, 1, '11:35', '11:50', 'P', 'Discussão', 'mesa', [], ['Maristela Beck (RS)', 'Iuri Martin Goemann (RS)'], 'Incretinomiméticos e iSGLT2', null, ['diabetes']),
  S(12, 1, '12:00', '12:30', 'P', 'Precificação Estratégica de Protocolos de Tratamento', 'pocket', ['Victor Rehbein'], [], null, 'BMO Gestão', ['gestao']),
  S(13, 1, '13:00', '13:30', 'P', 'Lipodistrofias do Diagnóstico ao Tratamento', 'pocket', ['Fernando Gerchman (RS)', 'Alexandre Hohl (SC)'], [], null, 'Chiesi', ['lipo']),

  // ── QUI 07/05 — BALDUÍNO (manhã) ─────────────────────────────────────
  S(14, 1, '08:30', '08:45', 'B', 'Bomba de insulina', 'mesa', ['Luciana Schreiner (RS)'], ['Márcia Puñales (RS)', 'Balduino Tschiedel (RS)'], 'Perspectivas no Tratamento do DM', null, ['diabetes']),
  S(15, 1, '08:45', '09:00', 'B', 'Novas insulinas', 'mesa', ['Luis Henrique Canani (RS)'], ['Márcia Puñales (RS)', 'Balduino Tschiedel (RS)'], 'Perspectivas no Tratamento do DM', null, ['diabetes']),
  S(16, 1, '09:00', '09:15', 'B', 'Usando IA no manejo do Diabetes Mellitus', 'mesa', ['Gabriela Teló (RS)'], ['Márcia Puñales (RS)', 'Balduino Tschiedel (RS)'], 'Perspectivas no Tratamento do DM', null, ['diabetes', 'ia']),
  S(17, 1, '09:15', '09:30', 'B', 'Discussão', 'mesa', [], ['Márcia Puñales (RS)', 'Balduino Tschiedel (RS)'], 'Perspectivas no Tratamento do DM', null, ['diabetes']),
  S(18, 1, '09:30', '09:45', 'B', 'Simplificando diagnóstico para o Endocrinologista', 'mesa', ['Gabriela Perdomo Coral (RS)'], ['Thizá Londero Gai (RS)'], 'MASLD', null, ['masld']),
  S(19, 1, '09:45', '10:00', 'B', 'Avaliação por imagem da fibrose hepática', 'mesa', ['Tiago Severo Garcia (RS)'], ['Thizá Londero Gai (RS)'], 'MASLD', null, ['masld']),
  S(20, 1, '10:00', '10:15', 'B', 'Tratamento farmacológico', 'mesa', ['Vanessa Lopes Oliveira (RS)'], ['Thizá Londero Gai (RS)'], 'MASLD', null, ['masld']),
  S(21, 1, '10:15', '10:30', 'B', 'Discussão', 'mesa', [], ['Thizá Londero Gai (RS)'], 'MASLD', null, ['masld']),
  S(22, 1, '10:50', '11:05', 'B', 'Ambientes alimentares e obesidade: por que o contexto importa mais do que a vontade', 'forum', ['Natasha Fonseca (RS)'], ['Neuton Dornelas Gomes (DF)'], 'Medidas globais de combate à obesidade', null, ['obesidade', 'saude-publica', 'bioetica']),
  S(23, 1, '11:05', '11:20', 'B', 'Planejamento urbano e mobilidade sustentável', 'forum', ['Gabriella Natividade (RS)'], ['Neuton Dornelas Gomes (DF)'], 'Medidas globais de combate à obesidade', null, ['obesidade', 'saude-publica']),
  S(24, 1, '11:20', '11:35', 'B', 'Papel das mudanças climáticas na obesidade', 'forum', ['Janine Alessi (RS)'], ['Neuton Dornelas Gomes (DF)'], 'Medidas globais de combate à obesidade', null, ['obesidade', 'saude-publica']),
  S(25, 1, '11:35', '11:50', 'B', 'Discussão', 'forum', [], ['Neuton Dornelas Gomes (DF)'], 'Medidas globais de combate à obesidade', null, ['obesidade', 'saude-publica']),
  S(26, 1, '12:00', '13:00', 'B', 'Manejo integrado do metabolismo: glicemia, peso e função tireoidiana', 'simposio', ['Jacqueline Rizzolli (RS)'], [], null, 'Merck', ['diabetes', 'tireoide', 'obesidade']),
  S(27, 1, '13:00', '13:30', 'B', 'FAL baixa, consequências altas', 'pocket', ['Cristiane Kopacek (RS)'], [], null, 'AstraZeneca', ['pediatria', 'ossea']),

  // ── QUI 07/05 — PLENÁRIA (tarde) ─────────────────────────────────────
  S(28, 1, '13:45', '14:00', 'P', 'Doença Renal Crônica', 'mesa', ['Luis Henrique Canani (RS)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Desafios em Osteoporose', null, ['ossea']),
  S(29, 1, '14:00', '14:15', 'P', 'Uso de Medicamentos Osteotóxicos', 'mesa', ['Victoria Borba (PR)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Desafios em Osteoporose', null, ['ossea']),
  S(30, 1, '14:15', '14:30', 'P', 'Com fratura de fragilidade', 'mesa', ['Dalisbor Marcelo Weber Silva (SC)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Desafios em Osteoporose', null, ['ossea']),
  S(31, 1, '14:30', '14:45', 'P', 'Discussão', 'mesa', [], ['Giullia Menuci Chianca Landenberger (RS)'], 'Desafios em Osteoporose', null, ['ossea']),
  S(32, 1, '14:45', '15:15', 'P', 'Estratificação de risco cardiovascular na perimenopausa', 'mini', ['Debora Hoffmann Loro (RS)'], ['Giullia Menuci Chianca Landenberger (RS)'], null, null, ['mulher', 'cardio']),
  S(33, 1, '15:15', '15:30', 'P', 'Como integrar o novo escore da ATA e o ACR TI-RADS na avaliação ultrassonográfica', 'painel', ['Ana Luiza Maia (RS)'], ['Iracema Gonçalves (RS)', 'André Borsatto Zanella (RS)'], 'Novidades no manejo do nódulo de tireoide', null, ['tireoide']),
  S(34, 1, '15:30', '15:45', 'P', 'Testes moleculares após o diagnóstico do câncer de tireoide', 'painel', ['Fabíola Miasaki (PR)'], ['Iracema Gonçalves (RS)', 'André Borsatto Zanella (RS)'], 'Novidades no manejo do nódulo de tireoide', null, ['tireoide', 'oncologia']),
  S(35, 1, '15:45', '16:00', 'P', 'Discussão', 'painel', [], ['Iracema Gonçalves (RS)', 'André Borsatto Zanella (RS)'], 'Novidades no manejo do nódulo de tireoide', null, ['tireoide']),
  S(36, 1, '16:20', '16:35', 'P', 'Atualização da nova estratificação de risco do câncer diferenciado da tireoide', 'mesa', ['Maria Isabel C. Vieira Cordioli (SC)'], ['Iuri Martin Goemann (RS)', 'Cleo Otaviano Mesa Junior (PR)'], 'Câncer Diferenciado de Tireoide', null, ['tireoide', 'oncologia']),
  S(37, 1, '16:35', '16:50', 'P', 'Tireoidectomia total versus Lobectomia, novas indicações', 'mesa', ['Rafael Selbach Scheffel (RS)'], ['Iuri Martin Goemann (RS)', 'Cleo Otaviano Mesa Junior (PR)'], 'Câncer Diferenciado de Tireoide', null, ['tireoide', 'oncologia']),
  S(38, 1, '16:50', '17:05', 'P', 'Quando indicar iodo radioativo e qual atividade prescrever?', 'mesa', ['José Miguel Dora (RS)'], ['Iuri Martin Goemann (RS)', 'Cleo Otaviano Mesa Junior (PR)'], 'Câncer Diferenciado de Tireoide', null, ['tireoide', 'oncologia']),
  S(39, 1, '17:05', '17:20', 'P', 'Vigilância ativa em Câncer de Tireoide — Quando e como?', 'mesa', ['Leonardo Barbi Walter (RS)'], ['Iuri Martin Goemann (RS)', 'Cleo Otaviano Mesa Junior (PR)'], 'Câncer Diferenciado de Tireoide', null, ['tireoide', 'oncologia']),
  S(40, 1, '17:20', '17:45', 'P', 'Discussão', 'mesa', [], ['Iuri Martin Goemann (RS)', 'Cleo Otaviano Mesa Junior (PR)'], 'Câncer Diferenciado de Tireoide', null, ['tireoide']),
  S(41, 1, '17:45', '18:15', 'P', '5 coisas que aprendi com meu gato — estilo de vida e carreira baseados em evidências', 'mini', ['Mateus Dornelles Severo (RS)'], ['Carolina Leães Rech (RS)'], null, null, ['carreira']),
  S(42, 1, '18:15', '19:30', 'P', 'Cerimônia de abertura oficial + Homenageados Endosul', 'cerimonia', [], [], null, null, []),
  S(43, 1, '19:30', '23:00', 'P', 'Show + Coquetel', 'cerimonia', [], [], null, null, []),

  // ── QUI 07/05 — BALDUÍNO (tarde) ─────────────────────────────────────
  S(44, 1, '13:45', '14:00', 'B', 'O impacto do estresse crônico no eixo hormonal', 'ligas', ['Mauro Antonio Czepielewski (RS)'], ['Rafael Vaz Machry (RS)', 'Luiz Alberto Fontoura Pereira (RS)'], 'Endocrinologia em Contexto: Corpo, Mente e Conduta', null, ['neuroendocrino', 'saude-mental']),
  S(45, 1, '14:00', '14:15', 'B', 'Erros e condutas não recomendáveis nas avaliações hormonais', 'ligas', ['Jivago da Fonseca Lopes (RS)'], ['Rafael Vaz Machry (RS)', 'Luiz Alberto Fontoura Pereira (RS)'], 'Endocrinologia em Contexto: Corpo, Mente e Conduta', null, ['bioetica']),
  S(46, 1, '14:15', '14:30', 'B', 'Por que perseguir hormônios "perfeitos" pode adoecer?', 'ligas', ['Gabriela Teló (RS)'], ['Rafael Vaz Machry (RS)', 'Luiz Alberto Fontoura Pereira (RS)'], 'Endocrinologia em Contexto: Corpo, Mente e Conduta', null, ['bioetica', 'saude-mental']),
  S(47, 1, '14:45', '15:00', 'B', 'Prevenir é melhor que remediar: Doença óssea da prematuridade', 'mesa', ['Cristiane Kopacek (RS)'], ['Iuri Martin Goemann (RS)', 'Leila Pedroso de Paula (RS)'], 'Endocrinologia Pediátrica', null, ['pediatria', 'ossea']),
  S(48, 1, '15:00', '15:15', 'B', 'Será que é DM1? Os diferentes tipos de diabetes na infância', 'mesa', ['Ticiana da Costa Rodrigues (RS)'], ['Iuri Martin Goemann (RS)', 'Leila Pedroso de Paula (RS)'], 'Endocrinologia Pediátrica', null, ['pediatria', 'diabetes']),
  S(49, 1, '15:15', '15:30', 'B', 'Bloqueio puberal com vistas ao ganho de estatura: quando vale a pena?', 'mesa', ['Guilherme Guaragna Filho (RS)'], ['Iuri Martin Goemann (RS)', 'Leila Pedroso de Paula (RS)'], 'Endocrinologia Pediátrica', null, ['pediatria', 'bioetica']),
  S(50, 1, '15:30', '15:45', 'B', 'Vale usar GH para baixa estatura sem deficiência hormonal?', 'mesa', ['Fabiano Sandrini (PR)'], ['Iuri Martin Goemann (RS)', 'Leila Pedroso de Paula (RS)'], 'Endocrinologia Pediátrica', null, ['pediatria', 'bioetica']),
  S(51, 1, '15:45', '16:00', 'B', 'Discussão', 'mesa', [], ['Iuri Martin Goemann (RS)', 'Leila Pedroso de Paula (RS)'], 'Endocrinologia Pediátrica', null, ['pediatria']),
  S(52, 1, '16:20', '16:35', 'B', 'Calculadoras de risco cardiovascular', 'mesa', ['Andre Zimmerman (RS)'], ['Georgia Chichelero (RS)'], 'Avaliação global do risco cardiovascular', null, ['cardio']),
  S(53, 1, '16:35', '16:50', 'B', 'Papel das lipoproteínas', 'mesa', ['Paulo Eduardo Ballvé Behr (RS)'], ['Georgia Chichelero (RS)'], 'Avaliação global do risco cardiovascular', null, ['cardio', 'lipidios']),
  S(54, 1, '16:50', '17:05', 'B', 'Fatores de risco cardiovascular emergentes', 'mesa', ['Marcello Bertolucci (RS)'], ['Georgia Chichelero (RS)'], 'Avaliação global do risco cardiovascular', null, ['cardio']),
  S(55, 1, '17:05', '17:20', 'B', 'Discussão', 'mesa', [], ['Georgia Chichelero (RS)'], 'Avaliação global do risco cardiovascular', null, ['cardio']),
  S(56, 1, '17:20', '17:40', 'B', 'Usando ChatGPT na Endocrinologia em 20 minutos', 'endoflash', ['Rafael Vaz Machry (RS)'], ['Georgia Chichelero (RS)'], null, null, ['ia']),

  // ── SEX 08/05 — PLENÁRIA (manhã) ─────────────────────────────────────
  S(57, 2, '08:30', '09:00', 'P', 'Lipedema baseado em evidências', 'mini', ['Cristina da Silva Schreiber de Oliveira (SC)'], ['Letícia Weinert (RS)'], null, null, ['mulher']),
  S(58, 2, '09:00', '09:15', 'P', 'Manejo do distress do diabetes (Diretriz 2026)', 'mesa', ['Maristela Beck (RS)'], ['Carolina Leães Rech (RS)', 'Luciana Schreiner (RS)'], 'Saúde mental nas doenças metabólicas', null, ['diabetes', 'saude-mental']),
  S(59, 2, '09:15', '09:30', 'P', 'Triagem de psicopatologias em obesidade', 'mesa', ['Alice Xavier (RS)'], ['Carolina Leães Rech (RS)', 'Luciana Schreiner (RS)'], 'Saúde mental nas doenças metabólicas', null, ['obesidade', 'saude-mental']),
  S(60, 2, '09:30', '09:45', 'P', 'Transtorno de compulsão alimentar', 'mesa', ['Thizá Londero Gai (RS)'], ['Carolina Leães Rech (RS)', 'Luciana Schreiner (RS)'], 'Saúde mental nas doenças metabólicas', null, ['obesidade', 'saude-mental']),
  S(61, 2, '09:45', '10:00', 'P', 'Depressão e engajamento terapêutico', 'mesa', ['Letícia Sanguinetti Czepielewski (RS)'], ['Carolina Leães Rech (RS)', 'Luciana Schreiner (RS)'], 'Saúde mental nas doenças metabólicas', null, ['saude-mental']),
  S(62, 2, '10:00', '10:15', 'P', 'Discussão', 'mesa', [], ['Carolina Leães Rech (RS)', 'Luciana Schreiner (RS)'], 'Saúde mental nas doenças metabólicas', null, ['saude-mental']),
  S(63, 2, '10:40', '10:55', 'P', 'Incidentaloma Hipofisário', 'mesa', ['Tania Mazzuco (PR)'], ['Guilherme Rollin (RS)', 'Tobias Skrebsky de Almeida (RS)'], 'Neuroendocrinologia', null, ['neuroendocrino']),
  S(64, 2, '10:55', '11:10', 'P', 'Prolactinoma', 'mesa', ['Miriam da Costa Oliveira (RS)'], ['Guilherme Rollin (RS)', 'Tobias Skrebsky de Almeida (RS)'], 'Neuroendocrinologia', null, ['neuroendocrino']),
  S(65, 2, '11:10', '11:25', 'P', 'Acromegalia', 'mesa', ['Priscilla Rizental Coutinho (PR)'], ['Guilherme Rollin (RS)', 'Tobias Skrebsky de Almeida (RS)'], 'Neuroendocrinologia', null, ['neuroendocrino']),
  S(66, 2, '11:25', '11:40', 'P', 'Manejo do Tumor Hipofisário Agressivo', 'mesa', ['Rafael Loch Batista (SP)'], ['Guilherme Rollin (RS)', 'Tobias Skrebsky de Almeida (RS)'], 'Neuroendocrinologia', null, ['neuroendocrino', 'oncologia']),
  S(67, 2, '11:40', '11:55', 'P', 'Discussão', 'mesa', [], ['Guilherme Rollin (RS)', 'Tobias Skrebsky de Almeida (RS)'], 'Neuroendocrinologia', null, ['neuroendocrino']),
  S(68, 2, '13:00', '13:30', 'P', 'Sinergia iSGLT2 e Gliclazida: Elevando o Controle Glicêmico', 'pocket', ['Alexandre Hohl (SC)'], [], null, 'Servier', ['diabetes']),

  // ── SEX 08/05 — BALDUÍNO (manhã) ─────────────────────────────────────
  S(69, 2, '08:05', '08:20', 'B', 'Idade para iniciar bloqueio e/ou terapia hormonal: benefícios clínicos versus legislação vigente', 'mesa', ['Tayane Muniz Fighera (RS)'], ['Ruth Clapauch (SP)'], 'Transgeneridade', null, ['transgenero', 'bioetica']),
  S(70, 2, '08:20', '08:35', 'B', 'Terapia hormonal afirmativa de gênero feminina: como usar e como monitorar', 'mesa', ['Jivago da Fonseca Lopes (RS)'], ['Ruth Clapauch (SP)'], 'Transgeneridade', null, ['transgenero']),
  S(71, 2, '08:35', '08:50', 'B', 'Terapia hormonal afirmativa de gênero masculina: como usar e como monitorar', 'mesa', ['Ciciliana Maíla Zilio Rech (RS)'], ['Ruth Clapauch (SP)'], 'Transgeneridade', null, ['transgenero']),
  S(72, 2, '08:50', '09:05', 'B', 'Sexualidade e fertilidade na transgeneridade', 'mesa', ['Roberta Moreira Allgayer (RS)'], ['Ruth Clapauch (SP)'], 'Transgeneridade', null, ['transgenero']),
  S(73, 2, '09:05', '09:20', 'B', 'Discussão', 'mesa', [], ['Ruth Clapauch (SP)'], 'Transgeneridade', null, ['transgenero']),
  S(74, 2, '09:20', '09:40', 'B', 'Novas diretrizes de Hipertensão 2026 — o que mudou?', 'endoflash', ['Eduardo Barbosa (RS)'], ['Sérgio Lerias de Almeida (RS)'], 'Hipertensão Arterial no consultório do Endocrinologista', null, ['hipertensao']),
  S(75, 2, '09:40', '10:00', 'B', 'Hiperaldosteronismo Primário: novas recomendações do Consenso da Endocrine Society', 'endoflash', ['Rafael Buck Giorgi (SP)'], ['Sérgio Lerias de Almeida (RS)'], 'Hipertensão Arterial no consultório do Endocrinologista', null, ['adrenal', 'hipertensao']),
  S(76, 2, '10:00', '10:15', 'B', 'Discussão', 'endoflash', [], ['Sérgio Lerias de Almeida (RS)'], 'Hipertensão Arterial no consultório do Endocrinologista', null, ['hipertensao']),
  S(77, 2, '11:00', '11:15', 'B', 'No DM1', 'mesa', ['Luciana Schreiner (RS)'], ['Airton Golbert (RS)', 'Márcia Puñales (RS)'], 'Monitoramento contínuo de glicose muda desfecho?', null, ['diabetes']),
  S(78, 2, '11:15', '11:30', 'B', 'No DM2', 'mesa', ['Ticiana da Costa Rodrigues (RS)'], ['Airton Golbert (RS)', 'Márcia Puñales (RS)'], 'Monitoramento contínuo de glicose muda desfecho?', null, ['diabetes']),
  S(79, 2, '11:30', '11:45', 'B', 'Na Gestação', 'mesa', ['Letícia Weinert (RS)'], ['Airton Golbert (RS)', 'Márcia Puñales (RS)'], 'Monitoramento contínuo de glicose muda desfecho?', null, ['diabetes', 'mulher']),
  S(80, 2, '11:45', '12:00', 'B', 'Discussão', 'mesa', [], ['Airton Golbert (RS)', 'Márcia Puñales (RS)'], 'Monitoramento contínuo de glicose muda desfecho?', null, ['diabetes']),
  S(81, 2, '13:00', '13:30', 'B', 'Mounjaro além do peso: do impacto cardiometabólico à prática clínica', 'pocket', ['Roberto Zagury (RJ)'], [], null, 'Lilly', ['obesidade', 'diabetes']),

  // ── SEX 08/05 — PLENÁRIA (tarde) ─────────────────────────────────────
  S(82, 2, '13:45', '14:45', 'P', 'Terapia Hormonal (TH) ao longo da vida reprodutiva', 'roda', ['Letícia Weinert (RS)', 'Marcelo Ronsoni (SC)', 'Tayane Muniz Fighera (RS)', 'Alexandre Hohl (SC)', 'Maria Celeste Osório Wender (RS)'], [], null, null, ['mulher']),
  S(83, 2, '14:45', '15:00', 'P', 'Prós e contras dos métodos em avaliação de composição corporal', 'mesa', ['Rosana Radominski (PR)'], ['José Miguel Dora (RS)', 'Rogério Friedman (RS)'], 'Endocrinologia do Esporte', null, ['esporte']),
  S(84, 2, '15:00', '15:15', 'P', 'Avaliação pré atividade física', 'mesa', ['Anderson Donelli (RS)'], ['José Miguel Dora (RS)', 'Rogério Friedman (RS)'], 'Endocrinologia do Esporte', null, ['esporte']),
  S(85, 2, '15:15', '15:30', 'P', 'Tipos de exercícios e seus benefícios', 'mesa', ['Fulvio Thomaselli (SC)'], ['José Miguel Dora (RS)', 'Rogério Friedman (RS)'], 'Endocrinologia do Esporte', null, ['esporte']),
  S(86, 2, '15:30', '15:45', 'P', 'Orientação e suplementação nutricional', 'mesa', ['Luciana Verçosa Viana (RS)'], ['José Miguel Dora (RS)', 'Rogério Friedman (RS)'], 'Endocrinologia do Esporte', null, ['esporte']),
  S(87, 2, '15:45', '16:00', 'P', 'Discussão', 'mesa', [], ['José Miguel Dora (RS)', 'Rogério Friedman (RS)'], 'Endocrinologia do Esporte', null, ['esporte']),
  S(88, 2, '16:20', '16:35', 'P', 'Engajamento na prática — o que funciona?', 'mesa', ['Carolina Leães Rech (RS)'], ['Vanessa Lopes Oliveira (RS)'], 'Usando as armas que se tem no manejo da doença metabólica', null, ['bioetica']),
  S(89, 2, '16:35', '16:50', 'P', 'Entre a evidência e a realidade: o que fazer quando o ideal não é acessível em diabetes?', 'mesa', ['Luciana Schreiner (RS)'], ['Vanessa Lopes Oliveira (RS)'], 'Usando as armas que se tem no manejo da doença metabólica', null, ['diabetes', 'bioetica']),
  S(90, 2, '16:50', '17:05', 'P', 'Entre a evidência e a realidade: o que fazer quando o ideal não é acessível em obesidade?', 'mesa', ['Rogério Friedman (RS)'], ['Vanessa Lopes Oliveira (RS)'], 'Usando as armas que se tem no manejo da doença metabólica', null, ['obesidade', 'bioetica']),
  S(91, 2, '17:05', '17:20', 'P', 'Discussão', 'mesa', [], ['Vanessa Lopes Oliveira (RS)'], 'Usando as armas que se tem no manejo da doença metabólica', null, ['bioetica']),

  // ── SEX 08/05 — BALDUÍNO (tarde) ─────────────────────────────────────
  S(92, 2, '13:45', '14:20', 'B', 'Suplementação de Vitamina D — Os novos guidelines valem para o Brasil?', 'mini', ['Marise Lazaretti-Castro (SP)'], ['Dalisbor Marcelo Weber Silva (SC)'], null, null, ['ossea']),
  S(93, 2, '14:20', '14:35', 'B', 'Qual critério diagnóstico devemos utilizar? O anti-mulleriano importa?', 'mesa', ['Ciciliana Maíla Zilio Rech (RS)'], ['Roberta Moreira Allgayer (RS)'], 'Síndrome dos Ovários Policísticos', null, ['mulher']),
  S(94, 2, '14:35', '14:50', 'B', 'Avaliação e tratamento na adolescente', 'mesa', ['Ruth Clapauch (SP)'], ['Roberta Moreira Allgayer (RS)'], 'Síndrome dos Ovários Policísticos', null, ['mulher', 'pediatria']),
  S(95, 2, '14:50', '15:05', 'B', 'Tratamento na mulher que não deseja engravidar', 'mesa', ['Lucas Bandeira Marchesan (RS)'], ['Roberta Moreira Allgayer (RS)'], 'Síndrome dos Ovários Policísticos', null, ['mulher']),
  S(96, 2, '15:05', '15:25', 'B', 'Discussão', 'mesa', [], ['Roberta Moreira Allgayer (RS)'], 'Síndrome dos Ovários Policísticos', null, ['mulher']),
  S(97, 2, '15:30', '16:00', 'B', 'O que há de novo no Cushing adrenal?', 'mini', ['Mauro Antônio Czepielewski (RS)'], ['Guilherme Rollin (RS)'], null, null, ['adrenal']),

  // ── SEX 08/05 — XIRÚ (tarde) ─────────────────────────────────────────
  S(98, 2, '16:20', '16:35', 'X', 'Primeiros passos do Consultório Particular do Endocrinologista', 'mesa', ['Iuri Martin Goemann (RS)'], ['Leonardo Barbi Walter (RS)', 'Antonio Bentes de Figueiredo Júnior', 'Marise Lazaretti-Castro (SP)'], 'Projeto Preceptoria', null, ['carreira', 'gestao']),
  S(99, 2, '16:35', '16:50', 'X', 'Vida do Endocrinologista: Carreira Acadêmica', 'mesa', ['Eduardo Coelho Machado'], ['Leonardo Barbi Walter (RS)', 'Antonio Bentes de Figueiredo Júnior', 'Marise Lazaretti-Castro (SP)'], 'Projeto Preceptoria', null, ['carreira']),
  S(100, 2, '16:50', '17:05', 'X', 'Medical Affairs na Indústria Farmacêutica: outra perspectiva em ciência e saúde', 'mesa', ['Marianne Orlandini Klein (SP)'], ['Leonardo Barbi Walter (RS)', 'Antonio Bentes de Figueiredo Júnior', 'Marise Lazaretti-Castro (SP)'], 'Projeto Preceptoria', null, ['carreira', 'bioetica']),
  S(101, 2, '17:05', '17:20', 'X', 'Como conciliar a maternidade com a carreira na Endocrinologia', 'mesa', ['Laura Marmitt (RS)'], ['Leonardo Barbi Walter (RS)', 'Antonio Bentes de Figueiredo Júnior', 'Marise Lazaretti-Castro (SP)'], 'Projeto Preceptoria', null, ['carreira']),
  S(102, 2, '17:20', '17:35', 'X', 'Marketing Médico e Mídias Sociais — O que fazer e o que não fazer?', 'mesa', ['Diâmela Porto Gindri (RS)'], ['Leonardo Barbi Walter (RS)', 'Antonio Bentes de Figueiredo Júnior', 'Marise Lazaretti-Castro (SP)'], 'Projeto Preceptoria', null, ['carreira', 'bioetica', 'gestao']),
  S(103, 2, '17:35', '17:45', 'X', 'Discussão', 'mesa', [], ['Leonardo Barbi Walter (RS)', 'Antonio Bentes de Figueiredo Júnior', 'Marise Lazaretti-Castro (SP)'], 'Projeto Preceptoria', null, ['carreira']),
  S(104, 2, '17:45', '19:00', 'C', 'Sessão de pôsteres + Happy hour científico', 'outro', [], [], null, null, ['pesquisa']),

  // ── SÁB 09/05 — PLENÁRIA (manhã) ─────────────────────────────────────
  S(105, 3, '08:00', '08:15', 'P', 'Saúde metabólica no climatério', 'mesa', ['Beatriz D. Schaan (RS)'], ['Maria Celeste Osório Wender (RS)'], 'Endocrinologia da mulher', null, ['mulher']),
  S(106, 3, '08:15', '08:30', 'P', 'Sexualidade no climatério', 'mesa', ['Carmita Abdo (SP)'], ['Maria Celeste Osório Wender (RS)'], 'Endocrinologia da mulher', null, ['mulher']),
  S(107, 3, '08:30', '08:45', 'P', 'Suplemento no climatério: quais as evidências?', 'mesa', ['Luciana Verçosa Viana (RS)'], ['Maria Celeste Osório Wender (RS)'], 'Endocrinologia da mulher', null, ['mulher']),
  S(108, 3, '08:45', '09:00', 'P', 'Anticoncepção: o que o endocrinologista precisa saber', 'mesa', ['Gislaine Krolow Casanova (RS)'], ['Maria Celeste Osório Wender (RS)'], 'Endocrinologia da mulher', null, ['mulher']),
  S(109, 3, '09:00', '09:15', 'P', 'Discussão', 'mesa', [], ['Maria Celeste Osório Wender (RS)'], 'Endocrinologia da mulher', null, ['mulher']),
  S(110, 3, '09:15', '09:30', 'P', 'Diretriz de dislipidemia: o que mudou?', 'mesa', ['Paulo Eduardo Ballvé Behr (RS)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Dislipidemia e Lipodistrofias', null, ['lipidios']),
  S(111, 3, '09:30', '09:45', 'P', 'Estamos lembrando das lipodistrofias?', 'mesa', ['Fernando Gerchman (RS)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Dislipidemia e Lipodistrofias', null, ['lipidios', 'lipo']),
  S(112, 3, '09:45', '10:00', 'P', 'Novas terapias em dislipidemia', 'mesa', ['Andre Zimmermann (RS)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Dislipidemia e Lipodistrofias', null, ['lipidios']),
  S(113, 3, '10:00', '10:15', 'P', 'Combinação de fármacos', 'mesa', ['Marcello Bertolucci (RS)'], ['Giullia Menuci Chianca Landenberger (RS)'], 'Dislipidemia e Lipodistrofias', null, ['lipidios']),
  S(114, 3, '10:15', '10:30', 'P', 'Discussão', 'mesa', [], ['Giullia Menuci Chianca Landenberger (RS)'], 'Dislipidemia e Lipodistrofias', null, ['lipidios']),
  S(115, 3, '11:00', '11:15', 'P', 'Análogos GLP-1 em dose alta', 'mesa', ['Fernando Gerchman (RS)'], ['Simone Van Der Sande Lee (SC)'], 'Breaking news em Obesidade', null, ['obesidade']),
  S(116, 3, '11:15', '11:30', 'P', 'Novas moléculas (triplo agonista, amilina)', 'mesa', ['Anita Lavarda Scheinpflug (SC)'], ['Simone Van Der Sande Lee (SC)'], 'Breaking news em Obesidade', null, ['obesidade']),
  S(117, 3, '11:30', '11:45', 'P', 'Mudanças do CFM em cirurgia metabólica', 'mesa', ['Jacqueline Rizzolli (RS)'], ['Simone Van Der Sande Lee (SC)'], 'Breaking news em Obesidade', null, ['obesidade', 'bioetica']),
  S(118, 3, '11:45', '12:00', 'P', 'Discussão', 'mesa', [], ['Simone Van Der Sande Lee (SC)'], 'Breaking news em Obesidade', null, ['obesidade']),
  S(119, 3, '12:00', '12:30', 'P', 'Encerramento oficial e entrega dos prêmios ENDOSUL, Jorge Gross e Mirela Azevedo', 'cerimonia', [], [], null, null, []),

  // ── SÁB 09/05 — BALDUÍNO (manhã) ─────────────────────────────────────
  S(120, 3, '08:00', '08:15', 'B', 'Tireoide', 'mesa', ['Cleo Otaviano Mesa Junior (PR)'], ['Sérgio Lerias de Almeida (RS)', 'Airton Golbert (RS)'], 'Endocrinopatias em imunoterapias', null, ['tireoide']),
  S(121, 3, '08:15', '08:30', 'B', 'Adrenal', 'mesa', ['Rafael Buck Giorgi (SP)'], ['Sérgio Lerias de Almeida (RS)', 'Airton Golbert (RS)'], 'Endocrinopatias em imunoterapias', null, ['adrenal']),
  S(122, 3, '08:30', '08:45', 'B', 'Metabólica', 'mesa', ['Anita Lavarda Scheinpflug (SC)'], ['Sérgio Lerias de Almeida (RS)', 'Airton Golbert (RS)'], 'Endocrinopatias em imunoterapias', null, ['diabetes']),
  S(123, 3, '08:45', '09:00', 'B', 'Hipofisária', 'mesa', ['Amely Pereira Silva Balthazar (SC)'], ['Sérgio Lerias de Almeida (RS)', 'Airton Golbert (RS)'], 'Endocrinopatias em imunoterapias', null, ['neuroendocrino']),
  S(124, 3, '09:00', '09:15', 'B', 'Discussão', 'mesa', [], ['Sérgio Lerias de Almeida (RS)', 'Airton Golbert (RS)'], 'Endocrinopatias em imunoterapias', null, []),
  S(125, 3, '09:15', '09:30', 'B', 'Atualizações no tratamento do hipotireoidismo gestacional', 'painel', ['Gabriela Brenta (Argentina)'], ['Erika Meyer (RS)', 'Lenara Golbert (RS)'], 'Painel Tireoidopatias', null, ['tireoide', 'mulher']),
  S(126, 3, '09:30', '09:45', 'B', 'Novidades no tratamento da Doença Ocular da Tireoide', 'painel', ['Gisah Amaral de Carvalho (PR)'], ['Erika Meyer (RS)', 'Lenara Golbert (RS)'], 'Painel Tireoidopatias', null, ['tireoide']),
  S(127, 3, '09:45', '10:00', 'B', 'Doença de Graves: uso prolongado de tionamidas e novas terapias emergentes', 'painel', ['Adriano Cury (SP)'], ['Erika Meyer (RS)', 'Lenara Golbert (RS)'], 'Painel Tireoidopatias', null, ['tireoide']),
  S(128, 3, '10:00', '10:15', 'B', 'Discussão', 'painel', [], ['Erika Meyer (RS)', 'Lenara Golbert (RS)'], 'Painel Tireoidopatias', null, ['tireoide']),
  S(129, 3, '10:15', '10:45', 'B', 'Novas fronteiras metabólicas: Terapias exercíciomiméticas', 'mini', ['Roberto Zagury (RJ)'], ['Rosana Radominski (PR)'], null, null, ['esporte']),
  S(130, 3, '11:00', '11:15', 'B', 'Esteroides anabolizantes', 'mesa', ['Clayton Dorneles Macedo (RS)'], ['Milene Moehlecke (RS)'], 'Endocrinologia e estética', null, ['estetica', 'bioetica']),
  S(131, 3, '11:15', '11:30', 'B', 'Análogos GLP-1', 'mesa', ['Letícia Weinert (RS)'], ['Milene Moehlecke (RS)'], 'Endocrinologia e estética', null, ['estetica', 'obesidade', 'bioetica']),
  S(132, 3, '11:30', '11:45', 'B', 'Estrogênio e progesterona', 'mesa', ['Maria Celeste Osório Wender (RS)'], ['Milene Moehlecke (RS)'], 'Endocrinologia e estética', null, ['estetica', 'mulher', 'bioetica']),
  S(133, 3, '11:45', '12:00', 'B', 'Discussão', 'mesa', [], ['Milene Moehlecke (RS)'], 'Endocrinologia e estética', null, ['estetica']),

  // ── SÁB 09/05 — XIRÚ (manhã) ─────────────────────────────────────────
  S(134, 3, '09:30', '11:00', 'X', 'Apresentação oral de Temas Livres finalistas', 'outro', [], [], null, null, ['pesquisa']),
];

const TAGS = {
  diabetes:       { label: 'Diabetes',        cls: 'bg-[#1e3a5f] text-[#e8e0c8]' },
  tireoide:       { label: 'Tireoide',        cls: 'bg-[#4a2c5a] text-[#e8e0c8]' },
  obesidade:      { label: 'Obesidade',       cls: 'bg-[#5c3317] text-[#e8e0c8]' },
  neuroendocrino: { label: 'Neuroendócrino',  cls: 'bg-[#2d4a3e] text-[#e8e0c8]' },
  ossea:          { label: 'Met. Ósseo',      cls: 'bg-[#3d2f1f] text-[#e8e0c8]' },
  mulher:         { label: 'Mulher',          cls: 'bg-[#6b1d2c] text-[#fdf6e8]' },
  pediatria:      { label: 'Pediatria',       cls: 'bg-[#4a3a1f] text-[#e8e0c8]' },
  esporte:        { label: 'Esporte',         cls: 'bg-[#2c4f3a] text-[#e8e0c8]' },
  bioetica:       { label: 'Bioética',        cls: 'bg-[#7a1f1f] text-[#fdf6e8] ring-1 ring-[#7a1f1f]/30' },
  ia:             { label: 'IA / Educação',   cls: 'bg-[#1f4a4a] text-[#e8e0c8]' },
  carreira:       { label: 'Carreira',        cls: 'bg-[#3a3a4a] text-[#e8e0c8]' },
  gestao:         { label: 'Gestão',          cls: 'bg-[#4a3520] text-[#e8e0c8]' },
  lipidios:       { label: 'Lipídios',        cls: 'bg-[#5a3a2c] text-[#e8e0c8]' },
  adrenal:        { label: 'Adrenal',         cls: 'bg-[#3d1f3a] text-[#e8e0c8]' },
  hipertensao:    { label: 'Hipertensão',     cls: 'bg-[#5c1f2e] text-[#e8e0c8]' },
  'saude-mental': { label: 'Saúde Mental',    cls: 'bg-[#3a2c4f] text-[#e8e0c8]' },
  estetica:       { label: 'Estética',        cls: 'bg-[#5a2c3f] text-[#e8e0c8]' },
  transgenero:    { label: 'Transgeneridade', cls: 'bg-[#3a3f5c] text-[#e8e0c8]' },
  masld:          { label: 'MASLD',           cls: 'bg-[#3d4a1f] text-[#e8e0c8]' },
  cardio:         { label: 'Cardiovascular',  cls: 'bg-[#5c2c2c] text-[#e8e0c8]' },
  'saude-publica':{ label: 'Saúde Pública',   cls: 'bg-[#2c3f3f] text-[#e8e0c8]' },
  pesquisa:       { label: 'Pesquisa',        cls: 'bg-[#3f3f3f] text-[#e8e0c8]' },
  oncologia:      { label: 'Oncologia',       cls: 'bg-[#4a1f1f] text-[#e8e0c8]' },
  lipo:           { label: 'Lipodistrofia',   cls: 'bg-[#4a3520] text-[#e8e0c8]' },
  'endo-masc':    { label: 'Endo Masculina',  cls: 'bg-[#2c3a4a] text-[#e8e0c8]' },
};

const ROOMS = {
  P: { label: 'Plenária Luiz Alberto', short: 'Plenária', cls: 'bg-[#6b1d2c] text-[#fdf6e8]' },
  B: { label: 'Sala Balduíno Tschiede', short: 'Balduíno', cls: 'bg-[#1f4a4a] text-[#fdf6e8]' },
  X: { label: 'Sala Xirú', short: 'Xirú', cls: 'bg-[#5c3317] text-[#fdf6e8]' },
  C: { label: 'Convivência', short: 'Convivência', cls: 'bg-[#3f3f3f] text-[#fdf6e8]' },
};

const TYPES = {
  mesa:      { label: 'Mesa',         cls: 'border-[#3a2c1a]/40 text-[#3a2c1a]' },
  mini:      { label: 'Miniconferência', cls: 'border-[#6b1d2c]/40 text-[#6b1d2c]' },
  pocket:    { label: 'Pocket Class', cls: 'border-[#8b6914]/50 text-[#8b6914]' },
  simposio:  { label: 'Simpósio Satélite', cls: 'border-[#8b6914]/50 text-[#8b6914]' },
  endoflash: { label: 'EndoFlash',    cls: 'border-[#1f4a4a]/40 text-[#1f4a4a]' },
  roda:      { label: 'Roda de Conversa', cls: 'border-[#4a3520]/40 text-[#4a3520]' },
  painel:    { label: 'Painel',       cls: 'border-[#3a2c1a]/40 text-[#3a2c1a]' },
  ligas:     { label: 'Ligas Acadêmicas', cls: 'border-[#2c4f3a]/40 text-[#2c4f3a]' },
  forum:     { label: 'Fórum',        cls: 'border-[#3a2c1a]/40 text-[#3a2c1a]' },
  cerimonia: { label: 'Cerimônia',    cls: 'border-[#6b1d2c]/40 text-[#6b1d2c]' },
  outro:     { label: 'Outro',        cls: 'border-[#3f3f3f]/40 text-[#3f3f3f]' },
};

const DAYS = [
  { v: 1, label: 'Quinta', date: '07/05', full: 'Qui · 07/05' },
  { v: 2, label: 'Sexta',  date: '08/05', full: 'Sex · 08/05' },
  { v: 3, label: 'Sábado', date: '09/05', full: 'Sáb · 09/05' },
];

const STORAGE_KEY = 'endosul-2026-data';

// ─── HELPERS ─────────────────────────────────────────────────────────────

const t2m = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

const overlaps = (a, b) => a.day === b.day && t2m(a.t1) < t2m(b.t2) && t2m(b.t1) < t2m(a.t2);

const buildMarkdown = (sessions, userData) => {
  const fav = sessions.filter(s => userData.favorites[s.id]);
  let md = `# Memorial Endosul 2026 — Minha Agenda\n\n_Gerado em ${new Date().toLocaleString('pt-BR')}_\n\n---\n\n`;
  for (const day of DAYS) {
    const daySessions = fav.filter(s => s.day === day.v).sort((a, b) => t2m(a.t1) - t2m(b.t1));
    if (!daySessions.length) continue;
    md += `## ${day.full}\n\n`;
    for (const s of daySessions) {
      const tags = s.tags.map(t => TAGS[t]?.label).filter(Boolean).join(' · ');
      const speakers = s.sp.length ? s.sp.join(', ') : '—';
      const status = userData.status[s.id] || 'pendente';
      md += `### ${s.t1}–${s.t2} · ${ROOMS[s.room].short} · ${s.title}\n\n`;
      md += `- **Palestrante(s):** ${speakers}\n`;
      if (s.mod.length) md += `- **Moderação:** ${s.mod.join(', ')}\n`;
      if (s.group) md += `- **Sessão:** ${s.group}\n`;
      if (s.sponsor) md += `- **Patrocínio:** ${s.sponsor}\n`;
      if (tags) md += `- **Eixos:** ${tags}\n`;
      md += `- **Status:** ${status}\n`;
      if (userData.notes[s.id]) md += `\n**Notas / observações clínicas:**\n\n${userData.notes[s.id]}\n`;
      if (userData.uc[s.id]) md += `\n**Gancho didático (UC / EPA):**\n\n${userData.uc[s.id]}\n`;
      if (userData.bioetica[s.id]) md += `\n**Controvérsia bioética:**\n\n${userData.bioetica[s.id]}\n`;
      md += `\n---\n\n`;
    }
  }
  if (!fav.length) md += `_Nenhuma sessão marcada como "vou assistir" ainda._\n`;
  return md;
};

// ─── COMPONENT ───────────────────────────────────────────────────────────

export default function EndosulApp() {
  const [day, setDay] = useState(1);
  const [view, setView] = useState('all'); // all | mine | stats
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [filterRooms, setFilterRooms] = useState([]);
  const [filterTypes, setFilterTypes] = useState([]);
  const [showSponsored, setShowSponsored] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [userData, setUserData] = useState({ favorites: {}, status: {}, notes: {}, uc: {}, bioetica: {} });
  const [loaded, setLoaded] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const saveTimer = useRef(null);

  // Load
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setUserData(JSON.parse(r.value));
      } catch (e) { /* first run */ }
      setLoaded(true);
    })();
  }, []);

  // Persist (debounced)
  const persist = useCallback((next) => {
    setUserData(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
    }, 400);
  }, []);

  const toggleFav = (id) => {
    const next = { ...userData, favorites: { ...userData.favorites } };
    if (next.favorites[id]) delete next.favorites[id]; else next.favorites[id] = true;
    persist(next);
  };

  const setField = (field, id, value) => {
    const next = { ...userData, [field]: { ...userData[field] } };
    if (!value) delete next[field][id]; else next[field][id] = value;
    persist(next);
  };

  // Conflict detection among favorited sessions
  const conflicts = useMemo(() => {
    const fav = SESSIONS.filter(s => userData.favorites[s.id]);
    const cMap = {};
    for (let i = 0; i < fav.length; i++) {
      for (let j = i + 1; j < fav.length; j++) {
        if (overlaps(fav[i], fav[j])) {
          cMap[fav[i].id] = (cMap[fav[i].id] || []).concat(fav[j].id);
          cMap[fav[j].id] = (cMap[fav[j].id] || []).concat(fav[i].id);
        }
      }
    }
    return cMap;
  }, [userData.favorites]);

  // Filter
  const filtered = useMemo(() => {
    let arr = SESSIONS.filter(s => s.day === day);
    if (view === 'mine') arr = arr.filter(s => userData.favorites[s.id]);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.sp.join(' ').toLowerCase().includes(q) ||
        s.mod.join(' ').toLowerCase().includes(q) ||
        (s.group || '').toLowerCase().includes(q) ||
        (s.sponsor || '').toLowerCase().includes(q)
      );
    }
    if (filterTags.length) arr = arr.filter(s => filterTags.some(t => s.tags.includes(t)));
    if (filterRooms.length) arr = arr.filter(s => filterRooms.includes(s.room));
    if (filterTypes.length) arr = arr.filter(s => filterTypes.includes(s.type));
    if (!showSponsored) arr = arr.filter(s => !s.sponsor);
    return arr.sort((a, b) => t2m(a.t1) - t2m(b.t1) || a.room.localeCompare(b.room));
  }, [day, view, search, filterTags, filterRooms, filterTypes, showSponsored, userData.favorites]);

  // Stats
  const stats = useMemo(() => {
    const all = SESSIONS;
    const fav = all.filter(s => userData.favorites[s.id]);
    const tagCount = {};
    fav.forEach(s => s.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    const sponsoredFav = fav.filter(s => s.sponsor).length;
    const conflictCount = Object.keys(conflicts).length / 2;
    return { totalFav: fav.length, total: all.length, tagCount, sponsoredFav, conflictCount };
  }, [userData.favorites, conflicts]);

  const activeFilterCount = filterTags.length + filterRooms.length + filterTypes.length + (showSponsored ? 0 : 1);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#f4ecd8] flex items-center justify-center">
        <div className="text-[#3a2c1a] font-serif italic">carregando memorial…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#1a1410]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif; font-feature-settings: 'ss01'; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .paper-texture {
          background-image:
            radial-gradient(circle at 20% 30%, rgba(139, 105, 20, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(107, 29, 44, 0.03) 0%, transparent 50%);
        }
        .ink-rule { background: linear-gradient(90deg, transparent, #3a2c1a 20%, #3a2c1a 80%, transparent); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .anim-fadeup { animation: fadeUp 0.3s ease-out both; }
        textarea { font-family: 'DM Sans', sans-serif; }
        textarea:focus { outline: none; border-color: #6b1d2c; }
      `}</style>

      <div className="paper-texture min-h-screen">
        {/* HEADER */}
        <header className="px-4 pt-6 pb-3 max-w-3xl mx-auto">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#8b6914] uppercase">XX Congresso Sul-Brasileiro</div>
              <h1 className="font-serif text-4xl font-semibold leading-none tracking-tight text-[#1a1410] mt-1">Endosul <span className="text-[#6b1d2c] italic">2026</span></h1>
              <div className="font-serif text-sm italic text-[#5c4a3a] mt-1">07–09 de maio · memorial pessoal</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-[#8b6914]">SESSÕES</div>
              <div className="font-serif text-2xl font-semibold text-[#3a2c1a]">{SESSIONS.length}</div>
            </div>
          </div>
          <div className="ink-rule h-px mt-4" />
        </header>

        {/* DAY TABS */}
        <div className="sticky top-0 z-30 bg-[#f4ecd8]/95 backdrop-blur-sm border-b border-[#3a2c1a]/15">
          <div className="max-w-3xl mx-auto px-4 py-2">
            <div className="flex gap-1.5">
              {DAYS.map(d => (
                <button
                  key={d.v}
                  onClick={() => setDay(d.v)}
                  className={`flex-1 px-3 py-2.5 rounded-md transition-all ${day === d.v ? 'bg-[#1a1410] text-[#f4ecd8]' : 'bg-[#e8dcc0] text-[#3a2c1a] hover:bg-[#dccfaf]'}`}
                >
                  <div className="font-serif text-base font-semibold leading-tight">{d.label}</div>
                  <div className="font-mono text-[10px] opacity-75">{d.date}</div>
                </button>
              ))}
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex gap-1.5 mt-2">
              <button onClick={() => setView('all')} className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${view === 'all' ? 'bg-[#3a2c1a] text-[#f4ecd8]' : 'text-[#5c4a3a] hover:bg-[#e8dcc0]'}`}>
                Toda agenda
              </button>
              <button onClick={() => setView('mine')} className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${view === 'mine' ? 'bg-[#6b1d2c] text-[#fdf6e8]' : 'text-[#5c4a3a] hover:bg-[#e8dcc0]'}`}>
                <Star size={12} className="inline mr-1 -mt-0.5" />Minha agenda{stats.totalFav > 0 && ` (${SESSIONS.filter(s => userData.favorites[s.id] && s.day === day).length})`}
              </button>
              <button onClick={() => setView('stats')} className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${view === 'stats' ? 'bg-[#1f4a4a] text-[#fdf6e8]' : 'text-[#5c4a3a] hover:bg-[#e8dcc0]'}`}>
                <BarChart3 size={12} className="inline mr-1 -mt-0.5" />Visão geral
              </button>
            </div>
          </div>
        </div>

        {view !== 'stats' && (
          <>
            {/* SEARCH + FILTERS */}
            <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6914]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar palestrante, tema…"
                  className="w-full bg-[#fdf6e8] border border-[#3a2c1a]/20 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-[#8b6914]/60 focus:outline-none focus:border-[#6b1d2c]"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b6914]">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(true)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-colors ${activeFilterCount > 0 ? 'bg-[#6b1d2c] text-[#fdf6e8] border-[#6b1d2c]' : 'bg-[#fdf6e8] text-[#3a2c1a] border-[#3a2c1a]/20'}`}
              >
                <SlidersHorizontal size={14} />
                {activeFilterCount > 0 && <span className="font-mono text-[10px]">{activeFilterCount}</span>}
              </button>
            </div>

            {view === 'mine' && stats.totalFav > 0 && (
              <div className="max-w-3xl mx-auto px-4 mb-2">
                <button
                  onClick={() => setExportOpen(true)}
                  className="w-full bg-[#1a1410] text-[#f4ecd8] rounded-lg py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#3a2c1a] transition-colors"
                >
                  <FileDown size={14} /> Exportar memorial em Markdown
                </button>
              </div>
            )}

            {/* CONFLICT BANNER */}
            {view === 'mine' && stats.conflictCount > 0 && (
              <div className="max-w-3xl mx-auto px-4 mb-2">
                <div className="bg-[#fdf6e8] border-l-4 border-[#8b6914] rounded px-3 py-2 text-xs flex items-start gap-2">
                  <AlertTriangle size={14} className="text-[#8b6914] mt-0.5 flex-shrink-0" />
                  <span className="text-[#5c4a3a]"><strong className="text-[#8b6914]">{Math.round(stats.conflictCount)} conflito{stats.conflictCount > 1 ? 's' : ''}</strong> de horário entre suas sessões marcadas. Cards em conflito aparecem com borda âmbar.</span>
                </div>
              </div>
            )}

            {/* SESSION LIST */}
            <main className="max-w-3xl mx-auto px-4 pb-24">
              {filtered.length === 0 ? (
                <div className="text-center py-16 font-serif italic text-[#8b6914]">
                  {view === 'mine' ? 'Nenhuma sessão marcada para este dia.' : 'Nenhuma sessão corresponde aos filtros.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(s => {
                    const isFav = !!userData.favorites[s.id];
                    const isExp = expanded === s.id;
                    const conflict = conflicts[s.id];
                    const status = userData.status[s.id];
                    return (
                      <article
                        key={s.id}
                        className={`bg-[#fdf6e8] rounded-lg border transition-all ${conflict && view === 'mine' ? 'border-[#8b6914] border-2' : 'border-[#3a2c1a]/15'} ${s.sponsor ? 'ring-1 ring-[#8b6914]/30' : ''}`}
                      >
                        {/* CARD HEAD */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start gap-2.5">
                            {/* Time block */}
                            <div className="flex-shrink-0 w-14 pt-0.5">
                              <div className="font-mono text-sm font-semibold text-[#1a1410] leading-tight">{s.t1}</div>
                              <div className="font-mono text-[10px] text-[#8b6914] leading-tight">{s.t2}</div>
                            </div>

                            {/* Main */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1 mb-1.5">
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${ROOMS[s.room].cls}`}>
                                  {ROOMS[s.room].short}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${TYPES[s.type].cls} bg-transparent`}>
                                  {TYPES[s.type].label}
                                </span>
                                {s.sponsor && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#8b6914] text-[#fdf6e8] flex items-center gap-1">
                                    <Sparkles size={9} /> {s.sponsor}
                                  </span>
                                )}
                                {conflict && view === 'mine' && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#fdf6e8] text-[#8b6914] border border-[#8b6914] flex items-center gap-1">
                                    <AlertTriangle size={9} /> conflito
                                  </span>
                                )}
                              </div>

                              <h3 className="font-serif text-base font-semibold text-[#1a1410] leading-snug">{s.title}</h3>

                              {s.group && (
                                <div className="font-serif text-xs italic text-[#8b6914] mt-1">{s.group}</div>
                              )}

                              {s.sp.length > 0 && (
                                <div className="text-xs text-[#5c4a3a] mt-1.5">
                                  {s.sp.join(' · ')}
                                </div>
                              )}

                              {s.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {s.tags.map(t => TAGS[t] && (
                                    <span key={t} className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${TAGS[t].cls}`}>
                                      {TAGS[t].label}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Star */}
                            <button
                              onClick={() => toggleFav(s.id)}
                              className={`flex-shrink-0 p-1.5 rounded-full transition-all ${isFav ? 'text-[#8b6914]' : 'text-[#3a2c1a]/30 hover:text-[#8b6914]'}`}
                              aria-label={isFav ? 'Remover dos favoritos' : 'Marcar como vou assistir'}
                            >
                              <Star size={20} fill={isFav ? 'currentColor' : 'none'} strokeWidth={2} />
                            </button>
                          </div>

                          {/* Status indicator */}
                          {status && status !== 'pendente' && (
                            <div className="mt-2 ml-16 inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e8dcc0] text-[#3a2c1a]">
                              {status === 'assistida' ? <><Check size={10} /> assistida</> : <><EyeOff size={10} /> pulada</>}
                            </div>
                          )}

                          {/* Expand toggle */}
                          {(isFav || isExp) && (
                            <button
                              onClick={() => setExpanded(isExp ? null : s.id)}
                              className="mt-2 ml-16 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#6b1d2c] hover:text-[#8b1e3f]"
                            >
                              {isExp ? <><ChevronUp size={12} /> recolher memorial</> : <><ChevronDown size={12} /> abrir memorial</>}
                            </button>
                          )}
                          {!isFav && !isExp && (
                            <button
                              onClick={() => setExpanded(s.id)}
                              className="mt-2 ml-16 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#5c4a3a]/60 hover:text-[#5c4a3a]"
                            >
                              <ChevronDown size={12} /> notas
                            </button>
                          )}
                        </div>

                        {/* EXPANDED MEMORIAL FIELDS */}
                        {isExp && (
                          <div className="border-t border-[#3a2c1a]/10 px-3 sm:px-4 py-3 anim-fadeup space-y-3">
                            {s.mod.length > 0 && (
                              <div>
                                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8b6914] mb-0.5">Moderação</div>
                                <div className="text-xs text-[#5c4a3a]">{s.mod.join(' · ')}</div>
                              </div>
                            )}

                            {/* Status selector */}
                            <div>
                              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8b6914] mb-1">Status</div>
                              <div className="flex gap-1.5">
                                {[
                                  { v: 'pendente', label: 'Pendente', icon: CircleDashed },
                                  { v: 'assistida', label: 'Assistida', icon: Check },
                                  { v: 'pulada', label: 'Pulada', icon: EyeOff },
                                ].map(opt => {
                                  const Ic = opt.icon;
                                  const active = (status || 'pendente') === opt.v;
                                  return (
                                    <button
                                      key={opt.v}
                                      onClick={() => setField('status', s.id, opt.v === 'pendente' ? null : opt.v)}
                                      className={`flex-1 px-2 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors ${active ? 'bg-[#3a2c1a] text-[#f4ecd8]' : 'bg-[#e8dcc0] text-[#5c4a3a] hover:bg-[#dccfaf]'}`}
                                    >
                                      <Ic size={11} /> {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <MemorialField
                              icon={BookOpen}
                              label="Notas / observações clínicas"
                              hint="Pontos-chave, evidências citadas, take-aways"
                              value={userData.notes[s.id] || ''}
                              onChange={v => setField('notes', s.id, v)}
                            />

                            <MemorialField
                              icon={Bookmark}
                              label="Gancho didático — UC / EPA"
                              hint="UC1/UC2/UC3, EPA correlata, possível questão TECM/ENAMED"
                              value={userData.uc[s.id] || ''}
                              onChange={v => setField('uc', s.id, v)}
                              accent="#1f4a4a"
                            />

                            <MemorialField
                              icon={Scale}
                              label="Controvérsia bioética"
                              hint="Tensão ética observada, framing problemático, equilíbrio benefício/risco"
                              value={userData.bioetica[s.id] || ''}
                              onChange={v => setField('bioetica', s.id, v)}
                              accent="#6b1d2c"
                            />

                            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8b6914] pt-1">
                              Slides / transcrição: anexar manualmente no memorial final
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </main>
          </>
        )}

        {/* STATS VIEW */}
        {view === 'stats' && (
          <main className="max-w-3xl mx-auto px-4 pb-24">
            <div className="bg-[#fdf6e8] rounded-lg p-5 border border-[#3a2c1a]/15">
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#8b6914] mb-3">Distribuição</div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <div className="font-serif text-3xl font-semibold text-[#1a1410]">{stats.totalFav}</div>
                  <div className="text-[10px] text-[#5c4a3a] uppercase tracking-wider mt-0.5">marcadas</div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-semibold text-[#6b1d2c]">{Math.round(stats.conflictCount)}</div>
                  <div className="text-[10px] text-[#5c4a3a] uppercase tracking-wider mt-0.5">conflitos</div>
                </div>
                <div>
                  <div className="font-serif text-3xl font-semibold text-[#8b6914]">{stats.sponsoredFav}</div>
                  <div className="text-[10px] text-[#5c4a3a] uppercase tracking-wider mt-0.5">patrocinadas</div>
                </div>
              </div>

              <div className="ink-rule h-px my-4" />

              <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#8b6914] mb-3">Eixos temáticos · minha agenda</div>
              {Object.keys(stats.tagCount).length === 0 ? (
                <div className="font-serif italic text-sm text-[#8b6914]">Marque sessões com a estrela para ver a distribuição.</div>
              ) : (
                <div className="space-y-1.5">
                  {Object.entries(stats.tagCount).sort((a, b) => b[1] - a[1]).map(([t, n]) => {
                    const max = Math.max(...Object.values(stats.tagCount));
                    const pct = (n / max) * 100;
                    return TAGS[t] && (
                      <div key={t} className="flex items-center gap-2">
                        <div className="w-32 flex-shrink-0">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TAGS[t].cls}`}>{TAGS[t].label}</span>
                        </div>
                        <div className="flex-1 h-5 bg-[#e8dcc0] rounded-sm overflow-hidden">
                          <div className="h-full bg-[#3a2c1a]" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="font-mono text-xs text-[#3a2c1a] w-6 text-right">{n}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="ink-rule h-px my-4" />

              <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#8b6914] mb-2">Por dia</div>
              <div className="grid grid-cols-3 gap-3">
                {DAYS.map(d => {
                  const n = SESSIONS.filter(s => userData.favorites[s.id] && s.day === d.v).length;
                  const total = SESSIONS.filter(s => s.day === d.v).length;
                  return (
                    <div key={d.v} className="bg-[#f4ecd8] rounded p-3">
                      <div className="font-serif text-base font-semibold text-[#1a1410]">{d.label}</div>
                      <div className="font-mono text-xs text-[#5c4a3a] mt-0.5">{n} de {total}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stats.totalFav > 0 && (
              <button
                onClick={() => setExportOpen(true)}
                className="w-full mt-4 bg-[#1a1410] text-[#f4ecd8] rounded-lg py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#3a2c1a] transition-colors"
              >
                <FileDown size={14} /> Exportar memorial completo
              </button>
            )}
          </main>
        )}

        {/* FILTERS BOTTOM SHEET */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 flex items-end" onClick={() => setFiltersOpen(false)}>
            <div className="absolute inset-0 bg-[#1a1410]/40" />
            <div
              className="relative w-full max-w-3xl mx-auto bg-[#f4ecd8] rounded-t-2xl border-t border-[#3a2c1a]/20 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
              style={{ animation: 'fadeUp 0.2s ease-out' }}
            >
              <div className="sticky top-0 bg-[#f4ecd8] border-b border-[#3a2c1a]/15 px-4 py-3 flex items-center justify-between">
                <div className="font-serif text-lg font-semibold">Filtros</div>
                <div className="flex gap-3">
                  <button onClick={() => { setFilterTags([]); setFilterRooms([]); setFilterTypes([]); setShowSponsored(true); }} className="text-xs text-[#6b1d2c] underline">limpar</button>
                  <button onClick={() => setFiltersOpen(false)} className="text-[#3a2c1a]"><X size={20} /></button>
                </div>
              </div>

              <div className="p-4 space-y-5">
                <FilterGroup
                  title="Eixo temático"
                  items={Object.entries(TAGS)}
                  selected={filterTags}
                  onToggle={v => setFilterTags(filterTags.includes(v) ? filterTags.filter(x => x !== v) : [...filterTags, v])}
                  renderItem={([k, t]) => <span className={`text-[11px] font-medium px-2 py-1 rounded ${t.cls}`}>{t.label}</span>}
                  getKey={([k]) => k}
                />
                <FilterGroup
                  title="Sala"
                  items={Object.entries(ROOMS)}
                  selected={filterRooms}
                  onToggle={v => setFilterRooms(filterRooms.includes(v) ? filterRooms.filter(x => x !== v) : [...filterRooms, v])}
                  renderItem={([k, r]) => <span className={`text-[11px] font-medium px-2 py-1 rounded ${r.cls}`}>{r.short}</span>}
                  getKey={([k]) => k}
                />
                <FilterGroup
                  title="Tipo de atividade"
                  items={Object.entries(TYPES)}
                  selected={filterTypes}
                  onToggle={v => setFilterTypes(filterTypes.includes(v) ? filterTypes.filter(x => x !== v) : [...filterTypes, v])}
                  renderItem={([k, t]) => <span className={`text-[11px] px-2 py-1 rounded border ${t.cls} bg-[#fdf6e8]`}>{t.label}</span>}
                  getKey={([k]) => k}
                />

                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8b6914] mb-2">Conteúdo patrocinado</div>
                  <button
                    onClick={() => setShowSponsored(!showSponsored)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between ${showSponsored ? 'bg-[#fdf6e8] border border-[#3a2c1a]/20 text-[#3a2c1a]' : 'bg-[#3a2c1a] text-[#f4ecd8]'}`}
                  >
                    <span>{showSponsored ? 'Mostrar pocket classes e simpósios satélite' : 'Ocultar conteúdo patrocinado'}</span>
                    {showSponsored ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div className="sticky bottom-0 bg-[#f4ecd8] border-t border-[#3a2c1a]/15 p-3">
                <button onClick={() => setFiltersOpen(false)} className="w-full bg-[#1a1410] text-[#f4ecd8] rounded-lg py-3 font-medium">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT MODAL */}
        {exportOpen && (
          <ExportModal
            md={buildMarkdown(SESSIONS, userData)}
            onClose={() => setExportOpen(false)}
          />
        )}

        {/* FOOTER */}
        <footer className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="ink-rule h-px mb-4 opacity-50" />
          <div className="font-serif italic text-xs text-[#8b6914]">
            memorial pessoal · seus dados ficam apenas neste navegador
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────

function MemorialField({ icon: Icon, label, hint, value, onChange, accent = '#3a2c1a' }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={11} style={{ color: accent }} />
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: accent }}>{label}</span>
      </div>
      <textarea
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => local !== value && onChange(local)}
        placeholder={hint}
        rows={2}
        className="w-full bg-[#f4ecd8] border border-[#3a2c1a]/20 rounded p-2 text-sm placeholder:text-[#8b6914]/50 placeholder:italic resize-y min-h-[44px]"
      />
    </div>
  );
}

function FilterGroup({ title, items, selected, onToggle, renderItem, getKey }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8b6914] mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => {
          const k = getKey(item);
          const isOn = selected.includes(k);
          return (
            <button
              key={k}
              onClick={() => onToggle(k)}
              className={`transition-opacity ${isOn ? 'ring-2 ring-[#1a1410] ring-offset-1 ring-offset-[#f4ecd8]' : 'opacity-60 hover:opacity-100'}`}
            >
              {renderItem(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExportModal({ md, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1a1410]/60" />
      <div
        className="relative w-full max-w-3xl mx-auto bg-[#fdf6e8] rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fadeUp 0.2s ease-out' }}
      >
        <div className="border-b border-[#3a2c1a]/15 px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-serif text-lg font-semibold">Memorial em Markdown</div>
            <div className="text-xs text-[#5c4a3a]">Cole no Obsidian, Notion, Word ou onde fizer o memorial final</div>
          </div>
          <button onClick={onClose} className="text-[#3a2c1a]"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-[11px] font-mono text-[#3a2c1a] whitespace-pre-wrap bg-[#f4ecd8] p-3 rounded border border-[#3a2c1a]/15">{md}</pre>
        </div>
        <div className="border-t border-[#3a2c1a]/15 p-3">
          <button
            onClick={copy}
            className={`w-full rounded-lg py-3 font-medium transition-colors ${copied ? 'bg-[#2c4f3a] text-[#fdf6e8]' : 'bg-[#1a1410] text-[#f4ecd8]'}`}
          >
            {copied ? '✓ Copiado para a área de transferência' : 'Copiar tudo'}
          </button>
        </div>
      </div>
    </div>
  );
}

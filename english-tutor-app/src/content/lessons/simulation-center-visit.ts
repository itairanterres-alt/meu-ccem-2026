import type { Lesson } from "../../types/course";

// Trilha acadêmica/médica: visita ao centro de simulação clínica — cenário real da
// viagem a Miami, não um roteiro genérico de turismo (hotel/restaurante).
export const simulationCenterVisitLesson: Lesson = {
  id: "lesson-simulation-center-visit-1",
  moduleId: "module-academic-medical-track",
  title: "Visita ao centro de simulação",
  description:
    "Um instrutor explica como funciona o centro de simulação clínica — a mesma situação que você vai viver em Miami.",
  kind: "listening-core",
  cefrLevel: "B1",
  sceneContext: "Visita guiada ao centro de simulação clínica da universidade",
  estimatedMinutes: 12,
  segments: [
    {
      id: "scv-1",
      text: "Welcome to our simulation center. Here, students practice clinical skills before working with real patients.",
      translation:
        "Bem-vindo ao nosso centro de simulação. Aqui, os alunos praticam habilidades clínicas antes de trabalhar com pacientes reais.",
      explanation:
        "Frase de abertura típica de visita guiada: boas-vindas + explicação do propósito do lugar.",
      pronunciationHint: "UÉL-cam tu áuar sim-iu-LÊI-chion SEN-ter",
      example: "Welcome to our teaching hospital. Here, residents rotate through every department.",
      chunks: ["Welcome to our simulation center.", "Here, students practice clinical skills", "before working with real patients."],
      connectedSpeechNote: "\"practice clinical\" tende a fundir o /s/ final com o /k/ inicial: /ˈpræktɪsˈklɪnɪkəl/.",
      vocabulary: [
        { term: "simulation center", translation: "centro de simulação" },
        { term: "clinical skills", translation: "habilidades clínicas" },
      ],
      expectedKeywords: ["welcome", "simulation", "students", "practice", "clinical", "skills"],
    },
    {
      id: "scv-2",
      text: "Each room has cameras and microphones, so instructors can review the recording during debriefing.",
      translation:
        "Cada sala tem câmeras e microfones, para que os instrutores possam revisar a gravação durante o debriefing.",
      explanation:
        "Estrutura de propósito com 'so' (para que). Muito comum em explicações institucionais.",
      pronunciationHint: "ITCH RUM RAZ KÁM-ras end MÁI-kro-fôuns",
      example: "Each session is recorded, so students can review their own performance later.",
      chunks: ["Each room has cameras and microphones,", "so instructors can review the recording", "during debriefing."],
      connectedSpeechNote: "\"has cameras\" — o /z/ de 'has' liga suavemente ao início de 'cameras'.",
      vocabulary: [
        { term: "debriefing", translation: "sessão de análise após a simulação" },
        { term: "recording", translation: "gravação" },
      ],
      expectedKeywords: ["cameras", "microphones", "instructors", "review", "debriefing"],
    },
    {
      id: "scv-3",
      text: "After each scenario, we sit together and discuss what went well and what could be improved.",
      translation:
        "Depois de cada cenário, nos sentamos juntos e discutimos o que foi bem e o que poderia ser melhorado.",
      explanation:
        "Descrição do momento de debriefing propriamente dito — vocabulário que você vai ouvir na prática, não só na teoria.",
      pronunciationHint: "ÁF-ter itch se-NÁ-rio, uí SIT tu-GUÉ-dher",
      example: "After each case, the team discusses what went well and what needs attention.",
      chunks: ["After each scenario,", "we sit together and discuss", "what went well and what could be improved."],
      connectedSpeechNote: "\"sit together\" — o /t/ duplo entre as palavras vira um som só, mais suave.",
      vocabulary: [
        { term: "scenario", translation: "cenário (situação simulada)" },
        { term: "improved", translation: "melhorado" },
      ],
      expectedKeywords: ["scenario", "discuss", "went well", "improved"],
    },
  ],
  quiz: [
    {
      id: "scv-quiz-1",
      prompt: "Para que servem as câmeras e microfones nas salas de simulação?",
      options: [
        "Para transmitir ao vivo para outras universidades",
        "Para os instrutores revisarem a gravação no debriefing",
        "Para gravar apenas os pacientes",
        "Não são mencionadas no texto",
      ],
      correctOptionIndex: 1,
      relatedSegmentId: "scv-2",
    },
  ],
};

export const postLectureQuestionsLesson: Lesson = {
  id: "lesson-post-lecture-questions-1",
  moduleId: "module-academic-medical-track",
  title: "Perguntas após uma palestra",
  description:
    "Praticar como pedir a palavra, formular uma pergunta acadêmica e agradecer a resposta — situação recorrente em qualquer visita acadêmica.",
  kind: "listening-core",
  cefrLevel: "B1",
  sceneContext: "Sessão de perguntas e respostas após uma palestra",
  estimatedMinutes: 10,
  segments: [
    {
      id: "plq-1",
      text: "Thank you for the presentation. I have a question about the assessment process.",
      translation: "Obrigado pela apresentação. Tenho uma pergunta sobre o processo de avaliação.",
      explanation:
        "Abertura educada antes de fazer a pergunta em si — agradece e sinaliza o tópico.",
      pronunciationHint: "THANK iú for dhã pre-zen-TÉI-chion",
      example: "Thank you for the talk. I have a question about the grading criteria.",
      chunks: ["Thank you for the presentation.", "I have a question", "about the assessment process."],
      connectedSpeechNote: "\"Thank you for\" costuma reduzir para algo como \"thank-yuh-fer\" na fala natural.",
      vocabulary: [
        { term: "assessment", translation: "avaliação" },
        { term: "process", translation: "processo" },
      ],
      expectedKeywords: ["thank", "question", "assessment", "process"],
    },
    {
      id: "plq-2",
      text: "Could you explain how students are evaluated during a simulation, step by step?",
      translation: "Você poderia explicar como os alunos são avaliados durante uma simulação, passo a passo?",
      explanation: "Pergunta formal com 'Could you explain...' — estrutura reutilizável em qualquer contexto acadêmico.",
      pronunciationHint: "KUD iú eks-PLÊIN RÁU STIU-dents ar í-VÁ-liu-êi-tid",
      example: "Could you explain how the residency match works, step by step?",
      chunks: ["Could you explain", "how students are evaluated during a simulation,", "step by step?"],
      connectedSpeechNote: "\"Could you\" liga-se e vira algo próximo de \"cud-jya\" na fala rápida.",
      vocabulary: [
        { term: "evaluated", translation: "avaliado" },
        { term: "step by step", translation: "passo a passo" },
      ],
      expectedKeywords: ["explain", "students", "evaluated", "simulation", "step"],
    },
    {
      id: "plq-3",
      text: "That's very helpful. Thank you for taking the time to answer my question.",
      translation: "Isso é muito útil. Obrigado por dedicar tempo para responder à minha pergunta.",
      explanation: "Fechamento educado depois da resposta — encerra a interação de forma natural.",
      pronunciationHint: "DHÁTS VÉ-ri HÉLP-ful",
      example: "That's very clear. Thank you for taking the time to explain it.",
      chunks: ["That's very helpful.", "Thank you for taking the time", "to answer my question."],
      connectedSpeechNote: "\"taking the\" — o som final de 'taking' se conecta ao artigo sem pausa perceptível.",
      vocabulary: [{ term: "helpful", translation: "útil" }],
      expectedKeywords: ["helpful", "thank", "time", "answer"],
    },
  ],
  quiz: [
    {
      id: "plq-quiz-1",
      prompt: "Qual estrutura é mais adequada para pedir uma explicação formal e detalhada?",
      options: [
        "What?",
        "Could you explain how..., step by step?",
        "I don't get it.",
        "Say that again.",
      ],
      correctOptionIndex: 1,
      relatedSegmentId: "plq-2",
    },
  ],
};

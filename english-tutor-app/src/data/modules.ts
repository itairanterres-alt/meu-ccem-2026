import type { Lesson, Module } from "../types/course";

// Lição de demonstração: "Listening Ladder", inspirada diretamente no relatório —
// mesma progressão de comprimento de frase usada no diagnóstico (achar o ponto exato
// onde a compreensão quebra), com foco em segmentação de blocos falados.
const listeningLadderLesson: Lesson = {
  id: "lesson-listening-ladder-1",
  moduleId: "module-listening-foundations",
  title: "Listening Ladder: a pergunta do aluno",
  description:
    "A mesma frase cresce em três degraus. O objetivo não é traduzir palavra por palavra, e sim reconhecer blocos de sentido.",
  kind: "listening-core",
  cefrLevel: "A2",
  estimatedMinutes: 12,
  segments: [
    {
      id: "seg-1",
      text: "The student asked a question.",
      translation: "O aluno fez uma pergunta.",
      explanation:
        "Frase-base: sujeito (the student) + verbo no passado (asked) + objeto (a question). É o bloco de sentido que se repete nos próximos degraus.",
      pronunciationHint: "dhã STIU-dent ÁSKT ã KUÉS-tchion",
      example: "The doctor asked a question during the meeting.",
      vocabulary: [
        { term: "asked", translation: "perguntou", note: "passado de 'to ask'" },
        { term: "question", translation: "pergunta" },
      ],
      expectedKeywords: ["student", "asked", "question"],
    },
    {
      id: "seg-2",
      text: "The student asked a question after the simulation.",
      translation: "O aluno fez uma pergunta depois da simulação.",
      explanation:
        "Mesmo bloco-base, com um bloco adicional de tempo/lugar (after the simulation). Treine ouvir 'after the...' como uma unidade só, sem parar em cada palavra.",
      pronunciationHint: "...ÁF-ter dhã sim-iu-LÊI-chion",
      example: "We had lunch after the lecture.",
      vocabulary: [
        { term: "after", translation: "depois de" },
        { term: "simulation", translation: "simulação" },
      ],
      expectedKeywords: ["student", "asked", "question", "after", "simulation"],
    },
    {
      id: "seg-3",
      text: "The student asked a question after the simulation because he was unsure about the diagnosis.",
      translation:
        "O aluno fez uma pergunta depois da simulação porque estava inseguro sobre o diagnóstico.",
      explanation:
        "Agora um terceiro bloco explica o motivo (because...). Se a compreensão quebrar aqui, o problema normalmente não é vocabulário — é sobrecarga de memória operacional tentando seguir três blocos em sequência.",
      pronunciationHint: "...bi-KÃZ RÍ uóz an-CHUR ã-BÁUT dhã dái-ág-NÓU-sis",
      example: "She called the professor because she was unsure about the deadline.",
      vocabulary: [
        { term: "because", translation: "porque" },
        { term: "unsure", translation: "inseguro, sem certeza" },
        { term: "diagnosis", translation: "diagnóstico" },
      ],
      expectedKeywords: ["question", "simulation", "because", "unsure", "diagnosis"],
    },
  ],
  quiz: [
    {
      id: "quiz-1",
      prompt: "No degrau 2, qual bloco foi adicionado ao final da frase-base?",
      options: ["after the simulation", "because he was unsure", "the diagnosis", "a question"],
      correctOptionIndex: 0,
      relatedSegmentId: "seg-2",
    },
    {
      id: "quiz-2",
      prompt: "\"Unsure\" no degrau 3 significa mais precisamente:",
      options: ["apressado", "inseguro / sem certeza", "curioso", "atrasado"],
      correctOptionIndex: 1,
      relatedSegmentId: "seg-3",
    },
  ],
};

const repairPhrasesLesson: Lesson = {
  id: "lesson-repair-phrases-1",
  moduleId: "module-speaking-automatization",
  title: "Reparo comunicativo: pedir repetição e ganhar tempo",
  description:
    "Frases curtas para manter uma conversa acadêmica mesmo sem entender tudo — competência que você já demonstrou espontaneamente nas primeiras sessões.",
  kind: "speaking-practice",
  cefrLevel: "A2",
  estimatedMinutes: 10,
  segments: [
    {
      id: "seg-r1",
      text: "Sorry, I missed the first part. Could you say that again?",
      translation: "Desculpe, perdi a primeira parte. Você pode repetir?",
      explanation:
        "Use quando perder o início de uma frase longa — é exatamente o padrão identificado no diagnóstico (sobrecarga no começo da frase).",
      pronunciationHint: "SÓ-ri ai MÍST dhã FERST part",
      example: "Sorry, I missed the first part. Can you repeat the question?",
      vocabulary: [{ term: "missed", translation: "perdi (não captei)" }],
      expectedKeywords: ["sorry", "missed", "part", "again"],
    },
    {
      id: "seg-r2",
      text: "Let me see if I understood you correctly.",
      translation: "Deixa eu ver se entendi corretamente.",
      explanation: "Ganha tempo para reconstruir a frase antes de responder, sem parecer que travou.",
      pronunciationHint: "LET mi SI if ai an-der-STUD iu ko-REKT-li",
      example: "Let me see if I understood you correctly — you mean the debrief happens after every case?",
      vocabulary: [{ term: "correctly", translation: "corretamente" }],
      expectedKeywords: ["understood", "correctly"],
    },
  ],
  quiz: [
    {
      id: "quiz-r1",
      prompt: "Qual frase é mais adequada quando você perdeu só o começo da fala do interlocutor?",
      options: [
        "Let me see if I understood you correctly.",
        "Sorry, I missed the first part. Could you say that again?",
        "Do you mean that...?",
        "Nice to meet you.",
      ],
      correctOptionIndex: 1,
    },
  ],
};

export const modules: Module[] = [
  {
    id: "module-listening-foundations",
    title: "Fundamentos de Listening",
    description:
      "Segmentação de blocos falados — o gargalo identificado como prioridade nº 1 no diagnóstico.",
    order: 1,
    lessonIds: [listeningLadderLesson.id],
  },
  {
    id: "module-speaking-automatization",
    title: "Automatização da Fala",
    description: "Transformar conhecimento passivo em produção oral automática, incluindo reparo comunicativo.",
    order: 2,
    lessonIds: [repairPhrasesLesson.id],
  },
];

export const lessons: Record<string, Lesson> = {
  [listeningLadderLesson.id]: listeningLadderLesson,
  [repairPhrasesLesson.id]: repairPhrasesLesson,
};

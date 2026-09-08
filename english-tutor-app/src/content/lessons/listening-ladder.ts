import type { Lesson } from "../../types/course";

// Listening Ladder: mesma frase-base cresce em 4 degraus (exatamente a progressão usada
// no diagnóstico). O motor de sessão (lesson-runtime) usa os `chunks` de cada degrau para
// a quebra adaptativa quando o aluno clica em "Não compreendi": repetir → segmentar →
// explicar → reconstruir → voltar à frase original.
export const listeningLadderLesson: Lesson = {
  id: "lesson-listening-ladder-1",
  moduleId: "module-listening-foundations",
  title: "Listening Ladder: a pergunta do aluno",
  description:
    "A mesma frase cresce em quatro degraus. O objetivo não é traduzir palavra por palavra, e sim reconhecer blocos de sentido.",
  kind: "listening-core",
  cefrLevel: "A2",
  sceneContext: "Debriefing após uma simulação clínica",
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
      chunks: ["The student", "asked", "a question"],
      connectedSpeechNote: "\"asked a\" soa quase junto: /æskt.ə/ — não são duas palavras separadas.",
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
      chunks: ["The student", "asked a question", "after the simulation"],
      connectedSpeechNote: "\"after the\" liga-se: /ˈæftɚðə/ — o 'r' final de 'after' quase desaparece antes de 'the'.",
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
      chunks: [
        "The student",
        "asked a question",
        "after the simulation",
        "because he was unsure",
        "about the diagnosis",
      ],
      connectedSpeechNote: "\"was unsure\" liga o /z/ final de 'was' ao início de 'unsure': /wʌzʌnˈʃʊr/.",
      vocabulary: [
        { term: "because", translation: "porque" },
        { term: "unsure", translation: "inseguro, sem certeza" },
        { term: "diagnosis", translation: "diagnóstico" },
      ],
      expectedKeywords: ["question", "simulation", "because", "unsure", "diagnosis"],
    },
    {
      id: "seg-4",
      text: "One of the students asked a question after the simulation because he was unsure about the diagnosis and wanted feedback from the instructor.",
      translation:
        "Um dos alunos fez uma pergunta depois da simulação porque estava inseguro sobre o diagnóstico e queria feedback do instrutor.",
      explanation:
        "Quinto bloco: 'one of the students' (não apenas 'the student') e um bloco final de propósito ('wanted feedback from the instructor'). Este é o degrau mais próximo de uma fala acadêmica real — cinco blocos em sequência.",
      pronunciationHint: "UÃN óv dhã STIU-dents... uón-tid FÍD-bak fróm dhi ÍN-strak-ter",
      example: "One of the residents asked to review the case because she wanted feedback from the attending.",
      chunks: [
        "One of the students",
        "asked a question",
        "after the simulation",
        "because he was unsure about the diagnosis",
        "and wanted feedback from the instructor",
      ],
      connectedSpeechNote: "\"one of the\" soa como um bloco só: /wʌnəvðə/ — muito comum antes de reduzir para 'wunuvthe'.",
      vocabulary: [
        { term: "feedback", translation: "retorno, devolutiva" },
        { term: "instructor", translation: "instrutor" },
      ],
      expectedKeywords: ["one", "students", "question", "simulation", "unsure", "feedback", "instructor"],
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
    {
      id: "quiz-3",
      prompt: "No degrau 4, o que o aluno queria do instrutor?",
      options: ["uma nota", "feedback", "mais tempo", "um novo caso"],
      correctOptionIndex: 1,
      relatedSegmentId: "seg-4",
    },
  ],
};

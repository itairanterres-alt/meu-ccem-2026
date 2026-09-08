import type { Lesson } from "../../types/course";

// Reparo comunicativo: as 6 frases do relatório, praticadas como blocos automáticos —
// competência que o aluno já demonstrou espontaneamente e que precisa virar reflexo.
export const repairPhrasesLesson: Lesson = {
  id: "lesson-repair-phrases-1",
  moduleId: "module-speaking-automatization",
  title: "Reparo comunicativo: sustentar a conversa",
  description:
    "Seis frases para manter uma conversa acadêmica mesmo sem entender tudo — pratique até virar automático.",
  kind: "speaking-practice",
  cefrLevel: "A2",
  sceneContext: "Conversa individual com um professor ou instrutor",
  estimatedMinutes: 10,
  segments: [
    {
      id: "seg-r1",
      text: "Sorry, I missed the first part.",
      translation: "Desculpe, perdi a primeira parte.",
      explanation:
        "Use quando perder o início de uma frase longa — é exatamente o padrão identificado no diagnóstico (sobrecarga no começo da frase).",
      pronunciationHint: "SÓ-ri ai MÍST dhã FERST part",
      example: "Sorry, I missed the first part. Can you start again?",
      chunks: ["Sorry,", "I missed the first part."],
      vocabulary: [{ term: "missed", translation: "perdi (não captei)" }],
      expectedKeywords: ["sorry", "missed", "part"],
    },
    {
      id: "seg-r2",
      text: "Could you say that again a little more slowly?",
      translation: "Você poderia repetir um pouco mais devagar?",
      explanation: "Pedido educado de repetição com controle explícito de velocidade.",
      pronunciationHint: "KUD iú SÊI dhat ã-GUÉN, ã LÍ-tel MOR SLÓU-li",
      example: "Could you say that again a little more slowly, please?",
      chunks: ["Could you say that again", "a little more slowly?"],
      vocabulary: [{ term: "slowly", translation: "devagar" }],
      expectedKeywords: ["could", "say", "again", "slowly"],
    },
    {
      id: "seg-r3",
      text: "Do you mean that...?",
      translation: "Você quer dizer que...?",
      explanation: "Confirma o entendimento antes de responder — evita responder algo errado por insegurança.",
      pronunciationHint: "DU iú MIN dhat",
      example: "Do you mean that the debrief happens right after the simulation?",
      chunks: ["Do you mean", "that...?"],
      vocabulary: [{ term: "mean", translation: "querer dizer" }],
      expectedKeywords: ["mean", "that"],
    },
    {
      id: "seg-r4",
      text: "Let me see if I understood you correctly.",
      translation: "Deixa eu ver se entendi corretamente.",
      explanation: "Ganha tempo para reconstruir a frase antes de responder, sem parecer que travou.",
      pronunciationHint: "LET mi SI if ai an-der-STUD iu ko-REKT-li",
      example: "Let me see if I understood you correctly — you mean the debrief happens after every case?",
      chunks: ["Let me see", "if I understood you correctly."],
      vocabulary: [{ term: "correctly", translation: "corretamente" }],
      expectedKeywords: ["understood", "correctly"],
    },
    {
      id: "seg-r5",
      text: "Could you repeat the last part?",
      translation: "Você poderia repetir a última parte?",
      explanation: "Variação do pedido de repetição, focado especificamente no final da frase.",
      pronunciationHint: "KUD iú ri-PÍT dhã LÁST part",
      example: "Could you repeat the last part? I lost you after 'debriefing'.",
      chunks: ["Could you repeat", "the last part?"],
      vocabulary: [{ term: "repeat", translation: "repetir" }],
      expectedKeywords: ["repeat", "last", "part"],
    },
    {
      id: "seg-r6",
      text: "I understood the general idea, but I missed some details.",
      translation: "Entendi a ideia geral, mas perdi alguns detalhes.",
      explanation:
        "Sinaliza compreensão parcial — muito mais preciso do que simplesmente dizer 'I don't understand'.",
      pronunciationHint: "ai an-der-STUD dhã JÉ-ne-ral ai-DÍA, bat ai MÍST sam DÍ-têils",
      example: "I understood the general idea, but I missed some details about the schedule.",
      chunks: ["I understood the general idea,", "but I missed some details."],
      vocabulary: [
        { term: "general idea", translation: "ideia geral" },
        { term: "details", translation: "detalhes" },
      ],
      expectedKeywords: ["understood", "general", "idea", "missed", "details"],
    },
  ],
  quiz: [
    {
      id: "quiz-r1",
      prompt: "Qual frase é mais adequada quando você perdeu só o começo da fala do interlocutor?",
      options: [
        "Let me see if I understood you correctly.",
        "Sorry, I missed the first part.",
        "Do you mean that...?",
        "I understood the general idea, but I missed some details.",
      ],
      correctOptionIndex: 1,
    },
    {
      id: "quiz-r2",
      prompt: "Qual frase sinaliza compreensão parcial, não compreensão zero?",
      options: [
        "Could you repeat the last part?",
        "I understood the general idea, but I missed some details.",
        "Sorry, I missed the first part.",
        "Could you say that again a little more slowly?",
      ],
      correctOptionIndex: 1,
    },
  ],
};

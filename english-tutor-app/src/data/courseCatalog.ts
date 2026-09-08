import type { Lesson, Module } from "../types/course";
import {
  listeningLadderLesson,
  repairPhrasesLesson,
  simulationCenterVisitLesson,
  postLectureQuestionsLesson,
} from "../content/lessons";

// Catálogo do curso: agrupa o conteúdo de content/lessons em módulos. Este arquivo é
// puramente estrutural — o conteúdo pedagógico de cada lição vive em content/lessons/.
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
    id: "module-academic-medical-track",
    title: "Trilha Acadêmica e Clínica",
    description:
      "Situações reais da visita a Miami: centro de simulação, palestras e interação com professores.",
    order: 2,
    lessonIds: [simulationCenterVisitLesson.id, postLectureQuestionsLesson.id],
  },
  {
    id: "module-speaking-automatization",
    title: "Automatização da Fala",
    description: "Transformar conhecimento passivo em produção oral automática, incluindo reparo comunicativo.",
    order: 3,
    lessonIds: [repairPhrasesLesson.id],
  },
];

export const lessons: Record<string, Lesson> = {
  [listeningLadderLesson.id]: listeningLadderLesson,
  [simulationCenterVisitLesson.id]: simulationCenterVisitLesson,
  [postLectureQuestionsLesson.id]: postLectureQuestionsLesson,
  [repairPhrasesLesson.id]: repairPhrasesLesson,
};

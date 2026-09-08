import { useState } from "react";
import { LearnerProvider } from "./state/LearnerContext";
import { AppShell, type View } from "./components/layout/AppShell";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ModuleList } from "./components/course/ModuleList";
import { LessonList } from "./components/course/LessonList";
import { LessonEngine } from "./components/lesson-engine/LessonEngine";
import { LedgerPanel } from "./components/ledger/LedgerPanel";
import { modules, lessons } from "./data/courseCatalog";
import "./styles/app.css";

type CourseSelection = { moduleId: string | null; lessonId: string | null };

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [selection, setSelection] = useState<CourseSelection>({ moduleId: null, lessonId: null });

  function openLesson(lessonId: string) {
    const lesson = lessons[lessonId];
    if (!lesson) return;
    setSelection({ moduleId: lesson.moduleId, lessonId });
    setView("modules");
  }

  const activeLesson = selection.lessonId ? lessons[selection.lessonId] : null;
  const activeModule = selection.moduleId ? modules.find((m) => m.id === selection.moduleId) : null;

  return (
    <LearnerProvider>
      <AppShell
        activeView={view}
        onNavigate={(v) => {
          setView(v);
          if (v !== "modules") setSelection({ moduleId: null, lessonId: null });
        }}
      >
        {view === "dashboard" && <Dashboard onOpenLesson={openLesson} />}

        {view === "modules" && !activeModule && (
          <ModuleList
            modules={modules}
            onSelectModule={(moduleId) => setSelection({ moduleId, lessonId: null })}
          />
        )}

        {view === "modules" && activeModule && !activeLesson && (
          <LessonList
            module={activeModule}
            onSelectLesson={(lessonId) => setSelection({ moduleId: activeModule.id, lessonId })}
            onBack={() => setSelection({ moduleId: null, lessonId: null })}
          />
        )}

        {view === "modules" && activeModule && activeLesson && (
          <LessonEngine
            lesson={activeLesson}
            allLessonIds={Object.keys(lessons)}
            onExit={() => setSelection({ moduleId: activeModule.id, lessonId: null })}
          />
        )}

        {view === "ledger" && <LedgerPanel />}
      </AppShell>
    </LearnerProvider>
  );
}

export default App;

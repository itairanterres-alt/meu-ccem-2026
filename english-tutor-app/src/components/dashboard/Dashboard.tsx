import { useLearner } from "../../state/LearnerContext";
import { modules } from "../../data/courseCatalog";
import { ProfileCard } from "./ProfileCard";
import { ProgressOverview } from "./ProgressOverview";
import { RecommendationsPanel } from "./RecommendationsPanel";

interface Props {
  onOpenLesson: (lessonId: string) => void;
}

export function Dashboard({ onOpenLesson }: Props) {
  const { profile, progress, ledger } = useLearner();

  return (
    <div className="dashboard">
      <ProfileCard profile={profile} />
      <ProgressOverview progress={progress} modules={modules} />
      <RecommendationsPanel recommendations={ledger.recommendations} onOpenLesson={onOpenLesson} />
    </div>
  );
}

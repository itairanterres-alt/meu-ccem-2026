import type { StudentProfile } from "../../types/learner";

const SKILL_LABELS: Record<string, string> = {
  listening: "Listening",
  speaking: "Speaking",
  vocabulary: "Vocabulário",
  grammar: "Gramática",
};

export function ProfileCard({ profile }: { profile: StudentProfile }) {
  return (
    <section className="card profile-card">
      <div className="profile-card__header">
        <div className="profile-card__avatar">{profile.name.charAt(0)}</div>
        <div>
          <h2>{profile.name}</h2>
          <p className="profile-card__goal">{profile.shortTermGoal}</p>
          {profile.goalDate && (
            <p className="profile-card__date">Meta: {new Date(profile.goalDate).toLocaleDateString("pt-BR")}</p>
          )}
        </div>
      </div>

      <div className="profile-card__skills">
        {Object.entries(profile.skillLevels).map(([area, level]) => (
          <div key={area} className="skill-bar">
            <div className="skill-bar__label">
              <span>{SKILL_LABELS[area] ?? area}</span>
              <span>{level}%</span>
            </div>
            <div className="skill-bar__track">
              <div className="skill-bar__fill" style={{ width: `${level}%` }} />
            </div>
          </div>
        ))}
      </div>

      {profile.notes && <p className="profile-card__notes">{profile.notes}</p>}
    </section>
  );
}

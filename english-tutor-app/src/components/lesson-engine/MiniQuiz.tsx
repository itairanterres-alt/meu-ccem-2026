import { useState } from "react";
import type { MiniQuizQuestion } from "../../types/course";

interface Props {
  questions: MiniQuizQuestion[];
  onFinish: (score: number) => void;
}

export function MiniQuiz({ questions, onFinish }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    setSubmitted(true);
    const correct = questions.filter((q) => answers[q.id] === q.correctOptionIndex).length;
    onFinish(questions.length > 0 ? correct / questions.length : 1);
  }

  return (
    <div className="mini-quiz">
      <h3>Prática final</h3>
      {questions.map((q) => (
        <fieldset key={q.id} className="mini-quiz__question">
          <legend>{q.prompt}</legend>
          {q.options.map((option, idx) => {
            const isSelected = answers[q.id] === idx;
            const isCorrect = idx === q.correctOptionIndex;
            const showFeedback = submitted;
            return (
              <label
                key={idx}
                className={
                  "mini-quiz__option" +
                  (showFeedback && isSelected && isCorrect ? " is-correct" : "") +
                  (showFeedback && isSelected && !isCorrect ? " is-wrong" : "")
                }
              >
                <input
                  type="radio"
                  name={q.id}
                  disabled={submitted}
                  checked={isSelected}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                />
                {option}
              </label>
            );
          })}
        </fieldset>
      ))}

      {!submitted && (
        <button
          className="btn btn--primary"
          onClick={submit}
          disabled={Object.keys(answers).length < questions.length}
        >
          Enviar respostas
        </button>
      )}
    </div>
  );
}

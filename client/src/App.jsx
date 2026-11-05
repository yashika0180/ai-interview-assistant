import { useEffect, useState } from "react";
import "./App.css";

const questions = {
  default: [
    "Tell me about yourself.",
    "What are your greatest strengths?",
    "Why should we hire you?",
  ],
  software: [
    "Tell me about a project you built.",
    "What is the difference between let and const in JavaScript?",
    "How would you debug a slow application?",
  ],
  data: [
    "Tell me about a data analysis project.",
    "What is the difference between SQL and NoSQL?",
    "How would you handle missing data?",
  ],
};

function App() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("interviewFeedback") || "[]");
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem("interviewFeedback", JSON.stringify(savedFeedback));
}, [savedFeedback]);

  const getQuestions = () => {
    const job = role.toLowerCase();

    if (job.includes("software") || job.includes("developer")) {
      return questions.software;
    }

    if (job.includes("data")) {
      return questions.data;
    }

    return questions.default;
  };

  const currentQuestions = getQuestions();
const [isSubmitting, setIsSubmitting] = useState(false);

const submitAnswer = async () => {
  if (!answer.trim() || isSubmitting) return;

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:3001/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: currentQuestions[questionIndex],
        answer,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not get feedback.");
    }

    const cleanFeedback = data.feedback
      .replace(/^Here is your feedback:\s*/i, "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/^\s*[-*_]{3,}\s*$/gm, "")
      .replace(/^\s*>\s?/gm, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");

    setFeedback(cleanFeedback);

    setSavedFeedback((previous) => [
      ...previous,
      {
        role,
        question: currentQuestions[questionIndex],
        answer,
        feedback: cleanFeedback,
        savedAt: new Date().toISOString(),
      },
    ]);

    setAnswers((previous) => [...previous, answer]);
    setAnswer("");
    setQuestionIndex((previous) => previous + 1);
  } catch (error) {
    console.error(error);
    setFeedback(
      "AI feedback abhi available nahi hai. Aap Next Question ya Practice Again se continue kar sakte hain."
    );
    setAnswers((previous) => [...previous, answer]);
    setAnswer("");
    setQuestionIndex((previous) => previous + 1);
  } finally {
    setIsSubmitting(false);
  }
};

const restart = () => {
  setStarted(false);
  setQuestionIndex(0);
  setAnswer("");
  setAnswers([]);
  setFeedback("");
};

return (
    <div className="app">
      <header>
        <h1>InterviewAI</h1>
        <p>Your personal interview coach</p>
      </header>

      <main>
        {!started ? (
          <>
            <h2>Prepare for your next interview</h2>
            <p>Practice answering interview questions.</p>

            <div className="setup">
              <label>Job Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
              />

              <label>Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Select your experience</option>
                <option>Fresher</option>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </select>

              <button
                disabled={!role.trim() || !level}
                onClick={() => setStarted(true)}
              >
                Start Interview
              </button>
            </div>
          </>
        ) : questionIndex < currentQuestions.length ? (
          <div className="interview">
            <p>
              Question {questionIndex + 1} of {currentQuestions.length}
            </p>

            <h2>{currentQuestions[questionIndex]}</h2>
            {feedback && <p>{feedback}</p>}

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />

            <button
  disabled={!answer.trim() || isSubmitting}
  onClick={submitAnswer}
>
  {isSubmitting ? "Submitting..." : "Submit Answer"}
</button>
          </div>
        ) : (
          <div className="interview">
            <h2>Interview Completed!</h2>
            <p>You answered all {answers.length} questions.</p>

            {answers.map((item, index) => (
              <div key={index}>
                <h3>Answer {index + 1}</h3>
                <p>{item}</p>
              </div>
            ))}

            <button onClick={restart}>Practice Again</button>
          </div>
        )}
        <section className="saved-feedback">
  <h2>Saved Feedback</h2>

  {savedFeedback.length === 0 ? (
    <p>No saved feedback yet.</p>
  ) : (
    savedFeedback.map((item, index) => (
      <div key={index}>
        <h3>{item.role} — {item.question}</h3>
        <p><strong>Your answer:</strong> {item.answer}</p>
        <p><strong>Feedback:</strong> {item.feedback}</p>
      </div>
    ))
  )}
</section>
      </main>
    </div>
  );
}

export default App;
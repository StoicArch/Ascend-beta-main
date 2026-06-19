import { useEffect, useState } from "react";
import "./AppTour.css";

const steps = [
  {
    target: "tour-program-card",
    text: "This is your current transformation. If you haven't started a program yet, tap here first.",
  },
  {
    target: "tour-programs",
    text: "Every workout, calorie target and progression starts from a program.",
  },
  {
    target: "tour-start-workout",
    text: "This is where you'll spend most of your time. Complete workouts to progress through your program.",
  },
  {
    target: "tour-nutrition",
    text: "Scan meals with AI. ASCEND automatically tracks calories, protein, carbs and fats.",
  },
  {
    target: "tour-weekly-review",
    text: "Every week ASCEND reviews your progress and tells you if you're on track.",
  },
  {
    target: "tour-ai-nav",
    text: "Ask questions about training, nutrition and recovery.",
  },
  {
    target: "tour-recovery",
    text: "Recovery measures readiness to train. Higher recovery means you can push harder.",
  },
  {
    target: "tour-weight",
    text: "Log your bodyweight regularly. ASCEND uses this to track progress.",
  },
];

export default function AppTour({onFinish}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("ascendTourCompleted") === "true") {
      setStep(-1);
    }
  }, []);

  useEffect(() => {
  if (step < 0) return;

  document
    .querySelectorAll(".tour-highlight")
    .forEach((el) =>
      el.classList.remove("tour-highlight")
    );

  const timer = setTimeout(() => {
    const target = document.getElementById(
      steps[step]?.target
    );

    if (!target) {
      console.log(
        "Tour target missing:",
        steps[step]?.target
      );
      return;
    }

    target.classList.add("tour-highlight");

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 300);

  return () => clearTimeout(timer);
}, [step]);

  if (step < 0) return null;

 const finishTour = () => {
  document
    .querySelectorAll(".tour-highlight")
    .forEach((el) =>
      el.classList.remove("tour-highlight")
    );

  if (onFinish) {
    onFinish();
  }

  setStep(-1);
};

  return (
    <>
      <div className="tour-overlay" />

      <div className="tour-box">
        <p>{steps[step].text}</p>

        <div className="tour-actions">
          <button onClick={finishTour}>
            Skip
          </button>

          <button
            onClick={() => {
              if (step === steps.length - 1) {
                finishTour();
              } else {
                setStep(step + 1);
              }
            }}
          >
            {step === steps.length - 1
              ? "Finish"
              : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}
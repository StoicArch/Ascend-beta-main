import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import UserProfileEngine from "../../engine/UserProfileEngine";

import StepHeader from "./components/StepHeader";
import GoalCard from "./components/GoalCard";
import ExperienceCard from "./components/ExperienceCard";

import {
  EXPERIENCE_LEVELS,
  GOALS,
  EQUIPMENT,
  MUSCLE_GROUPS,
  DAYS,
} from "./OnboardingData";

export default function Onboarding() {

  const navigate = useNavigate();

  const TOTAL_STEPS = 10;

  const [step, setStep] = useState(1);


  const [data, setData] = useState({
    name: "",
    gender: "",
    goal: "",
    experience: "",
    location: "",
    equipment: [],
    splitMode: "",
    recovery: "",
    stress: "",
    sleepQuality: "",
    weeklyPlan: {},
  });


  const isStepValid = () => {
  if (step === 1) return data.name.trim().length > 1;
  if (step === 2) return data.gender;
  if (step === 3) return data.goal;
  if (step === 4) return data.experience;
  if (step === 5) return data.location;
  if (step === 6) return data.equipment.length > 0;
  if (step === 7) return data.splitMode;

  if (step === 8 && data.splitMode === "Custom") {
    return Object.keys(data.weeklyPlan).length > 0;
  }

  if (step === 9) return data.recovery;

  return true;
};

  // =========================
  // NAVIGATION
  // =========================

  const next = () => {
  if (!isStepValid()) {
    alert("Please complete this step before continuing.");
    return;
  }

  if (step === 7 && data.splitMode === "AI") {
    setStep(9);
    return;
  }

  if (step < TOTAL_STEPS) {
    setStep(step + 1);
  }
};

  const back = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // =========================
  // EQUIPMENT TOGGLE
  // =========================

  const toggleEquipment = (item) => {

    const exists = data.equipment.includes(item);

    if (exists) {
      setData({
        ...data,
        equipment: data.equipment.filter(
          (i) => i !== item
        ),
      });
    } else {
      setData({
        ...data,
        equipment: [...data.equipment, item],
      });
    }
  };

  // =========================
  // SPLIT TOGGLE
  // =========================

  const toggleMuscleGroup = (
    day,
    group,
    subdivision = null
  ) => {

    const currentDay =
      data.weeklyPlan[day] || {};

    const currentGroup =
      currentDay[group] || [];

    // PARENT SELECT
    if (!subdivision) {

      const allSubdivisions =
        MUSCLE_GROUPS[group];

      const allSelected =
        currentGroup.length ===
        allSubdivisions.length;

      const updated = {
        ...data.weeklyPlan,

        [day]: {
          ...currentDay,

          [group]: allSelected
            ? []
            : allSubdivisions,
        },
      };

      setData({
        ...data,
        weeklyPlan: updated,
      });

      return;
    }

    // SUBDIVISION SELECT

    let updatedSubdivisions = [];

    if (
      currentGroup.includes(subdivision)
    ) {
      updatedSubdivisions =
        currentGroup.filter(
          (item) =>
            item !== subdivision
        );
    } else {
      updatedSubdivisions = [
        ...currentGroup,
        subdivision,
      ];
    }

    const updated = {
      ...data.weeklyPlan,

      [day]: {
        ...currentDay,

        [group]: updatedSubdivisions,
      },
    };

    setData({
      ...data,
      weeklyPlan: updated,
    });
  };


  // =========================
// AI PLAN GENERATOR
// =========================

const generatePlan = () => {
  if (data.splitMode !== "AI") {
    return data.weeklyPlan;
  }

  if (data.goal === "Muscle Gain" || data.goal === "Build Muscle") {
    return {
      Monday: {
        Chest: ["Upper Chest"],
        Shoulders: ["Front Delts", "Side Delts"],
        Triceps: ["Long Head"],
      },
      Tuesday: {
        Back: ["Lats", "Upper Back"],
        Biceps: ["Long Head"],
      },
      Wednesday: {
        Legs: ["Quads", "Hamstrings"],
        Abs: ["Abs"],
      },
      Thursday: {
        rest: true,
      },
      Friday: {
        Chest: ["Lower Chest"],
        Shoulders: ["Side Delts"],
        Triceps: ["Short Head"],
      },
      Saturday: {
        Back: ["Lats"],
        Biceps: ["Short Head"],
        Legs: ["Glutes", "Calfs"],
      },
      Sunday: {
        rest: true,
      },
    };
  }

  if (data.goal === "Fat Loss" || data.goal === "Lose Fat") {
    return {
      Monday: {
        FullBody: ["Chest", "Back", "Legs"],
      },
      Tuesday: {
        Cardio: ["Conditioning"],
      },
      Wednesday: {
        rest: true,
      },
      Thursday: {
        FullBody: ["Shoulders", "Legs", "Abs"],
      },
      Friday: {
        Cardio: ["Conditioning"],
      },
      Saturday: {
        FullBody: ["Chest", "Back", "Abs"],
      },
      Sunday: {
        rest: true,
      },
    };
  }

  return {
    Monday: {
      Chest: ["Upper Chest"],
      Back: ["Lats"],
    },
    Tuesday: {
      rest: true,
    },
    Wednesday: {
      Legs: ["Quads", "Hamstrings"],
    },
    Thursday: {
      rest: true,
    },
    Friday: {
      Shoulders: ["Side Delts"],
      Biceps: ["Biceps"],
      Triceps: ["Triceps"],
    },
    Saturday: {
      Abs: ["Abs"],
    },
    Sunday: {
      rest: true,
    },
  };
};


  // =========================
  // FINISH
  // =========================
const finish = () => {

  const weeklyPlan =
    data.splitMode === "AI" ? generatePlan() : data.weeklyPlan;

  const trainingDays = Object.values(weeklyPlan).filter(
    (day) => day && !day.rest
  ).length;

  const normalizedGoal =
    data.goal === "Muscle Gain"
      ? "Build Muscle"
      : data.goal === "Fat Loss"
      ? "Lose Fat"
      : data.goal || "Build Muscle";

  const finalData = {
    ...data,
    goal: normalizedGoal,
    weeklyPlan,
  };

  const profile = {
    name: data.name || "",
    goal: normalizedGoal,
    weight: 70,
    trainingDays,
    sleep:
      data.sleepQuality === "Poor"
        ? 5
        : data.sleepQuality === "Average"
        ? 7
        : 8,
    calories: 2400,
    protein: 160,
    gender: data.gender,
    experience: data.experience,
    location: data.location,
    equipment: data.equipment,
    recovery: data.recovery,
    stress: data.stress,
    sleepQuality: data.sleepQuality,
    splitMode: data.splitMode,
    weeklyPlan,
  };

  UserProfileEngine.saveProfile(profile);

  localStorage.setItem("ascend-user", JSON.stringify(finalData));
  localStorage.setItem("onboardingCompleted", "true");

  localStorage.removeItem("workout");
  localStorage.removeItem("workoutDate");

  setTimeout(() => {
    navigate("/dashboard");
  }, 1200);
};


  return (

    <div className="onboarding">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <StepHeader
        current={step}
        total={TOTAL_STEPS}
        title="Build Your Fitness System"
        subtitle="Personalize ASCEND to your training style."
      />

      {/* ========================= */}
      {/* STEP 1 */}
      {/* ========================= */}

      {step === 1 && (

        <div className="screen fade-in">

          <div className="hero-card">

            <h1>
              Build The Best Version Of Yourself
            </h1>

            <p>
              AI-powered training designed
              around your goals,
              recovery, and split.
            </p>

            <input
              type="text"
              placeholder="Enter your name"
              value={data.name}
              onChange={(e) =>
                setData({
                  ...data,
                  name: e.target.value,
                })
              }
            />

            <button
              className="primary-btn"
              onClick={next}
            >
              Continue
            </button>

          </div>

        </div>
      )}
      

      {/* ========================= */}
      {/* STEP 2 */}
      {/* ========================= */}

      {step === 2 && (

        <div className="screen fade-in">

          <h1>
            What's Your Gender?
          </h1>

          <div className="goal-grid">

            {["Male", "Female"].map(
              (gender) => (

                <GoalCard
                  key={gender}
                  title={gender}
                  active={
                    data.gender === gender
                  }
                  onClick={() =>
                    setData({
                      ...data,
                      gender,
                    })
                  }
                />

              )
            )}

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}


      {/* ========================= */}
      {/* STEP 3 */}
      {/* ========================= */}

      {step === 3 && (

        <div className="screen fade-in">

          <h1>What's Your Goal?</h1>

          <div className="goal-grid">

            {GOALS.map((goal) => (

              <GoalCard
                key={goal}
                title={goal}
                active={
                  data.goal === goal
                }
                onClick={() =>
                  setData({
                    ...data,
                    goal,
                  })
                }
              />

            ))}

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* STEP 4 */}
      {/* ========================= */}

      {step === 4 && (

        <div className="screen fade-in">

          <h1>
            What's Your Experience Level?
          </h1>

          <div className="experience-grid">

            {EXPERIENCE_LEVELS.map(
              (level) => (

                <ExperienceCard
                  key={level.title}
                  level={level.title}
                  years={level.years}
                  description={
                    level.description
                  }
                  active={
                    data.experience ===
                    level.title
                  }
                  onClick={() =>
                    setData({
                      ...data,
                      experience:
                        level.title,
                    })
                  }
                />

              )
            )}

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* STEP 5 */}
      {/* ========================= */}

      {step === 5 && (

        <div className="screen fade-in">

          <h1>
            Where Do You Train?
          </h1>

          <div className="goal-grid">

            {[
              "Gym",
              "Home",
            ].map((location) => (

              <GoalCard
                key={location}
                title={location}
                active={
                  data.location ===
                  location
                }
                onClick={() =>
                  setData({
                    ...data,
                    location,
                  })
                }
              />

            ))}

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* STEP 6 */}
      {/* ========================= */}

      {step === 6 && (

        <div className="screen fade-in">

          <h1>
            What Equipment Do You workout with?
          </h1>

          <div className="equipment-grid">

            {EQUIPMENT.map((item) => (

              <div
                key={item}
                className={`equipment-card ${
                  data.equipment.includes(
                    item
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleEquipment(item)
                }
              >

                <input
                  type="checkbox"
                  checked={data.equipment.includes(
                    item
                  )}
                  readOnly
                />

                <span>{item}</span>

              </div>

            ))}

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* STEP 7 */}
      {/* ========================= */}

      {step === 7 && (

        <div className="screen fade-in">

          <h1>
            How Should Your Plan Be Built?
          </h1>

          <div className="goal-grid">

            <GoalCard
              title="AI Builds My Plan"
              active={
                data.splitMode === "AI"
              }
              onClick={() =>
                setData({
                  ...data,
                  splitMode: "AI",
                })
              }
            />

            <GoalCard
              title="I Build My Own Split"
              active={
                data.splitMode ===
                "Custom"
              }
              onClick={() =>
                setData({
                  ...data,
                  splitMode: "Custom",
                })
              }
            />

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}

     {/* ========================= */}
{/* STEP 8 */}
{/* ========================= */}

{step === 8 && (

  <div className="screen fade-in split-builder">

    <h1>
      Build Your Weekly Split
    </h1>

    <p className="split-subtext">
      Select what you train each day.
      You can choose multiple muscle groups,
      subdivisions, or set the day as rest.
    </p>

    {DAYS.map((day) => {

      const currentDay =
        data.weeklyPlan[day] || {};

      const isRestDay =
        currentDay.rest || false;

      return (

        <div
          key={day}
          className="day-card"
        >

          {/* DAY HEADER */}

          <div className="day-top">

            <h2>{day}</h2>

            <label className="rest-toggle">

              <input
                type="checkbox"
                checked={isRestDay}
                onChange={() => {

                  const updated = {
                    ...data.weeklyPlan,

                    [day]: {
                      rest: !isRestDay,
                    },
                  };

                  setData({
                    ...data,
                    weeklyPlan: updated,
                  });
                }}
              />

              Rest Day

            </label>

          </div>

          {/* REST DAY */}

          {isRestDay ? (

            <div className="rest-box">
              Recovery Day Selected
            </div>

          ) : (

            <>
              {Object.entries(
                MUSCLE_GROUPS
              ).map(
                ([group, subs]) => {

                  const current =
                    currentDay[group] || [];

                  const expanded =
                    currentDay[
                      `${group}-expanded`
                    ] || false;

                  const allSelected =
                    current.length ===
                    subs.length;

                  return (

                    <div
                      key={group}
                      className="muscle-group"
                    >

                      {/* GROUP HEADER */}

                      <div
                        className="group-header"
                        onClick={() => {

                          const updated = {
                            ...data.weeklyPlan,

                            [day]: {
                              ...currentDay,

                              [`${group}-expanded`]:
                                !expanded,
                            },
                          };

                          setData({
                            ...data,
                            weeklyPlan: updated,
                          });
                        }}
                      >

                        <div className="group-left">

                          <input
                            type="checkbox"
                            checked={
                              allSelected
                            }
                            onChange={(e) => {

                              e.stopPropagation();

                              toggleMuscleGroup(
                                day,
                                group
                              );
                            }}
                          />

                          <span>
                            {group}
                          </span>

                        </div>

                        <span className="dropdown-icon">
                          {expanded
                            ? "−"
                            : "+"}
                        </span>

                      </div>

                      {/* SUBDIVISIONS */}

                      {expanded && (

                        <div className="subdivision-grid">

                          {subs.map((sub) => (

                            <label
                              key={sub}
                              className="subdivision"
                            >

                              <input
                                type="checkbox"
                                checked={current.includes(
                                  sub
                                )}
                                onChange={() =>
                                  toggleMuscleGroup(
                                    day,
                                    group,
                                    sub
                                  )
                                }
                              />

                              {sub}

                            </label>

                          ))}

                        </div>

                      )}

                    </div>

                  );
                }
              )}
            </>
          )}

        </div>

      );
    })}

    <div className="buttons">

      <button onClick={back}>
        Back
      </button>

      <button onClick={next}>
        Continue
      </button>

    </div>

  </div>

)}

      {/* ========================= */}
      {/* STEP 9 */}
      {/* ========================= */}

      {step === 9 && (

        <div className="screen fade-in">

          <h1>
            Recovery Profile
          </h1>

          <div className="goal-grid">

            {[
              "Poor Recovery",
              "Average Recovery",
              "Elite Recovery",
            ].map((item) => (

              <GoalCard
                key={item}
                title={item}
                active={
                  data.recovery ===
                  item
                }
                onClick={() =>
                  setData({
                    ...data,
                    recovery: item,
                  })
                }
              />

            ))}

          </div>

          <div className="buttons">

            <button onClick={back}>
              Back
            </button>

            <button onClick={next}>
              Continue
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* STEP 10 */}
      {/* ========================= */}

      {step === 10 && (

        <div className="screen fade-in">

          <h1>
            Your System Is Ready
          </h1>

          <div className="summary-card">

            <h2>{data.name}</h2>

            <p>
              Goal:
              {" "}
              {data.goal}
            </p>

            <p>
              Experience:
              {" "}
              {data.experience}
            </p>

            <p>
              Training:
              {" "}
              {data.location}
            </p>

          </div>

          <button
            className="finish-btn"
            onClick={finish}
          >
            Enter ASCEND
          </button>

        </div>
      )}

    </div>
  );
}
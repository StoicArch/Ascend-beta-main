import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import UserProfileEngine from "../../engine/UserProfileEngine";

import StepHeader from "./components/StepHeader";
import GoalCard from "./components/GoalCard";
import ExperienceCard from "./components/ExperienceCard";
import NutritionEngine from "../../engine/NutritionEngine";

import {
  EXPERIENCE_LEVELS,
  GOALS,
  EQUIPMENT,
  MUSCLE_GROUPS,
  DAYS,
} from "./OnboardingData";

export default function Onboarding() {

  const navigate = useNavigate();

  const TOTAL_STEPS = 12;

  const [step, setStep] = useState(1);


  const [data, setData] = useState({
  name: "",
  gender: "",
  age: "",
  weight: "",
  goalWeight: "",
  goal: "",
    experience: "",
    location: "",
    equipment: [],
    splitMode: "",
    recovery: "",
    stress: "",
    sleepQuality: "",
    weeklyPlan: {},
    weakMuscles: [],
  });


  const isStepValid = () => {
  if (step === 1) return data.name.trim().length > 1;
  if (step === 2) return data.gender;
  if (step === 3) return data.goal;
  if (step === 4)
  return (
    data.age > 0 &&
    data.weight > 0
  );

if (step === 5)
  return data.goalWeight > 0;
  if (step === 6) return data.experience;
  if (step === 7) return data.location;
  if (step === 8) return data.equipment.length > 0;
  if (step === 9) return data.splitMode;

  if (step === 10 && data.splitMode === "Custom") {
    return Object.keys(data.weeklyPlan).length > 0;
  }

 if (step === 11) return true;

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

  if (
    step === 9 &&
    data.splitMode === "AI"
  ) {
    setStep(11);
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
  const weak = data.weakMuscles || [];

  const focusMap = {
    "Upper Chest": "Chest",
    "Mid Chest": "Chest",
    "Lower Chest": "Chest",

    "Lats": "Back",
    "Upper Back": "Back",
    "Lower Back": "Back",
    "Traps": "Back",

    "Front Delts": "Shoulders",
    "Side Delts": "Shoulders",
    "Rear Delts": "Shoulders",

    "Biceps": "Biceps",
    "Triceps": "Triceps",
    "Forearms": "Forearms",

    "Quads": "Legs",
    "Hamstrings": "Legs",
    "Glutes": "Legs",
    "Calves": "Legs",

    "Abs": "Abs",
    "Obliques": "Abs",
    "Neck": "Neck",
  };

  const priorityFocus = [
    ...new Set(
      weak
        .map((muscle) => focusMap[muscle])
        .filter(Boolean)
    ),
  ];

  if (priorityFocus.length === 0) {
    return {
      Monday: {
        focus: ["Chest", "Triceps"],
      },

      Tuesday: {
        focus: ["Back", "Biceps"],
      },

      Wednesday: {
        focus: ["Legs"],
      },

      Thursday: {
        focus: ["Shoulders", "Abs"],
      },

      Friday: {
        focus: ["Chest", "Back"],
      },

      Saturday: {
        focus: ["Arms", "Abs"],
      },

      Sunday: {
        rest: true,
      },
    };
  }

  return {
    Monday: {
      focus: priorityFocus,
    },

    Tuesday: {
      focus: ["Back", "Biceps"],
    },

    Wednesday: {
      focus: ["Legs"],
    },

    Thursday: {
      focus: priorityFocus,
    },

    Friday: {
      focus: ["Chest", "Shoulders", "Triceps"],
    },

    Saturday: {
      focus: ["Back", "Abs"],
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
  const generatedPlan =
    data.splitMode === "AI"
      ? generatePlan()
      : data.weeklyPlan;

  const trainingDays = Object.values(
    generatedPlan
  ).filter(
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
    weeklyPlan: generatedPlan,
  };

  const nutrition =
    NutritionEngine.getProgramNutrition({
      goal: normalizedGoal,
      weight: Number(data.weight),
      goalWeight: Number(
        data.goalWeight
      ),
      trainingDays,
    });

  const profile = {
    name: data.name || "",
    goal: normalizedGoal,

    age: Number(data.age),

    weight: Number(data.weight),

    goalWeight: Number(
      data.goalWeight
    ),

    trainingDays,

    sleep:
      data.sleepQuality === "Poor"
        ? 5
        : data.sleepQuality ===
          "Average"
        ? 7
        : 8,

    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,

    nutritionPhase:
      nutrition.nutritionPhase,

    nutritionNote:
      nutrition.nutritionNote,

    weeklyTargetChange:
      nutrition.weeklyTargetChange,

    estimatedWeeksToGoal:
      nutrition.estimatedWeeksToGoal,

    maintenanceCalories:
      nutrition.maintenanceCalories,

    gender: data.gender,
    experience: data.experience,
    location: data.location,
    equipment: data.equipment,

    recovery: data.recovery,
    stress: data.stress,
    sleepQuality:
      data.sleepQuality,

    splitMode: data.splitMode,

    weeklyPlan: generatedPlan,

    weakMuscles:
      data.weakMuscles || [],
  };

  UserProfileEngine.saveProfile(
    profile
  );

  localStorage.setItem(
    "ascend-user",
    JSON.stringify(finalData)
  );

  localStorage.setItem(
    "onboardingCompleted",
    "true"
  );

  localStorage.removeItem(
    "workout"
  );

  localStorage.removeItem(
    "workoutDate"
  );

  setTimeout(() => {
    const pendingProgram =
      localStorage.getItem(
        "pendingProgram"
      );

    if (pendingProgram) {
      localStorage.removeItem(
        "pendingProgram"
      );

      navigate(
        `/program-setup/${pendingProgram}`
      );

      return;
    }

    navigate("/dashboard");
  }, 1200);
};

const previewPlan =
  data.splitMode === "AI"
    ? generatePlan()
    : data.weeklyPlan;

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
      {step === 4 && (

<div className="screen fade-in">

<h1>Your Body Stats</h1>

<p>
Used to calculate calories,
protein and progress.
</p>

<input
type="number"
placeholder="Age"
value={data.age}
onChange={(e)=>
setData({
...data,
age:e.target.value
})
}
/>

<input
type="number"
placeholder="Current Weight (kg)"
value={data.weight}
onChange={(e)=>
setData({
...data,
weight:e.target.value
})
}
/>

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

{step === 5 && (

<div className="screen fade-in">

<h1>Your Target Weight</h1>

<p>
What weight are you trying
to reach?
</p>

<input
type="number"
placeholder="Goal Weight (kg)"
value={data.goalWeight}
onChange={(e)=>
setData({
...data,
goalWeight:e.target.value
})
}
/>

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
      {/* STEP 7 */}
      {/* ========================= */}

      {step === 7 && (

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
      {/* STEP 8 */}
      {/* ========================= */}

      {step === 8 && (

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
      {/* STEP 9 */}
      {/* ========================= */}

      {step === 9 && (

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
{/* STEP 10 */}
{/* ========================= */}

{step === 10 &&
 data.splitMode === "Custom" && (

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

     {step === 11 && (

<div className="screen fade-in">

  <h1>
    Which Muscles Need The Most Work?
  </h1>

  <p className="weak-muscle-subtitle">
    ASCEND will prioritize these muscles first,
    train them twice weekly minimum,
    and increase their volume.
  </p>

  <div className="goal-grid">

    {[
  "Upper Chest",
  "Mid Chest",
  "Lower Chest",

  "Lats",
  "Upper Back",
  "Lower Back",
  "Traps",

  "Front Delts",
  "Side Delts",
  "Rear Delts",

  "Biceps",
  "Triceps",
  "Forearms",

  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",

  "Abs",
  "Obliques",
  "Neck",
].map((muscle) => (

      <GoalCard
        key={muscle}
        title={muscle}
        active={
          data.weakMuscles?.includes(muscle)
        }
        onClick={() => {

          const exists =
            data.weakMuscles?.includes(muscle);

          setData({
            ...data,
            weakMuscles: exists
              ? data.weakMuscles.filter(
                  (m) => m !== muscle
                )
              : [
                  ...(data.weakMuscles || []),
                  muscle,
                ],
          });
        }}
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
      {/* STEP 12 */}
      {/* ========================= */}

      {step === 12 && (

  <div className="screen fade-in">

    <h1>
      Your System Is Ready
    </h1>

    <div className="summary-card">

      <h2>{data.name}</h2>

      <p><strong>Goal:</strong> {data.goal}</p>

      <p>
        <strong>Current Weight:</strong>{" "}
        {data.weight} kg
      </p>

      <p>
        <strong>Goal Weight:</strong>{" "}
        {data.goalWeight} kg
      </p>

      <p>
        <strong>Gender:</strong>{" "}
        {data.gender}
      </p>

      <p>
        <strong>Experience:</strong>{" "}
        {data.experience}
      </p>

      <p>
        <strong>Training Location:</strong>{" "}
        {data.location}
      </p>

      <p>
        <strong>Split Type:</strong>{" "}
        {data.splitMode === "AI"
          ? "AI Generated"
          : "Custom Split"}
      </p>

      <p>
        <strong>Equipment:</strong>{" "}
        {data.equipment.join(", ")}
      </p>

      <br />

      <h3>Priority Muscles</h3>

      {data.weakMuscles?.length > 0 ? (
        <ul>
          {data.weakMuscles.map((muscle) => (
            <li key={muscle}>
              {muscle}
            </li>
          ))}
        </ul>
      ) : (
        <p>No priority muscles selected.</p>
      )}

      <br />

      <div className="priority-system-card">
  <h3>Priority Muscle System</h3>

  <div className="priority-rule">
    <span>2×</span>
    <div>
      <h4>Higher Frequency</h4>
      <p>Priority muscles are trained at least twice per week.</p>
    </div>
  </div>

  <div className="priority-rule">
    <span>10</span>
    <div>
      <h4>Minimum Weekly Sets</h4>
      <p>Each priority muscle receives at least 10 sets weekly.</p>
    </div>
  </div>

  <div className="priority-rule">
    <span>#1</span>
    <div>
      <h4>Workout Priority</h4>
      <p>Priority muscles appear first when energy and performance are highest.</p>
    </div>
  </div>
</div>

      <br />

     
      <div className="summary-card">
  <h2>Your Training Split</h2>

  {Object.entries(previewPlan).map(([day, plan]) => (
    <div key={day} className="summary-day">

      <h3>{day}</h3>

      {plan.rest ? (
        <p>Rest Day</p>
      ) : (
        <div className="summary-muscles">

          {Object.entries(plan)
            .filter(([key]) => key !== "rest")
            .map(([muscle, values]) => (
              <div
                key={muscle}
                className="summary-muscle"
              >
                <strong>{muscle}</strong>

                {Array.isArray(values) &&
                  values.length > 0 && (
                    <span>
                      {values.join(", ")}
                    </span>
                  )}
              </div>
            ))}
        </div>
      )}

    </div>
  ))}
</div>
    </div>

    <div className="buttons">

      <button
        onClick={() => setStep(3)}
      >
        Edit Goal
      </button>

      <button
        onClick={() => setStep(4)}
      >
        Edit Stats
      </button>

      <button
        onClick={() => setStep(9)}
      >
        Edit Split
      </button>

      <button
        onClick={() => setStep(11)}
      >
        Edit Priority Muscles
      </button>

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
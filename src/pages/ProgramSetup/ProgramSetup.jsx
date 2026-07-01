import React, { useState } from "react";
import "./ProgramSetup.css";
import { useNavigate, useParams } from "react-router-dom";
import { PROGRAMS } from "../../Data/Programs";
import UserProfileEngine from "../../engine/UserProfileEngine";
import NutritionEngine from "../../engine/NutritionEngine";
import { EXERCISES } from "../../Data/exercises";


const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const FOCUS_OPTIONS = [
  "Chest",
  "Back",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Biceps",
  "Triceps",
  "Abs",
  "Conditioning",
];
export default function ProgramSetup() {

   const { id } = useParams();
  const navigate = useNavigate();

  const profile = UserProfileEngine.getProfile();

  const [track, setTrack] = useState(4);
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayFocus, setDayFocus] = useState({});
  const [currentWeight, setCurrentWeight] = useState(profile.weight || 70);
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight || "");

  const program = PROGRAMS.find(
    (p) => String(p.id) === String(id)
  );

  const isCappedDelts =
  program.id === "capped-delts";

const sideDeltExercises = EXERCISES.filter(
  (e) =>
    e.target === "Side Delts"
);

const rearDeltExercises = EXERCISES.filter(
  (e) =>
    e.target === "Rear Delts"
);

const pressExercises = EXERCISES.filter(
  (e) =>
    e.target === "Front Delts"
);

const [sideDeltExercise, setSideDeltExercise] =
  useState("");

const [rearDeltExercise, setRearDeltExercise] =
  useState("");

const [pressExercise, setPressExercise] =
  useState("");

const [specializationMode, setSpecializationMode] =
  useState("");


  if (!program) {
    return (
      <div className="program-setup-page app-page">
        <h1>Program not found</h1>
      </div>
    );
  }

  const isHomeChestBuilder =
  program.id === "home-chest-builder";


const isSpecialization =
  isHomeChestBuilder || isCappedDelts;

    const bodyDone =
  currentWeight &&
  goalWeight;

const scheduleDone =
  track > 0;

const workoutDone =
  selectedDays.length === track;

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));

      const updatedFocus = { ...dayFocus };
      delete updatedFocus[day];
      setDayFocus(updatedFocus);

      return;
    }

  const maxDays =
isCappedDelts
  ? (
      specializationMode === "dedicated"
        ? 2
        : track
    )
  : track;

if (selectedDays.length >= maxDays) {
  alert(
    `Please choose only ${maxDays} workout day${maxDays > 1 ? "s" : ""}.`
  );
  return;
}

    setSelectedDays([...selectedDays, day]);
  };

  const toggleFocus = (day, focus) => {
    const currentFocus = dayFocus[day] || [];

    const updatedFocus = currentFocus.includes(focus)
      ? currentFocus.filter((item) => item !== focus)
      : [...currentFocus, focus];

    setDayFocus({
      ...dayFocus,
      [day]: updatedFocus,
    });
  };

  
 const startProgram = () => {
  if (isCappedDelts) {

  if (!specializationMode) {
    alert("Choose how you'd like to run this program.");
    return;
  }

  if (!sideDeltExercise || !rearDeltExercise) {
    alert("Please choose your preferred shoulder exercises.");
    return;
  }

}



 const currentProfile = UserProfileEngine.getProfile();

if (
  currentProfile.programSchedule &&
  currentProfile.programSchedule.length > 0
) 
  {
alert(
"You are already enrolled in a program. Leave your current program before starting another one."
);
return;
}

if (currentProfile.programId === program.id) {
alert(
"You are already enrolled in this program."
);
return;
}

const requiredDays =
isCappedDelts
  ? (
      specializationMode === "dedicated"
        ? 2
        : track
    )
  : track;

if (selectedDays.length !== requiredDays) {
  alert(`Please choose exactly ${requiredDays} workout days.`);
  return;
}

const missingFocus =
!isHomeChestBuilder &&
selectedDays.some(
(day) => !dayFocus[day] || dayFocus[day].length === 0
);

if (missingFocus) {
alert("Please choose at least one muscle focus for each selected day.");
return;
}

const programSchedule = selectedDays.map((day, index) => {

  if (isHomeChestBuilder) {
    return {
      day,
      focus: ["Chest"],
    };
  }

  if (isCappedDelts) {

    const focus = [];

    // First two workouts always include shoulders
    if (index < 2) {
      focus.push("Shoulders");
    }

    // Fill remaining muscles from user's selection
    if (dayFocus[day]) {
      dayFocus[day].forEach((muscle) => {
        if (!focus.includes(muscle)) {
          focus.push(muscle);
        }
      });
    }

    return {
      day,
      focus,
    };
  }

  return {
    day,
    focus: dayFocus[day],
  };
});


const profile = UserProfileEngine.getProfile();

if (!currentWeight || Number(currentWeight) <= 0) {
alert("Please enter your current weight.");
return;
}

if (!goalWeight || Number(goalWeight) <= 0) {
alert("Please enter your goal weight.");
return;
}

const nutrition = NutritionEngine.getProgramNutrition({
programId: program.id,
goal: program.goal,
weight: currentWeight,
goalWeight,
trainingDays: track,
});
UserProfileEngine.saveProfile({
  ...profile,

  specialization:
  isCappedDelts
    ? {
        type: "capped-delts",
        sideDeltExercise,
        rearDeltExercise,
        pressExercise,
      }
    : profile.specialization,
 
  programId: program.id,

  programTotalWeeks: program.totalWeeks,
  programTrack: isCappedDelts ? 2 : track,
  programWorkoutDays: selectedDays,
  programSchedule,
  currentWeek: 1,
  programStartDate: new Date().toISOString(),
programCommitment: true,

  weight: nutrition.currentWeight,
  startingWeight:
    profile.startingWeight || nutrition.currentWeight,
  goalWeight: nutrition.goalWeight,

  calories: nutrition.calories,
  protein: nutrition.protein,
  carbs: nutrition.carbs,
  fat: nutrition.fat,

  nutritionPhase: nutrition.nutritionPhase,
  nutritionNote: nutrition.nutritionNote,
  weeklyTargetChange: nutrition.weeklyTargetChange,
  estimatedWeeksToGoal: nutrition.estimatedWeeksToGoal,
  maintenanceCalories: nutrition.maintenanceCalories,

  weeklyReview: {
    ...profile.weeklyReview,
    currentCalories: nutrition.calories,
    currentProtein: nutrition.protein,
    currentPhase: nutrition.nutritionPhase,
    aiNotes: nutrition.nutritionNote,
  },
});

localStorage.removeItem("workout");
localStorage.removeItem("workoutDate");

navigate("/program");
};
  return (
    
    <div className="program-setup-page app-page">
      <div className="program-setup-header">
        <span className="setup-tag">
ASCEND PROGRAM
</span>
        <h1>{program.name}</h1>
        <p>
{program.description}
</p>

<div className="setup-progress">

  <div className={`progress-step ${bodyDone ? "done" : "active"}`}>
    {bodyDone ? "✓" : "1"}
  </div>

  <div className={`progress-line ${bodyDone ? "done" : ""}`}></div>

  <div
    className={`progress-step ${
      scheduleDone
        ? "done"
        : bodyDone
        ? "active"
        : ""
    }`}
  >
    {scheduleDone ? "✓" : "2"}
  </div>

  <div className={`progress-line ${workoutDone ? "done" : ""}`}></div>

  <div
    className={`progress-step ${
      workoutDone ? "done" : ""
    }`}
  >
    {workoutDone ? "✓" : "3"}
  </div>

</div>

<div className="setup-checklist">

  <div className="setup-item">
    <span>{bodyDone ? "✓" : "○"} Body Metrics</span>
  </div>

  <div className="setup-item">
    <span>{scheduleDone ? "✓" : "○"} Training Schedule</span>
  </div>

  <div className="setup-item">
    <span>{workoutDone ? "✓" : "○"} Workout Days</span>
  </div>

</div>

      </div>

      <div className="setup-card">
  <h2>Body Metrics</h2>

<span className="card-step">
Step 1 of 3
</span>
  <p>ASCEND will calculate your calories, protein, carbs, and fats from this.</p>

 <label>Current Weight (kg)</label>

<input
  type="number"
  placeholder="e.g. 72"
    value={currentWeight}
    onChange={(e) => setCurrentWeight(e.target.value)}
  />

 <label>Goal Weight (kg)</label>

<input
  type="number"
  placeholder="e.g. 80"
    value={goalWeight}
    onChange={(e) => setGoalWeight(e.target.value)}
  />
</div>

      <div className="setup-card">
 <h2>Training Schedule</h2>

<span className="card-step">
Step 2 of 3
</span>
  {isSpecialization ? (
  <>

    {isHomeChestBuilder && (
      <>
        <p>
          Home Chest Builder is fixed at 4 chest days per week because the whole
          program is built around high-frequency chest volume.
        </p>

        <div className="track-grid">
          <button className="active" type="button">
            4 Chest Days
          </button>
        </div>
      </>
    )}

   {isCappedDelts && specializationMode === "dedicated" && (
  <>
    <p>
      Choose the TWO dedicated shoulder days each week.
    </p>

    <div className="days-grid">
      {DAYS.map((day) => (
        <button
          key={day}
          className={selectedDays.includes(day) ? "active" : ""}
          onClick={() => toggleDay(day)}
        >
          {day}
        </button>
      ))}
    </div>

    <p className="setup-note">
      ASCEND will create two dedicated shoulder sessions every week.
    </p>
  </>
)}

{isCappedDelts && specializationMode === "integrated" && (
  <>
    <p>
      Choose your normal workout days. ASCEND will automatically inject shoulder specialization into these workouts.
    </p>

    <div className="track-grid">
      {[3, 4, 5, 6].map((num) => (
        <button
          key={num}
          className={track === num ? "active" : ""}
          onClick={() => {
            setTrack(num);
            setSelectedDays([]);
            setDayFocus({});
          }}
        >
          {num} Days
        </button>
      ))}
    </div>
  </>
)}
  </>

  ) : (
    <>
      <p>Pick how many days per week you can realistically train.</p>

      <div className="track-grid">
        {[3, 4, 5, 6].map((num) => (
          <button
            key={num}
            className={track === num ? "active" : ""}
            onClick={() => {
              setTrack(num);
              setSelectedDays([]);
              setDayFocus({});
            }}
          >
            {num} Days
          </button>
        ))}
      </div>
    </>
  )}
</div>

     {isCappedDelts && !specializationMode && (
  <div className="setup-card">

    <h2>How would you like to run this program?</h2>

    <p>
      Choose how ASCEND should fit shoulder specialization into your training.
    </p>

   <div className="specialization-mode-grid">

  <div
    className={`specialization-mode-btn ${
      specializationMode === "dedicated" ? "active" : ""
    }`}
    onClick={() => setSpecializationMode("dedicated")}
  >
    <h3>Dedicated Shoulder Days</h3>

    <p>
      Add two dedicated shoulder workouts each week for maximum shoulder growth.
    </p>

    <ul>
      <li>Highest shoulder growth</li>
      <li>Maximum recovery between sessions</li>
      <li>Best if you can train two extra days</li>
    </ul>
  </div>

  <div
    className={`specialization-mode-btn ${
      specializationMode === "integrated" ? "active" : ""
    }`}
    onClick={() => setSpecializationMode("integrated")}
  >
    <h3>Integrate Into My Current Split</h3>

    <p>
      ASCEND automatically adds shoulder specialization into your existing workouts.
    </p>

    <ul>
      <li>No extra gym days required</li>
      <li>Keeps your current workout split</li>
      <li>Best for busy lifters</li>
    </ul>
  </div>

</div>
  </div>
)}

     {selectedDays.length > 0 &&
 !isHomeChestBuilder &&
 (
   !isCappedDelts ||
   specializationMode === "integrated"
 ) && (
  <div className="setup-card">
    <h2>Choose Muscle Focus Per Day</h2>
    <p>You can pick more than one muscle group per workout day.</p>

    {selectedDays.map((day) => (
      <div key={day} className="focus-row">
        <strong>{day}</strong>

        <div className="focus-grid">
          {FOCUS_OPTIONS.map((focus) => (
            <button
              key={focus}
              type="button"
              className={
                dayFocus[day]?.includes(focus) ? "active" : ""
              }
              onClick={() => toggleFocus(day, focus)}
            >
              {focus}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

{selectedDays.length > 0 && isHomeChestBuilder && (
  <div className="setup-card">
    <h2>Chest Focus Locked</h2>
    <p>
      Home Chest Builder is a 16-week chest specialization program. Every
      selected workout day will automatically be assigned to Chest.
    </p>

    {selectedDays.map((day) => (
      <div key={day} className="focus-row">
        <strong>{day}</strong>

        <div className="focus-grid">
          <button className="active" type="button">
            Chest
          </button>
        </div>
      </div>
    ))}
  </div>
)}

{isCappedDelts &&
specializationMode &&
(
  <div className="setup-card">
    <h2>
      Choose Your Shoulder Exercises
    </h2>

    <p>
      These exercises stay the same for the
      entire 8-week program so you can
      progressively overload them.
    </p>

    <label>Side Delt</label>

    <h3>Choose Your Side Delt Exercise</h3>

<div className="exercise-picker">

{sideDeltExercises.map((exercise)=>(

<div
key={exercise.id}
className={`exercise-option ${
sideDeltExercise===exercise.name ? "selected":""
}`}
onClick={()=>
setSideDeltExercise(exercise.name)
}
>

<strong>{exercise.name}</strong>

<div className="exercise-meta">

<span>
🎯 {exercise.target}
</span>

<span>
🏋️ {exercise.equipment}
</span>

</div>

</div>

))}

</div>

    <label>Rear Delt</label>

    <h3>Choose Your Rear Delt Exercise</h3>

<div className="exercise-picker">

{rearDeltExercises.map((exercise)=>(

<div
key={exercise.id}
className={`exercise-option ${
rearDeltExercise===exercise.name ? "selected":""
}`}
onClick={()=>
setRearDeltExercise(exercise.name)
}
>

<strong>{exercise.name}</strong>

<div className="exercise-meta">

<span>
🎯 {exercise.target}
</span>

<span>
🏋️ {exercise.equipment}
</span>

</div>

</div>

))}

</div>

    <label>
      Overhead Press (Optional)
    </label>

    <h3>Choose Your Overhead Press (Optional)</h3>

<div className="exercise-picker">

{pressExercises.map((exercise)=>(

<div
key={exercise.id}
className={`exercise-option ${
pressExercise===exercise.name ? "selected":""
}`}
onClick={()=>
setPressExercise(exercise.name)
}
>

<strong>{exercise.name}</strong>

<div className="exercise-meta">

<span>
🎯 {exercise.target}
</span>

<span>
🏋️ {exercise.equipment}
</span>

</div>

</div>

))}

</div>

  </div>
)}

{isCappedDelts &&
specializationMode &&
(
  <div className="setup-card">

    <h2>How It Works</h2>

    <p>

      This program focuses on progressive overload,
      not exercise variation.

    </p>

    <div className="setup-info">

      <p>✓ Train shoulders twice per week</p>

      <p>✓ 10 hard specialization sets weekly</p>

      <p>✓ Same exercises for all 8 weeks</p>

      <p>✓ Add reps before adding weight</p>

      <p>
        ✓ Best results come from eating at maintenance
        or in a calorie surplus
      </p>

    </div>

  </div>
)}


      <button
  className="start-setup-btn"
  onClick={startProgram}
>
  Begin Transformation →
</button>
    </div>
  );
}
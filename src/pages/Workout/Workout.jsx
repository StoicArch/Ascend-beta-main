import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Workout.css";

import WorkoutEngine from "../../engine/WorkoutEngine";

import ExerciseCard
from "../../components/workout/ExerciseCard";

import AddExerciseModal
from "../../components/workout/AddExerciseModal";

import AIInsightCard
from "../../components/workout/AIInsightCard";

import {EXERCISES} from "../../Data/exercises";

import ProgramEngine from "../../engine/ProgramEngine";
import ProgressEngine from "../../engine/ProgressEngine";

export default function Workout() {
  const activeSession =
  !ProgressEngine.isTodayCompleted()
    ? JSON.parse(localStorage.getItem("activeWorkoutSession"))
    : null;


  const navigate = useNavigate();

  const programStatus = ProgramEngine.getProgramStatus();

const [completedToday, setCompletedToday] = useState(
  ProgressEngine.isTodayCompleted()
);

  const [workout, setWorkout] =
    useState([]);

  const [active, setActive] = useState(false);

const [currentIndex, setCurrentIndex] = useState(0);

const [currentSet, setCurrentSet] = useState(1);

const [resting, setResting] = useState(false);

const [restTime, setRestTime] = useState(60);

  const [showModal, setShowModal] =
    useState(false);

  const [aiMessage, setAiMessage] =
    useState(
      "Your workout is optimized for today's recovery."
    );

  useEffect(() => {
if (ProgressEngine.isTodayCompleted()) {
    localStorage.removeItem("activeWorkoutSession");
  }
    setWorkout(
      WorkoutEngine.getOrCreateTodayWorkout());
  }, []);

  // =====================
  // REMOVE
  // =====================

  const removeExercise = (index) => {

  const updated = WorkoutEngine.removeExercise(index);

  setWorkout(updated);

  analyzeWorkoutChange("remove");
};


  // =====================
  // UPDATE
  // =====================

  const updateExercise = (index, field, value) => {

  const updated = WorkoutEngine.updateExercise(index, field, value);

  setWorkout(updated);

  analyzeWorkoutChange("update");
};
  // =====================
  // SWAP
  // =====================
const swapExercise = (index, newExercise) => {
  const updated = WorkoutEngine.swapExercise(index, newExercise);

  setWorkout(updated);

  analyzeWorkoutChange("swap");
};

  // =====================
  // ADD
  // =====================

  const addExercise = (exercise) => {

  const updated = WorkoutEngine.addExercise(exercise);

  setWorkout(updated);

  analyzeWorkoutChange("add", exercise.name);
};


//AI HELPER

  const analyzeWorkoutChange = (type) => {

  if (type === "swap") {
    setAiMessage(
      "Exercise swapped. Ensuring muscle balance and recovery alignment."
    );
  }

  if (type === "add") {
    setAiMessage(
      "New exercise added. Volume adjusted for hypertrophy optimization."
    );
  }

  if (type === "remove") {
    setAiMessage(
      "Exercise removed. Training density recalculated."
    );
  }
};
 
const getSwapSuggestion = (exercise) => {
  return EXERCISES.filter(
    (ex) =>
      ex.muscle === exercise.muscle &&
      ex.name !== exercise.name
  );
};


if (active && workout.length > 0) {

  const exercise = workout[currentIndex];

  const nextSet = () => {
  if (currentSet < (exercise.sets || 3)) {
    setCurrentSet(currentSet + 1);
    setResting(true);

    let timer = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResting(false);
          setRestTime(60);
          return 60;
        }

        return prev - 1;
      });
    }, 1000);
  } else {
    if (currentIndex < workout.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSet(1);
    } else {
      ProgressEngine.completeWorkout({
        program: programStatus.program?.name || "",
        week: programStatus.week,
        day: programStatus.today,
        workout: programStatus.todayTemplate?.name || "",
        exercises: workout.length,
      });

      WorkoutEngine.completeWorkout();

      setCompletedToday(true);
      setActive(false);

      alert("Workout completed!");
    }
  }
};
  
  return (
    <div className="active-workout app-page">

      <h2>{exercise.name}</h2>

      <p>Set {currentSet} / {exercise.sets || 3}</p>

      <p>Reps: {exercise.reps || 10}</p>

      {resting ? (
        <h3>Rest: {restTime}s</h3>
      ) : (
        <button onClick={nextSet}>
          Complete Set
        </button>
      )}

      <button onClick={() => setActive(false)}>
        End Workout
      </button>

    </div>
  );
}

  return (

    <div className="workout-page">

      {/* HEADER */}

      <div className="workout-header">

        <div>

          <h1>
            Today's Session
          </h1>

          <p>
            Customize before training
          </p>

        </div>

        <button
          className="add-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Exercise
        </button>

      </div>

      <div className="program-status-card">
  <span>Current Program</span>

  <h2>{programStatus.program?.name || "No Program Selected"}</h2>

  <p>
    Week {programStatus.week} • {programStatus.today}
  </p>

  {programStatus.isRestDay ? (
    <p>
      Today is a recovery day.
      {programStatus.nextWorkout
        ? ` Next workout: ${programStatus.nextWorkout.day}`
        : ""}
    </p>
  ) : (
    <p>
      {programStatus.todayTemplate?.name || "Workout"} •{" "}
      {programStatus.todayWorkout.length} exercises today.
    </p>
  )}
</div>

      {/* AI */}

      <AIInsightCard
        message={aiMessage}
      />

      {/* EMPTY */}

      {workout.length === 0 && (

        <div className="empty-state">

          <h2>
            No exercises yet
          </h2>

          <p>
            Add exercises to begin.
          </p>

        </div>

      )}

      {activeSession && (
  <div className="program-status-card">
    <span>Workout Paused</span>
    <h2>Resume your workout</h2>
    <p>You have an unfinished workout session.</p>

    <button onClick={() => navigate("/active-workout")}>
      Resume Workout
    </button>
  </div>
)}

      {/* LIST */}

      <div className="workout-list">

        {workout.map((ex, i) => (

  <ExerciseCard
    key={i}
    exercise={ex}
    swapSuggestion={getSwapSuggestion(ex)}
    onSwap={(newEx) => swapExercise(i, newEx)}
    onRemove={() => removeExercise(i)}
    onUpdate={(f, v) => updateExercise(i, f, v)}
  />

))}

      </div>

      {/* START */} {workout.length > 0 && !completedToday && ( <button className="start-workout-btn" onClick={() => { localStorage.removeItem("activeWorkoutSession"); navigate("/active-workout"); }} > Start Workout </button> )}

  


{completedToday && (
  <div className="workout-completed-card">
    <h2>Workout Completed ✅</h2>
    <p>You can review today’s workout, but you’ve already completed it.</p>
  </div>
)}

      {/* MODAL */}

      {showModal && (

        <AddExerciseModal

          onClose={() =>
            setShowModal(false)
          }

          onAdd={addExercise}

        />

      )}




    </div>
  );
}
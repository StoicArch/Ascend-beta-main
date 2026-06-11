import React, { useEffect, useState } from "react";
import "./ActiveWorkout.css";
import { WorkoutStore } from "../../store/workoutstore";
import UserProfileEngine from "../../engine/UserProfileEngine";
import ProgramEngine from "../../engine/ProgramEngine";
import ProgressEngine from "../../engine/ProgressEngine";

export default function ActiveWorkout() {
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [setLogs, setSetLogs] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [restTimer, setRestTimer] = useState(null);

  useEffect(() => {
    const savedWorkout = JSON.parse(localStorage.getItem("workout")) || [];
    setWorkout(savedWorkout.length > 0 ? savedWorkout : WorkoutStore.get());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (restTimer === null) return;

    if (restTimer <= 0) {
      setRestTimer(null);
      return;
    }

    const interval = setInterval(() => {
      setRestTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateSetLog = (exerciseIndex, setIndex, field, value) => {
    const key = `${exerciseIndex}-${setIndex}`;

    setSetLogs({
      ...setLogs,
      [key]: {
        ...setLogs[key],
        [field]: value,
      },
    });
  };

  const completeSet = (exerciseIndex, setIndex) => {
    const key = `${exerciseIndex}-${setIndex}`;

    setCompletedSets({
      ...completedSets,
      [key]: true,
    });

    setRestTimer(workout[exerciseIndex]?.rest || 90);
  };

  const buildExerciseHistory = () => {
    const profile = UserProfileEngine.getProfile();
    const programStatus = ProgramEngine.getProgramStatus();

    return workout.map((exercise, exerciseIndex) => {
      const sets = Array.from({
        length: Number(exercise.sets || 3),
      }).map((_, setIndex) => {
        const key = `${exerciseIndex}-${setIndex}`;

        return {
          set: setIndex + 1,
          targetReps: exercise.reps || 10,
          weight: Number(setLogs[key]?.weight || 0),
          reps: Number(setLogs[key]?.reps || 0),
          completed: !!completedSets[key],
        };
      });

      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        muscle: exercise.muscle,
        target: exercise.target,
        movementPattern: exercise.movementPattern,
        equipment: exercise.equipment,
        programId: profile.programId || "",
        program: profile.program || "",
        week: profile.currentWeek || 1,
        focus: exercise.focus || programStatus.todayFocus || [],
        date: new Date().toISOString(),
        sets,
      };
    });
  };

  const saveWorkoutHistory = () => {
    const profile = UserProfileEngine.getProfile();
    const previousHistory = profile.exerciseHistory || [];

    const newHistory = buildExerciseHistory();

    UserProfileEngine.saveProfile({
      ...profile,
      exerciseHistory: [...previousHistory, ...newHistory],
      lastWorkoutDate: new Date().toISOString(),
    });

    return newHistory;
  };

  const finishWorkout = () => {
  const exerciseHistory = saveWorkoutHistory();
  const profile = UserProfileEngine.getProfile();
  const programStatus = ProgramEngine.getProgramStatus();

  const completedSession = {
    workout,
    time: seconds,
    completedSets,
    setLogs,
    exerciseHistory,
    date: new Date().toISOString(),
  };

  WorkoutStore.saveSession(completedSession);

  ProgressEngine.completeWorkout({
    program: profile.program || "",
    programId: profile.programId || "",
    week: profile.currentWeek || 1,
    day: programStatus.today || "",
    workout: programStatus.todayTemplate?.name || "Workout",
    exercises: workout.length,
    duration: seconds,
    exerciseHistory,
  });

  alert("Workout Completed");

  window.location.href = "/dashboard";
};


  return (
    <div className="active-workout-page">
      <div className="active-top">
        <div>
          <h1>Workout In Progress</h1>
          <p>Track your reps and weight properly.</p>
        </div>

        <div className="session-time">{formatTime(seconds)}</div>
      </div>

      {restTimer !== null && (
        <div className="rest-card">
          <span>Rest Timer</span>
          <h2>{restTimer}s</h2>
        </div>
      )}

      <div className="active-list">
        {workout.map((exercise, i) => (
          <div className="active-card" key={i}>
            <div className="exercise-head">
              <div>
                <h2>{exercise.name}</h2>
                <span>
                  {exercise.muscle}
                  {exercise.target ? ` • ${exercise.target}` : ""}
                </span>
              </div>

              <div className="exercise-badge">{exercise.sets} Sets</div>
            </div>

            <div className="sets-list">
              {Array.from({
                length: Number(exercise.sets || 3),
              }).map((_, setIndex) => {
                const key = `${i}-${setIndex}`;
                const done = completedSets[key];

                return (
                  <div className={`set-row ${done ? "done" : ""}`} key={setIndex}>
                    <div>
                      <h4>Set {setIndex + 1}</h4>
                      <span>
                        Target: {exercise.repRange || `${exercise.reps} reps`}
                      </span>
                    </div>

                    <div className="set-inputs">
                      <input
                        type="number"
                        placeholder="Weight"
                        value={setLogs[key]?.weight || ""}
                        disabled={done}
                        onChange={(e) =>
                          updateSetLog(i, setIndex, "weight", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        placeholder="Reps"
                        value={setLogs[key]?.reps || ""}
                        disabled={done}
                        onChange={(e) =>
                          updateSetLog(i, setIndex, "reps", e.target.value)
                        }
                      />
                    </div>

                    <button disabled={done} onClick={() => completeSet(i, setIndex)}>
                      {done ? "Completed" : "Complete"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="finish-btn" onClick={finishWorkout}>
        Finish Session
      </button>
    </div>
  );
}
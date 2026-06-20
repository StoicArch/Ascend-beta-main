import React, { useEffect, useState } from "react";

import "./ActiveWorkout.css";
import { WorkoutStore } from "../../store/workoutstore";
import UserProfileEngine from "../../engine/UserProfileEngine";
import ProgramEngine from "../../engine/ProgramEngine";
import ProgressEngine from "../../engine/ProgressEngine";
import { useNavigate } from "react-router-dom";
import ProgressiveOverloadEngine from "../../engine/ProgressiveOverloadEngine";

const ACTIVE_SESSION_KEY = "activeWorkoutSession";

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [setLogs, setSetLogs] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [summary, setSummary] =
  useState(null);

  useEffect(() => {
  if (!ProgramEngine.canAccessTodayWorkout()) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    localStorage.removeItem("workout");
    navigate("/premium", { replace: true });
    return;
  }

  const savedSession = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY));

  if (savedSession) {
    setWorkout(savedSession.workout || []);
    setCompletedSets(savedSession.completedSets || {});
    setSetLogs(savedSession.setLogs || {});
    setSeconds(savedSession.seconds || 0);
    setRestTimer(savedSession.restTimer ?? null);
  } else {
    const savedWorkout = JSON.parse(localStorage.getItem("workout")) || [];
    setWorkout(savedWorkout.length > 0 ? savedWorkout : WorkoutStore.get());
  }

  setLoaded(true);
}, [navigate]);


  useEffect(() => {
    if (!loaded) return;

   localStorage.setItem(
  ACTIVE_SESSION_KEY,
  JSON.stringify({
    workout,
    completedSets,
    setLogs,
    seconds,
    restTimer,
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
);


  }, [loaded, workout, completedSets, setLogs, seconds, restTimer]);

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

    setSetLogs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const completeSet = (exerciseIndex, setIndex) => {
    const key = `${exerciseIndex}-${setIndex}`;

    setCompletedSets((prev) => ({
      ...prev,
      [key]: true,
    }));

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

    localStorage.removeItem(ACTIVE_SESSION_KEY);

    const summaryData =
  exerciseHistory.map((exercise) => {

    const pr =
      ProgressiveOverloadEngine.getPersonalRecord(
        exercise.exerciseName
      );

    const recommendation =
      ProgressiveOverloadEngine.getRecommendation(
        exercise.exerciseName
      );

    const achievement =
  ProgressiveOverloadEngine.getWorkoutAchievement(
    exercise.exerciseName
  );

return {
  name: exercise.exerciseName,
  weightPR: pr.bestWeight,
  repPR: pr.bestReps,
  recommendation: recommendation.message,
  achievement: achievement.text,
  reason: achievement.reason,
};


  });

setSummary({
  exercises: summaryData,
  duration: seconds,
});


  };

  const abandonWorkout = () => {
    const confirmEnd = window.confirm(
      "End this workout? Your active session will be cleared."
    );

    if (!confirmEnd) return;

    localStorage.removeItem(ACTIVE_SESSION_KEY);
    window.location.href = "/workout";
  };
  if (summary) {
  return (
    <div className="active-workout-page">

      <h1>
        Workout Complete ✅
      </h1>

      <p>
        Duration:
        {" "}
        {formatTime(summary.duration)}
      </p>

      <div className="summary-list">

        {summary.exercises.map((item, i) => (
          <div
            className="summary-card"
            key={i}
          >
            <h3>{item.name}</h3>

            <p>
              Weight PR:
              {" "}
              {item.weightPR || "--"}kg
            </p>

            <h3
  style={{
    color: "#22c55e",
    marginBottom: "10px",
  }}
>
  {item.achievement}
</h3>

<p>
  {item.reason}
</p>

            <p>
              Rep PR:
              {" "}
              {item.repPR || "--"}
            </p>

            <p>
              {item.recommendation}
            </p>
          </div>
        ))}

      </div>

      <button
        className="finish-btn"
        onClick={() => {
          window.location.href =
            "/dashboard";
        }}
      >
        Return To Dashboard
      </button>

    </div>
  );
}

  if (!loaded) {
    return (
      <div className="active-workout-page">
        <h1>Loading workout...</h1>
      </div>
    );
  }

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
  {workout.map((exercise, i) => {

    const recommendation =
      ProgressiveOverloadEngine.getRecommendation(
        exercise.name
      );

    const pr =
      ProgressiveOverloadEngine.getPersonalRecord(
        exercise.name
      );

    return (
          <div className="active-card" key={i}>
            <div className="exercise-head">
              <div>
                <h2>{exercise.name}</h2>
                <span>
                  {exercise.muscle}
                  {exercise.target ? ` • ${exercise.target}` : ""}
                </span>
              </div>

              <div className="progression-card">

  {pr.bestWeight === 0 &&
   pr.bestReps === 0 ? (

    <>
      <p>
        First time performing this exercise.
      </p>

      <p>
        Today's performance will be used
        to build future progression.
      </p>
    </>

  ) : (

    <>
      <p>
        PR Weight: {pr.bestWeight}kg
      </p>

      <p>
        PR Reps: {pr.bestReps}
      </p>

      <p>
  Goal Weight:
  {" "}
  {recommendation.recommendedWeight || "--"}kg
</p>

<div
  className="progression-feedback"
>
  <h4>
    {recommendation.increaseWeight
      ? "🚀 Progression Unlocked"
      : "🎯 Current Focus"}
  </h4>

  <p>
    {recommendation.message}
  </p>
</div>

    </>

  )}

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
        );
      })}


      </div>

      <button className="finish-btn" onClick={finishWorkout}>
        Finish Session
      </button>

      <button className="end-workout-btn" onClick={abandonWorkout}>
        End Without Saving
      </button>
    </div>
  );
}
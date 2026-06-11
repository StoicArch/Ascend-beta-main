const finishWorkout = () => {

  const completedSession = {
    workout,
    time: seconds,
    completedSets
  };

  WorkoutStore.saveSession(completedSession);

  alert("Workout Completed");

  window.location.href = "/dashboard";
};
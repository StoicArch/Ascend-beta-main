import UserProfileEngine from "./UserProfileEngine";

class ProgressiveOverloadEngine {
  static getHistory() {
    const profile = UserProfileEngine.getProfile();
    return profile.exerciseHistory || [];
  }

  static getExerciseHistory(exerciseName) {
    return this.getHistory()
      .filter((item) => item.exerciseName === exerciseName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static getLastPerformance(exerciseName) {
    const history = this.getExerciseHistory(exerciseName);

    if (history.length === 0) return null;

    return history[0];
  }

  static getBestCompletedSet(performance) {
    if (!performance?.sets) return null;

    const completedSets = performance.sets.filter((set) => set.completed);

    if (completedSets.length === 0) return null;

    return completedSets.sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.reps - a.reps;
    })[0];
  }

  static getAverageCompletedReps(performance) {
    if (!performance?.sets) return 0;

    const completedSets = performance.sets.filter((set) => set.completed);

    if (completedSets.length === 0) return 0;

    const totalReps = completedSets.reduce(
      (sum, set) => sum + Number(set.reps || 0),
      0
    );

    return Math.round(totalReps / completedSets.length);
  }

  static getNextTarget(exercise) {
    const exerciseName =
      typeof exercise === "string" ? exercise : exercise.name;

    const targetReps =
      typeof exercise === "string" ? 10 : Number(exercise.reps || 10);

    const lastPerformance = this.getLastPerformance(exerciseName);

    if (!lastPerformance) {
      return {
        hasHistory: false,
        targetWeight: "",
        targetReps,
        instruction: "First time doing this exercise. Pick a weight you can control.",
      };
    }

    const bestSet = this.getBestCompletedSet(lastPerformance);
    const avgReps = this.getAverageCompletedReps(lastPerformance);

    if (!bestSet) {
      return {
        hasHistory: true,
        targetWeight: "",
        targetReps,
        instruction: "No completed sets found last time. Repeat this exercise properly today.",
      };
    }

    const lastWeight = Number(bestSet.weight || 0);

    if (avgReps >= targetReps + 2) {
      return {
        hasHistory: true,
        targetWeight: lastWeight ? lastWeight + 2.5 : "",
        targetReps: Math.max(targetReps - 2, 6),
        instruction: "Increase weight slightly. You beat the rep target last time.",
      };
    }

    if (avgReps >= targetReps) {
      return {
        hasHistory: true,
        targetWeight: lastWeight,
        targetReps: targetReps + 1,
        instruction: "Keep the same weight and add 1 rep today.",
      };
    }

    if (avgReps < targetReps - 3) {
      return {
        hasHistory: true,
        targetWeight: lastWeight ? Math.max(0, lastWeight - 2.5) : "",
        targetReps,
        instruction: "Reduce weight slightly and rebuild clean reps.",
      };
    }

    return {
      hasHistory: true,
      targetWeight: lastWeight,
      targetReps,
      instruction: "Repeat the same weight and aim to hit the target reps cleanly.",
    };
  }
}

export default ProgressiveOverloadEngine;

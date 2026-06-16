import UserProfileEngine from "./UserProfileEngine";

class ProgressiveOverloadEngine {
  static getExerciseHistory(exerciseName) {
    const profile = UserProfileEngine.getProfile();

    return (profile.exerciseHistory || [])
      .filter((item) => item.exerciseName === exerciseName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static getLastPerformance(exerciseName) {
    const history = this.getExerciseHistory(exerciseName);
    return history[0] || null;
  }

  static getPersonalRecord(exerciseName) {
    const history = this.getExerciseHistory(exerciseName);

    let bestWeight = 0;
    let bestReps = 0;

    history.forEach((session) => {
      (session.sets || []).forEach((set) => {
        const weight = Number(set.weight || 0);
        const reps = Number(set.reps || 0);

        if (weight > bestWeight) bestWeight = weight;
        if (reps > bestReps) bestReps = reps;
      });
    });

    return {
      bestWeight,
      bestReps,
    };
  }

  static getRecommendation(exerciseName) {
    const last = this.getLastPerformance(exerciseName);

    if (!last || !last.sets || last.sets.length === 0) {
      return {
        recommendedWeight: "",
        increaseWeight: false,
        message: "No previous data yet.",
      };
    }

    const completedSets = last.sets.filter((set) => set.completed);

    if (completedSets.length === 0) {
      return {
        recommendedWeight: "",
        increaseWeight: false,
        message: "Complete this exercise once to unlock recommendations.",
      };
    }

    const averageWeight =
      completedSets.reduce((sum, set) => sum + Number(set.weight || 0), 0) /
      completedSets.length;

    const averageReps =
      completedSets.reduce((sum, set) => sum + Number(set.reps || 0), 0) /
      completedSets.length;

    const targetReps = Number(completedSets[0].targetReps || 10);

    const allTargetsHit =
      completedSets.length === last.sets.length && averageReps >= targetReps;

    if (allTargetsHit) {
      return {
        recommendedWeight: Number((averageWeight + 2.5).toFixed(1)),
        increaseWeight: true,
        message: "Increase weight next session.",
      };
    }

    return {
      recommendedWeight: Number(averageWeight.toFixed(1)),
      increaseWeight: false,
      message: "Stay at current weight and aim for more reps.",
    };
  }
}

export default ProgressiveOverloadEngine;
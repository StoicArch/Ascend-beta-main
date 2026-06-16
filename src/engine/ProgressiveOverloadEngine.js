import UserProfileEngine from "./UserProfileEngine";

class ProgressiveOverloadEngine {
  static getExerciseHistory(exerciseName) {
    const profile = UserProfileEngine.getProfile();

    return (profile.exerciseHistory || [])
      .filter(
        (item) => item.exerciseName === exerciseName
      )
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );
  }

  static getLastPerformance(exerciseName) {
    const history =
      this.getExerciseHistory(exerciseName);

    return history[0] || null;
  }

  static getPersonalRecord(exerciseName) {
    const history =
      this.getExerciseHistory(exerciseName);

    let bestWeight = 0;
    let bestReps = 0;

    history.forEach((session) => {
      session.sets.forEach((set) => {
        if (set.weight > bestWeight) {
          bestWeight = set.weight;
        }

        if (set.reps > bestReps) {
          bestReps = set.reps;
        }
      });
    });

    return {
      bestWeight,
      bestReps,
    };
  }

  static getRecommendation(exerciseName) {
    const last =
      this.getLastPerformance(exerciseName);

    if (!last) {
      return {
        message:
          "First time performing this exercise.",
      };
    }

    const averageWeight =
      last.sets.reduce(
        (sum, set) => sum + (set.weight || 0),
        0
      ) / last.sets.length;

    
      const completedSets =
  last.sets.filter((set) => set.completed);

const averageReps =
  completedSets.reduce(
    (sum, set) => sum + set.reps,
    0
  ) / completedSets.length;

const allTargetsHit =
  completedSets.length === last.sets.length &&
  averageReps >=
    completedSets[0].targetReps;

   if (allTargetsHit) {
  return {
    recommendedWeight:
      averageWeight + 2.5,
    increaseWeight: true,
    message:
      "Increase weight next session.",
  };
}

return {
  recommendedWeight:
    averageWeight,
  increaseWeight: false,
  message:
    "Stay at current weight and aim for more reps.",
};
  }
}

export default ProgressiveOverloadEngine;
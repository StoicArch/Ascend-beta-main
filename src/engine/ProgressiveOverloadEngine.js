import UserProfileEngine from "./UserProfileEngine";

class ProgressiveOverloadEngine {
  static getExerciseHistory(exerciseName) {
    const profile = UserProfileEngine.getProfile();

    return (profile.exerciseHistory || [])
      .filter((item) => item.exerciseName === exerciseName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static getWorkoutAchievement(exerciseName) {
  const history =
    this.getExerciseHistory(exerciseName);

  if (history.length <= 1) {
    return {
  type: "first-time",
  text: "💪 First Time Exercise",
  reason:
    "We'll use today's performance to create future progression targets.",
};
  }

  const current = history[0];
  const previous = history[1];

  const currentBestWeight = Math.max(
    ...(current.sets || []).map(
      (s) => Number(s.weight || 0)
    )
  );

  const previousBestWeight = Math.max(
    ...(previous.sets || []).map(
      (s) => Number(s.weight || 0)
    )
  );

  const currentBestReps = Math.max(
    ...(current.sets || []).map(
      (s) => Number(s.reps || 0)
    )
  );

  const previousBestReps = Math.max(
    ...(previous.sets || []).map(
      (s) => Number(s.reps || 0)
    )
  );

 if (currentBestWeight > previousBestWeight) {
  return {
    type: "weight-pr",
    text: "🏆 New Weight PR",
    reason:
      "You lifted more weight than your previous best.",
  };
}

 if (currentBestReps > previousBestReps) {
  return {
    type: "rep-pr",
    text: "🔥 New Rep PR",
    reason:
      "You completed more reps than your previous best.",
  };
}

  return {
  type: "maintain",
  text: "🎯 Maintain Weight",
  reason:
    "Target reps not fully achieved yet. Focus on beating your previous reps before increasing weight.",
};
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
  const nextWeight =
    Number((averageWeight + 2.5).toFixed(1));

  return {
    recommendedWeight: nextWeight,
    increaseWeight: true,

    message:
      `Progression Ready 🚀

Previous:
${averageWeight.toFixed(1)}kg × ${Math.round(averageReps)}

New Goal:
${nextWeight}kg × ${targetReps}

Push beyond target reps if possible.`,
  };
}

return {
  recommendedWeight: Number(
    averageWeight.toFixed(1)
  ),

  increaseWeight: false,

  message:
    `Recovery Focus

Stay at ${averageWeight.toFixed(1)}kg

Goal:
Beat ${Math.round(averageReps)} reps next workout.`,
};
  }
}

export default ProgressiveOverloadEngine;
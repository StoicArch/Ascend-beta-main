import UserProfileEngine from "./UserProfileEngine";
import WeightEngine from "./WeightEngine";

class GoalEngine {
  static getGoalStatus() {
    const profile = UserProfileEngine.getProfile();

    const currentWeight =
      WeightEngine.getCurrentWeight() || Number(profile.weight || 70);

    const goalWeight = Number(profile.goalWeight || currentWeight);
    const startingWeight = Number(profile.startingWeight || currentWeight);
    const weeklyTargetChange = Number(profile.weeklyTargetChange || 0);

    const totalTargetChange = Number((goalWeight - startingWeight).toFixed(1));
    const remainingChange = Number((goalWeight - currentWeight).toFixed(1));

    const progressPercent =
      totalTargetChange === 0
        ? 0
        : Math.min(
            100,
            Math.max(
              0,
              Math.round(
                ((currentWeight - startingWeight) / totalTargetChange) * 100
              )
            )
          );

    const estimatedWeeksRemaining =
      weeklyTargetChange === 0
        ? 0
        : Math.max(
            0,
            Math.ceil(Math.abs(remainingChange / weeklyTargetChange))
          );

    return {
      startingWeight,
      currentWeight,
      goalWeight,
      totalTargetChange,
      remainingChange,
      weeklyTargetChange,
      progressPercent,
      estimatedWeeksRemaining,
      isGoalReached:
        totalTargetChange > 0
          ? currentWeight >= goalWeight
          : currentWeight <= goalWeight,
    };
  }

  static getGoalMessage() {
    const status = this.getGoalStatus();

    if (status.isGoalReached) {
      return "Goal reached. Time to set a new target.";
    }

    if (status.remainingChange > 0) {
      return `${status.remainingChange}kg left to gain. Estimated ${status.estimatedWeeksRemaining} weeks remaining.`;
    }

    if (status.remainingChange < 0) {
      return `${Math.abs(status.remainingChange)}kg left to lose. Estimated ${status.estimatedWeeksRemaining} weeks remaining.`;
    }

    return "Goal weight reached.";
  }
}

export default GoalEngine;
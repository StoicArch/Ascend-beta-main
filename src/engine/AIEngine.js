import UserProfileEngine from "./UserProfileEngine";
import WorkoutEngine from "./WorkoutEngine";
import DashboardEngine from "./DashboardEngine";

class AIEngine {
  static getInsight() {
    const profile = UserProfileEngine.getProfile();
    const workout = WorkoutEngine.getWorkout();
    const recovery = DashboardEngine.getRecoveryScore();

    const exerciseCount = workout.length;

    if (exerciseCount === 0) {
      return "Build a workout to receive recommendations.";
    }

    if (recovery < 60) {
      return "Recovery is low today. Reduce workout volume and prioritize sleep, hydration, and form.";
    }

    if (profile.sleep < 6) {
      return "Sleep is below target. Keep training lighter today and avoid pushing maximum intensity.";
    }

    if (profile.goal === "Build Muscle") {
      if (exerciseCount < 5) {
        return "Your workout may be too short for optimal hypertrophy.";
      }

      return `Volume looks appropriate for muscle growth. Aim for about ${profile.protein}g protein today.`;
    }

    if (profile.goal === "Lose Fat") {
      return `Focus on training intensity and daily activity. Stay close to your ${profile.calories} calorie target.`;
    }

    if (profile.goal === "Strength") {
      return "Prioritize progressive overload on compound lifts while keeping rest periods controlled.";
    }

    return "Training plan looks solid.";
  }
}

export default AIEngine;
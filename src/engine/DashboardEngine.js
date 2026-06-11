import UserProfileEngine from "./UserProfileEngine";

class DashboardEngine {
  static getWorkoutCount() {
    const data = JSON.parse(localStorage.getItem("workout")) || [];
    return data.length;
  }

  static getRecoveryScore() {
    const profile = UserProfileEngine.getProfile();

    if (profile.recoveryScore) {
      return profile.recoveryScore;
    }

    let score = 75;

    if (profile.sleep >= 8) score += 10;
    if (profile.sleep < 6) score -= 15;

    if (profile.trainingDays >= 5) score -= 5;
    if (profile.trainingDays <= 3) score += 5;

    return Math.max(40, Math.min(100, score));
  }

  static getStreak() {
    const streak = localStorage.getItem("streak");
    return streak ? Number(streak) : 1;
  }

  static getCalories() {
    const profile = UserProfileEngine.getProfile();
    return profile.calories;
  }

  static getProtein() {
    const profile = UserProfileEngine.getProfile();
    return profile.protein;
  }

  static getSleep() {
    const profile = UserProfileEngine.getProfile();
    return profile.sleep;
  }

  static getAIInsight() {
    const recovery = this.getRecoveryScore();
    const streak = this.getStreak();

    if (recovery >= 85 && streak >= 5) {
      return "You are in strong condition. Push intensity today.";
    }

    if (recovery < 60) {
      return "Low recovery detected. Reduce volume and focus on sleep, hydration, and form.";
    }

    return "Steady progress. Maintain consistency and keep your recovery habits strong.";
  }
}

export default DashboardEngine;
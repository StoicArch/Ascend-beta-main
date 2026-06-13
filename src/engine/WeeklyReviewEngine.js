import UserProfileEngine from "./UserProfileEngine";
import PremiumEngine from "./PremiumEngine";

class WeeklyReviewEngine {
  static getWeightEntries() {
    return JSON.parse(localStorage.getItem("weightEntries")) || [];
  }

  static getWorkoutHistory() {
    return JSON.parse(localStorage.getItem("workoutHistory")) || [];
  }

  static getTodayDate() {
    return new Date().toDateString();
  }

  static getLast7Days() {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      return date.toDateString();
    });
  }

  static getWeeklyWeightChange() {
    const entries = this.getWeightEntries();

    if (entries.length < 2) return 0;

    const last7Days = this.getLast7Days();

    const weeklyEntries = entries.filter((entry) =>
      last7Days.includes(new Date(entry.date).toDateString())
    );

    if (weeklyEntries.length < 2) return 0;

    const first = weeklyEntries[0].weight;
    const last = weeklyEntries[weeklyEntries.length - 1].weight;

    return Number((last - first).toFixed(1));
  }

  static getWorkoutsCompletedThisWeek() {
    const history = this.getWorkoutHistory();
    const last7Days = this.getLast7Days();

    return history.filter(
      (item) => item.completed && last7Days.includes(item.date)
    ).length;
  }

  static getExpectedWorkouts() {
    const profile = UserProfileEngine.getProfile();
    return Number(profile.trainingDays || 4);
  }

  static getCompletionRate() {
    const completed = this.getWorkoutsCompletedThisWeek();
    const expected = this.getExpectedWorkouts();

    if (!expected) return 0;

    return Math.min(100, Math.round((completed / expected) * 100));
  }

  static getBasicRecommendation() {
    const profile = UserProfileEngine.getProfile();
    const weightChange = this.getWeeklyWeightChange();
    const completionRate = this.getCompletionRate();

    if (profile.programId === "skinny-to-jacked") {
      if (weightChange < 0.2) {
        return "You may need slightly more food this week to keep building muscle.";
      }

      if (weightChange > 0.7) {
        return "You are gaining fast. Keep an eye on fat gain and stay consistent.";
      }

      return "Good lean-bulk pace. Keep training hard and stay consistent.";
    }

    if (profile.programId === "bulking-journey") {
      if (weightChange < 0.3) {
        return "Your bulk may need more calories this week.";
      }

      return "Good bulking pace. Keep pushing your main lifts.";
    }

    if (profile.programId === "8-week-shred") {
      if (weightChange >= 0) {
        return "Fat loss may be slow. Tighten calories and keep steps high.";
      }

      return "Good cutting progress. Keep protein high and stay consistent.";
    }

    if (completionRate < 70) {
      return "Your biggest opportunity is consistency. Hit more workouts next week.";
    }

    return "Steady week. Keep building momentum.";
  }

  static getPremiumRecommendation() {
    const profile = UserProfileEngine.getProfile();
    const weightChange = this.getWeeklyWeightChange();
    const completed = this.getWorkoutsCompletedThisWeek();
    const expected = this.getExpectedWorkouts();

    let calorieAdjustment = 0;
    let trainingAdvice = "Keep your current training structure.";

    if (profile.programId === "skinny-to-jacked") {
      if (weightChange < 0.2) calorieAdjustment = 200;
      if (weightChange > 0.7) calorieAdjustment = -100;
      trainingAdvice =
        "Keep main lifts stable. Focus on adding reps or small weight increases.";
    }

    if (profile.programId === "bulking-journey") {
      if (weightChange < 0.3) calorieAdjustment = 250;
      if (weightChange > 1) calorieAdjustment = -150;
      trainingAdvice =
        "Prioritize heavy compounds and recover well between sessions.";
    }

    if (profile.programId === "8-week-shred") {
      if (weightChange >= 0) calorieAdjustment = -200;
      if (weightChange < -1) calorieAdjustment = 100;
      trainingAdvice =
        "Keep protein high and avoid reducing strength training volume too much.";
    }

    const newCalories = Number(profile.calories || 2400) + calorieAdjustment;

    return {
      calorieAdjustment,
      recommendedCalories: newCalories,
      recommendedProtein: profile.protein,
      trainingAdvice,
      summary:
        completed >= expected
          ? "You completed your planned workouts. Great consistency."
          : `You completed ${completed}/${expected} workouts. Improve consistency next week.`,
    };
  }

  static generateReview() {
    const profile = UserProfileEngine.getProfile();

    const basicReview = {
      date: this.getTodayDate(),
      program: profile.program || "",
      programId: profile.programId || "",
      currentCalories: profile.calories,
      currentProtein: profile.protein,
      weightChange: this.getWeeklyWeightChange(),
      workoutsCompleted: this.getWorkoutsCompletedThisWeek(),
      expectedWorkouts: this.getExpectedWorkouts(),
      completionRate: this.getCompletionRate(),
      basicRecommendation: this.getBasicRecommendation(),
    };

    const premiumReview = this.getPremiumRecommendation();

    return {
      ...basicReview,
      isPremium: PremiumEngine.isPremium(),
      premiumReview,
    };
  }

  static saveReview() {
    const review = this.generateReview();
    const profile = UserProfileEngine.getProfile();

    UserProfileEngine.saveProfile({
      ...profile,
      weeklyReview: {
        ...profile.weeklyReview,
        lastReviewDate: review.date,
        currentCalories: review.currentCalories,
        currentProtein: review.currentProtein,
        weeklyWeightChange: review.weightChange,
        workoutsCompleted: review.workoutsCompleted,
        aiNotes: review.basicRecommendation,
      },
    });

    localStorage.setItem("latestWeeklyReview", JSON.stringify(review));

    return review;
  }

  static getLatestReview() {
    return JSON.parse(localStorage.getItem("latestWeeklyReview")) || null;
  }
}

export default WeeklyReviewEngine;
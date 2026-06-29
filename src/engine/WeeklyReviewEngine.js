import UserProfileEngine from "./UserProfileEngine";
import PremiumEngine from "./PremiumEngine";
import ProgressiveOverloadEngine from "./ProgressiveOverloadEngine";

class WeeklyReviewEngine {

  static getBiggestWin() {
  const prsHit = this.getPRsHitThisWeek();
  const completionRate = this.getCompletionRate();
  const weightChange = this.getWeeklyWeightChange();

  if (prsHit >= 3) {
    return {
      title: "Strength Breakthrough",
      description: `You hit ${prsHit} new personal records this week.`
    };
  }

  if (completionRate >= 100) {
    return {
      title: "Perfect Consistency",
      description: "You completed every planned workout this week."
    };
  }

  if (weightChange > 0.3) {
    return {
      title: "Bodyweight Progress",
      description: `You gained ${weightChange} kg this week.`
    };
  }

  if (weightChange < -0.3) {
    return {
      title: "Fat Loss Progress",
      description: `You lost ${Math.abs(weightChange)} kg this week.`
    };
  }

  return {
    title: "Stayed Consistent",
    description: "You kept showing up and building momentum."
  };
}

static getWorkoutStreak() {
  const history = this.getWorkoutHistory()
    .filter(workout => workout.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (history.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateString = currentDate.toDateString();

    const completed = history.some(
      workout => new Date(workout.date).toDateString() === dateString
    );

    if (completed) {
      streak++;
    } else {
      if (streak > 0) break;
    }

    currentDate.setDate(currentDate.getDate() - 1);

    if (streak > history.length) break;
  }

  return streak;
}

static getRecoveryScore() {
  const completionRate = this.getCompletionRate();
  const prsHit = this.getPRsHitThisWeek();
  const workoutStreak = this.getWorkoutStreak();

  let score = 60;

  score += Math.min(20, Math.round(completionRate / 5));
  score += Math.min(10, prsHit * 2);
  score += Math.min(10, workoutStreak);

  return Math.max(0, Math.min(100, score));
}

static getWeeklyGrade() {
  const completionRate = this.getCompletionRate();
  const prsHit = this.getPRsHitThisWeek();
  const recoveryScore = this.getRecoveryScore();

  let score =
    completionRate * 0.5 +
    recoveryScore * 0.3 +
    Math.min(prsHit * 5, 20);

  score = Math.round(Math.min(100, score));

  if (score >= 90) {
    return {
      grade: "A+",
      title: "Outstanding Week",
      description: "Excellent consistency, recovery, and strength progress."
    };
  }

  if (score >= 80) {
    return {
      grade: "A",
      title: "Great Week",
      description: "You stayed consistent and made solid progress."
    };
  }

  if (score >= 70) {
    return {
      grade: "B",
      title: "Good Week",
      description: "You're moving in the right direction. Keep building momentum."
    };
  }

  if (score >= 60) {
    return {
      grade: "C",
      title: "Average Week",
      description: "Some progress, but consistency can improve."
    };
  }

  return {
    grade: "D",
    title: "Needs Improvement",
    description: "Focus on completing more workouts and recovering well next week."
  };
}

static getCoachTip() {
  const completionRate = this.getCompletionRate();
  const prsHit = this.getPRsHitThisWeek();
  const weightChange = this.getWeeklyWeightChange();

  if (completionRate < 70) {
    return {
      title: "Prioritize Consistency",
      description: "Your results will improve most by completing every planned workout before changing your program."
    };
  }

  if (prsHit === 0) {
    return {
      title: "Progressive Overload",
      description: "Aim to add one rep or a small amount of weight to at least one exercise each session."
    };
  }

  if (weightChange < 0 && completionRate >= 80) {
    return {
      title: "Fuel Recovery",
      description: "Increase your calorie intake slightly to support training performance and recovery."
    };
  }

  return {
    title: "Keep Building Momentum",
    description: "Stay consistent, recover well, and continue focusing on quality training sessions."
  };
}
static getAchievements() {
  const achievements = [];

  const completionRate = this.getCompletionRate();
  const prsHit = this.getPRsHitThisWeek();
  const streak = this.getWorkoutStreak();
  const weightChange = this.getWeeklyWeightChange();

  if (completionRate >= 100) {
    achievements.push({
      title: "Perfect Week",
      description: "Completed every planned workout."
    });
  }

  if (prsHit >= 1) {
    achievements.push({
      title: "New PR",
      description: `Hit ${prsHit} personal record${prsHit > 1 ? "s" : ""}.`
    });
  }

  if (streak >= 3) {
    achievements.push({
      title: "Workout Streak",
      description: `${streak}-day training streak.`
    });
  }

  if (weightChange > 0.3) {
    achievements.push({
      title: "Weight Progress",
      description: `Bodyweight changed by ${weightChange} kg this week.`
    });
  }

  if (achievements.length === 0) {
    achievements.push({
      title: "Stayed Consistent",
      description: "Keep showing up—progress compounds over time."
    });
  }

  return achievements;
}

static getProteinConsistency() {
  const profile = UserProfileEngine.getProfile();

  const target = Number(profile.protein || 0);
  const intake = Number(profile.proteinToday || profile.proteinConsumed || target);

  if (!target) return 0;

  return Math.min(100, Math.round((intake / target) * 100));
}

static getMilestones() {
  const milestones = [];

  const prsHit = this.getPRsHitThisWeek();
  const completed = this.getWorkoutsCompletedThisWeek();
  const weightChange = this.getWeeklyWeightChange();

  if (prsHit >= 5) {
    milestones.push("Hit 5+ personal records this week");
  } else if (prsHit > 0) {
    milestones.push(`Hit ${prsHit} new personal record${prsHit > 1 ? "s" : ""}`);
  }

  if (completed > 0) {
    milestones.push(`Completed ${completed} workout${completed > 1 ? "s" : ""}`);
  }

  if (Math.abs(weightChange) >= 0.5) {
    milestones.push(
      `${weightChange > 0 ? "Gained" : "Lost"} ${Math.abs(weightChange)} kg this week`
    );
  }

  if (milestones.length === 0) {
    milestones.push("No major milestones this week—keep building momentum.");
  }

  return milestones;
}

static getImprovements() {
  const improvements = [];

  const completionRate = this.getCompletionRate();
  const recoveryScore = this.getRecoveryScore();
  const proteinConsistency = this.getProteinConsistency();
  const prsHit = this.getPRsHitThisWeek();

  if (completionRate < 100) {
    improvements.push("Complete every planned workout next week.");
  }

  if (recoveryScore < 80) {
    improvements.push("Prioritize sleep and recovery between training sessions.");
  }

  if (proteinConsistency < 90) {
    improvements.push("Hit your daily protein target more consistently.");
  }

  if (prsHit === 0) {
    improvements.push("Aim to beat at least one lift through progressive overload.");
  }

  if (improvements.length === 0) {
    improvements.push("Keep following the current plan and maintain your momentum.");
  }

  return improvements;
}


  static getWeightTrend() {
  const entries = this.getWeightEntries();

  return entries.slice(-7).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    weight: entry.weight,
  }));
}


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
    return Number(profile.programTrack || 4);
  }

  static getCompletionRate() {
    const completed = this.getWorkoutsCompletedThisWeek();
    const expected = this.getExpectedWorkouts();

    if (!expected) return 0;

    return Math.min(100, Math.round((completed / expected) * 100));
  }
static getBasicRecommendation() {
  const history = this.getWorkoutHistory();
  const latestWorkout = history[history.length - 1];
  const programId = latestWorkout?.programId || "";

  const weightChange = this.getWeeklyWeightChange();
  const completionRate = this.getCompletionRate();

  if (programId === "skinny-to-jacked") {
    if (weightChange < 0.2) {
      return "You may need slightly more food this week to keep building muscle.";
    }

    if (weightChange > 0.7) {
      return "You are gaining fast. Keep an eye on fat gain and stay consistent.";
    }

    return "Good lean-bulk pace. Keep training hard and stay consistent.";
  }

  if (programId === "bulking-journey") {
    if (weightChange < 0.3) {
      return "Your bulk may need more calories this week.";
    }

    return "Good bulking pace. Keep pushing your main lifts.";
  }

  if (programId === "8-week-shred") {
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

  const history = this.getWorkoutHistory();
  const latestWorkout = history[history.length - 1];
  const programId = latestWorkout?.programId || "";

  const weightChange = this.getWeeklyWeightChange();
  const completed = this.getWorkoutsCompletedThisWeek();
  const expected = this.getExpectedWorkouts();

  let calorieAdjustment = 0;
  let trainingAdvice = "Keep your current training structure.";

  if (programId === "skinny-to-jacked") {
    if (weightChange < 0.2) calorieAdjustment = 200;
    if (weightChange > 0.7) calorieAdjustment = -100;

    trainingAdvice =
      "Keep main lifts stable. Focus on adding reps or small weight increases.";
  }

  if (programId === "bulking-journey") {
    if (weightChange < 0.3) calorieAdjustment = 250;
    if (weightChange > 1) calorieAdjustment = -150;

    trainingAdvice =
      "Prioritize heavy compounds and recover well between sessions.";
  }

  if (programId === "8-week-shred") {
    if (weightChange >= 0) calorieAdjustment = -200;
    if (weightChange < -1) calorieAdjustment = 100;

    trainingAdvice =
      "Keep protein high and avoid reducing strength training volume too much.";
  }

  const newCalories =
    Number(profile.calories || 2400) + calorieAdjustment;

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
  static getPRsHitThisWeek() {
  const profile = UserProfileEngine.getProfile();
  const history = profile.exerciseHistory || [];
  const last7Days = this.getLast7Days();

  let prsHit = 0;
  const previousBest = {};

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  sortedHistory.forEach((exerciseSession) => {
    const sessionDate = new Date(exerciseSession.date).toDateString();
    const exerciseName = exerciseSession.exerciseName;

    exerciseSession.sets.forEach((set) => {
      const weight = Number(set.weight || 0);
      const reps = Number(set.reps || 0);

      if (!previousBest[exerciseName]) {
        previousBest[exerciseName] = {
          weight: 0,
          reps: 0,
        };
      }

      const oldBest = previousBest[exerciseName];

      const isPR =
        weight > oldBest.weight ||
        (weight === oldBest.weight && reps > oldBest.reps);

      if (last7Days.includes(sessionDate) && isPR && weight > 0 && reps > 0) {
        prsHit += 1;
      }

      if (
        weight > oldBest.weight ||
        (weight === oldBest.weight && reps > oldBest.reps)
      ) {
        previousBest[exerciseName] = {
          weight,
          reps,
        };
      }
    });
  });

  return prsHit;
}

static getTrainingConsistencyText() {
  const completed = this.getWorkoutsCompletedThisWeek();
  const expected = this.getExpectedWorkouts();

  if (completed >= expected) {
    return "Excellent consistency. You completed your planned workouts.";
  }

  if (completed >= expected * 0.7) {
    return "Good week, but there is still room to hit every planned session.";
  }

  return "Consistency is the main focus next week. Missed workouts will slow results.";
}

static getStrengthProgressText() {
  const prsHit = this.getPRsHitThisWeek();

  if (prsHit >= 5) {
    return "Strong progress. You hit multiple PRs this week.";
  }

  if (prsHit >= 1) {
    return "Some strength progress showed up this week. Keep building on it.";
  }

  return "No PRs detected this week. Focus on clean reps and progressive overload.";
}
static getNextWeekFocus() {
  const history = this.getWorkoutHistory();
  const latestWorkout = history[history.length - 1];
  const programId = latestWorkout?.programId || "";

  const weightChange = this.getWeeklyWeightChange();
  const completionRate = this.getCompletionRate();

  if (completionRate < 70) {
    return "Hit all scheduled workouts before changing anything else.";
  }

  if (programId === "skinny-to-jacked" && weightChange < 0.2) {
    return "Eat more consistently and aim to increase bodyweight slightly.";
  }

  if (programId === "bulking-journey" && weightChange < 0.3) {
    return "Push food intake higher and keep trying to beat your previous lifts.";
  }

  if (programId === "8-week-shred" && weightChange >= 0) {
    return "Tighten calories, keep protein high, and add more daily movement.";
  }

  return "Keep the current plan and aim to beat last week’s performance.";
}

static generateReview() {

  const profile = UserProfileEngine.getProfile();

  const premiumReview = this.getPremiumRecommendation();

  const biggestWin = this.getBiggestWin();

  const grade = this.getWeeklyGrade();

  const coachTip = this.getCoachTip();

  return {

    date: this.getTodayDate(),

    isPremium: PremiumEngine.isPremium(),

    programId: profile.programId || "",

    currentCalories: profile.calories,

    currentProtein: profile.protein,

    weightTrend: this.getWeightTrend(),

    weightChange: this.getWeeklyWeightChange(),

    workoutsCompleted: this.getWorkoutsCompletedThisWeek(),

    expectedWorkouts: this.getExpectedWorkouts(),

    completionRate: this.getCompletionRate(),

    prsHit: this.getPRsHitThisWeek(),

    weeklyProgressionScore:
      ProgressiveOverloadEngine.getWeeklyProgressionScore(),

    basicRecommendation:
      this.getBasicRecommendation(),

    trainingConsistencyText:
      this.getTrainingConsistencyText(),

    strengthProgressText:
      this.getStrengthProgressText(),

    nextWeekFocus:
      this.getNextWeekFocus(),

    premiumReview,

    biggestWin: biggestWin.title,

    biggestWinDescription:
      biggestWin.description,

    achievements:
      this.getAchievements(),

    recoveryScore:
      this.getRecoveryScore(),

    proteinConsistency:
      this.getProteinConsistency(),

    workoutStreak:
      this.getWorkoutStreak(),

    weekGrade:
      grade.grade,

    gradeTitle:
      grade.title,

    gradeDescription:
      grade.description,

    milestones:
      this.getMilestones(),

    improvements:
      this.getImprovements(),

    tipTitle:
      coachTip.title,

    tipDescription:
      coachTip.description,

    totalTrainingTime:
      this.getWorkoutsCompletedThisWeek() * 75,

    totalSets:
      this.getWorkoutsCompletedThisWeek() * 24,

    totalVolume:
      this.getWorkoutsCompletedThisWeek() * 4800,

  };

}

  static saveReview() {

  const review = this.generateReview();

  const profile = UserProfileEngine.getProfile();

  UserProfileEngine.saveProfile({

    ...profile,

    weeklyReview: {

      ...profile.weeklyReview,

      lastReviewDate:
        review.date,

      currentCalories:
        review.currentCalories,

      currentProtein:
        review.currentProtein,

      weeklyWeightChange:
        review.weightChange,

      workoutsCompleted:
        review.workoutsCompleted,

      completionRate:
        review.completionRate,

      progressionScore:
        review.weeklyProgressionScore,

      workoutStreak:
        review.workoutStreak,

      recoveryScore:
        review.recoveryScore,

      prsHit:
        review.prsHit,

      weekGrade:
        review.weekGrade,

      aiNotes:
        review.basicRecommendation,

      nextWeekFocus:
        review.nextWeekFocus,

      biggestWin:
        review.biggestWin,

      totalTrainingTime:
        review.totalTrainingTime,

      totalSets:
        review.totalSets,

      totalVolume:
        review.totalVolume,

      achievements:
        review.achievements,

      milestones:
        review.milestones,

      improvements:
        review.improvements,

    },

  });

  localStorage.setItem(
    "latestWeeklyReview",
    JSON.stringify(review)
  );

  return review;

}
  static getLatestReview() {
    return JSON.parse(localStorage.getItem("latestWeeklyReview")) || null;
  }
}

export default WeeklyReviewEngine;
import UserProfileEngine from "./UserProfileEngine";
import FoodLogEngine from "./FoodLogEngine";
import DashboardEngine from "./DashboardEngine";

class DashboardCoachEngine {

  static getDailyFocus() {

    const profile =
      UserProfileEngine.getProfile();

    const recovery =
      DashboardEngine.getRecoveryScore();

    const calories =
      FoodLogEngine.getTodayCalories();

    const remainingCalories =
      profile.calories - calories;

    if (recovery >= 80) {
      return {
        title: "PR Opportunity 🚀",
        message:
          "Recovery is high. Push your top sets and chase progression today.",
      };
    }

    if (remainingCalories > 500) {

  let foodPlan = "";

  if (remainingCalories >= 900) {
    foodPlan =
      "2 cups rice • 4 eggs • 1 banana";
  }

  else if (remainingCalories >= 600) {
    foodPlan =
      "2 cups rice • 3 eggs";
  }

  else {
    foodPlan =
      "1 cup rice • 2 eggs";
  }

  return {
    title: "Nutrition Alert 🍽️",

    message:
      `You still need roughly ${remainingCalories} calories today.

Suggested:

${foodPlan}`,
  };
}

    return {
      title: "Stay Consistent 🎯",
      message:
        "Complete today's workout and hit your nutrition targets.",
    };
  }
}

export default DashboardCoachEngine;
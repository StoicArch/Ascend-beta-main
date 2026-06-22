import UserProfileEngine from "./UserProfileEngine";
import FoodLogEngine from "./FoodLogEngine";
import DashboardEngine from "./DashboardEngine";
import PremiumEngine from "./PremiumEngine";

class DashboardCoachEngine {
    static getNutritionRecommendations() {
      const profile = UserProfileEngine.getProfile();
      const recovery = DashboardEngine.getRecoveryScore();
      const totals = FoodLogEngine.getDailyTotals();

      const calorieGap = Number(profile.calories || 0) - totals.calories;
      const proteinGap = Number(profile.protein || 0) - totals.protein;

      const recommendations = [];

      if (proteinGap > 25) {
        recommendations.push({
          type: "Protein Alert",
          title: "Protein Alert",
          message: `You are ${proteinGap}g short of your protein target. Add lean protein in your next meal.`,
        });
      } else {
        recommendations.push({
          type: "Protein Alert",
          title: "Protein On Track",
          message: "Protein intake is tracking well for today's target.",
        });
      }

      if (calorieGap > 500) {
        recommendations.push({
          type: "Calorie Alert",
          title: "Calorie Alert",
          message: `You are ${calorieGap} calories under target. Add a balanced meal to support training.`,
        });
      } else if (calorieGap < -300) {
        recommendations.push({
          type: "Calorie Alert",
          title: "Calorie Alert",
          message: `You are ${Math.abs(calorieGap)} calories above target. Keep the next meal lighter.`,
        });
      } else {
        recommendations.push({
          type: "Calorie Alert",
          title: "Calories On Track",
          message: "Calories are close to today's target.",
        });
      }

      if (recovery < 65 && (proteinGap > 15 || calorieGap > 300)) {
        recommendations.push({
          type: "Recovery Nutrition Alert",
          title: "Recovery Nutrition Alert",
          message: "Recovery is low and nutrition is behind. Prioritize protein, carbs, and hydration today.",
        });
      } else {
        recommendations.push({
          type: "Recovery Nutrition Alert",
          title: "Recovery Nutrition",
          message: "Nutrition is not currently limiting your recovery score.",
        });
      }

      return recommendations;
    }

    static getPremiumNutritionInsight() {

  const premium =
    PremiumEngine.isPremium();

  if (!premium) {
    return {
      locked: true,
      title: "🔒 Premium Nutrition Insight",
      message:
        "Upgrade to unlock AI nutrition recommendations.",
    };
  }

  const profile =
    UserProfileEngine.getProfile();

  const calories =
    FoodLogEngine.getTodayCalories();

  const protein =
    FoodLogEngine.getTodayProtein();

  const calorieGap =
    profile.calories - calories;

  const proteinGap =
    profile.protein - protein;

  if (proteinGap > 30) {
    return {
      locked: false,
      title: "Protein Priority 💪",
      message:
        `You're approximately ${proteinGap}g short of your protein target. Add a high protein meal before bed.`,
    };
  }

  if (calorieGap > 500) {
    return {
      locked: false,
      title: "Recovery Fuel 🍽️",
      message:
        `You're roughly ${calorieGap} calories under target today. Consider another meal.`,
    };
  }

  return {
    locked: false,
    title: "Nutrition On Track ✅",
    message:
      "You're close to your nutrition targets. Focus on consistency.",
  };
}

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

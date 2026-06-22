import UserProfileEngine from "./UserProfileEngine";
import NutritionEngine from "./NutritionEngine";

class ProfileMigrationEngine {
  static migrate() {
    const profile = UserProfileEngine.getProfile();

    if (!profile.programId) return profile;

    const needsNutrition =
      !profile.carbs ||
      !profile.fat ||
      !profile.weeklyTargetChange ||
      !profile.estimatedWeeksToGoal;

    if (!needsNutrition) return profile;

    const currentWeight = Number(profile.weight || 70);
    const goalWeight = Number(profile.goalWeight || currentWeight);

    const nutrition = NutritionEngine.getProgramNutrition({
     
      goal: profile.goal,
      weight: currentWeight,
      goalWeight,
      trainingDays: profile.trainingDays || 4,
    });

    return UserProfileEngine.saveProfile({
      ...profile,

      weight: nutrition.currentWeight,
      startingWeight: profile.startingWeight || nutrition.currentWeight,
      goalWeight: profile.goalWeight || nutrition.goalWeight,

      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,

      nutritionPhase: nutrition.nutritionPhase,
      nutritionNote: nutrition.nutritionNote,
      weeklyTargetChange: nutrition.weeklyTargetChange,
      estimatedWeeksToGoal: nutrition.estimatedWeeksToGoal,
      maintenanceCalories: nutrition.maintenanceCalories,

      weeklyReview: {
        ...profile.weeklyReview,
        currentCalories: nutrition.calories,
        currentProtein: nutrition.protein,
        currentPhase: nutrition.nutritionPhase,
        aiNotes: nutrition.nutritionNote,
      },
    });
  }
}

export default ProfileMigrationEngine;
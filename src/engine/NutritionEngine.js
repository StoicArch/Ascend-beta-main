class NutritionEngine {
  static estimateMaintenance(weight, trainingDays) {
    const bodyWeight = Number(weight || 70);
    const days = Number(trainingDays || 4);

    return Math.round(bodyWeight * 33 + days * 50);
  }

  static getProgramNutrition({
    programId,
    goal,
    weight,
    goalWeight,
    trainingDays,
  }) {
    const bodyWeight = Number(weight || 70);
    const targetWeight = Number(goalWeight || weight || 70);
    const maintenance = this.estimateMaintenance(bodyWeight, trainingDays);

    let weeklyTargetChange = 0;
    let calories = maintenance;
    let nutritionPhase = "Build";
    let nutritionNote = "Moderate nutrition target for steady progress.";

    if (programId === "skinny-to-jacked") {
      weeklyTargetChange = 0.35;
      calories = maintenance + 250;
      nutritionPhase = "Lean Bulk";
      nutritionNote = "Lean surplus to build muscle while staying relatively lean.";
    }

    if (programId === "bulking-journey") {
      weeklyTargetChange = 0.6;
      calories = maintenance + 450;
      nutritionPhase = "Bulk";
      nutritionNote = "Higher surplus to gain size and strength faster.";
    }

    if (programId === "8-week-shred" || goal === "Lose fat") {
      weeklyTargetChange = -0.6;
      calories = maintenance - 400;
      nutritionPhase = "Cut";
      nutritionNote = "Deficit calories with high protein to keep muscle.";
    }

    const protein = Math.round(bodyWeight * 2);
    const fat = Math.round(bodyWeight * 0.8);

    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const carbCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.max(50, Math.round(carbCalories / 4));

    const totalWeightChange = Number((targetWeight - bodyWeight).toFixed(1));

    const estimatedWeeksToGoal =
      weeklyTargetChange !== 0
        ? Math.max(1, Math.ceil(Math.abs(totalWeightChange / weeklyTargetChange)))
        : 1;

    return {
      calories,
      protein,
      carbs,
      fat,
      nutritionPhase,
      nutritionNote,
      currentWeight: bodyWeight,
      goalWeight: targetWeight,
      totalWeightChange,
      weeklyTargetChange,
      estimatedWeeksToGoal,
      maintenanceCalories: maintenance,
    };
  }
}

export default NutritionEngine;
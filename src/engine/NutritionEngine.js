class NutritionEngine {
  static estimateMaintenance(weight, trainingDays) {
    const bodyWeight = Number(weight || 70);
    const days = Number(trainingDays || 4);

    return Math.round(bodyWeight * 33 + days * 50);
  }

  static getProgramNutrition({ programId, goal, weight, trainingDays }) {
    const maintenance = this.estimateMaintenance(weight, trainingDays);
    const bodyWeight = Number(weight || 70);

    if (programId === "skinny-to-jacked") {
      return {
        calories: maintenance + 250,
        protein: Math.round(bodyWeight * 2),
        nutritionPhase: "Lean Bulk",
        nutritionNote: "Small surplus to build muscle while staying lean.",
      };
    }

    if (programId === "bulking-journey") {
      return {
        calories: maintenance + 450,
        protein: Math.round(bodyWeight * 2),
        nutritionPhase: "Bulk",
        nutritionNote: "Bigger surplus to gain size and strength faster.",
      };
    }

    if (programId === "8-week-shred" || goal === "Lose fat") {
      return {
        calories: maintenance - 400,
        protein: Math.round(bodyWeight * 2.2),
        nutritionPhase: "Cut",
        nutritionNote: "Calorie deficit with high protein to keep muscle.",
      };
    }

    return {
      calories: maintenance + 200,
      protein: Math.round(bodyWeight * 2),
      nutritionPhase: "Build",
      nutritionNote: "Moderate surplus for steady progress.",
    };
  }
}

export default NutritionEngine;
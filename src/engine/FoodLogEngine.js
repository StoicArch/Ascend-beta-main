class FoodLogEngine {
  static getMeals() {
    return JSON.parse(
      localStorage.getItem("foodLog")
    ) || [];
  }

  static getTodayDate() {
    return new Date().toDateString();
  }

  static createId() {
    return `meal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  static getFoodDatabase() {
    return [
      { pattern: /rice/i, calories: 205, protein: 4, carbs: 45, fat: 0.4, unit: "cup" },
      { pattern: /chicken/i, calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: "serving" },
      { pattern: /egg/i, calories: 70, protein: 6, carbs: 0.5, fat: 5, unit: "item" },
      { pattern: /milk/i, calories: 150, protein: 8, carbs: 12, fat: 8, unit: "cup" },
      { pattern: /bread|toast/i, calories: 80, protein: 3, carbs: 15, fat: 1, unit: "slice" },
      { pattern: /banana/i, calories: 105, protein: 1, carbs: 27, fat: 0.3, unit: "item" },
      { pattern: /oat/i, calories: 150, protein: 5, carbs: 27, fat: 3, unit: "cup" },
      { pattern: /beef/i, calories: 250, protein: 26, carbs: 0, fat: 15, unit: "serving" },
      { pattern: /salmon|fish/i, calories: 200, protein: 22, carbs: 0, fat: 12, unit: "serving" },
      { pattern: /potato/i, calories: 160, protein: 4, carbs: 37, fat: 0.2, unit: "item" },
      { pattern: /pasta/i, calories: 220, protein: 8, carbs: 43, fat: 1, unit: "cup" },
      { pattern: /yogurt/i, calories: 130, protein: 12, carbs: 17, fat: 2, unit: "cup" },
    ];
  }

  static getQuantity(text, unit) {
    const normalized = text.toLowerCase();
    const numberMatch = normalized.match(/(\d+(\.\d+)?)/);

    if (numberMatch) {
      return Number(numberMatch[1]);
    }

    if (unit === "slice" && normalized.includes("slice")) return 1;
    if (unit === "cup" && normalized.includes("cup")) return 1;

    return 1;
  }

  static estimateMeal(text) {
    const parts = text
      .split(/,| and |\+|&/i)
      .map((item) => item.trim())
      .filter(Boolean);

    const items = parts.length > 0 ? parts : [text];
    const estimates = [];

    items.forEach((item) => {
      const match = this.getFoodDatabase().find((food) =>
        food.pattern.test(item)
      );

      if (!match) return;

      const quantity = this.getQuantity(item, match.unit);

      estimates.push({
        name: item,
        quantity,
        calories: Math.round(match.calories * quantity),
        protein: Math.round(match.protein * quantity),
        carbs: Math.round(match.carbs * quantity),
        fat: Math.round(match.fat * quantity),
      });
    });

    const totals = estimates.reduce(
      (total, item) => ({
        calories: total.calories + item.calories,
        protein: total.protein + item.protein,
        carbs: total.carbs + item.carbs,
        fat: total.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    if (estimates.length === 0) {
      return {
        name: text,
        calories: 350,
        protein: 20,
        carbs: 35,
        fat: 12,
        items: [],
        estimated: true,
      };
    }

    return {
      name: text,
      ...totals,
      items: estimates,
      estimated: true,
    };
  }

  static saveMeal(meal) {
    const meals = this.getMeals();

    meals.push({
      id: meal.id || this.createId(),
      ...meal,
      date: meal.date || this.getTodayDate(),
      createdAt: meal.createdAt || new Date().toISOString(),
    });

    localStorage.setItem(
      "foodLog",
      JSON.stringify(meals)
    );

    return meals;
  }

  static saveManualMeal(text) {
    return this.saveMeal({
      ...this.estimateMeal(text),
      source: "manual",
    });
  }

  static canEditMeal(meal) {
    return meal?.date === this.getTodayDate();
  }

  static updateMeal(id, updates) {
    const meals = this.getMeals();
    const updatedMeals = meals.map((meal) => {
      if (meal.id !== id || !this.canEditMeal(meal)) {
        return meal;
      }

      return {
        ...meal,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });

    localStorage.setItem("foodLog", JSON.stringify(updatedMeals));
    return updatedMeals;
  }

  static deleteMeal(id) {
    const meals = this.getMeals();
    const updatedMeals = meals.filter(
      (meal) => meal.id !== id || !this.canEditMeal(meal)
    );

    localStorage.setItem("foodLog", JSON.stringify(updatedMeals));
    return updatedMeals;
  }

  static getTodayMeals() {
    const today = this.getTodayDate();

    return this.getMeals().filter(
      meal => meal.date === today
    );
  }

  static getTodayCalories() {
    return this.getTodayMeals().reduce(
      (total, meal) => total + (meal.calories || 0),
      0
    );
  }

  static getTodayProtein() {
    return this.getTodayMeals().reduce(
      (total, meal) => total + (meal.protein || 0),
      0
    );
  }

  static getTodayCarbs() {
    return this.getTodayMeals().reduce(
      (total, meal) => total + (meal.carbs || 0),
      0
    );
  }

  static getTodayFat() {
    return this.getTodayMeals().reduce(
      (total, meal) => total + (meal.fat || 0),
      0
    );
  }

  static getDailyTotals(date = this.getTodayDate()) {
    const meals = this.getMeals().filter((meal) => meal.date === date);

    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + Number(meal.calories || 0),
        protein: total.protein + Number(meal.protein || 0),
        carbs: total.carbs + Number(meal.carbs || 0),
        fat: total.fat + Number(meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  static getMealsByDate(date) {
    return this.getMeals().filter((meal) => meal.date === date);
  }

  static getHistoryByDate() {
    return this.getMeals().reduce((history, meal) => {
      if (!history[meal.date]) {
        history[meal.date] = [];
      }

      history[meal.date].push(meal);
      return history;
    }, {});
  }

  static getTodayMealCount() {
    return this.getTodayMeals().length;
  }
}

export default FoodLogEngine;

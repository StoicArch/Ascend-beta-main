class FoodLogEngine {
  static getMeals() {
    return JSON.parse(
      localStorage.getItem("foodLog")
    ) || [];
  }

  static saveMeal(meal) {
    const meals = this.getMeals();

    meals.push({
      ...meal,
      date: new Date().toDateString(),
    });

    localStorage.setItem(
      "foodLog",
      JSON.stringify(meals)
    );

    return meals;
  }

  static getTodayMeals() {
    const today = new Date().toDateString();

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
}

export default FoodLogEngine;
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
}

export default FoodLogEngine;
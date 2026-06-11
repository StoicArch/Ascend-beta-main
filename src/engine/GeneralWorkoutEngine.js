import UserProfileEngine from "./UserProfileEngine";
import { EXERCISES } from "../Data/exercises";
import WorkoutRules from "./WorkoutRules";

class GeneralWorkoutEngine {
  static getProfile() {
    return UserProfileEngine.getProfile();
  }

  static getUserEquipment() {
    const profile = this.getProfile();

    if (!profile.equipment || profile.equipment.length === 0) {
      return ["Bodyweight", "Dumbbells", "Barbell", "Machine", "Cable", "Smith Machine"];
    }

    return profile.equipment;
  }

  static normalizeFocus(focus) {
    const map = {
      "Upper Chest": "Chest",
      "Mid Chest": "Chest",
      "Lower Chest": "Chest",

      "Front Delts": "Shoulders",
      "Side Delts": "Shoulders",
      "Rear Delts": "Shoulders",

      Lats: "Back",
      "Upper Back": "Back",
      "Lower Back": "Back",
      Traps: "Back",

      Quads: "Legs",
      Hamstrings: "Legs",
      Calves: "Legs",
    };

    return map[focus] || focus;
  }

  static getDefaultSplit() {
    const profile = this.getProfile();
    const trainingDays = Number(profile.trainingDays || 4);

    const splits = {
      3: [["Chest", "Triceps"], ["Back", "Biceps"], ["Legs", "Glutes"]],
      4: [["Chest", "Triceps"], ["Back", "Biceps"], ["Legs"], ["Shoulders", "Abs"]],
      5: [["Chest"], ["Back"], ["Legs"], ["Shoulders"], ["Biceps", "Triceps", "Abs"]],
      6: [
        ["Chest", "Triceps"],
        ["Back", "Biceps"],
        ["Legs"],
        ["Shoulders", "Abs"],
        ["Legs", "Glutes"],
        ["Biceps", "Triceps"],
      ],
    };

    return splits[trainingDays] || splits[4];
  }

  static getWorkoutIndexForToday() {
    const profile = this.getProfile();
    const trainingDays = Number(profile.trainingDays || 4);
    const today = new Date().getDay();

    return today % trainingDays;
  }

  static getTodayFocus() {
    const profile = this.getProfile();
    const weeklyPlan = profile.weeklyPlan;

    if (!weeklyPlan) {
      const split = this.getDefaultSplit();
      const index = this.getWorkoutIndexForToday();

      return split[index] || split[0];
    }

    const todayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const todayPlan = weeklyPlan[todayName];

    if (!todayPlan || todayPlan.rest) {
      return [];
    }

    const focus = [];

    Object.keys(todayPlan).forEach((key) => {
      if (key !== "rest" && !key.includes("-expanded")) {
        if (Array.isArray(todayPlan[key])) {
          focus.push(...todayPlan[key]);
        } else {
          focus.push(key);
        }
      }
    });

    return [...new Set(focus)];
  }

  static getExercisesForMuscle(muscle) {
    const equipment = this.getUserEquipment();

    return EXERCISES.filter(
      (exercise) =>
        exercise.muscle === muscle && equipment.includes(exercise.equipment)
    );
  }

  static getRandomExercise(exercises, usedIds) {
    const available = exercises.filter((exercise) => !usedIds.includes(exercise.id));

    if (available.length === 0) return null;

    return available[Math.floor(Math.random() * available.length)];
  }

  static generateWorkoutFromFocus(focusList) {
    const workout = [];
    const usedIds = [];

    focusList.forEach((focus) => {
      const muscle = this.normalizeFocus(focus);
      const rules = WorkoutRules[muscle];

      if (!rules) return;

      const maxPerMuscle = focusList.length > 1 ? 2 : 4;

      rules.slice(0, maxPerMuscle).forEach(() => {
        const options = this.getExercisesForMuscle(muscle);
        const selected = this.getRandomExercise(options, usedIds);

        if (selected) {
          usedIds.push(selected.id);

          workout.push({
            ...selected,
            focus: focusList,
          });
        }
      });
    });

    return workout;
  }

  static getTodayWorkout() {
    const focus = this.getTodayFocus();
    return this.generateWorkoutFromFocus(focus);
  }
}

export default GeneralWorkoutEngine;
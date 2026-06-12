import UserProfileEngine from "./UserProfileEngine";
import { EXERCISES } from "../Data/exercises";


class GeneralWorkoutEngine {
  static getProfile() {
    return UserProfileEngine.getProfile();
  }

  static getUserEquipment() {
    const profile = this.getProfile();

    if (!profile.equipment || profile.equipment.length === 0) {
      return ["Dumbbells", "Barbell", "Machine", "Cable", "Smith Machine"];
    }

    return profile.equipment;
  }

  static shouldExcludeBodyweight() {
    const profile = this.getProfile();
    const equipment = this.getUserEquipment();

    const gymEquipment = [
      "Dumbbells",
      "Barbell",
      "Machine",
      "Cable",
      "Smith Machine",
    ];

    return (
      profile.location === "Gym" ||
      equipment.some((item) => gymEquipment.includes(item))
    );
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
      Glutes: "Glutes",

      Cardio: "Conditioning",
      FullBody: "Full Body",
    };

    return map[focus] || focus;
  }

  static getDefaultSplit() {
    const profile = this.getProfile();
    const trainingDays = Number(profile.trainingDays || 4);

    const splits = {
      3: [
        ["Chest", "Back", "Shoulders"],
        ["Legs", "Glutes", "Abs"],
        ["Chest", "Back", "Arms"],
      ],

      4: [
        ["Chest", "Triceps"],
        ["Back", "Biceps"],
        ["Legs", "Glutes"],
        ["Shoulders", "Abs"],
      ],

      5: [
        ["Chest"],
        ["Back"],
        ["Legs", "Glutes"],
        ["Shoulders"],
        ["Biceps", "Triceps", "Abs"],
      ],

      6: [
        ["Chest", "Triceps"],
        ["Back", "Biceps"],
        ["Legs"],
        ["Shoulders", "Abs"],
        ["Glutes", "Hamstrings"],
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

    if (!weeklyPlan || Object.keys(weeklyPlan).length === 0) {
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

    if (Array.isArray(todayPlan.focus)) {
      return todayPlan.focus;
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
    const excludeBodyweight = this.shouldExcludeBodyweight();

    return EXERCISES.filter((exercise) => {
      const muscleMatch = exercise.muscle === muscle;
      const equipmentMatch = equipment.includes(exercise.equipment);
      const bodyweightBlocked =
        excludeBodyweight && exercise.equipment === "Bodyweight";

      return muscleMatch && equipmentMatch && !bodyweightBlocked;
    });
  }

  static getRandomExercise(exercises, usedIds) {
    const available = exercises.filter(
      (exercise) => !usedIds.includes(exercise.id)
    );

    if (available.length === 0) return null;

    return available[Math.floor(Math.random() * available.length)];
  }

  static getVolumeForMuscle(muscle, focusList) {
    const normalizedFocus = focusList.map((focus) => this.normalizeFocus(focus));

    const isSingleMuscle = normalizedFocus.length === 1;

    if (isSingleMuscle) {
      if (muscle === "Chest") return 7;
      if (muscle === "Back") return 7;
      if (muscle === "Legs") return 7;
      if (muscle === "Shoulders") return 6;
      if (muscle === "Glutes") return 6;
      if (muscle === "Biceps") return 5;
      if (muscle === "Triceps") return 5;
      if (muscle === "Abs") return 4;
      return 5;
    }

    if (muscle === "Chest") return 5;
    if (muscle === "Back") return 5;
    if (muscle === "Legs") return 5;
    if (muscle === "Shoulders") return 4;
    if (muscle === "Glutes") return 4;
    if (muscle === "Biceps") return 3;
    if (muscle === "Triceps") return 3;
    if (muscle === "Abs") return 3;

    return 3;
  }

  static generateWorkoutFromFocus(focusList) {
    const workout = [];
    const usedIds = [];

    const normalizedMuscles = [
      ...new Set(focusList.map((focus) => this.normalizeFocus(focus))),
    ];

    normalizedMuscles.forEach((muscle) => {
      if (muscle === "Full Body") {
        ["Chest", "Back", "Legs", "Shoulders", "Abs"].forEach((fullMuscle) => {
          const options = this.getExercisesForMuscle(fullMuscle);
          const selected = this.getRandomExercise(options, usedIds);

          if (selected) {
            usedIds.push(selected.id);
            workout.push({
              ...selected,
              focus: focusList,
            });
          }
        });

        return;
      }

      const targetVolume = this.getVolumeForMuscle(muscle, focusList);
      const options = this.getExercisesForMuscle(muscle);

      for (let i = 0; i < targetVolume; i++) {
        const selected = this.getRandomExercise(options, usedIds);

        if (!selected) break;

        usedIds.push(selected.id);

        workout.push({
          ...selected,
          focus: focusList,
        });
      }
    });

    return workout;
  }

  static getTodayWorkout() {
    const focus = this.getTodayFocus();
    return this.generateWorkoutFromFocus(focus);
  }
}

export default GeneralWorkoutEngine;
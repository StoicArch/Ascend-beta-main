import { EXERCISES } from "../Data/exercises";
import UserProfileEngine from "./UserProfileEngine";

class WorkoutPlannerEngine {
  static getUserEquipment() {
    const profile = UserProfileEngine.getProfile();
    



    if (profile.location === "Gym") {
      return ["Dumbbells", "Barbell", "Machine", "Cable", "Smith Machine", "Bodyweight"];
    }

    if (!profile.equipment || profile.equipment.length === 0) {
      return ["Bodyweight", "Dumbbells"];
    }

    return profile.equipment;
  }

  static getExercisesByTarget(target, usedIds = []) {
    const equipment = this.getUserEquipment();

    return EXERCISES.filter(
      (exercise) =>
        exercise.target === target &&
        equipment.includes(exercise.equipment) &&
        !usedIds.includes(exercise.id)
    );
  }

  static getExercisesByMuscle(muscle, usedIds = []) {
    const equipment = this.getUserEquipment();

    return EXERCISES.filter(
      (exercise) =>
        exercise.muscle === muscle &&
        equipment.includes(exercise.equipment) &&
        !usedIds.includes(exercise.id)
    );
  }

  static pickExercise(options) {
    if (!options || options.length === 0) return null;
    return options[Math.floor(Math.random() * options.length)];
  }

  static buildFromTargets(targetPlan) {
    const workout = [];
    const usedIds = [];

    targetPlan.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        let options = this.getExercisesByTarget(item.target, usedIds);

        if (options.length === 0 && item.fallbackMuscle) {
          options = this.getExercisesByMuscle(item.fallbackMuscle, usedIds);
        }

        const selected = this.pickExercise(options);

        if (selected) {
          usedIds.push(selected.id);
          workout.push(selected);
        }
      }
    });

    return workout;
  }

  static getPlanForFocus(focusList) {
    const focus = focusList.join(" ");

    if (focus.includes("Chest")) {
      return [
        { target: "Upper Chest", fallbackMuscle: "Chest", count: 2 },
        { target: "Mid Chest", fallbackMuscle: "Chest", count: 1 },
        { target: "Chest Isolation", fallbackMuscle: "Chest", count: 1 },
        { target: "Triceps", fallbackMuscle: "Triceps", count: 1 },
      ];
    }

    if (focus.includes("Back")) {
      return [
        { target: "Lats", fallbackMuscle: "Back", count: 2 },
        { target: "Upper Back", fallbackMuscle: "Back", count: 2 },
        { target: "Mid Back", fallbackMuscle: "Back", count: 1 },
        { target: "Traps", fallbackMuscle: "Back", count: 1 },
      ];
    }

    if (focus.includes("Shoulders")) {
      return [
        { target: "Side Delts", fallbackMuscle: "Shoulders", count: 2 },
        { target: "Rear Delts", fallbackMuscle: "Shoulders", count: 1 },
        { target: "Front Delts", fallbackMuscle: "Shoulders", count: 1 },
      ];
    }

    if (focus.includes("Biceps")) {
      return [
        { target: "Biceps", fallbackMuscle: "Biceps", count: 3 },
      ];
    }

    if (focus.includes("Triceps")) {
      return [
        { target: "Triceps", fallbackMuscle: "Triceps", count: 3 },
      ];
    }

    if (focus.includes("Quads")) {
      return [
        { target: "Quads", fallbackMuscle: "Quads", count: 4 },
        { target: "Calves", fallbackMuscle: "Calves", count: 1 },
      ];
    }

    if (focus.includes("Hamstrings")) {
      return [
        { target: "Hamstrings", fallbackMuscle: "Hamstrings", count: 3 },
        { target: "Glutes", fallbackMuscle: "Glutes", count: 1 },
      ];
    }

    if (focus.includes("Glutes")) {
      return [
        { target: "Glutes", fallbackMuscle: "Glutes", count: 3 },
        { target: "Side Glutes", fallbackMuscle: "Glutes", count: 1 },
      ];
    }

    if (focus.includes("Abs")) {
      return [
        { target: "Abs", fallbackMuscle: "Abs", count: 2 },
        { target: "Lower Abs", fallbackMuscle: "Abs", count: 1 },
        { target: "Obliques", fallbackMuscle: "Abs", count: 1 },
      ];
    }

    return focusList.map((item) => ({
      target: item,
      fallbackMuscle: item,
      count: 3,
    }));
  }

 

    
  static generateWorkout(focusList) {
  const profile = UserProfileEngine.getProfile();
  const programId = profile.programId;
  const focus = focusList.join(" ");

  if (programId === "skinny-to-jacked" && focus.includes("Chest")) {
    return this.buildFromTargets([
      { target: "Upper Chest", fallbackMuscle: "Chest", count: 3 },
      { target: "Mid Chest", fallbackMuscle: "Chest", count: 1 },
      { target: "Chest Isolation", fallbackMuscle: "Chest", count: 1 },
    ]);
  }

  if (programId === "skinny-to-jacked" && focus.includes("Back")) {
    return this.buildFromTargets([
      { target: "Upper Back", fallbackMuscle: "Back", count: 3 },
      { target: "Lats", fallbackMuscle: "Back", count: 2 },
      { target: "Traps", fallbackMuscle: "Back", count: 1 },
    ]);
  }

  if (programId === "skinny-to-jacked" && focus.includes("Shoulders")) {
    return this.buildFromTargets([
      { target: "Side Delts", fallbackMuscle: "Shoulders", count: 3 },
      { target: "Rear Delts", fallbackMuscle: "Shoulders", count: 1 },
      { target: "Front Delts", fallbackMuscle: "Shoulders", count: 1 },
    ]);
  }

  if (programId === "8-week-shred" && focus.includes("Chest")) {
    return this.buildFromTargets([
      { target: "Upper Chest", fallbackMuscle: "Chest", count: 1 },
      { target: "Mid Chest", fallbackMuscle: "Chest", count: 1 },
      { target: "Chest Isolation", fallbackMuscle: "Chest", count: 1 },
      { target: "Triceps", fallbackMuscle: "Triceps", count: 1 },
      { target: "Conditioning", fallbackMuscle: "Conditioning", count: 1 },
    ]);
  }

  if (programId === "8-week-shred" && focus.includes("Back")) {
    return this.buildFromTargets([
      { target: "Lats", fallbackMuscle: "Back", count: 2 },
      { target: "Upper Back", fallbackMuscle: "Back", count: 1 },
      { target: "Mid Back", fallbackMuscle: "Back", count: 1 },
      { target: "Conditioning", fallbackMuscle: "Conditioning", count: 1 },
    ]);
  }

  if (programId === "8-week-shred" && focus.includes("Quads")) {
    return this.buildFromTargets([
      { target: "Quads", fallbackMuscle: "Quads", count: 3 },
      { target: "Hamstrings", fallbackMuscle: "Hamstrings", count: 1 },
      { target: "Conditioning", fallbackMuscle: "Conditioning", count: 1 },
    ]);
  }

  if (programId === "8-week-shred" && focus.includes("Shoulders")) {
    return this.buildFromTargets([
      { target: "Side Delts", fallbackMuscle: "Shoulders", count: 1 },
      { target: "Rear Delts", fallbackMuscle: "Shoulders", count: 1 },
      { target: "Front Delts", fallbackMuscle: "Shoulders", count: 1 },
      { target: "Abs", fallbackMuscle: "Abs", count: 1 },
      { target: "Conditioning", fallbackMuscle: "Conditioning", count: 1 },
    ]);
  }

  if (programId === "bulking-journey" && focus.includes("Chest")) {
  return this.buildFromTargets([
    { target: "Mid Chest", fallbackMuscle: "Chest", count: 2 },
    { target: "Upper Chest", fallbackMuscle: "Chest", count: 2 },
    { target: "Lower Chest", fallbackMuscle: "Chest", count: 1 },
    { target: "Triceps", fallbackMuscle: "Triceps", count: 1 },
  ]);
}

if (programId === "bulking-journey" && focus.includes("Back")) {
  return this.buildFromTargets([
    { target: "Lats", fallbackMuscle: "Back", count: 2 },
    { target: "Upper Back", fallbackMuscle: "Back", count: 2 },
    { target: "Mid Back", fallbackMuscle: "Back", count: 1 },
    { target: "Traps", fallbackMuscle: "Back", count: 1 },
  ]);
}

if (programId === "bulking-journey" && focus.includes("Shoulders")) {
  return this.buildFromTargets([
    { target: "Front Delts", fallbackMuscle: "Shoulders", count: 2 },
    { target: "Side Delts", fallbackMuscle: "Shoulders", count: 2 },
    { target: "Rear Delts", fallbackMuscle: "Shoulders", count: 1 },
  ]);
}

if (programId === "bulking-journey" && focus.includes("Quads")) {
  return this.buildFromTargets([
    { target: "Quads", fallbackMuscle: "Quads", count: 4 },
    { target: "Glutes", fallbackMuscle: "Glutes", count: 1 },
    { target: "Calves", fallbackMuscle: "Calves", count: 1 },
  ]);
}

if (programId === "bulking-journey" && focus.includes("Hamstrings")) {
  return this.buildFromTargets([
    { target: "Hamstrings", fallbackMuscle: "Hamstrings", count: 3 },
    { target: "Glutes", fallbackMuscle: "Glutes", count: 2 },
    { target: "Calves", fallbackMuscle: "Calves", count: 1 },
  ]);
}

  const plan = this.getPlanForFocus(focusList);
  return this.buildFromTargets(plan);
}
  
}

export default WorkoutPlannerEngine;
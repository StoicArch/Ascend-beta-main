import { EXERCISES } from "../Data/exercises";
import UserProfileEngine from "./UserProfileEngine";

class WorkoutPlannerEngine {
  static getUserEquipment() {
    const profile = UserProfileEngine.getProfile();

    if (profile.location === "Gym") {
      return [
        "Dumbbells",
        "Barbell",
        "Machine",
        "Cable",
        "Smith Machine",
        "Bodyweight",
      ];
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

          workout.push({
            ...selected,
            role: item.role || item.target,
          });
        }
      }
    });

    return workout;
  }

  static getPlanForMuscle(muscle) {
    const plans = {

      Legs: [
  {
    target: "Quads",
    fallbackMuscle: "Quads",
    count: 2,
    role: "Quad builder",
  },
  {
    target: "Hamstrings",
    fallbackMuscle: "Hamstrings",
    count: 2,
    role: "Hamstring builder",
  },
  {
    target: "Calves",
    fallbackMuscle: "Calves",
    count: 1,
    role: "Calves",
  },
],

Abs: [
  {
    target: "Lower Abs",
    fallbackMuscle: "Abs",
    count: 2,
    role: "Lower abs",
  },
  {
    target: "Obliques",
    fallbackMuscle: "Abs",
    count: 1,
    role: "Obliques",
  },
  {
    target: "Core Stability",
    fallbackMuscle: "Abs",
    count: 1,
    role: "Core",
  },
],
      Chest: [
        {
          target: "Upper Chest",
          fallbackMuscle: "Chest",
          count: 1,
          role: "Upper chest press",
        },
        {
          target: "Mid Chest",
          fallbackMuscle: "Chest",
          count: 1,
          role: "Main chest press",
        },
        {
          target: "Chest Isolation",
          fallbackMuscle: "Chest",
          count: 1,
          role: "Chest squeeze",
        },
        {
          target: "Chest stretch",
          fallbackMuscle: "Chest",
          count: 1,
          role: "Chest stretch",
        },
      ],

      Back: [
        {
          target: "Lats",
          fallbackMuscle: "Back",
          count: 2,
          role: "Lat builder",
        },
        {
          target: "Upper Back",
          fallbackMuscle: "Back",
          count: 2,
          role: "Upper back thickness",
        },
      ],

      Shoulders: [
        {
          target: "Front Delts",
          fallbackMuscle: "Shoulders",
          count: 1,
          role: "Front delt press",
        },
        {
          target: "Side Delts",
          fallbackMuscle: "Shoulders",
          count: 1,
          role: "Side delt width",
        },
        {
          target: "Rear Delts",
          fallbackMuscle: "Shoulders",
          count: 2,
          role: "Rear delt builder",
        },
      ],

      Biceps: [
        {
          target: "Bicep stretch",
          fallbackMuscle: "Biceps",
          count: 1,
          role: "Stretch curl",
        },
        {
          target: "Bicep width",
          fallbackMuscle: "Biceps",
          count: 1,
          role: "Width curl",
        },
      ],

      Triceps: [
        {
          target: "Overhead Triceps",
          fallbackMuscle: "Triceps",
          count: 1,
          role: "Long head triceps",
        },
        {
          target: "Pushdown Triceps",
          fallbackMuscle: "Triceps",
          count: 1,
          role: "Pushdown triceps",
        },
      ],

      Quads: [
        {
          target: "Quads",
          fallbackMuscle: "Quads",
          count: 3,
          role: "Quad builder",
        },
      ],

      Hamstrings: [
        {
          target: "Hamstrings",
          fallbackMuscle: "Hamstrings",
          count: 3,
          role: "Hamstring builder",
        },
      ],

      Glutes: [
        {
          target: "Glutes",
          fallbackMuscle: "Glutes",
          count: 2,
          role: "Glute builder",
        },
        {
          target: "Side Glutes",
          fallbackMuscle: "Glutes",
          count: 1,
          role: "Side glutes",
        },
      ],

      

      Conditioning: [
        {
          target: "Conditioning",
          fallbackMuscle: "Conditioning",
          count: 2,
          role: "Conditioning",
        },
      ],
    };

    return plans[muscle] || [
      {
        target: muscle,
        fallbackMuscle: muscle,
        count: 2,
        role: muscle,
      },
    ];
  }

  static generateWorkout(focusList = []) {
    const focus = Array.isArray(focusList) ? focusList : [focusList];

    const targetPlan = focus.flatMap((muscle) =>
      this.getPlanForMuscle(muscle)
    );

    return this.buildFromTargets(targetPlan);
  }
}

export default WorkoutPlannerEngine;
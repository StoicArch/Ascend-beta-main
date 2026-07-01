import { EXERCISES } from "../Data/exercises";
import UserProfileEngine from "./UserProfileEngine";
import EquipmentEngine from "./EquipmentEngine";

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

    return EquipmentEngine.normalizeEquipmentList(profile.equipment);
  }

  static getExercisesByTarget(target, usedIds = []) {
    const equipment = this.getUserEquipment();

    return EXERCISES.filter(
      (exercise) =>
        exercise.target === target &&
        (
          target === "Conditioning" ||
          equipment.includes(exercise.equipment)
        ) &&
        !usedIds.includes(exercise.id)
    );
  }

  static getExercisesByMuscle(muscle, usedIds = []) {
    const equipment = this.getUserEquipment();

    return EXERCISES.filter(
      (exercise) =>
        exercise.muscle === muscle &&
        (
          muscle === "Conditioning" ||
          equipment.includes(exercise.equipment)
        ) &&
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

        if (options.length === 0 && item.allowRepeat) {
          options = this.getExercisesByTarget(item.target);
        }

        if (
          options.length === 0 &&
          item.allowRepeat &&
          item.fallbackMuscle
        ) {
          options = this.getExercisesByMuscle(item.fallbackMuscle);
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

      Forearms: [
        {
          target: "Forearms",
          fallbackMuscle: "Forearms",
          count: 2,
          role: "Forearm builder",
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
          allowRepeat: true,
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

  static shouldDeload() {
  const profile = UserProfileEngine.getProfile();

  const week = profile.currentWeek || 1;

  return week === 5;
}

static getCappedDeltsMilestone() {
  const week =
    UserProfileEngine.getProfile().currentWeek || 1;

  const milestones = {
    1: {
      title: "Foundation",
      description:
        "Learn perfect technique and establish baseline performance.",
    },
    2: {
      title: "Consistency",
      description:
        "Beat last week's reps on every priority movement.",
    },
    3: {
      title: "Volume Increase",
      description:
        "Extra shoulder volume begins. Recovery becomes more important.",
    },
    4: {
      title: "Progress Check",
      description:
        "Compare your strength to Week 1.",
    },
    5: {
      title: "Deload",
      description:
        "Recover so your shoulders can grow during the final phase.",
    },
    6: {
      title: "Growth Phase",
      description:
        "Push progressive overload while maintaining excellent technique.",
    },
    7: {
      title: "Peak Effort",
      description:
        "This is your hardest training week.",
    },
    8: {
      title: "Graduation",
      description:
        "Take progress photos and compare them to Week 1.",
    },
  };

  return milestones[week];
}
  static isProgramComplete() {
  const profile = UserProfileEngine.getProfile();

  return (profile.currentWeek || 1) >= 8;
}
static getGraduationSummary() {
 

  return {
    title: "Program Complete 🎉",
    coach:
      "You completed the 8-week Capped Delts Program. Compare your photos, celebrate your progress, and choose your next specialization.",
    nextPrograms: [
      "Skinny to Jacked",
      "Upper Chest Specialization",
      "Full Body Hypertrophy",
    ],
  };
}

 static generateCappedDeltsWorkout(focusList = []) {
  const profile = UserProfileEngine.getProfile();

  const spec = profile.specialization;

  if (!spec || spec.type !== "capped-delts") {
    return null;
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const workoutDays = profile.programWorkoutDays || [];
  const shoulderDayIndex = workoutDays.indexOf(today);

  const firstShoulderDay = shoulderDayIndex === 0;

  const sideSets = firstShoulderDay ? 3 : 2;
  const rearSets = firstShoulderDay ? 2 : 3;

  const workout = firstShoulderDay
  ? this.generateCappedDeltsWorkoutA()
  : this.generateCappedDeltsWorkoutB();

  const chosen = [];

  if (spec.sideDeltExercise) {
    const exercise = EXERCISES.find(
      (e) => e.name === spec.sideDeltExercise
    );

    if (exercise) {
      chosen.push({
  ...exercise,
  sets: sideSets,
  priority: true,
  specialization: true,
  lockExercise: true,
  programExercise: true,
progressKey: exercise.id,
  role: "Side Delt Specialization",
});
    }
  }

  if (spec.rearDeltExercise) {
    const exercise = EXERCISES.find(
      (e) => e.name === spec.rearDeltExercise
    );

    if (exercise) {
      chosen.push({
        ...exercise,
        sets: rearSets,
        priority: true,
        programExercise: true,
progressKey: exercise.id,
        role: "Rear Delt Specialization",
      });
    }
  }

  if (spec.pressExercise) {
    const exercise = EXERCISES.find(
      (e) => e.name === spec.pressExercise
    );

    if (exercise) {
      chosen.push({
        ...exercise,
        sets: 2,
        priority: true,
        programExercise: true,
        progressKey: exercise.id,
        role: "Optional Overhead Press",
      });
    }
  }

  const filteredWorkout = workout.filter((exercise) => {
  if (
    exercise.target === "Side Delts" ||
    exercise.target === "Rear Delts" ||
    exercise.target === "Front Delts"
  ) {
    return false;
  }
  const milestone =
  this.getCappedDeltsMilestone();

  const graduation =
  this.isProgramComplete()
    ? this.getGraduationSummary()
    : null;

  return progressedWorkout.map((exercise) => ({
  ...exercise,
  milestone: milestone.title,
  milestoneDescription: milestone.description,
  graduation,
  coachTip:
    exercise.priority
      ? "Prioritize perfect form and beat last week's performance."
      : "Train hard, but save your recovery for your shoulder specialization.",
}));

});

const finalWorkout = [
  ...chosen,
  ...filteredWorkout,
];

const progressedWorkout =
  this.applyCappedDeltsProgression(finalWorkout);

return progressedWorkout.map((exercise) => ({
  ...exercise,
  coachTip:
    exercise.priority
      ? "Prioritize perfect form and beat last week's performance."
      : "Train hard, but save your recovery for your shoulder specialization.",
}));
}

static applyCappedDeltsProgression(workout) {
  const profile = UserProfileEngine.getProfile();
  const week = profile.currentWeek || 1;
  const deload = this.shouldDeload();

  return workout.map((exercise) => {
    const updated = { ...exercise };

    if (deload) {
  updated.sets = Math.max(2, (updated.sets || 3) - 1);
  updated.rir = 3;
  updated.coachTip =
    "Deload week. Reduce effort, focus on technique and recover for the final 3 weeks.";

  return updated;
}



    updated.repGoal =
  exercise.repRange ||
  `${exercise.reps}-${exercise.reps + 2}`;

updated.overloadRule =
  "When every set reaches the top of the rep range with good form, increase the weight next workout.";

    if (
      updated.target === "Side Delts" ||
      updated.target === "Rear Delts"
    ) {
      if (week <= 2) {
        updated.sets = Math.max(updated.sets || 3, 3);
        updated.rir = 2;
      } else if (week <= 4) {
        updated.sets = Math.max(updated.sets || 3, 4);
        updated.rir = 1;
      } else if (week <= 6) {
        updated.sets = Math.max(updated.sets || 3, 5);
        updated.rir = 1;
      } else {
        updated.sets = Math.max(updated.sets || 3, 5);
        updated.rir = 0;
      }

      updated.progression =
  "Hit the top of the rep range on every set. Then increase the weight by the smallest amount next session.";
    } else {
      updated.rir = 2;
      updated.progression =
  "Keep within 1-2 reps of your previous performance. This muscle is on maintenance volume.";
    }

    return updated;
  });
}
static generateCappedDeltsWorkoutA() {
  return this.buildFromTargets([
    {
      target: "Side Delts",
      fallbackMuscle: "Shoulders",
      count: 1,
      role: "Side Delt Width",
    },
    {
      target: "Rear Delts",
      fallbackMuscle: "Shoulders",
      count: 1,
      role: "Rear Delt Builder",
    },
    {
      target: "Front Delts",
      fallbackMuscle: "Shoulders",
      count: 1,
      role: "Overhead Press",
    },
    {
      target: "Upper Chest",
      fallbackMuscle: "Chest",
      count: 1,
      role: "Upper Chest",
    },
    {
      target: "Mid Chest",
      fallbackMuscle: "Chest",
      count: 1,
      role: "Chest Press",
    },
    {
      target: "Chest Isolation",
      fallbackMuscle: "Chest",
      count: 1,
      role: "Chest Fly",
    },
    {
      target: "Overhead Triceps",
      fallbackMuscle: "Triceps",
      count: 1,
      role: "Long Head",
    },
    {
      target: "Pushdown Triceps",
      fallbackMuscle: "Triceps",
      count: 1,
      role: "Pushdown",
    },
  ]);
}

static generateCappedDeltsWorkoutB() {
  return this.buildFromTargets([
    {
      target: "Side Delts",
      fallbackMuscle: "Shoulders",
      count: 1,
      role: "Side Delt Width",
    },
    {
      target: "Rear Delts",
      fallbackMuscle: "Shoulders",
      count: 1,
      role: "Rear Delt Builder",
    },
    {
      target: "Front Delts",
      fallbackMuscle: "Shoulders",
      count: 1,
      role: "Overhead Press",
    },
    {
      target: "Lats",
      fallbackMuscle: "Back",
      count: 2,
      role: "Lat Builder",
    },
    {
      target: "Upper Back",
      fallbackMuscle: "Back",
      count: 2,
      role: "Upper Back",
    },
    {
      target: "Bicep stretch",
      fallbackMuscle: "Biceps",
      count: 1,
      role: "Stretch Curl",
    },
    {
      target: "Bicep width",
      fallbackMuscle: "Biceps",
      count: 1,
      role: "Width Curl",
    },
  ]);
}


static generateWorkout(focusList = []) {
  const capped = this.generateCappedDeltsWorkout(focusList);

if (capped) {
  return capped;
}

  const workout = [];
  const usedIds = [];

  const normalizedFocus = Array.isArray(focusList)
    ? focusList
    : [focusList];

  const targetPlan = normalizedFocus.flatMap((muscle) =>
    this.getPlanForMuscle(muscle)
  );

  targetPlan.forEach((item) => {
    for (let i = 0; i < item.count; i++) {
      let options = this.getExercisesByTarget(
        item.target,
        usedIds
      );

      if (
        options.length === 0 &&
        item.fallbackMuscle
      ) {
        options = this.getExercisesByMuscle(
          item.fallbackMuscle,
          usedIds
        );
      }

      const selected = this.pickExercise(options);

      if (selected) {
        usedIds.push(selected.id);

        workout.push({
          ...selected,
          role: item.role || item.target,
          priority: false,
        });
      }
    }
  });

  return this.applyPriorityMuscles(
    workout,
    normalizedFocus
  );
}
static applyPriorityMuscles(
  workout,
  focusList
) {
  const profile =
    UserProfileEngine.getProfile();

  const weakMuscles =
    profile.weakMuscles || [];

  if (!weakMuscles.length) {
    return workout;
  }

 weakMuscles.forEach((weakMuscle) => {

  const parent =
    this.getParentMuscle(weakMuscle);

  if (!focusList.includes(parent)) {
    return;
  }
    const priorityExercises = workout.filter(
  (item) => item.target === weakMuscle
);

if (priorityExercises.length > 0) {
  priorityExercises[0].priority = true;
  priorityExercises[0].priorityMuscle = weakMuscle;
  priorityExercises[0].sets = 3;
}

const secondExercise = this.pickExercise(
  this.getExercisesByTarget(
    weakMuscle,
    workout.map((e) => e.id)
  )
);

if (secondExercise) {
  workout.unshift({
    ...secondExercise,
    priority: true,
    priorityMuscle: weakMuscle,
    sets: 2,
    role: "Priority Muscle",
  });
}
  });
workout.sort((a, b) => {
  if (a.priority && !b.priority) return -1;
  if (!a.priority && b.priority) return 1;
  return 0;
});
  return workout;
}

static getParentMuscle(target) {
  const map = {
    "Upper Chest": "Chest",
    "Mid Chest": "Chest",
    "Lower Chest": "Chest",

    "Front Delts": "Shoulders",
    "Side Delts": "Shoulders",
    "Rear Delts": "Shoulders",

    "Lats": "Back",
    "Upper Back": "Back",
    "Lower Back": "Back",
    "Traps": "Back",

    "Quads": "Legs",
    "Hamstrings": "Legs",
    "Calves": "Legs",

    "Side Glutes": "Glutes",

    "Lower Abs": "Abs",
    "Obliques": "Abs",
    "Core Stability": "Abs",
  };

  return map[target] || target;
}
}

export default WorkoutPlannerEngine;

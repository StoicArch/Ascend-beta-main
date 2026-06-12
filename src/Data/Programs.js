export const PROGRAMS = [

  {
  id: "8-week-shred",
  name: "8 Week Shred",
  duration: "8 weeks",
  totalWeeks: 8,
  goal: "Lose fat",
  type: "Calorie deficit",
  access: "free",
  status: "available",
  description:
    "A progressive 8 week fat-loss program built to help you lose body fat while keeping muscle.",

  bestFor: [
    "People who want to lose body fat",
    "People who want visible progress in 8 weeks",
    "People ready to track weight and stay consistent",
  ],

  notFor: [
    "People trying to bulk",
    "People who only want random workouts",
  ],

  tracks: {
    3: {
      weeks: Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => {
          const week = i + 1;
          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Upper Shred`,
                  exercises: ["Incline Dumbbell Press", "Lat Pulldown", "Machine Chest Press", "Seated Cable Row"],
                },
                {
                  name: `Week ${week} Lower Shred`,
                  exercises: ["Leg Press", "Romanian Deadlift", "Leg Extension", "Lying Leg Curl"],
                },
                {
                  name: `Week ${week} Arms & Conditioning`,
                  exercises: ["Shoulder Press", "Lateral Raise", "Dumbbell Curl", "Tricep Pushdown", "Plank"],
                },
              ],
            },
          ];
        })
      ),
    },

    4: {
      weeks: Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => {
          const week = i + 1;
          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Chest & Triceps`,
                  exercises: ["Incline Dumbbell Press", "Machine Chest Press", "Pec Deck", "Tricep Pushdown"],
                },
                {
                  name: `Week ${week} Back & Biceps`,
                  exercises: ["Lat Pulldown", "Seated Cable Row", "Barbell Row", "Dumbbell Curl"],
                },
                {
                  name: `Week ${week} Legs`,
                  exercises: ["Leg Press", "Romanian Deadlift", "Leg Extension", "Lying Leg Curl"],
                },
                {
                  name: `Week ${week} Shoulders & Abs`,
                  exercises: ["Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Cable Crunch", "Plank"],
                },
              ],
            },
          ];
        })
      ),
    },

    5: {
      weeks: Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => {
          const week = i + 1;
          return [
            week,
            {
              workouts: [
                { name: `Week ${week} Chest`, exercises: ["Incline Dumbbell Press", "Machine Chest Press", "Pec Deck", "Cable Fly"] },
                { name: `Week ${week} Back`, exercises: ["Lat Pulldown", "Seated Cable Row", "Barbell Row", "Machine Row"] },
                { name: `Week ${week} Legs`, exercises: ["Leg Press", "Romanian Deadlift", "Leg Extension", "Lying Leg Curl"] },
                { name: `Week ${week} Shoulders`, exercises: ["Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Face Pull"] },
                { name: `Week ${week} Arms & Abs`, exercises: ["Dumbbell Curl", "Tricep Pushdown", "Cable Crunch", "Plank"] },
              ],
            },
          ];
        })
      ),
    },

    6: {
      weeks: Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => {
          const week = i + 1;
          return [
            week,
            {
              workouts: [
                { name: `Week ${week} Chest`, exercises: ["Incline Dumbbell Press", "Machine Chest Press", "Pec Deck"] },
                { name: `Week ${week} Back`, exercises: ["Lat Pulldown", "Seated Cable Row", "Barbell Row"] },
                { name: `Week ${week} Legs`, exercises: ["Leg Press", "Romanian Deadlift", "Leg Extension"] },
                { name: `Week ${week} Shoulders`, exercises: ["Shoulder Press", "Lateral Raise", "Rear Delt Fly"] },
                { name: `Week ${week} Arms`, exercises: ["Dumbbell Curl", "Hammer Curl", "Tricep Pushdown", "Overhead Tricep Extension"] },
                { name: `Week ${week} Abs & Conditioning`, exercises: ["Cable Crunch", "Plank", "Mountain Climbers"] },
              ],
            },
          ];
        })
      ),
    },
  },
},

 {
  id: "skinny-to-jacked",
  name: "Skinny To Jacked",
  duration: "24 weeks",
  totalWeeks: 24,
  freeWeeks: 8,
  goal: "Build muscle",
  type: "Calorie surplus",
  access: "freemium",
  status: "available",
  description:
    "A muscle-building program for skinny guys who want to gain size, strength, and confidence without guessing what to train.",

  bestFor: [
    "Skinny guys who want to build visible muscle",
    "Beginners who need structure",
    "People who want to gain weight and strength",
  ],

  notFor: [
    "People trying to cut aggressively",
    "People who only want random workouts",
  ],

  tracks: {
    3: {
      weeks: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Upper Body Size`,
                  exercises: [
                    "Incline Dumbbell Press",
                    "Machine Chest Press",
                    "Lat Pulldown",
                    "Seated Cable Row",
                    "Shoulder Press",
                    "Lateral Raise",
                    "Dumbbell Curl",
                    "Tricep Pushdown",
                  ],
                },
                {
                  name: `Week ${week} Lower Body Growth`,
                  exercises: [
                    "Leg Press",
                    "Squat",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Chest Back Arms`,
                  exercises: [
                    "Flat Bench Press",
                    "Pec Deck",
                    "Barbell Row",
                    "Machine Row",
                    "Hammer Curl",
                    "Overhead Tricep Extension",
                    "Cable Crunch",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },

    4: {
      weeks: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Chest & Triceps`,
                  exercises: [
                    "Incline Dumbbell Press",
                    "Flat Bench Press",
                    "Machine Chest Press",
                    "Pec Deck",
                    "Cable Fly",
                    "Tricep Pushdown",
                    "Overhead Tricep Extension",
                  ],
                },
                {
                  name: `Week ${week} Back & Biceps`,
                  exercises: [
                    "Lat Pulldown",
                    "Seated Cable Row",
                    "Barbell Row",
                    "Machine Row",
                    "Dumbbell Curl",
                    "Hammer Curl",
                  ],
                },
                {
                  name: `Week ${week} Legs`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Shoulders & Arms`,
                  exercises: [
                    "Shoulder Press",
                    "Lateral Raise",
                    "Rear Delt Fly",
                    "Face Pull",
                    "Dumbbell Curl",
                    "Tricep Pushdown",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },

    5: {
      weeks: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Chest`,
                  exercises: [
                    "Incline Dumbbell Press",
                    "Flat Bench Press",
                    "Machine Chest Press",
                    "Pec Deck",
                    "Cable Fly",
                    "Chest Dips",
                  ],
                },
                {
                  name: `Week ${week} Back`,
                  exercises: [
                    "Lat Pulldown",
                    "Seated Cable Row",
                    "Barbell Row",
                    "Machine Row",
                    "Wide Grip Pulldown",
                    "Dumbbell Shrug",
                  ],
                },
                {
                  name: `Week ${week} Legs`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Shoulders`,
                  exercises: [
                    "Shoulder Press",
                    "Arnold Press",
                    "Lateral Raise",
                    "Cable Lateral Raise",
                    "Rear Delt Fly",
                    "Face Pull",
                  ],
                },
                {
                  name: `Week ${week} Arms & Abs`,
                  exercises: [
                    "Dumbbell Curl",
                    "Hammer Curl",
                    "Cable Curl",
                    "Tricep Pushdown",
                    "Overhead Tricep Extension",
                    "Cable Crunch",
                    "Plank",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },

    6: {
      weeks: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Chest`,
                  exercises: [
                    "Incline Dumbbell Press",
                    "Flat Bench Press",
                    "Machine Chest Press",
                    "Pec Deck",
                    "Cable Fly",
                  ],
                },
                {
                  name: `Week ${week} Back`,
                  exercises: [
                    "Lat Pulldown",
                    "Seated Cable Row",
                    "Barbell Row",
                    "Machine Row",
                    "Wide Grip Pulldown",
                  ],
                },
                {
                  name: `Week ${week} Legs`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Shoulders`,
                  exercises: [
                    "Shoulder Press",
                    "Lateral Raise",
                    "Cable Lateral Raise",
                    "Rear Delt Fly",
                    "Face Pull",
                  ],
                },
                {
                  name: `Week ${week} Arms`,
                  exercises: [
                    "Dumbbell Curl",
                    "Hammer Curl",
                    "Cable Curl",
                    "Tricep Pushdown",
                    "Overhead Tricep Extension",
                    "Skull Crusher",
                  ],
                },
                {
                  name: `Week ${week} Upper Pump`,
                  exercises: [
                    "Incline Machine Press",
                    "Machine High Row",
                    "Machine Pec Fly",
                    "Cable Row Wide Grip",
                    "Lateral Raise",
                    "Cable Crunch",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },
  },
},

  {
    id: "home-chest-builder",
    name: "Home Chest Builder",
    duration: "8 weeks",
    totalWeeks: 8,
    goal: "Build chest at home",
    type: "Home training",
    access: "free",
    status: "coming soon",
    description:
      "A no-gym chest program based on simple home training and progression.",
  },

 {
  id: "bulking-journey",
  name: "Bulking Journey",
  duration: "16 weeks",
  totalWeeks: 16,
  goal: "Gain size",
  type: "Calorie surplus",
  access: "premium",
  status: "available",
  description:
    "A structured bulking program for users who want to gain weight, build muscle, and get stronger through progressive training.",

  bestFor: [
    "People who want to gain weight",
    "People trying to build size",
    "People who can eat in a calorie surplus",
  ],

  notFor: [
    "People trying to lose fat fast",
    "People who are not ready to eat more food",
  ],

  tracks: {
    3: {
      weeks: Object.fromEntries(
        Array.from({ length: 16 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Heavy Upper`,
                  exercises: [
                    "Flat Bench Press",
                    "Incline Dumbbell Press",
                    "Lat Pulldown",
                    "Barbell Row",
                    "Shoulder Press",
                    "Dumbbell Curl",
                    "Tricep Pushdown",
                  ],
                },
                {
                  name: `Week ${week} Heavy Lower`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Full Body Bulk`,
                  exercises: [
                    "Machine Chest Press",
                    "Seated Cable Row",
                    "Shoulder Press",
                    "Leg Press",
                    "Pec Deck",
                    "Hammer Curl",
                    "Overhead Tricep Extension",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },

    4: {
      weeks: Object.fromEntries(
        Array.from({ length: 16 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Push Bulk`,
                  exercises: [
                    "Flat Bench Press",
                    "Incline Dumbbell Press",
                    "Machine Chest Press",
                    "Shoulder Press",
                    "Lateral Raise",
                    "Tricep Pushdown",
                    "Overhead Tricep Extension",
                  ],
                },
                {
                  name: `Week ${week} Pull Bulk`,
                  exercises: [
                    "Lat Pulldown",
                    "Barbell Row",
                    "Seated Cable Row",
                    "Machine Row",
                    "Dumbbell Shrug",
                    "Dumbbell Curl",
                    "Hammer Curl",
                  ],
                },
                {
                  name: `Week ${week} Legs Bulk`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Upper Volume`,
                  exercises: [
                    "Incline Machine Press",
                    "Machine High Row",
                    "Pec Deck",
                    "Cable Row Wide Grip",
                    "Cable Lateral Raise",
                    "Cable Curl",
                    "Skull Crusher",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },

    5: {
      weeks: Object.fromEntries(
        Array.from({ length: 16 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Chest Bulk`,
                  exercises: [
                    "Flat Bench Press",
                    "Incline Dumbbell Press",
                    "Machine Chest Press",
                    "Pec Deck",
                    "Cable Fly",
                    "Chest Dips",
                  ],
                },
                {
                  name: `Week ${week} Back Bulk`,
                  exercises: [
                    "Lat Pulldown",
                    "Barbell Row",
                    "Seated Cable Row",
                    "Machine Row",
                    "Wide Grip Pulldown",
                    "Dumbbell Shrug",
                  ],
                },
                {
                  name: `Week ${week} Legs Bulk`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Shoulders Bulk`,
                  exercises: [
                    "Shoulder Press",
                    "Arnold Press",
                    "Lateral Raise",
                    "Cable Lateral Raise",
                    "Rear Delt Fly",
                    "Face Pull",
                  ],
                },
                {
                  name: `Week ${week} Arms Bulk`,
                  exercises: [
                    "Dumbbell Curl",
                    "Hammer Curl",
                    "Cable Curl",
                    "Tricep Pushdown",
                    "Overhead Tricep Extension",
                    "Skull Crusher",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },

    6: {
      weeks: Object.fromEntries(
        Array.from({ length: 16 }, (_, i) => {
          const week = i + 1;

          return [
            week,
            {
              workouts: [
                {
                  name: `Week ${week} Chest Heavy`,
                  exercises: [
                    "Flat Bench Press",
                    "Incline Dumbbell Press",
                    "Machine Chest Press",
                    "Pec Deck",
                    "Cable Fly",
                  ],
                },
                {
                  name: `Week ${week} Back Heavy`,
                  exercises: [
                    "Lat Pulldown",
                    "Barbell Row",
                    "Seated Cable Row",
                    "Machine Row",
                    "Wide Grip Pulldown",
                  ],
                },
                {
                  name: `Week ${week} Legs Heavy`,
                  exercises: [
                    "Squat",
                    "Leg Press",
                    "Romanian Deadlift",
                    "Leg Extension",
                    "Lying Leg Curl",
                    "Standing Calf Raise",
                  ],
                },
                {
                  name: `Week ${week} Shoulders Heavy`,
                  exercises: [
                    "Shoulder Press",
                    "Arnold Press",
                    "Lateral Raise",
                    "Cable Lateral Raise",
                    "Rear Delt Fly",
                  ],
                },
                {
                  name: `Week ${week} Arms Heavy`,
                  exercises: [
                    "Dumbbell Curl",
                    "Hammer Curl",
                    "Cable Curl",
                    "Tricep Pushdown",
                    "Overhead Tricep Extension",
                    "Skull Crusher",
                  ],
                },
                {
                  name: `Week ${week} Upper Volume`,
                  exercises: [
                    "Incline Machine Press",
                    "Machine High Row",
                    "Machine Pec Fly",
                    "Cable Row Wide Grip",
                    "Face Pull",
                    "Cable Crunch",
                  ],
                },
              ],
            },
          ];
        })
      ),
    },
  },
},

  {
    id: "greek-god-physique",
    name: "Greek God Physique",
    duration: "13 months",
    totalWeeks: 52,
    goal: "Build an aesthetic physique",
    type: "Aesthetic training",
    access: "premium",
    status: "coming soon",
    description:
      "A long-term physique program focused on shoulders, upper chest, arms, and V-taper.",
  },


  {
    id: "Boulder-V taper",
    name: "Boulder-V taper",
    duration: "14 months",
    totalWeeks: 56,
    goal: "Build a V-taper thst dosent look weak",
    type: "Aesthetic training",
    access: "premium",
    status: "coming soon",
    description:
      "A long-term physique program focused on taking the v-taper to a more masculine dominating look with more size everywhere.",
  },

  {
    id: "glorious-glutes",
    name: "Glorious Glutes",
    duration: "6 months",
    totalWeeks: 24,
    goal: "Build glutes",
    type: "Lower body growth",
    access: "premium",
    status: "coming soon",
    description:
      "A female-focused glute and lower body program built for long-term progress.",
  },

  {
    id: "hourglass-shape",
    name: "Hourglass Shape",
    duration: "6 months",
    totalWeeks: 24,
    goal: "Build curves",
    type: "Glutes, waist, and upper body balance",
    access: "premium",
    status: "coming soon",
    description:
      "A physique program focused on building a stronger hourglass look through glutes, shoulders, and waist control.",
  },

  {
    id: "glutes-home-workout",
    name: "Glutes Home Workout",
    duration: "8 weeks",
    totalWeeks: 8,
    goal: "Build glutes at home",
    type: "Home training",
    access: "free",
    status: "coming soon",
    description:
      "A home-based glute program for users who want lower-body growth without needing a gym.",
  },
];
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
    duration: "6 months",
    totalWeeks: 24,
    freeWeeks: 8,
    goal: "Build muscle",
    type: "Calorie surplus",
    access: "freemium",
    status: "locked",
    description:
      "A six month muscle-building program for skinny guys who want to gain size,strength and confidence. If younger me had this, he would have made such faster progress so i made the first 8 weeks of this program free, then if you get premium all your progress will be saved.",
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
    duration: "4 months",
    totalWeeks: 16,
    goal: "Gain size",
    type: "Calorie surplus",
    access: "premium",
    status: "coming soon",
    description:
      "A structured bulking program for users who want to gain weight and build muscle.",
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
import { MUSCLE_GROUPS } from "../data/OnboardingData";

export function generateAIPlan(user) {

  const plan = {};

  const goal = user.goal;
  const experience = user.experience;
  const equipment = user.equipment || [];

  const isBeginner = experience === "Beginner";
  const isIntermediate = experience === "Intermediate";
  const isAdvanced = experience === "Advanced";

  // =========================
  // MUSCLE GAIN
  // =========================

  if (goal === "Muscle Gain") {

    plan.Monday = {
      Chest: ["Upper Chest", "Mid Chest"],
      Triceps: ["Long Head"],
    };

    plan.Tuesday = {
      Back: ["Lats", "Upper Back"],
      Biceps: ["Short Head"],
    };

    plan.Wednesday = {
      Legs: ["Quads", "Hamstrings"],
    };

    plan.Thursday = {
      Shoulders: ["Side Delts", "Rear Delts"],
    };

    plan.Friday = {
      Chest: ["Lower Chest"],
      Arms: ["Biceps", "Triceps"],
    };

    plan.Saturday = {
      Legs: ["Glutes", "Calves"],
    };

    plan.Sunday = {
      rest: true,
    };
  }

  // =========================
  // FAT LOSS
  // =========================

  else if (goal === "Fat Loss") {

    plan.Monday = {
      FullBody: ["Chest", "Back", "Legs"],
    };

    plan.Tuesday = { rest: true };

    plan.Wednesday = {
      FullBody: ["Shoulders", "Arms"],
    };

    plan.Thursday = { rest: true };

    plan.Friday = {
      FullBody: ["Chest", "Back"],
    };

    plan.Saturday = {
      Cardio: ["HIIT"],
    };

    plan.Sunday = {
      rest: true,
    };
  }

  // =========================
  // GENERAL FITNESS
  // =========================

  else {

    plan.Monday = {
      Chest: ["Upper Chest"],
      Back: ["Lats"],
    };

    plan.Wednesday = {
      Legs: ["Quads"],
    };

    plan.Friday = {
      Shoulders: ["Side Delts"],
      Arms: ["Biceps", "Triceps"],
    };

    plan.Sunday = {
      rest: true,
    };
  }

  return plan;
}
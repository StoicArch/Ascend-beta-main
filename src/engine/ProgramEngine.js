import UserProfileEngine from "./UserProfileEngine";
import { PROGRAMS } from "../Data/Programs";
import { EXERCISES } from "../Data/exercises";
import PremiumEngine from "./PremiumEngine";
import WorkoutPlannerEngine from "./WorkoutPlannerEngine";
import EquipmentEngine from "./EquipmentEngine";

class ProgramEngine {
  static getTodayName() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  static getCurrentProgram() {
    const profile = UserProfileEngine.getProfile();

    if (!profile.programId) {
      return null;
    }

    return PROGRAMS.find(
      (program) => program.id === profile.programId
    );
  }

  static getCurrentWeek() {
    const profile = UserProfileEngine.getProfile();
    return profile.currentWeek || 1;
  }

  static getCurrentTrack() {
    const profile = UserProfileEngine.getProfile();
    return profile.programTrack || 4;
  }

 static getProgramSchedule() {
  const profile = UserProfileEngine.getProfile();

  const weeklyPlan = profile.weeklyPlan || {};

  const schedule = Object.entries(weeklyPlan)
    .filter(
      ([_, value]) =>
        value &&
        !value.rest &&
        Array.isArray(value.focus) &&
        value.focus.length > 0
    )
    .map(([day, value]) => ({
      day,
      focus: value.focus,
    }));

  if (schedule.length > 0) {
    return schedule;
  }

  return profile.programSchedule || [];
}

 static getWorkoutDays() {
  return this.getProgramSchedule().map(
    (item) => item.day
  );
}

  static getTodayScheduleItem() {
  const today = this.getTodayName();

  return (
    this.getProgramSchedule().find(
      (item) => item.day === today
    ) || null
  );
}

  static getTodayFocus() {
  const todayItem =
    this.getTodayScheduleItem();

  if (!todayItem) {
    return [];
  }

  return Array.isArray(todayItem.focus)
    ? todayItem.focus
    : [todayItem.focus];
}


  static getUserEquipment() {
    const profile = UserProfileEngine.getProfile();

    if (profile.location === "Gym") {
      return [
        "Dumbbells",
        "Barbell",
        "Machine",
        "Cable",
        "Smith Machine",
      ];
    }

    if (
      !profile.equipment ||
      profile.equipment.length === 0
    ) {
      return [
        "Dumbbells",
        "Barbell",
        "Machine",
        "Cable",
        "Smith Machine",
      ];
    }

    return EquipmentEngine.normalizeEquipmentList(profile.equipment);
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

      Quads: "Quads",
      Hamstrings: "Hamstrings",
      Calves: "Calves",
      Glutes: "Glutes",

      Biceps: "Biceps",
      Triceps: "Triceps",
      Abs: "Abs",
      Conditioning: "Conditioning",
    };

    return map[focus] || focus;
  }

  static getExercisesForMuscle(muscle) {
    const equipment = this.getUserEquipment();

    return EXERCISES.filter((exercise) => {
      return (
        exercise.muscle === muscle &&
        equipment.includes(exercise.equipment) &&
        exercise.equipment !== "Bodyweight"
      );
    });
  }

  static getRandomExercise(exercises, usedIds) {
    const available = exercises.filter(
      (exercise) =>
        !usedIds.includes(exercise.id)
    );

    if (available.length === 0) {
      return null;
    }

    return available[
      Math.floor(Math.random() * available.length)
    ];
  }

  static generateWorkoutFromFocus(focusList) {
    return WorkoutPlannerEngine.generateWorkout(
      focusList
    );
  }

  static getWorkoutIndexForToday() {
    const today = this.getTodayName();

    return this.getWorkoutDays().indexOf(today);
  }

  static getTodayWorkoutTemplate() {
    const program = this.getCurrentProgram();
    const week = this.getCurrentWeek();
    const track = this.getCurrentTrack();
    const workoutIndex =
      this.getWorkoutIndexForToday();

    if (!program || workoutIndex === -1) {
      return null;
    }

    const workouts =
      program.tracks?.[track]?.weeks?.[week]
        ?.workouts || [];

    return workouts[workoutIndex] || null;
  }

  static applyHomeChestBuilderProgression(
    exercise
  ) {
    const week = this.getCurrentWeek();

    let rest = 30;
    let sets = exercise.sets || 3;

    if (week >= 5 && week <= 8) {
      rest = 20;
    }

    if (week >= 9 && week <= 12) {
      rest = 15;
    }

    if (week >= 13) {
      rest = 10;
      sets = Math.max(sets, 4);
    }

    return {
      ...exercise,
      rest,
      sets,
    };
  }

  static getTemplateWorkout() {
    const program = this.getCurrentProgram();
    const template =
      this.getTodayWorkoutTemplate();

    if (!template) {
      return [];
    }

    const workout = template.exercises
      .map((name) =>
        EXERCISES.find(
          (exercise) => exercise.name === name
        )
      )
      .filter(Boolean);

    if (program?.id === "home-chest-builder") {
      return workout.map((exercise) =>
        this.applyHomeChestBuilderProgression(
          exercise
        )
      );
    }

    return workout;
  }

  static getTodayWorkout() {
    const program = this.getCurrentProgram();

    if (program?.id === "home-chest-builder") {
      return this.getTemplateWorkout();
    }

    const todayFocus = this.getTodayFocus();

    if (todayFocus.length > 0) {
      return this.generateWorkoutFromFocus(
        todayFocus
      );
    }

    return this.getTemplateWorkout();
  }

  static isRestDay() {
    return this.getTodayWorkout().length === 0;
  }

  static getNextWorkoutDay() {
    const workoutDays =
      this.getWorkoutDays();

    if (workoutDays.length === 0) {
      return null;
    }

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const today = this.getTodayName();
    const todayIndex =
      days.indexOf(today);

    for (let i = 1; i <= 7; i++) {
      const nextDay =
        days[(todayIndex + i) % 7];

      const scheduleItem =
        this.getProgramSchedule().find(
          (item) => item.day === nextDay
        );

      if (scheduleItem) {
        return {
          day: nextDay,
          focus: scheduleItem.focus,
        };
      }
    }

    return null;
  }

  static canAccessCurrentWeek() {
    const program =
      this.getCurrentProgram();

    if (!program) return false;

    if (program.access === "free") {
      return true;
    }

    if (PremiumEngine.isPremium()) {
      return true;
    }

    if (program.access === "premium") {
      return false;
    }

    if (program.access === "freemium") {
      return true;
    }

    return false;
  }

  static quitProgram() {
    const profile =
      UserProfileEngine.getProfile();

    delete profile.programId;
    delete profile.programTrack;
    delete profile.currentWeek;
    delete profile.programTotalWeeks;

    profile.programSchedule = [];
    profile.programWorkoutDays = [];

    localStorage.removeItem("workout");
    localStorage.removeItem("workoutDate");

    UserProfileEngine.saveProfile(profile);
  }

  static getCurrentTrackWorkouts() {
    const program =
      this.getCurrentProgram();

    const week =
      this.getCurrentWeek();

    const track =
      this.getCurrentTrack();

    if (!program) {
      return [];
    }

    if (program.id === "home-chest-builder") {
      return (
        program.tracks?.[4]?.weeks?.[week]
          ?.workouts || []
      );
    }

    const schedule =
      this.getProgramSchedule();

    if (schedule.length > 0) {
      return schedule.map((item) => ({
        name: item.focus.join(" & "),
        focus: item.focus,
        exercises:
          this.generateWorkoutFromFocus(
            item.focus
          ),
      }));
    }

    return (
      program.tracks?.[track]?.weeks?.[week]
        ?.workouts || []
    );
  }

  static getGlobalWorkoutNumber(
    week,
    workoutIndex,
    track
  ) {
    return (
      (Number(week || 1) - 1) *
        Number(track || 4) +
      workoutIndex +
      1
    );
  }

  static canAccessWorkout(
    week,
    workoutIndex
  ) {
    const program =
      this.getCurrentProgram();

    const track =
      this.getCurrentTrack();

    if (!program) return false;

    if (program.access === "free") {
      return true;
    }

    if (PremiumEngine.isPremium()) {
      return true;
    }

    if (program.access === "premium") {
      return false;
    }

    if (program.access === "freemium") {
      const workoutNumber =
        this.getGlobalWorkoutNumber(
          week,
          workoutIndex,
          track
        );

      return (
        workoutNumber <=
        (program.freeWorkouts || 0)
      );
    }

    return false;
  }

  static canAccessTodayWorkout() {
    const program =
      this.getCurrentProgram();

    if (!program) return true;

    if (program.access === "free") {
      return true;
    }

    if (PremiumEngine.isPremium()) {
      return true;
    }

    if (program.access === "premium") {
      return false;
    }

    if (program.access === "freemium") {
      const week =
        this.getCurrentWeek();

      const workoutIndex =
        this.getWorkoutIndexForToday();

      if (workoutIndex === -1) {
        return true;
      }

      return this.canAccessWorkout(
        week,
        workoutIndex
      );
    }

    return true;
  }

  static getNextWorkoutPreview() {
    const nextWorkout =
      this.getNextWorkoutDay();

    if (!nextWorkout) {
      return null;
    }

    const focus = Array.isArray(
      nextWorkout.focus
    )
      ? nextWorkout.focus
      : [nextWorkout.focus];

    return {
      day: nextWorkout.day,
      name: focus.join(" & "),
      mainTarget: focus[0] || "Training",
      goal: "Beat last session",
    };
  }

  static getProgramStatus() {
    const program =
      this.getCurrentProgram();

    const week =
      this.getCurrentWeek();

    const today =
      this.getTodayName();

    const track =
      this.getCurrentTrack();

    const workoutDays =
      this.getWorkoutDays();

    const todayFocus =
      this.getTodayFocus();

    const todayTemplate =
      this.getTodayWorkoutTemplate();

    const todayWorkout =
      this.getTodayWorkout();

    const nextWorkout =
      this.getNextWorkoutDay();

    return {
      program,
      week,
      today,
      track,
      workoutDays,
      todayFocus,
      todayTemplate,
      todayWorkout,
      nextWorkout,
      nextWorkoutPreview:
        this.getNextWorkoutPreview(),
      canAccessCurrentWeek:
        this.canAccessCurrentWeek(),
      canAccessTodayWorkout:
        this.canAccessTodayWorkout(),
      isRestDay:
        todayWorkout.length === 0,
    };
  }
}

export default ProgramEngine;

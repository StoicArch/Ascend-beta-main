import UserProfileEngine from "./UserProfileEngine";
import { PROGRAMS } from "../Data/Programs";
import { EXERCISES } from "../Data/exercises";
import PremiumEngine from "./PremiumEngine";
import WorkoutRules from "./WorkoutRules";

class ProgramEngine {
  static getTodayName() {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  }

  static getCurrentProgram() {
    const profile = UserProfileEngine.getProfile();

    if (profile.programId) {
      return PROGRAMS.find((program) => program.id === profile.programId);
    }

    return PROGRAMS.find((program) => program.name === profile.program);
  }

  static getCurrentWeek() {
    const profile = UserProfileEngine.getProfile();
    return profile.currentWeek || 1;
  }

  static getCurrentTrack() {
    const profile = UserProfileEngine.getProfile();
    return profile.programTrack || profile.trainingDays || 4;
  }

  static getProgramSchedule() {
    const profile = UserProfileEngine.getProfile();
    return profile.programSchedule || [];
  }

  static getWorkoutDays() {
    const profile = UserProfileEngine.getProfile();

    if (profile.programSchedule?.length > 0) {
      return profile.programSchedule.map((item) => item.day);
    }

    return profile.programWorkoutDays || [];
  }

  static getTodayScheduleItem() {
    const today = this.getTodayName();
    return this.getProgramSchedule().find((item) => item.day === today) || null;
  }

  static getTodayFocus() {
    const focus = this.getTodayScheduleItem()?.focus || [];
    return Array.isArray(focus) ? focus : [focus];
  }

  static getUserEquipment() {
    const profile = UserProfileEngine.getProfile();

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

  static getWorkoutIndexForToday() {
    const today = this.getTodayName();
    return this.getWorkoutDays().indexOf(today);
  }

  static getTodayWorkoutTemplate() {
    const program = this.getCurrentProgram();
    const week = this.getCurrentWeek();
    const track = this.getCurrentTrack();
    const workoutIndex = this.getWorkoutIndexForToday();

    if (!program || workoutIndex === -1) return null;

    const workouts = program.tracks?.[track]?.weeks?.[week]?.workouts || [];
    return workouts[workoutIndex] || null;
  }

  static getTemplateWorkout() {
    const template = this.getTodayWorkoutTemplate();

    if (!template) return [];

    return template.exercises
      .map((name) => EXERCISES.find((exercise) => exercise.name === name))
      .filter(Boolean);
  }

  static getTodayWorkout() {
    const todayFocus = this.getTodayFocus();

    if (todayFocus.length > 0) {
      return this.generateWorkoutFromFocus(todayFocus);
    }

    return this.getTemplateWorkout();
  }

  static isRestDay() {
    return this.getTodayWorkout().length === 0;
  }

  static getNextWorkoutDay() {
    const workoutDays = this.getWorkoutDays();

    if (workoutDays.length === 0) return null;

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = this.getTodayName();
    const todayIndex = days.indexOf(today);

    for (let i = 1; i <= 7; i++) {
      const nextDay = days[(todayIndex + i) % 7];

      const scheduleItem = this.getProgramSchedule().find(
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
    const program = this.getCurrentProgram();
    const week = this.getCurrentWeek();

    if (!program) return false;
    if (program.access === "free") return true;
    if (program.access === "premium") return PremiumEngine.isPremium();

    if (program.access === "freemium") {
      if (week <= (program.freeWeeks || 0)) return true;
      return PremiumEngine.isPremium();
    }

    return false;
  }

  static getCurrentTrackWorkouts() {
  const program = this.getCurrentProgram();
  const week = this.getCurrentWeek();
  const track = this.getCurrentTrack();

  if (!program) return [];

  return program.tracks?.[track]?.weeks?.[week]?.workouts || [];
}

  static getProgramStatus() {
    const program = this.getCurrentProgram();
    const week = this.getCurrentWeek();
    const today = this.getTodayName();
    const track = this.getCurrentTrack();
    const workoutDays = this.getWorkoutDays();
    const todayFocus = this.getTodayFocus();
    const todayTemplate = this.getTodayWorkoutTemplate();
    const todayWorkout = this.getTodayWorkout();
    const nextWorkout = this.getNextWorkoutDay();
    const canAccessCurrentWeek = this.canAccessCurrentWeek();

    return {
      program,
      week,
      today,
      track,
      workoutDays,
      todayFocus,
      todayTemplate,
      todayWorkout,
      isRestDay: todayWorkout.length === 0,
      nextWorkout,
      canAccessCurrentWeek,
    };
  }
}

export default ProgramEngine;
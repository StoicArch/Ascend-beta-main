import UserProfileEngine from "./UserProfileEngine";

class ProgressEngine {
  static getHistory() {
    return JSON.parse(localStorage.getItem("workoutHistory")) || [];
  }

  static saveHistory(history) {
    localStorage.setItem("workoutHistory", JSON.stringify(history));
    return history;
  }
static getProgramCompletionPercent(programId) {
  const profile = UserProfileEngine.getProfile();

  if (!programId) return 0;

  const totalWeeks =
    Number(profile.programTotalWeeks || 1);

  const workoutsPerWeek =
    Number(profile.programTrack || 4);

  const totalWorkouts =
    totalWeeks * workoutsPerWeek;

  const completed =
    this.getHistory().filter(
      (item) =>
        item.completed &&
        item.programId === programId
    ).length;

  return Math.round(
    (completed / totalWorkouts) * 100
  );
}


  static getTodayDate() {
    return new Date().toDateString();
  }

  static isTodayCompleted() {
    return this.getHistory().some(
      (item) => item.date === this.getTodayDate() && item.completed
    );
  }

  static getRequiredWeeklyWorkouts() {
    const profile = UserProfileEngine.getProfile();

    if (profile.programSchedule?.length > 0) {
      return profile.programSchedule.length;
    }

    if (profile.programWorkoutDays?.length > 0) {
      return profile.programWorkoutDays.length;
    }

    return Number(profile.programTrack || 4);
  }

  static getCompletedThisProgramWeek(programId, week) {
    return this.getHistory().filter(
      (item) =>
        item.completed &&
        item.programId === programId &&
        Number(item.week) === Number(week)
    );
  }

  static advanceProgramWeekIfReady(programId, week) {
  if (!programId) return;

  const profile = UserProfileEngine.getProfile();
  const required = this.getRequiredWeeklyWorkouts();
  const completed = this.getCompletedThisProgramWeek(programId, week);
  

  if (completed.length >= required) {
    console.log("ADVANCING WEEK");
    const totalWeeks = Number(profile.programTotalWeeks || 8);
    const currentWeek = Number(profile.currentWeek || 1);

    if (currentWeek < totalWeeks) {
      UserProfileEngine.saveProfile({
        ...profile,
        currentWeek: currentWeek + 1,
      });
    }

    localStorage.removeItem("workout");
    localStorage.removeItem("workoutDate");
  }
}


  static completeWorkout(data = {}) {
    if (this.isTodayCompleted()) {
      return this.getHistory();
    }

    const history = this.getHistory();

    const completedWorkout = {
      date: this.getTodayDate(),
      completedAt: new Date().toISOString(),
      completed: true,
      program: data.program || "",
      programId: data.programId || "",
      week: data.week || 1,
      day: data.day || "",
      workout: data.workout || "",
      exercises: data.exercises || 0,
      duration: data.duration || 0,
      exerciseHistory: data.exerciseHistory || [],
    };

    const updated = this.saveHistory([...history, completedWorkout]);

    this.advanceProgramWeekIfReady(
      completedWorkout.programId,
      completedWorkout.week
    );

    return updated;
  }

  static getCompletedCount() {
    return this.getHistory().filter((item) => item.completed).length;
  }

  static getLastCompletedWorkout() {
    const history = this.getHistory().filter((item) => item.completed);
    return history[history.length - 1] || null;
  }

  static clearHistory() {
    localStorage.removeItem("workoutHistory");
  }
}

export default ProgressEngine;
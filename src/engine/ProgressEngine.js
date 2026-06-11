import UserProfileEngine from "./UserProfileEngine";

class ProgressEngine {
  static getHistory() {
    return JSON.parse(localStorage.getItem("workoutHistory")) || [];
  }

  static saveHistory(history) {
    localStorage.setItem("workoutHistory", JSON.stringify(history));
    return history;
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

    return Number(profile.programTrack || profile.trainingDays || 4);
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
      const nextWeek = Math.min(Number(profile.currentWeek || 1) + 1, 8);

      UserProfileEngine.saveProfile({
        ...profile,
        currentWeek: nextWeek,
      });

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
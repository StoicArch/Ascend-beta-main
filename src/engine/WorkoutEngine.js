import ProgramEngine from "./ProgramEngine";
import GeneralWorkoutEngine from "./GeneralWorkoutEngine";
import UserProfileEngine from "./UserProfileEngine";

class WorkoutEngine {
  static getWorkout() {
    return JSON.parse(localStorage.getItem("workout")) || [];
  }

  static saveWorkout(workout) {
    localStorage.setItem("workout", JSON.stringify(workout));
    return workout;
  }

  static getTodayDate() {
    return new Date().toDateString();
  }

  static hasActiveProgram() {
    const profile = UserProfileEngine.getProfile();

    return !!profile.programId;
  }

  static generateTodayWorkout() {
    if (this.hasActiveProgram()) {
      if (!ProgramEngine.canAccessTodayWorkout()) {
        return [];
      }

      return ProgramEngine.getTodayWorkout();
    }

    return GeneralWorkoutEngine.getTodayWorkout();
  }

  static getOrCreateTodayWorkout() {
    const today = this.getTodayDate();
    const savedDate = localStorage.getItem("workoutDate");
    const savedWorkout = this.getWorkout();

    if (
      savedDate !== today ||
      savedWorkout.length === 0
    ) {
      const workout =
        this.generateTodayWorkout();

      localStorage.setItem(
        "workoutDate",
        today
      );

      return this.saveWorkout(workout);
    }

    return savedWorkout;
  }

  static addExercise(exercise) {
    const workout = this.getWorkout();

    workout.push({
      ...exercise,
      sets: exercise.sets || 3,
      reps: exercise.reps || 10,
    });

    return this.saveWorkout(workout);
  }

  static removeExercise(index) {
    const workout = this.getWorkout();

    workout.splice(index, 1);

    return this.saveWorkout(workout);
  }

  static updateExercise(
    index,
    field,
    value
  ) {
    const workout = this.getWorkout();

    workout[index][field] = value;

    return this.saveWorkout(workout);
  }

  static swapExercise(
    index,
    newExercise
  ) {
    const workout = this.getWorkout();

    workout[index] = {
      ...workout[index],
      ...newExercise,
      sets:
        newExercise.sets ||
        workout[index].sets ||
        3,
      reps:
        newExercise.reps ||
        workout[index].reps ||
        10,
    };

    return this.saveWorkout(workout);
  }

  static resetWorkout() {
    localStorage.removeItem("workout");
    localStorage.removeItem("workoutDate");

    return this.getOrCreateTodayWorkout();
  }

  static refreshWorkout() {
    const workout =
      this.generateTodayWorkout();

    localStorage.setItem(
      "workoutDate",
      this.getTodayDate()
    );

    return this.saveWorkout(workout);
  }

  static refreshFromProgram() {
    return this.refreshWorkout();
  }

  static completeWorkout() {
    localStorage.setItem(
      "lastWorkoutDate",
      new Date().toISOString()
    );
  }
}

export default WorkoutEngine;
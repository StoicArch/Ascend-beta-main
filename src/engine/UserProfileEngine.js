class UserProfileEngine {
  static defaultProfile = {
    name: "",
    goal: "Build Muscle",
    weight: 70,
    goalWeight: "",
    program: "",
    programId: "",
    programTrack: 4,
    programWorkoutDays: [],
    programSchedule: [],
    currentWeek: 1,
    trainingDays: 4,
    sleep: 7,
    calories: 2400,
    protein: 160,
    equipment: [],
    gender: "",
    experience: "",
    location: "",
    recovery: "",
    stress: "",
    sleepQuality: "",
      splitMode: "",
  weeklyPlan: {},
  exerciseHistory: [],

  startingWeight: null,

  weeklyReview: {
    lastReviewDate: "",
    currentCalories: 2400,
    currentProtein: 160,
    currentPhase: "Build",
    aiNotes: "",
    weeklyWeightChange: 0,
    workoutsCompleted: 0,
    prsHit: 0,
  },
};

  static getProfile() {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("profile"));

      return {
        ...this.defaultProfile,
        ...savedProfile,
      };
    } catch (error) {
      return this.defaultProfile;
    }
  }

 static saveProfile(profile) {
  const updatedProfile = {
    ...this.defaultProfile,
    ...profile,
  };

  if (
    !updatedProfile.startingWeight &&
    updatedProfile.weight
  ) {
    updatedProfile.startingWeight =
      updatedProfile.weight;
  }

  localStorage.setItem(
    "profile",
    JSON.stringify(updatedProfile)
  );

  return updatedProfile;
}

  static updateField(field, value) {
    const profile = this.getProfile();

    return this.saveProfile({
      ...profile,
      [field]: value,
    });
  }

  static updateWeeklyPlan(weeklyPlan) {
    const profile = this.getProfile();

    const trainingDays = Object.values(weeklyPlan).filter(
      (day) => day && !day.rest
    ).length;

    localStorage.removeItem("workout");
    localStorage.removeItem("workoutDate");

    return this.saveProfile({
      ...profile,
      weeklyPlan,
      trainingDays,
    });
  }

  static clearProfile() {
    localStorage.removeItem("profile");
  }
}

export default UserProfileEngine;
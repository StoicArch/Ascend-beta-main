import UserProfileEngine from "./UserProfileEngine";

class WeightEngine {
  static getEntries() {
    return JSON.parse(localStorage.getItem("weightEntries")) || [];
  }

  static saveEntries(entries) {
    localStorage.setItem("weightEntries", JSON.stringify(entries));
    return entries;
  }

  static saveEntry(weight) {
    const entries = this.getEntries();

    const newEntry = {
      date: new Date().toISOString(),
      weight: Number(weight),
    };

    return this.saveEntries([...entries, newEntry]);
  }

  static getStartingWeight() {
    const entries = this.getEntries();
    return entries.length ? entries[0].weight : null;
  }

  static getCurrentWeight() {
    const entries = this.getEntries();
    return entries.length ? entries[entries.length - 1].weight : null;
  }

  static getGoalWeight() {
    const profile = UserProfileEngine.getProfile();
    return profile.goalWeight || "";
  }

  static saveGoalWeight(goalWeight) {
    const profile = UserProfileEngine.getProfile();

    return UserProfileEngine.saveProfile({
      ...profile,
      goalWeight: Number(goalWeight),
    });
  }

  static getWeightChange() {
    const start = this.getStartingWeight();
    const current = this.getCurrentWeight();

    if (!start || !current) return 0;

    return Number((current - start).toFixed(1));
  }

  static getRemainingToGoal() {
    const current = this.getCurrentWeight();
    const goal = this.getGoalWeight();

    if (!current || !goal) return null;

    return Number((current - Number(goal)).toFixed(1));
  }

  static getGoalDirection() {
    const current = this.getCurrentWeight();
    const goal = this.getGoalWeight();

    if (!current || !goal) return "";

    if (Number(goal) < current) return "cut";
    if (Number(goal) > current) return "bulk";

    return "maintain";
  }
}

export default WeightEngine;
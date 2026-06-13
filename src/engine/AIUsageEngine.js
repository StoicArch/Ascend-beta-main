import PremiumEngine from "./PremiumEngine";

class AIUsageEngine {
  static DAILY_LIMIT = 10;

  static getTodayKey() {
    return new Date().toDateString();
  }

  static getUsage() {
    return (
      JSON.parse(localStorage.getItem("aiUsage")) || {
        date: this.getTodayKey(),
        count: 0,
      }
    );
  }

  static resetIfNewDay() {
    const usage = this.getUsage();

    if (usage.date !== this.getTodayKey()) {
      const freshUsage = {
        date: this.getTodayKey(),
        count: 0,
      };

      localStorage.setItem("aiUsage", JSON.stringify(freshUsage));
      return freshUsage;
    }

    return usage;
  }

  static canSendMessage() {
    if (PremiumEngine.isPremium()) return true;

    const usage = this.resetIfNewDay();

    return usage.count < this.DAILY_LIMIT;
  }

  static recordMessage() {
    if (PremiumEngine.isPremium()) {
      return this.getUsage();
    }

    const usage = this.resetIfNewDay();

    const updatedUsage = {
      ...usage,
      count: usage.count + 1,
    };

    localStorage.setItem("aiUsage", JSON.stringify(updatedUsage));

    return updatedUsage;
  }

  static getRemainingMessages() {
    if (PremiumEngine.isPremium()) return "Unlimited";

    const usage = this.resetIfNewDay();

    return Math.max(0, this.DAILY_LIMIT - usage.count);
  }
}

export default AIUsageEngine;
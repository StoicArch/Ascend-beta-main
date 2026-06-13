class AIUsageEngine {
  static DAILY_LIMIT = 10;

  static getToday() {
    return new Date().toDateString();
  }

  static getUsage() {
    const saved =
      JSON.parse(localStorage.getItem("aiUsage")) || {};

    if (saved.date !== this.getToday()) {
      return {
        date: this.getToday(),
        count: 0,
      };
    }

    return saved;
  }

  static getCount() {
    return this.getUsage().count;
  }

  static increment() {
    const usage = this.getUsage();

    const updated = {
      date: this.getToday(),
      count: usage.count + 1,
    };

    localStorage.setItem(
      "aiUsage",
      JSON.stringify(updated)
    );

    return updated.count;
  }

  static remaining() {
    return Math.max(
      0,
      this.DAILY_LIMIT - this.getCount()
    );
  }

  static hasReachedLimit() {
    return this.getCount() >= this.DAILY_LIMIT;
  }
}

export default AIUsageEngine;
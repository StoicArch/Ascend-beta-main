class WorkoutSessionEngine {
  static ACTIVE_SESSION_KEY = "activeWorkoutSession";
  static MISSED_NOTICE_KEY = "missedWorkoutNotice";

  static getTodayDate() {
    return new Date().toDateString();
  }

  static getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toDateString();
  }

  static getActiveSession() {
    return JSON.parse(localStorage.getItem(this.ACTIVE_SESSION_KEY)) || null;
  }

  static clearActiveSession() {
    localStorage.removeItem(this.ACTIVE_SESSION_KEY);
  }

  static closeExpiredWorkoutIfNeeded() {
    const session = this.getActiveSession();

    if (!session?.date) return null;

    const sessionDate = new Date(session.date).toDateString();
    const today = this.getTodayDate();

    if (sessionDate === today) return null;

    this.clearActiveSession();

    const notice = {
      date: today,
      message: "Yesterday's workout was not completed.",
      missedDate: sessionDate,
      shown: false,
    };

    localStorage.setItem(this.MISSED_NOTICE_KEY, JSON.stringify(notice));

    return notice;
  }

  static getMissedWorkoutNotice() {
    const notice =
      JSON.parse(localStorage.getItem(this.MISSED_NOTICE_KEY)) || null;

    if (!notice) return null;

    if (notice.date !== this.getTodayDate()) {
      localStorage.removeItem(this.MISSED_NOTICE_KEY);
      return null;
    }

    if (notice.shown) return null;

    return notice;
  }

  static markMissedWorkoutNoticeShown() {
    const notice =
      JSON.parse(localStorage.getItem(this.MISSED_NOTICE_KEY)) || null;

    if (!notice) return;

    localStorage.setItem(
      this.MISSED_NOTICE_KEY,
      JSON.stringify({
        ...notice,
        shown: true,
      })
    );
  }
}

export default WorkoutSessionEngine;
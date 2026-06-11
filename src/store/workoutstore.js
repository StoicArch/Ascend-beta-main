export const WorkoutStore = {


    saveSession(session) {
  const sessions =
    JSON.parse(localStorage.getItem("sessions")) || [];

  sessions.push({
    ...session,
    date: new Date().toISOString()
  });

  localStorage.setItem(
    "sessions",
    JSON.stringify(sessions)
  );
},

  get() {
    return JSON.parse(localStorage.getItem("workout")) || [];
  },

  set(data) {
    localStorage.setItem("workout", JSON.stringify(data));
  },

  add(exercise) {
    const current = this.get();
    const updated = [...current, exercise];
    this.set(updated);
    return updated;
  },

  remove(index) {
    const current = this.get();
    const updated = current.filter((_, i) => i !== index);
    this.set(updated);
    return updated;
  },

  update(index, field, value) {
    const current = this.get();
    current[index][field] = value;
    this.set(current);
    return current;
  }



  
};



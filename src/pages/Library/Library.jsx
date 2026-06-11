import React, { useState } from "react";
import "./ExercisesLibrary.css";
import { EXERCISES } from "../../Data/exercises";

export default function ExerciseLibrary() {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [addedId, setAddedId] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const muscles = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Abs"];
  const equipment = ["All", "Dumbbells", "Barbell", "Cable", "Machine", "Bodyweight"];

  const filtered = EXERCISES.filter((ex) => {
    const matchSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.muscle.toLowerCase().includes(search.toLowerCase()) ||
      ex.target.toLowerCase().includes(search.toLowerCase());

    const matchMuscle =
      muscleFilter === "All" || ex.muscle === muscleFilter;

    const matchEquipment =
      equipmentFilter === "All" || ex.equipment === equipmentFilter;

    return matchSearch && matchMuscle && matchEquipment;
  });

  const addToWorkout = (exercise) => {
    const existing = JSON.parse(localStorage.getItem("workout")) || [];

    const updated = [
      ...existing,
      {
        ...exercise,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
      },
    ];

    localStorage.setItem("workout", JSON.stringify(updated));
    setAddedId(exercise.id);

    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="exercise-library-page app-page">
      <div className="exercise-library-header">
        <div>
          <span className="eyebrow">Ascend Library</span>
          <h1>Exercise Library</h1>
          <p>{filtered.length} movements available for your training system.</p>
        </div>
      </div>

      <div className="exercise-library-search-box">
        <input
          className="exercise-library-search"
          placeholder="Search exercises, muscles, or targets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="filter-label">Muscle Group</p>
      <div className="exercise-library-filters">
        {muscles.map((muscle) => (
          <button
            key={muscle}
            className={muscleFilter === muscle ? "active" : ""}
            onClick={() => setMuscleFilter(muscle)}
          >
            {muscle}
          </button>
        ))}
      </div>

      <p className="filter-label">Equipment</p>
      <div className="exercise-library-filters">
        {equipment.map((item) => (
          <button
            key={item}
            className={equipmentFilter === item ? "active" : ""}
            onClick={() => setEquipmentFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="exercise-library-empty">No exercises found.</div>
      ) : (
        <div className="exercise-library-grid">
          {filtered.map((ex) => (
            <div className="exercise-card" key={ex.id}>
              <div
                className="exercise-card-image"
                style={{ backgroundImage: `url(${ex.image})` }}
                onClick={() => setSelectedExercise(ex)}
              >
                <span>{ex.muscle}</span>
              </div>

              <div className="exercise-card-body">
                <h3>{ex.name}</h3>

                <div className="exercise-meta">
                  <span>{ex.level}</span>
                  <span>{ex.equipment}</span>
                </div>

                <p className="exercise-target">{ex.target}</p>

                <div className="exercise-actions">
                  <button onClick={() => addToWorkout(ex)}>
                    {addedId === ex.id ? "Added ✓" : "Add"}
                  </button>

                  <button
                    className="details-btn"
                    onClick={() => setSelectedExercise(ex)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedExercise && (
        <div className="exercise-modal-backdrop" onClick={() => setSelectedExercise(null)}>
          <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="exercise-modal-image"
              style={{ backgroundImage: `url(${selectedExercise.image})` }}
            />

            <h2>{selectedExercise.name}</h2>
            <p className="modal-tags">
              {selectedExercise.muscle} • {selectedExercise.equipment} • {selectedExercise.level}
            </p>

            <h4>Target</h4>
            <p>{selectedExercise.target}</p>

            <h4>How to perform</h4>
            <p>{selectedExercise.instruction}</p>

            <button onClick={() => addToWorkout(selectedExercise)}>
              {addedId === selectedExercise.id ? "Added ✓" : "Add to Workout"}
            </button>

            <button
              className="close-modal-btn"
              onClick={() => setSelectedExercise(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
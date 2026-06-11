import React, { useState } from "react";
import {EXERCISES} from "../../Data/exercises";

export default function AddExerciseModal({
  onClose,
  onAdd
}) {

  const [search, setSearch] = useState("");

  const filtered = EXERCISES.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscle.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="modal">

      <div className="modal-box">

        <input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="exercise-results">

          {filtered.map(ex => (

            <div
              key={ex.id}
              className="exercise-item"
              onClick={() => onAdd(ex)}
            >

              <div>
                <h3>{ex.name}</h3>
                <p>{ex.muscle}</p>
              </div>

              <span>{ex.equipment}</span>

            </div>

          ))}

        </div>

        <button onClick={onClose}>
          Close
        </button>

      </div>

    </div>

  );
}
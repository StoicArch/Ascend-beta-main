import React, { useState } from "react";
import { EXERCISES } from "../../Data/exercises";

export default function ExerciseCard({
  exercise,
  onRemove,
  onUpdate,
  onSwap,
}) {
  const [showSwap, setShowSwap] = useState(false);

  const swapOptions = EXERCISES.filter(
    (item) => item.name !== exercise.name
  );

  return (
    <div className="workout-card">
      <div className="card-top">
        <div>
  <h2>{exercise.name}</h2>
  <span>{exercise.muscle}</span>
</div>

        <button onClick={onRemove}>✕</button>
      </div>

      <div className="metrics">
        <div className="metric">
          <label>Sets</label>
          <input
            type="number"
            value={exercise.sets}
            onChange={(e) => onUpdate("sets", Number(e.target.value))}
          />
        </div>

        <div className="metric">
          <label>Reps</label>
          <input
            type="number"
            value={exercise.reps}
            onChange={(e) => onUpdate("reps", Number(e.target.value))}
          />
        </div>
      </div>

      <button className="swap-btn" onClick={() => setShowSwap(!showSwap)}>
        Swap Exercise
      </button>

      {showSwap && (
        <div className="swap-menu">
          {swapOptions.map((item) => (
            <div
              key={item.id}
              className="swap-item"
              onClick={() => {
                onSwap({
                  ...item,
                  sets: item.sets || exercise.sets || 3,
                  reps: item.reps || exercise.reps || 10,
                });

                setShowSwap(false);
              }}
            >
              <h4>{item.name}</h4>
              <span>
                {item.muscle} • {item.equipment}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
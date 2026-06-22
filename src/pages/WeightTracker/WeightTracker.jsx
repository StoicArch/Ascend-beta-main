import React, { useState } from "react";
import "./WeightTracker.css";
import WeightEngine from "../../engine/WeightEngine";
import ProgressiveOverloadEngine from "../../engine/ProgressiveOverloadEngine";

export default function WeightTracker() {
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState(WeightEngine.getGoalWeight());
  const [entries, setEntries] = useState(WeightEngine.getEntries());

  const startingWeight = WeightEngine.getStartingWeight();
  const currentWeight = WeightEngine.getCurrentWeight();
  const savedGoalWeight = WeightEngine.getGoalWeight();
  const weightChange = WeightEngine.getWeightChange();
  const remainingWeight = WeightEngine.getRemainingToGoal();
  const goalDirection = WeightEngine.getGoalDirection();
  const progression = ProgressiveOverloadEngine.getProgressSummary();

  const saveWeight = () => {
    if (!weight || Number(weight) <= 0) {
      alert("Enter a valid weight.");
      return;
    }

    const updated = WeightEngine.saveEntry(weight);

    setEntries(updated);
    setWeight("");
  };

  const saveGoalWeight = () => {
    if (!goalWeight || Number(goalWeight) <= 0) {
      alert("Enter a valid goal weight.");
      return;
    }

    WeightEngine.saveGoalWeight(goalWeight);
    setGoalWeight(goalWeight);

    alert("Goal weight saved.");
  };

  const maxWeight = Math.max(...entries.map((e) => e.weight), 1);
  const minWeight = Math.min(...entries.map((e) => e.weight), maxWeight);

  return (
    <div className="weight-page app-page">
      <div className="weight-header">
        <span>ASCEND Progress</span>
        <h1>Weight Tracker</h1>
        <p>Track your bodyweight, goal weight, and trend over time.</p>
      </div>

      <div className="weight-summary-grid">
        <div className="weight-card">
          <span>Starting Weight</span>
          <h2>{startingWeight ? `${startingWeight} kg` : "--"}</h2>
        </div>

        <div className="weight-card">
          <span>Current Weight</span>
          <h2>{currentWeight ? `${currentWeight} kg` : "--"}</h2>
        </div>

        <div className="weight-card">
          <span>Goal Weight</span>
          <h2>{savedGoalWeight ? `${savedGoalWeight} kg` : "--"}</h2>
        </div>

        <div className="weight-card">
          <span>Change</span>
          <h2>
            {weightChange > 0 ? "+" : ""}
            {weightChange} kg
          </h2>
        </div>

        <div className="weight-card">
          <span>Remaining</span>
          <h2>{remainingWeight !== null ? `${remainingWeight} kg` : "--"}</h2>
          <p>
            {goalDirection === "cut"
              ? "Weight loss goal"
              : goalDirection === "bulk"
              ? "Weight gain goal"
              : goalDirection === "maintain"
              ? "Maintenance goal"
              : "Set a goal weight"}
          </p>
        </div>

        <div className="weight-card">
          <span>Weekly Progression Score</span>
          <h2>{progression.weeklyProgressionScore}/100</h2>
          <p>{progression.exercisesTracked} exercises tracked</p>
        </div>
      </div>

      <div className="weight-input-card">
        <h2>Strength Progress</h2>
        <p>
          Estimated 1RM Leader:{" "}
          {progression.topEstimatedOneRepMax
            ? `${progression.topEstimatedOneRepMax.name} (${progression.topEstimatedOneRepMax.estimatedOneRepMax}kg)`
            : "--"}
        </p>
        <p>
          Volume Leader:{" "}
          {progression.topVolume
            ? `${progression.topVolume.name} (${progression.topVolume.volume}kg)`
            : "--"}
        </p>
      </div>

      <div className="weight-input-card">
        <h2>Add New Weight</h2>

        <input
          type="number"
          placeholder="Enter weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button onClick={saveWeight}>Save Weight</button>
      </div>

      <div className="weight-input-card">
        <h2>Set Goal Weight</h2>

        <input
          type="number"
          placeholder="Enter goal weight in kg"
          value={goalWeight || ""}
          onChange={(e) => setGoalWeight(e.target.value)}
        />

        <button onClick={saveGoalWeight}>Save Goal Weight</button>
      </div>

      <div className="weight-chart-card">
        <h2>Weight Trend</h2>

        {entries.length < 2 ? (
          <p className="empty-chart">Add at least two entries to see a trend.</p>
        ) : (
          <div className="weight-chart">
            {entries.map((entry, index) => {
              const range = maxWeight - minWeight || 1;
              const height = ((entry.weight - minWeight) / range) * 100;

              return (
                <div className="chart-column" key={index}>
                  <div className="chart-dot" style={{ bottom: `${height}%` }} />
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="weight-history">
        <h2>History</h2>

        {entries.length === 0 ? (
          <p>No weight entries yet.</p>
        ) : (
          entries
            .slice()
            .reverse()
            .map((entry, index) => (
              <div className="weight-history-item" key={index}>
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <strong>{entry.weight} kg</strong>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./Settings.css";
import UserProfileEngine from "../../engine/UserProfileEngine";
import PremiumEngine from "../../engine/PremiumEngine";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const FOCUS_OPTIONS = [
  "Chest",
  "Back",
  "Shoulders",
  "Legs",
  "Glutes",
  "Biceps",
  "Triceps",
  "Abs",
  "Conditioning",
];

export default function Settings() {
  const [premiumCode, setPremiumCode] = useState("");
  const [isPremium, setIsPremium] = useState(PremiumEngine.isPremium());

  const [restTimer, setRestTimer] = useState(60);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("kg");

  const [profile, setProfile] = useState(UserProfileEngine.getProfile());

  const redeemPremiumCode = () => {
    const success = PremiumEngine.redeemCode(premiumCode);

    if (success) {
      setIsPremium(true);
      setPremiumCode("");
      alert("Premium unlocked!");
    } else {
      alert("Invalid premium code.");
    }
  };

  const clearTodayWorkout = () => {
    localStorage.removeItem("workout");
    localStorage.removeItem("workoutDate");
  };

  const updateProfile = (field, value) => {
    const updated = {
      ...profile,
      [field]: value,
    };

    setProfile(updated);
    UserProfileEngine.saveProfile(updated);
    clearTodayWorkout();
  };

  const toggleFocus = (day, focus) => {
    const weeklyPlan = profile.weeklyPlan || {};
    const currentDay = weeklyPlan[day] || {};
    const currentFocus = currentDay.focus || [];

    const updatedFocus = currentFocus.includes(focus)
      ? currentFocus.filter((item) => item !== focus)
      : [...currentFocus, focus];

    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        focus: updatedFocus,
      },
    };

    const trainingDays = Object.values(updatedPlan).filter(
      (item) => item?.focus && item.focus.length > 0
    ).length;

    const updatedProfile = {
      ...profile,
      weeklyPlan: updatedPlan,
      trainingDays,
    };

    setProfile(updatedProfile);
    UserProfileEngine.saveProfile(updatedProfile);
    clearTodayWorkout();
  };

  const markRestDay = (day) => {
    const weeklyPlan = profile.weeklyPlan || {};

    const updatedPlan = {
      ...weeklyPlan,
      [day]: {
        rest: true,
      },
    };

    const trainingDays = Object.values(updatedPlan).filter(
      (item) => item && !item.rest
    ).length;

    const updatedProfile = {
      ...profile,
      weeklyPlan: updatedPlan,
      trainingDays,
    };

    setProfile(updatedProfile);
    UserProfileEngine.saveProfile(updatedProfile);
    clearTodayWorkout();
  };

  const saveSettings = () => {
    UserProfileEngine.saveProfile(profile);
    clearTodayWorkout();
    alert("Settings saved successfully");
  };

  return (
    <div className={darkMode ? "settings dark app-page" : "settings app-page"}>
      <div className="settings-header">
        <h1>Settings</h1>
        <h2>{profile.name || "Guest"}</h2>
        <p>Manage your ASCEND profile, training, nutrition, and recovery.</p>
      </div>

      <div className="card">
        <h3>Name</h3>
        <input
          type="text"
          value={profile.name || ""}
          onChange={(e) => updateProfile("name", e.target.value)}
        />
      </div>

      <div className="card">
        <h3>Weight</h3>
        <input
          type="number"
          value={profile.weight || 70}
          onChange={(e) => updateProfile("weight", Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Goal Weight</h3>
        <input
          type="number"
          value={profile.goalWeight || ""}
          placeholder="Enter your target weight"
          onChange={(e) => updateProfile("goalWeight", Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Goal</h3>
        <select
          value={profile.goal || "Build Muscle"}
          onChange={(e) => updateProfile("goal", e.target.value)}
        >
          <option value="Build Muscle">Build Muscle</option>
          <option value="Lose Fat">Lose Fat</option>
          <option value="Gain Size">Gain Size</option>
          <option value="Build Strength">Build Strength</option>
        </select>
      </div>

      <div className="card">
        <h3>Training Days Per Week</h3>
        <input
          type="number"
          min="1"
          max="7"
          value={profile.trainingDays || 4}
          onChange={(e) => updateProfile("trainingDays", Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Workout Schedule</h3>
        <p>Edit what you train each day. Changes regenerate today’s workout.</p>

        {DAYS.map((day) => {
          const dayPlan = profile.weeklyPlan?.[day] || {};
          const selectedFocus = dayPlan.focus || [];
          const isRest = dayPlan.rest;

          return (
            <div key={day} className="settings-day-block">
              <div className="settings-day-header">
                <strong>{day}</strong>

                <button type="button" onClick={() => markRestDay(day)}>
                  Rest
                </button>
              </div>

              <div className="settings-focus-grid">
                {FOCUS_OPTIONS.map((focus) => {
                  const selected = selectedFocus.includes(focus);

                  return (
                    <button
                      key={focus}
                      type="button"
                      className={selected && !isRest ? "active" : ""}
                      onClick={() => toggleFocus(day, focus)}
                    >
                      {focus}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3>Sleep Target</h3>
        <input
          type="number"
          value={profile.sleep || 7}
          onChange={(e) => updateProfile("sleep", Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Daily Calories Target</h3>
        <input
          type="number"
          value={profile.calories || 2400}
          onChange={(e) => updateProfile("calories", Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Protein Target</h3>
        <input
          type="number"
          value={profile.protein || 160}
          onChange={(e) => updateProfile("protein", Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Rest Timer (seconds)</h3>
        <input
          type="number"
          value={restTimer}
          onChange={(e) => setRestTimer(Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h3>Weight Units</h3>
        <select value={units} onChange={(e) => setUnits(e.target.value)}>
          <option value="kg">Kilograms (kg)</option>
          <option value="lb">Pounds (lb)</option>
        </select>
      </div>

      <div className="card toggle-row">
        <h3>Dark Mode</h3>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "ON" : "OFF"}
        </button>
      </div>

      <div className="card toggle-row">
        <h3>Notifications</h3>
        <button onClick={() => setNotifications(!notifications)}>
          {notifications ? "ON" : "OFF"}
        </button>
      </div>

      <div className="card">
        <h3>Premium Access</h3>

        {isPremium ? (
          <p>Premium Active ✅</p>
        ) : (
          <>
            <p>Enter your ASCEND premium code to unlock premium content.</p>

            <input
              type="text"
              value={premiumCode}
              placeholder="Enter premium code"
              onChange={(e) => setPremiumCode(e.target.value)}
            />

            <button onClick={redeemPremiumCode}>Redeem Code</button>
          </>
        )}
      </div>

      <button className="save-btn" onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
}
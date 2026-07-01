import React, {useEffect} from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import DashboardEngine from "../../engine/DashboardEngine";
import UserProfileEngine from "../../engine/UserProfileEngine";
import WorkoutEngine from "../../engine/WorkoutEngine";
import ProgramEngine from "../../engine/ProgramEngine";

import WeeklyReviewEngine from "../../engine/WeeklyReviewEngine";

import AppTour from "../../components/AppTour/AppTour";
import DashboardCoachEngine from "../../engine/DashboardCoachEngine";

export default function Dashboard() {

  const [showUpdateModal, setShowUpdateModal] =
  React.useState(false);

useEffect(() => {

  const TODAY =
    new Date().toISOString().split("T")[0];

  const version =
    localStorage.getItem(
      "ascendUpdateVersion"
    );

  const lastShown =
    localStorage.getItem(
      "ascendUpdateLastShown"
    );

  if (
    version !== "3" ||
    lastShown !== TODAY
  ) {
    setShowUpdateModal(true);
  }

}, []);

 
  const [showTour, setShowTour] =
  React.useState(false);

useEffect(() => {
  const completed =
    localStorage.getItem(
      "ascendTourCompleted"
    );

  if (completed !== "true") {
    setShowTour(true);
  }
}, []);





  const navigate = useNavigate();

  const profile = UserProfileEngine.getProfile();

const programStatus = ProgramEngine.getProgramStatus();

  const todayWorkout = WorkoutEngine.getOrCreateTodayWorkout();
  
  const insight = DashboardEngine.getAIInsight();

  const coachMessage =
  DashboardCoachEngine.getDailyFocus();

  const latestReview =
  WeeklyReviewEngine.getLatestReview() ||
  WeeklyReviewEngine.saveReview();

const hasWeeklyReviewAlert = true;

const [canInstall, setCanInstall] =
React.useState(false);

useEffect(() => {

  const installed =
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    localStorage.getItem(
      "ascendInstalled"
    ) === "true";

  setCanInstall(
    !!window.deferredInstallPrompt &&
    !installed
  );

  const ready = () => setCanInstall(true);

  const installedListener = () =>
    setCanInstall(false);

  window.addEventListener(
    "ascend-install-ready",
    ready
  );

  window.addEventListener(
    "ascend-installed",
    installedListener
  );

  return () => {

    window.removeEventListener(
      "ascend-install-ready",
      ready
    );

    window.removeEventListener(
      "ascend-installed",
      installedListener
    );

  };

}, []);

const installAscend = async () => {

  if (!window.deferredInstallPrompt)
    return;

  window.deferredInstallPrompt.prompt();

  const result =
    await window.deferredInstallPrompt.userChoice;

  if (result.outcome === "accepted") {

    localStorage.setItem(
      "ascendInstalled",
      "true"
    );

    setCanInstall(false);

  }

  window.deferredInstallPrompt = null;

};

  return (
    <div className="dashboard-main app-page">
      <aside className="sidebar desktop-sidebar">
        <div className="sidebar-logo">ASCEND</div>

        <div className="sidebar-links">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/workout")}>Workouts</button>
          <button onClick={() => navigate("/programs")}>Programs</button>
          <button onClick={() => navigate("/library")}>Exercise Library</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
          <button onClick={() => navigate("/ai-coach")}>AI Coach</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">

    <div className="topbar-title">

        <h1>
            Welcome Back, {profile.name || "Athlete"}
        </h1>

        <p>
            Goal: {profile.goal || "Build Muscle"} • Training Days:{" "}
            {profile.trainingDays || 4}
        </p>

    </div>

    <button
        className="settings-icon-btn"
        onClick={() => navigate("/settings")}
    >
        ⚙️
    </button>

</div>

        <section className="dashboard-panels">

  <div className="today-workout-panel">

    
<div className="panel-header">

  <div className="panel-title">

    <span>TODAY'S WORKOUT</span>

    <h2>
      {programStatus.isRestDay
        ? "Recovery Day"
        : programStatus.todayTemplate?.name || "Workout"}
    </h2>

    {!programStatus.isRestDay && (
      <p>
        {todayWorkout.length} exercises •{" "}
        {todayWorkout
          .map(e => e.muscle)
          .filter((v,i,a)=>a.indexOf(v)===i)
          .slice(0,3)
          .join(" • ")}
      </p>
    )}

  </div>

</div>

<button
className="panel-btn start-workout-btn full-width"
onClick={()=>navigate("/workout")}
>
▶ Start Workout
</button>

<div className="workout-summary">

<div className="summary-pill">
<strong>{todayWorkout.length}</strong>
<span>Exercises</span>
</div>

<div className="summary-pill">
<strong>
{todayWorkout.reduce(
(total,e)=>total+(e.sets||3),
0
)}
</strong>
<span>Sets</span>
</div>

<div className="summary-pill">
<strong>
{
new Set(
todayWorkout.map(e=>e.muscle)
).size
}
</strong>
<span>Muscles</span>
</div>

</div>




{todayWorkout.length > 0 ? (

  <div className="exercise-preview">

        {todayWorkout.slice(0,5).map((exercise,index)=>(

          <div
  className={`exercise-row ${
    exercise.priority ? "priority-row" : ""
  }`}
  key={index}
>

  <div className="exercise-left">

    <div className="exercise-icon">
      🏋️
    </div>

    <div className="exercise-info">

      <h3>{exercise.name}</h3>

      <p>{exercise.muscle}</p>

    </div>

  </div>

  <div className="exercise-right">

    <span className="exercise-sets">
      {exercise.sets || 3} × {exercise.reps || 10}
    </span>

    {exercise.priority && (
      <span className="priority-tag">
        ⭐ Priority
      </span>
    )}

    <span className="exercise-arrow">
      →
    </span>

  </div>

</div>

        ))}

      </div>

    ) : (

      <p className="rest-day">
        Recover today. Your next workout will be ready tomorrow.
      </p>

    )}

  </div>

  <div className="coach-panel">

    <span>AI Coach</span>

    <h2>{coachMessage.title}</h2>

    <p>{insight}</p>

    <button
      className="panel-btn"
      onClick={() => navigate("/ai-coach")}
    >
      Open Coach
    </button>

  </div>

</section>


       

{canInstall && (

<section className="install-card">

<div>

<span className="install-tag">
APP EXPERIENCE
</span>

<div className="install-content">

<h2>
Install ASCEND
</h2>

<p>
Train faster with offline workouts, instant launches,
and automatic updates.
</p>

<div className="install-features">

<div>⚡ Instant Launch</div>

<div>📶 Offline Workouts</div>

<div>🚀 Auto Updates</div>

</div>

</div>
</div>

<button
className="install-btn"
onClick={installAscend}
>
Install
</button>

</section>

)}

        <section
  id="tour-weekly-review"
  className="weekly-review-banner"
  onClick={() => navigate("/weekly-review")}
>
  
  <div>
    <span>Weekly Review</span>

    <h2>
      Your progress check is ready
      {hasWeeklyReviewAlert && (
        <span className="review-red-dot" />
      )}
    </h2>

    <p>
      {latestReview.weightChange > 0 ? "+" : ""}
      {latestReview.weightChange}kg this week •{" "}
      {latestReview.workoutsCompleted}/
      {latestReview.expectedWorkouts}
      {" "}workouts completed
    </p>
  </div>

  <button>View Review</button>
</section>

        
       

        
      </main>

      {showUpdateModal && (
  <div className="update-modal-overlay">
    <div className="update-modal">

      <span className="update-tag">
        WHAT'S NEW
      </span>

      <h2>
        Welcome to a better ASCEND
      </h2>

      <p>
        Your training experience just got smarter.
      </p>

      <div className="update-list">

        <div>✨ Priority Muscle Specialization</div>

        <div>📈 Better Dashboard</div>

        <div>⚡ Faster Performance</div>

        <div>🔧 Bug Fixes & Improvements</div>

      </div>

      {!localStorage.getItem("token") && (
        <button
          className="update-google-btn"
          onClick={() => navigate("/auth")}
        >
          Continue with Google
        </button>
      )}

      <button
        className="update-continue-btn"
        onClick={() => {

  localStorage.setItem(
    "ascendUpdateVersion",
    "3"
  );

  localStorage.setItem(
    "ascendUpdateLastShown",
    new Date()
      .toISOString()
      .split("T")[0]
  );

  setShowUpdateModal(false);

}}
      >
        Continue
      </button>

    </div>
  </div>
)}

      {showTour && (
  <AppTour
    onFinish={() => {
      localStorage.setItem(
        "ascendTourCompleted",
        "true"
      );

      setShowTour(false);
    }}
  />
)}
    </div>
  );
}

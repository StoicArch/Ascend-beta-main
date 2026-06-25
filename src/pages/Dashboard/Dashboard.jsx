import React, {useEffect} from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import DashboardEngine from "../../engine/DashboardEngine";
import UserProfileEngine from "../../engine/UserProfileEngine";
import WorkoutEngine from "../../engine/WorkoutEngine";
import ProgramEngine from "../../engine/ProgramEngine";
import WeightEngine from "../../engine/WeightEngine";

import WeeklyReviewEngine from "../../engine/WeeklyReviewEngine";
import GoalEngine from "../../engine/GoalEngine";
import WorkoutSessionEngine from "../../engine/WorkoutSessionEngine";
import FoodLogEngine from "../../engine/FoodLogEngine"
import AppTour from "../../components/AppTour/AppTour";
import DashboardCoachEngine from "../../engine/DashboardCoachEngine";

export default function Dashboard() {

  const [showUpdateModal, setShowUpdateModal] =
  React.useState(false);

useEffect(() => {
  const version =
    localStorage.getItem(
      "ascendUpdateVersion"
    );

  if (version !== "2") {
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


const [missedWorkoutNotice, setMissedWorkoutNotice] = React.useState(null);

useEffect(() => {
  WorkoutSessionEngine.closeExpiredWorkoutIfNeeded();

  const notice = WorkoutSessionEngine.getMissedWorkoutNotice();

  if (notice) {
    setMissedWorkoutNotice(notice);
    WorkoutSessionEngine.markMissedWorkoutNoticeShown();
  }
}, []); 


  const navigate = useNavigate();

  const profile = UserProfileEngine.getProfile();

  const currentProgram = ProgramEngine.getCurrentProgram();

const programStatus = ProgramEngine.getProgramStatus();

  const todayWorkout = WorkoutEngine.getOrCreateTodayWorkout();

  const workoutCount = todayWorkout.length;
  const recovery = DashboardEngine.getRecoveryScore();
  const streak = DashboardEngine.getStreak();
 
  const todayCalories =
  FoodLogEngine.getTodayCalories();

const todayProtein =
  FoodLogEngine.getTodayProtein();




  
  const insight = DashboardEngine.getAIInsight();

  const coachMessage =
  DashboardCoachEngine.getDailyFocus();

  
  

  const currentWeight = WeightEngine.getCurrentWeight();
  
const goalMessage = GoalEngine.getGoalMessage();

  const latestReview =
  WeeklyReviewEngine.getLatestReview() ||
  WeeklyReviewEngine.saveReview();

const hasWeeklyReviewAlert = true;









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
          <div>
            <h1>Welcome Back, {profile.name || "Athlete"}</h1>
            <p>
              Goal: {profile.goal || "Build Muscle"} • Training Days:{" "}
              {profile.trainingDays || 4}
            </p>
          </div>

          {missedWorkoutNotice && (
  <div className="missed-workout-notice">
    <strong>Workout missed</strong>
    <p>{missedWorkoutNotice.message}</p>
  </div>
)}

          <div className="topbar-actions">
            <button
    className="settings-icon-btn"
    onClick={() => navigate("/settings")}
  >
    ⚙️
  </button>

  
 <button
  id="tour-start-workout"
  className="top-btn"
  onClick={() => navigate("/workout")}
>
    Start Workout
  </button>

          </div>
        </div>

       <section className="dashboard-hero">

  <div>

    <span className="hero-tag">
      TODAY
    </span>

    <h1>
      {recovery >= 80
        ? "Ready to Progress"
        : "Recovery First"}
    </h1>

    <p>
      {recovery >= 80
        ? "Recovery is high. Push heavier weights today."
        : "Recovery is low. Focus on quality training and nutrition."}
    </p>

    <button
      className="hero-btn"
      onClick={() => navigate("/workout")}
    >
      Start Workout
    </button>

  </div>

  <div className="hero-score">

    <span>Recovery</span>

    <h2>{recovery}%</h2>

  </div>

</section>

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


     <section className="quick-stats">

  <div
    className="quick-card"
    onClick={() => navigate("/weight")}
  >
    <span>Weight</span>
    <h2>
      {currentWeight
        ? `${currentWeight}kg`
        : "--"}
    </h2>
    <p>{goalMessage}</p>
  </div>

  <div className="quick-card">
    <span>Workout Streak</span>
    <h2>{streak}</h2>
    <p>Keep showing up.</p>
  </div>

  <div className="quick-card">
    <span>Today's Goal</span>

    <h2>
      {[
        workoutCount > 0 ? 1 : 0,
        todayProtein >= profile.protein ? 1 : 0,
        recovery >= 80 ? 1 : 0,
      ].reduce((a, b) => a + b, 0)}
      /3
    </h2>

    <p>Complete today's targets.</p>
  </div>

</section>

        <section className="nutrition-overview">

  <div className="nutrition-header">
    <div>
      <span>Nutrition</span>
      <h2>Today's Intake</h2>
    </div>

    <button
      className="nutrition-open-btn"
      onClick={() => navigate("/food-scan-test")}
    >
      Track Food
    </button>
  </div>

  <div className="nutrition-stats">

    <div className="nutrition-stat">
      <span>Calories</span>
      <h2>{todayCalories}</h2>
      <p>/ {profile.calories}</p>
    </div>

    <div className="nutrition-stat">
      <span>Protein</span>
      <h2>{todayProtein}g</h2>
      <p>/ {profile.protein}g</p>
    </div>

  </div>

</section>
        

        <section className="dashboard-panels">

  <div className="today-workout-panel">

    <div className="panel-header">

      <div>

        <span>Today's Workout</span>

        <h2>
          {workoutCount > 0
            ? `${workoutCount} Exercises`
            : "Recovery Day"}
        </h2>

      </div>

      <button
        className="panel-btn"
        onClick={() => navigate("/workout")}
      >
        Open
      </button>

    </div>

    {todayWorkout.length > 0 ? (

      <div className="exercise-preview">

        {todayWorkout.slice(0,4).map((exercise,index)=>(

          <div
            className="exercise-row"
            key={index}
          >

            <div>

              <h3>{exercise.name}</h3>

              <p>{exercise.muscle}</p>

            </div>

            <strong>
              {exercise.sets || 3} × {exercise.reps || 10}
            </strong>

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
       

        <section className="bottom-grid">

  <div className="program-summary">

    <span>Current Program</span>

    <h2>
      {currentProgram?.name || "No Program"}
    </h2>

    <p>
      {currentProgram
        ? `Week ${programStatus.week}`
        : "Choose a program to begin."
      }
    </p>

    <button
      className="panel-btn"
      onClick={() =>
        navigate(
          currentProgram
            ? "/program"
            : "/programs"
        )
      }
    >
      View Program
    </button>

  </div>

  <div className="priority-summary">

    <span>Priority Muscles</span>

    {profile.weakMuscles?.length ? (

      <div className="priority-list">

        {profile.weakMuscles.map((muscle) => (

          <div
            key={muscle}
            className="priority-pill"
          >
            ⭐ {muscle}
          </div>

        ))}

      </div>

    ) : (

      <p>No specialization active.</p>

    )}

  </div>

</section>
      </main>

      {showUpdateModal && (
  <div className="update-modal-overlay">
    <div className="update-modal">

      <span className="update-tag">
        ASCEND UPDATE
      </span>

      <h2>
        Priority Muscle System
      </h2>

      <p>
        ASCEND can now prioritize weak muscles
        during program generation.
      </p>

      <div className="update-list">

        <div>
          ✅ Priority muscles trained twice weekly
        </div>

        <div>
          ✅ Minimum 10 weekly sets
        </div>

        <div>
          ✅ Priority muscles placed first
        </div>

        <div>
          ✅ Better specialization
        </div>

      </div>

      <button
        onClick={() => {
          localStorage.setItem(
            "ascendUpdateVersion",
            "2"
          );

          setShowUpdateModal(false);
        }}
      >
        Got It
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

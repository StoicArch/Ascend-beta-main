import React, {useEffect} from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import DashboardEngine from "../../engine/DashboardEngine";
import UserProfileEngine from "../../engine/UserProfileEngine";
import WorkoutEngine from "../../engine/WorkoutEngine";
import ProgramEngine from "../../engine/ProgramEngine";
import WeightEngine from "../../engine/WeightEngine";
import ProgressEngine from "../../engine/ProgressEngine";
import WeeklyReviewEngine from "../../engine/WeeklyReviewEngine";
import GoalEngine from "../../engine/GoalEngine";
import WorkoutSessionEngine from "../../engine/WorkoutSessionEngine";
import FoodLogEngine from "../../engine/FoodLogEngine"
import AppTour from "../../components/AppTour/AppTour";

export default function Dashboard() {
  const [showTour, setShowTour] =
  React.useState(
    !localStorage.getItem(
      "ascendTourCompleted"
    )
  );


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
  const todayWorkout = WorkoutEngine.getOrCreateTodayWorkout();

  const workoutCount = todayWorkout.length;
  const recovery = DashboardEngine.getRecoveryScore();
  const streak = DashboardEngine.getStreak();
  const calories = DashboardEngine.getCalories();
  const protein = DashboardEngine.getProtein();
  const todayCalories =
  FoodLogEngine.getTodayCalories();

const todayProtein =
  FoodLogEngine.getTodayProtein();

const todayCarbs =
  FoodLogEngine.getTodayCarbs();

const todayFat =
  FoodLogEngine.getTodayFat();


  const sleep = DashboardEngine.getSleep();
  const insight = DashboardEngine.getAIInsight();

  const programStatus = ProgramEngine.getProgramStatus();
  const currentProgram = programStatus.program;

  const currentWeight = WeightEngine.getCurrentWeight();
  const weightChange = WeightEngine.getWeightChange();

  const completedWorkouts = ProgressEngine.getCompletedCount();

  const goalStatus = GoalEngine.getGoalStatus();
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

       <section
  id="tour-program-card"
  className="current-program-card"
>
          <div>
            <span>Current Program</span>

            <h2>{currentProgram?.name || "No Program Selected"}</h2>

            <p>
              {currentProgram
                ? `Week ${programStatus.week} • ${currentProgram.goal}`
                : "Choose a program to begin your transformation."}
            </p>

            {currentProgram && (
              <p>
                {programStatus.isRestDay
  ? `Today is recovery. Next workout: ${
      programStatus.nextWorkout?.day || "Soon"
    }`
  : `Today: ${programStatus.todayWorkout.length} exercises`}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(currentProgram ? "/program" : "/programs")}
          >
            {currentProgram ? "View Program" : "Choose Program"}
          </button>
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

        <section className="metrics-grid">
          
         <div
  id="tour-weight"
  className="metric-card clickable"
  onClick={() => navigate("/weight")}
>
  <span>Weight</span>
            <h2>{currentWeight ? `${currentWeight}kg` : "--"}</h2>
            <p>
              {currentWeight
                ? `${weightChange > 0 ? "+" : ""}${weightChange}kg change`
                : "Add your first weight entry."}
            </p>
          </div>

          <div
  className="metric-card clickable"
  onClick={() => navigate("/weight")}
>
  <span>Goal Progress</span>

  <h2>{goalStatus.progressPercent}%</h2>

  <p>{goalMessage}</p>
</div>

          <div className="metric-card">
            <span>Completed</span>
            <h2>{completedWorkouts}</h2>
            <p>Workouts Finished</p>
          </div>

          <div
  id="tour-recovery"
  className="metric-card recovery"
>
            <span>Recovery Score</span>
            <h2>{recovery}%</h2>
            <p>
              {recovery >= 80
                ? "Ready to push intensity today."
                : "Manage intensity and recover well."}
            </p>
          </div>

          <div className="metric-card">
            <span>Calories</span>
            <h2>{calories}</h2>
            <p>Daily nutrition target.</p>
          </div>

          <div className="metric-card">
            <span>Protein</span>
            <h2>{protein}g</h2>
            <p>Muscle recovery target.</p>
          </div>

          <div className="metric-card">
            <span>Sleep</span>
            <h2>{sleep}h</h2>
            <p>Sleep recovery target.</p>
          </div>
        </section>
        
        <section className="nutrition-card">

  <h2>AI Nutrition Tracker</h2>

  <div className="nutrition-grid">

    <div>
      <span>Calories</span>
      <h3>
        {todayCalories}/{profile.calories}
      </h3>
    </div>

    <div>
      <span>Protein</span>
      <h3>
        {todayProtein}/{profile.protein}g
      </h3>
    </div>

    <div>
      <span>Carbs</span>
      <h3>
        {todayCarbs}/{profile.carbs}g
      </h3>
    </div>

    <div>
      <span>Fat</span>
      <h3>
        {todayFat}/{profile.fat}g
      </h3>
    </div>

  </div>
</section>

        <section className="dashboard-grid">
          <div className="dashboard-card workout-card">
            <div className="card-header">
              <h2>Today's Workout</h2>
              <span>{workoutCount} Exercises</span>
            </div>

            {todayWorkout.length === 0 ? (
              <div className="empty-workout">
                <p>
                  Today is a recovery day or no workout has been generated yet.
                </p>
                <button onClick={() => navigate("/workout")}>
                  Open Workout
                </button>
              </div>
            ) : (
              <div className="exercise-list">
                {todayWorkout.slice(0, 5).map((exercise, index) => (
                  <div className="exercise" key={index}>
                    <div>
                      <h3>{exercise.name}</h3>
                      <p>{exercise.muscle || "Training"} • Today</p>
                    </div>

                    <span>
                      {exercise.sets || 3} × {exercise.reps || 10}
                    </span>
                  </div>
                ))}

                {todayWorkout.length > 5 && (
                  <button
                    className="view-more-workout"
                    onClick={() => navigate("/workout")}
                  >
                    View full workout
                  </button>
                )}
              </div>
            )}
          </div>

         <div
  id="tour-ai-coach"
  className="dashboard-card ai-card"
>
            <div className="card-header">
              <h2>AI Coach</h2>
              <span>Adaptive Intelligence</span>
            </div>

            <div className="ai-message">
              <p>{insight}</p>

              <button
                className="ai-action"
                onClick={() => navigate("/ai-coach")}
              >
                Ask AI Coach
              </button>

              <button
  id="tour-nutrition"
  className="ai-action"
  onClick={() => navigate("/food-scan-test")}
>
  AI MEAL TRACKER
</button>
            </div>

            <div className="ai-stats">
              <div>
                <h3>Volume</h3>
                <p>{workoutCount * 3} sets</p>
              </div>

              <div>
                <h3>Streak</h3>
                <p>{streak}</p>
              </div>
            </div>
          </div>
        </section>

       

        <section className="quote-section">
          <p>“Whatever you do, work at it with all your heart.”</p>
          <span>Colossians 3:23</span>
        </section>
      </main>

      

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

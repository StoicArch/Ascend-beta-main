import React, { useState } from "react";
import "./WeeklyReview.css";
import WeeklyReviewEngine from "../../engine/WeeklyReviewEngine";
import PremiumEngine from "../../engine/PremiumEngine";
import { useNavigate } from "react-router-dom";
import ProgramEngine from "../../engine/ProgramEngine";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
  

  export default function WeeklyReview() {

   


  const navigate = useNavigate();

  const [review, setReview] = useState(
  WeeklyReviewEngine.saveReview()
);

  const isPremium = PremiumEngine.isPremium();

 const programStatus = ProgramEngine.getProgramStatus();
const nextWorkoutPreview = programStatus.nextWorkoutPreview;

  const refreshReview = () => {
    const updated = WeeklyReviewEngine.saveReview();
    setReview(updated);
  };

  return (
    <div className="weekly-review-page app-page">
      <div className="weekly-review-header">
        <span>ASCEND Weekly Review</span>
        <h1>Your Week In Progress</h1>
        <p>
          See how your training, weight, and nutrition are moving this week.
        </p>
      </div>

      <div className="review-card">
        <h2>Weekly Summary</h2>
        

        <div className="review-grid">

          <div>
            <span>Weight Change</span>
            <strong>
              {review.weightChange > 0 ? "+" : ""}
              {review.weightChange} kg
            </strong>
          </div>



<div>
  <span>PRs Hit</span>
  <strong>{review.prsHit || 0}</strong>
</div>

          <div>
            <span>Workouts</span>
            <strong>
              {review.workoutsCompleted}/{review.expectedWorkouts}
            </strong>
          </div>

          <div>
            <span>Completion</span>
            <strong>{review.completionRate}%</strong>
          </div>
        </div>

        <p className="review-note">{review.basicRecommendation}</p>
      </div>

      {review.weightTrend && review.weightTrend.length >= 2 && (
  <div className="review-card">
    <h2>Weight Trend</h2>

    <div className="weight-chart">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={review.weightTrend}>
          <XAxis dataKey="date" />
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="weight"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

      {nextWorkoutPreview && (
  <div className="review-card">
    <h2>Next Workout</h2>

    <div className="review-grid">
      <div>
        <span>Day</span>
        <strong>{nextWorkoutPreview.day}</strong>
      </div>

      <div>
        <span>Workout</span>
        <strong>{nextWorkoutPreview.name}</strong>
      </div>

      <div>
        <span>Main Target</span>
        <strong>{nextWorkoutPreview.mainTarget}</strong>
      </div>
    </div>

    <p className="review-note">
      <strong>Goal:</strong> {nextWorkoutPreview.goal}
    </p>
  </div>
)}

      <div className="review-card premium-review-card">
        <h2>AI Premium Review</h2>

        {!isPremium && (
          <div className="premium-overlay">
            <h3>Unlock Full Weekly Review</h3>
            <p>
              Get calorie changes, macro adjustments, and training advice based
              on your progress.
            </p>

            <button onClick={() => navigate("/premium")}>Get Premium</button>
          </div>
        )}

       
        <div className={!isPremium ? "blurred-review" : ""}>
          <div className="review-grid">
            <div>
              <span>Calorie Adjustment</span>
              <strong>
                {review.premiumReview.calorieAdjustment > 0 ? "+" : ""}
                {review.premiumReview.calorieAdjustment} kcal
              </strong>
            </div>

            <div>
              <span>Recommended Calories</span>
              <strong>{review.premiumReview.recommendedCalories}</strong>
            </div>

            <div>
              <span>Protein</span>
              <strong>{review.premiumReview.recommendedProtein}g</strong>
            </div>
          </div>

          <p className="review-note">{review.premiumReview.summary}</p>
          <p className="review-note">{review.premiumReview.trainingAdvice}</p>

          <div className="review-card">
  <h3>Next Week Focus</h3>

  <p>
    {review.nextWeekFocus}
  </p>
</div>
          {isPremium && review.premiumReview.calorieAdjustment !== 0 && (
  <button
    className="apply-review-btn"
    onClick={() => {
      const profile = JSON.parse(localStorage.getItem("profile")) || {};

      localStorage.setItem(
        "profile",
        JSON.stringify({
          ...profile,
          calories: review.premiumReview.recommendedCalories,
        })
      );

      alert("Calories updated for next week.");
      refreshReview();
    }}
  >
    Apply Calorie Recommendation
  </button>
)}

 <p className="review-note">{review.trainingConsistencyText}</p>
<p className="review-note">{review.strengthProgressText}</p>


        </div>
      </div>

      <button className="refresh-review-btn" onClick={refreshReview}>
        Refresh Weekly Review
      </button>
    </div>
  );
}
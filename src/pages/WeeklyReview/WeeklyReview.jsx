import React, { useState } from "react";
import "./WeeklyReview.css";
import WeeklyReviewEngine from "../../engine/WeeklyReviewEngine";
import PremiumEngine from "../../engine/PremiumEngine";
import { useNavigate } from "react-router-dom";

export default function WeeklyReview() {
  const navigate = useNavigate();

  const [review, setReview] = useState(
    WeeklyReviewEngine.getLatestReview() || WeeklyReviewEngine.saveReview()
  );

  const isPremium = PremiumEngine.isPremium();

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
        </div>
      </div>

      <button className="refresh-review-btn" onClick={refreshReview}>
        Refresh Weekly Review
      </button>
    </div>
  );
}
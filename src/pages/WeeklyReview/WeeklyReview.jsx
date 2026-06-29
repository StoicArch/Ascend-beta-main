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

    <h1>Your Weekly Report</h1>

    <p>
      Everything that changed this week,
      what ASCEND learned, and what
      happens next.
    </p>

  </div>

  <div className="biggest-win-card">

    <span>🏆 BIGGEST WIN</span>

    <h2>{review.biggestWin}</h2>

    <p>{review.biggestWinDescription}</p>

  </div>

  <div className="review-card">

    <div className="review-card-top">

      <div>

        <span className="review-label">
          THIS WEEK
        </span>

        <h2>Performance Summary</h2>

      </div>

      <div className="review-score">

        {review.weeklyProgressionScore || 0}

        <span>/100</span>

      </div>

    </div>

    <div className="review-metrics">

      <div className="positive-card">

        <span>Weight Change</span>

        <strong>
          {review.weightChange > 0 ? "+" : ""}
          {review.weightChange} kg
        </strong>

      </div>

      <div className="positive-card">

        <span>PRs Hit</span>

        <strong>
          {review.prsHit}
        </strong>

      </div>

      <div>

        <span>Completed</span>

        <strong>
          {review.workoutsCompleted}/
          {review.expectedWorkouts}
        </strong>

      </div>

      <div className="positive-card">

        <span>Completion</span>

        <strong>
          {review.completionRate}%
        </strong>

      </div>

      <div>

        <span>Workout Streak</span>

        <strong>
          {review.workoutStreak} Days
        </strong>

      </div>

      <div>

        <span>Recovery</span>

        <strong>
          {review.recoveryScore}
        </strong>

      </div>

    </div>

    <div className="coach-summary">

      <span>
        ASCEND ANALYSIS
      </span>

      <p>

        {review.basicRecommendation}

      </p>

    </div>

  </div>

      {review.weightTrend && review.weightTrend.length >= 2 && (

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        PROGRESS
      </span>

      <h2>Weight Trend</h2>

    </div>

  </div>

  <div className="weight-chart">

    <ResponsiveContainer
      width="100%"
      height={220}
    >

      <LineChart
        data={review.weightTrend}
      >

        <XAxis dataKey="date" />

        <YAxis
          domain={["dataMin - 1","dataMax + 1"]}
        />

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

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        ACHIEVEMENTS
      </span>

      <h2>This Week's Wins</h2>

    </div>

  </div>

  <div className="achievement-grid">

   {review.achievements?.map((item, index) => (

  <div
    key={index}
    className="achievement-card"
  >

    <h4>{item.title}</h4>

    <p>{item.description}</p>

  </div>

))}

  </div>

</div>

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        GRADE
      </span>

      <h2>Overall Performance</h2>

    </div>

  </div>

  <div className="weekly-grade">

    <div className="grade-circle">

      {review.weekGrade}

    </div>

    <div>

      <h3>

        {review.gradeTitle}

      </h3>

      <p>

        {review.gradeDescription}

      </p>

    </div>

  </div>

</div>

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        THIS WEEK IN NUMBERS
      </span>

      <h2>Training Stats</h2>

    </div>

  </div>

  <div className="review-metrics">

    <div>

      <span>
        Training Time
      </span>

      <strong>

        {review.totalTrainingTime} min

      </strong>

    </div>

    <div>

      <span>
        Total Sets
      </span>

      <strong>

        {review.totalSets}

      </strong>

    </div>

    <div>

      <span>
        Total Volume
      </span>

      <strong>

        {review.totalVolume} kg

      </strong>

    </div>

    <div>

      <span>
        Workout Streak
      </span>

      <strong>

        {review.workoutStreak} Days

      </strong>

    </div>

  </div>

</div>

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        MILESTONES
      </span>

      <h2>Unlocked This Week</h2>

    </div>

  </div>

  <ul className="milestone-list">

    {review.milestones?.map((item)=>(

      <li key={item}>

        ✅ {item}

      </li>

    ))}

  </ul>

</div>

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        NEXT LEVEL
      </span>

      <h2>Areas To Improve</h2>

    </div>

  </div>

  <ul className="improvement-list">

    {review.improvements?.map((item)=>(

      <li key={item}>

        • {item}

      </li>

    ))}

  </ul>

</div>

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        COACH TIP
      </span>

      <h2>Tip Of The Week</h2>

    </div>

  </div>

  <div className="coach-tip-card">

    <h3>

      💡 {review.tipTitle}

    </h3>

    <p>

      {review.tipDescription}

    </p>

  </div>

</div>

      {nextWorkoutPreview && (

<div className="review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        UP NEXT
      </span>

      <h2>Next Workout</h2>

    </div>

  </div>

  <div className="review-grid">

    <div>

      <span>Day</span>

      <strong>
        {nextWorkoutPreview.day}
      </strong>

    </div>

    <div>

      <span>Workout</span>

      <strong>
        {nextWorkoutPreview.name}
      </strong>

    </div>

    <div>

      <span>Main Target</span>

      <strong>
        {nextWorkoutPreview.mainTarget}
      </strong>

    </div>

  </div>

  <p className="review-note">

    <strong>Goal:</strong>

    {nextWorkoutPreview.goal}

  </p>

</div>

)}

<div className="review-card premium-review-card">

  <div className="review-section-top">

    <div>

      <span className="review-label">
        PREMIUM AI
      </span>

      <h2>Adaptive Review</h2>

    </div>

  </div>

  {!isPremium && (

    <div className="premium-overlay">

      <h3>
        Unlock Full Weekly Review
      </h3>

      <p>

        Get calorie adjustments,
        macro changes,
        recovery analysis,
        AI coaching,
        and adaptive nutrition.

      </p>

      <button
        onClick={() =>
          navigate("/premium")
        }
      >

        Get Premium

      </button>

    </div>

  )}

  <div
    className={
      !isPremium
        ? "blurred-review"
        : ""
    }
  >

    <div className="review-grid">

      <div>

        <span>
          Calorie Adjustment
        </span>

        <strong>

          {review.premiumReview.calorieAdjustment > 0
            ? "+"
            : ""}

          {review.premiumReview.calorieAdjustment}

          kcal

        </strong>

      </div>

      <div>

        <span>
          Calories
        </span>

        <strong>

          {review.premiumReview.recommendedCalories}

        </strong>

      </div>

      <div>

        <span>
          Protein
        </span>

        <strong>

          {review.premiumReview.recommendedProtein}g

        </strong>

      </div>

    </div>

    <p className="review-note">

      {review.premiumReview.summary}

    </p>

    <p className="review-note">

      {review.premiumReview.trainingAdvice}

    </p>

    <div className="next-week-focus">

      <span>

        NEXT WEEK'S FOCUS

      </span>

      <p>

        {review.nextWeekFocus}

      </p>

    </div>

    {isPremium &&
      review.premiumReview.calorieAdjustment !== 0 && (

      <button
        className="apply-review-btn"
        onClick={() => {

          const profile =
            JSON.parse(
              localStorage.getItem("profile")
            ) || {};

          localStorage.setItem(
            "profile",

            JSON.stringify({

              ...profile,

              calories:
                review.premiumReview
                  .recommendedCalories,

            })

          );

          alert(
            "Calories updated for next week."
          );

          refreshReview();

        }}
      >

        Apply Calorie Recommendation

      </button>

    )}

    <div className="review-insights">

      <div className="review-insight">

        <h4>
          Training Consistency
        </h4>

        <p>

          {review.trainingConsistencyText}

        </p>

      </div>

      <div className="review-insight">

        <h4>
          Strength Progress
        </h4>

        <p>

          {review.strengthProgressText}

        </p>

      </div>

    </div>

  </div>

</div>

<button
  className="refresh-review-btn"
  onClick={refreshReview}
>

  Generate New Review

</button>

</div>

);
}

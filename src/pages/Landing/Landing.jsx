import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import Navbar from "../../components/ui/Navbar";

export default function LandingPage() {

  const navigate = useNavigate();


  return (
    <div className="landing">

    <div className="landing-navbar">
  <Navbar />
</div>

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">

          <div className="hero-badge">
            AI-Powered Fitness Operating System
          </div>

          <h1>
Train without
<br />
Thinking<span className="hero-dot">.</span>
</h1>

       <p>
ASCEND generates your workouts, tracks your nutrition,
reviews your progress weekly, manages progressive overload,
and tells you exactly what to do next.
</p>

        

          <div className="hero-buttons">

  <button
    className="primary-btn"
    onClick={() => navigate("/auth")}
  >
    Get Started Free
  </button>

  <button
    className="secondary-btn"
    onClick={() => navigate("/programs")}
  >
    Explore Programs
  </button>

</div>

          <div className="stat">
  <h2>Adaptive AI</h2>
  <span>Adjusts every week based on your progress.</span>
</div>

<div className="stat">
  <h2>Evidence Based</h2>
  <span>Progressive overload built into every program.</span>
</div>

<div className="stat">
  <h2>Everything Together</h2>
  <span>Workouts, nutrition and recovery in one system.</span>
</div>
        </div>

        <div className="hero-right">

          <div className="dashboard-preview">

            <div className="preview-top">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>

            <div className="preview-content">

              <div className="preview-card large">
                <h3>Today's Workout</h3>

                <div className="exercise-row">
                  <span>Incline Dumbbell Press</span>
                  <span>4 × 10</span>
                </div>

                <div className="exercise-row">
                  <span>Machine Chest Press</span>
                  <span>3 × 12</span>
                </div>

                <div className="exercise-row">
                  <span>Cable Fly</span>
                  <span>3 × 15</span>
                </div>

              </div>

              <div className="preview-grid">

                <div className="preview-card">
                  <h3>Recovery</h3>
                  <p>87%</p>
                </div>

                <div className="preview-card">
                  <h3>Volume</h3>
                  <p>14.2k</p>
                </div>

              </div>
<div className="preview-card ai-card">

  <div className="preview-ai-top">
    <span>ASCEND AI</span>
    <div className="online-dot"></div>
  </div>

  <h3>
    Weekly Insight
  </h3>

  <p>
    Strength is increasing faster than bodyweight.
    Keep calories the same and add one rep to your
    final incline press set next session.
  </p>

</div>

            </div>

          </div>

        </div>

      </section>

        <div className="hero-comparison">

  <div className="comparison-header">
    Why people switch to ASCEND
  </div>

  <div className="comparison-grid">

    <div className="comparison-top"></div>
    <div className="comparison-top">ASCEND</div>
    <div className="comparison-top">Apps</div>
    <div className="comparison-top">Coach</div>
    <div className="comparison-top">Influencer</div>

    <div>Programs</div>
    <div>✅</div>
    <div>⚠️</div>
    <div>✅</div>
    <div>✅</div>

    <div>Progressive Overload</div>
    <div>✅</div>
    <div>⚠️</div>
    <div>✅</div>
    <div>❌</div>

    <div>Weekly Reviews</div>
    <div>✅</div>
    <div>❌</div>
    <div>✅</div>
    <div>❌</div>

    <div>Calorie Tracking</div>
    <div>✅</div>
    <div>⚠️</div>
    <div>❌</div>
    <div>❌</div>

    <div>AI Coach</div>
    <div>✅</div>
    <div>❌</div>
    <div>❌</div>
    <div>❌</div>

    <div>24/7 Available</div>
    <div>✅</div>
    <div>✅</div>
    <div>❌</div>
    <div>❌</div>

    <div>Recovery Tracking</div>
<div>✅</div>
<div>❌</div>
<div>⚠️</div>
<div>❌</div>

<div>Weight Tracking</div>
<div>✅</div>
<div>⚠️</div>
<div>⚠️</div>
<div>❌</div>

    <div>Price</div>
    <div>$9.99</div>
    <div>$10-30</div>
    <div>$100+</div>
    <div>$50+</div>

  </div>

</div>

      {/* PROBLEM */}
      <section className="problem-section">

        <div className="problem-text">

          <span className="section-tag">
            WHY MOST PEOPLE FAIL
          </span>

          <h2>
            Motivation Was Never The Problem.
          </h2>

          <p>
            Most people quit because they never had a real system.
            They guess workouts, switch programs constantly,
            lose consistency, and stop seeing progress.
          </p>

          <p>
            ASCEND fixes that with adaptive AI programming,
            progression tracking, recovery intelligence,
            and structured workouts built around your goals.
          </p>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features">

        <div className="section-header">
          <span>FEATURES</span>
          <h2>Built Like A Real Fitness System</h2>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <h3>AI Workout Engine</h3>
            <p>
              Personalized workouts that evolve
              with your progress and recovery.
            </p>
          </div>

          <div className="feature-card">
            <h3>Weekly Reviews</h3>
<p>
ASCEND analyzes your progress every week
and adjusts your direction based on results.
</p>
          </div>

          <div className="feature-card">
           <h3>Weekly Reviews</h3>
<p>
ASCEND analyzes your progress every week
and adjusts your direction based on results.
</p>
          </div>

          <div className="feature-card">
            <h3>Recovery Tracking</h3>
            <p>
              Intelligent fatigue monitoring
              and smarter progression recommendations.
            </p>
          </div>

          <div className="feature-card">
           <h3>AI Nutrition Tracking</h3>
<p>
Track calories, protein, carbs and fats
without manually calculating everything.
</p>
          </div>

          <div className="feature-card">
            <h3>Adaptive Split Logic</h3>
            <p>
              Your training structure changes
              based on your actual lifestyle.
            </p>
          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="pricing">

        <div className="section-header">
          <span>PLANS</span>
          <h2>Choose Your Level</h2>
        </div>

        <div className="pricing-grid">

          {/* FREE */}
          <div className="price-card">

            <h3>Free</h3>

            <p className="price">
              $0
            </p>

            <ul>
              <li>Workout Tracking</li>
              <li>Exercise Library</li>
              <li>Offline Workouts</li>
              <li>PR Tracking</li>
              <li>Workout History</li>
            </ul>

            <button
              onClick={() => navigate("/auth")}
            >
              Start Free
            </button>

          </div>

          {/* PREMIUM */}
          <div className="price-card premium">

            <div className="premium-badge">
              MOST POPULAR
            </div>

            <h3>Premium</h3>

            <p className="price">
              $9.99/mo
            </p>

            <ul>
              
              <li> Premium Programs</li>
              <li>Unlimited AI Coach</li>
              <li>Build Muscle Faster</li>
              <li>Lose Fat Faster</li>
              <li>Track Your Progress</li>
              <li>Weekly Progressions</li>
              <li>Early Access Features</li>
              <li>Nutrition Tracking</li>
              <li>Recovery Tracking</li>
              <li>Future Programs Included</li> 
            </ul>

            <button
              onClick={() => navigate("/auth")}
            >
              Upgrade
            </button>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta">

        <h2>
          Your Future Physique
          Is Built One Session At A Time.
        </h2>

        <p>
          Stop guessing. Start training with structure.
        </p>

        <button
          onClick={() => navigate("/auth")}
        >
          Begin Your Transformation
        </button>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-logo">
          ASCEND
        </div>

        <p>
          AI-powered fitness built for real transformation.
        </p>

        <div className="footer-links">
          <button onClick={() => navigate("/privacy")}>Privacy Policy</button>
          <button onClick={() => navigate("/terms")}>Terms of Use</button>
          <button onClick={() => navigate("/cookies")}>Cookie Policy</button>
        </div>
        
        <h2>colossians 3:23</h2>
      </footer>

    </div>
  );
}

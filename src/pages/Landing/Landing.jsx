import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import Navbar from "../../components/ui/Navbar";

export default function LandingPage() {

  const navigate = useNavigate();


  return (
    <div className="landing">

    <Navbar/>

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">

          <div className="hero-badge">
            AI-Powered Fitness Operating System
          </div>

          <h1>
            Train Like Someone Who Refuses To Stay Average.
          </h1>

          <p>
            Adaptive workouts, AI coaching, progression tracking,
            recovery intelligence, and a system built for people
            chasing real transformation.
          </p>

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

    <div>Price</div>
    <div>$9.99</div>
    <div>$10-30</div>
    <div>$100+</div>
    <div>$50+</div>

  </div>

</div>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/auth")}
            >
              Start Free
            </button>

            

          </div>

          <div className="hero-stats">

            <div className="stat">
              <h2>AI</h2>
              <span>Workout and Nutrition Guidance</span>
            </div>

            <div className="stat">
              <h2>Programs</h2>
              <span>Built fr results</span>
            </div>

            <div className="stat">
              <h2>24/7</h2>
              <span>Coaching Access</span>
            </div>

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
                <h3>AI Coach</h3>

                <p>
                  “Push your final set harder today.
                  Last session moved too easily.”
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

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
            <h3>Offline Training</h3>
            <p>
              Download workouts and train
              without worrying about bad network.
            </p>
          </div>

          <div className="feature-card">
            <h3>Exercise Library</h3>
            <p>
              Massive searchable database
              with visuals and execution guides.
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
            <h3>PR Analytics</h3>
            <p>
              Track your lifts, progression,
              trends, and personal records.
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
              <li>AI Calorie Tracker (Soon)</li>
              <li>Sleep Tracker (Soon)</li>
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
        
        <h2>colossians 3:23</h2>
      </footer>

    </div>
  );
}
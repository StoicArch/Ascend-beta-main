import React from "react";
import "./Legal.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-content">

        <div className="legal-hero">
          <div className="legal-badge">
            PRIVACY POLICY
          </div>

          <h1>Your Privacy Matters</h1>

          <p>
            ASCEND is committed to protecting your privacy
            and being transparent about how your information
            is collected, stored and used.
          </p>
        </div>

        <div className="legal-section">
          <h2>Information We Collect</h2>

          <ul>
            <li>Name and account information.</li>
            <li>Email address.</li>
            <li>Workout history and exercise performance.</li>
            <li>Nutrition logs and meal tracking data.</li>
            <li>Bodyweight and progress tracking information.</li>
            <li>Recovery and training metrics.</li>
            <li>Premium membership information.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>How We Use Your Information</h2>

          <p>
            ASCEND uses your information to generate workouts,
            provide fitness recommendations, track progress,
            improve recovery guidance and personalize your
            overall training experience.
          </p>

          <p>
            We may also use information to improve platform
            performance, develop new features and provide
            customer support.
          </p>
        </div>

        <div className="legal-section">
          <h2>Data Storage</h2>

          <p>
            ASCEND stores certain information locally on your
            device and may also store account information on
            secure backend infrastructure.
          </p>

          <p>
            While reasonable measures are taken to protect
            information, no internet-based service can
            guarantee absolute security.
          </p>
        </div>

        <div className="legal-section">
          <h2>Third-Party Services</h2>

          <p>
            ASCEND may use trusted third-party services to
            operate the platform.
          </p>

          <ul>
            <li>MongoDB for database services.</li>
            <li>Render for hosting and backend infrastructure.</li>
            <li>Gumroad for payment processing.</li>
            <li>Future analytics and infrastructure providers.</li>
          </ul>

          <p>
            These providers may process data in accordance
            with their own privacy policies.
          </p>
        </div>

        <div className="legal-section">
          <h2>AI Features</h2>

          <p>
            AI-powered features such as coaching,
            nutrition analysis and food scanning may
            process information submitted by users
            in order to generate recommendations.
          </p>

          <p>
            Users should independently verify important
            nutrition and health information before
            relying on AI-generated outputs.
          </p>
        </div>

        <div className="legal-section">
          <h2>Your Rights</h2>

          <p>
            You may request deletion of your account
            and associated information where applicable.
          </p>

          <p>
            You may also clear locally stored ASCEND
            data through your browser settings.
          </p>
        </div>

        <div className="legal-section">
          <h2>Children's Privacy</h2>

          <p>
            ASCEND is not intended for children under
            the age of 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </div>

        <div className="legal-section">
          <h2>Policy Updates</h2>

          <p>
            ASCEND may update this Privacy Policy
            periodically. Continued use of the platform
            after updates constitutes acceptance of the
            revised policy.
          </p>
        </div>

        <div className="legal-section">
          <h2>Contact</h2>

          <p>
            Questions regarding this Privacy Policy
            may be sent to:
          </p>

          <p>
            posiofficial@gmail.com
          </p>
        </div>

        <div className="legal-footer">
          Last Updated: June 2026
        </div>

      </div>
    </div>
  );
}
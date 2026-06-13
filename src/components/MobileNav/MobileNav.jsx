import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MobileNav.css";

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const hiddenRoutes = ["/", "/auth", "/onboarding"];

if (hiddenRoutes.includes(location.pathname)) {
  return null;

}

 return (
  <nav className="mobile-nav">
    <button
      onClick={() => navigate("/dashboard")}
      className={isActive("/dashboard") ? "mobile-active" : ""}
    >
      <span>🏠</span>
      Home
    </button>

    <button
      onClick={() => navigate("/programs")}
      className={isActive("/programs") ? "mobile-active" : ""}
    >
      <span>📅</span>
      Programs
    </button>

    <button
      className="center-button"
      onClick={() => navigate("/workout")}
    >
      <span>＋</span>
    </button>

    <button
      onClick={() => navigate("/weekly-review")}
      className={isActive("/weekly-review") ? "mobile-active" : ""}
    >
      <span>�</span>
      Weekly Review
    </button>

    <button
      onClick={() => navigate("/ai-coach")}
      className={isActive("/ai-coach") ? "mobile-active" : ""}
    >
      <span>🤖</span>
      AI
    </button>
  </nav>
);
}
import React from "react";
import { Navigate } from "react-router-dom";
import PremiumEngine from "../../engine/PremiumEngine";

export default function ProtectedRoute({
  children,
  requireOnboarding = true,
  requirePremium = false,
}) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const onboardingCompleted = localStorage.getItem("onboardingCompleted");

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireOnboarding && onboardingCompleted !== "true") {
    return <Navigate to="/onboarding" replace />;
  }

  if (requirePremium && !PremiumEngine.isPremium()) {
    return <Navigate to="/premium" replace />;
  }

  return children;
}
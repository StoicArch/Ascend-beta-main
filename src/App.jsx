import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import MobileNav from "./components/MobileNav/MobileNav";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import LandingPage from "./pages/Landing/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";
import Workout from "./pages/Workout/Workout";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import Library from "./pages/Library/Library";
import Setting from "./pages/Settings/Setting";
import ActiveWorkout from "./pages/Workout/ActiveWorkout";
import AICoach from "./pages/AICoach/AICoach";
import Program from "./pages/Program/Program";
import Programs from "./pages/Programs/Programs";
import ProgramSetup from "./pages/ProgramSetup/ProgramSetup";
import WeightTracker from "./pages/WeightTracker/WeightTracker";
import Premium from "./pages/Premium/Premium/Premium";
import Support from "./pages/Support/Support";
import WeeklyReview from "./pages/WeeklyReview/WeeklyReview";
import ProfileMigrationEngine from "./engine/ProfileMigrationEngine";
import FoodScanTest from "./pages/FoodScanTest/FoodScanTest";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfUse from "./pages/Legal/TermsOfUse";
import CookiePolicy from "./pages/Legal/CookiePolicy";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import TermsPopup from "./components/TermsPopup";

export default function App() {
  useEffect(() => {
    ProfileMigrationEngine.migrate();
  }, []);

  useEffect(() => {
    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key.toLowerCase() === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener(
      "contextmenu",
      disableContextMenu
    );

    document.addEventListener(
      "keydown",
      disableKeys
    );

    return () => {
      document.removeEventListener(
        "contextmenu",
        disableContextMenu
      );

      document.removeEventListener(
        "keydown",
        disableKeys
      );
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/active-workout"
          element={
            <ProtectedRoute>
              <ActiveWorkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-coach"
          element={
            <ProtectedRoute>
              <AICoach />
            </ProtectedRoute>
          }
        />

        <Route
          path="/program"
          element={
            <ProtectedRoute>
              <Program />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programs"
          element={
            <ProtectedRoute>
              <Programs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weekly-review"
          element={
            <ProtectedRoute>
              <WeeklyReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/program-setup/:id"
          element={
            <ProtectedRoute>
              <ProgramSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weight"
          element={
            <ProtectedRoute>
              <WeightTracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/premium"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <Premium />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={<Support />}
        />

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<TermsOfUse />}
        />

        <Route
          path="/cookies"
          element={<CookiePolicy />}
        />

        <Route
          path="/food-scan-test"
          element={<FoodScanTest />}
        />

        <Route
          path="*"
          element={<LandingPage />}
        />
      </Routes>

      <MobileNav />
      <TermsPopup/>
      <PWAInstallPrompt />
    </AuthProvider>
  );
}

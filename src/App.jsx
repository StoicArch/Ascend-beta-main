import React from "react";
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

export default function App() {
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

        <Route path="/support" element={<Support />} />

        <Route path="*" element={<LandingPage />} />
      </Routes>

      <MobileNav />
    </AuthProvider>
  );
}
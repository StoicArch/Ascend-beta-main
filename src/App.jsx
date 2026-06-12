import React from "react";
import { Routes, Route } from "react-router-dom";


import { AuthProvider } from "./context/AuthContext";

import MobileNav from "./components/MobileNav/MobileNav";
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
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/active-workout" element={<ActiveWorkout />} />
        <Route path="/ai-coach" element={<AICoach />} />

        <Route path="/program" element={<Program />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/program-setup/:id" element={<ProgramSetup />} />

        <Route path="/weight" element={<WeightTracker />} />

        <Route path="/premium" element={<Premium />} />
<Route path="/support" element={<Support />} />
      </Routes>

      <MobileNav />
    </AuthProvider>
  );
}
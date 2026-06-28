import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../../firebase";


export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem("token");
  const onboardingCompleted = localStorage.getItem("onboardingCompleted");

  const pendingProgram =
    localStorage.getItem("pendingProgram");

  if (token) {

    if (pendingProgram) {

      if (onboardingCompleted === "true") {
        navigate(
          `/program-setup/${pendingProgram}`,
          { replace: true }
        );
      } else {
        navigate("/onboarding", {
          replace: true,
        });
      }

      return;
    }

    if (onboardingCompleted === "true") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }
}, [navigate]);

const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const firebaseUser = result.user;

    const idToken =
      await firebaseUser.getIdToken();

    const response = await fetch(
      "https://ascend-backend-v27s.onrender.com/users/google-login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          idToken,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Google login failed"
      );
    }

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "lastLogin",
      String(Date.now())
    );

    const redirectProgram =
      localStorage.getItem(
        "pendingProgram"
      );

    if (redirectProgram) {
      navigate(
        `/program-setup/${redirectProgram}`,
        {
          replace: true,
        }
      );
    } else {
      navigate("/dashboard", {
        replace: true,
      });
    }
  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "signup"
          ? "https://ascend-backend-v27s.onrender.com/users/signup"
          : "https://ascend-backend-v27s.onrender.com/users/login";

      const body =
        mode === "signup" ? { name, email, password } : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("lastLogin", String(Date.now()));

     const redirectProgram =
  localStorage.getItem("pendingProgram");

if (mode === "signup") {
  navigate("/onboarding", { replace: true });
} else {
  if (redirectProgram) {
    navigate(`/program-setup/${redirectProgram}`, {
      replace: true,
    });
  } else {
    navigate("/dashboard", {
      replace: true,
    });
  }
}


    } catch (err) {
      setError("Could not connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {mode === "login" ? "Welcome Back" : "Create Your Body System"}
        </h1>

        <p className="auth-subtitle">ASCEND — AI fitness that adapts to you</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Start Free Journey"}
          </button>
          <button
  type="button"
  className="google-btn"
  onClick={handleGoogleLogin}
  disabled={loading}
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
  />
  Continue with Google
</button>
        </form>

        <p
          className="auth-switch"
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "signup" : "login");
          }}
        >
          {mode === "login"
            ? "No account? Create one"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
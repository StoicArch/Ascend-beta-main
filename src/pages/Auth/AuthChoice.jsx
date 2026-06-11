import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#000",
      color: "#fff",
      textAlign: "center",
      gap: "20px"
    }}>

      <h1>Choose Your Path</h1>

      <button onClick={() => navigate("/auth/signup?plan=free")}>
        Start Free
      </button>

      <button onClick={() => navigate("/auth/signup?plan=premium")}>
        Go Premium
      </button>

      <button onClick={() => navigate("/dashboard")}>
        Continue Demo
      </button>

    </div>
  );
}
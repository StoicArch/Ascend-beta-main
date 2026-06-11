import React from "react";
// import heroPlaceholder from "../images/hero-placeholder.jpg"; // replace later with your cinematic video/image

export default function HeroSection() {
  return (
    <div style={styles.container}>
      
      <div style={styles.textOverlay}>
        <h1 style={styles.title}>GET A PUMP</h1>
        <p style={styles.subtitle}>Discipline. Strength. Progress.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "80vh",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    textAlign: "center",
    textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
  },
  title: {
    fontSize: "3rem",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.2rem",
    marginTop: "10px",
  },
};
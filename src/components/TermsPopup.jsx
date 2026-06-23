import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TermsPopup() {
  const [accepted, setAccepted] = useState(
    localStorage.getItem(
      "ascendTermsAccepted"
    ) === "true"
  );
  const navigate = useNavigate();
  const location = useLocation();

  if (
  location.pathname === "/terms" ||
  location.pathname === "/privacy" ||
  location.pathname === "/cookies"
) {
  return null;
}

  if (accepted) return null;

  const acceptTerms = () => {
    localStorage.setItem(
      "ascendTermsAccepted",
      "true"
    );

    setAccepted(true);
  };

  

 return (
  <div className="terms-overlay">
    <div className="terms-modal">

      <h2>Welcome to ASCEND</h2>

      <p>
        Before using ASCEND you must agree
        to our Terms of Use, Privacy Policy
        and Cookie Policy.
      </p>

     <div className="terms-links">

  <button
    type="button"
    onClick={() => navigate("/terms")}
  >
    Terms of Use
  </button>

  <button
    type="button"
    onClick={() => navigate("/privacy")}
  >
    Privacy Policy
  </button>

  <button
    type="button"
    onClick={() => navigate("/cookies")}
  >
    Cookie Policy
  </button>

</div>
      <button
        className="terms-accept-btn"
        onClick={acceptTerms}
      >
        I Agree
      </button>

    </div>
  </div>
);
}
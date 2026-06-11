import React from "react";
import "./Premium.css";
import PaystackPop from "@paystack/inline-js";
import PremiumEngine from "../../../engine/PremiumEngine";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  const navigate = useNavigate();

  const pay = () => {
    const popup = new PaystackPop();

    popup.newTransaction({
      key: "YOUR_PAYSTACK_PUBLIC_KEY",
      email: "testuser@email.com",
      amount: 3700 * 100,
      currency: "NGN",

      onSuccess: () => {
        PremiumEngine.unlockPremium();
        alert("Premium unlocked!");
        navigate("/programs");
      },

      onCancel: () => {
        alert("Payment cancelled.");
      },
    });
  };

  return (
    <div className="premium-page app-page">
      <h1>ASCEND Premium</h1>
      <p>Unlock premium programs, advanced progression, and future AI tools.</p>

      <div className="premium-card">
        <h2>9.99$/13,600</h2>
        <p>Early access premium membership.</p>

        <button onClick={pay}>Unlock Premium</button>
      </div>
    </div>
  );
}
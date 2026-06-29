import React, { useState } from "react";
import "./AICoach.css";
import UserProfileEngine from "../../engine/UserProfileEngine";
import DashboardEngine from "../../engine/DashboardEngine";
import WorkoutEngine from "../../engine/WorkoutEngine";
import AIUsageEngine from "../../engine/AIUsageEngine";
import PremiumEngine from "../../engine/PremiumEngine";

export default function AICoach() {
  const savedChat = JSON.parse(localStorage.getItem("ai-chat")) || [];

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(savedChat);
  const [loading, setLoading] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(
    AIUsageEngine.getRemainingMessages()
  );

  const isPremium = PremiumEngine.isPremium();

  const saveChat = (updatedChat) => {
    setChat(updatedChat);
    localStorage.setItem("ai-chat", JSON.stringify(updatedChat));
  };

  const askAI = async () => {
    if (!message.trim() || loading) return;

    if (!AIUsageEngine.canSendMessage()) {
      const limitMessage = {
        role: "ai",
        text:
          "You've used your 10 free AI messages for today. Upgrade to Premium for unlimited AI coaching.",
      };

      saveChat([...chat, limitMessage]);
      setRemainingMessages(AIUsageEngine.getRemainingMessages());
      return;
    }

    const userText = message;

    const userMessage = {
      role: "user",
      text: userText,
    };

    const updatedChat = [...chat, userMessage];

    saveChat(updatedChat);
    setMessage("");
    setLoading(true);

    const profile = UserProfileEngine.getProfile();
    const recoveryScore = DashboardEngine.getRecoveryScore();
    const todayWorkout = WorkoutEngine.getOrCreateTodayWorkout();

    const aiProfile = {
      ...profile,
      recoveryScore,
      todayWorkout,
      programId: profile.programId,
      currentProgram: profile.program,
      nutritionPhase: profile.nutritionPhase,
      nutritionNote: profile.nutritionNote,
      weeklyReview: profile.weeklyReview,
    };

    try {
      const response = await fetch(
        "https://ascend-backend-v27s.onrender.com/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userText,
            profile: aiProfile,
            history: updatedChat.slice(-8),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      AIUsageEngine.recordMessage();
      setRemainingMessages(AIUsageEngine.getRemainingMessages());

      const aiMessage = {
        role: "ai",
        text: data.reply || "No response received.",
      };

      saveChat([...updatedChat, aiMessage]);
    } catch (err) {
      console.log(err);

      const errorMessage = {
        role: "ai",
        text: "Failed to reach AI.",
      };

      saveChat([...updatedChat, errorMessage]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    localStorage.removeItem("ai-chat");
    setChat([]);
  };

  return (
    <div className="ai-page app-page">
      <div className="ai-header">
        <div>
          <span className="ai-tag">
ASCEND AI
</span>

<h1>
Your personal
fitness coach.
</h1>

<p>
Ask about workouts, nutrition, recovery,
sleep, injuries or your current program.
</p>

<div className="ai-plan">

<span>
{isPremium
? "Unlimited AI"
: `${remainingMessages} free messages today`}
</span>

</div>
        </div>

        {chat.length > 0 && (
          <button
  className="clear-chat-btn"
  onClick={clearChat}
>
  New Chat
</button>
        )}
      </div>

      <div className="chat-window">

<div className="chat-date">
Today
</div>
        {chat.length === 0 && (
         <div className="empty-chat">

  <h2>How can ASCEND help today?</h2>

  <p>
    Your AI coach has access to your workouts,
    recovery, nutrition and progress.
  </p>

  <div className="suggestion-grid">

    <button
      onClick={() =>
        setMessage("Review today's workout.")
      }
    >
      Review today's workout
    </button>

    <button
      onClick={() =>
        setMessage("How can I recover faster?")
      }
    >
      Improve recovery
    </button>

    <button
      onClick={() =>
        setMessage("Review my nutrition.")
      }
    >
      Review my nutrition
    </button>

    <button
      onClick={() =>
        setMessage("How do I build muscle faster?")
      }
    >
      Build muscle faster
    </button>

  </div>

</div>
        )}

       {chat.map((item, index) => (

  <div
    key={index}
    className={
      item.role === "user"
        ? "chat-row user-row"
        : "chat-row ai-row"
    }
  >

    {item.role === "ai" && (
      <div className="chat-avatar">
        AI
      </div>
    )}

    <div
      className={
        item.role === "user"
          ? "chat-bubble user-bubble"
          : "chat-bubble ai-bubble"
      }
    >
      {item.text}
    </div>

  </div>

))}

       {loading && (
  <div className="chat-row ai-row">

    <div className="chat-avatar">
      AI
    </div>

    <div className="chat-bubble ai-bubble thinking-bubble">

      <span></span>
      <span></span>
      <span></span>

    </div>

  </div>
)}
      </div>

      <div className="chat-input-box">

  <div className="input-top">
    ASCEND AI
  </div>
       <textarea
  rows={1}
          placeholder={
  isPremium
    ? "Ask anything about your training..."
    : `Ask anything... (${remainingMessages} free left today)`
}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askAI();
            }
          }}
        />

       <button
  className="send-btn"
  onClick={askAI}
  disabled={loading || !message.trim()}
>
  ↑
</button>
      </div>
    </div>
  );
}
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
          <h1>AI Coach</h1>
          <p>Ask about training, recovery, sleep, or nutrition.</p>

          <p className="ai-limit-text">
            {isPremium
              ? "Premium: Unlimited AI messages"
              : `${remainingMessages} free AI messages left today`}
          </p>
        </div>

        {chat.length > 0 && (
          <button className="clear-chat-btn" onClick={clearChat}>
            Clear Chat
          </button>
        )}
      </div>

      <div className="chat-window">
        {chat.length === 0 && (
          <div className="empty-chat">
            <h2>Start a conversation</h2>
            <p>
              Ask Ascend how to train today, improve recovery, or adjust your
              nutrition.
            </p>
          </div>
        )}

        {chat.map((item, index) => (
          <div
            key={index}
            className={
              item.role === "user" ? "chat-row user-row" : "chat-row ai-row"
            }
          >
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
            <div className="chat-bubble ai-bubble">Thinking...</div>
          </div>
        )}
      </div>

      <div className="chat-input-box">
        <textarea
          placeholder={
            isPremium
              ? "Message your AI coach..."
              : `${remainingMessages} messages left today...`
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

        <button onClick={askAI} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
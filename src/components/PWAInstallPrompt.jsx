import React, { useEffect, useState } from "react";

const REMIND_AFTER_DAYS = 3;

export default function PWAInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handlePrompt = (event) => {
      event.preventDefault();

      const dismissedUntil = Number(
        localStorage.getItem("ascendInstallDismissedUntil") || 0
      );

      const shouldShow = Date.now() > dismissedUntil;

      setPromptEvent(event);
      setHidden(!shouldShow);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handlePrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handlePrompt
      );
    };
  }, []);

  const installApp = async () => {
    if (!promptEvent) return;

    promptEvent.prompt();

    const result = await promptEvent.userChoice;

    if (result.outcome === "accepted") {
      localStorage.setItem(
        "ascendInstalled",
        "true"
      );
    }

    setHidden(true);
  };

  const remindLater = () => {
    const nextReminder =
      Date.now() +
      REMIND_AFTER_DAYS *
        24 *
        60 *
        60 *
        1000;

    localStorage.setItem(
      "ascendInstallDismissedUntil",
      String(nextReminder)
    );

    setHidden(true);
  };

  if (
    !promptEvent ||
    hidden ||
    localStorage.getItem("ascendInstalled") === "true"
  ) {
    return null;
  }

  return (
  <div className="pwa-overlay">
    <div className="pwa-modal">

      <h2>Install ASCEND</h2>

      <p>
        Users who install ASCEND complete more workouts,
        log more meals, and stay more consistent.
      </p>

      <p>
        Install ASCEND for faster loading,
        offline workouts, and a real app experience.
      </p>

      <button
        className="pwa-install-btn"
        onClick={installApp}
      >
        Install ASCEND
      </button>

      <button
        className="pwa-secondary-btn"
        onClick={() => {
          localStorage.setItem(
            "ascendInstalled",
            "true"
          );

          setHidden(true);
        }}
      >
        I've Already Installed It
      </button>

      <button
        className="pwa-later-btn"
        onClick={remindLater}
      >
        Continue In Browser
      </button>

    </div>
  </div>
);
}
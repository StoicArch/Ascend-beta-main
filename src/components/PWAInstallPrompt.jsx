import React, { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [dismissed, setDismissed] = useState(
    localStorage.getItem("ascendInstallDismissed") === "true"
  );

  useEffect(() => {
    const handlePrompt = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  if (!promptEvent || dismissed) return null;

  return (
    <div className="pwa-install-prompt">
      <div>
        <strong>Install ASCEND</strong>
        <p>Use ASCEND faster with offline access.</p>
      </div>
      <button onClick={() => promptEvent.prompt()}>Install</button>
      <button
        onClick={() => {
          localStorage.setItem("ascendInstallDismissed", "true");
          setDismissed(true);
        }}
      >
        Later
      </button>
    </div>
  );
}

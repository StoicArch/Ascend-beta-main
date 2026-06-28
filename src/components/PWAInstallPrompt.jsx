import { useEffect } from "react";

export default function PWAInstallPrompt() {
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();

      window.deferredInstallPrompt = e;

      window.dispatchEvent(
        new Event("ascend-install-ready")
      );
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    window.addEventListener(
      "appinstalled",
      () => {
        localStorage.setItem(
          "ascendInstalled",
          "true"
        );

        window.dispatchEvent(
          new Event("ascend-installed")
        );

        window.deferredInstallPrompt = null;
      }
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
  }, []);

  return null;
}
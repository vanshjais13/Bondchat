import { useEffect } from "react";
import toast from "react-hot-toast";

const useScreenProtection = () => {
  useEffect(() => {
    const chat = document.getElementById("chat-container");

    if (!chat) return;

    const applyProtection = () => {
      chat.style.filter = "blur(20px)";
      chat.style.opacity = "0.1";
    };

    const removeProtection = () => {
      chat.style.filter = "blur(3px)";
      chat.style.opacity = "1";
    };

    const handleVisibility = () => {
      if (document.hidden) applyProtection();
      else removeProtection();
    };

    const handleBlur = () => applyProtection();
    const handleFocus = () => removeProtection();

    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen") {
        applyProtection();
        toast.error("Screenshot not allowed 🚫");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
const handleKeyDown = (e) => {
  if (e.key === "PrintScreen") {
    const chat = document.getElementById("chat-container");

    if (chat) {
      chat.style.filter = "blur(25px)";
    }

    toast.error("Screenshot blocked 🚫");

    setTimeout(() => {
      if (chat) chat.style.filter = "blur(4px)";
    }, 4000);
  }
};

export default useScreenProtection;
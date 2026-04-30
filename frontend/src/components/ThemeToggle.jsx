import React from "react";

const ThemeToggle = () => {
  // DaisyUI theme toggle using data-theme attribute
  const handleToggle = () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") || "light";
    html.setAttribute(
      "data-theme",
      current === "light" ? "dark" : "light"
    );
  };
  return (
    <button
      className="btn btn-sm btn-circle btn-ghost border border-base-300 hover:bg-base-200 transition-all"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  );
};

export default ThemeToggle;

import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
import { useState } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const FONT_FAMILIES = [
  { label: "Default", value: "inherit" },
  { label: "Sans", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "monospace" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState("Medium");
  const [fontFamily, setFontFamily] = useState("inherit");
  const [bubbleStyle, setBubbleStyle] = useState("rounded");

  // Font size mapping
  const fontSizeClass = fontSize === "Small" ? "text-sm" : fontSize === "Large" ? "text-lg" : "text-base";
  const fontFamilyStyle = { fontFamily };
  const bubbleClass = bubbleStyle === "rounded" ? "rounded-xl" : "rounded-none";

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-base-200 dark:bg-base-100 overflow-auto pt-16">
      <div className="flex flex-col justify-center items-center p-2 sm:p-6 md:p-10 w-full max-w-screen-lg">
  <div className="w-full bg-white dark:bg-base-200 rounded-3xl shadow-2xl p-2 sm:p-6 md:p-10 space-y-8 border border-base-300 max-w-full animate-fade-in-up">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary">Settings</h2>
            <p className="text-base-content text-base mt-2">Personalize your chat experience</p>
          </div>

          <div className="space-y-8">
            {/* Theme Option */}
            <div>
              <div className="flex flex-col gap-1 mb-2">
                <h3 className="text-lg font-semibold text-base-content">Theme</h3>
                <p className="text-sm text-base-content">Choose a theme for your chat interface</p>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    className={`
                      group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                      ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
                    `}
                    onClick={() => setTheme(t)}
                    title={`Switch to ${t} theme`}
                  >
                    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium truncate w-full text-center">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>


            {/* Notification Option */}
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-semibold text-base-content">Notifications</h3>
              <p className="text-sm text-base-content">Enable or disable chat notifications</p>
              <div className="flex items-center gap-3 mt-2">
                <input
                  id="notifications"
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={notifications}
                  onChange={() => setNotifications((n) => !n)}
                />
                <label htmlFor="notifications" className="label-text">Enable notifications</label>
              </div>
            </div>


            {/* Font Size Option */}
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-semibold text-base-content">Font Size</h3>
              <p className="text-sm text-base-content">Adjust the font size for chat messages</p>
              <select
                className="select select-bordered w-40 mt-2"
                value={fontSize}
                onChange={e => setFontSize(e.target.value)}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            {/* Font Family Option */}
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-semibold text-base-content">Font Family</h3>
              <p className="text-sm text-base-content">Choose a font for chat messages</p>
              <select
                className="select select-bordered w-52 mt-2"
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
              >
                {FONT_FAMILIES.map(f => (
                  <option key={f.value} value={f.value} title={`Use ${f.label} font`}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Chat Bubble Style Option */}
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-semibold text-base-content">Chat Bubble Style</h3>
              <p className="text-sm text-base-content">Choose your preferred chat bubble appearance</p>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bubbleStyle"
                    className="radio radio-primary"
                    value="rounded"
                    checked={bubbleStyle === "rounded"}
                    onChange={() => setBubbleStyle("rounded")}
                  />
                  <span className="label-text">Rounded</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bubbleStyle"
                    className="radio radio-primary"
                    value="sharp"
                    checked={bubbleStyle === "sharp"}
                    onChange={() => setBubbleStyle("sharp")}
                  />
                  <span className="label-text">Sharp</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="rounded-xl border border-base-300 overflow-x-auto bg-base-100 shadow-lg animate-fade-in-up">
              <div className="p-2 sm:p-4 bg-base-200">
                <div className="w-full max-w-lg mx-auto">
                  {/* Mock Chat UI */}
                  <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden" style={fontFamilyStyle}>
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                          J
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">John Doe</h3>
                          <p className="text-xs text-base-content/70">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className={`p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100 ${fontSizeClass}`}>
                      {PREVIEW_MESSAGES.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 shadow-sm ${bubbleClass} ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-[10px] mt-1.5 ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}`}
                            >
                              12:00 PM
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-base-300 bg-base-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className={`input input-bordered flex-1 h-10 ${fontSizeClass}`}
                          style={fontFamilyStyle}
                          placeholder="Type a message..."
                          value="This is a preview"
                          readOnly
                        />
                        <button className="btn btn-primary h-10 min-h-0">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;

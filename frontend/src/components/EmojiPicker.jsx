import React from "react";

const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = ["👍", "😂", "❤️",  "😢",  "🔥"];
  return (
  <div className="absolute z-30 bottom-full mb-3 left-1/2 -translate-x-1/2 bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-3 flex gap-2 animate-fade-in-up min-w-[220px] max-w-xs">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl sm:text-3xl hover:bg-base-200 rounded-full p-2 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
          onClick={() => { onSelect(emoji); onClose(); }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;

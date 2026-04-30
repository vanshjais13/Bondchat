import React from "react";

const MessageReactions = ({ onReact, reactions }) => {
  // reactions: { emoji: string, count: number, reacted: boolean }[]
  return (
    <div className="flex gap-2 mt-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          className={`px-2 py-1 rounded-full text-xl sm:text-2xl hover:bg-base-200/80 transition border border-base-300 flex items-center gap-1 ${r.reacted ? 'bg-primary/20' : ''}`}
          onClick={() => onReact(r.emoji)}
          aria-label={`React with ${r.emoji}`}
        >
          <span>{r.emoji}</span>
          {r.count > 0 && <span className="text-xs font-semibold">{r.count}</span>}
        </button>
      ))}
    </div>
  );
};

export default MessageReactions;

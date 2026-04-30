const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  // Vary bubble widths and heights for realism
  const bubbleWidths = ["w-40", "w-56", "w-32", "w-48", "w-36", "w-60"];
  const bubbleHeights = ["h-4", "h-5", "h-6"];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          {/* Avatar */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full bg-base-200 relative overflow-hidden shadow-md">
              <div className="skeleton w-full h-full rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>

          {/* User name */}
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-20 max-w-[6rem] rounded bg-base-300/50" />
          </div>

          {/* Chat bubble */}
          <div
            className={`chat-bubble bg-base-200/70 p-3 ${
              idx % 2 === 0 ? "rounded-br-2xl" : "rounded-bl-2xl"
            } rounded-2xl shadow-lg relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
            {/* Lines: 1-3 lines per bubble */}
            {Array.from({ length: (idx % 3) + 1 }, (_, lineIdx) => (
              <div
                key={lineIdx}
                className={`skeleton ${
                  bubbleHeights[(idx + lineIdx) % bubbleHeights.length]
                } ${bubbleWidths[(idx + lineIdx) % bubbleWidths.length]} mb-2 rounded bg-base-300/60`}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Typing indicator */}
      <div className="chat chat-start animate-pulse">
        <div className="chat-image avatar">
          <div className="size-10 rounded-full bg-base-200 shadow-md">
            <div className="skeleton w-full h-full rounded-full" />
          </div>
        </div>
        <div className="chat-bubble bg-base-200/70 p-3 rounded-2xl shadow-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-base-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-base-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-base-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;

import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import useScreenProtection from "../hooks/useScreenProtection";
import useCall from "../hooks/useCall";
import CallScreen from "./CallScreen";
import IncomingCall from "./IncomingCall";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageReactions from "./MessageReactions";
import EmojiPicker from "./EmojiPicker";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, getProfilePicUrl } from "../lib/utils";

const ChatContainer = () => {
  useScreenProtection();

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  // 🔥 CALL HOOK
const { 
  startCall, 
  isCalling, 
  incomingCall,
  acceptCall,
  rejectCall,
  localStreamRef, 
  remoteStreamRef, 
  endCall,
  callType , 
  callStatus,        // ✅ ADD THIS
  callStartTime 
} = useCall();
  const [reactions, setReactions] = useState({});
  const [pickerMsgId, setPickerMsgId] = useState(null);

  const messageEndRef = useRef(null);

  const handleReact = (msgId, emoji) => {
    setReactions((prev) => {
      const prevMsg = prev[msgId] || {};
      const count = prevMsg[emoji]?.count || 0;
      const reacted = prevMsg[emoji]?.reacted || false;

      return {
        ...prev,
        [msgId]: {
          ...prevMsg,
          [emoji]: {
            count: reacted ? count - 1 : count + 1,
            reacted: !reacted,
          },
        },
      };
    });
  };

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100/80">
<ChatHeader startCall={startCall} />        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="relative h-full">

      {/* 🔥 CALL SCREEN */}
      {isCalling && (
       <CallScreen
  localStreamRef={localStreamRef}
  remoteStreamRef={remoteStreamRef}
  endCall={endCall}
  callType={callType}
  callStatus={callStatus}
  callStartTime={callStartTime}
  user={selectedUser}
/>
      )}

      {/* 🔒 WATERMARK */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-10 text-3xl font-bold z-50">
        {authUser?.email}
      </div>

      {/* 💬 CHAT UI */}
      <div className="chat-protected h-full min-h-0 flex flex-col bg-base-100/80">
       <ChatHeader startCall={startCall} /> ✅

        <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
          {messages.map((message, idx) => {
            const isOwn = message.senderId === authUser._id;

            const msgReactions = [
              {
                emoji: "👍",
                count: reactions[message._id]?.["👍"]?.count || 0,
                reacted: reactions[message._id]?.["👍"]?.reacted || false,
              },
              {
                emoji: "😂",
                count: reactions[message._id]?.["😂"]?.count || 0,
                reacted: reactions[message._id]?.["😂"]?.reacted || false,
              },
              {
                emoji: "❤️",
                count: reactions[message._id]?.["❤️"]?.count || 0,
                reacted: reactions[message._id]?.["❤️"]?.reacted || false,
              },
            ];

            return (
              <div
                key={message._id}
                className={`chat group ${
                  isOwn ? "chat-end" : "chat-start"
                } px-1 sm:px-4`}
                ref={idx === messages.length - 1 ? messageEndRef : null}
              >
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="size-12 rounded-full border-2 border-primary shadow-md bg-white">
                    <img
                      src={
                        isOwn
                          ? getProfilePicUrl(authUser.profilePic)
                          : getProfilePicUrl(selectedUser.profilePic)
                      }
                      alt="profile"
                      className="size-12 object-cover rounded-full"
                      onError={(e) => (e.target.src = "/avatar.png")}
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="chat-header mb-1 flex items-center gap-2">
                  <time className="text-xs opacity-60 ml-1 group-hover:opacity-100">
                    {formatMessageTime(message.createdAt)}
                  </time>
                  {isOwn && (
                    <span className="ml-2 text-xs text-primary/70">
                      ✓✓
                    </span>
                  )}
                </div>

                {/* Message */}
                <div
                  className={`chat-bubble ${
                    isOwn
                      ? "bg-gradient-to-tr from-primary to-secondary text-primary-content"
                      : "bg-base-200 text-base-content"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-lg mb-2"
                    />
                  )}

                  {message.text && <p>{message.text}</p>}

                  {msgReactions.some((r) => r.count > 0) && (
                    <MessageReactions
                      reactions={msgReactions}
                      onReact={(emoji) =>
                        handleReact(message._id, emoji)
                      }
                    />
                  )}

                  {/* Emoji Button */}
                  <button
                    className="absolute -top-6 right-3 opacity-0 group-hover:opacity-100"
                    onClick={() => setPickerMsgId(message._id)}
                  >
                    ➕
                  </button>

                  {pickerMsgId === message._id && (
                    <EmojiPicker
                      onSelect={(emoji) =>
                        handleReact(message._id, emoji)
                      }
                      onClose={() => setPickerMsgId(null)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
import { X, Phone, Video, Info } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { getProfilePicUrl } from "../lib/utils";

const ChatHeader = ({ startCall }) => { // ✅ receive from props
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-3 border-b border-base-300 bg-base-100/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar relative">
            <div
              className={`size-12 rounded-full border-2 ${
                onlineUsers.includes(selectedUser._id)
                  ? "border-green-400 animate-pulse-slow"
                  : "border-base-300"
              } shadow-md`}
            >
              <img
                src={
                  getProfilePicUrl(selectedUser.profilePic) ||
                  "/avatar.png"
                }
                alt={selectedUser.fullName}
                className="size-12 object-cover rounded-full"
                onError={(e) => (e.target.src = "/avatar.png")}
              />

              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {selectedUser.fullName}
            </h3>

            <div className="text-sm opacity-70">
              {onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "Offline"}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-2">

          {/* 📞 AUDIO CALL */}
          <button
           onClick={() => startCall(selectedUser._id, "audio")}
            className="btn btn-ghost btn-sm rounded-full"
            title="Audio Call"
          >
            <Phone className="size-5" />
          </button>

          {/* 🎥 VIDEO CALL */}
          <button
           onClick={() => startCall(selectedUser._id, "video")}
            className="btn btn-ghost btn-sm rounded-full"
            title="Video Call"
          >
            <Video className="size-5" />
          </button>

          {/* ℹ️ INFO */}
          <button className="btn btn-ghost btn-sm rounded-full">
            <Info className="size-5" />
          </button>

          {/* ❌ CLOSE */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm rounded-full"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
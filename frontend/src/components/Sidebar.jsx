import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { getProfilePicUrl } from "../lib/utils";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  let filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  if (search.trim()) {
    filteredUsers = filteredUsers.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
  <aside className="h-full min-h-0 w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100/80 backdrop-blur-xl flex-shrink-0">
      <div className="border-b border-base-300 w-full p-5 bg-base-100/90">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-primary animate-pulse" />
          <span className="font-semibold hidden lg:block tracking-wide text-primary">Friends</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
        {/* Search input */}
        <div className="mt-3 hidden lg:block">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input input-bordered input-sm w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

  <div className="flex-1 overflow-y-auto w-full py-3 space-y-2 transition-all duration-300 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full px-3 py-2 flex items-center gap-3 animate-fade-in rounded-xl hover:bg-primary/10 focus:bg-primary/10 transition-all duration-200
              ${selectedUser?._id === user._id ? "bg-base-200 ring-2 ring-primary/30" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
<img
  src={getProfilePicUrl(user.profilePic) || "/avatar.png"}
  alt={user.name}
  className="size-12 object-cover rounded-full border-2 border-base-200 shadow group-hover:scale-105 transition-transform"
  onError={(e) => {
    e.target.src = "/avatar.png";
  }}
/>
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 animate-pulse rounded-full ring-2 ring-white"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-semibold truncate text-base-content">{user.fullName}</div>
              <div className={`text-sm ${onlineUsers.includes(user._id) ? "text-green-500" : "text-zinc-400"}`}> 
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

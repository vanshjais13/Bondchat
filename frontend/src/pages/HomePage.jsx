import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import ThemeToggle from "../components/ThemeToggle";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
  <div className="h-screen min-h-0 w-full bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-700 flex flex-col pt-16">
      <div className="fixed top-6 right-4 sm:right-8 z-20">
        <ThemeToggle />
      </div>
      <div className="flex w-full h-full min-h-0 flex-1">
        <div className="flex flex-row w-full h-full min-h-0 bg-white/80 dark:bg-base-200/90 backdrop-blur-xl shadow-2xl border border-white/30 animate-fade-in-up rounded-none overflow-hidden">
          <Sidebar />
          <div className="flex-1 min-h-0 h-full flex flex-col">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;

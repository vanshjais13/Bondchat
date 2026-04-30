import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
  <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-8 sm:p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-8 animate-fade-in-up">
        {/* Animated Icon Display */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg animate-bounce-slow"
            >
              <MessageSquare className="w-10 h-10 text-primary drop-shadow-lg" />
            </div>
            {/* Decorative pulse */}
            <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary/20 rounded-full blur-sm animate-pulse" />
          </div>
        </div>

        {/* Welcome Text */}
  <h2 className="text-3xl sm:text-4xl font-extrabold text-primary drop-shadow-sm">Welcome to BondChat!</h2>
        <p className="text-lg text-base-content/70 font-medium">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
// Add this animation to your global CSS (e.g., index.css):
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-18px); }
// }
// .animate-bounce-slow { animation: bounce-slow 1.6s infinite cubic-bezier(0.6,0,0.4,1); }
  );
};

export default NoChatSelected;

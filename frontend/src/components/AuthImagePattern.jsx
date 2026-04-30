
import { MessageCircle, Heart, User, Star, Zap } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const icons = [MessageCircle, Heart, User, Star, Zap];
  const getIcon = (i) => {
    if (i % 3 === 0) return icons[i % icons.length];
    return null;
  };

  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-100/30 to-blue-100/20 p-16 min-h-full w-full animate-in fade-in duration-1000">
      <div className="max-w-lg text-center">
        <div className="grid grid-cols-4 gap-3 mb-10">
          {[...Array(12)].map((_, i) => {
            const Icon = getIcon(i);
            return (
              <div
                key={i}
                className={`aspect-square rounded-2xl flex items-center justify-center transition-transform hover:scale-110 ${
                  i % 3 === 0
                    ? "bg-primary/20 animate-pulse text-primary"
                    : i % 4 === 0
                    ? "bg-pink-400/20 animate-bounce text-pink-400"
                    : i % 5 === 0
                    ? "bg-blue-400/20 animate-spin text-blue-400"
                    : "bg-base-200/80 hover:bg-base-300/80"
                }`}
              >
                {Icon && <Icon size={24} />}
              </div>
            );
          })}
        </div>
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-primary to-pink-400 text-transparent bg-clip-text animate-in slide-in-from-bottom duration-700 delay-300">
          {title}
        </h2>
        <p className="text-base-content/70 text-lg font-medium max-w-md mx-auto animate-in slide-in-from-bottom duration-700 delay-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

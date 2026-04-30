import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-base-200 dark:bg-base-100">
      {/* Centered Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-16 w-full max-w-xl">
        <div className="w-full bg-white/70 dark:bg-base-200/80 backdrop-blur-xl rounded-3xl shadow-2xl p-14 space-y-10 border border-white/30 animate-fade-in-up">
          {/* Logo & Quote */}
          <div className="text-center mb-10">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/80 to-pink-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <MessageSquare className="w-10 h-10 text-white drop-shadow" />
              </div>
              <h1 className="text-4xl font-extrabold mt-2 tracking-tight bg-gradient-to-r from-primary to-pink-400 text-transparent bg-clip-text">BondChat</h1>
              <p className="text-base-content/60 text-base italic max-w-md mx-auto">"Connect, chat, and bond with your favorite people."</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 bg-white/80 dark:bg-base-100/80 focus:ring-2 focus:ring-primary/40 transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label flex justify-between items-center">
                <span className="label-text font-semibold text-base">Password</span>
                <Link to="/forgot-password" className="text-xs link link-primary">Forgot password?</Link>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-white/80 dark:bg-base-100/80 focus:ring-2 focus:ring-primary/40 transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-primary/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-primary/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full shadow-lg hover:scale-105 transition-transform font-bold text-xl py-4" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-base-content/60 text-base">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary font-semibold text-base">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

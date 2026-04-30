import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await forgotPassword(email);
    setIsSubmitting(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-base-200 dark:bg-base-100">
      <div className="bg-white/70 dark:bg-base-200/80 rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/30">
        <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-base-content/60 text-sm text-center mb-8">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="link link-primary flex items-center gap-1 justify-center">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

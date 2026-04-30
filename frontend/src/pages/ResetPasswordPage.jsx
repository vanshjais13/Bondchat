import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Lock, Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams(); // reset token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await resetPassword(token, password);
    setIsSubmitting(false);
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-base-200 dark:bg-base-100">
      <div className="bg-white/70 dark:bg-base-200/80 rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/30">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
        <p className="text-base-content/60 text-sm text-center mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">New Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="link link-primary">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

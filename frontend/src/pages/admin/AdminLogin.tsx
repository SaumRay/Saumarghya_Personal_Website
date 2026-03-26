import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login(password);
    if (!ok) setError("Invalid password. Please try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-foreground/50 text-sm mt-1">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-bold text-background bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

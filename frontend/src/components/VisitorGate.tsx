import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "@/hooks/use-admin-auth";
import { User, Sparkles } from "lucide-react";

// Simple browser fingerprint — combination of stable browser properties
function getFingerprint(): string {
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");

  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

async function logVisit(name: string, fingerprint: string) {
  try {
    await fetch(`${API_BASE}/api/visitors/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, fingerprint }),
    });
  } catch {
    // Silently fail — don't block the user
  }
}

export function VisitorGate({ children }: { children: React.ReactNode }) {
  const [showGate, setShowGate] = useState(false);
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fingerprint = getFingerprint();
    const alreadySeen = localStorage.getItem("vg_seen");

    if (alreadySeen) {
      // Repeat visitor — log silently and show site
      const savedName = localStorage.getItem("vg_name") || "Anonymous";
      logVisit(savedName, fingerprint);
      setDone(true);
    } else {
      // First time — show the gate
      setShowGate(true);
    }
  }, []);

  const handleSubmit = async (visitorName: string) => {
    const fingerprint = getFingerprint();
    const finalName = visitorName.trim() || "Anonymous";
    localStorage.setItem("vg_seen", "1");
    localStorage.setItem("vg_name", finalName);
    await logVisit(finalName, fingerprint);
    setShowGate(false);
    setDone(true);
  };

  // Show nothing until we decide (avoids flash)
  if (!done && !showGate) return null;

  return (
    <>
      {/* Always render children underneath */}
      {(done || showGate) && children}

      {/* Gate overlay */}
      <AnimatePresence>
        {showGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl border border-white/10 p-8 w-full max-w-sm text-center shadow-2xl"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome! 👋
              </h2>
              <p className="text-foreground/60 text-sm mb-1">
                You're visiting <span className="text-primary font-semibold">Saumarghya's</span> personal space.
              </p>
              <p className="text-foreground/40 text-xs mb-6">
                Entering your name is recommended — it helps me know who stopped by! You can skip if you prefer.
              </p>

              {/* Input */}
              <div className="relative mb-4">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(name)}
                  placeholder="Your name (optional)"
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmit("")}
                  className="flex-1 py-2.5 rounded-xl border border-foreground/10 text-foreground/50 text-sm hover:bg-foreground/5 transition-all"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSubmit(name)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all"
                >
                  Enter Site →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
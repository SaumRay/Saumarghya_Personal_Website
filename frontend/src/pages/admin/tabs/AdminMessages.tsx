import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Mail, MailOpen, Clock, CheckCheck } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function AdminMessages() {
  const { token } = useAdminAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchMessages = () => {
    fetch(`${API_BASE}/api/contact`, { headers })
      .then((r) => r.json())
      .then((d) => setMessages(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    await fetch(`${API_BASE}/api/contact/${id}/read`, { method: "PATCH", headers });
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
    setSelected((prev) => prev?._id === id ? { ...prev, read: true } : prev);
  };

  const filtered = filter === "unread" ? messages.filter((m) => !m.read) : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">
          Messages ({messages.length})
          {unreadCount > 0 && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">{unreadCount} unread</span>}
        </h2>
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-primary/20 text-primary border border-primary/20" : "text-foreground/50 hover:text-foreground border border-foreground/10"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-16 animate-pulse border border-white/5" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/30">
          <MailOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{filter === "unread" ? "All messages read!" : "No messages yet."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <button key={m._id} onClick={() => { setSelected(m); if (!m.read) markRead(m._id); }}
              className={`w-full glass-card rounded-2xl p-4 border text-left transition-all hover:border-primary/30 ${!m.read ? "border-primary/20 bg-primary/5" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!m.read ? "bg-primary/20 text-primary" : "bg-foreground/5 text-foreground/40"}`}>
                  {!m.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm truncate ${!m.read ? "text-foreground" : "text-foreground/70"}`}>{m.name}</p>
                    <p className="text-foreground/40 text-xs truncate">{m.email}</p>
                  </div>
                  <p className="text-foreground/50 text-xs truncate mt-0.5">{m.message}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-foreground/30 text-xs">
                  <Clock className="w-3 h-3" />
                  {new Date(m.createdAt).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-lg p-6 border border-white/10">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-bold text-foreground">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">{selected.email}</a>
              </div>
              <div className="flex items-center gap-2">
                {selected.read && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCheck className="w-3 h-3" /> Read</span>}
                <button onClick={() => setSelected(null)} className="text-foreground/40 hover:text-foreground ml-2">✕</button>
              </div>
            </div>
            <div className="bg-foreground/5 rounded-2xl p-4 text-foreground/80 text-sm leading-relaxed mb-5 border border-foreground/10">
              {selected.message}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl border border-foreground/10 text-foreground/60 text-sm">Close</button>
              <a href={`mailto:${selected.email}?subject=Re: Your message via portfolio`}
                className="flex-1 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium text-center hover:bg-primary/30 transition-all">
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Users, Trash2, RefreshCw, TrendingUp } from "lucide-react";

interface Visitor {
  _id: string;
  name: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  fingerprint: string;
}

export function AdminVisitors() {
  const { token } = useAdminAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchVisitors = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/visitors`, { headers })
      .then((r) => r.json())
      .then((d) => setVisitors(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVisitors(); }, []);

  const deleteVisitor = async (id: string) => {
    if (!confirm("Remove this visitor record?")) return;
    await fetch(`${API_BASE}/api/visitors/${id}`, { method: "DELETE", headers });
    fetchVisitors();
  };

  const totalVisits = visitors.reduce((sum, v) => sum + v.visitCount, 0);
  const namedVisitors = visitors.filter((v) => v.name !== "Anonymous").length;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Visitors</h2>
        <button
          onClick={fetchVisitors}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-white/10 text-foreground/60 text-sm hover:bg-foreground/10 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{visitors.length}</p>
          <p className="text-foreground/50 text-xs mt-1">Unique Visitors</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalVisits}</p>
          <p className="text-foreground/50 text-xs mt-1">Total Visits</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{namedVisitors}</p>
          <p className="text-foreground/50 text-xs mt-1">Named Visitors</p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-16 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : visitors.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No visitors logged yet.
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/10 text-foreground/40 text-xs font-medium uppercase tracking-wider">
            <span>Name</span>
            <span className="text-center">Visits</span>
            <span>First Visit</span>
            <span>Last Visit</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {visitors.map((v) => (
              <div key={v._id} className="grid grid-cols-[1fr_auto_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {v.name === "Anonymous" ? "?" : v.name[0].toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium truncate ${v.name === "Anonymous" ? "text-foreground/30 italic" : "text-foreground"}`}>
                    {v.name}
                  </span>
                </div>
                <div className="text-center">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {v.visitCount}
                  </span>
                </div>
                <span className="text-foreground/40 text-xs">{fmt(v.firstVisit)}</span>
                <span className="text-foreground/40 text-xs">{fmt(v.lastVisit)}</span>
                <button
                  onClick={() => deleteVisitor(v._id)}
                  className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
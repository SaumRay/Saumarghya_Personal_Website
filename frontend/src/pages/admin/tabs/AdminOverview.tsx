import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { FolderKanban, Mail, Images, BookOpen, MailOpen, Users } from "lucide-react";

interface Stats {
  projects: number;
  messages: number;
  unreadMessages: number;
  galleries: number;
  notes: number;
  visitors: number;
}

export function AdminOverview() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<Stats>({
    projects: 0, messages: 0, unreadMessages: 0,
    galleries: 0, notes: 0, visitors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE}/api/projects`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/contact`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/gallery`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/notes/all`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/visitors`, { headers }).then((r) => r.json()),
    ])
      .then(([projects, contact, gallery, notes, visitors]) => {
        setStats({
          projects:       projects.data?.length || 0,
          messages:       contact.data?.length || 0,
          unreadMessages: contact.data?.filter((m: { read: boolean }) => !m.read).length || 0,
          galleries:      gallery.data?.length || 0,
          notes:          notes.data?.length || 0,
          visitors:       visitors.total || 0,
        });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const cards = [
    { label: "Projects",        value: stats.projects,       icon: <FolderKanban className="w-6 h-6" />, color: "text-blue-400",   bg: "bg-blue-500/10" },
    { label: "Total Messages",  value: stats.messages,       icon: <Mail className="w-6 h-6" />,         color: "text-green-400",  bg: "bg-green-500/10" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: <MailOpen className="w-6 h-6" />,     color: "text-red-400",    bg: "bg-red-500/10" },
    { label: "Gallery Albums",  value: stats.galleries,      icon: <Images className="w-6 h-6" />,       color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Notes & Posts",   value: stats.notes,          icon: <BookOpen className="w-6 h-6" />,     color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Unique Visitors", value: stats.visitors,       icon: <Users className="w-6 h-6" />,        color: "text-cyan-400",   bg: "bg-cyan-500/10" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">Welcome back, Saumarghya 👋</h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-pulse h-28 border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="glass-card rounded-2xl p-5 border border-white/10">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-foreground/50 text-xs mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
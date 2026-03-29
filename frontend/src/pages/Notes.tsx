import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, Clock, Tag, BookOpen, Search } from "lucide-react";

type NoteCategory = "chemistry" | "cat_prep" | "gate_prep" | "tech" | "quizzing" | "life" | "sports" | "other";

interface Note {
  _id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  published: boolean;
  readTimeMinutes: number;
  coverImageUrl: string;
  createdAt: string;
}

const CATEGORY_META: Record<NoteCategory, { emoji: string; label: string; color: string }> = {
  chemistry:  { emoji: "⚗️", label: "Chemistry",  color: "from-emerald-500 to-teal-500" },
  cat_prep:   { emoji: "📊", label: "CAT Prep",   color: "from-blue-500 to-cyan-500" },
  gate_prep:  { emoji: "💻", label: "GATE Prep",  color: "from-violet-500 to-purple-500" },
  tech:       { emoji: "🔧", label: "Tech",        color: "from-orange-500 to-amber-500" },
  quizzing:   { emoji: "🧠", label: "Quizzing",   color: "from-pink-500 to-rose-500" },
  life:       { emoji: "🌱", label: "Life",        color: "from-lime-500 to-green-500" },
  sports:     { emoji: "🏏", label: "Sports",      color: "from-yellow-500 to-orange-500" },
  other:      { emoji: "📝", label: "Other",       color: "from-gray-500 to-slate-500" },
};

const DEFAULT_META = { emoji: "📝", label: "Other", color: "from-gray-500 to-slate-500" };

export default function Notes() {
  const [, setLocation] = useLocation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterCat, setFilterCat] = useState<NoteCategory | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/notes`)
      .then((r) => r.json())
      .then((d) => setNotes(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes
    .filter((n) => filterCat === "all" || n.category === filterCat)
    .filter((n) =>
      search.trim() === "" ||
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => {
            setLocation("/");
            setTimeout(() => {
               const el = document.getElementById("notes");
               if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
            }
        }, 300);
    }}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-5">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Notes & Posts</h1>
          <p className="text-foreground/60">Thoughts, learnings, and opinions — written down.</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts or tags..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilterCat("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCat === "all"
                ? "bg-primary/20 text-primary border-primary/20"
                : "border-foreground/10 text-foreground/50 hover:text-foreground"
            }`}
          >
            All
          </button>
          {Object.entries(CATEGORY_META).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilterCat(key as NoteCategory)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterCat === key
                  ? "bg-primary/20 text-primary border-primary/20"
                  : "border-foreground/10 text-foreground/50 hover:text-foreground"
              }`}
            >
              {val.emoji} {val.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-32 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            Could not load posts right now.
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            {search ? "No posts match your search." : "No posts yet."}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((note) => {
              if (!note?._id) return null;
              const meta = CATEGORY_META[note.category] ?? DEFAULT_META;
              const preview = typeof note.content === "string"
                ? note.content.replace(/[#*`>\-]/g, "").slice(0, 160)
                : "";

              return (
                <button
                  key={note._id}
                  onClick={() => setLocation(`/notes/${note._id}`)}
                  className="w-full text-left glass-card rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group"
                >
                  <div className="flex gap-0">
                    {note.coverImageUrl ? (
                      <div className="w-32 sm:w-44 shrink-0 overflow-hidden">
                        <img
                          src={note.coverImageUrl}
                          alt={note.title || "Note"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className={`w-2 shrink-0 bg-gradient-to-b ${meta.color}`} />
                    )}

                    <div className="flex-1 p-5 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
                          {note.title || "Untitled"}
                        </h2>
                        <span className="text-lg shrink-0">{meta.emoji}</span>
                      </div>

                      <p className="text-foreground/50 text-sm line-clamp-2 mb-3">
                        {preview}...
                      </p>

                      <div className="flex items-center gap-4 text-foreground/40 text-xs flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {note.readTimeMinutes || 1} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {meta.label}
                        </span>
                        <span>
                          {note.createdAt
                            ? new Date(note.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                              })
                            : ""}
                        </span>
                        {(note.tags || []).length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {note.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/40">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

type NoteCategory = "chemistry" | "cat_prep" | "gate_prep" | "tech" | "quizzing" | "life" | "sports" | "other";

interface Note {
  _id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
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

export function NotesSection() {
  const [, setLocation] = useLocation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${API_BASE}/api/notes`)
    .then(r => {
      if (!r.ok && r.status !== 304) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(d => setNotes((d.data || []).slice(0, 3)))
    .catch(err => {
      console.error("Notes fetch error:", err);
      setNotes([]); // fail silently, don't crash
    })
    .finally(() => setLoading(false));
  }, []);

  return (
    <section id="notes" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Notes & <span className="text-primary">Posts</span>
          </h2>
          <p className="text-white/60">Thoughts, learnings, and opinions — written down.</p>
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-3xl h-64 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* Notes grid — top 3 */}
        {!loading && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {notes.map((note, idx) => {
              const meta = CATEGORY_META[note.category] ?? CATEGORY_META["other"];
              return (
                <motion.button
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setLocation(`/notes/${note._id}`)}
                  className="glass-card rounded-3xl border border-white/10 hover:border-white/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden group text-left w-full"
                >
                  {/* Cover image or gradient header */}
                  {note.coverImageUrl ? (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={note.coverImageUrl}
                        alt={note.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className={`w-full h-2 bg-gradient-to-r ${meta.color}`} />
                  )}

                  <div className="p-5">
                    {/* Category badge */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${meta.color} text-white mb-3`}>
                      {meta.emoji} {meta.label}
                    </span>

                    {/* Title */}
                    <h3 className="font-bold text-white text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {note.title}
                    </h3>

                    {/* Preview */}
                    <p className="text-white/50 text-sm line-clamp-2 mb-4">
                      {note.content.replace(/[#*`>\-]/g, "").slice(0, 120)}...
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-white/30 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.readTimeMinutes} min read
                      </span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <div className="glass-card rounded-3xl p-12 border border-white/10 text-white/40 text-center mb-10">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            No posts yet.
          </div>
        )}

        {/* View All button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => setLocation("/notes")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
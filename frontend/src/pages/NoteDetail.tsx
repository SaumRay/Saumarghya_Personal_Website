import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";

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

// Minimal markdown → HTML renderer (no external lib needed)
function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered list items
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr />")
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    // Paragraphs — double newline
    .replace(/\n\n/g, "</p><p>")
    // Single newline → br
    .replace(/\n/g, "<br />")
    // Wrap in paragraph
    .replace(/^(.+)/, "<p>$1</p>");
}

export default function NoteDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`${API_BASE}/api/notes/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => setNote(d.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground/50 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (notFound || !note) {
    return (
      <div className="min-h-screen bg-background p-6">
        <button onClick={() => setLocation("/notes")}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>
        <p className="text-red-400">Post not found.</p>
      </div>
    );
  }

  const meta = CATEGORY_META[note.category] ?? CATEGORY_META["other"];

  return (
    <div className="min-h-screen bg-background">
      {/* Cover image */}
      {note.coverImageUrl && (
        <div className="w-full h-56 sm:h-72 overflow-hidden relative">
          <img src={note.coverImageUrl} alt={note.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button
          onClick={() => setLocation("/notes")}
          className="inline-flex items-center gap-2 mb-8 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>

        {/* Category badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${meta.color} text-white`}>
            {meta.emoji} {meta.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
          {note.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-foreground/40 text-sm mb-6 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {note.readTimeMinutes} min read
          </span>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {note.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/50 text-xs">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className={`h-px bg-gradient-to-r ${meta.color} mb-8 opacity-40`} />

        {/* Content */}
        <div
          className="prose-note text-foreground/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
        />
      </div>

      {/* Prose styles injected via a style tag */}
      <style>{`
        .prose-note h1 { font-size: 1.75rem; font-weight: 700; color: white; margin: 1.5rem 0 0.75rem; }
        .prose-note h2 { font-size: 1.4rem; font-weight: 700; color: white; margin: 1.5rem 0 0.75rem; }
        .prose-note h3 { font-size: 1.15rem; font-weight: 600; color: white; margin: 1.25rem 0 0.5rem; }
        .prose-note p  { margin: 0.75rem 0; line-height: 1.8; }
        .prose-note strong { color: white; font-weight: 600; }
        .prose-note em { font-style: italic; color: rgba(255,255,255,0.7); }
        .prose-note code { background: rgba(255,255,255,0.08); padding: 0.15rem 0.4rem; border-radius: 0.3rem; font-size: 0.85em; font-family: monospace; color: #7dd3fc; }
        .prose-note blockquote { border-left: 3px solid rgba(255,255,255,0.2); padding-left: 1rem; margin: 1rem 0; color: rgba(255,255,255,0.5); font-style: italic; }
        .prose-note li { margin: 0.4rem 0 0.4rem 1.5rem; list-style: disc; }
        .prose-note hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2rem 0; }
        .prose-note a { color: #22d3ee; text-decoration: underline; text-underline-offset: 2px; }
        .prose-note a:hover { color: #67e8f9; }
      `}</style>
    </div>
  );
}
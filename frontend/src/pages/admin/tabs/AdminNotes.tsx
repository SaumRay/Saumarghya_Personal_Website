import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Clock, Tag } from "lucide-react";

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

const CATEGORY_META: Record<NoteCategory, { emoji: string; label: string }> = {
  chemistry:  { emoji: "⚗️", label: "Chemistry" },
  cat_prep:   { emoji: "📊", label: "CAT Prep" },
  gate_prep:  { emoji: "💻", label: "GATE Prep" },
  tech:       { emoji: "🔧", label: "Tech" },
  quizzing:   { emoji: "🧠", label: "Quizzing" },
  life:       { emoji: "🌱", label: "Life" },
  sports:     { emoji: "🏏", label: "Sports" },
  other:      { emoji: "📝", label: "Other" },
};

const emptyForm = { title: "", content: "", category: "tech" as NoteCategory, tags: "", published: false };

export function AdminNotes() {
  const { token } = useAdminAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<NoteCategory | "all">("all");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchNotes = () => {
    fetch(`${API_BASE}/api/notes/all`, { headers })
      .then((r) => r.json())
      .then((d) => setNotes(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotes(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setCoverFile(null); setShowForm(true); };
  const openEdit = (n: Note) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, category: n.category, tags: n.tags.join(", "), published: n.published });
    setCoverFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("category", form.category);
    fd.append("tags", JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)));
    fd.append("published", String(form.published));
    if (coverFile) fd.append("coverImage", coverFile);

    const url = editing ? `${API_BASE}/api/notes/${editing._id}` : `${API_BASE}/api/notes`;
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers, body: fd });
    fetchNotes();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_BASE}/api/notes/${id}`, { method: "DELETE", headers });
    setDeleteId(null);
    fetchNotes();
  };

  const togglePublish = async (n: Note) => {
    const fd = new FormData();
    fd.append("published", String(!n.published));
    await fetch(`${API_BASE}/api/notes/${n._id}`, { method: "PUT", headers, body: fd });
    fetchNotes();
  };

  const filtered = filterCat === "all" ? notes : notes.filter((n) => n.category === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Notes & Posts ({notes.length})</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-all text-sm font-medium">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterCat("all")} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterCat === "all" ? "bg-primary/20 text-primary border-primary/20" : "border-foreground/10 text-foreground/50 hover:text-foreground"}`}>All</button>
        {Object.entries(CATEGORY_META).map(([key, val]) => (
          <button key={key} onClick={() => setFilterCat(key as NoteCategory)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterCat === key ? "bg-primary/20 text-primary border-primary/20" : "border-foreground/10 text-foreground/50 hover:text-foreground"}`}>
            {val.emoji} {val.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-20 animate-pulse border border-white/5" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/30">No posts yet. Write your first one!</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const meta = CATEGORY_META[n.category];
            return (
              <div key={n._id} className="glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-4">
                <span className="text-2xl shrink-0">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground truncate">{n.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${n.published ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-foreground/5 text-foreground/40 border-foreground/10"}`}>
                      {n.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-foreground/40 text-xs">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{n.readTimeMinutes} min read</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{meta.label}</span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(n)} title={n.published ? "Unpublish" : "Publish"}
                    className={`p-2 rounded-lg transition-colors ${n.published ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-foreground/5 text-foreground/40 hover:text-foreground"}`}>
                    {n.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(n)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(n._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-2xl p-6 border border-white/10 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">{editing ? "Edit Post" : "New Post"}</h3>
              <button onClick={() => setShowForm(false)} className="text-foreground/40 hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-foreground/60 mb-1 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as NoteCategory })}
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {Object.entries(CATEGORY_META).map(([key, val]) => (
                      <option key={key} value={key}>{val.emoji} {val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground/60 mb-1 block">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="jee, organic, tips"
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Content (Markdown supported)</label>
                <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your content here... Markdown is supported."
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-mono" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Cover Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-foreground/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-xs file:font-medium" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm text-foreground/70">Publish immediately (visible on site)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-foreground/10 text-foreground/60 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.content} className="flex-1 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary/30 transition-all">
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-red-500/20 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-foreground font-bold mb-1">Delete Post?</p>
            <p className="text-foreground/50 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-foreground/10 text-foreground/60 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/30">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

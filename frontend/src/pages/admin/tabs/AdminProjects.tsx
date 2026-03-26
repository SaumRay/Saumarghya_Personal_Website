import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Plus, Pencil, Trash2, Github, ExternalLink, X, Save } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  color: string;
  featured: boolean;
  imageUrl: string;
}

const COLORS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-yellow-500 to-orange-500",
];

const emptyForm = { title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", color: COLORS[0], featured: false };

export function AdminProjects() {
  const { token } = useAdminAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchProjects = () => {
    fetch(`${API_BASE}/api/projects`, { headers })
      .then((r) => r.json())
      .then((d) => setProjects(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, techStack: p.techStack.join(", "), githubUrl: p.githubUrl, liveUrl: p.liveUrl, color: p.color, featured: p.featured });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("techStack", JSON.stringify(form.techStack.split(",").map((t) => t.trim()).filter(Boolean)));
    fd.append("githubUrl", form.githubUrl);
    fd.append("liveUrl", form.liveUrl);
    fd.append("color", form.color);
    fd.append("featured", String(form.featured));
    if (imageFile) fd.append("image", imageFile);

    const url = editing ? `${API_BASE}/api/projects/${editing._id}` : `${API_BASE}/api/projects`;
    const method = editing ? "PUT" : "POST";

    await fetch(url, { method, headers, body: fd });
    fetchProjects();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_BASE}/api/projects/${id}`, { method: "DELETE", headers });
    setDeleteId(null);
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Projects ({projects.length})</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-all text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-20 animate-pulse border border-white/5" />)}</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p._id} className="glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-4">
              <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${p.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">{p.title}</p>
                  {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">Featured</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.techStack.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/60 border border-foreground/10">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"><Github className="w-4 h-4" /></a>}
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"><ExternalLink className="w-4 h-4" /></a>}
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(p._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-lg p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">{editing ? "Edit Project" : "New Project"}</h3>
              <button onClick={() => setShowForm(false)} className="text-foreground/40 hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Title", key: "title", type: "text", placeholder: "Project name" },
                { label: "GitHub URL", key: "githubUrl", type: "url", placeholder: "https://github.com/..." },
                { label: "Live URL", key: "liveUrl", type: "url", placeholder: "https://..." },
                { label: "Tech Stack (comma separated)", key: "techStack", type: "text", placeholder: "React, Node.js, MongoDB" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-foreground/60 mb-1 block">{label}</label>
                  <input type={type} value={(form as Record<string, unknown>)[key] as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="Project description..." />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-2 block">Color Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} border-2 transition-all ${form.color === c ? "border-white scale-110" : "border-transparent"}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Cover Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-foreground/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-xs file:font-medium" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm text-foreground/70">Mark as Featured</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-foreground/10 text-foreground/60 hover:text-foreground text-sm transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-red-500/20 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-foreground font-bold mb-1">Delete Project?</p>
            <p className="text-foreground/50 text-sm mb-5">This will also remove any uploaded image from S3.</p>
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

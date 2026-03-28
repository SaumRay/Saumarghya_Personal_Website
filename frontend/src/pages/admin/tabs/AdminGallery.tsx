import { useEffect, useState, useRef } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Plus, Trash2, Upload, X, ImagePlus, ChevronLeft } from "lucide-react";

type Category = "traveller" | "fitness" | "professional" | "college" | "family" | "events" | "other";

interface GalleryImage { key: string; url: string; caption: string; uploadedAt: string; }
interface Gallery { _id: string; category: Category; label: string; description: string; images: GalleryImage[]; order: number; }

const CATEGORY_META: Record<Category, { emoji: string; color: string }> = {
  traveller:    { emoji: "✈️", color: "from-sky-500 to-blue-500" },
  fitness:      { emoji: "💪", color: "from-emerald-500 to-green-500" },
  professional: { emoji: "💼", color: "from-violet-500 to-purple-500" },
  college:      { emoji: "🎓", color: "from-yellow-500 to-orange-500" },
  family:       { emoji: "❤️", color: "from-pink-500 to-red-500" },
  events:       { emoji: "🎉", color: "from-cyan-500 to-teal-500" },
  other:        { emoji: "📷", color: "from-gray-500 to-slate-500" },
};

const emptyForm = { label: "", category: "traveller" as Category, description: "" };

export function AdminGallery() {
  const { token } = useAdminAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchGalleries = (syncActiveId?: string) => {
    fetch(`${API_BASE}/api/gallery`, { headers })
      .then((r) => r.json())
      .then((d) => {
        const data: Gallery[] = d.data || [];
        setGalleries(data);
        // Keep activeGallery in sync after mutations
        if (syncActiveId) {
          const updated = data.find((g) => g._id === syncActiveId);
          if (updated) setActiveGallery(updated);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGalleries(); }, []);

  const createGallery = async () => {
    setSaving(true);
    await fetch(`${API_BASE}/api/gallery`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(form) });
    fetchGalleries();
    setShowCreate(false);
    setForm(emptyForm);
    setSaving(false);
  };

  const deleteGallery = async (id: string) => {
    if (!confirm("Delete this entire album and all its images?")) return;
    await fetch(`${API_BASE}/api/gallery/${id}`, { method: "DELETE", headers });
    if (activeGallery?._id === id) setActiveGallery(null);
    fetchGalleries();
  };

  const uploadImages = async () => {
    if (!activeGallery || uploadFiles.length === 0) return;
    setUploading(true);
    const galleryId = activeGallery._id;

    try {
      const fd = new FormData();
      uploadFiles.forEach((f) => fd.append("images", f));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${API_BASE}/api/gallery/${galleryId}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        alert(`Upload failed: ${data.message || `HTTP ${res.status}`}`);
        return;
      }

      // Prefer the returned gallery, fallback to re-fetching
      if (data.gallery) {
        setActiveGallery(data.gallery);
        fetchGalleries();
      } else {
        fetchGalleries(galleryId);
      }
      setUploadFiles([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error: any) {
      if (error.name === "AbortError") {
        alert("Upload timed out. Check file size and internet connection.");
      } else {
        alert(`Upload error: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (key: string) => {
    if (!activeGallery) return;
    const encodedKey = encodeURIComponent(key);
    const res = await fetch(`${API_BASE}/api/gallery/${activeGallery._id}/images/${encodedKey}`, { method: "DELETE", headers });
    const data = await res.json();
    if (data.gallery) {
      setActiveGallery(data.gallery);
      fetchGalleries();
    } else {
      fetchGalleries(activeGallery._id);
    }
  };

  // Album detail view
  if (activeGallery) {
    const meta = CATEGORY_META[activeGallery.category];
    return (
      <div>
        <button onClick={() => setActiveGallery(null)} className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Albums
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl`}>{meta.emoji}</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{activeGallery.label}</h2>
            <p className="text-foreground/50 text-sm">{activeGallery.images.length} photos · {activeGallery.category}</p>
          </div>
        </div>

        {/* Upload area */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 mb-6">
          <div
            className="border-2 border-dashed border-foreground/20 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); setUploadFiles(Array.from(e.dataTransfer.files)); }}
          >
            <ImagePlus className="w-8 h-8 text-foreground/30 mx-auto mb-2" />
            <p className="text-foreground/50 text-sm">Drag & drop or click to select photos</p>
            <p className="text-foreground/30 text-xs mt-1">JPG, PNG, WEBP up to 5MB each</p>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => setUploadFiles(Array.from(e.target.files || []))} />
          </div>
          {uploadFiles.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-foreground/60">{uploadFiles.length} file(s) selected</p>
              <button onClick={uploadImages} disabled={uploading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 disabled:opacity-50 transition-all">
                <Upload className="w-4 h-4" />{uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>

        {/* Images grid */}
        {activeGallery.images.length === 0 ? (
          <div className="text-center py-12 text-foreground/30">No photos yet. Upload some above!</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeGallery.images.map((img) => (
              <div key={img.key} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => deleteImage(img.key)} className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Albums list view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Gallery Albums ({galleries.length})</h2>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-all text-sm font-medium">
          <Plus className="w-4 h-4" /> New Album
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-32 animate-pulse border border-white/5" />)}</div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-16 text-foreground/30">
          <p>No albums yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleries.map((g) => {
            const meta = CATEGORY_META[g.category];
            return (
              <div key={g._id} className="glass-card rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-white/20 transition-all"
                onClick={() => setActiveGallery(g)}>
                <div className={`h-2 bg-gradient-to-r ${meta.color}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{meta.emoji}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteGallery(g._id); }} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-bold text-foreground">{g.label}</p>
                  <p className="text-foreground/40 text-xs mt-1">{g.images.length} photos</p>
                  {g.description && <p className="text-foreground/50 text-xs mt-2 line-clamp-2">{g.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Album Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-md p-6 border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">New Album</h3>
              <button onClick={() => setShowCreate(false)} className="text-foreground/40 hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Album Name</label>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Goa Trip 2024"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {Object.entries(CATEGORY_META).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60 mb-1 block">Description (optional)</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A short description..."
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-foreground/10 text-foreground/60 text-sm">Cancel</button>
              <button onClick={createGallery} disabled={saving || !form.label} className="flex-1 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium disabled:opacity-50 hover:bg-primary/30 transition-all">
                {saving ? "Creating..." : "Create Album"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
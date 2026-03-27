import { useEffect, useState, useRef } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Plus, Trash2, Upload, X, Users } from "lucide-react";

type SubCategory = "family" | "friends";

interface GalleryImage {
  key: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

interface GalleryAlbum {
  _id: string;
  category: string;
  label: string;
  description: string;
  images: GalleryImage[];
}

const SUB_CATEGORIES: { value: SubCategory; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];

export function AdminFamilyFriends() {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<SubCategory>("family");
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAlbumLabel, setNewAlbumLabel] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; caption: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAlbums = async (sub: SubCategory) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/gallery/category/${sub}`);
      const data = await res.json();
      setAlbums(data.success ? data.data : []);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(activeTab);
  }, [activeTab]);

  const createAlbum = async () => {
    if (!newAlbumLabel.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeTab,
          label: newAlbumLabel.trim(),
          description: newAlbumDesc.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewAlbumLabel("");
        setNewAlbumDesc("");
        setCreating(false);
        fetchAlbums(activeTab);
      }
    } catch {}
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm("Delete this album and all its photos?")) return;
    try {
      await fetch(`${API_BASE}/api/gallery/${id}`, { method: "DELETE", headers });
      fetchAlbums(activeTab);
    } catch {}
  };

  const deleteImage = async (albumId: string, key: string) => {
    try {
      await fetch(`${API_BASE}/api/gallery/${albumId}/images/${encodeURIComponent(key)}`, {
        method: "DELETE",
        headers,
      });
      fetchAlbums(activeTab);
    } catch {}
  };

  const startUpload = (albumId: string) => {
    setUploadingFor(albumId);
    setPendingFiles([]);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPendingFiles(files.map((file) => ({ file, caption: "" })));
  };

  const updateCaption = (index: number, caption: string) => {
    const next = [...pendingFiles];
    next[index] = { ...next[index], caption };
    setPendingFiles(next);
  };

  const uploadImages = async () => {
    if (!uploadingFor || pendingFiles.length === 0) return;
    const formData = new FormData();
    pendingFiles.forEach(({ file }) => formData.append("images", file));
    formData.append("captions", JSON.stringify(pendingFiles.map((f) => f.caption)));

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${uploadingFor}/images`, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadingFor(null);
        setPendingFiles([]);
        fetchAlbums(activeTab);
      }
    } catch {}
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Family & Friends Gallery</h2>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all"
        >
          <Plus className="w-4 h-4" /> New Album
        </button>
      </div>

      {/* Sub-category tabs */}
      <div className="flex gap-2 mb-6">
        {SUB_CATEGORIES.map((sub) => (
          <button
            key={sub.value}
            onClick={() => {
              setActiveTab(sub.value);
              setUploadingFor(null);
              setPendingFiles([]);
              setCreating(false);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === sub.value
                ? "bg-primary/20 text-primary border border-primary/20"
                : "text-foreground/50 hover:text-foreground border border-white/10"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Create Album form */}
      {creating && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 mb-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            New {activeTab === "family" ? "Family" : "Friends"} Album
          </h3>
          <input
            value={newAlbumLabel}
            onChange={(e) => setNewAlbumLabel(e.target.value)}
            placeholder="Album name (e.g. Goa Trip 2024)"
            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
          />
          <input
            value={newAlbumDesc}
            onChange={(e) => setNewAlbumDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={createAlbum}
              className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all"
            >
              Create Album
            </button>
            <button
              onClick={() => { setCreating(false); setNewAlbumLabel(""); setNewAlbumDesc(""); }}
              className="px-4 py-2 rounded-xl text-foreground/50 border border-white/10 text-sm hover:bg-foreground/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Albums list */}
      {loading ? (
        <div className="text-foreground/50">Loading albums...</div>
      ) : albums.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 border border-white/10 text-foreground/50 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No albums yet for {activeTab === "family" ? "Family" : "Friends"}. Create one!
        </div>
      ) : (
        <div className="space-y-6">
          {albums.map((album) => (
            <div key={album._id} className="glass-card rounded-2xl border border-white/10 overflow-hidden">

              {/* Album header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h3 className="font-semibold text-foreground">{album.label}</h3>
                  {album.description && (
                    <p className="text-xs text-foreground/50 mt-0.5">{album.description}</p>
                  )}
                  <p className="text-xs text-foreground/40 mt-1">
                    {album.images.length} photo{album.images.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startUpload(album._id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Photos
                  </button>
                  <button
                    onClick={() => deleteAlbum(album._id)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Upload panel */}
              {uploadingFor === album._id && (
                <div className="px-5 py-4 border-b border-white/10 bg-foreground/5 space-y-3">
                  {/* Hidden file input — triggered programmatically */}
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilePick}
                    className="hidden"
                    key={uploadingFor}
                  />

                  {/* Choose photos button (shown when no files picked yet) */}
                  {pendingFiles.length === 0 && (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-foreground/60 text-sm hover:bg-foreground/5 transition-all"
                    >
                      <Upload className="w-4 h-4" /> Choose Photos
                    </button>
                  )}

                  {/* Preview + caption inputs */}
                  {pendingFiles.length > 0 && (
                    <div className="space-y-2">
                      {pendingFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img
                            src={URL.createObjectURL(f.file)}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
                          />
                          <input
                            value={f.caption}
                            onChange={(e) => updateCaption(i, e.target.value)}
                            placeholder="Who's in this photo? (e.g. Mom & Dad)"
                            className="flex-1 px-3 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {pendingFiles.length > 0 && (
                      <>
                        <button
                          onClick={uploadImages}
                          className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all"
                        >
                          Upload {pendingFiles.length} photo{pendingFiles.length > 1 ? "s" : ""}
                        </button>
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="px-4 py-2 rounded-xl text-foreground/50 border border-white/10 text-sm hover:bg-foreground/5 transition-all"
                        >
                          Change Files
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => { setUploadingFor(null); setPendingFiles([]); }}
                      className="px-4 py-2 rounded-xl text-foreground/50 border border-white/10 text-sm hover:bg-foreground/5 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Image grid */}
              {album.images.length > 0 && (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {album.images.map((img) => (
                    <div
                      key={img.key}
                      className="relative group rounded-xl overflow-hidden aspect-square border border-white/10"
                    >
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-xs text-white/80 truncate">
                          {img.caption}
                        </div>
                      )}
                      <button
                        onClick={() => deleteImage(album._id, img.key)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState, useRef } from "react";
import { API_BASE, useAdminAuth } from "@/hooks/use-admin-auth";
import { Trash2, Plus, Upload, Link, Music2, Video, Loader2 } from "lucide-react";

interface MusicVideo {
  _id: string;
  title: string;
  description: string;
  instagramUrl: string;
  order: number;
}

interface AudioTrack {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
}

export default function AdminMusic() {
  const { token } = useAdminAuth();
  const [tab, setTab] = useState<"videos" | "audio">("videos");

  const [videos, setVideos] = useState<MusicVideo[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [videoForm, setVideoForm] = useState({ title: "", description: "", instagramUrl: "", order: "0" });
  const [audioForm, setAudioForm] = useState({ title: "", description: "", duration: "", order: "0" });
  const audioFileRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/api/music/videos`).then(r => r.json()),
      fetch(`${API_BASE}/api/music/audio`).then(r => r.json()),
    ]).then(([vd, ad]) => {
      if (vd.success) setVideos(vd.data || []);
      if (ad.success) setTracks(ad.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const addVideo = async () => {
    if (!videoForm.title || !videoForm.instagramUrl) return flash("Title and URL are required");
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/music/videos`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      });
      const d = await res.json();
      if (d.success) {
        setVideos(prev => [d.data, ...prev]);
        setVideoForm({ title: "", description: "", instagramUrl: "", order: "0" });
        flash("Video added!");
      } else flash(d.message || "Failed");
    } catch { flash("Error adding video"); }
    setSaving(false);
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await fetch(`${API_BASE}/api/music/videos/${id}`, { method: "DELETE", headers });
      setVideos(prev => prev.filter(v => v._id !== id));
      flash("Deleted");
    } catch { flash("Error deleting"); }
  };

  const uploadAudio = async () => {
    const file = audioFileRef.current?.files?.[0];
    if (!file) return flash("Please select an audio file");
    if (!audioForm.title) return flash("Title is required");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("audio", file);
      fd.append("title", audioForm.title);
      fd.append("description", audioForm.description);
      fd.append("duration", audioForm.duration);
      fd.append("order", audioForm.order);

      const res = await fetch(`${API_BASE}/api/music/audio`, {
        method: "POST",
        headers,
        body: fd,
      });
      const d = await res.json();
      if (d.success) {
        setTracks(prev => [d.data, ...prev]);
        setAudioForm({ title: "", description: "", duration: "", order: "0" });
        if (audioFileRef.current) audioFileRef.current.value = "";
        flash("Track uploaded!");
      } else flash(d.message || "Failed");
    } catch { flash("Error uploading"); }
    setSaving(false);
  };

  const deleteAudio = async (id: string) => {
    if (!confirm("Delete this track?")) return;
    try {
      await fetch(`${API_BASE}/api/music/audio/${id}`, { method: "DELETE", headers });
      setTracks(prev => prev.filter(t => t._id !== id));
      flash("Deleted");
    } catch { flash("Error deleting"); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Music Manager</h1>

      {msg && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        <button
          onClick={() => setTab("videos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            tab === "videos" ? "bg-primary text-background font-medium" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Video className="w-4 h-4" /> Videos
        </button>
        <button
          onClick={() => setTab("audio")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            tab === "audio" ? "bg-primary text-background font-medium" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Music2 className="w-4 h-4" /> Audio
        </button>
      </div>

      {/* Videos Tab */}
      {tab === "videos" && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
              <Link className="w-4 h-4" /> Add Instagram Reel
            </h2>
            <input
              value={videoForm.title}
              onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Title (e.g. Raag Yaman)"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50"
            />
            <input
              value={videoForm.instagramUrl}
              onChange={e => setVideoForm(f => ({ ...f, instagramUrl: e.target.value }))}
              placeholder="Instagram Reel URL (https://www.instagram.com/reel/...)"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50"
            />
            <textarea
              value={videoForm.description}
              onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 resize-none"
            />
            <input
              type="number"
              value={videoForm.order}
              onChange={e => setVideoForm(f => ({ ...f, order: e.target.value }))}
              placeholder="Order (0 = first)"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={addVideo}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Video
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="text-foreground/40 text-sm">Loading...</div>
          ) : videos.length === 0 ? (
            <div className="text-foreground/40 text-sm p-6 text-center border border-white/10 rounded-2xl">No videos yet.</div>
          ) : (
            <div className="space-y-3">
              {videos.map(v => (
                <div key={v._id} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
                  <div className="min-w-0">
                    <p className="text-foreground font-medium text-sm truncate">{v.title}</p>
                    <p className="text-foreground/40 text-xs truncate mt-0.5">{v.instagramUrl}</p>
                    {v.description && <p className="text-foreground/50 text-xs mt-1">{v.description}</p>}
                  </div>
                  <button
                    onClick={() => deleteVideo(v._id)}
                    className="text-red-400 hover:text-red-300 flex-shrink-0 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audio Tab */}
      {tab === "audio" && (
        <div className="space-y-6">
          {/* Upload form */}
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Audio Track
            </h2>
            <input
              value={audioForm.title}
              onChange={e => setAudioForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Track title (e.g. Tum Hi Ho Cover)"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50"
            />
            <textarea
              value={audioForm.description}
              onChange={e => setAudioForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 resize-none"
            />
            <input
              value={audioForm.duration}
              onChange={e => setAudioForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="Duration (e.g. 3:24) — optional"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50"
            />
            <div className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground/60">
              <input
                ref={audioFileRef}
                type="file"
                accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.mp4,video/mp4"
                className="w-full text-foreground/70 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-xs file:cursor-pointer"
              />
            </div>
            <input
              type="number"
              value={audioForm.order}
              onChange={e => setAudioForm(f => ({ ...f, order: e.target.value }))}
              placeholder="Order (0 = first)"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={uploadAudio}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload Track
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="text-foreground/40 text-sm">Loading...</div>
          ) : tracks.length === 0 ? (
            <div className="text-foreground/40 text-sm p-6 text-center border border-white/10 rounded-2xl">No tracks yet.</div>
          ) : (
            <div className="space-y-3">
              {tracks.map(t => (
                <div key={t._id} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
                  <div className="min-w-0">
                    <p className="text-foreground font-medium text-sm truncate">{t.title}</p>
                    {t.description && <p className="text-foreground/50 text-xs mt-0.5">{t.description}</p>}
                    {t.duration && <p className="text-foreground/30 text-xs mt-0.5">{t.duration}</p>}
                  </div>
                  <button
                    onClick={() => deleteAudio(t._id)}
                    className="text-red-400 hover:text-red-300 flex-shrink-0 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
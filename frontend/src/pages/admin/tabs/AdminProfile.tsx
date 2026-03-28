import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Save, Upload, Trash2, FileText } from "lucide-react";

interface ProfileImage { key: string; url: string; label: string; }
interface Profile {
  name: string; tagline: string; bio: string; aboutBio: string;
  email: string; phone: string[]; location: string;
  linkedin: string; github: string; instagram: string;
  profileImages: ProfileImage[]; resumeUrl: string;
}

const IMAGE_LABELS = ["professional", "casual", "gym", "travel", "suit", "event"];

const ABOUT_PLACEHOLDER = `Write your full About You story here. Use new lines to separate paragraphs — each new line becomes a separate paragraph on the site.

Tip: The last paragraph will appear in a highlighted gradient style, so end with something punchy like "Life so far has been a remarkable journey — and I'm only just getting started."`;

export function AdminProfile() {
  const { token } = useAdminAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savedAbout, setSavedAbout] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgLabel, setImgLabel] = useState("professional");
  const [uploading, setUploading] = useState(false);
  const [aboutBio, setAboutBio] = useState("");
  const [charCount, setCharCount] = useState(0);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`, { headers })
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setProfile(d.data);
          setForm(d.data);
          setAboutBio(d.data.aboutBio || "");
          setCharCount((d.data.aboutBio || "").length);
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API_BASE}/api/profile`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveAbout = async () => {
    setSavingAbout(true);
    await fetch(`${API_BASE}/api/profile`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, aboutBio }),
    });
    setSavingAbout(false);
    setSavedAbout(true);
    setTimeout(() => setSavedAbout(false), 2000);
  };

  const uploadImage = async () => {
    if (!imgFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", imgFile);
    fd.append("label", imgLabel);
    const res = await fetch(`${API_BASE}/api/profile/images`, { method: "POST", headers, body: fd });
    const data = await res.json();
    if (data.profile) setProfile(data.profile);
    setImgFile(null);
    setUploading(false);
  };

  const deleteImage = async (key: string) => {
    const res = await fetch(`${API_BASE}/api/profile/images/${encodeURIComponent(key)}`, { method: "DELETE", headers });
    const data = await res.json();
    if (data.profile) setProfile(data.profile);
  };

  const field = (label: string, key: keyof Profile, type = "text") => (
    <div key={key}>
      <label className="text-xs font-medium text-foreground/60 mb-1 block">{label}</label>
      <input
        type={type}
        value={(form[key] as string) || ""}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">

      {/* ── About You Section ── */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">About You</h3>
        </div>
        <p className="text-xs text-foreground/40 mb-4">
          This controls the "My Journey" section on the homepage. Use a blank line between paragraphs.
          The last paragraph will be displayed in a highlighted gradient style.
        </p>

        <textarea
          rows={18}
          value={aboutBio}
          onChange={e => {
            setAboutBio(e.target.value);
            setCharCount(e.target.value.length);
          }}
          placeholder={ABOUT_PLACEHOLDER}
          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-foreground/30">{charCount} characters</span>
          <button
            onClick={handleSaveAbout}
            disabled={savingAbout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 text-sm font-medium disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {savedAbout ? "Saved ✓" : savingAbout ? "Saving..." : "Save About"}
          </button>
        </div>
      </div>

      {/* ── Profile Info ── */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-foreground mb-5">Profile Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Full Name", "name")}
          {field("Email", "email", "email")}
          {field("Location", "location")}
          {field("LinkedIn URL", "linkedin", "url")}
          {field("GitHub URL", "github", "url")}
          {field("Instagram URL", "instagram", "url")}
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-foreground/60 mb-1 block">Tagline</label>
          <input
            value={(form.tagline as string) || ""}
            onChange={e => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Your tagline..."
          />
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-foreground/60 mb-1 block">
            Short Bio <span className="text-foreground/30">(used in hero/meta sections)</span>
          </label>
          <textarea
            rows={3}
            value={(form.bio as string) || ""}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            placeholder="Short bio for hero section..."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 text-sm font-medium disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved ✓" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ── Profile Images ── */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-foreground mb-5">Profile Photos</h3>
        <div className="flex gap-3 mb-5 flex-wrap">
          <select
            value={imgLabel}
            onChange={e => setImgLabel(e.target.value)}
            className="px-3 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
          >
            {IMAGE_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground text-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            {imgFile ? imgFile.name : "Choose Photo"}
            <input type="file" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files?.[0] || null)} />
          </label>
          {imgFile && (
            <button
              onClick={uploadImage}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium disabled:opacity-50 hover:bg-primary/30 transition-all"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>
        {profile?.profileImages && profile.profileImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.profileImages.map(img => (
              <div key={img.key} className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-square">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <span className="text-white text-xs font-medium capitalize">{img.label}</span>
                  <button
                    onClick={() => deleteImage(img.key)}
                    className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/30 text-sm text-center py-6">No profile photos yet.</p>
        )}
      </div>
    </div>
  );
}
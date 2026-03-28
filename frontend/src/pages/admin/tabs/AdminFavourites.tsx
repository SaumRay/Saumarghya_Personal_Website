import { useEffect, useState, useRef } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Plus, Trash2, Save, Heart, Star, Pencil, X, Upload } from "lucide-react";

interface FavouriteItem {
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: string;
  isTop3: boolean;
  order: number;
}

interface FavouriteCategory {
  _id: string;
  category: string;
  label: string;
  emoji: string;
  note: string;
  isDefault: boolean;
  items: FavouriteItem[];
  order: number;
}

const emptyItem = () => ({
  name: "", description: "", imageUrl: "", rating: "",
  isTop3: false, order: 0, sport: "", itemType: ""
});

const getPlaceholders = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("movie") || l.includes("show"))
    return { name: "e.g. Interstellar", desc: "Why you love it", rating: "e.g. 9/10" };
  if (l.includes("music") || l.includes("artist"))
    return { name: "e.g. Arijit Singh", desc: "What makes them special", rating: "e.g. 10/10" };
  if (l.includes("food") || l.includes("cuisine"))
    return { name: "e.g. Butter Chicken", desc: "Where you love having it", rating: "e.g. 9/10" };
  if (l.includes("sport") || l.includes("team"))
    return { name: "e.g. Virat Kohli / CSK", desc: "Why they're special to you", rating: "e.g. GOAT" };
  return { name: "Name *", desc: "Why you love it (optional)", rating: "Rating (optional)" };
};

const SPORT_SUBCATEGORIES = [
  { value: "", label: "— Select sport —" },
  { value: "Cricket", label: "🏏 Cricket" },
  { value: "Football", label: "⚽ Football" },
  { value: "Kabaddi", label: "🤼 Kabaddi" },
  { value: "Tennis", label: "🎾 Tennis" },
  { value: "Basketball", label: "🏀 Basketball" },
  { value: "Badminton", label: "🏸 Badminton" },
  { value: "WWE", label: "🥊 WWE" },
  { value: "Formula 1", label: "🏎️ Formula 1" },
  { value: "Rugby", label: "🏉 Rugby" },
  { value: "Olympics", label: "🏅 Olympics" },
  { value: "Other", label: "🎯 Other" },
];

const SPORT_ITEM_TYPES = [
  { value: "", label: "— Select type —" },
  { value: "Player", label: "👤 Player / Sportsperson" },
  { value: "Team", label: "🏟️ Team / Club" },
  { value: "Sport", label: "🎯 Sport (general)" },
];

type ItemFormState = ReturnType<typeof emptyItem>;

export function AdminFavourites() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<FavouriteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [newItem, setNewItem] = useState<ItemFormState>(emptyItem());
  const [addingItem, setAddingItem] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItemFormState>(emptyItem());
  const [saving, setSaving] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState("");
  const [noteEdit, setNoteEdit] = useState<Record<string, string>>({});
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("⭐");

  const addImageRef = useRef<HTMLInputElement>(null);
  const editImageRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const fetchCategories = async (preserveNotes = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/favourites`);
      const d = await res.json();
      if (d.success) {
        setCategories(d.data);
        if (!activeCategory && d.data.length > 0) setActiveCategory(d.data[0]._id);
        if (!preserveNotes) {
          const notes: Record<string, string> = {};
          d.data.forEach((c: FavouriteCategory) => { notes[c._id] = c.note || ""; });
          setNoteEdit(notes);
        }
      }
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(false); }, []);

  // Upload image to S3 and return URL
  const uploadImage = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API_BASE}/api/favourites/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const d = await res.json();
      if (d.success) return d.url;
      flash("Image upload failed");
      return "";
    } catch {
      flash("Image upload error");
      return "";
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setNewItem(i => ({ ...i, imageUrl: url }));
  };

  const handleEditImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setEditItem(i => ({ ...i, imageUrl: url }));
  };

  const saveNote = async (catId: string) => {
    setSavingNote(true);
    try {
      const res = await fetch(`${API_BASE}/api/favourites/${catId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ note: noteEdit[catId] || "" }),
      });
      const d = await res.json();
      if (d.success) { fetchCategories(true); flash("Note saved!"); }
      else flash(d.message || "Failed");
    } catch { flash("Error"); }
    setSavingNote(false);
  };

  const createCategory = async () => {
    if (!newCatLabel.trim()) return flash("Label is required");
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/favourites`, {
        method: "POST",
        headers,
        body: JSON.stringify({ label: newCatLabel.trim(), emoji: newCatEmoji }),
      });
      const d = await res.json();
      if (d.success) {
        setCreatingCategory(false);
        setNewCatLabel("");
        setNewCatEmoji("⭐");
        fetchCategories(true);
        flash("Category created!");
      } else flash(d.message || "Failed");
    } catch { flash("Error"); }
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its items?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/favourites/${id}`, { method: "DELETE", headers });
      const d = await res.json();
      if (d.success) { fetchCategories(true); flash("Deleted"); }
      else flash(d.message || "Cannot delete default categories");
    } catch { flash("Error"); }
  };

  const isSportsCategory = (label: string) =>
    label.toLowerCase().includes("sport") || label.toLowerCase().includes("team");

  const buildDescription = (item: ItemFormState, isSports: boolean) => {
    if (isSports && (item.sport || item.itemType)) {
      const tag = [item.itemType, item.sport].filter(Boolean).join(" • ");
      return item.description?.trim() ? `${tag} — ${item.description}` : tag;
    }
    return item.description || "";
  };

  const addItem = async () => {
    if (!newItem.name.trim()) return flash("Name is required");
    const isSports = isSportsCategory(activeCat?.label || "");
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/favourites/${activeCategory}/items`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: newItem.name,
          description: buildDescription(newItem, isSports),
          imageUrl: newItem.imageUrl || "",
          rating: newItem.rating || "",
          isTop3: newItem.isTop3,
          order: newItem.order,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setNewItem(emptyItem());
        setAddingItem(false);
        fetchCategories(true);
        flash("Item added!");
      } else flash(d.message || "Failed");
    } catch { flash("Error"); }
    setSaving(false);
  };

  const startEdit = (item: FavouriteItem, index: number) => {
    setEditingIndex(index);
    setEditItem({
      name: item.name,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      rating: item.rating || "",
      isTop3: item.isTop3,
      order: item.order,
      sport: "",
      itemType: "",
    });
  };

  const saveEdit = async () => {
    if (!editItem.name.trim()) return flash("Name is required");
    if (editingIndex === null) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/favourites/${activeCategory}/items/${editingIndex}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: editItem.name,
          description: editItem.description,
          imageUrl: editItem.imageUrl,
          rating: editItem.rating,
          isTop3: editItem.isTop3,
          order: editItem.order,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setEditingIndex(null);
        fetchCategories(true);
        flash("Item updated!");
      } else flash(d.message || "Failed");
    } catch { flash("Error"); }
    setSaving(false);
  };

  const toggleTop3 = async (catId: string, itemIndex: number, current: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/api/favourites/${catId}/items/${itemIndex}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ isTop3: !current }),
      });
      const d = await res.json();
      if (d.success) fetchCategories(true);
      else flash(d.message || "Failed");
    } catch { flash("Error"); }
  };

  const deleteItem = async (catId: string, itemIndex: number) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/favourites/${catId}/items/${itemIndex}`, {
        method: "DELETE", headers,
      });
      const d = await res.json();
      if (d.success) { fetchCategories(true); flash("Deleted"); }
    } catch { flash("Error"); }
  };

  const activeCat = categories.find(c => c._id === activeCategory);
  const top3Count = activeCat?.items.filter(i => i.isTop3).length || 0;
  const ph = getPlaceholders(activeCat?.label || "");
  const isSports = isSportsCategory(activeCat?.label || "");

  // Reusable image upload field
  const ImageUploadField = ({
    value, fileRef, onChange, onPick
  }: {
    value: string;
    fileRef: React.RefObject<HTMLInputElement| null>;
    onChange: (url: string) => void;
    onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="space-y-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="hidden"
      />
      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
          <div className="flex flex-col gap-1">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingImage}
              className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-white/10 text-foreground/60 text-xs hover:bg-foreground/10 transition-all"
            >
              {uploadingImage ? "Uploading..." : "Change Image"}
            </button>
            <button
              onClick={() => onChange("")}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploadingImage}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/60 text-sm hover:bg-foreground/10 transition-all w-full justify-center"
        >
          <Upload className="w-4 h-4" />
          {uploadingImage ? "Uploading..." : "Upload Image (optional)"}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">My Favourites</h2>
        <button
          onClick={() => setCreatingCategory(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
          {msg}
        </div>
      )}

      {/* Create category form */}
      {creatingCategory && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 mb-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">New Category</h3>
          <div className="flex gap-3">
            <input
              value={newCatEmoji}
              onChange={e => setNewCatEmoji(e.target.value)}
              placeholder="Emoji"
              className="w-16 px-3 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none text-center"
            />
            <input
              value={newCatLabel}
              onChange={e => setNewCatLabel(e.target.value)}
              placeholder="Category name (e.g. Video Games)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={createCategory} disabled={saving}
              className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all">
              Create
            </button>
            <button onClick={() => { setCreatingCategory(false); setNewCatLabel(""); setNewCatEmoji("⭐"); }}
              className="px-4 py-2 rounded-xl text-foreground/50 border border-white/10 text-sm hover:bg-foreground/5 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-foreground/50">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 border border-white/10 text-foreground/50 text-center">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No categories yet. Create one!
        </div>
      ) : (
        <div className="space-y-4">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <div key={cat._id} className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveCategory(cat._id);
                    setAddingItem(false);
                    setEditingIndex(null);
                    setNewItem(emptyItem());
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    activeCategory === cat._id
                      ? "bg-primary/20 text-primary border-primary/20"
                      : "text-foreground/50 border-white/10 hover:text-foreground"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
                {!cat.isDefault && (
                  <button onClick={() => deleteCategory(cat._id)}
                    className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {activeCat && (
            <div className="space-y-4">

              {/* Preference note */}
              <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-3">
                <label className="text-xs font-medium text-foreground/60 block">
                  Preference Note <span className="text-foreground/30">(optional — shown to visitors)</span>
                </label>
                <textarea
                  rows={3}
                  value={noteEdit[activeCat._id] ?? activeCat.note}
                  onChange={e => setNoteEdit(n => ({ ...n, [activeCat._id]: e.target.value }))}
                  placeholder={
                    isSports
                      ? "e.g. Huge cricket fan, follow IPL closely. CSK for life 💛"
                      : "e.g. I prefer psychological thrillers over action films..."
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button onClick={() => saveNote(activeCat._id)} disabled={savingNote}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" />
                  {savingNote ? "Saving..." : "Save Note"}
                </button>
              </div>

              {/* Items panel */}
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {activeCat.emoji} {activeCat.label}
                      <span className="text-foreground/40 font-normal text-sm ml-2">
                        {activeCat.items.length} item{activeCat.items.length !== 1 ? "s" : ""}
                      </span>
                    </h3>
                    <p className="text-xs text-foreground/40 mt-0.5">⭐ Top 3 selected: {top3Count}/3</p>
                  </div>
                  <button
                    onClick={() => { setAddingItem(true); setEditingIndex(null); setNewItem(emptyItem()); }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                {/* Add item form */}
                {addingItem && (
                  <div className="px-5 py-4 border-b border-white/10 bg-foreground/5 space-y-3">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">New Item</p>

                    {isSports && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Sport</label>
                          <select value={newItem.sport}
                            onChange={e => setNewItem(i => ({ ...i, sport: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none">
                            {SPORT_SUBCATEGORIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Type</label>
                          <select value={newItem.itemType}
                            onChange={e => setNewItem(i => ({ ...i, itemType: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none">
                            {SPORT_ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    <input value={newItem.name}
                      onChange={e => setNewItem(i => ({ ...i, name: e.target.value }))}
                      placeholder={ph.name}
                      className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none" />
                    <input value={newItem.description}
                      onChange={e => setNewItem(i => ({ ...i, description: e.target.value }))}
                      placeholder={ph.desc}
                      className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none" />
                    <input value={newItem.rating}
                      onChange={e => setNewItem(i => ({ ...i, rating: e.target.value }))}
                      placeholder={ph.rating}
                      className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none" />

                    <ImageUploadField
                      value={newItem.imageUrl || ""}
                      fileRef={addImageRef}
                      onChange={(url) => setNewItem(i => ({ ...i, imageUrl: url }))}
                      onPick={handleAddImagePick}
                    />

                    <label className="flex items-center gap-3 cursor-pointer w-fit">
                      <div onClick={() => setNewItem(i => ({ ...i, isTop3: !i.isTop3 }))}
                        className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${newItem.isTop3 ? "bg-yellow-400/80" : "bg-foreground/20"}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${newItem.isTop3 ? "left-5" : "left-0.5"}`} />
                      </div>
                      <span className="text-xs text-foreground/60">
                        Mark as Top 3 pick {top3Count >= 3 && !newItem.isTop3 ? "(limit reached)" : ""}
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <button onClick={addItem} disabled={saving}
                        className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all disabled:opacity-50">
                        <Save className="w-3.5 h-3.5 inline mr-1" /> Save Item
                      </button>
                      <button onClick={() => { setAddingItem(false); setNewItem(emptyItem()); }}
                        className="px-4 py-2 rounded-xl text-foreground/50 border border-white/10 text-sm hover:bg-foreground/5 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Items list */}
                {activeCat.items.length === 0 ? (
                  <div className="px-5 py-8 text-foreground/40 text-sm text-center">
                    No items yet. Add your first favourite!
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {activeCat.items.map((item, index) => (
                      <div key={index}>
                        {/* View row */}
                        {editingIndex !== index ? (
                          <div className={`flex items-center gap-4 px-5 py-3 ${item.isTop3 ? "bg-yellow-400/5" : ""}`}>
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {item.isTop3 && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                                <p className="font-medium text-foreground text-sm">{item.name}</p>
                                {item.rating && <span className="text-xs text-yellow-400">⭐ {item.rating}</span>}
                              </div>
                              {item.description && (
                                <p className="text-foreground/50 text-xs mt-0.5">{item.description}</p>
                              )}
                            </div>
                            {/* Action buttons */}
                            <button onClick={() => startEdit(item, index)}
                              title="Edit"
                              className="w-8 h-8 rounded-lg bg-foreground/5 text-foreground/40 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => toggleTop3(activeCat._id, index, item.isTop3)}
                              title={item.isTop3 ? "Remove from Top 3" : "Add to Top 3"}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                item.isTop3 ? "bg-yellow-400/20 text-yellow-400" : "bg-foreground/5 text-foreground/30 hover:text-yellow-400 hover:bg-yellow-400/10"
                              }`}>
                              <Star className={`w-3.5 h-3.5 ${item.isTop3 ? "fill-yellow-400" : ""}`} />
                            </button>
                            <button onClick={() => deleteItem(activeCat._id, index)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          /* Inline edit form */
                          <div className="px-5 py-4 bg-foreground/5 space-y-3 border-l-2 border-primary/40">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Editing Item</p>
                              <button onClick={() => setEditingIndex(null)}
                                className="text-foreground/40 hover:text-foreground">
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <input value={editItem.name}
                              onChange={e => setEditItem(i => ({ ...i, name: e.target.value }))}
                              placeholder={ph.name}
                              className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none" />
                            <input value={editItem.description}
                              onChange={e => setEditItem(i => ({ ...i, description: e.target.value }))}
                              placeholder={ph.desc}
                              className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none" />
                            <input value={editItem.rating}
                              onChange={e => setEditItem(i => ({ ...i, rating: e.target.value }))}
                              placeholder={ph.rating}
                              className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none" />

                            <ImageUploadField
                              value={editItem.imageUrl || ""}
                              fileRef={editImageRef}
                              onChange={(url) => setEditItem(i => ({ ...i, imageUrl: url }))}
                              onPick={handleEditImagePick}
                            />

                            <label className="flex items-center gap-3 cursor-pointer w-fit">
                              <div onClick={() => setEditItem(i => ({ ...i, isTop3: !i.isTop3 }))}
                                className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${editItem.isTop3 ? "bg-yellow-400/80" : "bg-foreground/20"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${editItem.isTop3 ? "left-5" : "left-0.5"}`} />
                              </div>
                              <span className="text-xs text-foreground/60">Top 3 pick</span>
                            </label>

                            <div className="flex gap-2">
                              <button onClick={saveEdit} disabled={saving}
                                className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/30 transition-all disabled:opacity-50">
                                <Save className="w-3.5 h-3.5 inline mr-1" /> Save Changes
                              </button>
                              <button onClick={() => setEditingIndex(null)}
                                className="px-4 py-2 rounded-xl text-foreground/50 border border-white/10 text-sm hover:bg-foreground/5 transition-all">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAdminAuth, API_BASE } from "@/hooks/use-admin-auth";
import { Plus, Save, Trash2 } from "lucide-react";

type Category = "traveller" | "fitness";

interface StatItem {
  label: string;
  value: string;
  muscleGroup?: string;
}

interface CategoryDetail {
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  stats: StatItem[];
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "traveller", label: "Travelling" },
  { value: "fitness", label: "Fitness & Gym" },
];

const MUSCLE_GROUPS = [
  "Chest", "Back", "Biceps", "Triceps", "Shoulders", "Abs", "Legs", "Cardio", "Other"
];

const emptyDetail = (category: Category): CategoryDetail => ({
  category,
  title: "",
  subtitle: "",
  description: "",
  stats: [{ label: "", value: "", muscleGroup: "" }],
});

export function AdminCategoryDetails() {
  const { token } = useAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category>("traveller");
  const [form, setForm] = useState<CategoryDetail>(emptyDetail("traveller"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchCategoryDetail = async (category: Category) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/category-details/${category}`);
      const data = await res.json();
      if (data.success && data.data) {
        setForm({
          category,
          title: data.data.title || "",
          subtitle: data.data.subtitle || "",
          description: data.data.description || "",
          stats: data.data.stats?.length
            ? data.data.stats
            : [{ label: "", value: "", muscleGroup: "" }],
        });
      } else {
        setForm(emptyDetail(category));
      }
    } catch {
      setForm(emptyDetail(category));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetail(selectedCategory);
  }, [selectedCategory]);

  const updateStat = (index: number, key: keyof StatItem, value: string) => {
    const next = [...form.stats];
    next[index] = { ...next[index], [key]: value };
    setForm({ ...form, stats: next });
  };

  const addStat = () => {
    setForm({ ...form, stats: [...form.stats, { label: "", value: "", muscleGroup: "" }] });
  };

  const removeStat = (index: number) => {
    const next = form.stats.filter((_, i) => i !== index);
    setForm({ ...form, stats: next.length ? next : [{ label: "", value: "", muscleGroup: "" }] });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const cleanStats = form.stats.filter((s) => s.label.trim() && s.value.trim());
    try {
      const res = await fetch(`${API_BASE}/api/category-details/${selectedCategory}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          stats: cleanStats,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const isFitness = selectedCategory === "fitness";

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Category Stats & Details</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category)}
          className="px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-6 border border-white/10 text-foreground/50">
          Loading details...
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          {/* Title, Subtitle, Description — unchanged */}
          <div>
            <label className="text-xs font-medium text-foreground/60 mb-1 block">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Fitness & Gym"
              className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 mb-1 block">Subtitle</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="A short one-line intro"
              className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 mb-1 block">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Write something meaningful about this interest..."
              className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Stats Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-foreground/60 block">Mini Stats</label>
              <button
                onClick={addStat}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            </div>

            {/* Column headers */}
            <div className={`grid gap-3 mb-2 px-1 text-xs text-foreground/40 font-medium ${isFitness ? "grid-cols-[1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_auto]"}`}>
              <span>Label</span>
              <span>Value</span>
              {isFitness && <span>Muscle Group</span>}
              <span></span>
            </div>

            <div className="space-y-3">
              {form.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`grid gap-3 ${isFitness ? "grid-cols-[1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_auto]"}`}
                >
                  <input
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                    placeholder="e.g. Bench Press"
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
                  />
                  <input
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                    placeholder="e.g. 65 kg for 1"
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
                  />
                  {isFitness && (
                    <select
                      value={stat.muscleGroup || ""}
                      onChange={(e) => updateStat(index, "muscleGroup", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground text-sm focus:outline-none"
                    >
                      <option value="">Select group</option>
                      {MUSCLE_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => removeStat(index)}
                    className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 text-sm font-medium disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved ✓" : saving ? "Saving..." : "Save Category Details"}
          </button>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, BarChart3 } from "lucide-react";

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

const FALLBACK_TITLES: Record<Category, string> = {
  traveller: "Travelling",
  fitness: "Fitness & Gym",
};

const MUSCLE_GROUP_ORDER = [
  "Chest", "Back", "Biceps", "Triceps", "Shoulders", "Abs", "Legs", "Cardio", "Other", ""
];

// Groups stats by muscleGroup, preserving order
function groupStatsByMuscle(stats: StatItem[]): Record<string, StatItem[]> {
  const groups: Record<string, StatItem[]> = {};
  for (const stat of stats) {
    const key = stat.muscleGroup?.trim() || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(stat);
  }
  return groups;
}

export default function Stats() {
  const [, setLocation] = useLocation();
  const [detail, setDetail] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const category = new URLSearchParams(window.location.search).get("category") as Category;

  useEffect(() => {
    if (!category) {
      setError("Category is required");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/category-details/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDetail(data.data);
          setError("");
        } else {
          setError(data.message || "Unable to load stats");
        }
      })
      .catch(() => setError("Unable to load stats"))
      .finally(() => setLoading(false));
  }, [category]);

  const isFitness = category === "fitness";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setLocation(`/interests?category=${category}`)}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {loading && <div className="text-foreground/60">Loading stats...</div>}
        {!loading && error && <div className="text-red-400">{error}</div>}

        {!loading && !error && detail && (
          <>
            <div className="mb-10">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mb-5">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                {detail.title || FALLBACK_TITLES[category]}
              </h1>
              {detail.subtitle && (
                <p className="text-lg text-foreground/70 mb-4">{detail.subtitle}</p>
              )}
              {detail.description && (
                <p className="text-foreground/60 max-w-3xl leading-relaxed">{detail.description}</p>
              )}
            </div>

            {detail.stats?.length > 0 ? (
              isFitness ? (
                // ── Grouped view for Fitness ──
                <div className="space-y-10">
                  {MUSCLE_GROUP_ORDER.filter((group) => {
                    const grouped = groupStatsByMuscle(detail.stats);
                    return grouped[group];
                  }).map((group) => {
                    const grouped = groupStatsByMuscle(detail.stats);
                    const groupStats = grouped[group];
                    return (
                      <div key={group}>
                        <h2 className="text-lg font-semibold text-foreground/80 mb-4 pb-2 border-b border-white/10 uppercase tracking-widest text-sm">
                          {group || "Other"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {groupStats.map((stat, index) => (
                            <div
                              key={`${stat.label}-${index}`}
                              className="glass-card rounded-2xl p-5 border border-white/10"
                            >
                              <p className="text-xs uppercase tracking-wide text-foreground/40 mb-2">
                                {stat.label}
                              </p>
                              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // ── Flat view for Traveller and others (unchanged) ──
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {detail.stats.map((stat, index) => (
                    <div
                      key={`${stat.label}-${index}`}
                      className="glass-card rounded-2xl p-5 border border-white/10"
                    >
                      <p className="text-xs uppercase tracking-wide text-foreground/40 mb-2">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="glass-card rounded-2xl p-8 border border-white/10 text-foreground/50">
                No stats added yet for this category.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
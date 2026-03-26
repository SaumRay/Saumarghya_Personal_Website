import { useLocation } from "wouter";
import { ArrowLeft, Images, BarChart3 } from "lucide-react";

type Category = "traveller" | "fitness";

const CATEGORY_META: Record<Category, { title: string; subtitle: string }> = {
  traveller: {
    title: "Travelling",
    subtitle: "Memories, places, and journeys captured across different trips.",
  },
  fitness: {
    title: "Fitness & Gym",
    subtitle: "Discipline, consistency, progress, and the numbers behind the journey.",
  },
};

export default function InterestCategory() {
  const [, setLocation] = useLocation();
  const category = new URLSearchParams(window.location.search).get("category") as Category;

  if (!category || !CATEGORY_META[category]) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-white/10 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-red-400">Invalid category.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {CATEGORY_META[category].title}
          </h1>
          <p className="text-foreground/60 max-w-2xl">
            {CATEGORY_META[category].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={() => setLocation(`/gallery?category=${category}`)}
            className="glass-card rounded-3xl p-8 border border-white/10 text-left hover:border-primary/30 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-5">
              <Images className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">View Gallery</h2>
            <p className="text-foreground/60">
              Explore photos uploaded under this category.
            </p>
          </button>

          <button
            onClick={() => setLocation(`/stats?category=${category}`)}
            className="glass-card rounded-3xl p-8 border border-white/10 text-left hover:border-secondary/30 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mb-5">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">View Stats</h2>
            <p className="text-foreground/60">
              See personal highlights, milestones, and mini stats for this interest.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

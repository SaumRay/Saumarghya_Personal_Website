import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, Heart, Star } from "lucide-react";

interface FavouriteItem {
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: string;
  order: number;
}

interface FavouriteCategory {
  _id: string;
  category: string;
  label: string;
  emoji: string;
  items: FavouriteItem[];
  order: number;
}

export default function Favourites() {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<FavouriteCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/favourites`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          setCategories(d.data);
          setActiveTab(d.data[0].category);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCategory = categories.find(c => c.category === activeTab);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">My Favourites</h1>
          <p className="text-foreground/60">Things I love, swear by, and keep coming back to.</p>
        </div>

        {loading ? (
          <div className="text-foreground/50">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
            No favourites added yet.
          </div>
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => setActiveTab(cat.category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    activeTab === cat.category
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/20"
                      : "text-foreground/50 border-white/10 hover:text-foreground"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Items grid */}
            {activeCategory && (
              activeCategory.items.length === 0 ? (
                <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
                  Nothing added to {activeCategory.label} yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCategory.items.map((item, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-rose-500/20 transition-all"
                    >
                      {/* Image if available */}
                      {item.imageUrl && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          {item.rating && (
                            <span className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400" /> {item.rating}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-foreground/50 text-sm mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
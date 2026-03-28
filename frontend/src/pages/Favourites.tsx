import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, Heart, Star } from "lucide-react";

interface FavouriteItem {
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: string;
  isTop3: boolean;
  order: number;
  musicType?: "artist" | "song";
  artistName?: string;
}

interface FavouriteCategory {
  _id: string;
  category: string;
  label: string;
  emoji: string;
  note: string;
  items: FavouriteItem[];
  order: number;
}

type MusicSubTab = "artist" | "song";

function ItemCard({ item, highlight }: { item: FavouriteItem; highlight?: boolean }) {
  return (
    <div className={`glass-card rounded-2xl border overflow-hidden hover:border-rose-500/20 transition-all ${
      highlight ? "border-yellow-400/30 bg-yellow-400/5" : "border-white/10"
    }`}>
      {item.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {highlight && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
            <h3 className="font-semibold text-foreground">{item.name}</h3>
          </div>
          {item.rating && (
            <span className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0 text-right max-w-[45%] break-words">
              ⭐ {item.rating}
            </span>
          )}
        </div>
        {/* Artist name for songs */}
        {item.musicType === "song" && item.artistName && (
          <p className="text-foreground/40 text-xs mt-0.5 italic">by {item.artistName}</p>
        )}
        {item.description && (
          <p className="text-foreground/50 text-sm mt-1">{item.description}</p>
        )}
      </div>
    </div>
  );
}

export default function Favourites() {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<FavouriteCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [musicSubTab, setMusicSubTab] = useState<MusicSubTab>("artist");
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
  const isMusicCategory = (label: string) =>
    label.toLowerCase().includes("music") || label.toLowerCase().includes("artist");
  const isMusic = isMusicCategory(activeCategory?.label || "");

  // For music: filter by sub-tab; for others: use all items
  const visibleItems = isMusic
    ? activeCategory?.items.filter(i => i.musicType === musicSubTab) || []
    : activeCategory?.items || [];

  const top3Items = visibleItems.filter(i => i.isTop3);
  const restItems = visibleItems.filter(i => !i.isTop3);

  const artistCount = activeCategory?.items.filter(i => i.musicType === "artist").length || 0;
  const songCount = activeCategory?.items.filter(i => i.musicType === "song").length || 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        <button onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

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
            {/* ── Category tabs ── */}
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map(cat => (
                <button key={cat.category} onClick={() => setActiveTab(cat.category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    activeTab === cat.category
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/20"
                      : "text-foreground/50 border-white/10 hover:text-foreground"
                  }`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {activeCategory && (
              <div className="space-y-8">

                {/* Preference note */}
                {activeCategory.note && (
                  <div className="glass-card rounded-2xl p-5 border border-white/10 text-foreground/70 text-sm leading-relaxed italic">
                    💬 {activeCategory.note}
                  </div>
                )}

                {/* ── Music sub-tabs ── */}
                {isMusic && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMusicSubTab("artist")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        musicSubTab === "artist"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/20"
                          : "text-foreground/50 border-white/10 hover:text-foreground"
                      }`}
                    >
                      🎤 Artists
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        musicSubTab === "artist" ? "bg-purple-500/20" : "bg-white/10"
                      }`}>
                        {artistCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setMusicSubTab("song")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        musicSubTab === "song"
                          ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/20"
                          : "text-foreground/50 border-white/10 hover:text-foreground"
                      }`}
                    >
                      🎵 Songs
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        musicSubTab === "song" ? "bg-cyan-500/20" : "bg-white/10"
                      }`}>
                        {songCount}
                      </span>
                    </button>
                  </div>
                )}

                {/* ── Top 3 ── */}
                {top3Items.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400" /> Top {top3Items.length} Picks
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {top3Items.map((item, i) => <ItemCard key={i} item={item} highlight />)}
                    </div>
                  </div>
                )}

                {/* ── Rest ── */}
                {restItems.length > 0 && (
                  <div>
                    {top3Items.length > 0 && (
                      <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-widest mb-4">
                        More {isMusic ? (musicSubTab === "artist" ? "Artists" : "Songs") : activeCategory.label}
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {restItems.map((item, i) => <ItemCard key={i} item={item} />)}
                    </div>
                  </div>
                )}

                {/* ── Empty state ── */}
                {visibleItems.length === 0 && (
                  <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
                    {isMusic
                      ? `No ${musicSubTab === "artist" ? "artists" : "songs"} added yet.`
                      : `Nothing added to ${activeCategory.label} yet.`}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
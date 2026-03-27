import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, Users, Images, ChevronRight } from "lucide-react";

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
  coverImageUrl?: string;
  images: GalleryImage[];
}

const TABS: { value: SubCategory; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];

export default function FamilyFriends() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<SubCategory>("family");
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedAlbum(null); // reset album view on tab switch
    fetch(`${API_BASE}/api/gallery/category/${activeTab}`)
      .then((r) => r.json())
      .then((d) => setAlbums(d.success ? d.data : []))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const visibleAlbums = albums.filter((a) => a.images.length > 0);

  // ── Cover image fallback ─────────────────────────────────────────────────────
  const getCover = (album: GalleryAlbum) =>
    album.coverImageUrl || album.images[0]?.url || null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Back button ── */}
        <button
          onClick={() => {
            if (selectedAlbum) {
              setSelectedAlbum(null);
            } else {
              setLocation("/");
            }
          }}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedAlbum ? "Back to Albums" : "Back"}
        </button>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {selectedAlbum ? selectedAlbum.label : "Family & Friends"}
          </h1>
          <p className="text-foreground/60">
            {selectedAlbum
              ? selectedAlbum.description || ""
              : "The people who keep me grounded — my family and my college squad."}
          </p>
        </div>

        {/* ── Tabs (only shown on album list view) ── */}
        {!selectedAlbum && (
          <div className="flex gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                    : "text-foreground/50 hover:text-foreground border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="text-foreground/60">Loading albums...</div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 1 — Album grid
        ══════════════════════════════════════════════════════════════════════ */}
        {!loading && !selectedAlbum && (
          <>
            {visibleAlbums.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No albums here yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleAlbums.map((album) => {
                  const cover = getCover(album);
                  return (
                    <button
                      key={album._id}
                      onClick={() => setSelectedAlbum(album)}
                      className="group text-left rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 bg-card/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-1"
                    >
                      {/* Cover photo */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                        {cover ? (
                          <img
                            src={cover}
                            alt={album.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Images className="w-10 h-10 text-white/20" />
                          </div>
                        )}

                        {/* Photo count pill */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/80 text-xs font-medium">
                          {album.images.length} photo{album.images.length !== 1 ? "s" : ""}
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Info row */}
                      <div className="flex items-center justify-between px-4 py-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {album.label}
                          </h3>
                          {album.description && (
                            <p className="text-xs text-foreground/50 mt-0.5 truncate">
                              {album.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground/70 shrink-0 ml-3 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 2 — Selected album image grid
        ══════════════════════════════════════════════════════════════════════ */}
        {!loading && selectedAlbum && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedAlbum.images.map((img) => (
              <div
                key={img.key}
                onClick={() => setSelectedImage(img)}
                className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <img
                  src={img.url}
                  alt={img.caption || "Photo"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="w-full px-3 py-2 text-xs text-white/90 font-medium">
                      {img.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm"
            >
              Close ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="w-full rounded-2xl object-contain max-h-[80vh]"
            />
            {selectedImage.caption && (
              <p className="mt-3 text-center text-white/70 text-sm">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
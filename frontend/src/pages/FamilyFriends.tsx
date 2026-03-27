import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft, Users } from "lucide-react";

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

const TABS: { value: SubCategory; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
];

export default function FamilyFriends() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<SubCategory>("family");
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/gallery/category/${activeTab}`)
      .then((r) => r.json())
      .then((d) => setAlbums(d.success ? d.data : []))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const allImages = albums.flatMap((a) =>
    a.images.map((img) => ({ ...img, albumLabel: a.label }))
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Family & Friends</h1>
          <p className="text-foreground/60">
            The people who keep me grounded — my family and my college squad.
          </p>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        {loading ? (
          <div className="text-foreground/60">Loading photos...</div>
        ) : allImages.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 border border-white/10 text-foreground/50 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No photos here yet.
          </div>
        ) : (
          <div className="space-y-10">
            {albums
              .filter((a) => a.images.length > 0)
              .map((album) => (
                <div key={album._id}>
                  {/* Album title */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">{album.label}</h2>
                    {album.description && (
                      <p className="text-sm text-foreground/50 mt-0.5">{album.description}</p>
                    )}
                  </div>
                  {/* Photo grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {album.images.map((img) => (
                      <div
                        key={img.key}
                        onClick={() => setSelectedImage({ ...img })}
                        className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                      >
                        <img
                          src={img.url}
                          alt={img.caption || "Photo"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Caption on hover */}
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
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
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
              <p className="mt-3 text-center text-white/70 text-sm">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
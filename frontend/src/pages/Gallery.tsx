import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { API_BASE } from "@/hooks/use-admin-auth";
import { ArrowLeft } from "lucide-react";

type GalleryCategory =
  | "traveller"
  | "fitness"
  | "professional"
  | "college"
  | "family"
  | "events"
  | "other";

interface GalleryImage {
  key: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

interface GalleryItem {
  _id: string;
  category: GalleryCategory;
  label: string;
  description: string;
  coverImageUrl: string;
  images: GalleryImage[];
  order: number;
}

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const category = new URLSearchParams(window.location.search).get("category") as GalleryCategory;

  useEffect(() => {
    if (!category) {
      setError("Category is required");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${API_BASE}/api/gallery/category/${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) {
          setError(d.message || "No gallery found");
          setGalleries([]);
        } else {
          setGalleries(d.data || []);
          setError("");
        }
      })
      .catch((err) => {
        console.error("Gallery fetch error:", err);
        setError("Unable to load gallery");
      })
      .finally(() => setLoading(false));
  }, [category]);

  const galleryImages = galleries.flatMap((g) => g.images);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      <button
        onClick={() => setLocation(category ? `/interests?category=${category}` : "/")}
        className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-white/10 text-sm text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Gallery"}
      </h1>

      <p className="text-sm text-foreground/70 mb-6">
        {galleries.length > 0
          ? `Viewing ${galleryImages.length} uploaded photo${galleryImages.length === 1 ? "" : "s"}`
          : "No images yet."}
      </p>

      {loading && <div className="text-foreground/60">Loading…</div>}
      {!loading && error && <div className="text-red-400">{error}</div>}

      {!loading && !error && galleryImages.length === 0 && (
        <div className="text-foreground/50 p-8 rounded-xl border border-white/10">
          No images available for this category.
        </div>
      )}

      {!loading && !error && galleryImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {galleryImages.map((img) => (
            <div
              key={img.key}
              className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-foreground/5"
            >
              <img
                src={img.url}
                alt={img.caption || "Gallery image"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

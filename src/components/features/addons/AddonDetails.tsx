import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DevinsBadges from "@/components/utility/DevinsBadges";
import DOMPurify from "dompurify";
import { ChevronLeft, ChevronRight, Download, Heart } from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Addon {
  id: number;
  createdAt: string;
  project_id: string;
  project_type: string;
  slug: string;
  author: string;
  title: string;
  description: string;
  categories: string[];
  display_categories: string[];
  versions: string[];
  downloads: number;
  follows: number;
  icon_url: string;
  date_created: string;
  date_modified: string;
  latest_version: string;
  license: string;
  client_side: string | null;
  server_side: string;
  gallery: string[];
  featured_gallery: string | null;
  color: string;
  BluePrintChecked: boolean;
  updatedAt: string;
}

export default function AddonDetails() {
  const { slug } = useParams();
  const [addon, setAddon] = useState<Addon | null>(null);
  const [description, setDescription] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddonDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get addon from local storage
        const storedAddons = localStorage.getItem("addonList");
        const addons: Addon[] = storedAddons ? JSON.parse(storedAddons) : [];
        const currentAddon = addons.find((a) => a.slug === slug);

        if (!currentAddon) {
          throw new Error("Addon not found");
        }

        setAddon(currentAddon);

        // Fetch description from Modrinth API
        const response = await fetch(
          `https://api.modrinth.com/v2/project/${slug}`
        );
        if (!response.ok) throw new Error("Failed to fetch addon details");

        const data = await response.json();

        // Properly await marked conversion
        const markedHtml = await marked(data.body);
        const sanitizedHtml = DOMPurify.sanitize(markedHtml, {
          ALLOWED_TAGS: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "a",
            "ul",
            "ol",
            "li",
            "code",
            "pre",
            "strong",
            "em",
            "img",
          ],
          ALLOWED_ATTR: ["href", "src", "alt", "title"],
        });

        setDescription(sanitizedHtml);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load addon details"
        );
        console.error("Error fetching addon details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddonDetails();
  }, [slug]);

  const navigateGallery = (direction: "prev" | "next") => {
    if (!addon) return;

    setCurrentImageIndex((prev) => {
      if (direction === "prev") {
        return prev > 0 ? prev - 1 : prev;
      }
      return prev < addon.gallery.length - 1 ? prev + 1 : prev;
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!addon) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex items-start gap-4">
            <img
              src={addon.icon_url}
              alt=""
              className="w-16 h-16 rounded-lg border"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate mb-2">
                {addon.title}
              </h1>
              <p className="text-foreground-muted">{addon.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-foreground-muted">
                {addon.downloads.toLocaleString()} downloads
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="text-foreground-muted">
                {addon.follows.toLocaleString()} followers
              </span>
            </div>
            <div className="flex-1" />
            <a
              href={`https://modrinth.com/mod/${addon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <DevinsBadges
                type="compact"
                category="available"
                name="modrinth"
                format="png"
                height={46}
              />
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            {addon.versions.map((version) => (
              <Badge key={version} variant="outline">
                {version}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {addon.gallery.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-video overflow-hidden">
                <img
                  src={addon.gallery[currentImageIndex]}
                  alt={`${addon.title} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateGallery("prev")}
                  disabled={currentImageIndex === 0}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateGallery("next")}
                  disabled={currentImageIndex === addon.gallery.length - 1}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1">
                {addon.gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? "bg-primary" : "bg-primary/30"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                    aria-current={idx === currentImageIndex}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 prose prose-neutral dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="markdown-content"
          />
        </CardContent>
      </Card>
    </div>
  );
}

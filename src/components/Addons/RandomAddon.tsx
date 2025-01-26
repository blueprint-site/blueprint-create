import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DevinsBadges from "@/components/utility/DevinsBadges";
import LazyImage from "@/components/utility/LazyImage";
import { type Addon } from "@/stores/addonStore";

const RandomAddon = () => {
  const [addon, setAddon] = useState<Addon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRandomAddon = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem("addonList");
      if (!stored) throw new Error("No addons found");

      const addons = JSON.parse(stored);
      if (!addons?.length) throw new Error("Addon list is empty");

      const randomIndex = Math.floor(Math.random() * addons.length);
      setAddon(addons[randomIndex]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addon");
      console.error(err);
    } finally {
      // Artificial delay for UX
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    getRandomAddon();
  }, [getRandomAddon]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive">{error}</p>
        <Button onClick={getRandomAddon} className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (isLoading || !addon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-32 w-32 rounded-lg mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const backgroundColor = addon.color ? 
    `rgba(${parseInt(addon.color.slice(1,3),16)}, ${parseInt(addon.color.slice(3,5),16)}, ${parseInt(addon.color.slice(5,7),16)}, 0.7)` : 
    "transparent";

  return (
    <div className="container mx-auto px-4 py-8 text-center space-y-8">
      <Link to={`/addons/${addon.slug}`} className="block">
        <Card className="max-w-2xl mx-auto hover:shadow-lg transition-shadow" 
              style={{ backgroundColor }}>
          <CardContent className="p-6 space-y-4">
            <LazyImage
              src={addon.icon_url}
              alt={addon.title}
              className="w-32 h-32 mx-auto rounded-lg"
            />
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{addon.title}</h2>
              <p className="text-muted-foreground">{addon.description}</p>
              <p className="text-sm">Author: {addon.author}</p>
              <p className="text-sm">Versions: {addon.versions.join(", ")}</p>
            </div>

            <a 
              href={`https://modrinth.com/mod/${addon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              onClick={e => e.stopPropagation()}
            >
              <DevinsBadges
                type="compact"
                category="available"
                name="modrinth"
                format="png"
                height={46}
              />
            </a>
          </CardContent>
        </Card>
      </Link>

      <Button 
        size="lg"
        onClick={getRandomAddon}
        className="font-minecraft"
      >
        Get Another Random Addon
      </Button>
    </div>
  );
};

export default RandomAddon;
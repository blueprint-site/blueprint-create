// src/pages/ComingSoon.tsx
import { useEffect, useState } from "react";
import { Cog, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BlueprintLogo from "@/assets/logo.webp";

const ComingSoon = () => {
  const [rotation, setRotation] = useState(0);

  // Rotating cog animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center space-y-8 max-w-2xl">
          {/* Blueprint Logo */}
          <div className="relative">
            <img
              src={BlueprintLogo}
              alt="Blueprint Logo"
              className="h-32 w-32 object-contain"
            />
            <div
              className="absolute -right-6 -bottom-6 bg-blueprint rounded-full p-2"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Cog className="h-8 w-8 text-blueprint-foreground" />
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="w-full bg-surface-1/80 backdrop-blur-sm border-blueprint">
            <CardContent className="p-6 space-y-6">
              <h1 className="text-4xl md:text-5xl font-minecraft text-center bg-clip-text text-transparent bg-gradient-to-r from-blueprint to-primary">
                Coming Soon
              </h1>

              <p className="text-xl md:text-2xl font-minecraft text-center text-foreground">
                When v2? Sooooooon!
              </p>

              <p className="text-foreground-muted">
                We're working hard to bring you the next version of Blueprint - your central
                hub for Create Mod content. Stay tuned for an improved experience with more
                features and a refreshed design.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted">
                <Calendar className="h-4 w-4" />
                <span>Expected Release: Q2 2025</span>
              </div>
            </CardContent>
          </Card>

          {/* Return Button */}
          <Button asChild variant="outline" className="font-minecraft">
            <Link to="/">
              Return to Current Version
            </Link>
          </Button>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
            {["Enhanced Addon Browser", "Improved Schematic Viewer", "Community Collections"].map((feature, index) => (
              <Card key={index} className="bg-surface-1/60 hover:bg-surface-2/60 transition-colors">
                <CardContent className="p-4 text-center">
                  <p className="font-minecraft text-foreground">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative cogwheels in background */}
      <div className="fixed top-1/4 -left-16 opacity-10 z-[-1]">
        <Cog className="h-32 w-32 text-primary" style={{ transform: `rotate(${-rotation}deg)` }} />
      </div>
      <div className="fixed bottom-1/3 -right-20 opacity-10 z-[-1]">
        <Cog className="h-40 w-40 text-blueprint" style={{ transform: `rotate(${rotation}deg)` }} />
      </div>
    </>
  );
};

export default ComingSoon;
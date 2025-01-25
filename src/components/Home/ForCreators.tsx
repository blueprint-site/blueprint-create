// src/components/ForCreators.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import DevinsBadges from "../utility/DevinsBadges";

const ForCreators = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="space-y-2 font-minecraft">
        <h2 className="text-3xl font-bold sm:text-4xl">For Creators</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          We're here to help showcase your addons to the Blueprint community
        </p>
      </div>

      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-xl">Can't find your addon?</CardTitle>
          <CardDescription>
            Let us know and we'll help get your addon listed
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Our addon scanning process is fully automated. Contact us to request
            a rescan and get your addon included in our directory.
          </p>

          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <div className="flex items-center justify-center">
              <DevinsBadges
                type="cozy"
                category="social"
                name="discord-plural"
                height={64}

                format="png"
              />
            </div>

            <Button
              className="h-[64px] text-white/90 text-xl"
              onClick={() =>
                (window.location.href = "mailto:blueprint-site@proton.me")
              }
            >
              <Mail className="mr-2" scale={1.5} />
              Email Us
            </Button>
          </div>

          <div className="flex items-center justify-center mt-4">
            <p className="text-xs text-muted-foreground text-center tracking-wide">
              Email: blueprint-site@proton.me
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForCreators;

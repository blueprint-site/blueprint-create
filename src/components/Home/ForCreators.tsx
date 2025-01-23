// src/components/ForCreators.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MessageSquare } from 'lucide-react';

const ForCreators = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="space-y-2 font-minecraft">
        <h2 className="text-3xl font-bold sm:text-4xl">
          For Creators
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          We're here to help showcase your addons to the Blueprint community
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Can't find your addon?</CardTitle>
          <CardDescription>
            Let us know and we'll help get your addon listed
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-xs text-muted-foreground">
            Our addon scanning process is fully automated. Contact us to request a rescan and get your addon included in our directory.
          </p>

          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <Button
              className="w-full text-white"
              onClick={() =>
                window.open("https://discord.gg/ZF7bwgatrT", "_blank")
              }
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Join our Discord
            </Button>

            <Button
              className="w-full"
              onClick={() =>
                (window.location.href = "mailto:blueprint-site@proton.me")
              }
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Us
            </Button>
          </div>

          <div className="flex items-center justify-center mt-4">
            <p className="text-xs text-muted-foreground text-center">
              Email: blueprint-site@proton.me
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForCreators;

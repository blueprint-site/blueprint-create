import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import supabase from "@/components/utility/Supabase";
import { Mail } from "lucide-react";
import { useState } from "react";

import DiscordLogo from "@/assets/icons/discord-mark-blue.png";
import GithubLogo from "@/assets/icons/github-mark-white.png";
import GoogleLogo from "@/assets/icons/google-mark-color.png";

const LoginPage = () => {
  const [error, setError] = useState("");

  const handleOAuthLogin = async (provider: "google" | "github" | "discord") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/user`,
        },
      });

      if (error) throw error;

      localStorage.setItem("isSignedIn", "true");
      localStorage.setItem("userData", JSON.stringify(data));
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-minecraft">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="grid gap-2">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50"
              onClick={() => handleOAuthLogin("google")}
            >
              <img src={GoogleLogo} alt="Google" className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="bg-[#2D333B] hover:bg-[#22272E] text-white"
              onClick={() => handleOAuthLogin("github")}
            >
              <img src={GithubLogo} alt="Google" className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              onClick={() => handleOAuthLogin("discord")}
            >
              <img src={DiscordLogo} alt="Discord" className="mr-2 h-5 w-5" />
              Continue with Discord
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" disabled>
            <Mail className="mr-2 h-4 w-4" />
            Sign in with Email
          </Button>

          <p className="px-4 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/components/utility/Supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DiscordLogo from "@/assets/icons/discord-mark-white.svg";
import GithubLogo from "@/assets/icons/github-mark-white.svg";
import GoogleLogo from "@/assets/icons/google-mark-color.png";

const AuthPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider: "google" | "github" | "discord") => {
    try {
    
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });

      if (error) {
        console.error("Error while logging", error);
        return; // Exit function instead of throwing
      }

      localStorage.setItem("isSignedIn", "true");
      localStorage.setItem("userData", JSON.stringify(data));
      
      navigate("/user");
    } catch (error) {
      console.error(`Error with ${provider} authentication:`, error);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-minecraft">Welcome to Blueprint</CardTitle>
          <CardDescription>Continue with your preferred method</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="grid gap-2">
            <Button
              variant="outline"
              className="bg-white text-black/80 hover:bg-gray-50"
              onClick={() => handleOAuthLogin("google")}
            >
              <img
                src={GoogleLogo}
                alt="Google"
                className="mr-2 h-5 w-5"
              />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="bg-[#2D333B] hover:bg-[#22272E] text-white"
              onClick={() => handleOAuthLogin("github")}
            >
              <img
                src={GithubLogo}
                alt="GitHub"
                className="mr-2 h-5 w-5"
              />
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              onClick={() => handleOAuthLogin("discord")}
            >
              <img
                src={DiscordLogo}
                alt="Discord"
                className="mr-2 h-5 w-5"
              />
              Continue with Discord
            </Button>
          </div>

          <p className="px-4 text-center text-sm text-foreground-muted">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
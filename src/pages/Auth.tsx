import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "@/lib/appwrite.ts";
import DiscordLogo from "@/assets/icons/discord-mark-white.svg";
import GithubLogo from "@/assets/icons/github-mark-white.svg";
import GoogleLogo from "@/assets/icons/google-mark-color.png";
import { logMessage } from "@/components/utility/logs/sendLogs.tsx";
import { Input } from "@/components/ui/input.tsx";
import { OAuthProvider} from "appwrite";
import {User} from "@/types";

const AuthPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user as User);
      navigate("/user");
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      logMessage(`Error logging in: ${error}`, 2, 'auth');
    }
  };

  const checkSession = async () => {
    try {
      const session = await account.getSession('current');
      if (session) {
        logMessage('User already authenticated, redirecting to user page.', 0, 'auth');
        navigate("/user");
      }
    } catch (error) {
      console.error("Error logging in", error);
      logMessage('No active session found', 2, 'auth');
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github" | "discord") => {
    try {
      logMessage(`Starting OAuth login with ${provider}`, 0, 'auth');

      const providerMap = {
        google: OAuthProvider.Google,
        github: OAuthProvider.Github,
        discord: OAuthProvider.Discord,
      };

      const oauthProvider = providerMap[provider];
      if (!oauthProvider) {
        logMessage(`Unsupported provider: ${provider}`, 2, 'auth');
        setError(`Authentication provider ${provider} is not supported.`);
        return;
      }
    account.createOAuth2Session(
          oauthProvider,
          'http://localhost:5173/user#',
          'http://localhost:5173/login#'
      );

    } catch (error) {
      logMessage(`Error with ${provider} authentication: ${error}`, 2, 'auth');
      console.error(`Error with ${provider} authentication:`, error);
      setError("Authentication failed. Please try again.");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-minecraft">Welcome to Blueprint</CardTitle>
            <CardDescription>Continue with your preferred method</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p>
                {loggedInUser ? `Logged in as ${loggedInUser.name}` : null}
              </p>

              <form onSubmit={e => e.preventDefault()}>
                <div className="grid gap-2">
                  {isRegistering && (
                      <Input
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                      />
                  )}
                  <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                  />
                  <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                      variant="outline"
                      className="bg-white text-black/80 hover:bg-gray-50"
                      onClick={() => isRegistering ? login(email, password) : login(email, password)}
                  >
                    {isRegistering ? 'Register' : 'Login'}
                  </Button>

                  {loggedInUser ? null : (
                      <Button
                          type="button"
                          onClick={async () => {
                            await account.deleteSession('current');
                            setLoggedInUser(undefined);
                          }}
                      >
                        Logout
                      </Button>
                  )}
                </div>

                <div className="text-center">
                  <Button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      variant="link"
                  >
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                  </Button>
                </div>
              </form>
            </div>

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
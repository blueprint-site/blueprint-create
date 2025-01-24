// /src/pages/User/Settings/UserSettings.tsx

import { Calendar, Info, Key, LogOut, Mail, Phone, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import supabase from '@/components/utility/Supabase';

interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
  custom_claims?: {
    global_name?: string;
  };
  preferred_username?: string;
}

interface User {
  id: string;
  email?: string;
  email_confirmed?: boolean;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
  role?: string;
  user_metadata: UserMetadata;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
}

const UserSettings = () => {
  const [userdata, setUserdata] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUserdata(user as User);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.setItem("isSignedIn", "false");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 pt-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-surface-tonal-20 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
            <h1 className="text-3xl font-minecraft text-foreground">
              {userdata?.user_metadata?.full_name}
            </h1>
          </div>
          <div className="flex-shrink-0">
            {userdata?.user_metadata?.avatar_url ? (
              <img
                src={userdata.user_metadata.avatar_url}
                alt="Profile"
                className="w-32 h-32 rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-surface-tonal-0 flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Account Info Card */}
        <Card className="mb-8 bg-surface-10">
          <CardHeader className="border-b border-surface-20">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Info className="w-5 h-5" />
              Account Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>Username:</span>
                </div>
                <span className="font-medium">{userdata?.user_metadata?.custom_claims?.global_name}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>Email:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {showEmail ? userdata?.email : '••••••••••••'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    {showEmail ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span>Phone:</span>
                </div>
                <span className="text-muted-foreground">{userdata?.phone || 'Not provided'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>Joined:</span>
                </div>
                <span>{new Date(userdata?.created_at || '').toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span>Role:</span>
                </div>
                <span className="text-muted-foreground">{userdata?.role || 'User'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <span>User ID:</span>
                </div>
                <span className="text-xs text-destructive font-mono">{userdata?.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Info Card */}
        <Card className="mb-8 bg-surface-10">
          <CardHeader className="border-b border-surface-20">
            <h3 className="text-xl font-semibold">Authentication Providers</h3>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
              <p className="text-sm text-muted-foreground">Current Provider:</p>
              <p className="font-medium">{userdata?.app_metadata?.provider}</p>
            </div>
            {userdata?.app_metadata?.providers && (
              <div className="p-3 bg-surface-20 rounded-lg hover:bg-surface-30 transition-colors">
                <p className="text-sm text-muted-foreground">Linked Accounts:</p>
                <p className="font-medium">{userdata.app_metadata.providers.join(', ')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sign Out Button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleSignOut}
            className="w-full max-w-xs"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
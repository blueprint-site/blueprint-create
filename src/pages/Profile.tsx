import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import supabase from '@/components/utility/Supabase';
import { Download, User, Users } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  email?: string;
  created_at: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    custom_claims?: {
      global_name?: string;
    };
    preferred_username?: string;
  };
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col border-b border-divider pb-3 sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {userData?.user_metadata?.avatar_url ? (
              <img 
                src={userData.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border">
                <User className="w-8 h-8 text-secondary-foreground" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-grow w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {userData?.user_metadata?.custom_claims?.global_name || 
                   userData?.user_metadata?.preferred_username || 
                   'Anonymous User'}
                </h2>
                <p className="text-sm text-foreground-muted">
                  {userData?.user_metadata?.full_name}
                </p>
                <p className="text-xs text-foreground-muted">
                  Joined {new Date(userData?.created_at || '').toLocaleDateString()}
                </p>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/settings/profile")}
                  className="w-full sm:w-auto"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-foreground-muted">
              <div className="flex items-center">
                <span>Provider: {userData?.app_metadata?.provider || 'None'}</span>
              </div>
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-1" />
                <span>0 downloads</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>0 followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <Card className="bg-card hover:bg-accent/50 transition-colors duration-200">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">BP</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Test Project</h3>
                  <p className="text-sm text-foreground-muted">Just a test project so I can see how this works</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-foreground-muted">
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  <span>0</span>
                </div>
                <div>Updated recently</div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-6 rounded-lg bg-card">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold text-card-foreground">
              Lorem ipsum dolor
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Click Here
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
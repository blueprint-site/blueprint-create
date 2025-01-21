import supabase from '@/components/Supabase';
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
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

const UserPage = () => {
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
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* User Profile Header */}
      <div className="container mx-auto pt-8">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {userData?.user_metadata?.avatar_url ? (
              <img 
                src={userData.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-container-dark flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {userData?.user_metadata?.custom_claims?.global_name || 
                   userData?.user_metadata?.preferred_username || 
                   'Anonymous User'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userData?.user_metadata?.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(userData?.created_at || '').toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/usersettings")}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mt-4 text-sm text-muted-foreground">
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

        {/* Projects Section - Placeholder for now */}
        <div className="mt-8">
          <Card className="bg-container hover:bg-container-dark transition-colors">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground">BP</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Test Project</h3>
                  <p className="text-sm text-muted-foreground">Just a test project so I can see how this works</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
        <div className="mt-8 p-6 rounded-lg bg-container">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Lorem ipsum dolor
            </div>
            <Button className="bg-addon hover:bg-addon/90">
              Click Here
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

import { Download, User, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useLoggedUser} from "@/context/users/loggedUserContext";
import {useState} from "react";



const Profile = () => {
  const [error] = useState<string | null>(null);
  const navigate = useNavigate();
  const LoggedUserInfo = useLoggedUser();



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
            {LoggedUserInfo?.preferences?.avatar ?
              <img
                src={LoggedUserInfo.preferences?.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
              />
            :
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border">
                <User className="w-8 h-8 text-secondary-foreground" />
              </div>
            }
          </div>

          {/* User Info */}
          <div className="flex-grow w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {LoggedUserInfo?.user?.name ?? 'Anonymous User'}
                </h2>
                <p className="text-sm text-foreground-muted">
                  {LoggedUserInfo?.user?.name}
                </p>
                <p className="text-xs text-foreground-muted">
                  Joined {new Date(LoggedUserInfo?.user?.$createdAt || '').toLocaleDateString()}
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

      </div>
    </div>
  );
};

export default Profile;
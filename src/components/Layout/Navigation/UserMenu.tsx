import { LogOut, Settings, User , Shield} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import supabase from "@/components/utility/Supabase";
import ThemeToggle from "@/components/utility/ThemeToggle";
import { useLoggedUser} from "@/context/users/logedUserContext.tsx";

interface UserMenuProps {
  user: {
    avatar_url?: string;
    custom_claims?: {
      global_name?: string;
    };
  };
}

const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const loggedUser = useLoggedUser();
  const AdminPanelButton = () => {
    if(loggedUser.isAdmin) {
      return (
          <button
              onClick={() => navigate("/admin")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
          >
            <Shield className="h-4 w-4"/>
            Admin Panel
          </button>
      )
    }
  }
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="h-10">
            <NavigationMenuTrigger className="!bg-transparent hover:!bg-transparent">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex w-48 flex-col bg-background gap-2 p-2 pb-3">
              <div className="flex items-center border-b px-2 pb-2">
                <p className="my-1 text-sm font-medium text-foreground">{loggedUser.displayName}</p>
              </div>
              <button
                  onClick={() => navigate("/user")}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
              >
                <User className="h-4 w-4"/>
                Profile
              </button>
              <button
                  onClick={() => navigate("/settings")}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
              >
                <Settings className="h-4 w-4"/>
                Settings
              </button>
              {AdminPanelButton()}
              <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
              >
                <LogOut className="h-4 w-4"/>
                Logout
              </button>
              <ThemeToggle variant="ghost"/>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UserMenu;
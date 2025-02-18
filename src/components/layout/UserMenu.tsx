import { LogOut, Menu, Settings, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
import ThemeToggle from "@/components/utility/ThemeToggle";

import { useLoggedUser } from "@/context/users/loggedUserContext";
import { account } from "@/lib/appwrite";

const UserMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useLoggedUser();
  const loggedUser = useLoggedUser();
  const isAdmin = loggedUser.preferences?.roles?.includes("admin");

  const handleLogout = async () => {
    await account.deleteSession('current');
    navigate("/login");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 p-0">
            <div className="flex items-center justify-center">
              {/* Mobile Menu Icon */}
              <Menu className="block h-6 w-6 md:hidden" aria-hidden="true" />

              {/* Desktop User Avatar/Icon */}
              <div className="hidden md:block">
                {user ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={loggedUser.preferences?.avatar} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
            </div>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="flex w-48 flex-col bg-background gap-2 p-2 pb-3">
              {user && (
                <>
                  <div className="flex items-center gap-2 border-b md:border-t p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={loggedUser.preferences?.avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {loggedUser.user?.name}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate("/user")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
                  >
                    <User className="h-4 w-4" />
                    {t("user-menu.profile")}
                  </button>
                  <button
                    onClick={() => navigate("/settings")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
                  >
                    <Settings className="h-4 w-4" />
                    {t("user-menu.settings")}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
                    >
                      <Shield className="h-4 w-4" />
                      {t("user-menu.admin")}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-surface-1"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("user-menu.logout")}
                  </button>
                </>
              )}
              <ThemeToggle variant="ghost" />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UserMenu;

import { Lock, Monitor, User } from "lucide-react";
import { Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LoadingOverlay } from "@/components/LoadingOverlays/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DisplaySettings = lazy(
  () => import("@/components/Settings/DisplaySettings")
);
const AccountSettings = lazy(
  () => import("@/components/Settings/AccountSettings")
);
const ProfileSettings = lazy(
  () => import("@/components/Settings/ProfileSettings")
);

const SettingsPage = () => {
  const { section = "profile" } = useParams(); // Get the section from URL params
  const navigate = useNavigate();

  const settingsSections = [
    {
      id: "profile",
      label: "Public profile",
      icon: User,
      component: ProfileSettings,
    },
    {
      id: "account",
      label: "Account security",
      icon: Lock,
      component: AccountSettings,
    },
    {
      id: "display",
      label: "Display",
      icon: Monitor,
      component: DisplaySettings,
    },
  ];

  const ActiveSection =
    settingsSections.find((s) => s.id === section)?.component ||
    ProfileSettings;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="md:w-64 shrink-0 self-start">
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            {settingsSections.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={section === id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => navigate(`/settings/${id}`)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Content Area */}
        <Card className="flex-1 p-6">
          <Suspense fallback={<LoadingOverlay />}>
            <ActiveSection key={section} />{" "}
            {/* Force re-render of the section */}
          </Suspense>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

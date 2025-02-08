import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

export default function AccountSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Account security</h2>

      {/* 2FA Section */}
      {/* <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <div className="text-lg font-semibold">Two-factor authentication</div>
        </div>
        <p className="text-sm text-foreground-muted">
          Add an additional layer of security to your account during login.
        </p>
        <div className="flex gap-4">
          <Button variant="outline">Setup 2FA</Button>
        </div>
      </section> */}

      {/* Providers Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCog className="w-5 h-5" />
          <div className="text-lg font-semibold">Manage authentication providers</div>
        </div>
        <p className="text-sm text-foreground-muted">
          Add or remove sign-on methods from your account, including GitHub, GitLab, Microsoft, 
          Discord, Steam, and Google.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" disabled>Coming Soon</Button>
        </div>
      </section>
    </div>
  );
}
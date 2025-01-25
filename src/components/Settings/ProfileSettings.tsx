import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/components/utility/Supabase";
import { Upload, User2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatar_url: ""
  });

  const getUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUserData(user as User);
      
      // Initialize profile with user data
      setProfile({
        username: user?.user_metadata.preferred_username || "",
        bio: user?.user_metadata.full_name || "",
        avatar_url: user?.user_metadata.avatar_url || ""
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const onUploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update both local state and user metadata
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    console.log('Saving profile:', profile);
    try {
      const {
        data,
        error
      } = await supabase.auth.updateUser({
        data: {
          preferred_username: profile.username,
          full_name: profile.bio,
        }
      });

      console.log(data);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Profile information</h2>
        <p className="text-sm text-muted-foreground">
          Your profile information is publicly viewable on Blueprint and through the Blueprint API.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile picture</h3>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                <User2 className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="picture" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md">
                  <Upload className="w-4 h-4" />
                  Upload image
                </div>
                <input
                  id="picture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onUploadImage}
                  disabled={isLoading}
                />
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <p className="text-sm text-muted-foreground mb-2">
            A unique case-insensitive name to identify your profile.
          </p>
          <Input
            id="username"
            value={profile.username}
            onChange={e => setProfile(prev => ({ ...prev, username: e.target.value }))}
            className="max-w-md"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <p className="text-sm text-muted-foreground mb-2">
            A short description to tell everyone a little bit about you.
          </p>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isLoading}>
            Save changes
          </Button>
          <Button variant="secondary" asChild>
            <a href="/profile">Visit your profile</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
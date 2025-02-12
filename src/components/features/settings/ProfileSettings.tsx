import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/components/utility/Supabase";
import { Upload, User2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { LoggedUserContextType, useLoggedUser } from "@/context/users/logedUserContext";

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<LoggedUserContextType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatar_url: ""
  });

  const LoggedUser = useLoggedUser();

  useEffect(() => {
    setUserData(LoggedUser);
    setProfile({
      username: LoggedUser.displayName || "",
      bio: LoggedUser.bio || "",
      avatar_url: LoggedUser.icon_url || ""
    });
  }, [LoggedUser]);

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

      if (uploadError) {
        console.error("Error uploading data:", uploadError);
        return; // Exit function instead of throwing
      }
      const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

      // Update both local state and user metadata
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

      // Update avatar_url in the profiles table
      const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: LoggedUser.user?.id,  // Assuming user has an id in the `profiles` table
            avatar_url: publicUrl
          });

      if (profileError) {
        console.error('Error updating profile avatar:', profileError);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  }, [LoggedUser]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving profile:', profile);

      // Update the username and bio in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          preferred_username: profile.username,
          full_name: profile.bio,
        }
      });

      if (authError) {
        console.error('Error saving user data:', authError);
        setError('Failed to save profile changes');
        return;
      }

      const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: LoggedUser.id, // Identifiant unique de l'utilisateur
            display_name: profile.username,
            bio: profile.bio,
            icon_url: profile.avatar_url // Ajoutez avatar_url si nécessaire
          });


      if (profileError) {
        console.error('Error saving profile data:', profileError);
        setError('Failed to save profile changes');
        return;
      }

      console.log('Profile updated successfully!');
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
          <p className="text-sm text-foreground-muted">
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
            <p className="text-sm text-foreground-muted mb-2">
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
            <p className="text-sm text-foreground-muted mb-2">
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

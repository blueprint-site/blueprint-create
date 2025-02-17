import React, { useCallback, useEffect, useState } from "react";
import { Upload, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import imageCompression from "browser-image-compression";
import { useLoggedUser } from "@/context/users/logedUserContext";
import { account, storage } from "@/lib/appwrite.ts";
import logMessage from "@/components/utility/logs/sendLogs.tsx";


export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatar: ""
  });

  const LoggedUser = useLoggedUser();

  useEffect(() => {
    if (LoggedUser) {
      setProfile({
        username: LoggedUser?.user?.name || "",
        bio: LoggedUser.preferences?.bio || "",
        avatar: LoggedUser.preferences?.avatar || ""
      });
    }
  }, [LoggedUser]);

  const onUploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);


      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const compressedFileAsFile = new File([compressedFile], file.name, { type: compressedFile.type });

      logMessage('Image compressed successfully.', 0 , 'action');
      if (profile.avatar) {
        const oldFileId = profile.avatar.match(/\/files\/([^/]+)/)?.[1];
        if (oldFileId) {
          logMessage(`Old image file id found (${oldFileId}) !`, 0 , 'action');
          try {
            await storage.deleteFile("67aee2b30000b9e21407", oldFileId);
            logMessage(`Old image have been deleted (${oldFileId}) !`, 0 , 'action');
          } catch (deleteError) {
            logMessage(`Error while deleting old file (${oldFileId}) !`, 3 , 'action');
          }
        } else {
          logMessage(`Any file found , skipping suppression ! (${oldFileId}) !`, 0 , 'action');
        }
      }

      const fileId = crypto.randomUUID();
      const response = await storage.createFile(
          "67aee2b30000b9e21407",
          fileId,
          compressedFileAsFile,
      );


      const avatarUrl = storage.getFilePreview("67aee2b30000b9e21407", response.$id).toString();
      console.log(avatarUrl);
      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
    } catch (error) {
      logMessage("Error while uploading avatar image", 3 , 'action');
      setError("Error while uploading avatar image");
    } finally {
      setIsLoading(false);
      handleSave().then(() => {
        logMessage("Saving of the image done", 0 , 'action');
      })
    }
  }, [profile.avatar]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      logMessage("Saving of the profile in progress", 0 , 'action');

      await account.updateName(profile.username);

      await account.updatePrefs({
        bio: profile.bio,
        avatar: profile.avatar
      });

      logMessage("Saving of the profile done", 0 , 'action');
    } catch (error) {
      logMessage("Error while saving the profile ", 3 , 'action');
      setError("Error while saving the profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  if (!LoggedUser) {
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
                <AvatarImage src={profile.avatar} />
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

import noImageSelected from "@/assets/backgrounds/noimage.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../LoadingOverlays/LoadingSpinner";
import { LoadingSuccess } from "../LoadingOverlays/LoadingSuccess";
import supabase from "../utility/Supabase";

interface SchematicFormData {
  title: string;
  description: string;
  gameVersion: string;
  createVersion: string;
  loader: string;
  uploadedImage: string;
  uploadedImageFile: File | null;
  uploadedSchematic: File | null;
}

const INITIAL_FORM_DATA: SchematicFormData = {
  title: "",
  description: "",
  gameVersion: "",
  createVersion: "",
  loader: "",
  uploadedImage: noImageSelected,
  uploadedImageFile: null,
  uploadedSchematic: null
};

const GAME_VERSIONS = ["1.20.1", "1.19.2", "1.18.2"];
const CREATE_VERSIONS = ["0.5.1 (a-j)", "0.5.0 (a-i)"];
const LOADERS = ["Forge", "Fabric", "Quilt", "NeoForge"];

export function SchematicsUpload() {
  const [formData, setFormData] = useState<SchematicFormData>(INITIAL_FORM_DATA);
  const [isSchematicUploaded, setIsSchematicUploaded] = useState(false);
  const [isSchematicError, setIsSchematicError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowFinalMessage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (showFinalMessage) {
      const redirectTimer = setTimeout(() => {
        navigate("/schematics");
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, [showFinalMessage, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedImageFile: file,
        uploadedImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSchematicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isValidSchematic = fileExtension === "nbt";

      setIsSchematicUploaded(isValidSchematic);
      setIsSchematicError(!isValidSchematic);
      
      if (isValidSchematic) {
        setFormData(prev => ({
          ...prev,
          uploadedSchematic: file
        }));
      }
    }
  };

  const validateForm = (): string[] => {
    const missingFields: string[] = [];
    const requiredFields: Array<[keyof SchematicFormData, string]> = [
      ["uploadedImageFile", "Image File"],
      ["uploadedSchematic", "Schematic File"],
      ["gameVersion", "Game Version"],
      ["createVersion", "Create Version"],
      ["loader", "Loader"],
      ["description", "Description"],
      ["title", "Title"]
    ];

    requiredFields.forEach(([field, label]) => {
      if (!formData[field]) missingFields.push(label);
    });

    if (isSchematicError) missingFields.push("Valid Schematic File");
    if (!user) missingFields.push("Login");

    return missingFields;
  };

  const handleUpload = async () => {
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    
    try {
      if (!formData.uploadedSchematic || !formData.uploadedImageFile) {
        throw new Error("Missing required files");
      }

      // Upload schematic file
      const filePath = `files/${Date.now()}_${formData.uploadedSchematic.name}`;
      const { error: fileError } = await supabase.storage
        .from("schematics")
        .upload(filePath, formData.uploadedSchematic);

      if (fileError) throw fileError;

      // Upload image
      const imagePath = `images/${Date.now()}_${formData.uploadedImageFile.name}`;
      const { error: imageError } = await supabase.storage
        .from("schematics")
        .upload(imagePath, formData.uploadedImageFile);

      if (imageError) throw imageError;

      // Get public URLs
      const fileUrl = supabase.storage
        .from("schematics")
        .getPublicUrl(filePath).data.publicUrl;
      const imageUrl = supabase.storage
        .from("schematics")
        .getPublicUrl(imagePath).data.publicUrl;

      // Insert metadata
      const { error: insertError } = await supabase.from("schematics").insert([{
        title: formData.title,
        description: formData.description,
        schematic_url: fileUrl,
        image_url: imageUrl,
        author: user?.user_metadata?.custom_claims?.global_name,
        game_versions: formData.gameVersion,
        create_versions: formData.createVersion,
        modloader: formData.loader,
      }]);

      if (insertError) throw insertError;

    } catch (error) {
      console.error("Error uploading schematic:", error);
      alert("Failed to upload schematic. Please try again.");
      setLoading(false);
      return;
    }
  };

  if (loading && !showFinalMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner />
        <h1 className="text-2xl font-bold mt-4">Your schematic is being uploaded!</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    );
  }

  if (showFinalMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSuccess />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Let's upload a schematic!</CardTitle>
      </CardHeader>

      <Card className="mt-8">
        <CardContent className="space-y-6 p-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <img 
              src={formData.uploadedImage} 
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg border"
            />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload a screenshot (1920x1080px)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Suggestion: It should feature what is inside the schematic
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Schematic Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="schematic">Upload Schematic (.nbt)</Label>
            <Input
              id="schematic"
              type="file"
              accept=".nbt"
              onChange={handleSchematicChange}
              className="cursor-pointer"
            />
            {isSchematicError && (
              <p className="text-destructive text-sm">Only .nbt files are allowed</p>
            )}
            {isSchematicUploaded && (
              <p className="text-success text-sm">Schematic uploaded successfully!</p>
            )}
          </div>

          {/* Author Section */}
          <div>
            <h3 className="text-lg font-semibold">
              Schematic author: <span className="italic">{user?.user_metadata?.custom_claims?.global_name}</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Set automatically according to your account
            </p>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
                placeholder="Enter a title for your schematic"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell others what is inside it"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Version Selectors */}
          <div className="space-y-6">
            <div>
              <Label>Minecraft Version</Label>
              <RadioGroup
                value={formData.gameVersion}
                onValueChange={value => setFormData(prev => ({ ...prev, gameVersion: value }))}
              >
                {GAME_VERSIONS.map(version => (
                  <div key={version} className="flex items-center space-x-2">
                    <RadioGroupItem value={version} id={`mc-${version}`} />
                    <Label htmlFor={`mc-${version}`}>{version}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label>Create Version</Label>
              <RadioGroup
                value={formData.createVersion}
                onValueChange={value => setFormData(prev => ({ ...prev, createVersion: value }))}
              >
                {CREATE_VERSIONS.map(version => (
                  <div key={version} className="flex items-center space-x-2">
                    <RadioGroupItem value={version} id={`create-${version}`} />
                    <Label htmlFor={`create-${version}`}>{version}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label>Mod Loader</Label>
              <RadioGroup
                value={formData.loader}
                onValueChange={value => setFormData(prev => ({ ...prev, loader: value }))}
              >
                {LOADERS.map(loader => (
                  <div key={loader} className="flex items-center space-x-2">
                    <RadioGroupItem value={loader} id={`loader-${loader}`} />
                    <Label htmlFor={`loader-${loader}`}>{loader}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/schematics")}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={loading}
            >
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SchematicsUpload;
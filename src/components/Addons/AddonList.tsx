import { useAddonStore } from '@/stores/addonStore';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import AddonListItem from './AddonListItem';

interface Addon {
  addon_name: string;
  addon_slug: string;
  addon_icon_url: string;
  addon_project_id: string;
  addon_downloads: number;
  addon_short_descriptions: string;
  addon_versions: string[];
  addon_categories: string[];
  addon_followers: number;
  manual_check: string;
  addon_authors: string;
  note: string;
}

const AddonList = () => {
  const [query, setQuery] = useState("");
  const [modloader, setModloader] = useState("all");
  const [version, setVersion] = useState("all");
  const { addons, versions, isLoading, error, fetchAddons } = useAddonStore();

  useEffect(() => {
    fetchAddons();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col font-minecraft items-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground">Create Mod Addons</h1>
        <p className="text-lg text-muted-foreground">
          Discover and explore addons for the Create mod
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Addons</CardTitle>
          <CardDescription>
            Find the perfect addon for your Create mod experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search addons..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={modloader} onValueChange={setModloader} >
              <SelectTrigger className="w-full md:w-[200px] bg-blueprint">
                <SelectValue placeholder="Modloader" />
              </SelectTrigger>
              <SelectContent className="bg-blueprint">
                <SelectItem value="all">All Modloaders</SelectItem>
                <SelectItem value="forge">Forge</SelectItem>
                <SelectItem value="fabric">Fabric</SelectItem>
                <SelectItem value="quilt">Quilt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                {versions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map((addon) => (
          <AddonListItem 
            key={addon.id} 
            addon={addon}
          />
        ))}
      </div>
    </div>
  );
};

export default AddonList;
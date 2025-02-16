import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostgrestResponse } from "@supabase/supabase-js";

import supabase from "@/components/utility/Supabase";
import { LoadingSpinner } from "@/components/loading-overlays/LoadingSpinner";
import { Schematic } from "@/types";

import SchematicSearchCard from "@/components/features/schematics/SchematicSearchCard";
import SchematicCard from "@/components/features/schematics/SchematicCard";

function SchematicsList() {
  const [schematics, setSchematics] = useState<Schematic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const fetchSchematics = async (query?: string) => {
    setLoading(true);
    setError(null);
    let data: PostgrestResponse<Schematic>;

    if (query) {
      data = await supabase
        .from("schematics")
        .select("*")
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, authors.ilike.%${query}%`);
    } else {
      data = await supabase
        .from("schematics")
        .select("*")
        .order("created_at", { ascending: false });
    }

    if (data.error) {
      setError("Failed to fetch schematics.");
      console.error("Error fetching schematics:", data.error);
    } else {
      setSchematics(data.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSchematics();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <LoadingSpinner size="lg" />
        <p className="text-foreground-muted">Loading schematics for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive font-semibold">
        Oops! There was an error: {error}
      </div>
    );
  }

  return (
    <div className="wrap container mx-auto">
      <SchematicSearchCard
        searchQuery={searchQuery}
        onSearchChange={handleInputChange}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {schematics.length === 0 ? (
          <h3 className="text-center col-span-full text-lg font-semibold">
            No schematics uploaded yet. Be the first!
          </h3>
        ) : (
          schematics.map((schematic) => (
            <SchematicCard
              key={schematic.id}
              schematic={schematic}
              onClick={() => navigate(`../schematics/${schematic.slug}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SchematicsList;
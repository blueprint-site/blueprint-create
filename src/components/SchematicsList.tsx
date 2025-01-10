import React, { useEffect, useState } from "react";
import supabase from "./Supabase"; // Your Supabase client instance
import "../styles/schematicslist.scss";
import { Link } from "react-router-dom";
import DevinsBadges from "./DevinsBadges";
import LoadingAnimation from "./LoadingAnimation";

interface Schematic {
  id: string;
  title: string;
  description: string;
  created_at: string;
  schematic_url: string;
  image_url: string;
  author: string;
  user_id: string;
  game_versions: string;
  create_versions: string;
  modloader: string;
}

function SchematicsList() {
  const [schematics, setSchematics] = useState<Schematic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch schematics from the Supabase table
  const fetchSchematics = async (query?: string) => {
    setLoading(true);
    setError(null);
    let data: any;
    if (query) {
      data = await supabase
        .from("schematics")
        .select(
          "id, title, description, created_at, schematic_url, image_url, author, user_id, game_versions, create_versions, modloader"
        )
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, author.ilike.%${query}%`);
    } else {
      data = await supabase
        .from("schematics")
        .select(
          "id, title, description, created_at, schematic_url, image_url, author, user_id, game_versions, create_versions, modloader"
        )
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

  const handleSearch = () => {
    fetchSchematics(searchQuery);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    LoadingAnimation();
    return <div className="loading">Loading schematics for you...</div>;
  }

  if (error) {
    return <div className="error">Oops! There was an error: {error}</div>;
  }

  return (
    <div>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search schematics..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
        <a href="/schematics/upload" className="upload-button">Upload a Schematic (<u>alpha</u>)</a>
      </div>

      <div className="schematics-list">
        {schematics.length === 0 ? (
          <h3>No schematics uploaded yet. Be the first!</h3>
        ) : (
          schematics.map((schematic) => (
            <Link to={schematic.id} className="schematic-card">
              <div className="schematic-card-top">
                <img
                  alt={schematic.title}
                  src={schematic.image_url}
                  className="schematic-image"
                />
                <h3 className="schematic-title">
                  <b>{schematic.title}</b>
                </h3>
                <p className="schematic-description">
                {schematic.description.split('\n').slice(0, 3).join('\n')}
                </p>
                  Modloader: {schematic.modloader ?? "Not set"}
                  <br />
                  Made for Minecraft: {schematic.game_versions ?? "Not set"}
                <p className="schematic-author">
                  Author: {schematic.author} <br />
                </p>
                <a
                  href={schematic.schematic_url}
                  download
                  className="download-button"
                >
                  Download Schematic
                </a>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SchematicsList;

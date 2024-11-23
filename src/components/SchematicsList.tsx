import React, { useEffect, useState } from "react";
import supabase from "./Supabase"; // Your Supabase client instance
import "../styles/schematicslist.scss";

interface Schematic {
  id: string;
  title: string;
  description: string;
  created_at: string;
  schematic_url: string;
  image_url: string;
  author: string;
  user_id: string;
  game_versions: string[];
  create_versions: string[];
}

function SchematicsList() {
  const [schematics, setSchematics] = useState<Schematic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schematics from the Supabase table
  const fetchSchematics = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("schematics") // Your table name
      .select(
        "id, title, description, created_at, schematic_url, image_url, author, user_id, game_versions, create_versions"
      );

    if (error) {
      setError("Failed to fetch schematics.");
      console.error("Error fetching schematics:", error);
    } else {
      setSchematics(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSchematics();
  }, []);

  if (loading) {
    return <div className="loading">Loading schematics for you...</div>;
  }

  if (error) {
    return <div className="error">Oops! There was an error: {error}</div>;
  }

  return (
    <div className="schematics-list">
      {schematics.length === 0 ? (
        <h3>No schematics uploaded yet. Be the first!</h3>
      ) : (
        schematics.map((schematic) => (
          <div key={schematic.id} className="schematic-card">
            <div className="schematic-card-bottom">
              <img
                alt={schematic.title}
                src={schematic.image_url}
                className="schematic-image"
              />
              <h3 className="schematic-title">
                <b>{schematic.title}</b>
              </h3>
              <p>{schematic.description}</p>
              <p className="schematic-author">
                Author: {schematic.author}
              </p>
              <a
                href={schematic.schematic_url}
                download
                className="download-button"
              >
                Download Schematic
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SchematicsList;

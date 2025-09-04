const axios = require("axios");

async function searchModrinthMods(offset = 0) {
  const url = "https://api.modrinth.com/v2/search";
  const searchTerms = "create"; // Remplacez par vos termes de recherche
  const params = {
    query: searchTerms, // Recherche en texte libre
    limit: 50, // Nombre de résultats
    offset: offset, // Décalage pour la pagination
    facets: JSON.stringify([["project_type:mod"]]),
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.hits;
  } catch (error) {
    console.error("Erreur lors de la récupération des mods:", error);
    return []; // Return an empty array in case of error
  }
}

async function getModrinthDependencies(projectId) {
  const url = `https://api.modrinth.com/v2/project/${projectId}/dependencies`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des dépendances pour le projet ${projectId}:`,
      error,
    );
    return []; // Return an empty array in case of error
  }
}

async function searchModrinthModsWithDependencies(offset = 0) {
  const mods = await searchModrinthMods(offset);
  const modWithDependencies = [];

  for (const mod of mods) {
    try {
      const dependencies = await getModrinthDependencies(mod.project_id);
      mod.dependencies = dependencies;
      modWithDependencies.push(mod);
    } catch (error) {
      console.error(
        `Failed to fetch dependencies for mod ${mod.project_id}:`,
        error,
      );
      mod.dependencies = []; // Ensure dependencies is always an array
      modWithDependencies.push(mod);
    }
  }

  return modWithDependencies;
}

module.exports = {
  searchModrinthMods,
  getModrinthDependencies,
  searchModrinthModsWithDependencies,
};

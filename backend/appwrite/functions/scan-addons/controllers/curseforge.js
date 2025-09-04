const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const curseforge_api_key = process.env.CURSEFORGE_API_KEY;

async function getCategories() {
  const url = "https://api.curseforge.com/v1/categories";
  const gameId = 432; // ID pour Minecraft

  const headers = {
    "x-api-key": curseforge_api_key || "", // Clé API depuis les variables d'environnement
  };

  const params = {
    gameId: gameId.toString(), // Spécifier l'ID du jeu
  };

  try {
    const response = await axios.get(url, {
      headers,
      params,
    });

    return response.data.data; // Renvoie la liste des catégories
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
  }
}

async function getCategoriesExcludingModpacks() {
  const categories = await getCategories();

  // Filtrer toutes les catégories sauf les modpacks (ID 4471)
  const filteredCategories = categories.filter(
    (category) => category.id !== 4471,
  );

  // Extraire les IDs des catégories restantes
  const categoryIds = filteredCategories.map((category) => category.id);

  return categoryIds;
}

async function searchCurseForgeMods(index) {
  const url = "https://api.curseforge.com/v1/mods/search";
  const searchTerms = "create";
  const gameId = 432;

  console.log("index : ", index);
  const headers = {
    "x-api-key": curseforge_api_key || "", // Clé API depuis les variables d'environnement
  };

  const params = {
    gameId: gameId,
    searchFilter: searchTerms,
    index: index,
    pageSize: 50,
    modLoaderTypes: ["Forge, Fabric, NeoForge"],
    gameVersion: ["1.20.1", "1.20", "1.20.2", "1.20.3", "1.20.4", "1.19.2"],
    sortOrder: "desc",
    sortField: "downloadCount",
    classId: 6,
  };

  try {
    const response = await axios.get(url, {
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching mods:", error);
  }
}

module.exports = { searchCurseForgeMods };

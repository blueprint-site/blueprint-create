var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fs = require("fs");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { scanMods } = require("./middlewares/scanMods");
var app = express();
scanMods().then();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Chemin du fichier JSON contenant les mods
const LOCAL_MODS_FILE = path.resolve(__dirname, "data/localMods.json");

// Fonction pour lire les mods depuis le fichier local
function loadLocalMods() {
  if (!fs.existsSync(LOCAL_MODS_FILE)) {
    return []; // Si le fichier n'existe pas, retourne une liste vide
  }
  const data = fs.readFileSync(LOCAL_MODS_FILE, "utf-8");
  return JSON.parse(data);
}
// Route pour récupérer les mods
app.get("/mods", (req, res) => {
  const { searchTerm = "" } = req.query; // Paramètre de recherche
  const allMods = loadLocalMods();

  // Filtrer les mods en fonction du terme de recherche
  const filteredMods = allMods.filter(
    (mod) =>
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  res.json(filteredMods); // Retourner les mods filtrés au format JSON
});
app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;

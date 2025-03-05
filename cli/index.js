#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// Liste des commandes et alias
const commands = {
    generateComponent: "generateComponent.js",
    gc: "generateComponent.js", // Alias pour `generateComponent`
};

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
    console.error("❌  Merci de spécifier une commande !");
    process.exit(1);
}

const commandFile = commands[command];

if (!commandFile) {
    console.error(`❌  Commande "${command}" non reconnue.`);
    process.exit(1);
}

// Exécuter la commande correspondante
// eslint-disable-next-line @typescript-eslint/no-var-requires
require(path.join(__dirname, "commands", commandFile))(args.slice(1));

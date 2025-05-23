// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");

// Résolution du chemin vers le fichier 'en.json' à partir de la racine du projet
const sourceFile = path.resolve(__dirname, "../..", "src", "locales", "en.json");

console.log(`Chemin du fichier source: ${sourceFile}`);

const targetLanguages = ["fr", "es", "de", "it"];
const API_URL = "https://translate.blueprint-create.com/translate";

const translateText = async (text, targetLang) => {
    try {
        const response = await axios.post(API_URL, {
            q: text,
            source: "en",
            target: targetLang,
            format: "text",
        });
        return response.data.translatedText;
    } catch (error) {
        console.error(`Erreur de traduction pour ${targetLang}:`, error.message);
        return text;
    }
};

const translateFile = async () => {
    const enTranslations = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

    for (const lang of targetLanguages) {
        const translatedData = {};

        console.log(`🔄 Traduction vers ${lang} en cours...`);
        for (const [key, value] of Object.entries(enTranslations)) {
            translatedData[key] = await translateText(value, lang);
        }

        const outputPath = path.join(__dirname, `../src/locales/${lang}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2), "utf8");
        console.log(`✅ Fichier traduit enregistré : ${outputPath}`);
    }
};

translateFile()
    .then(() => console.log("🎉 Toutes les traductions sont terminées !"))
    .catch((error) => console.error("❌ Erreur lors de la traduction :", error));

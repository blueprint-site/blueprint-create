// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cliProgress = require('cli-progress');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require('readline');

/**
 * Translation script to convert English locale file to multiple target languages
 * Uses an external translation API to perform the translations
 */

// Clear terminal function
const clearTerminal = () => {
    // Clear the terminal screen
    const lines = process.stdout.getWindowSize()[1];
    for (let i = 0; i < lines; i++) {
        console.log('\r\n');
    }
    console.clear();
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
};

// Path resolution for source English locale file
clearTerminal();
const sourceFile = path.resolve(__dirname, "../..", "src", "locales", "en.json");
console.log(`Source file path: ${sourceFile}`);

// Target languages for translation
const targetLanguages = ["fr", "es", "de", "it", "id", "zh", "ar", "pt", "ja", "ru"];
const API_URL = "https://translate.blueprint-create.com/translate";

// Create a new progress bar container with better formatting
const multiBar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} | {percentage}% | {value}/{total} | {title}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
}, cliProgress.Presets.shades_classic);

// Logger utility with timestamps and clear terminal functionality
const logger = {
    info: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [INFO] ${message}`);
    },
    success: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [SUCCESS] ✅ ${message}`);
    },
    error: (message, error) => {
        const timestamp = new Date().toLocaleTimeString();
        console.error(`[${timestamp}] [ERROR] ❌ ${message}`, error);
    },
    complete: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [COMPLETE] 🎉 ${message}`);
    },
    clear: clearTerminal
};

// Keep track of errors to display at the end
const errors = [];

/**
 * Translates a single text string to the target language
 * @param {string} text - The text to translate
 * @param {string} targetLang - The target language code
 * @param {Object} progressBar - The progress bar to update
 * @returns {Promise<string>} - The translated text
 */
const translateText = async (text, targetLang, progressBar) => {
    try {
        const response = await axios.post(API_URL, {
            q: text,
            source: "en",
            target: targetLang,
            format: "text",
        });

        if (response.status !== 200) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        // Update progress bar
        progressBar.increment();

        return response.data.translatedText;
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        // Store error for later display instead of showing immediately
        errors.push(`Translation failed for ${targetLang}: ${errorMessage}`);

        // Update progress bar even on error
        progressBar.increment();

        // Return original text in case of error
        return text;
    }
};

/**
 * Counts the total number of string values in an object recursively
 * @param {Object} obj - The object to count strings in
 * @returns {number} - The total count of string values
 */
const countStringsInObject = (obj) => {
    let count = 0;

    for (const [, value] of Object.entries(obj)) {
        if (typeof value === "string") {
            count++;
        } else if (typeof value === "object" && value !== null) {
            count += countStringsInObject(value);
        }
    }

    return count;
};

/**
 * Recursive function to translate only string values within an object
 * Preserves object structure and non-string values
 * @param {Object} obj - The object to translate
 * @param {string} targetLang - The target language code
 * @param {Object} progressBar - The progress bar to update
 * @returns {Promise<Object>} - Object with translated values
 */
const translateObject = async (obj, targetLang, progressBar) => {
    const translatedObj = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
            translatedObj[key] = await translateText(value, targetLang, progressBar);
        } else if (typeof value === "object" && value !== null) {
            // If it's an object, recursively apply translation
            translatedObj[key] = await translateObject(value, targetLang, progressBar);
        } else {
            // If neither string nor object, keep as is
            translatedObj[key] = value;
        }
    }

    return translatedObj;
};

/**
 * Sleep function to add small delays between API calls
 * @param {number} ms - Milliseconds to sleep
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main function to translate the entire locale file to all target languages
 * Reads source file, translates content, and saves to target language files
 */
const translateFile = async () => {
    try {
        // Clear terminal and show start message
        logger.clear();
        logger.info(`Starting translation process...`);

        // Read and parse English source file
        logger.info(`Reading source file: ${sourceFile}`);
        const enTranslations = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

        // Count total strings to translate
        const totalStrings = countStringsInObject(enTranslations);
        logger.info(`Found ${totalStrings} strings to translate per language`);

        // Small delay for readability
        await sleep(1000);

        // Clear terminal before showing progress bars
        logger.clear();

        // Create overall progress bar
        const overallBar = multiBar.create(targetLanguages.length, 0, { title: 'Overall progress' });

        // Translate for each target language
        for (const lang of targetLanguages) {
            // Create progress bar for this language
            const langBar = multiBar.create(totalStrings, 0, { title: `Translating to ${lang}` });

            // Translate the complete object with recursive function
            const translatedData = await translateObject(enTranslations, lang, langBar);

            // Save the translated file
            const outputPath = path.resolve(__dirname, "../..", "src", "locales", `${lang}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2), "utf8");

            // Complete this language's progress bar
            langBar.update(totalStrings);

            // Update overall progress
            overallBar.increment();
        }

        // Stop the progress bars
        multiBar.stop();

        // Clear terminal after completing all translations
        await sleep(500);
        logger.clear();

        // Show completion message
        logger.complete("All translations completed successfully!");

        // Show summary of translations
        logger.info(`Translated to ${targetLanguages.length} languages: ${targetLanguages.join(', ')}`);
        logger.info(`Total strings translated: ${totalStrings * targetLanguages.length}`);

        // Show any errors that occurred during translation
        if (errors.length > 0) {
            console.log("\nThe following errors occurred during translation:");
            errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

    } catch (error) {
        // Stop the progress bars on error
        multiBar.stop();

        logger.error("Translation process failed:", error);
        throw error; // Re-throw to be caught by the module exports handler
    }
};

/**
 * Module exports function to be called by the CLI
 * @param {Object} args - Command line arguments (unused currently but available for future extensions)
 */
module.exports = () => {
    translateFile()
        .then(() => {
            // Final exit message
            console.log("\n👋 Translation process completed");
        })
        .catch((error) => {
            logger.error("Translation process failed:", error);
            process.exit(1);
        });
};
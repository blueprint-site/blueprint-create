// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = function generateComponent(args) {
    // Check if a component path is passed
    const componentPathArg = args[0];
    if (!componentPathArg) {
        console.error("❌  You must specify a component path!");
        process.exit(1);
    }

    // Extract the component name (last segment of the path)
    const componentName = componentPathArg.split("/").pop();

    // If no component name is extracted
    if (!componentName) {
        console.error("❌  Invalid component name!");
        process.exit(1);
    }

    // Extract the folder path without the last segment
    const componentFolderPath = componentPathArg.split("/").slice(0, -1).join("/");

    // Create the full path for the component folder
    const finalComponentPath = path.join(process.cwd(), "src", "components", componentFolderPath);

    // Create the file path for the component
    const componentFilePath = path.join(finalComponentPath, `${componentName}.tsx`);

    // Component template
    const componentTemplate = `
export interface ${componentName}Props {}

export const ${componentName} = ({}: ${componentName}Props) => {
  return (
    <div>${componentName} works!</div>
  );
};
`;

    // Check if the file already exists
    if (fs.existsSync(componentFilePath)) {
        console.error(`❌  ${componentName} exists at ${componentFilePath.replace(process.cwd(), '.')}`);
        process.exit(1);
    }

    // Create necessary folders (without touching the component name)
    fs.mkdirSync(finalComponentPath, { recursive: true });

    // Create the component file
    fs.writeFileSync(componentFilePath, componentTemplate);

    console.log(`✅  Component ${componentName} created at ${componentFilePath.replace(process.cwd(), '.')}`);

    // Check if an index.ts file exists
    const indexFilePath = path.join(finalComponentPath, "index.ts");

    // If -i parameter is passed, automatically add to index
    if (args.includes("-i")) {
        addToIndex(indexFilePath, componentName, () => rl.close());
    } else {
        // Otherwise, check if the index exists and ask the user
        if (fs.existsSync(indexFilePath)) {
            addToIndex(indexFilePath, componentName, () => rl.close());
        } else {
            // Ask the user if they want to create the index
            rl.question(`The file ${indexFilePath.replace(process.cwd(), '.')} does not exist. Create it and add the export? (y/n) `, (answer) => {
                if (answer.toLowerCase() === "y") {
                    createIndexFile(indexFilePath, componentName, () => rl.close());
                } else {
                    console.log("❌  No changes made to the index.");
                    rl.close();
                }
            });
        }
    }
};

// Function to add the component to the index.ts file
function addToIndex(indexFilePath, componentName, callback) {
    const exportStatement = `export { ${componentName} } from './${componentName}.tsx';\n`;

    fs.appendFileSync(indexFilePath, exportStatement);
    console.log(`✅  ${componentName} added to ${indexFilePath.replace(process.cwd(), '.')}`);

    if (callback) callback();
}

// Function to create the index.ts file and add the export
function createIndexFile(indexFilePath, componentName, callback) {
    const exportStatement = `export { ${componentName} } from './${componentName}.tsx';\n`;

    fs.writeFileSync(indexFilePath, exportStatement);
    console.log(`✅  File ${indexFilePath.replace(process.cwd(), '.')} created and ${componentName} added`);

    if (callback) callback();
}

# Deploy NBT Parser Function

## Prerequisites

1. Install Appwrite CLI: `npm install -g appwrite`
2. Have access to your Appwrite console

## Deployment Steps

### Option 1: Using CLI with Login

1. Login to Appwrite:

```bash
appwrite login
```

2. Configure the client:

```bash
appwrite client --project-id "683770670016d1661c37" --endpoint "https://api.blueprint-create.com/v1"
```

3. Deploy the function:

```bash
cd functions/parse-nbt-schematic
appwrite functions create-deployment --function-id="parse-nbt-schematic" --code="." --activate --entrypoint="src/main.js"
```

### Option 2: Using API Key

1. Get an API key from your Appwrite console (Settings > API Keys)

2. Configure client with API key:

```bash
appwrite client --project-id "683770670016d1661c37" --endpoint "https://api.blueprint-create.com/v1" --key "YOUR_API_KEY"
```

3. Deploy:

```bash
cd functions/parse-nbt-schematic
appwrite functions create-deployment --function-id="parse-nbt-schematic" --code="." --activate --entrypoint="src/main.js"
```

### Option 3: Manual Upload via Console

1. Go to https://api.blueprint-create.com/console
2. Navigate to Functions
3. Find "Parse NBT Schematic" function
4. Click "Deploy" or "Create Deployment"
5. Upload this directory as a zip file
6. Set entrypoint to `src/main.js`
7. Activate the deployment

## Creating the ZIP file for manual upload

```bash
cd functions/parse-nbt-schematic
zip -r parse-nbt-function.zip . -x "*.md" -x ".git/*"
```

The function will be available at the endpoint and can be called from the frontend application.

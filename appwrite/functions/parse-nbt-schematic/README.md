# NBT Parser Function for Appwrite

This function parses Minecraft NBT schematic files and extracts metadata including dimensions, block types, materials, and complexity.

## Deployment

### Using Appwrite CLI

1. Install the Appwrite CLI if you haven't already:

```bash
npm install -g appwrite
```

2. Login to your Appwrite instance:

```bash
appwrite login
```

3. Select your project:

```bash
appwrite client --projectId="683770670016d1661c37"
```

4. Deploy the function from the function directory:

```bash
cd functions/parse-nbt-schematic
appwrite functions createDeployment \
    --functionId=parse-nbt-schematic \
    --code="." \
    --activate
```

### Manual Deployment via Appwrite Console

1. Go to your Appwrite Console
2. Navigate to Functions
3. Find "Parse NBT Schematic" function
4. Click "Deploy"
5. Upload the contents of this directory as a zip file
6. Set entrypoint to `src/main.js`
7. Activate the deployment

## Usage

The function accepts a base64-encoded NBT file and returns parsed metadata:

```javascript
// Request body
{
  "file": "base64_encoded_nbt_data"
}

// Response
{
  "success": true,
  "metadata": {
    "dimensions": {
      "width": 10,
      "height": 15,
      "depth": 20,
      "blockCount": 1500
    },
    "blocks": [...],
    "materials": {...},
    "requirements": {...},
    "complexity": {...}
  }
}
```

## Testing

You can test the function using the Appwrite console or by calling it from your application.

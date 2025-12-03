# Local Testing Guide

### 📋 Prerequisites

1. **Node.js** (v18+ recommended)
2. **Environment variables** set up
3. **Access to your Appwrite and Meilisearch instances**

### 🔧 Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your actual values in `.env`:**
   ```bash
   # Appwrite Configuration
   APPWRITE_FUNCTION_API_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_FUNCTION_PROJECT_ID=your-actual-project-id
   APPWRITE_API_KEY=your-actual-api-key

   # Meilisearch Configuration  
   MEILISEARCH_ENDPOINT=https://your-meilisearch-instance.com
   MEILISEARCH_ADMIN_API_KEY=your-admin-key
   MEILISEARCH_SEARCH_API_KEY=your-search-key
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### 🚀 Usage Options

#### Option 1: Command Line Testing

```bash
# Incremental sync (default)
node test-local.js

# Force full sync
node test-local.js --force-full

# Start local HTTP server
node test-local.js --serve

# Custom port
node test-local.js --serve --port=8080
```

#### Option 2: HTTP Server Testing

Start the server:
```bash
node test-local.js --serve
```

Then test with curl or your browser:
```bash
# View demo page
curl http://localhost:3000/

# Incremental sync
curl -X POST http://localhost:3000/

# Force full sync
curl -X POST "http://localhost:3000/?forceFullSync=true"

# Or with JSON body
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"forceFullSync": true}'
```

### 📊 What You'll See

The local test will show detailed logs:
```
✅ All required environment variables are set
🚀 Starting local sync test...
📊 Sync type: INCREMENTAL
[2025-05-30T17:30:00.000Z] Starting sync for addons...
[2025-05-30T17:30:00.100Z] Index 'addons' already exists.
[2025-05-30T17:30:00.200Z] Last sync for addons: 2025-05-30T16:00:00.000Z
[2025-05-30T17:30:00.300Z] Incremental sync: fetching documents updated since 2025-05-30T16:00:00.000Z
...
```

### 🎯 Benefits of Local Testing

1. **Faster Development** - No deployment wait time
2. **Better Debugging** - Full access to console and debugger
3. **Safe Testing** - Test without affecting production
4. **Environment Flexibility** - Easy to switch between dev/staging/prod
5. **Offline Development** - Work without internet (if using local Meilisearch)

### 🔒 Security Notes

- Keep your `.env` file private (it's in `.gitignore`)
- Use development/staging API keys for testing
- Never commit real credentials to version control

### 🐛 Troubleshooting

**Missing environment variables:**
- Make sure your `.env` file exists and has all required variables
- Check that variable names match exactly (case-sensitive)

**Connection errors:**
- Verify your Appwrite endpoint and API key are correct
- Check that your Meilisearch instance is accessible
- Ensure firewall/network settings allow connections

**Permission errors:**
- Make sure your API key has database read/write permissions
- Check that the Meilisearch admin key has index creation rights

### 🧪 Advanced Testing

You can also import the test functions in your own scripts:

```javascript
import { createMockContext, runSyncTest } from './test-local.js';

// Custom test scenario
const context = createMockContext({
  body: { forceFullSync: true },
  query: { debug: 'true' }
});

// Run sync with custom context
await runSyncTest(true);
```

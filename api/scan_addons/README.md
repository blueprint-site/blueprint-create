# Scan Addons Function

This Appwrite Function scans and synchronizes addon data from CurseForge and Modrinth APIs into your Appwrite database. It's designed to run as a scheduled function to keep your addon database up-to-date.

## Features

- **Multi-Source Scanning**: Fetches addon data from both CurseForge and Modrinth APIs
- **Intelligent Deduplication**: Combines and merges addon data from multiple sources
- **Rate Limiting**: Built-in retry mechanisms and rate limiting to respect API limits
- **Health Monitoring**: Health check endpoint to monitor system status
- **Flexible Execution**: Supports full scans, quick scans, and health checks
- **Comprehensive Logging**: Detailed logging for debugging and monitoring

## Endpoints

### 1. Full Scan (Default)

**URL**: `/` (default action)  
**Method**: `GET`  
**Description**: Performs a comprehensive scan of addons from all sources

**Query Parameters**:

- `maxIterations` (number): Maximum number of scanning iterations (default: 50)
- `batchSize` (number): Number of items to fetch per batch (default: 50)
- `iterationDelay` (number): Delay between iterations in milliseconds (default: 5000)
- `requestDelay` (number): Delay between requests in milliseconds (default: 1000)
- `searchQuery` (string): Search term for addon discovery (default: "create")

**Example**:

```
GET /?maxIterations=20&batchSize=30&searchQuery=magic
```

### 2. Quick Scan

**URL**: `/quick` or `?action=quick`  
**Method**: `GET`  
**Description**: Performs a reduced scan with fewer iterations for faster execution

**Query Parameters**: Same as full scan but with reduced defaults

- `maxIterations` (number): Maximum 10 iterations (default: 5)
- `batchSize` (number): Maximum 50 items (default: 20)

**Example**:

```
GET /quick?maxIterations=3&searchQuery=tech
```

### 3. Health Check

**URL**: `/health` or `?action=health`  
**Method**: `GET`  
**Description**: Checks the health status of all system components

**Example**:

```
GET /health
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "iterations": 5,
    "totalMods": 150,
    "curseforge": {
      "fetched": 75,
      "saved": 70
    },
    "modrinth": {
      "fetched": 75,
      "saved": 65
    },
    "combined": {
      "created": 120,
      "updated": 30
    },
    "errors": [],
    "executionTimeMs": 45000
  },
  "timestamp": "2025-05-30T10:30:00Z",
  "executionTime": "45.00s"
}
```

### Health Check Response

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "checks": {
      "database": {
        "status": "healthy",
        "message": "Connected to 1 databases"
      },
      "addonsCollection": {
        "status": "healthy",
        "message": "Collection accessible with 1250 documents",
        "count": 1250
      },
      "curseforgeApi": {
        "status": "healthy",
        "message": "API accessible, returned 20 results"
      },
      "modrinthApi": {
        "status": "healthy",
        "message": "API accessible, returned 20 results"
      },
      "environment": {
        "status": "healthy",
        "message": "All required environment variables are set"
      }
    },
    "timestamp": "2025-05-30T10:30:00Z",
    "executionTimeMs": 2500
  },
  "timestamp": "2025-05-30T10:30:00Z",
  "executionTime": "2.50s"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Database connection failed",
  "timestamp": "2025-05-30T10:30:00Z",
  "executionTime": "5.00s"
}
```

## Environment Variables

Required environment variables:

| Variable                         | Description              | Example                     |
| -------------------------------- | ------------------------ | --------------------------- |
| `APPWRITE_FUNCTION_API_ENDPOINT` | Appwrite server endpoint | `https://api.3de-scs.be/v1` |
| `APPWRITE_FUNCTION_PROJECT_ID`   | Appwrite project ID      | `67ad0767000d58bb6592`      |
| `APPWRITE_FUNCTION_API_KEY`      | Appwrite API key         | 'your-api-key'              |
| `CURSEFORGE_API_KEY`             | CurseForge API key       | `your-curseforge-key`       |

## Performance Settings

Performance settings are now hardcoded in the configuration for consistency:

| Setting             | Full Scan | Quick Scan | Description                           |
| ------------------- | --------- | ---------- | ------------------------------------- |
| **Max Iterations**  | 50        | 5          | Maximum number of scanning iterations |
| **Batch Size**      | 50        | 20         | Number of items to fetch per batch    |
| **Iteration Delay** | 5000ms    | 2000ms     | Delay between iterations              |
| **Request Delay**   | 1000ms    | 500ms      | Delay between API requests            |
| **Max Retries**     | 5         | 5          | Maximum retries for failed requests   |

These settings can still be overridden via query parameters when calling the function.

## Local Testing

1. **Create a `.env` file** with your environment variables:

```bash
APPWRITE_FUNCTION_API_ENDPOINT=https://api.3de-scs.be/v1
APPWRITE_FUNCTION_PROJECT_ID=your-project-id
APPWRITE_FUNCTION_API_KEY=your-api-key
CURSEFORGE_API_KEY=your-curseforge-key
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run tests**:

```bash
# Run all tests
npm test

# Or use the test script directly
node test-local.js test

# Run specific actions
node test-local.js health
node test-local.js quick
node test-local.js full
```

## Deployment

1. **Deploy the function** using Appwrite CLI:

```bash
appwrite functions createDeployment \
  --functionId=scan_addons \
  --activate=true \
  --entrypoint="src/main.js" \
  --code="."
```

2. **Set environment variables** in the Appwrite Console or CLI:

```bash
appwrite functions updateVariable \
  --functionId=scan_addons \
  --key=APPWRITE_FUNCTION_API_KEY \
  --value=your-appwrite-api-key
```

3. **Configure the schedule** (optional) for automatic scanning:

```bash
appwrite functions update \
  --functionId=scan_addons \
  --schedule="0 2 * * *"  # Run daily at 2 AM
```

## Monitoring

### Logs

Function logs are available in the Appwrite Console under Functions > Scan Addons > Logs.

### Health Monitoring

Set up monitoring by calling the health endpoint regularly:

```bash
curl https://your-appwrite-endpoint/v1/functions/scan_addons/executions \
  -H "X-Appwrite-Project: your-project-id" \
  -H "X-Appwrite-Key: your-api-key" \
  -d '{"path": "/health"}'
```

### Metrics

The function returns comprehensive metrics including:

- Number of iterations completed
- Total mods processed
- Source-specific statistics (CurseForge vs Modrinth)
- Database operation counts (created vs updated)
- Execution time
- Error details

## Error Handling

The function includes robust error handling:

- **Rate Limiting**: Automatic retry with exponential backoff
- **API Failures**: Graceful degradation when one API is unavailable
- **Database Errors**: Detailed error reporting for database issues
- **Validation**: Environment variable validation before execution

## Performance Optimization

- **Batch Processing**: Processes addons in configurable batches
- **Parallel Requests**: Makes concurrent API calls when possible
- **Caching**: Avoids duplicate processing of the same addon
- **Rate Limiting**: Respects API rate limits to avoid blocking
- **Timeouts**: Configurable timeouts to prevent hanging requests

## Troubleshooting

### Common Issues

1. **"Environment validation failed"**

   - Check that all required environment variables are set
   - Verify API keys are valid and have proper permissions

2. **"Database connection failed"**

   - Verify Appwrite endpoint and project ID
   - Check API key permissions include database access

3. **"Rate limit exceeded"**

   - Increase delays between requests
   - Reduce batch size
   - Check API key quotas

4. **"Collection access failed"**
   - Verify collection ID is correct
   - Check that the collection exists and is accessible

### Debug Mode

Set `NODE_ENV=development` to enable detailed error stack traces in responses.

## Contributing

When modifying this function:

1. Update the version in `package.json`
2. Add tests for new functionality
3. Update this documentation
4. Test locally before deploying
5. Monitor logs after deployment

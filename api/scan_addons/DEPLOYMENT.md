# Scan Addons Function - Deployment Guide

This guide covers the deployment and configuration of the Scan Addons function.

## Prerequisites

1. **Appwrite CLI** installed and configured
2. **Access** to your Appwrite project with admin privileges
3. **API Keys** for CurseForge and Modrinth (if required)
4. **Environment variables** properly configured

## Deployment Steps

### 1. Verify Function Configuration

The function should be configured in `appwrite.json`:

```json
{
  "$id": "scan_addons",
  "execute": ["any"],
  "name": "Scan Addons",
  "enabled": true,
  "logging": true,
  "runtime": "node-18.0",
  "scopes": [
    "databases.read",
    "databases.write",
    "collections.read",
    "documents.read",
    "documents.write"
  ],
  "events": [],
  "schedule": "0 2 * * *",
  "timeout": 900,
  "entrypoint": "src/main.js",
  "commands": "npm install",
  "path": "functions/Scan Addons"
}
```

### 2. Deploy the Function

#### Option A: Deploy via Appwrite CLI (Recommended)

```bash
# Navigate to project root
cd /path/to/blueprint-create

# Deploy all functions (including Scan Addons)
appwrite deploy functions

# Or deploy only the Scan Addons function
appwrite functions createDeployment \
    --functionId=scan_addons \
    --activate=true \
    --entrypoint="src/main.js" \
    --code="functions/Scan Addons"
```

#### Option B: Deploy via Appwrite Console

1. Open Appwrite Console
2. Navigate to **Functions**
3. Find **Scan Addons** function
4. Click **Create Deployment**
5. Upload the `functions/Scan Addons` folder
6. Set entrypoint to `src/main.js`
7. Click **Deploy**

### 3. Configure Environment Variables

Set the required environment variables for the function:

```bash
# External API keys
appwrite functions updateVariable \
    --functionId=scan_addons \
    --key=CURSEFORGE_API_KEY \
    --value=your-curseforge-api-key

appwrite functions updateVariable \
    --functionId=scan_addons \
    --key=APPWRITE_FUNCTION_API_KEY \
    --value=your-appwrite-api-key
```

### 4. Test the Deployment

#### Health Check Test

```bash
# Execute health check via CLI
appwrite functions createExecution \
    --functionId=scan_addons \
    --data='{"path": "/health"}'

# Or via curl
curl -X POST \
    https://api.3de-scs.be/v1/functions/scan_addons/executions \
    -H "Content-Type: application/json" \
    -H "X-Appwrite-Project: 67ad0767000d58bb6592" \
    -H "X-Appwrite-Key: your-api-key" \
    -d '{"path": "/health"}'
```

#### Quick Scan Test

```bash
appwrite functions createExecution \
    --functionId=scan_addons \
    --data='{"path": "/quick", "query": {"maxIterations": "2", "batchSize": "10"}}'
```

### 5. Configure Monitoring

#### Set up Function Logs Monitoring

1. **Appwrite Console**: Navigate to Functions > Scan Addons > Logs
2. **Enable log streaming** for real-time monitoring
3. **Set up alerts** for error patterns

#### Health Check Monitoring

Create a monitoring script that regularly checks function health:

```bash
#!/bin/bash
# health-monitor.sh

FUNCTION_ID="scan_addons"
PROJECT_ID="67ad0767000d58bb6592"
API_KEY="your-api-key"
ENDPOINT="https://api.3de-scs.be/v1"

# Run health check
response=$(curl -s -X POST \
    "${ENDPOINT}/functions/${FUNCTION_ID}/executions" \
    -H "Content-Type: application/json" \
    -H "X-Appwrite-Project: ${PROJECT_ID}" \
    -H "X-Appwrite-Key: ${API_KEY}" \
    -d '{"path": "/health"}')

# Check if health check passed
if echo "$response" | grep -q '"status":"healthy"'; then
    echo "✅ Scan Addons function is healthy"
    exit 0
else
    echo "❌ Scan Addons function health check failed"
    echo "$response"
    exit 1
fi
```

### 6. Schedule Configuration

The function is configured to run daily at 2 AM UTC. To modify the schedule:

```bash
appwrite functions update \
    --functionId=scan_addons \
    --schedule="0 2 * * *"  # Daily at 2 AM

# Other schedule examples:
# "0 */6 * * *"   # Every 6 hours
# "0 0 * * 0"     # Weekly on Sunday
# "0 1 1 * *"     # Monthly on 1st day
```

## Troubleshooting

### Common Deployment Issues

#### 1. Function Won't Deploy

**Error**: "Deployment failed"

**Solutions**:

- Check that `package.json` is valid
- Verify all dependencies are properly listed
- Ensure `src/main.js` exists and is valid
- Check function size limits

#### 2. Environment Variables Not Set

**Error**: "Environment validation failed"

**Solutions**:

- Verify all required variables are set in Appwrite Console
- Check variable names match exactly (case-sensitive)
- Ensure API keys are valid and have proper permissions

#### 3. Function Timeouts

**Error**: "Function execution timed out"

**Solutions**:

- Increase function timeout in `appwrite.json` (max 900 seconds)
- Reduce `maxIterations` and `batchSize` parameters
- Increase delays between requests to avoid rate limits

#### 4. API Rate Limits

**Error**: "Rate limit exceeded"

**Solutions**:

- Increase `REQUEST_DELAY` and `ITERATION_DELAY`
- Reduce `SCAN_BATCH_SIZE`
- Check API key quotas and limits

### Monitoring and Debugging

#### View Function Logs

```bash
# View recent logs
appwrite functions listExecutions --functionId=scan_addons --limit=10

# View specific execution
appwrite functions getExecution \
    --functionId=scan_addons \
    --executionId=execution-id-here
```

#### Debug Mode

Enable debug mode by setting environment variable:

```bash
appwrite functions updateVariable \
    --functionId=scan_addons \
    --key=NODE_ENV \
    --value=development
```

## Performance Optimization

### Recommended Settings

For **production environments**:

```bash
MAX_ITERATIONS=50
SCAN_BATCH_SIZE=50
ITERATION_DELAY=5000
REQUEST_DELAY=1000
```

For **development/testing**:

```bash
MAX_ITERATIONS=10
SCAN_BATCH_SIZE=20
ITERATION_DELAY=2000
REQUEST_DELAY=500
```

For **high-volume scanning**:

```bash
MAX_ITERATIONS=100
SCAN_BATCH_SIZE=100
ITERATION_DELAY=10000
REQUEST_DELAY=2000
```

### Monitoring Performance

Track these metrics:

- **Execution time**: Should complete within timeout limits
- **Iteration count**: Actual vs target iterations
- **API response times**: Monitor for degradation
- **Error rates**: Keep below 5%
- **Database write performance**: Monitor document creation/update rates

## Security Considerations

1. **API Key Security**:

   - Store API keys as environment variables only
   - Rotate keys regularly
   - Use minimum required permissions

2. **Function Permissions**:

   - Review and minimize scopes
   - Monitor function execution logs
   - Set up alerts for unusual activity

3. **Rate Limiting**:
   - Respect external API limits
   - Implement proper retry mechanisms
   - Monitor for abuse patterns

## Maintenance

### Regular Tasks

1. **Weekly**: Review function logs for errors
2. **Monthly**: Check API key validity and quotas
3. **Quarterly**: Review and optimize performance settings
4. **As needed**: Update dependencies and runtime versions

### Updates and Versioning

When updating the function:

1. Test changes locally first
2. Deploy to staging environment
3. Monitor staging performance
4. Deploy to production during low-traffic periods
5. Monitor production logs closely after deployment

## Support

For issues with this function:

1. Check the function logs in Appwrite Console
2. Review this deployment guide
3. Test locally using the test script
4. Check the main README.md for detailed function documentation
5. Verify environment variables and API keys are correct

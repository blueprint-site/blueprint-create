# Environment Variables Migration Guide

This document outlines the environment variable naming changes made to standardize the Blueprint platform configuration.

## Changes Made

### Environment Variable Name Updates

The following environment variables have been renamed to match TypeScript type definitions and standardize naming conventions:

| Old Name | New Name | Description |
|----------|----------|-------------|
| `APP_APPWRITE_URL` | `APPWRITE_URL` | Appwrite API endpoint URL |
| `APP_APPWRITE_PROJECT_ID` | `APPWRITE_PROJECT_ID` | Appwrite project identifier |
| `APP_MEILISEARCH_URL` | `MEILISEARCH_URL` | Meilisearch instance URL |
| `APP_MEILISEARCH_API_KEY` | `MEILISEARCH_API_KEY` | Meilisearch API key |

### New Environment Variables Added

| Variable Name | Description | Default Value |
|---------------|-------------|---------------|
| `APP_URL` | Complete application URL with port | `http://localhost:5173` |
| `APPWRITE_MANAGE_USERS_FUNCTION_ID` | Appwrite function ID for user management | `67f99445001dd9278180` |

## Migration Steps

### For Local Development

1. Update your `env.js` file with the new variable names:

```javascript
// Before
window._env_ = {
    APP_BASE_URL: "http://localhost",
    APP_PORT: 5173,
    APP_APPWRITE_URL: "https://api.blueprint-create.com/v1",
    APP_APPWRITE_PROJECT_ID: "683770670016d1661c37",
    APP_MEILISEARCH_URL: "https://meilisearch.blueprint-create.net",
    APP_MEILISEARCH_API_KEY: "your-api-key"
};

// After
window._env_ = {
    APP_URL: "http://localhost:5173",
    APP_BASE_URL: "http://localhost",
    APP_PORT: 5173,
    APPWRITE_URL: "https://api.blueprint-create.com/v1",
    APPWRITE_PROJECT_ID: "683770670016d1661c37",
    APPWRITE_MANAGE_USERS_FUNCTION_ID: "67f99445001dd9278180",
    MEILISEARCH_URL: "https://meilisearch.blueprint-create.net",
    MEILISEARCH_API_KEY: "your-api-key"
};
```

### For Docker Deployments

Update your Docker environment variables:

```bash
# Before
docker run -p 80:80 \
  -e APP_BASE_URL=https://blueprint-create.com \
  -e APP_PORT=443 \
  -e APPWRITE_URL=https://cloud.appwrite.io/v1 \
  -e APPWRITE_PROJECT_ID=production-project-id \
  -e MEILISEARCH_URL=https://production-meilisearch-url \
  -e MEILISEARCH_API_KEY=production-api-key \
  blueprint-app

# After
docker run -p 80:80 \
  -e APP_URL=https://blueprint-create.com \
  -e APP_BASE_URL=https://blueprint-create.com \
  -e APP_PORT=443 \
  -e APPWRITE_URL=https://cloud.appwrite.io/v1 \
  -e APPWRITE_PROJECT_ID=production-project-id \
  -e APPWRITE_MANAGE_USERS_FUNCTION_ID=production-function-id \
  -e MEILISEARCH_URL=https://production-meilisearch-url \
  -e MEILISEARCH_API_KEY=production-api-key \
  blueprint-app
```

## Files Updated

The following files were updated as part of this migration:

### Configuration Files
- `env.js` - Updated environment variable names
- `entrypoint.sh` - Updated Docker environment variable mapping

### Documentation Files
- `docs/getting-started/environment.md` - Updated all examples and references
- `docs/getting-started/installation.md` - Updated installation instructions
- `docs/api/appwrite.md` - Updated Appwrite configuration examples

### Code Files
- TypeScript type definitions already matched the new naming convention
- Application code already used the correct variable names

## Breaking Changes

⚠️ **Warning**: These changes are breaking changes for existing deployments.

If you have existing deployments, you must update your environment configuration to use the new variable names. The old variable names will no longer work and will cause the application to fail to connect to Appwrite and Meilisearch services.

## Verification

After migration, verify that:

1. ✅ Appwrite connection works (no "Invalid endpoint URL" errors)
2. ✅ Meilisearch search functionality works
3. ✅ User authentication flows work properly
4. ✅ File uploads and storage operations work
5. ✅ All environment-dependent features function correctly

## Rollback

If you need to rollback these changes:

1. Revert the `env.js` file to use the old variable names
2. Revert the `src/config/appwrite.ts` file to use `APP_APPWRITE_URL` and `APP_APPWRITE_PROJECT_ID`
3. Update TypeScript type definitions to match the old naming

However, we recommend moving forward with the new standardized naming convention.

# Environment Configuration

Blueprint uses environment variables to configure its behavior. This guide explains how environment configuration works in the project and how to set it up for different environments.

## Environment Loading

Blueprint uses a special approach to load environment variables at runtime, allowing configuration changes without requiring a rebuild of the application.

### Runtime Environment Configuration

Rather than using traditional build-time environment variables with Vite (which would be embedded in the built assets), Blueprint loads environment variables at runtime via a `env.js` file that defines a global `window._env_` object.

This approach has several advantages:
- Configuration can be updated without rebuilding the application
- Different environments can use the same build artifacts
- Environment variables can be changed in deployed environments

## Required Environment Variables

Blueprint requires the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_BASE_URL` | Base URL of the application (without port) | `http://localhost` or `https://blueprint-create.com` |
| `APP_PORT` | Port number the application runs on | `5174` or `80` |
| `APP_APPWRITE_URL` | URL to the Appwrite instance | `https://cloud.appwrite.io/v1` |
| `APP_APPWRITE_PROJECT_ID` | Appwrite project ID | `64f8c91a9b6c4` |
| `APP_MEILISEARCH_URL` | URL to the Meilisearch instance | `https://ms-12345678-blueprint.a.searchythingy.com` |
| `APP_MEILISEARCH_API_KEY` | Meilisearch API key | `b2b7f6e37d4d9c8a1e5f3b2a7c6e9d8` |

> **Note**: While OAuth redirects use `window.location.origin` for dynamic URL detection, `APP_BASE_URL` and `APP_PORT` are available for CORS configuration, API callbacks, email templates, and other use cases that require knowing the application's URL.

## Setting Up Environment Configuration

### Local Development

For local development, create a `public/env.js` file with the following structure:

```javascript
window._env_ = {
  APP_BASE_URL: "http://localhost",
  APP_PORT: 5174,
  APP_APPWRITE_URL: "http://localhost:8000/v1",  // or your cloud Appwrite URL
  APP_APPWRITE_PROJECT_ID: "your-project-id",
  APP_MEILISEARCH_URL: "http://localhost:7700",  // or your cloud Meilisearch URL
  APP_MEILISEARCH_API_KEY: "your-api-key"
};
```

This file is loaded by the HTML template and makes the environment variables available to the application.

### Environment Loading Process

The environment loading process is handled in the `App.tsx` component:

```typescript
useEffect(() => {
  const loadEnv = () => {
    const script = document.createElement('script');
    script.src = `/env.js?version=${new Date().getTime()}`;
    script.onload = () => {
      console.log('env.js loaded');
      setEnvLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Error while loading `env.js`');
    };
    document.head.appendChild(script);
  };

  loadEnv();
}, []);
```

The cache-busting query parameter `?version=${new Date().getTime()}` ensures the browser always loads the latest version of the file.

### Using Environment Variables

To use environment variables in your code:

```typescript
// Example of using environment variables
const appwriteUrl = window._env_?.APP_APPWRITE_URL || '';
const appwriteProjectId = window._env_?.APP_APPWRITE_PROJECT_ID || '';
```

## Environment Configuration for Different Deployment Targets

### Production Deployment

For production deployment, you need to:

1. Create an `env.js` file with production values:

```javascript
window._env_ = {
  APP_BASE_URL: "https://blueprint-create.com",
  APP_PORT: 443,
  APP_APPWRITE_URL: "https://cloud.appwrite.io/v1",
  APP_APPWRITE_PROJECT_ID: "production-project-id",
  APP_MEILISEARCH_URL: "https://production-meilisearch-url",
  APP_MEILISEARCH_API_KEY: "production-api-key"
};
```

2. Place this file in the `dist` directory after building the application.

### Docker Deployment

For Docker deployments, the `env.js` file is generated at container startup using environment variables passed to the container.

The `entrypoint.sh` script handles this:

```bash
#!/bin/sh

# Create env.js with environment variables
cat > /usr/share/nginx/html/env.js << EOF
window._env_ = {
  APP_BASE_URL: "${APP_BASE_URL}",
  APP_PORT: "${APP_PORT}",
  APP_APPWRITE_URL: "${APPWRITE_URL}",
  APP_APPWRITE_PROJECT_ID: "${APPWRITE_PROJECT_ID}",
  APP_MEILISEARCH_URL: "${MEILISEARCH_URL}",
  APP_MEILISEARCH_API_KEY: "${MEILISEARCH_API_KEY}"
};
EOF

# Start nginx
nginx -g "daemon off;"
```

When running the Docker container, pass the environment variables:

```bash
docker run -p 80:80 \
  -e APP_BASE_URL=https://blueprint-create.com \
  -e APP_PORT=443 \
  -e APPWRITE_URL=https://cloud.appwrite.io/v1 \
  -e APPWRITE_PROJECT_ID=production-project-id \
  -e MEILISEARCH_URL=https://production-meilisearch-url \
  -e MEILISEARCH_API_KEY=production-api-key \
  blueprint-app
```

## Environment Types

Blueprint is designed to work with the following environment types:

### Development Environment

- Used for local development
- Uses local or development cloud services
- Enables development features

### Staging Environment

- Mirrors production configuration
- Used for testing before production deployment
- Uses separate database instances

### Production Environment

- Live environment for end users
- Uses production database instances
- Disables development features

## Type Definitions for Environment Variables

To get TypeScript type checking for environment variables, the project includes type definitions in `/src/types/global.d.ts`:

```typescript
interface Window {
  _env_?: {
    APP_BASE_URL: string;
    APP_PORT: number;
    APP_APPWRITE_URL: string;
    APP_APPWRITE_PROJECT_ID: string;
    APP_MEILISEARCH_URL: string;
    APP_MEILISEARCH_API_KEY: string;
  };
}
```

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Check that the `env.js` file exists in the correct location
   - Check browser console for loading errors
   - Verify the file syntax is correct

2. **Services not connecting**
   - Verify the URLs and credentials in your environment variables
   - Check CORS settings on the Appwrite and Meilisearch instances
   - Verify the services are running and accessible

3. **OAuth redirection issues**
   - OAuth redirects now use dynamic URL detection (`window.location.origin`)
   - Ensure OAuth providers are configured with the correct redirect URLs for your domain
   - Check that the OAuth success/error routes (`/auth/success`, `/auth/error`) are properly configured

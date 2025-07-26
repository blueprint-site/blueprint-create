# Installation Guide

This guide will walk you through setting up the Blueprint platform for local development.

## Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Git

## Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/blueprint-site/blueprint-create.git
cd blueprint-create
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment configuration**

Create an `env.js` file in the project root with the following variables:

```javascript
window._env_ = {
  APP_URL: "http://localhost:5173",
  APP_BASE_URL: "http://localhost",
  APP_PORT: 5173,
  APPWRITE_URL: "your_appwrite_url",
  APPWRITE_PROJECT_ID: "your_project_id",
  APPWRITE_MANAGE_USERS_FUNCTION_ID: "your_function_id",
  MEILISEARCH_URL: "your_meilisearch_url",
  MEILISEARCH_API_KEY: "your_api_key"
};
```

4. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Backend Services Setup

### Appwrite Setup

1. Create an account on [Appwrite](https://appwrite.io/)
2. Create a new project
3. Create the following collections:

#### Addons Collection
- Create a collection named `addons`
- Add the following attributes:
  - `name` (string, required)
  - `description` (string, required)
  - `slug` (string, required)
  - `author` (string, required)
  - `categories` (string array)
  - `downloads` (integer)
  - `icon` (string, URL to icon)
  - `sources` (string array)
  - `loaders` (string array)
  - `minecraft_versions` (string array)
  - `create_versions` (string array)
  - `curseforge_raw` (JSON object)
  - `modrinth_raw` (JSON object)

#### Featured Addons Collection
- Create a collection named `featured_addons`
- Add the following attributes:
  - `addon_id` (string, required)
  - `title` (string, required)
  - `description` (string, required, max 500 characters)
  - `image_url` (string, required, URL to icon/image)
  - `banner_url` (string, required, URL to banner image)
  - `display_order` (number, required, 0-20)
  - `slug` (string, required)
  - `active` (boolean, required)
  - `category` (string array, optional)

#### Schematics Collection
- Create a collection named `schematics`
- Add the following attributes:
  - `name` (string, required)
  - `description` (string, required)
  - `slug` (string, required)
  - `author` (string, required)
  - `user_id` (string, required)
  - `categories` (string array)
  - `downloads` (integer)
  - `image` (string, URL to preview image)
  - `file` (string, URL to schematic file)
  - `minecraft_versions` (string array)
  - `create_versions` (string array)

#### Blogs Collection
- Create a collection named `blogs`
- Add the following attributes:
  - `title` (string, required)
  - `content` (string, required)
  - `slug` (string, required)
  - `author` (string, required)
  - `tags` (string array)
  - `published` (boolean)
  - `publishDate` (datetime)
  - `coverImage` (string, URL to cover image)

4. Set up appropriate indexes and permissions
5. Configure API keys with the necessary permissions

### Meilisearch Setup

1. Set up Meilisearch following the [official guide](https://docs.meilisearch.com/learn/getting_started/installation.html)
2. Create the necessary indexes:

```bash
# Create indexes
curl -X POST 'http://localhost:7700/indexes' \
  -H 'Content-Type: application/json' \
  --data '{
    "uid": "addons",
    "primaryKey": "$id"
  }'

curl -X POST 'http://localhost:7700/indexes' \
  -H 'Content-Type: application/json' \
  --data '{
    "uid": "schematics",
    "primaryKey": "$id"
  }'

curl -X POST 'http://localhost:7700/indexes' \
  -H 'Content-Type: application/json' \
  --data '{
    "uid": "blogs",
    "primaryKey": "$id"
  }'
```

3. Configure search settings:

```bash
# Configure searchable attributes for addons
curl -X PUT 'http://localhost:7700/indexes/addons/settings/searchable-attributes' \
  -H 'Content-Type: application/json' \
  --data '["name", "description", "author", "categories"]'

# Configure filterable attributes for addons
curl -X PUT 'http://localhost:7700/indexes/addons/settings/filterable-attributes' \
  -H 'Content-Type: application/json' \
  --data '["categories", "loaders", "minecraft_versions", "create_versions"]'
```

4. Set up a synchronization strategy between Appwrite and Meilisearch (through a serverless function or cron job)

## Environment Configuration

The application uses an `env.js` file loaded at runtime to configure environment variables. In production, this is generated automatically. For development:

1. Create a `public/env.js` file with the following structure:

```javascript
window._env_ = {
  APP_URL: "http://localhost:5173",
  APP_BASE_URL: "http://localhost",
  APP_PORT: 5173,
  APPWRITE_URL: "http://localhost:8000/v1",
  APPWRITE_PROJECT_ID: "your-project-id",
  APPWRITE_MANAGE_USERS_FUNCTION_ID: "your-function-id",
  MEILISEARCH_URL: "http://localhost:7700",
  MEILISEARCH_API_KEY: "your-api-key"
};
```

## Testing the Installation

To ensure your installation is working correctly:

1. Check that the application runs without errors in the console
2. Verify that you can log in with at least one OAuth provider
3. Confirm that the addons page loads data (you'll need some sample data first)
4. Test searching and filtering functionality
5. Verify the featured addons slideshow works on the homepage

## Troubleshooting

### Common Issues

#### "Failed to load env.js"
- Ensure the `public/env.js` file exists and is correctly formatted
- Verify that the file is accessible at http://localhost:5173/env.js

#### "Failed to connect to Appwrite"
- Check your Appwrite URL and project ID
- Ensure Appwrite is running and accessible
- Verify API keys have the correct permissions

#### "Failed to connect to Meilisearch"
- Check your Meilisearch URL and API key
- Ensure Meilisearch is running and accessible
- Verify the indexes have been created

#### "Cannot load addons/schematics/blogs"
- Ensure you have data in the collections
- Check the console for specific error messages
- Verify that your user has the correct permissions to access the data

#### "Featured Addons not displaying"
- Verify the `featured_addons` collection exists and has data
- Check that at least one addon is marked as active
- Ensure the display order is set correctly
- Verify image URLs are accessible

#### Build Errors
- Make sure you're using the correct Node.js version
- Try deleting `node_modules` and running `npm install` again
- Check for any TypeScript errors with `npm run lint`

## Next Steps

Now that you have Blueprint running locally, you can:

- Learn about the [project structure](project-structure.md)
- Understand the [architecture](../architecture/overview.md)
- Explore the [API integrations](../api/appwrite.md)
- Start [contributing](../contributing/workflow.md) to the project

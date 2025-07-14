#!/bin/sh
cat <<EOF > /usr/share/nginx/html/env.js
window._env_ = {
  APP_BASE_URL: "${APP_BASE_URL}",
  APP_PORT: "${APP_PORT}",
  MEILISEARCH_URL: "${MEILISEARCH_URL}",
  MEILISEARCH_API_KEY: "${MEILISEARCH_API_KEY}",
  APPWRITE_URL: "${APPWRITE_URL}",
  APPWRITE_PROJECT_ID: "${APPWRITE_PROJECT_ID}"
};
EOF

echo "✅ Fichier env.js généré avec succès :"
cat /usr/share/nginx/html/env.js

exec "$@"

#!/bin/sh

# Générer `env.js` avec les variables d'environnement injectées par Coolify
cat <<EOF > /usr/share/nginx/html/env.js
window._env_ = {
  APP_URL: "${APP_URL}",
  MEILISEARCH_URL: "${MEILISEARCH_URL}",
  MEILISEARCH_API_KEY: "${MEILISEARCH_API_KEY}",
  APPWRITE_URL: "${APPWRITE_URL}",
  APPWRITE_PROJECT_ID: "${APPWRITE_PROJECT_ID}"

};
EOF

echo "✅ Fichier env.js généré avec succès :"
cat /usr/share/nginx/html/env.js

# Démarrer Nginx
exec "$@"

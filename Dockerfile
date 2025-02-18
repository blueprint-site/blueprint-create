# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the app (assurez-vous que Vite génère votre app dans le dossier "dist")
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (votre configuration Nginx)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le script d'entrypoint dans l'image
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Lancer le script d'entrypoint
CMD ["/entrypoint.sh"]

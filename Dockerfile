# Stage 1: Build
FROM node:23-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with verification
RUN npm ci --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Verify required files before building
RUN test -f vite.config.ts

# Build the app (make sure the build output exists in 'dist')
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script, fixing potential CRLF issues
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Run the entrypoint script to configure the environment variables before starting Nginx
ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

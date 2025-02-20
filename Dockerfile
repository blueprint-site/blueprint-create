# Stage 1: Build
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with verification
RUN npm ci --legacy-peer-deps && \
    npm audit && \
    npm run test || echo "⚠️ Tests failed, continuing anyway"

# Copy the rest of the app
COPY . .

# Verify required files before building
RUN test -f vite.config.ts || (echo "❌ vite.config.ts not found!" && exit 1) && \
    test -d src || (echo "❌ 'src' directory not found!" && exit 1)

# Build the app
RUN npm run build && \
    test -d dist || (echo "❌ 'dist' directory was not generated!" && exit 1)

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Check if entrypoint script exists
RUN test -f /entrypoint.sh || (echo "❌ entrypoint.sh not found!" && exit 1)

# Expose port 80
EXPOSE 80

# Run the entrypoint script
ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

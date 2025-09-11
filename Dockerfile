# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production with nginx (better for Module Federation)
FROM nginx:alpine

# Copy custom nginx config
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx configuration for proper routing
RUN echo 'server { \
    listen 3002; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # CRITICAL: Serve remoteEntry.js with correct headers \
    location = /remoteEntry.js { \
        add_header Access-Control-Allow-Origin *; \
        add_header Cache-Control "no-cache"; \
        try_files $uri =404; \
    } \
    \
    # Serve other static files \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        add_header Access-Control-Allow-Origin *; \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Handle client-side routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/remoteEntry.js || exit 1

CMD ["nginx", "-g", "daemon off;"]

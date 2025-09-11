# Single stage build - simple and reliable
FROM node:18-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files first
COPY package.json package-lock.json* ./

# Clean install dependencies
RUN npm ci || npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Check if build succeeded
RUN ls -la dist/ && \
    if [ -f dist/remoteEntry.js ]; then \
        echo "✅ Build successful - remoteEntry.js found"; \
    else \
        echo "❌ Build failed - remoteEntry.js not found" && exit 1; \
    fi

# Install serve for production
RUN npm install -g serve

EXPOSE 3002

# Health check with curl (now available)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/ || exit 1

# Start the server
CMD ["serve", "-s", "dist", "-l", "3002", "--cors"]

# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./public

# Expose port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Start server
CMD ["node", "index.js"]

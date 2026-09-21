# Use Node 22 to match your working project
FROM node:22-alpine AS base

# Stage 1: Builder
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .

# Generate Prisma Client for the build step
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=4000

# Install only production dependencies (+ tsx for seed)
COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
# Install postgresql-client for pg_isready in entrypoint
RUN apk add --no-cache postgresql-client
# Install tsx for seed script execution in production
RUN npm install --save-dev tsx

# Copy built files from builder
COPY --from=builder /app/dist ./dist
# Copy src so seed script can be run via tsx if needed
COPY src ./src

# Copy and set up entrypoint
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Give ownership to the node user
RUN chown -R node:node /app

# Switch to unprivileged user for security
USER node

EXPOSE 4000

# Entrypoint runs migrations then starts the server
CMD ["sh", "./docker-entrypoint.sh"]
# Use Node 22 to match your backend and ensure compatibility
FROM node:22-alpine AS base

# 1. Install dependencies
FROM base AS deps
WORKDIR /app/frontend
# libc6-compat is often needed for shared libraries in Alpine
RUN apk add --no-cache libc6-compat
COPY frontend/package.json frontend/package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci

# 2. Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY package.json ./
COPY frontend ./frontend
COPY shared ./shared

WORKDIR /app/frontend

# Build-time environment variables
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_RELEASE_SHA

ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_RELEASE_SHA=$NEXT_PUBLIC_RELEASE_SHA
RUN ls -la /app/shared && head -n 5 /app/shared/factors.json
RUN npm run build

# 3. Production image
FROM base AS runner
WORKDIR /app/frontend

ENV NODE_ENV=production

# Copy public assets
COPY --from=builder /app/frontend/public ./public

# Create the .next directory as root
RUN mkdir .next

# Automatically leverage output traces to reduce image size
# Note: We removed the --chown=nextjs:nodejs flags here
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

# We removed "USER nextjs" - the container will now run as root by default

EXPOSE 3000
ENV PORT=3000

# Next.js standalone mode runs via server.js
CMD ["node", "frontend/server.js"]
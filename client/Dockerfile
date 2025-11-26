FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy shared package first
COPY shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Install client dependencies
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/shared ./shared
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client/ ./client

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time arguments for Next.js public environment variables
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_DISABLE_SIGNUP
ARG NEXT_PUBLIC_CLOUD
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_ENABLE_TURNSTILE
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_ENABLE_GSC
ARG NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH
ARG NEXT_PUBLIC_ENABLE_GITHUB_OAUTH
ARG NEXT_PUBLIC_ENABLE_WEB_VITALS
ARG NEXT_PUBLIC_ENABLE_ERROR_TRACKING

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_DISABLE_SIGNUP=${NEXT_PUBLIC_DISABLE_SIGNUP}
ENV NEXT_PUBLIC_CLOUD=${NEXT_PUBLIC_CLOUD}
ENV NEXT_PUBLIC_MAPBOX_TOKEN=${NEXT_PUBLIC_MAPBOX_TOKEN}
ENV NEXT_PUBLIC_ENABLE_TURNSTILE=${NEXT_PUBLIC_ENABLE_TURNSTILE}
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
ENV NEXT_PUBLIC_ENABLE_GSC=${NEXT_PUBLIC_ENABLE_GSC}
ENV NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=${NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH}
ENV NEXT_PUBLIC_ENABLE_GITHUB_OAUTH=${NEXT_PUBLIC_ENABLE_GITHUB_OAUTH}
ENV NEXT_PUBLIC_ENABLE_WEB_VITALS=${NEXT_PUBLIC_ENABLE_WEB_VITALS}
ENV NEXT_PUBLIC_ENABLE_ERROR_TRACKING=${NEXT_PUBLIC_ENABLE_ERROR_TRACKING}

WORKDIR /app/client
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
LABEL org.opencontainers.image.source=https://github.com/antebudimir/rybbit
LABEL org.opencontainers.image.description="Rybbit client with enterprise features for self-hosting"
LABEL org.opencontainers.image.licenses=AGPL-3.0
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/client/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/static ./.next/static

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
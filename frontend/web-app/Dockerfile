FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY frontend/web-app/package*.json ./
RUN  npm install --omit-dev

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/web-app ./

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

ARG NEXTAUTH_URL_INTERNAL
ENV NEXTAUTH_URL_INTERNAL=${NEXTAUTH_URL_INTERNAL}

ARG ID_SERVER_URL
ENV ID_SERVER_URL=${ID_SERVER_URL}

ARG API_URL
ENV API_URL=${API_URL}

ARG NEXT_PUBLIC_NOTIFICATION_URL
ENV NEXT_PUBLIC_NOTIFICATION_URL=${NEXT_PUBLIC_NOTIFICATION_URL}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
#
#ENV PORT 3000

CMD ["node", "server.js"]
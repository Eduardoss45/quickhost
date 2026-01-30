# =========================
# BASE
# =========================
FROM node:20-alpine AS base
WORKDIR /app

# =========================
# DEPS (monorepo completo)
# =========================
FROM base AS deps

COPY package.json package-lock.json ./
COPY apps/media-service/package.json apps/media-service/

RUN npm install

# =========================
# DEPS DIMENSIONADO (media-service)
# =========================
FROM deps AS media-service-deps

RUN npm prune --workspace=@quickhost/media-service --omit=optional=false

# =========================
# BUILD
# =========================
FROM base AS builder

# Dependências nativas para sharp
RUN apk add --no-cache python3 make g++ libc6-compat vips-dev vips-tools

COPY --from=media-service-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=@quickhost/media-service

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

# usuário com UID/GID FIXOS
RUN addgroup -g 101 app \
    && adduser -D -u 100 -G app app

COPY --from=builder /app/apps/media-service/dist ./dist
COPY --from=media-service-deps /app/node_modules ./node_modules
COPY apps/media-service/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/src/main.js"]

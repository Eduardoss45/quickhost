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
COPY apps/accommodations-service/package.json apps/accommodations-service/

RUN npm install

# =========================
# DEPS DIMENSIONADO (accommodations-service)
# =========================
FROM deps AS accommodations-service-deps

RUN npm prune --workspace=@quickhost/accommodations-service --omit=optional=false

# =========================
# BUILD
# =========================
FROM base AS builder

# Dependências nativas para sharp
RUN apk add --no-cache python3 make g++ libc6-compat vips-dev vips-tools

COPY --from=accommodations-service-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=@quickhost/accommodations-service

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=accommodations-service-deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/accommodations-service/dist ./dist
COPY apps/accommodations-service/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/src/main.js"]

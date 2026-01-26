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
COPY apps/api-gateway/package.json apps/api-gateway/

# Instala todas as dependências (dev + prod) do monorepo
RUN npm install

# =========================
# DEPS DIMENSIONADO (somente api-gateway)
# =========================
FROM deps AS api-gateway-deps

RUN npm prune --workspace=@quickhost/api-gateway --omit=optional=false

# =========================
# BUILD
# =========================
FROM base AS builder

# Dependências nativas para sharp
RUN apk add --no-cache python3 make g++ libc6-compat vips-dev vips-tools

# Copia node_modules do workspace
COPY --from=api-gateway-deps /app/node_modules ./node_modules

# Copia código fonte
COPY . .

# Garante types que faltam
RUN npm install --workspace=@quickhost/api-gateway @types/express @types/multer --save-dev

# Build do workspace
RUN npm run build --workspace=@quickhost/api-gateway

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=api-gateway-deps /app/node_modules ./node_modules
COPY apps/api-gateway/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]

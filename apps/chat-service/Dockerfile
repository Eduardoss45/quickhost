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
COPY apps/chat-service/package.json apps/chat-service/

RUN npm install

# =========================
# DEPS DIMENSIONADO (chat-service)
# =========================
FROM deps AS chat-service-deps

RUN npm prune --workspace=@quickhost/chat-service --omit=optional=false

# =========================
# BUILD
# =========================
FROM base AS builder

COPY --from=chat-service-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=@quickhost/chat-service

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=chat-service-deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/chat-service/dist ./dist
COPY apps/chat-service/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/src/main.js"]

# =========================
# BASE
# =========================
FROM node:20-alpine AS base
WORKDIR /app

# =========================
# DEPS
# =========================
FROM base AS deps

# Copiamos apenas manifests para cache eficiente
COPY package.json package-lock.json ./
COPY apps/chat-service/package.json apps/chat-service/

RUN npm install

# =========================
# BUILD
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build somente o serviço
RUN npm run build --workspace=@quickhost/chat-service

# =========================
# RUNTIME
# =========================
FROM base AS runner

# Segurança básica
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/chat-service/dist ./dist
COPY --from=builder /app/apps/chat-service/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
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
COPY apps/booking-service/package.json apps/booking-service/

RUN npm install

# =========================
# DEPS DIMENSIONADO (booking-service)
# =========================
FROM deps AS booking-service-deps

RUN npm prune --workspace=@quickhost/booking-service --omit=optional=false

# =========================
# BUILD
# =========================
FROM base AS builder

COPY --from=booking-service-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=@quickhost/booking-service

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=booking-service-deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/booking-service/dist ./dist
COPY apps/booking-service/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/src/main.js"]

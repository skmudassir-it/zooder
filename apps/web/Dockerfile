FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Fix internal hostnames for Coolify — Coolify uses UUIDs for Docker DNS, not service names
# If the env var still has the old service-name hostname, override with the correct UUID-based URL
# Database: postgresql://zooder:<password>@i1r3c5ba6blj7vv72kj36mvw:5432/zooder_db
# Redis: redis://default:<password>@tdg6qd263y68zv1nz0j3odew:6379/0
ENV INJECT_DB=postgresql://zooder:HXnCxvbVUuwj3Hmi81PudVtfTMXi3GZt8nTed3FruOqNFcPy7DP97fpxz05R0UiH@i1r3c5ba6blj7vv72kj36mvw:5432/zooder_db
ENV INJECT_REDIS=redis://default:In7PQ9TT4GiZQwAD5C9euXEGyPPb1hMolBLHzYPMgQvwlgZ9UUnBxg4ZUMxTwB9s@tdg6qd263y68zv1nz0j3odew:6379/0

EXPOSE 3000
CMD ["sh", "-c", "  if echo "$DATABASE_URL" | grep -q 'zooder-postgres'; then export DATABASE_URL="$INJECT_DB"; fi;   if echo "$REDIS_URL" | grep -q 'zooder-redis'; then export REDIS_URL="$INJECT_REDIS"; fi;   echo '==> Running migrations...';   npx prisma db push --skip-generate --accept-data-loss 2>&1;   echo '==> Starting server...';   node server.js"]

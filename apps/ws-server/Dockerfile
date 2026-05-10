FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/ws-server/package*.json ./apps/ws-server/
RUN npm ci
COPY apps/ws-server/ ./apps/ws-server/
RUN npm run build -w apps/ws-server

# Fix internal Coolify DNS hostnames (UUIDs, not service names)
ENV INJECT_DB=postgresql://zooder:HXnCxvbVUuwj3Hmi81PudVtfTMXi3GZt8nTed3FruOqNFcPy7DP97fpxz05R0UiH@i1r3c5ba6blj7vv72kj36mvw:5432/zooder_db
ENV INJECT_REDIS=redis://default:In7PQ9TT4GiZQwAD5C9euXEGyPPb1hMolBLHzYPMgQvwlgZ9UUnBxg4ZUMxTwB9s@tdg6qd263y68zv1nz0j3odew:6379/0

EXPOSE 3001
CMD ["sh", "-c", "  if echo "$DATABASE_URL" | grep -q 'zooder-postgres'; then export DATABASE_URL="$INJECT_DB"; fi;   if echo "$REDIS_URL" | grep -q 'zooder-redis'; then export REDIS_URL="$INJECT_REDIS"; fi;   node apps/ws-server/dist/index.js"]

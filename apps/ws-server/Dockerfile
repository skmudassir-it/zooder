FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/ws-server/package*.json ./apps/ws-server/
RUN npm ci
COPY apps/ws-server/ ./apps/ws-server/
RUN npm run build -w apps/ws-server
EXPOSE 3001
CMD ["node", "apps/ws-server/dist/index.js"]

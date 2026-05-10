FROM node:20-alpine
WORKDIR /app
COPY apps/ws-server/package*.json ./
RUN npm ci
COPY apps/ws-server/ ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]

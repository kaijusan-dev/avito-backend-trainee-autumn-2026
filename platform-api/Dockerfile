FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY shared ./shared
COPY platform-api ./platform-api

RUN PLATFORM_DATABASE_URL=postgresql://fake:fake@localhost:5432/fake \
    RESTAURANT_DATABASE_URL=postgresql://fake:fake@localhost:5432/fake \
    RESTAURANT_SERVICE_URL=http://localhost:3001 \
    npx prisma generate --config platform-api/prisma.config.ts

WORKDIR /app/platform-api
EXPOSE 3000
ENV NODE_ENV=development
CMD ["npx", "tsx", "src/server.ts"]
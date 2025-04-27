FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build


# Production image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install --omit=dev

COPY --from=builder /app/dist ./

# ARG DB_URL = "postgres://postgres:postgres@localhost:5432/test_db"

RUN pnpm run db:update

CMD ["node", "server.js"]

EXPOSE 3000
FROM node:18-alpine AS builder

RUN echo "Provide environment variables as follows: https://github.com/imashiksarkar/mini-crm-bankend/blob/0373be88f87834b1709fe91cce764a296dc99387/.env.example"

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm@8

RUN pnpm install

COPY . .

RUN pnpm run build


# Production image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm@8

RUN pnpm install --prod

COPY --from=builder /app/dist ./

CMD ["node", "server.js"]

EXPOSE 3000
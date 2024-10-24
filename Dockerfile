FROM node:20-alpine

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /ExpenseBuddy

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY src/ ./src
COPY prisma/ ./prisma

RUN pnpm install
RUN npx prisma generate
RUN pnpm run build

ENTRYPOINT ["sh", "-c"]
CMD ["npx prisma db push && npm start"]

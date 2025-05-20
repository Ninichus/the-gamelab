FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json ./
RUN pnpm install

COPY ./migrations ./db/migrations
COPY drizzle.config.ts .

CMD ["pnpm", "run", "db:apply-migrations"]

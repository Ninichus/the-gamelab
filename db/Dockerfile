FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app/db

COPY /app/db/package.json ./package.json
RUN pnpm install

COPY /app/db/migrations ./migrations
COPY drizzle.config.ts ./drizzle.config.ts

CMD ["pnpm", "run", "db:apply-migrations"]

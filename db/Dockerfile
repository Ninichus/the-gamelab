FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable

WORKDIR /db

COPY /db/package.json .
RUN pnpm install

COPY /db/migrations/ ./migrations/
COPY /db/drizzle.config.ts .

CMD ["pnpm", "run", "db:apply-migrations"]

FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app/db

COPY package.json .
RUN pnpm install

COPY ./migrations .
COPY drizzle.config.ts .

CMD ["pnpm", "run", "db:apply-migrations"]

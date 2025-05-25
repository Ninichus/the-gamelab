import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out:
    process.env.NODE_ENV === "production" ? "./migrations" : "./db/migrations",
  schema:
    process.env.NODE_ENV === "production"
      ? "./schema/index.ts"
      : "./db/schema/index.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

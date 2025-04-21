import { index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { games } from "./games";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const authors = mysqlTable(
  "authors",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id),
    role: varchar("role", { length: 40 }),
  },
  (table) => [index("user_idx").on(table.userId)]
);

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, {
    fields: [authors.userId],
    references: [users.id],
  }),
  games: many(games),
}));

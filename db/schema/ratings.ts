import {
  timestamp,
  mysqlTable,
  varchar,
  int,
  index,
  check,
} from "drizzle-orm/mysql-core";
import { games } from "./games";
import { users } from "./users";
import { relations, sql } from "drizzle-orm";
import { on } from "events";

export const ratings = mysqlTable(
  "ratings",
  {
    id: int("id").autoincrement().primaryKey(),
    author: int("author")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id, { onDelete: "cascade", onUpdate: "cascade" }),
    value: int("value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("authorx").on(table.author),
    index("game_idx").on(table.gameId),
    index("game_author_idx").on(table.gameId, table.author),
    check("value", sql`${table.value} > 0 AND ${table.value} <= 10`),
  ]
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
  game: one(games, {
    fields: [ratings.gameId],
    references: [games.id],
  }),
  author: one(users, {
    fields: [ratings.author],
    references: [users.id],
  }),
}));

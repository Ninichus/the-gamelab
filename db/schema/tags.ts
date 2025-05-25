import { mysqlTable, varchar, int, index } from "drizzle-orm/mysql-core";
import { games } from "./games";
import { relations } from "drizzle-orm";

export const tags = mysqlTable(
  "tags",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 40 }).notNull(),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [
    index("game_idx").on(table.gameId),
    index("name_idx").on(table.name),
  ]
);

export const tagsRelations = relations(tags, ({ one }) => ({
  game: one(games, {
    fields: [tags.gameId],
    references: [games.id],
  }),
}));

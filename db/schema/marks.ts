import {
  timestamp,
  mysqlTable,
  varchar,
  int,
  index,
} from "drizzle-orm/mysql-core";
import { games } from "./games";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const marks = mysqlTable(
  "marks",
  {
    id: int("id").autoincrement().primaryKey(),
    author: int("author")
      .notNull()
      .references(() => users.id),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("authorx").on(table.author),
    index("game_idx").on(table.gameId),
  ]
);

export const marksRelations = relations(marks, ({ one }) => ({
  game: one(games, {
    fields: [marks.gameId],
    references: [games.id],
  }),
  author: one(users, {
    fields: [marks.author],
    references: [users.id],
  }),
}));

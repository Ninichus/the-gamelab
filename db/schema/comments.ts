import {
  index,
  int,
  mysqlTable,
  varchar,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";
import { games } from "./games";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const comments = mysqlTable(
  "comments",
  {
    id: int("id").autoincrement().primaryKey(),
    author: int("author")
      .notNull()
      .references(() => users.id),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id),
    status: mysqlEnum("status", ["draft", "pending", "published"]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("user_idx").on(table.author),
    index("game_idx").on(table.gameId),
  ]
);

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.author],
    references: [users.id],
  }),
  game: one(games, {
    fields: [comments.gameId],
    references: [games.id],
  }),
}));

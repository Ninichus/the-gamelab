import {
  mysqlEnum,
  mysqlTable,
  varchar,
  timestamp,
  index,
  int,
} from "drizzle-orm/mysql-core";
import { games } from "./games";
import { relations } from "drizzle-orm";

export const files = mysqlTable(
  "files",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", [
      "carousel_image",
      "browse_image",
      "game_archive",
    ]).notNull(),
    uploadedAt: timestamp("updated_at").defaultNow().notNull(),
    downloadCount: int("download_count").default(0).notNull(),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id),
  },
  (table) => [
    index("files_idx").on(table.id),
    index("game_idx").on(table.gameId),
  ]
);

export const filesRelations = relations(files, ({ one }) => ({
  game: one(games, {
    fields: [files.gameId],
    references: [games.id],
  }),
}));

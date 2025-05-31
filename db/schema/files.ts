import {
  mysqlEnum,
  mysqlTable,
  varchar,
  timestamp,
  index,
  int,
  AnyMySqlColumn,
} from "drizzle-orm/mysql-core";
import { games } from "./games";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const files = mysqlTable(
  "files",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", [
      "carousel_image",
      "carousel_video",
      "carousel_video_thumbnail",
      "browse_image",
      "game_archive",
    ]).notNull(),
    index: int("index"),
    uploadedAt: timestamp("updated_at").defaultNow().notNull(),
    downloadCount: int("download_count").default(0).notNull(),
    gameId: varchar("game_id", { length: 40 })
      .notNull()
      .references(() => games.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    associatedThumbnail: varchar("associated_thumbnail", {
      length: 40,
    }).references((): AnyMySqlColumn => files.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  },
  (table) => [
    index("files_idx").on(table.id),
    index("game_idx").on(table.gameId),
    index("user_idx").on(table.userId),
  ]
);

export const filesRelations = relations(files, ({ one }) => ({
  game: one(games, {
    fields: [files.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

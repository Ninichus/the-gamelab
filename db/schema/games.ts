import {
  mysqlEnum,
  mysqlTable,
  varchar,
  timestamp,
  index,
  text,
} from "drizzle-orm/mysql-core";
import { authors } from "./authors";
import { ratings } from "./ratings";
import { comments } from "./comments";
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const games = mysqlTable(
  "games",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    type: mysqlEnum("type", [
      "board_game",
      "video_game",
      "cards_game",
    ]).notNull(),
    status: mysqlEnum("status", ["private", "pending", "published"]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    specs: varchar("specs", { length: 255 }),
  },
  (table) => [index("game_idx").on(table.id)]
);

export const gamesRelations = relations(games, ({ many }) => ({
  authors: many(authors),
  ratings: many(ratings),
  comments: many(comments),
  tags: many(tags),
}));

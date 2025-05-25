import { mysqlTable, varchar, int, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { comments } from "./comments";
import { ratings } from "./ratings";
import { authors } from "./authors";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  uid: varchar("uid", { length: 40 }).notNull().unique(),
  username: varchar("username", { length: 40 }).notNull().unique(),
  first_name: varchar("first_name", { length: 40 }).notNull(),
  last_name: varchar("last_name", { length: 40 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  ratings: many(ratings),
  authors: many(authors),
  comments: many(comments),
}));

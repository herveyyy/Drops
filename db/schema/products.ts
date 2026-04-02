import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Value stored in cents mapping exactly to UI requirements
  specs: text("specs"),
  isAvailable: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

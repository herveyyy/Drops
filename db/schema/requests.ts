import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";
import { products } from "./products";
import { files } from "./files";

export const requests = sqliteTable("requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestId: integer("guest_id")
    .notNull()
    .references(() => guests.id),
  status: text("status").notNull().default("queued"),
  totalAmount: integer("total_amount").notNull().default(0), // Cents
  auditLog: text("audit_log"), // JSON string to log state transitions globally for the request
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const requestItems = sqliteTable("request_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id")
    .notNull()
    .references(() => requests.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  fileId: integer("file_id").references(() => files.id), // Nullable because you might request a product with no file
  quantity: integer("quantity").notNull().default(1),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

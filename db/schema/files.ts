import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guests } from "./guests";

export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestId: integer("guest_id")
    .notNull()
    .references(() => guests.id),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(), // Exact local path where the file is stored
  sizeBytes: integer("size_bytes").notNull(),
  mimeType: text("mime_type").notNull(), 
  metadata: text("metadata"), // JSON block for print-specific or file-specific metadata
  status: text("status").notNull().default("pending"),
  auditLog: text("audit_log"), // Basic audit trail for tracking file changes/prints
  uploadedByIp: text("uploaded_by_ip"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

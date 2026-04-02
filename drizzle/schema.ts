import { sqliteTable, AnySQLiteColumn, uniqueIndex, integer, text, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

export const files = sqliteTable("files", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	guestId: integer("guest_id").notNull().references(() => guests.id),
	filename: text().notNull(),
	filePath: text("file_path").notNull(),
	sizeBytes: integer("size_bytes").notNull(),
	mimeType: text("mime_type").notNull(),
	metadata: text(),
	status: text().default("pending").notNull(),
	auditLog: text("audit_log"),
	uploadedByIp: text("uploaded_by_ip"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const guests = sqliteTable("guests", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const products = sqliteTable("products", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text(),
	price: integer().notNull(),
	specs: text(),
	isAvailable: integer("is_available").default(true).notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const requestItems = sqliteTable("request_items", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	requestId: integer("request_id").notNull().references(() => requests.id),
	productId: integer("product_id").notNull().references(() => products.id),
	fileId: integer("file_id").references(() => files.id),
	quantity: integer().default(1).notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});

export const requests = sqliteTable("requests", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	guestId: integer("guest_id").notNull().references(() => guests.id),
	status: text().default("queued").notNull(),
	totalAmount: integer("total_amount").default(0).notNull(),
	auditLog: text("audit_log"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
});


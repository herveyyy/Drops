import { relations } from "drizzle-orm/relations";
import { guests, files, requestItems, products, requests } from "./schema";

export const filesRelations = relations(files, ({one, many}) => ({
	guest: one(guests, {
		fields: [files.guestId],
		references: [guests.id]
	}),
	requestItems: many(requestItems),
}));

export const guestsRelations = relations(guests, ({many}) => ({
	files: many(files),
	requests: many(requests),
}));

export const requestItemsRelations = relations(requestItems, ({one}) => ({
	file: one(files, {
		fields: [requestItems.fileId],
		references: [files.id]
	}),
	product: one(products, {
		fields: [requestItems.productId],
		references: [products.id]
	}),
	request: one(requests, {
		fields: [requestItems.requestId],
		references: [requests.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	requestItems: many(requestItems),
}));

export const requestsRelations = relations(requests, ({one, many}) => ({
	requestItems: many(requestItems),
	guest: one(guests, {
		fields: [requests.guestId],
		references: [guests.id]
	}),
}));
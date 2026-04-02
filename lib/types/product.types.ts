import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { products } from "@/db/schema/products";

export type SelectProduct = InferSelectModel<typeof products>;
export type InsertProduct = InferInsertModel<typeof products>;

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { guests } from "@/db/schema/guests";

export type SelectGuest = InferSelectModel<typeof guests>;
export type InsertGuest = InferInsertModel<typeof guests>;

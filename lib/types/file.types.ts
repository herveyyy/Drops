import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { files } from "@/db/schema/files";

export type SelectFile = InferSelectModel<typeof files>;
export type InsertFile = InferInsertModel<typeof files>;

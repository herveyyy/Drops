import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { requests, requestItems } from "@/db/schema/requests";

export type SelectRequest = InferSelectModel<typeof requests>;
export type InsertRequest = InferInsertModel<typeof requests>;

export type SelectRequestItem = InferSelectModel<typeof requestItems>;
export type InsertRequestItem = InferInsertModel<typeof requestItems>;

export interface QueueItem {
  id: number;
  status: string;
  totalAmount: number;
  guestName: string;
  fileName: string;
  mimeType: string;
  params: string | null;
}

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
  fileId?: number | null;
  fileName?: string | null;
  filePath?: string | null;
  mimeType?: string | null;
  params?: string | null;
  productName?: string | null;
  productPrice?: number | null;
  quantity?: number | null;
  itemType: "file" | "product";
}

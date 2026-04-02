import { SelectRequest, InsertRequestItem } from "@/lib/types/request.types";

export interface IRequests {
  createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest>;
}

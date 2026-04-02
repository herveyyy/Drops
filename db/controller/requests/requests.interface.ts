import { SelectRequest, InsertRequestItem } from "@/lib/types/request.types";

export interface IRequests {
  createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest>;
  getLiveQueue(): Promise<unknown>;
  completePayment(requestIds: number[], operatorName: string): Promise<void>;
}

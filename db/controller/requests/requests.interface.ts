import {
  SelectRequest,
  InsertRequestItem,
  QueueItem,
} from "@/lib/types/request.types";

export interface IRequests {
  createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest>;
  getLiveQueue(): Promise<QueueItem[]>;
  updateRequestItemsPricing(
    items: { requestItemId: number; unitPrice: number }[],
  ): Promise<void>;
  completePayment(requestIds: number[], operatorName: string): Promise<void>;
}

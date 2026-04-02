import { RequestService } from "@/db/service/request.service";
import {
  SelectRequest,
  InsertRequestItem,
  QueueItem,
} from "@/lib/types/request.types";
import { IRequests } from "./requests.interface";

export class RequestsController implements IRequests {
  constructor(private readonly requestService: RequestService) {}

  async createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest> {
    try {
      return await this.requestService.createRequest(
        guestId,
        totalAmount,
        items,
      );
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create request");
    }
  }
  async getLiveQueue(): Promise<QueueItem[]> {
    try {
      return await this.requestService.getLiveQueue();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch live queue");
    }
  }

  async completePayment(
    requestIds: number[],
    operatorName: string,
  ): Promise<void> {
    try {
      return await this.requestService.completePayment(
        requestIds,
        operatorName,
      );
    } catch (error) {
      console.error(error);
      throw new Error("Failed to complete payment");
    }
  }
}

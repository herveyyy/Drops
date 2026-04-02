import { RequestService } from "@/db/service/request.service";
import { SelectRequest, InsertRequestItem } from "@/lib/types/request.types";
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
}

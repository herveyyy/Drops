import { CreateRequestUsecase } from "../usecase/request/create_request.usecase";
import { SelectRequest, InsertRequestItem } from "@/lib/types/request.types";

export class RequestService {
  constructor(
    private readonly createRequestUsecase: CreateRequestUsecase,
  ) {}

  async createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest> {
    return this.createRequestUsecase.execute(guestId, totalAmount, items);
  }
}

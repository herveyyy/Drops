import { CreateRequestUsecase } from "../usecase/request/create_request.usecase";
import { SelectRequest, InsertRequestItem } from "@/lib/types/request.types";
import { GetRequestsUseCase } from "../usecase/request/get_requests.usecase";

export class RequestService {
  constructor(
    private readonly createRequestUsecase: CreateRequestUsecase,
    private readonly getRequestsUseCase: GetRequestsUseCase,
  ) {}
  async createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest> {
    return this.createRequestUsecase.execute(guestId, totalAmount, items);
  }
  async getLiveQueue(): Promise<unknown> {
    return this.getRequestsUseCase.execute();
  }
}

import { CreateRequestUsecase } from "../usecase/request/create_request.usecase";
import {
  SelectRequest,
  InsertRequestItem,
  QueueItem,
} from "@/lib/types/request.types";
import { GetRequestsUseCase } from "../usecase/request/get_requests.usecase";
import { CompletePaymentUseCase } from "../usecase/request/complete_payment.usecase";

export class RequestService {
  constructor(
    private readonly createRequestUsecase: CreateRequestUsecase,
    private readonly getRequestsUseCase: GetRequestsUseCase,
    private readonly completePaymentUseCase: CompletePaymentUseCase,
  ) {}

  async createRequest(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest> {
    return this.createRequestUsecase.execute(guestId, totalAmount, items);
  }

  async getLiveQueue(): Promise<QueueItem[]> {
    return this.getRequestsUseCase.execute() as Promise<QueueItem[]>;
  }

  async completePayment(
    requestIds: number[],
    operatorName: string,
  ): Promise<void> {
    return this.completePaymentUseCase.execute(requestIds, operatorName);
  }
}

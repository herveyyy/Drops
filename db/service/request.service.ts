import { CreateRequestUsecase } from "../usecase/request/create_request.usecase";
import {
  SelectRequest,
  InsertRequestItem,
  QueueItem,
} from "@/lib/types/request.types";
import { GetRequestsUseCase } from "../usecase/request/get_requests.usecase";
import { CompletePaymentUseCase } from "../usecase/request/complete_payment.usecase";
import { UpdateRequestItemsPricingUseCase } from "../usecase/request/update_request_items_pricing.usecase";

export class RequestService {
  constructor(
    private readonly createRequestUsecase: CreateRequestUsecase,
    private readonly getRequestsUseCase: GetRequestsUseCase,
    private readonly updateRequestItemsPricingUseCase: UpdateRequestItemsPricingUseCase,
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

  async updateRequestItemsPricing(
    items: { requestItemId: number; unitPrice: number }[],
  ): Promise<void> {
    return this.updateRequestItemsPricingUseCase.execute(items);
  }

  async completePayment(
    requestIds: number[],
    operatorName: string,
  ): Promise<void> {
    return this.completePaymentUseCase.execute(requestIds, operatorName);
  }
}

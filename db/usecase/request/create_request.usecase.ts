import { db } from "@/db";
import { requests } from "@/db/schema/requests";
import { requestItems } from "@/db/schema/requests";
import { SelectRequest, InsertRequestItem } from "@/lib/types/request.types";

export class CreateRequestUsecase {
  private db = db;

  async execute(
    guestId: number,
    totalAmount: number,
    items: Omit<InsertRequestItem, "requestId">[],
  ): Promise<SelectRequest> {
    try {
      // Insert the request
      const requestResult = await this.db
        .insert(requests)
        .values({
          guestId,
          totalAmount,
          status: "queued",
          auditLog: JSON.stringify([
            {
              action: "created",
              timestamp: new Date().toISOString(),
            },
          ]),
        })
        .returning();

      const request = requestResult[0];

      // Insert all request items. fileId is optional and omitted when not set (product-only item)
      if (items.length > 0) {
        await this.db.insert(requestItems).values(
          items.map((item) => {
            const payload: {
              requestId: number;
              productId?: number | null;
              quantity: number;
              fileId?: number | null;
              unitPrice?: number | null;
              serviceLabel?: string | null;
              serviceSpecs?: string | null;
            } = {
              requestId: request.id,
              quantity: item.quantity ?? 1,
            };

            if (item.productId != null) {
              payload.productId = item.productId;
            }

            if (item.fileId != null) {
              payload.fileId = item.fileId;
            }

            if (item.unitPrice != null) {
              payload.unitPrice = item.unitPrice;
            }

            if (item.serviceLabel != null) {
              payload.serviceLabel = item.serviceLabel;
            }

            if (item.serviceSpecs != null) {
              payload.serviceSpecs = item.serviceSpecs;
            }

            return payload;
          }),
        );
      }

      return request;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create request");
    }
  }
}

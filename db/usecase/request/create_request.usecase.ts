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

      // Insert all request items
      if (items.length > 0) {
        await this.db.insert(requestItems).values(
          items.map((item) => ({
            ...item,
            requestId: request.id,
          })),
        );
      }

      return request;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create request");
    }
  }
}

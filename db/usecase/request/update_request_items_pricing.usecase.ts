import { db } from "@/db";
import { products } from "@/db/schema/products";
import { requestItems, requests } from "@/db/schema/requests";
import { eq } from "drizzle-orm";

interface RequestItemPricingUpdate {
  requestItemId: number;
  unitPrice: number;
}

export class UpdateRequestItemsPricingUseCase {
  private db = db;

  async execute(items: RequestItemPricingUpdate[]): Promise<void> {
    if (items.length === 0) {
      return;
    }

    const requestIds = new Set<number>();

    for (const item of items) {
      const row = await this.db
        .select({ requestId: requestItems.requestId })
        .from(requestItems)
        .where(eq(requestItems.id, item.requestItemId))
        .limit(1);

      const requestId = row[0]?.requestId;
      if (!requestId) {
        continue;
      }

      requestIds.add(requestId);

      await this.db
        .update(requestItems)
        .set({ unitPrice: item.unitPrice })
        .where(eq(requestItems.id, item.requestItemId));
    }

    for (const requestId of requestIds) {
      const lines = await this.db
        .select({
          quantity: requestItems.quantity,
          unitPrice: requestItems.unitPrice,
          productPrice: products.price,
        })
        .from(requestItems)
        .leftJoin(products, eq(requestItems.productId, products.id))
        .where(eq(requestItems.requestId, requestId));

      const totalAmount = lines.reduce(
        (sum, line) =>
          sum + (line.unitPrice ?? line.productPrice ?? 0) * line.quantity,
        0,
      );

      await this.db
        .update(requests)
        .set({
          totalAmount,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(requests.id, requestId));
    }
  }
}

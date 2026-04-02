import { db } from "@/db";
import { files } from "@/db/schema/files";
import { guests } from "@/db/schema/guests";
import { products } from "@/db/schema/products";
import { requestItems, requests } from "@/db/schema/requests";
import { desc, eq, sql } from "drizzle-orm";
export class GetRequestsUseCase {
  private db = db;

  async execute(): Promise<unknown> {
    try {
      const liveQueue = await this.db
        .select({
          requestItemId: requestItems.id,
          id: requests.id,
          status: requests.status,
          totalAmount: requests.totalAmount,
          guestName: guests.name,
          fileId: requestItems.fileId,
          productId: requestItems.productId,
          fileName: files.filename,
          filePath: files.filePath,
          mimeType: files.mimeType,
          params: files.metadata,
          productName: products.name,
          productPrice: products.price,
          unitPrice: requestItems.unitPrice,
          serviceLabel: requestItems.serviceLabel,
          serviceSpecs: requestItems.serviceSpecs,
          quantity: requestItems.quantity,
          lineAmount: sql<number>`coalesce(${requestItems.unitPrice}, ${products.price}, 0) * ${requestItems.quantity}`,
        })
        .from(requests)
        .innerJoin(guests, eq(requests.guestId, guests.id))
        .innerJoin(requestItems, eq(requests.id, requestItems.requestId))
        .leftJoin(products, eq(requestItems.productId, products.id))
        .leftJoin(files, eq(requestItems.fileId, files.id))
        .where(eq(requests.status, "queued"))
        .orderBy(desc(requests.createdAt));

      return liveQueue.map((item) => ({
        ...item,
        itemType:
          item.fileId && item.productId
            ? "mixed"
            : item.fileId
              ? "file"
              : "product",
        productName: item.productName || null,
        productPrice: item.productPrice || null,
        unitPrice: item.unitPrice || null,
        serviceLabel: item.serviceLabel || null,
        serviceSpecs: item.serviceSpecs || null,
      }));
    } catch {
      throw new Error("Failed to fetch live queue");
    }
  }
}

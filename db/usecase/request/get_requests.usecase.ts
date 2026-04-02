import { db } from "@/db";
import { files } from "@/db/schema/files";
import { guests } from "@/db/schema/guests";
import { products } from "@/db/schema/products";
import { requestItems, requests } from "@/db/schema/requests";
import { eq, desc } from "drizzle-orm";
export class GetRequestsUseCase {
  private db = db;

  async execute(): Promise<unknown> {
    try {
      const liveQueue = await this.db
        .select({
          id: requests.id,
          status: requests.status,
          totalAmount: requests.totalAmount,
          guestName: guests.name,
          fileId: requestItems.fileId,
          fileName: files.filename,
          filePath: files.filePath,
          mimeType: files.mimeType,
          params: files.metadata,
          productName: products.name,
          productPrice: products.price,
          quantity: requestItems.quantity,
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
        itemType: item.fileId ? "file" : "product",
        productName: item.productName || null,
        productPrice: item.productPrice || null,
      }));
    } catch (error) {
      throw new Error("Failed to fetch live queue");
    }
  }
}

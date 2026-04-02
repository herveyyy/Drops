import { db } from "@/db";
import { files } from "@/db/schema/files";
import { guests } from "@/db/schema/guests";
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
          fileName: files.filename,
          mimeType: files.mimeType,
          params: files.metadata,
        })
        .from(requests)
        .innerJoin(guests, eq(requests.guestId, guests.id))
        .innerJoin(requestItems, eq(requests.id, requestItems.requestId))
        .innerJoin(files, eq(guests.id, files.guestId))
        .where(eq(requests.status, "queued"))
        .orderBy(desc(requests.createdAt));

      return liveQueue;
    } catch (error) {
      throw new Error("Failed to fetch live queue");
    }
  }
}

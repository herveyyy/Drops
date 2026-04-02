import { db } from "@/db";
import { guests } from "@/db/schema/guests";
import { eq } from "drizzle-orm";

export class ArchiveGuestUsecase {
  private db = db;

  async execute(id: number): Promise<void> {
    try {
      await this.db
        .update(guests)
        .set({ status: "archived" })
        .where(eq(guests.id, id));
    } catch (error) {
      console.error(error);
      throw new Error("Failed to archive guest");
    }
  }
}

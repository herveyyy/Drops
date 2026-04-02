import { db } from "@/db";
import { guests } from "@/db/schema/guests";
import { SelectGuest } from "@/lib/types/guest.types";
import { eq } from "drizzle-orm";

export class GetAllGuestsUsecase {
  private db = db;

  async execute(): Promise<SelectGuest[]> {
    try {
      const result = await this.db
        .select()
        .from(guests)
        .where(eq(guests.status, "active"))
        .orderBy(guests.id);

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all guests");
    }
  }
}

import { db } from "@/db";
import { guests } from "@/db/schema/guests";
import { InsertGuest, SelectGuest } from "@/lib/types/guest.types";

export class CreateGuestUsecase {
  private db = db;

  async execute(data: InsertGuest): Promise<SelectGuest> {
    try {
      const result = await this.db
        .insert(guests)
        .values(data)
        .returning();

      return result[0];
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create guest");
    }
  }
}

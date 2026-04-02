import { db } from "@/db";
import { guests } from "@/db/schema/guests";
import { SelectGuest } from "@/lib/types/guest.types";
import { eq } from "drizzle-orm";

export class GetGuestByIdUsecase {
  private db = db;

  async execute(id: number): Promise<SelectGuest | null> {
    try {
      const result = await this.db
        .select()
        .from(guests)
        .where(eq(guests.id, id))
        .limit(1);

      return result[0] ?? null;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get guest by id");
    }
  }
}

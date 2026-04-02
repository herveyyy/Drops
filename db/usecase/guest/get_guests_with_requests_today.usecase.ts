import { db } from "@/db";
import { guests } from "@/db/schema/guests";
import { requests } from "@/db/schema/requests";
import { SelectGuest } from "@/lib/types/guest.types";
import { eq, sql } from "drizzle-orm";

export class GetGuestsWithRequestsTodayUsecase {
  private db = db;

  async execute(): Promise<SelectGuest[]> {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      const result = await this.db
        .selectDistinct()
        .from(guests)
        .innerJoin(requests, eq(guests.id, requests.guestId))
        .where(sql`substr(${requests.createdAt}, 1, 10) = ${today}`)
        .orderBy(guests.id);

      // Since innerJoin returns { guests, requests }, we need to extract guests
      return result.map((row) => row.guests);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get guests with requests today");
    }
  }
}

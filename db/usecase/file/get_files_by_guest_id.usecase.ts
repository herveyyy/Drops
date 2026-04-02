import { db } from "@/db";
import { files } from "@/db/schema/files";
import { SelectFile } from "@/lib/types/file.types";
import { eq } from "drizzle-orm";

export class GetFilesByGuestIdUsecase {
  private db = db;

  async execute(guestId: number): Promise<SelectFile[]> {
    try {
      const result = await this.db
        .select()
        .from(files)
        .where(eq(files.guestId, guestId));

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get files by guest id");
    }
  }
}

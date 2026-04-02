import { db } from "@/db";
import { files } from "@/db/schema/files";
import { InsertFile, SelectFile } from "@/lib/types/file.types";

export class CreateFileUsecase {
  private db = db;

  async execute(data: InsertFile): Promise<SelectFile> {
    try {
      const result = await this.db
        .insert(files)
        .values(data)
        .returning();

      return result[0];
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create file record");
    }
  }
}

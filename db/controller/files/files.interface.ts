import { InsertFile, SelectFile } from "@/lib/types/file.types";

export interface IFiles {
  createFile(data: InsertFile): Promise<SelectFile>;
  getFilesByGuestId(guestId: number): Promise<SelectFile[]>;
}

import { FileService } from "@/db/service/file.service";
import { InsertFile, SelectFile } from "@/lib/types/file.types";
import { IFiles } from "./files.interface";

export class FilesController implements IFiles {
  constructor(private readonly fileService: FileService) {}

  async createFile(data: InsertFile): Promise<SelectFile> {
    try {
      return await this.fileService.createFile(data);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create file record");
    }
  }

  async getFilesByGuestId(guestId: number): Promise<SelectFile[]> {
    try {
      return await this.fileService.getFilesByGuestId(guestId);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get files by guest id");
    }
  }
}

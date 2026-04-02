import { CreateFileUsecase } from "../usecase/file/create_file.usecase";
import { GetFilesByGuestIdUsecase } from "../usecase/file/get_files_by_guest_id.usecase";
import { InsertFile, SelectFile } from "@/lib/types/file.types";

export class FileService {
  constructor(
    private readonly createFileUsecase: CreateFileUsecase,
    private readonly getFilesByGuestIdUsecase: GetFilesByGuestIdUsecase,
  ) {}

  async createFile(data: InsertFile): Promise<SelectFile> {
    return this.createFileUsecase.execute(data);
  }

  async getFilesByGuestId(guestId: number): Promise<SelectFile[]> {
    return this.getFilesByGuestIdUsecase.execute(guestId);
  }
}

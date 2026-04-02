import { CreateGuestUsecase } from "../usecase/guest/create_guest.usecase";
import { ArchiveGuestUsecase } from "../usecase/guest/archive_guest.usecase";
import { GetGuestByIdUsecase } from "../usecase/guest/get_guest_by_id.usecase";
import { GetGuestsWithRequestsTodayUsecase } from "../usecase/guest/get_guests_with_requests_today.usecase";
import { GetAllGuestsUsecase } from "../usecase/guest/get_all_guests.usecase";
import { InsertGuest, SelectGuest } from "@/lib/types/guest.types";

export class GuestService {
  constructor(
    private readonly createGuestUsecase: CreateGuestUsecase,
    private readonly archiveGuestUsecase: ArchiveGuestUsecase,
    private readonly getGuestByIdUsecase: GetGuestByIdUsecase,
    private readonly getGuestsWithRequestsTodayUsecase: GetGuestsWithRequestsTodayUsecase,
    private readonly getAllGuestsUsecase: GetAllGuestsUsecase,
  ) {}

  async createGuest(data: InsertGuest): Promise<SelectGuest> {
    return this.createGuestUsecase.execute(data);
  }

  async archiveGuest(id: number): Promise<void> {
    return this.archiveGuestUsecase.execute(id);
  }

  async getGuestById(id: number): Promise<SelectGuest | null> {
    return this.getGuestByIdUsecase.execute(id);
  }

  async getGuestsWithRequestsToday(): Promise<SelectGuest[]> {
    return this.getGuestsWithRequestsTodayUsecase.execute();
  }

  async getAllGuests(): Promise<SelectGuest[]> {
    return this.getAllGuestsUsecase.execute();
  }
}

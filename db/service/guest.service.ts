import { CreateGuestUsecase } from "../usecase/guest/create_guest.usecase";
import { GetGuestByIdUsecase } from "../usecase/guest/get_guest_by_id.usecase";
import { InsertGuest, SelectGuest } from "@/lib/types/guest.types";
import { db } from "@/db";
import { guests } from "@/db/schema";

export class GuestService {
  constructor(
    private readonly createGuestUsecase: CreateGuestUsecase,
    private readonly getGuestByIdUsecase: GetGuestByIdUsecase,
  ) {}

  async createGuest(data: InsertGuest): Promise<SelectGuest> {
    return this.createGuestUsecase.execute(data);
  }

  async getGuestById(id: number): Promise<SelectGuest | null> {
    return this.getGuestByIdUsecase.execute(id);
  }

  async getAllGuests(): Promise<SelectGuest[]> {
    return db.select().from(guests).orderBy(guests.id);
  }
}

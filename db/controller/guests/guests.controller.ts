import { GuestService } from "@/db/service/guest.service";
import { InsertGuest, SelectGuest } from "@/lib/types/guest.types";
import { IGuests } from "./guests.interface";

export class GuestsController implements IGuests {
  constructor(private readonly guestService: GuestService) {}

  async createGuest(data: InsertGuest): Promise<SelectGuest> {
    try {
      return await this.guestService.createGuest(data);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create guest");
    }
  }

  async getGuestById(id: number): Promise<SelectGuest | null> {
    try {
      return await this.guestService.getGuestById(id);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get guest by id");
    }
  }

  async getAllGuests(): Promise<SelectGuest[]> {
    try {
      return await this.guestService.getAllGuests();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all guests");
    }
  }
}

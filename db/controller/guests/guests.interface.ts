import { InsertGuest, SelectGuest } from "@/lib/types/guest.types";

export interface IGuests {
  createGuest(data: InsertGuest): Promise<SelectGuest>;
  getGuestById(id: number): Promise<SelectGuest | null>;
  getGuestsWithRequestsToday(): Promise<SelectGuest[]>;
  getAllGuests(): Promise<SelectGuest[]>;
}

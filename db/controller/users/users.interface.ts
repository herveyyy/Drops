import { SelectUser } from "@/lib/types/user.types";

export interface IUsers {
  getUserByCreds(email: string, password: string): Promise<SelectUser | null>;
}

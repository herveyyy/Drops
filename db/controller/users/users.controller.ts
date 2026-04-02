import { UserService } from "@/db/service/user.service";
import { SelectUser } from "@/lib/types/user.types";
import { IUsers } from "./users.interface";

export class UsersController implements IUsers {
  constructor(private readonly userService: UserService) {}

  async getUserByCreds(
    email: string,
    password: string,
  ): Promise<SelectUser | null> {
    try {
      return await this.userService.getUserByCreds(email, password);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get user by credentials");
    }
  }
}

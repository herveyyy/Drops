import { GetUserByCredsUsecase } from "../usecase/user/get_user_by_creds.usecase";
import { SelectUser } from "@/lib/types/user.types";

export class UserService {
  constructor(private readonly getUserByCredsUsecase: GetUserByCredsUsecase) {}

  async getUserByCreds(
    email: string,
    password: string,
  ): Promise<SelectUser | null> {
    return this.getUserByCredsUsecase.execute(email, password);
  }
}

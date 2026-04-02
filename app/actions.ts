"use server";

import { UsersController } from "@/db/controller/users/users.controller";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { UserService } from "@/db/service/user.service";

export async function createUserController(): Promise<UsersController> {
  return new UsersController(new UserService(new GetUserByCredsUsecase()));
}

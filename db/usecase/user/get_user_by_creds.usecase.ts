import { db } from "@/db";
import { SelectUser } from "@/lib/types/user.types";

export class GetUserByCredsUsecase {
  private db = db;

  async execute(email: string, password: string): Promise<SelectUser | null> {
    try {
      console.log("Add user here");
      return {
        id: 1,
        name: "John Doe",
        email: "[EMAIL_ADDRESS]",
        password: "password",
        role: "user",
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get user by credentials");
    }
  }
}

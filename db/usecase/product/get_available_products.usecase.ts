import { db } from "@/db";
import { products } from "@/db/schema/products";
import { SelectProduct } from "@/lib/types/product.types";
import { eq } from "drizzle-orm";

export class GetAvailableProductsUsecase {
  private db = db;

  async execute(): Promise<SelectProduct[]> {
    try {
      const result = await this.db
        .select()
        .from(products)
        .where(eq(products.isAvailable, true));

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get available products");
    }
  }
}

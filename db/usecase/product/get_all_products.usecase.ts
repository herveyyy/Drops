import { db } from "@/db";
import { products } from "@/db/schema/products";
import { SelectProduct } from "@/lib/types/product.types";

export class GetAllProductsUsecase {
  private db = db;

  async execute(): Promise<SelectProduct[]> {
    try {
      const result = await this.db.select().from(products).orderBy(products.id);

      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all products");
    }
  }
}

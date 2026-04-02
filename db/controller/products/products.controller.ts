import { ProductService } from "@/db/service/product.service";
import { SelectProduct } from "@/lib/types/product.types";
import { IProducts } from "./products.interface";

export class ProductsController implements IProducts {
  constructor(private readonly productService: ProductService) {}

  async getAvailableProducts(): Promise<SelectProduct[]> {
    try {
      return await this.productService.getAvailableProducts();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get available products");
    }
  }

  async getAllProducts(): Promise<SelectProduct[]> {
    try {
      return await this.productService.getAllProducts();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all products");
    }
  }
}

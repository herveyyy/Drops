import { GetAvailableProductsUsecase } from "../usecase/product/get_available_products.usecase";
import { SelectProduct } from "@/lib/types/product.types";

export class ProductService {
  constructor(
    private readonly getAvailableProductsUsecase: GetAvailableProductsUsecase,
  ) {}

  async getAvailableProducts(): Promise<SelectProduct[]> {
    return this.getAvailableProductsUsecase.execute();
  }
}

import { GetAvailableProductsUsecase } from "../usecase/product/get_available_products.usecase";
import { GetAllProductsUsecase } from "../usecase/product/get_all_products.usecase";
import { SelectProduct } from "@/lib/types/product.types";

export class ProductService {
  constructor(
    private readonly getAvailableProductsUsecase: GetAvailableProductsUsecase,
    private readonly getAllProductsUsecase: GetAllProductsUsecase,
  ) {}

  async getAvailableProducts(): Promise<SelectProduct[]> {
    return this.getAvailableProductsUsecase.execute();
  }

  async getAllProducts(): Promise<SelectProduct[]> {
    return this.getAllProductsUsecase.execute();
  }
}

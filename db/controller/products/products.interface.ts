import { SelectProduct } from "@/lib/types/product.types";

export interface IProducts {
  getAvailableProducts(): Promise<SelectProduct[]>;
  getAllProducts(): Promise<SelectProduct[]>;
}

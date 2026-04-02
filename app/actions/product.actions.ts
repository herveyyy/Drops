"use server";

import { createProductsController } from "./factories";

export async function getAvailableProducts() {
  const controller = await createProductsController();
  return controller.getAvailableProducts();
}

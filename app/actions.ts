"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { UsersController } from "@/db/controller/users/users.controller";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { UserService } from "@/db/service/user.service";

import { GuestsController } from "@/db/controller/guests/guests.controller";
import { CreateGuestUsecase } from "@/db/usecase/guest/create_guest.usecase";
import { GetGuestByIdUsecase } from "@/db/usecase/guest/get_guest_by_id.usecase";
import { GuestService } from "@/db/service/guest.service";

import { FilesController } from "@/db/controller/files/files.controller";
import { CreateFileUsecase } from "@/db/usecase/file/create_file.usecase";
import { GetFilesByGuestIdUsecase } from "@/db/usecase/file/get_files_by_guest_id.usecase";
import { FileService } from "@/db/service/file.service";

import { ProductsController } from "@/db/controller/products/products.controller";
import { GetAvailableProductsUsecase } from "@/db/usecase/product/get_available_products.usecase";
import { ProductService } from "@/db/service/product.service";

import { RequestsController } from "@/db/controller/requests/requests.controller";
import { CreateRequestUsecase } from "@/db/usecase/request/create_request.usecase";
import { RequestService } from "@/db/service/request.service";

import { InsertRequestItem } from "@/lib/types/request.types";

// ─── Controller Factories ───────────────────────────────────────────

export async function createUserController(): Promise<UsersController> {
  return new UsersController(new UserService(new GetUserByCredsUsecase()));
}

export async function createGuestsController(): Promise<GuestsController> {
  return new GuestsController(
    new GuestService(new CreateGuestUsecase(), new GetGuestByIdUsecase()),
  );
}

export async function createFilesController(): Promise<FilesController> {
  return new FilesController(
    new FileService(new CreateFileUsecase(), new GetFilesByGuestIdUsecase()),
  );
}

export async function createProductsController(): Promise<ProductsController> {
  return new ProductsController(
    new ProductService(new GetAvailableProductsUsecase()),
  );
}

export async function createRequestsController(): Promise<RequestsController> {
  return new RequestsController(
    new RequestService(new CreateRequestUsecase()),
  );
}

// ─── Guest Actions ──────────────────────────────────────────────────

export async function initializeGuest(formData: FormData) {
  const name = formData.get("subject_name") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  const controller = await createGuestsController();
  const guest = await controller.createGuest({ name: name.trim() });

  const cookieStore = await cookies();
  cookieStore.set("drops_guest_id", String(guest.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  redirect("/upload");
}

export async function getGuestSession() {
  const cookieStore = await cookies();
  const guestIdRaw = cookieStore.get("drops_guest_id")?.value;

  if (!guestIdRaw) return null;

  const guestId = parseInt(guestIdRaw, 10);
  if (isNaN(guestId)) return null;

  const controller = await createGuestsController();
  return controller.getGuestById(guestId);
}

// ─── File Actions ───────────────────────────────────────────────────

export async function getGuestFiles() {
  const cookieStore = await cookies();
  const guestIdRaw = cookieStore.get("drops_guest_id")?.value;

  if (!guestIdRaw) return [];

  const guestId = parseInt(guestIdRaw, 10);
  if (isNaN(guestId)) return [];

  const controller = await createFilesController();
  return controller.getFilesByGuestId(guestId);
}

export async function refreshUploadPage() {
  revalidatePath("/upload");
}

// ─── Product Actions ────────────────────────────────────────────────

export async function getAvailableProducts() {
  const controller = await createProductsController();
  return controller.getAvailableProducts();
}

// ─── Request Actions ────────────────────────────────────────────────

export async function submitOrderRequest(
  items: Omit<InsertRequestItem, "requestId">[],
  totalAmount: number,
) {
  const cookieStore = await cookies();
  const guestIdRaw = cookieStore.get("drops_guest_id")?.value;

  if (!guestIdRaw) {
    throw new Error("No guest session");
  }

  const guestId = parseInt(guestIdRaw, 10);
  if (isNaN(guestId)) {
    throw new Error("Invalid guest session");
  }

  const controller = await createRequestsController();
  const request = await controller.createRequest(guestId, totalAmount, items);

  return request;
}

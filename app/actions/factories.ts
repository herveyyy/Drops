import { UsersController } from "@/db/controller/users/users.controller";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { UserService } from "@/db/service/user.service";

import { GuestsController } from "@/db/controller/guests/guests.controller";
import { ArchiveGuestUsecase } from "@/db/usecase/guest/archive_guest.usecase";
import { CreateGuestUsecase } from "@/db/usecase/guest/create_guest.usecase";
import { GetGuestByIdUsecase } from "@/db/usecase/guest/get_guest_by_id.usecase";
import { GetGuestsWithRequestsTodayUsecase } from "@/db/usecase/guest/get_guests_with_requests_today.usecase";
import { GetAllGuestsUsecase } from "@/db/usecase/guest/get_all_guests.usecase";
import { GuestService } from "@/db/service/guest.service";

import { FilesController } from "@/db/controller/files/files.controller";
import { CreateFileUsecase } from "@/db/usecase/file/create_file.usecase";
import { GetFilesByGuestIdUsecase } from "@/db/usecase/file/get_files_by_guest_id.usecase";
import { FileService } from "@/db/service/file.service";

import { ProductsController } from "@/db/controller/products/products.controller";
import { GetAvailableProductsUsecase } from "@/db/usecase/product/get_available_products.usecase";
import { GetAllProductsUsecase } from "@/db/usecase/product/get_all_products.usecase";
import { ProductService } from "@/db/service/product.service";

import { RequestsController } from "@/db/controller/requests/requests.controller";
import { CreateRequestUsecase } from "@/db/usecase/request/create_request.usecase";
import { RequestService } from "@/db/service/request.service";
import { GetRequestsUseCase } from "@/db/usecase/request/get_requests.usecase";
import { CompletePaymentUseCase } from "@/db/usecase/request/complete_payment.usecase";
import { UpdateRequestItemsPricingUseCase } from "@/db/usecase/request/update_request_items_pricing.usecase";

export async function createUserController(): Promise<UsersController> {
  return new UsersController(new UserService(new GetUserByCredsUsecase()));
}

export async function createGuestsController(): Promise<GuestsController> {
  return new GuestsController(
    new GuestService(
      new CreateGuestUsecase(),
      new ArchiveGuestUsecase(),
      new GetGuestByIdUsecase(),
      new GetGuestsWithRequestsTodayUsecase(),
      new GetAllGuestsUsecase(),
    ),
  );
}

export async function createFilesController(): Promise<FilesController> {
  return new FilesController(
    new FileService(new CreateFileUsecase(), new GetFilesByGuestIdUsecase()),
  );
}

export async function createProductsController(): Promise<ProductsController> {
  return new ProductsController(
    new ProductService(
      new GetAvailableProductsUsecase(),
      new GetAllProductsUsecase(),
    ),
  );
}

export async function createRequestsController(): Promise<RequestsController> {
  return new RequestsController(
    new RequestService(
      new CreateRequestUsecase(),
      new GetRequestsUseCase(),
      new UpdateRequestItemsPricingUseCase(),
      new CompletePaymentUseCase(),
    ),
  );
}

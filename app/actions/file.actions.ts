"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createFilesController } from "./factories";

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

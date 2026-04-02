"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createGuestsController } from "./factories";

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
    secure: false, // relaxed for internal kiosk LAN (no HTTPS)
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

export async function getGuestsWithRequestsToday() {
  const controller = await createGuestsController();
  return controller.getGuestsWithRequestsToday();
}

export async function getAllGuests() {
  const controller = await createGuestsController();
  return controller.getAllGuests();
}

"use server";

import { cookies } from "next/headers";
import { createRequestsController } from "./factories";
import { InsertRequestItem } from "@/lib/types/request.types";

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
export async function fetchLiveQueue() {
  const controller = await createRequestsController();
  const liveQueue = await controller.getLiveQueue();
  return liveQueue;
}

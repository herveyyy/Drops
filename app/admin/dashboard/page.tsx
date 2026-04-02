import { getAllGuests } from "@/app/actions/guest.actions";
import { fetchLiveQueue } from "@/app/actions/request.actions";
import { db } from "@/db";
import { products } from "@/db/schema";
import ClientDashboard from "../ClientDashboard";

export default async function LiveQueueDashboard() {
  const guests = await getAllGuests();
  const queueItems = await fetchLiveQueue();
  const productList = await db.select().from(products);

  return (
    <ClientDashboard
      guests={guests}
      queueItems={Array.isArray(queueItems) ? queueItems : []}
      products={productList}
    />
  );
}

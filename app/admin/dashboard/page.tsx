import { getGuestsWithRequestsToday } from "@/app/actions/guest.actions";
import { fetchLiveQueue } from "@/app/actions/request.actions";
import ClientDashboard from "../ClientDashboard";

export default async function LiveQueueDashboard() {
  const guests = await getGuestsWithRequestsToday();
  const queueItems = await fetchLiveQueue();

  return (
    <ClientDashboard
      guests={guests}
      queueItems={Array.isArray(queueItems) ? queueItems : []}
    />
  );
}

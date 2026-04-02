import { redirect } from "next/navigation";
import { getGuestSession, getAvailableProducts, getGuestFiles } from "@/app/actions";
import ClientCatalog from "./ClientCatalog";

export default async function CatalogDashboard() {
  const guest = await getGuestSession();

  if (!guest) {
    redirect("/");
  }

  const [products, files] = await Promise.all([
    getAvailableProducts(),
    getGuestFiles(),
  ]);

  return (
    <ClientCatalog
      guestName={guest.name}
      products={products}
      guestFiles={files}
    />
  );
}

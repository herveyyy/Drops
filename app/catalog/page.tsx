import { redirect } from "next/navigation";
import { getGuestSession } from "@/app/actions/guest.actions";
import { getGuestFiles } from "@/app/actions/file.actions";
import { getAvailableProducts } from "@/app/actions/product.actions";
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

import { redirect } from "next/navigation";
import { getGuestSession, getGuestFiles } from "@/app/actions";
import ClientUpload from "./ClientUpload";

export default async function UploadDashboard() {
  const guest = await getGuestSession();

  if (!guest) {
    redirect("/");
  }

  const files = await getGuestFiles();

  return <ClientUpload guestName={guest.name} initialFiles={files} />;
}

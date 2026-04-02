import {
  listUploads,
  getStorageInfo,
  deleteUpload,
} from "@/app/actions/drive.actions";
import AdminNavbar from "../AdminNavbar";
import DriveClient from "./DriveClient";

export default async function DrivePage() {
  const uploads = await listUploads();
  const storageInfo = await getStorageInfo();

  return (
    <>
      <AdminNavbar />
      <DriveClient initialUploads={uploads} initialStorage={storageInfo} />
    </>
  );
}

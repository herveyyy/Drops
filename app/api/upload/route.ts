import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createFilesController,
  createGuestsController,
} from "@/app/actions/factories";
import path from "path";
import fs from "fs/promises";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/postscript",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate guest via cookie
    const cookieStore = await cookies();
    const guestIdRaw = cookieStore.get("drops_guest_id")?.value;

    if (!guestIdRaw) {
      return NextResponse.json(
        { error: "UNAUTHORIZED: No guest session" },
        { status: 401 },
      );
    }

    const guestId = parseInt(guestIdRaw, 10);
    if (isNaN(guestId)) {
      return NextResponse.json(
        { error: "UNAUTHORIZED: Invalid guest session" },
        { status: 401 },
      );
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "BAD_REQUEST: No file provided" },
        { status: 400 },
      );
    }

    // 3. Validate file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "BAD_REQUEST: File exceeds 50MB limit" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `BAD_REQUEST: Unsupported file type: ${file.type}` },
        { status: 400 },
      );
    }

    // 4. Get Guest Info and Construct Directory
    const guestsController = await createGuestsController();
    const guest = await guestsController.getGuestById(guestId);

    if (!guest) {
      return NextResponse.json(
        { error: "UNAUTHORIZED: Guest not found" },
        { status: 401 },
      );
    }

    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const safeGuestName = guest.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const guestDir = path.join(UPLOADS_DIR, dateStr, safeGuestName);

    await fs.mkdir(guestDir, { recursive: true });

    const now = new Date();
    const dateOnly = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const safeFileBase = path
      .basename(file.name)
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/\.[^.]+$/, "");
    const extension = path.extname(file.name) || "";
    const storedFilename = `${safeFileBase}_${safeGuestName}_${dateOnly}${extension}`;
    const filePath = path.join(guestDir, storedFilename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // 5. Record in database
    const auditEntry = JSON.stringify([
      {
        action: "uploaded",
        timestamp: new Date().toISOString(),
        ip: request.headers.get("x-forwarded-for") ?? "unknown",
      },
    ]);

    const controller = await createFilesController();
    const record = await controller.createFile({
      guestId,
      filename: file.name,
      filePath: filePath,
      sizeBytes: file.size,
      mimeType: file.type,
      status: "pending",
      auditLog: auditEntry,
      uploadedByIp: request.headers.get("x-forwarded-for") ?? "unknown",
    });

    return NextResponse.json({ success: true, file: record }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR: Upload failed" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { db } from "@/db";
import { files } from "@/db/schema/files";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const fileId = parseInt(id, 10);
    const inline = request.nextUrl.searchParams.get("inline") === "1";

    if (isNaN(fileId)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    const fileRecord = await db
      .select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const resolved = path.resolve(fileRecord.filePath);
    const exists = await fs.stat(resolved).catch(() => null);

    if (!exists || !exists.isFile()) {
      return NextResponse.json(
        { error: "File not available" },
        { status: 404 },
      );
    }

    const data = await fs.readFile(resolved);
    const disposition = inline ? "inline" : "attachment";

    const headers = new Headers();
    headers.set("Content-Type", fileRecord.mimeType);
    headers.set(
      "Content-Disposition",
      `${disposition}; filename="${encodeURIComponent(fileRecord.filename)}"`,
    );

    return new NextResponse(data, { headers });
  } catch (error) {
    console.error("File download failed", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

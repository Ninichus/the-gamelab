import { canRead } from "@/lib/permissions";
import { getFile } from "@/lib/client-s3";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { files } from "@/db/schema";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const fileId = (await params).id;
  const [dbFile] = await db
    .select()
    .from(files)
    .where(eq(files.id, fileId))
    .limit(1);

  if (!dbFile) {
    return Response.json(
      { success: false, error: "Bad request" },
      { status: 400 }
    );
  }

  if (!(await canRead(dbFile.gameId))) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const file = await getFile(dbFile.id);
  if (!file) {
    return Response.json(
      { success: false, error: "Can't find file" },
      { status: 500 }
    );
  }

  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="' + dbFile.name);

  if (dbFile.type === "game_archive") {
    await db
      .update(files)
      .set({ downloadCount: dbFile.downloadCount + 1 })
      .where(eq(files.id, fileId));
  }

  return new Response(Buffer.from(file), {
    headers,
  });
}

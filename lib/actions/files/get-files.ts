"use server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { files as filesTable } from "@/db/schema";
import { canRead } from "@/lib/permissions";
import { File } from "@/lib/types/files";

export async function getFiles(gameId: string): Promise<
  | {
      success: true;
      files: File[] | [];
    }
  | {
      success: false;
      error: string;
    }
> {
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const files =
    (await db
      .select({
        id: filesTable.id,
        name: filesTable.name,
        index: filesTable.index,
        downloadCount: filesTable.downloadCount,
      })
      .from(filesTable)
      .where(
        and(eq(filesTable.gameId, gameId), eq(filesTable.type, "game_archive"))
      )) ?? [];

  return {
    success: true,
    files: files.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
  };
}

"use server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { files } from "@/db/schema";
import { canRead } from "@/lib/permissions";

export async function getSlides(gameId: string): Promise<
  | {
      success: true;
      slides: { id: string; index: number | null }[];
    }
  | {
      success: false;
      error: string;
    }
> {
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const slides =
    (await db
      .select({
        id: files.id,
        index: files.index,
      })
      .from(files)
      .where(
        and(eq(files.gameId, gameId), eq(files.type, "carousel_image"))
      )) ?? [];

  return {
    success: true,
    slides: slides.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
  };
}

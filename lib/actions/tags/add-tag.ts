"use server";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { canWrite } from "@/lib/permissions";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addTag({
  gameId,
  tagName,
}: {
  gameId: string;
  tagName: string;
}) {
  if (!(await canWrite(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const [tag] = await db
    .select()
    .from(tags)
    .where(and(eq(tags.gameId, gameId), eq(tags.name, tagName)))
    .limit(1);
  if (tag) {
    return { success: false, error: "Tag already exists" };
  }

  try {
    await db.insert(tags).values({ gameId, name: tagName });
  } catch (error) {
    return { success: false, error: "Failed to add tag" };
  }

  revalidatePath(`/game/${gameId}`);
  return { success: true };
}

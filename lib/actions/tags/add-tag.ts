"use server";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { canWrite } from "@/lib/permissions";

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

  try {
    await db.insert(tags).values({ gameId, name: tagName });
  } catch (error) {
    return { success: false, error: "Failed to add tag" };
  }

  return { success: true };
}

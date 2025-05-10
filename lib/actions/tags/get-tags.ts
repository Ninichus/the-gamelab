"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tags as tagsTable, users } from "@/db/schema";
import { canRead } from "@/lib/permissions";

export async function getTags(gameId: string): Promise<
  | {
      success: true;
      tags: { id: number; name: string }[];
    }
  | {
      success: false;
      error: string;
    }
> {
  if (!(await canRead(gameId))) {
    return { success: false, error: "Unauthorized" };
  }

  const tags =
    (await db
      .selectDistinct()
      .from(tagsTable)
      .where(eq(tagsTable.gameId, gameId))) ?? [];

  return { success: true, tags };
}

export async function getAllTags() {
  const tags =
    (await db.selectDistinct({ name: tagsTable.name }).from(tagsTable)) ?? [];

  return { success: true, tags };
}

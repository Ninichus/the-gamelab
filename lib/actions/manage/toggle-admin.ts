"use server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users as usersTable } from "@/db/schema";
import { getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function toggleAdmin({ userId }: { userId: number }) {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!existingUser) {
    return { success: false, error: "User not found" };
  }
  const isAdmin = existingUser.isAdmin;
  await db
    .update(usersTable)
    .set({ isAdmin: !isAdmin })
    .where(eq(usersTable.id, userId));

  revalidatePath("/manage");
  return { success: true };
}

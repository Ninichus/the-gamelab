"use server";
import { redirect } from "next/navigation";

export async function redirectToLogin(redirectUrl: string) {
  redirect(`/auth/login?from=${encodeURIComponent(redirectUrl)}`);
}

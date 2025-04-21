"use server";
import { NextResponse } from "next/server";

export async function redirectToLogin(redirectUrl: string) {
  const response = NextResponse.redirect(
    new URL("/auth/login", process.env.WEB_URL)
  );
  response.cookies.set("redirectTo", redirectUrl, {
    maxAge: 60 * 5, // 5 minutes
    secure: true,
    sameSite: "lax",
    httpOnly: true,
  });
  return response;
}

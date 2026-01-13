import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { getSession, sessionOptions } from "./lib/session";
import { sealData } from "iron-session";

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - auth (authentication routes)
   * - public (public files)
   * - manifest.json (web app manifest file)
   * - robots.txt (robots file)
   * - browse (browse page)
   * - profile (profile page)
   * - / (main page)
   * - game (permissions handled in the route handler)
   * - download (permissions handled in the route handler)
   */

  matcher:
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|icon0.svg|icon1.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png|auth|public|manifest.json|robots.txt|browse|profile|$|game|download).*)",
};

export async function middleware(request: NextRequest) {
  //console.log("Middleware running", request.nextUrl.pathname);

  const session = await getSession();

  if (!session.user) {
    return NextResponse.redirect(
      new URL(
        `/auth/login?from=${encodeURIComponent(request.nextUrl.pathname)}`,
        process.env.WEB_URL
      )
    );
  }

  let updatedSession: string | null = null;

  if (session.expiresAt - 1000 * 5 * 60 < Date.now()) {
    try {
      const payload = await refreshAccessToken(session.refreshToken);

      session.accessToken = payload.access_token;
      session.refreshToken = payload.refresh_token;
      session.expiresAt = Date.now() + payload.expires_in * 1000;

      updatedSession = await sealData(session, {
        password: sessionOptions.password,
      });

      request.cookies.set({
        name: sessionOptions.sessionToken,
        value: updatedSession,
      });
    } catch {
      return NextResponse.redirect(
        new URL(
          `/auth/login?from=${encodeURIComponent(request.nextUrl.pathname)}`,
          process.env.WEB_URL
        )
      );
    }
  }

  const user = session.user;

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/manage")) {
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL("/", process.env.WEB_URL!));
    }
  }

  const response = NextResponse.next();

  if (updatedSession) {
    response.cookies.set({
      name: sessionOptions.sessionToken,
      value: updatedSession,
      maxAge: sessionOptions.cookieOptions!.maxAge,
      secure: true,
      sameSite: "lax",
    });
  }

  return response;
}

type OpenIDConfiguration = {
  token_endpoint: string;
  // other fields
};

let openIDConfiguration: OpenIDConfiguration | null = null;

// Middleware is "running" on the edge runtime so we can't import openid-client
async function getOpenIDConfiguration(): Promise<OpenIDConfiguration> {
  const response = await fetch(
    `${process.env.OIDC_URL!}/.well-known/openid-configuration`
  );

  return await response.json();
}

async function refreshAccessToken(refreshToken: string): Promise<{
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}> {
  if (!openIDConfiguration) {
    openIDConfiguration = await getOpenIDConfiguration();
  }

  const response = await fetch(openIDConfiguration.token_endpoint, {
    method: "POST",
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
    }),
  });

  return await response.json();
}

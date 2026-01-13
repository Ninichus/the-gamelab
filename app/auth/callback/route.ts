import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as client from "openid-client";
import { getCodeVerifierSession, getSession } from "@/lib/session";
import { User } from "@/lib/session";
import { getClientConfig } from "@/lib/oidc";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const webUrl = process.env.WEB_URL!;

export async function GET(request: Request) {
  const stateSession = await getCodeVerifierSession();

  // set current url with the correct base url
  const url = new URL(`${webUrl}/auth/callback`);
  url.search = new URLSearchParams(request.url.split("?")[1]).toString();

  const tokenSet = await client.authorizationCodeGrant(
    await getClientConfig(),
    url,
    {
      pkceCodeVerifier: stateSession.codeVerifier,
    }
  );

  const subject = tokenSet.claims()?.sub;

  if (
    !tokenSet.access_token ||
    !tokenSet.refresh_token ||
    !tokenSet.expires_in ||
    !subject
  ) {
    throw new Error("Invalid token set received");
  }

  stateSession.destroy();

  const user = await client.fetchUserInfo(
    await getClientConfig(),
    tokenSet.access_token,
    subject
  );

  const session = await getSession();
  session.user = await buildUser(user as OIDCUser);
  session.accessToken = tokenSet.access_token;
  session.refreshToken = tokenSet.refresh_token;
  session.expiresAt = Date.now() + tokenSet.expires_in * 1000;

  await session.save();
  const cookiesStore = await cookies();
  const redirectTo = cookiesStore.get("redirectTo")?.value || "/";
  cookiesStore.delete("redirectTo");
  /*if (redirectTo !== "/") {
    console.log(`Redirecting to ${redirectTo} after login`);
  }*/
  return NextResponse.redirect(new URL(redirectTo, webUrl));
}

type OIDCUser = {
  sub: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
};

async function buildUser(user: OIDCUser): Promise<User> {
  const [userDatabase] = await db
    .select({
      id: users.id,
      username: users.username,
      isAdmin: users.isAdmin,
    })
    .from(users)
    .where(eq(users.uid, user.sub))
    .limit(1);

  if (!userDatabase) {
    // User not found in the database, create a new user
    const newUser = {
      uid: user.sub,
      username: user.email.split("@")[0],
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      isAdmin: false,
    };
    const [inserted] = await db.insert(users).values(newUser);
    return {
      id: inserted.insertId,
      username: newUser.username,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      avatar: user.avatar,
      isAdmin: newUser.isAdmin,
    };
  }

  return {
    id: userDatabase.id,
    username: userDatabase.username,
    firstName: user.first_name,
    lastName: user.last_name,
    avatar: user.avatar,
    isAdmin: userDatabase.isAdmin,
  };
}

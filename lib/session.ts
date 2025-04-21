import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { cache } from "react";

export const sessionOptions = {
  password: process.env.SESSION_SECRET!, // A strong secret
  cookieName: "gamelab_session",
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 14, // 14 days
    secure: process.env.NODE_ENV === "production", // Use true for https in production
  },
  stateToken: "state",
  sessionToken: "session",
};

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  isAdmin: boolean;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

async function getSessionData<T extends object>(cookieName: string) {
  if (!sessionOptions.password) {
    throw new Error("SESSION_SECRET is not defined");
  }

  const payload = await getIronSession<T>(await cookies(), {
    password: sessionOptions.password,
    cookieName: cookieName,
    cookieOptions: sessionOptions.cookieOptions,
  });

  return payload;
}

export function getCodeVerifierSession() {
  return getSessionData<{ codeVerifier: string }>(sessionOptions.stateToken);
}

export function getSession() {
  return getSessionData<Session>(sessionOptions.sessionToken);
}

export const getUser: () => Promise<User> = cache(async () => {
  const session = await getSession();
  const user = session.user;
  return user;
});

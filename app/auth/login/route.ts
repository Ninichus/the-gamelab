import * as client from "openid-client";
import { getCodeVerifierSession } from "@/lib/session";
import { getClientConfig } from "@/lib/oidc";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const webUrl = process.env.WEB_URL!;

// the user will be redirected to this route to login with viarezo oauth
export async function GET(request: NextRequest) {
  const codeVerifier = client.randomPKCECodeVerifier();

  // save the codeVerifier in the session
  const stateSession = await getCodeVerifierSession();
  stateSession.codeVerifier = codeVerifier;
  await stateSession.save();

  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

  const authorizationUrl = client.buildAuthorizationUrl(
    await getClientConfig(),
    {
      redirect_uri: `${webUrl}/auth/callback`,
      scope: "openid profile email",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    }
  );

  const response = NextResponse.redirect(new URL(authorizationUrl));

  //Check if the user must be redirected after login
  const from = new URL(request.url).searchParams.get("from");
  const cookiesStore = await cookies();
  if (from && !cookiesStore.get("redirectTo")) {
    response.cookies.set("redirectTo", new URL(from).pathname, {
      maxAge: 60 * 5, // 5 minutes
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    });
  }

  // redirect the user to the oidc login page
  return response;
}

import { redirect } from "next/navigation";
import * as client from "openid-client";
import { getCodeVerifierSession } from "@/lib/session";
import { getClientConfig } from "@/lib/oidc";

export const dynamic = "force-dynamic";

const webUrl = process.env.WEB_URL!;

// the user will be redirected to this route to login with viarezo oauth
export async function GET() {
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

  // redirect the user to the oidc login page
  redirect(authorizationUrl.href);
}

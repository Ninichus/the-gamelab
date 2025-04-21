import "server-only";

import * as client from "openid-client";

let clientConfiguration: client.Configuration | null = null;

export async function getClientConfig() {
  if (!clientConfiguration) {
    clientConfiguration = await client.discovery(
      new URL(process.env.OIDC_URL!),
      process.env.CLIENT_ID!,
      process.env.CLIENT_SECRET!
    );
  }

  return clientConfiguration;
}

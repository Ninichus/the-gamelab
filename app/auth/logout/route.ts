import { getClientConfig } from "@/lib/oidc";
import * as client from "openid-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  session.destroy();

  redirect(client.buildEndSessionUrl(await getClientConfig()).href);
}

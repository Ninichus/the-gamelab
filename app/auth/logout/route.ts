import { getClientConfig } from "@/lib/oidc";
import * as client from "openid-client";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  session.destroy();

  return NextResponse.redirect(
    client.buildEndSessionUrl(await getClientConfig())
  );
}

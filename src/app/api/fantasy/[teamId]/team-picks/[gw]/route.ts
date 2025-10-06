import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string; gw: string }> }
) {
  const { teamId, gw } = await params;

  try {
    const res = await fetch(
      `${config.SERVER_URL}/fantasy/team/${teamId}/picks/${gw}`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch picks: ${res.status}`);
    }

    const data = await res.json();
    console.log("[ROUTE TEAM PICKS DATA]: ", data);
    return NextResponse.json(data);
      //eslint-disable-next-line
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${config.SERVER_URL}/fbref/epl/players/`);
    if (!res.ok) throw new Error("Failed to fetch players from server");

    const players = await res.json();
    return NextResponse.json(players);
  } catch (err) {
    console.error("Error fetching EPL players:", err);
    return NextResponse.json({ error: "Could not fetch players" }, { status: 500 });
  }
}

import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${config.SERVER_URL}/fbref/teams`);
    if (!res.ok) throw new Error("Failed to fetch teams from server");

    const teams = await res.json();
    return NextResponse.json(teams);
  } catch (err) {
    console.error("Error fetching EPL teams:", err);
    return NextResponse.json({ error: "Could not fetch teams" }, { status: 500 });
  }
}

import { config } from "@/lib/config";
import { Fixture } from "@/types/api/fixtures";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    // Extract query params from request
    const { searchParams } = new URL(req.url);
    const week = searchParams.get("week");
    const team = searchParams.get("team");

    // Build query string dynamically
    const params = new URLSearchParams();
  
    if (week) params.append("week", week);
    if (team) params.append("team", team);

    const urlWithParams = `${config.SERVER_URL}/fbref/fixtures?${params.toString()}`;

    // Fetch from FastAPI backend
    const res = await fetch(urlWithParams);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch fixtures from backend" },
        { status: res.status }
      );
    }

    const data: Fixture[] = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return NextResponse.json(
      { error: "Internal server error fetching fixtures" },
      { status: 500 }
    );
  }
}

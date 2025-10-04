import { config } from "@/lib/config";
import { TeamTable } from "@/types/api/table";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch from FastAPI backend
    const res = await fetch(`${config.SERVER_URL}/fotmob/table`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch table from backend" },
        { status: res.status }
      );
    }

    const data: TeamTable[] = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching table:", error);
    return NextResponse.json(
      { error: "Internal server error fetching table" },
      { status: 500 }
    );
  }
}

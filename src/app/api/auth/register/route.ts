import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const response = await fetch(`${config.SERVER_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error calling server:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${config.SERVER_URL}/user/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

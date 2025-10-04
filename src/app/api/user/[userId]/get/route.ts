import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  console.log("ROUTE:", userId);

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${config.SERVER_URL}/user/get/${userId}`, {
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

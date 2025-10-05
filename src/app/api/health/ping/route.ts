import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500); // 500ms timeout

    await fetch(`${config.SERVER_URL}`, { signal: controller.signal });
    clearTimeout(timeout);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ status: "down" }, { status: 503 });
  }
}

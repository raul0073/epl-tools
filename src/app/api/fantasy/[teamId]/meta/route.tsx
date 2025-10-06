import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string}> }
) {
  const { teamId } = await params;

  try {
    const res = await fetch(`${config.SERVER_URL}/fantasy/team/${teamId}`);
    if (!res.ok) {
      throw new Error(`Failed to team data: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
      //eslint-disable-next-line
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

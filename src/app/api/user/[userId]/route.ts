import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const user = await req.json();
    const { userId } = await params; 
    console.log("Sending user id:", userId); 

    const res = await fetch(`${config.SERVER_URL}/user/update/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}



// export async function DELETE(req: NextRequest) {
//   const userId = req.nextUrl.searchParams.get("id");
//   if (!userId) {
//     return NextResponse.json({ error: "Missing user id" }, { status: 400 });
//   }

//   try {
//     const res = await fetch(`${config.SERVER_URL}/user?id=${encodeURIComponent(userId)}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) throw new Error(await res.text());
//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

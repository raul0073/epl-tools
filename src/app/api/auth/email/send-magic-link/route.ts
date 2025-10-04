import { resend } from "@/lib/resend/Sender";
import { EmailTemplate } from "@/lib/resend/EmailTemplate";

export async function POST(req: Request) {
  const { email, url } = await req.json();

  await resend.emails.send({
    from: "EPL Prediction League <raz.m.stats@gmail.com>",
    to: [email],
    subject: "Sign in to EPL Prediction League",
    react: EmailTemplate({ firstName: email.split("@")[0], url, host: "EPL Prediction League" }),
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

import { EmailTemplate } from "@/lib/resend/EmailTemplate";
import { resend } from "@/lib/resend/Sender";
import type { SendVerificationRequestParams } from "next-auth/providers/email";

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [identifier],
      subject: `Sign in to ${host}`,
      react: EmailTemplate({
        firstName: identifier.split("@")[0],
        url,
        host,
      }),
    });

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Cannot send verification email.");
  }
}

import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/newsletter";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  // TODO: wire up to an email service provider (Mailchimp, Resend Audiences, etc).
  console.log(`Newsletter signup: ${parsed.data.email}`);

  return NextResponse.json({ success: true });
}

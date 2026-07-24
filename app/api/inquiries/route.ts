import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations/inquiry";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { customerEmail, ...rest } = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: { ...rest, customerEmail: customerEmail || undefined },
  });

  return NextResponse.json({ success: true, id: inquiry.id });
}

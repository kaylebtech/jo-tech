import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/queries";
import { serializeProduct } from "@/lib/serialize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const products = await getProductsByIds(ids);
  return NextResponse.json({ results: products.map(serializeProduct) });
}

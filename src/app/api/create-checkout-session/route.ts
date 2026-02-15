import { NextRequest, NextResponse } from "next/server";

// Deprecated — use /api/checkout instead
export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL("/api/checkout", request.url), 307);
}

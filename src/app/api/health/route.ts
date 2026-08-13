import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "travel-guide-next-api",
    timestamp: new Date().toISOString(),
  });
}

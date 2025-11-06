import { NextResponse } from "next/server";

const EXPRESS_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function GET() {
  const res = await fetch(`${EXPRESS_BASE}/messages`);
  const data = await res.json();

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const payload = await request.json();

  const res = await fetch(`${EXPRESS_BASE}/emit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return NextResponse.json(data);
}

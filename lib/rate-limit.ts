import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: NextRequest) => {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const identifier =
      forwardedFor?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const now = Date.now();

    if (!rateLimitStore[identifier]) {
      rateLimitStore[identifier] = { count: 1, resetTime: now + windowMs };
      return null;
    }

    const record = rateLimitStore[identifier];

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return null;
    }

    record.count++;

    if (record.count > maxRequests) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)) } }
      );
    }

    return null;
  };
}

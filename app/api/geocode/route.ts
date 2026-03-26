import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleMapsServerRequestDeniedDetails,
  getMissingGoogleMapsServerKeyDetails,
} from "@/lib/googleMapsServerConfig";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const rawAddress = payload.address;
    const address = typeof rawAddress === "string" ? rawAddress.trim() : "";

    if (!address || address.length > 300) {
      console.warn("[Geocode] Missing address parameter");
      return NextResponse.json(
        { error: "Address is required and must be less than 300 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
    
    if (!apiKey) {
      console.warn("[Geocode] GOOGLE_MAPS_SERVER_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: getMissingGoogleMapsServerKeyDetails("Geocoding API"),
        },
        { status: 500 }
      );
    }

    // Call Google Geocoding API with UK region bias
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const params = new URLSearchParams({
      address,
      region: "GB", // Bias results to United Kingdom
      key: apiKey,
    });

    console.log(`[Geocode] Geocoding address: "${address}"`);

    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    // Google Geocoding API returns 200 even with errors, check the status field
    if (data.status === "REQUEST_DENIED") {
      console.warn("[Geocode] API Key denied:", data.error_message);
      return NextResponse.json(
        {
          error: "Server configuration error - API not authorized",
          details: getGoogleMapsServerRequestDeniedDetails(
            "Geocoding API",
            data.error_message
          ),
        },
        { status: 500 }
      );
    }

    if (data.status === "INVALID_REQUEST") {
      console.error("[Geocode] Invalid request:", data.error_message);
      return NextResponse.json(
        { error: "Invalid geocoding request" },
        { status: 400 }
      );
    }

    if (data.status === "OVER_QUERY_LIMIT") {
      console.error("[Geocode] Query limit exceeded");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    if (data.status === "UNKNOWN_ERROR") {
      console.error("[Geocode] Unknown error from API");
      return NextResponse.json(
        { error: "Server error while geocoding. Please try again." },
        { status: 500 }
      );
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error(`[Geocode] Unexpected status: ${data.status}`, data);
      return NextResponse.json(
        { error: `Geocoding failed: ${data.status}` },
        { status: 500 }
      );
    }

    console.log(`[Geocode] Success for "${address}": ${data.results?.length || 0} results`);

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Geocode Error]", errorMessage);
    return NextResponse.json(
      { error: "Failed to geocode address" },
      { status: 500 }
    );
  }
}

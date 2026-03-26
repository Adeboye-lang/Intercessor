import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleMapsServerRequestDeniedDetails,
  getMissingGoogleMapsServerKeyDetails,
} from "@/lib/googleMapsServerConfig";

export const runtime = "nodejs";

const GOOGLE_PLACES_NEARBY_SEARCH_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const MAX_NEARBY_SEARCH_PAGES = 3;
const NEXT_PAGE_TOKEN_DELAY_MS = 2000;
const NEXT_PAGE_TOKEN_MAX_ATTEMPTS = 3;

type GooglePlacesResult = {
  place_id?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
};

type GooglePlacesNearbyResponse = {
  error_message?: string;
  next_page_token?: string;
  results?: GooglePlacesResult[];
  status?: string;
};

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

async function fetchNearbySearchPage(
  apiKey: string,
  latitude: number,
  longitude: number,
  nextPageToken?: string
) {
  for (
    let attempt = 0;
    attempt < NEXT_PAGE_TOKEN_MAX_ATTEMPTS;
    attempt += 1
  ) {
    if (nextPageToken) {
      await delay(NEXT_PAGE_TOKEN_DELAY_MS);
    }

    const params = nextPageToken
      ? new URLSearchParams({
          pagetoken: nextPageToken,
          key: apiKey,
        })
      : new URLSearchParams({
          location: `${latitude},${longitude}`,
          rankby: "distance",
          type: "church",
          key: apiKey,
          region: "GB",
        });

    const response = await fetch(
      `${GOOGLE_PLACES_NEARBY_SEARCH_URL}?${params.toString()}`
    );
    const data = (await response.json()) as GooglePlacesNearbyResponse;

    if (!response.ok) {
      return {
        ok: false as const,
        httpStatus: response.status,
        data,
      };
    }

    if (
      nextPageToken &&
      data.status === "INVALID_REQUEST" &&
      attempt < NEXT_PAGE_TOKEN_MAX_ATTEMPTS - 1
    ) {
      continue;
    }

    return {
      ok: true as const,
      data,
    };
  }

  return {
    ok: true as const,
    data: {
      status: "INVALID_REQUEST",
      error_message:
        "Google Places next page token did not become valid in time.",
      results: [],
    } satisfies GooglePlacesNearbyResponse,
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const latitude = Number(payload.latitude);
    const longitude = Number(payload.longitude);
    const radius = Number(payload.radius);

    const hasInvalidCoordinates =
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180;

    const hasInvalidRadius = Number.isNaN(radius) || radius < 100 || radius > 50000;

    if (hasInvalidCoordinates || hasInvalidRadius) {
      return NextResponse.json(
        { error: "Invalid location parameters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
    
    if (!apiKey) {
      console.warn("[Places] GOOGLE_MAPS_SERVER_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: getMissingGoogleMapsServerKeyDetails("Places API"),
        },
        { status: 500 }
      );
    }

    console.log(
      `[Places] Searching for churches near (${latitude}, ${longitude}) within ${radius}m`
    );

    const aggregatedResults: GooglePlacesResult[] = [];
    const seenPlaceIds = new Set<string>();
    let nextPageToken: string | undefined;

    for (let page = 0; page < MAX_NEARBY_SEARCH_PAGES; page += 1) {
      const pageResponse = await fetchNearbySearchPage(
        apiKey,
        latitude,
        longitude,
        nextPageToken
      );

      if (!pageResponse.ok) {
        console.error("[Places] API error:", pageResponse.data.error_message);
        return NextResponse.json(
          {
            error: pageResponse.data.error_message || "Google Places API error",
          },
          { status: 500 }
        );
      }

      const data = pageResponse.data;

      if (data.status === "REQUEST_DENIED") {
        console.warn("[Places] API Key denied:", data.error_message);
        return NextResponse.json(
          {
            error: "Server configuration error - API not authorized",
            details: getGoogleMapsServerRequestDeniedDetails(
              "Places API",
              data.error_message
            ),
          },
          { status: 500 }
        );
      }

      if (data.status === "OVER_QUERY_LIMIT") {
        console.error("[Places] Query limit exceeded");
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.error("[Places] Unexpected status:", data.status);
        return NextResponse.json(
          { error: `Search failed: ${data.status}` },
          { status: 500 }
        );
      }

      for (const result of data.results || []) {
        const placeId = result.place_id;

        if (placeId && seenPlaceIds.has(placeId)) {
          continue;
        }

        if (placeId) {
          seenPlaceIds.add(placeId);
        }

        aggregatedResults.push(result);
      }

      if (data.status === "ZERO_RESULTS" || !data.next_page_token) {
        break;
      }

      nextPageToken = data.next_page_token;
    }

    const radiusKm = radius / 1000;
    const filteredResults = aggregatedResults
      .filter((place) => {
        const placeLat = place.geometry?.location?.lat;
        const placeLng = place.geometry?.location?.lng;

        if (typeof placeLat !== "number" || typeof placeLng !== "number") {
          return false;
        }

        return (
          calculateDistanceKm(latitude, longitude, placeLat, placeLng) <= radiusKm
        );
      })
      .sort((a, b) => {
        const aLat = a.geometry?.location?.lat ?? latitude;
        const aLng = a.geometry?.location?.lng ?? longitude;
        const bLat = b.geometry?.location?.lat ?? latitude;
        const bLng = b.geometry?.location?.lng ?? longitude;

        return (
          calculateDistanceKm(latitude, longitude, aLat, aLng) -
          calculateDistanceKm(latitude, longitude, bLat, bLng)
        );
      });

    console.log(
      `[Places] Found ${filteredResults.length} churches within ${radiusKm.toFixed(1)}km (from ${aggregatedResults.length} aggregated results)`
    );

    return NextResponse.json({
      status: filteredResults.length > 0 ? "OK" : "ZERO_RESULTS",
      results: filteredResults,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Places Error]", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch nearby places" },
      { status: 500 }
    );
  }
}

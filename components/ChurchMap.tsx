"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { AlertCircle, Loader2, MapPin } from "lucide-react";
import {
  getGoogleMapsLoadErrorMessage,
  loadGoogleMaps,
} from "@/lib/googleMapsLoader";

interface ChurchResult {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address: string;
  distance: number;
}

type MapStatus = "loading" | "ready" | "unavailable";

interface ChurchMapProps {
  apiKey: string;
  userLocation: { lat: number; lon: number } | null;
  churches: ChurchResult[];
  selectedChurchId?: string;
  onChurchSelect?: (churchId: string) => void;
  onMapStatusChange?: (status: MapStatus, message?: string) => void;
  isLoading?: boolean;
}

const UK_CENTER = { lat: 52.5062, lng: -1.8904 };

const toGooglePosition = (coordinates: { lat: number; lon: number }) => ({
  lat: coordinates.lat,
  lng: coordinates.lon,
});

export function ChurchMap({
  apiKey,
  userLocation,
  churches,
  selectedChurchId,
  onChurchSelect,
  onMapStatusChange,
  isLoading = false,
}: ChurchMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const latestUserLocation = useRef(userLocation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markers = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarker = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoWindowRef = useRef<any>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>(
    apiKey ? "loading" : "unavailable"
  );
  const [mapError, setMapError] = useState(
    apiKey
      ? ""
      : "Map unavailable because the browser Google Maps key is missing."
  );

  useEffect(() => {
    latestUserLocation.current = userLocation;
  }, [userLocation]);

  const handleUnavailable = useCallback(
    (message: string) => {
      setMapStatus("unavailable");
      setMapError(message);
      onMapStatusChange?.("unavailable", message);
    },
    [onMapStatusChange]
  );

  const syncUserMarker = useCallback(() => {
    if (!map.current) return;

    if (userMarker.current) {
      userMarker.current.setMap(null);
      userMarker.current = null;
    }

    if (!userLocation) {
      return;
    }

    userMarker.current = new window.google.maps.Marker({
      position: toGooglePosition(userLocation),
      map: map.current,
      title: "Your Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#3D532D",
        fillOpacity: 1,
        strokeColor: "#C5A059",
        strokeWeight: 2,
      },
    });
  }, [userLocation]);

  // Info window handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showInfoWindow = useCallback((marker: any, church: ChurchResult) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const content = `
      <div class="p-3 text-[#3D532D] font-sans" style="min-width: 250px;">
        <h3 class="font-semibold text-sm mb-1">${church.name}</h3>
        <p class="text-xs text-[#3D532D]/70 mb-2">${church.address}</p>
        <p class="text-xs font-semibold text-brand">${church.distance.toFixed(1)} km away</p>
      </div>
    `;

    infoWindowRef.current = new window.google.maps.InfoWindow({
      content,
      ariaLabel: church.name,
    });

    infoWindowRef.current.open(map.current, marker);
  }, []);

  // Add/update church markers
  const addChurchMarkers = useCallback(() => {
    if (!map.current) return;

    markers.current.forEach((marker) => marker.setMap(null));
    markers.current.clear();

    churches.forEach((church) => {
      const isSelected = church.id === selectedChurchId;
      const marker = new window.google.maps.Marker({
        position: { lat: church.lat, lng: church.lon },
        map: map.current,
        title: church.name,
        icon: {
          path: "M12 0C7.582 0 4 3.582 4 8c0 5.25 8 14 8 14s8-8.75 8-14c0-4.418-3.582-8-8-8zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z",
          scale: isSelected ? 1.8 : 1.5,
          fillColor: isSelected ? "#C5A059" : "#3D532D",
          fillOpacity: 1,
          strokeColor: "#FFF",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        onChurchSelect?.(church.id);
        showInfoWindow(marker, church);
        map.current?.panTo(marker.getPosition());
      });

      markers.current.set(church.id, marker);

      if (isSelected) {
        setTimeout(() => showInfoWindow(marker, church), 200);
        map.current?.panTo(marker.getPosition());
      }
    });

    if (churches.length > 0 || userLocation) {
      const bounds = new window.google.maps.LatLngBounds();

      if (userLocation) {
        bounds.extend(toGooglePosition(userLocation));
      }

      churches.forEach((church) => {
        bounds.extend({ lat: church.lat, lng: church.lon });
      });

      map.current?.fitBounds(bounds, { padding: 50 });
    }
  }, [churches, selectedChurchId, userLocation, showInfoWindow, onChurchSelect]);

  const createMap = useCallback(() => {
    if (!mapContainer.current || map.current || !window.google?.maps) {
      return;
    }

    const initialUserLocation = latestUserLocation.current;
    const center = initialUserLocation
      ? toGooglePosition(initialUserLocation)
      : UK_CENTER;

    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: initialUserLocation ? 13 : 6,
      center,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#3D532D" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#E8F5E9" }],
        },
      ],
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      return;
    }

    if (!apiKey) {
      onMapStatusChange?.(
        "unavailable",
        "Map unavailable because the browser Google Maps key is missing."
      );
      return;
    }

    let isCancelled = false;

    const setupMap = async () => {
      try {
        await loadGoogleMaps(apiKey);

        if (isCancelled) {
          return;
        }

        createMap();
        setMapStatus("ready");
        setMapError("");
        onMapStatusChange?.("ready");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("Failed to initialize Google Maps:", error);
        handleUnavailable(getGoogleMapsLoadErrorMessage(error));
      }
    };

    void setupMap();

    return () => {
      isCancelled = true;
    };
  }, [apiKey, createMap, handleUnavailable, onMapStatusChange]);

  useEffect(() => {
    if (!window.google || !map.current || mapStatus !== "ready") return;

    syncUserMarker();
    addChurchMarkers();
  }, [addChurchMarkers, mapStatus, syncUserMarker]);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <div
        ref={mapContainer}
        className={`h-full w-full ${mapStatus === "unavailable" ? "hidden" : ""}`}
      />

      {mapStatus === "unavailable" && (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#FDFBF7] via-white to-[#F4F0E8] p-6 text-center">
          <div className="max-w-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3D532D] text-white shadow-lg">
              <AlertCircle className="h-7 w-7" />
            </div>
            <p className="font-serif text-2xl text-[#3D532D]">
              Map unavailable
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#3D532D]/70">
              {mapError || "The church list still works even when the map is unavailable."}
            </p>
          </div>
        </div>
      )}

      {(isLoading || mapStatus === "loading") && mapStatus !== "unavailable" && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#3D532D] animate-spin" />
            <p className="text-[#3D532D] font-semibold">
              {isLoading ? "Loading results..." : "Loading map..."}
            </p>
          </div>
        </div>
      )}

      {!userLocation &&
        !isLoading &&
        mapStatus !== "unavailable" &&
        churches.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="bg-[#3D532D] rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#3D532D] font-semibold text-sm">
                Search for churches to see them on the map
              </p>
            </div>
          </div>
        )}
    </div>
  );
}

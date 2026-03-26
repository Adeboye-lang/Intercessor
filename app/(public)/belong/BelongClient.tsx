"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Navigation, AlertCircle, CheckCircle2, Loader2, Minus, Plus } from "lucide-react";
import { LocationConsentModal } from "@/components/LocationConsentModal";
import { ChurchMap } from "@/components/ChurchMap";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

interface ChurchResult {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address: string;
  distance: number;
}

interface BelongApiErrorResponse {
  error?: string;
  details?: string;
}

interface GeocodeResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast?: {
        lat: number;
        lng: number;
      };
      southwest?: {
        lat: number;
        lng: number;
      };
    };
  };
}

type LocationState = 'idle' | 'requesting' | 'granted' | 'denied' | 'consent-pending';
type MapStatus = 'loading' | 'ready' | 'unavailable';

const SERVER_KEY_SETUP_MESSAGE =
  "Search is unavailable until the server Google Maps key is configured. Add GOOGLE_MAPS_SERVER_API_KEY to your env and restart the dev server.";
const SERVER_KEY_REJECTED_MESSAGE =
  "Search is unavailable because the server Google Maps key is using browser-style restrictions. Create a separate server key for Geocoding API and Places API.";
const SERVER_APIS_NOT_ENABLED_MESSAGE =
  "Search is unavailable because Geocoding API or Places API is not enabled on the server Google Maps key.";
const INVALID_SERVER_KEY_MESSAGE =
  "Search is unavailable because the server Google Maps key is invalid.";

const getBelongApiErrorMessage = (
  payload: BelongApiErrorResponse,
  fallback: string
) => {
  const details = payload.details || "";
  const error = payload.error || "";
  const combinedMessage = `${details} ${error}`.trim();

  if (
    combinedMessage.includes("GOOGLE_MAPS_SERVER_API_KEY") ||
    error === "Server configuration error"
  ) {
    return SERVER_KEY_SETUP_MESSAGE;
  }

  if (
    combinedMessage.includes(
      "API keys with referer restrictions cannot be used with this API"
    ) ||
    combinedMessage.includes("browser referrer restrictions")
  ) {
    return SERVER_KEY_REJECTED_MESSAGE;
  }

  if (
    combinedMessage.includes("This API project is not authorized to use this API") ||
    combinedMessage.includes("Enable Geocoding API") ||
    combinedMessage.includes("Enable Places API")
  ) {
    return SERVER_APIS_NOT_ENABLED_MESSAGE;
  }

  if (
    combinedMessage.includes("The provided API key is invalid") ||
    combinedMessage.includes("API key is invalid")
  ) {
    return INVALID_SERVER_KEY_MESSAGE;
  }

  return details || error || fallback;
};

const isExpectedBelongSetupError = (message: string) =>
  message.startsWith("Search is unavailable");

const DEFAULT_SEARCH_RADIUS_KM = 5;
const MIN_MANUAL_SEARCH_RADIUS_KM = 5;
const MAX_SEARCH_RADIUS_KM = 50;
const MIN_ADJUSTABLE_RADIUS_KM = 1;

export default function BelongClient() {
  // API key for frontend Maps SDK (client-side rendering only)
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [locationState, setLocationState] = useState<LocationState>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [churches, setChurches] = useState<ChurchResult[]>([]);
  const [selectedChurchId, setSelectedChurchId] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchRadius, setSearchRadius] = useState(DEFAULT_SEARCH_RADIUS_KM);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [error, setError] = useState<string>("");
  const [mapStatus, setMapStatus] = useState<MapStatus>(
    mapsApiKey ? "loading" : "unavailable"
  );
  const [mapError, setMapError] = useState<string>(
    mapsApiKey
      ? ""
      : "Map unavailable because the browser Google Maps key is missing."
  );

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deriveRadiusFromViewport = useCallback(
    (result: GeocodeResult) => {
      const viewport = result.geometry.viewport;

      if (!viewport?.northeast || !viewport?.southwest) {
        return DEFAULT_SEARCH_RADIUS_KM;
      }

      const { lat, lng } = result.geometry.location;
      const { northeast, southwest } = viewport;
      const viewportCorners = [
        northeast,
        southwest,
        { lat: northeast.lat, lng: southwest.lng },
        { lat: southwest.lat, lng: northeast.lng },
      ];

      const maxDistance = Math.max(
        ...viewportCorners.map((corner) =>
          calculateDistance(lat, lng, corner.lat, corner.lng)
        )
      );

      return Math.max(
        MIN_MANUAL_SEARCH_RADIUS_KM,
        Math.min(MAX_SEARCH_RADIUS_KM, Math.ceil(maxDistance))
      );
    },
    []
  );

  // Fetch churches through the server so results still work if the browser map is blocked
  const fetchChurchesFromCoordinates = async (
    lat: number,
    lon: number,
    radiusKm: number = DEFAULT_SEARCH_RADIUS_KM
  ) => {
    setIsFetching(true);
    setError("");
    try {
      const response = await fetch("/api/places-nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          radius: radiusKm * 1000,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          getBelongApiErrorMessage(
            data,
            "Could not find churches. Please try again."
          )
        );
        return;
      }

      interface GooglePlace {
        place_id: string;
        name: string;
        vicinity: string;
        geometry: {
          location: {
            lat: number;
            lng: number;
          };
        };
      }

      const transformedChurches: ChurchResult[] = (data.results || [])
        .map((place: GooglePlace, index: number) => ({
          id: place.place_id || `church-${index}`,
          lat: place.geometry.location.lat,
          lon: place.geometry.location.lng,
          name: place.name || "Local Church",
          address: place.vicinity || "Address unavailable",
          distance: calculateDistance(
            lat,
            lon,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
        }))
        .sort((a: ChurchResult, b: ChurchResult) => a.distance - b.distance);
      
      setChurches(transformedChurches);
      setSelectedChurchId(transformedChurches[0]?.id || "");
      
      if (transformedChurches.length === 0) {
        setError("No churches found in that area yet. Try expanding the search radius or searching a nearby area.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not find churches. Please try again.";

      if (!isExpectedBelongSetupError(errorMessage)) {
        console.error("Error fetching churches:", error);
      }

      setError(errorMessage);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationState('denied');
      return;
    }

    setLocationState('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ lat, lon });
        setLocationState('granted');
        setShowConsentModal(false);
        fetchChurchesFromCoordinates(lat, lon, searchRadius);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Could not access your location. Please enable location permissions.");
        setLocationState('denied');
        setShowConsentModal(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle manual address search
  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    setIsFetching(true);
    setError("");
    try {
      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: searchQuery.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          getBelongApiErrorMessage(
            data,
            "Search is unavailable right now. Please try again."
          )
        );
        setIsFetching(false);
        return;
      }

      if (!data.results || data.results.length === 0) {
        setError("Address not found. Please try a different search.");
        setIsFetching(false);
        return;
      }

      const primaryResult = data.results[0] as GeocodeResult;
      const { lat, lng } = primaryResult.geometry.location;
      const derivedRadiusKm = deriveRadiusFromViewport(primaryResult);
      const location = { lat, lon: lng };
      setUserLocation(location);
      setLocationState('granted');
      setSearchRadius(derivedRadiusKm);
      await fetchChurchesFromCoordinates(location.lat, location.lon, derivedRadiusKm);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Search failed. Please try again.";

      if (!isExpectedBelongSetupError(errorMsg)) {
        console.error("Error during manual search:", error);
      }

      setError(errorMsg);
      setIsFetching(false);
    }
  };

  // Update radius and refetch
  const handleRadiusChange = (delta: number) => {
    const newRadius = Math.max(
      MIN_ADJUSTABLE_RADIUS_KM,
      Math.min(MAX_SEARCH_RADIUS_KM, searchRadius + delta)
    );
    setSearchRadius(newRadius);
    
    if (userLocation && locationState === 'granted') {
      fetchChurchesFromCoordinates(userLocation.lat, userLocation.lon, newRadius);
    }
  };

  const handleMapStatusChange = useCallback((status: MapStatus, message?: string) => {
    setMapStatus(status);
    setMapError(message || "");
  }, []);

  return (
    <div className="min-h-screen text-[#3D532D] overflow-hidden relative selection:bg-brand/20 selection:text-brand pb-32 font-sans">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/Sunset.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* Light overlay to maintain readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-linear-to-b from-[#FDFBF7]/10 via-[#FDFBF7]/40 to-[#FDFBF7]/80" />
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply z-0" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E')" }} 
      />

      {/* Consent Modal */}
      <LocationConsentModal
        isOpen={showConsentModal}
        onAllow={handleGeolocation}
        onDeny={() => setShowConsentModal(false)}
        isLoading={locationState === 'requesting'}
      />

      <div className="container mx-auto px-6 md:px-12 pt-32 relative z-10 flex flex-col">
        {/* Dynamic Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center mb-16 flex flex-col items-center">
          <motion.div variants={fadeIn} className="flex flex-col items-center mb-10">
            <div className="w-px h-12 bg-brand mb-6" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand border border-brand/20 px-6 py-2 rounded-full">
              Find Your People
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif text-[#3D532D] mb-8 leading-[0.9] tracking-tight">
            Not meant to <br className="hidden md:block"/> <span className="italic font-light text-brand relative">walk alone.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-[#3D532D]/70 font-light leading-relaxed max-w-2xl mt-4">
            Search for a local church near you. Connect physically, grow spiritually, and find a deeply rooted community.
          </motion.p>
        </motion.div>

        {/* Search Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-md border border-[#3D532D]/10 p-6 md:p-8 mb-16 relative z-30 shadow-sm"
        >
          <form onSubmit={handleManualSearch} className="flex flex-col md:flex-row gap-4 relative">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3D532D]/40 group-focus-within:text-brand transition-colors" size={20} strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Enter city, region, or postcode..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-14 pr-6 py-4 bg-transparent border-b border-[#3D532D]/20 focus:border-brand text-[#3D532D] text-lg font-serif outline-none transition-all placeholder:text-[#3D532D]/40" 
              />
            </div>
            <button type="submit" disabled={isFetching} className="py-4 px-10 bg-[#3D532D] hover:bg-black disabled:bg-[#3D532D]/50 text-brand-bg font-medium text-sm tracking-[0.2em] uppercase transition-colors flex items-center justify-center">
              {isFetching ? <Loader2 size={16} className="animate-spin" /> : "Search"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-[#3D532D]/10 flex-1" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#3D532D]/50">OR</span>
            <div className="h-px bg-[#3D532D]/10 flex-1" />
          </div>

          <button 
            type="button" 
            onClick={() => setShowConsentModal(true)} 
            disabled={locationState === 'requesting'} 
            className={`w-full py-5 flex items-center justify-center gap-3 font-medium transition-all duration-300 border text-sm uppercase tracking-[0.2em] ${
              locationState === 'denied' 
                ? 'bg-red-50/50 border-red-200 text-red-800' 
                : locationState === 'granted' 
                  ? 'bg-brand/5 border-brand/30 text-[#3D532D]' 
                  : 'bg-transparent border-[#3D532D]/20 hover:border-[#3D532D]/50 text-[#3D532D]'
            }`}
          >
            {locationState === 'idle' && <><Navigation size={18} className="text-brand" strokeWidth={1.5} /> Use Current Location</>}
            {locationState === 'requesting' && <><Loader2 size={18} className="animate-spin text-brand" strokeWidth={1.5} /> Requesting...</>}
            {locationState === 'granted' && <><CheckCircle2 size={18} className="text-brand" strokeWidth={1.5} /> Location Set</>}
            {locationState === 'denied' && <><AlertCircle size={18} strokeWidth={1.5} /> Access Denied. Try manual search.</>}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Area - Split Layout */}
        <AnimatePresence mode="wait">
          {locationState === 'granted' && userLocation && (
            <motion.div 
              key="results" 
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} 
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
              className="w-full mt-8 flex flex-col items-center"
            >
              <div className="flex flex-col items-center w-full max-w-7xl mb-8">
                <h3 className="text-4xl md:text-5xl font-serif text-[#3D532D] mb-2 tracking-tight">Gatherings Near You</h3>
                <p className="text-[#3D532D]/60 flex items-center gap-2 font-serif italic">
                  <MapPin size={16} className="text-brand" /> {churches.length} churches found
                </p>
              </div>

              {/* Split Layout: List on Left, Map on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                {/* Left Column: Search Results List */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Radius Selector */}
                  <div className="bg-white/80 backdrop-blur-md border border-[#3D532D]/10 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-brand" />
                      <span className="text-sm font-semibold text-[#3D532D]">Search Radius:</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleRadiusChange(-1)}
                        disabled={searchRadius <= MIN_ADJUSTABLE_RADIUS_KM || isFetching}
                        className="p-2 hover:bg-[#3D532D]/10 disabled:opacity-50 rounded transition-colors"
                      >
                        <Minus size={16} className="text-[#3D532D]" />
                      </button>
                      <span className="text-lg font-semibold text-[#3D532D] min-w-15 text-center">
                        {searchRadius} km
                      </span>
                      <button
                        onClick={() => handleRadiusChange(1)}
                        disabled={searchRadius >= MAX_SEARCH_RADIUS_KM || isFetching}
                        className="p-2 hover:bg-[#3D532D]/10 disabled:opacity-50 rounded transition-colors"
                      >
                        <Plus size={16} className="text-[#3D532D]" />
                      </button>
                    </div>
                  </div>

                  {/* Churches List */}
                  <div className="space-y-3 max-h-150 overflow-y-auto">
                    {isFetching ? (
                      <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md border border-[#3D532D]/10 rounded-lg">
                        <Loader2 className="animate-spin text-brand w-8 h-8 mb-3" strokeWidth={1.5} />
                        <p className="font-serif text-[#3D532D]/70">Finding churches...</p>
                      </div>
                    ) : churches.length > 0 ? (
                      churches.map((church) => (
                        <motion.div
                          key={church.id}
                          onClick={() => setSelectedChurchId(church.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedChurchId === church.id
                              ? 'border-brand bg-brand/5'
                              : 'border-[#3D532D]/10 bg-white/80 hover:border-[#3D532D]/30'
                          }`}
                        >
                          <h4 className="text-lg font-semibold text-[#3D532D] mb-1.5 line-clamp-1">{church.name}</h4>
                          <p className="text-base text-[#3D532D]/70 mb-2.5 line-clamp-1">{church.address}</p>
                          <div className="text-sm font-semibold text-brand flex items-center gap-1.5">
                            <MapPin size={12} /> {church.distance.toFixed(1)} km away
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md border border-[#3D532D]/10 rounded-lg text-center">
                        <AlertCircle className="text-[#3D532D]/40 w-8 h-8 mb-3" />
                        <p className="font-serif text-[#3D532D] mb-1">No churches found</p>
                        <p className="text-sm text-[#3D532D]/60">Try expanding the search radius or searching a nearby area</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Map */}
                <div className="lg:col-span-1 space-y-3">
                  {mapStatus === "unavailable" && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold">Map unavailable. The church list still works.</p>
                          <p className="mt-1 text-amber-800/80">
                            {mapError || "Authorize this site URL on your Google Maps browser key to restore the map."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="h-100 lg:h-150 rounded-lg overflow-hidden border border-[#3D532D]/10 shadow-lg">
                    <ChurchMap
                      apiKey={mapsApiKey}
                      userLocation={userLocation}
                      churches={churches}
                      selectedChurchId={selectedChurchId}
                      onChurchSelect={setSelectedChurchId}
                      onMapStatusChange={handleMapStatusChange}
                      isLoading={isFetching}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

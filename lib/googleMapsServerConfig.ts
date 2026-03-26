const usesReferrerRestrictedKey = (errorMessage: string) =>
  errorMessage.includes(
    "API keys with referer restrictions cannot be used with this API"
  );

const apiNotEnabledOnProject = (errorMessage: string) =>
  errorMessage.includes("This API project is not authorized to use this API");

const invalidApiKey = (errorMessage: string) =>
  errorMessage.includes("The provided API key is invalid") ||
  errorMessage.includes("API key not valid");

export const getMissingGoogleMapsServerKeyDetails = (serviceName: string) =>
  `Search is unavailable because GOOGLE_MAPS_SERVER_API_KEY is not configured for ${serviceName}. Add a separate server-side key in your env and restart the Next.js dev server.`;

export const getGoogleMapsServerRequestDeniedDetails = (
  serviceName: string,
  errorMessage?: string
) => {
  const normalizedError = errorMessage || "";

  if (usesReferrerRestrictedKey(normalizedError)) {
    return `GOOGLE_MAPS_SERVER_API_KEY for ${serviceName} is still using browser referrer restrictions. Create a separate server-side key without HTTP referrer restrictions and enable the required Google Maps APIs on it.`;
  }

  if (apiNotEnabledOnProject(normalizedError)) {
    return `Enable ${serviceName} in Google Cloud Console for GOOGLE_MAPS_SERVER_API_KEY, then restart the search flow.`;
  }

  if (invalidApiKey(normalizedError)) {
    return `GOOGLE_MAPS_SERVER_API_KEY for ${serviceName} is invalid. Replace it with a valid server-side Google Maps key.`;
  }

  return (
    normalizedError ||
    `Google rejected GOOGLE_MAPS_SERVER_API_KEY for ${serviceName}. Verify the key type, enabled APIs, and any server-side restrictions.`
  );
};

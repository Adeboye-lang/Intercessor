export const FOOTER_DISCLAIMER_KEY = "disclaimer_footer";
export const LEGAL_PRIVACY_POLICY_KEY = "legal_privacy_policy";
export const LEGAL_TERMS_OF_SERVICE_KEY = "legal_terms_of_service";

export const MANAGED_SITE_SETTING_PREFIXES = ["disclaimer_", "legal_"] as const;

export const MANAGED_SITE_SETTING_KEY_OPTIONS = [
  FOOTER_DISCLAIMER_KEY,
  LEGAL_PRIVACY_POLICY_KEY,
  LEGAL_TERMS_OF_SERVICE_KEY,
] as const;

export const LEGACY_PUBLIC_DISCLAIMER =
  "disclaimer: intercessor is a platform for spiritual exploration and community gathering. content provided is for informational and spiritual purposes and is not intended to replace professional theological, counselling, or mental health services.";

export const DEFAULT_PUBLIC_DISCLAIMER =
  "Intercessor is not affiliated with any of the artists, authors, churches or events displayed. All content is for information purposes only and we do not hold any IP rights to the resources provided.";

export function resolvePublicDisclaimer(value?: string | null) {
  const trimmedValue = value?.trim();

  if (trimmedValue === LEGACY_PUBLIC_DISCLAIMER) {
    return DEFAULT_PUBLIC_DISCLAIMER;
  }

  return trimmedValue && trimmedValue.length > 0
    ? trimmedValue
    : DEFAULT_PUBLIC_DISCLAIMER;
}

export function hasPublishedSiteContent(value?: string | null) {
  return Boolean(value?.trim());
}

export function isManagedSiteSettingKey(key: string) {
  return MANAGED_SITE_SETTING_PREFIXES.some((prefix) => key.startsWith(prefix));
}

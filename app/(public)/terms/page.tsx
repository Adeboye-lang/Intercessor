import { notFound } from "next/navigation";
import { getDisclaimer } from "@/app/actions/disclaimers";
import LegalDocumentPage from "@/components/LegalDocumentPage";
import {
  LEGAL_TERMS_OF_SERVICE_KEY,
  hasPublishedSiteContent,
} from "@/lib/public-site-content";

export const dynamic = "force-dynamic";

export default async function TermsOfServicePage() {
  const termsOfService = await getDisclaimer(LEGAL_TERMS_OF_SERVICE_KEY);

  if (!hasPublishedSiteContent(termsOfService?.value)) {
    notFound();
  }

  return (
    <LegalDocumentPage
      title="Terms of Service"
      content={termsOfService!.value}
    />
  );
}

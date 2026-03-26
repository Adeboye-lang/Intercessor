import { notFound } from "next/navigation";
import { getDisclaimer } from "@/app/actions/disclaimers";
import LegalDocumentPage from "@/components/LegalDocumentPage";
import {
  LEGAL_PRIVACY_POLICY_KEY,
  hasPublishedSiteContent,
} from "@/lib/public-site-content";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await getDisclaimer(LEGAL_PRIVACY_POLICY_KEY);

  if (!hasPublishedSiteContent(privacyPolicy?.value)) {
    notFound();
  }

  return (
    <LegalDocumentPage
      title="Privacy Policy"
      content={privacyPolicy!.value}
    />
  );
}

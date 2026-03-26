import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getDisclaimer } from "@/app/actions/disclaimers";
import {
  FOOTER_DISCLAIMER_KEY,
  LEGAL_PRIVACY_POLICY_KEY,
  LEGAL_TERMS_OF_SERVICE_KEY,
  hasPublishedSiteContent,
} from "@/lib/public-site-content";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerDisclaimerData, privacyPolicyData, termsOfServiceData] = await Promise.all([
    getDisclaimer(FOOTER_DISCLAIMER_KEY),
    getDisclaimer(LEGAL_PRIVACY_POLICY_KEY),
    getDisclaimer(LEGAL_TERMS_OF_SERVICE_KEY),
  ]);
  const footerDisclaimer = footerDisclaimerData?.value || null;
  const legalLinks = [
    hasPublishedSiteContent(privacyPolicyData?.value)
      ? { href: "/privacy", label: "Privacy Policy" }
      : null,
    hasPublishedSiteContent(termsOfServiceData?.value)
      ? { href: "/terms", label: "Terms of Service" }
      : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF9F6]">
      <div className="fixed inset-0 pointer-events-none z-0 bg-sacred-grid opacity-50 block" />

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-grow pt-[100px] md:pt-[120px] flex flex-col w-full">
          {children}
        </main>
        <Footer footerDisclaimer={footerDisclaimer} legalLinks={legalLinks} />
      </div>
    </div>
  );
}

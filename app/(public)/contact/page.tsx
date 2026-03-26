import { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | INTERCESSOR - Connect with Our Ministry",
  description: "Get in touch with INTERCESSOR. Submit prayer requests, partnership inquiries, or general questions. We're here to listen and respond to your spiritual needs.",
  keywords: ["contact", "prayer requests", "ministry inquiry", "partnership", "intercessor"],
  openGraph: {
    title: "Connect with INTERCESSOR",
    description: "Reach out to our ministry with your prayer requests, questions, or partnership opportunities.",
    url: "https://intercessor.uk/contact",
    type: "website",
    siteName: "INTERCESSOR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact INTERCESSOR - Prayer & Ministry Connection",
    description: "Get in touch with INTERCESSOR. Submit prayer requests, inquiry or general questions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://intercessor.uk/contact",
  },
};

export default async function ContactPage() {
  return (
    <>
      {/* Structured Data for Contact Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "INTERCESSOR Contact",
            "description": "Contact INTERCESSOR ministry",
            "url": "https://intercessor.uk/contact",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "contact@intercessor.uk",
              "availableLanguage": "en"
            },
            "publisher": {
              "@type": "Organization",
              "name": "INTERCESSOR",
              "url": "https://intercessor.uk"
            }
          })
        }}
      />
      <ContactClient />
    </>
  );
}

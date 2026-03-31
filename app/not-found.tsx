import Link from "next/link";
import { Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found | INTERCESSOR",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg text-[#3D532D] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
            <Search size={32} className="text-brand" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4">404</h1>
        <p className="text-xl font-serif text-[#3D532D]/80 mb-2">Page Not Found</p>
        <p className="text-sm text-[#3D532D]/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#3D532D] text-brand-bg rounded-lg font-semibold hover:bg-[#2A3A1F] transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/resources"
            className="px-6 py-3 bg-brand text-[#3D532D] rounded-lg font-semibold hover:bg-[#B8934A] transition-colors"
          >
            Browse Resources
          </Link>
        </div>
      </div>
    </div>
  );
}

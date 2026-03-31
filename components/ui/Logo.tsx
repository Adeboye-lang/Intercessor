import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light"; // "dark" for light backgrounds (Navbar), "light" for dark backgrounds (Footer)
  onClick?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Logo({ className = "", variant = "dark", onClick }: LogoProps) {
  // We apply the className (which usually contains h-12 or h-7) to a wrapper 
  // so the image scales correctly without overflowing or distorting.
  return (
    <div 
      className={`flex items-center z-10 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Image 
        src="/Logo.JPG" 
        alt="Intercessor Logo" 
        width={400} 
        height={120} 
        priority
        className="h-full w-auto object-contain" 
      />
    </div>
  );
}

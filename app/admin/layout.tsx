import { ReactNode } from "react";
import { Providers } from "../providers";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Providers>{children}</Providers>;
}

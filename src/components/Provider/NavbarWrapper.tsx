"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/site/Navbar/Navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return null;
  }

  return <Navbar />;
}

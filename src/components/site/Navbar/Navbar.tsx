"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/user.service";
import { ThemeToggle } from "../Shared/ThemeToggle";
import { UserMenu } from "../Shared/UserMenu";
import { MobileMenu } from "./MobileMenu";
import { NAV_CONFIG } from "@/config/nav.config";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll Animations: Shrink and darken on scroll
  const navScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const role = (session?.user?.role as UserRole) || "user";
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.user || [];

  return (
    <motion.header
      style={{ scale: navScale }}
      className="fixed top-4 inset-x-0 mx-auto z-50 w-[95%] max-w-7xl rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 pointer-events-none"
    >
      <motion.div
        style={{ opacity: navOpacity }}
        className="absolute inset-0 bg-[var(--nav-bg-scroll)] rounded-full -z-10"
      />
      <div className="px-6 h-16 flex items-center justify-between pointer-events-auto relative z-10">
        {/* Logo with Shimmer */}
        <Link href="/" className="relative group flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />

          <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground/50 to-foreground bg-size-[200%_auto] animate-shimmer">
            RACOFLOW
          </span>
        </Link>

        {/* Desktop Navigation - Sliding Pill */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-cyan-500"
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {status === "unauthenticated" ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth" className="text-sm font-medium">
                Login
              </Link>
              <Button className="relative group rounded-full bg-cyan-500 text-midnight font-bold overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-white"
                />
              </Button>
            </div>
          ) : (
            <UserMenu user={session?.user} role={role} />
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && <MobileMenu navItems={navItems} setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </motion.header>
  );
}

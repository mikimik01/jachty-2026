"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Menu, X, Ship, Users, DollarSign, CreditCard, Megaphone, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/use-data";

const allNavItems = [
  { href: "/", label: "Start", icon: Ship, id: "home" },
  { href: "/lodki", label: "Łódki", icon: Users, id: "show_boats" },
  { href: "/koszty", label: "Koszty", icon: DollarSign, id: "show_costs" },
  { href: "/wplaty", label: "Wpłaty", icon: CreditCard, id: "show_payments" },
  { href: "/ogloszenia", label: "Ogłoszenia", icon: Megaphone, id: "show_announcements" },
  { href: "/ankieta", label: "Ankieta", icon: ClipboardList, id: "show_survey" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data } = useData();

  const cfg = data?.tripConfig;
  const navItems = allNavItems.filter((item) => {
    if (item.id === "home") return true;
    if (!cfg) return true; // Show all by default if no config
    return cfg[item.id as keyof typeof cfg] !== false;
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      window.location.href = "/login";
    } catch {
      // ignore
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Anchor className="h-7 w-7 text-primary" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">Jachty 2026</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/40 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Wyloguj
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

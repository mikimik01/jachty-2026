"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Ship, Anchor, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { WaveDecoration, FadeIn, SectionHeader } from "@/components/shared";
import { useData } from "@/lib/use-data";

const highlights = [
  {
    icon: Ship,
    title: "3 Jachty",
    description: "Antila 33.3 – komfortowe żaglówki na Mazury",
  },
  {
    icon: Users,
    title: "27 Osób",
    description: "Ekipa marzeń – 9 osób na każdej łódce",
  },
  {
    icon: Calendar,
    title: "Tydzień",
    description: "8–15 sierpnia 2026, od soboty do soboty",
  },
  {
    icon: MapPin,
    title: "Mazury",
    description: "Kraina Tysiąca Jezior – najlepsze wody w Polsce",
  },
];

export default function HomePage() {
  const { data } = useData();

  const totalPerPerson = data?.totalPerPerson ?? 0;
  const boatCount = data?.boats.length || data?.tripConfig?.boat_count || 3;
  const totalPeople = data?.tripConfig?.total_people || 27;
  const costs = data?.costs ?? [];

  const refundablePerPerson = costs.filter((c) => c.is_refundable).reduce((s, c) => s + c.per_person, 0);
  const nonRefundablePerPerson = totalPerPerson - refundablePerPerson;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] text-6xl opacity-10"
          >
            ⛵
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-[15%] text-5xl opacity-10"
          >
            🌊
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-[20%] text-4xl opacity-10"
          >
            ⚓
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-60 right-[30%] text-3xl opacity-10"
          >
            🧭
          </motion.div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Anchor className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
              <span className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground uppercase tracking-[0.3em]">
                Sierpień 2026
              </span>
              <Anchor className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <span className="text-gradient">Jachty 2026</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto px-2">
              {boatCount} jachty. {totalPeople} osoby. Tydzień na Mazurach.
              <br />
              <span className="text-primary font-semibold">
                Rejs, którego nie zapomnisz.
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="my-12"
          >
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">
              Odpływamy za
            </p>
            <Countdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/lodki">
              <Button size="lg" className="gap-2 text-base px-8">
                <Users className="h-5 w-5" />
                Zobacz załogi
              </Button>
            </Link>
            <Link href="/wplaty">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                <span>💸</span>
                Wpłać kasę
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
          </motion.div>
        </motion.div>

        <WaveDecoration />
      </section>

      {/* Highlights */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Co nas czeka"
            subtitle="Tydzień pełen przygód na najpiękniejszych jeziorach Polski"
            emoji="🗺️"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="W skrócie" emoji="📊" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn delay={0}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
                <p className="text-4xl font-bold text-gradient mb-2">
                  {nonRefundablePerPerson > 0 ? `${nonRefundablePerPerson.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł` : "—"}
                </p>
                <p className="text-muted-foreground">Koszt na osobę</p>
                {refundablePerPerson > 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    + {refundablePerPerson.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł kaucja zwrotna 🔄
                  </p>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
                <p className="text-4xl font-bold text-gradient mb-2">{boatCount}</p>
                <p className="text-muted-foreground">Antile 33.3</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
                <p className="text-4xl font-bold text-gradient mb-2">7</p>
                <p className="text-muted-foreground">Dni na wodzie</p>
              </div>
            </FadeIn>
          </div>

          {costs.length > 0 && (
            <FadeIn delay={0.3}>
              <div className="mt-8 p-6 rounded-2xl bg-card border border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {costs.slice(0, 6).map((cost) => (
                    <div key={cost.id} className="flex items-center gap-3">
                      <span className="text-2xl">{cost.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{cost.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cost.per_person.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł/os
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Packing */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center border border-border/50 rounded-3xl p-8 sm:p-12 bg-card relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none">🎒</div>
          <SectionHeader 
            title="Co spakować?" 
            subtitle="Pakowanie na jacht zawsze sprawiało wszystkim problemy, więc w tym roku przygotowaliśmy interaktywną checklistę co zabrać (i czego absolutnie NIE brać)." 
            emoji="🎒" 
          />
          <FadeIn delay={0.2}>
            <Link href="/co-spakowac">
              <Button size="lg" className="mt-4 gap-2 text-base px-8 h-14 rounded-full hover:scale-105 transition-transform">
                Otwórz listę pakowania
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Gotowy na przygodę?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Sprawdź szczegóły, wpłać kasę i szykuj się na rejs życia! 🚀
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/koszty">
                <Button size="lg" variant="outline" className="gap-2">
                  📋 Szczegóły kosztów
                </Button>
              </Link>
              <Link href="/ogloszenia">
                <Button size="lg" variant="outline" className="gap-2">
                  📢 Ogłoszenia
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

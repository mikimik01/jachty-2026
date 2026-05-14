"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Backpack, Sun, Moon, Shirt, Droplets, Zap, ShieldAlert, CheckCircle2, Circle, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader, FadeIn } from "@/components/shared";

const packingList = [
  {
    category: "Absolutne podstawy",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-500/10",
    items: [
      "MIĘKKA torba podróżna lub plecak bez stelaża (żadnych walizek na kółkach - nie ma na nie miejsca i rysują pokład!)",
      "Dowód osobisty / legitymacja",
      "Patent żeglarski (jeśli posiadasz)",
      "Gotówka (na Mazurach w mniejszych portach nie wszędzie można płacić kartą)",
    ],
  },
  {
    category: "Ubrania (na cebulkę)",
    icon: Shirt,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    items: [
      "Kurtka przeciwdeszczowa i wiatroszczelna (sztormiak)",
      "Ciepły polar lub gruba bluza (wieczory na wodzie bywają chłodne)",
      "Długie spodnie (najlepiej dresowe lub szybkoschnące, nie jeansy)",
      "Krótkie spodenki, t-shirty, koszulki na ramiączkach",
      "Bielizna na zmianę",
      "Strój kąpielowy / kąpielówki",
    ],
  },
  {
    category: "Obuwie",
    icon: Droplets,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    items: [
      "Buty jakieś fajne",
      "Klapki (pod prysznic w marinie)",
      "Sandały lub buty do wody (opcjonalnie)",
    ],
  },
  {
    category: "Ochrona przed słońcem i owadami",
    icon: Sun,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    items: [
      "Okulary przeciwsłoneczne",
      "Czapka z daszkiem lub kapelusz (bardzo ważne!)",
      "Krem z filtrem (min. SPF 30 lub 50)",
      "Dobry spray na komary i kleszcze",
    ],
  },
  {
    category: "Spanie i higiena",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    items: [
      "Śpiwór",
      "Mała poduszka (tzw. jasiek)",
      "Ręcznik (najlepiej z mikrofibry - szybkoschnący i mało zajmuje)",
      "Kosmetyki w małych opakowaniach (żel pod prysznic, szampon, szczoteczka, pasta)",
      "Osobiste leki stałe",
    ],
  },
  {
    category: "Przydatne gadżety",
    icon: Zap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    items: [
      "Powerbank (kabel do ładowania telefonu)",
      "Latarka (najlepiej czołówka - przydaje się w nocy)",
      "Rękawiczki żeglarskie (w chuj opcjonalne, zle spoko)",
      "Zatyczki do uszu (TO JEST MUST HAVE - Mateusz chrapie 😉)",
      "Karty do gry, planszówki, gitara - W CHUJ WAŻNE",
    ],
  },
];

export default function PackingPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jachty2026-packing");
      if (saved) setChecked(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleItem = (item: string) => {
    const next = new Set(checked);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    
    setChecked(next);
    try {
      localStorage.setItem("jachty2026-packing", JSON.stringify(Array.from(next)));
    } catch {}
  };

  const handleShare = async () => {
    const lines = packingList.map((sec) => {
      const itemsText = sec.items.map((i) => {
        const mark = checked.has(i) ? "[x]" : "[ ]";
        return `${mark} ${i}`;
      }).join("\n");
      return `\n=== ${sec.category} ===\n${itemsText}`;
    }).join("\n");

    const fullText = `⛵ Lista pakowania na rejs - Jachty 2026 ⛵\n${lines}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Co zabrać - Jachty 2026",
          text: fullText,
        });
      } catch (e) {
        // user cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullText);
        alert("Skopiowano listę do schowka! Możesz ją wkleić w notatniku.");
      } catch (e) {
        alert("Nie udało się skopiować.");
      }
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Co spakować?"
          subtitle="Lista rzeczy, które przydadzą się na jachcie - wyeksportuj to do notatek (imo fajne w chuj - Justyna Kowalczyk)"
          emoji="🎒"
        />

        <div className="flex justify-end mt-4 px-2">
          <Button onClick={handleShare} variant="outline" className="gap-2 text-sm rounded-full">
            <Share2 className="h-4 w-4" />
            Eksportuj do notatek
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {packingList.map((section, idx) => (
            <FadeIn key={section.category} delay={idx * 0.1}>
              <Card className="border-border/50 h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.bg}`}>
                      <section.icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => {
                      const isChecked = checked.has(item);
                      return (
                        <li 
                          key={i} 
                          onClick={() => toggleItem(item)}
                          className={`flex items-start gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg transition-colors hover:bg-muted/50 ${isChecked ? "opacity-60" : ""}`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
                          ) : (
                            <Circle className={`h-5 w-5 shrink-0 mt-0.5 text-muted-foreground group-hover:${section.color}`} />
                          )}
                          <span className={`text-sm leading-relaxed transition-all ${isChecked ? "line-through text-muted-foreground" : "text-foreground/90"}`}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6}>
          <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
              <Backpack className="h-6 w-6 text-primary" />
              Złota zasada pakowania
            </h3>
            <p className="text-muted-foreground">
              Jachty mają to do siebie, że jest na nich bardzo mało miejsca. Weź tylko to, co naprawdę będzie Ci potrzebne. I co najważniejsze – <strong>spakuj to w miękką torbę</strong>. Twarde walizki nie dają się upchnąć w bakistach (schowkach)!
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

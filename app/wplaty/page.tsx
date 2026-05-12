"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SectionHeader, FadeIn } from "@/components/shared";
import {
  BOATS,
  TOTAL_PER_PERSON,
  PAYMENT_HISTORY,
  TRIP_CONFIG,
} from "@/lib/data";

export default function WplatyPage() {
  const allPeople = BOATS.flatMap((b) => b.crew);
  const totalCollected = allPeople.reduce((sum, p) => sum + p.paid, 0);
  const totalNeeded = allPeople.reduce((sum, p) => sum + p.totalDue, 0);
  const overallProgress = Math.round((totalCollected / totalNeeded) * 100);

  const paidFull = allPeople.filter((p) => p.paid >= p.totalDue).length;
  const paidPartial = allPeople.filter(
    (p) => p.paid > 0 && p.paid < p.totalDue
  ).length;
  const paidNothing = allPeople.filter((p) => p.paid === 0).length;

  const confettiFired = useRef(false);

  const fireConfetti = useCallback(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1e3a5f", "#3b82f6", "#f59e0b", "#10b981"],
    });
  }, []);

  useEffect(() => {
    if (overallProgress >= 100) {
      fireConfetti();
    }
  }, [overallProgress, fireConfetti]);

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Wpłaty"
          subtitle="Śledź wpłaty w czasie rzeczywistym – widzisz kto wpłacił i ile brakuje"
          emoji="💸"
        />

        {/* Overall progress */}
        <FadeIn>
          <Card className="mb-8 border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                    Zebrano łącznie
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-gradient">
                    {totalCollected.toLocaleString("pl-PL")} zł
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    z {totalNeeded.toLocaleString("pl-PL")} zł potrzebnych
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-bold text-gradient">
                    {overallProgress}%
                  </p>
                </div>
              </div>
              <Progress value={overallProgress} className="h-4" />
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-2xl font-bold">{paidFull}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Wpłacone w całości</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="text-2xl font-bold">{paidPartial}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Częściowo wpłacone</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-2xl font-bold">{paidNothing}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Brak wpłaty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Per-person status */}
        <FadeIn delay={0.2}>
          <Card className="mb-8 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6 text-lg">Status wpłat</h3>

              <div className="space-y-3">
                {allPeople
                  .sort((a, b) => b.paid / b.totalDue - a.paid / a.totalDue)
                  .map((person, i) => {
                    const progress = Math.round(
                      (person.paid / person.totalDue) * 100
                    );
                    const remaining = person.totalDue - person.paid;
                    const isPaid = remaining <= 0;

                    return (
                      <motion.div
                        key={person.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                      >
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : person.paid > 0
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {person.name.charAt(0)}
                        </div>

                        {/* Name + progress */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">{person.name}</p>
                            <p className="text-sm font-medium">
                              {person.paid.toLocaleString("pl-PL")} /{" "}
                              {person.totalDue.toLocaleString("pl-PL")} zł
                            </p>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>

                        {/* Status badge */}
                        <Badge
                          className={`shrink-0 text-xs ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200"
                              : person.paid > 0
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                          }`}
                        >
                          {isPaid
                            ? "✓ OK"
                            : `-${remaining.toLocaleString("pl-PL")} zł`}
                        </Badge>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Payment info */}
        <FadeIn delay={0.3}>
          <Card className="mb-8 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">🏦 Dane do przelewu</h3>
              <div className="p-4 rounded-xl bg-muted/50 font-mono text-sm space-y-2">
                <p><span className="text-muted-foreground">Odbiorca:</span> Mikołaj Kmieciak</p>
                <p><span className="text-muted-foreground">Nr konta:</span> XX XXXX XXXX XXXX XXXX XXXX XXXX</p>
                <p><span className="text-muted-foreground">Tytuł:</span> Jachty 2026 - [Twoje imię i nazwisko]</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Po dokonaniu przelewu daj znać na grupie – zaktualizuję status wpłaty.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Recent payments */}
        <FadeIn delay={0.4}>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">📜 Ostatnie wpłaty</h3>
              <div className="space-y-3">
                {PAYMENT_HISTORY.sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ).map((payment, i) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {payment.personName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.date}
                          {payment.note && ` · ${payment.note}`}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{payment.amount.toLocaleString("pl-PL")} zł
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionHeader, FadeIn } from "@/components/shared";
import { COSTS, TOTAL_PER_PERSON, TRIP_CONFIG } from "@/lib/data";

export default function KosztyPage() {
  const totalAll = COSTS.reduce((sum, c) => sum + c.totalCost, 0);

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Koszty"
          subtitle="Przejrzysty podział kosztów – widzisz za co płacisz"
          emoji="💰"
        />

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <FadeIn delay={0}>
            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-gradient">
                  {TOTAL_PER_PERSON.toLocaleString("pl-PL")} zł
                </p>
                <p className="text-sm text-muted-foreground mt-1">Na osobę</p>
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-gradient">
                  {totalAll.toLocaleString("pl-PL")} zł
                </p>
                <p className="text-sm text-muted-foreground mt-1">Łącznie za 3 jachty</p>
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-gradient">
                  {TRIP_CONFIG.totalPeople}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Osób dzieli koszty</p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Cost breakdown */}
        <FadeIn delay={0.3}>
          <Card className="border-border/50 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Podział kosztów</h3>

              <div className="space-y-1">
                {COSTS.map((cost, i) => {
                  const percentage = Math.round(
                    (cost.perPerson / TOTAL_PER_PERSON) * 100
                  );

                  return (
                    <motion.div
                      key={cost.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group">
                        {/* Icon */}
                        <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors shrink-0">
                          {cost.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{cost.name}</h4>
                            <p className="font-bold text-primary">
                              {cost.perPerson.toLocaleString("pl-PL")} zł
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {cost.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-primary/10 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${percentage}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="h-full bg-primary rounded-full"
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {i < COSTS.length - 1 && <Separator className="mx-4" />}
                    </motion.div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">RAZEM na osobę</p>
                    <p className="text-xs text-muted-foreground">
                      Łącznie za cały wyjazd: {totalAll.toLocaleString("pl-PL")} zł
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-gradient">
                    {TOTAL_PER_PERSON.toLocaleString("pl-PL")} zł
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Payment info */}
        <FadeIn delay={0.5}>
          <Card className="mt-8 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">📅 Harmonogram wpłat</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Zaliczka – 500 zł</p>
                    <p className="text-sm text-muted-foreground">
                      Do 31 maja 2026 – rezerwacja jachtów
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 dark:text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Druga rata – 600 zł</p>
                    <p className="text-sm text-muted-foreground">
                      Do 30 czerwca 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Reszta – {(TOTAL_PER_PERSON - 1100).toLocaleString("pl-PL")} zł</p>
                    <p className="text-sm text-muted-foreground">
                      Do 20 lipca 2026 – przed wyjazdem
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Note about deposit */}
        <FadeIn delay={0.6}>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
              ⚠️ Uwaga – kaucja zwrotna
            </p>
            <p className="text-amber-700 dark:text-amber-400">
              375 zł z kwoty to kaucja zwrotna. Jeśli jacht wróci w całości – dostaniesz ją z powrotem po rejsie.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

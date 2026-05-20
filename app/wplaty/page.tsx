"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader, FadeIn } from "@/components/shared";
import { useData } from "@/lib/use-data";

export default function WplatyPage() {
  const { data, loading } = useData();

  const allPeople = data?.people ?? [];
  const totalCollected = allPeople.reduce((sum, p) => sum + p.paid, 0);

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
    if (allPeople.length > 0 && allPeople.every(p => p.paid > 0)) {
      fireConfetti();
    }
  }, [allPeople, fireConfetti]);

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (data.tripConfig && data.tripConfig.show_payments === false) {
    return <div className="py-32 text-center text-muted-foreground">Ta sekcja jest aktualnie wyłączona.</div>;
  }

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
              <div className="text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                  Zebrano łącznie
                </p>
                <p className="text-4xl md:text-5xl font-bold text-gradient">
                  {totalCollected.toLocaleString("pl-PL")} zł
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  od {allPeople.filter(p => p.paid > 0).length} z {allPeople.length} osób
                </p>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Per-person status */}
        <FadeIn delay={0.2}>
          <Card className="mb-8 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6 text-lg">Wpłaty wg osób</h3>

              <div className="space-y-3">
                {allPeople
                  .sort((a, b) => b.paid - a.paid)
                  .map((person, i) => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          person.paid > 0
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {person.name.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{person.name}</p>
                      </div>

                      <span className={`font-semibold text-sm ${
                        person.paid > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}>
                        {person.paid > 0
                          ? `${person.paid.toLocaleString("pl-PL")} zł`
                          : "—"}
                      </span>
                    </motion.div>
                  ))}
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
                {data.payments
                  .sort((a, b) =>
                    new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
                  )
                  .map((payment, i) => (
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
                            {payment.person_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.paid_at}
                            {payment.note && ` · ${payment.note}`}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +{payment.amount.toLocaleString("pl-PL")} zł
                      </p>
                    </motion.div>
                  ))}
                {data.payments.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Brak wpłat</p>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

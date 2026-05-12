"use client";

import { motion } from "framer-motion";
import { Crown, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectionHeader, FadeIn } from "@/components/shared";
import { BOATS, TOTAL_PER_PERSON } from "@/lib/data";

export default function LodkiPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Załogi"
          subtitle="3 jachty, 24 żeglarzy – sprawdź kto płynie na Twojej łódce"
          emoji="⛵"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {BOATS.map((boat, boatIndex) => {
            const totalPaid = boat.crew.reduce((sum, p) => sum + p.paid, 0);
            const totalDue = boat.crew.reduce((sum, p) => sum + p.totalDue, 0);
            const progressPercent = Math.round((totalPaid / totalDue) * 100);

            return (
              <FadeIn key={boat.id} delay={boatIndex * 0.15}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-shadow">
                    {/* Boat header */}
                    <div className={`bg-gradient-to-r ${boat.color} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl mb-1">{boat.emoji}</p>
                          <h3 className="text-2xl font-bold">{boat.name}</h3>
                          <p className="text-white/80 text-sm">{boat.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{boat.crew.length}</p>
                          <p className="text-white/80 text-sm">/{boat.maxCrew} osób</p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Crew payment progress */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Wpłaty załogi</span>
                          <span className="font-medium">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalPaid.toLocaleString("pl-PL")} / {totalDue.toLocaleString("pl-PL")} zł
                        </p>
                      </div>

                      {/* Crew list */}
                      <div className="space-y-3">
                        {boat.crew.map((person, i) => {
                          const personProgress = Math.round(
                            (person.paid / person.totalDue) * 100
                          );
                          const isPaid = person.paid >= person.totalDue;

                          return (
                            <motion.div
                              key={person.id}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-3"
                            >
                              {/* Avatar */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                person.isCaptain
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-primary/10 text-primary"
                              }`}>
                                {person.isCaptain ? (
                                  <Crown className="h-5 w-5" />
                                ) : (
                                  person.name.charAt(0)
                                )}
                              </div>

                              {/* Name + role */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm truncate">
                                    {person.name}
                                  </p>
                                  {person.isCaptain && (
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                      Kapitan
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Progress
                                    value={personProgress}
                                    className="h-1 flex-1"
                                  />
                                  <span className="text-xs text-muted-foreground w-8 text-right">
                                    {personProgress}%
                                  </span>
                                </div>
                              </div>

                              {/* Status */}
                              <Badge
                                variant={isPaid ? "default" : "outline"}
                                className={`text-xs shrink-0 ${
                                  isPaid
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200"
                                    : ""
                                }`}
                              >
                                {isPaid ? "✓" : `${person.paid.toLocaleString("pl-PL")} zł`}
                              </Badge>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Empty slots */}
                      {boat.crew.length < boat.maxCrew && (
                        <div className="mt-3 space-y-2">
                          {Array.from({ length: boat.maxCrew - boat.crew.length }).map(
                            (_, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 opacity-40"
                              >
                                <div className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                                  <User className="h-4 w-4" />
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                  Wolne miejsce
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>

        {/* Legend */}
        <FadeIn delay={0.5}>
          <div className="mt-12 p-6 rounded-2xl bg-card border border-border/50 max-w-lg mx-auto">
            <h3 className="font-semibold mb-3 text-center">Legenda</h3>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-600" />
                <span>Kapitan</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">✓</Badge>
                <span>Wpłacone</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">500 zł</Badge>
                <span>Częściowo</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Pin, Info, AlertTriangle, PartyPopper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader, FadeIn } from "@/components/shared";
import { ANNOUNCEMENTS } from "@/lib/data";

const typeConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800/30",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800/30",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    iconColor: "text-amber-500",
  },
  success: {
    icon: PartyPopper,
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800/30",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    iconColor: "text-emerald-500",
  },
};

export default function OgloszeniaPage() {
  const sorted = [...ANNOUNCEMENTS].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          title="Ogłoszenia"
          subtitle="Najważniejsze info o rejsie – bądź na bieżąco!"
          emoji="📢"
        />

        <div className="space-y-6">
          {sorted.map((ann, i) => {
            const config = typeConfig[ann.type];
            const Icon = config.icon;

            return (
              <FadeIn key={ann.id} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Card
                    className={`${config.bg} ${config.border} border overflow-hidden ${
                      ann.pinned ? "ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.badge}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg leading-tight">
                              {ann.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {ann.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ·
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(ann.date).toLocaleDateString("pl-PL", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {ann.pinned && (
                          <Badge
                            variant="outline"
                            className="shrink-0 gap-1 text-xs"
                          >
                            <Pin className="h-3 w-3" />
                            Przypięte
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-sm leading-relaxed text-foreground/80 ml-13 pl-[52px]">
                        {ann.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>

        {/* Empty state hint */}
        <FadeIn delay={0.5}>
          <div className="mt-12 text-center text-muted-foreground text-sm">
            <p>Nowe ogłoszenia będą pojawiać się tutaj na bieżąco.</p>
            <p className="mt-1">Obserwuj tę stronę! 👀</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

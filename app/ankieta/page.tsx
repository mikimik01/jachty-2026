"use client";

import { SectionHeader, FadeIn } from "@/components/shared";
import { useData } from "@/lib/use-data";
import { RefreshCw } from "lucide-react";

export default function AnkietaPage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (data.tripConfig && data.tripConfig.show_survey === false) {
    return <div className="py-32 text-center text-muted-foreground">Ta sekcja jest aktualnie wyłączona.</div>;
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Ankieta"
          subtitle="Wybierz termin, który Ci najbardziej pasuje"
          emoji="📋"
        />

        <FadeIn>
          <div className="rounded-2xl overflow-hidden border border-border/50 bg-card -mx-4 sm:mx-0">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSebGtuYvxdq3zSFLqdWewLNIPWPZS-EaTRLARKTcKZYn0MzbA/viewform?embedded=true"
              width="100%"
              height="2500"
              className="w-full border-0"
              title="Ankieta – wybór terminu"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

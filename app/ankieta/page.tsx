"use client";

import { SectionHeader, FadeIn } from "@/components/shared";

export default function AnkietaPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Ankieta"
          subtitle="Wybierz termin, który Ci najbardziej pasuje"
          emoji="📋"
        />

        <FadeIn>
          <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSebGtuYvxdq3zSFLqdWewLNIPWPZS-EaTRLARKTcKZYn0MzbA/viewform?embedded=true"
              width="100%"
              height="800"
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

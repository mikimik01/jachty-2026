"use client";

import { motion } from "framer-motion";

export function WaveDecoration() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
      <div className="relative w-[200%] h-24">
        <svg
          className="absolute bottom-0 w-full h-full wave-animation opacity-30"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,30 1440,50 L1440,120 L0,120 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
        <svg
          className="absolute bottom-0 w-full h-full wave-animation-slow opacity-20"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,20 480,100 720,40 C960,0 1200,80 1440,30 L1440,120 L0,120 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  emoji,
}: {
  title: string;
  subtitle?: string;
  emoji?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      {emoji && <span className="text-5xl mb-4 block">{emoji}</span>}
      <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-primary/5 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground text-sm">
          ⛵ Jachty 2026 &middot; Mazury &middot; Sierpień 2026
        </p>
        <p className="text-muted-foreground/60 text-xs mt-2">
          Made with ❤️ for the crew
        </p>
      </div>
    </footer>
  );
}

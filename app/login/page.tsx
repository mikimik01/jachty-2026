"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Lock, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error || "Złe hasło.");
        setPassword("");
      }
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-primary/5 via-background to-background">
      <Card className="w-full max-w-sm border-border/50 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⛵</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient">Jachty 2026</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Podaj hasło żeby wejść na stronę rejsu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={!password || loading}
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Wchodzę..." : "Wejdź na stronę"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Hasło dostaniesz od organizatora rejsu 🏴‍☠️
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

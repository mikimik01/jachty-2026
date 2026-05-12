"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Megaphone,
  Settings,
  Plus,
  Save,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SectionHeader, FadeIn } from "@/components/shared";
import { BOATS, ANNOUNCEMENTS, TOTAL_PER_PERSON, PAYMENT_HISTORY } from "@/lib/data";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annType, setAnnType] = useState<"info" | "warning" | "success">("info");

  const allPeople = BOATS.flatMap((b) =>
    b.crew.map((p) => ({ ...p, boatName: b.name }))
  );

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Panel admina"
          subtitle="Zarządzaj wpłatami, ogłoszeniami i składem załóg"
          emoji="⚙️"
        />

        <FadeIn>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="payments" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Wpłaty</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="gap-2">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Ogłoszenia</span>
              </TabsTrigger>
              <TabsTrigger value="crews" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Załogi</span>
              </TabsTrigger>
            </TabsList>

            {/* PAYMENTS TAB */}
            <TabsContent value="payments" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Dodaj wpłatę
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Osoba
                      </label>
                      <select
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Wybierz osobę...</option>
                        {allPeople.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.boatName}) – brakuje{" "}
                            {(p.totalDue - p.paid).toLocaleString("pl-PL")} zł
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Kwota (PLN)
                      </label>
                      <Input
                        type="number"
                        placeholder="np. 500"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Notatka (opcjonalnie)
                    </label>
                    <Input
                      placeholder="np. Zaliczka, Rata 2..."
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                    />
                  </div>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Zapisz wpłatę
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Demo – w wersji produkcyjnej wpłaty będą zapisywane w bazie danych (Supabase).
                  </p>
                </CardContent>
              </Card>

              {/* Recent payments */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Ostatnie wpłaty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {PAYMENT_HISTORY.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-sm"
                      >
                        <div>
                          <span className="font-medium">{p.personName}</span>
                          <span className="text-muted-foreground ml-2">
                            {p.date}
                          </span>
                          {p.note && (
                            <span className="text-muted-foreground ml-2">
                              · {p.note}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-emerald-600">
                          +{p.amount.toLocaleString("pl-PL")} zł
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANNOUNCEMENTS TAB */}
            <TabsContent value="announcements" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Nowe ogłoszenie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Tytuł
                    </label>
                    <Input
                      placeholder="np. 🎉 Termin potwierdzony!"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Treść
                    </label>
                    <Textarea
                      placeholder="Treść ogłoszenia..."
                      rows={4}
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Typ
                    </label>
                    <div className="flex gap-2">
                      {(["info", "warning", "success"] as const).map((type) => (
                        <Button
                          key={type}
                          variant={annType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAnnType(type)}
                        >
                          {type === "info" && "ℹ️ Info"}
                          {type === "warning" && "⚠️ Ważne"}
                          {type === "success" && "🎉 Super"}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button className="gap-2">
                    <Megaphone className="h-4 w-4" />
                    Opublikuj ogłoszenie
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Demo – ogłoszenia będą zapisywane w Supabase w wersji produkcyjnej.
                  </p>
                </CardContent>
              </Card>

              {/* Existing announcements */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Istniejące ogłoszenia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ANNOUNCEMENTS.map((ann) => (
                      <div
                        key={ann.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                      >
                        <div>
                          <p className="font-medium text-sm">{ann.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {ann.date} · {ann.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {ann.pinned && (
                            <Badge variant="outline" className="text-xs">
                              📌
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {ann.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CREWS TAB */}
            <TabsContent value="crews" className="space-y-6">
              {BOATS.map((boat) => (
                <Card key={boat.id} className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{boat.emoji}</span>
                      {boat.name}
                      <Badge variant="secondary" className="ml-auto">
                        {boat.crew.length}/{boat.maxCrew}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {boat.crew.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                              {person.name.charAt(0)}
                            </div>
                            <span className="font-medium">{person.name}</span>
                            {person.isCaptain && (
                              <Badge variant="secondary" className="text-xs">
                                👑 Kapitan
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            <ArrowLeftRight className="h-3 w-3" />
                            Przenieś
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <p className="text-xs text-muted-foreground text-center">
                Demo – przenoszenie osób między łódkami będzie dostępne po podłączeniu Supabase.
              </p>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
}

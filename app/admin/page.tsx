"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Megaphone,
  Plus,
  Save,
  Trash2,
  ArrowLeftRight,
  Edit2,
  X,
  Settings,
  RefreshCw,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader, FadeIn } from "@/components/shared";
import { useData, type DashboardData, type PersonData } from "@/lib/use-data";
import {
  createPerson, updatePerson, deletePerson,
  createPayment, deletePayment,
  createAnnouncement, updateAnnouncement, deleteAnnouncement,
  createCost, updateCost, deleteCost,
  createBoat, updateBoat, deleteBoat,
  updateTripConfig,
} from "@/lib/queries";

export default function AdminPage() {
  const { data, loading, error, refresh, isLive } = useData();
  const [activeTab, setActiveTab] = useState("people");
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Ładowanie danych...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-4" />
        <p className="text-muted-foreground">{error || "Nie udało się załadować danych"}</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader
            title="Panel admina"
            subtitle="Zarządzaj całym rejsem z jednego miejsca"
            emoji="⚙️"
          />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" /> Wyloguj
          </Button>
        </div>

        {!isLive && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-sm text-center">
            <p className="font-medium text-amber-800 dark:text-amber-300">
              ⚠️ Tryb demo – dane z pliku mockowego. Podłącz Supabase żeby edycje się zapisywały.
            </p>
          </div>
        )}

        <FadeIn>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
              <TabsTrigger value="people" className="gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Osoby</span>
              </TabsTrigger>
              <TabsTrigger value="boats" className="gap-1">
                <span className="text-sm">⛵</span>
                <span className="hidden sm:inline">Łódki</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Wpłaty</span>
              </TabsTrigger>
              <TabsTrigger value="costs" className="gap-1">
                <span className="text-sm">💰</span>
                <span className="hidden sm:inline">Koszty</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="gap-1">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Ustawienia</span>
              </TabsTrigger>
            </TabsList>

            {/* ─── PEOPLE TAB ─── */}
            <TabsContent value="people">
              <PeopleTab data={data} refresh={refresh} isLive={isLive} />
            </TabsContent>

            {/* ─── BOATS TAB ─── */}
            <TabsContent value="boats">
              <BoatsTab data={data} refresh={refresh} isLive={isLive} />
            </TabsContent>

            {/* ─── PAYMENTS TAB ─── */}
            <TabsContent value="payments">
              <PaymentsTab data={data} refresh={refresh} isLive={isLive} />
            </TabsContent>

            {/* ─── COSTS TAB ─── */}
            <TabsContent value="costs">
              <CostsTab data={data} refresh={refresh} isLive={isLive} />
            </TabsContent>

            {/* ─── ANNOUNCEMENTS TAB ─── */}
            <TabsContent value="announcements">
              <AnnouncementsTab data={data} refresh={refresh} isLive={isLive} />
            </TabsContent>

            {/* ─── SETTINGS TAB ─── */}
            <TabsContent value="settings">
              <SettingsTab data={data} refresh={refresh} isLive={isLive} />
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── Types ───

interface TabProps {
  data: DashboardData;
  refresh: () => Promise<void>;
  isLive: boolean;
}

// ─── PEOPLE TAB ───

function PeopleTab({ data, refresh, isLive }: TabProps) {
  const [newName, setNewName] = useState("");
  const [newBoatId, setNewBoatId] = useState("");
  const [busy, setBusy] = useState(false);
  const [payingPersonId, setPayingPersonId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");

  const handleAdd = async () => {
    if (!newName.trim() || !isLive) return;
    setBusy(true);
    try {
      await createPerson({ name: newName.trim(), boat_id: newBoatId || null });
      setNewName("");
      setNewBoatId("");
      await refresh();
    } finally {1111
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isLive || !confirm("Na pewno usunąć tę osobę?")) return;
    await deletePerson(id);
    await refresh();
  };

  const handleMove = async (personId: string, newBoatId: string | null) => {
    if (!isLive) return;
    await updatePerson(personId, { boat_id: newBoatId });
    await refresh();
  };

  const handleToggleCaptain = async (personId: string, current: boolean) => {
    if (!isLive) return;
    await updatePerson(personId, { is_captain: !current });
    await refresh();
  };

  const handleAddPayment = async (personId: string) => {
    if (!payAmount || !isLive) return;
    setBusy(true);
    try {
      await createPayment({ person_id: personId, amount: parseFloat(payAmount), note: null });
      setPayingPersonId(null);
      setPayAmount("");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add person */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Dodaj osobę
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Imię i nazwisko"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 min-w-[200px]"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <select
              value={newBoatId}
              onChange={(e) => setNewBoatId(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Bez łódki</option>
              {data.boats.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.emoji} {b.name} ({b.crew.length}/{b.max_crew})
                </option>
              ))}
            </select>
            <Button onClick={handleAdd} disabled={!newName.trim() || busy || !isLive} className="gap-2">
              <Plus className="h-4 w-4" /> Dodaj
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* People by boat */}
      {data.boats.map((boat) => (
        <Card key={boat.id} className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{boat.emoji}</span> {boat.name}
              <Badge variant="secondary" className="ml-auto">
                {boat.crew.length}/{boat.max_crew}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {boat.crew.map((person: PersonData) => (
                <div key={person.id} className="p-2 rounded-lg hover:bg-muted/30 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        person.is_captain
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {person.name.charAt(0)}
                      </div>
                      <span className="font-medium">{person.name}</span>
                      {person.is_captain && (
                        <Badge variant="secondary" className="text-xs">👑 Kapitan</Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({person.paid.toLocaleString("pl-PL")} zł)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setPayingPersonId(payingPersonId === person.id ? null : person.id); setPayAmount(""); }}
                        className="text-xs h-8 text-emerald-600 dark:text-emerald-400"
                        disabled={!isLive}
                      >
                        💸 Wpłata
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => handleToggleCaptain(person.id, person.is_captain)}
                        className="text-xs h-8"
                        disabled={!isLive}
                      >
                        {person.is_captain ? "Zdejmij kapitana" : "👑 Kapitan"}
                      </Button>
                      <select
                        value={person.boat_id ?? ""}
                        onChange={(e) => handleMove(person.id, e.target.value || null)}
                        className="h-8 px-2 rounded border border-input bg-background text-xs"
                        disabled={!isLive}
                      >
                        <option value="">Bez łódki</option>
                        {data.boats.map((b) => (
                          <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>
                        ))}
                      </select>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(person.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={!isLive}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {payingPersonId === person.id && (
                    <div className="flex items-center gap-2 pl-10">
                      <Input
                        type="number"
                        placeholder="Kwota (PLN)"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="h-8 w-32 text-xs"
                        onKeyDown={(e) => e.key === "Enter" && handleAddPayment(person.id)}
                      />
                      <Button size="sm" className="h-8 text-xs" onClick={() => handleAddPayment(person.id)} disabled={!payAmount || busy}>
                        Zapisz
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setPayingPersonId(null)}>
                        Anuluj
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {boat.crew.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Brak osób</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Unassigned */}
      {data.unassignedPeople.length > 0 && (
        <Card className="border-border/50 border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              🚶 Nieprzypisani ({data.unassignedPeople.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.unassignedPeople.map((person) => (
                <div key={person.id} className="p-2 rounded-lg hover:bg-muted/30 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{person.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({person.paid.toLocaleString("pl-PL")} zł)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setPayingPersonId(payingPersonId === person.id ? null : person.id); setPayAmount(""); }}
                        className="text-xs h-8 text-emerald-600 dark:text-emerald-400"
                        disabled={!isLive}
                      >
                        💸 Wpłata
                      </Button>
                      <select
                        value=""
                        onChange={(e) => handleMove(person.id, e.target.value || null)}
                        className="h-8 px-2 rounded border border-input bg-background text-xs"
                        disabled={!isLive}
                      >
                        <option value="">Przypisz do łódki...</option>
                        {data.boats.map((b) => (
                          <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>
                        ))}
                      </select>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(person.id)}
                        className="h-8 w-8 text-destructive"
                        disabled={!isLive}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {payingPersonId === person.id && (
                    <div className="flex items-center gap-2 pl-4">
                      <Input
                        type="number"
                        placeholder="Kwota (PLN)"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="h-8 w-32 text-xs"
                        onKeyDown={(e) => e.key === "Enter" && handleAddPayment(person.id)}
                      />
                      <Button size="sm" className="h-8 text-xs" onClick={() => handleAddPayment(person.id)} disabled={!payAmount || busy}>
                        Zapisz
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setPayingPersonId(null)}>
                        Anuluj
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── BOATS TAB ───

function BoatsTab({ data, refresh, isLive }: TabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "⛵", color: "from-blue-500 to-cyan-500", max_crew: "8" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", emoji: "", color: "", max_crew: "", model: "" });
  const [busy, setBusy] = useState(false);

  const colorOptions = [
    { value: "from-blue-500 to-cyan-500", label: "🔵 Niebieski" },
    { value: "from-emerald-500 to-teal-500", label: "🟢 Zielony" },
    { value: "from-amber-500 to-orange-500", label: "🟠 Pomarańczowy" },
    { value: "from-purple-500 to-pink-500", label: "🟣 Fioletowy" },
    { value: "from-red-500 to-rose-500", label: "🔴 Czerwony" },
  ];

  const handleAdd = async () => {
    if (!form.name.trim() || !isLive) return;
    setBusy(true);
    try {
      await createBoat({
        name: form.name.trim(),
        emoji: form.emoji,
        color: form.color,
        max_crew: parseInt(form.max_crew) || 8,
        sort_order: data.boats.length + 1,
      });
      setForm({ name: "", emoji: "⛵", color: "from-blue-500 to-cyan-500", max_crew: "8" });
      setShowAdd(false);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!isLive) return;
    setBusy(true);
    try {
      await updateBoat(id, {
        name: editForm.name.trim(),
        emoji: editForm.emoji,
        color: editForm.color,
        max_crew: parseInt(editForm.max_crew) || 8,
        model: editForm.model.trim(),
      });
      setEditId(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isLive || !confirm("Na pewno usunąć tę łódkę? Osoby zostaną odłączone.")) return;
    await deleteBoat(id);
    await refresh();
  };

  const startEdit = (boat: DashboardData["boats"][0]) => {
    setEditId(boat.id);
    setEditForm({
      name: boat.name,
      emoji: boat.emoji,
      color: boat.color,
      max_crew: String(boat.max_crew),
      model: boat.model,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="h-4 w-4" /> Nowa łódka
        </Button>
      </div>

      {showAdd && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Input placeholder="Nazwa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="w-20" />
              <select
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {colorOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <Input type="number" placeholder="Max osób" value={form.max_crew} onChange={(e) => setForm({ ...form, max_crew: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!form.name.trim() || busy} className="gap-2">
                <Save className="h-4 w-4" /> Dodaj łódkę
              </Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Anuluj</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data.boats.map((boat) => (
        <Card key={boat.id} className="border-border/50 overflow-hidden">
          {editId === boat.id ? (
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Input placeholder="Nazwa" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <Input placeholder="Model" value={editForm.model} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} />
                <Input placeholder="Emoji" value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })} className="w-20" />
                <select
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <Input type="number" placeholder="Max osób" value={editForm.max_crew} onChange={(e) => setEditForm({ ...editForm, max_crew: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleUpdate(boat.id)} disabled={busy || !editForm.name.trim()} className="gap-1">
                  <Save className="h-3 w-3" /> Zapisz
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Anuluj</Button>
              </div>
            </CardContent>
          ) : (
            <div className={`bg-gradient-to-r ${boat.color} p-4 text-white flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{boat.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold">{boat.name}</h3>
                  <p className="text-white/80 text-sm">{boat.model} · {boat.crew.length}/{boat.max_crew} osób</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="icon"
                  onClick={() => startEdit(boat)}
                  className="text-white/70 hover:text-white hover:bg-white/20"
                  disabled={!isLive}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => handleDelete(boat.id)}
                  className="text-white/70 hover:text-white hover:bg-white/20"
                  disabled={!isLive}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── PAYMENTS TAB ───

function PaymentsTab({ data, refresh, isLive }: TabProps) {
  const [personId, setPersonId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAdd = async () => {
    if (!personId || !amount || !isLive) return;
    setBusy(true);
    try {
      await createPayment({
        person_id: personId,
        amount: parseFloat(amount),
        note: note.trim() || null,
      });
      setPersonId("");
      setAmount("");
      setNote("");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isLive || !confirm("Na pewno usunąć tę wpłatę?")) return;
    await deletePayment(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Dodaj wpłatę
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Wybierz osobę...</option>
              {data.people.sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.paid.toLocaleString("pl-PL")} zł wpłacone)
                </option>
              ))}
            </select>
            <Input type="number" placeholder="Kwota (PLN)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input placeholder="Notatka (opcjonalnie)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button onClick={handleAdd} disabled={!personId || !amount || busy || !isLive} className="gap-2">
            <Save className="h-4 w-4" /> Zapisz wpłatę
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Historia wpłat ({data.payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{p.person_name.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="font-medium">{p.person_name}</span>
                    <span className="text-muted-foreground ml-2">{p.paid_at}</span>
                    {p.note && <span className="text-muted-foreground ml-2">· {p.note}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    +{p.amount.toLocaleString("pl-PL")} zł
                  </span>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => handleDelete(p.id)}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    disabled={!isLive}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {data.payments.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Brak wpłat</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── COSTS TAB ───

function CostsTab({ data, refresh, isLive }: TabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", total_cost: "", icon: "💰", description: "", is_refundable: false });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", total_cost: "", icon: "", description: "", is_refundable: false });
  const [busy, setBusy] = useState(false);

  const refundableCosts = data.costs.filter((c) => c.is_refundable);
  const nonRefundableCosts = data.costs.filter((c) => !c.is_refundable);
  const refundablePerPerson = refundableCosts.reduce((s, c) => s + c.per_person, 0);
  const nonRefundablePerPerson = nonRefundableCosts.reduce((s, c) => s + c.per_person, 0);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.total_cost || !isLive) return;
    setBusy(true);
    try {
      await createCost({
        name: form.name.trim(),
        total_cost: parseFloat(form.total_cost),
        icon: form.icon,
        description: form.description.trim(),
        is_refundable: form.is_refundable,
        sort_order: data.costs.length + 1,
      });
      setForm({ name: "", total_cost: "", icon: "💰", description: "", is_refundable: false });
      setShowAdd(false);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!isLive) return;
    setBusy(true);
    try {
      await updateCost(id, {
        name: editForm.name.trim(),
        total_cost: parseFloat(editForm.total_cost),
        icon: editForm.icon,
        description: editForm.description.trim(),
        is_refundable: editForm.is_refundable,
      });
      setEditId(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isLive || !confirm("Na pewno usunąć tę pozycję kosztów?")) return;
    await deleteCost(id);
    await refresh();
  };

  const startEdit = (cost: DashboardData["costs"][0]) => {
    setEditId(cost.id);
    setEditForm({
      name: cost.name,
      total_cost: String(cost.total_cost),
      icon: cost.icon,
      description: cost.description,
      is_refundable: cost.is_refundable,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Koszt: <span className="font-bold text-foreground">{nonRefundablePerPerson.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł</span>
            {refundablePerPerson > 0 && (
              <> + kaucja: <span className="font-bold text-amber-600 dark:text-amber-400">{refundablePerPerson.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł</span> (zwrotna)</>
            )}
            {" · "}Razem: <span className="font-bold text-foreground">{data.totalPerPerson.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł/os</span>
            {" · "}{data.boats.reduce((s, b) => s + b.max_crew, 0)} osób
          </p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="h-4 w-4" /> Nowa pozycja
        </Button>
      </div>

      {showAdd && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Input placeholder="Nazwa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input type="number" placeholder="Kwota całkowita" value={form.total_cost} onChange={(e) => setForm({ ...form, total_cost: e.target.value })} />
              <Input placeholder="Emoji" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-20" />
              <Input placeholder="Opis" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_refundable} onChange={(e) => setForm({ ...form, is_refundable: e.target.checked })} className="rounded" />
              🔄 Kaucja zwrotna
            </label>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!form.name.trim() || !form.total_cost || busy} className="gap-2">
                <Save className="h-4 w-4" /> Dodaj
              </Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Anuluj</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data.costs.map((cost) => (
        <Card key={cost.id} className={`border-border/50 ${cost.is_refundable ? "border-amber-200 dark:border-amber-800/30" : ""}`}>
          <CardContent className="p-4">
            {editId === cost.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  <Input type="number" value={editForm.total_cost} onChange={(e) => setEditForm({ ...editForm, total_cost: e.target.value })} />
                  <Input value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} className="w-20" />
                  <Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editForm.is_refundable} onChange={(e) => setEditForm({ ...editForm, is_refundable: e.target.checked })} className="rounded" />
                  🔄 Kaucja zwrotna
                </label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(cost.id)} disabled={busy} className="gap-1">
                    <Save className="h-3 w-3" /> Zapisz
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Anuluj</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cost.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{cost.name}</p>
                      {cost.is_refundable && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700">🔄 zwrotna</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{cost.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold">{cost.total_cost.toLocaleString("pl-PL")} zł</p>
                    <p className={`text-xs ${cost.is_refundable ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>{cost.per_person.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł/os</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(cost)} className="h-8 w-8" disabled={!isLive}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cost.id)} className="h-8 w-8 text-destructive" disabled={!isLive}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── ANNOUNCEMENTS TAB ───

function AnnouncementsTab({ data, refresh, isLive }: TabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "info" as "info" | "warning" | "success", pinned: false });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", type: "info" as "info" | "warning" | "success", pinned: false });
  const [busy, setBusy] = useState(false);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.content.trim() || !isLive) return;
    setBusy(true);
    try {
      await createAnnouncement({
        title: form.title.trim(),
        content: form.content.trim(),
        type: form.type,
        pinned: form.pinned,
      });
      setForm({ title: "", content: "", type: "info", pinned: false });
      setShowAdd(false);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!isLive) return;
    setBusy(true);
    try {
      await updateAnnouncement(id, {
        title: editForm.title.trim(),
        content: editForm.content.trim(),
        type: editForm.type,
        pinned: editForm.pinned,
      });
      setEditId(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isLive || !confirm("Na pewno usunąć to ogłoszenie?")) return;
    await deleteAnnouncement(id);
    await refresh();
  };

  const handleTogglePin = async (id: string, current: boolean) => {
    if (!isLive) return;
    await updateAnnouncement(id, { pinned: !current });
    await refresh();
  };

  const startEdit = (ann: DashboardData["announcements"][0]) => {
    setEditId(ann.id);
    setEditForm({
      title: ann.title,
      content: ann.content,
      type: ann.type as "info" | "warning" | "success",
      pinned: ann.pinned,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="h-4 w-4" /> Nowe ogłoszenie
        </Button>
      </div>

      {showAdd && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="p-6 space-y-4">
            <Input placeholder="Tytuł (np. 🎉 Termin potwierdzony!)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Treść ogłoszenia..." rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex gap-2">
                {(["info", "warning", "success"] as const).map((type) => (
                  <Button
                    key={type} size="sm"
                    variant={form.type === type ? "default" : "outline"}
                    onClick={() => setForm({ ...form, type })}
                  >
                    {type === "info" && "ℹ️ Info"}
                    {type === "warning" && "⚠️ Ważne"}
                    {type === "success" && "🎉 Super"}
                  </Button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="rounded" />
                📌 Przypnij
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!form.title.trim() || !form.content.trim() || busy} className="gap-2">
                <Megaphone className="h-4 w-4" /> Opublikuj
              </Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Anuluj</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data.announcements.map((ann) => (
        <Card key={ann.id} className="border-border/50">
          <CardContent className="p-4">
            {editId === ann.id ? (
              <div className="space-y-3">
                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                <Textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} rows={3} />
                <div className="flex gap-2 flex-wrap items-center">
                  {(["info", "warning", "success"] as const).map((type) => (
                    <Button key={type} size="sm" variant={editForm.type === type ? "default" : "outline"} onClick={() => setEditForm({ ...editForm, type })}>
                      {type === "info" && "ℹ️"} {type === "warning" && "⚠️"} {type === "success" && "🎉"} {type}
                    </Button>
                  ))}
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editForm.pinned} onChange={(e) => setEditForm({ ...editForm, pinned: e.target.checked })} className="rounded" />
                    📌 Przypnij
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(ann.id)} disabled={busy} className="gap-1">
                    <Save className="h-3 w-3" /> Zapisz
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Anuluj</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{ann.title}</h4>
                    {ann.pinned && <Badge variant="outline" className="text-xs">📌</Badge>}
                    <Badge variant="secondary" className="text-xs">{ann.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ann.published_at} · {ann.author}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => handleTogglePin(ann.id, ann.pinned)} className="text-xs h-8" disabled={!isLive}>
                    {ann.pinned ? "Odepnij" : "📌"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(ann)} className="h-8 w-8" disabled={!isLive}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ann.id)} className="h-8 w-8 text-destructive" disabled={!isLive}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── SETTINGS TAB ───

function SettingsTab({ data, refresh, isLive }: TabProps) {
  const [busy, setBusy] = useState(false);
  const cfg = data.tripConfig;

  // Type safe toggle
  type FlagKeys = "show_boats" | "show_costs" | "show_payments" | "show_announcements" | "show_survey";
  const handleToggle = async (key: FlagKeys, current: boolean) => {
    if (!isLive || !cfg) return;
    setBusy(true);
    try {
      await updateTripConfig(cfg.id, { [key]: !current });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (!cfg) return <p className="text-muted-foreground text-sm">Brak konfiguracji wyjazdu.</p>;

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Widoczność zakładek dla uczestników</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { id: "show_boats" as FlagKeys, label: "Łódki (/lodki)", val: cfg.show_boats },
              { id: "show_costs" as FlagKeys, label: "Koszty (/koszty)", val: cfg.show_costs },
              { id: "show_payments" as FlagKeys, label: "Wpłaty (/wplaty)", val: cfg.show_payments },
              { id: "show_announcements" as FlagKeys, label: "Ogłoszenia (/ogloszenia)", val: cfg.show_announcements },
              { id: "show_survey" as FlagKeys, label: "Ankieta (/ankieta)", val: cfg.show_survey },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                <span className="font-medium text-sm">{item.label}</span>
                <label className="flex items-center cursor-pointer gap-2">
                  <span className={`text-xs ${item.val ? "text-emerald-500" : "text-destructive"}`}>
                    {item.val ? "Widoczna" : "Ukryta"}
                  </span>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={item.val}
                    onChange={() => handleToggle(item.id, item.val)}
                    disabled={busy || !isLive}
                  />
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Zablokowane zakładki znikną z nawigacji uczestników (dostęp np. do kosztów czy wpłat będzie chwilowo niemożliwy).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

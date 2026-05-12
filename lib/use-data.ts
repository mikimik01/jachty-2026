"use client";

import { useEffect, useState, useCallback } from "react";
import { getFullDashboardData } from "@/lib/queries";

export interface PersonData {
  id: string;
  name: string;
  boat_id: string | null;
  is_captain: boolean;
  created_at: string;
  paid: number;
  total_due: number;
}

export interface BoatData {
  id: string;
  name: string;
  model: string;
  color: string;
  emoji: string;
  max_crew: number;
  sort_order: number;
  created_at: string;
  crew: PersonData[];
}

export interface CostData {
  id: string;
  name: string;
  total_cost: number;
  icon: string;
  description: string;
  is_refundable: boolean;
  sort_order: number;
  created_at: string;
  per_person: number;
}

export interface PaymentData {
  id: string;
  person_id: string;
  amount: number;
  note: string | null;
  paid_at: string;
  created_at: string;
  person_name: string;
}

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  author: string;
  type: string;
  pinned: boolean;
  published_at: string;
  created_at: string;
}

export interface TripConfigData {
  id: string;
  departure_date: string;
  return_date: string;
  location: string;
  total_people: number;
  boat_model: string;
  boat_count: number;
  created_at: string;
}

export interface DashboardData {
  tripConfig: TripConfigData | null;
  boats: BoatData[];
  people: PersonData[];
  costs: CostData[];
  totalPerPerson: number;
  payments: PaymentData[];
  announcements: AnnouncementData[];
  unassignedPeople: PersonData[];
}

const isSupabaseConfigured =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-url-here";

export function useData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Fallback to mock data
      const mock = await import("@/lib/data");
      const totalPerPerson = mock.TOTAL_PER_PERSON;
      setData({
        tripConfig: {
          id: "mock",
          departure_date: mock.TRIP_CONFIG.departureDate.toISOString(),
          return_date: mock.TRIP_CONFIG.returnDate.toISOString(),
          location: mock.TRIP_CONFIG.location,
          total_people: mock.TRIP_CONFIG.totalPeople,
          boat_model: mock.TRIP_CONFIG.boatModel,
          boat_count: mock.TRIP_CONFIG.boatCount,
          created_at: new Date().toISOString(),
        },
        boats: mock.BOATS.map((b) => ({
          id: b.id,
          name: b.name,
          model: b.model,
          color: b.color,
          emoji: b.emoji,
          max_crew: b.maxCrew,
          sort_order: 0,
          created_at: new Date().toISOString(),
          crew: b.crew.map((p) => ({
            id: p.id,
            name: p.name,
            boat_id: b.id,
            is_captain: p.isCaptain ?? false,
            created_at: new Date().toISOString(),
            paid: p.paid,
            total_due: p.totalDue,
          })),
        })),
        people: mock.BOATS.flatMap((b) =>
          b.crew.map((p) => ({
            id: p.id,
            name: p.name,
            boat_id: b.id,
            is_captain: p.isCaptain ?? false,
            created_at: new Date().toISOString(),
            paid: p.paid,
            total_due: p.totalDue,
          }))
        ),
        costs: mock.COSTS.map((c) => ({
          id: c.id,
          name: c.name,
          total_cost: c.totalCost,
          icon: c.icon,
          description: c.description,
          is_refundable: c.id === "deposit",
          sort_order: 0,
          created_at: new Date().toISOString(),
          per_person: c.perPerson,
        })),
        totalPerPerson,
        payments: mock.PAYMENT_HISTORY.map((p) => ({
          id: p.id,
          person_id: p.personId,
          amount: p.amount,
          note: p.note ?? null,
          paid_at: p.date,
          created_at: new Date().toISOString(),
          person_name: p.personName,
        })),
        announcements: mock.ANNOUNCEMENTS.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          author: a.author,
          type: a.type,
          pinned: a.pinned ?? false,
          published_at: a.date,
          created_at: new Date().toISOString(),
        })),
        unassignedPeople: [],
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getFullDashboardData();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd ładowania danych");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh, isLive: !!isSupabaseConfigured };
}

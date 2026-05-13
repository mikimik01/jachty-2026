import { supabase } from "./supabase";

// ─── Trip Config ───

export async function getTripConfig() {
  const { data } = await supabase
    .from("trip_config")
    .select("*")
    .single();
  return data;
}

export async function updateTripConfig(id: string, updates: {
  departure_date?: string;
  return_date?: string;
  location?: string;
  total_people?: number;
  boat_model?: string;
  boat_count?: number;
  show_boats?: boolean;
  show_costs?: boolean;
  show_payments?: boolean;
  show_announcements?: boolean;
  show_survey?: boolean;
}) {
  const { data, error } = await supabase
    .from("trip_config")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Boats ───

export async function getBoats() {
  const { data } = await supabase
    .from("boats")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function createBoat(boat: {
  name: string;
  model?: string;
  color?: string;
  emoji?: string;
  max_crew?: number;
  sort_order?: number;
}) {
  const { data, error } = await supabase
    .from("boats")
    .insert(boat)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBoat(id: string, updates: {
  name?: string;
  model?: string;
  color?: string;
  emoji?: string;
  max_crew?: number;
  sort_order?: number;
}) {
  const { data, error } = await supabase
    .from("boats")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBoat(id: string) {
  const { error } = await supabase.from("boats").delete().eq("id", id);
  if (error) throw error;
}

// ─── People ───

export async function getPeople() {
  const { data } = await supabase
    .from("people")
    .select("*")
    .order("created_at");
  return data ?? [];
}

export async function getPeopleWithPayments() {
  const [people, payments] = await Promise.all([
    getPeople(),
    getPayments(),
  ]);

  return people.map((person) => {
    const personPayments = payments.filter((p) => p.person_id === person.id);
    const totalPaid = personPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return { ...person, paid: totalPaid, payments: personPayments };
  });
}

export async function createPerson(person: {
  name: string;
  boat_id?: string | null;
  is_captain?: boolean;
}) {
  const { data, error } = await supabase
    .from("people")
    .insert(person)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePerson(id: string, updates: {
  name?: string;
  boat_id?: string | null;
  is_captain?: boolean;
}) {
  const { data, error } = await supabase
    .from("people")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePerson(id: string) {
  const { error } = await supabase.from("people").delete().eq("id", id);
  if (error) throw error;
}

// ─── Costs ───

export async function getCosts() {
  const { data } = await supabase
    .from("costs")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function createCost(cost: {
  name: string;
  total_cost: number;
  icon?: string;
  description?: string;
  is_refundable?: boolean;
  sort_order?: number;
}) {
  const { data, error } = await supabase
    .from("costs")
    .insert(cost)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCost(id: string, updates: {
  name?: string;
  total_cost?: number;
  icon?: string;
  description?: string;
  is_refundable?: boolean;
  sort_order?: number;
}) {
  const { data, error } = await supabase
    .from("costs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCost(id: string) {
  const { error } = await supabase.from("costs").delete().eq("id", id);
  if (error) throw error;
}

// ─── Payments ───

export async function getPayments() {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .order("paid_at", { ascending: false });
  return data ?? [];
}

export async function getPaymentsWithNames() {
  const [payments, people] = await Promise.all([
    getPayments(),
    getPeople(),
  ]);

  return payments.map((payment) => {
    const person = people.find((p) => p.id === payment.person_id);
    return { ...payment, person_name: person?.name ?? "Nieznany" };
  });
}

export async function createPayment(payment: {
  person_id: string;
  amount: number;
  note?: string | null;
  paid_at?: string;
}) {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePayment(id: string) {
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw error;
}

// ─── Announcements ───

export async function getAnnouncements() {
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function createAnnouncement(announcement: {
  title: string;
  content: string;
  author?: string;
  type?: "info" | "warning" | "success";
  pinned?: boolean;
  published_at?: string;
}) {
  const { data, error } = await supabase
    .from("announcements")
    .insert(announcement)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAnnouncement(id: string, updates: {
  title?: string;
  content?: string;
  author?: string;
  type?: "info" | "warning" | "success";
  pinned?: boolean;
  published_at?: string;
}) {
  const { data, error } = await supabase
    .from("announcements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

// ─── Aggregated data for pages ───

export async function getFullDashboardData() {
  const [tripConfig, boats, people, costs, payments, announcements] = await Promise.all([
    getTripConfig(),
    getBoats(),
    getPeople(),
    getCosts(),
    getPayments(),
    getAnnouncements(),
  ]);

  // Divide costs by total boat capacity (sum of max_crew), not by added people
  const totalCapacity = boats.reduce((sum, b) => sum + (Number(b.max_crew) || 0), 0) || tripConfig?.total_people || 24;
  const costsWithPerPerson = costs.map((c) => ({
    ...c,
    total_cost: Number(c.total_cost),
    is_refundable: c.is_refundable ?? false,
    per_person: totalCapacity > 0 ? Number(c.total_cost) / totalCapacity : 0,
  }));
  const totalPerPerson = costsWithPerPerson.reduce((sum, c) => sum + c.per_person, 0);

  const peopleWithPayments = people.map((person) => {
    const personPayments = payments.filter((p) => p.person_id === person.id);
    const totalPaid = personPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return { ...person, paid: totalPaid, total_due: totalPerPerson };
  });

  const boatsWithCrew = boats.map((boat) => ({
    ...boat,
    crew: peopleWithPayments.filter((p) => p.boat_id === boat.id),
  }));

  const paymentsWithNames = payments.map((payment) => {
    const person = people.find((p) => p.id === payment.person_id);
    return { ...payment, amount: Number(payment.amount), person_name: person?.name ?? "Nieznany" };
  });

  return {
    tripConfig,
    boats: boatsWithCrew,
    people: peopleWithPayments,
    costs: costsWithPerPerson,
    totalPerPerson,
    payments: paymentsWithNames,
    announcements,
    unassignedPeople: peopleWithPayments.filter((p) => !p.boat_id),
  };
}

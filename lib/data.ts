// Mock data for the sailing trip

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  isCaptain?: boolean;
  paid: number;
  totalDue: number;
}

export interface Boat {
  id: string;
  name: string;
  model: string;
  color: string;
  emoji: string;
  crew: Person[];
  maxCrew: number;
}

export interface CostItem {
  id: string;
  name: string;
  totalCost: number;
  perPerson: number;
  icon: string;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  pinned?: boolean;
  type: "info" | "warning" | "success";
}

export interface PaymentRecord {
  id: string;
  personId: string;
  personName: string;
  amount: number;
  date: string;
  note?: string;
}

// Trip config
export const TRIP_CONFIG = {
  departureDate: new Date("2026-08-08T10:00:00"),
  returnDate: new Date("2026-08-15T10:00:00"),
  location: "Mazury, Polska",
  totalPeople: 24,
  boatModel: "Antila 33.3",
  boatCount: 3,
};

// Cost breakdown
export const COSTS: CostItem[] = [
  {
    id: "charter",
    name: "Czarter jachtów",
    totalCost: 19500,
    perPerson: 812.5,
    icon: "⛵",
    description: "3x Antila 33.3, tydzień w szczycie sezonu",
  },
  {
    id: "fuel",
    name: "Paliwo",
    totalCost: 1200,
    perPerson: 50,
    icon: "⛽",
    description: "Szacunkowy koszt paliwa na 3 jachty",
  },
  {
    id: "port",
    name: "Opłaty portowe",
    totalCost: 2400,
    perPerson: 100,
    icon: "🏗️",
    description: "Postoje w marinach i portach (7 nocy)",
  },
  {
    id: "insurance",
    name: "Ubezpieczenie",
    totalCost: 1800,
    perPerson: 75,
    icon: "🛡️",
    description: "Ubezpieczenie NNW + OC dla załogi",
  },
  {
    id: "food",
    name: "Kasa na żarcie",
    totalCost: 4800,
    perPerson: 200,
    icon: "🍕",
    description: "Wspólna kasa na jedzenie i napoje na łódce",
  },
  {
    id: "deposit",
    name: "Kaucja zwrotna",
    totalCost: 9000,
    perPerson: 375,
    icon: "💰",
    description: "3x 3000 PLN - zwracana po rejsie bez szkód",
  },
];

export const TOTAL_PER_PERSON = COSTS.reduce(
  (sum, cost) => sum + cost.perPerson,
  0
);

// Boats with crew
export const BOATS: Boat[] = [
  {
    id: "boat-1",
    name: "Sztorm",
    model: "Antila 33.3",
    color: "from-blue-500 to-cyan-500",
    emoji: "🌊",
    maxCrew: 8,
    crew: [
      { id: "p1", name: "Mikołaj", isCaptain: true, paid: 1612.5, totalDue: 1612.5 },
      { id: "p2", name: "Kacper", paid: 1612.5, totalDue: 1612.5 },
      { id: "p3", name: "Wojtek", paid: 800, totalDue: 1612.5 },
      { id: "p4", name: "Ania K.", paid: 1612.5, totalDue: 1612.5 },
      { id: "p5", name: "Dawid", paid: 500, totalDue: 1612.5 },
      { id: "p6", name: "Marta", paid: 0, totalDue: 1612.5 },
      { id: "p7", name: "Patryk", paid: 1612.5, totalDue: 1612.5 },
      { id: "p8", name: "Ola", paid: 1000, totalDue: 1612.5 },
    ],
  },
  {
    id: "boat-2",
    name: "Bryza",
    model: "Antila 33.3",
    color: "from-emerald-500 to-teal-500",
    emoji: "🍀",
    maxCrew: 8,
    crew: [
      { id: "p9", name: "Bartek", isCaptain: true, paid: 1612.5, totalDue: 1612.5 },
      { id: "p10", name: "Zuza", paid: 1612.5, totalDue: 1612.5 },
      { id: "p11", name: "Maciek", paid: 1200, totalDue: 1612.5 },
      { id: "p12", name: "Julia", paid: 0, totalDue: 1612.5 },
      { id: "p13", name: "Tomek", paid: 1612.5, totalDue: 1612.5 },
      { id: "p14", name: "Karolina", paid: 500, totalDue: 1612.5 },
      { id: "p15", name: "Szymon", paid: 1612.5, totalDue: 1612.5 },
      { id: "p16", name: "Ania M.", paid: 800, totalDue: 1612.5 },
    ],
  },
  {
    id: "boat-3",
    name: "Fala",
    model: "Antila 33.3",
    color: "from-amber-500 to-orange-500",
    emoji: "🔥",
    maxCrew: 8,
    crew: [
      { id: "p17", name: "Piotr", isCaptain: true, paid: 1612.5, totalDue: 1612.5 },
      { id: "p18", name: "Natalia", paid: 1612.5, totalDue: 1612.5 },
      { id: "p19", name: "Kamil", paid: 400, totalDue: 1612.5 },
      { id: "p20", name: "Ewa", paid: 1612.5, totalDue: 1612.5 },
      { id: "p21", name: "Rafał", paid: 0, totalDue: 1612.5 },
      { id: "p22", name: "Magda", paid: 1612.5, totalDue: 1612.5 },
      { id: "p23", name: "Filip", paid: 1000, totalDue: 1612.5 },
      { id: "p24", name: "Gosia", paid: 1612.5, totalDue: 1612.5 },
    ],
  },
];

// Announcements
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "🎉 Ruszamy z organizacją!",
    content:
      "Cześć ekipo! Jachty 2026 nabierają kształtów. 3 Antile 33.3, 8–15 sierpnia, Mazury. Będzie epicko! Wpłaty ruszają - szczegóły w zakładce Koszty.",
    date: "2026-05-12",
    author: "Mikołaj",
    pinned: true,
    type: "success",
  },
  {
    id: "a2",
    title: "📋 Ankieta - dokładny termin",
    content:
      "Termin ustalony! Płyniemy 8–15 sierpnia 2026, od soboty do soboty. Zarezerwujcie sobie ten tydzień!",
    date: "2026-05-12",
    author: "Mikołaj",
    type: "info",
  },
  {
    id: "a3",
    title: "💸 Pierwsza rata do 31 maja",
    content:
      "Żeby zarezerwować jachty, potrzebujemy wpłaty zaliczki 500 PLN od osoby do końca maja. Numer konta w zakładce Wpłaty. Nie zwlekajcie!",
    date: "2026-05-12",
    author: "Mikołaj",
    type: "warning",
  },
  {
    id: "a4",
    title: "🧭 Co zabrać na rejs?",
    content:
      "Podstawy: miękka torba (NIE walizka!), śpiwór, kurtka przeciwdeszczowa, buty z białą podeszwą, krem z filtrem, okulary, latarka. Pełna lista wkrótce!",
    date: "2026-05-11",
    author: "Mikołaj",
    type: "info",
  },
];

// Payment history
export const PAYMENT_HISTORY: PaymentRecord[] = [
  { id: "pay1", personId: "p1", personName: "Mikołaj", amount: 1612.5, date: "2026-05-10", note: "Pełna wpłata" },
  { id: "pay2", personId: "p2", personName: "Kacper", amount: 1612.5, date: "2026-05-11", note: "Pełna wpłata" },
  { id: "pay3", personId: "p4", personName: "Ania K.", amount: 1612.5, date: "2026-05-10" },
  { id: "pay4", personId: "p7", personName: "Patryk", amount: 1612.5, date: "2026-05-12" },
  { id: "pay5", personId: "p3", personName: "Wojtek", amount: 500, date: "2026-05-11", note: "Zaliczka" },
  { id: "pay6", personId: "p3", personName: "Wojtek", amount: 300, date: "2026-05-12", note: "Rata 2" },
  { id: "pay7", personId: "p5", personName: "Dawid", amount: 500, date: "2026-05-12", note: "Zaliczka" },
  { id: "pay8", personId: "p8", personName: "Ola", amount: 1000, date: "2026-05-11" },
];

-- Jachty 2026 - Supabase schema
-- Run this in Supabase SQL Editor

-- Trip configuration (singleton)
create table trip_config (
  id uuid primary key default gen_random_uuid(),
  departure_date timestamptz not null,
  return_date timestamptz not null,
  location text not null default 'Mazury, Polska',
  total_people int not null default 24,
  boat_model text not null default 'Antila 33.3',
  boat_count int not null default 3,
  show_boats boolean not null default true,
  show_costs boolean not null default true,
  show_payments boolean not null default true,
  show_announcements boolean not null default true,
  show_survey boolean not null default true,
  created_at timestamptz default now()
);

-- Boats
create table boats (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text not null default 'Antila 33.3',
  color text not null default 'from-blue-500 to-cyan-500',
  emoji text not null default '⛵',
  max_crew int not null default 8,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- People
create table people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  boat_id uuid references boats(id) on delete set null,
  is_captain boolean not null default false,
  created_at timestamptz default now()
);

-- Costs
create table costs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  total_cost numeric(10,2) not null default 0,
  icon text not null default '💰',
  description text not null default '',
  is_refundable boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  amount numeric(10,2) not null,
  note text,
  paid_at date not null default current_date,
  created_at timestamptz default now()
);

-- Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author text not null default 'Mikołaj',
  type text not null default 'info' check (type in ('info', 'warning', 'success')),
  pinned boolean not null default false,
  published_at date not null default current_date,
  created_at timestamptz default now()
);

-- Enable RLS (but allow public reads, we'll add auth later)
alter table trip_config enable row level security;
alter table boats enable row level security;
alter table people enable row level security;
alter table costs enable row level security;
alter table payments enable row level security;
alter table announcements enable row level security;

-- Public read access for all tables
create policy "Public read trip_config" on trip_config for select using (true);
create policy "Public read boats" on boats for select using (true);
create policy "Public read people" on people for select using (true);
create policy "Public read costs" on costs for select using (true);
create policy "Public read payments" on payments for select using (true);
create policy "Public read announcements" on announcements for select using (true);

-- Public write access (temporary - will be restricted after adding auth)
create policy "Public write trip_config" on trip_config for all using (true) with check (true);
create policy "Public write boats" on boats for all using (true) with check (true);
create policy "Public write people" on people for all using (true) with check (true);
create policy "Public write costs" on costs for all using (true) with check (true);
create policy "Public write payments" on payments for all using (true) with check (true);
create policy "Public write announcements" on announcements for all using (true) with check (true);

-- Seed data
insert into trip_config (departure_date, return_date, location, total_people, boat_model, boat_count)
values ('2026-08-01T10:00:00+02:00', '2026-08-08T10:00:00+02:00', 'Mazury, Polska', 24, 'Antila 33.3', 3);

insert into boats (name, model, color, emoji, max_crew, sort_order) values
  ('Sztorm', 'Antila 33.3', 'from-blue-500 to-cyan-500', '🌊', 8, 1),
  ('Bryza', 'Antila 33.3', 'from-emerald-500 to-teal-500', '🍀', 8, 2),
  ('Fala', 'Antila 33.3', 'from-amber-500 to-orange-500', '🔥', 8, 3);

insert into costs (name, total_cost, icon, description, sort_order) values
  ('Czarter jachtów', 19500, '⛵', '3x Antila 33.3, tydzień w szczycie sezonu', 1),
  ('Paliwo', 1200, '⛽', 'Szacunkowy koszt paliwa na 3 jachty', 2),
  ('Opłaty portowe', 2400, '🏗️', 'Postoje w marinach i portach (7 nocy)', 3),
  ('Ubezpieczenie', 1800, '🛡️', 'Ubezpieczenie NNW + OC dla załogi', 4),
  ('Kasa na żarcie', 4800, '🍕', 'Wspólna kasa na jedzenie i napoje na łódce', 5),
  ('Kaucja zwrotna', 9000, '💰', '3x 3000 PLN - zwracana po rejsie bez szkód', 6);

insert into announcements (title, content, author, type, pinned, published_at) values
  ('🎉 Ruszamy z organizacją!', 'Cześć ekipo! Jachty 2026 nabierają kształtów. 3 Antile 33.3, pierwsza połowa sierpnia, Mazury. Będzie epicko! Wpłaty ruszają - szczegóły w zakładce Koszty.', 'Mikołaj', 'success', true, '2026-05-12'),
  ('📋 Ankieta - dokładny termin', 'Wypełnijcie ankietę dotyczącą dokładnego terminu! Celujemy w pierwszą połowę sierpnia, od soboty do soboty. Link do ankiety wkrótce.', 'Mikołaj', 'info', false, '2026-05-12'),
  ('💸 Pierwsza rata do 31 maja', 'Żeby zarezerwować jachty, potrzebujemy wpłaty zaliczki 500 PLN od osoby do końca maja. Numer konta w zakładce Wpłaty. Nie zwlekajcie!', 'Mikołaj', 'warning', false, '2026-05-12'),
  ('🧭 Co zabrać na rejs?', 'Podstawy: miękka torba (NIE walizka!), śpiwór, kurtka przeciwdeszczowa, buty z białą podeszwą, krem z filtrem, okulary, latarka. Pełna lista wkrótce!', 'Mikołaj', 'info', false, '2026-05-11');

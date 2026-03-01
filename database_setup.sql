-- ============================================================
-- CG-PWMU Dashboard Database — Tables + Dummy Data
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABLE 1: pwmu_centers — PWMU operational data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pwmu_centers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    district text,
    block text,
    gram_panchayat text,
    capacity_mt numeric DEFAULT 0,
    waste_processed_mt numeric DEFAULT 0,
    waste_sold_mt numeric DEFAULT 0,
    revenue numeric DEFAULT 0,
    expenditure numeric DEFAULT 0,
    status text DEFAULT 'operational',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pwmu_centers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pwmu_read" ON public.pwmu_centers;
CREATE POLICY "pwmu_read" ON public.pwmu_centers FOR SELECT USING (auth.role() = 'authenticated');

-- Insert 6 dummy PWMUs across CG districts
INSERT INTO public.pwmu_centers (name, district, block, gram_panchayat, capacity_mt, waste_processed_mt, waste_sold_mt, revenue, expenditure, status) VALUES
('Balod City PWMU', 'Balod', 'Gunderdehi', 'Gunderdehi', 50, 42.5, 38.2, 425000, 180000, 'operational'),
('Durg Central PWMU', 'Durg', 'Durg', 'Durg', 80, 68.3, 55.1, 680000, 310000, 'operational'),
('Bemetara PWMU', 'Bemetara', 'Bemetara', 'Bemetara', 35, 28.7, 24.5, 287000, 125000, 'operational'),
('Raipur East PWMU', 'Raipur', 'Arang', 'Arang', 100, 85.2, 72.8, 852000, 400000, 'operational'),
('Korba PWMU', 'Korba', 'Korba', 'Korba', 45, 32.1, 28.9, 321000, 155000, 'maintenance'),
('Bilaspur PWMU', 'Bilaspur', 'Bilaspur', 'Bilaspur', 60, 51.8, 45.3, 518000, 240000, 'operational');

-- ============================================================
-- TABLE 2: waste_collections — Daily village collection logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.waste_collections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    village_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    village_name text NOT NULL,
    district text,
    block text,
    gram_panchayat text,
    collection_date date NOT NULL,
    wet_waste_kg numeric DEFAULT 0,
    dry_waste_kg numeric DEFAULT 0,
    user_charge_collected numeric DEFAULT 0,
    submitted boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.waste_collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "collections_read" ON public.waste_collections;
CREATE POLICY "collections_read" ON public.waste_collections FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "collections_insert" ON public.waste_collections;
CREATE POLICY "collections_insert" ON public.waste_collections FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert 14 days of dummy data for 3 villages
INSERT INTO public.waste_collections (village_name, district, block, gram_panchayat, collection_date, wet_waste_kg, dry_waste_kg, user_charge_collected) VALUES
-- Gunderdehi Village (Balod) — last 7 days
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE - 6, 120, 80, 1800),
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE - 5, 130, 85, 1950),
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE - 4, 115, 75, 1700),
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE - 3, 140, 90, 2100),
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE - 2, 125, 85, 1850),
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE - 1, 150, 100, 2250),
('Gunderdehi Village', 'Balod', 'Gunderdehi', 'Gunderdehi', CURRENT_DATE, 125, 85, 1900),
-- Mowa Village (Raipur) — last 7 days
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE - 6, 180, 160, 3200),
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE - 5, 195, 145, 3100),
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE - 4, 210, 130, 2900),
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE - 3, 175, 165, 3350),
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE - 2, 200, 140, 3000),
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE - 1, 220, 150, 3500),
('Mowa Village', 'Raipur', 'Arang', 'Arang', CURRENT_DATE, 190, 155, 3200),
-- Kurud Village (Dhamtari) — last 7 days
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE - 6, 60, 35, 800),
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE - 5, 70, 40, 900),
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE - 4, 55, 30, 750),
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE - 3, 75, 45, 1000),
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE - 2, 65, 35, 850),
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE - 1, 80, 50, 1100),
('Kurud Village', 'Dhamtari', 'Kurud', 'Kurud', CURRENT_DATE, 70, 40, 950);

-- ============================================================
-- TABLE 3: vendor_pickups — Vendor procurement records  
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendor_pickups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    vendor_name text,
    pwmu_name text NOT NULL,
    material text NOT NULL,
    quantity_kg numeric DEFAULT 0,
    amount_paid numeric DEFAULT 0,
    pickup_date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vendor_pickups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pickups_read" ON public.vendor_pickups;
CREATE POLICY "pickups_read" ON public.vendor_pickups FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "pickups_insert" ON public.vendor_pickups;
CREATE POLICY "pickups_insert" ON public.vendor_pickups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert 6 months of dummy pickup data (without vendor_id for now — will be linked to actual vendors)
INSERT INTO public.vendor_pickups (vendor_name, pwmu_name, material, quantity_kg, amount_paid, pickup_date) VALUES
-- January
('Demo Vendor', 'Balod City PWMU', 'HDPE Plastic', 1200, 10800, '2026-01-05'),
('Demo Vendor', 'Durg Central PWMU', 'PET Bottles', 800, 6400, '2026-01-12'),
('Demo Vendor', 'Bemetara PWMU', 'Mixed Paper', 1500, 9000, '2026-01-20'),
('Demo Vendor', 'Raipur East PWMU', 'HDPE Plastic', 1000, 9000, '2026-01-28'),
-- February
('Demo Vendor', 'Balod City PWMU', 'PET Bottles', 1400, 11200, '2026-02-03'),
('Demo Vendor', 'Durg Central PWMU', 'Scrap Metal', 600, 7200, '2026-02-10'),
('Demo Vendor', 'Korba PWMU', 'HDPE Plastic', 1800, 16200, '2026-02-18'),
('Demo Vendor', 'Bilaspur PWMU', 'Mixed Paper', 1400, 8400, '2026-02-25'),
-- March (current month)
('Demo Vendor', 'Balod City PWMU', 'HDPE Plastic', 1600, 14400, '2026-03-01'),
('Demo Vendor', 'Raipur East PWMU', 'PET Bottles', 2100, 16800, '2026-03-01'),
('Demo Vendor', 'Bemetara PWMU', 'Scrap Metal', 450, 5400, '2026-03-01');

-- ============================================================
-- TABLE 4: market_availability — PWMU stock for vendors
-- ============================================================
CREATE TABLE IF NOT EXISTS public.market_availability (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    pwmu_name text NOT NULL,
    material text NOT NULL,
    stock_kg numeric DEFAULT 0,
    unit text DEFAULT 'kg',
    distance_km numeric DEFAULT 0,
    is_hot boolean DEFAULT false,
    rate_per_kg numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.market_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "market_read" ON public.market_availability;
CREATE POLICY "market_read" ON public.market_availability FOR SELECT USING (auth.role() = 'authenticated');

INSERT INTO public.market_availability (pwmu_name, material, stock_kg, distance_km, is_hot, rate_per_kg) VALUES
('Balod City PWMU', 'HDPE Plastic', 1250, 12, true, 9.0),
('Durg Central PWMU', 'Mixed Paper', 800, 45, false, 6.0),
('Bemetara PWMU', 'PET Bottles', 2100, 68, true, 8.0),
('Gunderdehi PWMU', 'Scrap Metal', 450, 18, false, 12.0),
('Raipur East PWMU', 'LDPE Film', 1800, 85, true, 7.5),
('Korba PWMU', 'Multi-Layer Packaging', 650, 120, false, 5.0);

-- ============================================================
-- TABLE 5: village_workers — Swachhata worker attendance
-- ============================================================
CREATE TABLE IF NOT EXISTS public.village_workers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    village_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    village_name text NOT NULL,
    worker_name text NOT NULL,
    role text DEFAULT 'Helper',
    status text DEFAULT 'Present',
    log_date date DEFAULT CURRENT_DATE,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.village_workers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workers_read" ON public.village_workers;
CREATE POLICY "workers_read" ON public.village_workers FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "workers_insert" ON public.village_workers;
CREATE POLICY "workers_insert" ON public.village_workers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.village_workers (village_name, worker_name, role, status, log_date) VALUES
('Gunderdehi Village', 'Ramesh Kumar', 'Driver', 'Present', CURRENT_DATE),
('Gunderdehi Village', 'Suresh Singh', 'Helper', 'Present', CURRENT_DATE),
('Gunderdehi Village', 'Anita Devi', 'Sorter', 'Absent', CURRENT_DATE),
('Gunderdehi Village', 'Geeta Bai', 'Sorter', 'Present', CURRENT_DATE),
('Mowa Village', 'Rajendra Yadav', 'Driver', 'Present', CURRENT_DATE),
('Mowa Village', 'Kavita Sahu', 'Helper', 'Present', CURRENT_DATE),
('Mowa Village', 'Dinesh Verma', 'Sorter', 'Present', CURRENT_DATE),
('Kurud Village', 'Pramod Soni', 'Driver', 'Absent', CURRENT_DATE),
('Kurud Village', 'Sunita Patel', 'Helper', 'Present', CURRENT_DATE);

-- ============================================================
-- DONE! All tables created with dummy data.
-- ============================================================
SELECT 'All tables created successfully!' AS result;

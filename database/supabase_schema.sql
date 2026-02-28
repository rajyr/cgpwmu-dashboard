-- CG-PWMU Initial Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up the foundation

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------
-- 1. USERS TABLE (Extends Supabase Auth)
--------------------------------------------------------
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT NOT NULL CHECK (role IN ('StateAdmin', 'DistrictNodal', 'PWMUManager', 'Sarpanch', 'Vendor', 'Auditor')),
  district TEXT, -- Optional, used for Nodal
  block TEXT,    -- Optional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Allow StateAdmins to read all profiles
CREATE POLICY "StateAdmins can view all profiles" 
ON public.users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'StateAdmin'
  )
);

--------------------------------------------------------
-- 2. PWMUS (Central Processing Units)
--------------------------------------------------------
CREATE TABLE public.pwmus (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manager_id UUID REFERENCES public.users(id), -- Links to PWMUManager user
  facility_name TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT NOT NULL,
  gram_panchayat TEXT NOT NULL,
  daily_capacity_kg NUMERIC NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pwmus ENABLE ROW LEVEL SECURITY;
-- Admins/Nodal can see all, PWMU Manager sees their own
CREATE POLICY "Users can view relevant PWMUs" 
ON public.pwmus FOR SELECT 
USING (
  manager_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('StateAdmin', 'DistrictNodal'))
);

--------------------------------------------------------
-- 3. VILLAGES
--------------------------------------------------------
CREATE TABLE public.villages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sarpanch_id UUID REFERENCES public.users(id), -- Links to Sarpanch user
  linked_pwmu_id UUID REFERENCES public.pwmus(id), -- The PWMU this village sends waste to
  village_name TEXT NOT NULL,
  gram_panchayat TEXT NOT NULL,
  block TEXT NOT NULL,
  district TEXT NOT NULL,
  population INTEGER,
  households INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
-- Sarpanch sees their village, PWMU Manager sees linked villages, Admins see all
CREATE POLICY "Role based access to Villages" 
ON public.villages FOR SELECT 
USING (
  sarpanch_id = auth.uid() OR
  (EXISTS (SELECT 1 FROM public.pwmus WHERE id = linked_pwmu_id AND manager_id = auth.uid())) OR
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('StateAdmin', 'DistrictNodal'))
);

--------------------------------------------------------
-- 4. VILLAGE DAILY LOGS (Waste Collection)
--------------------------------------------------------
CREATE TABLE public.village_daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  village_id UUID REFERENCES public.villages(id) NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  wet_waste_kg NUMERIC DEFAULT 0,
  dry_waste_kg NUMERIC DEFAULT 0,
  user_charges_collected NUMERIC DEFAULT 0,
  submitted_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.village_daily_logs ENABLE ROW LEVEL SECURITY;
-- Basic Access Policy Placeholder
CREATE POLICY "View Daily Logs based on hierarchy" 
ON public.village_daily_logs FOR SELECT 
USING (true); -- Replace with strict role checks in production

--------------------------------------------------------
-- 5. PWMU DAILY INVENTORY LOGS
--------------------------------------------------------
CREATE TABLE public.pwmu_daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pwmu_id UUID REFERENCES public.pwmus(id) NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  incoming_waste_kg NUMERIC DEFAULT 0,
  processed_organic_kg NUMERIC DEFAULT 0,
  processed_plastic_kg NUMERIC DEFAULT 0,
  processed_paper_kg NUMERIC DEFAULT 0,
  processed_glass_metal_kg NUMERIC DEFAULT 0,
  inert_waste_kg NUMERIC DEFAULT 0,
  machine_status TEXT DEFAULT 'Operational' CHECK (machine_status IN ('Operational', 'Breakdown', 'Maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pwmu_daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View PWMU Logs based on hierarchy" 
ON public.pwmu_daily_logs FOR SELECT 
USING (true); -- Replace with strict role checks in production

--------------------------------------------------------
-- 6. VENDORS & TRANSACTIONS (Sales)
--------------------------------------------------------
CREATE TABLE public.vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_user_id UUID REFERENCES public.users(id), -- Links to Vendor User
  business_name TEXT NOT NULL,
  material_category TEXT NOT NULL, -- e.g., 'HDPE Plastic', 'Mixed Paper'
  district TEXT NOT NULL,
  status TEXT DEFAULT 'Active'
);

CREATE TABLE public.waste_sales_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pwmu_id UUID REFERENCES public.pwmus(id) NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  material_type TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  revenue_generated NUMERIC NOT NULL,
  status TEXT DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Cancelled'))
);

-- Note: The above establishes the core relational structure needed for the CG-PWMU forms and dashboards.
-- After running this, we will configure the frontend Auth context to write to these tables.

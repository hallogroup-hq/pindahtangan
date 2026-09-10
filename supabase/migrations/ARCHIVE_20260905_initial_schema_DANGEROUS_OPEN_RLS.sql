-- =================================================================
-- PINDAHTANGAN POSTGRESQL PRODUCTION DDL SCHEMA
-- Canonical Schema based on Master PRD v1.0 Section 8 & Admin PRD v1.0
-- Target Engine: Supabase PostgreSQL 15+ with Realtime enabled
-- =================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('consignor', 'host', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_tier AS ENUM ('superadmin', 'finance', 'studio_lead', 'logistics');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE batch_status AS ENUM ('scheduled', 'picked_up', 'in_qc', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tier_category AS ENUM ('tier_a', 'tier_b', 'tier_c');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_status AS ENUM (
        'in_steam',
        'ready_for_live',
        'in_live_queue',
        'sold',
        'packed',
        'shipped',
        'paid_out',
        'rejected',
        'bought_out'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reject_action AS ENUM ('donate', 'reclaim');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shipping_status AS ENUM ('pending_pack', 'shipped', 'delivered', 'returned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('draft', 'processing', 'transferred', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE live_platform AS ENUM ('tiktok', 'instagram');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLE: PROFILES (User accounts, Consignors & Internal Staff)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT DEFAULT 'Kota Sukabumi',
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_holder TEXT,
    role user_role DEFAULT 'consignor',
    admin_tier admin_tier,
    is_active_staff BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE: INTAKE_BATCHES (Intake manifests from Sukabumi consignors)
CREATE TABLE IF NOT EXISTS intake_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consignor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    batch_code TEXT UNIQUE NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_date DATE,
    estimated_count INT NOT NULL,
    actual_count INT DEFAULT 0,
    status batch_status DEFAULT 'scheduled',
    notes TEXT,
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: LIVE_SESSIONS (Host live sessions in Studio Sukabumi)
CREATE TABLE IF NOT EXISTS live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES profiles(id),
    session_title TEXT NOT NULL,
    platform live_platform DEFAULT 'tiktok',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    total_items_sold INT DEFAULT 0,
    total_gmv NUMERIC(14, 2) DEFAULT 0,
    host_base_fee NUMERIC(12, 2) DEFAULT 60000,
    host_commission_earned NUMERIC(12, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE: ORDERS (Orders generated when host marks items sold)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    live_session_id UUID REFERENCES live_sessions(id),
    order_number TEXT UNIQUE NOT NULL,
    buyer_handle TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    courier_name TEXT NOT NULL,
    tracking_number TEXT,
    shipping_status shipping_status DEFAULT 'pending_pack',
    subtotal_amount NUMERIC(14, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) DEFAULT 0,
    total_paid NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE: PAYOUTS (Weekly Friday 16.00 WIB settlement batches)
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consignor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    payout_code TEXT UNIQUE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_gross_floor NUMERIC(14, 2) NOT NULL,
    total_steam_deduction NUMERIC(12, 2) NOT NULL,
    total_net_payout NUMERIC(14, 2) NOT NULL,
    items_count INT NOT NULL,
    destination_bank TEXT NOT NULL,
    destination_account_number TEXT NOT NULL,
    destination_account_holder TEXT NOT NULL,
    status payout_status DEFAULT 'processing',
    transfer_receipt_url TEXT,
    transferred_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE: CLOTHES_ITEMS (Physical garment units)
CREATE TABLE IF NOT EXISTS clothes_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES intake_batches(id) ON DELETE CASCADE,
    consignor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    live_session_id UUID REFERENCES live_sessions(id),
    order_id UUID REFERENCES orders(id),
    payout_id UUID REFERENCES payouts(id),
    sku TEXT UNIQUE NOT NULL,
    hangtag_number INT NOT NULL,
    title TEXT NOT NULL,
    brand TEXT,
    size TEXT,
    chest_width_cm INT,
    category_tier tier_category NOT NULL,
    floor_price NUMERIC(12, 2) NOT NULL,
    target_live_price NUMERIC(12, 2) NOT NULL,
    sold_price NUMERIC(12, 2),
    steam_fee NUMERIC(12, 2) DEFAULT 2500,
    net_payout_amount NUMERIC(12, 2),
    status item_status DEFAULT 'in_steam',
    photo_url TEXT,
    defect_photo_url TEXT,
    defect_notes TEXT,
    reject_resolution reject_action,
    rack_location TEXT,
    inspected_by TEXT,
    inspection_notes TEXT,
    steam_completed_at TIMESTAMPTZ,
    consignment_start_date DATE DEFAULT CURRENT_DATE,
    aging_expiry_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLE: ITEM_STATUS_LOGS (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS item_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES clothes_items(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES profiles(id),
    from_status TEXT,
    to_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_clothes_consignor ON clothes_items(consignor_id);
CREATE INDEX IF NOT EXISTS idx_clothes_status ON clothes_items(status);
CREATE INDEX IF NOT EXISTS idx_clothes_hangtag ON clothes_items(hangtag_number);
CREATE INDEX IF NOT EXISTS idx_clothes_payout ON clothes_items(payout_id);
CREATE INDEX IF NOT EXISTS idx_clothes_batch ON clothes_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(live_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_logs_item ON item_status_logs(item_id);
CREATE INDEX IF NOT EXISTS idx_batches_consignor ON intake_batches(consignor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_consignor ON payouts(consignor_id);

-- 11. AUTOMATIC AUDIT LOG TRIGGER
CREATE OR REPLACE FUNCTION log_clothes_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO item_status_logs(item_id, changed_by, from_status, to_status, notes)
        VALUES (
            NEW.id,
            COALESCE(auth.uid(), NEW.consignor_id),
            OLD.status::TEXT,
            NEW.status::TEXT,
            'Perubahan status otomatis sistem PindahTangan Studio'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_clothes_status_change ON clothes_items;
CREATE TRIGGER trg_clothes_status_change
AFTER UPDATE ON clothes_items
FOR EACH ROW EXECUTE FUNCTION log_clothes_status_change();

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothes_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_status_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo / customer views
CREATE POLICY "Public Read Access on Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Batches" ON intake_batches FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Live Sessions" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Payouts" ON payouts FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Clothes Items" ON clothes_items FOR SELECT USING (true);
CREATE POLICY "Public Read Access on Logs" ON item_status_logs FOR SELECT USING (true);

-- Allow authenticated / anon write operations (managed via application business logic)
CREATE POLICY "Allow Insert on Profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update on Profiles" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Allow Insert on Batches" ON intake_batches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update on Batches" ON intake_batches FOR UPDATE USING (true);

CREATE POLICY "Allow Insert on Live Sessions" ON live_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update on Live Sessions" ON live_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow Insert on Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update on Orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "Allow Insert on Payouts" ON payouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update on Payouts" ON payouts FOR UPDATE USING (true);

CREATE POLICY "Allow Insert on Clothes Items" ON clothes_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update on Clothes Items" ON clothes_items FOR UPDATE USING (true);

CREATE POLICY "Allow Insert on Logs" ON item_status_logs FOR INSERT WITH CHECK (true);

-- 13. ENABLE SUPABASE REALTIME PUBLICATION
-- Enables WebSockets broadcasts for live items, orders, and batches
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE clothes_items, orders, intake_batches, live_sessions;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

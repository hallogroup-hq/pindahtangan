-- =================================================================
-- PINDAHTANGAN DATABASE SCHEMA v1.0 (Supabase PostgreSQL)
-- Managed Fashion Consignment & Live Circular Marketplace (Sukabumi Pilot)
-- Canonical DDL from PRD Section 8 & 10
-- =================================================================

-- 0. AKTIFKAN EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('consignor', 'host', 'admin');
CREATE TYPE batch_status AS ENUM ('scheduled', 'picked_up', 'in_qc', 'completed');
CREATE TYPE tier_category AS ENUM ('tier_a', 'tier_b', 'tier_c');
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
CREATE TYPE reject_action AS ENUM ('donate', 'reclaim');
CREATE TYPE shipping_status AS ENUM ('pending_pack', 'shipped', 'delivered', 'returned');
CREATE TYPE payout_status AS ENUM ('draft', 'processing', 'transferred', 'failed');
CREATE TYPE live_platform AS ENUM ('tiktok', 'instagram');

-- 2. TABEL PROFILES (PENGGUNA MULTI-ROLE)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT DEFAULT 'Kota Sukabumi',
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_holder TEXT,
    role user_role DEFAULT 'consignor',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL INTAKE BATCHES (PENGIRIMAN KANTONG BAJU)
CREATE TABLE IF NOT EXISTS intake_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consignor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    batch_code TEXT UNIQUE NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_date DATE,
    estimated_count INT NOT NULL,
    actual_count INT DEFAULT 0,
    status batch_status DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL LIVE SESSIONS (SESI SIARAN HOST)
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
    host_commission_earned NUMERIC(12, 2) DEFAULT 0
);

-- 5. TABEL ORDERS (PESANAN PEMBELI LIVE)
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

-- 6. TABEL PAYOUTS (GAJIAN MINGGUAN JUMAT 16.00 WIB)
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

-- 7. TABEL CLOTHES ITEMS (ENTITAS FISIK PAKAIAN)
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
    category_tier tier_category NOT NULL,
    floor_price NUMERIC(12, 2) NOT NULL,
    target_live_price NUMERIC(12, 2) NOT NULL,
    sold_price NUMERIC(12, 2),
    steam_fee NUMERIC(12, 2) DEFAULT 2500,
    net_payout_amount NUMERIC(12, 2),
    status item_status DEFAULT 'in_steam',
    defect_photo_url TEXT,
    defect_notes TEXT,
    reject_resolution reject_action,
    consignment_start_date DATE DEFAULT CURRENT_DATE,
    aging_expiry_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL ITEM STATUS LOGS (AUDIT TRAIL IMMUTABLE)
CREATE TABLE IF NOT EXISTS item_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES clothes_items(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES profiles(id),
    from_status TEXT,
    to_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INDEKS PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_clothes_consignor ON clothes_items(consignor_id);
CREATE INDEX IF NOT EXISTS idx_clothes_status ON clothes_items(status);
CREATE INDEX IF NOT EXISTS idx_clothes_hangtag ON clothes_items(hangtag_number);
CREATE INDEX IF NOT EXISTS idx_clothes_payout ON clothes_items(payout_id);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(live_session_id);
CREATE INDEX IF NOT EXISTS idx_logs_item ON item_status_logs(item_id);

-- 10. AUTOMATIC AUDIT LOG TRIGGER
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
            'Perubahan status otomatis sistem PindahTangan'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_clothes_status_change ON clothes_items;
CREATE TRIGGER trg_clothes_status_change
AFTER UPDATE ON clothes_items
FOR EACH ROW EXECUTE FUNCTION log_clothes_status_change();

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothes_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_status_logs ENABLE ROW LEVEL SECURITY;

-- Consignors view their own clothes
CREATE POLICY "Consignors view own clothes" ON clothes_items
    FOR SELECT USING (auth.uid() = consignor_id);

-- Consignors view their own batches
CREATE POLICY "Consignors view own batches" ON intake_batches
    FOR SELECT USING (auth.uid() = consignor_id);

-- Consignors view their own payouts
CREATE POLICY "Consignors view own payouts" ON payouts
    FOR SELECT USING (auth.uid() = consignor_id);

-- Consignors view their own profile
CREATE POLICY "Consignors view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins and Hosts full operational access
CREATE POLICY "Admin & Host manage clothes" ON clothes_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'host')
        )
    );

CREATE POLICY "Admin & Host manage orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'host')
        )
    );

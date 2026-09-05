-- =================================================================
-- PINDAHTANGAN INITIAL PILOT SEED DATA (KOTA SUKABUMI)
-- Canonical initial records for testing and live staging
-- =================================================================

-- 1. PROFILES (Consignors & Studio Staff)
INSERT INTO profiles (id, full_name, phone_number, address, city, bank_name, bank_account_number, bank_account_holder, role, admin_tier, is_active_staff)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'Ibu Ratna Dewi', '0812-8899-7711', 'Jl. Surya Kencana No. 45, RT 02/RW 04', 'Kota Sukabumi', 'BCA', '0281928471', 'Ratna Dewi', 'consignor', NULL, false),
    ('11111111-1111-1111-1111-111111111102', 'Ibu Rina Setyowati', '0813-1122-3344', 'Perum Baros Indah Blok C2 No. 12', 'Kota Sukabumi', 'Mandiri', '1320098271625', 'Rina Setyowati', 'consignor', NULL, false),
    ('11111111-1111-1111-1111-111111111103', 'Siti Nurhaliza', '0857-9988-1122', 'Jl. Bhayangkara No. 18', 'Kota Sukabumi', 'BCA', '0289918231', 'Siti Nurhaliza', 'host', NULL, true),
    ('11111111-1111-1111-1111-111111111104', 'Akmal Irsyad', '0811-2233-4455', 'Jl. Siliwangi No. 102', 'Kota Sukabumi', 'BCA', '0280019283', 'Akmal Irsyad', 'admin', 'superadmin', true),
    ('11111111-1111-1111-1111-111111111105', 'Kang Asep Supriatna', '0812-3344-5566', 'Jl. Siliwangi No. 102', 'Kota Sukabumi', 'Mandiri', '1320011223344', 'Asep Supriatna', 'admin', 'studio_lead', true),
    ('11111111-1111-1111-1111-111111111106', 'Budi Santoso', '0815-4455-6677', 'Jl. Siliwangi No. 102', 'Kota Sukabumi', 'BRI', '012301009988501', 'Budi Santoso', 'admin', 'logistics', true),
    ('11111111-1111-1111-1111-111111111107', 'Dewi Kartika', '0817-5566-7788', 'Jl. Siliwangi No. 102', 'Kota Sukabumi', 'BCA', '0287766554', 'Dewi Kartika', 'admin', 'finance', true)
ON CONFLICT (id) DO NOTHING;

-- 2. INTAKE BATCHES
INSERT INTO intake_batches (id, consignor_id, batch_code, pickup_address, pickup_date, estimated_count, actual_count, status, notes, district)
VALUES
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'PT-20260901-001', 'Jl. Surya Kencana No. 45, Cikole', '2026-09-01', 25, 24, 'completed', 'Kantong biru, kondisi rata-rata sangat baik', 'Cikole'),
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 'PT-20260903-002', 'Perum Baros Indah Blok C2 No. 12', '2026-09-03', 20, 20, 'in_qc', 'Sebagian bahan linen dan kemeja kerja', 'Baros'),
    ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'PT-20260905-003', 'Jl. Surya Kencana No. 45, Cikole', '2026-09-06', 15, 0, 'scheduled', 'Titipan batch kedua, slot pagi 09.00-12.00', 'Cikole')
ON CONFLICT (id) DO NOTHING;

-- 3. LIVE SESSIONS
INSERT INTO live_sessions (id, host_id, session_title, platform, start_time, end_time, total_items_sold, total_gmv, host_base_fee, host_commission_earned, is_active)
VALUES
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103', 'TikTok Shopping Sore: Casual Chic & Workwear Sukabumi', 'tiktok', '2026-09-05 16:00:00+07', '2026-09-05 18:00:00+07', 18, 1170000, 60000, 36000, true),
    ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103', 'TikTok Shopping Malam: Gamis Pesta & Branded Tier A', 'tiktok', '2026-09-04 20:00:00+07', '2026-09-04 22:00:00+07', 22, 1870000, 60000, 44000, false)
ON CONFLICT (id) DO NOTHING;

-- 4. CLOTHES ITEMS
INSERT INTO clothes_items (
    id, batch_id, consignor_id, live_session_id, sku, hangtag_number, title, brand, size, chest_width_cm,
    category_tier, floor_price, target_live_price, sold_price, steam_fee, net_payout_amount, status, photo_url,
    consignment_start_date, aging_expiry_date
)
VALUES
    (
        '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301',
        'PT-SM-001-001', 1, 'Zara Floral Tiered Blouse', 'Zara', 'M', 96,
        'tier_a', 55000, 85000, NULL, 2500, NULL, 'ready_for_live',
        'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80', '2026-09-01', '2026-10-01'
    ),
    (
        '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301',
        'PT-SM-001-002', 2, 'Uniqlo Linen Blend Shirt Ivory', 'Uniqlo', 'L', 102,
        'tier_b', 40000, 65000, NULL, 2500, NULL, 'in_live_queue',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', '2026-09-01', '2026-10-01'
    ),
    (
        '44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301',
        'PT-SM-001-003', 3, 'Mango Casual Pleated Culottes', 'Mango', 'M', 74,
        'tier_b', 35000, 55000, 60000, 2500, 32500, 'sold',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', '2026-09-01', '2026-10-01'
    ),
    (
        '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301',
        'PT-SM-001-004', 4, 'Cotton On Basic Ribbed Tee', 'Cotton On', 'S', 88,
        'tier_c', 20000, 35000, 35000, 2500, 17500, 'sold',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', '2026-09-01', '2026-10-01'
    ),
    (
        '44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', NULL,
        'PT-SM-002-005', 5, 'Baju Kurung Batik Sukabumi (Reject Noda)', 'Lokal', 'XL', 108,
        'tier_b', 30000, 50000, NULL, 2500, NULL, 'rejected',
        'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80', '2026-09-03', '2026-10-03'
    )
ON CONFLICT (id) DO NOTHING;

-- Update defect info for reject item
UPDATE clothes_items
SET defect_photo_url = 'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80',
    defect_notes = 'Noda minyak di bagian dada kanan dekat kancing kedua'
WHERE id = '44444444-4444-4444-4444-444444444405';

-- 5. ORDERS
INSERT INTO orders (
    id, live_session_id, order_number, buyer_handle, buyer_name, buyer_phone,
    shipping_address, shipping_city, courier_name, tracking_number, shipping_status,
    subtotal_amount, shipping_fee, total_paid
)
VALUES
    (
        '55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', 'ORD-20260905-001',
        '@siti_ootd', 'Siti Rahma', '0812-9988-7766',
        'Jl. Cikole Dalam No. 14, Cikole', 'Kota Sukabumi', 'J&T Express', 'JT9918273645ID', 'pending_pack',
        60000, 10000, 70000
    ),
    (
        '55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', 'ORD-20260905-002',
        '@dian_fashion', 'Dian Permata', '0878-1122-3344',
        'Jl. Pasundan No. 88, Citamiang', 'Kota Sukabumi', 'Gosend Instant', 'GOSEND-SKB-0905', 'shipped',
        35000, 12000, 47000
    )
ON CONFLICT (id) DO NOTHING;

-- Associate order to items
UPDATE clothes_items SET order_id = '55555555-5555-5555-5555-555555555501' WHERE id = '44444444-4444-4444-4444-444444444403';
UPDATE clothes_items SET order_id = '55555555-5555-5555-5555-555555555502' WHERE id = '44444444-4444-4444-4444-444444444404';

-- 6. PAYOUTS (Past Friday Payout History)
INSERT INTO payouts (
    id, consignor_id, payout_code, period_start, period_end, total_gross_floor,
    total_steam_deduction, total_net_payout, items_count, destination_bank,
    destination_account_number, destination_account_holder, status, transferred_at
)
VALUES
    (
        '66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101', 'PAY-20260829-001',
        '2026-08-22', '2026-08-27', 350000, 17500, 332500, 7, 'BCA',
        '0281928471', 'Ratna Dewi', 'transferred', '2026-08-28 16:00:00+07'
    )
ON CONFLICT (id) DO NOTHING;

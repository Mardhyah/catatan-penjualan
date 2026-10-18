-- ==============================================================
-- SKEMA DATABASE SUPABASE: DATA PENJUALAN 2-STROKE SURABAYA
-- Jalankan skrip SQL ini di menu "SQL Editor" pada dashboard Supabase
-- ==============================================================

-- 1. Buat Tabel penjualan_motor
CREATE TABLE IF NOT EXISTS penjualan_motor (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no INTEGER,
  unit TEXT NOT NULL,
  harga_beli BIGINT NOT NULL DEFAULT 0,
  modal_sendiri BIGINT NOT NULL DEFAULT 0,
  pinjam_ayah BIGINT NOT NULL DEFAULT 0,
  harga_jual BIGINT NOT NULL DEFAULT 0,
  profit BIGINT NOT NULL DEFAULT 0,
  status_unit TEXT NOT NULL DEFAULT 'READY',
  status_pinjaman TEXT NOT NULL DEFAULT 'TIDAK_PINJAM',
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE penjualan_motor ENABLE ROW LEVEL SECURITY;

-- 3. Policy Akses CRUD
DROP POLICY IF EXISTS "Akses publik baca penjualan" ON penjualan_motor;
CREATE POLICY "Akses publik baca penjualan" ON penjualan_motor FOR SELECT USING (true);

DROP POLICY IF EXISTS "Akses publik tambah penjualan" ON penjualan_motor;
CREATE POLICY "Akses publik tambah penjualan" ON penjualan_motor FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Akses publik update penjualan" ON penjualan_motor;
CREATE POLICY "Akses publik update penjualan" ON penjualan_motor FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Akses publik hapus penjualan" ON penjualan_motor;
CREATE POLICY "Akses publik hapus penjualan" ON penjualan_motor FOR DELETE USING (true);

-- 4.  Data 10 Motor Awal 
INSERT INTO penjualan_motor (no, unit, harga_beli, modal_sendiri, pinjam_ayah, harga_jual, profit, status_unit, status_pinjaman, catatan)
VALUES
(1, 'F1ZR 2002 Oranye AG 3371 AJ', 11500000, 11500000, 0, 12300000, 800000, 'SOLD', 'TIDAK_PINJAM', 'Kondisi original mulus, plat AG'),
(2, 'Satria Hiu 2004', 17500000, 12300000, 5200000, 20000000, 2000000, 'SOLD', 'SUDAH_DIKEMBALIKAN', 'Pinjam duit Ayah Rp 5.200.000 sudah dikembalikan saat laku'),
(3, 'F1ZR 2002 Perak (Barat)', 12250000, 12250000, 0, 14500000, 2250000, 'SOLD', 'TIDAK_PINJAM', 'Surat lengkap hidup'),
(4, 'F1ZR 2002 Merah (Jombang)', 11500000, 9000000, 2500000, 12500000, 1000000, 'SOLD', 'SUDAH_DIKEMBALIKAN', 'Pinjam duit Ayah Rp 2.500.000 sudah dikembalikan'),
(5, 'F1ZR 2003 Merah (Kediri ori)', 10800000, 10800000, 0, 13000000, 2200000, 'SOLD', 'TIDAK_PINJAM', 'Cat ori bawaan pabrik'),
(6, 'F1ZR 2002 Perak (S Tuban)', 10800000, 10800000, 0, 12800000, 2000000, 'SOLD', 'TIDAK_PINJAM', 'Plat S Tuban'),
(7, 'Vespa Super 1978', 14000000, 12000000, 2000000, 15000000, 1000000, 'SOLD', 'SUDAH_DIKEMBALIKAN', 'Pinjam duit Ayah Rp 2.000.000 sudah dikembalikan'),
(8, 'F1ZR 2002 Perak', 11000000, 11000000, 0, 13000000, 2000000, 'SOLD', 'TIDAK_PINJAM', 'Restorasi ringan rapi'),
(9, 'F1ZR 2002 Merah', 9500000, 9500000, 0, 12000000, 2500000, 'SOLD', 'TIDAK_PINJAM', 'Modal sendiri'),
(10, 'F1ZR 1998 Hitam', 9300000, 5300000, 4000000, 0, 0, 'READY', 'BELUM_DIKEMBALIKAN', 'Ready di garasi. Pinjam duit Ayah Rp 4.000.000 belum dikembalikan');

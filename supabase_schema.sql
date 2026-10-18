-- ==============================================================
-- SKEMA DATABASE SUPABASE: DATA PENJUALAN 2-STROKE SURABAYA
-- Jalankan skrip SQL ini di menu "SQL Editor" pada dashboard Supabase
-- ==============================================================

-- 1. Buat Tabel penjualan_motor
CREATE TABLE IF NOT EXISTS penjualan_motor (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no INTEGER,
  unit TEXT NOT NULL,
  tempat_beli TEXT DEFAULT '',
  harga_beli BIGINT NOT NULL DEFAULT 0,
  modal_sendiri BIGINT NOT NULL DEFAULT 0,
  pinjam_ayah BIGINT NOT NULL DEFAULT 0,
  harga_jual BIGINT NOT NULL DEFAULT 0,
  profit BIGINT NOT NULL DEFAULT 0,
  status_unit TEXT NOT NULL DEFAULT 'READY',
  status_pinjaman TEXT NOT NULL DEFAULT 'TIDAK_PINJAM',
  foto TEXT DEFAULT '',
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kolom baru jika tabel sudah terlanjur dibuat sebelumnya:
ALTER TABLE penjualan_motor ADD COLUMN IF NOT EXISTS foto TEXT DEFAULT '';
ALTER TABLE penjualan_motor ADD COLUMN IF NOT EXISTS tempat_beli TEXT DEFAULT '';

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

// Skema SQL Supabase untuk referensi
export const SQL_SCHEMA_CODE = `-- 1. Buat Tabel penjualan_motor
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

-- Kolom baru jika tabel sudah ada sebelumnya:
ALTER TABLE penjualan_motor ADD COLUMN IF NOT EXISTS foto TEXT DEFAULT '';
ALTER TABLE penjualan_motor ADD COLUMN IF NOT EXISTS tempat_beli TEXT DEFAULT '';

-- 2. Aktifkan Akses RLS
ALTER TABLE penjualan_motor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Akses publik baca penjualan" ON penjualan_motor FOR SELECT USING (true);
CREATE POLICY "Akses publik tambah penjualan" ON penjualan_motor FOR INSERT WITH CHECK (true);
CREATE POLICY "Akses publik update penjualan" ON penjualan_motor FOR UPDATE USING (true);
CREATE POLICY "Akses publik hapus penjualan" ON penjualan_motor FOR DELETE USING (true);`;

// Data awal sebagai referensi fallback jika diperlukan
export const INITIAL_DATA = [
  {
    id: "1",
    no: 1,
    unit: "F1ZR 2002 Oranye AG 3371 AJ",
    tempatBeli: "Kediri (Plat AG)",
    hargaBeli: 11500000,
    modalSendiri: 11500000,
    pinjamAyah: 0,
    hargaJual: 12300000,
    profit: 800000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    foto: "",
    catatan: "Kondisi original mulus, plat AG"
  },
  {
    id: "2",
    no: 2,
    unit: "Satria Hiu 2004",
    tempatBeli: "Surabaya",
    hargaBeli: 17500000,
    modalSendiri: 12300000,
    pinjamAyah: 5200000,
    hargaJual: 20000000,
    profit: 2000000,
    statusUnit: "SOLD",
    statusPinjaman: "SUDAH_DIKEMBALIKAN",
    foto: "",
    catatan: "Pinjam duit Ayah Rp 5.200.000 sudah dikembalikan saat laku"
  },
  {
    id: "3",
    no: 3,
    unit: "F1ZR 2002 Perak (Barat)",
    tempatBeli: "Surabaya Barat",
    hargaBeli: 12250000,
    modalSendiri: 12250000,
    pinjamAyah: 0,
    hargaJual: 14500000,
    profit: 2250000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    foto: "",
    catatan: "Surat lengkap hidup"
  },
  {
    id: "4",
    no: 4,
    unit: "F1ZR 2002 Merah (Jombang)",
    tempatBeli: "Jombang",
    hargaBeli: 11500000,
    modalSendiri: 9000000,
    pinjamAyah: 2500000,
    hargaJual: 12500000,
    profit: 1000000,
    statusUnit: "SOLD",
    statusPinjaman: "SUDAH_DIKEMBALIKAN",
    foto: "",
    catatan: "Pinjam duit Ayah Rp 2.500.000 sudah dikembalikan"
  },
  {
    id: "5",
    no: 5,
    unit: "F1ZR 2003 Merah (Kediri ori)",
    tempatBeli: "Kediri",
    hargaBeli: 10800000,
    modalSendiri: 10800000,
    pinjamAyah: 0,
    hargaJual: 13000000,
    profit: 2200000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    foto: "",
    catatan: "Cat ori bawaan pabrik"
  },
  {
    id: "6",
    no: 6,
    unit: "F1ZR 2002 Perak (S Tuban)",
    tempatBeli: "Tuban",
    hargaBeli: 10800000,
    modalSendiri: 10800000,
    pinjamAyah: 0,
    hargaJual: 12800000,
    profit: 2000000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    foto: "",
    catatan: "Plat S Tuban"
  },
  {
    id: "7",
    no: 7,
    unit: "Vespa Super 1978",
    tempatBeli: "Surabaya",
    hargaBeli: 14000000,
    modalSendiri: 12000000,
    pinjamAyah: 2000000,
    hargaJual: 15000000,
    profit: 1000000,
    statusUnit: "SOLD",
    statusPinjaman: "SUDAH_DIKEMBALIKAN",
    foto: "",
    catatan: "Pinjam duit Ayah Rp 2.000.000 sudah dikembalikan"
  },
  {
    id: "8",
    no: 8,
    unit: "F1ZR 2002 Perak",
    tempatBeli: "Surabaya",
    hargaBeli: 11000000,
    modalSendiri: 11000000,
    pinjamAyah: 0,
    hargaJual: 13000000,
    profit: 2000000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    foto: "",
    catatan: "Restorasi ringan rapi"
  },
  {
    id: "9",
    no: 9,
    unit: "F1ZR 2002 Merah",
    tempatBeli: "Surabaya",
    hargaBeli: 9500000,
    modalSendiri: 9500000,
    pinjamAyah: 0,
    hargaJual: 12000000,
    profit: 2500000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    foto: "",
    catatan: "Modal sendiri"
  },
  {
    id: "10",
    no: 10,
    unit: "F1ZR 1998 Hitam",
    tempatBeli: "Surabaya",
    hargaBeli: 9300000,
    modalSendiri: 5300000,
    pinjamAyah: 4000000,
    hargaJual: 0,
    profit: 0,
    statusUnit: "READY",
    statusPinjaman: "BELUM_DIKEMBALIKAN",
    foto: "",
    catatan: "Ready di garasi. Duit Ayah Rp 4.000.000 belum dikembalikan"
  }
];

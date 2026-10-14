# Data Penjualan 2-Stroke Surabaya (Belian Akbar)

Sistem pembukuan kas, kalkulasi profit penjualan motor 2-stroke, dan pelacak pengembalian dana talangan ("Pinjam Duit Ayah").

## Fitur Utama
- **Ringkasan Keuangan (KPI)**:
  - Total Keuntungan Bersih (Akumulasi profit unit terjual)
  - Duit Ayah Belum Balik (Pelacak otomatis dana talangan Ayah)
  - Total Penjualan (SOLD / Omset)
  - Modal Tertahan Garasi (Unit ready stock)
- **Tabel & Kartu Garasi**:
  - Pemisahan kolom transparan: **Harga Beli Total**, **Modal Sendiri**, dan **Pinjam Duit Ayah**.
  - Status unit: `SOLD` & `READY`.
  - Status pinjaman: `✓ Lunas` & `Belum Balik`.
- **Manajemen Unit**:
  - Tambah motor baru (kalkulasi otomatis Modal Sendiri = Harga Beli - Pinjam Ayah).
  - Jual unit motor (input harga laku & status pengembalian duit Ayah).
  - Edit & hapus data motor.
  - Tombol cepat "Balikin Duit Ayah".
- **Ekspor Data**: Unduh data dalam format CSV untuk dibuka di Microsoft Excel.
- **Penyimpanan Lokal**: Otomatis tersimpan di LocalStorage browser.

## Teknologi
- Next.js (App Router)
- React
- Vanilla CSS (Tema Modern Royal Navy)
- Lucide React Icons

## Menjalankan Aplikasi
```bash
npm install
npm run dev
```
Buka di browser: [http://localhost:3000](http://localhost:3000).

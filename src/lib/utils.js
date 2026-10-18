// Format integer ke format mata uang Rupiah
export const formatRupiah = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(val);
};

// Format tanggal ke format Indonesia ringkas (misal: 18 Okt 2026)
export const formatTanggalIndo = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(d);
};

// Format bulan dan tahun Indonesia (misal: Oktober 2026)
export const formatBulanTahun = (val) => {
  if (!val) return "-";
  let d;
  if (typeof val === "string" && val.length === 7) {
    // format YYYY-MM
    const [year, month] = val.split("-");
    d = new Date(Number(year), Number(month) - 1, 1);
  } else {
    d = new Date(val);
  }
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric"
  }).format(d);
};

// Ambil format YYYY-MM dari string tanggal
export const getYearMonth = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

// Mapper dari Supabase (snake_case -> camelCase)
export const mapFromSupabase = (row) => ({
  id: row.id.toString(),
  no: row.no,
  unit: row.unit,
  tempatBeli: row.tempat_beli || row.lokasi_beli || "",
  hargaBeli: Number(row.harga_beli) || 0,
  modalSendiri: Number(row.modal_sendiri) || 0,
  pinjamAyah: Number(row.pinjam_ayah) || 0,
  hargaJual: Number(row.harga_jual) || 0,
  profit: Number(row.profit) || 0,
  statusUnit: row.status_unit || "READY",
  statusPinjaman: row.status_pinjaman || "TIDAK_PINJAM",
  foto: row.foto || "",
  catatan: row.catatan || "",
  createdAt: row.created_at || new Date().toISOString()
});

// Mapper ke Supabase (camelCase -> snake_case)
export const mapToSupabase = (item) => ({
  no: item.no,
  unit: item.unit,
  tempat_beli: item.tempatBeli || "",
  harga_beli: Number(item.hargaBeli) || 0,
  modal_sendiri: Number(item.modalSendiri) || 0,
  pinjam_ayah: Number(item.pinjamAyah) || 0,
  harga_jual: Number(item.hargaJual) || 0,
  profit: Number(item.profit) || 0,
  status_unit: item.statusUnit,
  status_pinjaman: item.statusPinjaman,
  foto: item.foto || "",
  catatan: item.catatan || "",
  created_at: item.createdAt || new Date().toISOString()
});

// Kompresi foto di sisi browser (Max 800px dimensi, ~80-120KB)
export const compressPhoto = (file, callback) => {
  if (!file || !file.type.startsWith("image/")) {
    alert("Harap pilih file gambar (JPG, PNG, WEBP)!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
      callback(compressedBase64);
    };
    img.src = readerEvent.target.result;
  };
  reader.readAsDataURL(file);
};

// Export array units ke CSV dan unduh di browser
export const exportToCSV = (units) => {
  let csv = "No,Tanggal,Unit Motor,Tempat Beli,Harga Beli Total,Modal Sendiri,Duit Ayah,Status Pinjaman,Harga Terjual,Profit Bersih,Status Unit,Catatan\n";
  
  units.forEach((u, i) => {
    const modalS = u.modalSendiri ?? (u.hargaBeli - (u.pinjamAyah || 0));
    const row = [
      i + 1,
      `"${formatTanggalIndo(u.createdAt)}"`,
      `"${u.unit.replace(/"/g, '""')}"`,
      `"${(u.tempatBeli || "").replace(/"/g, '""')}"`,
      u.hargaBeli,
      modalS,
      u.pinjamAyah,
      u.statusPinjaman,
      u.statusUnit === "SOLD" ? u.hargaJual : 0,
      u.profit,
      u.statusUnit,
      `"${(u.catatan || "").replace(/"/g, '""')}"`
    ];
    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `penjualan_2stroke_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

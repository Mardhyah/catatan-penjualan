"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Download, 
  TrendingUp, 
  Banknote, 
  Package, 
  ArrowUpRight, 
  Edit2, 
  Trash2, 
  Check, 
  RotateCcw,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";

// Data riil 100% persis dari foto spreadsheet "BELIAN AKBAR"
const INITIAL_DATA = [
  {
    id: "1",
    no: 1,
    unit: "F1ZR 2002 Oranye AG 3371 AJ",
    hargaBeli: 11500000,
    modalSendiri: 11500000,
    pinjamAyah: 0,
    rincianText: "",
    hargaJual: 12300000,
    profit: 800000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    catatan: "Kondisi original mulus, plat AG"
  },
  {
    id: "2",
    no: 2,
    unit: "Satria Hiu 2004",
    hargaBeli: 17500000,
    modalSendiri: 12300000,
    pinjamAyah: 5200000,
    rincianText: "12.300.000 + (ayah 5.200.000)",
    hargaJual: 20000000,
    profit: 2000000,
    statusUnit: "SOLD",
    statusPinjaman: "SUDAH_DIKEMBALIKAN",
    catatan: "Pinjam duit Ayah Rp 5.200.000 sudah dikembalikan saat laku"
  },
  {
    id: "3",
    no: 3,
    unit: "F1ZR 2002 Perak (Barat)",
    hargaBeli: 12250000,
    modalSendiri: 12250000,
    pinjamAyah: 0,
    rincianText: "",
    hargaJual: 14500000,
    profit: 2250000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    catatan: "Surat lengkap hidup"
  },
  {
    id: "4",
    no: 4,
    unit: "F1ZR 2002 Merah (Jombang)",
    hargaBeli: 11500000,
    modalSendiri: 9000000,
    pinjamAyah: 2500000,
    rincianText: "9.000.000 + (ayah 2.500.000)",
    hargaJual: 12500000,
    profit: 1000000,
    statusUnit: "SOLD",
    statusPinjaman: "SUDAH_DIKEMBALIKAN",
    catatan: "Pinjam duit Ayah Rp 2.500.000 sudah dikembalikan"
  },
  {
    id: "5",
    no: 5,
    unit: "F1ZR 2003 Merah (Kediri ori)",
    hargaBeli: 10800000,
    modalSendiri: 10800000,
    pinjamAyah: 0,
    rincianText: "",
    hargaJual: 13000000,
    profit: 2200000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    catatan: "Cat ori bawaan pabrik"
  },
  {
    id: "6",
    no: 6,
    unit: "F1ZR 2002 Perak (S Tuban)",
    hargaBeli: 10800000,
    modalSendiri: 10800000,
    pinjamAyah: 0,
    rincianText: "",
    hargaJual: 12800000,
    profit: 2000000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    catatan: "Plat S Tuban"
  },
  {
    id: "7",
    no: 7,
    unit: "Vespa Super 1978",
    hargaBeli: 14000000,
    modalSendiri: 12000000,
    pinjamAyah: 2000000,
    rincianText: "12.000.000 + (ayah 2.000.000)",
    hargaJual: 15000000,
    profit: 1000000,
    statusUnit: "SOLD",
    statusPinjaman: "SUDAH_DIKEMBALIKAN",
    catatan: "Pinjam duit Ayah Rp 2.000.000 sudah dikembalikan"
  },
  {
    id: "8",
    no: 8,
    unit: "F1ZR 2002 Perak",
    hargaBeli: 11000000,
    modalSendiri: 11000000,
    pinjamAyah: 0,
    rincianText: "",
    hargaJual: 13000000,
    profit: 2000000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    catatan: "Restorasi ringan rapi"
  },
  {
    id: "9",
    no: 9,
    unit: "F1ZR 2002 Merah",
    hargaBeli: 9500000,
    modalSendiri: 9500000,
    pinjamAyah: 0,
    rincianText: "",
    hargaJual: 12000000,
    profit: 2500000,
    statusUnit: "SOLD",
    statusPinjaman: "TIDAK_PINJAM",
    catatan: "Modal sendiri"
  },
  {
    id: "10",
    no: 10,
    unit: "F1ZR 1998 Hitam",
    hargaBeli: 9300000,
    modalSendiri: 5300000,
    pinjamAyah: 4000000,
    rincianText: "5.300.000 + (ayah 4.000.000)",
    hargaJual: 0,
    profit: 0,
    statusUnit: "READY",
    statusPinjaman: "BELUM_DIKEMBALIKAN",
    catatan: "Ready di garasi. Pinjam duit Ayah Rp 4.000.000 belum dikembalikan"
  }
];

// Currency Formatter
const formatRupiah = (val) => {
  if (val === undefined || val === null || isNaN(val) || val === 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(val);
};

export default function PremiumCleanPage() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, READY, SOLD
  const [filterPinjaman, setFilterPinjaman] = useState("ALL"); // ALL, PENDING
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    unit: "",
    hargaBeli: "",
    modalSendiri: "",
    pinjamAyah: "",
    hargaJual: "",
    profit: "",
    statusUnit: "READY",
    catatan: ""
  });

  const [sellPriceInput, setSellPriceInput] = useState("");
  const [kembalikanDuitAyahSaatJual, setKembalikanDuitAyahSaatJual] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("penjualan_2stroke_clean_v5");
    if (saved) {
      try {
        setUnits(JSON.parse(saved));
      } catch (e) {
        setUnits(INITIAL_DATA);
      }
    } else {
      setUnits(INITIAL_DATA);
    }
  }, []);

  const saveUnits = (newUnits) => {
    setUnits(newUnits);
    localStorage.setItem("penjualan_2stroke_clean_v5", JSON.stringify(newUnits));
  };

  const handleResetData = () => {
    if (confirm("Kembalikan data ke daftar foto spreadsheet asli?")) {
      saveUnits(INITIAL_DATA);
    }
  };

  // Quick Action: Kembalikan Duit Ayah
  const handleMarkDuitAyahKembali = (id) => {
    const updated = units.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          statusPinjaman: "SUDAH_DIKEMBALIKAN",
          catatan: (u.catatan ? u.catatan + " | " : "") + "Duit Ayah sudah dikembalikan lunas."
        };
      }
      return u;
    });
    saveUnits(updated);
  };

  // Open Sell Modal
  const openSellModal = (unit) => {
    setSelectedUnit(unit);
    setSellPriceInput(unit.hargaBeli ? (unit.hargaBeli + 2000000).toString() : "");
    setKembalikanDuitAyahSaatJual(unit.pinjamAyah > 0);
    setShowSellModal(true);
  };

  // Confirm Sell
  const handleConfirmSell = () => {
    if (!selectedUnit || !sellPriceInput) return;
    const jual = Number(sellPriceInput) || 0;
    const profit = jual - selectedUnit.hargaBeli;

    const updated = units.map((u) => {
      if (u.id === selectedUnit.id) {
        return {
          ...u,
          hargaJual: jual,
          statusUnit: "SOLD",
          profit: profit,
          statusPinjaman: (u.pinjamAyah > 0 && kembalikanDuitAyahSaatJual) ? "SUDAH_DIKEMBALIKAN" : u.statusPinjaman,
          catatan: (u.catatan ? u.catatan + " | " : "") + `Terjual ${formatRupiah(jual)}`
        };
      }
      return u;
    });

    saveUnits(updated);
    setShowSellModal(false);
    setSelectedUnit(null);
  };

  // Open Edit Modal
  const openEditModal = (unit) => {
    setSelectedUnit(unit);
    setFormData({
      unit: unit.unit,
      hargaBeli: unit.hargaBeli.toString(),
      modalSendiri: unit.modalSendiri.toString(),
      pinjamAyah: unit.pinjamAyah.toString(),
      hargaJual: unit.hargaJual ? unit.hargaJual.toString() : "",
      profit: unit.profit ? unit.profit.toString() : "",
      statusUnit: unit.statusUnit,
      catatan: unit.catatan || ""
    });
    setShowEditModal(true);
  };

  // Save Edit
  const handleSaveEdit = () => {
    if (!selectedUnit || !formData.unit) return;
    const beli = Number(formData.hargaBeli) || 0;
    const modalS = Number(formData.modalSendiri) || 0;
    const pinjamA = Number(formData.pinjamAyah) || 0;
    const jual = Number(formData.hargaJual) || 0;
    const isSold = formData.statusUnit === "SOLD";
    const profit = isSold ? (formData.profit ? Number(formData.profit) : jual - beli) : 0;

    let pinjamanStatus = selectedUnit.statusPinjaman;
    if (pinjamA === 0) {
      pinjamanStatus = "TIDAK_PINJAM";
    } else if (pinjamanStatus === "TIDAK_PINJAM") {
      pinjamanStatus = "BELUM_DIKEMBALIKAN";
    }

    let rincianText = "";
    if (pinjamA > 0) {
      rincianText = `${new Intl.NumberFormat("id-ID").format(modalS)} + (ayah ${new Intl.NumberFormat("id-ID").format(pinjamA)})`;
    }

    const updated = units.map((u) => {
      if (u.id === selectedUnit.id) {
        return {
          ...u,
          unit: formData.unit,
          hargaBeli: beli,
          modalSendiri: modalS,
          pinjamAyah: pinjamA,
          rincianText: rincianText,
          hargaJual: jual,
          profit: profit,
          statusUnit: formData.statusUnit,
          statusPinjaman: pinjamanStatus,
          catatan: formData.catatan
        };
      }
      return u;
    });

    saveUnits(updated);
    setShowEditModal(false);
    setSelectedUnit(null);
  };

  // Delete Unit
  const handleDeleteUnit = (id) => {
    if (confirm("Hapus catatan unit ini?")) {
      saveUnits(units.filter((u) => u.id !== id));
    }
  };

  // Submit Add New Unit
  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!formData.unit || !formData.hargaBeli) {
      alert("Harap isi nama unit dan harga beli!");
      return;
    }

    const beli = Number(formData.hargaBeli) || 0;
    const pinjamA = Number(formData.pinjamAyah) || 0;
    const modalS = Number(formData.modalSendiri) || (beli - pinjamA);
    const isSold = formData.statusUnit === "SOLD";
    const jual = isSold ? Number(formData.hargaJual) || 0 : 0;
    const profit = isSold ? (formData.profit ? Number(formData.profit) : jual - beli) : 0;

    let rincianText = "";
    if (pinjamA > 0) {
      rincianText = `${new Intl.NumberFormat("id-ID").format(modalS)} + (ayah ${new Intl.NumberFormat("id-ID").format(pinjamA)})`;
    }

    const newUnit = {
      id: Date.now().toString(),
      no: units.length + 1,
      unit: formData.unit,
      hargaBeli: beli,
      modalSendiri: modalS,
      pinjamAyah: pinjamA,
      rincianText: rincianText,
      hargaJual: jual,
      profit: profit,
      statusUnit: formData.statusUnit,
      statusPinjaman: pinjamA > 0 ? "BELUM_DIKEMBALIKAN" : "TIDAK_PINJAM",
      catatan: formData.catatan
    };

    saveUnits([...units, newUnit]);
    setShowAddModal(false);
    setFormData({
      unit: "",
      hargaBeli: "",
      modalSendiri: "",
      pinjamAyah: "",
      hargaJual: "",
      profit: "",
      statusUnit: "READY",
      catatan: ""
    });
  };

  const handleBeliChange = (val) => {
    const beli = Number(val) || 0;
    const pinjam = Number(formData.pinjamAyah) || 0;
    setFormData((prev) => ({
      ...prev,
      hargaBeli: val,
      modalSendiri: Math.max(0, beli - pinjam).toString()
    }));
  };

  const handlePinjamanChange = (val) => {
    const pinjam = Number(val) || 0;
    const beli = Number(formData.hargaBeli) || 0;
    setFormData((prev) => ({
      ...prev,
      pinjamAyah: val,
      modalSendiri: Math.max(0, beli - pinjam).toString()
    }));
  };

  const handleModalSendiriChange = (val) => {
    const modal = Number(val) || 0;
    const pinjam = Number(formData.pinjamAyah) || 0;
    setFormData((prev) => ({
      ...prev,
      modalSendiri: val,
      hargaBeli: (modal + pinjam).toString()
    }));
  };

  // Plain KPI Statistics (No progress bars)
  const stats = useMemo(() => {
    let totalUnit = units.length;
    let unitSold = 0;
    let unitReady = 0;
    let totalOmset = 0;
    let totalProfit = 0;
    let modalTertahanReady = 0;
    let duitAyahBelumKembali = 0;
    let pendingLoanUnitsCount = 0;

    units.forEach((u) => {
      if (u.statusUnit === "SOLD") {
        unitSold += 1;
        totalOmset += Number(u.hargaJual || 0);
        totalProfit += Number(u.profit || 0);
      } else {
        unitReady += 1;
        modalTertahanReady += Number(u.hargaBeli || 0);
      }

      if (u.pinjamAyah > 0 && u.statusPinjaman === "BELUM_DIKEMBALIKAN") {
        duitAyahBelumKembali += Number(u.pinjamAyah);
        pendingLoanUnitsCount += 1;
      }
    });

    return {
      totalUnit,
      unitSold,
      unitReady,
      totalOmset,
      totalProfit,
      modalTertahanReady,
      duitAyahBelumKembali,
      pendingLoanUnitsCount
    };
  }, [units]);

  // Filtered List
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchSearch = 
        u.unit.toLowerCase().includes(search.toLowerCase()) ||
        (u.catatan && u.catatan.toLowerCase().includes(search.toLowerCase()));

      let matchStatus = true;
      if (filterStatus === "READY") matchStatus = u.statusUnit === "READY";
      if (filterStatus === "SOLD") matchStatus = u.statusUnit === "SOLD";

      let matchPinjaman = true;
      if (filterPinjaman === "PENDING") {
        matchPinjaman = u.pinjamAyah > 0 && u.statusPinjaman === "BELUM_DIKEMBALIKAN";
      }

      return matchSearch && matchStatus && matchPinjaman;
    });
  }, [units, search, filterStatus, filterPinjaman]);

  // Export CSV
  const handleExportCSV = () => {
    let csv = "No,Unit Motor,Harga Beli Total,Modal Sendiri,Pinjam Duit Ayah,Status Pinjaman,Harga Terjual (SOLD),Profit Bersih,Status Unit,Catatan\n";
    
    units.forEach((u, i) => {
      const modalS = u.modalSendiri ?? (u.hargaBeli - (u.pinjamAyah || 0));
      const row = [
        i + 1,
        `"${u.unit.replace(/"/g, '""')}"`,
        u.hargaBeli,
        modalS,
        u.pinjamAyah,
        u.pinjamAyah > 0 ? (u.statusPinjaman === "BELUM_DIKEMBALIKAN" ? "Belum Balik" : "Sudah Lunas") : "Tidak Pinjam",
        u.hargaJual || 0,
        u.profit || 0,
        u.statusUnit,
        `"${(u.catatan || "").replace(/"/g, '""')}"`
      ];
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `penjualan_2stroke_surabaya_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="header-bar">
        <div className="brand-wrapper">
          <div className="brand-icon-box">2T</div>
          <div className="brand-text">
            <h1>DATA PENJUALAN 2 STROKE SURABAYA</h1>
            <p>Sistem Pembukuan Kas, Profit & Pelacak Pinjam Duit Ayah (Belian Akbar)</p>
          </div>
        </div>

        <div className="header-tools">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleExportCSV}
            title="Download file CSV untuk dibuka di Excel"
          >
            <Download size={14} /> Unduh CSV
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleResetData}
            title="Kembalikan data sesuai foto spreadsheet asli"
          >
            <RotateCcw size={14} /> Reset Data Asli
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={15} /> Tambah Unit
          </button>
        </div>
      </header>

      {/* Overview Cards (Polos & Bersih, Tetap Menarik) */}
      <section className="bento-grid">
        {/* Card 1: Profit */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="card-indicator indicator-profit" />
              <span className="bento-label">Total Keuntungan Bersih</span>
            </div>
          </div>
          <div className="bento-val">{formatRupiah(stats.totalProfit)}</div>
          <div className="bento-footer">
            Akumulasi dari {stats.unitSold} unit motor yang sudah laku
          </div>
        </div>

        {/* Card 2: Duit Ayah */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="card-indicator indicator-danger" />
              <span className="bento-label">Duit Ayah (Belum Balik)</span>
            </div>
          </div>
          <div className="bento-val">{formatRupiah(stats.duitAyahBelumKembali)}</div>
          <div className="bento-footer">
            {stats.duitAyahBelumKembali > 0 
              ? `Wajib dikembalikan ke Ayah (${stats.pendingLoanUnitsCount} unit belum lunas)` 
              : "Semua pinjaman Ayah sudah lunas dikembalikan"}
          </div>
        </div>

        {/* Card 3: Omset */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="card-indicator indicator-blue" />
              <span className="bento-label">Total Penjualan (SOLD)</span>
            </div>
          </div>
          <div className="bento-val">{formatRupiah(stats.totalOmset)}</div>
          <div className="bento-footer">
            Total penerimaan dari {stats.unitSold} unit motor terjual
          </div>
        </div>

        {/* Card 4: Modal Ready */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="card-indicator indicator-amber" />
              <span className="bento-label">Modal Tertahan Garasi</span>
            </div>
          </div>
          <div className="bento-val">{formatRupiah(stats.modalTertahanReady)}</div>
          <div className="bento-footer">
            {stats.unitReady} unit sedang ready stock di garasi
          </div>
        </div>
      </section>

      {/* Action Controls & View Switcher */}
      <div className="action-controls-bar">
        {/* Search Input */}
        <div className="search-input-wrap">
          <Search className="search-icon-svg" size={15} />
          <input 
            type="text" 
            placeholder="Cari motor (F1ZR, Satria Hiu, Vespa, plat nomor, kota)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-field"
          />
        </div>

        {/* Segmented Filter Pills */}
        <div className="segmented-control">
          <button 
            className={`segment-btn ${filterStatus === "ALL" && filterPinjaman === "ALL" ? "active" : ""}`}
            onClick={() => { setFilterStatus("ALL"); setFilterPinjaman("ALL"); }}
          >
            Semua ({units.length})
          </button>
          <button 
            className={`segment-btn ${filterStatus === "READY" ? "active" : ""}`}
            onClick={() => { setFilterStatus("READY"); setFilterPinjaman("ALL"); }}
          >
            Ready Stock ({stats.unitReady})
          </button>
          <button 
            className={`segment-btn ${filterStatus === "SOLD" ? "active" : ""}`}
            onClick={() => { setFilterStatus("SOLD"); setFilterPinjaman("ALL"); }}
          >
            Terjual / SOLD ({stats.unitSold})
          </button>
          <button 
            className={`segment-btn ${filterPinjaman === "PENDING" ? "active-danger" : ""}`}
            onClick={() => { setFilterPinjaman(filterPinjaman === "PENDING" ? "ALL" : "PENDING"); setFilterStatus("ALL"); }}
            title="Tampilkan hanya unit yang ada pinjaman duit Ayah yang belum dikembalikan"
          >
            Duit Ayah Belum Balik ({units.filter(u => u.pinjamAyah > 0 && u.statusPinjaman === 'BELUM_DIKEMBALIKAN').length})
          </button>
        </div>

        {/* View Switcher: Table vs Cards */}
        <div className="view-switch">
          <button 
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Tampilan Tabel Detail"
          >
            <TableIcon size={14} /> Tabel
          </button>
          <button 
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Tampilan Kartu Garasi"
          >
            <LayoutGrid size={14} /> Kartu Unit
          </button>
        </div>
      </div>

      {/* VIEW 1: TABLE MODE */}
      {viewMode === "table" ? (
        <div className="table-card">
          <table className="clean-table">
            <thead>
              <tr>
                <th style={{ width: "45px" }}>No</th>
                <th>Unit Motor</th>
                <th>Harga Beli Total</th>
                <th>Modal Sendiri</th>
                <th>Pinjam Duit Ayah</th>
                <th>Harga Terjual (SOLD)</th>
                <th>Profit Bersih</th>
                <th>Status Unit</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    Tidak ada data motor yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((item, idx) => {
                  const hasLoan = item.pinjamAyah > 0;
                  const isLoanPending = hasLoan && item.statusPinjaman === "BELUM_DIKEMBALIKAN";
                  const modalSendiri = item.modalSendiri ?? (item.hargaBeli - (item.pinjamAyah || 0));

                  return (
                    <tr key={item.id}>
                      {/* No */}
                      <td className="mono-num" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                        {idx + 1}
                      </td>

                      {/* Unit */}
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-dark)" }}>
                          {item.unit}
                        </div>
                        {item.catatan && (
                          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {item.catatan}
                          </div>
                        )}
                      </td>

                      {/* Harga Beli Total */}
                      <td className="mono-num" style={{ fontWeight: 700, color: "var(--text-dark)" }}>
                        {formatRupiah(item.hargaBeli)}
                      </td>

                      {/* Modal Sendiri */}
                      <td className="mono-num" style={{ fontWeight: 600, color: "var(--text-body)" }}>
                        {formatRupiah(modalSendiri)}
                      </td>

                      {/* Pinjam Duit Ayah */}
                      <td>
                        {!hasLoan ? (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                        ) : isLoanPending ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <strong className="mono-num" style={{ color: "var(--color-danger)" }}>
                              {formatRupiah(item.pinjamAyah)}
                            </strong>
                            <span className="badge-pill badge-loan-pending-style" style={{ fontSize: "10.5px" }}>
                              Belum Balik
                            </span>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "2px 7px", fontSize: "11px" }}
                              title="Klik jika duit Ayah sudah Anda kembalikan"
                              onClick={() => handleMarkDuitAyahKembali(item.id)}
                            >
                              <Check size={11} /> Balikin
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span className="mono-num" style={{ color: "var(--text-body)" }}>
                              {formatRupiah(item.pinjamAyah)}
                            </span>
                            <span className="badge-pill badge-loan-settled-style" style={{ fontSize: "10.5px" }}>
                              ✓ Lunas
                            </span>
                          </div>
                        )}
                      </td>

                      {/* SOLD Price */}
                      <td className="mono-num" style={{ fontWeight: 700 }}>
                        {item.statusUnit === "SOLD" ? (
                          formatRupiah(item.hargaJual)
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "12px" }}>
                            Belum laku
                          </span>
                        )}
                      </td>

                      {/* Profit */}
                      <td className="mono-num">
                        {item.statusUnit === "SOLD" ? (
                          <span style={{ color: "var(--emerald-main)", fontWeight: 700 }}>
                            +{formatRupiah(item.profit)}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>-</span>
                        )}
                      </td>

                      {/* Status Unit */}
                      <td>
                        <span className={`badge-pill ${item.statusUnit === "SOLD" ? "badge-sold-style" : "badge-ready-style"}`}>
                          {item.statusUnit === "SOLD" ? "SOLD" : "READY"}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          {item.statusUnit === "READY" && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openSellModal(item)}
                              title="Tandai unit laku terjual dan hitung profit"
                            >
                              <ArrowUpRight size={13} /> Jual
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "6px" }}
                            onClick={() => openEditModal(item)}
                            title="Edit catatan"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "6px", color: "var(--rose-main)" }}
                            onClick={() => handleDeleteUnit(item.id)}
                            title="Hapus unit"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW 2: GARAGE CARDS GRID MODE */
        <div className="garage-grid">
          {filteredUnits.map((item, idx) => {
            const hasLoan = item.pinjamAyah > 0;
            const isLoanPending = hasLoan && item.statusPinjaman === "BELUM_DIKEMBALIKAN";
            const modalSendiri = item.modalSendiri ?? (item.hargaBeli - (item.pinjamAyah || 0));

            return (
              <div className="unit-card" key={item.id}>
                <div>
                  <div className="unit-card-header">
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>#{idx + 1}</span>
                      <h4 className="unit-title">{item.unit}</h4>
                    </div>
                    <span className={`badge-pill ${item.statusUnit === "SOLD" ? "badge-sold-style" : "badge-ready-style"}`}>
                      {item.statusUnit === "SOLD" ? "SOLD" : "READY"}
                    </span>
                  </div>

                  <div className="unit-card-body">
                    <div className="unit-metric-row">
                      <span style={{ color: "var(--text-muted)" }}>Harga Beli Total:</span>
                      <strong className="mono-num">{formatRupiah(item.hargaBeli)}</strong>
                    </div>

                    <div className="unit-metric-row">
                      <span style={{ color: "var(--text-muted)" }}>Modal Sendiri:</span>
                      <strong className="mono-num">{formatRupiah(modalSendiri)}</strong>
                    </div>

                    <div className="unit-metric-row">
                      <span style={{ color: "var(--text-muted)" }}>Pinjam Duit Ayah:</span>
                      {hasLoan ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <strong className="mono-num" style={{ color: isLoanPending ? "var(--color-danger)" : "var(--text-body)" }}>
                            {formatRupiah(item.pinjamAyah)}
                          </strong>
                          <span className={`badge-pill ${isLoanPending ? "badge-loan-pending-style" : "badge-loan-settled-style"}`} style={{ fontSize: "10px" }}>
                            {isLoanPending ? "Belum Balik" : "✓ Lunas"}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>- (Modal Sendiri)</span>
                      )}
                    </div>

                    <div className="unit-metric-row" style={{ marginTop: "4px", paddingTop: "4px", borderTop: "1px dashed var(--border-light)" }}>
                      <span style={{ color: "var(--text-muted)" }}>Harga Terjual:</span>
                      <strong className="mono-num">{item.statusUnit === "SOLD" ? formatRupiah(item.hargaJual) : "Belum Laku"}</strong>
                    </div>

                    {item.statusUnit === "SOLD" && (
                      <div className="unit-metric-row">
                        <span style={{ color: "var(--emerald-main)", fontWeight: 700 }}>Profit Bersih:</span>
                        <strong className="mono-num" style={{ color: "var(--emerald-main)", fontWeight: 800, fontSize: "14px" }}>
                          +{formatRupiah(item.profit)}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="unit-card-actions">
                  <div>
                    {isLoanPending && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "11px", padding: "4px 8px" }}
                        onClick={() => handleMarkDuitAyahKembali(item.id)}
                      >
                        <Check size={11} /> Balikin Duit Ayah
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    {item.statusUnit === "READY" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openSellModal(item)}
                      >
                        <ArrowUpRight size={13} /> Jual Unit
                      </button>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "6px" }}
                      onClick={() => openEditModal(item)}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Tambah Unit Baru */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Tambah Catatan Unit Motor Baru</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddUnit}>
              <div className="modal-content-body">
                <div className="field-group">
                  <label className="field-label">Nama & Keterangan Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: F1ZR 2002 Merah Putih (Kediri)"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="field-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Status Unit</label>
                  <select
                    value={formData.statusUnit}
                    onChange={(e) => setFormData({ ...formData, statusUnit: e.target.value })}
                    className="field-select"
                  >
                    <option value="READY">Ready Stock</option>
                    <option value="SOLD">Sudah Terjual (SOLD)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Total Harga Beli (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="12000000"
                    value={formData.hargaBeli}
                    onChange={(e) => handleBeliChange(e.target.value)}
                    className="field-input"
                  />
                  <span className="field-helper">
                    Nominal: {formatRupiah(Number(formData.hargaBeli) || 0)}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="field-group">
                    <label className="field-label">Modal Sendiri (Rp)</label>
                    <input
                      type="number"
                      placeholder="Otomatis terhitung"
                      value={formData.modalSendiri}
                      onChange={(e) => handleModalSendiriChange(e.target.value)}
                      className="field-input"
                    />
                    <span className="field-helper" style={{ color: "var(--color-profit)" }}>
                      {formatRupiah(Number(formData.modalSendiri) || 0)}
                    </span>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Pinjam Duit Ayah (Rp)</label>
                    <input
                      type="number"
                      placeholder="0 jika modal sendiri"
                      value={formData.pinjamAyah}
                      onChange={(e) => handlePinjamanChange(e.target.value)}
                      className="field-input"
                    />
                    <span className="field-helper" style={{ color: Number(formData.pinjamAyah) > 0 ? "var(--color-danger)" : "var(--text-muted)" }}>
                      {formatRupiah(Number(formData.pinjamAyah) || 0)}
                    </span>
                  </div>
                </div>

                {formData.statusUnit === "SOLD" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="field-group">
                      <label className="field-label">Harga Terjual / SOLD (Rp) *</label>
                      <input
                        type="number"
                        required
                        placeholder="14500000"
                        value={formData.hargaJual}
                        onChange={(e) => {
                          const j = Number(e.target.value) || 0;
                          const b = Number(formData.hargaBeli) || 0;
                          setFormData({ ...formData, hargaJual: e.target.value, profit: (j - b).toString() });
                        }}
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Profit Bersih (Rp)</label>
                      <input
                        type="number"
                        placeholder="Profit"
                        value={formData.profit}
                        onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                        className="field-input"
                      />
                    </div>
                  </div>
                )}

                <div className="field-group">
                  <label className="field-label">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pajak hidup, plat L Surabaya, knalpot ori"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    className="field-input"
                  />
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Jual Unit (Mark as SOLD) */}
      {showSellModal && selectedUnit && (
        <div className="modal-backdrop" onClick={() => setShowSellModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Tandai Unit Terjual (SOLD)</h3>
              <button className="modal-close-btn" onClick={() => setShowSellModal(false)}>✕</button>
            </div>

            <div className="modal-content-body">
              <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "8px" }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-title)" }}>
                  {selectedUnit.unit}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Total Modal Beli: <strong className="mono-num">{formatRupiah(selectedUnit.hargaBeli)}</strong>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Harga Terjual Riil (Rp) *</label>
                <input
                  type="number"
                  required
                  autoFocus
                  placeholder="Masukkan nominal harga jual"
                  value={sellPriceInput}
                  onChange={(e) => setSellPriceInput(e.target.value)}
                  className="field-input"
                />
              </div>

              {/* Automatic Calculation Preview */}
              <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Harga Jual:</span>
                  <strong className="mono-num">{formatRupiah(Number(sellPriceInput) || 0)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Harga Beli:</span>
                  <strong className="mono-num">-{formatRupiah(selectedUnit.hargaBeli)}</strong>
                </div>
                <hr style={{ borderColor: "var(--border-light)", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                  <span>Estimasi Keuntungan Bersih:</span>
                  <strong className="mono-num" style={{ color: "var(--emerald-main)", fontWeight: 800 }}>
                    {formatRupiah((Number(sellPriceInput) || 0) - selectedUnit.hargaBeli)}
                  </strong>
                </div>
              </div>

              {selectedUnit.pinjamAyah > 0 && selectedUnit.statusPinjaman === "BELUM_DIKEMBALIKAN" && (
                <div style={{ background: "var(--rose-bg)", border: "1px solid var(--rose-border)", borderRadius: "8px", padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--rose-main)", fontWeight: 600, fontSize: "12.5px" }}>
                    <AlertCircle size={15} /> Ada Duit Ayah yang Dipinjam Sebesar {formatRupiah(selectedUnit.pinjamAyah)}
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "12px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={kembalikanDuitAyahSaatJual}
                      onChange={(e) => setKembalikanDuitAyahSaatJual(e.target.checked)}
                      style={{ width: "15px", height: "15px" }}
                    />
                    <span>Tandai duit Ayah <strong>SUDAH DIKEMBALIKAN</strong> (uang langsung dibalikin ke Ayah)</span>
                  </label>
                </div>
              )}
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setShowSellModal(false)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleConfirmSell}>
                Konfirmasi Penjualan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Unit */}
      {showEditModal && selectedUnit && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Edit Catatan Unit</h3>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="modal-content-body">
              <div className="field-group">
                <label className="field-label">Nama & Seri Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="field-input"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Status Unit</label>
                <select
                  value={formData.statusUnit}
                  onChange={(e) => setFormData({ ...formData, statusUnit: e.target.value })}
                  className="field-select"
                >
                  <option value="READY">Ready Stock</option>
                  <option value="SOLD">Terjual (SOLD)</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Total Harga Beli (Rp) *</label>
                <input
                  type="number"
                  value={formData.hargaBeli}
                  onChange={(e) => handleBeliChange(e.target.value)}
                  className="field-input"
                />
                <span className="field-helper">
                  Total: {formatRupiah(Number(formData.hargaBeli) || 0)}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field-group">
                  <label className="field-label">Modal Sendiri (Rp)</label>
                  <input
                    type="number"
                    value={formData.modalSendiri}
                    onChange={(e) => handleModalSendiriChange(e.target.value)}
                    className="field-input"
                  />
                  <span className="field-helper" style={{ color: "var(--color-profit)" }}>
                    {formatRupiah(Number(formData.modalSendiri) || 0)}
                  </span>
                </div>

                <div className="field-group">
                  <label className="field-label">Pinjam Duit Ayah (Rp)</label>
                  <input
                    type="number"
                    value={formData.pinjamAyah}
                    onChange={(e) => handlePinjamanChange(e.target.value)}
                    className="field-input"
                  />
                  <span className="field-helper" style={{ color: Number(formData.pinjamAyah) > 0 ? "var(--color-danger)" : "var(--text-muted)" }}>
                    {formatRupiah(Number(formData.pinjamAyah) || 0)}
                  </span>
                </div>
              </div>

              {formData.statusUnit === "SOLD" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="field-group">
                    <label className="field-label">Harga Terjual / SOLD (Rp)</label>
                    <input
                      type="number"
                      value={formData.hargaJual}
                      onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                      className="field-input"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Profit Bersih (Rp)</label>
                    <input
                      type="number"
                      value={formData.profit}
                      onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                      className="field-input"
                    />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label className="field-label">Catatan</label>
                <input
                  type="text"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="field-input"
                />
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


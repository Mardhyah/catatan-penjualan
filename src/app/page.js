"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import FilterBar from "@/components/FilterBar";
import UnitTable from "@/components/UnitTable";
import AddUnitModal from "@/components/modals/AddUnitModal";
import EditUnitModal from "@/components/modals/EditUnitModal";
import SellUnitModal from "@/components/modals/SellUnitModal";
import PhotoModal from "@/components/modals/PhotoModal";
import DeleteModal from "@/components/modals/DeleteModal";
import SuccessModal from "@/components/modals/SuccessModal";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapFromSupabase, mapToSupabase, exportToCSV } from "@/lib/utils";

export default function CleanPenjualan2StrokePage() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, READY, SOLD
  const [filterPinjaman, setFilterPinjaman] = useState("ALL"); // ALL, PENDING
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedUnit, setSavedUnit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Load from Supabase (or fallback to LocalStorage)
  useEffect(() => {
    loadData();

    // Matikan fitur mouse wheel & arrow keys mengubah angka otomatis
    const handleGlobalWheel = (e) => {
      if (document.activeElement && document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    const handleGlobalKeyDown = (e) => {
      if (document.activeElement && document.activeElement.type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleGlobalWheel, { passive: true });
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("wheel", handleGlobalWheel);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("penjualan_motor")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            const mapped = data.map(mapFromSupabase);
            setUnits(mapped);
            localStorage.setItem("penjualan_2stroke_clean_v5", JSON.stringify(mapped));
            return;
          } else if (!error && (!data || data.length === 0)) {
            setUnits([]);
            localStorage.setItem("penjualan_2stroke_clean_v5", JSON.stringify([]));
            return;
          }
        } catch (err) {
          console.warn("Supabase fetch failed, falling back to LocalStorage:", err);
        }
      }

      // Fallback: LocalStorage
      const saved = localStorage.getItem("penjualan_2stroke_clean_v5");
      if (saved) {
        try {
          setUnits(JSON.parse(saved));
        } catch (e) {
          setUnits([]);
        }
      } else {
        setUnits([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveUnits = (newUnits) => {
    setUnits(newUnits);
    localStorage.setItem("penjualan_2stroke_clean_v5", JSON.stringify(newUnits));
  };

  // Status Pinjaman Ayah toggle
  const handleStatusPinjamanChange = async (id, newStatus) => {
    const updated = units.map((u) => {
      if (u.id === id) {
        return { ...u, statusPinjaman: newStatus };
      }
      return u;
    });
    saveUnits(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("penjualan_motor")
          .update({ status_pinjaman: newStatus, updated_at: new Date().toISOString() })
          .eq("id", id);
      } catch (err) {
        console.error("Supabase update loan status failed:", err);
      }
    }
  };

  // Submit Add New Unit
  const handleAddUnit = async (formData) => {
    const beli = Number(formData.hargaBeli) || 0;
    const pinjam = Number(formData.pinjamAyah) || 0;
    const modalSendiri = formData.modalSendiri ? Number(formData.modalSendiri) : Math.max(0, beli - pinjam);
    const isSold = formData.statusUnit === "SOLD";
    const jual = isSold ? Number(formData.hargaJual) || 0 : 0;
    const profit = isSold ? (formData.profit ? Number(formData.profit) : jual - beli) : 0;

    const newUnit = {
      id: Date.now().toString(),
      no: units.length + 1,
      unit: formData.unit,
      tempatBeli: formData.tempatBeli || "",
      hargaBeli: beli,
      modalSendiri,
      pinjamAyah: pinjam,
      hargaJual: jual,
      profit,
      statusUnit: formData.statusUnit,
      statusPinjaman: pinjam > 0 ? formData.statusPinjaman : "TIDAK_PINJAM",
      foto: formData.foto || "",
      catatan: formData.catatan || ""
    };

    const nextUnits = [newUnit, ...units];
    saveUnits(nextUnits);
    setSavedUnit(newUnit);
    setShowSuccessModal(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = mapToSupabase(newUnit);
        delete payload.id;
        const { data, error } = await supabase
          .from("penjualan_motor")
          .insert([payload])
          .select();

        if (!error && data && data[0]) {
          const persisted = nextUnits.map((u) =>
            u.id === newUnit.id ? { ...u, id: data[0].id.toString() } : u
          );
          saveUnits(persisted);
          setSavedUnit((prev) => (prev ? { ...prev, id: data[0].id.toString() } : prev));
        }
      } catch (e) {
        console.error("Supabase insert error:", e);
      }
    }
  };

  // Submit Edit Unit
  const handleSaveEdit = async (formData) => {
    if (!selectedUnit) return;

    const beli = Number(formData.hargaBeli) || 0;
    const pinjam = Number(formData.pinjamAyah) || 0;
    const modalSendiri = formData.modalSendiri ? Number(formData.modalSendiri) : Math.max(0, beli - pinjam);
    const isSold = formData.statusUnit === "SOLD";
    const jual = isSold ? Number(formData.hargaJual) || 0 : 0;
    const profit = isSold ? (formData.profit ? Number(formData.profit) : jual - beli) : 0;

    const updated = units.map((u) => {
      if (u.id === selectedUnit.id) {
        return {
          ...u,
          unit: formData.unit,
          tempatBeli: formData.tempatBeli || "",
          hargaBeli: beli,
          modalSendiri,
          pinjamAyah: pinjam,
          hargaJual: jual,
          profit,
          statusUnit: formData.statusUnit,
          statusPinjaman: pinjam > 0 ? formData.statusPinjaman : "TIDAK_PINJAM",
          foto: formData.foto || "",
          catatan: formData.catatan || ""
        };
      }
      return u;
    });

    saveUnits(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          unit: formData.unit,
          tempat_beli: formData.tempatBeli || "",
          harga_beli: beli,
          modal_sendiri: modalSendiri,
          pinjam_ayah: pinjam,
          harga_jual: jual,
          profit,
          status_unit: formData.statusUnit,
          status_pinjaman: pinjam > 0 ? formData.statusPinjaman : "TIDAK_PINJAM",
          foto: formData.foto || "",
          catatan: formData.catatan || "",
          updated_at: new Date().toISOString()
        };
        await supabase.from("penjualan_motor").update(payload).eq("id", selectedUnit.id);
      } catch (e) {
        console.error("Supabase update error:", e);
      }
    }
  };

  // Submit Sell Unit
  const handleConfirmSell = async ({ sellPrice, profit, kembalikanDuitAyah }) => {
    if (!selectedUnit) return;

    const updatedStatusPinjaman =
      selectedUnit.pinjamAyah > 0
        ? kembalikanDuitAyah
          ? "SUDAH_DIKEMBALIKAN"
          : selectedUnit.statusPinjaman
        : "TIDAK_PINJAM";

    const updated = units.map((u) => {
      if (u.id === selectedUnit.id) {
        return {
          ...u,
          hargaJual: sellPrice,
          profit,
          statusUnit: "SOLD",
          statusPinjaman: updatedStatusPinjaman
        };
      }
      return u;
    });

    saveUnits(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("penjualan_motor")
          .update({
            harga_jual: sellPrice,
            profit,
            status_unit: "SOLD",
            status_pinjaman: updatedStatusPinjaman,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedUnit.id);
      } catch (e) {
        console.error("Supabase update sold error:", e);
      }
    }
  };

  // Delete Unit: Buka Modal Konfirmasi
  const handleOpenDelete = (unit) => {
    setUnitToDelete(unit);
    setShowDeleteModal(true);
  };

  // Eksekusi Hapus Unit
  const handleConfirmDelete = async (unit) => {
    if (!unit) return;
    setIsDeleting(true);

    // 1. Optimistic functional update ke state lokal & LocalStorage
    setUnits((prevUnits) => {
      const updated = prevUnits.filter((u) => String(u.id) !== String(unit.id));
      localStorage.setItem("penjualan_2stroke_clean_v5", JSON.stringify(updated));
      return updated;
    });

    setShowDeleteModal(false);
    setUnitToDelete(null);
    setIsDeleting(false);

    // 2. Hapus dari Supabase secara permanen
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("penjualan_motor")
          .delete()
          .eq("id", unit.id);

        if (error) {
          console.warn("Delete by id failed, retrying delete by unit & no:", error);
          await supabase
            .from("penjualan_motor")
            .delete()
            .match({ unit: unit.unit, no: unit.no });
        }
      } catch (e) {
        console.error("Supabase delete error:", e);
      }
    }
  };

  // Overview Statistics
  const stats = useMemo(() => {
    let totalProfit = 0;
    let duitAyahBelumKembali = 0;
    let totalOmset = 0;
    let modalTertahanReady = 0;
    let unitSold = 0;
    let unitReady = 0;
    let pendingLoanUnitsCount = 0;

    units.forEach((u) => {
      if (u.statusUnit === "SOLD") {
        unitSold += 1;
        totalProfit += Number(u.profit) || 0;
        totalOmset += Number(u.hargaJual) || 0;
      } else {
        unitReady += 1;
        modalTertahanReady += Number(u.hargaBeli) || 0;
      }

      if (u.pinjamAyah > 0 && u.statusPinjaman === "BELUM_DIKEMBALIKAN") {
        duitAyahBelumKembali += Number(u.pinjamAyah) || 0;
        pendingLoanUnitsCount += 1;
      }
    });

    return {
      totalProfit,
      duitAyahBelumKembali,
      totalOmset,
      modalTertahanReady,
      unitSold,
      unitReady,
      pendingLoanUnitsCount
    };
  }, [units]);

  // Filtered Units
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      let matchSearch = true;
      if (search.trim()) {
        const query = search.toLowerCase();
        matchSearch =
          u.unit.toLowerCase().includes(query) ||
          (u.catatan && u.catatan.toLowerCase().includes(query)) ||
          (u.tempatBeli && u.tempatBeli.toLowerCase().includes(query));
      }

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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header
        onExportCSV={() => exportToCSV(units)}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Overview Bento Cards */}
      <SummaryCards stats={stats} isLoading={isLoading} />

      {/* Filter and Search Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterPinjaman={filterPinjaman}
        onFilterPinjamanChange={setFilterPinjaman}
        stats={stats}
        units={units}
      />

      {/* Table */}
      <UnitTable
        units={filteredUnits}
        totalUnitsCount={units.length}
        isLoading={isLoading}
        onOpenEdit={(item) => {
          setSelectedUnit(item);
          setShowEditModal(true);
        }}
        onOpenSell={(item) => {
          setSelectedUnit(item);
          setShowSellModal(true);
        }}
        onDelete={handleOpenDelete}
        onPreviewPhoto={setPreviewPhoto}
        onStatusPinjamanChange={handleStatusPinjamanChange}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Modal: Tambah Unit Baru */}
      <AddUnitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddUnit={handleAddUnit}
      />

      {/* Modal: Sukses Tambah Unit (Otomatis Hilang dalam 2 detik) */}
      <SuccessModal
        isOpen={showSuccessModal}
        unit={savedUnit}
        onClose={() => {
          setShowSuccessModal(false);
          setSavedUnit(null);
        }}
      />

      {/* Modal: Edit Unit */}
      <EditUnitModal
        isOpen={showEditModal}
        unit={selectedUnit}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUnit(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Modal: Jual Unit */}
      <SellUnitModal
        isOpen={showSellModal}
        unit={selectedUnit}
        onClose={() => {
          setShowSellModal(false);
          setSelectedUnit(null);
        }}
        onConfirmSell={handleConfirmSell}
      />

      {/* Modal: Konfirmasi Hapus Unit */}
      <DeleteModal
        isOpen={showDeleteModal}
        unit={unitToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setUnitToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Modal: Lightbox Preview Foto Motor */}
      <PhotoModal
        photoData={previewPhoto}
        onClose={() => setPreviewPhoto(null)}
      />
    </div>
  );
}

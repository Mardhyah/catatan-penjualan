"use client";

import React from "react";
import { Search } from "lucide-react";

export default function FilterBar({
  search,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPinjaman,
  onFilterPinjamanChange,
  stats,
  units
}) {
  const pendingLoanCount = units.filter(
    (u) => u.pinjamAyah > 0 && u.statusPinjaman === "BELUM_DIKEMBALIKAN"
  ).length;

  return (
    <div className="action-controls-bar">
      {/* Search Input */}
      <div className="search-input-wrap">
        <Search className="search-icon-svg" size={16} />
        <input
          type="text"
          className="search-field"
          placeholder="Cari nama motor, kota tempat beli, atau catatan..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button 
            type="button" 
            onClick={() => onSearchChange("")}
            style={{ 
              position: "absolute", 
              right: "12px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              background: "transparent", 
              border: "none", 
              color: "var(--text-muted)", 
              cursor: "pointer", 
              fontSize: "13px",
              fontWeight: 600
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Segmented Filter Buttons */}
      <div className="segmented-control">
        <button 
          type="button"
          className={`segment-btn ${filterStatus === "ALL" && filterPinjaman === "ALL" ? "active" : ""}`}
          onClick={() => {
            onFilterStatusChange("ALL");
            onFilterPinjamanChange("ALL");
          }}
        >
          Semua ({units.length})
        </button>
        <button 
          type="button"
          className={`segment-btn ${filterStatus === "READY" ? "active" : ""}`}
          onClick={() => {
            onFilterStatusChange("READY");
            onFilterPinjamanChange("ALL");
          }}
        >
          Ready Stock ({stats.unitReady})
        </button>
        <button 
          type="button"
          className={`segment-btn ${filterStatus === "SOLD" ? "active" : ""}`}
          onClick={() => {
            onFilterStatusChange("SOLD");
            onFilterPinjamanChange("ALL");
          }}
        >
          Terjual ({stats.unitSold})
        </button>
        <button 
          type="button"
          className={`segment-btn ${filterPinjaman === "PENDING" ? "active-danger" : ""}`}
          onClick={() => {
            onFilterPinjamanChange(filterPinjaman === "PENDING" ? "ALL" : "PENDING");
            onFilterStatusChange("ALL");
          }}
          title="Tampilkan hanya unit yang ada pinjaman duit Ayah yang belum dikembalikan"
        >
          Duit Ayah Belum Balik ({pendingLoanCount})
        </button>
      </div>
    </div>
  );
}

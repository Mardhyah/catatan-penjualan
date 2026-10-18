"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, BarChart3, ChevronDown, Check } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function SummaryCards({ 
  stats, 
  isLoading, 
  selectedMonth = "ALL", 
  onSelectMonth, 
  availableMonths = [], 
  onOpenMonthlyReport 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isMonthFiltered = selectedMonth !== "ALL";
  const selectedMonthObj = availableMonths.find((m) => m.yearMonth === selectedMonth);
  const selectedMonthLabel = selectedMonthObj ? selectedMonthObj.label : "";

  const displayProfit = isMonthFiltered ? (stats.selectedMonthProfit || 0) : (stats.allTimeProfit || 0);
  const displayOmset = isMonthFiltered ? (stats.selectedMonthOmset || 0) : (stats.allTimeOmset || 0);
  const displaySoldUnits = isMonthFiltered ? (stats.selectedMonthSoldUnits || 0) : (stats.allTimeSoldUnits || 0);

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Bar Pemilih Periode (Custom Dropdown Mewah) & Tombol Rekap */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        {/* Custom Dropdown Periode */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFFFFF",
              border: isDropdownOpen ? "1.5px solid var(--brand-blue)" : "1px solid var(--border-medium)",
              borderRadius: "10px",
              padding: "6px 14px",
              boxShadow: isDropdownOpen 
                ? "0 0 0 3px rgba(15, 66, 192, 0.12), 0 2px 6px rgba(0,0,0,0.06)" 
                : "0 1px 3px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              fontFamily: "inherit"
            }}
          >
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "var(--brand-blue-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand-blue)",
              flexShrink: 0
            }}>
              <Calendar size={14} />
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", lineHeight: 1.1 }}>
                Periode Profit
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <span>{selectedMonth === "ALL" ? "Semua Waktu (Total)" : selectedMonthLabel}</span>
                {selectedMonthObj?.isCurrentMonth && (
                  <span style={{ fontSize: "9px", background: "var(--brand-blue)", color: "#FFFFFF", padding: "1px 5px", borderRadius: "4px", fontWeight: "800" }}>
                    Bulan Ini
                  </span>
                )}
              </div>
            </div>

            <ChevronDown 
              size={15} 
              style={{ 
                color: isDropdownOpen ? "var(--brand-blue)" : "var(--text-muted)",
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                marginLeft: "4px"
              }} 
            />
          </button>

          {/* Floating Menu Popover */}
          {isDropdownOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              zIndex: 100,
              minWidth: "260px",
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid var(--border-light)",
              boxShadow: "0 12px 28px -5px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.04)",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "2px"
            }}>
              {/* Option: Semua Waktu */}
              <button
                type="button"
                onClick={() => {
                  onSelectMonth("ALL");
                  setIsDropdownOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: selectedMonth === "ALL" ? "var(--brand-blue-light)" : "transparent",
                  color: selectedMonth === "ALL" ? "var(--brand-blue)" : "var(--text-dark)",
                  fontWeight: selectedMonth === "ALL" ? 700 : 500,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s ease"
                }}
                onMouseEnter={(e) => {
                  if (selectedMonth !== "ALL") e.currentTarget.style.background = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  if (selectedMonth !== "ALL") e.currentTarget.style.background = "transparent";
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Semua Waktu (Total)</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 400, marginTop: "1px" }}>
                    Akumulasi seluruh motor terjual
                  </div>
                </div>
                {selectedMonth === "ALL" && <Check size={15} style={{ color: "var(--brand-blue)", flexShrink: 0 }} />}
              </button>

              <div style={{ height: "1px", background: "var(--border-light)", margin: "4px 6px" }} />

              {/* Monthly Options */}
              {availableMonths.map((m) => {
                const isSelected = selectedMonth === m.yearMonth;
                return (
                  <button
                    key={m.yearMonth}
                    type="button"
                    onClick={() => {
                      onSelectMonth(m.yearMonth);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: isSelected ? "var(--brand-blue-light)" : "transparent",
                      color: isSelected ? "var(--brand-blue)" : "var(--text-dark)",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "12.5px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.12s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{m.label}</span>
                      {m.isCurrentMonth && (
                        <span style={{ fontSize: "9px", background: "var(--brand-blue)", color: "#FFFFFF", padding: "1px 5px", borderRadius: "4px", fontWeight: "800" }}>
                          Bulan Ini
                        </span>
                      )}
                    </div>
                    {isSelected && <Check size={15} style={{ color: "var(--brand-blue)", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tombol Rekap Per Bulan */}
        <button
          type="button"
          onClick={onOpenMonthlyReport}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--brand-blue-light)",
            color: "var(--brand-blue)",
            border: "1px solid var(--brand-blue-border)",
            borderRadius: "10px",
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.18s ease"
          }}
          title="Buka laporan tabel keuntungan per bulan"
        >
          <BarChart3 size={14} /> Rekap Per Bulan
        </button>
      </div>

      {/* Grid Bento Cards */}
      <section className="bento-grid">
        {/* Card 1: Profit */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="bento-label">
                {isMonthFiltered ? `Keuntungan (${selectedMonthLabel})` : "Total Keuntungan Bersih"}
              </span>
            </div>
          </div>
          <div className="bento-val" style={{ color: "var(--color-profit)" }}>
            {isLoading ? (
              <div className="shimmer" style={{ width: "150px", height: "30px", borderRadius: "6px" }} />
            ) : (
              formatRupiah(displayProfit)
            )}
          </div>
          <div className="bento-footer">
            {isMonthFiltered 
              ? `Akumulasi dari ${displaySoldUnits} unit motor laku di ${selectedMonthLabel}`
              : `Akumulasi dari ${displaySoldUnits} unit motor yang sudah laku`
            }
          </div>
        </div>

        {/* Card 2: Duit Ayah */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="bento-label">Duit Ayah (Belum Balik)</span>
            </div>
          </div>
          <div 
            className="bento-val" 
            style={{ color: stats.duitAyahBelumKembali > 0 ? "var(--color-danger)" : "var(--color-profit)" }}
          >
            {isLoading ? (
              <div className="shimmer" style={{ width: "140px", height: "30px", borderRadius: "6px" }} />
            ) : (
              formatRupiah(stats.duitAyahBelumKembali)
            )}
          </div>
          <div className="bento-footer">
            {stats.duitAyahBelumKembali > 0 
              ? `Dikembalikan ke Ayah (${stats.pendingLoanUnitsCount} unit belum lunas)` 
              : "Semua pinjaman Ayah sudah lunas dikembalikan"}
          </div>
        </div>

        {/* Card 3: Omset */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="bento-label">
                {isMonthFiltered ? `Terjual (${selectedMonthLabel})` : "Total Terjual"}
              </span>
            </div>
          </div>
          <div className="bento-val">
            {isLoading ? (
              <div className="shimmer" style={{ width: "160px", height: "30px", borderRadius: "6px" }} />
            ) : (
              formatRupiah(displayOmset)
            )}
          </div>
          <div className="bento-footer">
            {isMonthFiltered
              ? `Total penerimaan dari ${displaySoldUnits} unit motor laku di ${selectedMonthLabel}`
              : `Total penerimaan dari ${displaySoldUnits} unit motor terjual`
            }
          </div>
        </div>

        {/* Card 4: Modal Ready */}
        <div className="bento-card">
          <div className="bento-head">
            <div className="bento-label-wrap">
              <span className="bento-label">Modal Tertahan Garasi</span>
            </div>
          </div>
          <div className="bento-val">
            {isLoading ? (
              <div className="shimmer" style={{ width: "140px", height: "30px", borderRadius: "6px" }} />
            ) : (
              formatRupiah(stats.modalTertahanReady)
            )}
          </div>
          <div className="bento-footer">
            {stats.unitReady} unit sedang ready stock di garasi
          </div>
        </div>
      </section>
    </div>
  );
}

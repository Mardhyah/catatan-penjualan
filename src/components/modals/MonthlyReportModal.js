"use client";

import React from "react";
import { BarChart3, X } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function MonthlyReportModal({ 
  isOpen, 
  onClose, 
  monthlyData = []
}) {
  if (!isOpen) return null;

  // Hitung total keseluruhan dari seluruh data bulanan
  const allTimeSold = monthlyData.reduce((acc, curr) => acc + curr.unitCount, 0);
  const allTimeOmset = monthlyData.reduce((acc, curr) => acc + curr.totalOmset, 0);
  const allTimeProfit = monthlyData.reduce((acc, curr) => acc + curr.totalProfit, 0);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div 
        className="modal-box" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "580px", width: "95%", padding: "22px" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--brand-blue-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand-blue)"
            }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-dark)", margin: 0 }}>
                Rekapitulasi Keuntungan Per Bulan
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                Rangkuman performa penjualan motor berdasarkan bulan transaksi
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="modal-close-btn"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabel Rekap Bersih Tanpa Kolom Aksi / Pilihan */}
        <div style={{
          border: "1px solid var(--border-light)",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "16px",
          background: "#FFFFFF"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "var(--table-header-bg)", color: "#FFFFFF" }}>
                  <th style={{ padding: "10px 14px", fontWeight: "700", fontSize: "11px", textTransform: "uppercase" }}>
                    Bulan & Tahun
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>
                    Unit Laku
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>
                    Total Omset
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>
                    Keuntungan Bersih
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "28px 14px", textAlign: "center", color: "var(--text-muted)" }}>
                      Belum ada data unit motor yang berstatus terjual.
                    </td>
                  </tr>
                ) : (
                  monthlyData.map((row) => (
                    <tr 
                      key={row.yearMonth} 
                      style={{ borderBottom: "1px solid var(--border-light)" }}
                    >
                      <td style={{ padding: "11px 14px", fontWeight: "700", color: "var(--text-dark)" }}>
                        {row.label}
                        {row.isCurrentMonth && (
                          <span style={{ 
                            marginLeft: "6px", 
                            fontSize: "10px", 
                            background: "var(--brand-blue)", 
                            color: "#fff", 
                            padding: "2px 6px", 
                            borderRadius: "4px",
                            fontWeight: 600
                          }}>
                            Bulan Ini
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "center", fontWeight: "600" }}>
                        {row.unitCount} Unit
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", color: "var(--text-body)" }}>
                        {formatRupiah(row.totalOmset)}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: "700", color: "var(--color-profit)" }}>
                        +{formatRupiah(row.totalProfit)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {monthlyData.length > 0 && (
                <tfoot>
                  <tr style={{ background: "#F8FAFC", fontWeight: "800", borderTop: "2px solid var(--border-medium)" }}>
                    <td style={{ padding: "12px 14px", color: "var(--text-dark)", textTransform: "uppercase" }}>
                      TOTAL KESELURUHAN
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text-dark)" }}>
                      {allTimeSold} Unit
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "var(--brand-blue)" }}>
                      {formatRupiah(allTimeOmset)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "var(--color-profit)" }}>
                      +{formatRupiah(allTimeProfit)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Footer Actions: Hanya Tombol Tutup */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-primary btn-sm"
            style={{ minWidth: "90px", justifyContent: "center" }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

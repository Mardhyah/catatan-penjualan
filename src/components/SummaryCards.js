"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";

export default function SummaryCards({ stats, isLoading }) {
  return (
    <section className="bento-grid">
      {/* Card 1: Profit */}
      <div className="bento-card">
        <div className="bento-head">
          <div className="bento-label-wrap">
            <span className="card-indicator indicator-profit" />
            <span className="bento-label">Total Keuntungan Bersih</span>
          </div>
        </div>
        <div className="bento-val">
          {isLoading ? (
            <div className="shimmer" style={{ width: "150px", height: "30px", borderRadius: "6px" }} />
          ) : (
            formatRupiah(stats.totalProfit)
          )}
        </div>
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
            <span className="card-indicator indicator-blue" />
            <span className="bento-label">Total Terjual</span>
          </div>
        </div>
        <div className="bento-val">
          {isLoading ? (
            <div className="shimmer" style={{ width: "160px", height: "30px", borderRadius: "6px" }} />
          ) : (
            formatRupiah(stats.totalOmset)
          )}
        </div>
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
  );
}

"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function SellUnitModal({ isOpen, unit, onClose, onConfirmSell }) {
  const [sellPriceInput, setSellPriceInput] = useState("");
  const [kembalikanDuitAyah, setKembalikanDuitAyah] = useState(true);

  if (!isOpen || !unit) return null;

  const sellPrice = Number(sellPriceInput) || 0;
  const profit = sellPrice - unit.hargaBeli;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sellPriceInput || sellPrice <= 0) {
      alert("Harap masukkan harga jual yang valid!");
      return;
    }
    onConfirmSell({
      sellPrice,
      profit,
      kembalikanDuitAyah
    });
    setSellPriceInput("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Tandai Unit Terjual</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content-body">
            {/* Unit Info Box */}
            <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-dark)" }}>
                {unit.unit}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                Total Modal Beli: <strong className="mono-num">{formatRupiah(unit.hargaBeli)}</strong>
              </div>
            </div>

            {/* Input Harga Jual */}
            <div className="field-group">
              <label className="field-label">Harga Terjual Riil (Rp) *</label>
              <input
                type="number"
                required
                autoFocus
                placeholder="Masukkan nominal harga terjual"
                value={sellPriceInput}
                onChange={(e) => setSellPriceInput(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                className="field-input"
              />
            </div>

            {/* Perhitungan Estimasi Profit */}
            <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Harga Terjual:</span>
                <strong className="mono-num">{formatRupiah(sellPrice)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Harga Beli:</span>
                <strong className="mono-num">-{formatRupiah(unit.hargaBeli)}</strong>
              </div>
              <hr style={{ borderColor: "var(--border-light)", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span>Keuntungan Bersih:</span>
                <strong className="mono-num" style={{ color: profit >= 0 ? "var(--color-profit)" : "var(--color-danger)", fontWeight: 800 }}>
                  {profit >= 0 ? "+" : ""}{formatRupiah(profit)}
                </strong>
              </div>
            </div>

            {/* Opsi Pelunasan Duit Ayah */}
            {unit.pinjamAyah > 0 && unit.statusPinjaman === "BELUM_DIKEMBALIKAN" && (
              <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "8px", padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-danger)", fontWeight: 600, fontSize: "12.5px" }}>
                  <AlertCircle size={15} /> Ada Duit Ayah Sebesar {formatRupiah(unit.pinjamAyah)}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={kembalikanDuitAyah}
                    onChange={(e) => setKembalikanDuitAyah(e.target.checked)}
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span>Tandai duit Ayah <strong>SUDAH DIKEMBALIKAN</strong> (Lunas)</span>
                </label>
              </div>
            )}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Konfirmasi Penjualan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

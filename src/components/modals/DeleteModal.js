"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function DeleteModal({ isOpen, unit, onClose, onConfirmDelete, isDeleting }) {
  if (!isOpen || !unit) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-box" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px" }}
      >
        <div className="modal-head" style={{ borderBottom: "none", paddingBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#FFF1F2",
              border: "1px solid #FECDD3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-danger)",
              flexShrink: 0
            }}>
              <Trash2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", color: "var(--text-dark)" }}>Hapus Catatan Motor</h3>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content-body" style={{ paddingTop: "10px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-body)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
            Apakah Anda yakin ingin menghapus catatan motor ini?
          </p>

          <div style={{ 
            background: "var(--bg-subtle)", 
            border: "1px solid var(--border-light)", 
            borderRadius: "8px", 
            padding: "12px 14px"
          }}>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-dark)" }}>
              {unit.unit}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
              Harga Beli: <strong className="mono-num">{formatRupiah(unit.hargaBeli)}</strong>
              {unit.tempatBeli && ` • Asal: ${unit.tempatBeli}`}
            </div>
          </div>
        </div>

        <div className="modal-foot" style={{ marginTop: "8px" }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => onConfirmDelete(unit)}
            disabled={isDeleting}
            style={{ 
              backgroundColor: "var(--color-danger)", 
              borderColor: "var(--color-danger)",
              color: "#FFFFFF"
            }}
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus Motor"}
          </button>
        </div>
      </div>
    </div>
  );
}

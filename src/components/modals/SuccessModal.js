"use client";

import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function SuccessModal({ isOpen, unit, onClose }) {
  // Otomatis hilang setelah 2 detik
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !unit) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ backdropFilter: "blur(2px)" }}>
      <div 
        className="modal-box" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: "360px", 
          textAlign: "center",
          padding: "24px 22px 18px 22px",
          borderRadius: "14px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
          animation: "scaleIn 0.2s ease-out"
        }}
      >
        {/* Success Icon */}
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#ECFDF5",
          border: "2px solid #A7F3D0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#059669",
          margin: "0 auto 12px auto",
          boxShadow: "0 6px 16px rgba(5, 150, 105, 0.15)"
        }}>
          <CheckCircle2 size={32} />
        </div>

        <h3 style={{ fontSize: "17.5px", fontWeight: 800, color: "var(--text-dark)", margin: "0 0 6px 0" }}>
          Unit Berhasil Disimpan!
        </h3>
        
        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--brand-blue)", margin: "0 0 4px 0" }}>
          {unit.unit}
        </p>

        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
          Modal Beli: <strong className="mono-num" style={{ color: "var(--text-dark)" }}>{formatRupiah(unit.hargaBeli)}</strong>
          {unit.tempatBeli && ` • Asal: ${unit.tempatBeli}`}
        </p>

        {/* Animated 2-Second Progress Bar */}
        <div style={{
          width: "100%",
          height: "4px",
          background: "var(--brand-blue-light, #EFF6FF)",
          borderRadius: "999px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            background: "var(--brand-blue, #1D4ED8)",
            width: "100%",
            animation: "shrinkBar 2s linear forwards"
          }} />
        </div>
      </div>
    </div>
  );
}

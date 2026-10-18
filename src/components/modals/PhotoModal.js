"use client";

import React from "react";
import { Camera } from "lucide-react";

export default function PhotoModal({ photoData, onClose }) {
  if (!photoData) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        style={{ 
          maxWidth: "540px", 
          width: "92%", 
          background: "#FFFFFF", 
          borderRadius: "12px", 
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid var(--border-medium)"
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Camera size={16} style={{ color: "var(--brand-blue)" }} />
            <strong style={{ fontSize: "14px", color: "var(--navy-dark)" }}>{photoData.unit}</strong>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              background: "transparent", 
              border: "none", 
              fontSize: "18px", 
              cursor: "pointer", 
              color: "var(--text-muted)",
              padding: "4px"
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ maxHeight: "70vh", overflow: "hidden", background: "#0B132B", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
          <img 
            src={photoData.url} 
            alt={photoData.unit} 
            style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain", borderRadius: "6px" }} 
          />
        </div>
      </div>
    </div>
  );
}

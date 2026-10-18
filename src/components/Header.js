"use client";

import React from "react";
import { Download, Plus } from "lucide-react";

export default function Header({ onExportCSV, onOpenAddModal }) {
  return (
    <header className="header-bar">
      <div className="brand-wrapper">
        <div className="brand-text">
          <h1>
            DATA PENJUALAN <span style={{ color: "var(--brand-blue)" }}>2 STROKE</span> SURABAYA
          </h1>
          <p>Sistem Pengelolaan Keuangan dan Profit Penjualan</p>
        </div>
      </div>

      <div className="header-tools">
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onExportCSV}
          title="Download file CSV untuk dibuka di Excel"
        >
          <Download size={14} /> Unduh CSV
        </button>

        <button 
          className="btn btn-primary btn-sm"
          onClick={onOpenAddModal}
        >
          <Plus size={15} /> Tambah Unit
        </button>
      </div>
    </header>
  );
}

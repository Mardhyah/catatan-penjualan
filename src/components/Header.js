"use client";

import React, { useState } from "react";
import { Download, Plus } from "lucide-react";

export default function Header({ onExportCSV, onOpenAddModal }) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="header-bar">
      <div className="brand-wrapper">
        {!logoError ? (
          <img 
            src="/logo-2stroke.png" 
            alt="2Stroke Surabaya" 
            className="brand-logo-img"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="brand-icon-box">2S</div>
        )}
        <div className="brand-text">
          <h1>DATA PENJUALAN 2 STROKE SURABAYA</h1>
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

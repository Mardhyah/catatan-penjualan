"use client";

import React from "react";
import { Camera, MapPin, ArrowUpRight, Edit2, Trash2, Plus, Calendar } from "lucide-react";
import { formatRupiah, formatTanggalIndo } from "@/lib/utils";

export default function UnitTable({
  units,
  totalUnitsCount,
  isLoading,
  onOpenEdit,
  onOpenSell,
  onDelete,
  onPreviewPhoto,
  onStatusPinjamanChange,
  onOpenAddModal
}) {
  return (
    <div className="table-card">
      <table className="clean-table">
        <thead>
          <tr>
            <th style={{ width: "45px" }}>No</th>
            <th style={{ width: "65px" }}>Foto</th>
            <th style={{ width: "120px" }}>Tanggal Beli</th>
            <th>Unit Motor</th>
            <th>Harga Beli Total</th>
            <th>Modal Sendiri</th>
            <th>Duit Ayah</th>
            <th>Harga Terjual</th>
            <th>Profit Bersih</th>
            <th>Status Unit</th>
            <th style={{ textAlign: "right" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Shimmer Loading Skeleton Rows */}
          {isLoading ? (
            [1, 2, 3, 4].map((n) => (
              <tr key={`shimmer-row-${n}`}>
                <td><div className="shimmer" style={{ width: "20px", height: "16px" }} /></td>
                <td style={{ padding: "6px 10px" }}>
                  <div className="shimmer" style={{ width: "46px", height: "36px", borderRadius: "6px" }} />
                </td>
                <td>
                  <div className="shimmer" style={{ width: "45px", height: "11px", marginBottom: "4px" }} />
                  <div className="shimmer" style={{ width: "80px", height: "14px" }} />
                </td>
                <td>
                  <div className="shimmer" style={{ width: "160px", height: "16px", marginBottom: "6px" }} />
                  <div className="shimmer" style={{ width: "100px", height: "12px" }} />
                </td>
                <td><div className="shimmer" style={{ width: "95px", height: "16px" }} /></td>
                <td><div className="shimmer" style={{ width: "95px", height: "16px" }} /></td>
                <td><div className="shimmer" style={{ width: "85px", height: "16px" }} /></td>
                <td><div className="shimmer" style={{ width: "95px", height: "16px" }} /></td>
                <td><div className="shimmer" style={{ width: "80px", height: "16px" }} /></td>
                <td><div className="shimmer" style={{ width: "70px", height: "22px", borderRadius: "12px" }} /></td>
                <td style={{ textAlign: "right" }}>
                  <div className="shimmer" style={{ width: "55px", height: "26px", borderRadius: "4px" }} />
                </td>
              </tr>
            ))
          ) : units.length === 0 ? (
            /* Empty State */
            <tr>
              <td colSpan={11} style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--navy-dark)", marginBottom: "6px" }}>
                  {totalUnitsCount === 0 ? "Belum Ada Catatan Motor" : "Tidak Ada Motor yang Cocok"}
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: totalUnitsCount === 0 ? "16px" : "0" }}>
                  {totalUnitsCount === 0
                    ? "Database Anda sudah bersih. Mulai catat unit motor pertama Anda sekarang!"
                    : "Coba ubah kata kunci pencarian atau filter status Anda."}
                </div>
                {totalUnitsCount === 0 && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={onOpenAddModal}
                    style={{ margin: "0 auto", padding: "8px 16px", gap: "6px" }}
                  >
                    <Plus size={14} /> Catat Motor Pertama
                  </button>
                )}
              </td>
            </tr>
          ) : (
            /* Data Rows */
            units.map((item, idx) => {
              const isSold = item.statusUnit === "SOLD";
              const hasLoan = item.pinjamAyah > 0;
              const isLoanPending = hasLoan && item.statusPinjaman === "BELUM_DIKEMBALIKAN";
              const modalSendiri = item.modalSendiri ?? (item.hargaBeli - (item.pinjamAyah || 0));

              return (
                <tr key={item.id}>
                  {/* No */}
                  <td className="mono-num" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                    {idx + 1}
                  </td>

                  {/* Foto Thumbnail */}
                  <td style={{ padding: "6px 10px" }}>
                    {item.foto ? (
                      <div 
                        onClick={() => onPreviewPhoto({ url: item.foto, unit: item.unit })}
                        style={{ 
                          width: "46px", 
                          height: "36px", 
                          borderRadius: "6px", 
                          overflow: "hidden", 
                          cursor: "pointer",
                          border: "1px solid var(--border-medium)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                          background: "#0F172A"
                        }}
                        title="Klik untuk melihat foto lebih besar"
                      >
                        <img 
                          src={item.foto} 
                          alt={item.unit} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => onOpenEdit(item)}
                        style={{ 
                          width: "46px", 
                          height: "36px", 
                          borderRadius: "6px", 
                          background: "#F8FAFC", 
                          display: "flex", 
                          flexDirection: "column",
                          alignItems: "center", 
                          justifyContent: "center",
                          border: "1px dashed var(--border-medium)",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          gap: "1px"
                        }}
                        title="Klik untuk upload foto motor"
                      >
                        <Camera size={13} />
                        <span style={{ fontSize: "8.5px", fontWeight: 600 }}>+ Foto</span>
                      </div>
                    )}
                  </td>

                  {/* Kolom Tanggal Beli */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    {item.createdAt ? (
                      <div 
                        className="mono-num" 
                        style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: "5px", 
                          color: "var(--text-dark)", 
                          fontWeight: 600, 
                          fontSize: "12.5px" 
                        }}
                        title={`Tanggal beli: ${formatTanggalIndo(item.createdAt)}`}
                      >
                        <Calendar size={12} style={{ color: "var(--brand-blue)", flexShrink: 0 }} />
                        <span>{formatTanggalIndo(item.createdAt)}</span>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                    )}
                  </td>

                  {/* Unit & Tempat Beli */}
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: "13.5px" }}>
                      {item.unit}
                    </div>
                    {item.tempatBeli && (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: "var(--brand-blue)", fontWeight: 600, marginTop: "2px" }}>
                        <MapPin size={11} style={{ flexShrink: 0 }} />
                        <span>{item.tempatBeli}</span>
                      </div>
                    )}
                    {item.catatan && (
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {item.catatan}
                      </div>
                    )}
                  </td>

                  {/* Harga Beli Total */}
                  <td className="mono-num" style={{ fontWeight: 700, color: "var(--text-dark)" }}>
                    {formatRupiah(item.hargaBeli)}
                  </td>

                  {/* Modal Sendiri */}
                  <td className="mono-num" style={{ fontWeight: 600, color: "var(--text-body)" }}>
                    {formatRupiah(modalSendiri)}
                  </td>

                  {/* Duit Ayah */}
                  <td>
                    {!hasLoan ? (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <strong 
                          className="mono-num" 
                          style={{ 
                            color: isLoanPending ? "var(--color-danger)" : "var(--color-profit)",
                            fontSize: "13px"
                          }}
                        >
                          {formatRupiah(item.pinjamAyah)}
                        </strong>

                        {/* Interactive Status Dropdown */}
                        <select
                          value={item.statusPinjaman}
                          onChange={(e) => onStatusPinjamanChange(item.id, e.target.value)}
                          style={{
                            padding: "2px 6px",
                            fontSize: "10.5px",
                            fontWeight: 600,
                            borderRadius: "5px",
                            border: isLoanPending ? "1px solid #FECACA" : "1px solid #BBF7D0",
                            background: isLoanPending ? "#FEF2F2" : "#F0FDF4",
                            color: isLoanPending ? "#DC2626" : "#16A34A",
                            cursor: "pointer",
                            outline: "none",
                            fontFamily: "inherit"
                          }}
                          title="Klik untuk mengubah status lunas pinjaman duit Ayah"
                        >
                          <option value="SUDAH_DIKEMBALIKAN">✓ Lunas</option>
                          <option value="BELUM_DIKEMBALIKAN">Belum Lunas</option>
                        </select>
                      </div>
                    )}
                  </td>

                  {/* Harga Terjual */}
                  <td className="mono-num">
                    {item.statusUnit === "SOLD" ? (
                      <strong style={{ color: "var(--text-dark)" }}>{formatRupiah(item.hargaJual)}</strong>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                    )}
                  </td>

                  {/* Profit Bersih */}
                  <td>
                    {item.statusUnit === "SOLD" ? (
                      <span className="mono-num" style={{ fontWeight: 700, color: item.profit >= 0 ? "var(--color-profit)" : "var(--color-danger)" }}>
                        {item.profit >= 0 ? "+" : ""}{formatRupiah(item.profit)}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                    )}
                  </td>

                  {/* Status Unit */}
                  <td>
                    {item.statusUnit === "SOLD" ? (
                      <div 
                        onClick={() => onOpenEdit(item)}
                        style={{ display: "flex", flexDirection: "column", gap: "3px", cursor: "pointer" }}
                        title="Klik untuk mengubah tanggal jual atau data unit"
                      >
                        <span className="badge-pill badge-sold-style" style={{ alignSelf: "flex-start" }}>
                          TERJUAL
                        </span>
                        {(item.soldAt || item.createdAt) && (
                          <span 
                            className="mono-num" 
                            style={{ 
                              fontSize: "11px", 
                              fontWeight: 600, 
                              color: "var(--color-profit)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3.5px",
                              whiteSpace: "nowrap"
                            }}
                          >
                            <Calendar size={10.5} style={{ flexShrink: 0 }} />
                            <span>{formatTanggalIndo(item.soldAt || item.createdAt)}</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="badge-pill badge-ready-style">
                        READY
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      {item.statusUnit === "READY" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenSell(item)}
                          title="Tandai unit laku terjual dan hitung profit"
                        >
                          <ArrowUpRight size={13} /> Jual
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "6px" }}
                        onClick={() => onOpenEdit(item)}
                        title="Edit catatan"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "6px", color: "var(--color-danger)" }}
                        onClick={() => onDelete(item)}
                        title="Hapus unit"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

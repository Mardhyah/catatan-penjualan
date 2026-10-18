"use client";

import React, { useState, useEffect } from "react";
import { Camera, MapPin, X } from "lucide-react";
import { formatRupiah, compressPhoto } from "@/lib/utils";

export default function EditUnitModal({ isOpen, unit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    unit: "",
    tempatBeli: "",
    hargaBeli: "",
    modalSendiri: "",
    pinjamAyah: "0",
    statusUnit: "READY",
    statusPinjaman: "TIDAK_PINJAM",
    hargaJual: "",
    profit: "0",
    foto: "",
    catatan: ""
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        unit: unit.unit || "",
        tempatBeli: unit.tempatBeli || "",
        hargaBeli: unit.hargaBeli ? unit.hargaBeli.toString() : "",
        modalSendiri: unit.modalSendiri !== undefined ? unit.modalSendiri.toString() : "",
        pinjamAyah: unit.pinjamAyah ? unit.pinjamAyah.toString() : "0",
        statusUnit: unit.statusUnit || "READY",
        statusPinjaman: unit.statusPinjaman || "TIDAK_PINJAM",
        hargaJual: unit.hargaJual ? unit.hargaJual.toString() : "",
        profit: unit.profit !== undefined ? unit.profit.toString() : "0",
        foto: unit.foto || "",
        catatan: unit.catatan || ""
      });
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleBeliChange = (val) => {
    const beli = Number(val) || 0;
    const pinjam = Number(formData.pinjamAyah) || 0;
    const modal = Math.max(0, beli - pinjam);
    const jual = Number(formData.hargaJual) || 0;
    const profit = formData.statusUnit === "SOLD" ? jual - beli : 0;
    setFormData({
      ...formData,
      hargaBeli: val,
      modalSendiri: modal.toString(),
      profit: profit.toString()
    });
  };

  const handlePinjamanChange = (val) => {
    const pinjam = Number(val) || 0;
    const beli = Number(formData.hargaBeli) || 0;
    const modal = Math.max(0, beli - pinjam);
    setFormData({
      ...formData,
      pinjamAyah: val,
      modalSendiri: modal.toString(),
      statusPinjaman: pinjam > 0 ? "BELUM_DIKEMBALIKAN" : "TIDAK_PINJAM"
    });
  };

  const handleModalSendiriChange = (val) => {
    const modal = Number(val) || 0;
    const beli = Number(formData.hargaBeli) || 0;
    const pinjam = Math.max(0, beli - modal);
    setFormData({
      ...formData,
      modalSendiri: val,
      pinjamAyah: pinjam.toString(),
      statusPinjaman: pinjam > 0 ? "BELUM_DIKEMBALIKAN" : "TIDAK_PINJAM"
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Edit Data Unit: {unit.unit}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content-body">
            {/* Nama Unit */}
            <div className="field-group">
              <label className="field-label">Nama Unit *</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="field-input"
              />
            </div>

            {/* Tempat Beli */}
            <div className="field-group">
              <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <MapPin size={13} style={{ color: "var(--brand-blue)" }} /> Tempat Beli / Asal Motor
              </label>
              <input
                type="text"
                placeholder="Contoh: Jombang, Kediri, Surabaya Barat, Sidoarjo, dll"
                value={formData.tempatBeli}
                onChange={(e) => setFormData({ ...formData, tempatBeli: e.target.value })}
                className="field-input"
              />
            </div>

            {/* Foto Motor */}
            <div className="field-group">
              <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Camera size={13} style={{ color: "var(--brand-blue)" }} /> Foto Motor
              </label>
              {formData.foto ? (
                <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-medium)" }}>
                  <img src={formData.foto} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                    <label style={{ background: "rgba(15,23,42,0.85)", color: "#fff", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>
                      Ganti Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) compressPhoto(file, (base64) => setFormData({ ...formData, foto: base64 }));
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, foto: "" })}
                      style={{ background: "rgba(225,29,72,0.85)", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", height: "80px", border: "1px dashed var(--border-medium)", borderRadius: "8px", background: "#F8FAFC", cursor: "pointer" }}>
                  <Camera size={18} style={{ color: "var(--brand-blue)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-body)" }}>Upload Foto Motor (~100KB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) compressPhoto(file, (base64) => setFormData({ ...formData, foto: base64 }));
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            {/* Status Unit */}
            <div className="field-group">
              <label className="field-label">Status Unit</label>
              <select
                value={formData.statusUnit}
                onChange={(e) => setFormData({ ...formData, statusUnit: e.target.value })}
                className="field-select"
              >
                <option value="READY">Ready Stock</option>
                <option value="SOLD">Terjual</option>
              </select>
            </div>

            {/* Harga Beli */}
            <div className="field-group">
              <label className="field-label">Total Harga Beli (Rp) *</label>
              <input
                type="number"
                value={formData.hargaBeli}
                onChange={(e) => handleBeliChange(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                className="field-input"
              />
              <span className="field-helper">
                Total: {formatRupiah(Number(formData.hargaBeli) || 0)}
              </span>
            </div>

            {/* Modal Sendiri & Duit Ayah */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="field-group">
                <label className="field-label">Modal Sendiri (Rp)</label>
                <input
                  type="number"
                  value={formData.modalSendiri}
                  onChange={(e) => handleModalSendiriChange(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                  className="field-input"
                />
                <span className="field-helper" style={{ color: "var(--color-profit)" }}>
                  {formatRupiah(Number(formData.modalSendiri) || 0)}
                </span>
              </div>

              <div className="field-group">
                <label className="field-label">Duit Ayah (Rp)</label>
                <input
                  type="number"
                  value={formData.pinjamAyah}
                  onChange={(e) => handlePinjamanChange(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                  className="field-input"
                />
                <span className="field-helper" style={{ color: Number(formData.pinjamAyah) > 0 ? "var(--color-danger)" : "var(--text-muted)" }}>
                  {formatRupiah(Number(formData.pinjamAyah) || 0)}
                </span>
              </div>
            </div>

            {/* Status Pelunasan Duit Ayah */}
            {Number(formData.pinjamAyah) > 0 && (
              <div 
                className="field-group" 
                style={{ 
                  background: formData.statusPinjaman === "BELUM_DIKEMBALIKAN" ? "#FFF1F2" : "#F0FDF4", 
                  padding: "12px 14px", 
                  borderRadius: "8px", 
                  border: formData.statusPinjaman === "BELUM_DIKEMBALIKAN" ? "1px solid #FECDD3" : "1px solid #BBF7D0",
                  marginBottom: "4px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="field-label" style={{ fontWeight: 700, color: formData.statusPinjaman === "BELUM_DIKEMBALIKAN" ? "var(--color-danger)" : "var(--color-profit)", margin: 0 }}>
                    Status Pelunasan Duit Ayah
                  </label>
                 
                </div>
                <select
                  value={formData.statusPinjaman}
                  onChange={(e) => setFormData({ ...formData, statusPinjaman: e.target.value })}
                  className="field-select"
                  style={{
                    fontWeight: 600,
                    borderColor: formData.statusPinjaman === "BELUM_DIKEMBALIKAN" ? "#FECDD3" : "#BBF7D0",
                    color: formData.statusPinjaman === "BELUM_DIKEMBALIKAN" ? "#DC2626" : "#16A34A"
                  }}
                >
                  <option value="SUDAH_DIKEMBALIKAN">✓ Sudah Dikembalikan (Lunas)</option>
                  <option value="BELUM_DIKEMBALIKAN">Belum Dikembalikan (Belum Balik)</option>
                </select>
              </div>
            )}

            {/* Terjual Details */}
            {formData.statusUnit === "SOLD" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field-group">
                  <label className="field-label">Harga Terjual (Rp)</label>
                  <input
                    type="number"
                    value={formData.hargaJual}
                    onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Profit Bersih (Rp)</label>
                  <input
                    type="number"
                    value={formData.profit}
                    onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                    className="field-input"
                  />
                  <span className="field-helper" style={{ color: "var(--color-profit)" }}>
                    {formatRupiah(Number(formData.profit) || 0)}
                  </span>
                </div>
              </div>
            )}

            {/* Catatan */}
            <div className="field-group">
              <label className="field-label">Catatan</label>
              <textarea
                placeholder="Kelengkapan surat, pajak hidup/mati, kondisi motor, dll..."
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="field-textarea"
                rows={3}
              />
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

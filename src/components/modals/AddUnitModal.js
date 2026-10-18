"use client";

import React, { useState, useEffect } from "react";
import { Camera, MapPin, X } from "lucide-react";
import { formatRupiah, compressPhoto } from "@/lib/utils";

const INITIAL_FORM_STATE = {
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
};

export default function AddUnitModal({ isOpen, onClose, onAddUnit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Selalu reset form menjadi kosong setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    onClose();
  };

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
    onAddUnit(formData);
    setFormData(INITIAL_FORM_STATE); // Kosongkan kembali form setelah disimpan
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Tambah Catatan Unit Motor Baru</h3>
          <button className="modal-close-btn" onClick={handleClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content-body">
            {/* Nama Unit */}
            <div className="field-group">
              <label className="field-label">Nama & Keterangan Unit *</label>
              <input
                type="text"
                required
                placeholder="Contoh: F1ZR 2002 Merah Putih"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="field-input"
              />
            </div>

            {/* Tempat Beli */}
            <div className="field-group">
              <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <MapPin size={13} style={{ color: "var(--brand-blue)" }} /> Tempat Beli / Asal Motor (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Jombang, Kediri, Surabaya Barat, Sidoarjo, dll"
                value={formData.tempatBeli}
                onChange={(e) => setFormData({ ...formData, tempatBeli: e.target.value })}
                className="field-input"
              />
            </div>

            {/* Foto Upload */}
            <div className="field-group">
              <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Camera size={13} style={{ color: "var(--brand-blue)" }} /> Foto Motor (Opsional)
              </label>
              {formData.foto ? (
                <div style={{ position: "relative", width: "100%", height: "130px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-medium)" }}>
                  <img src={formData.foto} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, foto: "" })}
                    style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    title="Hapus foto"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", height: "80px", border: "1px dashed var(--border-medium)", borderRadius: "8px", background: "#F8FAFC", cursor: "pointer" }}>
                  <Camera size={18} style={{ color: "var(--brand-blue)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-body)" }}>Pilih Foto (Otomatis Dicompress ~100KB)</span>
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
                <option value="SOLD">Sudah Terjual</option>
              </select>
            </div>

            {/* Harga Beli */}
            <div className="field-group">
              <label className="field-label">Total Harga Beli (Rp) *</label>
              <input
                type="number"
                required
                placeholder="12000000"
                value={formData.hargaBeli}
                onChange={(e) => handleBeliChange(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                className="field-input"
              />
              <span className="field-helper">
                Nominal: {formatRupiah(Number(formData.hargaBeli) || 0)}
              </span>
            </div>

            {/* Modal Sendiri & Duit Ayah */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="field-group">
                <label className="field-label">Modal Sendiri (Rp)</label>
                <input
                  type="number"
                  placeholder="Otomatis terhitung"
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
                  placeholder="0 jika modal sendiri"
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

            {/* Terjual Details */}
            {formData.statusUnit === "SOLD" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field-group">
                  <label className="field-label">Harga Terjual (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="14500000"
                    value={formData.hargaJual}
                    onChange={(e) => {
                      const j = Number(e.target.value) || 0;
                      const b = Number(formData.hargaBeli) || 0;
                      setFormData({ ...formData, hargaJual: e.target.value, profit: (j - b).toString() });
                    }}
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
              <label className="field-label">Catatan Tambahan</label>
              <textarea
                placeholder="Kelengkapan surat, pajak hidup/mati, kondisi motor, dll..."
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="field-textarea"
                rows={2}
              />
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Unit Motor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Camera, MapPin, X, Crop, Calendar } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import ImageCropModal from "@/components/modals/ImageCropModal";

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EditUnitModal({ isOpen, unit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    unit: "",
    tempatBeli: "",
    tanggal: '',
    tanggalJual: '',
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

  const [rawImageToCrop, setRawImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
    if (unit) {
      const initialDate = unit.createdAt 
        ? unit.createdAt.split("T")[0] 
        : getTodayDateString();

      const initialSoldDate = unit.soldAt 
        ? unit.soldAt.split("T")[0] 
        : (unit.createdAt ? unit.createdAt.split("T")[0] : getTodayDateString());

      setFormData({
        unit: unit.unit || "",
        tempatBeli: unit.tempatBeli || "",
        tanggal: initialDate,
        tanggalJual: initialSoldDate,
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
      setRawImageToCrop(null);
      setShowCropModal(false);
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleClose = () => {
    setRawImageToCrop(null);
    setShowCropModal(false);
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
    const createdAt = formData.tanggal 
      ? new Date(`${formData.tanggal}T12:00:00Z`).toISOString() 
      : (unit.createdAt || new Date().toISOString());

    const soldAt = formData.statusUnit === "SOLD"
      ? (formData.tanggalJual 
          ? new Date(`${formData.tanggalJual}T12:00:00Z`).toISOString() 
          : (unit.soldAt || unit.createdAt || new Date().toISOString()))
      : null;

    onSave({
      ...formData,
      createdAt,
      soldAt
    });
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <h3>Edit Data Unit: {unit.unit}</h3>
            <button className="modal-close-btn" onClick={handleClose} type="button">
              <X size={18} />
            </button>
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

              {/* Tempat Beli & Tanggal Beli */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div className="field-group">
                  <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <MapPin size={13} style={{ color: "var(--brand-blue)" }} /> Tempat Beli (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jombang, Kediri, dll"
                    value={formData.tempatBeli}
                    onChange={(e) => setFormData({ ...formData, tempatBeli: e.target.value })}
                    className="field-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <Calendar size={13} style={{ color: "var(--brand-blue)" }} /> Tanggal Beli *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="field-input"
                  />
                </div>
              </div>

              {/* Foto Motor */}
              <div className="field-group">
                <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <Camera size={13} style={{ color: "var(--brand-blue)" }} /> Foto Motor (Bisa di-crop & atur posisi)
                </label>
                {formData.foto ? (
                  <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-medium)" }}>
                    <img src={formData.foto} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setRawImageToCrop(formData.foto);
                          setShowCropModal(true);
                        }}
                        style={{ background: "rgba(15,23,42,0.85)", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 9px", fontSize: "11px", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                        title="Sesuaikan posisi atau pangkas ulang"
                      >
                        <Crop size={12} /> Pangkas / Crop
                      </button>
                      <label style={{ background: "rgba(15,23,42,0.85)", color: "#fff", padding: "5px 9px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setRawImageToCrop(reader.result);
                                setShowCropModal(true);
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, foto: "" })}
                        style={{ background: "rgba(225,29,72,0.85)", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 9px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                        title="Hapus foto"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", height: "84px", border: "1px dashed var(--border-medium)", borderRadius: "8px", background: "#F8FAFC", cursor: "pointer" }}>
                    <Camera size={18} style={{ color: "var(--brand-blue)" }} />
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-body)" }}>Upload Foto Motor (Bisa Pangkas & Geser Posisi)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setRawImageToCrop(reader.result);
                            setShowCropModal(true);
                          };
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }
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

              {/* Status Pinjaman */}
              {Number(formData.pinjamAyah) > 0 && (
                <div className="field-group">
                  <label className="field-label">Status Pelunasan Ayah</label>
                  <select
                    value={formData.statusPinjaman}
                    onChange={(e) => setFormData({ ...formData, statusPinjaman: e.target.value })}
                    className="field-select"
                    style={{
                      borderColor: formData.statusPinjaman === "SUDAH_DIKEMBALIKAN" ? "var(--color-profit)" : "var(--color-danger)",
                      backgroundColor: formData.statusPinjaman === "SUDAH_DIKEMBALIKAN" ? "var(--color-profit-bg)" : "var(--color-danger-bg)",
                      color: formData.statusPinjaman === "SUDAH_DIKEMBALIKAN" ? "var(--color-profit)" : "var(--color-danger)",
                      fontWeight: 700
                    }}
                  >
                    <option value="BELUM_DIKEMBALIKAN">Belum Lunas</option>
                    <option value="SUDAH_DIKEMBALIKAN">Sudah Lunas</option>
                  </select>
                </div>
              )}

              {/* Harga Beli */}
              <div className="field-group">
                <label className="field-label">Total Harga Beli (Rp) *</label>
                <input
                  type="number"
                  required
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

              {/* Rincian Penjualan (Hanya Tampil Jika Status Unit: Sudah Terjual) */}
              {formData.statusUnit === "SOLD" && (
                <div style={{ 
                  background: "#F0FDF4", 
                  border: "1px solid #BBF7D0", 
                  borderRadius: "8px", 
                  padding: "14px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "12px" 
                }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-profit)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={14} />
                    <span>Rincian Terjual (Tanggal & Harga Jual)</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "12px" }}>
                    {/* Tanggal Terjual */}
                    <div className="field-group">
                      <label className="field-label" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <Calendar size={13} style={{ color: "var(--color-profit)" }} /> Tanggal Terjual *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.tanggalJual}
                        onChange={(e) => setFormData({ ...formData, tanggalJual: e.target.value })}
                        className="field-input"
                        style={{ backgroundColor: "#FFFFFF", borderColor: "#86EFAC" }}
                      />
                      <span className="field-helper" style={{ fontSize: "11px" }}>
                        Menentukan keuntungan masuk ke rekap bulan apa
                      </span>
                    </div>

                    {/* Harga Terjual */}
                    <div className="field-group">
                      <label className="field-label">Harga Terjual (Rp) *</label>
                      <input
                        type="number"
                        required
                        value={formData.hargaJual}
                        onChange={(e) => {
                          const j = Number(e.target.value) || 0;
                          const b = Number(formData.hargaBeli) || 0;
                          setFormData({ ...formData, hargaJual: e.target.value, profit: (j - b).toString() });
                        }}
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()}
                        className="field-input"
                        style={{ backgroundColor: "#FFFFFF" }}
                      />
                      <span className="field-helper" style={{ color: "var(--color-profit)", fontWeight: 600 }}>
                        Profit: {formatRupiah(Number(formData.profit) || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Catatan */}
              <div className="field-group">
                <label className="field-label">Catatan Tambahan</label>
                <textarea
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
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cropper Modal */}
      {showCropModal && rawImageToCrop && (
        <ImageCropModal
          imageSrc={rawImageToCrop}
          onCropComplete={(croppedBase64) => {
            setFormData((prev) => ({ ...prev, foto: croppedBase64 }));
            setShowCropModal(false);
            setRawImageToCrop(null);
          }}
          onCancel={() => {
            setShowCropModal(false);
            setRawImageToCrop(null);
          }}
        />
      )}
    </>
  );
}

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Crop, Move } from "lucide-react";

export default function ImageCropModal({ imageSrc, onCropComplete, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgElement, setImgElement] = useState(null);

  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Ukuran Crop Viewport (Rasio 4:3 sesuai thumbnail tabel)
  const CROP_WIDTH = 320;
  const CROP_HEIGHT = 240;

  // Load image saat imageSrc berubah
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgElement(img);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Render canvas preview setiap kali zoom, pan, rotation, atau img berubah
  const drawCropView = useCallback(() => {
    if (!canvasRef.current || !imgElement) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, CROP_WIDTH, CROP_HEIGHT);

    // Hitung dimensi dasar gambar agar menutupi viewport (cover)
    const isRotatedVertical = rotation === 90 || rotation === 270;
    const currentImgW = isRotatedVertical ? imgElement.height : imgElement.width;
    const currentImgH = isRotatedVertical ? imgElement.width : imgElement.height;

    const scaleBase = Math.max(CROP_WIDTH / currentImgW, CROP_HEIGHT / currentImgH);
    const finalScale = scaleBase * zoom;

    ctx.save();
    // Pindahkan pivot ke tengah viewport
    ctx.translate(CROP_WIDTH / 2 + pan.x, CROP_HEIGHT / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(finalScale, finalScale);

    // Gambar di tengah pivot asli gambar
    ctx.drawImage(
      imgElement,
      -imgElement.width / 2,
      -imgElement.height / 2,
      imgElement.width,
      imgElement.height
    );
    ctx.restore();

    // Render juga live thumbnail 46x36px
    if (previewCanvasRef.current) {
      const pCanvas = previewCanvasRef.current;
      const pCtx = pCanvas.getContext("2d");
      pCtx.clearRect(0, 0, 46, 36);
      pCtx.drawImage(canvas, 0, 0, 46, 36);
    }
  }, [imgElement, zoom, rotation, pan]);

  useEffect(() => {
    drawCropView();
  }, [drawCropView]);

  // Mouse / Touch handlers for Pan/Drag
  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Zoom wheel
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + delta).toFixed(2))));
  };

  // Rotate 90 derajat
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setPan({ x: 0, y: 0 }); // reset pan saat rotate agar tidak keluar frame
  };

  // Selesai Crop -> Export ke High-Res 640x480 JPEG Base64
  const handleSaveCrop = () => {
    if (!imgElement) return;

    const outWidth = 640;
    const outHeight = 480;
    const outCanvas = document.createElement("canvas");
    outCanvas.width = outWidth;
    outCanvas.height = outHeight;
    const ctx = outCanvas.getContext("2d");

    const ratioScale = outWidth / CROP_WIDTH;

    const isRotatedVertical = rotation === 90 || rotation === 270;
    const currentImgW = isRotatedVertical ? imgElement.height : imgElement.width;
    const currentImgH = isRotatedVertical ? imgElement.width : imgElement.height;

    const scaleBase = Math.max(CROP_WIDTH / currentImgW, CROP_HEIGHT / currentImgH);
    const finalScale = scaleBase * zoom * ratioScale;

    ctx.save();
    ctx.translate(outWidth / 2 + pan.x * ratioScale, outHeight / 2 + pan.y * ratioScale);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(finalScale, finalScale);
    ctx.drawImage(
      imgElement,
      -imgElement.width / 2,
      -imgElement.height / 2,
      imgElement.width,
      imgElement.height
    );
    ctx.restore();

    // Export sebagai JPEG kualitas 0.85 (ringan ~60-90KB)
    const croppedBase64 = outCanvas.toDataURL("image/jpeg", 0.85);
    onCropComplete(croppedBase64);
  };

  return (
    <div className="modal-backdrop" onClick={onCancel} style={{ zIndex: 1100 }}>
      <div 
        className="modal-box" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "440px", width: "94%", padding: "20px" }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "var(--brand-blue-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand-blue)"
            }}>
              <Crop size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-dark)", margin: 0 }}>
                Sesuaikan & Pangkas Foto
              </h3>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Geser & atur foto agar pas dengan tampilan tabel (4:3)
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCancel} 
            className="modal-close-btn"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Frame */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div 
            style={{ 
              position: "relative",
              width: `${CROP_WIDTH}px`, 
              height: `${CROP_HEIGHT}px`, 
              borderRadius: "8px", 
              overflow: "hidden",
              background: "#0F172A",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "2px solid var(--brand-blue)",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              touchAction: "none"
            }}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handlePointerUp}
            onWheel={handleWheel}
          >
            <canvas 
              ref={canvasRef} 
              width={CROP_WIDTH} 
              height={CROP_HEIGHT} 
              style={{ display: "block" }} 
            />

            {/* Rule of Thirds Guide Grid */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "1fr 1fr 1fr",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.25)", borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.25)", borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.25)", borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.25)", borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.25)" }} />
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.25)" }} />
              <div />
            </div>

            {/* Hint drag */}
            <div style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15, 23, 42, 0.75)",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              pointerEvents: "none",
              backdropFilter: "blur(2px)"
            }}>
              <Move size={11} /> Geser untuk posisi motor
            </div>
          </div>

          {/* Controls: Zoom & Rotate */}
          <div style={{
            width: "100%",
            background: "#F8FAFC",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            {/* Zoom Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button 
                type="button" 
                onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                style={{ background: "#FFFFFF", border: "1px solid var(--border-medium)", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                title="Perkecil"
              >
                <ZoomOut size={13} style={{ color: "var(--text-body)" }} />
              </button>

              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.05" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: "var(--brand-blue)", cursor: "pointer" }}
              />

              <button 
                type="button" 
                onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                style={{ background: "#FFFFFF", border: "1px solid var(--border-medium)", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                title="Perbesar"
              >
                <ZoomIn size={13} style={{ color: "var(--text-body)" }} />
              </button>

              <button 
                type="button" 
                onClick={handleRotate}
                style={{ 
                  background: "#FFFFFF", 
                  border: "1px solid var(--border-medium)", 
                  borderRadius: "6px", 
                  padding: "0 10px", 
                  height: "28px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--brand-blue)",
                  cursor: "pointer" 
                }}
                title="Putar 90 derajat"
              >
                <RotateCw size={12} /> Putar
              </button>
            </div>

            {/* Live Table Thumbnail Preview */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px", borderTop: "1px dashed var(--border-light)" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                Pratinjau Hasil di Tabel:
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ 
                  width: "46px", 
                  height: "36px", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  border: "1px solid var(--border-medium)",
                  background: "#0F172A",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)"
                }}>
                  <canvas ref={previewCanvasRef} width={46} height={36} style={{ display: "block" }} />
                </div>
                <span style={{ fontSize: "10.5px", color: "var(--color-profit)", fontWeight: 700 }}>
                  ✓ Pas (46x36px)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary btn-sm"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleSaveCrop} 
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Check size={14} /> Gunakan Foto Ini
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../services/supabase';

export default function Beranda({ setActiveTab, onOpenCatat }) {
  // State untuk melacak asupan air harian
  const [waterMl, setWaterMl] = useState(1250);
  const targetWaterMl = 2000;
  const [hasDrinkConfirmed, setHasDrinkConfirmed] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);

  // Handler tombol "Sudah Minum"
  const handleDrinkConfirm = () => {
    triggerHaptic('medium');
    setWaterMl((prev) => Math.min(targetWaterMl, prev + 250));
    setHasDrinkConfirmed(true);

    // Animasi confetti modern
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#57f1db', '#2dd4bf', '#9ddf2e', '#afe0ff'],
    });
  };

  // Handler tombol "Tunda 15m"
  const handleSnooze = () => {
    triggerHaptic('light');
    setIsSnoozed(true);
  };

  // Kalkulasi persentase keliling cincin SVG
  // Jari-jari (r): Air = 82 (keliling ~515), Makan = 66 (~415), Gerak = 50 (~314)
  const waterProgress = Math.min(1, waterMl / targetWaterMl);
  const waterOffset = 515.22 * (1 - waterProgress);

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      
      {/* 1. Sapaan Pengguna & Banner Header */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Ritme sehat hari ini
            </span>
          </div>
          <h2 className="text-2xl text-on-surface font-bold tracking-tight">Selamat pagi, Andi</h2>
          <p className="text-xs text-on-surface-variant">Rabu, 21 Mei 2025</p>
        </div>
        <div className="relative">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-full bg-surface-container-low flex items-center justify-center font-bold text-on-surface text-sm">
              AD
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface"></span>
        </div>
      </section>

      {/* 2. Hero Bento Card: 3 Cincin Ritme Konsentris */}
      <section className="w-full rounded-3xl bg-surface-container-low p-5 relative overflow-hidden shadow-xl border border-surface-container-high/40">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Hari Ini</h3>
            <p className="text-xs text-on-surface-variant">Ritme gerak dan energi seimbang</p>
          </div>
          <span className="material-symbols-outlined text-primary text-[24px]">auto_awesome</span>
        </div>

        {/* Concentric Rings Visual */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background Tracks */}
              <circle className="text-surface-container-highest/40" cx="100" cy="100" fill="transparent" r="82" stroke="currentColor" strokeWidth="9"></circle>
              <circle className="text-surface-container-highest/40" cx="100" cy="100" fill="transparent" r="66" stroke="currentColor" strokeWidth="9"></circle>
              <circle className="text-surface-container-highest/40" cx="100" cy="100" fill="transparent" r="50" stroke="currentColor" strokeWidth="9"></circle>

              {/* Outer Ring: Air (Water - Biru) */}
              <circle
                className="transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="transparent"
                r="82"
                stroke="#38BDF8"
                strokeDasharray="515.22"
                strokeDashoffset={waterOffset}
                strokeLinecap="round"
                strokeWidth="9"
              ></circle>

              {/* Middle Ring: Makan (Meals - Kuning) 66% (2/3 sesi) */}
              <circle
                className="transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="transparent"
                r="66"
                stroke="#FBBF24"
                strokeDasharray="414.69"
                strokeDashoffset="138.5"
                strokeLinecap="round"
                strokeWidth="9"
              ></circle>

              {/* Inner Ring: Gerak (Activity - Hijau Lime) 71% (32/45 mnt) */}
              <circle
                className="transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="transparent"
                r="50"
                stroke="#A3E635"
                strokeDasharray="314.16"
                strokeDashoffset="90.8"
                strokeLinecap="round"
                strokeWidth="9"
              ></circle>
            </svg>

            {/* Metric Tengah */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-on-surface leading-none tracking-tight">
                {Math.round(((waterProgress + 2 / 3 + 32 / 45) / 3) * 100)}%
              </span>
              <span className="text-[11px] font-semibold text-primary mt-1 uppercase tracking-wider">
                Ritme Terjaga
              </span>
            </div>
          </div>
        </div>

        {/* Legend Data 3 Kolom */}
        <div className="grid grid-cols-3 gap-2 pt-3 bg-surface-container-high/40 rounded-2xl p-3 border border-surface-container-highest/30">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
              <span className="text-xs text-on-surface-variant font-medium">Air</span>
            </div>
            <p className="text-xs font-bold text-on-surface">
              {waterMl}{' '}
              <span className="text-[10px] font-normal text-on-surface-variant">/{targetWaterMl}ml</span>
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
              <span className="text-xs text-on-surface-variant font-medium">Makan</span>
            </div>
            <p className="text-xs font-bold text-on-surface">
              2 <span className="text-[10px] font-normal text-on-surface-variant">/3 sesi</span>
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]"></span>
              <span className="text-xs text-on-surface-variant font-medium">Gerak</span>
            </div>
            <p className="text-xs font-bold text-on-surface">
              32 <span className="text-[10px] font-normal text-on-surface-variant">/45mnt</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Tombol Aksi Cepat: Catat & Impor GPX */}
      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onOpenCatat();
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-container to-secondary text-surface text-sm font-bold shadow-lg shadow-primary-container/20 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Catat Aktivitas</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('aktivitas');
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold shadow-md active:scale-95 transition-all border border-surface-container-high/40"
        >
          <span className="material-symbols-outlined text-[20px] text-tertiary">upload_file</span>
          <span>Impor GPX</span>
        </button>
      </section>

      {/* 4. Bento Card: Pengingat Minum Air */}
      <section className="w-full rounded-3xl bg-surface-container-low p-5 relative overflow-hidden shadow-md border border-surface-container-high/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <span className="text-sm font-bold text-[#38BDF8]">Minum Air</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
            Pengingat
          </span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold text-on-surface tracking-tight">
            10.00 <span className="text-sm font-semibold text-on-surface-variant">WIB</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Segelas air segar (250 ml) untuk menjaga fokus kerja dan metabolisme tubuh.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-1">
          <button
            type="button"
            onClick={handleDrinkConfirm}
            disabled={hasDrinkConfirmed}
            className={`flex-1 h-11 rounded-xl text-surface text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${
              hasDrinkConfirmed
                ? 'bg-secondary text-surface'
                : 'bg-gradient-to-r from-primary-container to-secondary text-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {hasDrinkConfirmed ? 'done_all' : 'check'}
            </span>
            <span>{hasDrinkConfirmed ? 'Tercatat! +250ml' : 'Sudah minum'}</span>
          </button>

          {!hasDrinkConfirmed && (
            <button
              type="button"
              onClick={handleSnooze}
              disabled={isSnoozed}
              className={`px-4 h-11 rounded-xl bg-surface-container-high text-xs font-semibold transition-colors active:scale-95 ${
                isSnoozed ? 'opacity-50 text-on-surface-variant' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isSnoozed ? 'Ditunda 15m' : 'Tunda 15m'}
            </button>
          )}
        </div>
      </section>

      {/* 5. Bento Card: Aktivitas Terakhir */}
      <section className="w-full rounded-3xl bg-surface-container-low p-5 relative overflow-hidden shadow-md border border-surface-container-high/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#A3E635]/15 flex items-center justify-center text-[#A3E635]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_walk
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface leading-tight">Jalan Pagi</h4>
              <span className="text-[11px] text-on-surface-variant">Pukul 06.15 - 06.57 WIB</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#A3E635]/10 text-[#A3E635] text-[11px] font-semibold">
            Luar ruangan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 my-3">
          <div>
            <span className="text-xs text-on-surface-variant">Jarak</span>
            <div className="text-2xl font-bold text-on-surface leading-none mt-1">
              3,40 <span className="text-sm font-normal text-on-surface-variant">km</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">Durasi</span>
            <div className="text-2xl font-bold text-on-surface leading-none mt-1">
              42:10 <span className="text-sm font-normal text-on-surface-variant">mnt</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant text-xs pb-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">local_fire_department</span>
          <span>~165 kkal</span>
          <span>•</span>
          <span className="material-symbols-outlined text-[16px] text-primary">footprint</span>
          <span>4.520 langkah</span>
        </div>

        {/* Sparkline Rute Mini SVG */}
        <div className="w-full h-14 mt-2 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 280 60">
            <defs>
              <linearGradient id="routeGradHome" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#A3E635" stopOpacity="0.25"></stop>
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>
            <path d="M 0,42 Q 40,50 70,30 T 140,25 T 210,38 T 280,18 L 280,60 L 0,60 Z" fill="url(#routeGradHome)"></path>
            <path d="M 0,42 Q 40,50 70,30 T 140,25 T 210,38 T 280,18" fill="transparent" stroke="#A3E635" strokeLinecap="round" strokeWidth="2.5"></path>
            <circle cx="3" cy="42" fill="#38BDF8" r="3.5"></circle>
            <circle cx="277" cy="18" fill="#A3E635" r="4.5"></circle>
          </svg>
        </div>
      </section>

      {/* 6. Bento Card: Jadwal Makan */}
      <section className="w-full rounded-3xl bg-surface-container-low p-5 relative overflow-hidden shadow-md border border-surface-container-high/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FBBF24]/15 flex items-center justify-center text-[#FBBF24]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                restaurant_menu
              </span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">Jadwal Makan</h4>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">Target: Seimbang</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Sarapan */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Sarapan</p>
                <p className="text-[11px] text-on-surface-variant">Oatmeal & Telur Rebus</p>
              </div>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">07.00 WIB</span>
          </div>

          {/* Makan Siang (Segera) */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-high/80 ring-1 ring-[#FBBF24]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24]">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-on-surface">Makan Siang</p>
                  <span className="px-1.5 py-0.2 rounded bg-[#FBBF24]/20 text-[#FBBF24] text-[9px] uppercase font-bold tracking-wider">
                    Segera
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">Nasi Merah & Pepes Ikan</p>
              </div>
            </div>
            <span className="text-xs text-[#FBBF24] font-bold">12.15 WIB</span>
          </div>

          {/* Makan Malam */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">nightlight</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Makan Malam</p>
                <p className="text-[11px] text-on-surface-variant">Bersama keluarga</p>
              </div>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">18.45 WIB</span>
          </div>
        </div>
      </section>

    </div>
  );
}
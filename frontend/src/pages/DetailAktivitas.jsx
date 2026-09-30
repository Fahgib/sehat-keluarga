import React from 'react';
import { triggerHaptic } from '../services/supabase';

export default function DetailAktivitas({ activity, onBack }) {
  // Gunakan data aktivitas yang dipilih atau gunakan data default
  const act = activity || {
    activity_name: 'Jalan Sore Santai',
    activity_type: 'jalan',
    location_type: 'luar',
    distance_km: 6.02,
    duration_seconds: 4404, // 1j 13m 24d
    calories: 310,
    heart_rate_avg: 108,
    heart_rate_max: 126,
    source: 'Berkas GPX',
    elevation_gain: 38,
    steps: 7840,
    created_at: new Date().toISOString(),
  };

  const formatHoursMinutes = (seconds) => {
    if (!seconds) return '0j 00m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}j ${m}m ${s}d`;
    return `${m}m ${s}d`;
  };

  const calculatePace = (distance, seconds) => {
    if (!distance || !seconds) return "0'00\"";
    const totalPaceSeconds = seconds / distance;
    const paceMin = Math.floor(totalPaceSeconds / 60);
    const paceSec = Math.floor(totalPaceSeconds % 60);
    return `${paceMin}'${String(paceSec).padStart(2, '0')}"/km`;
  };

  const calculateSpeed = (distance, seconds) => {
    if (!distance || !seconds) return '0,0';
    const hours = seconds / 3600;
    return (distance / hours).toFixed(1);
  };

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: `Aktivitas ${act.activity_name}`,
        text: `Saya baru saja menyelesaikan ${act.activity_name} sejauh ${act.distance_km} km dalam waktu ${formatHoursMinutes(act.duration_seconds)}!`,
      }).catch(() => {});
    } else {
      alert(`Berhasil membagikan ringkasan ${act.distance_km} km ke keluarga.`);
    }
  };

  const handleExport = () => {
    triggerHaptic('light');
    alert('Mengekspor ringkasan aktivitas dalam format GPX/CSV...');
  };

  // Simulasi data split pace per kilometer
  const splits = [
    { km: 'KM 1', pace: "11'45\"", width: '85%' },
    { km: 'KM 2', pace: "12'04\"", width: '90%' },
    { km: 'KM 3', pace: "12'40\"", width: '95%', isSlowest: true },
    { km: 'KM 4', pace: "11'50\"", width: '86%' },
    { km: 'KM 5', pace: "12'10\"", width: '91%' },
    { km: 'KM 6', pace: "11'20\"", width: '80%', isFastest: true },
  ];

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      
      {/* 1. Header Sub-Navigasi */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h2 className="text-xl font-bold text-on-surface leading-tight">Detail Aktivitas</h2>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span>{act.activity_name}</span>
              <span>•</span>
              <span className="text-primary font-medium">{act.source || 'Input Mandiri'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </section>

      {/* 2. Hero Card: Jarak Utama & Ringkasan Laju */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-xl relative overflow-hidden border border-surface-container-high/40 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider">
            {act.location_type === 'luar' ? 'Luar Ruangan' : 'Dalam Ruangan'}
          </span>
          <span className="text-xs text-on-surface-variant">
            Rabu, 21 Mei • 16.45 - 17.58 WIB
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold text-on-surface tracking-tight">
            {act.distance_km || 0}
          </span>
          <span className="text-xl font-bold text-primary">km</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/40 text-center">
          <div>
            <span className="text-[10px] text-on-surface-variant block mb-0.5">Total Waktu</span>
            <span className="text-sm font-bold text-on-surface">{formatHoursMinutes(act.duration_seconds)}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant block mb-0.5">Rata-rata Laju</span>
            <span className="text-sm font-bold text-primary">{calculatePace(act.distance_km, act.duration_seconds)}</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant block mb-0.5">Kecepatan</span>
            <span className="text-sm font-bold text-on-surface">{calculateSpeed(act.distance_km, act.duration_seconds)} km/j</span>
          </div>
        </div>
      </section>

      {/* 3. Visualisasi Peta Lintasan (Route Path SVG) */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">route</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface">Rute Perjalanan</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">
            Presisi GPS
          </span>
        </div>

        {/* Visual Lintasan Rute Kontur */}
        <div className="w-full h-44 rounded-2xl bg-surface-container-low relative overflow-hidden border border-surface-container-high/40 flex items-center justify-center">
          {/* Garis Grid Peta */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#008774_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <svg className="w-full h-full p-4 overflow-visible" viewBox="0 0 320 140">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#008774" />
                <stop offset="50%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>

            {/* Jalur Bayangan Rute */}
            <path
              d="M 20,110 C 60,30 90,120 140,50 C 180,-10 240,110 300,30"
              fill="none"
              stroke="#008774"
              strokeWidth="8"
              strokeOpacity="0.2"
              strokeLinecap="round"
            />

            {/* Jalur Utama Rute */}
            <path
              d="M 20,110 C 60,30 90,120 140,50 C 180,-10 240,110 300,30"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Titik Awal (Start) */}
            <circle cx="20" cy="110" r="7" fill="#008774" />
            <circle cx="20" cy="110" r="3" fill="#ffffff" />
            <text x="20" y="130" fill="currentColor" fontSize="10" fontWeight="bold" textAnchor="middle" className="text-on-surface-variant">
              Mulai
            </text>

            {/* Titik Akhir (Finish) */}
            <circle cx="300" cy="30" r="7" fill="#84cc16" />
            <circle cx="300" cy="30" r="3" fill="#ffffff" />
            <text x="300" y="20" fill="currentColor" fontSize="10" fontWeight="bold" textAnchor="middle" className="text-on-surface-variant">
              Selesai
            </text>
          </svg>
        </div>

        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Rute stabil mengelilingi ruang terbuka hijau komplek. Kondisi medan datar dengan sedikit tanjakan di kilometer ke-3.
        </p>
      </section>

      {/* 4. Analisis Split per Kilometer */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface">Split per Kilometer</h3>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">Pace Rata-rata</span>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {splits.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
              <span className="w-12 text-on-surface-variant font-semibold shrink-0">{s.km}</span>
              <div className="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    s.isFastest
                      ? 'bg-secondary'
                      : s.isSlowest
                      ? 'bg-amber-400'
                      : 'bg-primary'
                  }`}
                  style={{ width: s.width }}
                ></div>
              </div>
              <span className="w-16 text-right font-mono font-bold text-on-surface shrink-0">
                {s.pace}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Profil Elevasi & Detak Jantung */}
      <section className="grid grid-cols-2 gap-3">
        {/* Elevasi */}
        <div className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-2 border border-surface-container-high/40">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[16px] text-tertiary">terrain</span>
            <span>Total Kenaikan</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-on-surface">+{act.elevation_gain || 38}</span>
            <span className="text-xs text-on-surface-variant">meter</span>
          </div>
          <span className="text-[10px] text-on-surface-variant">Medan landai ramah keluarga</span>
        </div>

        {/* Detak Jantung */}
        <div className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-2 border border-surface-container-high/40">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[16px] text-error">favorite</span>
            <span>Detak Jantung</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-on-surface">{act.heart_rate_avg || 108}</span>
            <span className="text-xs text-on-surface-variant">bpm</span>
          </div>
          <span className="text-[10px] text-on-surface-variant">Maksimal: {act.heart_rate_max || 126} bpm</span>
        </div>
      </section>

      {/* 6. Tombol Aksi Bawah */}
      <section className="flex flex-col gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleShare}
          className="w-full h-12 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span>Bagikan ke Keluarga</span>
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="w-full h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 border border-surface-container-high/60 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Ekspor Catatan GPX / CSV</span>
        </button>
      </section>

    </div>
  );
}
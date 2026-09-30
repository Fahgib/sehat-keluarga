import React, { useState, useEffect } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

// Data simulasi awal jika data di database masih kosong
const defaultActivities = [
  {
    id: 'mock-1',
    activity_name: 'Jalan Pagi',
    activity_type: 'jalan',
    location_type: 'luar',
    distance_km: 3.40,
    duration_seconds: 2530,
    calories: 180,
    source: 'file GPX',
    location_note: 'Taman Mini',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    activity_name: 'Lari Interval',
    activity_type: 'lari',
    location_type: 'dalam',
    distance_km: 4.50,
    duration_seconds: 1635,
    calories: 310,
    source: 'input manual',
    location_note: 'Treadmill',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-3',
    activity_name: 'Lari Sore Santai',
    activity_type: 'lari',
    location_type: 'luar',
    distance_km: 4.25,
    duration_seconds: 1720,
    calories: 295,
    source: 'file GPX',
    location_note: 'Komplek Rumah',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function Aktivitas({ onOpenCatat, onSelectActivity }) {
  const [filterType, setFilterType] = useState('semua');
  const [filterLoc, setFilterLoc] = useState('semua');
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data aktivitas dari tabel Supabase
  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setActivityList(data);
      } else {
        setActivityList(defaultActivities);
      }
    } catch (err) {
      console.warn('Menggunakan data tampilan lokal:', err.message);
      setActivityList(defaultActivities);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Format durasi detik ke format Menit:Detik
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')} mnt`;
  };

  // Filter daftar aktivitas
  const filteredList = activityList.filter((item) => {
    const matchType = filterType === 'semua' || item.activity_type === filterType;
    const matchLoc = filterLoc === 'semua' || item.location_type === filterLoc;
    return matchType && matchLoc;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      
      {/* 1. Header Intro Bagian Aktivitas */}
      <div className="flex flex-col space-y-1">
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span>Ritme gerak mingguan</span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <h2 className="text-xl font-bold text-on-surface">Catatan Aktivitas</h2>
          <span className="text-xs text-secondary bg-surface-container-low px-2.5 py-0.5 rounded-full border border-secondary/20">
            Aktif Bersemangat
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          Konsistensi langkah, jalan santai, dan lari bersama keluarga tercinta.
        </p>
      </div>

      {/* 2. Hero Bento Card: Rekap Pekanan & Grafik Batang 7 Hari */}
      <div className="relative w-full rounded-3xl bg-surface-container p-5 shadow-xl overflow-hidden border border-surface-container-high/40">
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-12 w-36 h-36 rounded-full bg-secondary/10 blur-2xl pointer-events-none"></div>

        {/* Info Periode */}
        <div className="flex items-center justify-between relative z-10 mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              Periode Berjalan
            </span>
            <h3 className="text-lg font-bold text-on-surface">Minggu Ini</h3>
            <p className="text-xs text-on-surface-variant">15 – 21 Mei 2025</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container/15 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>+2,1 km vs pekan lalu</span>
          </div>
        </div>

        {/* Ringkasan Angka Metrik */}
        <div className="relative z-10 grid grid-cols-2 gap-3 items-end mb-4 bg-surface-container-low/70 rounded-2xl p-3 border border-surface-container-highest/30">
          <div>
            <span className="text-xs text-on-surface-variant block mb-1">Total Jarak Tempuh</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-on-surface tracking-tight">12,4</span>
              <span className="text-base font-bold text-primary">km</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span> Durasi:
              </span>
              <span className="font-bold text-on-surface">2j 48m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">local_fire_department</span> Kalori:
              </span>
              <span className="font-bold text-on-surface">~840 kkal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">footprint</span> Langkah:
              </span>
              <span className="font-bold text-on-surface">18.420</span>
            </div>
          </div>
        </div>

        {/* 7-Day Custom Bar Chart */}
        <div className="relative z-10 pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-medium">Distribusi Harian</span>
            <span className="text-xs text-primary font-bold">Target harian 2,5 km</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1">
            {/* Sen */}
            <div className="flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] text-on-surface-variant mb-1">3,4</span>
              <div className="w-full max-w-[24px] h-[78%] rounded-t-md bg-gradient-to-t from-primary-container to-secondary"></div>
              <span className="text-[11px] text-on-surface-variant mt-2 font-medium">Sen</span>
            </div>
            {/* Sel */}
            <div className="flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] text-on-surface-variant mb-1">2,1</span>
              <div className="w-full max-w-[24px] h-[48%] rounded-t-md bg-gradient-to-t from-primary-container to-secondary opacity-80"></div>
              <span className="text-[11px] text-on-surface-variant mt-2 font-medium">Sel</span>
            </div>
            {/* Rab (Hari ini) */}
            <div className="flex flex-col items-center h-full justify-end relative">
              <span className="text-[10px] text-primary font-bold mb-1">4,2</span>
              <div className="w-full max-w-[24px] h-[95%] rounded-t-md bg-gradient-to-t from-primary-container via-primary to-secondary shadow-[0_0_12px_rgba(45,212,191,0.5)]"></div>
              <span className="text-[11px] text-primary font-bold mt-2">Rab</span>
            </div>
            {/* Kam */}
            <div className="flex flex-col items-center h-full justify-end">
              <span className="text-[10px] text-outline-variant mb-1">0</span>
              <div className="w-full max-w-[24px] h-[8%] rounded-t bg-surface-container-highest"></div>
              <span className="text-[11px] text-on-surface-variant mt-2 font-medium">Kam</span>
            </div>
            {/* Jum */}
            <div className="flex flex-col items-center h-full justify-end">
              <span className="text-[10px] text-on-surface-variant mb-1">2,7</span>
              <div className="w-full max-w-[24px] h-[62%] rounded-t-md bg-gradient-to-t from-primary-container to-secondary opacity-75"></div>
              <span className="text-[11px] text-on-surface-variant mt-2 font-medium">Jum</span>
            </div>
            {/* Sab */}
            <div className="flex flex-col items-center h-full justify-end">
              <span className="text-[10px] text-outline-variant mb-1">0</span>
              <div className="w-full max-w-[24px] h-[8%] rounded-t bg-surface-container-highest"></div>
              <span className="text-[11px] text-on-surface-variant mt-2 font-medium">Sab</span>
            </div>
            {/* Min */}
            <div className="flex flex-col items-center h-full justify-end">
              <span className="text-[10px] text-outline-variant mb-1">0</span>
              <div className="w-full max-w-[24px] h-[8%] rounded-t bg-surface-container-highest"></div>
              <span className="text-[11px] text-on-surface-variant mt-2 font-medium">Min</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tombol Aksi Cepat */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onOpenCatat();
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-container to-secondary text-surface text-sm font-bold shadow-md active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Catat Aktivitas</span>
        </button>

        <a
          href="https://t.me/sehatkeluarga_bot"
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic('light')}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold shadow-md active:scale-95 transition-all border border-surface-container-high/40"
        >
          <span className="material-symbols-outlined text-[20px] text-tertiary">upload_file</span>
          <span>Impor GPX Bot</span>
        </a>
      </div>

      {/* 4. Filter Chips Interaktif */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Filter Jenis Aktivitas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setFilterType('semua');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              filterType === 'semua'
                ? 'bg-gradient-to-r from-primary-container to-secondary text-surface shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Semua Aktivitas
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setFilterType('jalan');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              filterType === 'jalan'
                ? 'bg-gradient-to-r from-primary-container to-secondary text-surface shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">directions_walk</span>
            <span>Jalan Kaki</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setFilterType('lari');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              filterType === 'lari'
                ? 'bg-gradient-to-r from-primary-container to-secondary text-surface shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">directions_run</span>
            <span>Lari</span>
          </button>
        </div>

        {/* Filter Lokasi */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterLoc('semua')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
              filterLoc === 'semua'
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            Semua Tempat
          </button>
          <button
            type="button"
            onClick={() => setFilterLoc('dalam')}
            className={`px-3 py-1 rounded-full text-[11px] font-normal flex items-center gap-1 shrink-0 ${
              filterLoc === 'dalam'
                ? 'bg-tertiary/20 text-tertiary font-semibold'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>Dalam Ruangan</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterLoc('luar')}
            className={`px-3 py-1 rounded-full text-[11px] font-normal flex items-center gap-1 shrink-0 ${
              filterLoc === 'luar'
                ? 'bg-secondary/20 text-secondary font-semibold'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Luar Ruangan</span>
          </button>
        </div>
      </div>

      {/* 5. Daftar Riwayat Aktivitas */}
      <div className="flex flex-col space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-on-surface">Riwayat Aktivitas</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold">
              {filteredList.length} sesi
            </span>
          </div>
          <button
            type="button"
            onClick={fetchActivities}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Segarkan
          </button>
        </div>

        {/* Item List Cards */}
        <div className="space-y-3">
          {filteredList.map((item) => {
            const isWalk = item.activity_type === 'jalan';
            return (
              <div
                key={item.id}
                onClick={() => onSelectActivity && onSelectActivity(item)}
                className="rounded-2xl bg-surface-container p-4 shadow-md flex flex-col space-y-3 border border-surface-container-high/40 hover:bg-surface-container-high/60 transition-all cursor-pointer active:scale-[0.99]"
              >
                {/* Header Item */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isWalk ? 'bg-secondary/15 text-secondary' : 'bg-primary/15 text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isWalk ? 'directions_walk' : 'directions_run'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-on-surface">{item.activity_name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.location_type === 'luar'
                              ? 'bg-secondary/15 text-secondary'
                              : 'bg-tertiary/15 text-tertiary'
                          }`}
                        >
                          {item.location_type === 'luar' ? 'Luar ruangan' : 'Dalam ruangan'}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        {item.location_note || 'Aktivitas Harian'}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant text-[20px]">
                    chevron_right
                  </span>
                </div>

                {/* Angka Jarak, Durasi, dan Kalori */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-surface-container-low text-center">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Jarak</span>
                    <span className="text-xs font-bold text-on-surface">{item.distance_km || 0} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Durasi</span>
                    <span className="text-xs font-bold text-on-surface">{formatDuration(item.duration_seconds)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Kalori</span>
                    <span className="text-xs font-bold text-secondary">~{item.calories || 0} kkal</span>
                  </div>
                </div>

                {/* Footer Sumber Data */}
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      {item.source === 'file GPX' ? 'route' : 'edit_note'}
                    </span>
                    <span>Sumber: {item.source || 'input mandiri'}</span>
                  </span>
                  {item.heart_rate_avg && (
                    <span className="flex items-center gap-1 text-error font-medium">
                      <span className="material-symbols-outlined text-[13px]">favorite</span>
                      <span>{item.heart_rate_avg} bpm</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Pesan Motivasi Keluarga */}
      <div className="rounded-2xl bg-surface-container-low p-4 flex items-center gap-3 border border-surface-container-high/30">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined text-[22px]">favorite</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-on-surface">Hebat, keluarga aktif!</p>
          <p className="text-[11px] text-on-surface-variant truncate">
            Sisa 2,6 km lagi untuk menuntaskan sasaran pekan ini.
          </p>
        </div>
      </div>

    </div>
  );
}
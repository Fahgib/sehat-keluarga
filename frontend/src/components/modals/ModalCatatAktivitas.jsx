import React, { useState } from 'react';
import { supabase, triggerHaptic } from '../../services/supabase';

export default function ModalCatatAktivitas({ isOpen, onClose, onActivitySaved }) {
  const [activityType, setActivityType] = useState('jalan');
  const [locationType, setLocationType] = useState('luar');
  const [distance, setDistance] = useState(1.20);
  const [durasiJJ, setDurasiJJ] = useState('00');
  const [durasiMM, setDurasiMM] = useState('25');
  const [durasiDD, setDurasiDD] = useState('00');
  const [heartRate, setHeartRate] = useState(102);
  const [calories, setCalories] = useState(78);
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Fungsi menambah/mengurangi jarak secara cepat
  const adjustDistance = (amount) => {
    triggerHaptic('light');
    setDistance((prev) => Math.max(0, parseFloat((prev + amount).toFixed(2))));
  };

  // Fungsi menambah menit durasi
  const addQuickMinutes = (mins) => {
    triggerHaptic('light');
    const totalMinutes = (parseInt(durasiJJ, 10) || 0) * 60 + (parseInt(durasiMM, 10) || 0) + mins;
    const newJJ = Math.floor(totalMinutes / 60);
    const newMM = totalMinutes % 60;
    setDurasiJJ(String(newJJ).padStart(2, '0'));
    setDurasiMM(String(newMM).padStart(2, '0'));
  };

  // Fungsi menyimpan data ke Supabase
  const handleSave = async (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    setLoading(true);

    const totalSeconds =
      (parseInt(durasiJJ, 10) || 0) * 3600 +
      (parseInt(durasiMM, 10) || 0) * 60 +
      (parseInt(durasiDD, 10) || 0);

    const activityLabel = activityType === 'jalan' ? 'Jalan Kaki' : 'Lari Santai';

    try {
      const { error } = await supabase.from('activities').insert([
        {
          activity_name: activityLabel,
          activity_type: activityType,
          location_type: locationType,
          distance_km: parseFloat(distance),
          duration_seconds: totalSeconds,
          calories: parseInt(calories, 10) || 0,
          heart_rate_avg: parseInt(heartRate, 10) || null,
          is_shared: isShared,
        },
      ]);

      if (error) throw error;

      if (onActivitySaved) onActivitySaved();
      onClose();
    } catch (err) {
      alert('Gagal menyimpan aktivitas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-surface-container-lowest/80 backdrop-blur-sm">
      <div className="relative w-full max-w-[430px] rounded-t-[28px] bg-surface-container flex flex-col max-h-[90vh] shadow-[0_-16px_40px_rgba(0,0,0,0.65)] overflow-hidden border-t border-surface-container-high/60 animate-in slide-in-from-bottom duration-300">
        
        {/* Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1 bg-surface-container">
          <div className="w-10 h-1 rounded-full bg-outline-variant"></div>
        </div>

        {/* Modal Top Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-surface-container-high/40">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-on-surface">Catat Aktivitas</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-safe">
          
          {/* Subtitle Info */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-on-surface">Input Mandiri</span>
              <span className="text-xs text-on-surface-variant">Masukkan data gerak harian keluarga</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span>Keluarga Sehat</span>
            </div>
          </div>

          {/* Pemilihan Jenis Gerak */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Pilih Jenis Gerak
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container-low">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActivityType('jalan');
                }}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all duration-200 text-xs font-bold ${
                  activityType === 'jalan'
                    ? 'bg-gradient-to-r from-primary-container to-secondary text-surface font-bold shadow-lg shadow-primary-container/20'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: activityType === 'jalan' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  directions_walk
                </span>
                <span>Jalan Kaki</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setActivityType('lari');
                }}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all duration-200 text-xs font-bold ${
                  activityType === 'lari'
                    ? 'bg-gradient-to-r from-primary-container to-secondary text-surface font-bold shadow-lg shadow-primary-container/20'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: activityType === 'lari' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  directions_run
                </span>
                <span>Lari Santai</span>
              </button>
            </div>

            {/* Pemilihan Lokasi */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-container-low">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setLocationType('dalam');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all duration-200 text-xs ${
                  locationType === 'dalam'
                    ? 'bg-surface-container-high text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: locationType === 'dalam' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  home
                </span>
                <span>Dalam Ruangan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setLocationType('luar');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all duration-200 text-xs ${
                  locationType === 'luar'
                    ? 'bg-surface-container-high text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: locationType === 'luar' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  nature_people
                </span>
                <span>Luar Ruangan</span>
              </button>
            </div>
          </div>

          {/* Input Jarak Tempuh */}
          <div className="p-4 rounded-2xl bg-surface-container-high flex flex-col gap-1 shadow-sm border border-surface-container-highest/50">
            <div className="flex items-center justify-between">
              <label className="text-xs text-on-surface-variant">Jarak Ditempuh</label>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-container/10 px-2 py-0.5 rounded-full">
                Target 2,0 km
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="flex items-baseline gap-1.5">
                <input
                  type="number"
                  step="0.05"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                  className="bg-transparent text-3xl font-bold text-primary focus:outline-none w-32 tracking-tight"
                />
                <span className="text-sm font-bold text-on-surface-variant">km</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustDistance(-0.1)}
                  className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustDistance(0.1)}
                  className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Input Durasi Latihan */}
          <div className="p-4 rounded-2xl bg-surface-container-high flex flex-col gap-2 shadow-sm border border-surface-container-highest/50">
            <div className="flex items-center justify-between">
              <label className="text-xs text-on-surface-variant">Durasi Latihan</label>
              <span className="text-[11px] text-secondary font-medium">Format (Jam : Mnt : Dtk)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="flex flex-col items-center p-2 rounded-xl bg-surface-container-low">
                <input
                  type="text"
                  maxLength={2}
                  value={durasiJJ}
                  onChange={(e) => setDurasiJJ(e.target.value)}
                  className="w-full text-center bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                />
                <span className="text-[10px] text-on-surface-variant mt-0.5">Jam</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-surface-container-low">
                <input
                  type="text"
                  maxLength={2}
                  value={durasiMM}
                  onChange={(e) => setDurasiMM(e.target.value)}
                  className="w-full text-center bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                />
                <span className="text-[10px] text-on-surface-variant mt-0.5">Menit</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-surface-container-low">
                <input
                  type="text"
                  maxLength={2}
                  value={durasiDD}
                  onChange={(e) => setDurasiDD(e.target.value)}
                  className="w-full text-center bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                />
                <span className="text-[10px] text-on-surface-variant mt-0.5">Detik</span>
              </div>
            </div>

            {/* Tombol Tambah Menit Cepat */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              <span className="text-[11px] text-on-surface-variant shrink-0">Tambah cepat:</span>
              <button
                type="button"
                onClick={() => addQuickMinutes(5)}
                className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                +5 mnt
              </button>
              <button
                type="button"
                onClick={() => addQuickMinutes(15)}
                className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                +15 mnt
              </button>
              <button
                type="button"
                onClick={() => addQuickMinutes(30)}
                className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs hover:bg-surface-container-highest active:scale-95 transition-all"
              >
                +30 mnt
              </button>
            </div>
          </div>

          {/* Detak Jantung & Kalori Aktif */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3.5 rounded-2xl bg-surface-container-high flex flex-col gap-1 border border-surface-container-highest/50">
              <div className="flex items-center gap-1 text-error text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <span>Detak Jantung</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-on-surface focus:outline-none focus:text-primary"
                />
                <span className="text-xs text-on-surface-variant font-semibold">bpm</span>
              </div>
              <span className="text-[10px] text-on-surface-variant">Rata-rata monitor</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-high flex flex-col gap-1 border border-surface-container-highest/50">
              <div className="flex items-center gap-1 text-secondary text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                <span>Kalori Aktif</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-on-surface focus:outline-none focus:text-secondary"
                />
                <span className="text-xs text-on-surface-variant font-semibold">kkal</span>
              </div>
              <span className="text-[10px] text-on-surface-variant">Terbakar alami</span>
            </div>
          </div>

          {/* Toggle Bagikan ke Grup Keluarga (Default: Off / Privasi) */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between border border-surface-container-high/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">Bagikan ke Grup Keluarga</span>
                <span className="text-[11px] text-on-surface-variant">Beri tahu capaian hari ini</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-surface after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-surface font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>{loading ? 'Menyimpan ke Database...' : 'Simpan Aktivitas'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 rounded-full bg-transparent text-on-surface-variant hover:text-on-surface text-xs font-semibold flex items-center justify-center transition-colors"
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
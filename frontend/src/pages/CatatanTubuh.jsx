import React, { useState } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

export default function CatatanTubuh({ onBack }) {
  // State untuk form input vital baru
  const [showInputModal, setShowInputModal] = useState(false);
  const [systolic, setSystolic] = useState(118);
  const [diastolic, setDiastolic] = useState(78);
  const [restingHr, setRestingHr] = useState(62);
  const [sleepHours, setSleepHours] = useState(7.25);
  const [saving, setSaving] = useState(false);

  // Simpan data tanda vital ke Supabase
  const handleSaveVitals = async (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    setSaving(true);

    try {
      const { error } = await supabase.from('body_vitals').insert([
        {
          blood_pressure_systolic: parseInt(systolic, 10),
          blood_pressure_diastolic: parseInt(diastolic, 10),
          resting_heart_rate: parseInt(restingHr, 10),
          sleep_hours: parseFloat(sleepHours),
          recorded_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      alert('Catatan vital berhasil disimpan ke database!');
      setShowInputModal(false);
    } catch (err) {
      alert('Gagal menyimpan data vital: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      
      {/* 1. Header Top Sub-Navigation */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onBack();
              }}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">vital_signs</span>
              <span>Tanda Vital Harian</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mt-1">Catatan Tubuh</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setShowInputModal(true);
          }}
          className="h-9 px-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Catat Vital</span>
        </button>
      </section>

      {/* 2. Bento Card 1: Tidur Semalam */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-tertiary/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bedtime
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Tidur Semalam</h3>
              <span className="text-[11px] text-on-surface-variant">22.45 - 06.00 WIB</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold">
            Kualitas Baik
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-3xl font-bold text-on-surface tracking-tight">7j 15m</span>
          <span className="text-xs text-on-surface-variant">Target 7–8 jam</span>
        </div>

        {/* 7-Day Sleep Duration Bars */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2">
            <span>Tren 7 Hari Terakhir</span>
            <span className="text-primary font-medium">Rata-rata 7,2 jam</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-20 pt-2 pb-1">
            {[
              { day: 'Jum', val: 7.0, pct: '85%' },
              { day: 'Sab', val: 8.2, pct: '100%' },
              { day: 'Min', val: 7.5, pct: '90%' },
              { day: 'Sen', val: 6.5, pct: '75%' },
              { day: 'Sel', val: 7.0, pct: '85%' },
              { day: 'Rab', val: 7.25, pct: '88%', active: true },
              { day: 'Kam', val: 0, pct: '10%', empty: true },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                <div
                  className={`w-full max-w-[20px] rounded-t-md transition-all ${
                    item.empty
                      ? 'bg-surface-container-highest h-[10%]'
                      : item.active
                      ? 'bg-gradient-to-t from-primary-container to-secondary shadow-sm shadow-primary/30'
                      : 'bg-primary/40'
                  }`}
                  style={{ height: item.pct }}
                ></div>
                <span className={`text-[10px] mt-1.5 ${item.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bento Card 2: Detak Jantung Istirahat */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-error/15 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Detak Jantung Istirahat</h3>
              <span className="text-[11px] text-on-surface-variant">Saat bangun pagi</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-bold">
            Normal & Bugar
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-3xl font-bold text-on-surface tracking-tight">62</span>
          <span className="text-sm font-semibold text-on-surface-variant">bpm</span>
        </div>

        {/* Resting Heart Rate Sparkline Wave */}
        <div className="w-full h-16 mt-1 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 60">
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 0,35 Q 50,45 100,28 T 200,32 T 300,20 L 300,60 L 0,60 Z" fill="url(#hrGrad)" />
            <path d="M 0,35 Q 50,45 100,28 T 200,32 T 300,20" fill="transparent" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="298" cy="20" r="4.5" fill="#ef4444" />
          </svg>
        </div>
      </section>

      {/* 4. Bento Card 3: Tekanan Darah (Tensi) */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">blood_pressure</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Tekanan Darah (Tensi)</h3>
              <span className="text-[11px] text-on-surface-variant">Terakhir diukur: Pagi tadi</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold">
            Optimal
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-3xl font-bold text-on-surface tracking-tight">118 / 78</span>
          <span className="text-sm font-semibold text-on-surface-variant">mmHg</span>
        </div>

        {/* Baris Dot Matrix Pengukuran Tensi */}
        <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-2 border border-surface-container-high/40">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant font-medium">Sistolik (Atas)</span>
            <span className="font-bold text-on-surface">118 mmHg (Bagus)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full rounded-full bg-secondary transition-all" style={{ width: '65%' }}></div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-on-surface-variant font-medium">Diastolik (Bawah)</span>
            <span className="font-bold text-on-surface">78 mmHg (Bagus)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Catatan Dokter Ramah */}
        <div className="flex items-start gap-2 pt-1 text-[11px] text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">info</span>
          <span>Tekanan darah Anda stabil dan prima. Pertahankan konsumsi air putih cukup serta pola makan rendah garam.</span>
        </div>
      </section>

      {/* 5. Modal Bottom Sheet: Input Vital Cepat */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-[430px] bg-surface-container rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 border-t border-surface-container-high/60 animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 rounded-full bg-outline/40 mx-auto -mt-1 mb-1"></div>

            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">Catat Tanda Vital Tubuh</h3>
              <button
                type="button"
                onClick={() => setShowInputModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveVitals} className="flex flex-col gap-3">
              {/* Input Tensi */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Sistolik (mmHg)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Diastolik (mmHg)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                  />
                </div>
              </div>

              {/* Input HR & Tidur */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Detak Jantung (bpm)</label>
                  <input
                    type="number"
                    value={restingHr}
                    onChange={(e) => setRestingHr(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant">Tidur (Jam)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full bg-transparent text-xl font-bold text-on-surface focus:outline-none focus:text-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform mt-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{saving ? 'Menyimpan...' : 'Simpan ke Database'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../services/supabase';

export default function LaporanMingguan({ onBack }) {
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);

  // Fungsi simulasi kirim laporan ke Telegram Bot
  const handleSendTelegram = () => {
    triggerHaptic('medium');
    setSendingTelegram(true);

    setTimeout(() => {
      setSendingTelegram(false);
      setTelegramSent(true);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#008774', '#0d9488', '#84cc16', '#38bdf8'],
      });

      alert('Laporan Mingguan berhasil dikirimkan ke grup Telegram Sehat Keluarga!');
    }, 1200);
  };

  const handleDownloadPDF = () => {
    triggerHaptic('light');
    alert('Menyiapkan berkas ringkasan PDF Laporan Mingguan...');
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      
      {/* 1. Header Sub-Navigasi */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBack && (
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
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">summarize</span>
              <span>Rekapitulasi 7 Hari</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mt-1">Laporan Mingguan</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors"
          title="Unduh Berkas PDF"
        >
          <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
        </button>
      </section>

      {/* 2. Hero Card: Aktivitas Fisik & Jarak Pekanan */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-xl relative overflow-hidden border border-surface-container-high/40 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Periode: 15 – 21 Mei</span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Target Tercapai
          </span>
        </div>

        <div>
          <span className="text-xs text-on-surface-variant block mb-1">Aktivitas Fisik & Jarak</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-on-surface tracking-tight">18,55</span>
            <span className="text-base font-bold text-primary">km</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
          <div>
            <span className="text-[10px] text-on-surface-variant block">Total Sesi</span>
            <span className="text-sm font-bold text-on-surface">4 Sesi Olahraga</span>
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant block">Durasi Gerak</span>
            <span className="text-sm font-bold text-on-surface">3j 42m Total</span>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2">
            <span>Grafik Distribusi Jarak Harian</span>
            <span className="text-primary font-semibold">Tertinggi 5,2 km</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-24 pt-3 pb-1">
            {[
              { day: 'Sen', val: '3,4', h: '65%' },
              { day: 'Sel', val: '2,1', h: '40%' },
              { day: 'Rab', val: '4,2', h: '80%' },
              { day: 'Kam', val: '0', h: '10%', off: true },
              { day: 'Jum', val: '5,2', h: '100%', best: true },
              { day: 'Sab', val: '3,6', h: '70%' },
              { day: 'Min', val: '0', h: '10%', off: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                <span className="text-[9px] text-on-surface-variant mb-1">{bar.val}</span>
                <div
                  className={`w-full max-w-[22px] rounded-t-md transition-all ${
                    bar.off
                      ? 'bg-surface-container-highest'
                      : bar.best
                      ? 'bg-gradient-to-t from-primary-container to-secondary shadow-sm shadow-primary/30'
                      : 'bg-primary/50'
                  }`}
                  style={{ height: bar.h }}
                ></div>
                <span className={`text-[10px] mt-1.5 ${bar.best ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bento Grid: Nutrisi & Hidrasi */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-2 border border-surface-container-high/40">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[16px] text-amber-500">restaurant</span>
            <span>Rata-rata Nutrisi</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-on-surface">1.850</span>
            <span className="text-xs text-on-surface-variant">kkal/hari</span>
          </div>
          <span className="text-[10px] text-secondary font-medium">Asupan gizi seimbang</span>
        </div>

        <div className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-2 border border-surface-container-high/40">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[16px] text-tertiary">water_drop</span>
            <span>Konsistensi Air</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-on-surface">88%</span>
            <span className="text-xs text-on-surface-variant">target</span>
          </div>
          <span className="text-[10px] text-tertiary font-medium">~1.920 ml per hari</span>
        </div>
      </section>

      {/* 4. Bento Card: Kualitas & Durasi Istirahat */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-[18px]">bedtime</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface">Kualitas & Durasi Istirahat</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">
            7 Hari
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-3xl font-bold text-on-surface tracking-tight">7j 15m</span>
          <span className="text-xs text-on-surface-variant">Rata-rata tidur semalam</span>
        </div>

        {/* Indikator Titik Pemulihan Harian */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface-container-low border border-surface-container-high/30">
              <span className="text-[10px] text-on-surface-variant">{day}</span>
              <span className={`w-3 h-3 rounded-full ${i === 3 ? 'bg-amber-400' : 'bg-primary'}`}></span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bento Card: Ringkasan Evaluasi Ramah */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <h3 className="text-sm font-bold text-on-surface">Evaluasi Kebugaran Keluarga</h3>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Pekan ini ritme gerak Anda sangat konsisten. Rutinitas jalan santai dan asupan air meningkat 12% dibandingkan pekan sebelumnya. Pola istirahat stabil mendukung pemulihan tubuh secara optimal.
        </p>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-primary font-medium">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>Target pekan depan: Pertahankan langkah harian & perbanyak sayur hijau.</span>
        </div>
      </section>

      {/* 6. Tombol Aksi: Kirim ke Telegram & Ekspor */}
      <section className="flex flex-col gap-2.5 pt-2">
        <button
          type="button"
          disabled={sendingTelegram}
          onClick={handleSendTelegram}
          className={`w-full h-12 rounded-full text-surface text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-60 ${
            telegramSent
              ? 'bg-secondary text-surface'
              : 'bg-gradient-to-r from-primary-container to-secondary text-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {telegramSent ? 'done_all' : 'send'}
          </span>
          <span>
            {sendingTelegram
              ? 'Mengirimkan ke Telegram...'
              : telegramSent
              ? 'Terkirim ke Telegram!'
              : 'Kirim Ringkasan ke Bot Telegram'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="w-full h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 border border-surface-container-high/60 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Unduh Berkas Lengkap (PDF)</span>
        </button>
      </section>

    </div>
  );
}
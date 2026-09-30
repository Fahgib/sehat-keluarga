import React, { useState } from 'react';
import { triggerHaptic } from '../services/supabase';

export default function Keluarga() {
  const familyCode = 'SK-7842';
  const [copied, setCopied] = useState(false);
  const [compactMode, setCompactMode] = useState(true);

  // Status izin kategori untuk pengguna utama (Default: false / Terkunci pribadi)
  const [privacySettings, setPrivacySettings] = useState({
    aktivitas: false,
    airMakan: false,
    gizi: false,
    tubuh: false,
  });

  // Salin kode undangan ke clipboard
  const handleCopyCode = async () => {
    triggerHaptic('light');
    try {
      await navigator.clipboard.writeText(familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      alert(`Kode keluarga: ${familyCode}`);
    }
  };

  // Bagikan kode via Web Share API
  const handleShareCode = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: 'Gabung Sehat Keluarga',
        text: `Gunakan kode ${familyCode} untuk bergabung ke catatan kesehatan keluarga saya.`,
      }).catch(() => {});
    } else {
      handleCopyCode();
    }
  };

  // Toggle kategori privasi
  const toggleCategoryPrivacy = (categoryKey) => {
    triggerHaptic('light');
    setPrivacySettings((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      
      {/* 1. Header Intro Bagian Keluarga */}
      <section className="flex flex-col gap-1 pt-1">
        <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-surface-container-high text-primary">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            groups_3
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase">Ruang Lingkup Keluarga</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">Keluarga Sehat</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Kelola anggota keluarga, kendali akses data, dan privasi catatan bersama dalam satu dasbor terpadu.
        </p>
      </section>

      {/* 2. Hero Bento Card: Tambah Anggota */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-xl relative overflow-hidden border border-surface-container-high/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface leading-tight">Tambah Anggota</h3>
              <span className="text-[11px] text-on-surface-variant">Hubungkan profil keluarga</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-semibold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Aktif 24 Jam
          </span>
        </div>

        {/* Code Container Box */}
        <div className="rounded-2xl bg-surface-container-lowest p-3.5 flex flex-col gap-2 shadow-inner border border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider text-on-surface-variant uppercase font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">key</span>
              Kode Undangan Keluarga
            </span>
            <span className="text-[11px] text-primary font-medium">Bisa dipakai 2x</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-2xl tracking-widest text-primary font-bold select-all font-mono">
              {familyCode}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="h-9 px-3 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>Salin</span>
              </button>
              <button
                type="button"
                onClick={handleShareCode}
                className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all"
                title="Bagikan Tautan"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>
          </div>

          {/* Toast Salin */}
          {copied && (
            <div className="self-center inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full bg-surface-container-high text-secondary text-[11px] font-medium animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Kode berhasil disalin!
            </div>
          )}
        </div>

        <p className="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
          Bagikan kode ini kepada pasangan atau anak untuk terhubung langsung ke catatan kebugaran bersama tanpa registrasi rumit.
        </p>
      </section>

      {/* 3. Bento Card: Privasi Bot Telegram & Mode Ringkas */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-xl flex flex-col gap-3 border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">send</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Privasi Bot Telegram</h3>
              <span className="text-[11px] text-tertiary font-mono">@sehatkeluarga_bot</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px]">
            Grup Rumah
          </span>
        </div>

        {/* Toggle Mode Ringkas */}
        <div className="rounded-2xl bg-surface-container-low p-3.5 flex flex-col gap-1.5 border border-surface-container-high/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">visibility_off</span>
              <span className="text-xs font-bold text-on-surface">Mode Ringkas Otomatis</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => {
                  triggerHaptic('light');
                  setCompactMode(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Menyembunyikan nilai sensitif pada pesan otomatis Telegram. Tensi darah, detak jantung, atau gramasi makanan hanya tampil sebagai status kualitatif saat dipublikasikan ke grup.
          </p>
        </div>
      </section>

      {/* 4. Section Anggota Terdaftar */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-on-surface">Anggota Terdaftar</h3>
          <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[11px] text-primary font-bold">
            3
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
          <span>Default: Terkunci (Pribadi)</span>
        </div>
      </section>

      {/* 5. Daftar Kartu Anggota */}
      <div className="flex flex-col gap-3">
        
        {/* Anggota 1: Rina (Pemilik / Akun Anda) */}
        <article className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-3 border border-surface-container-high/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-surface font-bold text-sm shadow-md">
                RN
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-on-surface">Rina</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
                    Pemilik
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Akun Utama • Aktif Sekarang
                </span>
              </div>
            </div>
            <button type="button" className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
          </div>

          {/* Kendali Kategori Privasi Rina */}
          <div className="rounded-2xl bg-surface-container-low p-3 flex flex-col gap-2 border border-surface-container-high/30">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-on-surface uppercase tracking-wide">
                Kendali Berbagi Kategori
              </span>
              <span className="text-on-surface-variant">Dasbor Bersama</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              {[
                { key: 'aktivitas', label: 'Aktivitas', icon: 'directions_run' },
                { key: 'airMakan', label: 'Air & Makan', icon: 'water_drop' },
                { key: 'gizi', label: 'Gizi', icon: 'nutrition' },
                { key: 'tubuh', label: 'Catatan Tubuh', icon: 'favorite' },
              ].map((cat) => {
                const isShared = privacySettings[cat.key];
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => toggleCategoryPrivacy(cat.key)}
                    className="p-2 rounded-xl bg-surface-container flex items-center justify-between hover:bg-surface-container-high transition-colors text-left"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        {cat.icon}
                      </span>
                      <span className="text-xs text-on-surface truncate">{cat.label}</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold flex items-center gap-0.5 ${
                        isShared
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px]">
                        {isShared ? 'check' : 'lock'}
                      </span>
                      {isShared ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 pt-0.5 text-on-surface-variant text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
              <span>Kategori berstatus OFF hanya dapat dilihat oleh pemilik akun.</span>
            </div>
          </div>
        </article>

        {/* Anggota 2: Dimas */}
        <article className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-2.5 border border-surface-container-high/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-container-highest text-tertiary font-bold text-sm flex items-center justify-center">
                DM
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-on-surface">Dimas</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px]">
                    Anggota
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant mt-0.5">
                  Sinkronisasi 2 jam lalu
                </span>
              </div>
            </div>
            <button type="button" className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-2.5 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Status Izin Dasbor:</span>
            <span className="font-semibold text-primary">4 Kategori Terkunci Pribadi</span>
          </div>
        </article>

        {/* Anggota 3: Rizky */}
        <article className="rounded-3xl bg-surface-container p-4 shadow-md flex flex-col gap-2.5 border border-surface-container-high/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-container-highest text-secondary font-bold text-sm flex items-center justify-center">
                RZ
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-on-surface">Rizky</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px]">
                    Anggota
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant mt-0.5">
                  Sinkronisasi kemarin
                </span>
              </div>
            </div>
            <button type="button" className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-2.5 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Status Izin Dasbor:</span>
            <span className="font-semibold text-primary">4 Kategori Terkunci Pribadi</span>
          </div>
        </article>

      </div>

      {/* 6. Footer Jaminan Enkripsi & Privasi */}
      <footer className="rounded-2xl bg-surface-container-low p-4 flex items-start gap-3 border border-surface-container-high/30">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-on-surface">
            Enkripsi Privasi Keluarga Terjamin
          </h4>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Data kesehatan keluarga Anda dienkripsi secara privat di Supabase. Setiap anggota memiliki kendali penuh atas data apa saja yang ingin dibagikan ke dasbor keluarga maupun grup eksternal.
          </p>
        </div>
      </footer>

    </div>
  );
}
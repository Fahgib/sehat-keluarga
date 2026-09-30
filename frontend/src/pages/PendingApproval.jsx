import React, { useState } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

export default function PendingApproval({ profile, onRefresh, onLogout }) {
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    triggerHaptic('light');
    setChecking(true);
    await onRefresh();
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-5 py-8 max-w-[430px] mx-auto text-center select-none">
      
      {/* Icon Pending Sand Timer */}
      <div className="w-20 h-20 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 mb-4 shadow-inner ring-4 ring-amber-500/10 animate-pulse">
        <span className="material-symbols-outlined text-[42px]">hourglass_top</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-amber-400 text-xs font-bold mb-2">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        Status: Menunggu Persetujuan
      </div>

      <h2 className="text-xl font-bold text-on-surface">Pendaftaran Sedang Ditinjau</h2>
      <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed max-w-xs">
        Halo <strong className="text-on-surface">{profile?.full_name || 'Anggota'}</strong> ({profile?.email}), akun Anda berhasil didaftarkan namun memerlukan persetujuan (ACC) dari Admin keluarga sebelum dapat mengakses catatan kesehatan.
      </p>

      {/* Info Card */}
      <div className="w-full rounded-2xl bg-surface-container p-4 mt-6 border border-surface-container-high/40 text-left flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase text-primary">Apa yang harus dilakukan?</span>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Hubungi pemilik/admin keluarga Anda dan minta mereka membuka tab <strong>Dasbor Admin</strong> untuk mengaktifkan akun Anda.
        </p>
      </div>

      {/* Tombol Aksi */}
      <div className="w-full flex flex-col gap-2.5 mt-6">
        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={checking}
          className="w-full h-12 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>{checking ? 'Memeriksa...' : 'Periksa Status Persetujuan'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            supabase.auth.signOut();
            if (onLogout) onLogout();
          }}
          className="w-full h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 border border-surface-container-high/50 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Keluar dari Akun</span>
        </button>
      </div>

    </div>
  );
}
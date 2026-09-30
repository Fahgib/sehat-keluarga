import React from 'react';
import { triggerHaptic } from '../../services/supabase';

export default function Header({
  title,
  subtitle = 'SEHAT KELUARGA',
  user,
  isDark,
  toggleTheme,
  onLogout,
}) {
  const handleNotificationClick = () => {
    triggerHaptic('light');
    alert('Belum ada notifikasi baru.');
  };

  const handleLogoutClick = () => {
    triggerHaptic('medium');
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari akun?');
    if (confirmLogout && onLogout) {
      onLogout();
    }
  };

  const userInitial = user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 pt-safe transition-colors duration-200">
      <div className="max-w-[430px] mx-auto h-16 px-4 flex items-center justify-between">
        
        {/* Sisi Kiri: Judul Halaman */}
        <div className="flex flex-col justify-center min-w-0 pr-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-primary truncate leading-tight">
            {subtitle}
          </span>
          <h1 className="text-xl font-bold text-on-surface truncate leading-tight mt-0.5">
            {title}
          </h1>
        </div>

        {/* Sisi Kanan: Tema, Notifikasi, Avatar, dan Tombol Logout */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* 1. Tombol Sakelar Tema */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              toggleTheme();
            }}
            aria-label={isDark ? 'Ganti ke Mode Cerah' : 'Ganti ke Mode Gelap'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
            title={isDark ? 'Mode Cerah' : 'Mode Gelap'}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* 2. Tombol Notifikasi */}
          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="Notifikasi"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors relative active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface shadow-[0_0_8px_rgba(157,223,46,0.6)]"></span>
          </button>

          {/* 3. Avatar Inisial Pengguna */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-surface font-bold text-xs shadow-sm select-none"
            title={user?.first_name || 'Pengguna'}
          >
            {userInitial}
          </div>

          {/* 4. Tombol Logout (Keluar Akun User) */}
          {onLogout && (
            <button
              type="button"
              onClick={handleLogoutClick}
              aria-label="Keluar dari Akun"
              className="w-9 h-9 rounded-full flex items-center justify-center text-error/80 hover:text-error hover:bg-error/10 transition-all active:scale-95 ml-0.5"
              title="Keluar dari Akun"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
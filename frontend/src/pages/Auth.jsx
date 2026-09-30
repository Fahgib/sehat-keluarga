import React, { useState } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (onAuthSuccess) onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;

        setSuccessMessage('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan dari Admin.');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
        }, 2200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal memproses akun');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-center items-center px-4 py-8 max-w-[430px] mx-auto select-none transition-colors duration-200">
      
      {/* 1. Header Identitas Aplikasi */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/25 mb-3 transition-transform duration-300 hover:scale-105">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>
        <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
          SEHAT KELUARGA
        </span>
        <h1 className="text-2xl font-extrabold text-on-surface mt-1 transition-all">
          {isLogin ? 'Selamat Datang' : 'Mulai Langkah Sehat'}
        </h1>
        <p className="text-xs text-on-surface-variant max-w-xs mt-1 transition-all">
          {isLogin
            ? 'Masuk untuk memantau ritme sehat dan kebugaran keluarga Anda.'
            : 'Daftarkan akun keluarga untuk saling terhubung dalam satu dasbor.'}
        </p>
      </div>

      {/* 2. Kartu Utama Bento Form */}
      <div className="w-full rounded-3xl bg-surface-container p-6 shadow-xl border border-surface-container-high/60 backdrop-blur-md">
        
        {/* Double Slider Switcher Tab */}
        <div className="relative flex p-1 rounded-2xl bg-surface-container-high/60 mb-6 border border-surface-container-high">
          {/* Slider Pill Animasi */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-primary transition-all duration-300 ease-out shadow-md shadow-primary/20 ${
              isLogin ? 'left-1' : 'left-[calc(50%+2px)]'
            }`}
          ></div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsLogin(true);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`relative z-10 flex-1 py-2.5 text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 ${
              isLogin ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Masuk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsLogin(false);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`relative z-10 flex-1 py-2.5 text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 ${
              !isLogin ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Daftar Akun</span>
          </button>
        </div>

        {/* Notifikasi Error */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-error/15 border border-error/30 text-error text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <span className="leading-tight font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Notifikasi Berhasil */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span className="leading-tight font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {/* Kolom Nama Lengkap (Muncul hanya saat Daftar Akun) */}
          <div
            className={`transition-all duration-300 ease-in-out flex flex-col gap-1.5 overflow-hidden ${
              isLogin ? 'max-h-0 opacity-0 -translate-y-2 pointer-events-none' : 'max-h-24 opacity-100 translate-y-0'
            }`}
          >
            <label className="text-xs font-bold text-on-surface">Nama Lengkap</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                badge
              </span>
              <input
                type="text"
                required={!isLogin}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Gibran Sehat"
                className="w-full h-11 pl-10 pr-4 bg-surface-container-high/40 rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border border-surface-container-high transition-all"
              />
            </div>
          </div>

          {/* Kolom Alamat Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Alamat Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-11 pl-10 pr-4 bg-surface-container-high/40 rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border border-surface-container-high transition-all"
              />
            </div>
          </div>

          {/* Kolom Kata Sandi dengan Tombol Mata */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface">Kata Sandi</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => alert('Silakan hubungi akun Admin keluarga Anda untuk reset kata sandi.')}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Lupa sandi?
                </button>
              )}
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? 'Masukkan kata sandi' : 'Minimal 6 karakter'}
                className="w-full h-11 pl-10 pr-11 bg-surface-container-high/40 rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border border-surface-container-high transition-all"
              />

              {/* Tombol Mata (Show/Hide Password) */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowPassword(!showPassword);
                }}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Tombol Aksi Utama */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  {isLogin ? 'arrow_forward' : 'check'}
                </span>
                <span>{isLogin ? 'Masuk ke Aplikasi' : 'Daftar Akun Sekarang'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Pergantian Cepat */}
        <p className="text-[11px] text-center text-on-surface-variant mt-5">
          {isLogin ? (
            <>
              Belum terdaftar?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-primary font-bold hover:underline"
              >
                Daftar akun keluarga
              </button>
            </>
          ) : (
            <>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-primary font-bold hover:underline"
              >
                Masuk di sini
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}
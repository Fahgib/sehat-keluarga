import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeart, FiActivity } from 'react-icons/fi';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        alert('Pendaftaran berhasil! Silakan cek email untuk verifikasi atau langsung masuk.');
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 flex items-center justify-center p-4 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 mb-3">
            <FiActivity className="w-7 h-7" />
          </div>
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Sehat Keluarga</p>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            {isLogin ? 'Selamat Datang Kembali' : 'Mulai Hidup Sehat'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau kebugaran, hidrasi, dan ritme gerak keluarga Anda.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/60 border border-slate-100 backdrop-blur-sm">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setErrorMessage(''); }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setErrorMessage(''); }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alamat Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-slate-600">Kata Sandi</label>
                {isLogin && (
                  <button type="button" className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium">
                    Lupa sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : isLogin ? 'Masuk ke Aplikasi' : 'Daftar Akun Baru'}
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {isLogin ? 'Belum punya akun keluarga?' : 'Sudah terdaftar sebelumnya?'}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}
                className="text-emerald-600 font-semibold hover:underline"
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
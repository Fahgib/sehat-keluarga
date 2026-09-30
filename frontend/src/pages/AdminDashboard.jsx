import React, { useState, useEffect } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

export default function AdminDashboard({ profile, isDark, toggleTheme, onLogout }) {
  const [usersList, setUsersList] = useState([]);
  const [filter, setFilter] = useState('pending'); // default tampilkan yang butuh di-ACC
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // Ambil semua daftar akun terdaftar
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsersList(data || []);
    } catch (err) {
      alert('Gagal mengambil data user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi ACC (Setujui) atau Tolak Akun
  const handleUpdateStatus = async (userId, newStatus) => {
    triggerHaptic('medium');
    setActionId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      alert('Gagal memperbarui status: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  // Fungsi HAPUS AKUN User
  const handleDeleteUser = async (userId, userEmail) => {
    const konfirmasi = window.confirm(`Apakah Anda yakin ingin MENGHAPUS akun ${userEmail}?`);
    if (!konfirmasi) return;

    triggerHaptic('medium');
    setActionId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      alert('Akun user berhasil dihapus!');
    } catch (err) {
      alert('Gagal menghapus user: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  // Filter & Search
  const filteredUsers = usersList.filter((u) => {
    const matchFilter =
      filter === 'all'
        ? true
        : filter === 'pending'
        ? u.status === 'pending'
        : u.status === 'approved';

    const matchSearch =
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const pendingCount = usersList.filter((u) => u.status === 'pending').length;
  const approvedCount = usersList.filter((u) => u.status === 'approved').length;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col max-w-[430px] mx-auto select-none transition-colors duration-200">
      
      {/* 1. Header Khusus Admin */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 pt-safe transition-colors duration-200">
        <div className="max-w-[430px] mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider uppercase text-primary">
              PANEL KENDALI
            </span>
            <h1 className="text-lg font-bold text-on-surface leading-tight">
              Dasbor Admin
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tombol Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isDark ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

            {/* Tombol Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="w-9 h-9 rounded-full flex items-center justify-center text-error hover:bg-error/15 transition-all"
              title="Keluar"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Isi Konten Admin */}
      <main className="flex-1 w-full px-4 pt-20 pb-10 space-y-4">
        
        {/* Banner Identitas Admin */}
        <div className="p-4 rounded-3xl bg-surface-container flex items-center justify-between border border-surface-container-high/40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-surface font-bold text-sm shadow-md">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">{profile?.full_name || 'Admin'}</span>
              <span className="text-[11px] text-on-surface-variant font-mono">{profile?.email}</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold uppercase tracking-wider">
            Admin Utama
          </span>
        </div>

        {/* Kartu Ringkasan Akun */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-3xl bg-surface-container border border-surface-container-high/40 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] text-on-surface-variant">Menunggu ACC</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-amber-500">{pendingCount}</span>
              <span className="text-xs text-on-surface-variant">user</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-surface-container border border-surface-container-high/40 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] text-on-surface-variant">User Aktif</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-primary">{approvedCount}</span>
              <span className="text-xs text-on-surface-variant">user</span>
            </div>
          </div>
        </div>

        {/* Bilah Pencarian User */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user berdasarkan nama / email..."
            className="w-full h-11 pl-10 pr-4 bg-surface-container rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high/40"
          />
        </div>

        {/* Tab Filter */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'pending'
                ? 'bg-amber-500 text-surface shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Butuh ACC ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'approved'
                ? 'bg-gradient-to-r from-primary-container to-secondary text-surface shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Aktif ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-surface-container-high text-on-surface font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Semua ({usersList.length})
          </button>
        </div>

        {/* Daftar Kartu Akun User */}
        <div className="flex flex-col gap-3 pt-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-on-surface-variant">
              Memuat data pengguna...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-xs text-on-surface-variant bg-surface-container rounded-3xl border border-surface-container-high/40">
              Tidak ada data user.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isSelf = u.id === profile?.id;
              const isPending = u.status === 'pending';
              const isApproved = u.status === 'approved';

              return (
                <div
                  key={u.id}
                  className="p-4 rounded-3xl bg-surface-container border border-surface-container-high/40 shadow-sm flex flex-col gap-3"
                >
                  {/* Info User */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center font-bold text-primary">
                        {(u.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-on-surface">
                            {u.full_name || 'Tanpa Nama'}
                          </span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[9px] font-bold">
                              Anda
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-on-surface-variant font-mono truncate max-w-[190px]">
                          {u.email}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isApproved
                          ? 'bg-secondary/15 text-secondary'
                          : isPending
                          ? 'bg-amber-500/15 text-amber-500'
                          : 'bg-error/15 text-error'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>

                  {/* Tombol Aksi ACC, Tolak, dan Hapus (Tidak bisa hapus diri sendiri) */}
                  {!isSelf && (
                    <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high/30">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={actionId === u.id}
                            onClick={() => handleUpdateStatus(u.id, 'approved')}
                            className="flex-1 h-9 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                            <span>ACC (Setujui)</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionId === u.id}
                            onClick={() => handleUpdateStatus(u.id, 'rejected')}
                            className="h-9 px-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold active:scale-95 transition-all"
                          >
                            Tolak
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          type="button"
                          disabled={actionId === u.id}
                          onClick={() => handleUpdateStatus(u.id, 'pending')}
                          className="h-9 px-3 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-medium"
                        >
                          Batalkan ACC
                        </button>
                      )}

                      {/* Tombol Hapus Akun */}
                      <button
                        type="button"
                        disabled={actionId === u.id}
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="ml-auto w-9 h-9 rounded-full bg-error/10 hover:bg-error/20 text-error flex items-center justify-center active:scale-95 transition-all"
                        title="Hapus Akun User"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </main>

    </div>
  );
}
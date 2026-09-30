import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import ModalCatatAktivitas from './components/modals/ModalCatatAktivitas';

// Halaman Khusus
import Auth from './pages/Auth';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';

// Halaman Khusus User
import Beranda from './pages/Beranda';
import Aktivitas from './pages/Aktivitas';
import Gizi from './pages/Gizi';
import Pengingat from './pages/Pengingat';
import Keluarga from './pages/Keluarga';
import CatatanTubuh from './pages/CatatanTubuh';
import DetailAktivitas from './pages/DetailAktivitas';
import LaporanMingguan from './pages/LaporanMingguan';

import { supabase, initTelegramApp } from './services/supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Navigasi User Biasa
  const [activeTab, setActiveTab] = useState('beranda');
  const [subView, setSubView] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isCatatOpen, setIsCatatOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pengaturan Tema (Cerah / Gelap)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('sehat_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('sehat_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sehat_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Ambil Data Profil dari Supabase
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Pantau Sesi Login
  useEffect(() => {
    initTelegramApp();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoadingAuth(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoadingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-xs text-on-surface-variant">
        Memuat Sehat Keluarga...
      </div>
    );
  }

  // 1. JIKA BELUM LOGIN -> Tampilkan Halaman Login / Registrasi
  if (!session) {
    return <Auth onAuthSuccess={() => setLoadingAuth(true)} />;
  }

  // 2. JIKA AKUN ADALAH ADMIN -> BUKA KHUSUS DASBOR ADMIN (TIDAK ADA DASBOR KESEHATAN)
  if (profile?.role === 'admin') {
    return (
      <AdminDashboard
        profile={profile}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    );
  }

  // 3. JIKA USER BIASA TAPI BELUM DI-ACC -> Tampilkan Halaman Menunggu Persetujuan
  if (profile && profile.status !== 'approved') {
    return (
      <PendingApproval
        profile={profile}
        onRefresh={() => fetchUserProfile(session.user.id)}
        onLogout={handleLogout}
      />
    );
  }

  // 4. JIKA USER BIASA DAN SUDAH DI-ACC -> Tampilkan Dasbor Kesehatan Lengkap
  const getHeaderTitle = () => {
    if (subView === 'catatan-tubuh') return 'Catatan Tubuh';
    if (subView === 'detail-aktivitas') return 'Detail Aktivitas';
    if (subView === 'laporan-mingguan') return 'Laporan Mingguan';
    switch (activeTab) {
      case 'beranda': return 'Beranda';
      case 'aktivitas': return 'Aktivitas';
      case 'gizi': return 'Gizi';
      case 'pengingat': return 'Pengingat';
      case 'keluarga': return 'Keluarga';
      default: return 'Sehat Keluarga';
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col max-w-[430px] mx-auto relative select-none shadow-2xl transition-colors duration-200">
      
     {/* Header Utama untuk User */}
      <Header
        title={getHeaderTitle()}
        subtitle="SEHAT KELUARGA"
        user={{ first_name: profile?.full_name || 'Pengguna' }}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full px-4 pt-20 pb-28 overflow-y-auto">
        {subView === 'catatan-tubuh' && (
          <CatatanTubuh onBack={() => setSubView(null)} />
        )}

        {subView === 'detail-aktivitas' && (
          <DetailAktivitas
            activity={selectedActivity}
            onBack={() => {
              setSubView(null);
              setSelectedActivity(null);
            }}
          />
        )}

        {subView === 'laporan-mingguan' && (
          <LaporanMingguan onBack={() => setSubView(null)} />
        )}

        {!subView && (
          <>
            {activeTab === 'beranda' && (
              <>
                <Beranda
                  key={`beranda-${refreshKey}`}
                  setActiveTab={setActiveTab}
                  onOpenCatat={() => setIsCatatOpen(true)}
                />

                <div
                  onClick={() => setSubView('catatan-tubuh')}
                  className="mt-4 p-4 rounded-3xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-surface-container-high/40 flex items-center justify-between shadow-sm active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[22px]">vital_signs</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Lihat Catatan Tubuh</h4>
                      <p className="text-[11px] text-on-surface-variant">Tidur semalam, tensi, dan detak jantung</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
                </div>

                <div
                  onClick={() => setSubView('laporan-mingguan')}
                  className="mt-3 p-4 rounded-3xl bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer border border-surface-container-high/40 flex items-center justify-between shadow-sm active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">summarize</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Laporan Mingguan</h4>
                      <p className="text-[11px] text-on-surface-variant">Rekapitulasi gerak & nutrisi</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
                </div>
              </>
            )}

            {activeTab === 'aktivitas' && (
              <Aktivitas
                key={`aktivitas-${refreshKey}`}
                onOpenCatat={() => setIsCatatOpen(true)}
                onSelectActivity={(act) => {
                  setSelectedActivity(act);
                  setSubView('detail-aktivitas');
                }}
              />
            )}

            {activeTab === 'gizi' && <Gizi key={`gizi-${refreshKey}`} />}
            {activeTab === 'pengingat' && <Pengingat key={`pengingat-${refreshKey}`} />}
            {activeTab === 'keluarga' && <Keluarga key={`keluarga-${refreshKey}`} />}
          </>
        )}
      </main>

      <BottomNav
        activeTab={subView ? '' : activeTab}
        setActiveTab={(tab) => {
          setSubView(null);
          setSelectedActivity(null);
          setActiveTab(tab);
        }}
      />

      <ModalCatatAktivitas
        isOpen={isCatatOpen}
        onClose={() => setIsCatatOpen(false)}
        onActivitySaved={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
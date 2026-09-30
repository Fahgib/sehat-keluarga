import React from 'react';
import { triggerHaptic } from '../../services/supabase';

// Daftar 5 menu utama sesuai alur aplikasi
const navItems = [
  { id: 'beranda', label: 'Beranda', icon: 'home' },
  { id: 'aktivitas', label: 'Aktivitas', icon: 'directions_run' },
  { id: 'gizi', label: 'Gizi', icon: 'restaurant' },
  { id: 'pengingat', label: 'Pengingat', icon: 'alarm' },
  { id: 'keluarga', label: 'Keluarga', icon: 'group' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  const handleTabChange = (tabId) => {
    triggerHaptic('light');
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-safe">
      <div className="max-w-[430px] mx-auto px-4 pb-4 pt-1">
        <nav className="pointer-events-auto h-16 w-full rounded-full bg-surface-container/90 backdrop-blur-xl border border-surface-container-high/60 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)] p-1.5 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`flex-1 h-full rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-container to-secondary text-surface-container-lowest font-bold shadow-[0_4px_16px_rgba(45,212,191,0.35)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px] transition-transform duration-200"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] leading-none tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
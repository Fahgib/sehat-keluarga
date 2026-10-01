import { createClient } from '@supabase/supabase-js';

// Mengambil konfigurasi dari file .env dengan nilai cadangan (fallback) yang valid
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ixkmzoaiywjxipjasozi.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_MBq7Peoz11aqMjDwt02V7Q_WenpZHsP';

// Inisialisasi Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Mengambil data pengguna dari Telegram WebApp SDK.
 * Jika dibuka di browser Mac biasa (bukan Telegram), 
 * fungsi ini memberikan data dummy agar tampilan tetap berjalan normal saat dites.
 */
export const getTelegramUser = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    return {
      id: tgUser.id,
      first_name: tgUser.first_name || 'Pengguna',
      username: tgUser.username || '',
      photo_url: tgUser.photo_url || null,
    };
  }

  // Data tiruan untuk pengetesan di browser Mac
  return {
    id: 1001,
    first_name: 'Andi',
    username: 'andisehat',
    photo_url: null,
  };
};

/**
 * Memberikan efek getar (Haptic Feedback) jika dibuka di ponsel via Telegram.
 */
export const triggerHaptic = (style = 'medium') => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
  }
};

/**
 * Inisialisasi tampilan layar penuh pada Telegram WebApp
 */
export const initTelegramApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
};
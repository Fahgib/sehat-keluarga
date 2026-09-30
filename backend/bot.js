import { Telegraf, Markup } from 'telegraf';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import gpxParser from 'gpxparser';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Penangkal error global agar bot tidak diam saat terjadi kendala
bot.catch((err, ctx) => {
  console.error(`❌ Terjadi error pada bot untuk update ${ctx.updateType}:`, err);
});

// Middleware pemantau: Cetak setiap ada pesan masuk ke terminal
bot.use(async (ctx, next) => {
  if (ctx.message?.text) {
    console.log(`📩 Pesan masuk dari @${ctx.from.username || ctx.from.first_name}: "${ctx.message.text}"`);
  }
  return next();
});

// 1. Perintah /start
bot.start(async (ctx) => {
  try {
    const firstName = ctx.from.first_name || 'Keluarga';
    const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';

    // Deteksi protokol URL: Jika HTTPS gunakan webApp, jika HTTP (localhost) gunakan tombol URL biasa
    const isHttps = webAppUrl.startsWith('https://');
    const openAppButton = isHttps
      ? Markup.button.webApp('🚀 Buka Sehat Keluarga', webAppUrl)
      : Markup.button.url('🚀 Buka Sehat Keluarga (Browser)', webAppUrl);

    const welcomeMessage = 
`👋 Halo <b>${firstName}</b>! Selamat datang di <b>Sehat Keluarga</b>.

Aplikasi pemantau kebugaran, hidrasi, dan ritme gerak keluarga.

📌 <b>Menu Tersedia:</b>
• Klik tombol di bawah untuk membuka aplikasi.
• Kirimkan berkas dokumen <b>.gpx</b> ke obrolan ini untuk sinkronisasi rute olahraga otomatis.`;

    await ctx.replyWithHTML(
      welcomeMessage,
      Markup.inlineKeyboard([
        [openAppButton],
        [Markup.button.callback('ℹ️ Panduan Kirim GPX', 'HELP_GPX')],
      ])
    );
    console.log(`✅ Pesan sambutan berhasil dikirim ke @${ctx.from.username || ctx.from.first_name}`);
  } catch (error) {
    console.error('Gagal mengirim sambutan /start:', error);
    await ctx.reply('Halo! Selamat datang di Sehat Keluarga. Silakan akses aplikasi melalui browser Anda.');
  }
});

// 2. Panduan GPX
bot.action('HELP_GPX', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(
      `📂 <b>Cara Impor File GPX:</b>\n\n` +
      `1. Ekspor aktivitas lari/jalan dari Strava, Garmin, atau Smartwatch Anda dalam format <b>.gpx</b>.\n` +
      `2. Kirimkan berkas dokumen tersebut langsung ke bot ini.\n` +
      `3. Jarak tempuh, durasi, laju (pace), dan elevasi akan otomatis tersimpan ke dasbor keluarga!`
    );
  } catch (error) {
    console.error('Error action HELP_GPX:', error);
  }
});

// 3. Listener File Dokumen GPX
bot.on('document', async (ctx) => {
  const doc = ctx.message.document;
  const fileName = doc.file_name || '';

  if (!fileName.toLowerCase().endsWith('.gpx')) {
    return ctx.reply('⚠️ Harap kirimkan berkas berekstensi .gpx.');
  }

  const statusMsg = await ctx.reply('⏳ Membaca dan menganalisis berkas GPX...');

  try {
    const fileUrl = await ctx.telegram.getFileLink(doc.file_id);
    const response = await axios.get(fileUrl.href, { responseType: 'text' });
    const gpxText = response.data;

    const gpx = new gpxParser();
    gpx.parse(gpxText);

    const distanceMeters = gpx.tracks[0]?.distance?.total || 0;
    const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));

    let durationSeconds = 0;
    if (gpx.tracks[0]?.points?.length > 1) {
      const startTime = new Date(gpx.tracks[0].points[0].time).getTime();
      const endTime = new Date(gpx.tracks[0].points[gpx.tracks[0].points.length - 1].time).getTime();
      durationSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));
    }

    const elevationGain = Math.round(gpx.tracks[0]?.elevation?.pos || 0);
    const calories = Math.round(distanceKm * 55);

    let paceFormatted = "0'00\"";
    if (distanceKm > 0 && durationSeconds > 0) {
      const paceSeconds = durationSeconds / distanceKm;
      const paceMin = Math.floor(paceSeconds / 60);
      const paceSec = Math.floor(paceSeconds % 60);
      paceFormatted = `${paceMin}'${String(paceSec).padStart(2, '0')}"`;
    }

    const activityName = gpx.tracks[0]?.name || fileName.replace('.gpx', '') || 'Aktivitas Luar Ruangan';

    const { error: insertError } = await supabase.from('activities').insert([
      {
        activity_name: activityName,
        activity_type: distanceKm > 5 ? 'lari' : 'jalan',
        location_type: 'luar',
        distance_km: distanceKm,
        duration_seconds: durationSeconds,
        calories: calories,
        elevation_gain: elevationGain,
        source: 'Impor GPX Telegram',
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) throw insertError;

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    const durationText = hours > 0 ? `${hours}j ${minutes}m ${seconds}d` : `${minutes}m ${seconds}d`;

    await ctx.deleteMessage(statusMsg.message_id).catch(() => {});

    const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';
    const isHttps = webAppUrl.startsWith('https://');
    const openAppButton = isHttps
      ? Markup.button.webApp('📊 Buka Dasbor', webAppUrl)
      : Markup.button.url('📊 Buka Dasbor', webAppUrl);

    const successCard =
`✅ <b>Aktivitas Berhasil Disinkronkan!</b>

🏃 <b>Nama:</b> ${activityName}
📍 <b>Jarak:</b> ${distanceKm} km
⏱️ <b>Durasi:</b> ${durationText}
⚡ <b>Laju (Pace):</b> ${paceFormatted} /km
🔥 <b>Kalori:</b> ±${calories} kkal
⛰️ <b>Elevasi:</b> +${elevationGain} m

<i>Data otomatis masuk ke dasbor Sehat Keluarga.</i>`;

    await ctx.replyWithHTML(
      successCard,
      Markup.inlineKeyboard([[openAppButton]])
    );
  } catch (error) {
    console.error('Error GPX:', error);
    await ctx.deleteMessage(statusMsg.message_id).catch(() => {});
    await ctx.reply(`❌ Gagal memproses GPX: ${error.message || 'Format berkas tidak valid'}`);
  }
});

// Jalankan Bot Polling
bot.launch().then(() => {
  console.log('🤖 Bot Sehat Keluarga aktif dan siap menerima perintah!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
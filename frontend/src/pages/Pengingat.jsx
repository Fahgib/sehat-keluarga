import React, { useState, useEffect } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

// Data simulasi awal pengingat
const initialWaterReminders = [
  { id: 'w1', time: '06:00', label: 'Pagi', title: 'Segelas air saat bangun', desc: 'Setiap hari (Sen - Min) • 300 ml', icon: 'wb_sunny', active: true },
  { id: 'w2', time: '09:00', label: 'Kerja', title: 'Fokus pagi & hidrasi', desc: 'Setiap hari (Sen - Min) • 250 ml', icon: 'laptop_mac', active: true },
  { id: 'w3', time: '14:00', label: 'Siang', title: 'Segarkan kembali energi siang', desc: 'Setiap hari (Sen - Min) • 300 ml', icon: 'flare', active: true },
  { id: 'w4', time: '17:00', label: 'Aktivitas', title: 'Hidrasi sore sebelum jalan', desc: 'Sen, Rab, Jum, Sab • 250 ml', icon: 'directions_walk', active: true },
];

const initialMealReminders = [
  { id: 'm1', time: '07:00', label: 'Pagi', title: 'Sarapan Pagi Seimbang', desc: 'Setiap hari • Karbohidrat kompleks & buah', icon: 'breakfast_dining', active: true },
  { id: 'm2', time: '12:15', label: 'Siang', title: 'Makan Siang Tenang', desc: 'Setiap hari • Kurangi asupan gula berlebih', icon: 'lunch_dining', active: true },
  { id: 'm3', time: '18:45', label: 'Malam', title: 'Makan Malam Bersama Keluarga', desc: 'Setiap hari • Porsi ringan sebelum pukul 20:00', icon: 'dinner_dining', active: true },
];

const daysList = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

export default function Pengingat() {
  const [waterList, setWaterList] = useState(initialWaterReminders);
  const [mealList, setMealList] = useState(initialMealReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State untuk Modal Buat Pengingat
  const [reminderType, setReminderType] = useState('air');
  const [reminderTitle, setReminderTitle] = useState('');
  const [timeHour, setTimeHour] = useState(8);
  const [timeMinute, setTimeMinute] = useState(30);
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [reminderNote, setReminderNote] = useState('');
  const [smartSilence, setSmartSilence] = useState(true);
  const [saving, setSaving] = useState(false);

  // Toggle status sakelar pengingat air
  const toggleWaterItem = (id) => {
    triggerHaptic('light');
    setWaterList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  // Toggle status sakelar pengingat makan
  const toggleMealItem = (id) => {
    triggerHaptic('light');
    setMealList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  // Atur waktu cepat (+/- 15 menit)
  const adjustQuickTime = (deltaMinutes) => {
    triggerHaptic('light');
    let totalMinutes = timeHour * 60 + timeMinute + deltaMinutes;
    if (totalMinutes < 0) totalMinutes += 1440;
    totalMinutes = totalMinutes % 1440;
    setTimeHour(Math.floor(totalMinutes / 60));
    setTimeMinute(totalMinutes % 60);
  };

  // Toggle seleksi hari
  const toggleDaySelection = (dayIdx) => {
    triggerHaptic('light');
    setSelectedDays((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx]
    );
  };

  // Simpan pengingat baru ke Supabase
  const handleSaveReminder = async (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    setSaving(true);

    const formattedTime = `${String(timeHour).padStart(2, '0')}:${String(timeMinute).padStart(2, '0')}`;
    const mappedDays = selectedDays.map((d) => ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][d]);

    try {
      const { error } = await supabase.from('reminders').insert([
        {
          reminder_type: reminderType,
          title: reminderTitle || `Pengingat ${reminderType.toUpperCase()}`,
          time_val: formattedTime,
          repeat_days: mappedDays,
          note: reminderNote,
          is_active: true,
        },
      ]);

      if (error) throw error;

      alert('Pengingat baru berhasil disimpan ke database!');
      setIsModalOpen(false);
      setReminderTitle('');
      setReminderNote('');
    } catch (err) {
      alert('Gagal menyimpan pengingat: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const activeWaterCount = waterList.filter((i) => i.active).length;
  const activeMealCount = mealList.filter((i) => i.active).length;
  const totalActive = activeWaterCount + activeMealCount;

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      
      {/* 1. Hero Header Bento Card */}
      <section className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-surface-container p-5 shadow-xl border border-surface-container-high/40">
          <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase">Ritme Harian Keluarga</span>
            </div>

            <h2 className="text-xl font-bold text-on-surface">Jadwal & Pengingat</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Bangun kebiasaan sehat tanpa tekanan, tepat waktu untuk seluruh anggota keluarga.
            </p>

            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs text-on-surface-variant">
                  <strong className="text-on-surface font-semibold">{totalActive} Pengingat</strong> aktif hari ini
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1 h-9 px-3.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-xs font-bold shadow-md shadow-primary/20 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Buat Pengingat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Group A: Minum Air */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-tertiary-container/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Minum Air</h3>
              <span className="text-[11px] text-tertiary-container">Target 2.000 ml / hari</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-xs font-semibold">
            {activeWaterCount} Aktif
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {waterList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-surface-container-high/40 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-on-surface">{item.time} WIB</span>
                    <span className="text-[10px] text-primary font-semibold">{item.label}</span>
                  </div>
                  <p className="text-xs text-on-surface font-medium truncate">{item.title}</p>
                  <span className="text-[10px] text-on-surface-variant truncate">{item.desc}</span>
                </div>
              </div>

              {/* Sakelar Toggle Switch */}
              <button
                type="button"
                onClick={() => toggleWaterItem(item.id)}
                className={`w-12 h-7 rounded-full p-1 flex items-center shrink-0 transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-primary-container to-secondary justify-end shadow-md shadow-primary/20'
                    : 'bg-surface-container-highest justify-start'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full shadow-sm flex items-center justify-center transition-all ${
                    item.active ? 'bg-surface-dim text-primary' : 'bg-on-surface-variant/40'
                  }`}
                >
                  {item.active && (
                    <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Group B: Waktu Makan Sehat */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                restaurant
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Waktu Makan Sehat</h3>
              <span className="text-[11px] text-amber-300/80">Ritme metabolisme seimbang</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold">
            {activeMealCount} Sesi
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {mealList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-surface-container-high/40 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-amber-400 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-on-surface">{item.time} WIB</span>
                    <span className="text-[10px] text-amber-300 font-semibold">{item.label}</span>
                  </div>
                  <p className="text-xs text-on-surface font-medium truncate">{item.title}</p>
                  <span className="text-[10px] text-on-surface-variant truncate">{item.desc}</span>
                </div>
              </div>

              {/* Sakelar Toggle Switch */}
              <button
                type="button"
                onClick={() => toggleMealItem(item.id)}
                className={`w-12 h-7 rounded-full p-1 flex items-center shrink-0 transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-primary-container to-secondary justify-end shadow-md shadow-primary/20'
                    : 'bg-surface-container-highest justify-start'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full shadow-sm flex items-center justify-center transition-all ${
                    item.active ? 'bg-surface-dim text-primary' : 'bg-on-surface-variant/40'
                  }`}
                >
                  {item.active && (
                    <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Group C: Jadwal Obat & Suplemen (Empty State) */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-300">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                medication
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Obat & Suplemen</h3>
              <span className="text-[11px] text-on-surface-variant">Resep & vitamin harian</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs">
            0 Aktif
          </span>
        </div>

        <div className="w-full rounded-3xl bg-surface-container-low p-6 flex flex-col items-center text-center border border-surface-container-high/40">
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-purple-300 mb-2 shadow-inner">
            <span className="material-symbols-outlined text-[28px]">pill</span>
          </div>
          <p className="text-sm font-bold text-on-surface mb-0.5">Jaga Keteraturan Minum Obat</p>
          <p className="text-xs text-on-surface-variant max-w-xs mb-4">
            Belum ada obat aktif. Tambahkan resep atau vitamin sesuai kebutuhan Anda.
          </p>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setReminderType('obat');
              setReminderTitle('Vitamin C / Suplemen Harian');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-surface-container-highest/60 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">add</span>
            <span>+ Tambah obat</span>
          </button>
        </div>
      </section>

      {/* 5. Bottom Sheet Modal: Buat Pengingat Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end">
          <div className="w-full max-w-[430px] mx-auto bg-surface-container rounded-t-3xl p-5 flex flex-col max-h-[85vh] overflow-y-auto shadow-2xl border-t border-surface-container-high/60 animate-in slide-in-from-bottom duration-300">
            
            <div className="w-12 h-1 rounded-full bg-outline-variant mx-auto mb-3"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pengingat Baru</span>
                <h3 className="text-base font-bold text-on-surface">Buat Pengingat</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="flex flex-col gap-4">
              
              {/* Pilihan Kategori Tipe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Tipe Pengingat</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'air', label: 'Minum Air', icon: 'water_drop' },
                    { id: 'makan', label: 'Jadwal Makan', icon: 'restaurant' },
                    { id: 'obat', label: 'Obat / Suplemen', icon: 'medication' },
                    { id: 'aktivitas', label: 'Aktivitas', icon: 'directions_run' },
                  ].map((type) => {
                    const isSelected = reminderType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setReminderType(type.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Judul Pengingat */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Nama Pengingat</label>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Contoh: Minum segelas air hangat..."
                  className="w-full h-11 px-3.5 bg-surface-container-low rounded-2xl text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high/40"
                />
              </div>

              {/* Waktu Pengingat (Stepper Box) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Waktu Pengingat</label>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">alarm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Jam & Menit</span>
                      <span className="text-xl font-bold text-on-surface tracking-wider">
                        {String(timeHour).padStart(2, '0')}:{String(timeMinute).padStart(2, '0')}{' '}
                        <span className="text-xs text-primary font-normal">WIB</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-full">
                    <button
                      type="button"
                      onClick={() => adjustQuickTime(-15)}
                      className="w-7 h-7 rounded-full bg-surface-container text-on-surface hover:text-primary flex items-center justify-center active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="text-[11px] text-on-surface-variant px-1.5">15m</span>
                    <button
                      type="button"
                      onClick={() => adjustQuickTime(15)}
                      className="w-7 h-7 rounded-full bg-surface-container text-on-surface hover:text-primary flex items-center justify-center active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Ulangi Hari */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface">Ulangi Hari</label>
                  <span className="text-[11px] text-primary">
                    {selectedDays.length === 7 ? 'Setiap Hari' : `${selectedDays.length} Hari Terpilih`}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {daysList.map((day, idx) => {
                    const isSelected = selectedDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDaySelection(idx)}
                        className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Catatan (Opsional)</label>
                <input
                  type="text"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  placeholder="Contoh: Dengan perasan lemon segar..."
                  className="w-full h-11 px-3.5 bg-surface-container-low rounded-2xl text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high/40"
                />
              </div>

              {/* Smart Auto-Silence Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                <div className="flex flex-col pr-2 min-w-0">
                  <span className="text-xs font-semibold text-on-surface">Lewati jika kuota terpenuhi</span>
                  <span className="text-[10px] text-on-surface-variant leading-snug">
                    Otomatis hening jika target hidrasi 2.000 ml hari ini sudah tercapai.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={smartSilence}
                    onChange={(e) => setSmartSilence(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              {/* Tombol Simpan CTA */}
              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50 mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span>{saving ? 'Menyimpan...' : 'Simpan Pengingat'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
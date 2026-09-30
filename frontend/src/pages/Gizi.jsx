import React, { useState } from 'react';
import { supabase, triggerHaptic } from '../services/supabase';

// Daftar katalog makanan lokal dengan data nutrisi per unit porsi standar
const initialFoodCatalog = [
  {
    id: 1,
    name: 'Nasi Putih',
    portion: '1 centong (100g)',
    unit: 'centong (100g)',
    category: 'Makan Siang',
    calories: 175,
    carbs: 40,
    protein: 3,
    fat: 0.4,
    icon: 'rice_bowl',
    tag: 'Pokok',
    tagColor: 'text-tertiary bg-tertiary/15',
  },
  {
    id: 2,
    name: 'Tempe Goreng Tepung',
    portion: '2 potong sedang (70g)',
    unit: 'potong sedang (35g)',
    category: 'Camilan',
    calories: 190,
    carbs: 12,
    protein: 14,
    fat: 9,
    icon: 'lunch_dining',
    tag: 'Protein Nabati',
    tagColor: 'text-secondary bg-secondary/15',
  },
  {
    id: 3,
    name: 'Soto Ayam Lamongan',
    portion: '1 mangkok sedang',
    unit: 'mangkok sedang',
    category: 'Makan Malam',
    calories: 312,
    carbs: 18,
    protein: 24,
    fat: 15,
    icon: 'soup_kitchen',
    tag: 'Berkuah Segar',
    tagColor: 'text-primary bg-primary/15',
  },
  {
    id: 4,
    name: 'Tumis Kangkung Terasi',
    portion: '1 piring kecil (80g)',
    unit: 'piring kecil (80g)',
    category: 'Makan Siang',
    calories: 85,
    carbs: 6,
    protein: 3,
    fat: 5,
    icon: 'psychiatry',
    tag: 'Sayuran Hijau',
    tagColor: 'text-secondary bg-secondary/15',
  },
  {
    id: 5,
    name: 'Oatmeal & Telur Rebus',
    portion: '1 mangkok saji',
    unit: 'porsi',
    category: 'Sarapan',
    calories: 260,
    carbs: 28,
    protein: 16,
    fat: 8,
    icon: 'breakfast_dining',
    tag: 'Tinggi Serat',
    tagColor: 'text-tertiary bg-tertiary/15',
  },
];

const categories = ['Semua', 'Sarapan', 'Makan Siang', 'Makan Malam', 'Camilan'];

export default function Gizi() {
  const [mindfulMode, setMindfulMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk modal sesuaikan porsi
  const [activeFood, setActiveFood] = useState(null);
  const [portionQty, setPortionQty] = useState(1);
  const [savingLog, setSavingLog] = useState(false);

  // Buka modal porsi
  const handleOpenPortionModal = (food) => {
    triggerHaptic('light');
    setActiveFood(food);
    setPortionQty(1);
  };

  // Tutup modal porsi
  const handleClosePortionModal = () => {
    triggerHaptic('light');
    setActiveFood(null);
  };

  // Simpan log makanan ke Supabase
  const handleSaveMealLog = async () => {
    if (!activeFood) return;
    triggerHaptic('medium');
    setSavingLog(true);

    const calculatedCalories = Math.round(activeFood.calories * portionQty);
    const calculatedCarbs = parseFloat((activeFood.carbs * portionQty).toFixed(1));
    const calculatedProtein = parseFloat((activeFood.protein * portionQty).toFixed(1));
    const calculatedFat = parseFloat((activeFood.fat * portionQty).toFixed(1));

    try {
      const { error } = await supabase.from('meal_logs').insert([
        {
          meal_type: activeFood.category.toLowerCase(),
          food_name: activeFood.name,
          portion_desc: `${portionQty}x ${activeFood.unit}`,
          calories: calculatedCalories,
          carbs_g: calculatedCarbs,
          protein_g: calculatedProtein,
          fat_g: calculatedFat,
        },
      ]);

      if (error) throw error;
      alert(`Berhasil menambahkan ${portionQty}x ${activeFood.name} ke catatan makan!`);
      handleClosePortionModal();
    } catch (err) {
      alert('Gagal mencatat makanan: ' + err.message);
    } finally {
      setSavingLog(false);
    }
  };

  // Filter daftar makanan berdasarkan kategori dan pencarian
  const filteredFoodList = initialFoodCatalog.filter((item) => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      
      {/* 1. Friendly Top Banner Card */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container p-5 shadow-md border border-surface-container-high/40">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br from-primary-container/20 to-secondary/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-wider font-bold">
            <span className="material-symbols-outlined text-[18px]">eco</span>
            <span>Keluarga Harmonis</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">Gizi & Asupan Harian</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Pola makan seimbang untuk energi keluarga sepanjang hari secara tenang dan menyenangkan.
          </p>
        </div>
      </section>

      {/* 2. Ringkasan Nutrisi Bento Card & Mode Santai Toggle */}
      <section className="rounded-3xl bg-surface-container p-5 shadow-md flex flex-col space-y-4 relative border border-surface-container-high/40">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-on-surface">Ringkasan Nutrisi Hari Ini</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-highest text-on-surface-variant">
                Perkiraan
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">Asupan gabungan keluarga tercinta</p>
          </div>

          {/* Interactive Mindful View Toggle Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setMindfulMode(!mindfulMode);
            }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-all active:scale-95 border border-surface-container-highest/60"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {mindfulMode ? 'visibility' : 'visibility_off'}
            </span>
            <span>{mindfulMode ? 'Lihat Angka' : 'Mode Santai'}</span>
          </button>
        </div>

        {/* Mindful Statement State */}
        <div
          className={`p-3.5 rounded-2xl flex items-start gap-3 transition-all duration-300 ${
            mindfulMode
              ? 'bg-primary/10 border border-primary/20 scale-[1.01]'
              : 'bg-surface-container-high/70 border border-surface-container-highest/40'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-primary text-[20px]">spa</span>
          </div>
          <div className="flex flex-col text-on-surface">
            <span className="text-xs font-bold text-primary">Tampilan Ramah Pikiran</span>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Energi terpenuhi dengan sangat baik, asupan protein melimpah. Nikmati setiap hidangan bersama keluarga dengan santai tanpa rasa cemas angka.
            </p>
          </div>
        </div>

        {/* Quantitative Metrics Container (Bisa disembunyikan via Mode Santai) */}
        {!mindfulMode && (
          <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
            {/* Energi Card */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Energi Total
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface font-bold">1.480</span>
                  <span className="text-on-surface-variant">/ 2.000 kkal</span>
                </div>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container-highest overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-container to-secondary transition-all duration-500"
                  style={{ width: '74%' }}
                ></div>
              </div>
            </div>

            {/* Karbohidrat */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
                  Karbohidrat
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface font-semibold">185g</span>
                  <span className="text-on-surface-variant">/ 250g</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full rounded-full bg-tertiary-container transition-all duration-500"
                  style={{ width: '74%' }}
                ></div>
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Protein
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface font-semibold">68g</span>
                  <span className="text-on-surface-variant">/ 80g</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            {/* Lemak */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                  Lemak
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface font-semibold">42g</span>
                  <span className="text-on-surface-variant">/ 65g</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary-fixed transition-all duration-500"
                  style={{ width: '64%' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Pencarian & Filter Tag Makanan */}
      <section className="flex flex-col space-y-3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari makanan (misal: nasi putih, tempe goreng)..."
            className="w-full h-12 pl-11 pr-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-outline text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/40"
          />
        </div>

        {/* Quick Filter Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-container to-secondary text-surface shadow-sm font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Rekomendasi Menu & Hasil Pencarian */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface">Pilihan Kuliner Rumah</h3>
          <span className="text-xs text-primary font-medium">Saran Menu</span>
        </div>

        <div className="flex flex-col space-y-2.5">
          {filteredFoodList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-surface-container p-3.5 flex items-center justify-between gap-3 hover:bg-surface-container-high transition-colors border border-surface-container-high/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-on-surface truncate">{item.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant truncate">Porsi: {item.portion}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-primary font-bold">{item.calories} kkal</span>
                    <span className="text-[10px] text-on-surface-variant/80">/ porsi</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPortionModal(item)}
                className="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-primary hover:text-surface flex items-center justify-center text-on-surface shrink-0 active:scale-95 transition-all shadow-sm"
                title="Sesuaikan porsi"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Bottom Sheet Modal: Sesuaikan Porsi */}
      {activeFood && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-[430px] bg-surface-container-high rounded-t-3xl p-5 shadow-2xl flex flex-col space-y-4 border-t border-surface-container-highest animate-in slide-in-from-bottom duration-300">
            {/* Sheet Handle */}
            <div className="w-10 h-1 rounded-full bg-outline/40 mx-auto -mt-1 mb-1"></div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h4 className="text-base font-bold text-on-surface">Sesuaikan Porsi</h4>
                <span className="text-xs text-primary font-medium">{activeFood.name}</span>
              </div>
              <button
                type="button"
                onClick={handleClosePortionModal}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quantity Stepper Module */}
            <div className="flex items-center justify-between bg-surface-container rounded-2xl p-3 border border-surface-container-highest/40">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setPortionQty((prev) => Math.max(1, prev - 1));
                }}
                className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>

              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-on-surface">{portionQty}</span>
                <span className="text-xs text-on-surface-variant">{activeFood.unit}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setPortionQty((prev) => Math.min(10, prev + 1));
                }}
                className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>

            {/* Macro Multiplier Preview Bento */}
            <div className="grid grid-cols-4 gap-2 bg-surface-container/60 rounded-2xl p-3 text-center border border-surface-container-highest/30">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant">Energi</span>
                <span className="text-xs font-bold text-primary">~{Math.round(activeFood.calories * portionQty)}</span>
                <span className="text-[9px] text-outline">kkal</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant">Karbo</span>
                <span className="text-xs font-bold text-on-surface">{(activeFood.carbs * portionQty).toFixed(0)}g</span>
                <span className="text-[9px] text-outline">Perkiraan</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant">Protein</span>
                <span className="text-xs font-bold text-on-surface">{(activeFood.protein * portionQty).toFixed(0)}g</span>
                <span className="text-[9px] text-outline">Perkiraan</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant">Lemak</span>
                <span className="text-xs font-bold text-on-surface">{(activeFood.fat * portionQty).toFixed(0)}g</span>
                <span className="text-[9px] text-outline">Perkiraan</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={savingLog}
              onClick={handleSaveMealLog}
              className="w-full h-12 rounded-full bg-gradient-to-r from-primary-container to-secondary text-surface text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
              <span>{savingLog ? 'Menyimpan...' : 'Tambahkan ke Catatan Makan'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
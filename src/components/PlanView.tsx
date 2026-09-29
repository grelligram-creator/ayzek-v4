import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  ShieldCheck,
  Sparkles,
  MapPin,
  Check,
  ChevronRight,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import { TaskItem } from '../types';

export const PlanView: React.FC = () => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask, balance, toggleSmartGuard, openAssistantWithQuery, userProfile } =
    useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'is' | 'kisisel' | 'finans' | 'alisveris'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'is' | 'kisisel' | 'finans' | 'alisveris'>('is');
  const [newTime, setNewTime] = useState('14:30');
  const [newDetails, setNewDetails] = useState('');
  const [withBuffer, setWithBuffer] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [dailyRecommendation, setDailyRecommendation] = useState<string | null>(null);

  // Generate 14-day strip (Today + Next 13 days)
  const dateStrip = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum, fullDate: d };
  });

  const filteredTasks = tasks.filter((t) => {
    const taskDate = t.date || dateStrip[0].dateStr;
    const matchesDate = taskDate === selectedDate || (!t.date && selectedDate === dateStrip[0].dateStr);
    if (!matchesDate) return false;
    if (activeFilter === 'all') return true;
    return t.category === activeFilter;
  });

  const buildDailyRecommendation = () => {
    const openTasks = filteredTasks.filter((task) => !task.isCompleted);
    if (!openTasks.length) {
      setDailyRecommendation('Bu tarih için açık görev yok. Önce küçük ve net bir görev ekleyerek planına başlayabilirsin.');
      return;
    }
    const rank = { finans: 0, is: 1, aile: 2, kisisel: 3, alisveris: 4 };
    const priorities = [...openTasks].sort((a, b) => rank[a.category] - rank[b.category]).slice(0, 3);
    setDailyRecommendation(`Bugünün odağı: ${priorities.map((task) => `“${task.title}”`).join(', ')}. Bu öneri yalnızca kaydettiğin açık görevlere dayanır; takvim veya bağlı uygulama verisi kullanılmadı.`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const bufferText = withBuffer ? ' · 15 dk Akıllı Tampon Eklendi' : '';
    addTask({
      title: newTitle.trim(),
      category: newCategory,
      time: `${newTime} · Manuel Plan`,
      date: selectedDate,
      details: newDetails.trim()
        ? newDetails.trim() + bufferText
        : withBuffer
        ? 'Toplantı/görev sonrasında zihinsel toparlanma için 15 dk nefes molası eklendi.'
        : undefined,
      highlight: `⚡ ${selectedDate === dateStrip[0].dateStr ? 'Bugünkü' : selectedDate} Ajandaya Eklendi`,
    });
    setNewTitle('');
    setNewDetails('');
    setIsAdding(false);
  };

  const handleEditTask = (task: TaskItem) => {
    const title = window.prompt('Görev adı', task.title);
    if (title === null || !title.trim()) return;
    const time = window.prompt('Saat / zaman bilgisi', task.time);
    if (time === null || !time.trim()) return;
    updateTask(task.id, { title, time });
  };

  const handleDeleteTask = (task: TaskItem) => {
    if (!window.confirm(`"${task.title}" görevi silinsin mi?`)) return;
    deleteTask(task.id);
  };

  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* 1. Header section with Editorial luxury typography */}
      <section className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-rose-400 font-mono">
            BİRLEŞİK ÇİZELGE & ZAMAN YÖNETİMİ
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-normal text-white tracking-tight mt-0.5">
            {formattedSelectedDate}
          </h1>
          {userProfile?.location && (
            <div className="flex items-center gap-1.5 text-xs text-rose-200/70 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{userProfile.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer"
            >
              Bugüne Dön
            </button>
          )}

          <button
            onClick={buildDailyRecommendation}
            className="coral-gradient hover:opacity-95 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Günlük odağı oluştur</span>
          </button>
        </div>
      </section>

      {dailyRecommendation && (
        <section className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-xs text-rose-100">
          <span className="font-bold text-rose-300">Günlük plan önerisi</span>
          <p className="mt-1 leading-relaxed">{dailyRecommendation}</p>
        </section>
      )}

      {/* 2. Date Picker Strip with Smoked Crimson Glass */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-rose-300/80 px-1">
          <span className="uppercase tracking-wider text-[11px]">GÜNLER & TARİH ÇİZELGESİ</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-rose-200/50">Tarihe Git:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#14060a] border border-rose-500/25 text-white cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="p-3 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-xl flex items-center gap-2 overflow-x-auto no-scrollbar">
          {dateStrip.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            const isCurrentDay = item.dateStr === todayStr;
            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`min-w-[56px] py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'coral-gradient text-white font-extrabold border border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.6)] scale-105'
                    : 'bg-[#14060a]/90 hover:bg-[#1f0810] border border-rose-500/20 text-rose-200/70 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  {item.dayName}
                </span>
                <span className="text-base font-black mt-0.5">
                  {item.dayNum}
                </span>
                {isCurrentDay && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Smart Guard 18:00 Protection Banner (Smoked Crimson Glass) */}
      <section className="p-5 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl transition-all">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl crimson-orb-glow flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Smart Guard Kalkanı: 18:00 Sonrası Koruma
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {balance.smartGuardActive ? 'Aktif Korumada' : 'Pasif'}
                </span>
              </div>
              <p className="text-xs text-rose-200/70 mt-0.5">
                {balance.smartGuardActive
                  ? 'Akşam saatlerini koruma tercihin kaydedildi. Takvim entegrasyonu kurulana kadar otomatik engelleme yapılmaz.'
                  : 'Akşam koruma tercihi kapalı. Takvimde otomatik bir değişiklik yapılmaz.'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleSmartGuard}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              balance.smartGuardActive
                ? 'coral-gradient text-white shadow-md shadow-rose-950/50'
                : 'frosted-pill-button text-rose-200'
            }`}
          >
            {balance.smartGuardActive ? 'Korumayı Kaldır' : 'Kalkanı Aç'}
          </button>
        </div>
      </section>

      {/* 4. Filter Tabs in Frosted Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
        {[
          { id: 'all', label: 'Tüm Planlar' },
          { id: 'is', label: 'İş' },
          { id: 'kisisel', label: 'Kişisel & Sağlık' },
          { id: 'finans', label: 'Finans & Fatura' },
          { id: 'alisveris', label: 'Alışveriş & Ev' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
              activeFilter === f.id
                ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-rose-200/70 border-rose-500/20 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 5. Add Task Box */}
      {isAdding ? (
        <form
          onSubmit={handleCreateTask}
          className="p-5 rounded-[32px] crimson-glass border border-rose-500/30 text-white shadow-2xl space-y-3.5 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              {formattedSelectedDate} İçin Yeni Plan Ekle
            </h4>
            <span className="text-[11px] text-rose-200/60 font-mono">{selectedDate}</span>
          </div>

          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Görev veya plan adı (örn: Q4 Bütçe Değerlendirmesi)..."
            className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
          />

          <input
            type="text"
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            placeholder="Açıklama / Konum / Not (İsteğe bağlı)..."
            className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
          />

          <div className="flex items-center gap-2 flex-wrap justify-between pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="px-3 py-2 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="is">İş (Toplantı & Odak)</option>
                <option value="kisisel">Kişisel / Dinlenme</option>
                <option value="finans">Finans & Fatura</option>
                <option value="alisveris">Alışveriş / Market</option>
              </select>

              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Saat (14:30)"
                className="px-3.5 py-2 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white w-24 font-mono text-center"
              />

              <label className="flex items-center gap-1.5 text-xs text-rose-200/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={withBuffer}
                  onChange={(e) => setWithBuffer(e.target.checked)}
                  className="rounded-md accent-rose-500 focus:ring-rose-500"
                />
                <span>15 Dk Akıllı Tampon</span>
              </label>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="frosted-pill-button px-4 py-2 rounded-full text-xs font-semibold cursor-pointer"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                className="coral-gradient hover:opacity-95 text-white px-5 py-2 rounded-full text-xs font-bold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="frosted-pill-button w-full py-3.5 rounded-2xl text-xs font-bold border border-rose-500/30 text-rose-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4 text-rose-400" />
          <span>Bu Tarihe Yeni Görev / Plan Ekle</span>
        </button>
      )}

      {/* 6. Timeline items list (Smoked Obsidian Cards) */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-[32px] crimson-glass border border-rose-500/25 text-white space-y-2 shadow-xl">
            <span className="text-3xl block">🌱</span>
            <p className="text-sm font-bold text-white">
              Bu tarihte planlanmış görev bulunmuyor.
            </p>
            <p className="text-xs text-rose-200/60 max-w-xs mx-auto">
              AYZEK ile konuşarak veya yukarıdaki butona tıklayarak gününüzü yapılandırabilirsiniz.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-[28px] border transition-all flex items-start justify-between gap-3 group shadow-xl ${
                task.isCompleted
                  ? 'bg-[#100407]/60 border-rose-500/10 opacity-50'
                  : 'bg-[#14060a]/90 hover:bg-[#1e0710] border-rose-500/20 hover:border-rose-400/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-rose-400/70 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-rose-400/50 hover:text-rose-400" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-bold ${
                        task.isCompleted
                          ? 'line-through text-rose-200/40'
                          : 'text-white group-hover:text-rose-200 transition-colors'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {task.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-rose-200/60 mt-1">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>{task.time}</span>
                  </div>

                  {task.details && (
                    <p className="text-xs text-rose-100/80 mt-2 p-2.5 rounded-2xl bg-[#0e0307]/80 border border-rose-500/20 leading-relaxed">
                      {task.details}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => handleEditTask(task)} className="frosted-pill-button p-2 rounded-full text-rose-300 hover:text-white" aria-label="Görevi düzenle"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDeleteTask(task)} className="frosted-pill-button p-2 rounded-full text-rose-300 hover:text-white" aria-label="Görevi sil"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

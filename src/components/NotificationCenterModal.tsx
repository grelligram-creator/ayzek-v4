import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X } from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, markNotificationsRead } = useApp();
  if (!isNotificationsOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm">
    <section className="w-full max-w-md rounded-[28px] border border-rose-500/30 bg-[#100308] p-5 text-white shadow-2xl">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-rose-300" /><h2 className="text-sm font-bold">Bildirim merkezi</h2></div><button onClick={() => setIsNotificationsOpen(false)} aria-label="Kapat" className="text-rose-200"><X className="h-4 w-4" /></button></div>
      <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{notifications.length === 0 ? <p className="rounded-xl border border-rose-500/15 p-4 text-xs text-rose-200/60">Henüz bildirim yok.</p> : notifications.map((notification) => <div key={notification.id} className={`rounded-xl border p-3 text-xs ${notification.readAt ? 'border-rose-500/10 text-rose-200/60' : 'border-rose-500/30 bg-rose-500/10 text-rose-100'}`}><p className="font-semibold">{notification.title}</p><p className="mt-1 text-[10px] opacity-70">{new Date(notification.createdAt).toLocaleString('tr-TR')}</p></div>)}</div>
      {notifications.some((notification) => !notification.readAt) && <button onClick={markNotificationsRead} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-300"><CheckCheck className="h-4 w-4" /> Tümünü okundu işaretle</button>}
    </section>
  </div>;
};

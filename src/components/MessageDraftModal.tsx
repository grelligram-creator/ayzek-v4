import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Copy, Check, Send, Sparkles, RefreshCw } from 'lucide-react';

export const MessageDraftModal: React.FC = () => {
  const {
    isDraftModalOpen,
    setIsDraftModalOpen,
    draftContent,
    isDraftLoading,
    generateDraft,
    showSyncNotification,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [recipient, setRecipient] = useState('Annem');
  const [editableText, setEditableText] = useState('');

  // Sync draftContent to editableText when it updates
  React.useEffect(() => {
    setEditableText(draftContent);
  }, [draftContent]);

  if (!isDraftModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    generateDraft(recipient, 'Doğum Günü');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-500/20 flex items-center justify-between bg-[#14050a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl crimson-orb-glow flex items-center justify-center font-bold text-white shadow-md">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Vefa & Sevdiklerim: Mektup Taslağı
              </h3>
              <p className="text-xs text-rose-200/60">
                AYZEK Duygusal Zeka & Anı Derleyici
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDraftModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-200">
              Kişiselleştirilmiş Taslak (Annemin Doğum Günü):
            </span>

            <button
              onClick={handleRegenerate}
              disabled={isDraftLoading}
              className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDraftLoading ? 'animate-spin' : ''}`} />
              <span>Yeniden Yaz</span>
            </button>
          </div>

          {isDraftLoading ? (
            <div className="h-44 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center justify-center gap-2 text-xs text-rose-300 shadow-inner">
              <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
              <span>AYZEK içten bir mektup hazırlıyor...</span>
            </div>
          ) : (
            <textarea
              rows={6}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full p-4 rounded-2xl text-xs sm:text-sm leading-relaxed bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 resize-none transition-colors"
            />
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={handleCopy}
              className="frosted-pill-button flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
            </button>

            <button
              onClick={() => {
                showSyncNotification('Mesaj hazırlandı ve WhatsApp üzerinden gönderim kuyruğuna alındı.');
                setIsDraftModalOpen(false);
              }}
              className="coral-gradient hover:opacity-95 text-white flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-rose-950/60 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp ile Gönder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

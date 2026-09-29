import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Pencil,
  Archive,
  Trash2,
  ArchiveRestore,
} from 'lucide-react';

export const AyzekAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    messages,
    hasOlderMessages,
    isLoadingOlderMessages,
    loadOlderMessages,
    conversations,
    activeConversationId,
    startConversation,
    switchConversation,
    renameActiveConversation,
    archiveActiveConversation,
    deleteActiveConversation,
    sendMessage,
    isChatLoading,
    memoryCandidate,
    acceptMemoryCandidate,
    dismissMemoryCandidate,
    pendingAction,
    approvePendingAction,
    dismissPendingAction,
    archivedConversations,
    restoreArchivedConversation,
    balance,
    checkin,
  } = useApp();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const normalizedMessageSearch = messageSearch.trim().toLocaleLowerCase('tr-TR');
  const visibleMessages = normalizedMessageSearch
    ? messages.filter((message) => message.content.toLocaleLowerCase('tr-TR').includes(normalizedMessageSearch))
    : messages;

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAssistantOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handlePromptChip = (chip: string) => {
    sendMessage(chip);
  };

  const handleNewConversation = async () => {
    try {
      await startConversation();
    } catch {
      // The authenticated workspace is required before a conversation can exist.
    }
  };

  const handleRenameConversation = async () => {
    if (activeConversationId === 'default') return;
    const currentTitle = conversations.find((conversation) => conversation.id === activeConversationId)?.title || '';
    const title = window.prompt('Konuşma adı', currentTitle);
    if (!title || title.trim() === currentTitle) return;
    await renameActiveConversation(title);
  };

  const handleArchiveConversation = async () => {
    if (activeConversationId === 'default') return;
    if (!window.confirm('Bu konuşma arşivlenecek. Devam etmek istiyor musunuz?')) return;
    await archiveActiveConversation();
  };

  const handleDeleteConversation = async () => {
    if (activeConversationId === 'default') return;
    if (!window.confirm('Bu konuşma ve tüm mesajları kalıcı olarak silinecek. Devam etmek istiyor musunuz?')) return;
    await deleteActiveConversation();
  };

  // Web Speech API for voice dictation
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-2xl h-[92vh] sm:h-[82vh] rounded-t-[36px] sm:rounded-[36px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-500/20 flex items-center justify-between bg-[#14050a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <AyzekLogo size={36} theme="crimson" variant="boxed" glow={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  AYZEK Bilişsel Mentör
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-mono">
                  <Zap className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>Güvenli öneri modu</span>
                </span>
              </div>
              <p className="text-[11px] text-rose-200/70 mt-0.5">
                Yanıtlar kaydedilir; görev ve bağlantılı uygulama işlemleri ayrı onay gerektirir.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <select
                  aria-label="Konuşma seç"
                  value={activeConversationId}
                  onChange={(event) => switchConversation(event.target.value).catch(() => undefined)}
                  disabled={isChatLoading}
                  className="max-w-44 bg-black/25 border border-rose-500/25 rounded-lg px-2 py-1 text-[11px] text-rose-100 outline-none disabled:opacity-50"
                >
                  {conversations.map((conversation) => (
                    <option key={conversation.id} value={conversation.id} className="bg-[#14050a] text-white">
                      {conversation.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleNewConversation}
                  disabled={isChatLoading}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 px-2 py-1 text-[11px] font-semibold text-rose-200 hover:text-white hover:bg-rose-500/10 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Yeni
                </button>
                <button
                  type="button"
                  aria-label="Konuşma adını değiştir"
                  onClick={() => handleRenameConversation().catch(() => undefined)}
                  disabled={isChatLoading || activeConversationId === 'default'}
                  className="rounded-lg border border-rose-500/30 p-1 text-rose-200 hover:text-white hover:bg-rose-500/10 disabled:opacity-40"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  aria-label="Konuşmayı arşivle"
                  onClick={() => handleArchiveConversation().catch(() => undefined)}
                  disabled={isChatLoading || activeConversationId === 'default'}
                  className="rounded-lg border border-rose-500/30 p-1 text-rose-200 hover:text-white hover:bg-rose-500/10 disabled:opacity-40"
                >
                  <Archive className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  aria-label="Konuşmayı kalıcı olarak sil"
                  onClick={() => handleDeleteConversation().catch(() => undefined)}
                  disabled={isChatLoading || activeConversationId === 'default'}
                  className="rounded-lg border border-rose-500/30 p-1 text-rose-200 hover:text-white hover:bg-rose-500/10 disabled:opacity-40"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button type="button" onClick={() => setShowArchived((value) => !value)} className="rounded-lg border border-rose-500/30 p-1 text-rose-200 hover:text-white" aria-label="Arşivlenmiş konuşmalar">
                  <ArchiveRestore className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAssistantOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {memoryCandidate && (
          <div className="mx-4 mt-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100">
            <p className="font-bold">Bu bilgiyi hafızaya ekleyelim mi?</p>
            <p className="mt-1 text-amber-100/80">{memoryCandidate.content}</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => acceptMemoryCandidate().catch(() => undefined)} className="rounded-lg bg-amber-400 px-2.5 py-1.5 text-[11px] font-bold text-black">Hafızaya kaydet</button>
              <button type="button" onClick={dismissMemoryCandidate} className="rounded-lg border border-amber-300/30 px-2.5 py-1.5 text-[11px] font-bold">Şimdi değil</button>
            </div>
          </div>
        )}

        {pendingAction && (
          <div className="mx-4 mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-50">
            <p className="font-bold">Görev oluşturma önerisi</p>
            <p className="mt-1">“{pendingAction.title}” görevi kaydedilsin mi?</p>
            {pendingAction.scheduleLabel && <p className="mt-1 text-emerald-100/75">Planlanan zaman: {pendingAction.scheduleLabel}</p>}
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={approvePendingAction} className="rounded-lg bg-emerald-400 px-2.5 py-1.5 text-[11px] font-bold text-black">Onayla ve kaydet</button>
              <button type="button" onClick={dismissPendingAction} className="rounded-lg border border-emerald-300/30 px-2.5 py-1.5 text-[11px] font-bold">Vazgeç</button>
            </div>
          </div>
        )}

        {showArchived && (
          <div className="mx-4 mt-3 rounded-2xl border border-rose-500/25 bg-[#14060a] p-3 text-xs text-rose-100">
            <p className="font-bold">Arşivlenmiş konuşmalar</p>
            {archivedConversations.length === 0 ? <p className="mt-1 text-rose-200/60">Arşivlenmiş konuşma yok.</p> : <div className="mt-2 space-y-1">{archivedConversations.map((conversation) => <div key={conversation.id} className="flex items-center justify-between gap-2"><span className="truncate">{conversation.title}</span><button type="button" onClick={() => restoreArchivedConversation(conversation.id).catch(() => undefined)} className="rounded-lg border border-rose-500/30 px-2 py-1 text-[11px] font-bold text-rose-200">Geri yükle</button></div>)}</div>}
          </div>
        )}

        <div className="mx-4 mt-3">
          <label className="sr-only" htmlFor="conversation-message-search">Bu konuşmada ara</label>
          <input
            id="conversation-message-search"
            type="search"
            value={messageSearch}
            onChange={(event) => setMessageSearch(event.target.value)}
            placeholder="Bu konuşmada ara"
            className="w-full rounded-xl border border-rose-500/25 bg-black/20 px-3 py-2 text-xs text-white outline-none placeholder:text-rose-200/45 focus:border-rose-400/60"
          />
          {normalizedMessageSearch && (
            <p className="mt-1 text-[11px] text-rose-200/65">{visibleMessages.length} mesaj bulundu</p>
          )}
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {hasOlderMessages && !normalizedMessageSearch && (
            <button type="button" onClick={() => loadOlderMessages().catch(() => undefined)} disabled={isLoadingOlderMessages} className="mx-auto block rounded-lg border border-rose-500/30 px-3 py-1.5 text-[11px] font-bold text-rose-200 hover:bg-rose-500/10 disabled:opacity-50">
              {isLoadingOlderMessages ? 'Mesajlar yükleniyor…' : 'Daha eski mesajları yükle'}
            </button>
          )}
          {visibleMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="mt-1 shrink-0">
                    <AyzekLogo size={28} theme="crimson" variant="iconOnly" glow={false} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'coral-gradient text-white font-medium shadow-lg shadow-rose-950/60 rounded-br-xs'
                      : 'bg-[#18050e]/90 border border-rose-500/25 text-white shadow-xl rounded-tl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Actions / confirmations if performed */}
                  {msg.actionsApplied && msg.actionsApplied.length > 0 && (
                    <div className="pt-2 border-t border-rose-500/20 space-y-1.5 text-xs">
                      <span className="font-bold text-rose-300 block text-[11px] uppercase tracking-wider font-mono">
                        ⚡ Gerçekleşen Canlı Eylemler:
                      </span>
                      {msg.actionsApplied.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right mt-1 ${
                      isUser ? 'text-rose-100/70' : 'text-rose-300/50'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {normalizedMessageSearch && visibleMessages.length === 0 && !isChatLoading && (
            <p className="py-8 text-center text-xs text-rose-200/60">Bu konuşmada eşleşen mesaj yok.</p>
          )}

          {isChatLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-rose-300">
              <AyzekLogo size={28} theme="crimson" variant="iconOnly" glow={false} />
              <div className="p-3.5 rounded-2xl bg-[#18050e]/90 border border-rose-500/25 flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
                <span className="ml-1 text-[11px] text-rose-200">AYZEK düşünüyor ve senkronize ediyor...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 border-t border-rose-500/20 bg-[#120409]/90 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider shrink-0 font-mono">
            Hızlı Eylemler:
          </span>
          {[
            '🛒 Akşama market listeme süt ve filtre kahve ekle',
            '😴 Bugün çok yorgunum, programımı hafiflet',
            '⚖️ Grispi şirketinden ayrılmalı mıyım? Karar matrisi oluştur',
            '🛡️ 18:00 sonrası toplantıları blokla (Smart Guard)',
          ].map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePromptChip(promptText)}
              className="frosted-pill-button text-[11px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap text-rose-200 hover:text-white border-rose-500/25 shrink-0 cursor-pointer shadow-xs"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input box with frosted glass and crimson gradients */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 border-t border-rose-500/25 flex items-center gap-2 bg-[#0d0205] backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={handleToggleVoice}
            title={isListening ? 'Ses dinlemeyi durdur' : 'Sesle konuş'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-[0_0_18px_rgba(225,29,72,0.8)]'
                : 'bg-white/5 hover:bg-white/10 text-rose-300 border-rose-500/25'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AYZEK'e bir şey söyle, takvim düzenlet veya görev ata..."
            className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-[#15050b] border border-rose-500/25 text-white placeholder:text-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="w-10 h-10 rounded-full flex items-center justify-center coral-gradient hover:opacity-95 text-white shadow-lg shadow-rose-950/60 transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

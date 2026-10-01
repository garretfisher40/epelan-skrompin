// src/components/GuideTab.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Compass, 
  Layers, 
  HelpCircle, 
  Lightbulb, 
  Award, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  FileCheck,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  MessageSquareQuote
} from 'lucide-react';

import { safeParseJson } from '../utils/api.ts';

interface GuideTabProps {
  setActiveTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const GuideTab: React.FC<GuideTabProps> = ({ setActiveTab }) => {
  const [activeSubSection, setActiveSubSection] = useState<'pdca' | 'kpm' | 'cara_isi' | 'contoh'>('pdca');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqViewMode, setFaqViewMode] = useState<'chat' | 'accordion'>('chat');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    jajaranRpm: true,
    smartObjektif: true,
    kpiTepat: true,
    bajetPcg: false,
    evidensLengkap: false,
    pdcaKemaskini: false,
  });

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Salam sejahtera cikgu! Saya Pembantu Maya e-Pelan Operasi & PDCA SK Rompin (dikuasakan oleh Google Gemini AI).

Saya boleh membantu cikgu dalam:
• Merangka **Objektif SMART** dan **KPI kuantitatif** mengikut panitia.
• Menyusun langkah-langkah **kitaran PDCA** (Plan, Do, Check, Act).
• Menjajarkan program dengan **7 Teras Strategik RPM 2026–2035**.
• Cadangan **evidens relevan** dan peruntukan bajet **PCG Panitia**.

Ada sebarang pertanyaan yang boleh saya bantu hari ini?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (faqViewMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, faqViewMode]);

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoadingChat(true);

    try {
      // Prepare payload with multi-turn history
      const payloadMessages = newHistory.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await safeParseJson<{ reply?: string }>(res);
      const botReply = data?.reply || 
        'Perkhidmatan AI memerlukan backend pelayan Node.js aktif. Jika anda sedang menggunakan hos statik seperti Netlify, pastikan fungsi backend atau pelayan penuh (contoh: Render/Railway/Cloud Run) diaktifkan.';

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        content: 'Maaf, berlaku gangguan perkhidmatan sementara ketika berhubung dengan Gemini AI. Sila pastikan sambungan stabil atau cuba sebentar lagi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Kosongkan semua sejarah perbualan ini?')) {
      setMessages([
        {
          id: 'welcome_reset',
          role: 'model',
          content: 'Sejarah perbualan telah dikosongkan. Silakan tanya soalan baharu mengenai Pelan Operasi atau kitaran PDCA.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  const starterPrompts = [
    'Bagaimana merangka Objektif SMART untuk Panitia Muzik?',
    'Beri contoh KPI kuantitatif untuk Program Celik Membaca Bahasa Melayu',
    'Apakah perbezaan jelas antara fasa CHECK dan ACT dalam kitaran PDCA?',
    'Apakah evidens yang wajib dimuat naik mengikut SKPM Kualiti@Sekolah?',
    'Bagaimana cara mengisi peruntukan bajet PCG yang sah mengikut SPK?',
  ];

  const pdcaSteps = [
    {
      stage: 'P',
      title: 'PLAN (Rancang)',
      percent: '25%',
      badgeBg: 'bg-blue-600',
      borderCol: 'border-blue-200 hover:border-blue-400',
      lightBg: 'bg-blue-50/70',
      textCol: 'text-blue-900',
      desc: 'Mengenal pasti isu strategik sekolah, menetapkan objektif SMART, merangka KPI sasaran, menyediakan kertas kerja, agihan jawatankuasa dan anggaran kos belanjawan.',
      actions: [
        'Analisis data saringan (PBD, UASA, kehadiran atau borang maklum balas).',
        'Menjajarkan program dengan Teras Strategik, Strategi & Prakarsa RPM 2026–2035.',
        'Menyediakan Kertas Kerja lengkap dengan jadual dan agihan tugas.',
        'Mendapatkan kelulusan pentadbiran sekolah (Guru Besar / GPK).'
      ],
      evidens: 'Kertas kerja rasmi diluluskan, minit mesyuarat panitia, borang analisis data awal.'
    },
    {
      stage: 'D',
      title: 'DO (Laksana)',
      percent: '50%',
      badgeBg: 'bg-emerald-600',
      borderCol: 'border-emerald-200 hover:border-emerald-400',
      lightBg: 'bg-emerald-50/70',
      textCol: 'text-emerald-900',
      desc: 'Melaksanakan program mengikut jadual pelaksanaan yang telah dirancang. Mengumpul evidens penglibatan murid dan merekod catatan pelaksanaan secara langsung.',
      actions: [
        'Melaksanakan aktiviti/bengkel/pertandingan/modul latihan mengikut jadual.',
        'Merekod kehadiran peserta (murid & guru pembimbing).',
        'Mengambil gambar aktiviti yang berfokus serta rakaman yang relevan.',
        'Mengemas kini status kemajuan DO (50%) di dalam sistem e-Pelan Operasi.'
      ],
      evidens: 'Borang kehadiran bertandatangan, gambar aktiviti berlabel, modul latihan, bahan edaran.'
    },
    {
      stage: 'C',
      title: 'CHECK (Semak & Pantau)',
      percent: '75%',
      badgeBg: 'bg-amber-600',
      borderCol: 'border-amber-200 hover:border-amber-400',
      lightBg: 'bg-amber-50/70',
      textCol: 'text-amber-900',
      desc: 'Memantau dan mengukur pencapaian sebenar berbanding KPI sasaran awal. Meneliti keberkesanan instrumen dan mengenal pasti kekangan yang timbul.',
      actions: [
        'Menilai pencapaian murid melalui instrumen penilaian (pra/pos atau rubrik penjurian).',
        'Membandingkan peratus penglibatan/pencapaian dengan KPI sasaran awal.',
        'Mengenal pasti cabaran (kekangan masa, kehadiran atau kelengkapan).',
        'Menyediakan analisis ringkas keberkesanan program untuk semakan GPK/GB.'
      ],
      evidens: 'Borang penilaian juri, graf perbandingan sebelum & selepas, rumusan analisis KPI.'
    },
    {
      stage: 'A',
      title: 'ACT (Tindak & Penambahbaikan)',
      percent: '100% / SELESAI',
      badgeBg: 'bg-rose-600',
      borderCol: 'border-rose-200 hover:border-rose-400',
      lightBg: 'bg-rose-50/70',
      textCol: 'text-rose-900',
      desc: 'Mengambil tindakan susulan, melaksanakan intervensi pembetulan, standardisasi amalan terbaik (Best Practices), dan membentangkan laporan penuh panitia.',
      actions: [
        'Merangka tindakan intervensi bagi murid yang belum mencapai sasaran minimum.',
        'Mendokumentasikan program sebagai amalan terbaik jika mencapai kejayaan tinggi.',
        'Menyelaraskan cadangan penambahbaikan untuk perancangan tahun berikutnya.',
        'Membentangkan laporan impak dalam Mesyuarat Panitia / Dialog Prestasi Sekolah.'
      ],
      evidens: 'Laporan dokumentasi penuh, rekod intervensi susulan, sijil penghargaan, buku program.'
    },
  ];

  const faqs = [
    {
      q: 'Apakah beza antara Pelan Strategik, Pelan Taktikal, dan Pelan Operasi?',
      a: 'Pelan Strategik Organisasi (PSO) merangkumi visi dan hala tuju sekolah bagi tempoh 3 hingga 5 tahun. Pelan Taktikal ialah pelan tindakan tahunan bagi mencapai matlamat PSO. Manakala Pelan Operasi adalah dokumen kerja terperinci bagi setiap aktiviti atau program khusus yang dilaksanakan oleh panitia/unit dalam jangka masa tertentu.'
    },
    {
      q: 'Mengapa setiap Pelan Operasi perlu dijajarkan kepada Rancangan Pendidikan Malaysia (RPM)?',
      a: 'KPM menetapkan bahawa semua perancangan di peringkat sekolah mesti mendukung 7 Teras Strategik RPM 2026–2035. Penjajaran ini memastikan usaha guru di bilik darjah selaras dengan dasar transformasi pendidikan kebangsaan.'
    },
    {
      q: 'Bagaimanakah cara menentukan KPI dan Sasaran KPI yang baik?',
      a: 'KPI mestilah boleh diukur secara kuantitatif atau kualitatif (cth: "Peratus murid mencapai TP3 ke atas dalam PBD"). Sasaran KPI hendaklah realistik tetapi mencabar (cth: "≥ 90% murid mencapai TP3"). Elakkan KPI yang samar seperti "Murid seronok belajar".'
    },
    {
      q: 'Adakah evidens wajib dimuat naik ke dalam sistem ini?',
      a: 'Ya. Pematuhan SKPM Kualiti@Sekolah menekankan pengurusan berasaskan evidens (Evidence-Based Practice). Memuat naik kertas kerja, gambar aktiviti berlabel, dan laporan penilaian memudahkan semakan PPD, JPN, dan Jemaah Nazir.'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#17375e] via-[#1f4a7c] to-[#2563eb] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-semibold mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            <span>Piawaian Kualiti Pengurusan KPM & SKPM Kualiti@Sekolah</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Panduan Lengkap Pelan Operasi & Kitaran PDCA
          </h2>

          <p className="text-sm text-sky-100 leading-relaxed mb-6">
            Panduan rasmi bagi warga pendidik SK Rompin untuk merangka, melaksanakan, menyelia, dan mendokumentasikan 
            Pelan Operasi berkualiti tinggi yang sejajar dengan <b>Rancangan Pendidikan Malaysia (RPM 2026–2035)</b> serta 
            kitaran penambahbaikan berterusan <b>Plan-Do-Check-Act (PDCA)</b>.
          </p>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveSubSection('pdca')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubSection === 'pdca'
                  ? 'bg-white text-[#17375e] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Kitaran PDCA
            </button>
            <button
              onClick={() => setActiveSubSection('kpm')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubSection === 'kpm'
                  ? 'bg-white text-[#17375e] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Compass className="w-4 h-4" /> Kehendak KPM & RPM
            </button>
            <button
              onClick={() => setActiveSubSection('cara_isi')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubSection === 'cara_isi'
                  ? 'bg-white text-[#17375e] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" /> Cara Mengisi Pelan
            </button>
            <button
              onClick={() => setActiveSubSection('contoh')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubSection === 'contoh'
                  ? 'bg-white text-[#17375e] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Award className="w-4 h-4" /> Contoh Panitia Muzik
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-section 1: Kitaran PDCA */}
      {activeSubSection === 'pdca' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Konsep Kitaran Penambahbaikan Berterusan PDCA
                </h3>
                <p className="text-xs text-slate-500">
                  Model pengurusan kualiti dinamik (Deming Cycle) yang diadaptasi oleh KPM untuk memastikan impak program yang mapan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {pdcaSteps.map((step) => (
                <div 
                  key={step.stage}
                  className={`rounded-xl border ${step.borderCol} p-5 ${step.lightBg} transition shadow-2xs flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg ${step.badgeBg} text-white font-extrabold flex items-center justify-center text-sm shadow-xs`}>
                          {step.stage}
                        </span>
                        <h4 className={`font-bold text-sm ${step.textCol}`}>
                          {step.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        Tahap: {step.percent}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {step.desc}
                    </p>

                    <div className="space-y-1.5 mb-3 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        Tindakan Utama Fasa Ini:
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                        {step.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/80 flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">Evidens Disyorkan:</span>
                    <span className="truncate">{step.evidens}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">
                  Tip Amalan Terbaik PDCA Sekolah:
                </p>
                <p>
                  Jangan tunggu hujung tahun untuk mengisi fasa <b>CHECK</b> dan <b>ACT</b>. Selepas selesai sesuatu bengkel atau fasa aktiviti 
                  (fasa DO), buka butang status PDCA pada <i>Dashboard</i> serta-merta, kemas kini catatan ringkas, dan muat naik gambar aktiviti 
                  untuk mengelakkan kehilangan evidens penting.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sub-section 2: Kehendak KPM & Penjajaran RPM */}
      {activeSubSection === 'kpm' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Format & Kehendak Pelan Operasi Kementerian Pendidikan Malaysia (KPM)
                </h3>
                <p className="text-xs text-slate-500">
                  Memahami fungsi Pelan Operasi dalam hierarki perancangan strategik sekolah dan penjajaran matlamat.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tahap 1 (Makro)</div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Pelan Strategik (PSO)</h4>
                <div className="text-[11px] text-sky-800 font-semibold mb-2">Tempoh: 3 – 5 Tahun</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menetapkan hala tuju utama sekolah, visi, misi, dan matlamat strategik berpandukan 7 Teras RPM 2026–2035.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tahap 2 (Meso)</div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Pelan Taktikal</h4>
                <div className="text-[11px] text-emerald-800 font-semibold mb-2">Tempoh: 1 Tahun (Tahunan)</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pelan tindakan tahunan panitia atau unit yang menghimpunkan program-program strategik bagi tahun semasa.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-sky-300 bg-sky-50/50 shadow-2xs">
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Tahap 3 (Mikro / Pelaksanaan)</div>
                <h4 className="font-bold text-sm text-sky-950 mb-1">Pelan Operasi (Sistem Ini)</h4>
                <div className="text-[11px] text-blue-700 font-bold mb-2">Tempoh: Mengikut Program Spesifik</div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Dokumen kerja perincian bagi satu-satu program atau aktiviti khusus (kertas konsep, kos, jadual, KPI, dan rekod PDCA).
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-700" />
                7 Teras Strategik Rancangan Pendidikan Malaysia (RPM 2026–2035)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-sky-800">TS1:</span> Sistem Terangkum, Dinamik & Relevan
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-sky-800">TS2:</span> Mengoptimumkan Potensi Murid
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-sky-800">TS3:</span> Mentransformasikan Pendidik
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-sky-800">TS4:</span> Memantapkan Prasarana Pendidikan
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-sky-800">TS5:</span> Memperkukuh Penglibatan Komuniti (PIBG)
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-sky-800">TS6:</span> Kemampanan Ekosistem Pendidikan
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 sm:col-span-2 lg:col-span-1">
                  <span className="font-bold text-sky-800">TS7:</span> Kecekapan Tadbir Urus & Integriti
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-amber-900">
                  Pematuhan Tadbir Urus Kewangan (PCG / Peruntukan Kerajaan):
                </p>
                <p>
                  Nyatakan punca kewangan dengan spesifik pada medan <b>Kos / Kewangan</b> (cth: <i>Bantuan Geran Perkapita (PCG) Panitia Pendidikan Muzik</i>). 
                  Elakkan meletakkan angka kasar tanpa asas belanjawan. Semua perbelanjaan mestilah mematuhi Surat Pekeliling Kewangan (SPK) yang berkuat kuasa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sub-section 3: Cara Mengisi Pelan Operasi */}
      {activeSubSection === 'cara_isi' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Panduan Langkah demi Langkah Cara Mengisi Borang
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ikuti 6 langkah ini untuk melengkapkan pelan operasi dengan pantas dan tepat.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('form')}
                className="px-3.5 py-2 bg-[#17375e] hover:bg-[#102d50] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Buka Borang Pengisian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Langkah 1: Maklumat Asas & Unit Pengurusan</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih <b>Tahun</b> (cth: 2026), <b>Unit</b> (Unit Kurikulum, HEM, Kokurikulum, atau Pentadbiran), dan <b>Panitia / Bidang</b>. 
                    Medan ini memastikan pelan terasing dan dikelompokkan dengan betul dalam dashboard dan buku program sekolah.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Langkah 2: Penjajaran RPM (Teras, Strategi, Prakarsa) & Isu</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih <b>Teras Strategik</b>. Sistem akan menyaring <b>Strategi</b> dan <b>Prakarsa</b> berkaitan secara automatik. 
                    Kemudian pilih atau tulis <b>Isu Strategik</b> yang ingin diselesaikan berdasarkan data analisis pencapaian murid.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Langkah 3: Nama Program, Matlamat, Objektif & KPI</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tulis <b>Nama Program</b> yang spesifik. Nyatakan <b>Matlamat</b> umum, diikuti <b>Objektif SMART</b> yang bernombor. 
                    Pada bahagian <b>KPI & Sasaran KPI</b>, letakkan angka sasaran yang jelas (contoh: <i>≥ 95% murid menguasai kemahiran</i>).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">4</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Langkah 4: Tempoh, Sasaran, Pegawai & Ringkasan Proses (PDCA)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tentukan <b>Tempoh</b> (cth: Ogos – September), <b>Kumpulan Sasaran</b> (cth: Semua Murid Tahap 1 & 2), dan <b>Pegawai Bertanggungjawab</b>. 
                    Pada bahagian <b>Ringkasan Proses</b>, tulis 4 baris tindakan bermula dengan <i>1. PLAN</i>, <i>2. DO</i>, <i>3. CHECK</i>, dan <i>4. ACT</i>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">5</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Langkah 5: Kos Kewangan, Kekangan, Pemantauan & Penambahbaikan</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Masukkan punca <b>Kewangan</b> (cth: PCG Panitia RM 850), <b>Kekangan</b> yang dijangka, <b>Kaedah Pemantauan</b> (senarai semak), 
                    <b>Kaedah Penilaian</b> (rubrik/ujian), serta cadangan <b>Penambahbaikan</b> untuk pusingan seterusnya.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">6</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">Langkah 6: Simpan, Muat Naik Evidens & Kemas Kini Status PDCA</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tekan butang <b>Simpan</b> pada menu atas. Seterusnya di tab <b>Dashboard</b>, anda boleh memuat naik fail/gambar evidens terus 
                    ke pangkalan data awan serta membuka modal <b>PDCA</b> untuk menukar tahap (PLAN ➔ DO ➔ CHECK ➔ ACT) mengikut fasa sebenar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Sub-section 4: Contoh Nyata (Panitia Muzik) */}
      {activeSubSection === 'contoh' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Contoh Lengkap: Panitia Muzik — Pertandingan Gema Suara Merdeka
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rujukan standard pengisian Pelan Operasi yang menepati seluruh kriteria KPM dan SKPM.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dash')}
                  className="px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat di Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Panitia:</span>
                  <span className="font-bold text-slate-900">Pendidikan Muzik (Unit Kurikulum)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Nama Program:</span>
                  <span className="font-bold text-sky-900">Pertandingan Gema Suara Merdeka SK Rompin 2026</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Status Semasa PDCA:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    DO (50% Kemajuan)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-800 block">Isu Strategik:</span>
                    <p className="text-slate-600 mt-0.5">
                      Bakat vokal, apresiasi seni lagu patriotik dan tahap keyakinan diri murid dalam persembahan seni suara pentas masih di tahap sederhana.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block">Penjajaran RPM:</span>
                    <p className="text-slate-600 mt-0.5">
                      <b>TS2</b> (Mengoptimumkan Potensi Murid) ➔ <b>S3</b> (Membangunkan Bakat) ➔ <b>P1</b> (Bakat Holistik STEM, TVET, Sukan & Seni)
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block">Objektif:</span>
                    <ol className="text-slate-600 pl-4 list-decimal space-y-0.5 mt-0.5">
                      <li>Sekurang-kurangnya 95% murid menyertai aktiviti saringan nyanyian patriotik peringkat kelas.</li>
                      <li>Meningkatkan keyakinan pentas dan teknik vokal murid (pic, tempo, sebutan dan dinamik).</li>
                      <li>Melatih dan memilih 3 wakil terbaik ke Pertandingan Solo Peringkat Daerah.</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-800 block">KPI & Sasaran:</span>
                    <p className="text-slate-600 mt-0.5">
                      <b>KPI:</b> Peratus penyertaan murid & pencapaian minimum 3 wakil ke peringkat daerah.<br/>
                      <b>Sasaran:</b> ≥ 95% penyertaan murid & 100% sasaran wakil sekolah tercapai.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block">Kewangan & Kos:</span>
                    <p className="text-slate-600 mt-0.5">
                      RM 850.00 (Bantuan Geran Perkapita / PCG Panitia Muzik & Peruntukan Sambutan Bulan Kebangsaan)
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block">Penilaian & Evidens:</span>
                    <p className="text-slate-600 mt-0.5">
                      Borang rubrik penjurian juri profesional (Pic 30%, Tempo & Sebutan 25%, Dinamik 25%, Persembahan 20%), 
                      kertas kerja kelulusan, poster, rakaman video nyanyian, dan sijil pemenang.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-3">
              <h4 className="font-bold text-xs text-sky-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-700" />
                Senarai Semak Kendiri Kualiti Pelan Operasi (Self-Audit):
              </h4>
              <p className="text-xs text-slate-600">
                Tandakan semakan kendiri ini sebelum mencetak atau menghantar pelan operasi kepada pihak pengurusan sekolah:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={checklist.jajaranRpm}
                    onChange={() => toggleCheck('jajaranRpm')}
                    className="rounded text-sky-700 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-800">Dijajarkan ke Teras, Strategi & Prakarsa RPM yang betul</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={checklist.smartObjektif}
                    onChange={() => toggleCheck('smartObjektif')}
                    className="rounded text-sky-700 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-800">Objektif mematuhi prinsip SMART dan bernombor</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={checklist.kpiTepat}
                    onChange={() => toggleCheck('kpiTepat')}
                    className="rounded text-sky-700 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-800">KPI dan Sasaran KPI mempunyai indikator kuantitatif boleh ukur</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={checklist.bajetPcg}
                    onChange={() => toggleCheck('bajetPcg')}
                    className="rounded text-sky-700 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-800">Punca kos dinyatakan mengikut punca dana sah (cth: PCG)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={checklist.evidensLengkap}
                    onChange={() => toggleCheck('evidensLengkap')}
                    className="rounded text-sky-700 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-800">Evidens dokumen/gambar dimuat naik ke repositori awan</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={checklist.pdcaKemaskini}
                    onChange={() => toggleCheck('pdcaKemaskini')}
                    className="rounded text-sky-700 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-800">Status tahap PDCA dikemas kini mengikut fasa pelaksanaan semasa</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Soalan Lazim (FAQ) + CHATBOX GEMINI AI */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
        {/* FAQ Header & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Soalan Lazim & Chatbot Pintar AI (FAQ)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-900 font-extrabold border border-sky-300">
                  Gemini AI
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Tanya soalan terus kepada Pembantu Maya atau semak senarai soalan lazim KPM.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFaqViewMode('chat')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                faqViewMode === 'chat'
                  ? 'bg-white text-sky-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-sky-600" />
              <span>Tanya AI Pintar</span>
            </button>
            <button
              onClick={() => setFaqViewMode('accordion')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                faqViewMode === 'accordion'
                  ? 'bg-white text-sky-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Soalan Lazim Berstruktur</span>
            </button>
          </div>
        </div>

        {/* MODE A: GEMINI CHATBOX */}
        {faqViewMode === 'chat' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Chat Conversation Window */}
            <div className="border border-slate-200 rounded-xl bg-slate-50/60 p-4 min-h-[340px] max-h-[460px] overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                        isUser
                          ? 'bg-[#17375e] text-white'
                          : 'bg-gradient-to-tr from-sky-600 to-indigo-600 text-white'
                      }`}
                    >
                      {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    {/* Content Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs relative group ${
                        isUser
                          ? 'bg-[#17375e] text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 pb-1 mb-1 border-b border-slate-100/30 text-[10px] opacity-75">
                        <span className="font-semibold">
                          {isUser ? 'Anda (Guru SK Rompin)' : 'Pembantu Maya e-Pelan & PDCA'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message Text with simple formatting */}
                      <div className="leading-relaxed whitespace-pre-line space-y-1">
                        {msg.content.split('\n').map((line, lidx) => {
                          // simple bold renderer
                          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                          return (
                            <div 
                              key={lidx} 
                              dangerouslySetInnerHTML={{ __html: formattedLine }} 
                            />
                          );
                        })}
                      </div>

                      {/* Action buttons on bot reply */}
                      {!isUser && (
                        <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-sky-700 font-medium px-2 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
                            title="Salin jawapan"
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Disalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoadingChat && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                    <span>Gemini AI sedang meneliti dan menjana jawapan...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <MessageSquareQuote className="w-3.5 h-3.5 text-sky-700" />
                Cadangan Soalan Pantas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {starterPrompts.map((prompt, pidx) => (
                  <button
                    key={pidx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoadingChat}
                    className="text-[11px] bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/80 transition cursor-pointer disabled:opacity-50 text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-end gap-2 bg-white border border-slate-300 focus-within:border-sky-600 rounded-xl p-2 shadow-2xs transition">
              <textarea
                ref={inputRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya apa-apa soalan mengenai Pelan Operasi, PDCA, RPM 2026–2035 atau contoh panitia... (Tekan Enter untuk hantar)"
                rows={2}
                disabled={isLoadingChat}
                className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-hidden leading-relaxed px-1"
              />

              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Kosongkan Sejarah Sembang"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputPrompt.trim() || isLoadingChat}
                  className="px-3.5 py-2 bg-[#17375e] hover:bg-[#102d50] text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-2xs disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Hantar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE B: STRUCTURED ACCORDION */}
        {faqViewMode === 'accordion' && (
          <div className="space-y-2 animate-in fade-in duration-150">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs text-slate-800 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Bottom Navigation Link Bar */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600">
          Sedia untuk merangka pelan baharu panitia anda?
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ref')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition cursor-pointer"
          >
            Rujukan RPM
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className="px-3.5 py-1.5 bg-[#17375e] hover:bg-[#102d50] text-white font-bold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Borang Pelan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// src/components/HeaderNav.tsx
import React, { useRef } from 'react';
import { Plus, Save, Printer, Download, Upload, Database, UserCheck, LogIn, LogOut } from 'lucide-react';
import { SchoolSettings } from '../types.ts';
import { DEFAULT_LOGO } from '../data/rpmData.ts';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNew: () => void;
  onSave: () => void;
  onPrint: () => void;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  settings: SchoolSettings;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onNew,
  onSave,
  onPrint,
  onBackup,
  onRestore,
  isSaving,
  settings,
  user,
  onLogin,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'form', label: 'Pengisian' },
    { id: 'dash', label: 'Dashboard' },
    { id: 'book', label: 'Buku Rasmi' },
    { id: 'set', label: 'Tetapan Sekolah' },
    { id: 'ref', label: 'Rujukan RPM' },
    { id: 'guide', label: 'Panduan PDCA & KPM' },
  ];

  return (
    <header className="noPrint">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#102d50] via-[#1b487d] to-[#2873a8] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <img
            src={settings.logoUrl || DEFAULT_LOGO}
            alt="Logo Sekolah"
            className="w-12 h-14 object-contain bg-white/95 p-1 rounded-md shadow-xs border border-white/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0">
                {settings.schoolName || 'SISTEM e-PELAN OPERASI SK ROMPIN v5'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <Database className="w-2.5 h-2.5" /> Cloud SQL Connected
              </span>
            </div>
            <p className="text-xs text-sky-100 font-medium m-0 mt-0.5">
              Pelan Operasi Digital • Rancangan Pendidikan Malaysia 2026–2035 ({settings.place || 'Negeri Sembilan'})
            </p>
          </div>
        </div>

        {/* User Auth Info */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold text-white max-w-[160px] truncate">
                {user.displayName || user.email}
              </span>
              <button
                onClick={onLogout}
                title="Log Keluar"
                className="text-sky-200 hover:text-white p-1 hover:bg-white/10 rounded transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 text-xs font-bold bg-white text-[#102d50] hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-700" /> Log Masuk Google
            </button>
          )}
        </div>
      </div>

      {/* Action Toolbar & Nav Tabs */}
      <nav className="bg-white border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-[#17375e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNew}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" /> Baharu
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-md bg-[#17375e] hover:bg-[#102d50] text-white shadow-xs transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-md bg-rose-700 hover:bg-rose-800 text-white shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" /> PDF Pelan
          </button>
          <button
            onClick={onBackup}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" /> Backup
          </button>
          <label className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" /> Import
            <input
              type="file"
              ref={fileInputRef}
              onChange={onRestore}
              className="hidden"
              accept=".json"
            />
          </label>
        </div>
      </nav>
    </header>
  );
};

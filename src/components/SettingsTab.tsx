// src/components/SettingsTab.tsx
import React, { useRef } from 'react';
import { SchoolSettings } from '../types.ts';
import { DEFAULT_LOGO } from '../data/rpmData.ts';
import { Save, Upload, RotateCcw } from 'lucide-react';

interface SettingsTabProps {
  settings: SchoolSettings;
  setSettings: React.Dispatch<React.SetStateAction<SchoolSettings>>;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, setSettings, onSave, isSaving }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#17375e] border-b border-slate-200 pb-3 mb-5">
          TETAPAN SEKOLAH & PENGESAHAN DOKUMEN
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-start mb-6">
          {/* Logo preview and upload */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <img
              src={settings.logoUrl || DEFAULT_LOGO}
              alt="Logo Sekolah"
              className="w-24 h-28 object-contain mb-3 bg-white p-1 rounded-md shadow-2xs border border-slate-200"
            />
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 py-1.5 px-3 rounded-md shadow-2xs flex items-center gap-1 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Tukar Logo
            </button>
            {settings.logoUrl && (
              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, logoUrl: '' }))}
                className="text-[10px] text-slate-500 hover:text-rose-600 mt-2 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Default
              </button>
            )}
          </div>

          {/* School details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penuh Sekolah</label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={e => setSettings(prev => ({ ...prev, schoolName: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Negeri / Daerah / Alamat</label>
              <input
                type="text"
                value={settings.place}
                onChange={e => setSettings(prev => ({ ...prev, place: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Moto / Visi Sekolah</label>
              <input
                type="text"
                value={settings.motto || ''}
                onChange={e => setSettings(prev => ({ ...prev, motto: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden italic"
              />
            </div>
          </div>
        </div>

        {/* Pegawai Pengesahan */}
        <div className="border-t border-slate-200 pt-5 mt-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
            Nama Pegawai Pengesahan & Tanda Tangan Dokumen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Guru Besar (Pengesah)</label>
              <input
                type="text"
                placeholder="Nama Guru Besar"
                value={settings.gb || ''}
                onChange={e => setSettings(prev => ({ ...prev, gb: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Penolong Kanan (Penyemak)</label>
              <input
                type="text"
                placeholder="Nama Penolong Kanan"
                value={settings.pk || ''}
                onChange={e => setSettings(prev => ({ ...prev, pk: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ketua Panitia (Penyedia)</label>
              <input
                type="text"
                placeholder="Nama Ketua Panitia / Penyelaras"
                value={settings.kp || ''}
                onChange={e => setSettings(prev => ({ ...prev, kp: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[#17375e] hover:bg-[#102d50] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Tetapan ke Database'}
          </button>
        </div>
      </div>
    </div>
  );
};

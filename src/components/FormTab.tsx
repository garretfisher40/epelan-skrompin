// src/components/FormTab.tsx
import React, { useRef } from 'react';
import { PlanRecord, SchoolSettings } from '../types.ts';
import { 
  RPM_DATA, 
  UNIT_OPTIONS, 
  ISU_BY_UNIT,
  ISU_PRESETS, 
  SMART_TEMPLATES, 
  DEFAULT_LOGO,
  MATLAMAT_PRESETS,
  OBJEKTIF_PRESETS,
  KPI_PRESETS,
  TEMPOH_PRESETS,
  SASARAN_PRESETS,
  TANGGUNGJAWAB_PRESETS,
  KEWANGAN_PRESETS,
  KEKANGAN_PRESETS,
  PEMANTAUAN_PRESETS,
  PENILAIAN_PRESETS,
  PENAMBAHBAIKAN_PRESETS,
  EVIDENS_PRESETS
} from '../data/rpmData.ts';
import { ImagePlus, Trash2, Camera } from 'lucide-react';

interface FormTabProps {
  plan: PlanRecord;
  setPlan: React.Dispatch<React.SetStateAction<PlanRecord>>;
  settings: SchoolSettings;
  onUploadImage: (file: File) => Promise<string | void>;
}

export const FormTab: React.FC<FormTabProps> = ({ plan, setPlan, settings, onUploadImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = Array.from({ length: 10 }, (_, i) => String(2026 + i));
  const units = Object.keys(UNIT_OPTIONS);
  const currentPanitias = UNIT_OPTIONS[plan.unit] || [];
  const currentIsus = ISU_BY_UNIT[plan.unit] || ISU_BY_UNIT['Unit Kurikulum'] || [];
  const terasKeys = Object.keys(RPM_DATA);
  const currentStrategis = RPM_DATA[plan.teras] ? Object.keys(RPM_DATA[plan.teras]) : [];
  const currentPrakarsas = (RPM_DATA[plan.teras] && RPM_DATA[plan.teras][plan.strategi]) || [];

  const handleUnitChange = (newUnit: string) => {
    const defaultPanitia = UNIT_OPTIONS[newUnit]?.[0] || '';
    const unitIsus = ISU_BY_UNIT[newUnit] || [];
    const defaultIsu = unitIsus[0] || '';
    const template = SMART_TEMPLATES[defaultIsu];

    setPlan(prev => ({
      ...prev,
      unit: newUnit,
      panitia: defaultPanitia,
      isu: defaultIsu,
      ...(template ? {
        program: template.programs[0] || prev.program,
        matlamat: template.matlamat || prev.matlamat,
        objektif: template.objektif || prev.objektif,
        kpi: template.kpis[0] || prev.kpi,
      } : {})
    }));
  };

  const handleTerasChange = (newTeras: string) => {
    const strategis = Object.keys(RPM_DATA[newTeras] || {});
    const defaultStrat = strategis[0] || '';
    const prakarsas = (RPM_DATA[newTeras] && RPM_DATA[newTeras][defaultStrat]) || [];
    setPlan(prev => ({
      ...prev,
      teras: newTeras,
      strategi: defaultStrat,
      prakarsa: prakarsas[0] || ''
    }));
  };

  const handleStrategiChange = (newStrat: string) => {
    const prakarsas = (RPM_DATA[plan.teras] && RPM_DATA[plan.teras][newStrat]) || [];
    setPlan(prev => ({
      ...prev,
      strategi: newStrat,
      prakarsa: prakarsas[0] || ''
    }));
  };

  const handleIsuChange = (newIsu: string) => {
    const template = SMART_TEMPLATES[newIsu];
    if (template) {
      setPlan(prev => ({
        ...prev,
        isu: newIsu,
        program: template.programs[0] || prev.program,
        matlamat: template.matlamat,
        objektif: template.objektif,
        kpi: template.kpis[0] || prev.kpi,
        proses: '1. PLAN — Kenal pasti isu dan sasaran berdasarkan data pentaksiran.\n2. DO — Laksanakan program mengikut perancangan dan modul.\n3. CHECK — Pantau KPI, semak evidens dan kehadiran murid.\n4. ACT — Nilai impak dan laksanakan intervensi penambahbaikan.'
      }));
    } else {
      setPlan(prev => ({ ...prev, isu: newIsu }));
    }
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await onUploadImage(file);
      if (url) {
        setPlan(prev => ({ ...prev, gambarUrl: url }));
      }
    } catch {
      alert('Gagal memuat naik gambar.');
    }
  };

  const cleanLabel = (text: string) => (text || '').replace(/^(TS|S|P)\d+\|/, '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 max-w-[1600px] mx-auto">
      {/* Form Editor Column */}
      <div className="lg:col-span-6 space-y-4 noPrint">
        {/* Section A */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#17375e] border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 bg-[#17375e] text-white rounded-full flex items-center justify-center text-xs">A</span>
            MAKLUMAT ASAS
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tahun</label>
              <select
                value={plan.tahun}
                onChange={e => setPlan(prev => ({ ...prev, tahun: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={plan.unit}
                onChange={e => handleUnitChange(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-medium"
              >
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-2.5">
            <label className="block text-xs font-bold text-slate-700 mb-1">Panitia / Subunit</label>
            <select
              value={plan.panitia}
              onChange={e => setPlan(prev => ({ ...prev, panitia: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-medium"
            >
              {currentPanitias.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Isu / Pernyataan Masalah</label>
              <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Berkaitan {plan.unit}
              </span>
            </div>
            <select
              value={currentIsus.includes(plan.isu) ? plan.isu : (plan.isu ? 'Lain-lain / Isu Kustom' : (currentIsus[0] || ''))}
              onChange={e => handleIsuChange(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-medium text-slate-800"
            >
              {currentIsus.map(isu => (
                <option key={isu} value={isu}>{isu}</option>
              ))}
            </select>
            {(!currentIsus.includes(plan.isu) || plan.isu === 'Lain-lain / Isu Kustom') && (
              <textarea
                rows={2}
                value={plan.isu === 'Lain-lain / Isu Kustom' ? '' : plan.isu}
                onChange={e => setPlan(prev => ({ ...prev, isu: e.target.value }))}
                placeholder="Tulis penyataan isu khusus bagi unit ini..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mt-1.5"
              />
            )}
          </div>
        </div>

        {/* Section B: RPM */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#17375e] border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 bg-[#17375e] text-white rounded-full flex items-center justify-center text-xs">B</span>
            RANCANGAN PENDIDIKAN MALAYSIA (RPM 2026–2035)
          </h2>
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teras Strategik</label>
              <select
                value={plan.teras}
                onChange={e => handleTerasChange(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-medium text-slate-800"
              >
                {terasKeys.map(t => (
                  <option key={t} value={t}>{t.replace('|', ' — ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Strategi</label>
              <select
                value={plan.strategi}
                onChange={e => handleStrategiChange(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-medium text-slate-800"
              >
                {currentStrategis.map(s => (
                  <option key={s} value={s}>{s.replace('|', ' — ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prakarsa</label>
              <select
                value={plan.prakarsa}
                onChange={e => setPlan(prev => ({ ...prev, prakarsa: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-medium text-slate-800"
              >
                {currentPrakarsas.map(p => (
                  <option key={p} value={p}>{p.replace('|', ' — ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section C: Program & KPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#17375e] border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 bg-[#17375e] text-white rounded-full flex items-center justify-center text-xs">C</span>
            PROGRAM & PETUNJUK PRESTASI UTAMA (KPI)
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Program / Projek</label>
              <input
                type="text"
                value={plan.program}
                onChange={e => setPlan(prev => ({ ...prev, program: e.target.value }))}
                placeholder="cth: Program Bacaan Berfokus Nilam"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden font-bold text-slate-900"
              />
            </div>

            {/* 1. Matlamat Program Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Matlamat Program (Pilihan Dropdown RPM)</label>
                <span className="text-[10px] text-sky-700 font-medium">Berdasarkan Teras RPM</span>
              </div>
              <select
                value={MATLAMAT_PRESETS.includes(plan.matlamat) ? plan.matlamat : (plan.matlamat ? 'Pilihan Sendiri / Kustom' : '')}
                onChange={e => {
                  if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                    setPlan(prev => ({ ...prev, matlamat: e.target.value }));
                  }
                }}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
              >
                <option value="" disabled>-- Pilih Matlamat Berteraskan RPM 2026–2035 --</option>
                {MATLAMAT_PRESETS.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
              <textarea
                rows={2}
                value={plan.matlamat}
                onChange={e => setPlan(prev => ({ ...prev, matlamat: e.target.value }))}
                placeholder="Huraian matlamat program (boleh disunting mengikut keperluan panitia)..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>

            {/* 2. Objektif Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Objektif Program (Pilihan Dropdown KPM)</label>
                <span className="text-[10px] text-sky-700 font-medium">Standard Kemenjadian Murid</span>
              </div>
              <select
                value={OBJEKTIF_PRESETS.includes(plan.objektif) ? plan.objektif : (plan.objektif ? 'Pilihan Sendiri / Kustom' : '')}
                onChange={e => {
                  if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                    setPlan(prev => ({ ...prev, objektif: e.target.value }));
                  }
                }}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
              >
                <option value="" disabled>-- Pilih Objektif Standard Sistem Pendidikan Malaysia --</option>
                {OBJEKTIF_PRESETS.map((o, idx) => (
                  <option key={idx} value={o}>{o.replace(/\n/g, ' ')}</option>
                ))}
              </select>
              <textarea
                rows={2}
                value={plan.objektif}
                onChange={e => setPlan(prev => ({ ...prev, objektif: e.target.value }))}
                placeholder="Objektif khusus dalam bentuk bernombor (boleh disunting)..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>

            {/* 3. KPI & Sasaran KPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  KPI (Pilihan Dropdown Indikator)
                </label>
                <select
                  value={KPI_PRESETS.includes(plan.kpi) ? plan.kpi : (plan.kpi ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, kpi: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Indikator KPI Malaysia --</option>
                  {KPI_PRESETS.map((k, idx) => (
                    <option key={idx} value={k}>{k}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.kpi}
                  onChange={e => setPlan(prev => ({ ...prev, kpi: e.target.value }))}
                  placeholder="Atau taip KPI tersendiri..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sasaran KPI</label>
                <select
                  value={plan.sasaranKpi}
                  onChange={e => setPlan(prev => ({ ...prev, sasaranKpi: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden h-[34px] font-medium"
                >
                  <option value="≥ 80% mencapai sasaran">≥ 80% mencapai sasaran</option>
                  <option value="≥ 85% mencapai sasaran">≥ 85% mencapai sasaran</option>
                  <option value="≥ 90% mencapai sasaran">≥ 90% mencapai sasaran</option>
                  <option value="≥ 95% mencapai sasaran">≥ 95% mencapai sasaran</option>
                  <option value="Peningkatan ≥ 10%">Peningkatan ≥ 10%</option>
                  <option value="Peningkatan ≥ 20%">Peningkatan ≥ 20%</option>
                  <option value="100% program dilaksanakan">100% program dilaksanakan</option>
                  <option value="100% murid melepasi tahap minimum">100% murid melepasi tahap minimum</option>
                </select>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Penanda aras kejayaan mengikut sasaran SK Rompin.
                </span>
              </div>
            </div>

            {/* 4. Tempoh Pelaksanaan & 5. Kumpulan Sasaran Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tempoh Pelaksanaan (Dropdown Takwim KPM)
                </label>
                <select
                  value={TEMPOH_PRESETS.includes(plan.tempoh) ? plan.tempoh : (plan.tempoh ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, tempoh: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Penggal / Tempoh Takwim KPM --</option>
                  {TEMPOH_PRESETS.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.tempoh}
                  onChange={e => setPlan(prev => ({ ...prev, tempoh: e.target.value }))}
                  placeholder="Atau tulis tempoh sendiri..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kumpulan Sasaran (Dropdown Warga Sekolah)
                </label>
                <select
                  value={SASARAN_PRESETS.includes(plan.sasaran) ? plan.sasaran : (plan.sasaran ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, sasaran: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Kumpulan Sasaran Murid / Guru --</option>
                  {SASARAN_PRESETS.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.sasaran}
                  onChange={e => setPlan(prev => ({ ...prev, sasaran: e.target.value }))}
                  placeholder="Atau tulis kumpulan sasaran khusus..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Pelaksanaan & Direct Image Upload */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#17375e] border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 bg-[#17375e] text-white rounded-full flex items-center justify-center text-xs">D</span>
            PELAKSANAAN & MUAT NAIK GAMBAR
          </h2>
          <div className="space-y-2.5">
            {/* 1. Proses Kerja / Aliran PDCA (Textarea only - no dropdown as requested) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Proses Kerja / Aliran PDCA</label>
              <textarea
                rows={3}
                value={plan.proses}
                onChange={e => setPlan(prev => ({ ...prev, proses: e.target.value }))}
                placeholder="1. PLAN — Kenal pasti isu...\n2. DO — Laksanakan aktiviti...\n3. CHECK — Pantau KPI...\n4. ACT — Penambahbaikan..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>

            {/* 2. Tanggungjawab & 3. Kewangan / Sumber */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Tanggungjawab</label>
                  <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
                </div>
                <select
                  value={TANGGUNGJAWAB_PRESETS.includes(plan.tanggungjawab) ? plan.tanggungjawab : (plan.tanggungjawab ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, tanggungjawab: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Tanggungjawab Pelaksana --</option>
                  {TANGGUNGJAWAB_PRESETS.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.tanggungjawab}
                  onChange={e => setPlan(prev => ({ ...prev, tanggungjawab: e.target.value }))}
                  placeholder="Atau taip pihak bertanggungjawab..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Kewangan / Sumber</label>
                  <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
                </div>
                <select
                  value={KEWANGAN_PRESETS.includes(plan.kewangan) ? plan.kewangan : (plan.kewangan ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, kewangan: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Sumber Kewangan --</option>
                  {KEWANGAN_PRESETS.map((k, idx) => (
                    <option key={idx} value={k}>{k}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.kewangan}
                  onChange={e => setPlan(prev => ({ ...prev, kewangan: e.target.value }))}
                  placeholder="Anggaran atau punca peruntukan..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 4. Kekangan / Cabaran */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Kekangan / Cabaran</label>
                <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
              </div>
              <select
                value={KEKANGAN_PRESETS.includes(plan.kekangan) ? plan.kekangan : (plan.kekangan ? 'Pilihan Sendiri / Kustom' : '')}
                onChange={e => {
                  if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                    setPlan(prev => ({ ...prev, kekangan: e.target.value }));
                  }
                }}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
              >
                <option value="" disabled>-- Pilih Isu / Kekangan Pelaksanaan --</option>
                {KEKANGAN_PRESETS.map((k, idx) => (
                  <option key={idx} value={k}>{k}</option>
                ))}
              </select>
              <input
                type="text"
                value={plan.kekangan}
                onChange={e => setPlan(prev => ({ ...prev, kekangan: e.target.value }))}
                placeholder="Kekangan yang dihadapi semasa program..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>

            {/* 5. Pemantauan & 6. Penilaian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Pemantauan</label>
                  <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
                </div>
                <select
                  value={PEMANTAUAN_PRESETS.includes(plan.pemantauan) ? plan.pemantauan : (plan.pemantauan ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, pemantauan: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Kaedah Pemantauan --</option>
                  {PEMANTAUAN_PRESETS.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.pemantauan}
                  onChange={e => setPlan(prev => ({ ...prev, pemantauan: e.target.value }))}
                  placeholder="Kaedah pemantauan pelaksanaan..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Penilaian</label>
                  <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
                </div>
                <select
                  value={PENILAIAN_PRESETS.includes(plan.penilaian) ? plan.penilaian : (plan.penilaian ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, penilaian: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Kaedah Penilaian --</option>
                  {PENILAIAN_PRESETS.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.penilaian}
                  onChange={e => setPlan(prev => ({ ...prev, penilaian: e.target.value }))}
                  placeholder="Instrumen dan kaedah penilaian..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 7. Penambahbaikan & 8. Evidens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Penambahbaikan</label>
                  <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
                </div>
                <select
                  value={PENAMBAHBAIKAN_PRESETS.includes(plan.penambahbaikan) ? plan.penambahbaikan : (plan.penambahbaikan ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, penambahbaikan: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Tindakan Penambahbaikan --</option>
                  {PENAMBAHBAIKAN_PRESETS.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.penambahbaikan}
                  onChange={e => setPlan(prev => ({ ...prev, penambahbaikan: e.target.value }))}
                  placeholder="Cadangan penambahbaikan berterusan..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Evidens</label>
                  <span className="text-[10px] text-sky-700 font-medium">Pilihan Dropdown</span>
                </div>
                <select
                  value={EVIDENS_PRESETS.includes(plan.evidens) ? plan.evidens : (plan.evidens ? 'Pilihan Sendiri / Kustom' : '')}
                  onChange={e => {
                    if (e.target.value !== 'Pilihan Sendiri / Kustom') {
                      setPlan(prev => ({ ...prev, evidens: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50/80 hover:bg-white focus:bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden mb-1.5 font-medium text-slate-800"
                >
                  <option value="" disabled>-- Pilih Jenis Evidens Dokumentasi --</option>
                  {EVIDENS_PRESETS.map((e, idx) => (
                    <option key={idx} value={e}>{e}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={plan.evidens}
                  onChange={e => setPlan(prev => ({ ...prev, evidens: e.target.value }))}
                  placeholder="Dokumen evidens atau bukti program..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* DIRECT IMAGE UPLOAD BUTTON INTO DATABASE */}
            <div className="border border-sky-200 bg-sky-50/70 rounded-xl p-3.5 mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-700" />
                    Muat Naik Gambar ke Pangkalan Data
                  </h3>
                  <p className="text-[11px] text-sky-800">
                    Simpan gambar aktiviti / evidens terus ke pangkalan data PostgreSQL.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFile}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-2xs transition cursor-pointer"
                  >
                    <ImagePlus className="w-4 h-4" />
                    Pilih Gambar
                  </button>
                  {plan.gambarUrl && (
                    <button
                      type="button"
                      onClick={() => setPlan(prev => ({ ...prev, gambarUrl: '' }))}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                      title="Padam Gambar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Image Preview if available */}
              {plan.gambarUrl && (
                <div className="mt-3 relative inline-block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                  <img
                    src={plan.gambarUrl}
                    alt="Evidens Aktiviti"
                    className="h-28 w-auto max-w-full object-cover"
                  />
                  <div className="bg-black/60 text-white text-[10px] px-2 py-0.5 absolute bottom-0 left-0 right-0 truncate">
                    Tersimpan dalam database
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live A4 Document Preview Column */}
      <div className="lg:col-span-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md min-h-[980px] text-slate-900 font-sans print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="grid grid-cols-[70px_1fr_70px] items-center text-center pb-3 border-b-2 border-slate-800 mb-4">
            <img
              src={settings.logoUrl || DEFAULT_LOGO}
              alt="Logo"
              className="w-16 h-20 object-contain mx-auto"
            />
            <div className="px-2">
              <h2 className="text-base font-extrabold text-[#9b1c36] uppercase tracking-wide m-0">
                {settings.schoolName || 'SEKOLAH KEBANGSAAN ROMPIN'}
              </h2>
              <h3 className="text-sm font-bold text-[#17375e] uppercase m-0 mt-0.5">
                PELAN OPERASI {plan.tahun || '2026'}
              </h3>
              <p className="text-xs font-semibold text-slate-700 m-0">
                {plan.panitia ? `${plan.panitia} • ` : ''}{plan.unit || ''}
              </p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">
                “{plan.isu || 'Penguasaan pembelajaran'}”
              </p>
            </div>
            <div className="w-16 h-20 flex items-center justify-center">
              {/* Optional right badge / year box */}
              <div className="border border-sky-800 rounded p-1 text-center w-full">
                <span className="text-[9px] block font-bold text-sky-900">TAHUN</span>
                <span className="text-xs font-black text-[#9b1c36]">{plan.tahun}</span>
              </div>
            </div>
          </div>

          {/* Operational Table */}
          <table className="w-full border-collapse text-[11px] leading-snug">
            <tbody>
              <tr className="border border-slate-600">
                <td className="w-1/3 bg-slate-100 font-bold p-1.5 border-r border-slate-600">TERAS STRATEGIK</td>
                <td className="p-1.5 text-slate-800 font-medium">{cleanLabel(plan.teras) || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">UNIT PENERAJU</td>
                <td className="p-1.5 text-slate-800 font-medium">{plan.unit} — {plan.panitia}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">STRATEGI</td>
                <td className="p-1.5 text-slate-800 font-medium">{cleanLabel(plan.strategi) || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PRAKARSA</td>
                <td className="p-1.5 text-slate-800 font-medium">{cleanLabel(plan.prakarsa) || '—'}</td>
              </tr>
              <tr className="border border-slate-600 bg-sky-50/50">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600 text-[#102d50]">PROGRAM / PROJEK</td>
                <td className="p-1.5 font-bold text-[#102d50] text-xs">{plan.program || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">MATLAMAT</td>
                <td className="p-1.5 whitespace-pre-wrap">{plan.matlamat || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">OBJEKTIF</td>
                <td className="p-1.5 whitespace-pre-wrap">{plan.objektif || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">KPI / SASARAN</td>
                <td className="p-1.5 font-semibold text-slate-900">{plan.kpi ? `${plan.kpi} — ${plan.sasaranKpi}` : '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">TARIKH / TEMPOH</td>
                <td className="p-1.5">{plan.tempoh || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">KUMPULAN SASARAN</td>
                <td className="p-1.5">{plan.sasaran || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">TANGGUNGJAWAB</td>
                <td className="p-1.5">{plan.tanggungjawab || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PROSES KERJA (PDCA)</td>
                <td className="p-1.5 whitespace-pre-wrap text-[10.5px]">{plan.proses || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">KEWANGAN / PERUNTUKAN</td>
                <td className="p-1.5">{plan.kewangan || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">KEKANGAN</td>
                <td className="p-1.5">{plan.kekangan || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PEMANTAUAN</td>
                <td className="p-1.5">{plan.pemantauan || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PENILAIAN</td>
                <td className="p-1.5">{plan.penilaian || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PENAMBAHBAIKAN</td>
                <td className="p-1.5">{plan.penambahbaikan || '—'}</td>
              </tr>
              <tr className="border border-slate-600">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">EVIDENS</td>
                <td className="p-1.5">
                  <div>{plan.evidens || '—'}</div>
                  {plan.gambarUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2">
                      <img
                        src={plan.gambarUrl}
                        alt="Evidens"
                        className="h-20 w-auto rounded border border-slate-400 object-cover"
                      />
                      <span className="text-[10px] text-slate-500 italic">Lampiran Evidens Foto Bergambar</span>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 text-center text-[10px] mt-10 pt-4">
            <div>
              <div className="border-t border-slate-700 pt-1.5">
                <span>Disediakan oleh:</span>
                <p className="font-bold text-slate-900 mt-0.5">{settings.kp || 'Ketua Panitia / Penyelaras'}</p>
              </div>
            </div>
            <div>
              <div className="border-t border-slate-700 pt-1.5">
                <span>Disemak oleh:</span>
                <p className="font-bold text-slate-900 mt-0.5">{settings.pk || 'Penolong Kanan'}</p>
              </div>
            </div>
            <div>
              <div className="border-t border-slate-700 pt-1.5">
                <span>Disahkan oleh:</span>
                <p className="font-bold text-slate-900 mt-0.5">{settings.gb || 'Guru Besar'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

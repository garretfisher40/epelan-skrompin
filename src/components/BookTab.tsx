// src/components/BookTab.tsx
import React from 'react';
import { PlanRecord, SchoolSettings } from '../types.ts';
import { DEFAULT_LOGO } from '../data/rpmData.ts';
import { Printer } from 'lucide-react';

interface BookTabProps {
  plans: PlanRecord[];
  settings: SchoolSettings;
  year: string;
}

export const BookTab: React.FC<BookTabProps> = ({ plans, settings, year }) => {
  const cleanLabel = (text: string) => (text || '').replace(/^(TS|S|P)\d+\|/, '');

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      {/* Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex items-center justify-between noPrint">
        <div>
          <h2 className="text-sm font-bold text-slate-800 m-0">Penjanaan Buku Rasmi Pelan Operasi</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">
            Muka depan rasmi + Isi Kandungan bernombor + Semua Pelan Operasi berserta evidens dan tanda tangan.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition"
        >
          <Printer className="w-4 h-4" /> Cetak / Jana PDF Lengkap
        </button>
      </div>

      <div className="space-y-8 bg-slate-100 p-4 rounded-xl print:bg-white print:p-0">
        {/* Cover Page */}
        <div className="bg-white border-8 border-slate-200 rounded-xl p-10 min-h-[1050px] flex flex-col justify-center items-center text-center page-break shadow-sm print:shadow-none print:border-none">
          <img
            src={settings.logoUrl || DEFAULT_LOGO}
            alt="Logo"
            className="w-44 h-52 object-contain mb-8"
          />
          <h1 className="text-3xl font-extrabold text-[#17375e] tracking-tight m-0">
            BUKU PELAN OPERASI
          </h1>
          <h2 className="text-xl font-bold text-[#9b1c36] uppercase mt-2 mb-4">
            {settings.schoolName || 'SEKOLAH KEBANGSAAN ROMPIN'}
          </h2>
          <div className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
            {settings.place || 'NEGERI SEMBILAN'}
          </div>
          <div className="text-5xl font-black text-sky-600 my-8 font-mono">
            {year || '2026'}
          </div>
          <p className="text-xs text-slate-600 max-w-md font-medium">
            Berpandukan Rancangan Pendidikan Malaysia (RPM 2026–2035) & Pengurusan Kualiti Berterusan
          </p>
          <div className="mt-6 text-xs italic text-slate-500 border-t border-slate-300 pt-3">
            “{settings.motto || 'USAHA JAYA'}”
          </div>
          <div className="text-[10px] text-slate-400 mt-12">Halaman 1</div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white border border-slate-200 rounded-xl p-10 min-h-[1050px] page-break shadow-sm print:shadow-none print:border-none">
          <h2 className="text-xl font-bold text-[#17375e] text-center mb-8 border-b-2 border-slate-800 pb-3">
            ISI KANDUNGAN
          </h2>
          <div className="border-b border-slate-300 pb-2 mb-2 font-bold text-xs grid grid-cols-[40px_1fr_60px] text-slate-700">
            <span>Bil</span>
            <span>Program / Unit Peneraju</span>
            <span className="text-right">Halaman</span>
          </div>
          <div className="divide-y divide-dotted divide-slate-300 text-xs text-slate-800">
            {plans.map((p, idx) => (
              <div key={p.planId} className="grid grid-cols-[40px_1fr_60px] py-2.5 items-center">
                <span className="font-semibold text-slate-500">{idx + 1}</span>
                <div>
                  <span className="font-bold text-slate-900 block">{p.program}</span>
                  <span className="text-[11px] text-slate-500">{p.unit} — {p.panitia}</span>
                </div>
                <span className="text-right font-mono font-bold text-sky-800">{idx + 3}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 text-right mt-16">Halaman 2</div>
        </div>

        {/* Individual Plan Pages */}
        {plans.map((p, idx) => (
          <div
            key={p.planId}
            className="bg-white border border-slate-200 rounded-xl p-8 min-h-[1050px] page-break relative shadow-sm print:shadow-none print:border-none"
          >
            {/* Header */}
            <div className="grid grid-cols-[70px_1fr_70px] items-center text-center pb-3 border-b-2 border-slate-800 mb-4">
              <img src={settings.logoUrl || DEFAULT_LOGO} alt="Logo" className="w-14 h-18 object-contain mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-[#9b1c36] uppercase m-0">{settings.schoolName}</h3>
                <h4 className="text-xs font-bold text-[#17375e] uppercase m-0 mt-0.5">PELAN OPERASI {p.tahun}</h4>
                <p className="text-[11px] font-semibold text-slate-700 m-0">{p.unit} — {p.panitia}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Fasa PDCA:</span>
                <span className="text-xs font-extrabold text-sky-700">{p.pdcaStage}</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-[10px] leading-snug">
              <tbody>
                <tr className="border border-slate-600">
                  <td className="w-1/3 bg-slate-100 font-bold p-1.5 border-r border-slate-600">TERAS STRATEGIK</td>
                  <td className="p-1.5">{cleanLabel(p.teras)}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">UNIT PENERAJU</td>
                  <td className="p-1.5">{p.unit} — {p.panitia}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PROGRAM / PROJEK</td>
                  <td className="p-1.5 font-bold text-[#17375e]">{p.program}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">MATLAMAT & OBJEKTIF</td>
                  <td className="p-1.5 whitespace-pre-wrap">{p.matlamat}{p.objektif ? `\n\n${p.objektif}` : ''}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">KPI & SASARAN</td>
                  <td className="p-1.5 font-semibold">{p.kpi} — {p.sasaranKpi}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PROSES KERJA (PDCA)</td>
                  <td className="p-1.5 whitespace-pre-wrap">{p.proses}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">KEWANGAN / PERUNTUKAN</td>
                  <td className="p-1.5">{p.kewangan || '—'}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PEMANTAUAN & PENILAIAN</td>
                  <td className="p-1.5">{p.pemantauan} / {p.penilaian}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">PENAMBAHBAIKAN</td>
                  <td className="p-1.5">{p.penambahbaikan}</td>
                </tr>
                <tr className="border border-slate-600">
                  <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-600">EVIDENS</td>
                  <td className="p-1.5">
                    <div>{p.evidens}</div>
                    {p.gambarUrl && (
                      <div className="mt-1">
                        <img src={p.gambarUrl} alt="Evidens" className="h-16 w-auto rounded border border-slate-400" />
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 text-center text-[9px] mt-8 pt-3">
              <div>
                <div className="border-t border-slate-700 pt-1">
                  <span>Disediakan oleh:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{settings.kp || 'Ketua Panitia / Penyelaras'}</p>
                </div>
              </div>
              <div>
                <div className="border-t border-slate-700 pt-1">
                  <span>Disemak oleh:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{settings.pk || 'Penolong Kanan'}</p>
                </div>
              </div>
              <div>
                <div className="border-t border-slate-700 pt-1">
                  <span>Disahkan oleh:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{settings.gb || 'Guru Besar'}</p>
                </div>
              </div>
            </div>

            <div className="absolute right-6 bottom-4 text-[9px] text-slate-500 font-mono">
              Halaman {idx + 3}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

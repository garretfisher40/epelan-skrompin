// src/components/RpmTab.tsx
import React, { useState } from 'react';
import { RPM_DATA } from '../data/rpmData.ts';
import { BookOpen, Search } from 'lucide-react';

export const RpmTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const terasEntries = Object.entries(RPM_DATA);

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#17375e] m-0 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-700" />
              Rancangan Pendidikan Malaysia (RPM 2026–2035)
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Rujukan rasmi 7 Teras Strategik, Strategi dan Prakarsa Kementerian Pendidikan Malaysia.
            </p>
          </div>
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari teras atau prakarsa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="space-y-6">
          {terasEntries.map(([terasName, strategis]) => {
            const matchesSearch =
              terasName.toLowerCase().includes(search.toLowerCase()) ||
              Object.keys(strategis).some(s => s.toLowerCase().includes(search.toLowerCase())) ||
              Object.values(strategis).some(pList => pList.some(p => p.toLowerCase().includes(search.toLowerCase())));

            if (!matchesSearch && search) return null;

            return (
              <div key={terasName} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-gradient-to-r from-[#17375e] to-[#2873a8] text-white px-4 py-2.5 font-bold text-xs">
                  {terasName.replace('|', ' — ')}
                </div>
                <div className="p-4 bg-white space-y-4">
                  {Object.entries(strategis).map(([stratName, prakarsaList]) => (
                    <div key={stratName} className="pl-3 border-l-2 border-sky-600">
                      <h4 className="text-xs font-bold text-[#9b1c36] mb-1.5">
                        {stratName.replace('|', ' — ')}
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {prakarsaList.map(prakarsa => (
                          <li key={prakarsa} className="flex items-start gap-1.5">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>{prakarsa.replace('|', ' — ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

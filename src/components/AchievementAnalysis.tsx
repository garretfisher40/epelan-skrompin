// src/components/AchievementAnalysis.tsx
import React, { useState, useMemo } from 'react';
import { PlanRecord, PdcaStage } from '../types.ts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface AchievementAnalysisProps {
  plans: PlanRecord[];
  onOpenPdca?: (plan: PlanRecord, stage: PdcaStage) => void;
}

const STAGE_COLORS: Record<string, string> = {
  PLAN: '#2563eb', // Blue
  DO: '#059669',   // Emerald
  CHECK: '#d97706', // Amber
  ACT: '#e11d48',   // Rose
  SELESAI: '#7c3aed', // Violet
};

const STAGE_LABELS: Record<string, string> = {
  PLAN: 'Fasa 1: Perancangan (Plan)',
  DO: 'Fasa 2: Pelaksanaan (Do)',
  CHECK: 'Fasa 3: Pemantauan (Check)',
  ACT: 'Fasa 4: Penambahbaikan (Act)',
  SELESAI: 'Selesai',
};

export const AchievementAnalysis: React.FC<AchievementAnalysisProps> = ({
  plans,
  onOpenPdca,
}) => {
  const [activeView, setActiveView] = useState<'plans' | 'units' | 'stages'>('plans');
  const [selectedUnit, setSelectedUnit] = useState<string>('Semua');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Filter plans based on selected unit
  const filteredPlans = useMemo(() => {
    if (selectedUnit === 'Semua') return plans;
    return plans.filter((p) => p.unit === selectedUnit);
  }, [plans, selectedUnit]);

  // Overall Statistics Calculations
  const stats = useMemo(() => {
    const total = plans.length;
    if (total === 0) {
      return {
        total: 0,
        averageProgress: 0,
        highAchievers: 0,
        midAchievers: 0,
        earlyStage: 0,
        stageCounts: { PLAN: 0, DO: 0, CHECK: 0, ACT: 0, SELESAI: 0 },
      };
    }

    const totalProgress = plans.reduce((acc, p) => acc + (p.pdcaProgress || 0), 0);
    const averageProgress = Math.round(totalProgress / total);

    const highAchievers = plans.filter((p) => (p.pdcaProgress || 0) >= 75).length;
    const midAchievers = plans.filter((p) => (p.pdcaProgress || 0) >= 50 && (p.pdcaProgress || 0) < 75).length;
    const earlyStage = plans.filter((p) => (p.pdcaProgress || 0) < 50).length;

    const stageCounts: Record<string, number> = { PLAN: 0, DO: 0, CHECK: 0, ACT: 0, SELESAI: 0 };
    plans.forEach((p) => {
      const stage = p.pdcaStage || 'PLAN';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    return {
      total,
      averageProgress,
      highAchievers,
      midAchievers,
      earlyStage,
      stageCounts,
    };
  }, [plans]);

  // Data for View 1: Kemajuan Setiap Pelan
  const planChartData = useMemo(() => {
    return filteredPlans.map((p, index) => {
      // Shorten name for chart X-axis
      const shortTitle = p.program.length > 22 ? p.program.substring(0, 20) + '...' : p.program;
      return {
        id: p.planId,
        fullTitle: p.program,
        shortTitle: `${index + 1}. ${shortTitle}`,
        progress: p.pdcaProgress || 25,
        stage: p.pdcaStage || 'PLAN',
        unit: p.unit,
        panitia: p.panitia,
        color: STAGE_COLORS[p.pdcaStage || 'PLAN'] || '#2563eb',
        plan: p,
      };
    });
  }, [filteredPlans]);

  // Data for View 2: Purata Kemajuan Mengikut Unit
  const unitChartData = useMemo(() => {
    const units = ['Unit Kurikulum', 'Unit Hal Ehwal Murid (HEM)', 'Unit Kokurikulum', 'Unit Pentadbiran'];
    return units
      .map((unit) => {
        const unitPlans = plans.filter((p) => p.unit === unit);
        const count = unitPlans.length;
        const avg = count > 0 ? Math.round(unitPlans.reduce((sum, p) => sum + (p.pdcaProgress || 0), 0) / count) : 0;
        const planStageCount = unitPlans.filter((p) => p.pdcaStage === 'PLAN').length;
        const doStageCount = unitPlans.filter((p) => p.pdcaStage === 'DO').length;
        const checkStageCount = unitPlans.filter((p) => p.pdcaStage === 'CHECK').length;
        const actStageCount = unitPlans.filter((p) => p.pdcaStage === 'ACT').length;

        const displayName = unit === 'Unit Hal Ehwal Murid (HEM)' ? 'HEM' : unit.replace('Unit ', '');

        return {
          unit: displayName,
          fullName: unit,
          totalPlans: count,
          averageProgress: avg,
          PLAN: planStageCount,
          DO: doStageCount,
          CHECK: checkStageCount,
          ACT: actStageCount,
        };
      })
      .filter((u) => u.totalPlans > 0);
  }, [plans]);

  // Data for View 3: Taburan Mengikut Fasa PDCA
  const stageChartData = useMemo(() => {
    const stages: PdcaStage[] = ['PLAN', 'DO', 'CHECK', 'ACT'];
    return stages.map((stage) => {
      const count = stats.stageCounts[stage] || 0;
      const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      return {
        stage,
        name: STAGE_LABELS[stage],
        count,
        percentage,
        color: STAGE_COLORS[stage],
      };
    });
  }, [stats]);

  // Custom Tooltip for Plan Chart
  const CustomPlanTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs space-y-2 backdrop-blur-xs">
          <p className="font-bold text-sm text-sky-300 leading-snug">{data.fullTitle}</p>
          <div className="space-y-1 text-slate-300 text-[11px] pt-1 border-t border-slate-700/80">
            <p className="flex justify-between">
              <span className="text-slate-400">Unit:</span>
              <span className="font-semibold text-slate-200">{data.unit}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Panitia:</span>
              <span className="font-semibold text-slate-200">{data.panitia}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-slate-400">Fasa PDCA:</span>
              <span
                className="font-bold px-1.5 py-0.5 rounded text-[10px] text-white"
                style={{ backgroundColor: data.color }}
              >
                {data.stage}
              </span>
            </p>
            <p className="flex justify-between items-center pt-1 border-t border-slate-800">
              <span className="text-slate-400">Peratus Kemajuan:</span>
              <span className="text-sm font-extrabold text-emerald-400">{data.progress}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Unit Chart
  const CustomUnitTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs space-y-2 backdrop-blur-xs">
          <p className="font-bold text-sm text-sky-300 leading-snug">{data.fullName}</p>
          <div className="space-y-1.5 text-slate-300 text-[11px] pt-1 border-t border-slate-700">
            <p className="flex justify-between">
              <span className="text-slate-400">Bilangan Pelan:</span>
              <span className="font-bold text-white">{data.totalPlans} program</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Purata Kemajuan:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{data.averageProgress}%</span>
            </p>
            <div className="pt-1.5 border-t border-slate-800 grid grid-cols-2 gap-1 text-[10px]">
              <span className="text-blue-300">PLAN: {data.PLAN}</span>
              <span className="text-emerald-300">DO: {data.DO}</span>
              <span className="text-amber-300">CHECK: {data.CHECK}</span>
              <span className="text-rose-300">ACT: {data.ACT}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Stage Chart
  const CustomStageTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs space-y-1.5 backdrop-blur-xs">
          <p className="font-bold text-sm text-sky-300">{data.name}</p>
          <p className="flex justify-between text-slate-300 text-[11px]">
            <span className="text-slate-400">Bilangan Pelan:</span>
            <span className="font-bold text-white">{data.count} pelan</span>
          </p>
          <p className="flex justify-between text-slate-300 text-[11px]">
            <span className="text-slate-400">Nisbah Keseluruhan:</span>
            <span className="font-extrabold text-emerald-400">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all">
      {/* Module Header Bar */}
      <div className="bg-linear-to-r from-[#17375e] to-[#1e487d] text-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <TrendingUp className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0">
                  Modul Analisis Pencapaian & Statistik Kemajuan PDCA
                </h3>
              </div>
              <p className="text-xs text-sky-100/80 mt-0.5">
                Pemantauan visual peratus pencapaian program sekolah berteraskan kitaran Plan-Do-Check-Act (PDCA).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Selector Buttons */}
            <div className="flex items-center bg-black/20 p-1 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => setActiveView('plans')}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'plans'
                    ? 'bg-white text-[#17375e] shadow-xs font-bold'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Setiap Pelan</span>
              </button>
              <button
                onClick={() => setActiveView('units')}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'units'
                    ? 'bg-white text-[#17375e] shadow-xs font-bold'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mengikut Unit</span>
              </button>
              <button
                onClick={() => setActiveView('stages')}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'stages'
                    ? 'bg-white text-[#17375e] shadow-xs font-bold'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fasa PDCA</span>
              </button>
            </div>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
              title={isCollapsed ? 'Kembangkan Modul Analisis' : 'Lipat Modul Analisis'}
              aria-label={isCollapsed ? 'Kembangkan Modul Analisis' : 'Lipat Modul Analisis'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Top KPI Metrics inside Header */}
        {!isCollapsed && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/10">
              <span className="text-sky-200 block text-[11px] font-medium">Purata Pencapaian PDCA</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{stats.averageProgress}%</span>
                <span className="text-[10px] text-emerald-300 font-bold">
                  {stats.averageProgress >= 75 ? 'Cemerlang' : stats.averageProgress >= 50 ? 'Memuaskan' : 'Perlu Tindakan'}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/10">
              <span className="text-sky-200 block text-[11px] font-medium">Pencapaian Tinggi (≥ 75%)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-300">{stats.highAchievers}</span>
                <span className="text-[10px] text-sky-200">daripada {stats.total} pelan</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/10">
              <span className="text-sky-200 block text-[11px] font-medium">Dalam Pelaksanaan (DO / CHECK)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-300">
                  {(stats.stageCounts.DO || 0) + (stats.stageCounts.CHECK || 0)}
                </span>
                <span className="text-[10px] text-sky-200">pelan aktif</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/10">
              <span className="text-sky-200 block text-[11px] font-medium">Peringkat Awal (PLAN: 25%)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-sky-300">{stats.stageCounts.PLAN || 0}</span>
                <span className="text-[10px] text-sky-200">pelan dirangka</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Body */}
      {!isCollapsed && (
        <div className="p-5 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Penapis Unit:
              </span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                <option value="Semua">Semua Unit ({plans.length})</option>
                <option value="Unit Kurikulum">Unit Kurikulum</option>
                <option value="Unit Hal Ehwal Murid (HEM)">Unit Hal Ehwal Murid (HEM)</option>
                <option value="Unit Kokurikulum">Unit Kokurikulum</option>
                <option value="Unit Pentadbiran">Unit Pentadbiran</option>
              </select>
            </div>

            {/* Stage Legend Indicators */}
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="text-slate-500 font-medium">Petunjuk Fasa:</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> PLAN (25%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> DO (50%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> CHECK (75%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> ACT (100%)
              </span>
            </div>
          </div>

          {/* VIEW 1: KEMAJUAN SETIAP PELAN (RECHARTS BAR CHART) */}
          {activeView === 'plans' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-sky-700" />
                    Statistik Peratus Kemajuan PDCA Bagi Setiap Pelan Operasi
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Garis putus-putus merah menandakan penanda aras sasaran pencapaian optimum (80%).
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {planChartData.length} Pelan Dipaparkan
                </span>
              </div>

              {planChartData.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  Tiada pelan operasi ditemui untuk penapis unit ini.
                </div>
              ) : (
                <div className="h-[340px] w-full bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={planChartData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 65 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="shortTitle"
                        angle={-25}
                        textAnchor="end"
                        interval={0}
                        tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                        height={60}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        unit="%"
                        tickCount={6}
                      />
                      <Tooltip content={<CustomPlanTooltip />} />
                      <ReferenceLine
                        y={80}
                        stroke="#e11d48"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Sasaran 80%',
                          position: 'insideTopRight',
                          fill: '#e11d48',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />
                      <Bar
                        dataKey="progress"
                        name="Kemajuan (%)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                      >
                        {planChartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: PURATA MENGIKUT UNIT (RECHARTS BAR CHART) */}
          {activeView === 'units' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-700" />
                    Perbandingan Purata Pencapaian PDCA Mengikut Unit Sekolah
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Analisis perbandingan prestasi antara Unit Kurikulum, HEM, Kokurikulum, dan Pentadbiran.
                  </p>
                </div>
              </div>

              {unitChartData.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Tiada data unit tersedia.
                </div>
              ) : (
                <div className="h-[340px] w-full bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={unitChartData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="unit"
                        tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        unit="%"
                        tickCount={6}
                      />
                      <Tooltip content={<CustomUnitTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                        formatter={(value) => <span className="text-slate-700 font-medium">{value}</span>}
                      />
                      <ReferenceLine
                        y={80}
                        stroke="#e11d48"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Penanda Aras 80%',
                          position: 'insideTopRight',
                          fill: '#e11d48',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />
                      <Bar
                        dataKey="averageProgress"
                        name="Purata Kemajuan (%)"
                        fill="#17375e"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={55}
                      >
                        {unitChartData.map((_, idx) => {
                          const colors = ['#17375e', '#0284c7', '#059669', '#7c3aed'];
                          return <Cell key={`unit-cell-${idx}`} fill={colors[idx % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: TABURAN MENGIKUT FASA PDCA (RECHARTS BAR CHART) */}
          {activeView === 'stages' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-700" />
                    Taburan Bilangan Pelan Mengikut Fasa Kitaran PDCA
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bilangan dan pecahan pelan yang kini berada dalam fasa Plan, Do, Check, atau Act.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-[320px] bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stageChartData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="stage"
                        tick={{ fontSize: 12, fill: '#334155', fontWeight: 700 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        unit=" pelan"
                      />
                      <Tooltip content={<CustomStageTooltip />} />
                      <Bar
                        dataKey="count"
                        name="Bilangan Pelan"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      >
                        {stageChartData.map((entry, idx) => (
                          <Cell key={`stage-cell-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Stage Breakdown Cards */}
                <div className="space-y-2.5 flex flex-col justify-center">
                  {stageChartData.map((item) => (
                    <div
                      key={item.stage}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-md inline-block shadow-2xs"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">{item.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {item.stage === 'PLAN' && 'Perancangan & penyediaan kertas kerja'}
                            {item.stage === 'DO' && 'Pelaksanaan aktiviti & program berfasa'}
                            {item.stage === 'CHECK' && 'Semakan KPI, penilaian & pemantauan'}
                            {item.stage === 'ACT' && 'Intervensi & penambahbaikan berterusan'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-800 block">{item.count}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Interactive Table of Top Plans & Status */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Senarai Ringkas Prestasi Pelan ({filteredPlans.length} Program)
              </span>
              <span className="text-[11px] text-slate-500">
                Klik fasa untuk semak atau kemas kini evidens PDCA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredPlans.slice(0, 6).map((plan) => (
                <div
                  key={plan.planId}
                  className="p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold text-slate-500 truncate">{plan.panitia}</span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: STAGE_COLORS[plan.pdcaStage || 'PLAN'] }}
                      >
                        {plan.pdcaStage || 'PLAN'}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 line-clamp-1 text-xs" title={plan.program}>
                      {plan.program}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Kemajuan:</span>
                      <span className="font-extrabold text-slate-800">{plan.pdcaProgress || 25}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${plan.pdcaProgress || 25}%`,
                          backgroundColor: STAGE_COLORS[plan.pdcaStage || 'PLAN'],
                        }}
                      />
                    </div>
                    {onOpenPdca && (
                      <button
                        onClick={() => onOpenPdca(plan, plan.pdcaStage || 'PLAN')}
                        className="mt-2 w-full text-center text-[10px] font-bold text-sky-700 hover:text-sky-900 hover:underline pt-0.5"
                      >
                        Urus Fasa PDCA →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

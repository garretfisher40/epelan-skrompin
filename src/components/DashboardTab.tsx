// src/components/DashboardTab.tsx
import React, { useState, useRef, useMemo } from 'react';
import { PlanRecord, DatabaseFile, PdcaStage } from '../types.ts';
import { AchievementAnalysis } from './AchievementAnalysis.tsx';
import { 
  Search, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Edit3, 
  FolderOpen, 
  ArrowUpRight, 
  BarChart2, 
  X, 
  Filter, 
  RotateCcw,
  Eye,
  Download,
  Image as ImageIcon,
  Grid,
  List,
  ArrowUpDown,
  Layers,
  HardDrive,
  ExternalLink,
  CloudUpload,
  Loader2
} from 'lucide-react';

interface DashboardTabProps {
  plans: PlanRecord[];
  files: DatabaseFile[];
  onEdit: (plan: PlanRecord) => void;
  onDuplicate: (plan: PlanRecord) => void;
  onDelete: (planId: string) => void;
  onOpenPdca: (plan: PlanRecord, stage: PdcaStage) => void;
  onUploadFile: (file: File, category?: string, planId?: string) => Promise<any>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onSyncFileToDrive?: (file: DatabaseFile) => Promise<boolean>;
  onSyncAllToDrive?: () => Promise<void>;
  isSyncingDrive?: boolean;
  driveAccessToken?: string | null;
  onLoginGoogle?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  plans,
  files,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenPdca,
  onUploadFile,
  onDeleteFile,
  onSyncFileToDrive,
  onSyncAllToDrive,
  isSyncingDrive = false,
  driveAccessToken,
  onLoginGoogle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Semua');
  const [previewFile, setPreviewFile] = useState<DatabaseFile | null>(null);
  const [inlinePreviewId, setInlinePreviewId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File repository advanced filter states
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'pdf' | 'image' | 'doc' | 'other'>('all');
  const [fileCategoryFilter, setFileCategoryFilter] = useState<string>('all');
  const [filePlanFilter, setFilePlanFilter] = useState<string>('all');
  const [fileSortBy, setFileSortBy] = useState<'newest' | 'oldest' | 'size_desc' | 'size_asc' | 'name'>('newest');
  const [fileViewMode, setFileViewMode] = useState<'grid' | 'list'>('grid');

  const getFileTypeCategory = (file: DatabaseFile): 'image' | 'pdf' | 'doc' | 'other' => {
    const type = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    if (type.startsWith('image/') || file.data?.startsWith('data:image/') || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)) return 'image';
    if (type.includes('pdf') || file.data?.startsWith('data:application/pdf') || name.endsWith('.pdf')) return 'pdf';
    if (
      type.includes('word') ||
      type.includes('document') ||
      type.includes('sheet') ||
      type.includes('excel') ||
      type.includes('presentation') ||
      type.includes('text') ||
      /\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf|csv)$/i.test(name)
    ) return 'doc';
    return 'other';
  };

  const fileTypeCounts = useMemo(() => {
    const counts = { all: files.length, pdf: 0, image: 0, doc: 0, other: 0 };
    files.forEach((f) => {
      const cat = getFileTypeCategory(f);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [files]);

  const uniqueFileCategories = useMemo(() => {
    const set = new Set<string>();
    files.forEach((f) => {
      if (f.category && !f.category.startsWith('evidens') && f.category !== 'dashboard') {
        set.add(f.category);
      }
    });
    return Array.from(set);
  }, [files]);

  const formatFileCategory = (category?: string) => {
    if (!category) return 'Dokumen';
    if (category === 'dashboard') return 'Papan Pemuka';
    if (category === 'evidens') return 'Evidens PDCA';
    if (category === 'evidens_plan') return 'Evidens (PLAN)';
    if (category === 'evidens_do') return 'Evidens (DO)';
    if (category === 'evidens_check') return 'Evidens (CHECK)';
    if (category === 'evidens_act') return 'Evidens (ACT)';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const hasActiveFileFilters = useMemo(() => {
    return (
      fileSearch.trim() !== '' ||
      fileTypeFilter !== 'all' ||
      fileCategoryFilter !== 'all' ||
      filePlanFilter !== 'all' ||
      fileSortBy !== 'newest'
    );
  }, [fileSearch, fileTypeFilter, fileCategoryFilter, filePlanFilter, fileSortBy]);

  const resetFileFilters = () => {
    setFileSearch('');
    setFileTypeFilter('all');
    setFileCategoryFilter('all');
    setFilePlanFilter('all');
    setFileSortBy('newest');
  };

  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        // 1. Text Search
        if (fileSearch.trim()) {
          const query = fileSearch.toLowerCase();
          const matchName = file.name.toLowerCase().includes(query);
          const matchUploader = (file.uploadedBy || '').toLowerCase().includes(query);
          const associatedPlan = file.planId ? plans.find((p) => p.planId === file.planId) : null;
          const matchPlan = associatedPlan?.program.toLowerCase().includes(query) || false;
          if (!matchName && !matchUploader && !matchPlan) return false;
        }

        // 2. File Type Filter
        if (fileTypeFilter !== 'all') {
          if (getFileTypeCategory(file) !== fileTypeFilter) return false;
        }

        // 3. Category Filter
        if (fileCategoryFilter !== 'all') {
          if (fileCategoryFilter === 'evidens') {
            if (!file.category || !file.category.toLowerCase().startsWith('evidens')) return false;
          } else if ((file.category || 'dashboard') !== fileCategoryFilter) {
            return false;
          }
        }

        // 4. Plan Filter
        if (filePlanFilter !== 'all') {
          if (filePlanFilter === 'unlinked') {
            if (file.planId) return false;
          } else if (file.planId !== filePlanFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (fileSortBy === 'newest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }
        if (fileSortBy === 'oldest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        }
        if (fileSortBy === 'size_desc') {
          return (b.size || 0) - (a.size || 0);
        }
        if (fileSortBy === 'size_asc') {
          return (a.size || 0) - (b.size || 0);
        }
        if (fileSortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [files, fileSearch, fileTypeFilter, fileCategoryFilter, filePlanFilter, fileSortBy, plans]);

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      (p.program || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.panitia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.unit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.isu || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = unitFilter === 'Semua' || p.unit === unitFilter;
    return matchesSearch && matchesUnit;
  });

  const handleFileUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await onUploadFile(file, 'dashboard');
    } catch {
      alert('Ralat semasa memuat naik fail.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getStageBadgeColor = (plan: PlanRecord, stage: PdcaStage) => {
    let pdcaData: any = {};
    try {
      if (plan.pdcaData) pdcaData = JSON.parse(plan.pdcaData);
    } catch {}

    const stageStatus = pdcaData[stage]?.status;
    if (stageStatus === 'selesai') {
      return 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700';
    }
    if (stageStatus === 'sedang_berjalan' || plan.pdcaStage === stage) {
      if (stage === 'PLAN') return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700 shadow-xs ring-2 ring-blue-300';
      if (stage === 'DO') return 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 shadow-xs ring-2 ring-emerald-300';
      if (stage === 'CHECK') return 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600 shadow-xs ring-2 ring-amber-300';
      if (stage === 'ACT') return 'bg-rose-600 text-white hover:bg-rose-700 border-rose-700 shadow-xs ring-2 ring-rose-300';
    }
    if (stageStatus === 'perlu_tindakan') {
      return 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200';
    }
    return 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300';
  };

  return (
    <div className="max-w-[1600px] mx-auto p-5 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#17375e] m-0 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-sky-700" />
              Papan Pemuka Penjejakan Kemajuan (PDCA Dashboard)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pantau status pelaksanaan projek, kemajuan fasa PDCA, dan urus fail evidens dalam pangkalan data.
            </p>
          </div>

          {/* USER REQUIREMENT: BUTTON UPLOAD FILE ON DASHBOARD TAB */}
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUploadChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-[#21824c] hover:bg-[#1b6b3e] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Memuat Naik...' : 'Muat Naik Fail ke Database'}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <span className="text-slate-500 block font-medium">Jumlah Pelan Operasi</span>
            <span className="text-xl font-black text-slate-800">{plans.length}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <span className="text-blue-700 block font-medium">Fasa PLAN / DO</span>
            <span className="text-xl font-black text-blue-900">
              {plans.filter(p => p.pdcaStage === 'PLAN' || p.pdcaStage === 'DO').length}
            </span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <span className="text-amber-700 block font-medium">Fasa CHECK / ACT</span>
            <span className="text-xl font-black text-amber-900">
              {plans.filter(p => p.pdcaStage === 'CHECK' || p.pdcaStage === 'ACT').length}
            </span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
            <span className="text-emerald-700 block font-medium">Fail & Evidens Tersimpan</span>
            <span className="text-xl font-black text-emerald-900">{files.length}</span>
          </div>
        </div>
      </div>

      {/* Modul Analisis Pencapaian PDCA (Recharts) */}
      <AchievementAnalysis plans={plans} onOpenPdca={onOpenPdca} />

      {/* Search and Unit Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama program, unit, panitia, atau isu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/60 focus:bg-white transition font-medium text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition"
                title="Kosongkan carian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Unit Dropdown Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-700">Tapis Unit:</span>
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="border border-slate-300 rounded-lg py-2 px-3 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
            >
              <option value="Semua">Semua Unit ({plans.length})</option>
              <option value="Unit Kurikulum">Unit Kurikulum ({plans.filter(p => p.unit === 'Unit Kurikulum').length})</option>
              <option value="Unit Hal Ehwal Murid (HEM)">Unit Hal Ehwal Murid ({plans.filter(p => p.unit === 'Unit Hal Ehwal Murid (HEM)').length})</option>
              <option value="Unit Kokurikulum">Unit Kokurikulum ({plans.filter(p => p.unit === 'Unit Kokurikulum').length})</option>
              <option value="Unit Pentadbiran">Unit Pentadbiran ({plans.filter(p => p.unit === 'Unit Pentadbiran').length})</option>
            </select>
          </div>
        </div>

        {/* Quick Unit Chips & Search Result Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {['Semua', 'Unit Kurikulum', 'Unit Hal Ehwal Murid (HEM)', 'Unit Kokurikulum', 'Unit Pentadbiran'].map((u) => {
              const count = u === 'Semua' ? plans.length : plans.filter(p => p.unit === u).length;
              const isSelected = unitFilter === u;
              return (
                <button
                  key={u}
                  onClick={() => setUnitFilter(u)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#17375e] text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <span>{u === 'Unit Hal Ehwal Murid (HEM)' ? 'HEM' : u.replace('Unit ', '')}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results stats */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              Menunjukkan <strong className="text-slate-800">{filteredPlans.length}</strong> daripada {plans.length} pelan
            </span>
            {(searchTerm || unitFilter !== 'Semua') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setUnitFilter('Semua');
                }}
                className="text-[11px] text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Set Semula
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table with 4 PDCA Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#17375e] text-white border-b border-slate-700 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-10 text-center">Bil</th>
                <th className="py-3 px-3">Unit & Panitia</th>
                <th className="py-3 px-4 min-w-[200px]">Program / Projek</th>
                <th className="py-3 px-3 text-center min-w-[260px]">
                  PENJEJAKAN PDCA (Klik butang untuk kemas kini)
                </th>
                <th className="py-3 px-3 text-center min-w-[110px]">Kemajuan</th>
                <th className="py-3 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((d, index) => (
                  <tr key={d.planId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#17375e] block">{d.unit}</span>
                      <span className="text-slate-500 text-[11px] block">{d.panitia} ({d.tahun})</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{d.program}</span>
                      <span className="text-slate-500 text-[10px] line-clamp-1 italic">
                        {d.isu || 'Tiada isu ditetapkan'}
                      </span>
                    </td>

                    {/* USER REQUIREMENT: 4 BUTTONS (PLAN, DO, CHECK, ACT) */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenPdca(d, 'PLAN')}
                          title="Fasa 1: PLAN (Perancangan)"
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold border transition shadow-2xs ${getStageBadgeColor(
                            d,
                            'PLAN'
                          )}`}
                        >
                          PLAN
                        </button>
                        <button
                          onClick={() => onOpenPdca(d, 'DO')}
                          title="Fasa 2: DO (Pelaksanaan)"
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold border transition shadow-2xs ${getStageBadgeColor(
                            d,
                            'DO'
                          )}`}
                        >
                          DO
                        </button>
                        <button
                          onClick={() => onOpenPdca(d, 'CHECK')}
                          title="Fasa 3: CHECK (Pemantauan & Penilaian)"
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold border transition shadow-2xs ${getStageBadgeColor(
                            d,
                            'CHECK'
                          )}`}
                        >
                          CHECK
                        </button>
                        <button
                          onClick={() => onOpenPdca(d, 'ACT')}
                          title="Fasa 4: ACT (Tindakan Penambahbaikan)"
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold border transition shadow-2xs ${getStageBadgeColor(
                            d,
                            'ACT'
                          )}`}
                        >
                          ACT
                        </button>
                      </div>
                      {files.filter((f) => f.planId === d.planId).length > 0 && (
                        <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50 py-0.5 px-2 rounded-md border border-emerald-200/70 max-w-[210px] mx-auto shadow-2xs">
                          <FolderOpen className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{files.filter((f) => f.planId === d.planId).length} fail evidens tersimpan</span>
                        </div>
                      )}
                    </td>

                    {/* Progress Bar Column */}
                    <td className="py-3 px-3">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            (d.pdcaProgress || 25) >= 100
                              ? 'bg-purple-600'
                              : (d.pdcaProgress || 25) >= 70
                              ? 'bg-emerald-600'
                              : (d.pdcaProgress || 25) >= 40
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${d.pdcaProgress || 25}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 text-center block mt-1">
                        {d.pdcaProgress || 25}% • {d.pdcaStage || 'PLAN'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(d)}
                          className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-md transition"
                          title="Edit Pelan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicate(d)}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                          title="Salin Pelan"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(d.planId)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="Padam Pelan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <div className="font-bold text-slate-700">
                        {searchTerm || unitFilter !== 'Semua'
                          ? 'Tiada pelan operasi yang sepadan dengan carian.'
                          : 'Tiada pelan operasi ditemui.'}
                      </div>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {searchTerm || unitFilter !== 'Semua'
                          ? `Tiada rekod ditemukan untuk carian "${searchTerm || unitFilter}". Sila cuba kata kunci lain atau set semula penapis.`
                          : 'Sila klik butang ＋ Baharu di atas untuk memulakan pengisian pelan operasi baharu.'}
                      </p>
                      {(searchTerm || unitFilter !== 'Semua') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setUnitFilter('Semua');
                          }}
                          className="mt-2 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Set Semula Carian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uploaded Files Database Section with Advanced Filtering */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-sky-700" />
                Repositori Fail & Evidens Pangkalan Data
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md border border-sky-200">
                {filteredFiles.length} / {files.length} fail
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Fail, dokumen, gambar dan evidens tersimpan secara kekal dalam database Cloud SQL mengikut unit dan pelan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 bg-[#21824c] hover:bg-[#1b6b3e] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Memuat Naik...' : 'Tambah Fail'}</span>
            </button>
          </div>
        </div>

        {/* Google Drive Folder Official Integration Card */}
        <div className="bg-gradient-to-r from-[#0f2744] via-[#153b68] to-[#1a4a82] text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs border border-sky-600/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M12.01 1.5l-6.8 11.78h13.6z" />
                <path fill="#FBBC05" d="M5.21 13.28L1.81 19.16a2 2 0 0 0 .73 2.73l6.8-11.78z" />
                <path fill="#34A853" d="M18.81 13.28l-3.4 5.88h-6.8l3.4-5.88z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Google Drive Sekolah (SK Rompin 2026)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Folder Dihubungkan
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                Pautan folder: <a href="https://drive.google.com/drive/folders/1ghjXh38jLhTXsJKufUNlTUYaFdy5tg7h?usp=drive_link" target="_blank" rel="noopener noreferrer" className="underline font-mono text-[11px] text-sky-200 hover:text-white">1ghjXh38jLhTXsJKufUNlTUYaFdy5tg7h</a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://drive.google.com/drive/folders/1ghjXh38jLhTXsJKufUNlTUYaFdy5tg7h?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white text-sky-950 hover:bg-sky-50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-700" />
              <span>Buka Folder di Google Drive</span>
            </a>

            {onSyncAllToDrive && (
              <button
                type="button"
                onClick={onSyncAllToDrive}
                disabled={isSyncingDrive}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSyncingDrive ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyegerak...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>Segerakkan Semua Fail ke Drive</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 1. Quick File Type Filter Tabs (Zero-pill design, clean segmented buttons) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFileTypeFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                fileTypeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Semua Fail</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-200 text-slate-700 font-bold">
                {fileTypeCounts.all}
              </span>
            </button>

            <button
              onClick={() => setFileTypeFilter('pdf')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                fileTypeFilter === 'pdf'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Dokumen PDF</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-800 font-bold">
                {fileTypeCounts.pdf}
              </span>
            </button>

            <button
              onClick={() => setFileTypeFilter('image')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                fileTypeFilter === 'image'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Gambar & Evidens</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 font-bold">
                {fileTypeCounts.image}
              </span>
            </button>

            <button
              onClick={() => setFileTypeFilter('doc')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                fileTypeFilter === 'doc'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Office & Word/Excel</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-blue-100 text-blue-800 font-bold">
                {fileTypeCounts.doc}
              </span>
            </button>

            {fileTypeCounts.other > 0 && (
              <button
                onClick={() => setFileTypeFilter('other')}
                className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  fileTypeFilter === 'other'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>Lain-lain</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-200 text-slate-700 font-bold">
                  {fileTypeCounts.other}
                </span>
              </button>
            )}
          </div>

          {/* View Mode (Grid vs List) Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFileViewMode('grid')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                fileViewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Paparan Kad Grid"
              aria-label="Paparan Kad Grid"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFileViewMode('list')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                fileViewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Paparan Senarai / Jadual"
              aria-label="Paparan Senarai / Jadual"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Detailed Filtering & Search Bar */}
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Search file by name */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari fail atau nama program..."
                value={fileSearch}
                onChange={(e) => setFileSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-white font-medium text-slate-800"
              />
              {fileSearch && (
                <button
                  onClick={() => setFileSearch('')}
                  className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  title="Padam carian"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter by Category */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 shrink-0">Kategori:</span>
              <select
                value={fileCategoryFilter}
                onChange={(e) => setFileCategoryFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg py-1.5 px-2.5 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="all">Semua Kategori</option>
                <option value="dashboard">Papan Pemuka / Umum</option>
                <option value="evidens">Evidens PDCA (Semua Fasa)</option>
                <option value="evidens_plan">Evidens Fasa PLAN</option>
                <option value="evidens_do">Evidens Fasa DO</option>
                <option value="evidens_check">Evidens Fasa CHECK</option>
                <option value="evidens_act">Evidens Fasa ACT</option>
                {uniqueFileCategories
                  .filter((c) => c !== 'dashboard' && !c.startsWith('evidens'))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {formatFileCategory(cat)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Filter by Associated Plan */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 shrink-0">Pelan:</span>
              <select
                value={filePlanFilter}
                onChange={(e) => setFilePlanFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg py-1.5 px-2.5 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800 truncate"
              >
                <option value="all">Semua Pelan ({files.length})</option>
                <option value="unlinked">Fail Bebas (Tiada Pelan)</option>
                {plans.map((p) => {
                  const planFileCount = files.filter((f) => f.planId === p.planId).length;
                  return (
                    <option key={p.planId} value={p.planId}>
                      {p.program} ({planFileCount})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 shrink-0">Susun:</span>
              <select
                value={fileSortBy}
                onChange={(e: any) => setFileSortBy(e.target.value)}
                className="w-full border border-slate-300 rounded-lg py-1.5 px-2.5 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="newest">Terkini Dimuat Naik</option>
                <option value="oldest">Terawal Dimuat Naik</option>
                <option value="size_desc">Saiz Fail (Besar ke Kecil)</option>
                <option value="size_asc">Saiz Fail (Kecil ke Besar)</option>
                <option value="name">Nama Fail (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators & Reset Button */}
          {hasActiveFileFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
              <div className="flex flex-wrap items-center gap-2 text-slate-500">
                <span>Penapis Aktif:</span>
                {fileTypeFilter !== 'all' && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
                    Jenis: {fileTypeFilter.toUpperCase()}
                  </span>
                )}
                {fileCategoryFilter !== 'all' && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
                    Kategori: {fileCategoryFilter}
                  </span>
                )}
                {filePlanFilter !== 'all' && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium truncate max-w-xs">
                    Pelan: {filePlanFilter === 'unlinked' ? 'Fail Bebas' : plans.find((p) => p.planId === filePlanFilter)?.program || filePlanFilter}
                  </span>
                )}
                {fileSearch && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
                    Kata kunci: "{fileSearch}"
                  </span>
                )}
              </div>

              <button
                onClick={resetFileFilters}
                className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Set Semula Saringan
              </button>
            </div>
          )}
        </div>

        {/* 3. Files Display (Grid or List View) */}
        {filteredFiles.length > 0 ? (
          fileViewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFiles.map((file) => {
                const isImage = file.type?.startsWith('image/') || file.data?.startsWith('data:image/');
                const isPdf = file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf');
                const associatedPlan = file.planId ? plans.find((p) => p.planId === file.planId) : null;

                return (
                  <div
                    key={file.fileId}
                    className="border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-sky-300 hover:shadow-xs transition bg-slate-50/60 group"
                  >
                    <div className="flex items-start gap-3">
                      {isImage ? (
                        <div
                          onClick={() => setPreviewFile(file)}
                          className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 cursor-pointer hover:opacity-90 relative"
                          title="Klik untuk pratonton gambar"
                        >
                          <img
                            src={file.data}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      ) : (
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                          isPdf ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {isPdf ? <FileText className="w-5 h-5 text-rose-600" /> : <FileText className="w-5 h-5" />}
                        </div>
                      )}

                      <div className="overflow-hidden flex-1">
                        <button
                          type="button"
                          onClick={() => setInlinePreviewId(prev => prev === file.fileId ? null : file.fileId)}
                          className="font-bold text-xs text-slate-800 hover:text-sky-700 hover:underline truncate block text-left w-full cursor-pointer"
                          title={`Klik untuk lihat pratonton fail ${file.name}`}
                        >
                          {file.name}
                        </button>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                          <span className="font-semibold text-slate-700">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          <span>·</span>
                          <span className="text-slate-700 font-semibold bg-slate-200/60 px-1.5 py-0.2 rounded">
                            {formatFileCategory(file.category)}
                          </span>
                          {file.createdAt && (
                            <>
                              <span>·</span>
                              <span>{new Date(file.createdAt).toLocaleDateString('ms-MY')}</span>
                            </>
                          )}
                        </div>

                        {/* Associated Plan Title */}
                        {associatedPlan && (
                          <div className="mt-1.5 text-[10px] text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded truncate" title={associatedPlan.program}>
                            Pelan: <span className="font-semibold text-slate-800">{associatedPlan.program}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Direct in-card preview when file name is clicked */}
                    {inlinePreviewId === file.fileId && (
                      <div className="mt-3 pt-3 border-t border-slate-200 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                            <Eye className="w-3.5 h-3.5 text-sky-700" />
                            Pratonton ({isPdf ? 'PDF' : isImage ? 'Gambar' : 'Fail'})
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className="text-[11px] text-sky-700 hover:underline font-semibold cursor-pointer"
                            >
                              Paparan Penuh ↗
                            </button>
                            <button
                              type="button"
                              onClick={() => setInlinePreviewId(null)}
                              className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-100 rounded-lg p-1.5 flex items-center justify-center min-h-[160px] border border-slate-200">
                          {isImage ? (
                            <img
                              src={file.data}
                              alt={file.name}
                              className="max-h-[260px] max-w-full object-contain rounded shadow-xs mx-auto"
                            />
                          ) : isPdf ? (
                            <iframe
                              src={file.data}
                              title={file.name}
                              className="w-full h-[280px] rounded border border-slate-300 bg-white"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <FileText className="w-8 h-8 text-sky-700 mx-auto mb-1" />
                              <p className="font-semibold text-xs text-slate-700">{file.name}</p>
                              <a
                                href={file.data}
                                download={file.name}
                                className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline"
                              >
                                <Download className="w-3 h-3" /> Muat Turun Fail
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons for Each File */}
                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/80 text-xs">
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {file.uploadedBy || 'Warga Sekolah'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-800 bg-white hover:bg-sky-50 border border-slate-200 rounded-md transition cursor-pointer"
                          title="Buka & Pratonton"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>

                        <a
                          href={file.data}
                          download={file.name}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 rounded-md transition cursor-pointer"
                          title="Muat Turun ke Peranti"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Muat Turun</span>
                        </a>

                        {file.driveWebViewLink ? (
                          <a
                            href={file.driveWebViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition cursor-pointer"
                            title="Buka fail di Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                            <span>Drive</span>
                          </a>
                        ) : onSyncFileToDrive ? (
                          <button
                            type="button"
                            onClick={() => onSyncFileToDrive(file)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition cursor-pointer"
                            title="Hantar fail ini ke folder Google Drive"
                          >
                            <CloudUpload className="w-3.5 h-3.5 text-sky-600" />
                            <span>Ke Drive</span>
                          </button>
                        ) : null}

                        <button
                          onClick={() => onDeleteFile(file.fileId)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                          title="Padam Fail"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List / Table View */
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-bold">
                      <th className="py-2.5 px-3">Nama Dokumen</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Pelan Operasi Berkaitan</th>
                      <th className="py-2.5 px-3">Saiz</th>
                      <th className="py-2.5 px-3">Pemuat Naik & Tarikh</th>
                      <th className="py-2.5 px-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFiles.map((file) => {
                      const isImage = file.type?.startsWith('image/') || file.data?.startsWith('data:image/');
                      const isPdf = file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf');
                      const associatedPlan = file.planId ? plans.find((p) => p.planId === file.planId) : null;

                      return (
                        <React.Fragment key={file.fileId}>
                          <tr className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2 max-w-xs">
                              <span className="shrink-0 text-slate-400">
                                {isImage ? <ImageIcon className="w-4 h-4 text-emerald-600" /> : isPdf ? <FileText className="w-4 h-4 text-rose-600" /> : <FileText className="w-4 h-4 text-sky-600" />}
                              </span>
                              <button
                                type="button"
                                onClick={() => setInlinePreviewId(prev => prev === file.fileId ? null : file.fileId)}
                                className="font-semibold text-slate-800 hover:text-sky-700 hover:underline truncate text-left cursor-pointer"
                                title={`Klik untuk pratonton fail ${file.name}`}
                              >
                                {file.name}
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {formatFileCategory(file.category)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {associatedPlan ? (
                              <span className="font-medium text-slate-800 truncate block max-w-xs" title={associatedPlan.program}>
                                {associatedPlan.program}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Fail Umum</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                            {(file.size / 1024).toFixed(1)} KB
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                            <div>{file.uploadedBy || 'Warga Sekolah'}</div>
                            {file.createdAt && (
                              <div className="text-[10px] text-slate-400">
                                {new Date(file.createdAt).toLocaleDateString('ms-MY')}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInlinePreviewId(prev => prev === file.fileId ? null : file.fileId)}
                                className={`px-2 py-1 text-[11px] font-semibold rounded transition cursor-pointer ${
                                  inlinePreviewId === file.fileId 
                                    ? 'bg-sky-700 text-white' 
                                    : 'text-sky-800 bg-white hover:bg-sky-50 border border-slate-200'
                                }`}
                                title="Lihat Pratonton"
                              >
                                {inlinePreviewId === file.fileId ? 'Tutup' : 'Lihat'}
                              </button>
                              <a
                                href={file.data}
                                download={file.name}
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 rounded transition cursor-pointer"
                                title="Muat Turun Fail"
                              >
                                Muat Turun
                              </a>
                              {file.driveWebViewLink ? (
                                <a
                                  href={file.driveWebViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 text-[11px] font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition cursor-pointer flex items-center gap-1"
                                  title="Buka fail di Google Drive"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Drive</span>
                                </a>
                              ) : onSyncFileToDrive ? (
                                <button
                                  type="button"
                                  onClick={() => onSyncFileToDrive(file)}
                                  className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition cursor-pointer flex items-center gap-1"
                                  title="Hantar ke Google Drive"
                                >
                                  <CloudUpload className="w-3 h-3 text-sky-600" />
                                  <span>Ke Drive</span>
                                </button>
                              ) : null}
                              <button
                                onClick={() => onDeleteFile(file.fileId)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                title="Padam Fail"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Direct Table Sub-row Preview */}
                        {inlinePreviewId === file.fileId && (
                          <tr className="bg-slate-50/90 border-b border-slate-200 animate-in fade-in duration-200">
                            <td colSpan={6} className="p-4">
                              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5 text-sky-700" />
                                    Pratonton Terus: <span className="text-sky-900 font-semibold">{file.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                      {isPdf ? 'Dokumen PDF' : isImage ? 'Gambar' : 'Fail Sokongan'}
                                    </span>
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewFile(file)}
                                      className="text-[11px] text-sky-700 hover:underline font-semibold cursor-pointer"
                                    >
                                      Skrin Penuh ↗
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setInlinePreviewId(null)}
                                      className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-center p-2 bg-slate-50 rounded-lg min-h-[220px]">
                                  {isImage ? (
                                    <img
                                      src={file.data}
                                      alt={file.name}
                                      className="max-h-[350px] max-w-full object-contain rounded shadow-xs mx-auto"
                                    />
                                  ) : isPdf ? (
                                    <iframe
                                      src={file.data}
                                      title={file.name}
                                      className="w-full h-[380px] rounded border border-slate-300 bg-white"
                                    />
                                  ) : (
                                    <div className="text-center p-6 bg-white rounded-lg border border-slate-200">
                                      <FileText className="w-10 h-10 text-sky-700 mx-auto mb-2" />
                                      <p className="font-bold text-xs text-slate-800 mb-1">{file.name}</p>
                                      <a
                                        href={file.data}
                                        download={file.name}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                                      >
                                        <Download className="w-3.5 h-3.5" /> Muat Turun Fail
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : files.length > 0 ? (
          /* Filtered empty state */
          <div className="text-center py-10 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="font-bold text-slate-700 text-sm mb-1">
              Tiada dokumen ditemui dengan saringan semasa
            </div>
            <p className="text-slate-500 max-w-sm mx-auto mb-3">
              Cuba tukar jenis fail, kosongkan kata kunci carian, atau tetapkan semula penapis anda.
            </p>
            <button
              onClick={resetFileFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold text-xs shadow-2xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Set Semula Saringan
            </button>
          </div>
        ) : (
          /* Initial empty state */
          <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <FolderOpen className="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <div className="font-bold text-slate-700 text-sm mb-1">Belum ada fail dimuat naik ke pangkalan data</div>
            <p className="text-slate-500 max-w-sm mx-auto mb-3">
              Gunakan butang <b>Tambah Fail</b> di atas untuk menyimpan evidens, gambar aktiviti, kertas kerja atau dokumen sokongan.
            </p>
          </div>
        )}
      </div>

      {/* Preview File Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-5 h-5 text-sky-700 shrink-0" />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{previewFile.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    {(previewFile.size / 1024).toFixed(1)} KB • {previewFile.type || 'Aplikasi/Dokumen'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100 min-h-[300px]">
              {previewFile.type?.startsWith('image/') || previewFile.data?.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(previewFile.name) ? (
                <img
                  src={previewFile.data}
                  alt={previewFile.name}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : previewFile.type?.includes('pdf') || previewFile.data?.startsWith('data:application/pdf') || /\.pdf$/i.test(previewFile.name) ? (
                <iframe
                  src={previewFile.data}
                  title={previewFile.name}
                  className="w-full h-[60vh] rounded border border-slate-300 bg-white"
                />
              ) : (
                <div className="text-center p-6 bg-white rounded-lg border border-slate-200 shadow-xs max-w-md">
                  <FileText className="w-12 h-12 text-sky-700 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-sm mb-1">{previewFile.name}</p>
                  <p className="text-xs text-slate-500 mb-4">
                    Fail ini sedia untuk dimuat turun dan dibuka dengan perisian yang sepadan pada peranti anda.
                  </p>
                  <a
                    href={previewFile.data}
                    download={previewFile.name}
                    className="inline-flex items-center gap-2 bg-[#21824c] hover:bg-[#1b6b3e] text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Muat Turun Fail Sekarang
                  </a>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Tersimpan dalam jadual Cloud SQL: <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">files</code>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.data}
                  download={previewFile.name}
                  className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-2xs transition"
                >
                  <Download className="w-3.5 h-3.5" /> Muat Turun
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// src/components/PdcaModal.tsx
import React, { useState, useRef } from 'react';
import { PlanRecord, PdcaStage, PdcaData, DatabaseFile } from '../types.ts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  X, 
  Save, 
  Eye, 
  Download, 
  Check, 
  Loader2, 
  FolderOpen,
  Image as ImageIcon,
  ExternalLink,
  CloudUpload
} from 'lucide-react';

interface PdcaModalProps {
  plan: PlanRecord;
  initialStage?: PdcaStage;
  onClose: () => void;
  onSave: (stage: PdcaStage, progress: number, pdcaData: PdcaData) => Promise<void>;
  onUploadFile?: (file: File, category?: string, planId?: string) => Promise<DatabaseFile | null | void>;
  onSyncFileToDrive?: (file: DatabaseFile) => Promise<boolean>;
  files?: DatabaseFile[];
}

export const PdcaModal: React.FC<PdcaModalProps> = ({ 
  plan, 
  initialStage = 'PLAN', 
  onClose, 
  onSave, 
  onUploadFile,
  onSyncFileToDrive,
  files = []
}) => {
  let defaultPdca: PdcaData = {
    PLAN: { status: 'selesai', catatan: 'Perancangan awal dan penetapan sasaran KPI.', tarikhSasaran: '' },
    DO: { status: 'sedang_berjalan', catatan: 'Pelaksanaan aktiviti program mengikut jadual.', tarikhSasaran: '' },
    CHECK: { status: 'belum_mula', catatan: 'Pemantauan berkala dan analisis pencapaian murid.', tarikhSasaran: '' },
    ACT: { status: 'belum_mula', catatan: 'Penambahbaikan dan tindakan susulan.', tarikhSasaran: '' }
  };

  if (plan.pdcaData) {
    try {
      const parsed = JSON.parse(plan.pdcaData);
      defaultPdca = { ...defaultPdca, ...parsed };
    } catch (e) {
      console.warn('Could not parse pdcaData', e);
    }
  }

  const [activeStage, setActiveStage] = useState<PdcaStage>(
    initialStage === 'SELESAI' ? 'ACT' : initialStage
  );
  const [progress, setProgress] = useState<number>(plan.pdcaProgress || 25);
  const [pdcaState, setPdcaState] = useState<PdcaData>(defaultPdca);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [modalPreviewFile, setModalPreviewFile] = useState<DatabaseFile | null>(null);
  const [inlinePreviewFileId, setInlinePreviewFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stageKeys: PdcaStage[] = ['PLAN', 'DO', 'CHECK', 'ACT'];
  const stageLabels: Record<PdcaStage, { title: string; desc: string; color: string; bg: string }> = {
    PLAN: { title: 'PLAN (Rancang)', desc: 'Kenal pasti isu, tetapkan objektif & strategi', color: 'text-blue-700', bg: 'bg-blue-600' },
    DO: { title: 'DO (Laksana)', desc: 'Laksanakan program, bengkel & aktiviti', color: 'text-emerald-700', bg: 'bg-emerald-600' },
    CHECK: { title: 'CHECK (Semak)', desc: 'Pantau KPI, semak evidens & kaji keberkesanan', color: 'text-amber-700', bg: 'bg-amber-600' },
    ACT: { title: 'ACT (Tindak)', desc: 'Intervensi berfokus & penambahbaikan berterusan', color: 'text-rose-700', bg: 'bg-rose-600' },
    SELESAI: { title: 'SELESAI', desc: 'Semua peringkat selesai', color: 'text-purple-700', bg: 'bg-purple-600' }
  };

  const currentDetail = pdcaState[activeStage as keyof PdcaData] || {
    status: 'sedang_berjalan',
    catatan: '',
    tarikhSasaran: '',
  };

  const handleDetailChange = (field: string, value: string) => {
    setPdcaState(prev => ({
      ...prev,
      [activeStage]: {
        ...prev[activeStage as keyof PdcaData],
        [field]: value
      }
    }));
  };

  // Files for this plan and current stage
  const planFiles = files.filter(f => f.planId === plan.planId);
  const stageCategory = `evidens_${activeStage.toLowerCase()}`;
  const currentStageFiles = planFiles.filter(
    f => f.category === stageCategory || 
         f.category === 'evidens' ||
         (currentDetail.evidensFail && f.name === currentDetail.evidensFail)
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);
    setUploadSuccessMsg(null);
    try {
      const category = `evidens_${activeStage.toLowerCase()}`;
      if (onUploadFile) {
        await onUploadFile(file, category, plan.planId);
      } else {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const res = await fetch('/api/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  data: reader.result as string,
                  category,
                  planId: plan.planId,
                }),
              });
              resolve(res);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      handleDetailChange('evidensFail', file.name);
      setUploadSuccessMsg(`Fail "${file.name}" berjaya disimpan ke pangkalan data dan dimasukkan ke Repositori Fail & Evidens!`);
    } catch (err) {
      console.error('Upload error in PdcaModal:', err);
      alert('Ralat semasa memuat naik fail evidens.');
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(activeStage, progress, pdcaState);
      onClose();
    } catch {
      alert('Ralat semasa menyimpan kemajuan PDCA.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-150 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-sky-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                PDCA Tracker
              </span>
              <span className="text-xs text-slate-300">{plan.unit} • {plan.panitia}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 line-clamp-1">{plan.program}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 4 PDCA Buttons Selector */}
        <div className="grid grid-cols-4 bg-slate-100 p-2 gap-2 border-b border-slate-200">
          {stageKeys.map((stage) => {
            const isActive = activeStage === stage;
            const stageInfo = stageLabels[stage];
            const detail = pdcaState[stage as keyof PdcaData];
            const isCompleted = detail?.status === 'selesai';

            return (
              <button
                key={stage}
                onClick={() => {
                  setActiveStage(stage);
                  setUploadSuccessMsg(null);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition text-center relative cursor-pointer ${
                  isActive
                    ? 'bg-white shadow-md ring-2 ring-sky-600 font-bold'
                    : 'bg-white/70 hover:bg-white text-slate-600 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${
                    isCompleted ? 'bg-emerald-500' : detail?.status === 'sedang_berjalan' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                  <span className={`text-sm tracking-wide ${isActive ? stageInfo.color : 'text-slate-800'}`}>
                    {stage}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 truncate w-full px-1 mt-0.5">
                  {detail?.status === 'selesai' ? '✓ Selesai' : detail?.status === 'sedang_berjalan' ? 'Aktif' : 'Belum'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Stage Heading Banner */}
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 flex items-start justify-between">
            <div>
              <h4 className="font-bold text-sky-950 text-base flex items-center gap-2">
                {stageLabels[activeStage].title}
              </h4>
              <p className="text-xs text-sky-800 mt-0.5">{stageLabels[activeStage].desc}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Kemajuan Keseluruhan</span>
              <span className="text-lg font-black text-sky-900">{progress}%</span>
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Peratusan Pelaksanaan Projek</label>
              <span className="text-xs font-semibold text-slate-500">{progress}% siap</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% (Rancang)</span>
              <span>35% (Mula)</span>
              <span>70% (Semak)</span>
              <span>100% (Selesai)</span>
            </div>
          </div>

          {/* Stage Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Peringkat {activeStage}</label>
              <select
                value={currentDetail.status}
                onChange={(e) => handleDetailChange('status', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
              >
                <option value="belum_mula">⏳ Belum Mula</option>
                <option value="sedang_berjalan">🚀 Sedang Berjalan</option>
                <option value="perlu_tindakan">⚠️ Perlu Tindakan / Isu</option>
                <option value="selesai">✅ Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tarikh / Tempoh Sasaran</label>
              <input
                type="text"
                placeholder="cth: Mac 2026 / Minggu ke-3"
                value={currentDetail.tarikhSasaran || ''}
                onChange={(e) => handleDetailChange('tarikhSasaran', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan & Ringkasan Tindakan Peringkat {activeStage}
            </label>
            <textarea
              rows={3}
              value={currentDetail.catatan || ''}
              onChange={(e) => handleDetailChange('catatan', e.target.value)}
              placeholder="Catat status tindakan, hasil mesyuarat, dapatan semakan atau keputusan..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Follow-up for CHECK / ACT */}
          {(activeStage === 'CHECK' || activeStage === 'ACT') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tindakan Susulan / Penambahbaikan (Intervensi)
              </label>
              <textarea
                rows={2}
                value={currentDetail.tindakanSusulan || ''}
                onChange={(e) => handleDetailChange('tindakanSusulan', e.target.value)}
                placeholder="Senaraikan tindakan intervensi bagi kumpulan murid yang belum capai sasaran..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          )}

          {/* Evidens Attachment with Real Database & Repository Integration */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-sky-700" />
                  Fail Evidens Fasa {activeStage} (Disimpan ke Pangkalan Data)
                </span>
                <span className="text-[11px] text-slate-500">
                  Semua fail yang dimuat naik di sini disimpan ke jadual database dan muncul di <b>Repositori Fail & Evidens</b>.
                </span>
              </div>

              {/* Upload Button */}
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="cursor-pointer bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50"
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memuat Naik...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Fail Evidens</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Success notification */}
            {uploadSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            {/* List of files matching this stage */}
            {currentStageFiles.length > 0 ? (
              <div className="space-y-2">
                {currentStageFiles.map((f) => {
                  const isImg = f.type?.startsWith('image/') || f.data?.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(f.name);
                  const isPdf = f.type?.includes('pdf') || f.data?.startsWith('data:application/pdf') || /\.pdf$/i.test(f.name);
                  const isExpanded = inlinePreviewFileId === f.fileId;

                  return (
                    <div 
                      key={f.fileId} 
                      className={`p-3 bg-white border rounded-lg shadow-2xs transition ${
                        isExpanded ? 'border-sky-500 ring-1 ring-sky-400' : 'border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                          <button
                            type="button"
                            onClick={() => setInlinePreviewFileId(prev => prev === f.fileId ? null : f.fileId)}
                            className="shrink-0 cursor-pointer hover:opacity-80 transition"
                            title="Klik untuk lihat pratonton"
                          >
                            {isImg ? (
                              <img src={f.data} alt={f.name} className="w-9 h-9 object-cover rounded border border-slate-200" />
                            ) : isPdf ? (
                              <div className="w-9 h-9 bg-rose-50 text-rose-600 border border-rose-200 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 bg-sky-50 text-sky-700 border border-sky-200 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                          </button>

                          <div className="overflow-hidden flex-1">
                            <button
                              type="button"
                              onClick={() => setInlinePreviewFileId(prev => prev === f.fileId ? null : f.fileId)}
                              className="font-bold text-xs text-slate-800 hover:text-sky-700 hover:underline text-left block truncate cursor-pointer"
                              title={`Klik untuk lihat pratonton fail ${f.name}`}
                            >
                              {f.name}
                            </button>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span>{(f.size / 1024).toFixed(1)} KB</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Tersimpan di Repositori Cloud SQL
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setInlinePreviewFileId(prev => prev === f.fileId ? null : f.fileId)}
                            className={`px-2 py-1 text-[11px] font-semibold rounded transition cursor-pointer flex items-center gap-1 ${
                              isExpanded 
                                ? 'bg-sky-600 text-white' 
                                : 'text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200'
                            }`}
                            title="Klik untuk buka/tutup pratonton"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isExpanded ? 'Tutup' : 'Lihat'}</span>
                          </button>
                          <a
                            href={f.data}
                            download={f.name}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition cursor-pointer flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Muat Turun</span>
                          </a>
                          {f.driveWebViewLink ? (
                            <a
                              href={f.driveWebViewLink}
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
                              onClick={() => onSyncFileToDrive(f)}
                              className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition cursor-pointer flex items-center gap-1"
                              title="Hantar fail ini ke folder Google Drive"
                            >
                              <CloudUpload className="w-3 h-3 text-sky-600" />
                              <span>Ke Drive</span>
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* Direct In-UI Preview (Detects PDF/Image and renders iframe or img) */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-200 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between pb-2 mb-2">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-sky-700" />
                              Pratonton Langsung: <span className="text-sky-900 font-semibold">{f.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                {isPdf ? 'Dokumen PDF' : isImg ? 'Gambar' : 'Fail Sokongan'}
                              </span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setModalPreviewFile(f)}
                                className="text-[11px] text-sky-700 hover:text-sky-900 hover:underline font-semibold cursor-pointer"
                              >
                                Paparan Penuh ↗
                              </button>
                              <button
                                type="button"
                                onClick={() => setInlinePreviewFileId(null)}
                                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex items-center justify-center min-h-[220px]">
                            {isImg ? (
                              <img
                                src={f.data}
                                alt={f.name}
                                className="max-h-[360px] max-w-full object-contain rounded-md shadow-xs mx-auto"
                              />
                            ) : isPdf ? (
                              <iframe
                                src={f.data}
                                title={f.name}
                                className="w-full h-[380px] rounded-md border border-slate-300 bg-white"
                              />
                            ) : (
                              <div className="text-center p-6 bg-white rounded-md border border-slate-200">
                                <FileText className="w-10 h-10 text-sky-700 mx-auto mb-2" />
                                <p className="font-bold text-xs text-slate-800 mb-1">{f.name}</p>
                                <p className="text-xs text-slate-500 mb-3">
                                  Fail jenis ini boleh dimuat turun untuk dibuka dengan aplikasi berkaitan.
                                </p>
                                <a
                                  href={f.data}
                                  download={f.name}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs"
                                >
                                  <Download className="w-3.5 h-3.5" /> Muat Turun Fail
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : currentDetail.evidensFail ? (
              /* Fallback if file name recorded but full file object still loading */
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-sky-700" />
                  <div>
                    <span className="font-semibold block">{currentDetail.evidensFail}</span>
                    <span className="text-[10px] text-slate-500">Direkodkan bagi fasa {activeStage}</span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersimpan
                </span>
              </div>
            ) : (
              <div className="text-center py-4 bg-white rounded-lg border border-dashed border-slate-300 text-slate-400 text-xs">
                <FileText className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p>Tiada fail evidens dimuat naik untuk fasa {activeStage} setakat ini.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Klik <b>Pilih Fail Evidens</b> di atas untuk melampirkan kertas kerja, laporan, minit mesyuarat atau gambar.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Perubahan disimpan secara langsung ke Cloud SQL.
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan Kemajuan'}
            </button>
          </div>
        </div>

        {/* Sub-modal for quick file preview */}
        {modalPreviewFile && (
          <div className="absolute inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-sky-700 shrink-0" />
                  <span className="font-bold text-xs text-slate-900 truncate">{modalPreviewFile.name}</span>
                </div>
                <button 
                  onClick={() => setModalPreviewFile(null)} 
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto flex items-center justify-center bg-slate-100 min-h-[250px]">
                {modalPreviewFile.type?.startsWith('image/') || modalPreviewFile.data?.startsWith('data:image/') ? (
                  <img src={modalPreviewFile.data} alt={modalPreviewFile.name} className="max-h-[50vh] max-w-full object-contain rounded" />
                ) : modalPreviewFile.type?.includes('pdf') || modalPreviewFile.data?.startsWith('data:application/pdf') ? (
                  <iframe src={modalPreviewFile.data} title={modalPreviewFile.name} className="w-full h-[50vh] rounded border border-slate-300" />
                ) : (
                  <div className="text-center p-6 bg-white rounded-lg border border-slate-200">
                    <FileText className="w-10 h-10 text-sky-700 mx-auto mb-2" />
                    <p className="font-bold text-xs text-slate-800 mb-2">{modalPreviewFile.name}</p>
                    <a
                      href={modalPreviewFile.data}
                      download={modalPreviewFile.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Muat Turun Fail
                    </a>
                  </div>
                )}
              </div>
              <div className="p-2.5 bg-white border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setModalPreviewFile(null)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded"
                >
                  Tutup Pratonton
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

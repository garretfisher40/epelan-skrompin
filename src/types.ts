// src/types.ts
export type PdcaStage = 'PLAN' | 'DO' | 'CHECK' | 'ACT' | 'SELESAI';

export interface PdcaStageDetail {
  status: 'belum_mula' | 'sedang_berjalan' | 'selesai' | 'perlu_tindakan';
  tarikhMula?: string;
  tarikhSasaran?: string;
  catatan?: string;
  tindakanSusulan?: string;
  evidensFail?: string; // file name or preview
  skor?: string;
}

export interface PdcaData {
  PLAN: PdcaStageDetail;
  DO: PdcaStageDetail;
  CHECK: PdcaStageDetail;
  ACT: PdcaStageDetail;
}

export interface PlanRecord {
  id?: number;
  planId: string;
  tahun: string;
  unit: string;
  panitia: string;
  isu: string;
  teras: string;
  strategi: string;
  prakarsa: string;
  program: string;
  matlamat: string;
  objektif: string;
  kpi: string;
  sasaranKpi: string;
  tempoh: string;
  sasaran: string;
  tanggungjawab: string;
  proses: string;
  kewangan: string;
  kekangan: string;
  pemantauan: string;
  penilaian: string;
  penambahbaikan: string;
  evidens: string;
  gambarUrl?: string; // Direct image upload stored in database
  pdcaStage: PdcaStage;
  pdcaProgress: number; // 0 - 100
  pdcaData?: string; // serialized PdcaData
  createdBy?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface SchoolSettings {
  schoolName: string;
  place: string;
  gb?: string;
  pk?: string;
  kp?: string;
  motto?: string;
  logoUrl?: string;
}

export interface DatabaseFile {
  id?: number;
  fileId: string;
  planId?: string | null;
  name: string;
  size: number;
  type: string;
  data: string;
  category?: string;
  uploadedBy?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  createdAt?: string;
}

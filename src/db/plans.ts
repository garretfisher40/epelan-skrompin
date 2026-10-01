// src/db/plans.ts
import { db } from './index.ts';
import { plans } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface PlanData {
  id?: number;
  planId: string;
  tahun: string;
  unit: string;
  panitia: string;
  isu?: string | null;
  teras?: string | null;
  strategi?: string | null;
  prakarsa?: string | null;
  program: string;
  matlamat?: string | null;
  objektif?: string | null;
  kpi?: string | null;
  sasaranKpi?: string | null;
  tempoh?: string | null;
  sasaran?: string | null;
  tanggungjawab?: string | null;
  proses?: string | null;
  kewangan?: string | null;
  kekangan?: string | null;
  pemantauan?: string | null;
  penilaian?: string | null;
  penambahbaikan?: string | null;
  evidens?: string | null;
  gambarUrl?: string | null;
  pdcaStage?: string | null;
  pdcaProgress?: number | null;
  pdcaData?: string | null;
  createdBy?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export const INITIAL_STARTER_PLANS: PlanData[] = [
  {
    planId: 'plan_muzik_gema_merdeka_2026',
    tahun: '2026',
    unit: 'Unit Kurikulum',
    panitia: 'Pendidikan Muzik',
    isu: 'Bakat vokal, apresiasi seni muzik patriotik dan tahap keyakinan diri murid dalam persembahan seni suara pentas masih di tahap sederhana.',
    teras: 'TS2|Mengoptimumkan Potensi Murid',
    strategi: 'S3|Membangunkan Bakat',
    prakarsa: 'P1|Bakat Holistik STEM, TVET, Sukan & Seni',
    program: 'Pertandingan Gema Suara Merdeka SK Rompin 2026',
    matlamat: 'Mencungkil dan mengasah bakat seni vokal murid serta menyemarakkan penghayatan patriotisme melalui nyanyian lagu kebangsaan dan patriotik sempena sambutan Bulan Kebangsaan.',
    objektif: '1. Sekurang-kurangnya 95% murid menyertai aktiviti saringan nyanyian patriotik di peringkat kelas.\n2. Meningkatkan keyakinan pentas dan penguasaan teknik vokal murid dengan kawalan pic, tempo, sebutan dan dinamik yang betul.\n3. Melatih dan memilih 3 wakil terbaik SK Rompin ke Pertandingan Nyanyian Solo Patriotik Peringkat Daerah.',
    kpi: 'Peratus penyertaan murid dalam saringan & pertandingan akhir serta pencapaian minimum 3 wakil sekolah ke peringkat daerah',
    sasaranKpi: '≥ 95% murid menyertai aktiviti saringan kelas & pertandingan akhir serta 100% sasaran 3 wakil sekolah tercapai',
    tempoh: 'Bulan Ogos – September (Sempena Sambutan Bulan Kebangsaan 2026)',
    sasaran: 'Semua murid Tahap 1 (Tahun 1–3) dan Tahap 2 (Tahun 4–6) SK Rompin',
    tanggungjawab: 'Ketua Panitia Muzik, Penyelaras Sambutan Bulan Kemerdekaan & Semua Guru Mata Pelajaran Muzik',
    proses: '1. PLAN: Menyediakan kertas kerja, menentukan 12 senarai lagu patriotik pilihan, menyediakan rubrik pemarkahan vokal, dan melantik panel juri.\n2. DO: Mengadakan saringan peringkat kelas, bengkel lontaran vokal & kawalan pernafasan, serta raptai penuh pentas dewan.\n3. CHECK: Pertandingan akhir Pentas Gema Suara Merdeka semasa Majlis Penutupan Bulan Kebangsaan, penjurian berpandukan rubrik 100 markah.\n4. ACT: Bimbingan intensif dan rakaman audio-visual untuk wakil sekolah terpilih ke festival seni suara peringkat daerah.',
    kewangan: 'PCG Panitia Muzik & Peruntukan Sambutan Bulan Kemerdekaan (RM 850)',
    kekangan: 'Kekangan masa latihan persekolahan dan keperluan penyelarasan sistem audio siar raya dewan.',
    pemantauan: 'Borang saringan kelas, senarai lagu peserta, rekod kehadiran sesi latihan, dan minit mesyuarat jawatankuasa.',
    penilaian: 'Penghakiman juri vokal profesional berpandukan rubrik sebutan, tempo, pic nada, dan dinamik persembahan (100 markah).',
    penambahbaikan: 'Menyediakan modul bimbingan teknik pernafasan awal dan menubuhkan kumpulan koir sekolah (Gema Rompin).',
    evidens: 'Kertas kerja kelulusan, poster hebahan pertandingan, gambar aktiviti bengkel & persembahan pentas, rakaman video nyanyian, senarai pemenang & sijil.',
    gambarUrl: '',
    pdcaStage: 'DO',
    pdcaProgress: 50,
    pdcaData: JSON.stringify({
      PLAN: {
        status: 'selesai',
        tarikhSasaran: '15 Ogos 2026',
        catatan: 'Kertas kerja pertandingan, senarai 12 lagu patriotik pilihan, dan rubrik penjurian telah diluluskan oleh Guru Besar.',
      },
      DO: {
        status: 'sedang_berjalan',
        tarikhSasaran: '28 Ogos 2026',
        catatan: 'Saringan pusingan awal di setiap kelas dan bengkel teknik lontaran suara sedang rancak dijalankan.',
      },
      CHECK: {
        status: 'belum_mula',
        tarikhSasaran: '10 September 2026',
        catatan: 'Pertandingan akhir pentas dewan bersempena Majlis Penutupan Bulan Kebangsaan.',
      },
      ACT: {
        status: 'belum_mula',
        tarikhSasaran: '20 September 2026',
        catatan: 'Bimbingan intensif pemenang bagi persediaan pertandingan seni suara solo peringkat daerah.',
      },
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    planId: 'plan_bm_celik_literasi_2026',
    tahun: '2026',
    unit: 'Unit Kurikulum',
    panitia: 'Bahasa Melayu',
    isu: 'Tahap penguasaan literasi dan membaca murid Tahap 1 masih perlu ditingkatkan.',
    teras: 'TS2|Mengoptimumkan Potensi Murid',
    strategi: 'S2|Meningkatkan Kemahiran Murid',
    prakarsa: 'P1|Memperkukuh Literasi & Numerasi Tahap 1',
    program: 'Program Celik Membaca & Pemantapan Literasi BM Tahap 1',
    matlamat: 'Meningkatkan peratus murid mencapai tahap penguasaan minimum TP3 ke atas.',
    objektif: 'Sekurang-kurangnya 90% murid Tahap 1 melepasi saringan literasi pada fasa pertengahan tahun.',
    kpi: 'Peratus murid TP3 dan ke atas dalam PBD Bahasa Melayu',
    sasaranKpi: '≥ 90% mencapai TP3 ke atas',
    tempoh: 'Sepanjang Tahun (Januari – November)',
    sasaran: 'Semua murid Tahun 1, Tahun 2 & Tahun 3 SK Rompin',
    tanggungjawab: 'Ketua Panitia Bahasa Melayu & Guru Mata Pelajaran BM',
    proses: '1. PLAN: Mengenal pasti murid yang memerlukan bimbingan khusus berdasarkan data saringan.\n2. DO: Melaksanakan sesi intervensi berjadual 30 minit dan aktiviti membaca berfokus.\n3. CHECK: Semakan berkala melalui instrumen pemantauan dan rekod bacaan harian.\n4. ACT: Modul intervensi disesuaikan mengikut tahap keupayaan murid secara berperingkat.',
    kewangan: 'PCG Panitia Bahasa Melayu (RM 1,200)',
    kekangan: 'Kehadiran sebilangan kecil murid kurang konsisten.',
    pemantauan: 'Rekod kehadiran & kad bacaan berfasa bulanan.',
    penilaian: 'Analisis PBD Pertengahan dan Akhir Sesi Akademik.',
    penambahbaikan: 'Perbanyakkan bahan visual grafik interaktif dan bimbingan ibu bapa di rumah.',
    evidens: 'Kertas kerja, minit mesyuarat panitia, gambar aktiviti murid, borang saringan.',
    gambarUrl: '',
    pdcaStage: 'DO',
    pdcaProgress: 50,
    pdcaData: JSON.stringify({
      PLAN: {
        status: 'selesai',
        tarikhSasaran: '10 Februari 2026',
        catatan: 'Saringan fasa 1 telah selesai dijalankan. Senarai murid intervensi telah disahkan.',
      },
      DO: {
        status: 'sedang_berjalan',
        tarikhSasaran: '15 Mei 2026',
        catatan: 'Modul bacaan pantas sedang dilaksanakan setiap hari Selasa dan Khamis.',
      },
      CHECK: {
        status: 'belum_mula',
        tarikhSasaran: '20 Julai 2026',
        catatan: 'Semakan berkala instrumen bacaan murid.',
      },
      ACT: {
        status: 'belum_mula',
        tarikhSasaran: '30 Oktober 2026',
        catatan: 'Penyesuaian modul intervensi fasa akhir.',
      },
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    planId: 'plan_sains_karnival_stem_2026',
    tahun: '2026',
    unit: 'Unit Kurikulum',
    panitia: 'Sains',
    isu: 'Minat murid terhadap eksperimen dan kemahiran saintifik amali masih di tahap sederhana.',
    teras: 'TS1|Sistem Terangkum, Dinamik & Relevan',
    strategi: 'S1|Keberkesanan Implementasi Dasar',
    prakarsa: 'P1|Memperkasa Pendidikan Sains & Matematik',
    program: 'Karnival Inovasi & Eksplorasi STEM Cilik SK Rompin 2026',
    matlamat: 'Membina budaya inkuiri dan memupuk kemahiran sains gunaan dalam kalangan murid.',
    objektif: 'Meningkatkan penglibatan murid dalam aktiviti STEM secara hands-on hingga 95%.',
    kpi: 'Peratus penglibatan aktif murid dalam projek STEM sekolah',
    sasaranKpi: '≥ 95% penglibatan aktif',
    tempoh: 'Fasa 1 & Fasa 2 (April & Ogos)',
    sasaran: 'Semua murid Tahap 2 (Tahun 4, 5 & 6)',
    tanggungjawab: 'Ketua Panitia Sains, Guru Matematik & RBT',
    proses: '1. PLAN: Merangka modul hands-on STEM dan stesen pameran interaktif sains.\n2. DO: Mengadakan bengkel ciptaan dan pertandingan inovasi roket air & mekanikal mudah.\n3. CHECK: Penilaian rubrik kemahiran proses sains murid oleh para juri.\n4. ACT: Dokumentasi inovasi terbaik dan persediaan ke peringkat daerah.',
    kewangan: 'Peruntukan Kokurikulum & PCG Sains (RM 1,500)',
    kekangan: 'Kekurangan kit model saintifik asas.',
    pemantauan: 'Buku log projek & lembaran aktiviti mingguan.',
    penilaian: 'Pertandingan akhir karnival STEM sekolah.',
    penambahbaikan: 'Menjalin kolaborasi bersama rakan komuniti dan institusi pendidikan tinggi.',
    evidens: 'Laporan bergambar, video montaj pameran, sijil penyertaan murid.',
    gambarUrl: '',
    pdcaStage: 'PLAN',
    pdcaProgress: 25,
    pdcaData: JSON.stringify({
      PLAN: {
        status: 'selesai',
        tarikhSasaran: '1 Mac 2026',
        catatan: 'Kertas kerja karnival dan pembahagian stesen pameran telah diluluskan pentadbiran sekolah.',
      },
      DO: {
        status: 'belum_mula',
        tarikhSasaran: '20 April 2026',
        catatan: 'Pelaksanaan bengkel ciptaan dan pertandingan inovasi.',
      },
      CHECK: {
        status: 'belum_mula',
        tarikhSasaran: '25 April 2026',
        catatan: 'Penjurian projek inovasi murid.',
      },
      ACT: {
        status: 'belum_mula',
        tarikhSasaran: '10 Mei 2026',
        catatan: 'Penambahbaikan modul bagi fasa kedua.',
      },
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// In-memory cache to guarantee 100% availability even if Cloud SQL is disconnected
let inMemoryPlans: PlanData[] = [...INITIAL_STARTER_PLANS];

export async function getPlans(): Promise<PlanData[]> {
  try {
    const list = await db.select().from(plans).orderBy(desc(plans.createdAt));
    if (list.length === 0) {
      // Seed starter plans into database
      for (const p of INITIAL_STARTER_PLANS) {
        await upsertPlan(p);
      }
      const seeded = await db.select().from(plans).orderBy(desc(plans.createdAt));
      inMemoryPlans = seeded.map((item: any) => ({ ...item }));
      return seeded;
    }
    inMemoryPlans = list.map((item: any) => ({ ...item }));
    return list;
  } catch (error) {
    console.warn('Database offline/socket unavailable; using in-memory store for getPlans');
    return inMemoryPlans;
  }
}

export async function getPlanById(planId: string): Promise<PlanData | null> {
  try {
    const res = await db.select().from(plans).where(eq(plans.planId, planId)).limit(1);
    if (res[0]) return res[0];
  } catch (error) {
    console.warn(`Database offline; using in-memory store for getPlanById(${planId})`);
  }
  return inMemoryPlans.find((p) => p.planId === planId) || null;
}

export async function upsertPlan(data: PlanData): Promise<PlanData> {
  const now = new Date();
  let savedResult: PlanData | null = null;

  try {
    const existing = await db.select().from(plans).where(eq(plans.planId, data.planId)).limit(1);
    if (existing && existing.length > 0) {
      const res = await db
        .update(plans)
        .set({
          tahun: data.tahun,
          unit: data.unit,
          panitia: data.panitia,
          isu: data.isu || '',
          teras: data.teras || '',
          strategi: data.strategi || '',
          prakarsa: data.prakarsa || '',
          program: data.program,
          matlamat: data.matlamat || '',
          objektif: data.objektif || '',
          kpi: data.kpi || '',
          sasaranKpi: data.sasaranKpi || '',
          tempoh: data.tempoh || '',
          sasaran: data.sasaran || '',
          tanggungjawab: data.tanggungjawab || '',
          proses: data.proses || '',
          kewangan: data.kewangan || '',
          kekangan: data.kekangan || '',
          pemantauan: data.pemantauan || '',
          penilaian: data.penilaian || '',
          penambahbaikan: data.penambahbaikan || '',
          evidens: data.evidens || '',
          gambarUrl: data.gambarUrl !== undefined ? data.gambarUrl : existing[0].gambarUrl,
          pdcaStage: data.pdcaStage || existing[0].pdcaStage,
          pdcaProgress: data.pdcaProgress !== undefined ? data.pdcaProgress : existing[0].pdcaProgress,
          pdcaData: data.pdcaData || existing[0].pdcaData,
          updatedAt: now,
        })
        .where(eq(plans.planId, data.planId))
        .returning();
      savedResult = res[0];
    } else {
      const res = await db
        .insert(plans)
        .values({
          planId: data.planId,
          tahun: data.tahun,
          unit: data.unit,
          panitia: data.panitia,
          isu: data.isu || '',
          teras: data.teras || '',
          strategi: data.strategi || '',
          prakarsa: data.prakarsa || '',
          program: data.program,
          matlamat: data.matlamat || '',
          objektif: data.objektif || '',
          kpi: data.kpi || '',
          sasaranKpi: data.sasaranKpi || '',
          tempoh: data.tempoh || '',
          sasaran: data.sasaran || '',
          tanggungjawab: data.tanggungjawab || '',
          proses: data.proses || '',
          kewangan: data.kewangan || '',
          kekangan: data.kekangan || '',
          pemantauan: data.pemantauan || '',
          penilaian: data.penilaian || '',
          penambahbaikan: data.penambahbaikan || '',
          evidens: data.evidens || '',
          gambarUrl: data.gambarUrl || '',
          pdcaStage: data.pdcaStage || 'PLAN',
          pdcaProgress: data.pdcaProgress || 25,
          pdcaData: data.pdcaData || '',
          createdBy: data.createdBy || '',
        })
        .returning();
      savedResult = res[0];
    }
  } catch (error) {
    console.warn('Database upsert failed, updating in-memory store');
  }

  // Update in-memory fallback
  const idx = inMemoryPlans.findIndex((p) => p.planId === data.planId);
  const updatedPlan: PlanData = {
    ...data,
    updatedAt: now,
    createdAt: idx >= 0 ? inMemoryPlans[idx].createdAt || now : now,
  };

  if (idx >= 0) {
    inMemoryPlans[idx] = { ...inMemoryPlans[idx], ...updatedPlan };
  } else {
    inMemoryPlans.unshift(updatedPlan);
  }

  return savedResult || updatedPlan;
}

export async function updatePlanPdca(planId: string, stage: string, progress: number, pdcaData: string): Promise<PlanData | null> {
  const now = new Date();
  let updatedDb: PlanData | null = null;

  try {
    const res = await db
      .update(plans)
      .set({
        pdcaStage: stage,
        pdcaProgress: progress,
        pdcaData: pdcaData,
        updatedAt: now,
      })
      .where(eq(plans.planId, planId))
      .returning();
    if (res[0]) updatedDb = res[0];
  } catch (error) {
    console.warn(`Database PDCA update failed for ${planId}, updating in-memory store`);
  }

  const idx = inMemoryPlans.findIndex((p) => p.planId === planId);
  if (idx >= 0) {
    inMemoryPlans[idx] = {
      ...inMemoryPlans[idx],
      pdcaStage: stage,
      pdcaProgress: progress,
      pdcaData: pdcaData,
      updatedAt: now,
    };
    return updatedDb || inMemoryPlans[idx];
  }

  return updatedDb;
}

export async function deletePlanById(planId: string): Promise<PlanData | null> {
  let deleted: PlanData | null = null;
  try {
    const res = await db.delete(plans).where(eq(plans.planId, planId)).returning();
    if (res[0]) deleted = res[0];
  } catch (error) {
    console.warn(`Database delete failed for ${planId}, removing from in-memory store`);
  }

  const idx = inMemoryPlans.findIndex((p) => p.planId === planId);
  if (idx >= 0) {
    const item = inMemoryPlans.splice(idx, 1)[0];
    return deleted || item;
  }

  return deleted;
}

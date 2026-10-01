// src/App.tsx
import React, { useState, useEffect } from 'react';
import { PlanRecord, SchoolSettings, DatabaseFile, PdcaStage, PdcaData } from './types.ts';
import { 
  RPM_DATA, 
  UNIT_OPTIONS, 
  ISU_PRESETS, 
  DEFAULT_LOGO,
  MATLAMAT_PRESETS,
  OBJEKTIF_PRESETS,
  KPI_PRESETS,
  TEMPOH_PRESETS,
  SASARAN_PRESETS
} from './data/rpmData.ts';
import { HeaderNav } from './components/HeaderNav.tsx';
import { FormTab } from './components/FormTab.tsx';
import { DashboardTab } from './components/DashboardTab.tsx';
import { BookTab } from './components/BookTab.tsx';
import { SettingsTab } from './components/SettingsTab.tsx';
import { RpmTab } from './components/RpmTab.tsx';
import { GuideTab } from './components/GuideTab.tsx';
import { PdcaModal } from './components/PdcaModal.tsx';
import { auth, googleSignIn, logout, getAccessToken, setAccessToken } from './lib/firebase.ts';
import { uploadFileToDrive, TARGET_DRIVE_FOLDER_ID, TARGET_DRIVE_FOLDER_URL } from './lib/googleDrive.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { safeParseJson } from './utils/api.ts';

const createDefaultPlan = (): PlanRecord => {
  const defaultTeras = Object.keys(RPM_DATA)[0];
  const defaultStrat = Object.keys(RPM_DATA[defaultTeras])[0];
  const defaultPrak = RPM_DATA[defaultTeras][defaultStrat][0];

  return {
    planId: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tahun: '2026',
    unit: 'Unit Kurikulum',
    panitia: 'Bahasa Melayu',
    isu: ISU_PRESETS[0],
    teras: defaultTeras,
    strategi: defaultStrat,
    prakarsa: defaultPrak,
    program: 'Program Intervensi Berfokus',
    matlamat: MATLAMAT_PRESETS[0],
    objektif: OBJEKTIF_PRESETS[0],
    kpi: KPI_PRESETS[0],
    sasaranKpi: '≥ 85% mencapai sasaran',
    tempoh: TEMPOH_PRESETS[0],
    sasaran: SASARAN_PRESETS[0],
    tanggungjawab: 'Ketua Panitia dan semua guru mata pelajaran',
    proses: '1. PLAN — Kenal pasti isu dan sasaran berdasarkan data pentaksiran.\n2. DO — Laksanakan program mengikut perancangan dan modul.\n3. CHECK — Pantau KPI, semak evidens dan kehadiran murid.\n4. ACT — Nilai impak dan laksanakan intervensi penambahbaikan.',
    kewangan: 'Peruntukan PCG Panitia',
    kekangan: 'Tahap penguasaan murid berbeza dan masa pelaksanaan terhad.',
    pemantauan: 'Rekod kehadiran, semakan evidens dan analisis perkembangan bulanan.',
    penilaian: 'Perbandingan pencapaian sebelum dan selepas program serta analisis KPI.',
    penambahbaikan: 'Intervensi lebih berfokus dan tindakan susulan berterusan secara berfasa.',
    evidens: 'Laporan bergambar, rekod kehadiran, instrumen penilaian dan minit mesyuarat.',
    gambarUrl: '',
    pdcaStage: 'PLAN',
    pdcaProgress: 25,
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanRecord>(createDefaultPlan);
  const [settings, setSettings] = useState<SchoolSettings>({
    schoolName: 'SEKOLAH KEBANGSAAN ROMPIN',
    place: 'NEGERI SEMBILAN',
    gb: '',
    pk: '',
    kp: '',
    motto: 'USAHA JAYA',
    logoUrl: DEFAULT_LOGO,
  });
  const [files, setFiles] = useState<DatabaseFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activePdcaPlan, setActivePdcaPlan] = useState<PlanRecord | null>(null);
  const [activePdcaStage, setActivePdcaStage] = useState<PdcaStage>('PLAN');
  const [user, setUser] = useState<User | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
            }),
          });
        } catch (e) {
          console.error('Failed to sync user with database', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial data from Cloud SQL Database
  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    try {
      // 1. Fetch Plans
      try {
        const plansRes = await fetch('/api/plans');
        const plansData = await safeParseJson<PlanRecord[]>(plansRes);
        if (Array.isArray(plansData) && plansData.length > 0) {
          setPlans(plansData);
          setCurrentPlan(plansData[0]);
          localStorage.setItem('v5plans', JSON.stringify(plansData));
        } else {
          const localPlans = localStorage.getItem('v5plans');
          if (localPlans) {
            const parsed = JSON.parse(localPlans);
            setPlans(parsed);
            if (parsed.length > 0) setCurrentPlan(parsed[0]);
          }
        }
      } catch {
        const localPlans = localStorage.getItem('v5plans');
        if (localPlans) setPlans(JSON.parse(localPlans));
      }

      // 2. Fetch Settings
      try {
        const setRes = await fetch('/api/settings');
        const setData = await safeParseJson<SchoolSettings>(setRes);
        if (setData && setData.schoolName) {
          setSettings(setData);
          localStorage.setItem('v5settings', JSON.stringify(setData));
        } else {
          const localSettings = localStorage.getItem('v5settings');
          if (localSettings) setSettings(JSON.parse(localSettings));
        }
      } catch {
        const localSettings = localStorage.getItem('v5settings');
        if (localSettings) setSettings(JSON.parse(localSettings));
      }

      // 3. Fetch Files
      try {
        const filesRes = await fetch('/api/files');
        const filesData = await safeParseJson<DatabaseFile[]>(filesRes);
        if (Array.isArray(filesData)) {
          setFiles(filesData);
          localStorage.setItem('v5files', JSON.stringify(filesData));
        } else {
          const localFiles = localStorage.getItem('v5files');
          if (localFiles) setFiles(JSON.parse(localFiles));
        }
      } catch {
        const localFiles = localStorage.getItem('v5files');
        if (localFiles) setFiles(JSON.parse(localFiles));
      }
    } catch (err) {
      console.warn('Loading fallback data from localStorage if offline', err);
      const localPlans = localStorage.getItem('v5plans');
      if (localPlans) setPlans(JSON.parse(localPlans));
    }
  };

  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setDriveAccessToken(result.accessToken);
        alert(`Berjaya log masuk sebagai ${result.user.displayName || result.user.email}!\nIntegrasi Google Drive diaktifkan untuk folder SK Rompin.`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Gagal log masuk dengan Google: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setDriveAccessToken(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNewPlan = () => {
    const newPlan = createDefaultPlan();
    setCurrentPlan(newPlan);
    setActiveTab('form');
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      const token = user ? await user.getIdToken() : '';
      let saved = currentPlan;

      try {
        const res = await fetch('/api/plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(currentPlan),
        });

        const result = await safeParseJson<{ plan?: PlanRecord }>(res);
        if (result && result.plan) {
          saved = result.plan;
        }
      } catch (networkErr) {
        console.warn('Server /api unavailable; saving to localStorage', networkErr);
      }

      setPlans((prev) => {
        const index = prev.findIndex((p) => p.planId === saved.planId);
        let updated: PlanRecord[];
        if (index >= 0) {
          updated = [...prev];
          updated[index] = saved;
        } else {
          updated = [saved, ...prev];
        }
        localStorage.setItem('v5plans', JSON.stringify(updated));
        return updated;
      });
      setCurrentPlan(saved);

      alert('Pelan operasi berjaya disimpan!');
    } catch (error: any) {
      alert(`Ralat: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPlan = (plan: PlanRecord) => {
    setCurrentPlan(plan);
    setActiveTab('form');
  };

  const handleDuplicatePlan = async (plan: PlanRecord) => {
    const duplicated: PlanRecord = {
      ...plan,
      planId: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      program: `${plan.program} (Salinan)`,
    };
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });
      const result = await safeParseJson<{ plan?: PlanRecord }>(res);
      const toAdd = result?.plan || duplicated;
      setPlans((prev) => {
        const next = [toAdd, ...prev];
        localStorage.setItem('v5plans', JSON.stringify(next));
        return next;
      });
      alert('Salinan pelan berjaya dibuat!');
    } catch {
      setPlans((prev) => {
        const next = [duplicated, ...prev];
        localStorage.setItem('v5plans', JSON.stringify(next));
        return next;
      });
      alert('Salinan pelan berjaya dibuat!');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Adakah anda pasti ingin memadam pelan ini?')) {
      return;
    }
    try {
      await fetch(`/api/plans/${planId}`, { method: 'DELETE' }).catch(() => {});
    } finally {
      setPlans((prev) => {
        const next = prev.filter((p) => p.planId !== planId);
        localStorage.setItem('v5plans', JSON.stringify(next));
        return next;
      });
      if (currentPlan.planId === planId) {
        handleNewPlan();
      }
      alert('Pelan berjaya dipadam.');
    }
  };

  // Direct Image Upload Handler
  const handleDirectImageUpload = async (file: File): Promise<string | void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const newFile: DatabaseFile = {
          fileId: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64Data,
          category: 'evidens',
          planId: currentPlan.planId,
          uploadedBy: user?.displayName || user?.email || 'Warga Sekolah',
          createdAt: new Date().toISOString(),
        };

        try {
          const res = await fetch('/api/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              size: file.size,
              type: file.type,
              data: base64Data,
              category: 'evidens',
              planId: currentPlan.planId,
            }),
          });
          const data = await safeParseJson<{ file?: DatabaseFile }>(res);
          const savedFile = data?.file || newFile;
          setFiles((prev) => {
            const next = [savedFile, ...prev];
            localStorage.setItem('v5files', JSON.stringify(next));
            return next;
          });
        } catch {
          setFiles((prev) => {
            const next = [newFile, ...prev];
            localStorage.setItem('v5files', JSON.stringify(next));
            return next;
          });
        }
        resolve(base64Data);
      };
      reader.onerror = () => resolve();
      reader.readAsDataURL(file);
    });
  };

  // Dashboard & PDCA Evidens File Upload with Google Drive Auto-Sync
  const handleUploadFile = async (file: File, category = 'dashboard', planId?: string): Promise<DatabaseFile | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        // Attempt Google Drive upload if token is available
        let driveData: { driveFileId?: string; driveWebViewLink?: string } = {};
        const token = driveAccessToken || (await getAccessToken());
        if (token) {
          try {
            const driveRes = await uploadFileToDrive(file, token);
            driveData = {
              driveFileId: driveRes.id,
              driveWebViewLink: driveRes.webViewLink || `https://drive.google.com/file/d/${driveRes.id}/view`,
            };
          } catch (dErr) {
            console.warn('Google Drive auto upload error:', dErr);
          }
        }

        const newFile: DatabaseFile = {
          fileId: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64Data,
          category,
          planId: planId || null,
          uploadedBy: user?.displayName || user?.email || 'Warga Sekolah',
          driveFileId: driveData.driveFileId,
          driveWebViewLink: driveData.driveWebViewLink,
          createdAt: new Date().toISOString(),
        };

        try {
          const res = await fetch('/api/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              size: file.size,
              type: file.type,
              data: base64Data,
              category,
              planId: planId || null,
              uploadedBy: user?.displayName || user?.email || 'Warga Sekolah',
            }),
          });
          const json = await safeParseJson<{ file?: DatabaseFile }>(res);
          const savedFile: DatabaseFile = {
            ...(json?.file || newFile),
            driveFileId: driveData.driveFileId,
            driveWebViewLink: driveData.driveWebViewLink,
          };
          setFiles((prev) => {
            const next = [savedFile, ...prev];
            localStorage.setItem('v5files', JSON.stringify(next));
            return next;
          });

          if (driveData.driveWebViewLink) {
            alert(`Fail "${file.name}" berjaya disimpan dan dimuat naik terus ke Google Drive SK Rompin!`);
          } else {
            alert(`Fail "${file.name}" berjaya disimpan!`);
          }
          resolve(savedFile);
        } catch {
          setFiles((prev) => {
            const next = [newFile, ...prev];
            localStorage.setItem('v5files', JSON.stringify(next));
            return next;
          });
          alert(`Fail "${file.name}" berjaya disimpan!`);
          resolve(newFile);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleSyncSingleFileToDrive = async (file: DatabaseFile): Promise<boolean> => {
    let token = driveAccessToken || (await getAccessToken());
    if (!token) {
      try {
        const signinRes = await googleSignIn();
        if (signinRes) {
          token = signinRes.accessToken;
          setDriveAccessToken(token);
          setUser(signinRes.user);
        } else {
          return false;
        }
      } catch (e: any) {
        alert('Sila log masuk dengan akaun Google untuk menyegerakkan ke Google Drive: ' + e.message);
        return false;
      }
    }

    try {
      const driveRes = await uploadFileToDrive(
        { name: file.name, type: file.type, data: file.data },
        token
      );
      setFiles((prev) =>
        prev.map((f) =>
          f.fileId === file.fileId
            ? {
                ...f,
                driveFileId: driveRes.id,
                driveWebViewLink: driveRes.webViewLink || `https://drive.google.com/file/d/${driveRes.id}/view`,
              }
            : f
        )
      );
      alert(`Fail "${file.name}" berjaya dimuat naik ke folder Google Drive SK Rompin!`);
      return true;
    } catch (err: any) {
      alert(`Gagal memuat naik ke Google Drive: ${err.message}`);
      return false;
    }
  };

  const handleSyncAllToDrive = async () => {
    let token = driveAccessToken || (await getAccessToken());
    if (!token) {
      try {
        const signinRes = await googleSignIn();
        if (signinRes) {
          token = signinRes.accessToken;
          setDriveAccessToken(token);
          setUser(signinRes.user);
        } else {
          return;
        }
      } catch (e: any) {
        alert('Sila log masuk dengan akaun Google untuk menyegerakkan ke Google Drive: ' + e.message);
        return;
      }
    }

    if (files.length === 0) {
      alert('Tiada fail dalam pangkalan data untuk disegerakkan.');
      return;
    }

    setIsSyncingDrive(true);
    let successCount = 0;
    try {
      for (const file of files) {
        try {
          const driveRes = await uploadFileToDrive(
            { name: file.name, type: file.type, data: file.data },
            token
          );
          successCount++;
          setFiles((prev) =>
            prev.map((f) =>
              f.fileId === file.fileId
                ? {
                    ...f,
                    driveFileId: driveRes.id,
                    driveWebViewLink: driveRes.webViewLink || `https://drive.google.com/file/d/${driveRes.id}/view`,
                  }
                : f
            )
          );
        } catch (err) {
          console.error(`Gagal memuat naik ${file.name} ke Drive:`, err);
        }
      }
      alert(`Selesai! ${successCount} daripada ${files.length} fail telah berjaya dimuat naik ke folder Google Drive:\n${TARGET_DRIVE_FOLDER_URL}`);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Padam fail ini dari pangkalan data?')) return;
    try {
      const res = await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
      }
    } catch {
      setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
    }
  };

  // PDCA Update
  const handleOpenPdca = (plan: PlanRecord, stage: PdcaStage) => {
    setActivePdcaPlan(plan);
    setActivePdcaStage(stage);
  };

  const handleSavePdca = async (stage: PdcaStage, progress: number, pdcaData: PdcaData) => {
    if (!activePdcaPlan) return;
    const planId = activePdcaPlan.planId;
    const strData = JSON.stringify(pdcaData);

    try {
      await fetch(`/api/plans/${planId}/pdca`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          progress,
          pdcaData: strData,
        }),
      }).catch(() => {});
    } catch {}

    setPlans((prev) => {
      const next = prev.map((p) =>
        p.planId === planId
          ? { ...p, pdcaStage: stage, pdcaProgress: progress, pdcaData: strData }
          : p
      );
      localStorage.setItem('v5plans', JSON.stringify(next));
      return next;
    });

    if (currentPlan.planId === planId) {
      setCurrentPlan((prev) => ({
        ...prev,
        pdcaStage: stage,
        pdcaProgress: progress,
        pdcaData: strData,
      }));
    }
    alert(`Kemajuan PDCA bagi peringkat ${stage} berjaya disimpan!`);
  };

  // School Settings Save
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('v5settings', JSON.stringify(settings));

      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
        const saved = await safeParseJson<{ settings?: SchoolSettings }>(res);
        if (saved?.settings) {
          setSettings(saved.settings);
        }
      } catch {}

      alert('Tetapan sekolah berjaya disimpan!');
    } catch {
      alert('Ralat menyimpan tetapan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Backup and Restore
  const handleBackup = () => {
    const data = { plans, settings, files, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup-ePelan-SK-Rompin-${currentPlan.tahun || '2026'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.plans) setPlans(parsed.plans);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.files) setFiles(parsed.files);
        alert('Data berjaya diimport!');
      } catch {
        alert('Fail JSON tidak sah.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#eef2f5] text-slate-800 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNew={handleNewPlan}
        onSave={handleSavePlan}
        onPrint={() => window.print()}
        onBackup={handleBackup}
        onRestore={handleRestore}
        isSaving={isSaving}
        settings={settings}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-12">
        {activeTab === 'form' && (
          <FormTab
            plan={currentPlan}
            setPlan={setCurrentPlan}
            settings={settings}
            onUploadImage={handleDirectImageUpload}
          />
        )}

        {activeTab === 'dash' && (
          <DashboardTab
            plans={plans}
            files={files}
            onEdit={handleEditPlan}
            onDuplicate={handleDuplicatePlan}
            onDelete={handleDeletePlan}
            onOpenPdca={handleOpenPdca}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
            onSyncFileToDrive={handleSyncSingleFileToDrive}
            onSyncAllToDrive={handleSyncAllToDrive}
            isSyncingDrive={isSyncingDrive}
            driveAccessToken={driveAccessToken}
            onLoginGoogle={handleLogin}
          />
        )}

        {activeTab === 'book' && (
          <BookTab
            plans={plans}
            settings={settings}
            year={currentPlan.tahun}
          />
        )}

        {activeTab === 'set' && (
          <SettingsTab
            settings={settings}
            setSettings={setSettings}
            onSave={handleSaveSettings}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'ref' && <RpmTab />}

        {activeTab === 'guide' && <GuideTab setActiveTab={setActiveTab} />}
      </main>

      {/* Interactive PDCA Tracking Modal */}
      {activePdcaPlan && (
        <PdcaModal
          plan={activePdcaPlan}
          initialStage={activePdcaStage}
          onClose={() => setActivePdcaPlan(null)}
          onSave={handleSavePdca}
          onUploadFile={handleUploadFile}
          onSyncFileToDrive={handleSyncSingleFileToDrive}
          files={files}
        />
      )}
    </div>
  );
}

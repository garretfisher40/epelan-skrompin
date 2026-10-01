// server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { getPlans, getPlanById, upsertPlan, updatePlanPdca, deletePlanById } from './src/db/plans.ts';
import { getSchoolSettings, saveSchoolSettings } from './src/db/settings.ts';
import { getFiles, saveFile, deleteFileById } from './src/db/files.ts';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Enable large payload limits for direct image & file database storage
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- API Endpoints ---

// 1. Auth synchronization
app.post('/api/auth/sync', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { uid, email, displayName } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID dan e-mel diperlukan.' });
    }
    const user = await getOrCreateUser(uid, email, displayName);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error in /api/auth/sync:', error);
    res.status(500).json({ error: error.message || 'Ralat penyelarasan pengguna' });
  }
});

// 2. Plans CRUD
app.get('/api/plans', async (_req, res) => {
  try {
    const allPlans = await getPlans();
    res.json(allPlans);
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: error.message || 'Gagal memuatkan pelan operasi' });
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await getPlanById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Pelan tidak dijumpai' });
    }
    res.json(plan);
  } catch (error: any) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: error.message || 'Gagal memuatkan pelan' });
  }
});

app.post('/api/plans', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const planData = req.body;
    if (!planData.program || !planData.unit || !planData.panitia) {
      return res.status(400).json({ error: 'Sila lengkapkan maklumat asas pelan (Program, Unit, Panitia).' });
    }
    if (!planData.planId) {
      planData.planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    if (req.user) {
      planData.createdBy = req.user.email || req.user.uid;
    }
    const saved = await upsertPlan(planData);
    res.json({ success: true, plan: saved });
  } catch (error: any) {
    console.error('Error saving plan:', error);
    res.status(500).json({ error: error.message || 'Gagal menyimpan pelan operasi' });
  }
});

// 3. PDCA Progress Tracking (PLAN, DO, CHECK, ACT)
app.patch('/api/plans/:id/pdca', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { stage, progress, pdcaData } = req.body;
    const planId = req.params.id;

    if (!stage) {
      return res.status(400).json({ error: 'Tahap PDCA (PLAN, DO, CHECK, ACT) diperlukan.' });
    }

    const updated = await updatePlanPdca(
      planId,
      stage,
      typeof progress === 'number' ? progress : 25,
      typeof pdcaData === 'object' ? JSON.stringify(pdcaData) : pdcaData || ''
    );

    if (!updated) {
      return res.status(404).json({ error: 'Pelan tidak ditemui.' });
    }

    res.json({ success: true, plan: updated });
  } catch (error: any) {
    console.error('Error updating PDCA:', error);
    res.status(500).json({ error: error.message || 'Gagal mengemas kini status PDCA' });
  }
});

app.delete('/api/plans/:id', optionalAuth, async (req, res) => {
  try {
    const deleted = await deletePlanById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Pelan tidak dijumpai' });
    }
    res.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: error.message || 'Gagal memadam pelan' });
  }
});

// 4. School Settings
app.get('/api/settings', async (_req, res) => {
  try {
    const current = await getSchoolSettings();
    res.json(current);
  } catch (error: any) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: error.message || 'Gagal memuatkan tetapan sekolah' });
  }
});

app.post('/api/settings', optionalAuth, async (req, res) => {
  try {
    const saved = await saveSchoolSettings(req.body);
    res.json({ success: true, settings: saved });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: error.message || 'Gagal menyimpan tetapan sekolah' });
  }
});

// 5. Files & Images Direct Database Uploads
app.get('/api/files', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const planId = req.query.planId as string | undefined;
    const fileList = await getFiles(category, planId);
    res.json(fileList);
  } catch (error: any) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: error.message || 'Gagal memuatkan senarai fail' });
  }
});

app.post('/api/files', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { name, size, type, data, category, planId } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: 'Nama fail dan data diperlukan.' });
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const saved = await saveFile({
      fileId,
      name,
      size: size || data.length,
      type: type || 'application/octet-stream',
      data,
      category: category || 'dashboard',
      planId: planId || null,
      uploadedBy: req.user?.email || 'Warga Sekolah',
    });

    res.json({ success: true, file: saved });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message || 'Gagal menyimpan fail ke pangkalan data' });
  }
});

app.delete('/api/files/:id', optionalAuth, async (req, res) => {
  try {
    const deleted = await deleteFileById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Fail tidak dijumpai' });
    }
    res.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: error.message || 'Gagal memadam fail' });
  }
});

// 6. Gemini Multi-turn Chatbot API (gemini-3.5-flash)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Mesej diperlukan.' });
    }

    const formattedContents = messages.map((m: { role: string; content?: string; text?: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.text || '' }]
    }));

    const systemInstruction = `Anda ialah Pembantu Pintar AI e-Pelan Operasi & PDCA SK Rompin berteraskan Rancangan Pendidikan Malaysia (RPM 2026–2035) dan garis panduan Kementerian Pendidikan Malaysia (KPM).
Peranan anda:
1. Membimbing guru, ketua panitia, dan pentadbir sekolah merangka Pelan Operasi berkualiti tinggi yang menepati format KPM.
2. Menerangkan konsep dan fasa kitaran PDCA (Plan, Do, Check, Act) serta mencadangkan evidens yang relevan (seperti kertas kerja, borang saringan, instrumen pentaksiran, dan laporan bergambar).
3. Membantu merangka Objektif SMART, KPI kuantitatif, strategi pelaksanaan, dan cadangan penambahbaikan bagi pelbagai panitia (Bahasa Melayu, Bahasa Inggeris, Matematik, Sains, Pendidikan Muzik, dsb.).
4. Menjawab segala persoalan berkaitan pengurusan kualiti sekolah, SKPM Kualiti@Sekolah, dan pengurusan kewangan PCG.
Gunakan bahasa Melayu yang profesional, sopan, mesra pendidik, berstruktur rapi, dan mudah diaplikasikan terus ke dalam sistem.`;

    const models = ['gemini-2.5-flash', 'gemini-3.1-flash-lite-preview', 'gemini-3-flash-preview', 'gemini-flash-latest'];
    let reply = '';
    let lastError: any = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed in /api/chat, trying fallback...`, err.message);
      }
    }

    if (!reply) {
      throw lastError || new Error('Semua model Gemini tidak dapat diakses pada masa ini.');
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error.message || 'Gagal berkomunikasi dengan model Gemini',
      reply: 'Maaf, terdapat gangguan perkhidmatan sementara ketika memproses soalan anda. Sila cuba sebentar lagi.',
    });
  }
});

// --- Frontend Mounting (Vite in dev, static in prod) ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

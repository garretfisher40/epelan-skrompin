// src/db/files.ts
import { db } from './index.ts';
import { files } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface FileRecord {
  id?: number;
  fileId: string;
  planId?: string | null;
  name: string;
  size: number;
  type: string;
  data: string;
  category?: string | null;
  uploadedBy?: string | null;
  createdAt?: Date | null;
}

let inMemoryFiles: FileRecord[] = [];

export async function getFiles(category?: string, planId?: string): Promise<FileRecord[]> {
  try {
    let query = db.select().from(files).orderBy(desc(files.createdAt));
    const all = await query;
    return all.filter((f) => {
      if (category && f.category !== category) return false;
      if (planId && f.planId !== planId) return false;
      return true;
    });
  } catch (error) {
    console.warn('Database offline/socket unavailable; using in-memory store for getFiles');
    return inMemoryFiles.filter((f) => {
      if (category && f.category !== category) return false;
      if (planId && f.planId !== planId) return false;
      return true;
    });
  }
}

export async function saveFile(fileData: FileRecord): Promise<FileRecord> {
  const recordToSave: FileRecord = {
    ...fileData,
    planId: fileData.planId || null,
    category: fileData.category || 'dashboard',
    uploadedBy: fileData.uploadedBy || 'Pengguna',
    createdAt: new Date(),
  };

  try {
    const res = await db
      .insert(files)
      .values({
        fileId: recordToSave.fileId,
        planId: recordToSave.planId,
        name: recordToSave.name,
        size: recordToSave.size,
        type: recordToSave.type,
        data: recordToSave.data,
        category: recordToSave.category,
        uploadedBy: recordToSave.uploadedBy,
      })
      .returning();
    if (res[0]) return res[0];
  } catch (error) {
    console.warn('Database saveFile failed, saving to in-memory store');
  }

  inMemoryFiles.unshift(recordToSave);
  return recordToSave;
}

export async function deleteFileById(fileId: string): Promise<FileRecord | null> {
  try {
    const res = await db.delete(files).where(eq(files.fileId, fileId)).returning();
    if (res[0]) return res[0];
  } catch (error) {
    console.warn(`Database deleteFileById failed for ${fileId}, removing from in-memory store`);
  }

  const idx = inMemoryFiles.findIndex((f) => f.fileId === fileId);
  if (idx >= 0) {
    return inMemoryFiles.splice(idx, 1)[0];
  }
  return null;
}

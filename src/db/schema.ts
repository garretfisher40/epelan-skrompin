// src/db/schema.ts
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('guru'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  planId: text('plan_id').notNull().unique(),
  tahun: text('tahun').notNull(),
  unit: text('unit').notNull(),
  panitia: text('panitia').notNull(),
  isu: text('isu'),
  teras: text('teras'),
  strategi: text('strategi'),
  prakarsa: text('prakarsa'),
  program: text('program').notNull(),
  matlamat: text('matlamat'),
  objektif: text('objektif'),
  kpi: text('kpi'),
  sasaranKpi: text('sasaran_kpi'),
  tempoh: text('tempoh'),
  sasaran: text('sasaran'),
  tanggungjawab: text('tanggungjawab'),
  proses: text('proses'),
  kewangan: text('kewangan'),
  kekangan: text('kekangan'),
  pemantauan: text('pemantauan'),
  penilaian: text('penilaian'),
  penambahbaikan: text('penambahbaikan'),
  evidens: text('evidens'),
  gambarUrl: text('gambar_url'),
  pdcaStage: text('pdca_stage').default('PLAN'), // PLAN, DO, CHECK, ACT, SELESAI
  pdcaProgress: integer('pdca_progress').default(25),
  pdcaData: text('pdca_data'), // JSON string of PDCA timeline & details
  createdBy: text('created_by'),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique().default('school_settings'),
  schoolName: text('school_name').notNull(),
  place: text('place').notNull(),
  gb: text('gb'),
  pk: text('pk'),
  kp: text('kp'),
  motto: text('motto'),
  logoUrl: text('logo_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  fileId: text('file_id').notNull().unique(),
  planId: text('plan_id'),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  type: text('type').notNull(),
  data: text('data').notNull(), // Base64 Data URL
  category: text('category').default('dashboard'), // dashboard, evidens, logo
  uploadedBy: text('uploaded_by'),
  createdAt: timestamp('created_at').defaultNow(),
});

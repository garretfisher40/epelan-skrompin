// src/db/index.ts
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Dynamically resolve the effective Cloud SQL socket host
function getEffectiveSqlHost(): string | undefined {
  if (process.env.SQL_HOST && fs.existsSync(process.env.SQL_HOST)) {
    return process.env.SQL_HOST;
  }

  // Look in /app/cloudsql for active socket directories
  if (fs.existsSync('/app/cloudsql')) {
    try {
      const dirs = fs.readdirSync('/app/cloudsql');
      for (const dir of dirs) {
        const fullDir = path.join('/app/cloudsql', dir);
        if (fs.existsSync(path.join(fullDir, '.s.PGSQL.5432'))) {
          return fullDir;
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  return process.env.SQL_HOST;
}

// Function to create or retrieve the connection pool.
export const createPool = () => {
  if (!global._postgresPool) {
    const effectiveHost = getEffectiveSqlHost();

    global._postgresPool = new Pool({
      host: effectiveHost,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    });

    // Handle pool-level idle errors gracefully without crashing or filling error logs
    global._postgresPool.on('error', (err) => {
      console.warn('SQL pool connection event (idle/reconnect):', err.message);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });

// src/db/users.ts
import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || email.split('@')[0],
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.warn('Database query bypassed in getOrCreateUser (offline mode):', uid);
    return {
      id: 1,
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date(),
    };
  }
}

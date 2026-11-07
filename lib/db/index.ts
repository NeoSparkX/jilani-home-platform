
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production' && typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
    console.warn('⚠️ DATABASE_URL is not defined in the environment variables');
}

// Creates a serverless-safe connection pool that supports transactions
const pool = new Pool({ 
    connectionString: connectionString || 'postgresql://placeholder:placeholder@localhost:5432/placeholder' 
});

export const db = drizzle(pool, { schema });
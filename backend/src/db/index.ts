import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL!;

// Configure connection pool using node-postgres
const pool = new Pool({
    connectionString,
    max: 50,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    maxUses: 7500,
    keepAlive: true
});

// Add error handling
pool.on('error', (err) => {
    console.error('[DB Pool Error]:', err);
});

// Create drizzle instance
const db = drizzle(pool, { schema });

// Add health check function
export const checkDbConnection = async () => {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('[DB Health Check Error]:', error);
        return false;
    }
};

export default db;
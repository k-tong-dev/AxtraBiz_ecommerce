import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

// Database connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

async function runMigration() {
  try {
    console.log('🚀 Running Drizzle migration automatically...');
    
    // Read the migration file
    const migrationPath = join(process.cwd(), 'drizzle/migrations/0001_mysterious_spot.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split SQL by statement breakpoints and execute
    const statements = migrationSQL.split('--> statement-breakpoint');
    
    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (cleanStatement && !cleanStatement.startsWith('--')) {
        console.log('Executing:', cleanStatement.substring(0, 50) + '...');
        await client.unsafe(cleanStatement);
      }
    }
    
    console.log('✅ Migration applied successfully!');
    
    // Verify products table has new columns
    const result = await client`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `;
    
    console.log('\n📋 Products table columns after migration:');
    console.table(result);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

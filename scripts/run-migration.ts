import postgres from 'postgres'
import fs from 'fs'
import path from 'path'

const migrationFile = path.join(process.cwd(), 'drizzle/migrations/0002_great_hairball.sql')
const sql = fs.readFileSync(migrationFile, 'utf-8')

// Split SQL by statement-breakpoint
const statements = sql.split('--> statement-breakpoint').filter(s => s.trim())

// Use DATABASE_URL from environment (set by Vercel or local .env)
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!dbUrl) {
  console.error('DATABASE_URL or POSTGRES_URL environment variable is not set')
  console.error('Please set the environment variable or run the migration manually through Supabase dashboard')
  process.exit(1)
}

const sqlClient = postgres(dbUrl, { onnotice: () => {} })

async function runMigration() {
  console.log('Running migration...')
  
  for (const statement of statements) {
    try {
      await sqlClient.unsafe(statement.trim())
      console.log('✓ Executed statement')
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        console.log('⚠ Statement skipped (already exists)')
      } else {
        console.error('✗ Error executing statement:', err.message)
        console.error('Statement:', statement.substring(0, 100))
      }
    }
  }
  
  await sqlClient.end()
  console.log('Migration completed')
}

runMigration()

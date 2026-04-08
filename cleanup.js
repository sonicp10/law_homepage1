
const { Client } = require('pg');

async function cleanup() {
  const connectionString = "postgresql://postgres.cohwnsibntxvwwgjxggx:zms!@7ghkdth@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase...');
    
    // Drop all tables in public schema
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO postgres');
    await client.query('GRANT ALL ON SCHEMA public TO public');
    
    console.log('Database cleaned successfully.');
    
    // Verify
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Current tables:', res.rows);
    
  } catch (err) {
    console.error('FAILED TO CLEANUP:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

cleanup();

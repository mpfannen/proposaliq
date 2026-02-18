// Quick script to validate your Supabase .env configuration
require('dotenv').config();

console.log('\n=================================');
console.log('ProposalIQ - Environment Validation');
console.log('=================================\n');

const requiredVars = {
  'DB_HOST': process.env.DB_HOST,
  'DB_PORT': process.env.DB_PORT,
  'DB_NAME': process.env.DB_NAME,
  'DB_USER': process.env.DB_USER,
  'DB_PASSWORD': process.env.DB_PASSWORD,
  'JWT_SECRET': process.env.JWT_SECRET,
  'PORT': process.env.PORT,
};

let allValid = true;

console.log('Checking required environment variables...\n');

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.log(`❌ ${key}: MISSING`);
    allValid = false;
  } else {
    // Hide passwords and secrets
    const displayValue = ['DB_PASSWORD', 'JWT_SECRET'].includes(key)
      ? '***' + value.slice(-4)
      : value;
    console.log(`✅ ${key}: ${displayValue}`);
  }
}

console.log('\n---------------------------------');

// Supabase-specific checks
if (process.env.DB_HOST && !process.env.DB_HOST.includes('supabase.co')) {
  console.log('⚠️  Warning: DB_HOST does not look like a Supabase host');
  console.log('   Expected: db.xxxxxx.supabase.co');
  console.log('   Got: ' + process.env.DB_HOST);
}

if (process.env.DB_NAME !== 'postgres') {
  console.log('⚠️  Warning: For Supabase, DB_NAME should be "postgres"');
  console.log('   Got: ' + process.env.DB_NAME);
}

if (process.env.DB_USER !== 'postgres') {
  console.log('⚠️  Warning: For Supabase, DB_USER should be "postgres"');
  console.log('   Got: ' + process.env.DB_USER);
}

console.log('---------------------------------\n');

if (allValid) {
  console.log('✅ All required variables are set!\n');
  console.log('Next step: Test connection with:');
  console.log('   npm run dev\n');
} else {
  console.log('❌ Some variables are missing!\n');
  console.log('Please update your .env file.\n');
  process.exit(1);
}

// Test database connection
console.log('Testing database connection...\n');

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

pool.query('SELECT NOW() as now', (err, result) => {
  if (err) {
    console.log('❌ Database connection FAILED!\n');
    console.log('Error:', err.message);
    console.log('\nPlease check:');
    console.log('1. DB_HOST is correct (from Supabase)');
    console.log('2. DB_PASSWORD is correct');
    console.log('3. Your internet connection is working');
    console.log('4. Supabase project is not paused\n');
    process.exit(1);
  } else {
    console.log('✅ Database connection SUCCESSFUL!\n');
    console.log('Server time:', result.rows[0].now);
    console.log('\n🎉 Everything is configured correctly!\n');
    console.log('You can now run: npm run dev\n');
    process.exit(0);
  }
});

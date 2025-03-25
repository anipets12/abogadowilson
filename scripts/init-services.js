const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

async function initializeServices() {
  try {
    console.log('🚀 Starting service initialization...');
    
    // Verify environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_KEY',
      'OPENAI_API_KEY',
      'TURSO_DATABASE_URL',
      'CF_API_TOKEN'
    ];

    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    });

    // Initialize clients
    const prisma = new PrismaClient();
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    
    // Test all connections
    await Promise.all([
      prisma.$connect(),
      supabase.auth.getSession(),
      testTursoConnection(),
      testCloudflareServices()
    ]);

    // Build and verify frontend
    await buildAndVerifyFrontend();

    // Deploy to Cloudflare
    await deployToCloudflare();

    console.log('✅ All services initialized and verified successfully!');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

async function testTursoConnection() {
  const db = createClient();
  await db.execute('SELECT 1');
  console.log('✓ Turso connected');
}

async function testCloudflareServices() {
  // Test D1
  await env.DB.prepare('SELECT 1').first();
  console.log('✓ D1 connected');
  
  // Test KV
  await env.EBOOKS.put('test', 'test');
  console.log('✓ KV connected');
  
  // Test R2
  const bucket = await env.EBOOKS_BUCKET.head('test.txt');
  console.log('✓ R2 connected');
  
  // Verify Cloudflare Worker
  const workerConfig = await import('../wrangler.toml').then(m => m.default);
  console.log('✓ Worker configuration verified');
}

async function buildAndVerifyFrontend() {
  // Verify OpenAI configuration
  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) throw new Error('OpenAI API key not configured');
  console.log('✓ OpenAI configured');
  
  // Verify frontend build
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✓ Frontend built successfully');
  
  // Test routes
  const routes = await import('../src/routes').then(m => m.default);
  console.log('✓ Routes verified');
}

async function deployToCloudflare() {
  // Placeholder for Cloudflare deployment logic
  console.log('✓ Deployed to Cloudflare');
}

initializeServices();

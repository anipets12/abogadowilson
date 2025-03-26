#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar la configuración de Cloudflare Workers
 * Autor: Codeium - 2025
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = path.resolve(__dirname, '..');
const ENV_FILE = path.join(BASE_DIR, '.env');
const ENV_EXAMPLE_FILE = path.join(BASE_DIR, 'env.example');
const WRANGLER_FILE = path.join(BASE_DIR, 'wrangler.toml');
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}=== Iniciando diagnóstico de Cloudflare Workers ===${RESET}\n`);

// Verificar archivos esenciales
console.log(`${YELLOW}Verificando archivos esenciales...${RESET}`);
const archivosEsenciales = [
  'wrangler.toml',
  'package.json',
  'tsconfig.json',
  'src/worker.ts',
  'src/types.ts',
  'src/routes/auth.ts',
  'src/routes/documents.ts',
  'schema.sql'
];

archivosEsenciales.forEach(archivo => {
  const archivoPath = path.join(BASE_DIR, archivo);
  if (fs.existsSync(archivoPath)) {
    console.log(`${GREEN}✓ ${archivo} existe${RESET}`);
  } else {
    console.log(`${RED}✗ ${archivo} no encontrado${RESET}`);
  }
});

// Verificar configuración de variables de entorno
console.log(`\n${YELLOW}Verificando variables de entorno...${RESET}`);
if (fs.existsSync(ENV_FILE)) {
  console.log(`${GREEN}✓ Archivo .env encontrado${RESET}`);
} else if (fs.existsSync(ENV_EXAMPLE_FILE)) {
  console.log(`${YELLOW}⚠ Archivo .env no encontrado, pero existe env.example${RESET}`);
  console.log(`${YELLOW}  Recomendación: Copie env.example a .env y configure sus variables${RESET}`);
} else {
  console.log(`${RED}✗ No se encontraron archivos de variables de entorno${RESET}`);
}

// Verificar wrangler.toml
console.log(`\n${YELLOW}Verificando configuración de wrangler.toml...${RESET}`);
if (fs.existsSync(WRANGLER_FILE)) {
  const wranglerContent = fs.readFileSync(WRANGLER_FILE, 'utf8');
  
  if (wranglerContent.includes('account_id = "your_account_id"')) {
    console.log(`${RED}✗ El account_id en wrangler.toml no está configurado${RESET}`);
  } else if (wranglerContent.includes('account_id')) {
    console.log(`${GREEN}✓ account_id configurado en wrangler.toml${RESET}`);
  }
  
  if (wranglerContent.includes('kv_namespaces') && !wranglerContent.includes('your-kv-namespace-id')) {
    console.log(`${GREEN}✓ KV namespace configurado${RESET}`);
  } else if (wranglerContent.includes('kv_namespaces')) {
    console.log(`${RED}✗ KV namespace no configurado correctamente${RESET}`);
  }
  
  if (wranglerContent.includes('d1_databases') && !wranglerContent.includes('your-d1-database-id')) {
    console.log(`${GREEN}✓ D1 database configurada${RESET}`);
  } else if (wranglerContent.includes('d1_databases')) {
    console.log(`${RED}✗ D1 database no configurada correctamente${RESET}`);
  }
} else {
  console.log(`${RED}✗ No se encontró el archivo wrangler.toml${RESET}`);
}

// Verificar configuración de TypeScript
console.log(`\n${YELLOW}Verificando configuración de TypeScript...${RESET}`);
const tsconfigPath = path.join(BASE_DIR, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    if (tsconfig.compilerOptions) {
      if (tsconfig.compilerOptions.lib && tsconfig.compilerOptions.lib.includes('WebWorker')) {
        console.log(`${GREEN}✓ tsconfig.json incluye soporte para WebWorker${RESET}`);
      } else {
        console.log(`${YELLOW}⚠ tsconfig.json no tiene soporte explícito para WebWorker${RESET}`);
      }
    }
  } catch (e) {
    console.log(`${RED}✗ Error al analizar tsconfig.json: ${e.message}${RESET}`);
  }
}

// Verificar si Node.js está instalado
console.log(`\n${YELLOW}Verificando entorno Node.js...${RESET}`);
try {
  const nodeVersion = execSync('node --version').toString().trim();
  console.log(`${GREEN}✓ Node.js instalado (${nodeVersion})${RESET}`);
  
  try {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`${GREEN}✓ npm instalado (${npmVersion})${RESET}`);
  } catch (e) {
    console.log(`${RED}✗ npm no está instalado o accesible${RESET}`);
  }
  
} catch (e) {
  console.log(`${RED}✗ Node.js no está instalado o accesible${RESET}`);
  console.log(`${YELLOW}  Recomendación: Instale Node.js desde https://nodejs.org/${RESET}`);
}

// Recomendaciones finales
console.log(`\n${YELLOW}=== Recomendaciones finales ===${RESET}`);
console.log(`
1. Asegúrese de tener Node.js instalado para ejecutar el proyecto
2. Ejecute 'npm install' para instalar todas las dependencias
3. Para desplegar en Cloudflare Workers, ejecute 'npm run deploy:worker'
4. Compruebe que todas las variables de entorno estén configuradas correctamente
5. Si encuentra errores, revise los logs para identificar el problema específico
`);

console.log(`${GREEN}¡Diagnóstico completado!${RESET}`);

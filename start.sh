#!/bin/bash

# Limpiar caché y módulos
rm -rf node_modules/.cache
rm -rf node_modules/.vite

# Instalar solo dependencias de producción
npm ci --production

# Generar cliente Prisma
npx prisma generate

# Iniciar servidor
npm run dev

#!/bin/bash
# Script para el proceso de build personalizado
echo "Ejecutando npm install en lugar de npm ci..."
npm install
npm run build

#!/bin/bash
npm run build
git add .
git commit -m "Commit origin: Cloudflare ready, no errors"
git push origin main
wrangler deploy
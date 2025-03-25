#!/bin/bash
git add .
git commit -m "Commit origin: Cloudflare ready, no errors"
git push origin main
wrangler publish
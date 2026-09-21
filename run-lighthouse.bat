@echo off
cd /d "G:\aplicacion reportes"
npx lighthouse http://localhost:8080 --preset=desktop --only-categories=pwa --output=json --output-path=lighthouse-result.json

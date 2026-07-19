#!/bin/bash
set -e
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  pnpm install
fi
tsc_bin="./node_modules/.bin/tsc"
"$tsc_bin" -b
exec ./node_modules/.bin/vite --port 3003

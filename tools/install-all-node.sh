#!/usr/bin/env bash
set -e

ROOT=$(pwd)

find . -type f -name "package.json" | while read pkg; do
  DIR=$(dirname "$pkg")
  echo "\n📦 Installing in $DIR"
  cd "$ROOT/$DIR"
  npm install --silent
  cd "$ROOT"
done

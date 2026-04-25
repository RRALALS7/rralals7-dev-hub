#!/usr/bin/env bash
set -u

ROOT=$(pwd)
FAIL=0

printf "🚀 Installing all Node projects...\n\n"

while IFS= read -r pkg; do
  DIR=$(dirname "$pkg")
  printf "\n📦 Installing in %s\n" "$DIR"

  cd "$ROOT/$DIR" || {
    printf "❌ Failed to enter %s\n" "$DIR"
    FAIL=1
    cd "$ROOT" || exit 1
    continue
  }

  if npm install; then
    printf "✅ Install OK in %s\n" "$DIR"
  else
    printf "❌ Install FAILED in %s\n" "$DIR"
    FAIL=1
  fi

  cd "$ROOT" || exit 1
done < <(find . -type f -name "package.json" | sort)

printf "\n"

if [ "$FAIL" -eq 1 ]; then
  printf "⚠️ One or more Node project installs failed. Check the project marked with ❌ above.\n"
  exit 1
fi

printf "✅ All Node project installs completed successfully.\n"

#!/usr/bin/env bash
set +e
set +u

ROOT="$(pwd)"
FAIL=0

printf "Installing all Node projects...\n"

PKG_LIST="$(find . -type f -name package.json | sort)"

for pkg in $PKG_LIST; do
  DIR="$(dirname "$pkg")"
  printf "\nInstalling in %s\n" "$DIR"

  cd "$ROOT/$DIR"
  CD_STATUS=$?

  if [ "$CD_STATUS" -ne 0 ]; then
    printf "FAILED_TO_ENTER %s exit=%s\n" "$DIR" "$CD_STATUS"
    FAIL=1
    cd "$ROOT"
    continue
  fi

  npm install
  NPM_STATUS=$?

  if [ "$NPM_STATUS" -ne 0 ]; then
    printf "INSTALL_FAILED %s exit=%s\n" "$DIR" "$NPM_STATUS"
    FAIL=1
  else
    printf "INSTALL_OK %s\n" "$DIR"
  fi

  cd "$ROOT"
done

printf "\nInstall summary status=%s\n" "$FAIL"

if [ "$FAIL" -ne 0 ]; then
  exit 1
fi

exit 0

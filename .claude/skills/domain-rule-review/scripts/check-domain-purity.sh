#!/usr/bin/env bash
# check-domain-purity.sh [dir ...]
# Flags clock reads (Date.now(), new Date() with no argument, performance.now()) in the
# non-test TypeScript files under each dir (default: src). Prints one `file:line: ...` per hit.
# Exit 0 when clean, 1 when a clock read was found, 2 on a bad argument.
set -u

dirs=("$@")
[ ${#dirs[@]} -eq 0 ] && dirs=(src)
for dir in "${dirs[@]}"; do
  [ -d "$dir" ] || { echo "check-domain-purity: no such directory: $dir" >&2; exit 2; }
done

pattern='Date\.now[[:space:]]*\(|new[[:space:]]+Date[[:space:]]*\([[:space:]]*\)|performance\.now[[:space:]]*\('
hits=$(grep -rnE --include='*.ts' --exclude='*.test.ts' "$pattern" "${dirs[@]}")

if [ -n "$hits" ]; then
  printf '%s\n' "$hits" | sed -E 's/^([^:]+:[0-9]+):[[:space:]]*(.*)$/\1: clock read in a pure rule: \2/'
  exit 1
fi
echo "check-domain-purity: clean (${dirs[*]})"

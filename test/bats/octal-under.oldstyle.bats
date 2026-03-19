#!/usr/bin/env bats

setup() {
  TMPDIR=$(mktemp -d)
}

teardown() {
  rm -rf "$TMPDIR"
}

@test "ESLint converts old octal literal to decimal" {
  ORIGINAL_FILE="$TMPDIR/original.js"
  echo "const foo = 01000;" > "$ORIGINAL_FILE"

  EXPECTED_FILE="$TMPDIR/expected.js"
  echo "const foo = 01000;" > "$EXPECTED_FILE"

  FIXED_FILE="$TMPDIR/fixed.js"
  run npx eslint "$ORIGINAL_FILE" \
    --rule "'hex-under/octal-under': 'error'" \
    --parser-options '{ "ecmaVersion": 2025, "sourceType": "script" }' \
    --fix 

  cp "$ORIGINAL_FILE" "$FIXED_FILE"

  run diff -u "$EXPECTED_FILE" "$FIXED_FILE"
  if [ "$status" -ne 0 ]; then
    echo "ESLint failed"
    echo "$output"
    return 1
  fi
}
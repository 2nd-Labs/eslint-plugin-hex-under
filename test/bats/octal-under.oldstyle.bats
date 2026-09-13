#!/usr/bin/env bats

setup() {
  TMP_DIR="$(mktemp -d "$BATS_TEST_DIRNAME/.tmp.XXXXXX")"
}

teardown() {
  rm -rf "$TMP_DIR"
}

@test "ESLint ignores old octal literal" {
  ORIGINAL_FILE="$TMP_DIR/original.js"
  echo "const foo = 01000;" > "$ORIGINAL_FILE"

  EXPECTED_FILE="$TMP_DIR/expected.js"
  echo "const foo = 01000;" > "$EXPECTED_FILE"

  FIXED_FILE="$TMP_DIR/fixed.js"
  run npx eslint "$ORIGINAL_FILE" \
    --rule "'hex-under/octal-under': 'error'" \
    --parser-options '{ "ecmaVersion": 2025, "sourceType": "script" }' \
    --fix \
    --config test/bats/bats-eslint.config.js

  cp "$ORIGINAL_FILE" "$FIXED_FILE"

  run diff -u "$EXPECTED_FILE" "$FIXED_FILE"
  if [ "$status" -ne 0 ]; then
    echo "ESLint failed"
    echo "$output"
    return 1
  fi
}

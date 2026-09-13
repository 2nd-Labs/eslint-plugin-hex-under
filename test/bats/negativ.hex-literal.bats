#!/usr/bin/env bats

setup() {
  TMP_DIR="$(mktemp -d "$BATS_TEST_DIRNAME/.tmp.XXXXXX")"
}

teardown() {
  rm -rf "$TMP_DIR"
}

@test "negativ: ungültiges Hex-Literal wird erkannt" {
  ORIGINAL_FILE="$TMP_DIR/original.js"
  echo "const foo = 0x1_2_3_;" > "$ORIGINAL_FILE"

  run npx eslint "$ORIGINAL_FILE" --rule "'hex-under/hex-under': 'error'" --fix --config test/bats/bats-eslint.config.js

  # Status muss Fehler sein (1)
  [ "$status" -eq 1 ]
  # Ausgabe muss auf Fehler hinweisen
  echo "$output" | grep -q "Parsing error"
}

#!/usr/bin/env bats

TMP_DIR="${TMP_DIR:-$BATS_TEST_DIRNAME/tmp}"

setup() {
  mkdir -p "$TMP_DIR"
}

teardown() {
  rm -rf "$TMP_DIR"
}

run_fixture() {
  local input="$1"
  local filename fixture_name expected

  filename="${input##*/}"
  fixture_name="${filename%.js}"
  expected="$BATS_TEST_DIRNAME/fixture/skip-bigints/${fixture_name}.fixed.js"

  cp "$input" "$TMP_DIR/input.js"

  run npx eslint --rule "'hex-under/hex-under': ['error', { checkBigInt: false }]" --fix "$TMP_DIR/input.js" --config test/bats/bats-eslint.config.js
  if [ "$status" -ne 0 ]; then
    echo "ESLint failed for $fixture_name"
    echo "$output"
    return 1
  fi

  diff -u "$TMP_DIR/input.js" "$expected" || {
    echo -e "\nFixture failed: $fixture_name"
    echo -e "\nExpected:"
    cat "$expected"
    echo -e "\nGot:"
    cat "$TMP_DIR/input.js"
    return 1
  }
}

@test "fixture: example.skip-bigints.js" {
  run_fixture "$BATS_TEST_DIRNAME/fixture/skip-bigints/example.skip-bigints.js"
}

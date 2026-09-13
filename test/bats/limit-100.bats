#!/usr/bin/env bats

setup() {
  TMP_DIR="$(mktemp -d)"
}

teardown() {
  rm -rf "$TMP_DIR"
}

run_fixture() {
  local input="$1"
  local filename fixture_name expected

  filename="${input##*/}"
  fixture_name="${filename%.js}"
  expected="$BATS_TEST_DIRNAME/fixture/limit/${fixture_name}.fixed.js"

  cp "$input" "$TMP_DIR/input.js"

  run npx eslint \
    --rule "'hex-under/hex-under': ['error', { limit: 100 }]" \
    --fix "$TMP_DIR/input.js" \
    --config test/bats/bats-eslint.config.js

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

@test "fixture: example.limit-100.js" {
  run_fixture "$BATS_TEST_DIRNAME/fixture/limit/example.limit-100.js"
}

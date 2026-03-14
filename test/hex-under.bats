#!/usr/bin/env bats

setup() {
  mkdir -p tmp
}

teardown() {
  rm -rf tmp
}

run_fixture() {
  local fixture="$1"
  local fixture_name
  fixture_name=$(basename "$fixture" .js)

  echo "Testing fixture: $fixture_name"

  cp "$fixture" tmp/input.js

  run npx eslint --fix tmp/input.js
  [ "$status" -eq 0 ]

  diff tmp/input.js "$BATS_TEST_DIRNAME/../fixture/${fixture_name}.fixed.js" || {
    echo "Fixture failed: $fixture_name"
    echo "Expected:"
    cat "$BATS_TEST_DIRNAME/../fixture/${fixture_name}.fixed.js"
    echo "Got:"
    cat tmp/input.js
    return 1
  }
}

@test "fixture: no-var" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example.js"
}

@test "fixture: arrow-spacing" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example2.js"
}

@test "fixture: semi" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example3.js"
}

@test "fixture: semi" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example4.js"
}

@test "fixture: semi" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example5.js"
}

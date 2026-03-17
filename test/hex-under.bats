#!/usr/bin/env bats

setup() {
  mkdir -p tmp
}

teardown() {
  rm -rf tmp
}

run_fixture() {
  local input="$1"
  local filename fixture_name expected

  filename="${input##*/}"        
  fixture_name="${filename%.js}" 
  expected="$BATS_TEST_DIRNAME/../fixture/${fixture_name}.fixed.js"

  cp "$input" tmp/input.js

  run npx eslint --fix tmp/input.js
  if [ "$status" -ne 0 ]; then
    echo "ESLint failed for $fixture_name"
    echo "$output"
    return 1
  fi

  diff -u tmp/input.js "$expected" || {
    echo -e "\nFixture failed: $fixture_name"
    echo -e "\nExpected:"
    cat "$expected"
    echo -e "\nGot:"
    cat tmp/input.js
    return 1
  }
}

@test "fixture: example.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example.js"
}

@test "fixture: example2.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example2.js"
}

@test "fixture: example3.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example3.js"
}

@test "fixture: example4.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example4.js"
}

@test "fixture: example5.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example5.js"
}

@test "fixture: example6.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example6.js"
}

@test "fixture: example7.js" {
  run_fixture "$BATS_TEST_DIRNAME/../fixture/example7.js"
}
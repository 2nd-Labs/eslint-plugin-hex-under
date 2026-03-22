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
  expected="$BATS_TEST_DIRNAME/fixture/standard/${fixture_name}.fixed.js"

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

@test "fixture: example.comments.js" {
  run_fixture "$BATS_TEST_DIRNAME/fixture/standard/example.comments.js"
}

@test "fixture: example.comments.full.js" {
  run_fixture "$BATS_TEST_DIRNAME/fixture/standard/example.comments.full.js"
}

@test "fixture: example.comments.full.binary.js" {
  run_fixture "$BATS_TEST_DIRNAME/fixture/standard/example.comments.full.binary.js"
}

@test "fixture: example.comments.full.octal.js" {
  run_fixture "$BATS_TEST_DIRNAME/fixture/standard/example.comments.full.octal.js"
}

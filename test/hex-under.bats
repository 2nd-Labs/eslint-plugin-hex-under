#!/usr/bin/env bats

setup() {
  mkdir -p tmp
}

teardown() {
  rm -rf tmp
}

@test "eslint --fix fixes all fixtures correctly" {
  for fixture in "$BATS_TEST_DIRNAME/../fixture/"*.js; do
    [[ "$fixture" == *.fixed.js ]] && continue

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
  done
}

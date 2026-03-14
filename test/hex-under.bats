#!/usr/bin/env bats

setup() {
  mkdir -p tmp
}

teardown() {
  rm -rf tmp
}

for fixture in "$BATS_TEST_DIRNAME/../fixture/"*.js; do
  [[ "$fixture" == *.fixed.js ]] && continue

  fixture_name=$(basename "$fixture" .js)

  @test "eslint --fix fixes $fixture_name correctly" {
    cp "$fixture" tmp/input.js
    run npx eslint --fix tmp/input.js
    [ "$status" -eq 0 ]
    diff tmp/input.js "$BATS_TEST_DIRNAME/../fixture/${fixture_name}.fixed.js" || {
      echo "Expected:"
      cat "$BATS_TEST_DIRNAME/../fixture/${fixture_name}.fixed.js"
      echo "Got:"
      cat tmp/input.js
      return 1
    }
  }
done

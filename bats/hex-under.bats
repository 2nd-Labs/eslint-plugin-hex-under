#!/usr/bin/env bats

setup() {
  mkdir -p tmp
  cp "$BATS_TEST_DIRNAME/../fixture/example.js" tmp/input.js
}

teardown() {
  rm -rf tmp
}

@test "eslint --fix wandelt Hexadezimalzahlen korrekt um" {
  run npx eslint --fix tmp/input.js
  [ "$status" -eq 0 ]
  diff tmp/input.js "$BATS_TEST_DIRNAME/../fixture/example.fixed.js" || {
    echo "Expected:"
    cat "$BATS_TEST_DIRNAME/../fixture/example.fixed.js"
    echo "Got:"
    cat tmp/input.js
    return 1
  }
}

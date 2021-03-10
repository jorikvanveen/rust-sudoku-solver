cargo test &&
~/.cargo/bin/wasm-pack test --chrome &&
~/.cargo/bin/wasm-pack build --debug --target no-modules &&
rm -rfv sudoku_custom_react/src/pkg &&
cp ./pkg sudoku_custom_react/src -rv
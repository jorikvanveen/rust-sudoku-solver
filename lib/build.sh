cargo test &&
~/.cargo/bin/wasm-pack test --node &&
~/.cargo/bin/wasm-pack build --out-dir ../public/wasm --release --target no-modules &&
cp ../public/wasm/bettersudoku.d.ts ../src

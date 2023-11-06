# Agent Protocol CLI

## Introduction

This is a cross-platform CLI tool for the agent protocol.

## Execution

Prerequisites: make sure `cargo` and `rust` are available.

To execute the tool, run:

```rust
cargo build
cargo run -h
```

## Formatting

More about code formatting, see [rustfmt](https://github.com/rust-lang/rustfmt)

```rust
rustup toolchain install nightly
rustup component add rustfmt --toolchain nightly
cargo +nightly fmt
```
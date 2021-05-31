git clone https://github.com/input-output-hk/cardano-node
cd cardano-node
nix-build -A scripts.mainnet.node -o mainnet-node-local
./mainnet-node-local
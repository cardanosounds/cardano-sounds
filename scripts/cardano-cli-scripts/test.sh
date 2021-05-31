#!/bin/bash
./cardano-node run \
        --config ./config/testnet/testnet-config.json \
        --topology ./config/testnet/testnet-topology.json \
        --database-path ./db/testnet \
        --socket-path ./node-ipc/testnet/node.socket \
        --port 3001


export CARDANO_NODE_PATH=../../
alias cardano-cli=$CARDANO_NODE_PATH/cardano-cli
export CARDANO_NODE_SOCKET_PATH=$CARDANO_NODE_PATH/node-ipc/testnet/node.socket
export NETWORK_ID="--testnet-magic 1097911063"

./cardano-cli address build \
            --testnet-magic 1097911063 \
            --payment-verification-key-file pay.vkey \
            --out-file pay.addr

./cardano-cli query tip --shelley-mode --testnet-magic 1097911063


export NETWORK_ID="--testnet-magic 1097911063"

export CARDANO_NODE_SOCKET_PATH=./node-ipc/mainnet/node.socket

export PAYMENT_ADDR=$(cat payment.addr)

./cardano-cli query utxo $NETWORK_ID --address $PAYMENT_ADDR

export UTXO=$(./cardano-cli query utxo $NETWORK_ID --address $PAYMENT_ADDR | tail -n1 | awk '{print $1;}')
export UTXO_TXIX=$(./cardano-cli query utxo $NETWORK_ID --address $PAYMENT_ADDR | tail -n1 | awk '{print $2;}')
echo
echo "UTxO: $UTXO#$UTXO_TXIX"


./cardano-cli transaction build-raw \
--tx-in 78a23a3085b1a49dce886adbc559070a0b9c347a9c7cbe5610d0f4940e2ade39#0 \
--tx-out addr1q94ze7435cdhqtnv766z7sfq44qa4zl98ss8swjhdjf9d44l3u2t9x0p243q3p5zly57p6mq7srjwjss54akkx3wuprqnua8cq+10283656 \
--invalid-hereafter 0 \
--fee 0 \
--out-file tx.draft


./cardano-cli transaction calculate-min-fee \
--tx-body-file tx.draft \
--tx-in-count 1 \
--tx-out-count 1 \
--witness-count 1 \
--byron-witness-count 0 \
$NETWORK_ID \
--protocol-params-file protocol.json

171045

./cardano-cli query tip $NETWORK_ID 

29975046

./cardano-cli transaction build-raw \
--tx-in 78a23a3085b1a49dce886adbc559070a0b9c347a9c7cbe5610d0f4940e2ade39#0 \
--tx-out addr1q94ze7435cdhqtnv766z7sfq44qa4zl98ss8swjhdjf9d44l3u2t9x0p243q3p5zly57p6mq7srjwjss54akkx3wuprqnua8cq+10283656 \
--invalid-hereafter 29975046 \
--fee 171045 \
--out-file tx.raw

./cardano-cli transaction sign \
--tx-body-file tx.raw \
--signing-key-file payment.skey \
$NETWORK_ID \
--out-file tx.signed

./cardano-cli transaction submit \
--tx-file tx.signed \
$NETWORK_ID
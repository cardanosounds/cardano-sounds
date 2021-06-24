#!/usr/bin/env bash
export CARDANO_NODE_PATH=~/cardano-node-1.27.0

alias cardano-cli=/home/azureuser/cardano-node-1.27.0/cardano-cli
  
export CARDANO_NODE_SOCKET_PATH=/home/azureuser/cardano-node-1.27.0/node-ipc/testnet/node.socket

export TESTNET_MAGIC=1097911063

#!/usr/bin/env bash
shopt -s expand_aliases
#source ~/.bash_aliases

INDEX=0
TOTALADA=1000000000
SEND=20000000
UTXO=b626268819bde1f2b0d659463cd245831ae4dfab8a05ff66d7e10a73bb3b38de

cardano-cli query tip --testnet-magic $TESTNET_MAGIC > tip.json

CURRENTSLOT=$(jq ".slot" tip.json)

echo $UTXO
echo $CURRENTSLOT
LEFT=`expr $TOTALADA - $SEND`

cardano-cli transaction build-raw \
--tx-in $UTXO#0 \
--tx-out $(< ./address)+$SEND \
--tx-out $(< ./address-2)+$LEFT \
--ttl `expr $CURRENTSLOT + 100` \
--fee 167965 \
--out-file "tx$index.raw"



cardano-cli query utxo --testnet-magic $TESTNET_MAGIC --address $(< ./addresss)
#!/bin/bash 


export NETWORK_ID="--testnet-magic 1097911063" #--mainnet

while getopts p:s: flag
do
    case "${flag}" in
        p) policy=${OPTARG};;
        s) adaPrice=${OPTARG};;
    esac
done

if [ -z "$policy" ]
  then
	printf '%s\n' "You need to provide policy hash" >&2  # write error message to stderr
    exit 1
fi

if [ -z "$adaPrice" ]
  then
  	adaPrice = 50
fi
         
#EXAMPLE CONFIG FILE
cat <<EOF | tee test.json
{
	"recipient": "addr1q96ytcs0pyhwqumwthym2mvhjpg8a2h964tp94t5e3dry7uzdaa7xl9m343qfqefu5yhffj2vedtrf37469ah0gdrmxssqqcky",
  "sellerAdd": "addr1q96ytcs0pyhwqumwthym2mvhjpg8a2h964tp94t5e3dry7uzdaa7xl9m343qfqefu5yhffj2vedtrf37469ah0gdrmxssqqcky",
	"buyTxHash" : "m2mvhjpg8a2h964tp94t5e3dry7uzdaa7xl9m343qfqefu5yhf",
	"txValue": 50000000,
	"tokenName" : "nftsound#{ID}"
	"txix": "0",
	"metadata" : {
	  	"$policy": {
	    	"0": {
		      	"name": "nftsound#{ID}",
		      	"data": "ipfs://QmcRepZKPHQDMNgerj3Rb7g6EtTipt9TDgd5ZcRgYjsAF2",
		      	"md5": "4af67afb3f35a0e6ac6bac8d005dd573"
				"type": "sound"		
	    	}
	  	}
	}
}
EOF

#set variables
sendToAddress = jq '.address' test.json
sellerAdd = jq '.sellerAdd' test.json
transactionHash = jq '.txhash' test.json
txix = jq '.txix' test.json
metadata = jq '.metadata' test.json
tokenName = jq '.tokenName' test.json
txValue = jq '.txValue' test.json
lovelacePrice = $(expr 50 * 1000000)
minLove = 2000000
sendBack = $(expr ($txValue - $lovelacePrice) + $minLove)

currentSlot = ./cardano-cli query tip $NETWORK_ID | jq '.slot'

txValidTo = $(expr $currentSlot + 200)

#build tx without fee first
./cardano-cli transaction build-raw \
  --mary-era \
  --fee 0 \
  --tx-in $transactionHash#$txix \
  --tx-out "$sendToAddress"+"$sendBack"+1 "$policy.$tokenName" \
  --tx-out "$sellerAdd"+"$lovelacePrice" \
  --mint=1 "$policy.$tokenName" \
  --metadata-json-file policy/nft_metadata.json \
  --invalid-hereafter=$txValidTo \
  --out-file matx"$sendToAddress".raw \
  --minting-script-file policy/nft_policy.script

#calculate fee
minFee = $(./cardano-cli transaction calculate-min-fee \
  --tx-body-file matx"$sendToAddress".raw \
  --tx-in-count 1 \
  --tx-out-count 2 \
  --witness-count 1 \
  $NETWORK_ID \
  --protocol-params-file protocol.json)

minFee = ">${minFee%%[[:space:]]*}<"

#build tx with feee
./cardano-cli transaction build-raw \
  --mary-era \
  --fee $minFee \
  --tx-in $transactionHash#$txix \
  --tx-out "$sendToAddress"+"$sendBack"+1 "$policy.$tokenName" \
  --tx-out "$sellerAdd"+"$lovelacePrice" \
  --mint=1 "$policy.$tokenName" \
  --metadata-json-file policy/nft_metadata.json \
  --invalid-hereafter=$txValidTo \
  --out-file matx"$transactionHash".raw \
  --minting-script-file policy/nft_policy.script

#sign tx
./cardano-cli transaction sign \
--signing-key-file payment.skey \
--signing-key-file policy/nft_policy.skey \
$NETWORK_ID \
--tx-body-file matx"$transactionHash".raw \
--out-file matx"$transactionHash".signed

#send to MAINNET / TESTNET
./cardano-cli transaction submit --tx-file  matx"$transactionHash".signed $NETWORK_ID
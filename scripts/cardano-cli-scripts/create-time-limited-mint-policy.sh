#!/bin/bash 

while getopts m:n: flag
do
    case "${flag}" in
        m) minuteValidity=${OPTARG};;
        n) policyFileName=${OPTARG};;
    esac
done

if [ -z "$minuteValidity" ]
  then
	printf '%s\n' "You need to specify how many minutes policy will be valid" >&2  # write error message to stderr
    exit 1
fi

if [ -z "$policyFileName" ]
  then
  	policyFileName = "nft_policy"
fi

addSlots = $(expr $minuteValidity /* 60)

mkdir policy

./cardano-cli address key-gen --verification-key-file policy/"$policyFileName".vkey --signing-key-file policy/"$policyFileName".skey

touch policy/"$policyFileName".script

policyKeyhash = $(./cardano-cli address key-hash --payment-verification-key-file policy/"$policyFileName".vkey)

currentSlot = $(./cardano-cli query tip --shelley-mode --mainnet) | jq ".slotNo"

targetSlot = $currentSlot + $addSlots

cat <<EOF | tee policy/"$policyFileName".script
{
  "type": "all",
  "scripts": [
    {
      "keyHash": "$policyKeyhash",
      "type": "sig"
    },
    {
      "type": "before",
      "slot": "$targetSlot"
    }
  ]
}
EOF

echo $(./cardano-cli transaction policyid --script-file ./policy/"$policyFileName".script)
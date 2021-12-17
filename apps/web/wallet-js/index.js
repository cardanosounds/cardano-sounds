import Loader from "./loader";
import CoinSelection from "./coinSelection";
import { Buffer } from "buffer";
import { amountToValue, asciiToHex, assetsCount } from "./utils";


const Cardano = async () => {
  await Loader.load();
  return Loader.Cardano;
};

const ERROR = {
  txTooBig: "Transaction too big",
};

export { Buffer, Cardano };

class WalletJs {
  constructor(provider, apiKey, walletApi = undefined) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.walletApi = walletApi ? walletApi : window.cardano
  }
  async _blockfrostRequest(endpoint, headers, body) {
    return await fetch(this.provider + endpoint, {
      headers: {
        project_id: this.apiKey,
        ...headers,
        "User-Agent": "nami-wallet",
      },
      method: body ? "POST" : "GET",
      body,
    }).then((res) => res.json());
  }

  async getProtocolParameters() {
    if (this.protocolParameters) return this.protocolParameters;
    await Loader.load();
    const latest_block = await this._blockfrostRequest("/blocks/latest");

    const p = await this._blockfrostRequest(
      `/epochs/${latest_block.epoch}/parameters`
    );
    console.log(p);
    this.protocolParameters = {
      linearFee: Loader.Cardano.LinearFee.new(
        Loader.Cardano.BigNum.from_str(p.min_fee_a.toString()),
        Loader.Cardano.BigNum.from_str(p.min_fee_b.toString())
      ),
      minUtxo: Loader.Cardano.BigNum.from_str(p.min_utxo),
      poolDeposit: Loader.Cardano.BigNum.from_str(p.pool_deposit),
      keyDeposit: Loader.Cardano.BigNum.from_str(p.key_deposit),
      maxTxSize: p.max_tx_size,
      slot: latest_block.slot,
    };
    return this.protocolParameters;
  }

  async _addChange(change, txBuilder, address) {
    await Loader.load();
    const changeMultiAssets = change.multiasset();
    //estimated max multiasset size 5848
    //estimated max value size 5860
    //estimated max utxo size 5980
    const MULTIASSET_SIZE = 5848;
    const VALUE_SIZE = 5860;

    // check if change value is too big for single output
    if (changeMultiAssets && change.to_bytes().length * 2 > VALUE_SIZE) {
      const partialChange = Loader.Cardano.Value.new(
        Loader.Cardano.BigNum.from_str("0")
      );

      const partialMultiAssets = Loader.Cardano.MultiAsset.new();
      const policies = changeMultiAssets.keys();
      const makeSplit = () => {
        for (let j = 0; j < changeMultiAssets.len(); j++) {
          const policy = policies.get(j);
          const policyAssets = changeMultiAssets.get(policy);
          const assetNames = policyAssets.keys();
          const assets = Loader.Cardano.Assets.new();
          for (let k = 0; k < assetNames.len(); k++) {
            const policyAsset = assetNames.get(k);
            const quantity = policyAssets.get(policyAsset);
            assets.insert(policyAsset, quantity);
            //check size
            const checkMultiAssets = Loader.Cardano.MultiAsset.from_bytes(
              partialMultiAssets.to_bytes()
            );
            checkMultiAssets.insert(policy, assets);
            if (checkMultiAssets.to_bytes().length * 2 >= MULTIASSET_SIZE) {
              partialMultiAssets.insert(policy, assets);
              return;
            }
          }
          partialMultiAssets.insert(policy, assets);
        }
      };
      makeSplit();
      partialChange.set_multiasset(partialMultiAssets);
      const minAda = Loader.Cardano.min_ada_required(
        partialChange,
        this.protocolParameters.minUtxo
      );
      partialChange.set_coin(minAda);

      txBuilder.add_output(
        Loader.Cardano.TransactionOutput.new(
          Loader.Cardano.Address.from_bytes(address),
          partialChange
        )
      );
    }

    txBuilder.add_change_if_needed(Loader.Cardano.Address.from_bytes(address));
  }

  async normalTx(outputs, metadata) {
    await Loader.load();

    const _outputs = Loader.Cardano.TransactionOutputs.new();
    for (const output of outputs) {
      _outputs.add(
        Loader.Cardano.TransactionOutput.new(
          Loader.Cardano.Address.from_bech32(output.address),
          await amountToValue(output.amount)
        )
      );
    }
    const protocolParameters = await this.getProtocolParameters();
    const address = Buffer.from(
      (await this.walletApi.getUsedAddresses())[0],
      "hex"
    );
    const utxos = (await this.walletApi.getUtxos()).map((utxo) =>
      Loader.Cardano.TransactionUnspentOutput.from_bytes(
        Buffer.from(utxo, "hex")
      )
    );
    let totalAssets = 0;
    for (let i = 0; i < _outputs.len(); i++) {
      totalAssets += await assetsCount(_outputs.get(i).amount().multiasset());
    }
    CoinSelection.setProtocolParameters(
      protocolParameters.minUtxo.to_str(),
      protocolParameters.linearFee.coefficient().to_str(),
      protocolParameters.linearFee.constant().to_str(),
      protocolParameters.maxTxSize.toString()
    );
    const selection = await CoinSelection.randomImprove(
      utxos,
      _outputs,
      20 + totalAssets
    );
    const inputs = selection.input;
    const txBuilder = Loader.Cardano.TransactionBuilder.new(
      protocolParameters.linearFee,
      protocolParameters.minUtxo,
      protocolParameters.poolDeposit,
      protocolParameters.keyDeposit
    );

    for (let i = 0; i < inputs.length; i++) {
      const utxo = inputs[i];
      txBuilder.add_input(
        utxo.output().address(),
        utxo.input(),
        utxo.output().amount()
      );
    }

    for (let i = 0; i < _outputs.len(); i++) {
      txBuilder.add_output(_outputs.get(i));
    }

    let _metadata;
    if (metadata) {
      const generalMetadata = Loader.Cardano.GeneralTransactionMetadata.new();
      generalMetadata.insert(
        Loader.Cardano.BigNum.from_str("674"),
        Loader.Cardano.encode_json_str_to_metadatum(JSON.stringify(metadata))
      );
      const aux = Loader.Cardano.AuxiliaryData.new();
      aux.set_metadata(generalMetadata);
      _metadata = aux;

      txBuilder.set_auxiliary_data(metadata);
    }
    const change = selection.change;
    this._addChange(change, txBuilder, address);
    const transaction = Loader.Cardano.Transaction.new(
      txBuilder.build(),
      Loader.Cardano.TransactionWitnessSet.new(),
      _metadata
    );

    const size = transaction.to_bytes().length * 2;
    if (size > protocolParameters.maxTxSize) throw ERROR.txTooBig;

    return transaction;
  }

  async mintTx(assets, metadata, policy) {
    await Loader.load();
    const protocolParameters = await this.getProtocolParameters();
    const address = Buffer.from(
      (await this.walletApi.getUsedAddresses())[0],
      "hex"
    );
    const checkValue = await amountToValue(
      assets.map((asset) => ({
        unit: policy.id + asciiToHex(asset.name),
        quantity: asset.quantity,
      }))
    );
    const minAda = Loader.Cardano.min_ada_required(
      checkValue,
      protocolParameters.minUtxo
    );
    let value = Loader.Cardano.Value.new(Loader.Cardano.BigNum.from_str("0"));
    const _outputs = Loader.Cardano.TransactionOutputs.new();
    _outputs.add(
      Loader.Cardano.TransactionOutput.new(
        Loader.Cardano.Address.from_bytes(address),
        Loader.Cardano.Value.new(minAda)
      )
    );
    const utxos = (await this.walletApi.getUtxos()).map((utxo) =>
      Loader.Cardano.TransactionUnspentOutput.from_bytes(
        Buffer.from(utxo, "hex")
      )
    );
    CoinSelection.setProtocolParameters(
      protocolParameters.minUtxo.to_str(),
      protocolParameters.linearFee.coefficient().to_str(),
      protocolParameters.linearFee.constant().to_str(),
      protocolParameters.maxTxSize.toString()
    );
    const selection = await CoinSelection.randomImprove(utxos, _outputs, 20);

    const nativeScripts = Loader.Cardano.NativeScripts.new();
    nativeScripts.add(policy.script);

    const mintedAssets = Loader.Cardano.Assets.new();
    assets.forEach((asset) => {
      mintedAssets.insert(
        Loader.Cardano.AssetName.new(Buffer.from(asset.name)),
        Loader.Cardano.BigNum.from_str(asset.quantity)
      );
    });
    const mintedValue = Loader.Cardano.Value.new(
      Loader.Cardano.BigNum.from_str("0")
    );
    const multiAsset = Loader.Cardano.MultiAsset.new();
    multiAsset.insert(
      Loader.Cardano.ScriptHash.from_bytes(policy.script.hash().to_bytes()),
      mintedAssets
    );
    mintedValue.set_multiasset(multiAsset);
    value = value.checked_add(mintedValue);

    const mint = Loader.Cardano.Mint.new();
    const mintAssets = Loader.Cardano.MintAssets.new();
    assets.forEach((asset) => {
      mintAssets.insert(
        Loader.Cardano.AssetName.new(Buffer.from(asset.name)),
        Loader.Cardano.Int.new(Loader.Cardano.BigNum.from_str(asset.quantity))
      );
    });
    mint.insert(
      Loader.Cardano.ScriptHash.from_bytes(
        policy.script
          .hash(Loader.Cardano.ScriptHashNamespace.NativeScript)
          .to_bytes()
      ),
      mintAssets
    );

    const inputs = Loader.Cardano.TransactionInputs.new();
    selection.input.forEach((utxo) => {
      inputs.add(
        Loader.Cardano.TransactionInput.new(
          utxo.input().transaction_id(),
          utxo.input().index()
        )
      );
      value = value.checked_add(utxo.output().amount());
    });

    const rawOutputs = Loader.Cardano.TransactionOutputs.new();
    rawOutputs.add(
      Loader.Cardano.TransactionOutput.new(
        Loader.Cardano.Address.from_bytes(address),
        value
      )
    );
    const fee = Loader.Cardano.BigNum.from_str("0");

    const rawTxBody = Loader.Cardano.TransactionBody.new(
      inputs,
      rawOutputs,
      fee,
      policy.ttl
    );
    rawTxBody.set_mint(mint);

    let _metadata;
    if (metadata) {
      const generalMetadata = Loader.Cardano.GeneralTransactionMetadata.new();
      generalMetadata.insert(
        Loader.Cardano.BigNum.from_str("721"),
        Loader.Cardano.encode_json_str_to_metadatum(JSON.stringify(metadata))
      );
      const aux = Loader.Cardano.AuxiliaryData.new();
      aux.set_metadata(generalMetadata);
      _metadata = aux;

      rawTxBody.set_auxiliary_data_hash(
        Loader.Cardano.hash_auxiliary_data(_metadata)
      );
    }

    const witnesses = Loader.Cardano.TransactionWitnessSet.new();
    witnesses.set_native_scripts(nativeScripts);

    const dummyVkeyWitness =
      "8258208814c250f40bfc74d6c64f02fc75a54e68a9a8b3736e408d9820a6093d5e38b95840f04a036fa56b180af6537b2bba79cec75191dc47419e1fd8a4a892e7d84b7195348b3989c15f1e7b895c5ccee65a1931615b4bdb8bbbd01e6170db7a6831310c";

    const vkeys = Loader.Cardano.Vkeywitnesses.new();
    vkeys.add(
      Loader.Cardano.Vkeywitness.from_bytes(
        Buffer.from(dummyVkeyWitness, "hex")
      )
    );
    vkeys.add(
      Loader.Cardano.Vkeywitness.from_bytes(
        Buffer.from(dummyVkeyWitness, "hex")
      )
    );
    witnesses.set_vkeys(vkeys);

    const rawTx = Loader.Cardano.Transaction.new(
      rawTxBody,
      witnesses,
      _metadata
    );

    let minFee = Loader.Cardano.min_fee(rawTx, protocolParameters.linearFee);

    value = value.checked_sub(Loader.Cardano.Value.new(minFee));

    const outputs = Loader.Cardano.TransactionOutputs.new();
    outputs.add(
      Loader.Cardano.TransactionOutput.new(
        Loader.Cardano.Address.from_bytes(address),
        value
      )
    );

    const finalTxBody = Loader.Cardano.TransactionBody.new(
      inputs,
      outputs,
      minFee,
      policy.ttl
    );
    finalTxBody.set_mint(rawTxBody.multiassets());
    finalTxBody.set_auxiliary_data_hash(rawTxBody.auxiliary_data_hash());

    const finalWitnesses = Loader.Cardano.TransactionWitnessSet.new();
    finalWitnesses.set_native_scripts(nativeScripts);

    const transaction = Loader.Cardano.Transaction.new(
      finalTxBody,
      finalWitnesses,
      rawTx.auxiliary_data()
    );

    const size = transaction.to_bytes().length * 2;
    if (size > protocolParameters.maxTxSize) throw ERROR.txTooBig;

    return transaction;
  }

  async payTx(addr, adaAmount) {
    const cardano = this.walletApi
    const protocolParameters = await this.getProtocolParameters()
    const lovelace = (parseFloat(adaAmount) * 1000000).toString()
  
  
    const paymentAddr = Loader.Cardano.Address.from_bytes(Buffer.from(await cardano.getChangeAddress(), 'hex')).to_bech32()
    const rawUtxo = await cardano.getUtxos()
    const utxos = rawUtxo.map(u => Loader.Cardano.TransactionUnspentOutput.from_bytes(Buffer.from(u, 'hex')))
    const outputs = Loader.Cardano.TransactionOutputs.new()
  
    outputs.add(
      Loader.Cardano.TransactionOutput.new(
        Loader.Cardano.Address.from_bech32(addr),
        Loader.Cardano.Value.new(
          Loader.Cardano.BigNum.from_str(lovelace)
        )
      )
    )
  
    const MULTIASSET_SIZE = 5848;
    const VALUE_SIZE = 5860;
    const totalAssets = 0
    CoinSelection.setProtocolParameters(
      protocolParameters.minUtxo.to_str(),
      protocolParameters.linearFee.coefficient().to_str(),
      protocolParameters.linearFee.constant().to_str(),
      protocolParameters.maxTxSize.toString()
    );
  
    const selection = await CoinSelection.randomImprove(
      utxos,
      outputs,
      20 + totalAssets,
      protocolParameters.minUtxo.to_str()
    );
  
    const inputs = selection.input;
    const txBuilder = Loader.Cardano.TransactionBuilder.new(
      protocolParameters.linearFee,
      protocolParameters.minUtxo,
      protocolParameters.poolDeposit,
      protocolParameters.keyDeposit,
      5000,
      16384
    );
  
    for (let i = 0; i < inputs.length; i++) {
      const utxo = inputs[i];
      txBuilder.add_input(
        utxo.output().address(),
        utxo.input(),
        utxo.output().amount()
      );
    }
    txBuilder.add_output(Loader.Cardano.TransactionOutput.new(
      Loader.Cardano.Address.from_bech32(addr),
      Loader.Cardano.Value.new(
        Loader.Cardano.BigNum.from_str(lovelace)
      )
    ));
  
    const change = selection.change;
    const changeMultiAssets = change.multiasset();
  
    // check if change value is too big for single output
    if (changeMultiAssets && change.to_bytes().length * 2 > VALUE_SIZE) {
      const partialChange = Loader.Cardano.Value.new(
        Loader.Cardano.BigNum.from_str('0')
      );
  
      const partialMultiAssets = Loader.Cardano.MultiAsset.new();
      const policies = changeMultiAssets.keys();
      const makeSplit = () => {
        for (let j = 0; j < changeMultiAssets.len(); j++) {
          const policy = policies.get(j);
          const policyAssets = changeMultiAssets.get(policy);
          const assetNames = policyAssets.keys();
          const assets = Loader.Cardano.Assets.new();
          for (let k = 0; k < assetNames.len(); k++) {
            const policyAsset = assetNames.get(k);
            const quantity = policyAssets.get(policyAsset);
            assets.insert(policyAsset, quantity);
            //check size
            const checkMultiAssets = Loader.Cardano.MultiAsset.from_bytes(
              partialMultiAssets.to_bytes()
            );
            checkMultiAssets.insert(policy, assets);
            if (checkMultiAssets.to_bytes().length * 2 >= MULTIASSET_SIZE) {
              partialMultiAssets.insert(policy, assets);
              return;
            }
          }
          partialMultiAssets.insert(policy, assets);
        }
      };
      makeSplit();
      partialChange.set_multiasset(partialMultiAssets);
      const minAda = Loader.Cardano.min_ada_required(
        partialChange,
        protocolParameters.minUtxo
      );
      partialChange.set_coin(minAda);
  
      txBuilder.add_output(
        Loader.Cardano.TransactionOutput.new(
          Loader.Cardano.Address.from_bech32(paymentAddr),
          partialChange
        )
      );
    }
  
    txBuilder.add_change_if_needed(
      Loader.Cardano.Address.from_bech32(paymentAddr)
    );
  
    const transaction = Loader.Cardano.Transaction.new(
      txBuilder.build(),
      Loader.Cardano.TransactionWitnessSet.new(),
    );
  
    const size = transaction.to_bytes().length * 2;
    if (size > protocolParameters.maxTxSize) throw "Mmax tx size"
    return transaction  
    // const witneses = await cardano.signTx(Buffer.from(transaction.to_bytes(), 'hex').toString('hex'))
    // const signedTx = Loader.Cardano.Transaction.new(transaction.body(), Loader.Cardano.TransactionWitnessSet.from_bytes(Buffer.from(witneses, "hex"))) // ,transaction.metadata()
    // const txhash = await cardano.submitTx(Buffer.from(signedTx.to_bytes(), 'hex').toString('hex'))
  
    // return txhash
  }

  async signTx(transaction) {
    await Loader.load();
    const witnesses = await this.walletApi.signTx(
      Buffer.from(transaction.to_bytes(), "hex").toString("hex")
    );
    const txWitnesses = transaction.witness_set();
    const txVkeys = txWitnesses.vkeys();
    const txScripts = txWitnesses.native_scripts();

    const addWitnesses = Loader.Cardano.TransactionWitnessSet.from_bytes(
      Buffer.from(witnesses, "hex")
    );
    const addVkeys = addWitnesses.vkeys();
    const addScripts = addWitnesses.native_scripts();

    const totalVkeys = Loader.Cardano.Vkeywitnesses.new();
    const totalScripts = Loader.Cardano.NativeScripts.new();

    if (txVkeys) {
      for (let i = 0; i < txVkeys.len(); i++) {
        totalVkeys.add(txVkeys.get(i));
      }
    }
    if (txScripts) {
      for (let i = 0; i < txScripts.len(); i++) {
        totalScripts.add(txScripts.get(i));
      }
    }
    if (addVkeys) {
      for (let i = 0; i < addVkeys.len(); i++) {
        totalVkeys.add(addVkeys.get(i));
      }
    }
    if (addScripts) {
      for (let i = 0; i < addScripts.len(); i++) {
        totalScripts.add(addScripts.get(i));
      }
    }

    const totalWitnesses = Loader.Cardano.TransactionWitnessSet.new();
    totalWitnesses.set_vkeys(totalVkeys);
    totalWitnesses.set_native_scripts(totalScripts);

    const signedTx = await Loader.Cardano.Transaction.new(
      transaction.body(),
      totalWitnesses,
      transaction.auxiliary_data()
    );
    return signedTx;
  }

  async submitTx(signedTx) {
    const result = await this._blockfrostRequest(
      `/tx/submit`,
      { "Content-Type": "application/cbor" },
      Buffer.from(signedTx.to_bytes(), "hex")
    );
    return result;
    // const txHash = await window.cardano.submitTx(
    //   Buffer.from(signedTx.to_bytes(), "hex").toString("hex")
    // );
    // return txHash;
  }

  async awaitConfirmation(txHash) {
    return new Promise((res, rej) => {
      const confirmation = setInterval(async () => {
        const isConfirmed = await this._blockfrostRequest(`/txs/${txHash}`);
        console.log(isConfirmed);
        if (isConfirmed && !isConfirmed.error) {
          clearInterval(confirmation);
          res(txHash);
          return;
        }
      }, 5000);
    });
  }

  async baseAddressToBech32() {
    await Loader.load();
    const address = Buffer.from(
      (await this.walletApi.getUsedAddresses())[0],
      "hex"
    );
    return Loader.Cardano.BaseAddress.from_address(
      Loader.Cardano.Address.from_bytes(address)
    )
      .to_address()
      .to_bech32();
  }

  async createLockingPolicyScript() {
    const protocolParameters = await this.getProtocolParameters();
    const slot = parseInt(protocolParameters.slot);
    const ttl = slot + 1000;
    const address = Buffer.from(
      (await this.walletApi.getUsedAddresses())[0],
      "hex"
    );
    const paymentKeyHash = Loader.Cardano.BaseAddress.from_address(
      Loader.Cardano.Address.from_bytes(address)
    )
      .payment_cred()
      .to_keyhash();
    const nativeScripts = Loader.Cardano.NativeScripts.new();
    const script = Loader.Cardano.ScriptPubkey.new(paymentKeyHash);
    const nativeScript = Loader.Cardano.NativeScript.new_script_pubkey(script);
    const lockScript = Loader.Cardano.NativeScript.new_timelock_expiry(
      Loader.Cardano.TimelockExpiry.new(ttl)
    );
    nativeScripts.add(nativeScript);
    nativeScripts.add(lockScript);
    const finalScript = Loader.Cardano.NativeScript.new_script_all(
      Loader.Cardano.ScriptAll.new(nativeScripts)
    );
    const policyId = Buffer.from(
      Loader.Cardano.ScriptHash.from_bytes(
        finalScript.hash().to_bytes()
      ).to_bytes(),
      "hex"
    ).toString("hex");
    return { id: policyId, script: finalScript, ttl: ttl, paymentKeyHash: paymentKeyHash };
  }
}

export default WalletJs;

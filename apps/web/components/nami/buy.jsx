import React, { useState } from "react";
import dynamic from "next/dynamic";
import CoinSelection from '../../nami-js/coinSelection.js'
import { Buffer } from 'buffer'
// import Loader from '../../nami-js/loader'
// window.$ = window.jQuery = import("jquery");
let Loader = null


const _Buffer = Buffer



async function activateCardano() {
	console.log('connecting');
	await window.cardano?.enable()
}

async function blocks_latest() {
	return await fetch('https://cardano-mainnet.blockfrost.io/api/v0/blocks/latest', {
		headers: {
			'Content-Type': 'application/json',
			'project_id': 'GHf1olOJblaj5LD8rcRudajSJGKRU6IL'
		}
	}).then((response) =>  response.json()).catch((error) => error.response.data)
};


async function parameters() {
	return await fetch('https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest/parameters', {
		headers: {
			'Content-Type': 'application/json',
			'project_id': 'GHf1olOJblaj5LD8rcRudajSJGKRU6IL'
		}
	}).then((response) => response.json()).catch((error) => error.response.data)
};

async function getProtocolParameters() {
	// var HOST = process.env.API ? process.env.API : location.origin;
	const latest_block = await blocks_latest();

	var slotnumber = latest_block.slot;
	// await Loader.load()
	const p = await parameters()
	console.log("CardanoGlobal")
	var value = {
		linearFee: Loader.Cardano.LinearFee.new(
			Loader.Cardano.BigNum.from_str(p.min_fee_a.toString()),
			Loader.Cardano.BigNum.from_str(p.min_fee_b.toString())
		),
		minUtxo: Loader.Cardano.BigNum.from_str(p.min_utxo),
		poolDeposit: Loader.Cardano.BigNum.from_str(p.pool_deposit),
		keyDeposit: Loader.Cardano.BigNum.from_str(p.key_deposit),
		maxTxSize: p.max_tx_size,
		slot: slotnumber,
	};
	return value;
};


async function triggerPay() {
	try {
		activateCardano();
	} catch (e) {
		console.error(e);
	} finally {
		console.log('We do cleanup here');
	}
	
	var address = Loader.Cardano.Address.from_bytes(_Buffer.from(await cardano.getChangeAddress(), 'hex')).to_bech32()
	// var address = "addr1qyrsm4vj985epelhc8qpv8jahaqpjll7ed67647dk47ku4x5x8xk48yntkwhc2s20manmqartkchrp2qxgfwdaezsq5qlnprqj"
	
	return await pay(address, 1);
}

async function pay(addr, adaAmount) {
	const cardano = window.cardano
	const protocolParameters = await getProtocolParameters()
	const lovelace = (parseFloat(adaAmount) * 1000000).toString()


	const paymentAddr = Loader.Cardano.Address.from_bytes(_Buffer.from(await cardano.getChangeAddress(), 'hex')).to_bech32()
	const rawUtxo = await cardano.getUtxos()
	const utxos = rawUtxo.map(u => Loader.Cardano.TransactionUnspentOutput.from_bytes(_Buffer.from(u, 'hex')))
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
	const tempOut = outputs.get(0)
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

	const witneses = await cardano.signTx(_Buffer.from(transaction.to_bytes(), 'hex').toString('hex'))
	const signedTx = Loader.Cardano.Transaction.new(transaction.body(), Loader.Cardano.TransactionWitnessSet.from_bytes(_Buffer.from(witneses, "hex"))) // ,transaction.metadata()
	const txhash = await cardano.submitTx(_Buffer.from(signedTx.to_bytes(), 'hex').toString('hex'))

	return txhash
}

function Buy(wasm) {
	Loader = wasm
	const [activeNami, activateNami] = useState(false)
	const [showingError, showError] = useState(false)
	const activateCardano = async () => {
		window.$ = window.jQuery = import('jquery')
		console.log('connecting');
		await window.cardano?.enable()
		if((await window.cardano?.isEnabled()) == true) activateNami(true) 
	}
	const tryPay = async () => {
		try {
			await triggerPay()
		} 
		catch(error){
			showError(true)
			return
		}
	}
	React.useEffect(() => {
			window.$ = window.jQuery = import("jquery");

			// activateCardano();
		},
	[])
	return (
		<>	
		{activeNami ?
		 	<button type="button" onClick={async () => await tryPay()} tw="p-2 mt-4 pl-5 pr-5 bg-transparent border-2 border-beta-200 text-beta-200 text-lg rounded-lg transition-colors duration-700 transform hover:bg-beta-200 hover:text-beta-700 focus:border-4 focus:border-beta-700">Buy with Nami</button>
			
			 // <BuyButton/>
			// <button type="button" onClick={() => triggerPay()} tw="p-2 mt-4 pl-5 pr-5 bg-transparent border-2 border-beta-200 text-beta-200 text-lg rounded-lg transition-colors duration-700 transform hover:bg-beta-200 hover:text-beta-700 focus:border-4 focus:border-beta-700">Buy with Nami</button>
			:
			<button type="button" onClick={activateCardano} tw="p-2 mt-4 pl-5 pr-5 bg-transparent border-2 border-beta-200 text-beta-200 text-lg rounded-lg transition-colors duration-700 transform hover:bg-beta-200 hover:text-beta-700 focus:border-4 focus:border-beta-700">Connect Nami</button>
		}
		{showingError ? <p tw="text-sm">Creating transaction with Nami failed</p> : <></>}
		</>
	);

}

export default Buy;


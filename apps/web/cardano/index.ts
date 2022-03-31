import { Buffer } from 'buffer';
import AssetFingerprint from '@emurgo/cip14-js';
import { Transaction, TransactionUnspentOutput, BaseAddress, Value } from './custom_modules/@emurgo/cardano-serialization-lib-browser'
import { _txBuilder, _txBuilderMinting, _txBuilderSpendFromPlutusScript } from './transactions'
import { ProtocolParameters, UTxO } from './query-api'
import {
    MintedAsset,
    Policy,
    UTXO,
    AssetHolding,
    ValueHolding,
    WalletApi,
    Asset
} from './types';
import { walletConfig } from './wallet-config';
import TransactionParams from './types/TransactionParams';


export type CardanoWASM = typeof import('./custom_modules/@emurgo/cardano-serialization-lib-browser');

export class CardanoWallet {
    _walletApi: WalletApi | undefined
    private _wasm: CardanoWASM
    private _protocolParameter: ProtocolParameters | undefined

    public constructor(wasm: CardanoWASM) {
        this._wasm = wasm
    }

    public async enable(walletname: string) {
        this._walletApi = await (walletConfig as any)[walletname.toLowerCase()].enable()
        if (this._walletApi) {
            localStorage.setItem('cardano-web3-wallet', walletname)
            return true
        }
        else return false
    }

    public setWallet(walletApi: WalletApi) {
        this._walletApi = walletApi
    }

    public get lib() {
        return this._wasm
    }

    public get wallet() {
        return this._walletApi
    }

    isEnabled() {
        if (this.wallet) return true
        return false
    }

    async getBaseAddress(): Promise<BaseAddress | null> {
        if (!this.wallet) return null
        try {
            return await this.wallet.getChangeAddress()
        }
        catch (ex) {
            console.log('wallet.getBaseAddress: error')
            console.table(ex)
            return null
        }
    }

    async utxoFromData(output: UTxO, address: string): Promise<TransactionUnspentOutput> {
        let addr
        try {
            addr = this.lib.Address.from_bytes(Buffer.from(address, "hex"))
        }
        catch {
            addr = this.lib.Address.from_bech32(address)
    
        }
        console.log('output.txHash')
        console.log(output.txHash)
        return this.lib.TransactionUnspentOutput.new(
            this.lib.TransactionInput.new(
                this.lib.TransactionHash.from_bytes(
                    Buffer.from(output.txHash, 'hex')
                ),
                output.index
            ),
            this.lib.TransactionOutput.new(
                
                addr,
                await this.assetsToValue(output.assets, output.lovelace)
            )
        );
    };

    async assetsToValue(assets: {
        policyId: string;
        assetName: string;
        quantity: bigint;
    }[], lovelace: bigint): Promise<Value> {
        console.log('start assetsToValue')
        const multiAsset = this.lib.MultiAsset.new();
        const policies = [
            ...new Set(
                assets
                    .filter((asset) => asset.policyId !== '')
                    .map((asset) => asset.policyId)
            ),
        ];
        console.log('policies created in  assetsToValue')

        console.log('policies')
        console.log(policies)
        policies.forEach((policy) => {
            const policyAssets = assets.filter(
                (asset) => asset.policyId === policy
            );
            const assetsValue = this.lib.Assets.new();
            policyAssets.forEach((asset) => {
                console.log(asset.assetName)
                assetsValue.insert(
                    this.lib.AssetName.new(Buffer.from(asset.assetName, 'hex')),
                    this.lib.BigNum.from_str(asset.quantity.toString())
                );
            });
            multiAsset.insert(
                this.lib.ScriptHash.from_bytes(Buffer.from(policy, 'hex')),
                assetsValue
            );
        });
        console.log('policies looped in  assetsToValue')

        const value = this.lib.Value.new(
            this.lib.BigNum.from_str(lovelace ? lovelace.toString() : '0')
        );
        if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset);
        console.log('end assetsToValue')
        return value;
    };

    async getAddressHex(): Promise<Buffer | null> {
        if (!this.wallet) return null
        try {
            return Buffer.from(
                ((await this.wallet.getChangeAddress()).toString()),
                'hex'
            )
        }
        catch (ex) {
            console.log('wallet.getAddressHex: error')
            console.table(ex)
            return null
        }
    }

    async getAddress(): Promise<string> {
        const addressHex = await this.getAddressHex()
        console.log('getAddress')
        console.log(addressHex)
        if (!this.wallet || !addressHex) return ''

        const address = this.lib.BaseAddress.from_address(
            this.lib.Address.from_bytes(addressHex)
        )
            ?.to_address()
            ?.to_bech32()
        if (!address) return ''
        return address
    }

    async getAddressHexString(): Promise<string> {
        const addressHex = await this.getAddressHex()
        if (!addressHex) return ''
        return addressHex.toString('hex')
    }

    async getNetworkId(): Promise<{
        id: number;
        network: string;
    }> {
        if (!this.wallet) return {
            id: 2,
            network: 'unknown'
        }
        let networkId = await this.wallet.getNetworkId()
        return {
            id: networkId,
            network: networkId === 1 ? 'mainnet' : 'testnet'
        }
    }

    async getBalance(protocolParameters: ProtocolParameters): Promise<ValueHolding> {

        if (!this.wallet || !protocolParameters) return {
            lovelace: '0',
            assets: []
        }
        this._protocolParameter = protocolParameters
        const valueCBOR = await this.wallet.getBalance()
        const value = valueCBOR
        const utxos = await this.wallet.getUtxos()

        let countedValue = this.lib.Value.new(this.lib.BigNum.from_str('0'))
        utxos.forEach((element) => {
            countedValue = countedValue.checked_add(element.output().amount())
        })

        const minAda = this.lib.min_ada_required(
            countedValue,
            false,
            this.lib.BigNum.from_str(this._protocolParameter.coinsPerUtxoWord.toString())
        );

        const availableAda = countedValue.coin().checked_sub(minAda)
        const lovelace = availableAda.to_str()
        const assets: AssetHolding[] = [];
        const multiAssetVal = value?.multiasset()
        if (multiAssetVal) {
            const multiAssets = multiAssetVal.keys();
            for (let j = 0; j < multiAssets.len(); j++) {
                const policy = multiAssets.get(j);
                const policyAssets = multiAssetVal.get(policy);
                const assetNames = policyAssets?.keys();
                if (policyAssets && assetNames) {
                    for (let k = 0; k < assetNames.len(); k++) {
                        const policyAsset = assetNames.get(k);
                        if (policyAsset) {
                            const quantity = policyAssets.get(policyAsset);
                            if (quantity) {
                                const asset =
                                    Buffer.from(policy.to_bytes()).toString('hex') +
                                    Buffer.from(policyAsset.name()).toString('hex');
                                const _policy = asset.slice(0, 56);
                                const _name = asset.slice(56);
                                const fingerprint = AssetFingerprint.fromParts(
                                    Buffer.from(_policy, 'hex'),
                                    Buffer.from(_name, 'hex'),
                                ).fingerprint();
                                assets.push({
                                    unit: asset,
                                    quantity: quantity.to_str(),
                                    policy: _policy,
                                    name: HexToAscii(_name),
                                    fingerprint,
                                });
                            }
                        }
                    }
                }
            }
        }

        return { lovelace: lovelace, assets: assets };
    }

    async registerPolicy(policy: Policy) {
        fetch(`https://pool.pm/register/policy/${policy.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'all',
                scripts: [
                    {
                        keyHash: policy.paymentKeyHash,
                        type: 'sig',
                    },
                    { slot: policy.ttl, type: 'before' },
                ],
            }),
        })
            .then((res) => res.json())
            .then(console.log);
    }

    async getUtxos(utxosHex: string[]): Promise<UTXO[]> {
        let Utxos = utxosHex.map((u) =>
            this.lib.TransactionUnspentOutput.from_bytes(Buffer.from(u, 'hex')),
        );
        let UTXOS = [];
        for (let utxo of Utxos) {
            let assets = this._utxoToAssets(utxo);

            UTXOS.push({
                txHash: Buffer.from(
                    utxo.input().transaction_id().to_bytes()
                ).toString('hex'),
                txId: utxo.input().index(),
                amount: assets,
            });
        }
        return UTXOS;
    }

    async getWalletUtxosHex(): Promise<TransactionUnspentOutput[]> {
        if (!this.wallet) return []
        return await this.wallet.getUtxos();
    }

    async transaction({
        ProtocolParameters,
        PaymentAddress = '',
        recipients = [],
        metadata = null,
        metadataHash = null,
        utxosRaw = [],
        ttl = null,
        multiSig = false,
        delegation = null,
        redeemers = [],
        plutusValidators = [],
        plutusPolicies = [],
        datums = []
    }: TransactionParams
    ) {

        if (!ProtocolParameters) return null
        this._protocolParameter = ProtocolParameters
        let utxos = utxosRaw.map((u) =>
            u
        );
        let mintedAssetsArray: MintedAsset[] = []
        let outputs = this.lib.TransactionOutputs.new()

        let minting = 0
        let costValues: any = {}
        for (let recipient of recipients) {
            let lovelace = Math.floor((Number(recipient.amount) || 0) * 1000000).toString()
            let ReceiveAddress = recipient.address
            let multiAsset = this._makeMultiAsset(recipient?.assets || [])
            let mintedAssets = this._makeMintedAsset(recipient?.mintedAssets || [])

            let outputValue = this.lib.Value.new(this.lib.BigNum.from_str(lovelace))
            let minAdaMint = this.lib.BigNum.from_str('0')

            if ((recipient?.assets || []).length > 0) {
                outputValue.set_multiasset(multiAsset)
                let minAda = this.lib.min_ada_required(
                    outputValue,
                    false,
                    this.lib.BigNum.from_str(this._protocolParameter.coinsPerUtxoWord.toString())
                );

                if (this.lib.BigNum.from_str(lovelace).compare(minAda) < 0)
                    outputValue.set_coin(minAda)
            }

            (recipient?.mintedAssets || []).map((asset) => {
                minting += 1
                mintedAssetsArray.push({
                    ...asset,
                    address: recipient.address
                })
            })

            if ((recipient.mintedAssets || []).length > 0) {
                minAdaMint = this.lib.min_ada_required(
                    mintedAssets,
                    false,
                    this.lib.BigNum.from_str(this._protocolParameter.coinsPerUtxoWord.toString())
                )

                let requiredMintAda = this.lib.Value.new(this.lib.BigNum.from_str('0'));
                requiredMintAda.set_coin(minAdaMint);
                if (outputValue.coin().to_str() === '0') {
                    outputValue = requiredMintAda;
                } else {
                    outputValue = outputValue.checked_add(requiredMintAda);
                }
            }
            if (ReceiveAddress != PaymentAddress)
                costValues[ReceiveAddress] = outputValue;

            const multiasst = outputValue.multiasset()
            let addr
            try {
                addr = this.lib.Address.from_bytes(Buffer.from(recipient.address, "hex"))
            }
            catch {
                addr = this.lib.Address.from_bech32(recipient.address)

            }
            let outputBuilder = this.lib.TransactionOutputBuilder.new().with_address(addr)
            let output

            if (recipient.datum) {
                console.log('has plutusDataHash')
                console.log(recipient.datum)
                let plutusDataHash
                plutusDataHash = this.lib.hash_plutus_data(recipient.datum)
                console.log(plutusDataHash)
                outputBuilder = outputBuilder.with_data_hash(plutusDataHash)
            }
            if (parseInt(outputValue.coin().to_str()) > 0) {
                if (multiasst) {
                    output = outputBuilder.next()
                        .with_coin_and_asset(outputValue.coin(), multiasst)
                        .build()
                } else {
                    output = outputBuilder.next()
                        .with_coin(outputValue.coin())
                        .build()
                }
            } else if (multiasst) {
                output = outputBuilder.next()
                    .with_asset_and_min_required_coin(multiasst, this.lib.BigNum.from_str(ProtocolParameters.coinsPerUtxoWord.toString()))
                    .build()
            }
            if (output) outputs.add(output)
            console.log('outputs i ' + minting)
            console.log(outputs)
        }
        let RawTransaction = null
        if (redeemers?.length >= 1) {
            RawTransaction = await _txBuilderSpendFromPlutusScript({
                PaymentAddress: PaymentAddress,
                Utxos: utxos,
                Outputs: outputs,
                mintedAssetsArray: mintedAssetsArray,
                ProtocolParameter: this._protocolParameter,
                metadata: metadata,
                metadataHash: metadataHash,
                ttl: ttl,
                datums: datums,
                redeemers: redeemers,
                plutusValidators: plutusValidators,
                plutusPolicies: plutusPolicies,
                collateral: await this.wallet.experimental.getCollateral()
            })
        } else if (minting > 0) {
            RawTransaction = await _txBuilderMinting({
                PaymentAddress: PaymentAddress,
                Utxos: utxos,
                Outputs: outputs,
                mintedAssetsArray: mintedAssetsArray,
                ProtocolParameter: this._protocolParameter,
                metadata: metadata,
                metadataHash: metadataHash,
                multiSig: multiSig,
                ttl: ttl
            })
        } else if (delegation != null) {
            //todo
            throw 'not implemented'
        } else {
            RawTransaction = await _txBuilder({
                PaymentAddress: PaymentAddress,
                Utxos: utxos,
                Outputs: outputs,
                ProtocolParameter: this._protocolParameter,
                multiSig: multiSig,
                metadata: metadata,
                nativescript: null
            })
        }
        if (!RawTransaction) return null
        return RawTransaction
    }

    async createLockingPolicyScript(address: string, expirationTime: Date | null, protocolParameters: ProtocolParameters) {
        var now = new Date();
        this._protocolParameter = protocolParameters;

        const slot = this._protocolParameter?.slot
        const duration = !expirationTime ? null : expirationTime.getTime() - now.getTime();

        const ttl = !expirationTime ? null : slot + duration;

        const paymentKeyHash = this.lib.BaseAddress.from_address(
            this.lib.Address.from_bytes(Buffer.from(address, 'hex'))
        )
            ?.payment_cred()
            ?.to_keyhash();
        if (!paymentKeyHash) return null

        const nativeScripts = this.lib.NativeScripts.new();
        const script = this.lib.ScriptPubkey.new(paymentKeyHash);
        const nativeScript = this.lib.NativeScript.new_script_pubkey(script);
        nativeScripts.add(nativeScript);
        if (expirationTime) {
            const lockScript = this.lib.NativeScript.new_timelock_expiry(
                this.lib.TimelockExpiry.new(ttl)
            );
            nativeScripts.add(lockScript);
        }

        const finalScript = this.lib.NativeScript.new_script_all(
            this.lib.ScriptAll.new(nativeScripts)
        );
        const policyId = Buffer.from(
            this.lib.ScriptHash.from_bytes(finalScript.hash(0).to_bytes()).to_bytes()
        ).toString('hex');
        return {
            id: policyId,
            script: Buffer.from(finalScript.to_bytes()).toString('hex'),
            paymentKeyHash: Buffer.from(paymentKeyHash.to_bytes()).toString('hex'),
            ttl
        };
    }

    async signTx(transaction: string | Transaction, partialSign: boolean = false) {
        if (!this.wallet) return null
        return await this.wallet.signTx(transaction, partialSign)
    }

    async signData(data: string) {
        let address = await this.getBaseAddress()
        if (!address || !this.wallet) return null
        let coseSign1Hex = await this.wallet.signData(
            address,
            Buffer.from(data, 'ascii').toString('hex')
        );
        return coseSign1Hex
    }

    hashMetadata(metadata: object) {
        let aux = this.lib.AuxiliaryData.new()

        const generalMetadata = this.lib.GeneralTransactionMetadata.new()
        Object.entries(metadata).map(([MetadataLabel, Metadata]) => {
            generalMetadata.insert(
                this.lib.BigNum.from_str(MetadataLabel),
                this.lib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
            );
        });
        aux.set_metadata(generalMetadata)

        const metadataHash = this.lib.hash_auxiliary_data(aux)
        return Buffer.from(metadataHash.to_bytes()).toString('hex')
    }

    _makeMintedAsset(mintedAssets: MintedAsset[]): Value {
        let AssetsMap: any = {}

        for (let asset of mintedAssets) {
            let assetName = asset.assetName;
            let quantity = asset.quantity;
            if (!Array.isArray(AssetsMap[asset.policyId])) {
                AssetsMap[asset.policyId] = []
            }
            AssetsMap[asset.policyId].push({
                unit: Buffer.from(assetName, 'ascii').toString('hex'),
                quantity: quantity,
            });
        }
        let multiAsset = this.lib.MultiAsset.new()

        for (const policy in AssetsMap) {
            const ScriptHash = this.lib.ScriptHash.from_bytes(
                Buffer.from(policy, 'hex')
            );
            const Assets = this.lib.Assets.new()

            const _assets = AssetsMap[policy]

            for (const asset of _assets) {
                const AssetName = this.lib.AssetName.new(Buffer.from(asset.unit, 'hex'))
                const BigNum = this.lib.BigNum.from_str(asset.quantity)
                Assets.insert(AssetName, BigNum)
            }
            multiAsset.insert(ScriptHash, Assets)
        }
        const value = this.lib.Value.new(this.lib.BigNum.from_str('0'))
        value.set_multiasset(multiAsset)
        return value
    }

    _makeMultiAsset(assets: Asset[]) {
        let AssetsMap: any = {}
        for (let asset of assets) {
            let [policy, assetName] = asset.unit.split('.')
            let quantity = asset.quantity
            if (!Array.isArray(AssetsMap[policy])) {
                AssetsMap[policy] = []
            }
            AssetsMap[policy].push({
                unit: Buffer.from(assetName, 'ascii').toString('hex'),
                quantity: quantity
            });
        }
        let multiAsset = this.lib.MultiAsset.new()

        for (const policy in AssetsMap) {
            const ScriptHash = this.lib.ScriptHash.from_bytes(
                Buffer.from(policy, 'hex')
            )
            const Assets = this.lib.Assets.new()

            const _assets = AssetsMap[policy]

            for (const asset of _assets) {
                const AssetName = this.lib.AssetName.new(Buffer.from(asset.unit, 'hex'))
                const BigNum = this.lib.BigNum.from_str(asset.quantity.toString())
                Assets.insert(AssetName, BigNum)
            }
            multiAsset.insert(ScriptHash, Assets)
        }
        return multiAsset
    }

    _utxoToAssets(utxo: TransactionUnspentOutput) {
        let value = utxo.output().amount()
        const assets = [];
        assets.push({
            unit: 'lovelace',
            quantity: value.coin().to_str(),
        });
        const multiasset = value?.multiasset()
        if (multiasset) {
            const multiAssets = multiasset.keys();
            for (let j = 0; j < multiAssets.len(); j++) {
                const policy = multiAssets.get(j);
                const policyAssets = multiasset.get(policy);
                if (policyAssets) {
                    const assetNames = policyAssets.keys();
                    for (let k = 0; k < assetNames.len(); k++) {
                        const policyAsset = assetNames.get(k);
                        const quantity = policyAssets.get(policyAsset);
                        const asset =
                            Buffer.from(policy.to_bytes()).toString('hex') +
                            '.' +
                            Buffer.from(policyAsset.name()).toString('ascii');
                        if (quantity) {
                            assets.push({
                                unit: asset,
                                quantity: quantity.to_str(),
                            });
                        }
                    }
                }
            }
        }
        return assets;
    }

    async submitTx(transactionRaw: string,
        witnesses: string[],
        metadata?: object
    ) {
        let transaction = this.lib.Transaction.from_bytes(
            Buffer.from(transactionRaw, 'hex')
        );
        const txWitnesses = transaction.witness_set();
        const txVkeys = txWitnesses.vkeys();
        const txScripts = txWitnesses.native_scripts();
        const totalVkeys = this.lib.Vkeywitnesses.new();
        const totalScripts = this.lib.NativeScripts.new();
        witnesses.forEach((w) => {
            console.log('witness')
            console.log(w)
            console.log('witnesses')
            console.log(witnesses)
            const addWitnesses = this.lib.TransactionWitnessSet.from_bytes(
                Buffer.from(w, 'hex'),
            );
            const addVkeys = addWitnesses.vkeys();
            const addScripts = addWitnesses.native_scripts();
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
        })

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
        const totalWitnesses = this.lib.TransactionWitnessSet.new();
        totalWitnesses.set_vkeys(totalVkeys);
        totalWitnesses.set_native_scripts(totalScripts);

        let aux;
        if (metadata) {
            aux = this.lib.AuxiliaryData.new();
            const generalMetadata = this.lib.GeneralTransactionMetadata.new();
            Object.entries(metadata).map(([MetadataLabel, Metadata]) => {
                generalMetadata.insert(
                    this.lib.BigNum.from_str(MetadataLabel),
                    this.lib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0),
                );
            });

            aux.set_metadata(generalMetadata);
        } else {
            aux = transaction.auxiliary_data();
        }
        const signedTx = this.lib.Transaction.new(
            transaction.body(),
            totalWitnesses,
            aux
        );
        return await this.wallet?.submitTx(Buffer.from(signedTx.to_bytes()).toString('hex'));
    }

}

function AsciiToBuffer(string: string) {
    return Buffer.from(string, 'ascii');
}

function HexToBuffer(string: string) {
    return Buffer.from(string, 'hex');
}

function AsciiToHex(string: string) {
    return AsciiToBuffer(string).toString('hex');
}

function HexToAscii(string: string) {
    return HexToBuffer(string).toString('ascii');
}

function BufferToAscii(buffer: Buffer) {
    return buffer.toString('ascii');
}

function BufferToHex(buffer: Buffer) {
    return buffer.toString('hex');
}

export default CardanoWallet;

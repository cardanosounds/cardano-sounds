import { validator, validatorAddress, validatorAddressTestnet } from "../on-chain/nftMediaLibPlutus";
import { AlwaysSucceedsPlutusValidator, AlwaysSucceedsPlutusPolicy } from "../on-chain/alwaysSuceedsPlutus";
import { PlutusData, C, Lucid, Blockfrost, Tx, UTxO, SpendingValidator} from 'lucid-cardano'
import { estimateSlotByDate } from "../../lib/utils";
import { BigNum, ScriptHashNamespace, NativeScript } from "lucid-cardano/custom_modules/cardano-multiplatform-lib-browser";
export const fromHex = (hex) => Buffer.from(hex, "hex");
export const toHex = (bytes) => Buffer.from(bytes).toString("hex");

type Policy = { 
    policyId: string, script: NativeScript, lockSlot: number, paymentKeyHash: string 
}

const DATUM_LABEL = 405;

const createLockingPolicyScript = (expirationTime: Date, walletAddress: string, mainnet: boolean = true) => {
    const lockSlot = !expirationTime ? undefined : estimateSlotByDate(expirationTime, mainnet)
    
    const paymentKeyHash = C.BaseAddress.from_address(
        C.Address.from_bech32(walletAddress)
    )
      .payment_cred()
      .to_keyhash();

    const nativeScripts = C.NativeScripts.new();
    const script = C.ScriptPubkey.new(paymentKeyHash);
    const nativeScript = C.NativeScript.new_script_pubkey(script);
    if(lockSlot) {
      const lockScript = C.NativeScript.new_timelock_expiry(
        C.TimelockExpiry.new(C.BigNum.from_str(lockSlot.toString()))
      );
      nativeScripts.add(lockScript);
    }
    nativeScripts.add(nativeScript);
    const finalScript = C.NativeScript.new_script_all(
      C.ScriptAll.new(nativeScripts)
    );
    const policyId = Buffer.from(
      C.ScriptHash.from_bytes(
        finalScript.hash(ScriptHashNamespace.NativeScript).to_bytes()
      ).to_bytes(),
    ).toString("hex");
    const keyHashString = Buffer.from(
      paymentKeyHash.to_bytes(),
    ).toString("hex");
    return { policyId: policyId, script: finalScript, lockSlot: lockSlot, paymentKeyHash: keyHashString };
}


export class LibraryDatum {
    private lockTokenPolicy: string
    private lockTokenName: string
    private lovelacePrice: BigInt

    constructor({
        lockTokenPolicy,
        lockTokenName,
        lovelacePrice
    }: {
        lockTokenPolicy: string,
        lockTokenName: string,
        lovelacePrice: BigInt
    }) {
        this.lockTokenPolicy = lockTokenPolicy
        this.lockTokenName = lockTokenName
        this.lovelacePrice = lovelacePrice
    }
    // {
    //     \"constructor\":0,
    //     \"fields\":[
    //         {
    //             \"constructor\":0,
    //             \"fields\":[
    //                 {\"bytes\":\"\"},   --policy   
    //                 {\"bytes\":\"\"}    --tokenName  
    //             ]
    //         },
    //         {\"int\":10000000}           --lovelacePrice
    //     ]
    // }
    toPlutusData: () => PlutusData = () => {
        const fieldsInner = C.PlutusList.new();
        fieldsInner.add(C.PlutusData.new_bytes(fromHex(this.lockTokenPolicy)));
        fieldsInner.add(C.PlutusData.new_bytes(fromHex(this.lockTokenName)));

        const libraryInput = C.PlutusList.new();
        libraryInput.add(
            C.PlutusData.new_constr_plutus_data(
                C.ConstrPlutusData.new(
                    C.BigNum.zero(),
                    fieldsInner
                )
            )
        )

        libraryInput.add(C.PlutusData.new_bytes(Buffer.from(this.lovelacePrice.toString())))

        return C.PlutusData.new_constr_plutus_data(
            C.ConstrPlutusData.new(
                C.BigNum.zero(),
                libraryInput
            )
        )
    }

    asPlutusDataHexString: () => string = () => {
        return toHex(this.toPlutusData().to_bytes())
    }
}

export enum LibraryAction {
    Unlock = 0,
    Use = 1
}

export class LibraryRedeemer {
    private libraryAction: LibraryAction

    constructor(_libraryAction: LibraryAction) {
        this.libraryAction = _libraryAction
    }
    // {
    //     \"constructor\":0,
    //     \"fields\":[]
    // }
    toPlutusData = (cardano: typeof C) => {
        return cardano.PlutusData.new_constr_plutus_data(
            cardano.ConstrPlutusData.new(
                cardano.BigNum.from_str(this.libraryAction.toString()),
                cardano.PlutusList.new()
            )
        )

    }
    toRedeemer = (cardano: typeof C, index: number = 0) => {
        return cardano.Redeemer.new(
            cardano.RedeemerTag.new_spend(),
            cardano.BigNum.from_str(index.toString()),
            this.toPlutusData(cardano),
            cardano.ExUnits.new(
                cardano.BigNum.from_str("59900"),
                cardano.BigNum.from_str("17804354")
            )
        );
    }
}

export type Asset = {
    assetName: string
    policyId: string
}
export class LibraryValidator {


    constructor() {
    }

    lock = async (
        asset: Asset,
        adaPrice: number
    ) => {
        console.log({
            // protocolParameters: protocolParameters,
            asset: asset,
            adaPrice: adaPrice
        })

        await Lucid.initialize(
            'Testnet',
            new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
        )
        await Lucid.selectWallet('nami')
        const walletAddr = Lucid.wallet.address
        // const localWallet = localStorage.getItem('cardano-web3-wallet')
        // console.log(await this.cardano.enable('nami'))
        // if (!this.cardano.wallet && localWallet) {
        //     if (!await this.cardano.enable(localWallet)) return
        // } else if (!this.cardano.wallet) {
        //     return
        // }
        // console.log(this.cardano.wallet)
        // const walletAddr = await this.cardano.getAddressHexString()
        // console.log(walletAddr)


        if (!walletAddr) return
        const policy: Policy = createLockingPolicyScript(null, walletAddr)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters
        // console.log('policy')
        // console.log(policy)
        // let utxos = await this.cardano.wallet.getUtxos();
        const lockTokenMint = {
            assetName: 'CSlock' + asset.assetName,
            quantity: '1',
            policyId: policy.policyId,
            policyScript: policy.script,
            address: walletAddr
        }
        const datum = new LibraryDatum({
            lockTokenPolicy: lockTokenMint.policyId,
            lockTokenName: lockTokenMint.assetName,
            lovelacePrice: BigInt(adaPrice * 1000000)
        }).asPlutusDataHexString()
        

        // const txParams: TransactionParams = {
        //     ProtocolParameters: protocolParameters,
        //     PaymentAddress: walletAddr,
        //     recipients: [
        //         {
        //             address: validatorAddressTestnet,//'addr_test1qqrsm4vj985epelhc8qpv8jahaqpjll7ed67647dk47ku4x5x8xk48yntkwhc2s20manmqartkchrp2qxgfwdaezsq5qu9urvd',
        //             amount: '2.5',
        //             assets: [asset],
        //             datum: new LibraryDatum({
        //                 lockTokenPolicy: lockTokenMint.policyId,
        //                 lockTokenName: lockTokenMint.assetName,
        //                 lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
        //             }).toPlutusData(this.cardano.lib)
        //         }
        //         ,
        //         {
        //             address: walletAddr,
        //             amount: '0',
        //             mintedAssets: [lockTokenMint]
        //         }
        //     ],
        //     metadata: metadata,
        //     metadataHash: null,
        //     addMetadata: true,
        //     utxosRaw: utxos,
        //     ttl: 0,
        //     multiSig: false,
        //     delegation: null,
        //     redeemers: [],
        //     plutusValidators: [],
        //     plutusPolicies: [],
        //     burn: false
        // }
        let assets = {}
        assets[asset.policyId + asset.assetName] = BigInt(1)
        const tx = await Tx.new()
                .attachMetadataWithConversion(DATUM_LABEL, { 0: "0x" + datum })
                .payToContract(validatorAddressTestnet, datum, assets)
                .complete();

        const signedTx = (await tx.sign()).complete();

        const txHash = await signedTx.submit();

        console.log({ submittedTxHash: txHash })

        // let tx: Transaction = await this.cardano.transaction(txParams)
       
        // const transactionWitnessSet = TransactionWitnessSet.new();

        // const txVkeyWitnessesStr = await this.cardano.wallet.signTx(Buffer.from(tx.to_bytes()).toString("hex"), false);
        // const txVkeyWitnessesSer = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesStr, "hex"));
        // transactionWitnessSet.set_vkeys(txVkeyWitnessesSer.vkeys());
        // const policyScripts = this.cardano.lib.NativeScripts.new()
        // policyScripts.add(NativeScript.from_bytes(Buffer.from(policy.script, 'hex')))
        // transactionWitnessSet.set_native_scripts(policyScripts)
        // const txBody = tx.body()
        // let aux = tx.auxiliary_data();
        // txBody.set_auxiliary_data_hash(this.cardano.lib.hash_auxiliary_data(aux))
        // const signedTx = Transaction.new(
        //     txBody,
        //     transactionWitnessSet,
        //     aux
        // );

        // const submittedTxHash = await this.cardano.wallet.submitTx(Buffer.from(signedTx.to_bytes()).toString("hex"));
        // console.log({ submittedTxHash: submittedTxHash })
    }

    unlock = async (
        asset: Asset,
        adaPrice: number,
        // validatorUtxo: UTxO,
    ) => {
        console.log({
            asset: asset,
            adaPrice: adaPrice,
            metadata: null
        })
        await Lucid.initialize(
            'Testnet',
            new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
        )
        await Lucid.selectWallet('nami')
        const walletAddr = Lucid.wallet.address

        if (!walletAddr) return

        const policy: Policy = createLockingPolicyScript(null, walletAddr)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters

        const lockTokenBurn = {
            assetName: 'CSlock' + Buffer.from(asset.assetName, 'hex').toString('ascii'),
            quantity: '-1',
            policyId: policy.policyId,
            policyScript: policy.script,
            address: walletAddr
        }

        // const txParams: TransactionParams = {
        //     ProtocolParameters: protocolParameters,
        //     PaymentAddress: walletAddr,
        //     recipients: [{
        //         address: walletAddr,
        //         amount: '0',
        //         assets: [
        //             { quantity: '1', unit: asset.unit }
        //             // ,
        //             // {quantity: '1', unit: lockTokenBurn.policyId + "." + lockTokenBurn.assetName}
        //         ]
        //         ,
        //         mintedAssets: [lockTokenBurn]
        //     }],
        //     metadata: metadata,
        //     metadataHash: null,
        //     addMetadata: true,
        //     utxosRaw: utxos,
        //     ttl: 7200,
        //     multiSig: false,
        //     delegation: null,
        //     datums: [
        //         new LibraryDatum({
        //             lockTokenPolicy: lockTokenBurn.policyId,
        //             lockTokenName: lockTokenBurn.assetName,
        //             lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
        //         }).toPlutusData(this.cardano.lib)
        //     ],
        //     redeemers: [new LibraryRedeemer(LibraryAction.Unlock).toRedeemer(this.cardano.lib)],
        //     plutusValidators: [PlutusScript.new(fromHex(validator))],
        //     plutusPolicies: [],
        //     burn: true
        // }
        const datum = new LibraryDatum({
            lockTokenPolicy: lockTokenBurn.policyId,
            lockTokenName: lockTokenBurn.assetName,
            lovelacePrice: BigInt(adaPrice * 1000000)
        }).asPlutusDataHexString()

        const spendingValidator: SpendingValidator = {
            type: 'Plutus',
            script: // 590ff6
                validator,
        };

        let utxos = await Lucid.utxosAt(validatorAddressTestnet)//, asset.policyId + asset.assetName)
        console.log({utxos: utxos})
        if(!utxos) throw "no validator utxos with an asset"

        utxos = utxos.map((utxo) => {
            // for each utxo the user owns we add the datum for this user in the transaction.
            utxo.datum = datum;
            return utxo
        })

        const tx = await Tx.new()
            .collectFrom(utxos, datum)
            .attachSpendingValidator(spendingValidator)
            .addSigner(walletAddr)
            .complete();

        const signedTx = (await tx.sign()).complete();

        const txHash = await signedTx.submit();

        console.log({ submittedTxHash: txHash })
    }

    use = () => {

    }
}

// export class TestRedeemer {

// }

// export class TestValidator {
//     private cardano: CardanoWallet

//     constructor(cardano: CardanoWallet) {
//         this.cardano = cardano
//     }

//     payToScript = async (
//         protocolParameters: ProtocolParameters,
//         asset: Asset,
//         adaPrice: number,
//         metadata: Object = null
//     ) => {
//         console.log({
//             protocolParameters: protocolParameters,
//             asset: asset,
//             adaPrice: adaPrice,
//             metadata: null
//         })
//         let localWallet = localStorage.getItem('cardano-web3-wallet')
//         if(!localWallet) localWallet = 'nami'
//         console.log(await this.cardano.enable(localWallet))
//         if (!this.cardano.wallet && localWallet) {
//             if (!await this.cardano.enable(localWallet)) return
//         } else if (!this.cardano.wallet) {
//             return
//         }
//         console.log(this.cardano.wallet)
//         const walletAddr = await this.cardano.getAddressHexString()
//         console.log(walletAddr)

//         if (!walletAddr) return

//         let utxos = await this.cardano.wallet.getUtxos();

//         const txParams: TransactionParams = {
//             ProtocolParameters: protocolParameters,
//             PaymentAddress: walletAddr,
//             recipients: [
//                 {
//                     address: AlwaysSucceedsPlutusValidator.testnetAddress,
//                     amount: '2.5',
//                     assets: [asset],
//                     datum: PlutusData.new_integer(BigInt.from_str('42'))
//                     //new LibraryDatum({
//                     //     lockTokenPolicy: asset.unit.split('.')[0],
//                     //     lockTokenName: asset.unit.split('.')[1],
//                     //     lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
//                     // }).toPlutusData(this.cardano.lib)
//                 }
//             ],
//             metadata: metadata,
//             metadataHash: null,
//             addMetadata: true,
//             utxosRaw: utxos,
//             ttl: 0,
//             multiSig: false,
//             delegation: null,
//             redeemers: [],
//             plutusValidators: [],
//             plutusPolicies: [],
//             burn: false
//         }

//         let tx: Transaction = await this.cardano.transaction(txParams)
//         console.log('tx')
//         console.log(tx)
//         console.log('tx typeof')
//         console.log(typeof tx)

//         const transactionWitnessSet = TransactionWitnessSet.new();

//         const txVkeyWitnessesStr = await this.cardano.wallet.signTx(Buffer.from(tx.to_bytes()).toString("hex"), false);
//         const txVkeyWitnessesSer = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesStr, "hex"));
//         transactionWitnessSet.set_vkeys(txVkeyWitnessesSer.vkeys());
//         const txBody = tx.body()
//         let aux = tx.auxiliary_data();
//         txBody.set_auxiliary_data_hash(this.cardano.lib.hash_auxiliary_data(aux))
//         const signedTx = Transaction.new(
//             txBody,
//             transactionWitnessSet,
//             aux
//         );

//         const submittedTxHash = await this.cardano.wallet.submitTx(Buffer.from(signedTx.to_bytes()).toString("hex"));
//         console.log({ submittedTxHash: submittedTxHash })
//     }

//     spendFromScript = async (
//         protocolParameters: ProtocolParameters,
//         asset: Asset,
//         adaPrice: number,
//         validatorUtxo: UTxO,
//         metadata: Object = null
//     ) => {
//         console.log({
//             protocolParameters: protocolParameters,
//             asset: asset,
//             adaPrice: adaPrice,
//             metadata: null
//         })
//         let localWallet = localStorage.getItem('cardano-web3-wallet')
//         if(!localWallet) localWallet = 'nami'
//         if (!this.cardano.wallet && localWallet) {
//             if (!await this.cardano.enable(localWallet)) return
//         } else if (!this.cardano.wallet) {
//             return
//         }
//         console.log(this.cardano.wallet)
//         const walletAddr = await this.cardano.getAddressHexString()
//         console.log(walletAddr)

//         if (!walletAddr) return
        
//         console.log('not converted utxo')
//         console.log(validatorUtxo)

//         const convertedValidatorUTXO = await this.cardano.utxoFromData(validatorUtxo, AlwaysSucceedsPlutusValidator.testnetAddress)

//         console.log(utxoToJson(convertedValidatorUTXO))
//         console.log('convertedValidatorUTXO')
//         console.log(convertedValidatorUTXO)
//         let utxos = await this.cardano.wallet.getUtxos()
//         console.log('utxos.length')
//         console.log(utxos.length)
//         utxos = utxos.concat(convertedValidatorUTXO)
//         console.log('utxos.length')
//         console.log(utxos.length)

//         const txParams: TransactionParams = {
//             ProtocolParameters: protocolParameters,
//             PaymentAddress: walletAddr,
//             recipients: [{
//                 address: walletAddr,
//                 amount: '0',
//                 assets: [
//                     { quantity: '1', unit: asset.unit }
//                 ]
//             }],
//             metadata: metadata,
//             metadataHash: null,
//             addMetadata: true,
//             utxosRaw: utxos,
//             ttl: null,
//             multiSig: false,
//             delegation: null,
//             datums: [
//                 PlutusData.new_integer(BigInt.from_str('42'))
//                 // new LibraryDatum({
//                 //     lockTokenPolicy: asset.unit.split('.')[0],
//                 //     lockTokenName: asset.unit.split('.')[1],
//                 //     lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
//                 // }).toPlutusData(this.cardano.lib)
//             ],
//             redeemers: [this.cardano.lib.Redeemer.new(
//                 this.cardano.lib.RedeemerTag.new_spend(),
//                 BigNum.zero(),
//                 this.cardano.lib.PlutusData.new_map(PlutusMap.new()),
//                 ExUnits.new(
//                     BigNum.from_str(AlwaysSucceedsPlutusValidator.exBudget.exBudgetMemory.toString()),
//                     BigNum.from_str(AlwaysSucceedsPlutusValidator.exBudget.exBudgetCPU.toString())
//                 )
//             )],
//             plutusValidators: [PlutusScript.new(fromHex(AlwaysSucceedsPlutusValidator.validator))],
//             plutusPolicies: [],
//             burn: false
//         }

//         let tx: Transaction = await this.cardano.transaction(txParams)
//         console.log('tx')
//         console.log(tx)
//         console.log('tx typeof')
//         console.log(typeof tx)

//         // const transactionWitnessSet = TransactionWitnessSet.new();

//         const txVkeyWitnessesStr = await this.cardano.wallet.signTx(Buffer.from(tx.to_bytes()).toString("hex"), true);
//         console.log(await this.cardano.submitTx(Buffer.from(tx.to_bytes()).toString('hex'), [txVkeyWitnessesStr]))
//         // const txVkeyWitnessesSer = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesStr, "hex"));
//         // transactionWitnessSet.set_vkeys(txVkeyWitnessesSer.vkeys());
       
//         // const txBody = tx.body()
//         // let aux = tx.auxiliary_data();
//         // txBody.set_auxiliary_data_hash(this.cardano.lib.hash_auxiliary_data(aux))
//         // const signedTx = Transaction.new(
//         //     txBody,
//         //     transactionWitnessSet,
//         //     aux
//         // );

//         // const submittedTxHash = await this.cardano.wallet.submitTx(Buffer.from(signedTx.to_bytes()).toString("hex"));
//         // console.log({ submittedTxHash: submittedTxHash })
//     }

// }


// /**
//  *
//  *
//  *
//  * @param {TransactionUnspentOutput} utxo
//  * @returns
//  */
// export const utxoToJson = (utxo: TransactionUnspentOutput) => {
//     const utxoT = typeof utxo === 'string' ? TransactionUnspentOutput.from_bytes(Buffer.from(utxo, 'hex')) : utxo
//     const assets = valueToAssets(utxoT.output().amount());
//     return {
//         txHash: Buffer.from(
//             utxoT.input().transaction_id().to_bytes()
//         ).toString('hex'),
//         txId: utxoT.input().index(),
//         amount: assets,
//     };
// };

// /**
//  *
//  * @param {string} hex
//  * @returns
//  */
// export const hexToAscii = (hex: string) => Buffer.from(hex, 'hex').toString();

// /**
//  *
//  * @param {Value} value
//  */
// export const valueToAssets = (value: Value) => {
//     const assets = [];
//     assets.push({ unit: 'lovelace', quantity: value.coin().to_str() });
//     if (value.multiasset()) {
//         const multiAssets = value.multiasset().keys();
//         for (let j = 0; j < multiAssets.len(); j++) {
//             const policy = multiAssets.get(j);
//             const policyAssets = value.multiasset().get(policy);
//             const assetNames = policyAssets.keys();
//             for (let k = 0; k < assetNames.len(); k++) {
//                 const policyAsset = assetNames.get(k);
//                 const quantity = policyAssets.get(policyAsset);
//                 const asset =
//                     Buffer.from(policy.to_bytes()).toString('hex') +
//                     Buffer.from(policyAsset.name()).toString('hex');
//                 const _policy = asset.slice(0, 56);
//                 const _name = asset.slice(56);
//                 const fingerprint = AssetFingerprint.fromParts(
//                     Buffer.from(_policy, 'hex'),
//                     Buffer.from(_name, 'hex'),
//                 ).fingerprint();
//                 assets.push({
//                     unit: asset,
//                     quantity: quantity.to_str(),
//                     policy: _policy,
//                     name: hexToAscii(_name),
//                     fingerprint,
//                 });
//             }
//         }
//     }
//     // if (value.coin().to_str() == '0') return [];
//     return assets;
// };
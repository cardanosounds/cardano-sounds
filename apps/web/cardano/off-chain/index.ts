import {
    BigInt,
    NativeScript,
    PlutusData,
    PlutusScript,
    Transaction,
    TransactionWitnessSet
} from '../custom_modules/@emurgo/cardano-serialization-lib-browser'

import CardanoWallet from '..';

import { validator, validatorAddress, validatorAddressTestnet } from "../on-chain/nftMediaLibPlutus";
import { ProtocolParameters, UTxO } from '../query-api';
import { Asset, MintedAsset, Policy } from '../types';
import TransactionParams from '../types/TransactionParams';

export type CardanoWASM = typeof import('../custom_modules/@emurgo/cardano-serialization-lib-browser');

export const fromHex = (hex) => Buffer.from(hex, "hex");
export const toHex = (bytes) => Buffer.from(bytes).toString("hex");

export class LibraryDatum {
    private lockTokenPolicy : string
    private lockTokenName : string
    private lovelacePrice : BigInt

    constructor({
        lockTokenPolicy,
        lockTokenName,
        lovelacePrice
    } : {
        lockTokenPolicy : string,
        lockTokenName : string,
        lovelacePrice : BigInt
    }){
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
    toPlutusData: (cardano: CardanoWASM) => PlutusData = (cardano: CardanoWASM) => {
        const fieldsInner = cardano.PlutusList.new();
        fieldsInner.add(cardano.PlutusData.new_bytes(fromHex(this.lockTokenPolicy)));
        fieldsInner.add(cardano.PlutusData.new_bytes(fromHex(this.lockTokenName)));

        const libraryInput = cardano.PlutusList.new();
        libraryInput.add(
            cardano.PlutusData.new_constr_plutus_data(
                cardano.ConstrPlutusData.new(
                    cardano.BigNum.zero(),
                    fieldsInner
                )
            )
        )

        libraryInput.add(cardano.PlutusData.new_bytes(Buffer.from(this.lovelacePrice.toString())))

        return cardano.PlutusData.new_constr_plutus_data(
            cardano.ConstrPlutusData.new(
                cardano.BigNum.zero(),
                libraryInput
            )
        )
    }
}

export enum LibraryAction {
    Unlock = 0,
    Use = 1
}

export class LibraryRedeemer {
    private libraryAction: LibraryAction

    constructor(_libraryAction: LibraryAction){
        this.libraryAction = _libraryAction
    }
    // {
    //     \"constructor\":0,
    //     \"fields\":[]
    // }
    toPlutusData = (cardano: CardanoWASM) => {
        return cardano.PlutusData.new_constr_plutus_data(
            cardano.ConstrPlutusData.new(
                cardano.BigNum.from_str(this.libraryAction.toString()),
                cardano.PlutusList.new()
            )
        )
        
    }
    toRedeemer = (cardano: CardanoWASM, index: number = 0) => {
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

export class LibraryValidator {

    private cardano: CardanoWallet

    constructor(cardano: CardanoWallet) {
        this.cardano = cardano
    }

    lock = async (
            protocolParameters: ProtocolParameters,
            asset: Asset,
            adaPrice: number,
            metadata: Object = null
        ) => {
        console.log({
            protocolParameters: protocolParameters,
            asset: asset,
            adaPrice: adaPrice,
            metadata: null
        })
        const localWallet = localStorage.getItem('cardano-web3-wallet')
        console.log(await this.cardano.enable('nami'))
        if(!this.cardano.wallet && localWallet) {
            if(!await this.cardano.enable(localWallet)) return
        } else if (!this.cardano.wallet){
            return
        }
        console.log(this.cardano.wallet)
        const walletAddr = await this.cardano.getAddressHexString()
        console.log(walletAddr)


        if(!walletAddr) return
        
        const policy: Policy = await this.cardano.createLockingPolicyScript(walletAddr, null, protocolParameters)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters
        console.log('policy')
        console.log(policy)
        let utxos = await this.cardano.wallet.getUtxos();
        const lockTokenMint: MintedAsset = {
            assetName: 'CSlock' + asset.unit.split('.')[1],
            quantity: '1',
            policyId: policy.id,
            policyScript: policy.script,
            address: walletAddr
        }

        const txParams: TransactionParams = {
            ProtocolParameters: protocolParameters,
            PaymentAddress: walletAddr,
            recipients: [
            {
                address: validatorAddressTestnet,//'addr_test1qqrsm4vj985epelhc8qpv8jahaqpjll7ed67647dk47ku4x5x8xk48yntkwhc2s20manmqartkchrp2qxgfwdaezsq5qu9urvd',
                amount: '2.5',
                assets:[asset],
                datum: new LibraryDatum({ 
                    lockTokenPolicy: lockTokenMint.policyId,
                    lockTokenName: lockTokenMint.assetName,
                    lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
                }).toPlutusData(this.cardano.lib)
            }
            ,
            {
                address: walletAddr,
                amount: '0',
                mintedAssets: [lockTokenMint]
            }
            ],
            metadata: metadata,
            metadataHash: null,
            addMetadata: true,
            utxosRaw: utxos,
            ttl: 0,
            multiSig: false,
            delegation: null,
            redeemers: [],
            plutusValidators: [],
            plutusPolicies: []
        }

        let tx: Transaction = await this.cardano.transaction(txParams)
        console.log('tx')
        console.log(tx)
        console.log('tx typeof')
        console.log(typeof tx)

        const transactionWitnessSet = TransactionWitnessSet.new();

        const txVkeyWitnessesStr = await this.cardano.wallet.signTx(Buffer.from(tx.to_bytes()).toString("hex"), false);
        const txVkeyWitnessesSer = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesStr, "hex"));
        transactionWitnessSet.set_vkeys(txVkeyWitnessesSer.vkeys());
        const policyScripts = this.cardano.lib.NativeScripts.new()
        policyScripts.add(NativeScript.from_bytes(Buffer.from(policy.script, 'hex')))
        transactionWitnessSet.set_native_scripts(policyScripts)
        const txBody = tx.body()
        let aux = tx.auxiliary_data();
        txBody.set_auxiliary_data_hash(this.cardano.lib.hash_auxiliary_data(aux))
        const signedTx = Transaction.new(
            txBody,
            transactionWitnessSet,
            aux
        );

        const submittedTxHash = await this.cardano.wallet.submitTx(Buffer.from(signedTx.to_bytes()).toString("hex"));
        console.log({submittedTxHash: submittedTxHash})
    }

    unlock = async (
        protocolParameters: ProtocolParameters,
        asset: Asset,
        adaPrice: number,
        validatorUtxo: UTxO,
        metadata: Object = null
    ) => {
        console.log({
            protocolParameters: protocolParameters,
            asset: asset,
            adaPrice: adaPrice,
            metadata: null
        })
        const localWallet = localStorage.getItem('cardano-web3-wallet')
        console.log(await this.cardano.enable('nami'))
        if(!this.cardano.wallet && localWallet) {
            if(!await this.cardano.enable(localWallet)) return
        } else if (!this.cardano.wallet){
            return
        }
        console.log(this.cardano.wallet)
        const walletAddr = await this.cardano.getAddressHexString()
        console.log(walletAddr)


        if(!walletAddr) return

        const policy: Policy = await this.cardano.createLockingPolicyScript(walletAddr, null, protocolParameters)//address: string, expirationTime: Date, protocolParameters: ProtocolParameters
        console.log('policy')
        console.log(policy)
        
        const convertedValidatorUTXO = await this.cardano.utxoFromData(validatorUtxo, validatorAddressTestnet)
        console.log('convertedValidatorUTXO')
        console.log(convertedValidatorUTXO)
        let utxos = (await this.cardano.wallet.getUtxos()).concat(convertedValidatorUTXO);
        
        const lockTokenBurn = {
            assetName: 'CSlock' + asset.unit,
            quantity: '-1',
            policyId: policy.id,
            policyScript: policy.script,
            address: walletAddr
        }
        
        const txParams: TransactionParams = {
            ProtocolParameters: protocolParameters,
            PaymentAddress: walletAddr,
            recipients: [{
                address: walletAddr,
                amount: '0',
                assets: [{quantity: '1', unit: asset.unit }]
                ,
                mintedAssets: [lockTokenBurn]
            }],
            metadata: metadata,
            metadataHash: null,
            addMetadata: true,
            utxosRaw: utxos,
            ttl: 7200,
            multiSig: false,
            delegation: null,
            datums: [
                new LibraryDatum({ 
                    lockTokenPolicy: lockTokenBurn.policyId,
                    lockTokenName: lockTokenBurn.assetName,
                    lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
                }).toPlutusData(this.cardano.lib)
            ],
            redeemers: [new LibraryRedeemer(LibraryAction.Unlock).toRedeemer(this.cardano.lib)],
            plutusValidators: [PlutusScript.new(fromHex(validator))],
            plutusPolicies: []
        }

        let tx: Transaction = await this.cardano.transaction(txParams)
        console.log('tx')
        console.log(tx)
        console.log('tx typeof')
        console.log(typeof tx)

        const transactionWitnessSet = TransactionWitnessSet.new();

        const txVkeyWitnessesStr = await this.cardano.wallet.signTx(Buffer.from(tx.to_bytes()).toString("hex"), false);
        const txVkeyWitnessesSer = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesStr, "hex"));
        transactionWitnessSet.set_vkeys(txVkeyWitnessesSer.vkeys());
        const policyScripts = this.cardano.lib.NativeScripts.new()
        policyScripts.add(NativeScript.from_bytes(Buffer.from(policy.script, 'hex')))
        transactionWitnessSet.set_native_scripts(policyScripts)
        const txBody = tx.body()
        let aux = tx.auxiliary_data();
        txBody.set_auxiliary_data_hash(this.cardano.lib.hash_auxiliary_data(aux))
        const signedTx = Transaction.new(
            txBody,
            transactionWitnessSet,
            aux
        );

        const submittedTxHash = await this.cardano.wallet.submitTx(Buffer.from(signedTx.to_bytes()).toString("hex"));
        console.log({submittedTxHash: submittedTxHash})
    }

    use = () => {

    }
}
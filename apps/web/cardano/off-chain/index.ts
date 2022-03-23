import {
    BigInt,
    PlutusData,
    PlutusScript
} from '@emurgo/cardano-serialization-lib-browser'

import CardanoWallet from '..';

import { validator, validatorAddress } from "../on-chain/nftMediaLibPlutus";
import { ProtocolParameters } from '../query-api';
import { Asset, MintedAsset } from '../types';

export type CardanoWASM = typeof import('@emurgo/cardano-serialization-lib-browser');

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
    Lock = 0,
    Unlock = 1,
    Use = 2
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

    private cardano

    constructor(cardano: CardanoWallet) {
        this.cardano = cardano
    }

    lock = async (
        protocolParameters: ProtocolParameters,
        asset: Asset,
        lockTokenMint: MintedAsset,
        adaPrice: number,
        metadata: Object = null) => {
        const localWallet = localStorage.getItem('cardano-web3-wallet')

        if(!this.cardano.wallet && localWallet) {
            if(!await this.cardano.enable(localWallet)) return
        } else if (!this.cardano.wallet){
            return
        }
        const walletAddr = await this.cardano.wallet.getAddress()

        if(!walletAddr) return
        let utxos = await this.cardano.wallet.getUtxos();
        let tx = this.cardano.transaction({
            ProtocolParameters: protocolParameters,
            PaymentAddress: walletAddr,
            recipients: [{
                address: validatorAddress,
                amount: 0,
                assets:[asset]
            }, {
                address: walletAddr,
                amount: 0,
                mintedAssets: [lockTokenMint]
            }],
            metadata: metadata,
            metadataHash: null,
            addMetadata: true,
            utxosRaw: utxos,
            ttl: 0,
            multiSig: false,
            delegation: null,
            datums: [
                new LibraryDatum({ 
                    lockTokenPolicy: lockTokenMint.policyId,
                    lockTokenName: lockTokenMint.assetName,
                    lovelacePrice: BigInt.from_str((adaPrice * 1000000).toString())
                })
            ],
            redeemers: [new LibraryRedeemer(LibraryAction.Lock).toRedeemer(this.cardano.lib)],
            plutusValidators: PlutusScript.new(fromHex(validator)),
            plutusPolicies: []
        })

        const signature = await this.cardano.wallet.signTx(Buffer.from(tx.to_bytes()).toString('hex'), false)
        if(signature) {
            console.log(
                await this.cardano.wallet.submitTx(signature)
            )
        }
    }

    unlock = () => {

    }

    use = () => {

    }
}
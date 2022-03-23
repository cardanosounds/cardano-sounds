import {
    Address,
    PlutusData
} from '@emurgo/cardano-serialization-lib-browser'

import { validator } from "../on-chain/nftMediaLibPlutus";

export type CardanoWASM = typeof import('@emurgo/cardano-serialization-lib-browser');

export const fromHex = (hex) => Buffer.from(hex, "hex");
export const toHex = (bytes) => Buffer.from(bytes).toString("hex");

export class LibraryDatum {
    private lockTokenPolicy : string
    private lockTokenName : string
    private lovelacePrice : BigInt

    constructor({
        _lockTokenPolicy,
        _lockTokenName,
        _lovelacePrice
    } : {
        _lockTokenPolicy : string,
        _lockTokenName : string,
        _lovelacePrice : BigInt
    }){
        this.lockTokenPolicy = _lockTokenPolicy
        this.lockTokenName = _lockTokenName
        this.lovelacePrice = _lovelacePrice
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


    lock = () => {

    }

    unlock = () => {

    }

    use = () => {

    }
}
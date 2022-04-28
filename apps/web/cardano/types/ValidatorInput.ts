import { PlutusData, Redeemer } from "../custom_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib"

export default interface ValidatorInput {
    utxoHex: string
    datum: PlutusData
    redeemer: Redeemer
}
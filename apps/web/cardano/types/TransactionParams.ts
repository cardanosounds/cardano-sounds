import { PlutusData, PlutusScript, Redeemer, TransactionUnspentOutput } from "../custom_modules/@emurgo/cardano-serialization-lib-browser";
import { ProtocolParameters } from "../query-api";
import Delegation from "./Delegation";
import Recipient from "./Recipient";

export default interface TransactionParams {
    ProtocolParameters: ProtocolParameters,
    PaymentAddress: string,
    recipients: Recipient[],
    metadata: object | null,
    metadataHash: string | null,
    addMetadata: boolean,
    utxosRaw: TransactionUnspentOutput[] | undefined,
    ttl: number,
    multiSig: boolean,
    delegation: Delegation | null,
    datums?: PlutusData[],
    redeemers: Redeemer[],
    plutusValidators: PlutusScript[],
    plutusPolicies: PlutusScript[],
    burn: boolean,
    scriptUtxos: TransactionUnspentOutput[]
}